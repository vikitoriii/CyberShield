import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SkipForward } from 'lucide-react';

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
            i += 3;
            if (i > FULL_TEXT.length) {
                setText(FULL_TEXT);
                clearInterval(interval);
            }
        }, 20);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: '#000', color: '#00ff41', zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '20px', fontFamily: 'monospace'
        }}>
            {/* Skip button */}
            <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={onStart}
                style={{ 
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'none', border: '1px solid #333', color: '#666',
                    padding: '8px 16px', cursor: 'pointer', fontSize: '11px',
                    display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10
                }}
            >
                <SkipForward size={14} /> ПРОПУСТИТЬ
            </motion.button>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '700px', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6' }}>
                {text}
                <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.6 }}>|</motion.span>
            </motion.div>
            
            {text.length >= FULL_TEXT.length && (
                <motion.button 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={onStart}
                    className="btn-main"
                    style={{ marginTop: '30px', padding: '14px 40px' }}
                >
                    ПРИНЯТЬ ВЫЗОВ
                </motion.button>
            )}
        </div>
    );
};

export default IntroStory;
