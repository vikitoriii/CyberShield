-- Удаляем старые политики если есть
DO $$ BEGIN
  DROP POLICY IF EXISTS "All" ON friends;
  DROP POLICY IF EXISTS "All" ON private_messages;
  DROP POLICY IF EXISTS "All" ON friend_challenges;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Таблица друзей
CREATE TABLE IF NOT EXISTS friends (
  id BIGSERIAL PRIMARY KEY,
  user_a TEXT NOT NULL,
  user_b TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_a, user_b)
);

ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "friends_select" ON friends;
  DROP POLICY IF EXISTS "friends_insert" ON friends;
  DROP POLICY IF EXISTS "friends_update" ON friends;
  DROP POLICY IF EXISTS "friends_delete" ON friends;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "friends_select" ON friends FOR SELECT USING (true);
CREATE POLICY "friends_insert" ON friends FOR INSERT WITH CHECK (true);
CREATE POLICY "friends_update" ON friends FOR UPDATE USING (true);
CREATE POLICY "friends_delete" ON friends FOR DELETE USING (true);

-- Таблица приватных сообщений
CREATE TABLE IF NOT EXISTS private_messages (
  id BIGSERIAL PRIMARY KEY,
  sender TEXT NOT NULL,
  receiver TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "pm_select" ON private_messages;
  DROP POLICY IF EXISTS "pm_insert" ON private_messages;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "pm_select" ON private_messages FOR SELECT USING (true);
CREATE POLICY "pm_insert" ON private_messages FOR INSERT WITH CHECK (true);

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE private_messages;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Таблица вызовов друзьям
CREATE TABLE IF NOT EXISTS friend_challenges (
  id BIGSERIAL PRIMARY KEY,
  challenger TEXT NOT NULL,
  challenged TEXT NOT NULL,
  mission_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  challenger_score INTEGER DEFAULT 0,
  challenged_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE friend_challenges ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "fc_select" ON friend_challenges;
  DROP POLICY IF EXISTS "fc_insert" ON friend_challenges;
  DROP POLICY IF EXISTS "fc_update" ON friend_challenges;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "fc_select" ON friend_challenges FOR SELECT USING (true);
CREATE POLICY "fc_insert" ON friend_challenges FOR INSERT WITH CHECK (true);
CREATE POLICY "fc_update" ON friend_challenges FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_friends_user_a ON friends (user_a);
CREATE INDEX IF NOT EXISTS idx_friends_user_b ON friends (user_b);
CREATE INDEX IF NOT EXISTS idx_pm_receiver ON private_messages (receiver, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pm_chat ON private_messages (sender, receiver, created_at);
