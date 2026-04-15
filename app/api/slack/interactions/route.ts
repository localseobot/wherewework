import { NextResponse } from "next/server";
import { verifySlackSignature } from "@/lib/verify-slack";

export async function POST(request: Request) {
  const body = await request.text();

  // Verify the request is from Slack
  const isValid = await verifySlackSignature(body, request.headers);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const params = new URLSearchParams(body);
  const payloadStr = params.get("payload");

  if (!payloadStr) {
    return NextResponse.json({ ok: true });
  }

  let payload;
  try {
    payload = JSON.parse(payloadStr);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const botToken = process.env.SLACK_BOT_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wherewework-beryl.vercel.app";
  const globeUrl = `${appUrl}/globe`;

  // Handle modal submission (set_location)
  if (payload.type === "view_submission" && payload.view?.callback_id === "set_location") {
    const location =
      payload.view.state.values?.location_block?.location_input?.value || "";
    const userId = payload.user?.id;

    if (!location.trim()) {
      return NextResponse.json({
        response_action: "errors",
        errors: { location_block: "Please enter a location" },
      });
    }

    // Geocode the location
    try {
      const geoUrl = new URL("https://nominatim.openstreetmap.org/search");
      geoUrl.searchParams.set("q", location.trim());
      geoUrl.searchParams.set("format", "json");
      geoUrl.searchParams.set("limit", "1");

      const geoRes = await fetch(geoUrl.toString(), {
        headers: { "User-Agent": "WhereWeWork/1.0" },
      });
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        return NextResponse.json({
          response_action: "errors",
          errors: {
            location_block:
              "Couldn't find that location. Try a more specific city name.",
          },
        });
      }

      const { storeLocation } = await import("@/lib/locations");
      storeLocation(
        userId,
        location.trim(),
        parseFloat(geoData[0].lat),
        parseFloat(geoData[0].lon)
      );

      const resolvedName = geoData[0].display_name
        .split(",")
        .slice(0, 2)
        .join(",")
        .trim();

      // Send a DM confirmation
      if (botToken) {
        try {
          await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${botToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              channel: userId,
              text: `Your location has been set to ${resolvedName}`,
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `:white_check_mark: Your location is now set to *${resolvedName}*`,
                  },
                },
                {
                  type: "actions",
                  elements: [
                    {
                      type: "button",
                      text: { type: "plain_text", text: "View Globe" },
                      url: globeUrl,
                      style: "primary",
                      action_id: "view_globe_after_set",
                    },
                  ],
                },
              ],
            }),
          });
        } catch {
          // DM send failure is non-critical
        }
      }
    } catch {
      return NextResponse.json({
        response_action: "errors",
        errors: {
          location_block: "Something went wrong. Please try again.",
        },
      });
    }

    // Close the modal
    return NextResponse.json({ response_action: "clear" });
  }

  // Handle "Set My Location" button click — open the modal
  if (payload.type === "block_actions") {
    for (const action of payload.actions || []) {
      if (action.action_id === "set_location_btn" && payload.trigger_id && botToken) {
        try {
          await fetch("https://slack.com/api/views.open", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${botToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              trigger_id: payload.trigger_id,
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
                      text: `:globe_with_meridians: *Set your location on the team globe*\n\nEnter your city and country below.`,
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
    }
  }

  return NextResponse.json({ ok: true });
}
