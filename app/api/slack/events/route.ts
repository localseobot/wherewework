import { NextResponse } from "next/server";
import { verifySlackSignature } from "@/lib/verify-slack";
import { supabase } from "@/lib/supabase";

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

  // Handle events
  try {
    if (payload.type === "event_callback") {
      const event = payload.event;
      const teamId = payload.team_id;

      // Look up workspace
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("id")
        .eq("team_id", teamId)
        .single();

      if (!workspace) {
        return NextResponse.json({ ok: true });
      }

      if (event.type === "presence_change" || event.type === "manual_presence_change") {
        // Note: presence updates would need a members table in Supabase
        // For now, presence is fetched live from Slack in the members API
      }

      if (event.type === "team_join") {
        // New members are fetched live from Slack in the members API
        // No need to store them separately
      }
    }
  } catch (error) {
    console.error("Event processing error:", error);
  }

  return NextResponse.json({ ok: true });
}
