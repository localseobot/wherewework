import { NextResponse } from "next/server";
import { verifySlackSignature } from "@/lib/verify-slack";

export async function POST(request: Request) {
  const body = await request.text();

  // Verify signature on ALL requests, including url_verification
  const isValid = await verifySlackSignature(body, request.headers);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Handle URL verification challenge
  if (payload.type === "url_verification") {
    return NextResponse.json({ challenge: payload.challenge });
  }

  // For other events, lazy-import DB (avoids native module crash if not available)
  try {
    const { db } = await import("@/lib/db");
    const { members, workspaces } = await import("@/lib/schema");
    const { eq, and } = await import("drizzle-orm");

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
