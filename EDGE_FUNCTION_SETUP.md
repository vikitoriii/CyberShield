# CyberShield - Supabase Edge Functions & Realtime Setup

## 1. Database Migration (activity_log + streak)

### Steps:
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase/migrations/001_activity_log.sql`
3. Click "Run" to execute
4. Then copy and paste `supabase/migrations/002_add_streak.sql`
5. Click "Run" to execute

This creates:
- `activity_log` table for tracking mission completions
- `streak` and `last_login` columns for daily bonus system
- Row Level Security policies
- Realtime publication
- Indexes for performance

## 2. Edge Function Deployment

### Prerequisites:
- Install Supabase CLI: `npm install -g supabase`
- Login: `supabase login`

### Deploy:
```bash
# Initialize Supabase in your project (if not done)
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the Edge Function
supabase functions deploy validate-mission
```

### Set Environment Variables (if needed):
```bash
supabase secrets set MY_SECRET_KEY=your_secret_value
```

## 3. Enable Realtime

1. Go to Supabase Dashboard → Database → Replication
2. Find `activity_log` table
3. Toggle "Enable Realtime" to ON

## 4. Client Integration

The following files have been updated:

### `src/App.js`
- Added `LiveFeed` component import
- Updated `saveProgress` function to call Edge Function first
- Added fallback for when Edge Function is unavailable
- Integrated LiveFeed on desktop view

### `src/LiveFeed.js` (NEW)
- Real-time activity feed component
- Shows mission completions from all agents
- WebSocket connection via Supabase Realtime
- Animated notifications with Framer Motion

### `src/App.css`
- Added LiveFeed styling

## 5. How It Works

### Anti-Cheat Flow:
1. Player completes mission → calls `saveProgress()`
2. Client sends mission data to Edge Function
3. Edge Function validates answers on server
4. If valid → updates profile points & clues
5. If invalid → returns error, no points awarded

### Realtime Flow:
1. Edge Function inserts into `activity_log` after successful validation
2. Supabase Realtime broadcasts INSERT event
3. All connected clients receive the event
4. LiveFeed component updates with new activity

## 6. Testing

### Test Edge Function locally:
```bash
supabase functions serve validate-mission
```

### Test from client:
```javascript
const { data, error } = await supabase.functions.invoke('validate-mission', {
  body: {
    missionId: 'password',
    data: { password: 'Test123ParisSocialEngineering' },
    username: 'test_agent'
  }
});
console.log(data);
```

## 7. Troubleshooting

### Edge Function not working?
- Check function is deployed: `supabase functions list`
- Check logs: `supabase functions logs validate-mission`
- Verify CORS headers in function response

### Realtime not updating?
- Verify Realtime is enabled in Dashboard
- Check table is in publication
- Look for WebSocket errors in browser console

### Points not saving?
- Check Edge Function response in Network tab
- Verify Supabase URL and anon key in `.env`
- Check RLS policies on `profiles` table
