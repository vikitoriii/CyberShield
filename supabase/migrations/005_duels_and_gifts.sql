-- Ежедневные подарки друзьям
CREATE TABLE IF NOT EXISTS agent_gifts (
  id BIGSERIAL PRIMARY KEY,
  sender TEXT NOT NULL,
  receiver TEXT NOT NULL,
  gift_type TEXT NOT NULL DEFAULT 'xp',
  amount INTEGER NOT NULL DEFAULT 100,
  message TEXT DEFAULT '',
  opened BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  gift_date TEXT NOT NULL
);

ALTER TABLE agent_gifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gifts_select" ON agent_gifts FOR SELECT USING (true);
CREATE POLICY "gifts_insert" ON agent_gifts FOR INSERT WITH CHECK (true);
CREATE POLICY "gifts_update" ON agent_gifts FOR UPDATE USING (true);

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE agent_gifts;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Дуэли между агентами
CREATE TABLE IF NOT EXISTS agent_duels (
  id BIGSERIAL PRIMARY KEY,
  challenger TEXT NOT NULL,
  challenged TEXT NOT NULL,
  game_type TEXT NOT NULL,
  challenger_score INTEGER DEFAULT 0,
  challenged_score INTEGER DEFAULT 0,
  challenger_data JSONB DEFAULT '{}',
  challenged_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'waiting',
  winner TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

ALTER TABLE agent_duels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "duels_select" ON agent_duels FOR SELECT USING (true);
CREATE POLICY "duels_insert" ON agent_duels FOR INSERT WITH CHECK (true);
CREATE POLICY "duels_update" ON agent_duels FOR UPDATE USING (true);

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE agent_duels;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_gifts_receiver ON agent_gifts (receiver, opened, gift_date);
CREATE INDEX IF NOT EXISTS idx_duels_status ON agent_duels (status);
