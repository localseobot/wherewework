import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const workspaces = sqliteTable("workspaces", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  teamId: text("team_id").notNull().unique(),
  teamName: text("team_name").notNull(),
  botToken: text("bot_token").notNull(),
  installedAt: text("installed_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspaces.id),
  slackUserId: text("slack_user_id").notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  locationName: text("location_name"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  timezone: text("timezone"),
  isOnline: integer("is_online", { mode: "boolean" }).default(false),
  lastUpdated: text("last_updated")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type Workspace = typeof workspaces.$inferSelect;
export type Member = typeof members.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type NewMember = typeof members.$inferInsert;
