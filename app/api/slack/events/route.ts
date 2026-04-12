import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const payload = JSON.parse(body);

  // Handle URL verification challenge FIRST — no DB needed
  if (payload.type === "url_verification") {
    return NextResponse.json({ challenge: payload.challenge });
  }

  // For other events, lazy-import DB (avoids native module crash if not available)
  try {
    const { verifySlackRequest } = await import("@/lib/slack");
    const { db } = await import("@/lib/db");
    const { members, workspaces } = await import("@/lib/schema");
    const { eq, and } = await import("drizzle-orm");

    const timestamp = request.headers.get("x-slack-request-timestamp") || "";
    const signature = request.headers.get("x-slack-signature") || "";

    // Verify request is from Slack
    if (process.env.SLACK_SIGNING_SECRET) {
      const isValid = await verifySlackRequest(body, timestamp, signature);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    // Handle events
    if (payload.type === "event_callback") {
      const event = payload.event;
      const teamId = payload.team_id;

      if (event.type === "presence_change" || event.type === "manual_presence_change") {
        const workspace = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.teamId, teamId))
          .get();

        if (workspace) {
          const userId = event.user;
          const isOnline = event.presence === "active";

          await db
            .update(members)
            .set({ isOnline, lastUpdated: new Date().toISOString() })
            .where(
              and(
                eq(members.workspaceId, workspace.id),
                eq(members.slackUserId, userId)
              )
            );
        }
      }

      if (event.type === "team_join") {
        const workspace = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.teamId, teamId))
          .get();

        if (workspace) {
          const user = event.user;
          const profile = user.profile;

          await db.insert(members).values({
            workspaceId: workspace.id,
            slackUserId: user.id,
            displayName:
              profile?.display_name || profile?.real_name || user.name || "New Member",
            avatarUrl: profile?.image_192 || profile?.image_72,
            timezone: user.tz,
            isOnline: false,
            lastUpdated: new Date().toISOString(),
          });
        }
      }
    }
  } catch (error) {
    console.error("Event processing error:", error);
  }

  return NextResponse.json({ ok: true });
}
