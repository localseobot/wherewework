import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  // Only allow in development or with the correct secret
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const expectedSecret = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-8);

  if (secret !== expectedSecret && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { table: string; status: string; error?: string }[] = [];

  // Create workspaces table
  const { error: e1 } = await supabase.rpc("exec_sql", {
    sql: `CREATE TABLE IF NOT EXISTS workspaces (
      id BIGSERIAL PRIMARY KEY,
      team_id TEXT NOT NULL UNIQUE,
      team_name TEXT NOT NULL,
      bot_token TEXT NOT NULL,
      installed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
  });

  // If rpc doesn't work, try creating via direct insert (tables must exist)
  // Fall back to testing if tables exist
  if (e1) {
    results.push({ table: "workspaces", status: "rpc_failed", error: e1.message });
  } else {
    results.push({ table: "workspaces", status: "ok" });
  }

  // Test each table
  for (const table of ["workspaces", "user_locations", "google_tokens", "geo_cache"]) {
    const { error } = await supabase.from(table).select("*").limit(1);
    results.push({
      table,
      status: error ? "missing" : "exists",
      error: error?.message,
    });
  }

  return NextResponse.json({
    message: "Run the SQL in supabase/migration.sql in your Supabase dashboard SQL editor to create tables.",
    tables: results,
  });
}
