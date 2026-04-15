import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google-calendar";
import crypto from "crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slackUserId = searchParams.get("slack_user_id") || "unknown";

  // Include a nonce and HMAC for CSRF protection
  const nonce = crypto.randomBytes(16).toString("hex");
  const secret = process.env.SLACK_SIGNING_SECRET || process.env.SLACK_CLIENT_SECRET || "fallback";
  const payload = JSON.stringify({ slackUserId, nonce });
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  const state = Buffer.from(JSON.stringify({ slackUserId, nonce, hmac })).toString("base64url");
  const authUrl = getGoogleAuthUrl(state);

  return NextResponse.redirect(authUrl);
}
