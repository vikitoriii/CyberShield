-- Гарантируем наличие всех колонок
DO $$ BEGIN
  ALTER TABLE friend_challenges ADD COLUMN IF NOT EXISTS game_type TEXT DEFAULT 'pending';
  ALTER TABLE friend_challenges ADD COLUMN IF NOT EXISTS challenger_ready BOOLEAN DEFAULT false;
  ALTER TABLE friend_challenges ADD COLUMN IF NOT EXISTS challenged_ready BOOLEAN DEFAULT false;
  ALTER TABLE friend_challenges ADD COLUMN IF NOT EXISTS challenger_score INTEGER DEFAULT 0;
  ALTER TABLE friend_challenges ADD COLUMN IF NOT EXISTS challenged_score INTEGER DEFAULT 0;
  ALTER TABLE friend_challenges ADD COLUMN IF NOT EXISTS winner TEXT;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Включаем Realtime
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE friend_challenges;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Сбрасываем старые застрявшие дуэли
UPDATE friend_challenges SET 
  challenger_ready = false, 
  challenged_ready = false, 
  challenger_score = 0, 
  challenged_score = 0 
WHERE status IN ('pending', 'active') AND mission_id = 'duel';
