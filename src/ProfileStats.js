import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, Clock, Target, Zap, Lock } from 'lucide-react';

const RANKS = [
  { min: 0, title: 'СТАЖЕР', color: '#888' },
  { min: 1000, title: 'АНАЛИТИК', color: '#4d94ff' },
  { min: 3000, title: 'ДЕТЕКТИВ', color: '#00ff41' },
  { min: 7000, title: 'ЛЕГЕНДА', color: '#ff4d4d' }
];

export default function ProfileStats({ username, points, unlockedClues }) {
  const completed = unlockedClues.length;
  const total = 10;
  const percent = Math.round((completed / total) * 100);

  const currentRank = [...RANKS].reverse().find(r => points >= r.min);
  const nextRank = RANKS.find(r => r.min > points);
  const progressToNext = nextRank
    ? Math.round(((points - currentRank.min) / (nextRank.min - currentRank.min)) * 100)
    : 100;

  const getMedal = () => {
    if (completed === 10) return { emoji: '🏆', title: 'ПОЛНЫЙ ПРОХОЖДЕНИЕ', color: '#ff4d4d' };
    if (completed >= 7) return { emoji: '🥇', title: 'МАСТЕР-ХАКЕР', color: '#f7b500' };
    if (completed >= 4) return { emoji: '🥈', title: 'ПРОДВИНУТЫЙ', color: '#4d94ff' };
    if (completed >= 1) return { emoji: '🥉', title: 'НАЧИНАЮЩИЙ', color: '#00ff41' };
    return { emoji: '🎯', title: 'НОВИЧОК', color: '#888' };
  };

  const medal = getMedal();

  return (
    <div className="profile-stats">
      <div className="profile-stats-header">
        <div className="profile-avatar">
          <Shield size={20} color="#00ff41" />
        </div>
        <div>
          <div className="profile-name">{username.toUpperCase()}</div>
          <div className="profile-rank" style={{ color: currentRank.color }}>{currentRank.title}</div>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="profile-stat">
          <div className="profile-stat-icon"><Zap size={14} color="#00ff41" /></div>
          <div className="profile-stat-value">{points.toLocaleString()}</div>
          <div className="profile-stat-label">XP</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-icon"><Target size={14} color="#4d94ff" /></div>
          <div className="profile-stat-value">{completed}/{total}</div>
          <div className="profile-stat-label">МИССИИ</div>
        </div>
        <div className="profile-stat">
          <div className="profile-stat-icon"><Trophy size={14} color="#f7b500" /></div>
          <div className="profile-stat-value">{percent}%</div>
          <div className="profile-stat-label">ПРОГРЕСС</div>
        </div>
      </div>

      <div className="profile-progress-section">
        <div className="profile-progress-label">
          <span>ДО СЛЕДУЮЩЕГО РАНГА</span>
          <span style={{ color: nextRank ? nextRank.color : '#00ff41' }}>
            {nextRank ? nextRank.title : 'МАКСИМУМ'}
          </span>
        </div>
        <div className="profile-progress-bar">
          <motion.div
            className="profile-progress-fill"
            style={{ background: nextRank ? nextRank.color : '#00ff41' }}
            initial={{ width: 0 }}
            animate={{ width: `${progressToNext}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        {nextRank && (
          <div className="profile-progress-hint">
            {nextRank.min - points} XP до {nextRank.title}
          </div>
        )}
      </div>

      <div className="profile-medal" style={{ borderColor: medal.color }}>
        <span className="profile-medal-emoji">{medal.emoji}</span>
        <span className="profile-medal-title" style={{ color: medal.color }}>{medal.title}</span>
      </div>
    </div>
  );
}
