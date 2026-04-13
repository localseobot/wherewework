import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google-calendar";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slackUserId = searchParams.get("slack_user_id") || "unknown";

  // State parameter carries the Slack user ID so we can link the Google account
  const state = Buffer.from(JSON.stringify({ slackUserId })).toString("base64url");
  const authUrl = getGoogleAuthUrl(state);

  return NextResponse.redirect(authUrl);
}
