import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { BarChart3, TrendingUp, Clock, Target, Award, Zap, Download } from 'lucide-react';

const RANKS = [
  { min: 0, title: 'СТАЖЁР', color: '#888', icon: '🎖️' },
  { min: 1000, title: 'АНАЛИТИК', color: '#4d94ff', icon: '🏅' },
  { min: 3000, title: 'ДЕТЕКТИВ', color: '#00ff41', icon: '🥇' },
  { min: 7000, title: 'ЛЕГЕНДА', color: '#ff4d4d', icon: '🏆' },
];

export default function StatsPanel({ username, points, unlockedClues }) {
  const [missions, setMissions] = useState([]);
  const [academy, setAcademy] = useState([]);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, aRes] = await Promise.all([
          supabase.from('activity_log').select('*').eq('username', username).order('created_at', { ascending: false }),
          supabase.from('academy_completions').select('*').eq('username', username)
        ]);
        if (mRes.data) setMissions(mRes.data);
        if (aRes.data) setAcademy(aRes.data);
      } catch (e) {}
    };
    load();
  }, [username]);

  const rank = RANKS.reduce((prev, curr) => points >= curr.min ? curr : prev, RANKS[0]);
  const nextRank = RANKS.find(r => r.min > points);
  const progressToNext = nextRank ? Math.round(((points - rank.min) / (nextRank.min - rank.min)) * 100) : 100;
  const totalXpEarned = missions.reduce((s, m) => s + m.points_earned, 0);
  const avgScore = academy.length > 0 ? Math.round(academy.reduce((s, a) => s + a.score, 0) / academy.length) : 0;
  const uniqueMissions = [...new Set(missions.map(m => m.mission_id))].length;
  const firstMission = missions.length > 0 ? new Date(missions[missions.length - 1].created_at) : null;
  const daysActive = firstMission ? Math.max(1, Math.ceil((Date.now() - firstMission.getTime()) / 86400000)) : 1;

  const exportData = () => {
    const data = {
      agent: username,
      rank: rank.title,
      xp: points,
      missions_completed: uniqueMissions,
      clues_found: unlockedClues.length,
      academy_avg: avgScore,
      export_date: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybershield_${username}_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <BarChart3 size={18} color="#00ff41" />
        <span>СТАТИСТИКА АГЕНТА</span>
        <button className="stats-export-btn" onClick={() => setShowExport(!showExport)}>
          <Download size={12} /> ОТЧЁТ
        </button>
      </div>

      {showExport && (
        <div className="stats-export-box">
          <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
            Экспорт данных агента в JSON
          </div>
          <button className="btn-action" style={{ width: '100%', fontSize: '11px' }} onClick={exportData}>
            СКАЧАТЬ ОТЧЁТ
          </button>
        </div>
      )}

      {/* Rank progress */}
      <div className="stats-rank">
        <div className="stats-rank-icon">{rank.icon}</div>
        <div className="stats-rank-info">
          <div className="stats-rank-title" style={{ color: rank.color }}>{rank.title}</div>
          {nextRank && (
            <div className="stats-rank-progress">
              <div className="stats-rank-bar">
                <div className="stats-rank-fill" style={{ width: `${progressToNext}%`, background: rank.color }} />
              </div>
              <div className="stats-rank-next">
                {points} / {nextRank.min} XP до следующего ранга
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <div className="stats-card">
          <Zap size={16} color="#00ff41" />
          <div className="stats-card-value">{points}</div>
          <div className="stats-card-label">ОБЩИЙ XP</div>
        </div>
        <div className="stats-card">
          <Target size={16} color="#f7b500" />
          <div className="stats-card-value">{uniqueMissions}/10</div>
          <div className="stats-card-label">МИССИИ</div>
        </div>
        <div className="stats-card">
          <Award size={16} color="#4d94ff" />
          <div className="stats-card-value">{unlockedClues.length}/10</div>
          <div className="stats-card-label">УЛИКИ</div>
        </div>
        <div className="stats-card">
          <TrendingUp size={16} color="#ff4d4d" />
          <div className="stats-card-value">{academy.length}/9</div>
          <div className="stats-card-label">УРОКОВ</div>
        </div>
      </div>

      {/* Details */}
      <div className="stats-details">
        <div className="stats-detail-row">
          <span>Средний балл Академии</span>
          <span style={{ color: avgScore >= 70 ? '#00ff41' : '#f7b500' }}>{avgScore}%</span>
        </div>
        <div className="stats-detail-row">
          <span>Дней активности</span>
          <span>{daysActive}</span>
        </div>
        <div className="stats-detail-row">
          <span>Всего заработано XP</span>
          <span style={{ color: '#00ff41' }}>+{totalXpEarned}</span>
        </div>
        <div className="stats-detail-row">
          <span>Выполнение миссий</span>
          <span>{uniqueMissions * 10}%</span>
        </div>
      </div>
    </div>
  );
}
