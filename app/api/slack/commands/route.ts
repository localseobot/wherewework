import { NextResponse } from "next/server";
import { verifySlackRequest, getSlackClient } from "@/lib/slack";
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
  const command = params.get("command");
  const text = params.get("text")?.trim() || "";
  const userId = params.get("user_id")!;
  const teamId = params.get("team_id")!;
  const triggerId = params.get("trigger_id")!;

  if (command !== "/wherewework") {
    return NextResponse.json({ error: "Unknown command" }, { status: 400 });
  }

  const workspace = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.teamId, teamId))
    .get();

  if (!workspace) {
    return NextResponse.json({
      response_type: "ephemeral",
      text: "WhereWeWork is not installed in this workspace. Please install it first.",
    });
  }

  // Quick set: /wherewework set London, UK
  if (text.startsWith("set ")) {
    const location = text.slice(4).trim();
    if (!location) {
      return NextResponse.json({
        response_type: "ephemeral",
        text: "Please provide a location. Example: `/wherewework set London, UK`",
      });
    }

    const geo = await geocode(location);
    if (!geo) {
      return NextResponse.json({
        response_type: "ephemeral",
        text: `Could not find location "${location}". Try a city name like "San Francisco, CA".`,
      });
    }

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      response_type: "ephemeral",
      text: `Your location has been set to *${location}*! View your team on the globe: ${appUrl}/globe`,
    });
  }

  // Open modal for location setting
  const client = getSlackClient(workspace.botToken);

  try {
    await client.views.open({
      trigger_id: triggerId,
      view: {
        type: "modal",
        callback_id: "set_location",
        title: { type: "plain_text", text: "Set Your Location" },
        submit: { type: "plain_text", text: "Save" },
        blocks: [
          {
            type: "input",
            block_id: "location_block",
            label: { type: "plain_text", text: "Your City / Location" },
            element: {
              type: "plain_text_input",
              action_id: "location_input",
              placeholder: {
                type: "plain_text",
                text: "e.g., San Francisco, CA",
              },
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: "Or use `/wherewework set <city>` for a quick update.",
              },
            ],
          },
        ],
      },
    });
  } catch (err) {
    console.error("Error opening modal:", err);
  }

  // Acknowledge the slash command
  return new Response("", { status: 200 });
}
