-- Hambalyo (Digital Wedding Message Wall) Supabase Schema
-- Paste this script into your Supabase SQL Editor to configure the project.

-- 1. Create the messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name VARCHAR(100) NOT NULL,
  relationship VARCHAR(30) NOT NULL CHECK (relationship IN ('waalid', 'walaal', 'saaxib', 'ehel', 'macallin', 'jaar')),
  message_text TEXT NOT NULL CHECK (char_length(message_text) <= 300),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all messages
CREATE POLICY "Allow public select" ON messages 
  FOR SELECT USING (true);

-- Allow public guest write access to submit new messages
CREATE POLICY "Allow public insert" ON messages 
  FOR INSERT WITH CHECK (true);

-- Allow updates (approval toggles)
CREATE POLICY "Allow public update" ON messages 
  FOR UPDATE USING (true);

-- Allow deletes (moderation)
CREATE POLICY "Allow public delete" ON messages 
  FOR DELETE USING (true);

-- 3. Enable Realtime replication for the messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
