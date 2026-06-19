import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Network, Filter, Search, ShieldAlert, CheckCircle2, 
    Lock, Unlock, Eye, Database, Terminal, HelpCircle, 
    Zap, Activity, ChevronRight, RotateCcw 
} from 'lucide-react';

const SnifferMission = ({ username, currentPoints, onComplete }) => {
    const [stage, setStage] = useState(0); // 0: Intro, 1: Capture, 2: Analyze, 3: Win
    const [capturedPackets, setCapturedPackets] = useState([]);
    const [protocolFilter, setProtocolFilter] = useState('ALL');
    const [showHint, setShowHint] = useState(false);
    const [isSolved, setIsSolved] = useState(false);
    const [liveStream, setLiveStream] = useState([]);

    // База данных трафика для анализа
    const DUMP_DATA = [
        { id: 101, proto: "TCP", src: "192.168.1.5", info: "SYN_ACK", data: "System handshake. Standard traffic." },
        { id: 102, proto: "DNS", src: "8.8.8.8", info: "QUERY: google.com", data: "External domain resolution." },
        { id: 103, proto: "HTTP", src: "172.16.0.12", info: "GET /index.html", data: "User browsing internal portal." },
        { id: 104, proto: "UDP", src: "10.0.0.1", info: "TIME_SYNC", data: "Network time protocol update." },
        { id: 105, proto: "HTTP", src: "172.16.0.45", info: "POST /admin_login", data: "CREDENTIALS_FOUND: user:admin | PASS: LOOP_BREAKER_2024" }, // ЦЕЛЬ
        { id: 106, proto: "TCP", src: "192.168.1.10", info: "PUSH_DATA", data: "Encrypted file segment transmission." },
        { id: 107, proto: "HTTP", src: "172.16.0.12", info: "GET /favicon.ico", data: "Image request." }
    ];

    // Этап 1: Имитация живого потока пакетов
    useEffect(() => {
        if (stage === 1) {
            const interval = setInterval(() => {
                const randomPacket = {
                    id: Math.random(),
                    port: [80, 443, 22, 53][Math.floor(Math.random()*4)],
                    ip: `172.16.0.${Math.floor(Math.random()*254)}`,
                    isTarget: Math.random() > 0.8
                };
                setLiveStream(prev => [randomPacket, ...prev].slice(0, 8));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [stage]);

    // Этап 2: Инициализация JQuery UI Accordion (Requirement 9)
    useEffect(() => {
        const $ = window.$;
        if (!$ || stage !== 2) return;

        $("#packet-details").accordion({
            header: ".accordion-trigger",
            collapsible: true,
            active: false,
            heightStyle: "content"
        });

        return () => {
            if ($("#packet-details").hasClass("ui-accordion")) {
                $("#packet-details").accordion("destroy");
            }
        };
    }, [stage, protocolFilter]);

    const handleCapture = () => {
        setCapturedPackets(DUMP_DATA);
        setStage(2);
    };

    const handleExtract = (content) => {
        if (content.includes("LOOP_BREAKER_2024")) {
            setIsSolved(true);
        } else {
            alert("В этом пакете нет пароля. Ищите HTTP POST запрос.");
        }
    };

    if (stage === 0) return (
        <div className="window animate-fade text-center p-5" style={{ background: 'radial-gradient(circle, #0a111a 0%, #050505 100%)' }}>
            <Network size={80} color="#4d94ff" className="mb-4" />
            <h1 className="glitch-text text-info">МИССИЯ #08: ПЕРЕХВАТ ПАКЕТОВ</h1>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8 bg-dark p-4 border border-info rounded shadow-lg">
                        <p className="text-light fs-5">Макс пытался передать пароль от зашифрованного архива через открытый HTTP-канал. Хакеры Neocorp перехватили его.</p>
                        <p className="text-muted">Нам нужно подключиться к их сетевому узлу, перехватить дамп трафика и найти ту самую строку с паролем.</p>
                        <button className="btn btn-outline-info btn-lg mt-3 px-5" onClick={() => setStage(1)}>ПОДКЛЮЧИТЬ СНИФФЕР</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid p-3 text-light" style={{ height: '90vh' }}>
            {/* ШАПКА ЭТАПОВ */}
            <div className="row mb-3">
                <div className="col-12 d-flex justify-content-center gap-4 border-bottom border-secondary pb-3">
                    <span style={{ color: stage >= 1 ? '#4d94ff' : '#333' }}>[01] ПЕРЕХВАТ ЭФИРА</span>
                    <ChevronRight size={16} className="text-secondary" />
                    <span style={{ color: stage >= 2 ? '#4d94ff' : '#333' }}>[02] АНАЛИЗ ДАМПА</span>
                </div>
            </div>

            <div className="row h-100 g-4">
                {/* ЛЕВАЯ ПАНЕЛЬ (Инструменты) */}
                <div className="col-lg-4">
                    <div className="card h-100 bg-dark border-secondary p-4 position-relative">
                        <h5 className="text-info mb-4 d-flex align-items-center gap-2">
                            <Activity size={18} /> ПАНЕЛЬ УПРАВЛЕНИЯ
                        </h5>

                        {stage === 2 && (
                            <div className="animate-fade">
                                <label className="text-muted small mb-2">ФИЛЬТР ПРОТОКОЛА (Bootstrap):</label>
                                <div className="btn-group w-100 mb-4 shadow-sm">
                                    {['ALL', 'HTTP', 'TCP', 'DNS'].map(p => (
                                        <button key={p} className={`btn btn-sm ${protocolFilter === p ? 'btn-info' : 'btn-outline-secondary'}`} onClick={() => setProtocolFilter(p)}>{p}</button>
                                    ))}
                                </div>
                                <div className="p-3 bg-black border border-secondary rounded">
                                    <p className="small text-muted m-0">Обнаружено пакетов: <b>{capturedPackets.length}</b></p>
                                    <p className="small text-muted m-0">После фильтрации: <b>{capturedPackets.filter(p => protocolFilter === 'ALL' || p.proto === protocolFilter).length}</b></p>
                                </div>
                            </div>
                        )}

                        {/* КНОПКА ПОДСКАЗКИ */}
                        <div className="mt-auto">
                            <button className="btn btn-outline-warning btn-sm w-100 mb-3" onClick={() => setShowHint(!showHint)}>
                                <HelpCircle size={14} className="me-2" /> ПОМОЩЬ ДЕТЕКТИВА
                            </button>
                            <AnimatePresence>
                                {showHint && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="alert alert-warning p-2 small" style={{ fontSize: '11px' }}>
                                        <b>ИНСТРУКЦИЯ:</b> Хакеры часто используют незашифрованный <b>HTTP</b> для быстрой передачи. Ищите метод <b>POST</b> (отправка данных) от IP <b>172.16.0.45</b>.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ПРАВАЯ ПАНЕЛЬ (Игровое поле) */}
                <div className="col-lg-8">
                    <div className="card h-100 bg-black border-info border-opacity-25 overflow-hidden shadow-lg">
                        
                        {/* ЭТАП 1: ЖИВОЙ ПЕРЕХВАТ */}
                        {stage === 1 && (
                            <div className="card-body d-flex flex-column align-items-center justify-content-center p-5">
                                <div className="w-100 bg-dark p-3 border border-info mb-4" style={{ fontFamily: 'monospace', height: '300px', overflowY: 'hidden' }}>
                                    {liveStream.map((p, i) => (
                                        <div key={i} className="text-info small opacity-75">
                                            {`[${new Date().toLocaleTimeString()}] INBOUND: IP_${p.ip} PORT_${p.port} ... OK`}
                                        </div>
                                    ))}
                                    <div className="blink mt-2" style={{ color: '#4d94ff' }}>{'>'} SEARCHING_FOR_DATA_DUMP...</div>
                                </div>
                                <button className="btn btn-info btn-lg px-5 shadow" onClick={handleCapture}>ЗАХВАТИТЬ ПАКЕТЫ (DUMP)</button>
                            </div>
                        )}

                        {/* ЭТАП 2: АНАЛИЗ (JQuery UI Accordion) */}
                        {stage === 2 && (
                            <div className="card-body p-0 d-flex flex-column">
                                <div className="bg-dark p-3 border-bottom border-secondary text-info fw-bold">RAW_PACKET_STORAGE</div>
                                <div id="packet-details" style={{ flex: 1, overflowY: 'auto' }}>
                                    {capturedPackets.filter(p => protocolFilter === 'ALL' || p.proto === protocolFilter).map(p => (
                                        <div key={p.id}>
                                            <div className="accordion-trigger p-3 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center" style={{ cursor: 'pointer', background: '#0a0a0a' }}>
                                                <div className="d-flex gap-3">
                                                    <span className={`badge ${p.proto === 'HTTP' ? 'bg-danger' : 'bg-secondary'}`}>{p.proto}</span>
                                                    <span className="small text-muted">{p.src}</span>
                                                </div>
                                                <span className="text-info small">{p.info}</span>
                                            </div>
                                            <div className="p-4 bg-black border-bottom border-secondary">
                                                <div className="text-muted small mb-2 font-monospace">PAYLOAD_CONTENT:</div>
                                                <div className="p-3 bg-dark border border-secondary text-info rounded" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                                                    {p.data}
                                                </div>
                                                {p.proto === 'HTTP' && p.info.includes('POST') && (
                                                    <button className="btn btn-sm btn-outline-info mt-3" onClick={() => handleExtract(p.data)}>ИЗВЛЕЧЬ ПАРОЛЬ</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ЭКРАН ПОБЕДЫ */}
            <AnimatePresence>
                {isSolved && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="card bg-black border-info border-2 p-5 text-center shadow-lg" style={{ maxWidth: '600px' }}>
                            <Unlock size={80} color="#4d94ff" className="mx-auto mb-4" />
                            <h2 className="text-info glitch-text mb-3 display-6">ПАРОЛЬ ПОЛУЧЕН</h2>
                            <p className="text-light fs-5 mb-4">
                                Вы нашли скрытый ключ: <b>LOOP_BREAKER_2024</b>. Теперь мы можем открыть архив Макса и узнать, что он нашел в ядре Neocorp.
                            </p>
                            <button className="btn btn-info btn-lg w-100 py-3 fw-bold" onClick={() => onComplete(currentPoints + 5000)}>ЗАВЕРШИТЬ РАССЛЕДОВАНИЕ</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SnifferMission;