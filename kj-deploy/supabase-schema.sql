-- KJ Protocol Tracker — Supabase Schema
-- Run this in your Supabase project's SQL Editor (one time)

-- Key-value store for all app data
CREATE TABLE IF NOT EXISTS kv_store (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster prefix lookups (archive, day data)
CREATE INDEX IF NOT EXISTS idx_kv_key ON kv_store (key);

-- Enable Row Level Security (table is protected by default)
ALTER TABLE kv_store ENABLE ROW LEVEL SECURITY;

-- Since this is a single-user private app, allow all operations via anon key
-- The app URL + anon key are your access control
CREATE POLICY "Allow all operations" ON kv_store
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant access to the anon role
GRANT ALL ON kv_store TO anon;
