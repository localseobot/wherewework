// Google Calendar OAuth helpers

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_FREEBUSY_URL = "https://www.googleapis.com/calendar/v3/freeBusy";

export function getGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID || "";
}

export function getGoogleClientSecret() {
  return process.env.GOOGLE_CLIENT_SECRET || "";
}

export function getRedirectUri() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wherewework-beryl.vercel.app";
  return `${appUrl}/api/auth/google/callback`;
}

export function getGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: getGoogleClientId(),
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: "https://www.googleapis.com/auth/calendar.freebusy https://www.googleapis.com/auth/calendar.readonly",
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: getGoogleClientId(),
      client_secret: getGoogleClientSecret(),
      redirect_uri: getRedirectUri(),
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  }>;
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: getGoogleClientId(),
      client_secret: getGoogleClientSecret(),
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh token");
  }

  return res.json() as Promise<{
    access_token: string;
    expires_in: number;
  }>;
}

export interface FreeBusySlot {
  start: string;
  end: string;
}

export async function getFreeBusy(
  accessToken: string,
  calendarIds: string[],
  timeMin: string,
  timeMax: string
): Promise<Record<string, FreeBusySlot[]>> {
  const res = await fetch(GOOGLE_FREEBUSY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: "UTC",
      items: calendarIds.map((id) => ({ id })),
    }),
  });

  if (!res.ok) {
    throw new Error("FreeBusy query failed");
  }

  const data = await res.json();
  const result: Record<string, FreeBusySlot[]> = {};

  for (const [calId, cal] of Object.entries(data.calendars || {})) {
    result[calId] = (cal as { busy: FreeBusySlot[] }).busy || [];
  }

  return result;
}
