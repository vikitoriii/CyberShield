import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Zap, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const DAILY_CHALLENGES = [
  {
    id: 1,
    title: 'НАДЁЖНЫЙ ПАРОЛЬ',
    desc: 'Какой пароль надёжнее? Введи номер: 1) 123456  2) qwerty  3) correct horse battery staple',
    type: 'input',
    answer: '3',
    validate: (v) => v === '3',
    points: 500
  },
  {
    id: 2,
    title: 'ШИФР ЦЕЗАРЯ',
    desc: 'Расшифруй: "KHOOR" при сдвиге -3. Введи слово:',
    type: 'input',
    answer: 'HELLO',
    validate: (v) => v.toUpperCase() === 'HELLO',
    points: 750
  },
  {
    id: 3,
    title: 'ФИШИНГ',
    desc: 'Письмо пришло с адреса "support@g00gle.com". Это фишинг? Введи ДА или НЕТ:',
    type: 'input',
    answer: 'ДА',
    validate: (v) => v.toUpperCase() === 'ДА' || v.toUpperCase() === 'DA',
    points: 600
  },
  {
    id: 4,
    title: 'ПОРТЫ',
    desc: 'Какой порт используется для HTTPS? Введи число:',
    type: 'input',
    answer: '443',
    validate: (v) => v === '443',
    points: 500
  },
  {
    id: 5,
    title: 'СОЦИАЛЬНАЯ ИНЖЕНЕРИЯ',
    desc: 'Хакер звонит и представляется IT-отделом, просит назвать код из SMS. Это:',
    type: 'input',
    answer: 'АТАКА',
    validate: (v) => v.toUpperCase() === 'АТАКА' || v.toUpperCase() === 'ATAKA' || v.toUpperCase() === 'СОЦИАЛЬНАЯ ИНЖЕНЕРИЯ',
    points: 650
  },
  {
    id: 6,
    title: 'HEX-КОД',
    desc: 'Переведи FF из шестнадцатеричной в десятичную систему:',
    type: 'input',
    answer: '255',
    validate: (v) => v === '255',
    points: 500
  },
  {
    id: 7,
    title: 'БИНАРНЫЙ КОД',
    desc: 'Что означает: 01001000 01001001? (ASCII)',
    type: 'input',
    answer: 'HI',
    validate: (v) => v.toUpperCase() === 'HI',
    points: 650
  }
];

export default function DailyChallenge({ username, onComplete }) {
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [completedToday, setCompletedToday] = useState(false);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const challengeIndex = dayOfYear % DAILY_CHALLENGES.length;
    setTodayChallenge(DAILY_CHALLENGES[challengeIndex]);

    const cacheKey = `daily_completed_${username}_${today}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached === 'true') {
      setCompletedToday(true);
      setLoading(false);
      return;
    }

    const checkCompletion = async () => {
      try {
        const { data } = await supabase
          .from('daily_challenges')
          .select('id')
          .eq('username', username)
          .eq('challenge_date', today)
          .limit(1);

        if (data && data.length > 0) {
          setCompletedToday(true);
          localStorage.setItem(cacheKey, 'true');
        }
      } catch (e) {
        console.warn('Daily check failed:', e);
      }
      setLoading(false);
    };

    checkCompletion();

    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow - now;
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${hours}ч ${mins}м`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [username]);

  const handleSubmit = async () => {
    if (!answer.trim() || !todayChallenge) return;
    setError('');

    if (todayChallenge.validate(answer)) {
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `daily_completed_${username}_${today}`;

      try {
        await supabase.from('daily_challenges').insert([{
          username,
          challenge_id: todayChallenge.id,
          challenge_date: today,
          points_earned: todayChallenge.points
        }]);
      } catch (e) {
        console.warn('DB save failed, using local only');
      }

      localStorage.setItem(cacheKey, 'true');
      setCompletedToday(true);
      onComplete(todayChallenge.points);
    } else {
      setError('Неверный ответ. Попробуй ещё раз!');
      setAnswer('');
    }
  };

  if (loading || !todayChallenge) return null;

  return (
    <div className="daily-challenge">
      <div className="daily-challenge-header">
        <div className="daily-challenge-icon">
          <Calendar size={18} color="#f7b500" />
        </div>
        <div>
          <div className="daily-challenge-label">ЕЖЕДНЕВНОЕ ЗАДАНИЕ</div>
          <div className="daily-challenge-timer">
            <Clock size={10} /> Обновление через: {timeLeft}
          </div>
        </div>
      </div>

      <div className="daily-challenge-body">
        <div className="daily-challenge-title">{todayChallenge.title}</div>
        <div className="daily-challenge-desc">{todayChallenge.desc}</div>

        {completedToday ? (
          <div className="daily-challenge-completed">
            <CheckCircle size={16} color="#00ff41" />
            <span>ЗАДАНИЕ ВЫПОЛНЕНО! +{todayChallenge.points} XP</span>
          </div>
        ) : (
          <div className="daily-challenge-input-area">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Введи ответ..."
              className="daily-challenge-input"
            />
            <button className="daily-challenge-submit" onClick={handleSubmit} disabled={!answer.trim()}>
              <Zap size={14} /> ОТПРАВИТЬ
            </button>
            {error && (
              <div className="daily-challenge-error">
                <AlertTriangle size={12} /> {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
