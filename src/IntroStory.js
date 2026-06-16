import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FULL_TEXT = `> ИНИЦИАЛИЗАЦИЯ CS-OS...
> ОБНАРУЖЕН СКРЫТЫЙ РАЗДЕЛ: [MAX_PRIVATE_ARCHIVE]
> СООБЩЕНИЕ ОТ: МАКС_Р (СТАТУС: ПРОПАЛ БЕЗ ВЕСТИ)
> ТЕКСТ: "Если ты это читаешь, значит меня уже нет в офисе. 
Они думают, что я просто уволился. Но я нашел правду о проекте 'Мертвая петля'.
Я разделил ключи доступа между 10 протоколами безопасности. 
Собери их все. Найди меня. И не верь системным уведомлениям..."`;

const IntroStory = ({ onStart }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setText(FULL_TEXT.slice(0, i));
            i++;
            if (i > FULL_TEXT.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: '#000', color: '#00ff41', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '40px', fontFamily: 'monospace'
        }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '800px', whiteSpace: 'pre-wrap', fontSize: '18px', lineHeight: '1.6' }}>
                {text}
                <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>|</motion.span>
            </motion.div>
            
            {text.length >= FULL_TEXT.length && (
                <motion.button 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={onStart}
                    className="btn-main"
                    style={{ marginTop: '40px', padding: '15px 40px' }}
                >
                    ПРИНЯТЬ ВЫЗОВ
                </motion.button>
            )}
        </div>
    );
};

export default IntroStory;