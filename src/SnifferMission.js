import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Lock, CheckCircle2, HelpCircle, AlertTriangle, 
    Terminal, RotateCcw, Shield
} from 'lucide-react';

const SnifferMission = ({ username, currentPoints, onComplete }) => {
    const [stage, setStage] = useState(0);
    const [code, setCode] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [currentGuess, setCurrentGuess] = useState([]);
    const [showHint, setShowHint] = useState(false);
    const [attemptsLeft, setAttemptsLeft] = useState(10);
    const [gameWon, setGameWon] = useState(false);

    const CODE_LENGTH = 4;
    const MAX_ATTEMPTS = 10;

    useEffect(() => {
        if (stage === 1) {
            const newCode = Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * 10));
            setCode(newCode);
            setAttempts([]);
            setCurrentGuess([]);
            setAttemptsLeft(MAX_ATTEMPTS);
            setGameWon(false);
        }
    }, [stage]);

    const handleDigit = (digit) => {
        if (currentGuess.length < CODE_LENGTH && !gameWon) {
            setCurrentGuess([...currentGuess, digit]);
        }
    };

    const handleClear = () => {
        setCurrentGuess([]);
    };

    const handleSubmit = () => {
        if (currentGuess.length !== CODE_LENGTH) return;

        const feedback = currentGuess.map((digit, i) => {
            if (digit === code[i]) return 'correct';
            if (code.includes(digit)) return 'present';
            return 'absent';
        });

        const newAttempt = { guess: [...currentGuess], feedback };
        const newAttempts = [...attempts, newAttempt];
        setAttempts(newAttempts);
        setCurrentGuess([]);
        setAttemptsLeft(prev => prev - 1);

        if (feedback.every(f => f === 'correct')) {
            setGameWon(true);
            setTimeout(() => setStage(2), 1500);
        } else if (newAttempts.length >= MAX_ATTEMPTS) {
            setTimeout(() => setStage(3), 1000);
        }
    };

    const getFeedbackColor = (f) => {
        switch(f) {
            case 'correct': return '#00ff41';
            case 'present': return '#f7b500';
            default: return '#333';
        }
    };

    // ЭКРАН 0: ВСТУПЛЕНИЕ
    if (stage === 0) return (
        <div className="window animate-fade" style={{ textAlign: 'center', padding: '60px', background: 'radial-gradient(circle, #1a0a0a 0%, #050505 100%)' }}>
            <Lock size={80} color="#ff4d4d" />
            <h1 className="glitch-text" style={{ color: '#ff4d4d', marginTop: '20px' }}>ВЗЛОМ СЕЙФА</h1>
            <div style={{ maxWidth: '700px', margin: '30px auto', textAlign: 'left' }}>
                <div style={{ background: '#000', border: '1px solid #222', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ color: '#f7b500', fontSize: '11px', letterSpacing: '2px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={14} /> МИССИЯ 8
                    </div>
                    <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                        По координатам из миссии 7 мы нашли серверную комнату Neocorp в <b style={{ color: '#00ff41' }}>Париже</b>. 
                        Внутри — зашифрованный архив <b style={{ color: '#4d94ff' }}>"Чёрное зеркало"</b> Макса. 
                        Но он защищён <b style={{ color: '#ff4d4d' }}>4-значным кодом</b>.
                    </p>
                </div>
                <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
                    <b>Задача:</b> Взломать сейф и получить пароль <b style={{ color: '#00ff41' }}>LOOP_BREAKER_2024</b> — ключ к архиву Макса.
                </p>
                <p style={{ color: '#666', fontSize: '12px', marginTop: '15px' }}>
                    После каждой попытки вы получите подсказку:
                    <br/>
                    <span style={{ color: '#00ff41' }}>●</span> Зелёная — цифра на своём месте<br/>
                    <span style={{ color: '#f7b500' }}>●</span> Жёлтая — цифра есть, но не там<br/>
                    <span style={{ color: '#333' }}>●</span> Серая — такой цифры нет
                </p>
            </div>
            <button className="btn-main" onClick={() => setStage(1)}>НАЧАТЬ ВЗЛОМ</button>
        </div>
    );

    // ЭКРАН 1: ИГРА
    if (stage === 1) return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><Terminal size={14} /> ВЗЛОМ СЕЙФА — ПОПЫТКА {attempts.length + 1}/{MAX_ATTEMPTS}</span>
                <span style={{ color: attemptsLeft <= 3 ? '#ff4d4d' : '#00ff41' }}>ОСТАЛОСЬ: {attemptsLeft}</span>
            </div>

            <div className="sniffer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px', flex: 1, minHeight: 0 }}>
                {/* Левая: история попыток */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Поле ввода */}
                    <div style={{ background: '#000', padding: '30px', border: '1px solid #222', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: '#444', marginBottom: '15px', letterSpacing: '2px' }}>ВВЕДИТЕ КОД</div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
                            {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={currentGuess[i] !== undefined ? { scale: 0.5 } : {}}
                                    animate={currentGuess[i] !== undefined ? { scale: 1 } : {}}
                                    style={{ 
                                        width: '60px', height: '70px', 
                                        background: '#111', border: '2px solid #333',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '28px', fontWeight: 'bold', color: '#fff'
                                    }}
                                >
                                    {currentGuess[i] !== undefined ? currentGuess[i] : ''}
                                </motion.div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button className="btn-action" onClick={handleClear} style={{ color: '#ff4d4d', borderColor: '#ff4d4d' }}>
                                <RotateCcw size={14} /> СТЕРЕТЬ
                            </button>
                            <button 
                                className="btn-main" 
                                onClick={handleSubmit} 
                                disabled={currentGuess.length !== CODE_LENGTH}
                                style={{ flex: 1, maxWidth: '200px', background: currentGuess.length === CODE_LENGTH ? '#00ff41' : '#333' }}
                            >
                                ПРОВЕРИТЬ
                            </button>
                        </div>
                    </div>

                    {/* История попыток */}
                    <div style={{ flex: 1, background: '#0a0a0a', border: '1px solid #222', padding: '15px', overflowY: 'auto' }}>
                        <div style={{ fontSize: '10px', color: '#444', marginBottom: '15px', letterSpacing: '1px' }}>ИСТОРИЯ ПОПЫТОК</div>
                        {attempts.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#333', padding: '40px' }}>
                                <Lock size={40} style={{ marginBottom: '10px', opacity: 0.3 }} />
                                <div>Пока нет попыток</div>
                            </div>
                        ) : (
                            attempts.map((attempt, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ 
                                        display: 'flex', alignItems: 'center', gap: '15px', 
                                        padding: '12px', marginBottom: '8px',
                                        background: '#111', borderLeft: '3px solid #333'
                                    }}
                                >
                                    <span style={{ color: '#444', fontSize: '10px', minWidth: '20px' }}>#{idx + 1}</span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {attempt.guess.map((d, i) => (
                                            <div key={i} style={{ 
                                                width: '35px', height: '40px', 
                                                background: getFeedbackColor(attempt.feedback[i]) + '22',
                                                border: `2px solid ${getFeedbackColor(attempt.feedback[i])}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '16px', fontWeight: 'bold', color: getFeedbackColor(attempt.feedback[i])
                                            }}>
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                                        {attempt.feedback.map((f, i) => (
                                            <div key={i} style={{ 
                                                width: '10px', height: '10px', borderRadius: '50%',
                                                background: getFeedbackColor(f)
                                            }} />
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Правая: клавиатура + подсказка */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* Клавиатура */}
                    <div style={{ background: '#111', padding: '20px', border: '1px solid #222' }}>
                        <div style={{ fontSize: '10px', color: '#444', marginBottom: '15px', letterSpacing: '1px' }}>КЛАВИАТУРА</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(digit => (
                                <motion.button 
                                    key={digit}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDigit(digit)}
                                    style={{ 
                                        height: '50px', background: '#222', border: '1px solid #333',
                                        color: '#fff', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
                                    }}
                                >
                                    {digit}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Статус */}
                    <div style={{ background: '#0a0a0a', padding: '20px', border: '1px solid #222' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'center' }}>
                            <div>
                                <div style={{ color: '#444', fontSize: '10px' }}>ПОПЫТОК</div>
                                <div style={{ color: '#f7b500', fontSize: '24px', fontWeight: 'bold' }}>{attempts.length}</div>
                            </div>
                            <div>
                                <div style={{ color: '#444', fontSize: '10px' }}>ОСТАЛОСЬ</div>
                                <div style={{ color: attemptsLeft <= 3 ? '#ff4d4d' : '#00ff41', fontSize: '24px', fontWeight: 'bold' }}>{attemptsLeft}</div>
                            </div>
                        </div>
                    </div>

                    {/* Подсказка */}
                    <div style={{ background: '#0a0a0a', padding: '15px', border: '1px solid #222' }}>
                        <button onClick={() => setShowHint(!showHint)} className="lockdown-btn" style={{ marginBottom: showHint ? '10px' : 0 }}>
                            <HelpCircle size={14} style={{ marginRight: '8px' }} />ПОДСКАЗКА
                        </button>
                        {showHint && (
                            <div style={{ background: '#000', border: '1px solid #f7b500', padding: '12px', color: '#f7b500', fontSize: '11px', lineHeight: '1.5' }}>
                                <b>Совет:</b> Используйте метод исключения. Если цифра серая — она не в коде вообще. 
                                Если жёлтая — она есть, но попробуйте другой слот. Зелёная — оставьте на месте!
                            </div>
                        )}
                    </div>

                    {/* Легенда */}
                    <div style={{ background: '#0a0a0a', padding: '15px', border: '1px solid #222', fontSize: '11px' }}>
                        <div style={{ color: '#444', marginBottom: '10px', letterSpacing: '1px' }}>ЛЕГЕНДА:</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ff41' }} />
                            <span style={{ color: '#888' }}>На своём месте</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f7b500' }} />
                            <span style={{ color: '#888' }}>Есть, но не там</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#333' }} />
                            <span style={{ color: '#888' }}>Нет в коде</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // ЭКРАН 2: ПОБЕДА
    if (stage === 2) return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="window animate-fade mission-win">
            <div className="mission-win-icon">
                <CheckCircle2 size={72} color="#00ff41" />
            </div>
            <h1 className="glitch-text mission-win-title" style={{ color: '#00ff41' }}>СЕЙФ ВЗЛОМАН</h1>
            
            <div className="mission-stats">
                <div className="mission-stat">
                    <div className="mission-stat-label">КОД</div>
                    <div className="mission-stat-value" style={{ color: '#00ff41', fontFamily: 'monospace' }}>{code.join('-')}</div>
                </div>
                <div className="mission-stat">
                    <div className="mission-stat-label">ПОПЫТОК</div>
                    <div className="mission-stat-value" style={{ color: '#f7b500' }}>{attempts.length}</div>
                </div>
                <div className="mission-stat">
                    <div className="mission-stat-label">ОЧКИ</div>
                    <div className="mission-stat-value" style={{ color: '#00ff41' }}>{(MAX_ATTEMPTS - attempts.length + 1) * 500}</div>
                </div>
            </div>

            <div className="mission-clue">
                <div className="mission-clue-label" style={{ color: '#00ff41' }}>УЛИКА #8: КЛЮЧ ОТ АРХИВА</div>
                <div style={{ fontSize: '18px', color: '#fff', fontWeight: 'bold', letterSpacing: '3px', fontFamily: 'monospace', margin: '12px 0' }}>
                    LOOP_BREAKER_2024
                </div>
                <p className="mission-clue-text">
                    Хакеры использовали слабый 4-значный код. Избегайте простых паролей!
                </p>
            </div>

            <button className="btn-huge" onClick={() => onComplete(currentPoints + (MAX_ATTEMPTS - attempts.length + 1) * 500 + 5000)}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
        </motion.div>
    );

    // ЭКРАН 3: ПОРАЖЕНИЕ
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="window animate-fade mission-win" style={{ borderColor: '#ff4d4d' }}>
            <div className="mission-win-icon">
                <AlertTriangle size={72} color="#ff4d4d" />
            </div>
            <h1 className="glitch-text mission-win-title" style={{ color: '#ff4d4d' }}>ПОПЫТКИ ИСЧЕРПАНЫ</h1>
            
            <p className="mission-win-subtitle">
                Сейф остался закрыт. Правильный код был: <b style={{ color: '#ff4d4d', fontFamily: 'monospace' }}>{code.join('-')}</b>
            </p>

            <div className="mission-clue" style={{ borderColor: '#ff4d4d' }}>
                <div className="mission-clue-label" style={{ color: '#ff4d4d' }}>ЧТО МЫ УЗНАЛИ</div>
                <p className="mission-clue-text">
                    Короткие коды из 4 цифр легко подобрать за несколько минут. 
                    Используйте длинные пароли с буквами, цифрами и символами!
                </p>
            </div>

            <button className="btn-huge" onClick={() => onComplete(currentPoints + 1000)} style={{ background: '#ff4d4d' }}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
        </motion.div>
    );
};

export default SnifferMission;
