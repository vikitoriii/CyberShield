import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Zap, Activity, CheckCircle2, ShieldAlert, Target, Terminal, ChevronRight, Lock } from 'lucide-react';

const CryptoMission = ({ username, currentPoints, onComplete }) => {
    const [stage, setStage] = useState(0); // 0: Intro, 1: Signal, 2: Decrypt, 3: Map, 4: Win
    const [frequency, setFrequency] = useState(0);
    const [shift, setShift] = useState(0);
    const [selectedSector, setSelectedSector] = useState(null);
    const [xpEarned, setXpEarned] = useState(0);

    // Данные для этапов
    const TARGET_FREQ = 104; // Целевая частота (104.4 MHz)
    const TARGET_SHIFT = 13; // Ключ сдвига ROT13
    const encryptedText = "ZNX VF VA FRPGBE FRIRA"; // "MAX IS IN SECTOR SEVEN"
    
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
        <div className="window animate-fade" style={{ textAlign: 'center', padding: '50px' }}>
            <Radio size={60} color="#00ff41" />
            <h1 className="glitch-text" style={{color: '#00ff41'}}>ОПЕРАЦИЯ: ТИХИЙ ОМУТ</h1>
            <p style={{maxWidth: '600px', margin: '20px auto', color: '#ccc', fontSize: '18px', lineHeight: '1.6'}}>
                Агент, мы обнаружили скрытую передачу данных. Похоже, Макс пытается выйти на связь, но сигнал глушат. 
                <br/><br/>
                Вам предстоит: <b>перехватить</b> волну, <b>взломать</b> шифр и <b>указать</b> местоположение цели.
            </p>
            <button className="btn-main" onClick={() => setStage(1)}>НАЧАТЬ ПЕРЕХВАТ</button>
        </div>
    );

    return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* ИНДИКАТОР ЭТАПОВ */}
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'center', gap: '40px', background: '#0a0a0a' }}>
                <div style={{ color: stage >= 1 ? '#00ff41' : '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid', textAlign: 'center', fontSize: '12px' }}>1</div> СИГНАЛ
                </div>
                <div style={{ color: stage >= 2 ? '#00ff41' : '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid', textAlign: 'center', fontSize: '12px' }}>2</div> ВЗЛОМ
                </div>
                <div style={{ color: stage >= 3 ? '#00ff41' : '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid', textAlign: 'center', fontSize: '12px' }}>3</div> АНАЛИЗ
                </div>
            </div>

            <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* ЭТАП 1: НАСТРОЙКА ВОЛНЫ */}
                {stage === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
                        <h2 style={{ color: '#00ff41', marginBottom: '40px' }}>ЭТАП 1: ЗАХВАТ ЧАСТОТЫ</h2>
                        <div style={{ height: '150px', background: '#000', border: '1px solid #222', marginBottom: '30px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             {/* Имитация осциллографа */}
                             <motion.div 
                                animate={{ height: [20, 100, 40, 120, 20] }} 
                                transition={{ repeat: Infinity, duration: 1 }}
                                style={{ width: '2px', background: '#00ff41', margin: '0 5px', opacity: Math.abs(frequency - 104) < 5 ? 1 : 0.2 }} 
                             />
                             <div style={{ fontSize: '32px', color: '#00ff41', fontFamily: 'monospace', z_index: 2 }}>
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
                        <div style={{ background: '#000', padding: '30px', border: '1px dashed #00ff41', marginBottom: '30px' }}>
                            <div style={{ fontSize: '10px', color: '#444', textAlign: 'left', marginBottom: '10px' }}>ENCRYPTED_DATA_STREAM:</div>
                            <div style={{ fontSize: '28px', color: '#fff', letterSpacing: '4px', fontFamily: 'monospace' }}>
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
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '10px', background: '#111', padding: '20px', border: '1px solid #333' }}>
                            {[1,2,3,4,5,6,7,8,9].map(num => (
                                <div 
                                    key={num}
                                    onClick={() => setSelectedSector(num)}
                                    style={{ 
                                        height: '100px', border: '1px solid #222', display: 'flex', alignItems: 'center', 
                                        justifyContent: 'center', cursor: 'pointer',
                                        background: selectedSector === num ? (num === 7 ? '#00ff41' : '#ff4d4d') : '#000',
                                        color: selectedSector === num ? '#000' : '#444',
                                        fontWeight: 'bold'
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
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
                        <CheckCircle2 size={80} color="#00ff41" />
                        <h1 style={{ color: '#00ff41', marginTop: '20px' }}>МИССИЯ ВЫПОЛНЕНА</h1>
                        <p style={{ color: '#eee', fontSize: '18px' }}>Вы успешно перехватили и расшифровали сигнал Макса.</p>
                        <div style={{ marginTop: '20px', padding: '20px', background: '#0a1a0a', border: '1px solid #00ff41' }}>
                            <p style={{ margin: 0, color: '#00ff41' }}>НОВАЯ УЛИКА ДОБАВЛЕНА НА ДОСКУ: #6</p>
                        </div>
                        <button className="btn-huge ready" style={{ marginTop: '30px' }} onClick={handleFinish}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
                    </motion.div>
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