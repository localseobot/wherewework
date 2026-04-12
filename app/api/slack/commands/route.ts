import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const command = params.get("command");
  const text = (params.get("text") || "").trim();
  const triggerId = params.get("trigger_id");
  const userId = params.get("user_id");

  if (command !== "/wherewework") {
    return NextResponse.json({ error: "Unknown command" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wherewework-beryl.vercel.app";
  const globeUrl = `${appUrl}/globe`;
  const botToken = process.env.SLACK_BOT_TOKEN;

  // /wherewework set <location> — set your location
  if (text.startsWith("set ")) {
    const location = text.slice(4).trim();
    if (!location) {
      return NextResponse.json({
        response_type: "ephemeral",
        text: "Please provide a location. Example: `/wherewework set London, UK`",
      });
    }

    // Geocode to validate the location
    try {
      const geoUrl = new URL("https://nominatim.openstreetmap.org/search");
      geoUrl.searchParams.set("q", location);
      geoUrl.searchParams.set("format", "json");
      geoUrl.searchParams.set("limit", "1");

      const geoRes = await fetch(geoUrl.toString(), {
        headers: { "User-Agent": "WhereWeWork/1.0" },
      });
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        return NextResponse.json({
          response_type: "ephemeral",
          text: `Couldn't find "${location}" on the map. Try a more specific city name, like "London, UK" or "San Francisco, CA".`,
        });
      }

      const resolvedName = geoData[0].display_name.split(",").slice(0, 2).join(",").trim();

      // Store location in user's Slack profile status text with a marker
      // We use the profile "Location" field if available, otherwise status
      if (botToken) {
        // Try to set the user's profile fields (needs users.profile:write on user token)
        // For now, store in our local cache
        const { storeLocation } = await import("@/lib/locations");
        storeLocation(userId!, location, parseFloat(geoData[0].lat), parseFloat(geoData[0].lon));
      }

      return NextResponse.json({
        response_type: "ephemeral",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `:white_check_mark: Your location has been set to *${resolvedName}*\n\nYou'll appear on the globe at this location. <${globeUrl}|View the Globe>`,
            },
          },
        ],
      });
    } catch {
      return NextResponse.json({
        response_type: "ephemeral",
        text: "Something went wrong setting your location. Please try again.",
      });
    }
  }

  // /wherewework (no args) — open modal to set location or view globe
  if (triggerId && botToken) {
    // Open a modal for setting location
    try {
      await fetch("https://slack.com/api/views.open", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${botToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trigger_id: triggerId,
          view: {
            type: "modal",
            callback_id: "set_location",
            title: { type: "plain_text", text: "WhereWeWork" },
            submit: { type: "plain_text", text: "Set Location" },
            close: { type: "plain_text", text: "Cancel" },
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `:globe_with_meridians: *Set your location on the team globe*\n\nEnter your city and country below, then view the globe to see your team around the world.`,
                },
                accessory: {
                  type: "button",
                  text: { type: "plain_text", text: "View Globe" },
                  url: globeUrl,
                  action_id: "open_globe",
                },
              },
              {
                type: "divider",
              },
              {
                type: "input",
                block_id: "location_block",
                label: { type: "plain_text", text: "Your Location" },
                element: {
                  type: "plain_text_input",
                  action_id: "location_input",
                  placeholder: {
                    type: "plain_text",
                    text: "e.g. London, UK or San Francisco, CA",
                  },
                },
              },
            ],
          },
        }),
      });
    } catch (err) {
      console.error("Error opening modal:", err);
    }
  }

  // Also return a message with a button as fallback
  return NextResponse.json({
    response_type: "ephemeral",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:globe_with_meridians: *WhereWeWork* — See where your team is right now!`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Open Globe" },
            url: globeUrl,
            style: "primary",
            action_id: "open_globe_btn",
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Set My Location" },
            action_id: "set_location_btn",
            value: "set_location",
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "Tip: Use `/wherewework set London, UK` to quickly set your location",
          },
        ],
      },
    ],
  });
}
