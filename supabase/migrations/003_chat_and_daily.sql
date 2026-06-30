-- Таблица сообщений чата
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chat messages"
  ON chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can send chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

CREATE INDEX idx_chat_messages_created_at ON chat_messages (created_at DESC);

-- Таблица ежедневных заданий
CREATE TABLE IF NOT EXISTS daily_challenges (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  challenge_id INTEGER NOT NULL,
  challenge_date TEXT NOT NULL,
  points_earned INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(username, challenge_date)
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily challenges"
  ON daily_challenges FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own daily challenges"
  ON daily_challenges FOR INSERT
  WITH CHECK (true);
