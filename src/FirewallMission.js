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
        <div className="window animate-fade" style={{ textAlign: 'center', padding: '50px', background: 'radial-gradient(circle, #0a110a 0%, #050505 100%)' }}>
            <Cpu size={80} color="#00ff41" />
            <h1 className="glitch-text" style={{ color: '#00ff41', marginTop: '20px' }}>ПРОТОКОЛ: ОВЕРРАЙД</h1>
            <p style={{ maxWidth: '600px', margin: '30px auto', color: '#888', fontSize: '18px', lineHeight: '1.6' }}>
                Макс оставил пакет данных в защищенном хранилище. <br/>
                Система Neocorp обнаружила утечку и активировала 3 уровня защиты. 
                <br/><br/>
                <b>Миссия:</b> Перехватить код, синхронизировать частоту и взломать ядро безопасности.
            </p>
            <button className="btn-main" onClick={() => setStage(1)}>НАЧАТЬ ПРОНИКНОВЕНИЕ</button>
        </div>
    );

    return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #333' }}>
            
            {/* ИНДИКАТОР ЭТАПОВ */}
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'center', gap: '40px', background: '#0a0a0a', padding: '15px' }}>
                <span style={{ color: stage >= 1 ? '#00ff41' : '#222' }}>[1] ПОРТ</span>
                <span style={{ color: stage >= 2 ? '#00ff41' : '#222' }}>[2] СИГНАЛ</span>
                <span style={{ color: stage >= 3 ? '#00ff41' : '#222' }}>[3] ЯДРО</span>
                <div style={{ marginLeft: 'auto', color: '#ff4d4d' }}>HEALTH: {health}%</div>
            </div>

            <div style={{ flex: 1, padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                
                {/* ПОМОЩЬ (ПОДСКАЗКА С ОТВЕТОМ) */}
                <button onClick={() => setShowHint(!showHint)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}>
                    <HelpCircle color="#f7b500" size={24} />
                </button>

                <AnimatePresence>
                    {showHint && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} 
                            style={{ position: 'absolute', right: '50px', top: '10px', width: '250px', background: '#1a1a00', border: '1px solid #f7b500', padding: '15px', color: '#f7b500', fontSize: '12px', zIndex: 100 }}>
                            <b>ДЕШИФРОВКА ПОДСКАЗКИ:</b><br/>
                            {stage === 1 && `Ищите зеленое число в терминале слева (напр: ${targetCode})`}
                            {stage === 2 && `Установите ползунок на частоту ${TARGET_FREQ} MHz`}
                            {stage === 3 && `Нажмите кнопки в порядке: Верхний ряд (3-я), Второй ряд (4-я), Нижний ряд (2-я), Третий ряд (1-я)`}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ЭТАП 1: ТЕРМИНАЛ */}
                {stage === 1 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px', width: '100%' }}>
                        <div style={{ background: '#000', padding: '20px', border: '1px solid #222', height: '300px', overflow: 'hidden', fontFamily: 'monospace', fontSize: '13px', color: '#333' }}>
                            {logs.map((l, i) => <div key={i} style={{ color: l.includes(targetCode) ? '#00ff41' : 'inherit' }}>{l}</div>)}
                        </div>
                        <div className="window" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Hash size={40} color="#00ff41" style={{ margin: '0 auto 20px' }} />
                            <h3 style={{ fontSize: '12px', marginBottom: '20px' }}>ВВЕДИТЕ ПОРТ ДОСТУПА</h3>
                            <input type="text" value={authCode} onChange={handleAuth} maxLength="3" style={{ background: '#000', border: '2px solid #00ff41', color: '#00ff41', padding: '15px', fontSize: '32px', textAlign: 'center', outline: 'none' }} autoFocus />
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 80px)', gap: '10px', background: '#0a0a0a', padding: '20px', border: '1px solid #333' }}>
                            {Array.from({ length: 16 }).map((_, i) => (
                                <motion.div key={i} whileTap={{ scale: 0.9 }} onClick={() => handleMatrixClick(i + 1)}
                                    style={{ height: '80px', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    background: matrixClicks.includes(i + 1) ? '#00ff41' : '#000',
                                    color: matrixClicks.includes(i + 1) ? '#000' : '#444', fontSize: '18px', fontWeight: 'bold' }}>
                                    {i + 1}
                                </motion.div>
                            ))}
                        </div>
                        <p style={{ marginTop: '20px', color: '#444' }}>Введите 4-значную комбинацию для взлома.</p>
                    </div>
                )}

                {/* ФИНАЛ */}
                {stage === 4 && (
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
                        <CheckCircle2 size={100} color="#00ff41" style={{ margin: '0 auto' }} />
                        <h1 className="glitch-text" style={{ color: '#00ff41', margin: '30px 0' }}>ДОСТУП ПОЛУЧЕН</h1>
                        <p style={{ fontSize: '18px', color: '#eee' }}>Защита Neocorp пала. Улика #3 успешно извлечена.</p>
                        <button className="btn-huge ready" style={{ marginTop: '40px', padding: '20px 60px' }} onClick={() => onComplete(currentPoints + 3000)}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default FirewallMission;