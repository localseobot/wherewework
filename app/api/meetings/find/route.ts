import { NextResponse } from "next/server";
import { getFreeBusy, refreshAccessToken } from "@/lib/google-calendar";
import { getGoogleToken, updateGoogleAccessToken } from "@/lib/google-tokens";

export const dynamic = "force-dynamic";

interface FindMeetingRequest {
  slackUserIds: string[];
  date: string; // ISO date like "2026-04-14"
  durationMinutes: number;
}

interface TimeSlot {
  start: string;
  end: string;
  score: number; // Higher = better (more people in working hours)
}

function getUtcOffsetHours(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    if (!tzPart) return 0;
    const match = tzPart.value.match(/GMT([+-]?)(\d+)?(?::(\d+))?/);
    if (!match) return 0;
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2] || "0", 10);
    const minutes = parseInt(match[3] || "0", 10);
    return sign * (hours + minutes / 60);
  } catch {
    return 0;
  }
}

export async function POST(request: Request) {
  // Verify request comes from our app
  const origin = request.headers.get("origin") || request.headers.get("referer") || "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wherewework-beryl.vercel.app";
  const apiKey = process.env.WWW_API_KEY;
  const authHeader = request.headers.get("authorization");

  const isValidOrigin = origin.startsWith(appUrl) || origin.startsWith("http://localhost");
  const isValidApiKey = apiKey && authHeader === `Bearer ${apiKey}`;

  if (!isValidOrigin && !isValidApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: FindMeetingRequest = await request.json();
    const { slackUserIds, date, durationMinutes = 30 } = body;

    if (!slackUserIds?.length || !date) {
      return NextResponse.json(
        { error: "slackUserIds and date are required" },
        { status: 400 }
      );
    }

    const timeMin = `${date}T00:00:00Z`;
    const timeMax = `${date}T23:59:59Z`;

    // Collect calendar busy times for users who have connected Google Calendar
    const busyByUser: Record<string, { start: Date; end: Date }[]> = {};

    for (const userId of slackUserIds) {
      const stored = await getGoogleToken(userId);
      if (!stored) continue;

      // Refresh token if expired
      let accessToken = stored.accessToken;
      if (Date.now() > stored.expiresAt - 60000) {
        try {
          const refreshed = await refreshAccessToken(stored.refreshToken);
          accessToken = refreshed.access_token;
          await updateGoogleAccessToken(
            userId,
            accessToken,
            Date.now() + refreshed.expires_in * 1000
          );
        } catch {
          continue; // Skip if token refresh fails
        }
      }

      try {
        const freebusy = await getFreeBusy(accessToken, ["primary"], timeMin, timeMax);
        const busy = freebusy["primary"] || [];
        busyByUser[userId] = busy.map((b) => ({
          start: new Date(b.start),
          end: new Date(b.end),
        }));
      } catch {
        continue;
      }
    }

    // Fetch member timezones from our members API
    const membersRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "https://wherewework-beryl.vercel.app"}/api/members`
    );
    const allMembers = membersRes.ok ? await membersRes.json() : [];
    const selectedMembers = allMembers.filter((m: { slackUserId: string }) =>
      slackUserIds.includes(m.slackUserId)
    );

    // Find available slots
    // Scan the day in 30-min increments
    const slots: TimeSlot[] = [];
    const durationMs = durationMinutes * 60 * 1000;
    const dayStart = new Date(`${date}T00:00:00Z`);

    for (let m = 0; m < 24 * 60; m += 30) {
      const slotStart = new Date(dayStart.getTime() + m * 60000);
      const slotEnd = new Date(slotStart.getTime() + durationMs);

      // Check if any participant is busy during this slot
      let hasConflict = false;
      for (const userId of slackUserIds) {
        const busy = busyByUser[userId];
        if (!busy) continue;
        for (const b of busy) {
          if (slotStart < b.end && slotEnd > b.start) {
            hasConflict = true;
            break;
          }
        }
        if (hasConflict) break;
      }

      if (hasConflict) continue;

      // Score the slot based on how many participants are in working hours (9am-5pm local)
      let score = 0;
      for (const member of selectedMembers) {
        if (!member.timezone) continue;
        const offset = getUtcOffsetHours(member.timezone);
        const localHour = (slotStart.getUTCHours() + offset + 24) % 24;
        if (localHour >= 9 && localHour < 17) {
          score += 2; // In working hours
        } else if (localHour >= 8 && localHour < 18) {
          score += 1; // Close to working hours
        }
      }

      // Only include slots where at least some people are in working hours
      if (score > 0) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          score,
        });
      }
    }

    // Sort by score descending
    slots.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      date,
      durationMinutes,
      participants: slackUserIds.length,
      calendarConnected: Object.keys(busyByUser).length,
      slots: slots.slice(0, 10), // Top 10 slots
    });
  } catch (error) {
    console.error("Meeting finder error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
