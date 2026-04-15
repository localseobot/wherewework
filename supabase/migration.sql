-- WhereWeWork Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Workspaces table (Slack workspace installations)
CREATE TABLE IF NOT EXISTS workspaces (
  id BIGSERIAL PRIMARY KEY,
  team_id TEXT NOT NULL UNIQUE,
  team_name TEXT NOT NULL,
  bot_token TEXT NOT NULL,
  installed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. User locations (set via /wherewework set <city>)
CREATE TABLE IF NOT EXISTS user_locations (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Google Calendar tokens
CREATE TABLE IF NOT EXISTS google_tokens (
  id BIGSERIAL PRIMARY KEY,
  slack_user_id TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Geocoding cache
CREATE TABLE IF NOT EXISTS geo_cache (
  id BIGSERIAL PRIMARY KEY,
  query TEXT NOT NULL UNIQUE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_google_tokens_slack_user_id ON google_tokens(slack_user_id);
CREATE INDEX IF NOT EXISTS idx_geo_cache_query ON geo_cache(query);
