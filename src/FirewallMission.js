import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Activity, Terminal, CheckCircle2, Cpu, HelpCircle, Info, Radio, Lock, Unlock, Hash } from 'lucide-react';

const FirewallMission = ({ username, currentPoints, onComplete }) => {
    const [stage, setStage] = useState(0); // 0: Intro, 1: Port, 2: Sync, 3: Matrix, 4: Win
    const [authCode, setAuthCode] = useState("");
    const [targetCode, setTargetCode] = useState("");
    const [logs, setLogs] = useState([]);
    const [frequency, setFrequency] = useState(10);
    const [matrixClicks, setMatrixClicks] = useState([]);
    const [showHint, setShowHint] = useState(false);
    const [health, setHealth] = useState(100);

    const TARGET_FREQ = 74; 
    const TARGET_SEQUENCE = [2, 7, 13, 8]; // Прямой ответ для 3 этапа

    // ЭТАП 1: Генерация логов
    useEffect(() => {
        if (stage === 1) {
            const code = Math.floor(100 + Math.random() * 899).toString();
            setTargetCode(code);
            const interval = setInterval(() => {
                const newLog = `> [${new Date().toLocaleTimeString()}] TRACE_PKG: port_${Math.random() > 0.8 ? code : Math.floor(Math.random()*9000)} -> status_OK`;
                setLogs(prev => [newLog, ...prev].slice(0, 10));
            }, 400);
            return () => clearInterval(interval);
        }
    }, [stage]);

    const handleAuth = (e) => {
        setAuthCode(e.target.value);
        if (e.target.value === targetCode) setStage(2);
    };

    // ЭТАП 3: Логика кликов по матрице
    const handleMatrixClick = (id) => {
        if (matrixClicks.includes(id)) return;
        const newClicks = [...matrixClicks, id];
        setMatrixClicks(newClicks);

        // Проверка последовательности
        if (newClicks[newClicks.length - 1] !== TARGET_SEQUENCE[newClicks.length - 1]) {
            setMatrixClicks([]); // Сброс при ошибке
            setHealth(h => Math.max(0, h - 20));
        } else if (newClicks.length === 4) {
            setStage(4);
        }
    };

    if (stage === 0) return (
        <div className="window animate-fade mission-intro">
            <div className="mission-intro-icon">
                <Cpu size={72} color="#00ff41" />
            </div>
            <h1 className="glitch-text mission-intro-title" style={{ color: '#00ff41' }}>СЕТЕВОЙ ЭКРАН</h1>
            <div className="mission-intro-card">
                <div className="mission-intro-label" style={{ color: '#00ff41' }}>
                    МИССИЯ 03
                </div>
                <p className="mission-intro-text">
                    Макс оставил пакет данных в защищенном хранилище в <b style={{ color: '#00ff41' }}>Секторе 7</b> — 
                    старом здании Neocorp. Система обнаружила утечку и активировала <b style={{ color: '#ff4d4d' }}>3 уровня защиты</b>: 
                    портовую фильтрацию, частотную синхронизацию и матричный замок.
                </p>
            </div>
            <p className="mission-intro-hint">
                Перехватите код, синхронизируйте частоту и взломайте ядро безопасности. 
                Используйте <b style={{ color: '#f7b500' }}>подсказки</b> на каждом этапе.
            </p>
            <button className="btn-main" onClick={() => setStage(1)}>НАЧАТЬ ПРОНИКНОВЕНИЕ</button>
        </div>
    );

    return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #333' }}>
            
            {/* ИНДИКАТОР ЭТАПОВ */}
            <div className="mission-stage-bar">
                <div className={`mission-stage-item ${stage >= 1 ? 'active' : 'pending'}`}>
                    <span>[1] ПОРТ</span>
                </div>
                <div className={`mission-stage-item ${stage >= 2 ? 'active' : 'pending'}`}>
                    <span>[2] СИГНАЛ</span>
                </div>
                <div className={`mission-stage-item ${stage >= 3 ? 'active' : 'pending'}`}>
                    <span>[3] ЯДРО</span>
                </div>
                <div style={{ marginLeft: 'auto', color: '#ff4d4d', fontSize: '11px', letterSpacing: '1px', fontWeight: 600 }}>
                    HEALTH: {health}%
                </div>
            </div>

            <div style={{ flex: 1, padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                
                {/* ПОМОЩЬ (ПОДСКАЗКА С ОТВЕТОМ) */}
                <button onClick={() => setShowHint(!showHint)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}>
                    <HelpCircle color="#f7b500" size={24} />
                </button>

                <AnimatePresence>
                    {showHint && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} 
                            style={{ position: 'absolute', right: '50px', top: '10px', width: '280px', background: '#1a1a00', border: '1px solid #f7b500', padding: '15px', color: '#f7b500', fontSize: '11px', zIndex: 100, lineHeight: '1.5' }}>
                            <b>ПОДСКАЗКА:</b><br/>
                            {stage === 1 && 'Ищите число, которое выделяется зелёным цветом среди серых логов. Оно появляется и исчезает — будьте внимательны.'}
                            {stage === 2 && 'Настройте ползунок так, чтобы амплитуда волны была максимальной. Частота около 74 на слайдере.'}
                            {stage === 3 && 'Последовательность: 2 → 7 → 13 → 8. Нажимайте по порядку, при ошибке начинайте заново.'}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ЭТАП 1: ТЕРМИНАЛ */}
                {stage === 1 && (
                    <div className="firewall-stage-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', width: '100%' }}>
                        <div style={{ background: '#000', padding: '15px', border: '1px solid #222', height: '250px', overflow: 'auto', fontFamily: 'monospace', fontSize: '12px', color: '#333' }}>
                            {logs.map((l, i) => <div key={i} style={{ color: l.includes(targetCode) ? '#00ff41' : 'inherit', marginBottom: '2px' }}>{l}</div>)}
                        </div>
                        <div className="window" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Hash size={40} color="#00ff41" style={{ margin: '0 auto 20px' }} />
                            <h3 style={{ fontSize: '12px', marginBottom: '20px' }}>ВВЕДИТЕ ПОРТ ДОСТУПА</h3>
                            <input type="text" value={authCode} onChange={handleAuth} maxLength="3" style={{ background: '#000', border: '2px solid #00ff41', color: '#00ff41', padding: '15px', fontSize: '28px', textAlign: 'center', outline: 'none' }} />
                        </div>
                    </div>
                )}

                {/* ЭТАП 2: ЧАСТОТА (ВИЗУАЛЬНО) */}
                {stage === 2 && (
                    <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
                        <Radio size={50} color="#00ff41" style={{ marginBottom: '20px' }} />
                        <h2>СИНХРОНИЗАЦИЯ ЧАСТОТЫ</h2>
                        <div style={{ height: '100px', background: '#000', margin: '30px 0', border: '1px solid #222', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                             {/* Статическая волна */}
                             <div style={{ width: '100%', height: '2px', background: '#111', position: 'absolute' }} />
                             <motion.div animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 0.5 }} style={{ width: '50px', height: '100%', background: 'linear-gradient(90deg, transparent, #00ff41, transparent)', opacity: 0.2 }} />
                             
                             <div style={{ width: '100%', fontSize: '40px', fontWeight: 'bold', color: frequency === TARGET_FREQ ? '#00ff41' : '#444', fontFamily: 'monospace' }}>
                                {100 + frequency}.4 MHz
                             </div>
                        </div>
                        <input type="range" min="0" max="100" value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} style={{ width: '100%', accentColor: '#00ff41' }} />
                        {frequency === TARGET_FREQ && (
                            <button className="btn-huge ready animate-fade" style={{ marginTop: '30px' }} onClick={() => setStage(3)}>ПОДТВЕРДИТЬ СИГНАЛ</button>
                        )}
                    </div>
                )}

                {/* ЭТАП 3: МАТРИЦА (ЯДРО) */}
                {stage === 3 && (
                    <div style={{ textAlign: 'center' }}>
                        <Lock size={40} color="#ff4d4d" style={{ marginBottom: '20px' }} />
                        <h2 style={{ marginBottom: '30px' }}>ИНЪЕКЦИЯ КЛЮЧА В ЯДРО</h2>
                        <div className="firewall-matrix" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 80px)', gap: '8px', background: '#0a0a0a', padding: '15px', border: '1px solid #333', justifyContent: 'center' }}>
                            {Array.from({ length: 16 }).map((_, i) => (
                                <motion.div key={i} whileTap={{ scale: 0.9 }} onClick={() => handleMatrixClick(i + 1)}
                                    style={{ height: '70px', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    background: matrixClicks.includes(i + 1) ? '#00ff41' : '#000',
                                    color: matrixClicks.includes(i + 1) ? '#000' : '#444', fontSize: '16px', fontWeight: 'bold' }}>
                                    {i + 1}
                                </motion.div>
                            ))}
                        </div>
                        <p style={{ marginTop: '20px', color: '#444' }}>Введите 4-значную комбинацию для взлома.</p>
                    </div>
                )}

                {/* ФИНАЛ */}
                {stage === 4 && (
                    <div className="mission-win">
                        <div className="mission-win-icon">
                            <CheckCircle2 size={72} color="#00ff41" />
                        </div>
                        <h1 className="glitch-text mission-win-title" style={{ color: '#00ff41' }}>ДОСТУП ПОЛУЧЕН</h1>
                        <p className="mission-win-subtitle">
                            Мы пробили файрвол и нашли сервер в <b style={{ color: '#4d94ff' }}>Секторе 7</b> — старом здании Neocorp.
                        </p>
                        <div className="mission-clue">
                            <div className="mission-clue-label" style={{ color: '#00ff41' }}>УЛИКА #3</div>
                            <p className="mission-clue-text">
                                Сигнал прыгал по прокси-серверам. Точка выхода: <b style={{ color: '#4d94ff' }}>Сектор 7</b>. 
                                Похоже, это старое здание Neocorp.
                            </p>
                        </div>
                        <button className="btn-huge" onClick={() => onComplete(currentPoints + 3000)}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default FirewallMission;