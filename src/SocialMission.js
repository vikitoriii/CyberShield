import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldAlert, AlertTriangle, MessageSquare, Info } from 'lucide-react';

const SocialMission = ({ username, currentPoints, onComplete }) => {
    const [step, setStep] = useState(0); // 0: Intro, 1: Chat, 2: Final
    const [analyzedIndices, setAnalyzedIndices] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [xp, setXp] = useState(0);

    // Сценарий чата
    const CHAT_LOG = [
        { sender: "IT_SUPPORT_HELP", text: "Привет! Я из центрального ИТ-отдела. Мы зафиксировали подозрительную активность в твоем аккаунте.", type: "SAFE" },
        { sender: "IT_SUPPORT_HELP", text: "МНЕ НУЖНО, ЧТОБЫ ТЫ ПРИСЛАЛ СВОЙ ВРЕМЕННЫЙ КОД ДОСТУПА ПРЯМО СЕЙЧАС, ИНАЧЕ МЫ ЗАБЛОКИРУЕМ ТВОЮ УЧЕТКУ НАВСЕГДА!", type: "THREAT", tactic: "СРОЧНОСТЬ И СТРАХ", reason: "Настоящая поддержка никогда не угрожает увольнением или немедленной блокировкой в чате." },
        { sender: "СОТРУДНИК_ИВАН", text: "Ой, я не знал... А это точно обязательно? Я сейчас на совещании.", type: "SAFE" },
        { sender: "IT_SUPPORT_HELP", text: "Это приказ начальника отдела безопасности. У нас нет времени на совещания, данные утекают!", type: "THREAT", tactic: "АВТОРИТЕТ", reason: "Злоумышленники часто ссылаются на руководство, чтобы жертва побоялась задавать лишние вопросы." },
        { sender: "СОТРУДНИК_ИВАН", text: "Ладно, сейчас поищу код...", type: "SAFE" },
        { sender: "IT_SUPPORT_HELP", text: "Просто перейди по этой ссылке: http://it-support-portal.net/verify и введи его там. Поторопись!", type: "THREAT", tactic: "ПОДДЕЛЬНЫЙ ДОМЕН", reason: "Ссылка ведет на сторонний ресурс .net, хотя корпоративная сеть использует .com." }
    ];

    const handleAnalyze = (index) => {
        if (analyzedIndices.includes(index)) return;
        
        const msg = CHAT_LOG[index];
        if (msg.type === "THREAT") {
            setFeedback({ isCorrect: true, tactic: msg.tactic, text: msg.reason });
            setXp(v => v + 400);
        } else {
            setFeedback({ isCorrect: false, tactic: "ОШИБКА", text: "Это сообщение выглядит как обычный текст. Ищите манипуляцию!" });
        }
        setAnalyzedIndices([...analyzedIndices, index]);
    };

    if (step === 0) return (
        <div className="window animate-fade" style={{ textAlign: 'center', padding: '50px' }}>
            <MessageSquare size={60} color="#00ff41" />
            <h1 className="glitch-text" style={{color: '#00ff41'}}>СОЦИАЛЬНАЯ ИНЖЕНЕРИЯ</h1>
            <p style={{maxWidth: '600px', margin: '20px auto', color: '#ccc'}}>
                Хакер обманул сотрудника Ивана, используя психологическое давление. 
                Ваша задача: изучить лог чата и <b>пометить 3 вредоносных сообщения</b>, в которых скрыта манипуляция.
            </p>
            <button className="btn-main" onClick={() => setStep(1)}>НАЧАТЬ АНАЛИЗ</button>
        </div>
    );

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px', height: '100%' }}>
            {/* ЛЕВАЯ ПАНЕЛЬ: ЧАТ */}
            <div className="window" style={{ display: 'flex', flexDirection: 'column', background: '#050505' }}>
                <div className="panel-header"><User size={14} /> <span>LOG_CHAT_SESSION_#882</span></div>
                
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {CHAT_LOG.map((msg, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: msg.sender === 'СОТРУДНИК_ИВАН' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => handleAnalyze(i)}
                            style={{
                                alignSelf: msg.sender === 'СОТРУДНИК_ИВАН' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: '12px 18px',
                                background: msg.sender === 'СОТРУДНИК_ИВАН' ? '#1a1a1a' : '#0a1a0a',
                                border: analyzedIndices.includes(i) && msg.type === 'THREAT' ? '1px solid #00ff41' : '1px solid #222',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            <div style={{ fontSize: '10px', color: '#444', marginBottom: '5px' }}>{msg.sender}</div>
                            <div style={{ fontSize: '14px', color: '#eee' }}>{msg.text}</div>
                            {analyzedIndices.includes(i) && msg.type === 'THREAT' && (
                                <ShieldAlert size={14} color="#00ff41" style={{ position: 'absolute', top: '-5px', right: '-5px' }} />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ПРАВАЯ ПАНЕЛЬ: АНАЛИЗ */}
            <div className="window" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div className="panel-header"><Info size={14} /> РЕЗУЛЬТАТ АНАЛИЗА</div>
                
                <div style={{ flex: 1, marginTop: '20px' }}>
                    <AnimatePresence mode="wait">
                        {feedback ? (
                            <motion.div key={feedback.text} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div style={{ color: feedback.isCorrect ? '#00ff41' : '#ff4d4d', fontWeight: 'bold', marginBottom: '10px' }}>
                                    {feedback.tactic}
                                </div>
                                <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.5' }}>{feedback.text}</p>
                            </motion.div>
                        ) : (
                            <div style={{ color: '#333', textAlign: 'center', marginTop: '50px' }}>
                                <AlertTriangle size={40} />
                                <p>Кликните на подозрительное <br/>сообщение в чате</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ borderTop: '1px solid #222', paddingTop: '20px' }}>
                    <div style={{ fontSize: '10px', color: '#444', marginBottom: '10px' }}>НАЙДЕНО УЛИК: {analyzedIndices.filter(i => CHAT_LOG[i].type === 'THREAT').length} / 3</div>
                    {analyzedIndices.filter(i => CHAT_LOG[i].type === 'THREAT').length >= 3 && (
                        <button className="btn-huge ready" onClick={() => onComplete(currentPoints + xp)}>ЗАВЕРШИТЬ РАССЛЕДОВАНИЕ</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocialMission;