import { NextResponse } from "next/server";

export async function POST() {
  // Acknowledge any interaction
  return NextResponse.json({ ok: true });
}
