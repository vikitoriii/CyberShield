import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Swords, Zap, Target, Hash, X, Check, Clock } from 'lucide-react';

const GAMES = {
  number: { name: 'БЛИЖЕ К ЧИСЛУ', desc: 'Загадано случайное число 1-100. Кто ближе — победил!', icon: <Hash size={20} /> },
  reaction: { name: 'РЕАКЦИЯ', desc: 'Когда станет зелёным — жми! Кто быстрее — победил.', icon: <Zap size={20} /> },
  quiz: { name: 'БЫСТРЫЙ ОТВЕТ', desc: '5 вопросов по IT. Кто больше ответит — победил.', icon: <Target size={20} /> }
};

const ALL_QUIZ_QUESTIONS = [
  { q: 'Какой HTTP статус = "ОК"?', a: '200', opts: ['200', '404', '500'] },
  { q: 'Что такое SQL?', a: 'Язык запросов', opts: ['Язык запросов', 'Протокол', 'ОС'] },
  { q: 'Порт для HTTPS?', a: '443', opts: ['443', '80', '8080'] },
  { q: 'React — это...', a: 'Библиотека', opts: ['Библиотека', 'База данных', 'Браузер'] },
  { q: 'CSS нужен для...', a: 'Стилей', opts: ['Стилей', 'Логики', 'Сервера'] },
  { q: 'Какой порт использует SSH?', a: '22', opts: ['22', '80', '443'] },
  { q: 'Что такое API?', a: 'Интерфейс программирования', opts: ['Интерфейс программирования', 'Протокол передачи', 'База данных'] },
  { q: 'HTTP vs HTTPS — разница?', a: 'HTTPS шифрует данные', opts: ['HTTPS шифрует данные', 'HTTPS быстрее', 'HTTPS бесплатно'] },
  { q: 'Что делает firewall?', a: 'Фильтрует трафик', opts: ['Фильтрует трафик', 'Ускоряет интернет', 'Шифрует файлы'] },
  { q: 'Python — это...', a: 'Язык программирования', opts: ['Язык программирования', 'Браузер', 'Операционная система'] },
  { q: 'Git — это...', a: 'Система контроля версий', opts: ['Система контроля версий', 'Редактор кода', 'База данных'] },
  { q: 'Linux — это...', a: 'Операционная система', opts: ['Операционная система', 'Язык программирования', 'Браузер'] },
  { q: 'Какой HTTP статус = "Не найдено"?', a: '404', opts: ['404', '200', '500'] },
  { q: 'Что такое JSON?', a: 'Формат данных', opts: ['Формат данных', 'Язык стилей', 'Протокол'] },
  { q: 'JavaScript нужен для...', a: 'Логики веб-страниц', opts: ['Логики веб-страниц', 'Стилей', 'Сервера'] },
  { q: 'Порт для HTTP?', a: '80', opts: ['80', '443', '22'] },
  { q: 'Node.js — это...', a: 'Среда выполнения JS', opts: ['Среда выполнения JS', 'База данных', 'Браузер'] },
  { q: 'TypeScript — это...', a: 'Язык с типами', opts: ['Язык с типами', 'Протокол', 'Операционная система'] },
  { q: 'REST API — это...', a: 'Архитектура веб-сервисов', opts: ['Архитектура веб-сервисов', 'Язык программирования', 'База данных'] },
  { q: 'SQL注入 — это...', a: 'Атака через запросы', opts: ['Атака через запросы', 'Вирус', 'Шифрование'] },
  { q: 'Cookie — это...', a: 'Данные в браузере', opts: ['Данные в браузере', 'Файл на компьютере', 'Протокол'] },
  { q: 'Что такое Docker?', a: 'Контейнеризация', opts: ['Контейнеризация', 'База данных', 'Редактор'] },
  { q: 'CDN — это...', a: 'Сеть доставки контента', opts: ['Сеть доставки контента', 'Протокол', 'Язык'] },
  { q: 'WebSocket — это...', a: 'Двунаправленная связь', opts: ['Двунаправленная связь', 'Протокол шифрования', 'База данных'] },
  { q: 'Оптимизация БД — это...', a: 'Ускорение запросов', opts: ['Ускорение запросов', 'Шифрование данных', 'Резервное копирование'] }
];

function getQuizQuestions() {
  const shuffled = [...ALL_QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

function getHiddenNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

export default function AgentDuel({ username, opponent, gameId, onEnd }) {
  const [phase, setPhase] = useState('loading');
  const [gameType, setGameType] = useState(null);
  const [db, setDb] = useState(null);
  const [myReady, setMyReady] = useState(false);
  const [oppReady, setOppReady] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [myScore, setMyScore] = useState(null);
  const [oppScore, setOppScore] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [winner, setWinner] = useState(null);
  const [reactionActive, setReactionActive] = useState(false);
  const [reactionTime, setReactionTime] = useState(null);
  const [numberGuess, setNumberGuess] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [iFinished, setIFinished] = useState(false);
  const [hiddenNumber] = useState(getHiddenNumber);
  const [quizQuestions] = useState(getQuizQuestions);
  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const countdownRef = useRef(null);
  const reactionRef = useRef(null);
  const phaseRef = useRef(null);
  const resultShown = useRef(false);

  const isMe = (data) => data?.challenger === username;

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    load();
    pollRef.current = setInterval(load, 1000);
    return () => {
      clearInterval(pollRef.current);
      clearTimeout(countdownRef.current);
      clearTimeout(reactionRef.current);
    };
  }, [gameId]);

  useEffect(() => {
    if (phase !== 'countdown') return;
    countdownRef.current = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
      } else {
        setCountdown(0);
        setPhase('playing');
        supabase.from('friend_challenges').update({ status: 'active' }).eq('id', gameId);
        if (gameType === 'reaction') startReactionTimer();
      }
    }, 1000);
    return () => clearTimeout(countdownRef.current);
  }, [phase, countdown, gameType]);

  const load = async () => {
    const { data } = await supabase.from('friend_challenges').select('*').eq('id', gameId).single();
    if (!data) return;
    setDb(data);

    const iAm = data.challenger === username;
    const myR = iAm ? data.challenger_ready : data.challenged_ready;
    const oppR = iAm ? data.challenged_ready : data.challenger_ready;
    const myS = iAm ? data.challenger_score : data.challenged_score;
    const oppS = iAm ? data.challenged_score : data.challenger_score;
    const gt = data.game_type;

    setMyReady(myR);
    setOppReady(oppR);
    if (gt && gt !== 'duel' && gt !== 'pending') setGameType(gt);

    if (resultShown.current) return;

    if (data.status === 'cancelled') {
      setWinner(data.winner || opponent);
      setMyScore(myS || 0);
      setOppScore(oppS || 0);
      resultShown.current = true;
      setShowResult(true);
      setPhase('result');
      return;
    }

    if (data.status === 'finished') {
      setMyScore(myS || 0);
      setOppScore(oppS || 0);
      resultShown.current = true;
      setWinner(data.winner || username);
      setShowResult(true);
      setPhase('result');
      return;
    }

    const myScoreReady = myS !== null && myS !== 0;
    const oppScoreReady = oppS !== null && oppS !== 0;
    if (myScoreReady && oppScoreReady && !resultShown.current) {
      let w = 'draw';
      if (gt === 'number') {
        const md = Math.abs(myS - hiddenNumber);
        const od = Math.abs(oppS - hiddenNumber);
        w = md < od ? username : (od < md ? opponent : 'draw');
      } else if (gt === 'reaction') {
        w = myS < oppS ? username : (oppS < myS ? opponent : 'draw');
      } else {
        w = myS > oppS ? username : (oppS > myS ? opponent : 'draw');
      }
      setWinner(w);
      setMyScore(myS);
      setOppScore(oppS);
      resultShown.current = true;
      setShowResult(true);
      setPhase('result');
      return;
    }

    if (data.status === 'active') {
      if (phaseRef.current !== 'playing' && phaseRef.current !== 'finished_wait' && phaseRef.current !== 'result') {
        setPhase('playing');
        if (gt === 'reaction' && phaseRef.current !== 'playing') {
          startReactionTimer();
        }
      }
      return;
    }

    if (data.status === 'pending') {
      if (!gt || gt === 'duel' || gt === 'pending') {
        setPhase(iAm ? 'pick_game' : 'wait_pick');
      } else if (myR && oppR) {
        if (phaseRef.current !== 'countdown' && phaseRef.current !== 'playing' && phaseRef.current !== 'result') {
          setCountdown(3);
          setPhase('countdown');
        }
      } else if (myR && !oppR) {
        setPhase('wait_ready');
      } else {
        setPhase('ready_screen');
      }
    }
  };

  const startReactionTimer = () => {
    clearTimeout(reactionRef.current);
    setReactionActive(false);
    reactionRef.current = setTimeout(() => {
      setReactionActive(true);
      timerRef.current = Date.now();
    }, Math.random() * 3000 + 2000);
  };

  const pickGame = async (type) => {
    setGameType(type);
    await supabase.from('friend_challenges').update({ game_type: type }).eq('id', gameId);
  };

  const doReady = async () => {
    setMyReady(true);
    const iAm = db?.challenger === username;
    await supabase.from('friend_challenges').update(
      iAm ? { challenger_ready: true } : { challenged_ready: true }
    ).eq('id', gameId);
  };

  const exitDuel = async () => {
    const iAm = db?.challenger === username;
    const win = iAm ? opponent : (db?.challenger || opponent);
    await supabase.from('friend_challenges').update({ status: 'cancelled', winner: win }).eq('id', gameId);
    setWinner(win);
    resultShown.current = true;
    setShowResult(true);
    setPhase('result');
  };

  const submitMyScore = async (score) => {
    setIFinished(true);
    setMyScore(score);
    setPhase('finished_wait');
    const iAm = db?.challenger === username;
    const myField = iAm ? 'challenger_score' : 'challenged_score';
    const otherField = iAm ? 'challenged_score' : 'challenger_score';

    const { data: cur } = await supabase.from('friend_challenges').select('*').eq('id', gameId).single();
    const otherScore = cur[otherField];
    const otherDone = otherScore !== null && otherScore !== 0;

    if (otherDone) {
      let w = 'draw';
      if (gameType === 'number') {
        const md = Math.abs(score - hiddenNumber);
        const od = Math.abs(otherScore - hiddenNumber);
        w = md < od ? username : (od < md ? (iAm ? cur.challenged : cur.challenger) : 'draw');
      } else if (gameType === 'reaction') {
        w = score < otherScore ? username : (otherScore < score ? (iAm ? cur.challenged : cur.challenger) : 'draw');
      } else {
        w = score > otherScore ? username : (otherScore > score ? (iAm ? cur.challenged : cur.challenger) : 'draw');
      }
      await supabase.from('friend_challenges').update({ [myField]: score, status: 'finished', winner: w }).eq('id', gameId);
    } else {
      await supabase.from('friend_challenges').update({ [myField]: score }).eq('id', gameId);
    }
  };

  const handleReactionClick = () => {
    if (!reactionActive || iFinished) return;
    clearTimeout(reactionRef.current);
    const t = Date.now() - timerRef.current;
    setReactionTime(t);
    setReactionActive(false);
    submitMyScore(t);
  };

  const handleNumberGuess = () => {
    const g = parseInt(numberGuess);
    if (isNaN(g) || iFinished) return;
    submitMyScore(g);
  };

  const handleQuizAnswer = (ans) => {
    if (iFinished) return;
    const ok = quizQuestions[quizIndex].a === ans;
    const s = ok ? quizScore + 1 : quizScore;
    setQuizScore(s);
    if (quizIndex < 4) setQuizIndex(quizIndex + 1);
    else submitMyScore(s);
  };

  const exitBtn = <button className="duel-cancel-btn" onClick={exitDuel}>ВЫЙТИ</button>;

  if (showResult) {
    const w = winner || 'draw';
    return (
      <div className="duel-result">
        <div className={`duel-winner ${w === username ? 'won' : w === 'draw' ? '' : 'lost'}`}>
          {w === username ? '🏆 ПОБЕДА!' : w === 'draw' ? '🤝 НИЧЬЯ' : '❌ ПОРАЖЕНИЕ'}
        </div>
        <div className="duel-scores">
          <div className="duel-score-item">
            <div className="duel-score-name">{username.toUpperCase()}</div>
            <div className="duel-score-value">{myScore || 0}</div>
          </div>
          <div className="duel-vs">VS</div>
          <div className="duel-score-item">
            <div className="duel-score-name">{opponent.toUpperCase()}</div>
            <div className="duel-score-value">{oppScore || 0}</div>
          </div>
        </div>
        {gameType === 'number' && <div style={{ color: '#f7b500', fontSize: '12px', marginBottom: '16px' }}>Загаданное число: {hiddenNumber}</div>}
        <button className="btn-action" onClick={onEnd}>ЗАКРЫТЬ</button>
      </div>
    );
  }

  if (phase === 'loading') return <div className="duel-waiting"><div className="duel-waiting-spinner" /><div>ЗАГРУЗКА...</div>{exitBtn}</div>;

  if (phase === 'pick_game') return (
    <div className="duel-select">
      <div className="duel-header"><Swords size={24} color="#f7b500" /><span>ВЫБЕРИ ДУЭЛЬ</span><span className="duel-opponent">vs {opponent.toUpperCase()}</span></div>
      <div className="duel-games">
        {Object.entries(GAMES).map(([id, g]) => (
          <button key={id} className="duel-game-btn" onClick={() => pickGame(id)}>
            <div className="duel-game-icon">{g.icon}</div>
            <div className="duel-game-name">{g.name}</div>
            <div className="duel-game-desc">{g.desc}</div>
          </button>
        ))}
      </div>
      <button className="duel-cancel-btn" onClick={exitDuel} style={{ marginTop: '16px' }}>ОТМЕНИТЬ</button>
    </div>
  );

  if (phase === 'wait_pick') return <div className="duel-waiting-accept"><div className="duel-waiting-spinner" /><div className="duel-waiting-text">{opponent.toUpperCase()} выбирает игру...</div>{exitBtn}</div>;

  if (phase === 'ready_screen' || phase === 'wait_ready') {
    const oppName = db?.challenger === username ? opponent : (db?.challenger || opponent);
    const oppLabel = phase === 'ready_screen' ? oppName.toUpperCase() : oppName.toUpperCase();
    return (
      <div className="duel-ready-screen">
        <div className="duel-ready-title">ГОТОВ К БОЮ?</div>
        <div className="duel-ready-game">{GAMES[gameType]?.name || 'ОЖИДАНИЕ...'}</div>
        <div className="duel-ready-players">
          <div className={`duel-ready-player ${oppReady ? 'ready' : ''}`}>
            <div className="duel-ready-avatar">{oppName[0].toUpperCase()}</div>
            <div className="duel-ready-name">{oppLabel}</div>
            {oppReady && <div className="duel-ready-check">✓ ГОТОВ</div>}
          </div>
          <div className="duel-ready-vs">VS</div>
          <div className={`duel-ready-player ${myReady ? 'ready' : ''}`}>
            <div className="duel-ready-avatar">{username[0].toUpperCase()}</div>
            <div className="duel-ready-name">{username.toUpperCase()}</div>
            {myReady && <div className="duel-ready-check">✓ ГОТОВ</div>}
          </div>
        </div>
        {!myReady ? (
          <button className="duel-ready-btn" onClick={doReady}><Zap size={16} /> Я ГОТОВ!</button>
        ) : (
          <div className="duel-ready-waiting"><Clock size={16} /> Ожидание...</div>
        )}
        {exitBtn}
      </div>
    );
  }

  if (phase === 'countdown') return (
    <div className="duel-countdown">
      <div className="duel-countdown-number">{countdown}</div>
      <div className="duel-countdown-text">ПРИГОТОВЬСЯ!</div>
    </div>
  );

  if (phase === 'finished_wait') return (
    <div className="duel-waiting">
      <div className="duel-waiting-spinner" />
      <div>ОЖИДАНИЕ {opponent.toUpperCase()}...</div>
      <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>Ваш результат: {myScore}</div>
    </div>
  );

  if (phase === 'playing' && gameType === 'reaction') return (
    <div className="duel-game-area" onClick={handleReactionClick} style={{ cursor: reactionActive ? 'pointer' : 'default' }}>
      <div className="duel-game-title">РЕАКЦИЯ</div>
      {iFinished ? <div className="duel-reaction-result">{reactionTime}ms — ждём соперника</div>
        : reactionActive ? <div className="duel-reaction-active">ЖМИ СЕЙЧАС!</div>
        : <div className="duel-reaction-wait" style={{ color: '#ff4d4d', fontSize: '24px' }}>НЕ ТРОГАЙ! Жди зелёного...</div>}
    </div>
  );

  if (phase === 'playing' && gameType === 'number') return (
    <div className="duel-game-area">
      <div className="duel-game-title">БЛИЖЕ К ЧИСЛУ</div>
      <div style={{ color: '#888', fontSize: '12px', marginBottom: '16px' }}>Загадано случайное число от 1 до 100</div>
      <input type="number" min="1" max="100" value={numberGuess} onChange={e => setNumberGuess(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleNumberGuess()} className="duel-number-input" placeholder="?" disabled={iFinished} />
      <button className="btn-action" onClick={handleNumberGuess} disabled={!numberGuess || iFinished}>ОТПРАВИТЬ</button>
    </div>
  );

  if (phase === 'playing' && gameType === 'quiz') {
    const q = quizQuestions[quizIndex];
    return (
      <div className="duel-game-area">
        <div className="duel-game-title">БЫСТРЫЙ ОТВЕТ ({quizIndex + 1}/5)</div>
        <div className="duel-quiz-question">{q.q}</div>
        <div className="duel-quiz-options">
          {q.opts.map((opt, i) => <button key={i} className="duel-quiz-opt" onClick={() => handleQuizAnswer(opt)} disabled={iFinished}>{opt}</button>)}
        </div>
        <div className="duel-quiz-score">Счёт: {quizScore}</div>
      </div>
    );
  }

  return <div className="duel-waiting"><div className="duel-waiting-spinner" /><div>ЗАГРУЗКА...</div>{exitBtn}</div>;
}
