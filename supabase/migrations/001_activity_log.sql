-- Таблица логов активности для Realtime
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  mission_id TEXT NOT NULL,
  mission_name INTEGER NOT NULL,
  points_earned INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включаем Row Level Security
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Все могут читать логи активности
CREATE POLICY "Anyone can read activity logs"
  ON activity_log FOR SELECT
  USING (true);

-- Только аутентифицированные пользователи могут писать
CREATE POLICY "Authenticated users can insert activity logs"
  ON activity_log FOR INSERT
  WITH CHECK (true);

-- Включаем Realtime для таблицы
ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;

-- Индекс для быстрого поиска по времени
CREATE INDEX idx_activity_log_created_at ON activity_log (created_at DESC);

-- Функция для получения последних логов
CREATE OR REPLACE FUNCTION get_recent_activity(limit_count INTEGER DEFAULT 10)
RETURNS SETOF activity_log AS $$
  SELECT * FROM activity_log
  ORDER BY created_at DESC
  LIMIT limit_count;
$$ LANGUAGE sql SECURITY DEFINER;
