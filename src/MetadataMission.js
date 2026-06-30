import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, ShieldAlert, Zap, Cpu, Terminal, 
    AlertTriangle, Eye, Settings, Lock, CheckCircle2, RotateCcw, Activity, Move, Camera, HelpCircle
} from 'lucide-react';

const MetadataMission = ({ username, currentPoints, onComplete }) => {
    const [stage, setStage] = useState(0); // 0: Intro, 1: Intercept, 2: Analysis, 3: Win
    const [capturedCount, setCapturedCount] = useState(0);
    const [filters, setFilters] = useState({ red: 100, green: 100, blue: 100 });
    const [isFound, setIsFound] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // Идеальные настройки для проявления шифра
    const TARGET = { red: 10, green: 160, blue: 60 };

    useEffect(() => {
        const $ = window.$;
        if (!$ || stage === 0) return;

        // ЭТАП 1: jQuery UI Draggable (Захват пакетов из "потока")
        if (stage === 1) {
            $(".packet-data").draggable({
                revert: "invalid", // Возвращается на место, если не в порту
                containment: "#capture-zone"
            });

            $("#input-port").droppable({
                accept: ".packet-data",
                drop: function(event, ui) {
                    $(ui.draggable).hide("explode", { pieces: 16 }, 500);
                    setCapturedCount(prev => {
                        const next = prev + 1;
                        if (next >= 3) setTimeout(() => setStage(2), 1000);
                        return next;
                    });
                }
            });
        }

        // ЭТАП 2: jQuery UI Sliders (Спектральный анализ)
        if (stage === 2) {
            const createSlider = (id, color) => {
                $(`#${id}`).slider({
                    min: 0, max: 200, value: 100,
                    slide: (e, ui) => setFilters(prev => ({ ...prev, [color]: ui.value }))
                });
            };
            createSlider("s-red", "red");
            createSlider("s-green", "green");
            createSlider("s-blue", "blue");
        }
    }, [stage]);

    // Проверка совпадения частот
    useEffect(() => {
        if (stage === 2) {
            const isCorrect = 
                Math.abs(filters.red - TARGET.red) < 25 &&
                Math.abs(filters.green - TARGET.green) < 25;
            setIsFound(isCorrect);
        }
    }, [filters, stage]);

    // ЭКРАН 0: ВСТУПЛЕНИЕ
    if (stage === 0) return (
        <div className="window animate-fade mission-intro">
            <div className="mission-intro-icon">
                <ShieldAlert size={72} color="#00ff41" />
            </div>
            <h1 className="glitch-text mission-intro-title" style={{ color: '#00ff41' }}>ЦИФРОВАЯ ФОРЕНЗИКА</h1>
            <div className="mission-intro-card">
                <div className="mission-intro-label" style={{ color: '#00ff41' }}>
                    МИССИЯ 07
                </div>
                <p className="mission-intro-text">
                    Мы получили зашифрованный снимок из <b style={{ color: '#00ff41' }}>Сектора 7</b>. 
                    Файл поврежден и содержит «шумовую завесу». 
                    По координатам из предыдущих миссий это <b style={{ color: '#f7b500' }}>бункер под Эйфелевой башней</b> — 
                    вам нужно восстановить скрытый слой данных.
                </p>
            </div>
            <p className="mission-intro-hint">
                Перехватите пакеты восстановления и настройте частотные фильтры RGB-спектра, 
                чтобы увидеть скрытые координаты.
            </p>
            <button className="btn-main" onClick={() => setStage(1)}>ИНИЦИИРОВАТЬ ЗАХВАТ</button>
        </div>
    );

    // ЭКРАН 1-2: ИГРОВОЕ ПОЛЕ
    return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* ИНДИКАТОР ЭТАПОВ */}
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><Activity size={14} /> {stage === 1 ? "PACKET_SNIFFER_ACTIVE" : "SPECTRAL_RECOVERY_MODE"}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => setShowHint(!showHint)} style={{ background: 'none', border: 'none', color: showHint ? '#f7b500' : '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                        <HelpCircle size={14} /> ПОДСКАЗКА
                    </button>
                    <span style={{ color: '#4d94ff' }}>ENCRYPTED_DATA_07</span>
                </div>
            </div>

            {showHint && (
                <div style={{ background: '#000', border: '1px solid #f7b500', padding: '10px 16px', margin: '0 20px', color: '#f7b500', fontSize: '11px', lineHeight: '1.5' }}>
                    {stage === 1 && 'Перетащите зелёные блоки данных в зону захвата. Пропустите серые — это шум.'}
                    {stage === 2 && 'Настройте КРАСНЫЙ канал на минимум (~10), ЗЕЛЁНЫЙ на ~160. Синий не важен. Скрытый слой появится при правильных настройках.'}
                </div>
            )}

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px', padding: '20px', minHeight: 0 }}>
                {/* ЛЕВАЯ ПАНЕЛЬ: ИГРОВОЕ ПОЛЕ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* ЭТАП 1: ЗАХВАТ ПАКЕТОВ */}
                    {stage === 1 && (
                        <div id="capture-zone" style={{ flex: 1, background: '#0a0a0a', border: '1px solid #222', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '400px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <h4 style={{ color: '#4d94ff', marginBottom: '10px' }}>ПЕРЕХВАТ ПАКЕТОВ</h4>
                                <p style={{ color: '#666', fontSize: '12px' }}>Перетащите плавающие блоки данных в порт приемника</p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '40px' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="packet-data" style={{ padding: '20px', background: '#111', border: '1px solid #4d94ff', cursor: 'grab', zIndex: 10, textAlign: 'center' }}>
                                        <Cpu size={24} color="#4d94ff" style={{ marginBottom: '10px' }} />
                                        <div style={{ fontSize: '10px', color: '#4d94ff' }}>METADATA_#0{i}</div>
                                    </div>
                                ))}
                            </div>

                            <div id="input-port" style={{ marginTop: '40px', padding: '40px', border: '3px dashed #4d94ff', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(77, 148, 255, 0.05)' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <Zap size={32} color="#4d94ff" style={{ marginBottom: '10px' }} />
                                    <div style={{ fontSize: '12px', color: '#4d94ff', fontWeight: 'bold' }}>INPUT_PORT</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ЭТАП 2: ФИЛЬТРАЦИЯ И ГЛИЧИ */}
                    {stage === 2 && (
                        <div style={{ flex: 1, background: '#0a0a0a', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '400px', border: '2px solid #222', padding: '10px' }}>
                                <div style={{
                                    width: '100%', height: '100%',
                                    backgroundImage: 'url("https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1000")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    transition: '0.3s filter',
                                    filter: `saturate(${filters.red}%) hue-rotate(${filters.green}deg) brightness(${filters.blue / 100}) contrast(1.2)`
                                }}></div>
                                
                                <AnimatePresence>
                                    {isFound && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', pointerEvents: 'none' }}>
                                            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#00ff41', textShadow: '0 0 30px #00ff41', letterSpacing: '12px', fontFamily: 'monospace' }}>
                                                VOULT_7
                                            </div>
                                            <div style={{ background: '#000', border: '1px solid #00ff41', padding: '10px', display: 'inline-block', marginTop: '15px' }}>
                                                <span style={{ color: '#00ff41', fontSize: '12px', letterSpacing: '2px' }}>DECRYPTED_KEY: 88-12-P</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div style={{ marginTop: '15px', color: '#666', fontSize: '12px', letterSpacing: '2px' }}>
                                {isFound ? ">> УЛИКА ПОДТВЕРЖДЕНА" : ">> ИДЕТ SPECTRAL_SCANNING..."}
                            </div>
                        </div>
                    )}
                </div>

                {/* ПРАВАЯ ПАНЕЛЬ: ИНСТРУМЕНТЫ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: '#111', border: '1px solid #222', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #222' }}>
                            <Settings size={20} color="#4d94ff" />
                            <span style={{ color: '#4d94ff', fontWeight: 'bold', fontSize: '14px' }}>АНАЛИЗАТОР</span>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                                <span style={{ color: '#666' }}>System Readiness</span>
                                <span style={{ color: '#4d94ff', fontWeight: 'bold' }}>{stage === 1 ? Math.round((capturedCount/3)*100) : 100}%</span>
                            </div>
                            <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: '#4d94ff', width: `${stage === 1 ? (capturedCount/3)*100 : 100}%`, transition: '0.3s' }}></div>
                            </div>
                        </div>

                        {stage === 2 && (
                            <div style={{ background: '#000', padding: '20px', border: '1px solid #222', marginBottom: '20px' }}>
                                <div style={{ color: '#4d94ff', fontSize: '12px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Eye size={14} /> RGB_SPECTRUM_OS:
                                </div>
                                
                                {["red", "green", "blue"].map(color => (
                                    <div key={color} style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                                            <span style={{ color: '#666', textTransform: 'uppercase' }}>{color} channel</span>
                                            <span style={{ color: '#4d94ff', fontWeight: 'bold' }}>{filters[color]}%</span>
                                        </div>
                                        <div id={`s-${color}`} style={{ height: '8px', background: '#222', borderRadius: '4px' }}></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {isFound && (
                            <button className="btn-huge" style={{ width: '100%', marginBottom: '10px' }} onClick={() => setStage(3)}>
                                <CheckCircle2 size={16} style={{ marginRight: '8px' }} /> ИЗВЛЕЧЬ ДАННЫЕ
                            </button>
                        )}
                        
                        <button className="btn-action" style={{ width: '100%', color: '#ff4d4d', borderColor: '#ff4d4d' }} onClick={() => setStage(1)}>
                            <RotateCcw size={14} style={{ marginRight: '8px' }} /> ПЕРЕЗАПУСК
                        </button>
                    </div>
                </div>
            </div>

            {/* ЭКРАН ПОБЕДЫ */}
            <AnimatePresence>
                {stage === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div className="mission-win" style={{ maxWidth: '600px' }}>
                            <div className="mission-win-icon">
                                <Lock size={72} color="#00ff41" />
                            </div>
                            <h1 className="glitch-text mission-win-title" style={{ color: '#00ff41' }}>ДОСТУП К АРХИВУ ПОЛУЧЕН</h1>
                            <p className="mission-win-subtitle">
                                Мы нашли GPS-координаты: <b style={{ color: '#00ff41' }}>48.8584, 2.2945</b> — бункер под Эйфелевой башней.
                            </p>
                            <div className="mission-clue">
                                <div className="mission-clue-label" style={{ color: '#00ff41' }}>УЛИКА #7</div>
                                <p className="mission-clue-text">
                                    Анализ фото подтвердил координаты: <b>48.8584, 2.2945</b>. Это бункер под Эйфелевой башней. 
                                    Группа захвата готовится к вылету.
                                </p>
                            </div>
                            <button className="btn-huge" onClick={() => onComplete(currentPoints + 5000)}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MetadataMission;