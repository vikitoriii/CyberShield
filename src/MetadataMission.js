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
    const [hintLevel, setHintLevel] = useState(0);
    const [tapMode, setTapMode] = useState(true);
    const [capturedPackets, setCapturedPackets] = useState([]);

    const TARGET = { red: 10, green: 160, blue: 60 };

    const handlePacketTap = (id) => {
        if (!capturedPackets.includes(id)) {
            const newCaptured = [...capturedPackets, id];
            setCapturedPackets(newCaptured);
            setCapturedCount(newCaptured.length);
            if (newCaptured.length >= 3) {
                setTimeout(() => setStage(2), 500);
            }
        }
    };

    useEffect(() => {
        const $ = window.$;
        if (!$ || stage === 0) return;
        const isMobile = window.innerWidth <= 768;

        // ЭТАП 1: jQuery UI Draggable (Захват пакетов из "потока") — только на десктопе
        if (stage === 1 && !isMobile) {
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
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span><Activity size={14} /> {stage === 1 ? "PACKET_SNIFFER_ACTIVE" : "SPECTRAL_RECOVERY_MODE"}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => { setShowHint(!showHint); if (!showHint) setHintLevel(1); }} style={{ background: 'none', border: 'none', color: showHint ? '#f7b500' : '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                        <HelpCircle size={14} /> ПОДСКАЗКА
                    </button>
                    <span style={{ color: '#4d94ff' }}>ENCRYPTED_DATA_07</span>
                </div>
            </div>

            {showHint && (
                <div style={{ background: '#000', border: '1px solid #f7b500', padding: '10px 16px', margin: '0 12px', color: '#f7b500', fontSize: '11px', lineHeight: '1.5' }}>
                    {hintLevel === 1 && (
                        <div>
                            {stage === 1 && 'Нажмите на блоки данных для захвата. Серые — шум, не нажимайте. Нужно захватить 3 пакета.'}
                            {stage === 2 && 'Настройте КРАСНЫЙ канал на минимум, ЗЕЛЁНЫЙ на максимум. Синий не важен. Скрытый слой появится при правильных настройках.'}
                            <button onClick={() => setHintLevel(2)} style={{ marginTop: '8px', background: '#f7b500', color: '#000', border: 'none', padding: '3px 8px', fontSize: '10px', cursor: 'pointer' }}>
                                Показать ответ
                            </button>
                        </div>
                    )}
                    {hintLevel === 2 && (
                        <div>
                            {stage === 1 && 'Нажмите на все 3 синих блока данных. Они подсветятся зелёным при захвате.'}
                            {stage === 2 && 'Красный: ~10%, Зелёный: ~160%, Синий: любое значение. Перетащите ползунки.'}
                        </div>
                    )}
                </div>
            )}

            <div className="metadata-grid" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 350px', gap: '16px', padding: '16px', minHeight: 0 }}>
                {/* ЛЕВАЯ ПАНЕЛЬ: ИГРОВОЕ ПОЛЕ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
                    {/* ЭТАП 1: ЗАХВАТ ПАКЕТОВ */}
                    {stage === 1 && (
                        <div id="capture-zone" style={{ flex: 1, background: '#0a0a0a', border: '1px solid #222', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '280px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <h4 style={{ color: '#4d94ff', marginBottom: '10px' }}>ПЕРЕХВАТ ПАКЕТОВ</h4>
                                <p style={{ color: '#666', fontSize: '12px' }}>Нажмите на блоки данных для захвата</p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {[1, 2, 3].map(i => (
                                    <div 
                                        key={i} 
                                        className="packet-data" 
                                        onClick={() => handlePacketTap(`packet-${i}`)}
                                        style={{ 
                                            padding: '16px', 
                                            background: capturedPackets.includes(`packet-${i}`) ? '#1a3a1a' : '#111', 
                                            border: `2px solid ${capturedPackets.includes(`packet-${i}`) ? '#00ff41' : '#4d94ff'}`, 
                                            cursor: 'pointer', 
                                            zIndex: 10, 
                                            textAlign: 'center',
                                            opacity: capturedPackets.includes(`packet-${i}`) ? 0.5 : 1,
                                            transition: 'all 0.3s',
                                            minWidth: '90px'
                                        }}
                                    >
                                        <Cpu size={24} color={capturedPackets.includes(`packet-${i}`) ? '#00ff41' : '#4d94ff'} style={{ marginBottom: '8px' }} />
                                        <div style={{ fontSize: '10px', color: capturedPackets.includes(`packet-${i}`) ? '#00ff41' : '#4d94ff' }}>
                                            {capturedPackets.includes(`packet-${i}`) ? '✓ ЗАХВАЧЕН' : `METADATA_#0${i}`}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div id="input-port" style={{ padding: '24px', border: '3px dashed #4d94ff', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(77, 148, 255, 0.05)', width: '80%' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <Zap size={32} color="#4d94ff" style={{ marginBottom: '10px' }} />
                                    <div style={{ fontSize: '12px', color: '#4d94ff', fontWeight: 'bold' }}>INPUT_PORT</div>
                                    <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>{capturedCount}/3 захвачено</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ПРАВАЯ ПАНЕЛЬ: ИНСТРУМЕНТЫ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
                    <div style={{ background: '#111', border: '1px solid #222', padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #222' }}>
                            <Settings size={18} color="#4d94ff" />
                            <span style={{ color: '#4d94ff', fontWeight: 'bold', fontSize: '13px' }}>АНАЛИЗАТОР</span>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
                                <span style={{ color: '#666' }}>System Readiness</span>
                                <span style={{ color: '#4d94ff', fontWeight: 'bold' }}>{stage === 1 ? Math.round((capturedCount/3)*100) : 100}%</span>
                            </div>
                            <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: '#4d94ff', width: `${stage === 1 ? (capturedCount/3)*100 : 100}%`, transition: '0.3s' }}></div>
                            </div>
                        </div>

                        {stage === 2 && (
                            <div style={{ background: '#000', padding: '14px', border: '1px solid #222', marginBottom: '12px' }}>
                                <div style={{ color: '#4d94ff', fontSize: '11px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Eye size={14} /> RGB_SPECTRUM_OS:
                                </div>
                                
                                {["red", "green", "blue"].map(color => (
                                    <div key={color} style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px' }}>
                                            <span style={{ color: '#666', textTransform: 'uppercase' }}>{color} channel</span>
                                            <span style={{ color: '#4d94ff', fontWeight: 'bold' }}>{filters[color]}%</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="200" 
                                            value={filters[color]} 
                                            onChange={(e) => setFilters(prev => ({ ...prev, [color]: parseInt(e.target.value) }))}
                                            style={{ width: '100%', accentColor: color === 'red' ? '#ff4d4d' : color === 'green' ? '#00ff41' : '#4d94ff', height: '8px' }}
                                        />
                                    </div>
                                ))}

                                {/* Image preview - color changes with sliders */}
                                <div style={{ 
                                    width: '100%', height: '100px', 
                                    background: `rgb(${Math.round(filters.red * 1.2)}, ${Math.round(filters.green * 0.8)}, ${Math.round(filters.blue * 0.6)})`,
                                    border: `2px solid ${isFound ? '#00ff41' : '#333'}`, marginTop: '10px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s',
                                    position: 'relative', overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.2,
                                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)'
                                    }} />
                                    {isFound ? (
                                        <div style={{ zIndex: 1, textAlign: 'center' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#00ff41', fontFamily: 'monospace', textShadow: '0 0 10px rgba(0,255,65,0.5)' }}>
                                                48.8584, 2.2945
                                            </div>
                                            <div style={{ fontSize: '9px', color: '#00ff41', marginTop: '4px', letterSpacing: '1px' }}>СЕКТОР 7 — БУНКЕР</div>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'rgba(255,255,255,0.3)', zIndex: 1, fontFamily: 'monospace' }}>
                                            ENCRYPTED_DATA
                                        </div>
                                    )}
                                </div>
                                {isFound && (
                                    <div style={{ marginTop: '8px', padding: '6px 10px', background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.3)', fontSize: '10px', color: '#00ff41', textAlign: 'center' }}>
                                        СКРЫТЫЙ СЛОЙ ОБНАРУЖЕН — ДАННЫЕ ВОССТАНОВЛЕНЫ
                                    </div>
                                )}
                            </div>
                        )}

                        {isFound && (
                            <button className="btn-huge" style={{ width: '100%', marginBottom: '8px' }} onClick={() => setStage(3)}>
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