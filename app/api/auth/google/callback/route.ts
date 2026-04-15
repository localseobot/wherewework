import { NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/google-calendar";
import crypto from "crypto";

// In-memory token store (will be replaced with Supabase)
// Maps slackUserId -> { accessToken, refreshToken, expiresAt }
const tokenStore = new Map<string, {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}>();

export { tokenStore };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wherewework-beryl.vercel.app";

  if (error) {
    return NextResponse.redirect(`${appUrl}/globe?calendar_error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/globe?calendar_error=missing_params`);
  }

  try {
    // Decode and verify the state parameter
    const stateData = JSON.parse(Buffer.from(state, "base64url").toString());
    const { slackUserId, nonce, hmac } = stateData;

    if (!slackUserId || !nonce || !hmac) {
      return NextResponse.redirect(`${appUrl}/globe?calendar_error=invalid_state`);
    }

    // Verify HMAC to prevent CSRF
    const secret = process.env.SLACK_SIGNING_SECRET || process.env.SLACK_CLIENT_SECRET || "fallback";
    const expectedHmac = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify({ slackUserId, nonce }))
      .digest("hex");

    if (hmac !== expectedHmac) {
      return NextResponse.redirect(`${appUrl}/globe?calendar_error=invalid_state`);
    }

    // Exchange the authorization code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Store the tokens (in-memory for now, Supabase later)
    tokenStore.set(slackUserId, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    });

    return NextResponse.redirect(`${appUrl}/globe?calendar_connected=true`);
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(`${appUrl}/globe?calendar_error=token_exchange_failed`);
  }
}
