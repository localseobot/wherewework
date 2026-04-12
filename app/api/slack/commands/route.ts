import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const command = params.get("command");

  if (command !== "/wherewework") {
    return NextResponse.json({ error: "Unknown command" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://wherewework-beryl.vercel.app";
  const globeUrl = `${appUrl}/globe`;

  return NextResponse.json({
    response_type: "in_channel",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:globe_with_meridians: *WhereWeWork* — See where your team is working right now!\n\n:point_right: <${globeUrl}|Open the Globe>`,
        },
      },
    ],
  });
}
