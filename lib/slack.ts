import { WebClient } from "@slack/web-api";
import { supabase } from "./supabase";
import { geocode, coordsFromTimezone } from "./geo";
import crypto from "crypto";

export function getSlackClient(token: string) {
  return new WebClient(token);
}

export async function verifySlackRequest(
  body: string,
  timestamp: string,
  signature: string
): Promise<boolean> {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) return false;

  // Check timestamp is within 5 minutes
  const time = Math.floor(Date.now() / 1000);
  if (Math.abs(time - parseInt(timestamp)) > 300) return false;

  const sigBasestring = `v0:${timestamp}:${body}`;
  const mySignature =
    "v0=" +
    crypto
      .createHmac("sha256", signingSecret)
      .update(sigBasestring, "utf8")
      .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(mySignature, "utf8"),
    Buffer.from(signature, "utf8")
  );
}

export async function syncWorkspaceMembers(
  teamId: string,
  botToken: string
): Promise<void> {
  const client = getSlackClient(botToken);

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id")
    .eq("team_id", teamId)
    .single();

  if (!workspace) return;

  try {
    const result = await client.users.list({});
    const slackMembers = result.members || [];

    for (const member of slackMembers) {
      if (member.is_bot || member.id === "USLACKBOT" || member.deleted)
        continue;

      const profile = member.profile;
      const displayName =
        profile?.display_name || profile?.real_name || member.name || "Unknown";
      const avatarUrl = profile?.image_192 || profile?.image_72;
      const tz = member.tz;

      // Try to get location from profile fields
      let locationName: string | null = null;
      let latitude: number | null = null;
      let longitude: number | null = null;

      // Check custom profile fields for location
      const fields = profile?.fields;
      if (fields) {
        for (const field of Object.values(fields)) {
          const f = field as { label?: string; value?: string };
          if (
            f.label?.toLowerCase().includes("location") &&
            f.value
          ) {
            locationName = f.value;
            const geo = await geocode(f.value);
            if (geo) {
              latitude = geo.latitude;
              longitude = geo.longitude;
            }
            break;
          }
        }
      }

      // Fallback to timezone-based coordinates
      if (!latitude && tz) {
        const tzCoords = coordsFromTimezone(tz);
        if (tzCoords) {
          latitude = tzCoords.latitude;
          longitude = tzCoords.longitude;
          locationName = locationName || tz.replace(/_/g, " ").split("/").pop() || null;
        }
      }

      // Note: Member data is fetched live from Slack API in the members endpoint.
      // This sync is kept for workspace installation but doesn't store to a members table.
      // Location data set via /wherewework is stored in the user_locations table.
    }
  } catch (error) {
    console.error("Error syncing workspace members:", error);
  }
}
