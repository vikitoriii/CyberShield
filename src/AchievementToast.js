import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Zap, Star } from 'lucide-react';

const MISSION_NAMES = {
  1: 'СТОЙКОСТЬ ПАРОЛЯ',
  2: 'ДЕТЕКТОР ФИШИНГА',
  3: 'СЕТЕВОЙ ЭКРАН',
  4: 'БАЗА ДАННЫХ',
  5: 'СОЦ. ИНЖЕНЕРИЯ',
  6: 'КРИПТОГРАФИЯ',
  7: 'ЦИФРОВОЙ СЛЕД',
  8: 'ВЗЛОМ СЕЙФА',
  9: 'СКРЫТЫЙ ПОРТАЛ',
  10: 'ФИНАЛЬНАЯ ОПЕРАЦИЯ'
};

export default function AchievementToast({ achievement, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onDone(), 500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDone]);

  return (
    <div className="achievement-toast-container">
      <AnimatePresence>
        {visible && achievement && (
          <motion.div
            className="achievement-toast"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="achievement-toast-icon">
              <CheckCircle size={24} color="#00ff41" />
            </div>
            <div className="achievement-toast-content">
              <div className="achievement-toast-title">МИССИЯ ВЫПОЛНЕНА</div>
              <div className="achievement-toast-name">
                {MISSION_NAMES[achievement.clueId] || `МИССИЯ #${achievement.clueId}`}
              </div>
              <div className="achievement-toast-reward">
                <Zap size={12} /> +{achievement.points} XP
              </div>
            </div>
            <div className="achievement-toast-glow" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
