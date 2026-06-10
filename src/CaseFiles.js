import React from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, MapPin, User, Cpu, Camera, 
    HelpCircle, Mail, Lock, Zap, Search, Fingerprint 
} from 'lucide-react';

const CaseFiles = ({ unlockedClues = [] }) => {
    // Список всех 10 улик, привязанных к сюжету
    const ALL_CLUES = [
        { id: 1, label: "Лог входа", icon: <Lock />, value: "Агент: 'Shadow_Walker'", mission: "Пароли" },
        { id: 2, label: "Заголовок письма", icon: <Mail />, value: "Отправитель: 'hr-support@corp-it.ru'", mission: "Фишинг" },
        { id: 3, label: "IP-адрес атаки", icon: <MapPin />, value: "91.210.10.45 (Франция)", mission: "Файрволл" },
        { id: 4, label: "Скрытый токен", icon: <Cpu />, value: "CS_OS{SQL_MASTER_777}", mission: "База данных" },
        { id: 5, label: "Метаданные чата", icon: <User />, value: "Сотрудник 'Иван П.' был обманут", mission: "Соц. инженерия" },
        { id: 6, label: "Зашифрованный ключ", icon: <Fingerprint />, value: "Base64: 'Y2F0IC9ldGMvcGFzc3dk'", mission: "Криптография" },
        { id: 7, label: "GPS Координаты", icon: <Search />, value: "48.8584° N, 2.2945° E (Эйфелева башня)", mission: "Геолокация" },
        { id: 8, label: "Хэш вируса", icon: <Zap />, value: "MD5: d41d8cd98f00b204e9800998ecf8427e", mission: "Малварь" },
        { id: 9, label: "Админ-панель", icon: <Camera />, value: "Endpoint: /admin_hidden_v3", mission: "Уязвимость URL" },
        { id: 10, label: "Настоящее имя", icon: <FileText />, value: "Жан-Пьер Леруа", mission: "Финал" },
    ];

    const progress = Math.round((unlockedClues.length / ALL_CLUES.length) * 100);

    return (
        <div style={{ padding: '30px', color: '#e0e0e0', height: '100%', overflowY: 'auto' }}>
            {/* Заголовок и прогресс */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
                <div>
                    <h1 className="glitch-text" style={{ color: '#00ff41', margin: 0, fontSize: '32px' }}>ДОСКА УЛИК</h1>
                    <p style={{ color: '#666', marginTop: '10px' }}>Расследование взлома корпорации Neocorp</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', color: '#00ff41', fontWeight: 'bold' }}>{progress}%</div>
                    <div style={{ fontSize: '10px', color: '#444' }}>СБОР ДАННЫХ ЗАВЕРШЕН</div>
                </div>
            </div>

            {/* Сетка улик */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                gap: '20px' 
            }}>
                {ALL_CLUES.map(clue => {
                    const isUnlocked = unlockedClues.includes(clue.id);
                    return (
                        <motion.div 
                            key={clue.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: isUnlocked ? 'rgba(0, 255, 65, 0.03)' : '#0a0a0a',
                                border: isUnlocked ? '1px solid #00ff41' : '1px solid #1a1a1a',
                                padding: '20px',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                                boxShadow: isUnlocked ? '0 0 15px rgba(0, 255, 65, 0.1)' : 'none'
                            }}
                        >
                            <div style={{ 
                                color: isUnlocked ? '#00ff41' : '#222',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                {isUnlocked ? clue.icon : <HelpCircle size={24} />}
                                <span style={{ fontSize: '10px', opacity: 0.5 }}>#{clue.id}</span>
                            </div>

                            <div>
                                <div style={{ fontSize: '10px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Миссия: {clue.mission}
                                </div>
                                <div style={{ 
                                    fontSize: '14px', 
                                    fontWeight: 'bold', 
                                    marginTop: '5px',
                                    color: isUnlocked ? '#fff' : '#333'
                                }}>
                                    {clue.label}
                                </div>
                            </div>

                            <div style={{ 
                                background: '#000', 
                                padding: '10px', 
                                fontSize: '12px', 
                                fontFamily: 'monospace',
                                border: '1px solid #111',
                                minHeight: '40px',
                                color: isUnlocked ? '#00ff41' : 'transparent',
                                userSelect: isUnlocked ? 'text' : 'none'
                            }}>
                                {isUnlocked ? clue.value : "DATA_ENCRYPTED"}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {unlockedClues.length === 10 && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    style={{ marginTop: '50px', textAlign: 'center', padding: '40px', border: '1px dashed #00ff41' }}
                >
                    <h2 style={{ color: '#00ff41' }}>ВСЕ УЛИКИ СОБРАНЫ</h2>
                    <p>Теперь вы можете сопоставить данные и найти преступника в финальной миссии.</p>
                    <button className="btn-huge ready">ВЫДВИНУТЬ ОБВИНЕНИЕ</button>
                </motion.div>
            )}
        </div>
    );
};

export default CaseFiles;