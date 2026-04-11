import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { members, workspaces } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // For MVP, return all members across all workspaces
    // In production, this would be scoped by authenticated workspace
    const allMembers = await db.select().from(members);

    return NextResponse.json(allMembers);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json([], { status: 500 });
  }
}
