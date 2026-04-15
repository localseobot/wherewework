import { supabase } from "./supabase";

interface StoredToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export async function storeGoogleToken(
  slackUserId: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: number
) {
  await supabase.from("google_tokens").upsert(
    {
      slack_user_id: slackUserId,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slack_user_id" }
  );
}

export async function getGoogleToken(slackUserId: string): Promise<StoredToken | null> {
  const { data } = await supabase
    .from("google_tokens")
    .select("access_token, refresh_token, expires_at")
    .eq("slack_user_id", slackUserId)
    .single();

  if (!data) return null;

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
  };
}

export async function updateGoogleAccessToken(
  slackUserId: string,
  accessToken: string,
  expiresAt: number
) {
  await supabase
    .from("google_tokens")
    .update({
      access_token: accessToken,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq("slack_user_id", slackUserId);
}
