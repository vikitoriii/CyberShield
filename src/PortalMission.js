import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Globe, CheckCircle2, HelpCircle, Terminal, 
    Lock, Eye, AlertTriangle, Shield, FileText, Zap
} from 'lucide-react';

const PortalMission = ({ username, currentPoints, onComplete }) => {
    const [stage, setStage] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [hintLevel, setHintLevel] = useState(0);
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [password, setPassword] = useState('');
    const [selectedTab, setSelectedTab] = useState(null);
    const [extracted, setExtracted] = useState({});
    const [wrongPassword, setWrongPassword] = useState(false);
    const [evidenceCount, setEvidenceCount] = useState(0);
    const [decryptInput, setDecryptInput] = useState('');
    const [decryptTarget, setDecryptTarget] = useState('');
    const [decryptShift, setDecryptShift] = useState(0);
    const [decryptSolved, setDecryptSolved] = useState(false);
    const [matrixPuzzle, setMatrixPuzzle] = useState([]);
    const [matrixSolved, setMatrixSolved] = useState(false);
    const [activePuzzle, setActivePuzzle] = useState(null);

    const HTTP_HEADERS = [
        { id: 1, name: "HTTP/1.1 200 OK", value: "Content-Type: text/html", suspicious: false, hint: "Стандартный заголовок" },
        { id: 2, name: "Server: nginx/1.18", value: "X-Powered-By: PHP/7.4", suspicious: false, hint: "Утечка информации о сервере" },
        { id: 3, name: "X-Admin-Path: /shadow-panel", value: "Cache-Control: no-store", suspicious: true, hint: "СКРЫТЫЙ ПУТЬ К АДМИН-ПАНЕЛИ!" },
        { id: 4, name: "Set-Cookie: session=abc123", value: "HttpOnly; Secure", suspicious: false, hint: "Безопасная cookie" }
    ];

    const ADMIN_TABS = [
        { id: "users", label: "Пользователи", icon: "[USERS]", puzzle: null, data: [
            { name: "admin", role: "superadmin", status: "active" },
            { name: "operator_01", role: "user", status: "active" },
            { name: "shadow_agent", role: "hidden", status: "ACTIVE" }
        ]},
        { id: "logs", label: "Логи доступа", icon: "[LOGS]", puzzle: null, data: [
            { time: "03:00", user: "Shadow_Walker", action: "LOGIN", ip: "172.16.0.99" },
            { time: "03:15", user: "Shadow_Walker", action: "EXPORT_DATA", ip: "172.16.0.99" },
            { time: "03:22", user: "Shadow_Walker", action: "LOGOUT", ip: "172.16.0.99" }
        ]},
        { id: "finance", label: "Финансы", icon: "[FIN]", puzzle: "decrypt", data: [
            { date: "15.03", amount: "50 000 EUR", recipient: "J.P. Leroy", purpose: "Консалтинг" },
            { date: "01.04", amount: "75 000 EUR", recipient: "Offshore_Acc_7721", purpose: "Проект" },
            { date: "15.05", amount: "120 000 EUR", recipient: "J.P. Leroy", purpose: "Бонус" }
        ]},
        { id: "messages", label: "Переписка", icon: "[MSG]", puzzle: "matrix", data: [
            { from: "Shadow_Walker", to: "???", text: "Проект Мёртвая петля готов к запуску", date: "20.04" },
            { from: "Shadow_Walker", to: "???", text: "Макс узнал too much. Нужно его изолировать", date: "22.04" },
            { from: "???", to: "Shadow_Walker", text: "Координаты переданы. Бункер готов", date: "25.04" }
        ]},
        { id: "shadow", label: "Теневые сотрудники", icon: "[SHADOW]", puzzle: null, data: [
            { name: "Jean-Pierre Leroy", alias: "Shadow_Walker", role: "Chief Security Architect", access: "FULL" }
        ]},
        { id: "location", label: "Локация Макса", icon: "[GPS]", puzzle: null, data: [
            { key: "Последний IP", value: "172.16.0.99" },
            { key: "Геолокация", value: "48.8584, 2.2945" },
            { key: "Объект", value: "Бункер под Эйфелевой башней" },
            { key: "Статус", value: "ЖИВ, но изолирован" }
        ]}
    ];

    useEffect(() => {
        if (activePuzzle === 'decrypt' && stage === 3) {
            const original = 'FIN7721';
            const shift = 3;
            const encrypted = original.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + shift) % 26) + 65);
                if (code >= 48 && code <= 57) return String.fromCharCode(((code - 48 + shift) % 10) + 48);
                return c;
            }).join('');
            setDecryptTarget(encrypted);
            setDecryptShift(shift);
            setDecryptInput('');
        }
        if (activePuzzle === 'matrix' && stage === 3) {
            const nums = [1,2,3,4,5,6,7,8,0];
            for (let i = nums.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [nums[i], nums[j]] = [nums[j], nums[i]];
            }
            if (nums.every((v, i) => v === i)) {
                [nums[0], nums[1]] = [nums[1], nums[0]];
            }
            setMatrixPuzzle(nums);
            setMatrixSolved(false);
        }
    }, [activePuzzle, stage]);

    const handleHeaderClick = (header) => {
        setSelectedHeader(header);
        if (header.suspicious) {
            setTimeout(() => setStage(2), 1000);
        }
    };

    const handleLogin = () => {
        if (password === 'LOOP_BREAKER_2024') {
            setWrongPassword(false);
            setStage(3);
        } else {
            setWrongPassword(true);
            setTimeout(() => setWrongPassword(false), 2000);
        }
    };

    const handleExtract = (tabId) => {
        if (!extracted[tabId]) {
            setExtracted(prev => ({ ...prev, [tabId]: true }));
            setEvidenceCount(prev => prev + 1);
        }
        setActivePuzzle(null);
    };

    const handleDecryptCheck = () => {
        if (decryptInput.toUpperCase() === 'FIN7721') {
            setDecryptSolved(true);
        }
    };

    const handleMatrixSwap = (idx) => {
        const newPuzzle = [...matrixPuzzle];
        const emptyIdx = newPuzzle.indexOf(0);
        const clickedIdx = idx;
        const emptyRow = Math.floor(emptyIdx / 3);
        const emptyCol = emptyIdx % 3;
        const clickRow = Math.floor(clickedIdx / 3);
        const clickCol = clickedIdx % 3;
        const isAdjacent = (Math.abs(emptyRow - clickRow) + Math.abs(emptyCol - clickCol)) === 1;
        if (isAdjacent) {
            [newPuzzle[emptyIdx], newPuzzle[clickedIdx]] = [newPuzzle[clickedIdx], newPuzzle[emptyIdx]];
            setMatrixPuzzle(newPuzzle);
            const solved = newPuzzle.every((v, i) => v === (i + 1) % 9);
            if (solved) setMatrixSolved(true);
        }
    };

    const canFinish = evidenceCount >= 6;

    if (stage === 0) return (
        <div className="window animate-fade" style={{ textAlign: 'center', padding: '60px', background: 'radial-gradient(circle, #0a1a0a 0%, #050505 100%)' }}>
            <Globe size={80} color="#4d94ff" />
            <h1 className="glitch-text" style={{ color: '#4d94ff', marginTop: '20px' }}>СКРЫТЫЙ ПОРТАЛ</h1>
            <div style={{ maxWidth: '700px', margin: '30px auto', textAlign: 'left' }}>
                <div style={{ background: '#000', border: '1px solid #222', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ color: '#f7b500', fontSize: '11px', letterSpacing: '2px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={14} /> МИССИЯ 9
                    </div>
                    <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                        Пароль из миссии 8 получен. Теперь нужно проникнуть в 
                        <b style={{ color: '#4d94ff' }}> скрытую админ-панель</b> Neocorp 
                        в <b style={{ color: '#f7b500' }}>Париже</b> и собрать доказательства причастности 
                        <b style={{ color: '#ff4d4d' }}> Shadow_Walker</b>.
                    </p>
                </div>
                <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
                    Найдите путь к панели, взломайте защиту, решите головоломки в зашифрованных разделах 
                    и соберите минимум <b style={{ color: '#f7b500' }}>3 улики</b> для финальной операции.
                </p>
            </div>
            <button className="btn-main" onClick={() => setStage(1)}>НАЧАТЬ ПРОНИКНОВЕНИЕ</button>
        </div>
    );

    if (stage === 1) return (
        <div className="detective-layout animate-fade">
            <div className="window" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="panel-header"><Terminal size={16} /> HTTP-ЗАГОЛОВКИ СЕРВЕРА</div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                    <div style={{ background: '#000', padding: '15px', fontFamily: 'monospace', fontSize: '12px', marginBottom: '20px', border: '1px solid #222' }}>
                        <div style={{ color: '#4d94ff', marginBottom: '10px' }}>GET / HTTP/1.1</div>
                        <div style={{ color: '#666' }}>Host: neocorp-internal.ru</div>
                        <div style={{ color: '#666' }}>User-Agent: Mozilla/5.0</div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#444', marginBottom: '15px', letterSpacing: '1px' }}>НАЙДИТЕ СКРЫТЫЙ ПУТЬ:</div>
                    {HTTP_HEADERS.map(header => (
                        <motion.div key={header.id} whileHover={{ x: 5 }} onClick={() => handleHeaderClick(header)}
                            style={{ background: selectedHeader?.id === header.id ? (header.suspicious ? 'rgba(0,255,65,0.1)' : 'rgba(255,77,77,0.1)') : '#111',
                                border: `1px solid ${selectedHeader?.id === header.id ? (header.suspicious ? '#00ff41' : '#ff4d4d') : '#222'}`,
                                padding: '15px', marginBottom: '10px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px' }}>
                            <div style={{ color: '#4d94ff', marginBottom: '5px' }}>{header.name}</div>
                            <div style={{ color: '#666' }}>{header.value}</div>
                            {selectedHeader?.id === header.id && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                    style={{ marginTop: '10px', padding: '10px', background: '#000', borderLeft: `3px solid ${header.suspicious ? '#00ff41' : '#ff4d4d'}`, fontSize: '11px' }}>
                                    <span style={{ color: header.suspicious ? '#00ff41' : '#ff4d4d' }}>{header.hint}</span>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="window" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '11px', color: '#444', marginBottom: '10px', letterSpacing: '1px' }}>ИНСТРУКЦИЯ</div>
                    <p style={{ color: '#888', fontSize: '12px', lineHeight: '1.6' }}>
                        Ищите нестандартные заголовки. Пользовательские заголовки начинаются с <b style={{ color: '#00ff41' }}>X-</b>.
                    </p>
                </div>
                <div className="window" style={{ padding: '20px' }}>
                    <button onClick={() => { setShowHint(!showHint); if (!showHint) setHintLevel(1); }} className="lockdown-btn" style={{ marginBottom: showHint ? '10px' : 0 }}>
                        <HelpCircle size={14} style={{ marginRight: '8px' }} />ПОДСКАЗКА
                    </button>
                    {showHint && (
                        <div style={{ background: '#000', border: '1px solid #f7b500', padding: '12px', color: '#f7b500', fontSize: '11px', lineHeight: '1.5' }}>
                            {hintLevel === 1 && (
                                <div>
                                    <div>Одним из заголовков является нестандартный. Обратите внимание на префиксы.</div>
                                    <button onClick={() => setHintLevel(2)} style={{ marginTop: '8px', background: '#f7b500', color: '#000', border: 'none', padding: '4px 8px', fontSize: '10px', cursor: 'pointer' }}>
                                        Показать ответ
                                    </button>
                                </div>
                            )}
                            {hintLevel === 2 && <div>Заголовок <b>X-Admin-Path</b> содержит скрытый путь к панели.</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (stage === 2) return (
        <div className="window animate-fade" style={{ textAlign: 'center', padding: '60px', maxWidth: '500px', margin: '0 auto' }}>
            <Lock size={60} color="#4d94ff" />
            <h2 style={{ color: '#4d94ff', marginTop: '20px', marginBottom: '10px' }}>АВТОРИЗАЦИЯ</h2>
            <p style={{ color: '#888', marginBottom: '30px' }}>Введите пароль для доступа</p>
            <div style={{ background: '#000', padding: '30px', border: '1px solid #222', marginBottom: '20px' }}>
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль..."
                    style={{ width: '100%', background: '#111', border: `2px solid ${wrongPassword ? '#ff4d4d' : '#333'}`,
                        color: '#00ff41', padding: '15px', fontSize: '18px', fontFamily: 'monospace', outline: 'none' }}
                    autoFocus onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
                {wrongPassword && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '10px' }}>Неверный пароль!</motion.div>}
            </div>
            <button className="btn-main" onClick={handleLogin} style={{ width: '100%' }}>ВОЙТИ</button>
            <div style={{ marginTop: '20px', padding: '15px', background: '#0a0a0a', border: '1px solid #222', fontSize: '11px', color: '#444', textAlign: 'left' }}>
                <button onClick={() => { setShowHint(!showHint); if (!showHint) setHintLevel(1); }} style={{ background: 'none', border: 'none', color: '#f7b500', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HelpCircle size={14} /> ПОДСКАЗКА
                </button>
                {showHint && (
                    <div style={{ marginTop: '8px', color: '#f7b500' }}>
                        {hintLevel === 1 && <div>Этот пароль вы получили в предыдущей миссии.</div>}
                        {hintLevel === 2 && <div>Пароль: LOOP_BREAKER_2024</div>}
                    </div>
                )}
            </div>
        </div>
    );

    if (stage === 3) return (
        <div className="window animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><Shield size={14} /> АДМИН-ПАНЕЛЬ: NEOCORP</span>
                <span style={{ color: evidenceCount >= 6 ? '#00ff41' : '#f7b500' }}>УЛИКИ: {evidenceCount}/6 {canFinish && '- ВСЕ СОБРАНЫ'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', flex: 1, minHeight: 0 }}>
                <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '10px', overflowY: 'auto' }}>
                    {ADMIN_TABS.map(tab => (
                        <div key={tab.id} onClick={() => { setSelectedTab(tab); setActivePuzzle(tab.puzzle); setShowHint(false); setHintLevel(0); }}
                            style={{ padding: '12px 15px', cursor: 'pointer', marginBottom: '5px',
                                background: selectedTab?.id === tab.id ? '#111' : 'transparent',
                                borderLeft: selectedTab?.id === tab.id ? '3px solid #00ff41' : '3px solid transparent',
                                color: selectedTab?.id === tab.id ? '#00ff41' : '#666', fontSize: '11px',
                                display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontFamily: 'monospace', color: '#444' }}>{tab.icon}</span> {tab.label}
                            {extracted[tab.id] && <CheckCircle2 size={12} color="#00ff41" style={{ marginLeft: 'auto' }} />}
                        </div>
                    ))}
                </div>

                <div style={{ background: '#050505', border: '1px solid #222', padding: '20px', overflowY: 'auto' }}>
                    {selectedTab ? (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ color: '#00ff41', fontSize: '14px', margin: 0, fontFamily: 'monospace' }}>{selectedTab.icon} {selectedTab.label}</h3>
                                <button onClick={() => { setShowHint(!showHint); if (!showHint) setHintLevel(1); }} style={{ background: 'none', border: 'none', color: showHint ? '#f7b500' : '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                                    <HelpCircle size={14} /> ПОДСКАЗКА
                                </button>
                            </div>

                            {showHint && (
                                <div style={{ background: '#000', border: '1px solid #f7b500', padding: '10px 14px', marginBottom: '16px', color: '#f7b500', fontSize: '11px', lineHeight: '1.5' }}>
                                    {hintLevel === 1 && (
                                        <div>
                                            {selectedTab.puzzle === 'decrypt' && 'Зашифрованный код нужно дешифровать со сдвигом. Попробуйте сдвиг +3.'}
                                            {selectedTab.puzzle === 'matrix' && 'Пазл 3x3. Нужно расположить числа 1-8 по порядку, пустая ячейка в конце.'}
                                            {!selectedTab.puzzle && 'Эти данные доступны без дополнительных проверок. Нажмите "Извлечь".'}
                                            <button onClick={() => setHintLevel(2)} style={{ marginTop: '6px', background: '#f7b500', color: '#000', border: 'none', padding: '3px 6px', fontSize: '9px', cursor: 'pointer' }}>
                                                Ответ
                                            </button>
                                        </div>
                                    )}
                                    {hintLevel === 2 && (
                                        <div>
                                            {selectedTab.puzzle === 'decrypt' && 'Код: FIN7721. Это номер offshore-счета из финансовых данных.'}
                                            {selectedTab.puzzle === 'matrix' && 'Кликайте по числам рядом с пустой ячейкой, чтобы двигать их. Соберите 1,2,3,4,5,6,7,8.'}
                                            {!selectedTab.puzzle && 'Нажмите кнопку "Извлечь данные" для сбора улики.'}
                                        </div>
                                    )}
                                </div>
                            )}

                            {(selectedTab.id === 'users' || selectedTab.id === 'logs' || selectedTab.id === 'finance' || selectedTab.id === 'messages') && (
                                <div style={{ marginBottom: '20px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'monospace' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                                                {Object.keys(selectedTab.data[0]).map(key => (
                                                    <th key={key} style={{ padding: '8px', color: '#444' }}>{key.toUpperCase()}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedTab.data.map((row, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #222' }}>
                                                    {Object.values(row).map((val, i) => (
                                                        <td key={i} style={{ padding: '8px', color: val === 'ACTIVE' || val === 'FULL' ? '#00ff41' : '#ccc' }}>{val}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {(selectedTab.id === 'shadow' || selectedTab.id === 'location') && (
                                <div style={{ marginBottom: '20px' }}>
                                    {selectedTab.data.map((item, idx) => (
                                        <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                                            style={{ background: '#111', border: '1px solid #222', padding: '12px', marginBottom: '8px',
                                                borderLeft: `3px solid ${extracted[selectedTab.id] ? '#00ff41' : '#ff4d4d'}`, fontSize: '12px' }}>
                                            {item.name ? (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                    <div><span style={{ color: '#444' }}>ИМЯ:</span> <span style={{ color: '#fff' }}>{item.name}</span></div>
                                                    <div><span style={{ color: '#444' }}>АЛИАС:</span> <span style={{ color: '#ff4d4d' }}>{item.alias}</span></div>
                                                    <div><span style={{ color: '#444' }}>РОЛЬ:</span> <span style={{ color: '#fff' }}>{item.role}</span></div>
                                                    <div><span style={{ color: '#444' }}>ДОСТУП:</span> <span style={{ color: '#f7b500' }}>{item.access}</span></div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <span style={{ color: '#444' }}>{item.key}:</span> <span style={{ color: item.value.includes('ЖИВ') ? '#00ff41' : '#fff' }}>{item.value}</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {activePuzzle === 'decrypt' && !decryptSolved && !extracted[selectedTab.id] && (
                                <div style={{ background: '#111', border: '1px solid #f7b500', padding: '20px', marginBottom: '20px' }}>
                                    <div style={{ color: '#f7b500', fontSize: '11px', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Zap size={14} /> ЗАШИФРОВАННЫЕ ДАННЫЕ
                                    </div>
                                    <p style={{ color: '#888', fontSize: '11px', marginBottom: '15px' }}>
                                        Финансовые данные зашифрованы шифром Цезаря (сдвиг +3). Расшифруйте код:
                                    </p>
                                    <div style={{ background: '#000', padding: '15px', fontFamily: 'monospace', fontSize: '20px', color: '#f7b500', marginBottom: '15px', textAlign: 'center', letterSpacing: '5px' }}>
                                        {decryptTarget}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input type="text" value={decryptInput} onChange={(e) => setDecryptInput(e.target.value)}
                                            placeholder="Введите расшифрованный код..."
                                            style={{ flex: 1, background: '#000', border: '1px solid #333', color: '#00ff41', padding: '10px', fontFamily: 'monospace', outline: 'none', fontSize: '14px' }}
                                            onKeyDown={(e) => e.key === 'Enter' && handleDecryptCheck()} />
                                        <button className="btn-action" onClick={handleDecryptCheck}>ПРОВЕРИТЬ</button>
                                    </div>
                                    {decryptInput && decryptInput.toUpperCase() !== 'FIN7721' && (
                                        <div style={{ color: '#ff4d4d', fontSize: '10px', marginTop: '8px' }}>Неверный код. Попробуйте ещё раз.</div>
                                    )}
                                </div>
                            )}
                            {activePuzzle === 'decrypt' && (decryptSolved || extracted[selectedTab.id]) && (
                                <div style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid #00ff41', padding: '12px', marginBottom: '20px' }}>
                                    <CheckCircle2 size={14} color="#00ff41" style={{ marginRight: '8px' }} />
                                    <span style={{ color: '#00ff41', fontSize: '11px' }}>Данные расшифрованы! Код: FIN7721</span>
                                </div>
                            )}

                            {activePuzzle === 'matrix' && !matrixSolved && !extracted[selectedTab.id] && (
                                <div style={{ background: '#111', border: '1px solid #f7b500', padding: '20px', marginBottom: '20px' }}>
                                    <div style={{ color: '#f7b500', fontSize: '11px', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Zap size={14} /> РАСШИФРОВКА СООБЩЕНИЙ
                                    </div>
                                    <p style={{ color: '#888', fontSize: '11px', marginBottom: '15px' }}>
                                        Соберите числа 1-8 по порядку. Кликайте по числу рядом с пустой ячейкой для обмена.
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: '6px', justifyContent: 'center' }}>
                                        {matrixPuzzle.map((num, idx) => (
                                            <motion.div key={idx} whileTap={{ scale: 0.9 }} onClick={() => handleMatrixSwap(idx)}
                                                style={{ width: '60px', height: '60px', background: num === 0 ? '#1a1a1a' : '#000', border: '2px solid #333',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', color: num === 0 ? 'transparent' : '#00ff41' }}>
                                                {num === 0 ? '' : num}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activePuzzle === 'matrix' && (matrixSolved || extracted[selectedTab.id]) && (
                                <div style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid #00ff41', padding: '12px', marginBottom: '20px' }}>
                                    <CheckCircle2 size={14} color="#00ff41" style={{ marginRight: '8px' }} />
                                    <span style={{ color: '#00ff41', fontSize: '11px' }}>Сообщения расшифрованы!</span>
                                </div>
                            )}

                            {((activePuzzle === 'decrypt' && (decryptSolved || extracted[selectedTab.id])) ||
                              (activePuzzle === 'matrix' && (matrixSolved || extracted[selectedTab.id])) ||
                              (!activePuzzle && !extracted[selectedTab.id])) && !extracted[selectedTab.id] && (
                                <button className="btn-main" onClick={() => handleExtract(selectedTab.id)} style={{ width: '100%' }}>
                                    <FileText size={14} style={{ marginRight: '8px' }} /> ИЗВЛЕЧЬ ДАННЫЕ
                                </button>
                            )}
                            {extracted[selectedTab.id] && (
                                <div style={{ background: 'rgba(0,255,65,0.1)', border: '1px solid #00ff41', padding: '12px', textAlign: 'center' }}>
                                    <CheckCircle2 size={16} color="#00ff41" style={{ marginRight: '8px' }} />
                                    <span style={{ color: '#00ff41', fontWeight: 'bold', fontSize: '12px' }}>УЛИКА ИЗВЛЕЧЕНА!</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#333', padding: '60px' }}>
                            <Eye size={60} style={{ marginBottom: '15px', opacity: 0.3 }} />
                            <div style={{ fontSize: '12px' }}>Выберите раздел слева</div>
                        </div>
                    )}
                </div>
            </div>

            {canFinish && (
                <div style={{ padding: '15px', background: '#0a0a0a', borderTop: '1px solid #00ff41', textAlign: 'center' }}>
                    <button className="btn-main" onClick={() => setStage(4)} style={{ background: '#00ff41' }}>
                        ПЕРЕЙТИ К ФИНАЛЬНОЙ ОПЕРАЦИИ
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="window animate-fade mission-win">
            <div className="mission-win-icon">
                <CheckCircle2 size={72} color="#00ff41" />
            </div>
            <h1 className="glitch-text mission-win-title" style={{ color: '#00ff41' }}>РАССЛЕДОВАНИЕ ЗАВЕРШЕНО</h1>
            
            <div className="mission-stats" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="mission-stat">
                    <div className="mission-stat-label">УЛИК</div>
                    <div className="mission-stat-value" style={{ color: '#00ff41' }}>{evidenceCount}</div>
                </div>
                <div className="mission-stat">
                    <div className="mission-stat-label">СТАТУС</div>
                    <div className="mission-stat-value" style={{ color: '#f7b500', fontSize: '14px' }}>ГОТОВ К ФИНАЛУ</div>
                </div>
            </div>

            <div className="mission-clue" style={{ borderColor: '#ff4d4d' }}>
                <div className="mission-clue-label" style={{ color: '#ff4d4d' }}>ГЛАВНЫЙ ПОДОЗРЕВАЕМЫЙ</div>
                <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', margin: '8px 0' }}>Jean-Pierre Leroy</div>
                <div style={{ color: '#888', fontSize: '12px' }}>Алиас: Shadow_Walker</div>
            </div>

            <div className="mission-clue">
                <div className="mission-clue-label" style={{ color: '#00ff41' }}>СОБРАННЫЕ УЛИКИ</div>
                <ul style={{ color: '#888', fontSize: '12px', lineHeight: '1.8', margin: '8px 0 0', paddingLeft: '20px' }}>
                    {extracted.finance && <li>Финансовые операции на 245 000 EUR</li>}
                    {extracted.messages && <li>Переписка о проекте Мёртвая петля</li>}
                    {extracted.shadow && <li>Теневые сотрудники: Shadow_Walker = Leroy</li>}
                    {extracted.location && <li>Локация Макса: бункер под Эйфелевой</li>}
                    {extracted.users && <li>Пользователи системы (включая теневого агента)</li>}
                    {extracted.logs && <li>Логи входа Shadow_Walker в 03:00</li>}
                </ul>
            </div>

            <button className="btn-huge" onClick={() => onComplete(currentPoints + 7000)}>ПЕРЕЙТИ К ФИНАЛУ</button>
        </motion.div>
    );
};

export default PortalMission;
