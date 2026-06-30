-- Таблица завершённых уроков академии
CREATE TABLE IF NOT EXISTS academy_completions (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(username, lesson_id)
);

ALTER TABLE academy_completions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "ac_select" ON academy_completions;
  DROP POLICY IF EXISTS "ac_insert" ON academy_completions;
  DROP POLICY IF EXISTS "ac_update" ON academy_completions;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "ac_select" ON academy_completions FOR SELECT USING (true);
CREATE POLICY "ac_insert" ON academy_completions FOR INSERT WITH CHECK (true);
CREATE POLICY "ac_update" ON academy_completions FOR UPDATE USING (true);
