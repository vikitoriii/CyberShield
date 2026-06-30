import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { 
  Terminal, Trophy, Lock, Search, 
  Activity, Database, Book, MessageSquare, AlertTriangle, Fingerprint, Camera, Network, Globe, Target,
  UserPlus, LogIn, Eye, EyeOff, CheckCircle, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hashPassword, verifyPassword, validateUsername, validatePassword, validateEmail } from './auth';
import './App.css';

import CaseFiles from './CaseFiles';
import IntroStory from './IntroStory';
import Leaderboard from './Leaderboard';
import LiveFeed from './LiveFeed';
import Celebration from './Celebration';
import GlitchLogo from './GlitchLogo';
import AchievementToast from './AchievementToast';
import ProfileStats from './ProfileStats';
import FriendsSystem from './FriendsSystem';
import DailyChallenge from './DailyChallenge';
import LoginParticles from './LoginParticles';
import ParticleBackground from './ParticleBackground';
import NotificationSystem, { notify } from './NotificationSystem';
import StatsPanel from './StatsPanel';
import Academy from './Academy';
import AboutPage from './AboutPage';
import PasswordMission from './PasswordMission';
import PhishingMission from './PhishingMission';
import FirewallMission from './FirewallMission'; 
import DatabaseMission from './DatabaseMission';
import SocialMission from './SocialMission';
import CryptoMission from './CryptoMission';
import MetadataMission from './MetadataMission';
import SnifferMission from './SnifferMission';
import PortalMission from './PortalMission';
import FinalMission from './FinalMission';

function App() {
  const [activeTab, setActiveTab] = useState('desktop');
  const [showAbout, setShowAbout] = useState(false);
  const [username, setUsername] = useState('');
  const [points, setPoints] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [showIntro, setShowIntro] = useState(false); 
  const [unlockedClues, setUnlockedClues] = useState([]); 
  const [interceptedMsg, setInterceptedMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [achievement, setAchievement] = useState(null);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    '> CS-OS Kernel v1.0.5 loaded...', 
    '> Welcome back, Agent. Max\'s traces found.',
    '> Введите "help" для списка команд'
  ]);
  const [scanning, setScanning] = useState(false);
  const [flashEffect, setFlashEffect] = useState(null);
  const [loginPhase, setLoginPhase] = useState('boot');
  const [bootLines, setBootLines] = useState([]);
  const [loginError, setLoginError] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef(null);
  const [authMode, setAuthMode] = useState('login');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordReg, setShowPasswordReg] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [regSuccess, setRegSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const BOOT_SEQUENCE = [
    { text: '> CYBER-SHIELD OS v1.0.5', delay: 200 },
    { text: '> Инициализация ядра...', delay: 400 },
    { text: '> Загрузка модулей безопасности...', delay: 600 },
    { text: '> [OK] Защитный экран активен', delay: 800 },
    { text: '> [OK] Шифрование AES-256', delay: 1000 },
    { text: '> [OK] Сетевой экран загружен', delay: 1200 },
    { text: '> Проверка целостности системы...', delay: 1500 },
    { text: '> [OK] Все системы в норме', delay: 1700 },
    { text: '> Ожидание идентификации агента...', delay: 2000 },
  ];

  useEffect(() => {
    let timeouts = [];
    BOOT_SEQUENCE.forEach((line, i) => {
      const t = setTimeout(() => {
        setBootLines(prev => [...prev, line.text]);
      }, line.delay);
      timeouts.push(t);
    });
    const finalTimeout = setTimeout(() => {
      setLoginPhase('form');
    }, 2800);
    timeouts.push(finalTimeout);
    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (loginPhase === 'form' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loginPhase]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '1') setActiveTab('desktop');
      if (e.key === '2') setActiveTab('casefiles');
      if (e.key === '3') setActiveTab('missions');
      if (e.key === '4') setActiveTab('leaderboard');
      if (e.key === '5') setActiveTab('academy');
      if (e.key === 'Escape' && currentMission) setCurrentMission(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isLoggedIn, currentMission]);

  const getRank = (xp) => {
    if (xp < 1000) return { title: "СТАЖЕР (LVL 1)", color: "#888", desc: "Доступ ограничен" };
    if (xp < 3000) return { title: "АНАЛИТИК (LVL 2)", color: "#4d94ff", desc: "Доступ к архивам" };
    if (xp < 7000) return { title: "ДЕТЕКТИВ (LVL 3)", color: "#00ff41", desc: "Полный доступ" };
    return { title: "ЛЕГЕНДА CS-OS", color: "#ff4d4d", desc: "Уровень Администратора" };
  };
  const rank = getRank(points);

  async function handleLogin() {
    const usernameError = validateUsername(username);
    if (usernameError) {
      setFieldErrors({ username: usernameError });
      return;
    }
    if (!regPassword) {
      setFieldErrors({ password: 'Введите пароль' });
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setLoginError('');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

      if (error || !data) {
        setLoginError('Агент не найден. Проверьте имя или зарегистрируйтесь.');
        setLoading(false);
        return;
      }

      if (!data.password_hash) {
        setLoginError('Аккаунт без пароля. Обратитесь к администратору.');
        setLoading(false);
        return;
      }

      const valid = await verifyPassword(regPassword, data.password_hash);
      if (!valid) {
        setLoginError('Неверный пароль.');
        setLoading(false);
        return;
      }

      setPoints(data.points || 0);
      setUnlockedClues(data.unlocked_clues || []);
      setLoginPhase('auth-success');
      setTimeout(() => {
        setIsLoggedIn(true);
        setShowIntro(true);
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoginError('Ошибка подключения к серверу.');
      setLoading(false);
    }
  }

  async function handleRegister() {
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(regPassword);
    const emailError = validateEmail(regEmail);

    const errors = {};
    if (usernameError) errors.username = usernameError;
    if (passwordError) errors.password = passwordError;
    if (emailError) errors.email = emailError;
    if (regPassword !== regPasswordConfirm) errors.confirm = 'Пароли не совпадают';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setLoginError('');

    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single();

      if (existing) {
        setLoginError('Это имя агента уже занято.');
        setLoading(false);
        return;
      }

      if (regEmail) {
        const { data: existingEmail } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', regEmail)
          .single();

        if (existingEmail) {
          setLoginError('Этот email уже зарегистрирован.');
          setLoading(false);
          return;
        }
      }

      const passwordHash = await hashPassword(regPassword);

      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{
          username: username.toLowerCase(),
          password_hash: passwordHash,
          email: regEmail || '',
          points: 0,
          unlocked_clues: [],
          streak: 0,
          last_login: '',
          bio: 'Новый агент'
        }]);

      if (insertError) {
        console.error(insertError);
        setLoginError('Ошибка создания аккаунта.');
        setLoading(false);
        return;
      }

      setRegSuccess(true);
      setTimeout(() => {
        setRegSuccess(false);
        setAuthMode('login');
        setRegPassword('');
        setRegPasswordConfirm('');
        setRegEmail('');
      }, 2000);
    } catch (err) {
      console.error(err);
      setLoginError('Ошибка подключения к серверу.');
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading && loginPhase === 'form') {
      if (authMode === 'login') handleLogin();
      else handleRegister();
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    setIsLoggedIn(false);
    setUsername('');
    setPoints(0);
    setUnlockedClues([]);
    setCurrentMission(null);
    setActiveTab('desktop');
    setLoginPhase('boot');
    setBootLines([]);
    setTimeout(() => {
      setLoginPhase('form');
    }, 100);
  };

  const saveProgress = async (newPoints, clueId = null, missionId = null, validationData = {}) => {
    if (saving) return;
    setSaving(true);

    try {
      if (missionId) {
        try {
          const { data, error } = await supabase.functions.invoke('validate-mission', {
            body: { missionId, data: validationData, username }
          });

          if (error) throw error;

          if (data.error) {
            setInterceptedMsg(data.error === 'Mission recently completed. Wait before retrying.' 
              ? 'Миссия уже завершена. Подождите перед повторной попыткой.'
              : 'ОШИБКА: Валидация не пройдена. Попробуйте снова.');
            setTimeout(() => setInterceptedMsg(null), 4000);
            return;
          }

          setPoints(data.newPoints);
          setUnlockedClues(data.unlockedClues);

          if (data.clueId && !unlockedClues.includes(data.clueId)) {
            setCelebrate(true);
            setFlashEffect('success');
            setTimeout(() => setFlashEffect(null), 300);
            setAchievement({ clueId: data.clueId, points: data.earnedPoints });
            setTerminalLogs(prev => [...prev, `> ПЕРЕХВАТ: Обнаружен пакет данных #${data.clueId}!`, `> СТАТУС: Добавлено в архив Макса.`]);
            notify('success', `Миссия завершена! +${data.earnedPoints} XP`);
          }

          setCurrentMission(null);
          return;
        } catch (err) {
          console.warn('Edge Function unavailable, using client-side fallback:', err.message);
        }
      }

      setPoints(newPoints);
      let updatedClues = [...unlockedClues];
      
      if (clueId && !unlockedClues.includes(clueId)) {
        updatedClues.push(clueId);
        setUnlockedClues(updatedClues);
        setInterceptedMsg(`ВНИМАНИЕ! ПЕРЕХВАЧЕНА УЛИКА #${clueId}. ДАННЫЕ ДОБАВЛЕНЫ В ДОСЬЕ.`);
        setTimeout(() => setInterceptedMsg(null), 4000);
        setTerminalLogs(prev => [...prev, `> ПЕРЕХВАТ: Обнаружен пакет данных #${clueId}!`, `> СТАТУС: Добавлено в архив Макса.`]);
      }

      await supabase
        .from('profiles')
        .update({ points: newPoints, unlocked_clues: updatedClues })
        .eq('username', username);

      setCurrentMission(null);
    } finally {
      setTimeout(() => setSaving(false), 3000);
    }
  };

  const handleTerminalCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.toLowerCase().trim();
      let res = `> Команда '${cmd}' не распознана. Введите 'help' для списка.`;
      
      if (cmd === 'help') {
        setTerminalLogs(prev => [...prev, 
          `> ${terminalInput}`,
          '> ╔══════════════════════════════════════╗',
          '> ║  КОМАНДЫ:                           ║',
          '> ╠══════════════════════════════════════╣',
          '> ║  help     — список команд            ║',
          '> ║  whoami   — информация об агенте     ║',
          '> ║  status   — статус расследования     ║',
          '> ║  ref      — справочник (пароли,      ║',
          '> ║            сети, шифры, SQL)          ║',
          '> ║  scan     — сканирование сети        ║',
          '> ║  decode   — декодировать сообщение   ║',
          '> ║  rank     — информация о ранге      ║',
          '> ║  missions — список миссий            ║',
          '> ║  clear    — очистить консоль         ║',
          '> ║  joke     — случайная шутка          ║',
          '> ╚══════════════════════════════════════╝'
        ]);
        setTerminalInput('');
        return;
      }
      if (cmd === 'ref') {
        setTerminalLogs(prev => [...prev, 
          `> ${terminalInput}`,
          '> ╔══════════════════════════════════════╗',
          '> ║  СПРАВОЧНИК КИБЕРБЕЗОПАСНОСТИ:       ║',
          '> ╠══════════════════════════════════════╣',
          '> ║ ПАРОЛИ:                              ║',
          '> ║  Минимум 12 символов                 ║',
          '> ║  Буквы + цифры + спецсимволы         ║',
          '> ║  2FA — обязательна!                  ║',
          '> ╠══════════════════════════════════════╣',
          '> ║ ПОРТЫ:                               ║',
          '> ║  22=SSH  80=HTTP  443=HTTPS          ║',
          '> ║  3389=RDP  3306=MySQL                ║',
          '> ╠══════════════════════════════════════╣',
          '> ║ ШИФРЫ:                               ║',
          '> ║  AES-256=надёжный  RSA=асимметричный ║',
          '> ║  SHA-256=хеш  ROT13=простой сдвиг    ║',
          '> ╠══════════════════════════════════════╣',
          '> ║ SQL-ИНЪЕКЦИЯ:                       ║',
          '> ║  WHERE name=\'admin\' --  (уязвимо)    ║',
          '> ║  Используй Prepared Statements!      ║',
          '> ╠══════════════════════════════════════╣',
          '> ║ ФИШИНГ:                              ║',
          '> ║  Проверяй домен, ссылки, просьбы     ║',
          '> ║  о паролях — всегда фишинг!         ║',
          '> ╚══════════════════════════════════════╝'
        ]);
        setTerminalInput('');
        return;
      }
      if (cmd === 'whoami') res = `> Агент: ${username.toUpperCase()} | Ранг: ${rank.title} | XP: ${points} | Улики: ${unlockedClues.length}/10`;
      if (cmd === 'scan') {
        setTerminalLogs(prev => [...prev, 
          `> ${terminalInput}`,
          '> Сканирование сети...',
          '> [████████████████████] 100%',
          '> Результат: обнаружена зашифрованная активность',
          '> IP: 192.168.7.42 | Статус: АКТИВЕН',
          '> Предупреждение: след Shadow_Walker'
        ]);
        setTerminalInput('');
        return;
      }
      if (cmd === 'decode') {
        const messages = [
          'Кодовое имя: SHADOW_WALKER',
          'Проект: MERTVAYA_PETLA_2024',
          'Локация: 48.8584, 2.2945',
          'Статус Макса: ЖИВ, но изолирован',
          'Ключ доступа: LOOP_BREAKER_2024'
        ];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        setTerminalLogs(prev => [...prev, `> ${terminalInput}`, `> ДЕШИФРОВКА: ${msg}`, '> Улика добавлена в архив.']);
        setTerminalInput('');
        return;
      }
      if (cmd === 'joke') {
        const jokes = [
          'Почему программист путает Хеллоуин и Рождество? Потому что OCT 31 = DEC 25',
          'Что сказал нулевик единице? "Ты такая красивая!"',
          'Как программист засыпает? boolean isSleeping = true...',
          'Хакер зашёл в бар. Бармен: "Что будете?" Хакер: "DELETE FROM drinks WHERE user = \'hacker\'"'
        ];
        setTerminalLogs(prev => [...prev, `> ${terminalInput}`, `> ${jokes[Math.floor(Math.random() * jokes.length)]}`]);
        setTerminalInput('');
        return;
      }
      if (cmd === 'clear') { setTerminalLogs([]); setTerminalInput(''); return; }
      if (cmd === 'matrix') {
        setTerminalLogs(prev => [...prev, '> Следуй за белым кроликом...', '> _nEO_wAKe_Up_nEo_...']);
        setTerminalInput('');
        return;
      }
      if (cmd === 'rank') {
        const nextRank = points < 1000 ? 1000 - points : points < 3000 ? 3000 - points : points < 7000 ? 7000 - points : 0;
        res = `> РАНГ: ${rank.title} | До следующего ранга: ${nextRank > 0 ? nextRank + ' XP' : 'МАКСИМУМ'}`;
      }
      if (cmd === 'status') {
        const missionsDone = unlockedClues.length;
        const progress = Math.round((missionsDone / 10) * 100);
        res = `> СИСТЕМА: ОНЛАЙН | Прогресс: ${progress}% (${missionsDone}/10 миссий) | XP: ${points}`;
      }
      if (cmd === 'missions') {
        setTerminalLogs(prev => [...prev, 
          `> ${terminalInput}`,
          '> ╔══════════════════════════════════════╗',
          '> ║  МИССИИ:                            ║',
          '> ╠══════════════════════════════════════╣',
          ...Array.from({length: 10}, (_, i) => {
            const done = unlockedClues.includes(i + 1);
            return `> ║  ${i < 9 ? '0' : ''}${i + 1}. ${done ? '✓ ВЫПОЛНЕНА' : '○ НЕ НАЧАТА'}${' '.repeat(done ? 21 : 20)}║`;
          }),
          '> ╚══════════════════════════════════════╝'
        ]);
        setTerminalInput('');
        return;
      }
      if (cmd === 'hints') {
        const missionsDone = unlockedClues.length;
        const hints = [];
        if (missionsDone < 1) hints.push('> МИССИЯ 01: Пароль должен быть сложным — буквы, цифры, спецсимволы');
        if (missionsDone < 2) hints.push('> МИССИЯ 02: Проверяй ссылки — фишинговые содержат подменные домены');
        if (missionsDone < 3) hints.push('> МИССИЯ 03: Файрвол блокирует по портам — найди открытый');
        if (missionsDone < 4) hints.push('> МИССИЯ 04: SQL-запросы — используй SELECT для извлечения данных');
        if (missionsDone < 5) hints.push('> МИССИЯ 05: Социальная инженерия — ищи манипуляции в тексте');
        if (missionsDone < 6) hints.push('> МИССИЯ 06: Шифр Цезаря — сдвиг буквы на N позиций');
        if (missionsDone < 7) hints.push('> МИССИЯ 07: Метаданные — настрой RGB-фильтры для скрытого слоя');
        if (missionsDone < 8) hints.push('> МИССИЯ 08: Сейф — комбинация из 4 цифр, попробуй систематически');
        if (missionsDone < 9) hints.push('> МИССИЯ 09: Админ-панель — извлеки данные из ВСЕХ 6 вкладок');
        if (missionsDone < 10) hints.push('> МИССИЯ 10: Финал — собери все улики, восстанови таймлайн');
        if (hints.length === 0) hints.push('> Все миссии выполнены! Вы — лучший агент!');
        setTerminalLogs(prev => [...prev, `> ${terminalInput}`, '> ═══ ПОДСКАЗКИ К МИССИЯМ ═══', ...hints]);
        setTerminalInput('');
        return;
      }
      if (cmd === 'tips') {
        setTerminalLogs(prev => [...prev, 
          `> ${terminalInput}`,
          '> ═══ СОВЕТЫ ПО КИБЕРБЕЗОПАСНОСТИ ═══',
          '> • Используйте разные пароли для разных сервисов',
          '> • Включайте двухфакторную аутентификацию (2FA)',
          '> • Не переходите по подозрительным ссылкам',
          '> • Проверяйте адрес отправителя в письмах',
          '> • Используйте VPN в открытых Wi-Fi сетях',
          '> • Регулярно обновляйте программное обеспечение',
          '> • Не делитесь личными данными в соцсетях',
          '> • Шифруйте важные файлы и диски'
        ]);
        setTerminalInput('');
        return;
      }
      if (cmd === 'ports') {
        setTerminalLogs(prev => [...prev, 
          `> ${terminalInput}`,
          '> ═══ ИЗВЕСТНЫЕ ПОРТЫ ═══',
          '> 21   — FTP (передача файлов)',
          '> 22   — SSH (безопасный доступ)',
          '> 23   — Telnet (небезопасный доступ)',
          '> 25   — SMTP (отправка почты)',
          '> 53   — DNS (резолвинг имён)',
          '> 80   — HTTP (веб-сервер)',
          '> 443  — HTTPS (защищённый веб)',
          '> 3306 — MySQL (база данных)',
          '> 5432 — PostgreSQL (база данных)',
          '> 8080 — альтернативный HTTP'
        ]);
        setTerminalInput('');
        return;
      }
      if (cmd === 'tools') {
        setTerminalLogs(prev => [...prev, 
          `> ${terminalInput}`,
          '> ═══ ИНСТРУМЕНТЫ АГЕНТА ═══',
          '> • Nmap — сканирование сетей и портов',
          '> • Wireshark — анализ сетевого трафика',
          '> • Metasploit — фреймворк для пентеста',
          '> • Burp Suite — тестирование веб-приложений',
          '> • John the Ripper — взлом паролей',
          '> • Hashcat — восстановление хешей',
          '> • SQLMap — автоматизация SQL-инъекций',
          '> • Aircrack-ng — анализ Wi-Fi сетей'
        ]);
        setTerminalInput('');
        return;
      }

      setTerminalLogs(prev => [...prev, `> ${terminalInput}`, res].slice(-12));
      setTerminalInput('');
    }
  };

  if (!isLoggedIn) return (
    <div className="login-container" style={{ position: 'relative', overflow: 'hidden' }}>
      <LoginParticles />
      
      {/* Scan lines overlay */}
      <div className="login-scanlines" />
      
      {/* Corner decorations */}
      <div className="login-corner login-corner-tl" />
      <div className="login-corner login-corner-tr" />
      <div className="login-corner login-corner-bl" />
      <div className="login-corner login-corner-br" />

      {/* Boot sequence */}
      {loginPhase === 'boot' && (
        <div className="login-boot-screen">
          <div className="login-boot-text">
            {bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="login-boot-line"
              >
                {line}
              </motion.div>
            ))}
            <span className="login-boot-cursor">_</span>
          </div>
        </div>
      )}

      {/* Auth success animation */}
      {loginPhase === 'auth-success' && (
        <div className="login-success-screen">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="login-success-icon"
          >
            ✓
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="login-success-text"
          >
            ДОСТУП РАЗРЕШЁН
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="login-success-sub"
          >
            Добро пожаловать, Агент {username.toUpperCase()}
          </motion.div>
        </div>
      )}

      {/* Login form */}
      {loginPhase === 'form' && (
        <motion.div 
          className="login-box"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Top status bar */}
          <div className="login-status-bar">
            <div className="login-status-dot" />
            <span>SECURE CONNECTION</span>
            <span className="login-status-time">{new Date().toLocaleTimeString()}</span>
          </div>

          {/* Logo section */}
          <div className="login-logo-section">
            <div className="login-logo-icon">
              <Terminal size={40} strokeWidth={1.5} />
            </div>
            <h1 className="login-title">
              <span className="login-title-cyber">CYBER</span>
              <span className="login-title-dash">-</span>
              <span className="login-title-shield">SHIELD</span>
            </h1>
            <div className="login-subtitle">SECURE OPERATING SYSTEM</div>
            <div className="login-version">v1.0.5</div>
          </div>

          {/* Auth mode tabs */}
          <div className="login-tabs">
            <button 
              className={`login-tab ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthMode('login'); setFieldErrors({}); setLoginError(''); }}
            >
              <LogIn size={14} /> ВХОД
            </button>
            <button 
              className={`login-tab ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => { setAuthMode('register'); setFieldErrors({}); setLoginError(''); }}
            >
              <UserPlus size={14} /> РЕГИСТРАЦИЯ
            </button>
          </div>

          {/* Divider */}
          <div className="login-divider">
            <div className="login-divider-line" />
            <div className="login-divider-dot" />
            <div className="login-divider-line" />
          </div>

          {/* Registration success */}
          {regSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="login-reg-success"
            >
              <CheckCircle size={48} color="#00ff41" />
              <div className="login-reg-success-text">АККАУНТ СОЗДАН!</div>
              <div className="login-reg-success-sub">Теперь войдите в систему</div>
            </motion.div>
          )}

          {!regSuccess && (
            <>
              {/* Two-column layout for login, stacked for register */}
              <div className={`login-form-grid ${authMode === 'login' ? 'login-form-grid-2' : ''}`}>
                {/* Username input */}
                <div className="login-input-section">
                  <label className="login-input-label">Имя агента</label>
                  <div className={`login-input-wrapper ${inputFocused === 'username' ? 'focused' : ''} ${fieldErrors.username ? 'error' : ''}`}>
                    <div className="login-input-icon">
                      <Lock size={16} />
                    </div>
                    <input 
                      ref={inputRef}
                      type="text" 
                      placeholder="agent_name" 
                      value={username} 
                      onChange={(e) => { setUsername(e.target.value); setFieldErrors(prev => ({ ...prev, username: null })); setLoginError(''); }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setInputFocused('username')}
                      onBlur={() => setInputFocused(null)}
                      className="login-input"
                      disabled={loading}
                      maxLength={20}
                      autoComplete="username"
                    />
                    {username && (
                      <div className="login-input-clear" onClick={() => setUsername('')}>×</div>
                    )}
                  </div>
                  {fieldErrors.username && <div className="login-error">{fieldErrors.username}</div>}
                </div>

                {/* Password */}
                <div className="login-input-section">
                  <label className="login-input-label">Пароль</label>
                  <div className={`login-input-wrapper ${inputFocused === 'password' ? 'focused' : ''} ${fieldErrors.password ? 'error' : ''}`}>
                    <div className="login-input-icon">
                      <Lock size={16} />
                    </div>
                    <input 
                      type={showPassword || showPasswordReg ? 'text' : 'password'} 
                      placeholder={authMode === 'register' ? 'Мин. 6 символов' : 'Введите пароль'} 
                      value={regPassword} 
                      onChange={(e) => { setRegPassword(e.target.value); setFieldErrors(prev => ({ ...prev, password: null, confirm: null })); setLoginError(''); }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setInputFocused('password')}
                      onBlur={() => setInputFocused(null)}
                      className="login-input"
                      disabled={loading}
                      autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                    />
                    <div className="login-input-eye" onClick={() => authMode === 'register' ? setShowPasswordReg(!showPasswordReg) : setShowPassword(!showPassword)}>
                      {showPassword || showPasswordReg ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>
                  </div>
                  {fieldErrors.password && <div className="login-error">{fieldErrors.password}</div>}
                </div>
              </div>

              {/* Register-only fields */}
              {authMode === 'register' && (
                <div className="login-form-grid login-form-grid-2">
                  {/* Email */}
                  <div className="login-input-section">
                    <label className="login-input-label">Email <span style={{ color: '#333' }}>(необязательно)</span></label>
                    <div className={`login-input-wrapper ${inputFocused === 'email' ? 'focused' : ''} ${fieldErrors.email ? 'error' : ''}`}>
                      <div className="login-input-icon">@</div>
                      <input 
                        type="email" 
                        placeholder="agent@email.com" 
                        value={regEmail} 
                        onChange={(e) => { setRegEmail(e.target.value); setFieldErrors(prev => ({ ...prev, email: null })); }}
                        onFocus={() => setInputFocused('email')}
                        onBlur={() => setInputFocused(null)}
                        className="login-input"
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>
                    {fieldErrors.email && <div className="login-error">{fieldErrors.email}</div>}
                  </div>

                  {/* Confirm password */}
                  <div className="login-input-section">
                    <label className="login-input-label">Подтвердите пароль</label>
                    <div className={`login-input-wrapper ${inputFocused === 'confirm' ? 'focused' : ''} ${fieldErrors.confirm ? 'error' : ''}`}>
                      <div className="login-input-icon">
                        <Lock size={16} />
                      </div>
                      <input 
                        type={showPasswordReg ? 'text' : 'password'} 
                        placeholder="Повторите пароль" 
                        value={regPasswordConfirm} 
                        onChange={(e) => { setRegPasswordConfirm(e.target.value); setFieldErrors(prev => ({ ...prev, confirm: null })); }}
                        onFocus={() => setInputFocused('confirm')}
                        onBlur={() => setInputFocused(null)}
                        className="login-input"
                        disabled={loading}
                        autoComplete="new-password"
                      />
                    </div>
                    {fieldErrors.confirm && <div className="login-error">{fieldErrors.confirm}</div>}
                  </div>
                </div>
              )}

              {/* Error message */}
              {loginError && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="login-error-box"
                >
                  {loginError}
                </motion.div>
              )}

              {/* Button */}
              <button 
                className="login-btn" 
                onClick={authMode === 'login' ? handleLogin : handleRegister}
                disabled={loading || !username || (authMode === 'register' && !regPassword)}
              >
                {loading ? (
                  <span className="login-btn-loading">
                    <span className="login-btn-spinner" />
                    {authMode === 'login' ? 'ПРОВЕРКА...' : 'СОЗДАНИЕ...'}
                  </span>
                ) : (
                  <span className="login-btn-text">
                    {authMode === 'login' ? <><LogIn size={16} /> ВОЙТИ</> : <><UserPlus size={16} /> ЗАРЕГИСТРИРОВАТЬСЯ</>}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Footer info */}
          <div className="login-footer">
            <div className="login-footer-item">
              <span className="login-footer-dot login-footer-dot-green" />
              AES-256
            </div>
            <div className="login-footer-item">
              <span className="login-footer-dot login-footer-dot-green" />
              TLS 1.3
            </div>
            <div className="login-footer-item">
              <span className="login-footer-dot login-footer-dot-green" />
              SECURE
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  if (showIntro) return <IntroStory onStart={() => setShowIntro(false)} />;

  // Fake system notifications for vibe
  const [fakeNotifications, setFakeNotifications] = useState([]);
  const FAKE_NOTIFS = [
    { icon: '🔒', title: 'SYSTEM ALERT', text: 'Обнаружена подозрительная активность в сегменте B-7', color: '#ff4d4d' },
    { icon: '📡', title: 'NET MONITOR', text: 'Шифрованный трафик на порту 443 — источник: 192.168.7.42', color: '#f7b500' },
    { icon: '🛡️', title: 'FIREWALL', text: 'Заблокирована попытка SQL-инъекции с IP 10.0.0.55', color: '#4d94ff' },
    { icon: '⚠️', title: 'INTRUSION DETECT', text: 'Неудачная попытка доступа: пароль "admin123"', color: '#ff4d4d' },
    { icon: '🔍', title: 'SCANNER', text: 'Завершено сканирование портов — 3 уязвимости', color: '#f7b500' },
    { icon: '💡', title: 'SHADOW SIGNAL', text: 'Обнаружен слабый сигнал на частоте 104.4 MHz...', color: '#00ff41' },
    { icon: '🔐', title: 'CRYPTO MODULE', text: 'AES-256 шифрование активно — канал защищён', color: '#00ff41' },
    { icon: '📡', title: 'DEAD DROP', text: 'Получен новый пакет данных от агента MAX', color: '#f7b500' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const notif = FAKE_NOTIFS[Math.floor(Math.random() * FAKE_NOTIFS.length)];
      const id = Date.now();
      setFakeNotifications(prev => [...prev.slice(-2), { ...notif, id }]);
      setTimeout(() => {
        setFakeNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    }, 12000 + Math.random() * 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="os-wrapper">
      <ParticleBackground />
      <NotificationSystem />
      <Celebration active={celebrate} onComplete={() => setCelebrate(false)} />
      <AchievementToast achievement={achievement} onDone={() => setAchievement(null)} />
      <FriendsSystem username={username} points={points} />
      
      {/* Fake system notifications */}
      <div style={{ position: 'fixed', top: '50px', right: '10px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none', maxWidth: '320px' }}>
        <AnimatePresence>
          {fakeNotifications.map(n => (
            <motion.div key={n.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{
                background: 'rgba(10,10,10,0.95)', border: `1px solid ${n.color}33`,
                borderLeft: `3px solid ${n.color}`, padding: '10px 14px',
                backdropFilter: 'blur(8px)', fontSize: '10px', fontFamily: 'monospace'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span>{n.icon}</span>
                <span style={{ color: n.color, fontWeight: 'bold', letterSpacing: '1px' }}>{n.title}</span>
                <span style={{ marginLeft: 'auto', color: '#444', fontSize: '8px' }}>● LIVE</span>
              </div>
              <div style={{ color: '#888', lineHeight: '1.4' }}>{n.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {scanning && (
        <div className="scan-overlay">
          <div className="scan-line-anim" />
          <div className="scan-text">ИНИЦИАЛИЗАЦИЯ МИССИИ...</div>
        </div>
      )}
      {flashEffect && <div className={`flash-${flashEffect}`} />}
      <AnimatePresence>
        {interceptedMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#000', border: '1px solid #ff4d4d', padding: '20px', color: '#ff4d4d', boxShadow: '0 0 30px rgba(255, 77, 77, 0.4)', fontFamily: 'monospace' }}
          >
            <AlertTriangle size={16} style={{marginRight: '10px'}} /> {interceptedMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="sidebar">
        <GlitchLogo />
        <nav>
          <button className={activeTab === 'desktop' ? 'active' : ''} onClick={() => setActiveTab('desktop')}>
            <Activity size={18} /> Рабочий стол <span className="nav-shortcut">1</span>
          </button>
          <button className={activeTab === 'casefiles' ? 'active' : ''} onClick={() => setActiveTab('casefiles')}>
            <Search size={18} /> Доска улик <span className="nav-shortcut">2</span>
          </button>
          <button className={activeTab === 'missions' ? 'active' : ''} onClick={() => setActiveTab('missions')}>
            <Lock size={18} /> Миссии <span className="nav-shortcut">3</span>
          </button>
          <button className={activeTab === 'leaderboard' ? 'active' : ''} onClick={() => setActiveTab('leaderboard')}>
            <Trophy size={18} /> Рейтинг <span className="nav-shortcut">4</span>
          </button>
          <button className={activeTab === 'academy' ? 'active' : ''} onClick={() => setActiveTab('academy')}>
            <Book size={18} /> Академия <span className="nav-shortcut">5</span>
          </button>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #1a1a1a' }}>
          <button className="about-btn" onClick={() => setShowAbout(true)}>
            <Info size={14} /> О проекте
          </button>
        </div>
        <div className="user-info" style={{ borderTop: `2px solid ${rank.color}`, background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ fontWeight: 'bold' }}>{username.toUpperCase()}</div>
          <div style={{ fontSize: '10px', color: rank.color }}>{rank.title}</div>
          <button className="logout-btn" onClick={handleLogout} title="Выйти из аккаунта">⏻</button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      {isLoggedIn && (
        <div className="mobile-bottom-nav">
          <button className={activeTab === 'desktop' ? 'active' : ''} onClick={() => setActiveTab('desktop')}>
            <Activity size={18} /><span>Главная</span>
          </button>
          <button className={activeTab === 'missions' ? 'active' : ''} onClick={() => setActiveTab('missions')}>
            <Lock size={18} /><span>Миссии</span>
          </button>
          <button className={activeTab === 'academy' ? 'active' : ''} onClick={() => setActiveTab('academy')}>
            <Book size={18} /><span>Академия</span>
          </button>
          <button className={activeTab === 'casefiles' ? 'active' : ''} onClick={() => setActiveTab('casefiles')}>
            <Search size={18} /><span>Улики</span>
          </button>
          <button className={activeTab === 'leaderboard' ? 'active' : ''} onClick={() => setActiveTab('leaderboard')}>
            <Trophy size={18} /><span>Рейтинг</span>
          </button>
        </div>
      )}

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <motion.div 
            className="modal-box"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-icon">⏻</div>
            <div className="modal-title">ВЫХОД ИЗ АККАУНТА</div>
            <div className="modal-text">Вы уверены, что хотите выйти? Несохранённый прогресс будет потерян.</div>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-cancel" onClick={() => setShowLogoutConfirm(false)}>ОТМЕНА</button>
              <button className="modal-btn modal-btn-danger" onClick={confirmLogout}>ВЫЙТИ</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* About page modal */}
      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)} style={{ overflowY: 'auto', alignItems: 'flex-start', padding: '40px 20px' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '960px', background: '#0a0a0a', border: '1px solid #222', position: 'relative' }}
          >
            <button onClick={() => setShowAbout(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '20px', zIndex: 10 }}>×</button>
            <AboutPage />
          </motion.div>
        </div>
      )}

      <main className="main-content">
        <header className="top-bar">
          <div className="system-status">ACCESS: <span className="blink" style={{color: rank.color}}>{rank.desc.toUpperCase()}</span></div>
          <div className="score" style={{color: '#00ff41', fontWeight: 'bold'}}>XP_NET: {points}</div>
        </header>

        <section className="view-area">
          {activeTab === 'desktop' && (
            <div className="window animate-fade">
              <div className="desktop-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>
                <div>
                  <h2 style={{ marginBottom: '8px' }}>Аналитический терминал: {username}</h2>
                  <div className="news-feed" style={{ marginBottom: '16px' }}>
                    <p style={{color: '#ff4d4d', margin: '4px 0'}}>[!] СИСТЕМА: Обнаружены фрагменты данных "Мертвой петли".</p>
                    <p style={{margin: '4px 0'}}>[i] Завершите миссии, чтобы восстановить архив Макса. Введите 'help' в терминале.</p>
                  </div>
                  <div className="terminal-container">
                    <div className="terminal-log" style={{ height: '150px', overflowY: 'auto', padding: '16px', background: '#000', border: '1px solid #1a1a1a' }}>
                      {terminalLogs.map((log, i) => (
                        <div key={i} style={{ color: i === terminalLogs.length - 1 ? '#00ff41' : '#888', marginBottom: '2px' }}>{log}</div>
                      ))}
                    </div>
                    <div className="terminal-input-line" style={{ padding: '12px 16px' }}>
                      <span className="terminal-prompt">$</span>
                      <input type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} onKeyDown={handleTerminalCommand} placeholder="введите команду..." />
                      <span className="terminal-cursor" />
                    </div>
                  </div>
                  <DailyChallenge username={username} onComplete={(pts) => setPoints(prev => prev + pts)} />
                  <ProfileStats username={username} points={points} unlockedClues={unlockedClues} />
                  <StatsPanel username={username} points={points} unlockedClues={unlockedClues} />
                </div>
                <LiveFeed username={username} />
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <div className="missions-area">
              {!currentMission ? (
                <div className="missions-grid">
                  {[
                    { id: 'password', icon: <Lock color="#00ff41" size={28} />, num: '01', title: 'СТОЙКОСТЬ ПАРОЛЯ', desc: 'Создай надёжный пароль для взлома системы', clueId: 1, diff: 'ЛЕГКО', diffColor: '#00ff41', threat: 'low' },
                    { id: 'phishing', icon: <Search color="#f7b500" size={28} />, num: '02', title: 'ДЕТЕКТОР ФИШИНГА', desc: 'Отличи настоящие письма от вредоносных', clueId: 2, diff: 'СРЕДНЕ', diffColor: '#f7b500', threat: 'medium' },
                    { id: 'firewall', icon: <Activity color="#00ff41" size={28} />, num: '03', title: 'СЕТЕВОЙ ЭКРАН', desc: 'Пробей файрвол и найди сервер', clueId: 3, diff: 'СРЕДНЕ', diffColor: '#f7b500', threat: 'medium' },
                    { id: 'database', icon: <Database color="#4d94ff" size={28} />, num: '04', title: 'БАЗА ДАННЫХ', desc: 'Извлеки данные через SQL-запросы', clueId: 4, diff: 'СРЕДНЕ', diffColor: '#f7b500', threat: 'medium' },
                    { id: 'social', icon: <MessageSquare color="#00ff41" size={28} />, num: '05', title: 'СОЦ. ИНЖЕНЕРИЯ', desc: 'Раскрой манипуляции в переписках', clueId: 5, diff: 'СЛОЖНО', diffColor: '#ff4d4d', threat: 'high' },
                    { id: 'crypto', icon: <Fingerprint color="#f7b500" size={28} />, num: '06', title: 'КРИПТОГРАФИЯ', desc: 'Перехвати и расшифруй сигнал Макса', clueId: 6, diff: 'СРЕДНЕ', diffColor: '#f7b500', threat: 'medium' },
                    { id: 'metadata', icon: <Camera color="#00ff41" size={28} />, num: '07', title: 'ЦИФРОВОЙ СЛЕД', desc: 'Восстанови данные из повреждённого файла', clueId: 7, diff: 'СЛОЖНО', diffColor: '#ff4d4d', threat: 'high' },
                    { id: 'sniffer', icon: <Network color="#ff4d4d" size={28} />, num: '08', title: 'ВЗЛОМ СЕЙФА', desc: 'Подбери 4-значный код доступа', clueId: 8, diff: 'СРЕДНЕ', diffColor: '#f7b500', threat: 'medium' },
                    { id: 'portal', icon: <Globe color="#4d94ff" size={28} />, num: '09', title: 'СКРЫТЫЙ ПОРТАЛ', desc: 'Проникни в админ-панель Neocorp', clueId: 9, diff: 'СЛОЖНО', diffColor: '#ff4d4d', threat: 'high' },
                    { id: 'final', icon: <Target color="#ff4d4d" size={28} />, num: '10', title: 'ФИНАЛЬНАЯ ОПЕРАЦИЯ', desc: 'Заверши расследование и поймай преступника', clueId: 10, final: true, diff: 'ЭКСПЕРТ', diffColor: '#ff4d4d', threat: 'high' }
                  ].map(m => {
                    const done = unlockedClues.includes(m.clueId);
                    return (
                      <div key={m.id} className={`mission-card card-glow ${done ? 'mission-completed' : ''} ${m.final ? 'mission-card-final' : ''}`}>
                        {done && <div className="mission-done-badge">✓</div>}
                        {done && <div className="classified-watermark">CLASSIFIED</div>}
                        <div className="icon-box">{m.icon}</div>
                        <div className="mission-card-content">
                          <span className="mission-number">{m.num}</span>
                          <h3>{m.title}</h3>
                          <p className="mission-desc">{m.desc}</p>
                          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '9px', letterSpacing: '1px', alignItems: 'center' }}>
                            <span style={{ color: m.diffColor, fontWeight: 'bold' }}>{m.diff}</span>
                            <div className="threat-indicator">
                              <div className={`threat-dot ${m.threat}`} />
                              <span style={{ color: '#555' }}>УГРОЗА</span>
                            </div>
                          </div>
                        </div>
                        <button className={`btn-action ${m.final ? 'btn-action-final' : ''}`} onClick={() => { setScanning(true); setTimeout(() => { setScanning(false); setCurrentMission(m.id); }, 1500); }}>
                          {done ? 'ПОВТОРИТЬ' : 'ЗАПУСТИТЬ'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <button className="btn-back" onClick={() => setCurrentMission(null)}>← ВЫХОД</button>
                  {currentMission === 'password' && <PasswordMission username={username} currentPoints={points} onComplete={(p) => saveProgress(p, 1, 'password', { password: 'check' })} />}
                  {currentMission === 'phishing' && <PhishingMission username={username} currentPoints={points} onComplete={(p) => saveProgress(p, 2, 'phishing', { answers: {} })} />}
                  {currentMission === 'firewall' && <FirewallMission username={username} currentPoints={points} onComplete={(p) => saveProgress(p, 3, 'firewall', { frequency: 74, sequence: [2,7,13,8] })} />}
                  {currentMission === 'database' && <DatabaseMission username={username} currentPoints={points} onComplete={(p) => saveProgress(p, 4, 'database', { queries: [] })} />}
                  {currentMission === 'social' && <SocialMission username={username} currentPoints={points} onComplete={(p) => saveProgress(p, 5, 'social', { threatsFound: 3 })} />}
                  {currentMission === 'crypto' && <CryptoMission username={username} currentPoints={points} onComplete={(p) => saveProgress(p, 6, 'crypto', { frequency: 22, shift: 13, sector: 7 })} />}
                  {currentMission === 'metadata' && <MetadataMission username={username} currentPoints={points} onComplete={(p) => saveProgress(p, 7, 'metadata', { packetsCaptured: 3, red: 10, green: 160 })} />}
                  {currentMission === 'sniffer' && <SnifferMission username={username} currentPoints={points} onComplete={(p) => saveProgress(p, 8, 'sniffer', { attempts: 5 })} />}
                  {currentMission === 'portal' && <PortalMission username={username} currentPoints={points} onComplete={(p) => saveProgress(p, 9, 'portal', { password: 'LOOP_BREAKER_2024', evidenceCount: 3 })} />}
                  {currentMission === 'final' && <FinalMission username={username} currentPoints={points} onComplete={(p) => saveProgress(p, 10, 'final', { cipherAnswer: 'SHADOW_WALKER', evidenceCorrect: 9, timelineComplete: true })} />}
                </>
              )}
            </div>
          )}

          {activeTab === 'casefiles' && <CaseFiles unlockedClues={unlockedClues} />}
          {activeTab === 'leaderboard' && <Leaderboard />}
          {activeTab === 'academy' && <Academy username={username} />}
        </section>
      </main>
    </div>
  );
}

export default App;
