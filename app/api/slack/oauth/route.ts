import { NextResponse } from "next/server";
import { upsertWorkspace } from "@/lib/db";
import { syncWorkspaceMembers } from "@/lib/slack";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/?error=slack_denied", request.url));
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/?error=missing_code", request.url)
    );
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/slack/oauth`,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.ok) {
      console.error("Slack OAuth error:", tokenData.error);
      return NextResponse.redirect(
        new URL("/?error=oauth_failed", request.url)
      );
    }

    const teamId = tokenData.team.id;
    const teamName = tokenData.team.name;
    const botToken = tokenData.access_token;

    // Upsert workspace in Supabase
    await upsertWorkspace(teamId, teamName, botToken);

    // Sync members in background
    syncWorkspaceMembers(teamId, botToken).catch(console.error);

    return NextResponse.redirect(
      new URL("/globe?installed=true", request.url)
    );
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/?error=server_error", request.url)
    );
  }
}
