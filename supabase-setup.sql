-- Run this in your Supabase SQL Editor (one time only)
-- Go to: supabase.com > Your Project > SQL Editor > New Query

CREATE TABLE app_data (
  id SERIAL PRIMARY KEY,
  pin_hash TEXT NOT NULL UNIQUE,
  data JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access" ON app_data
  FOR ALL
  USING (true)
  WITH CHECK (true);
