-- Добавляем поле пароля и email в профили
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT 'Новый агент';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Уникальный индекс для username
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username ON profiles (username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email) WHERE email != '';
