# CYBER-SHIELD

**Операционная система кибербезопасности** — обучающая интерактивная платформа.

## Описание

CYBER-SHIELD — это симуляция операционной системы для расследования киберпреступлений. Пользователь выступает в роли агента, который должен проникнуть в корпоративную сеть Neocorp и раскрыть заговор.

## Возможности

- **10 миссий** с уникальными головоломками
- **Система рангов** (Стажёр → Аналитик → Детектив → Легенда)
- **Дуэли 1v1** — три типа мини-игр с друзьями
- **Приватный чат** между агентами
- **Система друзей** — добавление, общение, вызовы
- **Ежедневные задания** с бонусами
- **Академия** — 9 интерактивных уроков по кибербезопасности
- **Доска улик** — сюжетная лента с элементами расследования
- **Рейтинг** агентов
- **Терминал** с командами
- **Live Activity Feed** — уведомления в реальном времени
- **Celebration Effects** — анимации при завершении миссий

## Технологии

- **React** — клиентская часть
- **Supabase** — серверная часть (БД + Auth + Realtime + Edge Functions)
- **Framer Motion** — анимации
- **Lucide React** — иконки
- **CSS** — стилизация (адаптивный дизайн)
- **Bootstrap** + **jQuery** — дополнительные компоненты

## Структура проекта

```
src/
├── App.js              — главный компонент
├── App.css             — стили
├── supabaseClient.js   — подключение к Supabase
│
├── Миссии/
│   ├── PasswordMission.js    — Стойкость пароля
│   ├── PhishingMission.js    — Детектор фишинга
│   ├── FirewallMission.js    — Сетевой экран
│   ├── DatabaseMission.js    — База данных
│   ├── SocialMission.js      — Соц. инженерия
│   ├── CryptoMission.js      — Криптография
│   ├── MetadataMission.js    — Цифровой след
│   ├── SnifferMission.js     — Взлом сейфа
│   ├── PortalMission.js      — Скрытый портал
│   └── FinalMission.js       — Финальная операция
│
├── Компоненты/
│   ├── Academy.js            — Интерактивные уроки
│   ├── AgentDuel.js          — Система дуэлей
│   ├── FriendsSystem.js      — Друзья и чат
│   ├── Leaderboard.js        — Рейтинг
│   ├── CaseFiles.js          — Доска улик
│   ├── LiveFeed.js           — Лента активности
│   ├── DailyChallenge.js     — Ежедневные задания
│   ├── ProfileStats.js       — Статистика профиля
│   ├── AchievementToast.js   — Уведомления достижений
│   ├── Celebration.js        — Анимация победы
│   ├── GlitchLogo.js         — Глитч-эффект логотипа
│   ├── ParticleBackground.js — Фоновые частицы
│   └── LoginParticles.js     — Частицы на экране входа
│
└── Supabase/
    └── functions/
        └── validate-mission/
            └── index.ts      — серверная валидация миссий
```

## Установка

```bash
# Клонирование
git clone https://github.com/username/cybershield.git
cd cybershield

# Установка зависимостей
npm install

# Настройка переменных окружения
# Создайте .env файл:
REACT_APP_SUPABASE_URL=ваш_url
REACT_APP_SUPABASE_ANON_KEY=ваш_ключ

# Запуск
npm start
```

## Деплой Supabase Edge Functions

```bash
# Установка Supabase CLI
npm install -g supabase

# Авторизация
supabase login

# Привязка проекта
supabase link --project-ref ваш_project_ref

# Деплой функции
supabase functions deploy validate-mission
```

## Хостинг

Бесплатные варианты:
- **Vercel** — подключение к GitHub, автоматический деплой
- **Netlify** — аналогично Vercel
- **GitHub Pages** — через `npm run build`

## Лицензия

MIT License
