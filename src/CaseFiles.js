import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Lock, HelpCircle, X, Paperclip, 
    MapPin, User, Cpu, Search, Fingerprint, Zap, Camera, FileText, Globe, ShieldCheck, MessageSquare
} from 'lucide-react';

const CaseFiles = ({ unlockedClues = [] }) => {
    const [selectedDoc, setSelectedDoc] = useState(null);

    // 1. БАЗА ДАННЫХ ВСЕХ 10 ДОКУМЕНТОВ (Сюжет игры)
    const DOCUMENTS = {
        1: { title: "ПРОФИЛЬ: Shadow_Walker", date: "10.05", text: "Я нашел этот ник в логах входа. Кто-то заходил под ним ровно в 3:00 ночи. Пароль был изменен внешним скриптом. Это не человек, это алгоритм.", mission: "Миссия 1: Пароли" },
        2: { title: "СКРИНШОТ: ПЕРЕХВАТ", date: "12.05", text: "Письмо выглядело идеально. Но адрес отправителя... там была кириллическая 'о' вместо латинской. Классический гомограф. Макс был прав — они бьют по невнимательности.", mission: "Миссия 2: Фишинг" },
        3: { title: "ОТЧЕТ: МАГИСТРАЛЬ", date: "14.05", text: "Сигнал прыгает по прокси-серверам. Нам удалось пробить шлюз и восстановить частоту. Точка выхода: Сектор 7. Похоже, это старое здание Neocorp.", mission: "Миссия 3: Глубокий взлом" },
        4: { title: "ФРАГМЕНТ: БД", date: "18.05", text: "Проект 'Мертвая петля' — это база данных лиц. Neocorp хочет объединить все камеры города в одну сеть. Это цифровой концлагерь.", mission: "Миссия 4: SQL Инъекция" },
        5: { title: "ЛОГ: МАНИПУЛЯЦИЯ", date: "20.05", text: "Иван из бухгалтерии признался. Ему позвонили и представились МНОЙ. Сказали, что у меня ЧП. Социальная инженерия в чистом виде. Хакер работает внутри офиса!", mission: "Миссия 5: Соц. инженерия" },
        6: { title: "ФРАГМЕНТ HEX-ДАМПА", date: "22.05", text: "Сообщение Макса: 'MAX_ALIVE_2024!!!'. Он жив! Сигнал был зашит в поврежденный сектор памяти, который мы восстановили.", mission: "Миссия 6: Криптография" },
        7: { title: "GPS-КООРДИНАТЫ", date: "24.05", text: "Анализ фото подтвердил координаты: 48.8584, 2.2945. Это бункер под Эйфелевой башней. Группа захвата готовится к вылету.", mission: "Миссия 7: Метаданные" },
       8: { 
    title: "КЛЮЧ ОТ АРХИВА", 
    date: "26.05", 
    text: "В потоке офисного трафика найден пароль: 'LOOP_BREAKER_2024'. Макс использовал его для защиты файла 'Black_Mirror'. Мы скачали зашифрованный архив, теперь у нас есть ключ к его содержимому.",
    mission: "Миссия 8: Сниффер" 
},

        9: { title: "ДОСТУП: АДМИН-ПАНЕЛЬ", date: "28.05", text: "Мы получили доступ к скрытому URL. Внутри — список всех 'теневых' сотрудников Neocorp. Теперь у нас есть имена.", mission: "Миссия 9: Уязвимость URL" },
        10: { title: "ФИНАЛЬНЫЙ ОТЧЕТ", date: "01.06", text: "Личность раскрыта: Жан-Пьер Леруа. Главный архитектор систем безопасности Neocorp. Он и есть Shadow_Walker. Макс спасен.", mission: "Миссия 10: Финал" },
    };

    // 2. КОНФИГУРАЦИЯ СЛОТОВ (Координаты для 10 карточек)
    const CLUES_CONFIG = [
        { id: 1, label: "КТО ОН?", icon: <User />, x: "8%", y: "15%", rotate: -5 },
        { id: 2, label: "УЛИКА: EMAIL", icon: <Search />, x: "26%", y: "10%", rotate: 3 },
        { id: 3, label: "ГДЕ ХАКЕР?", icon: <MapPin />, x: "44%", y: "15%", rotate: -2 },
        { id: 4, label: "ПРОЕКТ: ПЕТЛЯ", icon: <Cpu />, x: "62%", y: "10%", rotate: 4 },
        { id: 5, label: "СВИДЕТЕЛЬ", icon: <MessageSquare />, x: "80%", y: "15%", rotate: -3 },
        { id: 6, label: "ШИФРОВКА", icon: <Fingerprint />, x: "8%", y: "55%", rotate: 2 },
        { id: 7, label: "ГЕОЛОКАЦИЯ", icon: <Globe />, x: "26%", y: "60%", rotate: -4 },
        { id: 8, label: "КОД ВИРУСА", icon: <Zap />, x: "44%", y: "55%", rotate: 6 },
        { id: 9, label: "АДМИН-ВХОД", icon: <Camera />, x: "62%", y: "60%", rotate: -2 },
        { id: 10, label: "ЛИЧНОСТЬ", icon: <ShieldCheck />, x: "80%", y: "55%", rotate: 5 },
    ];

    return (
        <div style={{ 
            padding: '20px', 
            height: '100%', 
            background: 'radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #222',
            boxShadow: 'inset 0 0 50px #000'
        }}>
            {/* Текстура доски */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, pointerEvents: 'none', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cork-board.png")' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
                <h1 className="glitch-text" style={{ color: '#00ff41', margin: 0, fontSize: '24px' }}>DOSSIER: CASE #992-MAX</h1>
                <div style={{ color: '#444', fontSize: '12px' }}>СИНХРОНИЗАЦИЯ: {unlockedClues.length} / 10</div>
            </div>

            {/* СЕТКА УЛИК */}
            <div style={{ position: 'relative', width: '100%', height: '85%' }}>
                {CLUES_CONFIG.map(clue => {
                    const isUnlocked = unlockedClues.includes(clue.id);
                    return (
                        <motion.div 
                            key={clue.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={isUnlocked ? { scale: 1.1, zIndex: 10 } : {}}
                            onClick={() => isUnlocked && setSelectedDoc({ ...DOCUMENTS[clue.id], id: clue.id })}
                            style={{
                                position: 'absolute',
                                left: clue.x,
                                top: clue.y,
                                rotate: `${clue.rotate}deg`,
                                cursor: isUnlocked ? 'pointer' : 'default',
                                width: '170px',
                                background: isUnlocked ? '#eee' : '#111',
                                padding: '10px 10px 25px 10px',
                                boxShadow: isUnlocked ? '5px 5px 15px rgba(0,0,0,0.8)' : 'none',
                                border: isUnlocked ? '1px solid #fff' : '1px solid #222',
                                transition: 'background 0.3s'
                            }}
                        >
                            <Paperclip size={16} style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', color: isUnlocked ? '#444' : '#222' }} />
                            
                            <div style={{ 
                                width: '100%', 
                                height: '110px', 
                                background: isUnlocked ? '#000' : '#050505',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isUnlocked ? '#00ff41' : '#1a1a1a'
                            }}>
                                {isUnlocked ? clue.icon : <Lock size={30} />}
                            </div>

                            <div style={{ 
                                marginTop: '10px', 
                                color: isUnlocked ? '#000' : '#222', 
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                textTransform: 'uppercase'
                            }}>
                                {isUnlocked ? clue.label : "LOCKED"}
                            </div>

                            {isUnlocked && (
                                <div style={{ position: 'absolute', bottom: '5px', right: '8px', fontSize: '9px', color: '#888' }}>
                                    #{clue.id}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* ПРОГРЕСС-БАР ВНИЗУ */}
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '400px', zIndex: 2 }}>
                <div style={{ height: '4px', background: '#111', borderRadius: '2px', overflow: 'hidden', border: '1px solid #222' }}>
                    <motion.div animate={{ width: `${(unlockedClues.length / 10) * 100}%` }} style={{ height: '100%', background: '#00ff41', boxShadow: '0 0 10px #00ff41' }} />
                </div>
            </div>

            {/* МОДАЛЬНОЕ ОКНО ДОКУМЕНТА */}
            <AnimatePresence>
                {selectedDoc && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedDoc(null)}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <motion.div 
                            initial={{ scale: 0.5, rotate: 5 }} 
                            animate={{ scale: 1, rotate: 0 }} 
                            onClick={(e) => e.stopPropagation()}
                            style={{ 
                                width: '90%', maxWidth: '550px', background: '#fff', 
                                padding: '40px', color: '#000', boxShadow: '0 0 60px rgba(0,0,0,1)',
                                position: 'relative', border: '10px solid #fff'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '10px', left: '15px', fontSize: '10px', color: '#bbb', fontFamily: 'monospace' }}>
                                TOP_SECRET // ID: {selectedDoc.id} // {selectedDoc.mission}
                            </div>
                            <button onClick={() => setSelectedDoc(null)} style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                            
                            <h2 style={{ fontFamily: 'monospace', borderBottom: '2px solid #000', paddingBottom: '10px', marginTop: '10px', textTransform: 'uppercase' }}>
                                {selectedDoc.title}
                            </h2>
                            <p style={{ marginTop: '20px', fontSize: '17px', lineHeight: '1.6', fontFamily: 'serif', whiteSpace: 'pre-wrap' }}>
                                {selectedDoc.text}
                            </p>
                            <div style={{ marginTop: '30px', textAlign: 'right', fontStyle: 'italic', color: '#888', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                                Зафиксировано: {selectedDoc.date}.2024
                            </div>
                            <button className="btn-main" onClick={() => setSelectedDoc(null)} style={{ marginTop: '30px', width: '100%', background: '#000', color: '#00ff41' }}>
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