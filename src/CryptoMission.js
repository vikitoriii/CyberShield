import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Zap, Activity, CheckCircle2, ShieldAlert, Target, Terminal, ChevronRight, Lock, HelpCircle } from 'lucide-react';

const CryptoMission = ({ username, currentPoints, onComplete }) => {
    const [stage, setStage] = useState(0); // 0: Intro, 1: Signal, 2: Decrypt, 3: Map, 4: Win
    const [frequency, setFrequency] = useState(0);
    const [shift, setShift] = useState(0);
    const [selectedSector, setSelectedSector] = useState(null);
    const [xpEarned, setXpEarned] = useState(0);
    const [showHint, setShowHint] = useState(false);

    // Данные для этапов
    const TARGET_FREQ = 104; // Целевая частота (104.4 MHz)
    const TARGET_SHIFT = 13; // Ключ сдвига ROT13
    const encryptedText = "ZNK VF VA FRPGBE FRIRA"; // "MAX IS IN SECTOR SEVEN"
    
    // Функция сдвига для этапа 2
    const decrypt = (text, s) => {
        return text.split('').map(char => {
            if (char === ' ') return ' ';
            let code = char.charCodeAt(0);
            let shiftedCode = code + s;
            if (shiftedCode > 90) shiftedCode = 65 + (shiftedCode - 91);
            return String.fromCharCode(shiftedCode);
        }).join('');
    };

    const handleFinish = () => {
        onComplete(currentPoints + xpEarned + 2000);
    };

    // Вводный экран
    if (stage === 0) return (
        <div className="window animate-fade mission-intro">
            <div className="mission-intro-icon">
                <Radio size={72} color="#f7b500" />
            </div>
            <h1 className="glitch-text mission-intro-title" style={{ color: '#f7b500' }}>КРИПТОГРАФИЯ</h1>
            <div className="mission-intro-card">
                <div className="mission-intro-label" style={{ color: '#f7b500' }}>
                    МИССИЯ 06
                </div>
                <p className="mission-intro-text">
                    Агент, мы обнаружили скрытую передачу данных на частоте <b style={{ color: '#f7b500' }}>104.4 MHz</b>. 
                    Похоже, Макс пытается выйти на связь, но сигнал глушат. 
                    Сообщение зашифровано классическим шифром — нужно найти ключ.
                </p>
            </div>
            <p className="mission-intro-hint">
                Вам предстоит: <b>перехватить</b> волну на нужной частоте, <b>взломать</b> шифр Цезаря и <b>указать</b> местоположение цели.
            </p>
            <button className="btn-main" onClick={() => setStage(1)}>НАЧАТЬ ПЕРЕХВАТ</button>
        </div>
    );

    return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* ИНДИКАТОР ЭТАПОВ */}
            <div className="mission-stage-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '40px' }}>
                    <div className={`mission-stage-item ${stage >= 1 ? 'active' : 'pending'}`}>
                        <span>[1] СИГНАЛ</span>
                    </div>
                    <div className={`mission-stage-item ${stage >= 2 ? 'active' : 'pending'}`}>
                        <span>[2] ВЗЛОМ</span>
                    </div>
                    <div className={`mission-stage-item ${stage >= 3 ? 'active' : 'pending'}`}>
                        <span>[3] АНАЛИЗ</span>
                    </div>
                </div>
                {stage > 0 && stage < 4 && (
                    <button onClick={() => setShowHint(!showHint)} style={{ background: 'none', border: 'none', color: showHint ? '#f7b500' : '#444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', letterSpacing: '1px' }}>
                        <HelpCircle size={14} /> ПОДСКАЗКА
                    </button>
                )}
            </div>

            {showHint && stage > 0 && stage < 4 && (
                <div style={{ background: '#000', border: '1px solid #f7b500', padding: '14px', color: '#f7b500', fontSize: '11px', lineHeight: '1.5', textAlign: 'center' }}>
                    {stage === 1 && 'Настройте тюнер на частоту ~22 на слайдере. Это соответствует 104.4 MHz. Ищите момент, когда амплитуда максимальна.'}
                    {stage === 2 && 'Это шифр Цезаря (ROT13). Каждая буква сдвинута на 13 позиций. Попробуйте сдвиг 13 — это универсальный ключ ROT13.'}
                    {stage === 3 && 'Расшифрованное сообщение указывает на СЕКТОР 7. Выберите ячейку SEC_7 на сетке.'}
                </div>
            )}

            <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* ЭТАП 1: НАСТРОЙКА ВОЛНЫ */}
                {stage === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
                        <h2 style={{ color: '#00ff41', marginBottom: '40px' }}>ЭТАП 1: ЗАХВАТ ЧАСТОТЫ</h2>
                        <div style={{ height: '120px', background: '#000', border: '1px solid #222', marginBottom: '20px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             {/* Имитация осциллографа */}
                             <motion.div 
                                animate={{ height: [20, 100, 40, 120, 20] }} 
                                transition={{ repeat: Infinity, duration: 1 }}
                                style={{ width: '2px', background: '#00ff41', margin: '0 5px', opacity: Math.abs(frequency - 104) < 5 ? 1 : 0.2 }} 
                             />
                             <div style={{ fontSize: '32px', color: '#00ff41', fontFamily: 'monospace', zIndex: 2 }}>
                                {100 + (frequency/5).toFixed(1)} MHz
                             </div>
                        </div>
                        <input 
                            type="range" min="0" max="100" value={frequency} 
                            onChange={(e) => setFrequency(parseInt(e.target.value))}
                            style={{ width: '100%', accentColor: '#00ff41' }}
                        />
                        <p style={{ marginTop: '20px', color: '#666' }}>Настройте тюнер на максимальную амплитуду (104.4 MHz)</p>
                        {Math.abs(frequency - 22) < 2 && (
                            <button className="btn-huge ready animate-fade" style={{ marginTop: '20px' }} onClick={() => setStage(2)}>ЗАХВАТИТЬ ПАКЕТ</button>
                        )}
                    </motion.div>
                )}

                {/* ЭТАП 2: ДЕШИФРОВКА ЦЕЗАРЯ */}
                {stage === 2 && (
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
                        <h2 style={{ color: '#00ff41', marginBottom: '20px' }}>ЭТАП 2: ДЕШИФРОВКА</h2>
                        <div style={{ background: '#000', padding: '20px', border: '1px dashed #00ff41', marginBottom: '20px' }}>
                            <div style={{ fontSize: '10px', color: '#444', textAlign: 'left', marginBottom: '10px' }}>ENCRYPTED_DATA_STREAM:</div>
                            <div style={{ fontSize: '20px', color: '#fff', letterSpacing: '3px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                {decrypt(encryptedText, shift)}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <span>СДВИГ КЛЮЧА:</span>
                            <input type="range" min="0" max="25" value={shift} onChange={(e) => setShift(parseInt(e.target.value))} style={{ flex: 1, accentColor: '#f7b500' }} />
                            <span style={{ color: '#f7b500', fontWeight: 'bold' }}>{shift}</span>
                        </div>
                        {shift === 13 && (
                            <button className="btn-huge ready animate-fade" style={{ marginTop: '40px' }} onClick={() => setStage(3)}>ИЗВЛЕЧЬ КООРДИНАТЫ</button>
                        )}
                    </motion.div>
                )}

                {/* ЭТАП 3: КАРТА СЕКТОРОВ */}
                {stage === 3 && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#00ff41', marginBottom: '10px' }}>ЭТАП 3: ОПРЕДЕЛЕНИЕ ЦЕЛИ</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Получено сообщение: "MAX IS IN SECTOR SEVEN". Выберите цель на сетке.</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 90px)', gap: '8px', background: '#111', padding: '16px', border: '1px solid #333', justifyContent: 'center' }}>
                            {[1,2,3,4,5,6,7,8,9].map(num => (
                                <div 
                                    key={num}
                                    onClick={() => setSelectedSector(num)}
                                    style={{ 
                                        height: '90px', border: '1px solid #222', display: 'flex', alignItems: 'center', 
                                        justifyContent: 'center', cursor: 'pointer',
                                        background: selectedSector === num ? (num === 7 ? '#00ff41' : '#ff4d4d') : '#000',
                                        color: selectedSector === num ? '#000' : '#444',
                                        fontWeight: 'bold', fontSize: '14px'
                                    }}
                                >
                                    SEC_{num}
                                </div>
                            ))}
                        </div>

                        {selectedSector === 7 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '30px' }}>
                                <div style={{ color: '#00ff41', marginBottom: '15px' }}>ЦЕЛЬ ПОДТВЕРЖДЕНА. ШТУРМОВАЯ ГРУППА ВЫЕХАЛА.</div>
                                <button className="btn-huge ready" onClick={() => setStage(4)}>ЗАВЕРШИТЬ ОПЕРАЦИЮ</button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* ФИНАЛ: ПОБЕДА */}
                {stage === 4 && (
                    <div className="mission-win">
                        <div className="mission-win-icon">
                            <CheckCircle2 size={72} color="#00ff41" />
                        </div>
                        <h1 className="glitch-text mission-win-title" style={{ color: '#00ff41' }}>МИССИЯ ВЫПОЛНЕНА</h1>
                        <p className="mission-win-subtitle">
                            Мы расшифровали сообщение Макса: <b style={{ color: '#00ff41' }}>MAX_ALIVE_2024!!!</b> — он жив!
                        </p>
                        <div className="mission-clue">
                            <div className="mission-clue-label" style={{ color: '#00ff41' }}>УЛИКА #6</div>
                            <p className="mission-clue-text">
                                Сообщение Макса зашифровано в повреждённом секторе памяти. 
                                Он жив и пытается выйти на связь!
                            </p>
                        </div>
                        <button className="btn-huge" onClick={handleFinish}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
                    </div>
                )}
            </div>

            {/* БОКОВАЯ ПОДСКАЗКА */}
            {stage > 0 && stage < 4 && (
                <div style={{ padding: '15px', background: '#0a0a0a', borderTop: '1px solid #222', fontSize: '11px', color: '#444', textAlign: 'center' }}>
                    <Terminal size={12} style={{marginRight: '5px'}} /> СИСТЕМА CS-OS: ВЫПОЛНЯЕТСЯ ЭТАП {stage} ИЗ 3...
                </div>
            )}
        </div>
    );
};

export default CryptoMission;