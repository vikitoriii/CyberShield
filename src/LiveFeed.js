import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Activity, Zap, Star, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MISSION_NAMES = {
  1: 'СТОЙКОСТЬ ПАРОЛЯ',
  2: 'ДЕТЕКТОР ФИШИНГА',
  3: 'СЕТЕВОЙ ЭКРАН',
  4: 'БАЗА ДАННЫХ',
  5: 'СОЦ. ИНЖЕНЕРИЯ',
  6: 'КРИПТОГРАФИЯ',
  7: 'ЦИФРОВОЙ СЛЕД',
  8: 'ВЗЛОМ СЕЙФА',
  9: 'СКРЫТЫЙ ПОРТАЛ',
  10: 'ФИНАЛЬНАЯ ОПЕРАЦИЯ'
};

const MISSION_COLORS = {
  1: '#00ff41', 2: '#f7b500', 3: '#00ff41', 4: '#4d94ff',
  5: '#00ff41', 6: '#f7b500', 7: '#00ff41', 8: '#ff4d4d',
  9: '#4d94ff', 10: '#ff4d4d'
};

export default function LiveFeed({ username }) {
  const [activities, setActivities] = useState([]);
  const [connected, setConnected] = useState(false);
  const [friends, setFriends] = useState([]);
  const [mode, setMode] = useState('friends');

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data } = await supabase
          .from('friends')
          .select('user_a, user_b')
          .or(`user_a.eq.${username},user_b.eq.${username}`)
          .eq('status', 'accepted');

        if (data) {
          const friendNames = data.map(f => f.user_a === username ? f.user_b : f.user_a);
          setFriends(friendNames);
        }
      } catch (e) {
        console.warn('Failed to load friends');
      }
    };

    fetchFriends();
  }, [username]);

  useEffect(() => {
    const allowedUsers = mode === 'friends' ? [username, ...friends] : null;

    const fetchInitial = async () => {
      let query = supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (allowedUsers && allowedUsers.length > 0) {
        query = query.in('username', allowedUsers);
      }

      const { data } = await query;
      if (data) setActivities(data);
    };

    fetchInitial();

    const channel = supabase
      .channel('activity-feed')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_log' },
        (payload) => {
          const act = payload.new;
          if (allowedUsers && !allowedUsers.includes(act.username)) return;
          setActivities(prev => [act, ...prev].slice(0, 30));
        }
      )
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [username, friends, mode]);

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="live-feed">
      <div className="live-feed-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="#00ff41" />
          <span style={{ fontWeight: 'bold', color: '#00ff41', fontSize: '12px', letterSpacing: '2px' }}>
            АКТИВНОСТЬ
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: connected ? '#00ff41' : '#ff4d4d',
            boxShadow: connected ? '0 0 8px #00ff41' : '0 0 8px #ff4d4d',
            animation: connected ? 'pulse 2s infinite' : 'none'
          }} />
          <span style={{ fontSize: '10px', color: connected ? '#00ff41' : '#ff4d4d' }}>
            {connected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a' }}>
        <button
          onClick={() => setMode('friends')}
          style={{
            flex: 1, padding: '8px', background: mode === 'friends' ? 'rgba(0,255,65,0.08)' : 'none',
            border: 'none', borderBottom: mode === 'friends' ? '2px solid #00ff41' : '2px solid transparent',
            color: mode === 'friends' ? '#00ff41' : '#666', fontSize: '10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', letterSpacing: '1px'
          }}
        >
          <Users size={12} /> ДРУЗЬЯ
        </button>
        <button
          onClick={() => setMode('all')}
          style={{
            flex: 1, padding: '8px', background: mode === 'all' ? 'rgba(0,255,65,0.08)' : 'none',
            border: 'none', borderBottom: mode === 'all' ? '2px solid #00ff41' : '2px solid transparent',
            color: mode === 'all' ? '#00ff41' : '#666', fontSize: '10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', letterSpacing: '1px'
          }}
        >
          <Activity size={12} /> ВСЕ
        </button>
      </div>

      <div className="live-feed-list">
        <AnimatePresence>
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id || i}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`live-feed-item ${activity.username === username ? 'self' : ''}`}
            >
              <div className="live-feed-item-icon" style={{ color: MISSION_COLORS[activity.mission_name] || '#00ff41' }}>
                {activity.username === username ? <Zap size={14} /> : <Star size={14} />}
              </div>
              <div className="live-feed-item-content">
                <div className="live-feed-item-text">
                  <span className="live-feed-username" style={{ color: activity.username === username ? '#00ff41' : '#4d94ff' }}>
                    {activity.username.toUpperCase()}
                  </span>
                  {' '}завершил{' '}
                  <span style={{ color: MISSION_COLORS[activity.mission_name] }}>
                    {MISSION_NAMES[activity.mission_name] || `МИССИЮ #${activity.mission_name}`}
                  </span>
                </div>
                <div className="live-feed-item-meta">
                  <span className="live-feed-points">+{activity.points_earned} XP</span>
                  <span className="live-feed-time">{formatTime(activity.created_at)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {activities.length === 0 && (
          <div className="live-feed-empty">
            {mode === 'friends' ? 'Добавьте друзей, чтобы видеть их активность' : 'Ожидание активности агентов...'}
          </div>
        )}
      </div>
    </div>
  );
}
