import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, ShieldAlert, Zap, Cpu, Terminal, 
    AlertTriangle, Eye, Settings, Lock, CheckCircle2, RotateCcw, Activity, Move
} from 'lucide-react';

const MetadataMission = ({ username, currentPoints, onComplete }) => {
    const [stage, setStage] = useState(0); // 0: Intro, 1: Intercept, 2: Analysis, 3: Win
    const [capturedCount, setCapturedCount] = useState(0);
    const [filters, setFilters] = useState({ red: 100, green: 100, blue: 100 });
    const [isFound, setIsFound] = useState(false);

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

    if (stage === 0) return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 text-center bg-black border border-success p-5 shadow-lg rounded">
                    <ShieldAlert size={80} color="#00ff41" className="mb-4 animate-pulse" />
                    <h1 className="text-success glitch-text mb-4">ОБЪЕКТ #07: ЦИФРОВАЯ ФОРЕНЗИКА</h1>
                    <p className="text-light fs-5 mb-4">
                        Мы получили зашифрованный снимок из Сектора 7. Файл поврежден и содержит «шумовую завесу». 
                        Вам нужно перехватить пакеты восстановления и настроить частотные фильтры, чтобы увидеть скрытый слой.
                    </p>
                    <button className="btn btn-success btn-lg px-5" onClick={() => setStage(1)}>ИНИЦИИРОВАТЬ ЗАХВАТ</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid p-3 text-light" style={{ minHeight: '85vh', background: '#050505' }}>
            <div className="row h-100 g-4">
                
                {/* ЛЕВАЯ ПАНЕЛЬ: ИГРОВОЕ ПОЛЕ */}
                <div className="col-lg-8">
                    <div className="card h-100 bg-dark border-secondary border-opacity-25 overflow-hidden shadow">
                        <div className="card-header bg-black border-secondary border-opacity-50 d-flex justify-content-between align-items-center py-3">
                            <span className="text-success small fw-bold tracking-widest">
                                <Activity size={14} className="me-2 text-danger" /> 
                                {stage === 1 ? "PACKET_SNIFFER_ACTIVE" : "SPECTRAL_RECOVERY_MODE"}
                            </span>
                            <span className="badge border border-success text-success px-3">ENCRYPTED_DATA_07</span>
                        </div>

                        {/* ЭТАП 1: ЗАХВАТ ПАКЕТОВ */}
                        {stage === 1 && (
                            <div id="capture-zone" className="card-body d-flex flex-column align-items-center justify-content-center position-relative" style={{ minHeight: '500px', background: 'radial-gradient(circle, #0a110a 0%, #000 100%)' }}>
                                <div className="text-center mb-5">
                                    <h4 className="text-success">ПЕРЕХВАТ ПАКЕТОВ</h4>
                                    <p className="text-muted small">Перетащите плавающие блоки данных в порт приемника</p>
                                </div>
                                
                                {/* Поток мусора (анимация) */}
                                <div className="position-absolute w-100 h-100 overflow-hidden" style={{ opacity: 0.1, pointerEvents: 'none' }}>
                                    {Array.from({length: 20}).map((_, i) => (
                                        <div key={i} className="text-success small position-absolute" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }}>010110</div>
                                    ))}
                                </div>

                                <div className="d-flex gap-5">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="packet-data p-3 bg-dark border border-success rounded text-success shadow-sm" style={{ cursor: 'grab', zIndex: 10 }}>
                                            <Cpu size={24} className="mb-2" /><br/>
                                            <span style={{fontSize: '9px'}}>METADATA_#0{i}</span>
                                        </div>
                                    ))}
                                </div>

                                <div id="input-port" className="mt-5 p-5 border-4 border-dashed border-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '180px', height: '180px', background: 'rgba(0,255,65,0.05)' }}>
                                    <div className="text-center">
                                        <Zap size={32} color="#00ff41" className="mb-2" />
                                        <div className="small fw-bold text-success">INPUT_PORT</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ЭТАП 2: ФИЛЬТРАЦИЯ И ГЛИЧИ */}
                        {stage === 2 && (
                            <div className="card-body d-flex flex-column align-items-center justify-content-center bg-black">
                                <div className="position-relative" style={{ width: '100%', maxWidth: '500px', height: '500px', border: '2px solid #1a1a1a', padding: '10px' }}>
                                    {/* Глитч-эффект на картинке */}
                                    <div style={{
                                        width: '100%', height: '100%',
                                        backgroundImage: 'url("https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1000")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        transition: '0.3s filter',
                                        filter: `saturate(${filters.red}%) hue-rotate(${filters.green}deg) brightness(${filters.blue / 100}) contrast(1.2)`
                                    }}></div>
                                    
                                    {/* Скрытый слой */}
                                    <AnimatePresence>
                                        {isFound && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="position-absolute top-50 start-50 translate-middle text-center w-100" style={{ pointerEvents: 'none' }}>
                                                <div className="display-1 fw-bold text-success" style={{ textShadow: '0 0 30px #00ff41', letterSpacing: '12px', fontFamily: 'monospace' }}>
                                                    VOULT_7
                                                </div>
                                                <div className="bg-black border border-success p-2 d-inline-block mt-3">
                                                    <span className="text-success small tracking-widest">DECRYPTED_KEY: 88-12-P</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="mt-3 text-muted small tracking-widest animate-pulse">
                                    {isFound ? ">> УЛИКА ПОДТВЕРЖДЕНА" : ">> ИДЕТ SPECTRAL_SCANNING..."}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ПРАВАЯ ПАНЕЛЬ: ИНСТРУМЕНТЫ */}
                <div className="col-lg-4">
                    <div className="card h-100 bg-dark border-secondary border-opacity-25 p-4 shadow">
                        <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
                            <Settings className="text-success me-3" size={24} />
                            <h4 className="text-success m-0 fw-bold">АНАЛИЗАТОР</h4>
                        </div>

                        {/* Статус-бар */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-1 small">
                                <span className="text-muted uppercase tracking-tighter">System Readiness</span>
                                <span className="text-success fw-bold">{stage === 1 ? Math.round((capturedCount/3)*100) : 100}%</span>
                            </div>
                            <div className="progress bg-black" style={{ height: '6px' }}>
                                <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                                     style={{ width: `${stage === 1 ? (capturedCount/3)*100 : 100}%` }}></div>
                            </div>
                        </div>

                        {/* Блок управления спектром */}
                        {stage === 2 && (
                            <div className="bg-black p-4 border border-secondary border-opacity-50 rounded shadow-inner mb-4">
                                <h6 className="text-info mb-4 d-flex align-items-center small fw-bold">
                                    <Eye size={14} className="me-2"/> RGB_SPECTRUM_OS:
                                </h6>
                                
                                {["red", "green", "blue"].map(color => (
                                    <div key={color} className="mb-4">
                                        <div className="d-flex justify-content-between small mb-2">
                                            <span className="text-uppercase text-muted" style={{fontSize: '10px'}}>{color} spectral channel</span>
                                            <span className="text-success fw-bold">{filters[color]}%</span>
                                        </div>
                                        <div id={`s-${color}`} className="custom-slider"></div>
                                    </div>
                                ))}
                                
                                <div className="mt-4 p-3 bg-dark border-start border-3 border-info rounded-end text-info small" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                                    <AlertTriangle size={14} className="mb-2"/><br/>
                                    <b>LOGS_HINT:</b> Обнаружена аномалия в <b>Зеленом</b> спектре (уровень 160%). <b>Красный</b> канал перегружен мусором — уменьшите до минимума.
                                </div>
                            </div>
                        )}

                        <div className="mt-auto">
                            {isFound && (
                                <button className="btn btn-success btn-lg w-100 shadow-lg py-3 fw-bold mb-3 border-0" onClick={() => setStage(3)}>
                                    <CheckCircle2 size={20} className="me-2"/> ИЗВЛЕЧЬ ДАННЫЕ
                                </button>
                            )}
                            
                            <button className="btn btn-outline-danger btn-sm w-100 opacity-50 hover-opacity-100" onClick={() => setStage(1)}>
                                <RotateCcw size={14} className="me-2"/> ПЕРЕЗАПУСК СИСТЕМЫ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ЭКРАН ПОБЕДЫ */}
            <AnimatePresence>
                {stage === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div className="card bg-black border-success border-2 p-5 text-center shadow-lg" style={{ maxWidth: '600px' }}>
                            <div className="mb-4 d-inline-block p-4 rounded-circle border border-success border-opacity-25 shadow-inner">
                                <Lock size={80} color="#00ff41" />
                            </div>
                            <h2 className="text-success glitch-text mb-3 display-6 fw-bold">ДОСТУП К АРХИВУ ПОЛУЧЕН</h2>
                            <p className="text-muted fs-6 mb-4 px-3" style={{ lineHeight: '1.6' }}>
                                Анализ метаданных и спектра завершен. Мы нашли скрытую метку: <b>VOULT_7</b>. Это подтверждает координаты подземного бункера. Улика №7 добавлена на вашу доску.
                            </p>
                            <button className="btn btn-success btn-lg w-100 py-3 fw-bold" onClick={() => onComplete(currentPoints + 5000)}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MetadataMission;