import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Shield, Terminal, Trophy, User, Lock, Search, Activity, Database } from 'lucide-react';
import './App.css';
import CaseFiles from './CaseFiles';
import PasswordMission from './PasswordMission';
import PhishingMission from './PhishingMission';
import FirewallMission from './FirewallMission'; 
import DatabaseMission from './DatabaseMission';

function App() {
  const [activeTab, setActiveTab] = useState('desktop');
  const [username, setUsername] = useState('');
  const [points, setPoints] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [unlockedClues, setUnlockedClues] = useState([1, 2, 3, 4]); // 1,2,3,4 уже открыты для теста

  // Функция входа
  async function handleLogin() {
    if (!username) return alert("Введите кодовое имя!");
    setLoading(true);

    try {
      // Ищем игрока
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (data) {
        setPoints(data.points);
      } else {
        // Создаем нового, если не нашли
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ username, points: 0 }]);
        if (insertError) throw insertError;
        setPoints(0);
      }
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
      alert("Ошибка доступа к базе данных!");
    } finally {
      setLoading(false);
    }
  }

  // Экран авторизации
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <Terminal color="#00ff41" size={48} />
          <h1>CYBER-SHIELD v1.0</h1>
          <p>Введите идентификатор агента для доступа</p>
          <input 
            type="text" 
            placeholder="Имя агента..." 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Загрузка..." : "Инициализация"}
          </button>
        </div>
      </div>
    );
  }

  // Основной интерфейс системы
  return (
    <div className="os-wrapper">
      <aside className="sidebar">
        
        <div className="brand">
          <Shield color="#00ff41" />
          <span>CS-OS</span>
        </div>
        <nav>
          <button className={activeTab === 'desktop' ? 'active' : ''} onClick={() => setActiveTab('desktop')}>
            <Terminal size={18} /> Рабочий стол
          </button>
      <button className={activeTab === 'casefiles' ? 'active' : ''} onClick={() => setActiveTab('casefiles')}>
    <Search size={18} /> Доска улик
</button>
          <button className={activeTab === 'missions' ? 'active' : ''} onClick={() => setActiveTab('missions')}>
            <Lock size={18} /> Миссии
          </button>
          <button className={activeTab === 'leaderboard' ? 'active' : ''} onClick={() => setActiveTab('leaderboard')}>
            <Trophy size={18} /> Рейтинг
          </button>
        </nav>
        <div className="user-info">
          <User size={16} />
          <span>{username}</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="system-status">System: <span className="blink">Protected</span></div>
          <div className="score">XP: {points}</div>
        </header>

        <section className="view-area">
          {activeTab === 'desktop' && (
            <div className="window animate-fade">
              <h2>Добро пожаловать, агент {username}</h2>
              <p>Ваш текущий статус: <strong>Стажер</strong></p>
              <div className="news-feed">
                <p>[!] Обнаружена попытка взлома в секторе B-12...</p>
                <p>[!] Обновите протоколы безопасности в разделе "Миссии".</p>
              </div>
            </div>
          )}

   {activeTab === 'missions' && (
  <div className="missions-area">
    {!currentMission ? (
      <div className="missions-grid">
        {/* Карточка 1 */}
        <div className="mission-card card-glow">
          <div className="icon-box"><Lock /></div>
          <h3>Стойкость пароля</h3>
          <p>Разгадайте шифры системы.</p>
          <button className="btn-action" onClick={() => setCurrentMission('password')}>Запустить</button>
        </div>

        {/* Карточка 2 — НОВАЯ */}
        <div className="mission-card card-glow">
          <div className="icon-box"><Search /></div>
          <h3>Детектор фишинга</h3>
          <p>Выявите шпионские письма.</p>
          <button className="btn-action" onClick={() => setCurrentMission('phishing')}>Запустить</button>
        </div>
          {/* ТРЕТЬЯ КАРТОЧКА (Добавь её сюда) */}
  <div className="mission-card card-glow">
    <div className="icon-box"><Activity color="#00ff41" /></div>
    <h3>Защита периметра</h3>
    <p>Отразите сетевую атаку в реальном времени.</p>
    <button className="btn-action" onClick={() => setCurrentMission('firewall')}>Запустить</button>
  </div>
  {/* Карточка 3 — SQL Forensics */}
<div className="mission-card card-glow">
    <div className="icon-box"><Database color="#00ff41" /></div>
    <h3>База данных</h3>
    <p>Восстановите данные и найдите токен.</p>
    <button className="btn-action" onClick={() => setCurrentMission('database')}>Запустить</button>
</div>

      </div>

      
      
    ) : (
      <>
        <button className="btn-back" onClick={() => setCurrentMission(null)}>← ВЫХОД ИЗ МИССИИ</button>
        {currentMission === 'password' && (
          <PasswordMission 
            username={username} 
            currentPoints={points} 
            onComplete={(newPoints) => setPoints(newPoints)} 
          />
        )}
        {currentMission === 'phishing' && (
          <PhishingMission 
            username={username} 
            currentPoints={points} 
            onComplete={(newPoints) => setPoints(newPoints)} 
          />
        )}
      </>
    )}
    {/* ТРЕТЬЕ УСЛОВИЕ (Добавь его сюда) */}
{currentMission === 'firewall' && (
  <FirewallMission 
    username={username} 
    currentPoints={points} 
    onComplete={(newTotalXP) => setPoints(newTotalXP)}
  />
)}
{currentMission === 'database' && (
    <DatabaseMission 
        username={username} 
        currentPoints={points} 
        onComplete={(newPoints) => {
            setPoints(newPoints);
            setCurrentMission(null);
        }} 
    />
)}
  </div>
)}

          {activeTab === 'leaderboard' && (
            <div className="window">
              <h2>Топ агентов системы</h2>
              <p>Раздел в разработке...</p>
            </div>
          )}
          {activeTab === 'casefiles' && <CaseFiles unlockedClues={unlockedClues} />}
        </section>
      </main>
    </div>
  );
}

export default App;