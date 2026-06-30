import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Terminal, HelpCircle } from 'lucide-react';

const PasswordMission = ({ username, currentPoints, onComplete }) => {
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const allRules = [
    {
      id: 1,
      label: "Протокол 'Базис'",
      desc: "Пароль должен содержать минимум 8 символов, хотя бы одну заглавную букву и одну цифру",
      hint1: "Используйте комбинацию букв разного регистра и цифр",
      hint2: "Например: Cyber123, Pass456, Hello99",
      check: (p) => p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p),
    },
    {
      id: 2,
      label: "Геолокация хакера",
      desc: "Добавьте в пароль название столицы Франции (с заглавной буквы)",
      hint1: "Подумайте о городе, где находится Эйфелева башня",
      hint2: "Paris — столица Франции",
      check: (p) => p.includes("Paris"),
    },
    {
      id: 3,
      label: "Математический ключ",
      desc: "Сумма всех цифр в пароле должна быть равна 10",
      hint1: "Подберите цифры так, чтобы их сумма была ровно 10",
      hint2: "Например: 1+2+3+4 = 10, или 5+5 = 10, или 9+1 = 10",
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
      desc: "Добавьте термин, описывающий метод взлома через психологическое давление на человека",
      hint1: "Это метод, когда злоумышленник манипулирует жертвой, используя доверие",
      hint2: "SocialEngineering — социальная инженерия",
      check: (p) => p.includes("SocialEngineering"),
    }
  ];

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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="window animate-fade mission-win">
        <div className="mission-win-icon">
          <CheckCircle2 size={72} color="#00ff41" />
        </div>
        <h1 className="glitch-text mission-win-title" style={{ color: '#00ff41' }}>ДОСТУП ПОЛУЧЕН</h1>
        <p className="mission-win-subtitle">Вы создали надёжный пароль и получили доступ к системе Neocorp.</p>
        <div className="mission-clue">
          <div className="mission-clue-label" style={{ color: '#00ff41' }}>УЛИКА #1</div>
          <p className="mission-clue-text">
            В логах входа обнаружен подозрительный аккаунт <b style={{ color: '#ff4d4d' }}>Shadow_Walker</b> — 
            кто-то заходил в систему в 3:00 ночи. Пароль был изменён внешним скриптом.
          </p>
        </div>
        <button className="btn-huge" onClick={() => onComplete(currentPoints + 1000)}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
      </motion.div>
    );
  }

  if (showIntro) return (
    <div className="window animate-fade mission-intro">
      <div className="mission-intro-icon">
        <ShieldAlert size={72} color="#00ff41" />
      </div>
      <h1 className="glitch-text mission-intro-title" style={{ color: '#00ff41' }}>СТОЙКОСТЬ ПАРОЛЯ</h1>
      <div className="mission-intro-card">
        <div className="mission-intro-label" style={{ color: '#f7b500' }}>
          МИССИЯ 01
        </div>
        <p className="mission-intro-text">
          Разведывательные данные указывают на серверную в <b style={{ color: '#00ff41' }}>Париже</b> — 
          штаб-квартиру оперативной сети Neocorp. Чтобы проникнуть в их систему, 
          нам нужно создать <b style={{ color: '#00ff41' }}>надёжный пароль</b>, который пройдет все проверки безопасности.
        </p>
      </div>
      <p className="mission-intro-hint">
        Каждый уровень добавляет новое правило. Соблюдайте все условия для получения доступа. 
        Подсказки помогут вам на каждом этапе.
      </p>
      <button className="btn-main" onClick={() => setShowIntro(false)}>НАЧАТЬ</button>
    </div>
  );

  return (
    <div className="detective-layout">
      <div className="mission-main-panel window">
        <div className="panel-header">
          <Terminal size={18} />
          <span>MISSION_LOG: STAGE_{level}/4</span>
          <button onClick={() => { setShowHint(!showHint); if (!showHint) setHintLevel(1); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: showHint ? '#f7b500' : '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
            <HelpCircle size={14} /> ПОДСКАЗКА
          </button>
        </div>

        {showHint && (
          <div style={{ background: '#000', border: '1px solid #f7b500', padding: '12px', marginBottom: '16px', color: '#f7b500', fontSize: '11px', lineHeight: '1.5' }}>
            {hintLevel === 1 && (
              <div>
                <div>{allRules[level - 1].hint1}</div>
                <button onClick={() => setHintLevel(2)} style={{ marginTop: '6px', background: '#f7b500', color: '#000', border: 'none', padding: '3px 6px', fontSize: '9px', cursor: 'pointer' }}>
                  Показать ответ
                </button>
              </div>
            )}
            {hintLevel === 2 && <div>{allRules[level - 1].hint2}</div>}
          </div>
        )}

        <div className="task-display">
          <h3>Уровень {level}: {allRules[level - 1].label}</h3>
          <p className="task-desc">{allRules[level - 1].desc}</p>
        </div>

        <div className="input-container">
          <input 
            type="text" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль..."
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
