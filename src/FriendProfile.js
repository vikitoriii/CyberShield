import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Zap, Target, Trophy, Clock } from 'lucide-react';

const RANKS = [
  { min: 0, title: 'СТАЖЕР', color: '#888' },
  { min: 1000, title: 'АНАЛИТИК', color: '#4d94ff' },
  { min: 3000, title: 'ДЕТЕКТИВ', color: '#00ff41' },
  { min: 7000, title: 'ЛЕГЕНДА', color: '#ff4d4d' }
];

const MISSION_NAMES = {
  1: 'СТОЙКОСТЬ ПАРОЛЯ', 2: 'ДЕТЕКТОР ФИШИНГА', 3: 'СЕТЕВОЙ ЭКРАН',
  4: 'БАЗА ДАННЫХ', 5: 'СОЦ. ИНЖЕНЕРИЯ', 6: 'КРИПТОГРАФИЯ',
  7: 'ЦИФРОВОЙ СЛЕД', 8: 'ВЗЛОМ СЕЙФА', 9: 'СКРЫТЫЙ ПОРТАЛ', 10: 'ФИНАЛЬНАЯ ОПЕРАЦИЯ'
};

export default function FriendProfile({ username, friendName, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [friendName]);

  const loadProfile = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', friendName)
      .single();

    if (data) setProfile(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="friend-profile-modal">
        <div className="friend-profile-content">
          <div className="friend-profile-loading">ЗАГРУЗКА...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="friend-profile-modal">
        <div className="friend-profile-content">
          <div className="friend-profile-empty">Профиль не найден</div>
          <button className="btn-action" onClick={onClose}>ЗАКРЫТЬ</button>
        </div>
      </div>
    );
  }

  const rank = [...RANKS].reverse().find(r => profile.points >= r.min) || RANKS[0];
  const completed = (profile.unlocked_clues || []).length;
  const percent = Math.round((completed / 10) * 100);

  const getMedal = () => {
    if (completed === 10) return { emoji: '🏆', title: 'ПОЛНОЕ ПРОХОЖДЕНИЕ' };
    if (completed >= 7) return { emoji: '🥇', title: 'МАСТЕР-ХАКЕР' };
    if (completed >= 4) return { emoji: '🥈', title: 'ПРОДВИНУТЫЙ' };
    if (completed >= 1) return { emoji: '🥉', title: 'НАЧИНАЮЩИЙ' };
    return { emoji: '🎯', title: 'НОВИЧОК' };
  };

  const medal = getMedal();

  return (
    <motion.div
      className="friend-profile-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="friend-profile-content">
        <div className="friend-profile-header">
          <div className="friend-profile-avatar" style={{ borderColor: rank.color }}>
            <Shield size={24} color={rank.color} />
          </div>
          <div className="friend-profile-info">
            <div className="friend-profile-name">{friendName.toUpperCase()}</div>
            <div className="friend-profile-rank" style={{ color: rank.color }}>{rank.title}</div>
          </div>
          <button className="friend-profile-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="friend-profile-stats">
          <div className="friend-profile-stat">
            <Zap size={16} color="#00ff41" />
            <div className="friend-profile-stat-value">{profile.points.toLocaleString()}</div>
            <div className="friend-profile-stat-label">XP</div>
          </div>
          <div className="friend-profile-stat">
            <Target size={16} color="#4d94ff" />
            <div className="friend-profile-stat-value">{completed}/10</div>
            <div className="friend-profile-stat-label">МИССИИ</div>
          </div>
          <div className="friend-profile-stat">
            <Trophy size={16} color="#f7b500" />
            <div className="friend-profile-stat-value">{percent}%</div>
            <div className="friend-profile-stat-label">ПРОГРЕСС</div>
          </div>
        </div>

        <div className="friend-profile-progress">
          <div className="friend-profile-progress-bar">
            <div className="friend-profile-progress-fill" style={{ width: `${percent}%`, background: rank.color }} />
          </div>
        </div>

        <div className="friend-profile-missions">
          <div className="friend-profile-missions-title">ПРОЙДЕННЫЕ МИССИИ</div>
          <div className="friend-profile-missions-list">
            {(profile.unlocked_clues || []).map((clueId) => (
              <div key={clueId} className="friend-profile-mission">
                <span className="friend-profile-mission-check">✓</span>
                <span>{MISSION_NAMES[clueId] || `МИССИЯ #${clueId}`}</span>
              </div>
            ))}
            {completed === 0 && (
              <div className="friend-profile-missions-empty">Пока нет пройденных миссий</div>
            )}
          </div>
        </div>

        <div className="friend-profile-medal">
          <span className="friend-profile-medal-emoji">{medal.emoji}</span>
          <span className="friend-profile-medal-title">{medal.title}</span>
        </div>
      </div>
    </motion.div>
  );
}
