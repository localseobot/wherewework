import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";

const dbPath = path.join(process.cwd(), "wherewework.db");
const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrent performance
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS workspaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id TEXT NOT NULL UNIQUE,
    team_name TEXT NOT NULL,
    bot_token TEXT NOT NULL,
    installed_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
    slack_user_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    location_name TEXT,
    latitude REAL,
    longitude REAL,
    timezone TEXT,
    is_online INTEGER DEFAULT 0,
    last_updated TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_members_workspace_user
    ON members(workspace_id, slack_user_id);
`);
