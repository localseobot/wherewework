import { NextResponse } from "next/server";
import { verifySlackRequest } from "@/lib/slack";
import { db } from "@/lib/db";
import { members, workspaces } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { geocode } from "@/lib/geo";

export async function POST(request: Request) {
  const body = await request.text();
  const timestamp = request.headers.get("x-slack-request-timestamp") || "";
  const signature = request.headers.get("x-slack-signature") || "";

  // Verify request is from Slack
  if (process.env.SLACK_SIGNING_SECRET) {
    const isValid = await verifySlackRequest(body, timestamp, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const params = new URLSearchParams(body);
  const payloadStr = params.get("payload");
  if (!payloadStr) {
    return NextResponse.json({ error: "No payload" }, { status: 400 });
  }

  const payload = JSON.parse(payloadStr);

  if (
    payload.type === "view_submission" &&
    payload.view?.callback_id === "set_location"
  ) {
    const userId = payload.user.id;
    const teamId = payload.user.team_id;
    const values = payload.view.state.values;
    const location =
      values?.location_block?.location_input?.value?.trim() || "";

    if (!location) {
      return NextResponse.json({
        response_action: "errors",
        errors: {
          location_block: "Please enter a location",
        },
      });
    }

    const geo = await geocode(location);
    if (!geo) {
      return NextResponse.json({
        response_action: "errors",
        errors: {
          location_block: `Could not find "${location}". Try a city name like "London, UK".`,
        },
      });
    }

    const workspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.teamId, teamId))
      .get();

    if (workspace) {
      await db
        .update(members)
        .set({
          locationName: location,
          latitude: geo.latitude,
          longitude: geo.longitude,
          lastUpdated: new Date().toISOString(),
        })
        .where(
          and(
            eq(members.workspaceId, workspace.id),
            eq(members.slackUserId, userId)
          )
        );
    }

    // Close the modal
    return NextResponse.json({ response_action: "clear" });
  }

  return NextResponse.json({ ok: true });
}
