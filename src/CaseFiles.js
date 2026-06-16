import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Lock, HelpCircle, X, Paperclip, 
    MapPin, User, Cpu, Search, Fingerprint, Zap, Camera 
} from 'lucide-react';

const CaseFiles = ({ unlockedClues = [] }) => {
    const [selectedDoc, setSelectedDoc] = useState(null);

    const DOCUMENTS = {
        1: { title: "ПРОФИЛЬ: Shadow_Walker", date: "10.05", text: "Я нашел этот ник в логах входа. Кто-то заходил под ним ровно в 3:00 ночи. Пароль был изменен внешним скриптом. Это не человек, это алгоритм.", type: "photo" },
        2: { title: "СКРИНШОТ: ПЕРЕХВАТ", date: "12.05", text: "Письмо выглядело идеально. Но адрес отправителя... там была кириллическая 'о' вместо латинской. Классический гомограф. Макс был прав — они бьют по невнимательности.", type: "note" },
        3: { title: "ОТЧЕТ: ГЕО-ЛОКАЦИЯ", date: "14.05", text: "Сигнал прыгает по прокси-серверам, но мы зацепили реальный IP. Точка выхода: Париж. Это слишком очевидно... или они хотят, чтобы мы так думали?", type: "map" },
        4: { title: "ФРАГМЕНТ: БД", date: "18.05", text: "Проект 'Мертвая петля' — это база данных лиц. Neocorp хочет объединить все камеры города в одну сеть. Это цифровой концлагерь.", type: "photo" },
        5: { title: "ЛОГ: МАНИПУЛЯЦИЯ", date: "20.05", text: "Иван из бухгалтерии признался. Ему позвонили и представились МНОЙ. Сказали, что у меня ЧП. Социальная инженерия в чистом виде.", type: "note" },
    };

    const CLUES_CONFIG = [
        { id: 1, label: "КТО ОН?", icon: <User />, x: "10%", y: "15%", rotate: -5 },
        { id: 2, label: "УЛИКА: EMAIL", icon: <Search />, x: "40%", y: "10%", rotate: 3 },
        { id: 3, label: "ГДЕ ХАКЕР?", icon: <MapPin />, x: "70%", y: "15%", rotate: -2 },
        { id: 4, label: "ПРОЕКТ: ПЕТЛЯ", icon: <Cpu />, x: "15%", y: "55%", rotate: 4 },
        { id: 5, label: "СВИДЕТЕЛЬ", icon: <Search />, x: "45%", y: "60%", rotate: -6 },
        { id: 6, label: "ШИФРОВКА", icon: <Fingerprint />, x: "75%", y: "55%", rotate: 2 },
    ];

    return (
        <div style={{ 
            padding: '20px', 
            height: '100%', 
            background: 'radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)',
            position: 'relative',
            overflow: 'hidden',
            border: '10px solid #111',
            boxShadow: 'inset 0 0 50px #000'
        }}>
            {/* Текстура пробковой доски (условно) */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, pointerEvents: 'none', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cork-board.png")' }} />

            <h1 className="glitch-text" style={{ color: '#00ff41', textAlign: 'center', marginBottom: '20px', fontSize: '24px', opacity: 0.8 }}>
                DOSSIER: CASE #992-MAX
            </h1>

            {/* СЕТКА УЛИК В СТИЛЕ "ДОСКИ" */}
            <div style={{ position: 'relative', width: '100%', height: '80%' }}>
                {CLUES_CONFIG.map(clue => {
                    const isUnlocked = unlockedClues.includes(clue.id);
                    return (
                        <motion.div 
                            key={clue.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={isUnlocked ? { scale: 1.1, zIndex: 10 } : {}}
                            onClick={() => isUnlocked && setSelectedDoc({ ...DOCUMENTS[clue.id], id: clue.id })}
                            style={{
                                position: 'absolute',
                                left: clue.x,
                                top: clue.y,
                                rotate: `${clue.rotate}deg`,
                                cursor: isUnlocked ? 'pointer' : 'default',
                                width: '180px',
                                background: isUnlocked ? '#eee' : '#222',
                                padding: '10px 10px 30px 10px',
                                boxShadow: isUnlocked ? '5px 5px 15px rgba(0,0,0,0.5)' : 'none',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <Paperclip size={16} style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', color: '#888' }} />
                            
                            <div style={{ 
                                width: '100%', 
                                height: '120px', 
                                background: isUnlocked ? '#000' : '#111',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isUnlocked ? '#00ff41' : '#333'
                            }}>
                                {isUnlocked ? clue.icon : <Lock size={30} />}
                            </div>

                            <div style={{ 
                                marginTop: '10px', 
                                color: isUnlocked ? '#000' : '#444', 
                                fontFamily: 'Permanent Marker, cursive', // Можно добавить такой шрифт в Google Fonts
                                fontSize: '14px',
                                textAlign: 'center'
                            }}>
                                {isUnlocked ? clue.label : "LOCKED"}
                            </div>

                            {isUnlocked && (
                                <div style={{ position: 'absolute', bottom: '5px', right: '5px', fontSize: '10px', color: '#888' }}>
                                    #{clue.id}
                                </div>
                            )}
                        </motion.div>
                    );
                })}

                {/* Красная нить (декоративный элемент между 1 и 3 уликой) */}
                {unlockedClues.includes(1) && unlockedClues.includes(3) && (
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                        <line x1="20%" y1="25%" x2="70%" y2="25%" stroke="rgba(255,0,0,0.4)" strokeWidth="2" strokeDasharray="5,5" />
                    </svg>
                )}
            </div>

            {/* ПРОГРЕСС РАССЛЕДОВАНИЯ */}
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '300px' }}>
                <div style={{ fontSize: '10px', color: '#444', marginBottom: '5px', textAlign: 'center' }}>
                    СИНХРОНИЗАЦИЯ УЛИК: {unlockedClues.length} / 10
                </div>
                <div style={{ height: '4px', background: '#111', borderRadius: '2px' }}>
                    <motion.div animate={{ width: `${(unlockedClues.length / 10) * 100}%` }} style={{ height: '100%', background: '#00ff41' }} />
                </div>
            </div>

            {/* МОДАЛЬНОЕ ОКНО "ВЗГЛЯД ВБЛИЗИ" */}
            <AnimatePresence>
                {selectedDoc && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedDoc(null)}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <motion.div 
                            initial={{ scale: 0.5, rotate: 10 }} 
                            animate={{ scale: 1, rotate: 0 }} 
                            onClick={(e) => e.stopPropagation()}
                            style={{ 
                                width: '90%', maxWidth: '500px', background: '#fff', 
                                padding: '40px', color: '#000', boxShadow: '0 0 50px rgba(0,0,0,1)',
                                position: 'relative'
                            }}
                        >
                            <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', color: '#ccc' }}>DOCUMENT_ID: {selectedDoc.id}</div>
                            <h2 style={{ fontFamily: 'monospace', borderBottom: '2px solid #000', paddingBottom: '10px' }}>{selectedDoc.title}</h2>
                            <p style={{ marginTop: '20px', fontSize: '18px', lineHeight: '1.5', fontFamily: 'serif' }}>{selectedDoc.text}</p>
                            <div style={{ marginTop: '30px', textAlign: 'right', fontStyle: 'italic', color: '#666' }}>Дата перехвата: {selectedDoc.date}</div>
                            <button className="btn-main" onClick={() => setSelectedDoc(null)} style={{ marginTop: '20px', width: '100%', background: '#000' }}>ВЕРНУТЬ НА ДОСКУ</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CaseFiles;