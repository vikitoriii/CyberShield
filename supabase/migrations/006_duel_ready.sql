-- Добавляем колонки для ready-системы
DO $$ BEGIN
  ALTER TABLE agent_duels ADD COLUMN IF NOT EXISTS challenger_ready BOOLEAN DEFAULT false;
  ALTER TABLE agent_duels ADD COLUMN IF NOT EXISTS challenged_ready BOOLEAN DEFAULT false;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
