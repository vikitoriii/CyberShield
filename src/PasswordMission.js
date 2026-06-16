import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Terminal } from 'lucide-react';

const PasswordMission = ({ username, currentPoints, onComplete }) => {
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  // Список всех правил (каждый уровень добавляет новое)
  const allRules = [
    {
      id: 1,
      label: "Протокол 'Базис'",
      desc: "8+ символов, заглавная буква и цифра",
      check: (p) => p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p),
    },
    {
      id: 2,
      label: "Геолокация хакера",
      desc: "Пароль должен содержать название столицы Франции (с большой буквы)",
      check: (p) => p.includes("Paris"),
    },
    {
      id: 3,
      label: "Математический ключ",
      desc: "Сумма всех цифр в пароле должна быть равна 10",
      check: (p) => {
        const digits = p.match(/\d/g);
        if (!digits) return false;
        const sum = digits.reduce((a, b) => a + parseInt(b), 0);
        return sum === 10;
      },
    },
    {
      id: 4,
      label: "Терминология",
      desc: "Добавьте название метода взлома через психологию: 'SocialEngineering'",
      check: (p) => p.includes("SocialEngineering"),
    }
  ];

  // Определяем, какие правила должны выполняться сейчас
  const activeRules = allRules.slice(0, level);
  const allRulesMet = activeRules.every(rule => rule.check(password));

  const handleNext = () => {
    if (allRulesMet) {
      if (level < allRules.length) {
        setLevel(level + 1);
      } else {
        setIsFinished(true);
      }
    }
  };

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="win-box">
        <div className="glitch-text">ACCESS GRANTED</div>
        <p>Вы взломали систему. Получено 1000 XP</p>
        <button className="btn-huge" onClick={() => onComplete(currentPoints + 1000)}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
      </motion.div>
    );
  }

  return (
    <div className="detective-layout">
      {/* Левая часть: Ввод и Задание */}
      <div className="mission-main-panel window">
        <div className="panel-header">
          <Terminal size={18} />
          <span>MISSION_LOG: STAGE_{level}</span>
        </div>

        <div className="task-display">
          <h3>Текущая задача:</h3>
          <p className="task-desc">{allRules[level - 1].desc}</p>
        </div>

        <div className="input-container">
          <input 
            type="text" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ожидание ввода ключа..."
            className="hack-input"
            autoFocus
          />
          <div className="scan-line"></div>
        </div>

        <button 
          className={`btn-huge ${allRulesMet ? 'ready' : 'disabled'}`}
          onClick={handleNext}
          disabled={!allRulesMet}
        >
          {level === allRules.length ? "ФИНАЛЬНЫЙ ВЗЛОМ" : "ПРИНЯТЬ КОД"}
        </button>
      </div>

      {/* Правая часть: Список правил (чек-лист детектива) */}
      <div className="rules-sidebar window">
        <div className="panel-header">СТАТУС ПРОВЕРКИ</div>
        <div className="rules-list">
          <AnimatePresence>
            {activeRules.map((rule) => (
              <motion.div 
                key={rule.id}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`rule-item ${rule.check(password) ? 'met' : 'failed'}`}
              >
                {rule.check(password) ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                <div>
                  <div className="rule-label">{rule.label}</div>
                  <div className="rule-desc-short">{rule.desc}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PasswordMission;