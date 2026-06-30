-- Добавляем колонку game_type если её нет
DO $$ BEGIN
  ALTER TABLE friend_challenges ADD COLUMN IF NOT EXISTS game_type TEXT DEFAULT 'pending';
  ALTER TABLE friend_challenges ADD COLUMN IF NOT EXISTS challenger_ready BOOLEAN DEFAULT false;
  ALTER TABLE friend_challenges ADD COLUMN IF NOT EXISTS challenged_ready BOOLEAN DEFAULT false;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Убеждаемся что Realtime включен
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE friend_challenges;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
