import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const MISSIONS = {
  password: { points: 1000, clueId: 1, validation: (data) => {
    const pw = data.password || '';
    return pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw)
      && pw.includes('Minsk') && pw.includes('SocialEngineering')
      && pw.split('').reduce((s, c) => s + (/\d/.test(c) ? parseInt(c) : 0), 0) === 10;
  }},
  phishing: { points: null, clueId: 2, validation: (data) => {
    const correct = { 1:'phishing', 2:'safe', 3:'phishing', 4:'safe', 5:'phishing',
      6:'safe', 7:'phishing', 8:'safe', 9:'phishing', 10:'safe' };
    const answers = data.answers || {};
    let score = 0;
    for (const [id, answer] of Object.entries(answers)) {
      if (correct[id] === answer) score++;
    }
    return { valid: score >= 5, points: score * 100 };
  }},
  firewall: { points: 3000, clueId: 3, validation: (data) => {
    return data.frequency === 74
      && JSON.stringify(data.sequence) === JSON.stringify([2, 7, 13, 8]);
  }},
  database: { points: 2000, clueId: 4, validation: (data) => {
    const queries = data.queries || [];
    return queries.includes('SELECT * FROM users')
      && queries.includes("SELECT access_token FROM users WHERE role= 'admin'");
  }},
  social: { points: null, clueId: 5, validation: (data) => {
    const threatCount = data.threatsFound || 0;
    return { valid: threatCount >= 3, points: threatCount * 500 };
  }},
  crypto: { points: 2000, clueId: 6, validation: (data) => {
    return data.frequency >= 20 && data.frequency <= 24
      && data.shift === 13 && data.sector === 7;
  }},
  metadata: { points: 5000, clueId: 7, validation: (data) => {
    return data.packetsCaptured >= 3
      && Math.abs((data.red || 0) - 10) < 25
      && Math.abs((data.green || 0) - 160) < 25;
  }},
  sniffer: { points: null, clueId: 8, validation: (data) => {
    const attempts = data.attempts || 10;
    return { valid: true, points: Math.max(1000, (10 - attempts + 1) * 500 + 5000) };
  }},
  portal: { points: 7000, clueId: 9, validation: (data) => {
    return data.password === 'LOOP_BREAKER_2024' && (data.evidenceCount || 0) >= 3;
  }},
  final: { points: 10000, clueId: 10, validation: (data) => {
    return data.cipherAnswer === 'SHADOW_WALKER'
      && (data.evidenceCorrect || 0) >= 9
      && (data.timelineComplete || false);
  }}
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }})
  }

  try {
    const { missionId, data, username } = await req.json()

    if (!missionId || !username || !MISSIONS[missionId]) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      })
    }

    const mission = MISSIONS[missionId]
    let result = mission.validation(data)
    let earnedPoints = mission.points

    if (typeof result === 'object' && result !== null) {
      if (!result.valid) {
        return new Response(JSON.stringify({ error: 'Validation failed', points: 0 }), {
          status: 200, headers: { 'Content-Type': 'application/json' }
        })
      }
      earnedPoints = result.points
    } else if (!result) {
      return new Response(JSON.stringify({ error: 'Validation failed', points: 0 }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
    const { data: recentCompletion } = await supabase
      .from('activity_log')
      .select('id')
      .eq('username', username)
      .eq('mission_id', missionId)
      .gte('created_at', oneHourAgo)
      .limit(1)

    if (recentCompletion && recentCompletion.length > 0) {
      return new Response(JSON.stringify({ error: 'Mission recently completed. Wait before retrying.', points: 0 }), {
        status: 429, headers: { 'Content-Type': 'application/json' }
      })
    }

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('points, unlocked_clues, streak, last_login')
      .eq('username', username)
      .single()

    if (fetchError || !profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404, headers: { 'Content-Type': 'application/json' }
      })
    }

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    let currentStreak = profile.streak || 0
    let lastLogin = profile.last_login || ''

    if (lastLogin === today) {
      // Already logged in today, keep streak
    } else if (lastLogin === yesterday) {
      currentStreak += 1
    } else {
      currentStreak = 1
    }

    const streakBonus = Math.min(currentStreak, 7) * 50
    const totalEarned = earnedPoints + streakBonus
    const newPoints = profile.points + totalEarned
    const currentClues = profile.unlocked_clues || []
    const updatedClues = currentClues.includes(mission.clueId)
      ? currentClues
      : [...currentClues, mission.clueId]

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newPoints, unlocked_clues: updatedClues, streak: currentStreak, last_login: today })
      .eq('username', username)

    if (updateError) {
      return new Response(JSON.stringify({ error: 'Update failed' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      })
    }

    await supabase.from('activity_log').insert([{
      username,
      mission_id: missionId,
      mission_name: MISSIONS[missionId].clueId,
      points_earned: totalEarned
    }])

    return new Response(JSON.stringify({
      success: true,
      newPoints,
      earnedPoints: totalEarned,
      basePoints: earnedPoints,
      streakBonus,
      streak: currentStreak,
      clueId: mission.clueId,
      unlockedClues: updatedClues
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
})
