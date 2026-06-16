import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { 
  Shield, Terminal, Trophy, User, Lock, Search, 
  Activity, Database, Book, Command, MessageSquare, Zap, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Импорт всех игровых модулей
import CaseFiles from './CaseFiles';
import IntroStory from './IntroStory';
import Leaderboard from './Leaderboard';
import PasswordMission from './PasswordMission';
import PhishingMission from './PhishingMission';
import FirewallMission from './FirewallMission'; 
import DatabaseMission from './DatabaseMission';
import SocialMission from './SocialMission';

function App() {
  // --- 1. СОСТОЯНИЯ СИСТЕМЫ (SYSTEM STATES) ---
  const [activeTab, setActiveTab] = useState('desktop');
  const [username, setUsername] = useState('');
  const [points, setPoints] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [showIntro, setShowIntro] = useState(false); 
  const [unlockedClues, setUnlockedClues] = useState([]); 
  const [interceptedMsg, setInterceptedMsg] = useState(null); // Для захватывающих уведомлений

  // Состояния для интерактивного терминала
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    '> CS-OS Kernel v1.0.5 loaded...', 
    '> Welcome back, Agent. Max\'s traces found.'
  ]);

  // --- 2. СИСТЕМА РАНГОВ ---
  const getRank = (xp) => {
    if (xp < 1000) return { title: "СТАЖЕР (LVL 1)", color: "#888", desc: "Доступ ограничен" };
    if (xp < 3000) return { title: "АНАЛИТИК (LVL 2)", color: "#4d94ff", desc: "Доступ к архивам" };
    if (xp < 7000) return { title: "ДЕТЕКТИВ (LVL 3)", color: "#00ff41", desc: "Полный доступ" };
    return { title: "ЛЕГЕНДА CS-OS", color: "#ff4d4d", desc: "Уровень Администратора" };
  };
  const rank = getRank(points);

  // --- 3. ФУНКЦИЯ ВХОДА ---
  async function handleLogin() {
    if (!username) return alert("Введите идентификатор агента!");
    setLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (data) {
        setPoints(data.points);
        setUnlockedClues(data.unlocked_clues || []);
      } else {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ username, points: 0, unlocked_clues: [] }]);
        if (insertError) throw insertError;
        setPoints(0);
        setUnlockedClues([]);
      }
      setIsLoggedIn(true);
      setShowIntro(true); 
    } catch (err) {
      console.error(err);
      alert("Ошибка доступа к базе данных!");
    } finally {
      setLoading(false);
    }
  }

  // --- 4. ФУНКЦИЯ СОХРАНЕНИЯ (С ГЛИЧ-ЭФФЕКТОМ ПРИХОДА УЛИКИ) ---
  const saveProgress = async (newPoints, clueId = null) => {
    setPoints(newPoints);
    let updatedClues = [...unlockedClues];
    
    if (clueId && !unlockedClues.includes(clueId)) {
      updatedClues.push(clueId);
      setUnlockedClues(updatedClues);
      
      // Показываем захватывающее уведомление
      setInterceptedMsg(`ВНИМАНИЕ! ПЕРЕХВАЧЕНА УЛИКА #${clueId}. ДАННЫЕ ДОБАВЛЕНЫ В ДОСЬЕ.`);
      setTimeout(() => setInterceptedMsg(null), 4000);
      
      setTerminalLogs(prev => [...prev, `> ПЕРЕХВАТ: Обнаружен пакет данных #${clueId}!`, `> СТАТУС: Добавлено в архив Макса.`]);
    }

    await supabase
      .from('profiles')
      .update({ points: newPoints, unlocked_clues: updatedClues })
      .eq('username', username);
  };

  // --- 5. ЛОГИКА ТЕРМИНАЛА ---
  const handleTerminalCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.toLowerCase().trim();
      let res = `> Команда '${cmd}' не распознана.`;
      
      if (cmd === 'help') res = "> Available: help, scan, whoami, clues, secret";
      if (cmd === 'whoami') res = `> Agent: ${username} | Access: ${rank.title}`;
      if (cmd === 'clues') res = `> Progress: ${unlockedClues.length}/10. Keep digging.`;
      if (cmd === 'scan') res = "> Scanning... Found traces of encrypted traffic in Sector 7.";
      if (cmd === 'secret') res = "> ERROR: Unauthorized. Find more clues to decrypt Max's final message.";
      if (cmd === 'clear') { setTerminalLogs([]); setTerminalInput(''); return; }

      setTerminalLogs(prev => [...prev, `> ${terminalInput}`, res].slice(-8));
      setTerminalInput('');
    }
  };

  if (!isLoggedIn) return (
    <div className="login-container">
      <div className="login-box animate-fade">
        <Terminal color="#00ff41" size={48} />
        <h1>CYBER-SHIELD</h1>
        <p>SECURE OPERATING SYSTEM v1.0.5</p>
        <input type="text" placeholder="ID АГЕНТА..." value={username} onChange={(e) => setUsername(e.target.value)} />
        <button className="btn-main" onClick={handleLogin} disabled={loading}>
          {loading ? "АВТОРИЗАЦИЯ..." : "ИНИЦИАЛИЗАЦИЯ"}
        </button>
      </div>
    </div>
  );

  if (showIntro) return <IntroStory onStart={() => setShowIntro(false)} />;

  return (
    <div className="os-wrapper">
      {/* ПЕРЕХВАТ СООБЩЕНИЯ (ГЛИТЧ-ОКНО) */}
      <AnimatePresence>
        {interceptedMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#000', border: '1px solid #ff4d4d', padding: '20px', color: '#ff4d4d', boxShadow: '0 0 30px rgba(255, 77, 77, 0.4)', fontFamily: 'monospace' }}
          >
            <AlertTriangle size={16} style={{marginRight: '10px'}} /> {interceptedMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="sidebar">
        <div className="brand"><Shield color="#00ff41" /> <span>CS-OS</span></div>
        <nav>
          <button className={activeTab === 'desktop' ? 'active' : ''} onClick={() => setActiveTab('desktop')}><Activity size={18} /> Рабочий стол</button>
          <button className={activeTab === 'casefiles' ? 'active' : ''} onClick={() => setActiveTab('casefiles')}><Search size={18} /> Доска улик</button>
          <button className={activeTab === 'missions' ? 'active' : ''} onClick={() => setActiveTab('missions')}><Lock size={18} /> Миссии</button>
          <button className={activeTab === 'leaderboard' ? 'active' : ''} onClick={() => setActiveTab('leaderboard')}><Trophy size={18} /> Рейтинг</button>
          <button className={activeTab === 'academy' ? 'active' : ''} onClick={() => setActiveTab('academy')}><Book size={18} /> Академия</button>
        </nav>
        <div className="user-info" style={{ borderTop: `2px solid ${rank.color}`, background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ fontWeight: 'bold' }}>{username.toUpperCase()}</div>
          <div style={{ fontSize: '10px', color: rank.color }}>{rank.title}</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="system-status">ACCESS: <span className="blink" style={{color: rank.color}}>{rank.desc.toUpperCase()}</span></div>
          <div className="score" style={{color: '#00ff41', fontWeight: 'bold'}}>XP_NET: {points}</div>
        </header>

        <section className="view-area">
          {activeTab === 'desktop' && (
            <div className="window animate-fade">
              <h2>Аналитический терминал: {username}</h2>
              <div className="news-feed">
                <p style={{color: '#ff4d4d'}}>[!] СИСТЕМА: Обнаружены фрагменты данных "Мертвой петли".</p>
                <p>[i] Завершите миссии, чтобы восстановить архив Макса.</p>
              </div>
              <div className="terminal-container" style={{ marginTop: '40px', background: '#000', padding: '20px', border: '1px solid #222', fontFamily: 'monospace' }}>
                <div style={{ height: '120px', overflowY: 'auto', fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                  {terminalLogs.map((log, i) => <div key={i}>{log}</div>)}
                </div>
                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #1a1a1a', paddingTop: '15px' }}>
                  <span style={{ color: '#00ff41' }}>$</span>
                  <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} onKeyDown={handleTerminalCommand} style={{ background: 'none', border: 'none', color: '#eee', outline: 'none', width: '100%', fontSize: '14px' }} placeholder="enter_command..." />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <div className="missions-area">
              {!currentMission ? (
                <div className="missions-grid">
                  <div className="mission-card card-glow">
                    <div className="icon-box"><Lock /></div>
                    <h3>1. Стойкость пароля</h3>
                    <button className="btn-action" onClick={() => setCurrentMission('password')}>Запустить</button>
                  </div>
                  <div className="mission-card card-glow">
                    <div className="icon-box"><Search /></div>
                    <h3>2. Детектор фишинга</h3>
                    <button className="btn-action" onClick={() => setCurrentMission('phishing')}>Запустить</button>
                  </div>
                  <div className="mission-card card-glow">
                    <div className="icon-box"><Activity color="#00ff41" /></div>
                    <h3>3. Сетевой экран</h3>
                    <button className="btn-action" onClick={() => setCurrentMission('firewall')}>Запустить</button>
                  </div>
                  <div className="mission-card card-glow">
                    <div className="icon-box"><Database color="#00ff41" /></div>
                    <h3>4. База данных</h3>
                    <button className="btn-action" onClick={() => setCurrentMission('database')}>Запустить</button>
                  </div>
                  <div className="mission-card card-glow">
                    <div className="icon-box"><MessageSquare color="#00ff41" /></div>
                    <h3>5. Соц. Инженерия</h3>
                    <button className="btn-action" onClick={() => setCurrentMission('social')}>Запустить</button>
                  </div>
                </div>
              ) : (
                <>
                  <button className="btn-back" onClick={() => setCurrentMission(null)}>← ВЫХОД</button>
                  {currentMission === 'password' && <PasswordMission username={username} currentPoints={points} onComplete={(p) => {saveProgress(p, 1); setCurrentMission(null);}} />}
                  {currentMission === 'phishing' && <PhishingMission username={username} currentPoints={points} onComplete={(p) => {saveProgress(p, 2); setCurrentMission(null);}} />}
                  {currentMission === 'firewall' && <FirewallMission username={username} currentPoints={points} onComplete={(p) => {saveProgress(p, 3); setCurrentMission(null);}} />}
                  {currentMission === 'database' && <DatabaseMission username={username} currentPoints={points} onComplete={(p) => {saveProgress(p, 4); setCurrentMission(null);}} />}
                  {currentMission === 'social' && <SocialMission username={username} currentPoints={points} onComplete={(p) => {saveProgress(p, 5); setCurrentMission(null);}} />}
                </>
              )}
            </div>
          )}

          {activeTab === 'casefiles' && <CaseFiles unlockedClues={unlockedClues} />}
          {activeTab === 'leaderboard' && <Leaderboard />}
          {activeTab === 'academy' && <div className="window"><h2>Академия (Under construction)</h2></div>}
        </section>
      </main>
    </div>
  );
}

export default App;