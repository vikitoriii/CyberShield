import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, CheckCircle2, AlertTriangle, Terminal, 
    Award, FileText, Target, Lock, Zap, Eye, HelpCircle
} from 'lucide-react';

const FinalMission = ({ username, currentPoints, onComplete }) => {
    const [stage, setStage] = useState(0);
    const [timeline, setTimeline] = useState([]);
    const [selectedEvidence, setSelectedEvidence] = useState([]);
    const [finalChoice, setFinalChoice] = useState(null);
    const [interrogationStep, setInterrogationStep] = useState(0);
    const [interrogationAnswer, setInterrogationAnswer] = useState('');
    const [interrogationCorrect, setInterrogationCorrect] = useState(false);
    const [cipherInput, setCipherInput] = useState('');
    const [cipherTarget] = useState('SHADOW_WALKER');
    const [cipherSolved, setCipherSolved] = useState(false);
    const [health, setHealth] = useState(100);
    const [showHint, setShowHint] = useState(false);

    const TIMELINE_EVENTS = [
        { date: "10.05", event: "Shadow_Walker впервые замечен", clue: "Вход в 3:00 ночи" },
        { date: "12.05", event: "Фишинговая атака", clue: "Гомограф в домене" },
        { date: "14.05", event: "Сервер в Секторе 7", clue: "Старое здание Neocorp" },
        { date: "18.05", event: "Проект 'Мёртвая петля'", clue: "База данных лиц" },
        { date: "20.05", event: "Социальная инженерия", clue: "Хакер внутри офиса" },
        { date: "22.05", event: "Сообщение Макса", clue: "MAX_ALIVE_2024!!!" },
        { date: "24.05", event: "GPS-координаты", clue: "Бункер под Эйфелевой" },
        { date: "26.05", event: "Пароль из сейфа", clue: "LOOP_BREAKER_2024" },
        { date: "28.05", event: "Имя подозреваемого", clue: "Jean-Pierre Leroy" }
    ];

    const EVIDENCE_OPTIONS = [
        { id: 1, text: "Логи входа в 3:00 ночи", correct: true },
        { id: 2, text: "Фишинг с гомографом", correct: true },
        { id: 3, text: "Сервер в Секторе 7", correct: true },
        { id: 4, text: "Проект 'Мёртвая петля'", correct: true },
        { id: 5, text: "Соц. инженерия изнутри", correct: true },
        { id: 6, text: "Сообщение Макса", correct: true },
        { id: 7, text: "GPS-координаты бункера", correct: true },
        { id: 8, text: "Пароль LOOP_BREAKER_2024", correct: true },
        { id: 9, text: "Теневые сотрудники", correct: true },
        { id: 10, text: "Личный файл Макса", correct: false },
        { id: 11, text: "Дневник администратора", correct: false },
        { id: 12, text: "Список покупок офиса", correct: false }
    ];

    const INTERROGATION_QUESTIONS = [
        { q: "Какой пароль использовал Shadow_Walker для доступа к архиву?", answer: "LOOP_BREAKER_2024", hint: "Пароль из миссии 8" },
        { q: "Как назывался проект массового слежения?", answer: "Мёртвая петля", hint: "Проект из миссии 4" },
        { q: "Как зовут главного подозреваемого?", answer: "Jean-Pierre Leroy", hint: "Имя из миссии 9" }
    ];

    const FINAL_CHOICES = [
        { id: "arrest", label: "АРЕСТОВАТЬ", desc: "Передать данные полиции", icon: "👮", result: "Leroy арестован. Макс освобождён. Справедливость восторжествовала." },
        { id: "expose", label: "ОПОЗОРИТЬ", desc: "Опубликовать в прессе", icon: "📰", result: "Скандал в СМИ. Neocorp разоблачён. Макс свободен." },
        { id: "confront", label: "КОНФРОНТАЦИЯ", desc: "Личная встреча", icon: "⚔️", result: "Драматическая развязка. Leroy сдаётся. Макс спасён." }
    ];

    useEffect(() => {
        if (stage === 3) {
            setCipherInput('');
            setCipherSolved(false);
        }
    }, [stage]);

    const handleTimelineClick = (event) => {
        if (!timeline.includes(event.date)) {
            setTimeline([...timeline, event.date]);
        }
    };

    const handleEvidenceSelect = (evidence) => {
        if (selectedEvidence.includes(evidence.id)) {
            setSelectedEvidence(selectedEvidence.filter(id => id !== evidence.id));
        } else {
            setSelectedEvidence([...selectedEvidence, evidence.id]);
        }
    };

    const handleCipherCheck = () => {
        if (cipherInput.toUpperCase().replace(/\s/g, '') === cipherTarget.replace(/\s/g, '')) {
            setCipherSolved(true);
        } else {
            setHealth(prev => Math.max(0, prev - 10));
        }
    };

    const handleInterrogationAnswer = () => {
        const correct = interrogationAnswer.toLowerCase().includes(INTERROGATION_QUESTIONS[interrogationStep].answer.toLowerCase().split(' ')[0]);
        if (correct) {
            setInterrogationCorrect(true);
            setTimeout(() => {
                if (interrogationStep < INTERROGATION_QUESTIONS.length - 1) {
                    setInterrogationStep(prev => prev + 1);
                    setInterrogationAnswer('');
                    setInterrogationCorrect(false);
                } else {
                    setStage(5);
                }
            }, 1500);
        } else {
            setHealth(prev => Math.max(0, prev - 15));
        }
    };

    const handleFinalChoice = (choice) => {
        setFinalChoice(choice);
        setTimeout(() => setStage(6), 2000);
    };

    // ЭКРАН 0: ВСТУПЛЕНИЕ
    if (stage === 0) return (
        <div className="window animate-fade" style={{ textAlign: 'center', padding: '60px', background: 'radial-gradient(circle, #1a0a0a 0%, #050505 100%)' }}>
            <Shield size={80} color="#ff4d4d" />
            <h1 className="glitch-text" style={{ color: '#ff4d4d', marginTop: '20px' }}>ФИНАЛЬНАЯ ОПЕРАЦИЯ</h1>
            <div style={{ maxWidth: '700px', margin: '30px auto', textAlign: 'left' }}>
                <div style={{ background: '#000', border: '1px solid #222', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ color: '#ff4d4d', fontSize: '11px', letterSpacing: '2px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={14} /> МИССИЯ 10 — ФИНАЛ
                    </div>
                    <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                        Все улики собраны. <b style={{ color: '#ff4d4d' }}>Jean-Pierre Leroy</b> — это <b style={{ color: '#ff4d4d' }}>Shadow_Walker</b>.
                        Он создал «Мёртвую петлю», похитил Макса и пытается уничтожить улики из <b style={{ color: '#00ff41' }}>Парижа</b>.
                    </p>
                </div>
                <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
                    Восстановите хронологию, соберите доказательства, дешифруйте кодовое имя, пройдите допрос 
                    и примите финальное решение. <b style={{ color: '#f7b500' }}>Подсказки</b> доступны на этапе допроса.
                </p>
            </div>
            <button className="btn-main" onClick={() => setStage(1)}>НАЧАТЬ ОПЕРАЦИЮ</button>
        </div>
    );

    // ЭКРАН 1: ХРОНОЛОГИЯ
    if (stage === 1) return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><Terminal size={14} /> ХРОНОЛОГИЯ</span>
                <span style={{ color: '#f7b500' }}>{timeline.length}/{TIMELINE_EVENTS.length}</span>
            </div>
            <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                <p style={{ color: '#888', marginBottom: '20px' }}>Нажмите на каждое событие по порядку:</p>
                <div style={{ position: 'relative', paddingLeft: '30px' }}>
                    <div style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '2px', background: '#222' }} />
                    {TIMELINE_EVENTS.map((event, idx) => (
                        <motion.div key={event.date} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                            onClick={() => handleTimelineClick(event)}
                            style={{ position: 'relative', marginBottom: '15px', padding: '15px',
                                background: timeline.includes(event.date) ? 'rgba(0,255,65,0.05)' : '#111',
                                border: `1px solid ${timeline.includes(event.date) ? '#00ff41' : '#222'}`, cursor: 'pointer' }}>
                            <div style={{ position: 'absolute', left: '-25px', top: '15px', width: '12px', height: '12px', borderRadius: '50%',
                                background: timeline.includes(event.date) ? '#00ff41' : '#333', border: '2px solid #000' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ color: '#4d94ff', fontSize: '12px', fontWeight: 'bold' }}>{event.date}.2024</span>
                                {timeline.includes(event.date) && <CheckCircle2 size={14} color="#00ff41" />}
                            </div>
                            <div style={{ color: '#fff', fontSize: '13px' }}>{event.event}</div>
                            {timeline.includes(event.date) && <div style={{ color: '#00ff41', fontSize: '11px', marginTop: '5px' }}>{event.clue}</div>}
                        </motion.div>
                    ))}
                </div>
            </div>
            {timeline.length >= TIMELINE_EVENTS.length && (
                <div style={{ padding: '15px', background: '#0a0a0a', borderTop: '1px solid #00ff41', textAlign: 'center' }}>
                    <button className="btn-main" onClick={() => setStage(2)}>ДАЛЕЕ</button>
                </div>
            )}
        </div>
    );

    // ЭКРАН 2: СБОР ДОКАЗАТЕЛЬСТВ
    if (stage === 2) return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><FileText size={14} /> ДОКАЗАТЕЛЬСТВА</span>
                <span style={{ color: '#f7b500' }}>ВЫБРАНО: {selectedEvidence.filter(id => EVIDENCE_OPTIONS.find(e => e.id === id)?.correct).length}</span>
            </div>
            <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                <p style={{ color: '#888', marginBottom: '20px' }}>Выберите <b style={{ color: '#00ff41' }}>настоящие улики</b> (9 штук):</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {EVIDENCE_OPTIONS.map(evidence => (
                        <motion.div key={evidence.id} whileHover={{ scale: 1.02 }} onClick={() => handleEvidenceSelect(evidence)}
                            style={{ padding: '12px', cursor: 'pointer',
                                background: selectedEvidence.includes(evidence.id) ? (evidence.correct ? 'rgba(0,255,65,0.1)' : 'rgba(255,77,77,0.1)') : '#111',
                                border: `1px solid ${selectedEvidence.includes(evidence.id) ? (evidence.correct ? '#00ff41' : '#ff4d4d') : '#222'}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '18px', height: '18px', border: '2px solid #444', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: selectedEvidence.includes(evidence.id) ? '#00ff41' : 'transparent' }}>
                                    {selectedEvidence.includes(evidence.id) && <CheckCircle2 size={10} color="#000" />}
                                </div>
                                <span style={{ color: '#ccc', fontSize: '12px' }}>{evidence.text}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            {selectedEvidence.filter(id => EVIDENCE_OPTIONS.find(e => e.id === id)?.correct).length >= 9 && (
                <div style={{ padding: '15px', background: '#0a0a0a', borderTop: '1px solid #00ff41', textAlign: 'center' }}>
                    <button className="btn-main" onClick={() => setStage(3)}>ДАЛЕЕ</button>
                </div>
            )}
        </div>
    );

    // ЭКРАН 3: ДЕШИФРОВКА КОДОВОГО ИМЕНИ
    if (stage === 3) return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><Lock size={14} /> ДЕШИФРОВКА</span>
                <span style={{ color: health > 50 ? '#00ff41' : '#ff4d4d' }}>HEALTH: {health}%</span>
            </div>
            <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {!cipherSolved ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}>
                        <Zap size={50} color="#f7b500" style={{ marginBottom: '20px' }} />
                        <h2 style={{ color: '#f7b500', marginBottom: '10px' }}>КОДОВОЕ ИМЯ</h2>
                        <p style={{ color: '#888', marginBottom: '30px' }}>Зашифрованное имя агента: найдите его настоящую личность</p>
                        
                        <div style={{ background: '#000', padding: '25px', border: '1px dashed #f7b500', marginBottom: '20px' }}>
                            <div style={{ fontSize: '10px', color: '#444', marginBottom: '10px' }}>ENCRYPTED_IDENTITY:</div>
                            <div style={{ fontSize: '24px', color: '#f7b500', fontFamily: 'monospace', letterSpacing: '4px' }}>
                                {cipherTarget.split('').map((c) => {
                                    if (c === '_') return '_';
                                    return String.fromCharCode(((c.charCodeAt(0) - 65 - 3 + 26) % 26) + 65);
                                }).join('')}
                            </div>
                        </div>

                        <div style={{ background: '#111', padding: '15px', border: '1px solid #222', marginBottom: '20px', fontSize: '12px', color: '#888', textAlign: 'left' }}>
                            <b style={{ color: '#f7b500' }}>ПОДСКАЗКА:</b> Каждая буква сдвинута на 3 позиции назад в алфавите. 
                            Шифр Цезаря: A→X, B→Y, C→Z, D→A...
                        </div>

                        <input type="text" value={cipherInput} onChange={(e) => setCipherInput(e.target.value)}
                            placeholder="Введите расшифрованное имя..."
                            style={{ width: '100%', background: '#000', border: '2px solid #333', color: '#00ff41',
                                padding: '15px', fontSize: '18px', fontFamily: 'monospace', outline: 'none', marginBottom: '15px' }}
                            onKeyDown={(e) => e.key === 'Enter' && handleCipherCheck()} />
                        <button className="btn-main" onClick={handleCipherCheck} style={{ width: '100%' }}>ПРОВЕРИТЬ</button>
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
                        <CheckCircle2 size={80} color="#00ff41" />
                        <h2 style={{ color: '#00ff41', marginTop: '20px' }}>ИДЕНТИФИКАЦИЯ ПОДТВЕРЖДЕНА</h2>
                        <p style={{ color: '#888', marginTop: '10px' }}>Shadow_Walker = <b style={{ color: '#ff4d4d' }}>Jean-Pierre Leroy</b></p>
                    </motion.div>
                )}
            </div>
            {cipherSolved && (
                <div style={{ padding: '15px', background: '#0a0a0a', borderTop: '1px solid #00ff41', textAlign: 'center' }}>
                    <button className="btn-main" onClick={() => setStage(4)}>ДОПРОС</button>
                </div>
            )}
        </div>
    );

    // ЭКРАН 4: ДОПРОС
    if (stage === 4) return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><Eye size={14} /> ДОПРОС</span>
                <span style={{ color: health > 50 ? '#00ff41' : '#ff4d4d' }}>HEALTH: {health}% | ВОПРОС: {interrogationStep + 1}/{INTERROGATION_QUESTIONS.length}</span>
            </div>
            <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <div style={{ background: '#111', border: '1px solid #222', padding: '30px', marginBottom: '20px' }}>
                        <div style={{ color: '#4d94ff', fontSize: '11px', letterSpacing: '1px', marginBottom: '15px' }}>ВОПРОС {interrogationStep + 1}:</div>
                        <div style={{ color: '#fff', fontSize: '16px', marginBottom: '20px' }}>{INTERROGATION_QUESTIONS[interrogationStep].q}</div>
                        
                        <input type="text" value={interrogationAnswer} onChange={(e) => setInterrogationAnswer(e.target.value)}
                            placeholder="Введите ответ..."
                            style={{ width: '100%', background: '#000', border: `2px solid ${interrogationCorrect ? '#00ff41' : '#333'}`,
                                color: interrogationCorrect ? '#00ff41' : '#fff', padding: '15px', fontSize: '16px', outline: 'none', marginBottom: '15px' }}
                            onKeyDown={(e) => e.key === 'Enter' && handleInterrogationAnswer()}
                            disabled={interrogationCorrect} />
                        
                        {!interrogationCorrect && (
                            <button className="btn-main" onClick={handleInterrogationAnswer} style={{ width: '100%' }}>ОТВЕТИТЬ</button>
                        )}
                        {interrogationCorrect && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#00ff41', textAlign: 'center', fontWeight: 'bold' }}>
                                ПРАВИЛЬНО!
                            </motion.div>
                        )}
                    </div>
                    <button onClick={() => setShowHint(!showHint)} className="lockdown-btn" style={{ width: '100%' }}>
                        <HelpCircle size={14} style={{ marginRight: '8px' }} />ПОДСКАЗКА
                    </button>
                    {showHint && (
                        <div style={{ background: '#000', border: '1px solid #f7b500', padding: '12px', color: '#f7b500', fontSize: '11px', marginTop: '10px' }}>
                            {INTERROGATION_QUESTIONS[interrogationStep].hint}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // ЭКРАН 5: ФИНАЛЬНОЕ РЕШЕНИЕ
    if (stage === 5) return (
        <div className="window animate-fade" style={{ textAlign: 'center', padding: '60px', background: 'radial-gradient(circle, #1a0a0a 0%, #050505 100%)' }}>
            <Target size={80} color="#ff4d4d" />
            <h2 style={{ color: '#ff4d4d', marginTop: '20px', marginBottom: '10px' }}>ФИНАЛЬНОЕ РЕШЕНИЕ</h2>
            <p style={{ color: '#888', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                Доказательства собраны. Допрос пройден. Как поступить с Shadow_Walker?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
                {FINAL_CHOICES.map(choice => (
                    <motion.div key={choice.id} whileHover={{ scale: 1.05, y: -5 }} onClick={() => handleFinalChoice(choice)}
                        style={{ background: '#111', border: '1px solid #222', padding: '30px', cursor: 'pointer', textAlign: 'center' }}>
                        <div style={{ fontSize: '40px', marginBottom: '15px' }}>{choice.icon}</div>
                        <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>{choice.label}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>{choice.desc}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    // ЭКРАН 6: ФИНАЛ
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="window animate-fade mission-win">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
                <div className="mission-win-icon">
                    <Award size={72} color="#00ff41" />
                </div>
            </motion.div>
            <h1 className="glitch-text mission-win-title" style={{ color: '#00ff41' }}>МИССИЯ ВЫПОЛНЕНА</h1>
            <p className="mission-win-subtitle">{finalChoice?.result}</p>
            
            <div className="mission-stats">
                <div className="mission-stat">
                    <div className="mission-stat-label">МИССИЙ</div>
                    <div className="mission-stat-value" style={{ color: '#4d94ff' }}>10</div>
                </div>
                <div className="mission-stat">
                    <div className="mission-stat-label">УЛИК</div>
                    <div className="mission-stat-value" style={{ color: '#00ff41' }}>10</div>
                </div>
                <div className="mission-stat">
                    <div className="mission-stat-label">РЕЗУЛЬТАТ</div>
                    <div className="mission-stat-value" style={{ color: '#f7b500', fontSize: '14px' }}>ПОБЕДА</div>
                </div>
            </div>

            <div className="mission-clue">
                <p className="mission-clue-text">
                    Вы прошли путь от стажёра до агента. Раскрыли сеть Neocorp, нашли Макса и обезвредили 
                    <b style={{ color: '#ff4d4d' }}> Shadow_Walker</b>. Помните: <b style={{ color: '#00ff41' }}>бдительность — лучшая защита!</b>
                </p>
            </div>

            <button className="btn-huge" onClick={() => onComplete(currentPoints + 10000)}>ЗАВЕРШИТЬ ИГРУ</button>
        </motion.div>
    );
};

export default FinalMission;
