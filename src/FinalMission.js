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
    const [hintLevel, setHintLevel] = useState(0);
    const [timelineErrors, setTimelineErrors] = useState(0);
    const [timelineWrongFlash, setTimelineWrongFlash] = useState(null);

    const TIMELINE_EVENTS = [
        { date: "10.05", event: "Shadow_Walker впервые замечен", clue: "Вход в систему в 3:00 ночи. Пароль изменён внешним скриптом.", details: "Лог показывает подключение с IP 192.168.7.42. Сессия длилась 22 минуты. Все действия были автоматизированы." },
        { date: "12.05", event: "Фишинговая атака", clue: "Гомограф в домене: paypaI.com вместо paypal.com", details: "Рассылка на 200 сотрудников Neocorp. 3 человека ввели данные. Обнаружена кириллическая 'о' в адресе." },
        { date: "14.05", event: "Сервер в Секторе 7", clue: "Старое здание Neocorp защищено файрволом", details: "Сигнал прыгал через 7 прокси-серверов. Точка выхода: здание в промзоне. 3 уровня защиты: порт, частота, матрица." },
        { date: "18.05", event: "Проект Мёртвая петля", clue: "База данных массового распознавания лиц", details: "Содержит 2.4 млн записей. Камеры по всему Парижу подключены к единой сети. Neocorp финансировал проект из офшора." },
        { date: "20.05", event: "Социальная инженерия", clue: "Хакер работает внутри офиса Neocorp", details: "Ивану позвонили и представились руководителем. Попросили срочно перевести данные. Звонок шёл с внутреннего номера." },
        { date: "22.05", event: "Сообщение Макса", clue: "MAX_ALIVE_2024!!!", details: "Зашифровано шифром Цезаря (ROT13). Сигнал зашит в повреждённый сектор памяти. Макс жив!" },
        { date: "24.05", event: "GPS-координаты", clue: "48.8584, 2.2945 — бункер под Эйфелевой", details: "Извлечены из повреждённого фото через RGB-фильтры. Скрытый слой данных восстановлен." },
        { date: "26.05", event: "Ключ от архива", clue: "LOOP_BREAKER_2024", details: "Взлом 4-значного кода сейфа. Метод_Wordle — зелёный/жёлтый/серый. Код вёл к зашифрованному архиву." },
        { date: "28.05", event: "Имя Shadow_Walker", clue: "Jean-Pierre Leroy — Chief Security Architect", details: "Данные извлечены из скрытой админ-панели Neocorp. Шесть разделов: пользователи, логи, финансы, переписка, теневые сотрудники, локация." }
    ];

    const EVIDENCE_OPTIONS = [
        { id: 1, text: "Логи входа в 3:00 ночи", correct: true },
        { id: 2, text: "Фишинг с гомографом", correct: true },
        { id: 3, text: "Сервер в Секторе 7", correct: true },
        { id: 4, text: "Проект Мёртвая петля", correct: true },
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
        { q: "Какой пароль использовал Shadow_Walker для доступа к архиву?", answer: "LOOP_BREAKER_2024", hint1: "Этот пароль вы взломали в миссии 8, вскрывая сейф", hint2: "LOOP_BREAKER_2024" },
        { q: "Как назывался проект массового слежения?", answer: "Мёртвая петля", answerAlt: "Мертвая петля", hint1: "Этот проект вы нашли в базе данных Neocorp (миссия 4)", hint2: "Мёртвая петля (или Мертвая петля)" },
        { q: "Как зовут главного подозреваемого?", answer: "Jean-Pierre Leroy", hint1: "Это имя вы нашли в разделе 'Теневые сотрудники' админ-панели (миссия 9)", hint2: "Jean-Pierre Leroy" }
    ];

    const FINAL_CHOICES = [
        { 
            id: "arrest", label: "АРЕСТОВАТЬ", desc: "Передать данные полиции", icon: "👮", 
            result: "Leroy арестован. Макс освобождён. Справедливость восторжествовала.",
            title: "АРЕСТ",
            color: "#4d94ff",
            story: "Спецоперация проведена в 4:00 утра. Группа захвата вошла в бункер под Эйфелевой башней. Leroy не успел уничтожить доказательства. Он задержан и передан в руки Interpol. Проект «Мёртвая петля» полностью ликвидирован.",
            maxLetter: "Привет, агент! Я свободен. Спасибо тебе. Когда я лежал в темноте этого бункера, я знал — кто-то придет. И ты пришел. Спасибо, что не сдался. Я вернусь к работе, но теперь буду осторожнее. Ты настоящий герой. — Макс"
        },
        { 
            id: "expose", label: "ОПОЗОРИТЬ", desc: "Опубликовать в прессе", icon: "📰", 
            result: "Скандал в СМИ. Neocorp разоблачён. Макс свободен.",
            title: "РАЗОБЛАЧЕНИЕ",
            color: "#f7b500",
            story: "Доказательства опубликованы в крупнейших СМИ. Компания Neocorp обвиняется в массовой слежке за гражданами. Leroy бежал из страны, но Interpol выдал ордер на арест. Макс освобождён. Общество в шоке — проект «Мёртвая петля» стал символом цифрового контроля.",
            maxLetter: "Привет! Я на свободе. То, что ты сделал — изменило мир. Люди теперь знают правду о Neocorp. Я горжусь тобой. Может, однажды мы снова будем работать вместе. Спасибо за всё. — Макс"
        },
        { 
            id: "confront", label: "КОНФРОНТАЦИЯ", desc: "Личная встреча", icon: "⚔️", 
            result: "Драматическая развязка. Leroy сдаётся. Макс спасён.",
            title: "КОНФРОНТАЦИЯ",
            color: "#ff4d4d",
            story: "Ты вошёл в бункер один. Leroy ждал тебя. «Я знал, что ты придешь», — сказал он. Разговор длился 47 минут. В конце Leroy сдался добровольно. Макс был освобождён. Позже Leroy признался: он хотел, чтобы его остановили.",
            maxLetter: "Привет, агент. Я слышал, что ты пришел один. Без поддержки, без оружия. Просто чтобы спасти меня. Ты — самый отважный человек, которого я знаю. Спасибо. Я буду помнить это всю жизнь. — Макс"
        }
    ];

    useEffect(() => {
        if (stage === 3) {
            setCipherInput('');
            setCipherSolved(false);
        }
    }, [stage]);

    const handleTimelineClick = (event) => {
        if (timeline.includes(event.date)) return;
        const nextExpected = TIMELINE_EVENTS[timeline.length];
        if (event.date === nextExpected.date) {
            setTimeline([...timeline, event.date]);
        } else {
            setTimelineErrors(prev => prev + 1);
            setTimelineWrongFlash(event.date);
            setTimeout(() => setTimelineWrongFlash(null), 600);
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
        const q = INTERROGATION_QUESTIONS[interrogationStep];
        const normalize = (s) => s.toLowerCase().replace(/ё/g, 'е').trim();
        const userAnswer = normalize(interrogationAnswer);
        const correctAnswer = normalize(q.answer);
        const altAnswer = q.answerAlt ? normalize(q.answerAlt) : null;
        const correct = userAnswer.includes(correctAnswer.split(' ')[0]) || (altAnswer && userAnswer.includes(altAnswer.split(' ')[0]));
        if (correct) {
            setInterrogationCorrect(true);
            setTimeout(() => {
                if (interrogationStep < INTERROGATION_QUESTIONS.length - 1) {
                    setInterrogationStep(prev => prev + 1);
                    setInterrogationAnswer('');
                    setInterrogationCorrect(false);
                    setShowHint(false);
                    setHintLevel(0);
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
        <div className="window animate-fade mission-intro" style={{ textAlign: 'center', padding: '40px 16px', background: 'radial-gradient(circle, #1a0a0a 0%, #050505 100%)' }}>
            <div className="mission-intro-icon"><Shield size={72} color="#ff4d4d" /></div>
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
    if (stage === 1) {
        const nextEvent = TIMELINE_EVENTS[timeline.length];
        return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span><Terminal size={14} /> ХРОНОЛОГИЯ</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {timelineErrors > 0 && <span style={{ color: '#ff4d4d', fontSize: '10px' }}>ОШИБОК: {timelineErrors}</span>}
                    <span style={{ color: '#f7b500' }}>{timeline.length}/{TIMELINE_EVENTS.length}</span>
                    <button onClick={() => { setShowHint(!showHint); if (!showHint) setHintLevel(1); }} style={{ background: 'none', border: 'none', color: showHint ? '#f7b500' : '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                        <HelpCircle size={14} /> ПОДСКАЗКА
                    </button>
                </div>
            </div>

            {showHint && (
                <div style={{ background: '#000', border: '1px solid #f7b500', padding: '10px 16px', margin: '0 12px', color: '#f7b500', fontSize: '11px', lineHeight: '1.5' }}>
                    {hintLevel === 1 && (
                        <div>
                            Нажимайте на события в строгом хронологическом порядке — от ранних дат к поздним. Обратите внимание на даты в формате ДД.ММ.
                            <button onClick={() => setHintLevel(2)} style={{ marginTop: '8px', background: '#f7b500', color: '#000', border: 'none', padding: '3px 8px', fontSize: '10px', cursor: 'pointer' }}>
                                Показать ответ
                            </button>
                        </div>
                    )}
                    {hintLevel === 2 && (
                        <div>
                            <b>Порядок:</b> 10.05 → 12.05 → 14.05 → 18.05 → 20.05 → 22.05 → 24.05 → 26.05 → 28.05
                            <div style={{ marginTop: '4px', color: '#888' }}>Просто нажимайте события сверху вниз по порядку.</div>
                        </div>
                    )}
                </div>
            )}

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <p style={{ color: '#888', marginBottom: '16px', fontSize: '13px' }}>
                    {nextEvent 
                        ? <>Следующее событие: <span style={{ color: '#4d94ff' }}>{nextEvent.date}.2024</span> — нажмите на него</>
                        : 'Все события найдены!'
                    }
                </p>
                <div style={{ position: 'relative', paddingLeft: '30px' }}>
                    <div style={{ position: 'absolute', left: '10px', top: 0, bottom: 0, width: '2px', background: '#222' }} />
                    {TIMELINE_EVENTS.map((event, idx) => {
                        const isDone = timeline.includes(event.date);
                        const isNext = nextEvent && event.date === nextEvent.date;
                        const isWrongFlash = timelineWrongFlash === event.date;
                        return (
                            <motion.div key={event.date} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                                onClick={() => handleTimelineClick(event)}
                                style={{ position: 'relative', marginBottom: '12px', padding: '14px',
                                    background: isWrongFlash ? 'rgba(255,77,77,0.15)' : isDone ? 'rgba(0,255,65,0.05)' : '#111',
                                    border: `1px solid ${isWrongFlash ? '#ff4d4d' : isDone ? '#00ff41' : isNext ? '#f7b500' : '#222'}`, 
                                    cursor: isDone ? 'default' : 'pointer', transition: '0.3s', opacity: !isDone && !isNext && timeline.length > 0 ? 0.4 : 1 }}>
                                <div style={{ position: 'absolute', left: '-25px', top: '14px', width: '12px', height: '12px', borderRadius: '50%',
                                    background: isDone ? '#00ff41' : isNext ? '#f7b500' : '#333', border: '2px solid #000',
                                    boxShadow: isNext ? '0 0 8px rgba(247,181,0,0.5)' : 'none' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ color: isDone ? '#00ff41' : isNext ? '#f7b500' : '#4d94ff', fontSize: '11px', fontWeight: 'bold' }}>{event.date}.2024</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isNext && !isDone && <span style={{ color: '#f7b500', fontSize: '9px', letterSpacing: '1px' }}>→ СЛЕДУЮЩЕЕ</span>}
                                        {isDone && <CheckCircle2 size={14} color="#00ff41" />}
                                        {isWrongFlash && <span style={{ color: '#ff4d4d', fontSize: '10px', fontWeight: 'bold' }}>НЕВЕРНО</span>}
                                    </div>
                                </div>
                                <div style={{ color: isDone ? '#fff' : '#888', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>{event.event}</div>
                                {isDone && (
                                    <div>
                                        <div style={{ color: '#00ff41', fontSize: '11px', marginBottom: '4px' }}>{event.clue}</div>
                                        <div style={{ color: '#888', fontSize: '11px', lineHeight: '1.5', borderTop: '1px solid #222', paddingTop: '8px', marginTop: '6px' }}>{event.details}</div>
                                    </div>
                                )}
                                {!isDone && !isNext && <div style={{ color: '#444', fontSize: '10px' }}>Ожидает очереди</div>}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            {timeline.length >= TIMELINE_EVENTS.length && (
                <div style={{ padding: '15px', background: '#0a0a0a', borderTop: '1px solid #00ff41', textAlign: 'center' }}>
                    <button className="btn-main" onClick={() => setStage(2)}>ДАЛЕЕ</button>
                </div>
            )}
        </div>
        );
    }

    // ЭКРАН 2: СБОР ДОКАЗАТЕЛЬСТВ
    if (stage === 2) return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span><FileText size={14} /> ДОКАЗАТЕЛЬСТВА</span>
                <span style={{ color: '#f7b500' }}>ВЫБРАНО: {selectedEvidence.filter(id => EVIDENCE_OPTIONS.find(e => e.id === id)?.correct).length}</span>
            </div>
            <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                <p style={{ color: '#888', marginBottom: '20px' }}>Выберите <b style={{ color: '#00ff41' }}>настоящие улики</b> (9 штук):</p>
                <div className="final-evidence-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span><Lock size={14} /> ДЕШИФРОВКА</span>
                <span style={{ color: health > 50 ? '#00ff41' : '#ff4d4d' }}>HEALTH: {health}%</span>
            </div>
            <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {!cipherSolved ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', width: '100%', maxWidth: '500px' }}>
                        <Zap size={50} color="#f7b500" style={{ marginBottom: '20px' }} />
                        <h2 style={{ color: '#f7b500', marginBottom: '10px' }}>КОДОВОЕ ИМЯ</h2>
                        <p style={{ color: '#888', marginBottom: '30px' }}>Зашифрованное имя агента: найдите его настоящую личность</p>
                        
                        <div style={{ background: '#000', padding: '20px', border: '1px dashed #f7b500', marginBottom: '20px' }}>
                            <div style={{ fontSize: '10px', color: '#444', marginBottom: '10px' }}>ENCRYPTED_IDENTITY:</div>
                            <div style={{ fontSize: '20px', color: '#f7b500', fontFamily: 'monospace', letterSpacing: '3px', wordBreak: 'break-all' }}>
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
                            className="cipher-input"
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
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
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
                            className="interrogation-input"
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
                    <button onClick={() => { setShowHint(!showHint); if (!showHint) setHintLevel(1); }} className="lockdown-btn" style={{ width: '100%' }}>
                        <HelpCircle size={14} style={{ marginRight: '8px' }} />ПОДСКАЗКА
                    </button>
                    {showHint && (
                        <div style={{ background: '#000', border: '1px solid #f7b500', padding: '12px', color: '#f7b500', fontSize: '11px', marginTop: '10px', lineHeight: '1.5' }}>
                            {hintLevel === 1 && (
                                <div>
                                    <div>{INTERROGATION_QUESTIONS[interrogationStep].hint1}</div>
                                    <button onClick={() => setHintLevel(2)} style={{ marginTop: '8px', background: '#f7b500', color: '#000', border: 'none', padding: '4px 8px', fontSize: '10px', cursor: 'pointer' }}>
                                        Показать ответ
                                    </button>
                                </div>
                            )}
                            {hintLevel === 2 && <div>{INTERROGATION_QUESTIONS[interrogationStep].hint2}</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // ЭКРАН 5: ФИНАЛЬНОЕ РЕШЕНИЕ
    if (stage === 5) return (
        <div className="window animate-fade mission-intro" style={{ textAlign: 'center', padding: '40px 16px', background: 'radial-gradient(circle, #1a0a0a 0%, #050505 100%)' }}>
            <div className="mission-intro-icon"><Target size={72} color="#ff4d4d" /></div>
            <h2 style={{ color: '#ff4d4d', marginTop: '20px', marginBottom: '10px' }}>ФИНАЛЬНОЕ РЕШЕНИЕ</h2>
            <p style={{ color: '#888', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                Доказательства собраны. Допрос пройден. Как поступить с Shadow_Walker?
            </p>
            <div className="final-choices-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', maxWidth: '900px', margin: '0 auto', padding: '0 12px' }}>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="window animate-fade mission-win" style={{ padding: '30px 16px' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
                <div className="mission-win-icon">
                    <Award size={72} color="#00ff41" />
                </div>
            </motion.div>
            <h1 className="glitch-text mission-win-title" style={{ color: finalChoice?.color || '#00ff41' }}>{finalChoice?.title || 'МИССИЯ ВЫПОЛНЕНА'}</h1>
            <p className="mission-win-subtitle" style={{ padding: '0 12px' }}>{finalChoice?.result}</p>
            
            {/* Story based on choice */}
            <div style={{ background: '#000', border: `1px solid ${finalChoice?.color}33`, padding: '20px', margin: '20px auto', maxWidth: '600px', textAlign: 'left' }}>
                <div style={{ color: finalChoice?.color, fontSize: '10px', letterSpacing: '2px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={14} /> ФИНАЛЬНЫЙ ОТЧЁТ
                </div>
                <p style={{ color: '#ccc', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>{finalChoice?.story}</p>
            </div>

            {/* Max's letter */}
            <div style={{ background: '#0a0a0a', border: '1px solid #00ff41', padding: '20px', margin: '20px auto', maxWidth: '600px', textAlign: 'left', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '20px', background: '#0a0a0a', padding: '0 8px' }}>
                    <span style={{ color: '#00ff41', fontSize: '10px', letterSpacing: '2px', fontWeight: 'bold' }}>✉ ПИСЬМО ОТ МАКСА</span>
                </div>
                <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.8', margin: 0, fontStyle: 'italic', whiteSpace: 'pre-line' }}>{finalChoice?.maxLetter}</p>
                <div style={{ textAlign: 'right', marginTop: '12px', color: '#00ff41', fontSize: '12px', fontWeight: 'bold' }}>— Макс</div>
            </div>
            
            <div className="mission-stats" style={{ margin: '20px auto', maxWidth: '600px' }}>
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
                    <div className="mission-stat-value" style={{ color: finalChoice?.color || '#f7b500', fontSize: '14px' }}>{finalChoice?.label || 'ПОБЕДА'}</div>
                </div>
            </div>

            <div className="mission-clue" style={{ maxWidth: '600px', margin: '0 auto 20px' }}>
                <p className="mission-clue-text">
                    Вы прошли путь от стажёра до агента. Раскрыли сеть Neocorp, нашли Макса и обезвредили 
                    <b style={{ color: '#ff4d4d' }}> Shadow_Walker</b>. Помните: <b style={{ color: '#00ff41' }}>бдительность — лучшая защита!</b>
                </p>
            </div>

            <button className="btn-huge" onClick={() => onComplete(currentPoints + 10000)} style={{ maxWidth: '400px', margin: '0 auto' }}>ЗАВЕРШИТЬ ИГРУ</button>
        </motion.div>
    );
};

export default FinalMission;
