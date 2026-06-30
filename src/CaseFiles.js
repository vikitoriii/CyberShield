import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Lock, X, Paperclip, 
    MapPin, User, Cpu, Search, Fingerprint, Zap, Camera, Globe, ShieldCheck, MessageSquare
} from 'lucide-react';

const CaseFiles = ({ unlockedClues = [] }) => {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [viewMode, setViewMode] = useState(window.innerWidth <= 768 ? 'list' : 'board');

    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) setViewMode('list');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const DOCUMENTS = {
        1: { title: "ПРОФИЛЬ: Shadow_Walker", date: "10.05", text: "Я нашел этот ник в логах входа. Кто-то заходил под ним ровно в 3:00 ночи. Пароль был изменен внешним скриптом. Это не человек, это алгоритм.", mission: "Миссия 1: Пароли" },
        2: { title: "СКРИНШОТ: ПЕРЕХВАТ", date: "12.05", text: "Письмо выглядело идеально. Но адрес отправителя... там была кириллическая 'о' вместо латинской. Классический гомограф. Макс был прав — они бьют по невнимательности.", mission: "Миссия 2: Фишинг" },
        3: { title: "ОТЧЕТ: МАГИСТРАЛЬ", date: "14.05", text: "Сигнал прыгает по прокси-серверам. Нам удалось пробить шлюз и восстановить частоту. Точка выхода: Сектор 7. Похоже, это старое здание Neocorp.", mission: "Миссия 3: Файрвол" },
        4: { title: "ФРАГМЕНТ: БД", date: "18.05", text: "Проект 'Мёртвая петля' — это база данных лиц. Neocorp хочет объединить все камеры города в одну сеть. Это цифровой концлагерь.", mission: "Миссия 4: SQL" },
        5: { title: "ЛОГ: МАНИПУЛЯЦИЯ", date: "20.05", text: "Иван из бухгалтерии признался. Ему позвонили и представились МНОЙ. Сказали, что у меня ЧП. Социальная инженерия в чистом виде. Хакер работает внутри офиса!", mission: "Миссия 5: Соц.инженерия" },
        6: { title: "ФРАГМЕНТ HEX-ДАМПА", date: "22.05", text: "Сообщение Макса: 'MAX_ALIVE_2024!!!'. Он жив! Сигнал был зашит в поврежденный сектор памяти, который мы восстановили.", mission: "Миссия 6: Криптография" },
        7: { title: "GPS-КООРДИНАТЫ", date: "24.05", text: "Анализ фото подтвердил координаты: 48.8584, 2.2945. Это бункер под Эйфелевой башней. Группа захвата готовится к вылету.", mission: "Миссия 7: Форензика" },
        8: { title: "КЛЮЧ ОТ АРХИВА", date: "26.05", text: "Мы нашли серверную комнату Neocorp под Эйфелевой башней. Взломав 4-значный код сейфа, мы получили пароль 'LOOP_BREAKER_2024' — ключ к архиву Макса 'Чёрное зеркало'.", mission: "Миссия 8: Сейф" },
        9: { title: "ТЕНЕВЫЕ СОТРУДНИКИ", date: "28.05", text: "В скрытой админ-панели Neocorp найден список теневых агентов. Главный подозреваемый: Жан-Пьер Леруа, алиас Shadow_Walker, главный архитектор безопасности.", mission: "Миссия 9: Портал" },
        10: { title: "ФИНАЛЬНАЯ ПОБЕДА", date: "01.06", text: "Все доказательства собраны. Shadow_Walker — Жан-Пьер Леруа — арестован. Проект 'Мёртвая петля' остановлен. Макс спасён.", mission: "Миссия 10: Финал" },
    };

    const CLUES_CONFIG = [
        { id: 1, label: "КТО ОН?", icon: <User />, x: "8%", y: "15%", rotate: -5 },
        { id: 2, label: "УЛИКА: EMAIL", icon: <Search />, x: "26%", y: "10%", rotate: 3 },
        { id: 3, label: "ГДЕ ХАКЕР?", icon: <MapPin />, x: "44%", y: "15%", rotate: -2 },
        { id: 4, label: "ПРОЕКТ", icon: <Cpu />, x: "62%", y: "10%", rotate: 4 },
        { id: 5, label: "СВИДЕТЕЛЬ", icon: <MessageSquare />, x: "80%", y: "15%", rotate: -3 },
        { id: 6, label: "ШИФРОВКА", icon: <Fingerprint />, x: "8%", y: "55%", rotate: 2 },
        { id: 7, label: "GPS", icon: <Globe />, x: "26%", y: "60%", rotate: -4 },
        { id: 8, label: "КОД", icon: <Zap />, x: "44%", y: "55%", rotate: 6 },
        { id: 9, label: "ПОРТАЛ", icon: <Camera />, x: "62%", y: "60%", rotate: -2 },
        { id: 10, label: "ЛИЧНОСТЬ", icon: <ShieldCheck />, x: "80%", y: "55%", rotate: 5 },
    ];

    return (
        <div className="casefiles-container">
            {/* Header */}
            <div className="casefiles-header">
                <h1 className="glitch-text" style={{ color: '#00ff41', margin: 0, fontSize: '20px' }}>DOSSIER: CASE #992</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#444', fontSize: '11px' }}>{unlockedClues.length}/10</span>
                    {!isMobile && (
                        <div className="casefiles-view-toggle">
                            <button className={viewMode === 'board' ? 'active' : ''} onClick={() => setViewMode('board')}>ДОСКА</button>
                            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>СПИСОК</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Board view - desktop only */}
            {!isMobile && viewMode === 'board' && (
                <div className="casefiles-board">
                    <div className="casefiles-cork-texture" />
                    {CLUES_CONFIG.map(clue => {
                        const isUnlocked = unlockedClues.includes(clue.id);
                        return (
                            <motion.div 
                                key={clue.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={isUnlocked ? { scale: 1.08, zIndex: 10 } : {}}
                                onClick={() => isUnlocked && setSelectedDoc({ ...DOCUMENTS[clue.id], id: clue.id })}
                                className={`casefile-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                                style={{ left: clue.x, top: clue.y, rotate: `${clue.rotate}deg` }}
                            >
                                <Paperclip size={14} className="casefile-clip" />
                                <div className="casefile-icon-area">
                                    {isUnlocked ? clue.icon : <Lock size={24} />}
                                </div>
                                <div className="casefile-label">
                                    {isUnlocked ? clue.label : "LOCKED"}
                                </div>
                                {isUnlocked && <div className="casefile-num">#{clue.id}</div>}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* List view - always on mobile, toggle on desktop */}
            {(isMobile || viewMode === 'list') && (
                <div className="casefiles-list">
                    {CLUES_CONFIG.map(clue => {
                        const isUnlocked = unlockedClues.includes(clue.id);
                        return (
                            <motion.div 
                                key={clue.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: clue.id * 0.05 }}
                                onClick={() => isUnlocked && setSelectedDoc({ ...DOCUMENTS[clue.id], id: clue.id })}
                                className={`casefile-list-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                            >
                                <div className="casefile-list-icon">
                                    {isUnlocked ? clue.icon : <Lock size={16} />}
                                </div>
                                <div className="casefile-list-info">
                                    <div className="casefile-list-title">УЛИКА #{clue.id}</div>
                                    <div className="casefile-list-label">{isUnlocked ? clue.label : 'ЗАБЛОКИРОВАНО'}</div>
                                </div>
                                {isUnlocked && <div className="casefile-list-status">✓</div>}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Progress bar */}
            <div className="casefiles-progress">
                <div className="casefiles-progress-bar">
                    <motion.div animate={{ width: `${(unlockedClues.length / 10) * 100}%` }} className="casefiles-progress-fill" />
                </div>
            </div>

            {/* Document modal */}
            <AnimatePresence>
                {selectedDoc && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedDoc(null)}
                        className="casefiles-modal-overlay"
                    >
                        <motion.div 
                            initial={{ scale: 0.5, rotate: 5 }} 
                            animate={{ scale: 1, rotate: 0 }} 
                            onClick={(e) => e.stopPropagation()}
                            className="casefiles-modal"
                        >
                            <div className="casefiles-modal-id">
                                TOP_SECRET // ID: {selectedDoc.id} // {selectedDoc.mission}
                            </div>
                            <button onClick={() => setSelectedDoc(null)} className="casefiles-modal-close">
                                <X size={20} />
                            </button>
                            <h2 className="casefiles-modal-title">{selectedDoc.title}</h2>
                            <p className="casefiles-modal-text">{selectedDoc.text}</p>
                            <div className="casefiles-modal-date">
                                Зафиксировано: {selectedDoc.date}.2024
                            </div>
                            <button className="btn-main" onClick={() => setSelectedDoc(null)} style={{ marginTop: '20px', width: '100%', background: '#000', color: '#00ff41' }}>
                                ВЕРНУТЬ В АРХИВ
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CaseFiles;
