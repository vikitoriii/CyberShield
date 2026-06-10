import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Search, Terminal, AlertCircle, Check, Book, Filter, Trash2, Play } from 'lucide-react';

const DatabaseMission = ({ username, currentPoints, onComplete }) => {
    const [taskStep, setTaskStep] = useState(1); // 1: List all, 2: Find token
    const [query, setQuery] = useState([]);
    const [result, setResult] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [xp, setXp] = useState(0);

    const SQL_DICTIONARY = {
        "SELECT": "Определяет, какие СТОЛБЦЫ данных мы хотим увидеть.",
        "*": "Специальный символ, означающий 'ВСЕ СТОЛБЦЫ'.",
        "FROM": "Указывает, из какой ТАБЛИЦЫ нужно взять данные.",
        "users": "Название нашей основной таблицы с данными агентов.",
        "WHERE": "Условие (фильтр). Позволяет найти конкретную строку.",
        "role=": "Сравнение роли пользователя (например, поиск админа).",
        "'admin'": "Текстовое значение для поиска (пишется в кавычках).",
        "access_token": "Название секретного столбца, где спрятан пароль."
    };

    const SQL_FRAGMENTS = ["SELECT", "*", "access_token", "FROM", "users", "WHERE", "role=", "'admin'"];

    const MOCK_DATA = [
        { id: 1, name: "Admin", role: "admin", email: "root@corp.com" },
        { id: 2, name: "User_12", role: "user", email: "dev@mail.ru" },
        { id: 3, name: "Security_Bot", role: "system", email: "bot@shield.io" }
    ];

    const TASKS = {
        1: {
            text: "ВЫВЕСТИ ВСЕ ДАННЫЕ ИЗ ТАБЛИЦЫ 'users' ДЛЯ ИЗУЧЕНИЯ СТРУКТУРЫ",
            target: "SELECT * FROM users"
        },
        2: {
            text: "ИЗВЛЕЧЬ 'access_token' ТОЛЬКО ДЛЯ ПОЛЬЗОВАТЕЛЯ С РОЛЬЮ 'admin'",
            target: "SELECT access_token FROM users WHERE role= 'admin'"
        }
    };

    const executeQuery = () => {
        const queryStr = query.join(" ");
        
        if (taskStep === 1 && queryStr === TASKS[1].target) {
            setResult(MOCK_DATA);
            setFeedback({ isCorrect: true, text: "Доступ к таблице получен! Теперь вы видите структуру. Переходим к поиску токена." });
            setTimeout(() => { setTaskStep(2); setQuery([]); setResult(null); setFeedback(null); }, 3000);
        } 
        else if (taskStep === 2 && queryStr === TASKS[2].target) {
            setResult([{ access_token: "CS_OS{SQL_DETECTION_SUCCESS}" }]);
            setFeedback({ isCorrect: true, text: "ТОКЕН НАЙДЕН! Вы успешно взломали защиту и восстановили доступ." });
            setXp(2000);
        } 
        else {
            setFeedback({ isCorrect: false, text: "Ошибка в логике запроса. Проверьте последовательность слов или загляните в справочник." });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px', padding: '10px' }}>
            
            {/* ШАПКА С ТЕКУЩЕЙ ЗАДАЧЕЙ */}
            <div className="window" style={{ background: '#0a1a0a', border: '1px solid #00ff41', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#00ff41', color: '#000', padding: '5px 10px', fontWeight: 'bold', borderRadius: '4px' }}>ЦЕЛЬ {taskStep}</div>
                    <div style={{ color: '#00ff41', fontSize: '18px', letterSpacing: '1px', fontWeight: 'bold' }}>{TASKS[taskStep].text}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '20px', flex: 1, minHeight: 0 }}>
                
                {/* ЛЕВАЯ ПАНЕЛЬ: КОНСОЛЬ */}
                <div className="window" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><Terminal size={14} /> SQL_CONSOLE_V3</span>
                        <button onClick={() => setShowHint(true)} style={{ background: '#111', border: '1px solid #00ff41', color: '#00ff41', padding: '2px 10px', cursor: 'pointer', fontSize: '11px' }}>
                            <Book size={12} /> СПРАВОЧНИК SQL
                        </button>
                    </div>

                    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Поле ввода запроса */}
                        <div style={{ background: '#000', border: '1px solid #333', minHeight: '100px', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                            <span style={{ color: '#444' }}>SQL {'>'}</span>
                            {query.map((frag, i) => (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} key={i} style={{ color: '#00ff41', background: '#0a1a0a', padding: '5px 10px', border: '1px solid #00ff41' }}>{frag}</motion.span>
                            ))}
                        </div>

                        {/* Таблица результатов */}
                        <div style={{ flex: 1, background: '#050505', border: '1px solid #222', padding: '15px', overflowY: 'auto' }}>
                            {result ? (
                                <table style={{ width: '100%', color: '#eee', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: '#444' }}>
                                            {Object.keys(result[0]).map(k => <th key={k} style={{ padding: '10px' }}>{k.toUpperCase()}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map((row, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                                                {Object.values(row).map((v, j) => (
                                                    <td key={j} style={{ padding: '10px', color: (typeof v === 'string' && v.includes('{')) ? '#00ff41' : '#eee' }}>{v}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}><Database size={60}/></div>
                            )}
                        </div>
                    </div>

                    <div style={{ padding: '20px', display: 'flex', gap: '10px', background: '#0a0a0a' }}>
                        <button className="btn-action" onClick={() => setQuery([])} style={{ color: '#ff4d4d', borderColor: '#ff4d4d' }}><Trash2 size={16}/> СТЕРЕТЬ</button>
                        <button className="btn-main" style={{ flex: 1 }} onClick={executeQuery} disabled={query.length === 0}><Play size={16}/> ВЫПОЛНИТЬ</button>
                    </div>
                </div>

                {/* ПРАВАЯ ПАНЕЛЬ: КОНСТРУКТОР */}
                <div className="window" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="panel-header"><Filter size={14} /> ДОСТУПНЫЕ ОПЕРАТОРЫ</div>
                    <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {SQL_FRAGMENTS.map(frag => (
                            <button key={frag} className="btn-action" onClick={() => setQuery([...query, frag])} style={{ fontSize: '13px' }}>{frag}</button>
                        ))}
                    </div>

                    {/* Ответ системы */}
                    <div style={{ marginTop: 'auto', padding: '20px', background: '#050505', borderTop: '1px solid #222' }}>
                        <AnimatePresence>
                            {feedback && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <div style={{ color: feedback.isCorrect ? '#00ff41' : '#ff4d4d', fontSize: '13px', fontWeight: 'bold', display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        {feedback.isCorrect ? <Check size={14}/> : <AlertCircle size={14}/>} {feedback.isCorrect ? "АНАЛИЗ УСПЕШЕН" : "ОШИБКА ЗАПРОСА"}
                                    </div>
                                    <p style={{ color: '#888', fontSize: '12px', lineHeight: '1.4' }}>{feedback.text}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {xp > 0 && (
                        <div style={{ padding: '20px' }}>
                            <button className="btn-huge ready" onClick={() => onComplete(currentPoints + xp)}>ЗАВЕРШИТЬ РАССЛЕДОВАНИЕ</button>
                        </div>
                    )}
                </div>
            </div>

            {/* МОДАЛЬНОЕ ОКНО ПОДСКАЗОК */}
            <AnimatePresence>
                {showHint && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="window" style={{ maxWidth: '600px', padding: '40px' }}>
                            <h2 style={{ color: '#00ff41', marginBottom: '20px' }}>СПРАВОЧНИК ОПЕРАТОРОВ</h2>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {Object.entries(SQL_DICTIONARY).map(([key, val]) => (
                                    <div key={key} style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                                        <b style={{ color: '#00ff41', minWidth: '100px' }}>{key}</b>
                                        <span style={{ color: '#aaa', fontSize: '14px' }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-main" style={{ marginTop: '30px' }} onClick={() => setShowHint(false)}>ЗАКРЫТЬ СПРАВОЧНИК</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DatabaseMission;