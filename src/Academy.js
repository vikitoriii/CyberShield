import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';
import { Lock, Search, Shield, Fingerprint, Camera, Database, Globe, ChevronRight, ArrowLeft, AlertTriangle, Wifi, Code, CheckCircle, Trophy } from 'lucide-react';

const LESSONS = [
  {
    id: 'passwords', icon: <Lock size={22} />, title: 'ПАРОЛИ И АУТЕНТИФИКАЦИЯ', color: '#00ff41',
    theory: [
      { title: 'Почему пароли ломают?', text: 'Брутфорс — перебор всех комбинаций. Программа Kali Linux перебирает 10 млрд паролей в секунду. Словарная атака — перебор из списка популярных паролей. Фишинг — крадут пароль обманом, а не взломом.\n\nРеальный кейс: в 2012 году LinkedIn потерял 117 млн паролей. Все они были слабыми — 123456, linkedin, password.' },
      { title: 'Как создать надёжный пароль?', text: 'Фраза-пароль: "Мой_кот_съел_2_мышки!" — длинный, запоминается, содержит всё.\n\nПравила:\n- Минимум 12 символов\n- Заглавные и строчные буквы\n- Цифры и спецсимволы\n- Не используйте один пароль на все сайты\n- Не используйте данные из словаря\n\nИнтересный факт: пароль "correct horse battery staple" надёжнее, чем "J8#kL2!m". Длинные фразы лучше коротких случайных строк.' },
      { title: '2FA и менеджеры паролей', text: 'Двухфакторная аутентификация (2FA) — второй слой защиты. Даже с украденным паролем вход невозможен без кода из приложения.\n\nGoogle Authenticator — генерирует коды каждые 30 секунд.\nYubiKey — аппаратный ключ, невозможно украсть удалённо.\n\nМенеджеры паролей:\nBitwarden — бесплатный, открытый код\nKeePass — локальный, максимальная безопасность\n1Password — удобный, платный\n\nСтатистика: пользователи с 2FA защищены от 99% автоматических атак.' },
    ],
    exercise: { type: 'password_strength', description: 'Проверь надёжность разных парольных фраз' }
  },
  {
    id: 'phishing', icon: <Search size={22} />, title: 'ФИШИНГ И ТРИКСИТЕРСТВО', color: '#f7b500',
    theory: [
      { title: 'Как работают фишеры?', text: 'Фишер создаёт копию сайта (bank.com → bank-secure.com). Жертва вводит данные — фишер получает пароль и код из SMS.\n\nРеальный кейс: в 2020 году мошенники украли $100 млн через фишинг. Они звонили CEO и подделывали email-переписку.\n\nВиды фишинга:\nEmail-фишинг — поддельные письма\nSMS-фишинг (смишинг) — поддельные SMS\nВишинг — телефонные звонки\nКлонирование сайтов — точные копии банков' },
      { title: 'Омоографы и гомографы', text: 'Хакеры используют визуально похожие символы:\n\nАрабская "а" (U+0639) вместо латинской "a"\nКириллическая "о" вместо латинской "o"\nЗаглавная "I" вместо строчной "l"\n\nПримеры реальных атак:\ngoogIe.com (I вместо l)\npaypaI.com (I вместо l)\naррӏе.com (кириллические буквы)\n\nПроверяйте домен в адресной строке, не по ссылке из письма!' },
      { title: 'Психологические триггеры', text: 'Фишеры используют наши эмоции:\n\nСтрах: "Ваш аккаунт взломан!"\nЖадность: "Вы выиграли приз!"\nСрочность: "Нужно подтвердить за 24 часа!"\nАвторитет: "Это пишет ваш руководитель"\nСоциальное доказательство: "1000 человек уже подтвердили"\n\nПравило 3 секунд: перед любым действием подождите 3 секунды и подумайте. Кто отправил? Настоящий ли адрес? Зачем просят данные?' },
    ],
    exercise: { type: 'phishing_advanced', description: 'Разбери сложные случаи фишинга' }
  },
  {
    id: 'crypto', icon: <Shield size={22} />, title: 'КРИПТОГРАФИЯ', color: '#4d94ff',
    theory: [
      { title: 'Зачем нужно шифрование?', text: 'Без шифрования весь интернет читается как открытая книга. Ваш провайдер видит все сайты. Хакер в кафе видит ваши пароли.\n\nHTTPS шифрует трафик между браузером и сервером. WhatsApp и Signal шифруют сообщения end-to-end — даже сервер не может прочитать.\n\nРеальный кейс: в 2013 году Edward Snowden показал, как NSA перехватывала незашифрованные данные. После этого мир перешёл на HTTPS.' },
      { title: 'Шифр Цезаря и подстановочные шифры', text: 'Шифр Цезаря — каждая буква сдвигается на N позиций:\nСдвиг 3: A→D, B→E, C→F\n\nПример: "HELLO" при сдвиге 3 → "KHOOR"\n\nВзлом: перебор всех 25 сдвигов за секунду.\n\nПодстановочный шифр — каждая буква заменяется на свою (не обязательно со сдвигом). Взломывается частотным анализом — в английском E самый частый символ.\n\nВажно: современные шифры (AES-256) используют ключи длиной 256 бит — перебор невозможен даже с суперкомпьютером.' },
      { title: 'Хеш-функции и их роль', text: 'Хеш-функция превращает данные в уникальную строку фиксированной длины:\n"Hello" → 2cf24dba5fb0a30e...\n\nСвойства:\n- Однонаправленная: нельзя восстановить исходные данные\n- Лавинный эффект: изменение 1 бита меняет весь хеш\n- Уникальность: маловероятное совпадение\n\nИспользование:\n- Хранение паролей (никогда не хранят пароли открытым текстом)\n- Проверка целостности файлов\n- Цифровые подписи\n- Блокчейн (Bitcoin использует SHA-256)' },
    ],
    exercise: { type: 'cipher_encode', description: 'Зашифруй и расшифруй сообщения разными методами' }
  },
  {
    id: 'social', icon: <Fingerprint size={22} />, title: 'СОЦИАЛЬНАЯ ИНЖЕНЕРИЯ', color: '#ff4d4d',
    theory: [
      { title: 'Человек — самое уязвимое звено', text: '95% кибератак начинаются с человеческого фактора. Хакер НЕ взламывает систему — он обманывает человека.\n\nРеальный кейс: в 2020 году Twitter взломали через звонок сотруднику техподдержки. Хакер представился IT-отделом и попросил "подтвердить учётную запись". Украдены аккаунты Илона Маска, Обамы, Apple.' },
      { title: 'Типы социальных атак', text: 'Претекстинг — создание ложного сценария. Хакер звонит: "Я из IT, нам нужно обновить ваш пароль".\n\nБейтинг — заражённая флешка на парковке. Кто-то найдёт и вставит в компьютер.\n\nКвид Про Кво — "услуга за услугу". "Я помогу с задачей, а ты скинь доступ".\n\nВишинг — телефонные звонки от "банка". Просят назвать код из SMS или пароль.\n\nCEO-fraud — поддельное письмо от руководителя. "Срочно переведи деньги на этот счёт".' },
      { title: 'Как защититься?', text: '1. НИКОГДА не сообщайте пароли и коды из SMS\n2. Перезвоните по официальному номеру для проверки\n3. Не переходите по ссылкам из писем\n4. Правило доверия, но проверки\n5. Не вставляйте найденные флешки\n\nКорпоративная защита:\n- Регулярные тренинги по безопасности\n- Политика "нулевого доверия"\n- Двойное подтверждение переводов\n- Моделирование атак (пентесты)' },
    ],
    exercise: { type: 'social_engineering', description: 'Разбери реальные сценарии манипуляций' }
  },
  {
    id: 'networks', icon: <Globe size={22} />, title: 'СЕТЕВАЯ БЕЗОПАСНОСТЬ', color: '#00ff41',
    theory: [
      { title: 'Как устроен интернет?', text: 'Каждый запрос проходит путь: ваш компьютер → провайдер → DNS-сервер → целевой сервер. На каждом этапе данные можно перехватить.\n\nПорты — "входы" в компьютер:\n80 — HTTP (незащищённый)\n443 — HTTPS (защищённый)\n22 — SSH (удалённое управление)\n21 — FTP (передача файлов)\n3389 — RDP (удалённый рабочий стол)\n\nОткрытые ненужные порты = приглашение для хакера. Реальный кейс: WannaCry (2017) эксплуатировал порт 445 и заразил 200 000 компьютеров по всему миру.' },
      { title: 'VPN и безопасный Wi-Fi', text: 'VPN шифрует весь трафик и направляет через сервер:\nБез VPN: Вы → Интернет (все видят ваш IP)\nС VPN: Вы → VPN → Интернет (виден IP сервера)\n\nОпасности публичного Wi-Fi:\n- Evil Twin — хакер создаёт поддельную точку доступа\n- MITM — перехват трафика между вами и роутером\n- Sniffing — анализ зашифрованного трафика\n\nЗащита: используйте VPN в кафе, аэропортах, гостиницах. Проверяйте HTTPS. Отключите автоподключение к открытым сетям.' },
      { title: 'Firewall и IDS/IPS', text: 'Firewall — фильтрует трафик по правилам:\n- Разрешить входящие на порт 443 (HTTPS)\n- Заблокировать входящие на порт 3389 (RDP)\n- Разрешить только определённые IP\n\nIDS (Intrusion Detection System) — обнаруживает подозрительную активность. IPS (Intrusion Prevention System) — блокирует атаки автоматически.\n\nСовременные решения: pfSense, iptables, Cloudflare WAF. Реальный кейс: в 2023 году группа APT29 обходила firewall через легитимные HTTPS-соединения.' },
    ],
    exercise: { type: 'port_quiz', description: 'Определи назначение портов и протоколов' }
  },
  {
    id: 'forensics', icon: <Camera size={22} />, title: 'ЦИФРОВАЯ ФОРЕНЗИКА', color: '#4d94ff',
    theory: [
      { title: 'Что ищет forensic-специалист?', text: 'Цифровые улики:\n- Метаданные файлов (EXIF: GPS, дата, камера)\n- Журналы системы (логи входов, запусков)\n- Удалённые файлы (можно восстановить)\n- Скрытые данные (стеганография)\n- История браузера и кэш\n\nРеальный кейс: в 2016 году нашли iPhone стрелка из Орландо. Apple отказывалась взламывать, но FBI наняла израильскую компанию для извлечения данных.' },
      { title: 'Метаданные — невидимая информация', text: 'Каждый файл содержит метаданные:\n\nФото (EXIF):\n- GPS-координаты (где сделано)\n- Модель камеры/телефона\n- Дата и время съёмки\n- Настройки экспозиции\n\nДокументы:\n- Имя автора\n- Программа-редактор\n- Время создания и изменения\n- Последний редактор\n\nPDF:\n- Идентификатор создателя\n- Версия Acrobat\n- Время компиляции\n\nОтправив фото, вы можете случайно раскрыть местоположение!' },
      { title: 'Восстановление и защита данных', text: 'Удалённые файлы НЕ исчезают сразу. ОС просто помечает место как свободное. Файл физически остаётся на диске до перезаписи.\n\nИнструменты восстановления:\nRecuva (Windows)\nPhotoRec (кроссплатформенный)\nTestDisk (восстановление разделов)\n\nПолное удаление:\n- Перезапись (wipe) — многократная запись случайных данных\n- Шифрование диска (BitLocker, LUKS)\n- Физическое уничтожение\n\n3-2-1 правило бэкапов: 3 копии, 2 разных носителя, 1.offsite' },
    ],
    exercise: { type: 'metadata_hunt', description: 'Найди скрытые метаданные в данных' }
  },
  {
    id: 'sql', icon: <Database size={22} />, title: 'SQL И БАЗЫ ДАННЫХ', color: '#f7b500',
    theory: [
      { title: 'Основы SQL', text: 'SQL — язык запросов к базам данных. Основные команды:\n\nSELECT * FROM users — выбрать всех пользователей\nSELECT name FROM users WHERE age > 18 — выборка с условием\nINSERT INTO users VALUES (1, "Иван") — добавление\nDELETE FROM users WHERE id = 1 — удаление\n\nБазы данных хранят информацию таблицами: строки — записи, столбцы — поля.\n\nРеальный кейс: в 2023 году утечка данных 700 млн записей из базы données произошла из-за неправильных прав доступа к SQL-таблице.' },
      { title: 'SQL-инъекции — главная угроза', text: 'SQL-инъекция — внедрение SQL-кода в запрос.\n\nУязвимый код:\nquery("SELECT * FROM users WHERE name=\'" + input + "\'")\n\nЕсли ввести: admin\' OR \'1\'=\'1\nРезультат: вернутся ВСЕ пользователи.\n\nБезопасный код (Prepared Statement):\nquery("SELECT * FROM users WHERE name=?", [input])\n\nЗапрос и данные разделены — ввод НЕ выполняется как код.\n\nРеальный кейс: взлом Target (2013) через SQL-инъекцию в систему HVAC. Украдены 40 млн номеров карт.' },
      { title: 'Защита баз данных', text: '1. Prepared Statements — всегда используй параметризованные запросы\n2. Валидация ввода — проверяй тип и формат данных\n3. Минимальные права — приложение не должно иметь доступ ко всему\n4. Шифрование — шифруй чувствительные данные\n5. Резервное копирование — регулярные бэкапы\n\nПринцип минимальных привилегий: если приложению нужен только SELECT — не давай ему DELETE и DROP.\n\nАудит: веди логи всех запросов к БД. По логам можно найти атаку.' },
    ],
    exercise: { type: 'sql_practice', description: 'Попробуй написать безопасные SQL-запросы' }
  },
  {
    id: 'malware', icon: <AlertTriangle size={22} />, title: 'ВРЕДОНОСНОЕ ПО', color: '#ff4d4d',
    theory: [
      { title: 'Типы вредоносного ПО', text: 'Вирус — заражает файлы, распространяется при запуске.\nЧервь — самораспространяется по сети без участия человека.\nТроян — маскируется под полезную программу.\nРансомвер — шифрует файлы и требует выкуп.\nКейлогер — записывает нажатия клавиш.\nРуткит — скрывается глубоко в системе.\n\nРеальный кейс: WannaCry (2017) — рансомвер, заразивший 200 000 компьютеров в 150 странах. NHS (британская медицина) остановила работу на неделю. Ущерб: $4 млрд.' },
      { title: 'Как распространяется малварь?', text: '1. Фишинговые письма с вложениями (.exe, .docx с макросами)\n2. Заражённые сайты (drive-by download)\n3. Заражённые USB-накопители\n4. Пиратское ПО и кейджены\n5. Уязвимости в ПО (не обновлённые программы)\n\nСоциальная инженерия + малварь = мощнейшая комбинация. Хакеры отправляют "счёт от поставщика.exe" — сотрудник запускает, компьютер заражён.\n\nЗащита: не запускай незнакомые файлы, обновляй ПО, используй антивирус.' },
      { title: 'Анализ и реагирование', text: 'Признаки заражения:\n- Компьютер тормозит без причин\n- Странная сетевая активность\n- Антивирус выключен\n- Незнакомые программы\n- Файлы с расширением .locked\n\nПлан реагирования:\n1. Изолировать устройство (отключить от сети)\n2. Не выключать (для анализа памяти)\n3. Сканировать антивирусом\n4. Восстановить из бэкапа\n5. Сменить все пароли\n6. Сообщить в IT-отдел\n\nКатегория: предотвращение > обнаружение > реагирование > восстановление' },
    ],
    exercise: { type: 'malware_identify', description: 'Определи тип вредоносного ПО по описанию' }
  },
  {
    id: 'wireless', icon: <Wifi size={22} />, title: 'БЕЗОПАСНОСТЬ Wi-Fi', color: '#00ff41',
    theory: [
      { title: 'Типы шифрования Wi-Fi', text: 'WEP — устарел, взламывается за минуты. НЕ используй!\nWPA2 — надёжный, стандартный. Используй AES-шифрование.\nWPA3 — самый новый, максимальная защита.\n\nНастройка роутера:\n- Смените стандартный пароль администратора\n- Используйте WPA3 (или WPA2-AES)\n- Отключите WPS (уязвим к брутфорсу)\n- Смените стандартный SSID\n- Обновляйте прошивку\n\nРеальный кейс: KRACK (2017) — атака на WPA2. Хакер перехватывал трафик даже в зашифрованной сети. Патч вышел через 6 месяцев.' },
      { title: 'Атаки на Wi-Fi', text: 'Evil Twin — хакер создаёт точку "Free_WiFi" рядом с кафе. Жертва подключается, хакер видит весь трафик.\n\nDeauth Attack — хакер отключает вас от легитимной сети, заставляя подключиться к поддельной.\n\nPacket Sniffing — анализ зашифрованного трафика. WPA2 защищает, но сильный пароль обязателен.\n\nКейлогеры — записывают нажатия в публичных сетях.\n\nЗащита: VPN в публичных сетях, проверка HTTPS, отключение автоподключения.' },
      { title: 'Безопасный Wi-Fi в公共场所', text: 'Кафе, аэропорты, гостиницы — рай для хакеров:\n\n1. Используйте VPN — шифрует весь трафик\n2. Не входите в банк через публичный Wi-Fi\n3. Проверяйте HTTPS на всех сайтах\n4. Отключите Bluetooth и AirDrop\n5. Не подключайтесь к сетям без пароля\n6. Забудьте сеть после использования\n\nАльтернативы: мобильный интернет надёжнее публичного Wi-Fi. Используйте мобильную точку доступа.\n\nСтатистика: 40% публичных Wi-Fi сетей не зашифрованы.' },
    ],
    exercise: { type: 'wifi_security', description: 'Оцени безопасность различных Wi-Fi сетей' }
  }
];

/* ==================== УПРАЖНЕНИЯ ==================== */

function PasswordStrength({ onLessonComplete }) {
  const [passwords, setPasswords] = useState(['', '', '']);
  const [results, setResults] = useState([null, null, null]);
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);

  const tips = [
    'Придумай пароль, который ты используешь или использовал',
    'Придумай более надёжный пароль',
    'Придумай пароль-фразу из 4+ слов'
  ];

  const analyze = (pw) => {
    let score = 0;
    if (pw.length >= 8) score += 15;
    if (pw.length >= 12) score += 15;
    if (pw.length >= 16) score += 10;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 15;
    if (/[0-9]/.test(pw)) score += 10;
    if (/[^A-Za-z0-9]/.test(pw)) score += 15;
    if (pw.length >= 20) score += 10;
    if (/(.)\1{2,}/.test(pw)) score -= 10;
    const time = score < 30 ? 'менее секунды' : score < 50 ? '5 минут' : score < 70 ? '3 дня' : score < 85 ? '10 лет' : 'миллиард лет';
    const color = score < 50 ? '#ff4d4d' : score < 70 ? '#f7b500' : '#00ff41';
    return { score: Math.max(0, Math.min(100, score)), time, color };
  };

  const check = () => {
    const r = analyze(passwords[current]);
    const newResults = [...results];
    newResults[current] = r;
    setResults(newResults);
    if (current < 2) setCurrent(current + 1);
    else setFinished(true);
  };

  if (finished) {
    const avg = Math.round((results.reduce((s, r) => s + r.score, 0)) / 3);
    return (
      <div className="academy-exercise">
        <div className="academy-exercise-result">
          <div className="academy-exercise-score" style={{ color: avg >= 70 ? '#00ff41' : '#f7b500' }}>{avg}/100</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>Сравнение паролей</div>
          {results.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#111', marginBottom: '4px', fontSize: '12px' }}>
              <span style={{ color: '#888' }}>Пароль {i + 1}: {passwords[i].slice(0, 8)}...</span>
              <span style={{ color: r.color }}>{r.score}/100 — {r.time}</span>
            </div>
          ))}
          <div style={{ fontSize: '12px', color: '#888', marginTop: '16px' }}>Чем длиннее и разнообразнее пароль — тем лучше. Пароль-фраза из 4 слов надёжнее случайных 8 символов.</div>
          <button className="academy-complete-btn" style={{ marginTop: '16px' }} onClick={() => onLessonComplete && onLessonComplete(avg)}>
            <CheckCircle size={16} /> ЗАВЕРШИТЬ УРОК
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="academy-exercise">
      <div className="academy-exercise-desc">{tips[current]}</div>
      <div className="academy-exercise-progress">Этап {current + 1}/3</div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" value={passwords[current]} onChange={e => { const p = [...passwords]; p[current] = e.target.value; setPasswords(p); }}
          onKeyDown={e => e.key === 'Enter' && passwords[current] && check()}
          placeholder="Введите пароль..." className="academy-exercise-input" autoFocus />
        <button className="academy-action-btn" onClick={check} disabled={!passwords[current]}>ПРОВЕРИТЬ</button>
      </div>
      {results[current] && (
        <div className="academy-result-card">
          <div className="academy-result-score" style={{ color: results[current].color }}>{results[current].score}/100</div>
          <div className="academy-result-label">Время взлома:</div>
          <div className="academy-result-time" style={{ color: results[current].color }}>{results[current].time}</div>
          <div className="academy-result-bar"><div className="academy-result-fill" style={{ width: `${results[current].score}%`, background: results[current].color }} /></div>
        </div>
      )}
    </div>
  );
}

function PhishingAdvanced({ onLessonComplete }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [finished, setFinished] = useState(false);

  const cases = useMemo(() => [
    { sender: 'security@bank-secure.by', subject: 'Срочно: подтвердите перевод 15 000 BYN', text: 'На вашем счету обнаружена подозрительная операция. Если это не вы — нажмите кнопку отмены.', phishing: true, tip: 'Срочность + страх. Настоящий банк звонит, а не просит нажимать кнопки в письме.' },
    { sender: 'it@nasha-firma.by', subject: 'Обновление VPN-клиента', text: 'Установите новую версию VPN-клиента по ссылке. Дедлайн — пятница.', phishing: false, tip: 'Корпоративный домен, разумный запрос, конкретный дедлайн. Нормальное IT-уведомление.' },
    { sender: 'invest@crypto-profit.io', subject: 'Ваш депозит вырос на 340%', text: 'Инвестируйте ещё 500 BYN и получите прибыль 15 000 BYN за неделю. Гарантия дохода!', phishing: true, tip: 'Обещание невозможной прибыли. Настоящие инвестиции никогда не гарантируют доход.' },
    { sender: 'hr@nasha-firma.by', subject: 'Заполните анкету ДМС', text: 'До 30 июня заполните данные для медицинской страховки. Ссылка: intranet.nasha-firma.by/dms', phishing: false, tip: 'Внутренний интранет-домен, разумный дедлайн, рабочий вопрос. Безопасно.' },
    { sender: 'support@amazon.com', subject: 'Заказ #4829104 shipped', text: 'Ваш заказ отправлен. Если вы не делали этот заказ — позвоните нам.', phishing: false, tip: 'Официальный домен Amazon. Не просит вводить данные, предлагает позвонить самому.' },
    { sender: 'admin@tax-service.by', subject: 'Задолженность по налогам 2 350 BYN', text: 'Оплатите задолженность в течение 48 часов иначе начисляются пени. Ссылка для оплаты.', phishing: true, tip: 'Госуслуги не отправляют платёжные ссылки по почте. Проверяйте в личном кабинете.' },
  ], []);

  const answer = (isPhishing) => {
    const correct = cases[current].phishing === isPhishing;
    if (correct) setScore(s => s + 1);
    setShowResult({ correct, tip: cases[current].tip });
    setTimeout(() => { setShowResult(null); if (current < cases.length - 1) setCurrent(c => c + 1); else setFinished(true); }, 2500);
  };

  if (finished) return (
    <div className="academy-exercise">
      <div className="academy-exercise-result">
        <div className="academy-exercise-score" style={{ color: score >= 5 ? '#00ff41' : '#f7b500' }}>{score}/{cases.length}</div>
        <div style={{ fontSize: '14px', color: '#fff', marginBottom: '8px' }}>{score === cases.length ? 'Все верно!' : 'Хороший результат'}</div>
        <div style={{ fontSize: '11px', color: '#888' }}>Запомни: срочность + страх + запрос данных = фишинг. Всегда перепроверяй по официальному каналу.</div>
        <button className="academy-complete-btn" style={{ marginTop: '16px' }} onClick={() => onLessonComplete && onLessonComplete(Math.round((score / cases.length) * 100))}>
          <CheckCircle size={16} /> ЗАВЕРШИТЬ УРОК
        </button>
      </div>
    </div>
  );

  const c = cases[current];
  return (
    <div className="academy-exercise">
      <div className="academy-exercise-desc">Случай {current + 1}/{cases.length} — фишинг?</div>
      <div className="academy-email-card">
        <div className="academy-email-from">От: <b>{c.sender}</b></div>
        <div className="academy-email-subject">{c.subject}</div>
        <div className="academy-email-text">{c.text}</div>
      </div>
      {showResult ? (
        <div className={`academy-verdict ${showResult.correct ? 'correct' : 'wrong'}`}>{showResult.correct ? 'Верно!' : 'Неправильно!'} — {showResult.tip}</div>
      ) : (
        <div className="academy-answer-btns">
          <button className="academy-btn-safe" onClick={() => answer(false)}>БЕЗОПАСНО</button>
          <button className="academy-btn-phish" onClick={() => answer(true)}>ФИШИНГ</button>
        </div>
      )}
    </div>
  );
}

function CipherEncode({ onLessonComplete }) {
  const [mode, setMode] = useState('decode');
  const [input, setInput] = useState('');
  const [shift, setShift] = useState(3);
  const [result, setResult] = useState('');
  const [quiz, setQuiz] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const encode = (text, s) => text.split('').map(c => c.match(/[A-Za-z]/) ? String.fromCharCode(((c.charCodeAt(0) - (c >= 'a' ? 97 : 65) + s + 26) % 26) + (c >= 'a' ? 97 : 65)) : c).join('');

  const process = () => {
    if (mode === 'decode') setResult(encode(input, -shift));
    else setResult(encode(input, shift));
  };

  const quizData = useMemo(() => [
    { q: '"KHOOR" при сдвиге -3 это...', a: 'HELLO', opts: ['HELLO', 'WORLD', 'CLASS'] },
    { q: 'Сдвиг 13 вперёд и 13 назад — это...', a: 'ROT13', opts: ['ROT13', 'AES', 'RSA'] },
    { q: 'Шифр Цезаря взламывается за...', a: 'Перебор 25 сдвигов', opts: ['Перебор 25 сдвигов', 'Миллиард лет', 'Невозможно'] },
  ], []);

  if (quizFinished) return (
    <div className="academy-exercise">
      <div className="academy-exercise-result">
        <div className="academy-exercise-score" style={{ color: '#4d94ff' }}>{quizScore}/{quizData.length}</div>
        <div style={{ fontSize: '14px', color: '#fff' }}>Шифр Цезаря прост для взлома. Современные шифры (AES-256) требуют миллиарды лет для перебора.</div>
        <button className="academy-complete-btn" style={{ marginTop: '16px' }} onClick={() => onLessonComplete && onLessonComplete(Math.round((quizScore / quizData.length) * 100))}>
          <CheckCircle size={16} /> ЗАВЕРШИТЬ УРОК
        </button>
      </div>
    </div>
  );

  if (mode === 'quiz' || mode === 'decode' || mode === 'encode') {
    if (mode !== 'quiz' && mode !== 'decode') {
      return (
        <div className="academy-exercise">
          <div className="academy-exercise-desc">Режим: {mode === 'encode' ? 'ШИФРОВАНИЕ' : 'ДЕШИФРОВКА'} | Сдвиг: {shift}</div>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Текст для шифрования...' : 'Зашифрованный текст...'} className="academy-exercise-input" style={{ marginBottom: '10px' }} />
          <input type="range" min="1" max="25" value={shift} onChange={e => setShift(parseInt(e.target.value))} className="academy-slider" />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="academy-action-btn" onClick={process}>ПРЕОБРАЗОВАТЬ</button>
            <button className="academy-nav-btn" onClick={() => setMode('quiz')}>К ВИКТОРИНЕ</button>
          </div>
          {result && <div className="academy-decoded" style={{ marginTop: '16px' }}>{result}</div>}
        </div>
      );
    }

    const q = quizData[quiz];
    return (
      <div className="academy-exercise">
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' }}>
          <button className={`academy-nav-btn ${mode === 'decode' ? 'primary' : ''}`} onClick={() => setMode('decode')}>Дешифровка</button>
          <button className={`academy-nav-btn ${mode === 'encode' ? 'primary' : ''}`} onClick={() => setMode('encode')}>Шифрование</button>
          <button className={`academy-nav-btn ${mode === 'quiz' ? 'primary' : ''}`} onClick={() => setMode('quiz')}>Викторина ({quiz + 1}/{quizData.length})</button>
        </div>
        {mode === 'quiz' && (
          <>
            <div className="academy-exercise-desc">{q.q}</div>
            <div className="academy-answer-btns" style={{ flexDirection: 'column', maxWidth: '400px', margin: '0 auto' }}>
              {q.opts.map((opt, i) => (
                <button key={i} className="academy-nav-btn" style={{ width: '100%', padding: '14px' }} onClick={() => {
                  if (opt === q.a) setQuizScore(s => s + 1);
                  if (quiz < quizData.length - 1) setQuiz(quiz + 1); else setQuizFinished(true);
                }}>{opt}</button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="academy-exercise">
      <div className="academy-exercise-desc">Выбери режим работы</div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="academy-action-btn" onClick={() => setMode('decode')}>ДЕШИФРОВКА</button>
        <button className="academy-action-btn" onClick={() => setMode('encode')}>ШИФРОВАНИЕ</button>
        <button className="academy-action-btn" onClick={() => setMode('quiz')}>ВИКТОРИНА</button>
      </div>
    </div>
  );
}

function SocialEngineering({ onLessonComplete }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [finished, setFinished] = useState(false);

  const scenarios = useMemo(() => [
    { messages: [{ from: 'Коллега', text: 'Привет! Я на больничном, скинь пожалуйста доступ к серверу, чтобы я мог закрыть тикет.', self: false }], threat: true, tip: 'Коллега не должен просить доступ по чату. Проверь по телефону. Это может быть подмена аккаунта.' },
    { messages: [{ from: 'IT-dept', text: 'Здравствуйте! Нужно обновить сертификат. Перейдите по ссылке и авторизуйтесь.', self: false }], threat: true, tip: 'IT не отправляет ссылки для авторизации. Настоящее IT сделает это через панель управления или удалённо.' },
    { messages: [{ from: 'Начальник', text: 'Привет! Я в командировке. Срочно нужно перевести 3 000 BYN поставщику. Реквизиты пришлю.', self: false }, { from: 'Вы', text: 'Хорошо, жду реквизиты.', self: true }], threat: true, tip: 'CEO-fraud! Даже если "начальник" — перезвони по официальному номеру. Поддельные email от руководителей — самая частая атака.' },
    { messages: [{ from: 'HR', text: 'Добрый день! Заполните, пожалуйста, форму для обновления личных данных в системе.', self: false }], threat: false, tip: 'Обычный рабочий запрос от HR. Если ссылка ведёт на корпоративный домен — это нормально.' },
    { messages: [{ from: 'Банк', text: 'Ваш карта заблокирована. Для разблокировки позвоните по номеру 8-800-XXX-XX-XX', self: false }], threat: true, tip: 'Банк не блокирует карты SMS. Настоящий номер банка — на обратной стороне карты или на официальном сайте.' },
  ], []);

  const answer = (isThreat) => {
    const correct = scenarios[current].threat === isThreat;
    if (correct) setScore(s => s + 1);
    setShowResult({ correct, tip: scenarios[current].tip });
    setTimeout(() => { setShowResult(null); if (current < scenarios.length - 1) setCurrent(c => c + 1); else setFinished(true); }, 2500);
  };

  if (finished) return (
    <div className="academy-exercise">
      <div className="academy-exercise-result">
        <div className="academy-exercise-score" style={{ color: score >= 4 ? '#00ff41' : '#f7b500' }}>{score}/{scenarios.length}</div>
        <div style={{ fontSize: '14px', color: '#fff' }}>{score === scenarios.length ? 'Безупречно!' : 'Хорошая проницательность'}</div>
        <div style={{ fontSize: '11px', color: '#888' }}>Главное правило: перепроверяй любые просьбы о доступе, деньгах или данных по неофициальным каналам.</div>
        <button className="academy-complete-btn" style={{ marginTop: '16px' }} onClick={() => onLessonComplete && onLessonComplete(Math.round((score / scenarios.length) * 100))}>
          <CheckCircle size={16} /> ЗАВЕРШИТЬ УРОК
        </button>
      </div>
    </div>
  );

  const s = scenarios[current];
  return (
    <div className="academy-exercise">
      <div className="academy-exercise-desc">Сценарий {current + 1}/{scenarios.length} — есть угроза?</div>
      <div className="academy-chat-card">
        {s.messages.map((m, i) => (
          <div key={i} className={`academy-chat-msg ${m.self ? 'self' : ''}`}>
            <div className="academy-chat-from">{m.from}</div>
            <div className="academy-chat-text">{m.text}</div>
          </div>
        ))}
      </div>
      {showResult ? (
        <div className={`academy-verdict ${showResult.correct ? 'correct' : 'wrong'}`}>{showResult.correct ? 'Верно!' : 'Неправильно!'} — {showResult.tip}</div>
      ) : (
        <div className="academy-answer-btns">
          <button className="academy-btn-safe" onClick={() => answer(false)}>НОРМАЛЬНО</button>
          <button className="academy-btn-phish" onClick={() => answer(true)}>УГРОЗА</button>
        </div>
      )}
    </div>
  );
}

function PortQuiz({ onLessonComplete }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => [
    { q: 'Какой порт используется для HTTPS?', a: '443', opts: ['80', '443', '22', '21'] },
    { q: 'Для чего порт 22 (SSH)?', a: 'Удалённое управление сервером', opts: ['Веб-сайты', 'Удалённое управление сервером', 'Передача файлов', 'Электронная почта'] },
    { q: 'Какой протокол защищает данные в интернете?', a: 'HTTPS (TLS/SSL)', opts: ['HTTP', 'FTP', 'HTTPS (TLS/SSL)', 'SMTP'] },
    { q: 'Что такое DNS?', a: 'Система перевода имён в IP-адреса', opts: ['Протокол передачи файлов', 'Система перевода имён в IP-адреса', 'Брандмауэр', 'Шифрование'] },
    { q: 'Какой порт использует FTP?', a: '21', opts: ['80', '443', '21', '22'] },
    { q: 'WPA3 — это...', a: 'Стандарт шифрования Wi-Fi', opts: ['Антивирус', 'Стандарт шифрования Wi-Fi', 'Браузер', 'Операционная система'] },
  ], []);

  const answer = (isCorrect) => {
    if (isCorrect) setScore(s => s + 1);
    setShowResult({ correct: isCorrect });
    setTimeout(() => { setShowResult(null); if (current < questions.length - 1) setCurrent(c => c + 1); else setFinished(true); }, 1500);
  };

  if (finished) return (
    <div className="academy-exercise">
      <div className="academy-exercise-result">
        <div className="academy-exercise-score" style={{ color: score >= 4 ? '#00ff41' : '#f7b500' }}>{score}/{questions.length}</div>
        <div style={{ fontSize: '14px', color: '#fff' }}>{score === questions.length ? 'Отлично!' : 'Хорошо, но есть что подучить'}</div>
        <button className="academy-complete-btn" style={{ marginTop: '16px' }} onClick={() => onLessonComplete && onLessonComplete(Math.round((score / questions.length) * 100))}>
          <CheckCircle size={16} /> ЗАВЕРШИТЬ УРОК
        </button>
      </div>
    </div>
  );

  const q = questions[current];
  return (
    <div className="academy-exercise">
      <div className="academy-exercise-desc">Вопрос {current + 1}/{questions.length}</div>
      <div style={{ fontSize: '16px', color: '#fff', marginBottom: '20px' }}>{q.q}</div>
      <div className="academy-answer-btns" style={{ flexDirection: 'column', maxWidth: '500px', margin: '0 auto' }}>
        {q.opts.map((opt, i) => (
          <button key={i} className="academy-nav-btn" style={{ width: '100%', padding: '14px', textAlign: 'left' }}
            onClick={() => answer(opt === q.a)}>{opt}</button>
        ))}
      </div>
      {showResult && <div className={`academy-verdict ${showResult.correct ? 'correct' : 'wrong'}`} style={{ marginTop: '16px' }}>{showResult.correct ? 'Верно!' : `Правильный ответ: ${q.opts.find((_, i) => q.opts[i] === q.a)}`}</div>}
    </div>
  );
}

function MetadataHunt({ onLessonComplete }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [finished, setFinished] = useState(false);

  const files = useMemo(() => [
    { name: 'photo_2024.jpg', meta: 'GPS: 53.9°N, 27.5°E | Камера: iPhone 15 | Дата: 15.03.2024', question: 'Что раскрывают метаданные?', a: 'Местоположение съёмки', opts: ['Местоположение съёмки', 'Имя автора', 'Пароль'] },
    { name: 'report_final.docx', meta: 'Автор: Иван Петров | Создан: 01.06.2024 | Последний редактор: admin', question: 'Кто последний редактировал файл?', a: 'admin', opts: ['Иван Петров', 'admin', 'Неизвестно'] },
    { name: 'secret.pdf', meta: 'PDF версия: 1.7 | Создатель: Adobe Acrobat | Зашифрован: Да', question: 'Можно ли прочитать этот PDF?', a: 'Нет, он зашифрован', opts: ['Да, всегда можно', 'Нет, он зашифрован', 'Только на Windows'] },
  ], []);

  const answer = (idx) => {
    const correct = idx === files[current].opts.indexOf(files[current].a);
    if (correct) setScore(s => s + 1);
    setShowResult({ correct, answer: files[current].a });
    setTimeout(() => { setShowResult(null); if (current < files.length - 1) setCurrent(c => c + 1); else setFinished(true); }, 2000);
  };

  if (finished) return (
    <div className="academy-exercise">
      <div className="academy-exercise-result">
        <div className="academy-exercise-score" style={{ color: '#4d94ff' }}>{score}/{files.length}</div>
        <div style={{ fontSize: '14px', color: '#fff' }}>Метаданные — мощный инструмент forensic-специалиста. Они раскрывают историю файла.</div>
        <button className="academy-complete-btn" style={{ marginTop: '16px' }} onClick={() => onLessonComplete && onLessonComplete(Math.round((score / files.length) * 100))}>
          <CheckCircle size={16} /> ЗАВЕРШИТЬ УРОК
        </button>
      </div>
    </div>
  );

  const f = files[current];
  return (
    <div className="academy-exercise">
      <div className="academy-exercise-desc">Файл {current + 1}/{files.length}: <b>{f.name}</b></div>
      <div className="academy-email-card">
        <div className="academy-email-from">Метаданные:</div>
        <div className="academy-email-text" style={{ fontFamily: 'monospace', color: '#4d94ff' }}>{f.meta}</div>
      </div>
      <div style={{ fontSize: '14px', color: '#fff', marginBottom: '16px' }}>{f.question}</div>
      {showResult ? (
        <div className={`academy-verdict ${showResult.correct ? 'correct' : 'wrong'}`}>{showResult.correct ? 'Верно!' : `Правильно: ${showResult.answer}`}</div>
      ) : (
        <div className="academy-answer-btns" style={{ flexDirection: 'column', maxWidth: '500px', margin: '0 auto' }}>
          {f.opts.map((opt, i) => (
            <button key={i} className="academy-nav-btn" style={{ width: '100%', padding: '14px', textAlign: 'left' }} onClick={() => answer(i)}>{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function SqlPractice({ onLessonComplete }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [finished, setFinished] = useState(false);

  const tasks = useMemo(() => [
    { q: 'Как получить всех пользователей из таблицы users?', a: 'SELECT * FROM users', opts: ['GET ALL FROM users', 'SELECT * FROM users', 'SELECT users'] },
    { q: 'Как выбрать только имя и возраст пользователей старше 18?', a: 'SELECT name, age FROM users WHERE age > 18', opts: ['SELECT name, age FROM users', 'SELECT name, age FROM users WHERE age > 18', 'SELECT * FROM users WHERE age > 18'] },
    { q: 'Как безопасно вставлять данные в SQL (без инъекции)?', a: 'Prepared Statements', opts: ['Конкатенация строк', 'Prepared Statements', 'eval()'] },
    { q: 'Что делает DROP TABLE?', a: 'Удаляет таблицу полностью', opts: ['Удаляет записи', 'Удаляет таблицу полностью', 'Очищает таблицу'] },
    { q: 'Как ограничить вывод 10 записями?', a: 'LIMIT 10', opts: ['TOP 10', 'LIMIT 10', 'MAX 10'] },
  ], []);

  const answer = (idx) => {
    const correct = idx === tasks[current].opts.indexOf(tasks[current].a);
    if (correct) setScore(s => s + 1);
    setShowResult({ correct });
    setTimeout(() => { setShowResult(null); if (current < tasks.length - 1) setCurrent(c => c + 1); else setFinished(true); }, 1500);
  };

  if (finished) return (
    <div className="academy-exercise">
      <div className="academy-exercise-result">
        <div className="academy-exercise-score" style={{ color: score >= 4 ? '#f7b500' : '#ff4d4d' }}>{score}/{tasks.length}</div>
        <div style={{ fontSize: '14px', color: '#fff' }}>{score === tasks.length ? 'SQL-мастер!' : 'Повтори основы SQL'}</div>
        <button className="academy-complete-btn" style={{ marginTop: '16px' }} onClick={() => onLessonComplete && onLessonComplete(Math.round((score / tasks.length) * 100))}>
          <CheckCircle size={16} /> ЗАВЕРШИТЬ УРОК
        </button>
      </div>
    </div>
  );

  return (
    <div className="academy-exercise">
      <div className="academy-exercise-desc">Вопрос {current + 1}/{tasks.length}</div>
      <div style={{ fontSize: '14px', color: '#fff', marginBottom: '16px' }}>{tasks[current].q}</div>
      <div className="academy-answer-btns" style={{ flexDirection: 'column', maxWidth: '600px', margin: '0 auto' }}>
        {tasks[current].opts.map((opt, i) => (
          <button key={i} className="academy-nav-btn" style={{ width: '100%', padding: '14px', textAlign: 'left', fontFamily: 'monospace', fontSize: '12px' }} onClick={() => answer(i)}>{opt}</button>
        ))}
      </div>
      {showResult && <div className={`academy-verdict ${showResult.correct ? 'correct' : 'wrong'}`} style={{ marginTop: '16px' }}>{showResult.correct ? 'Верно!' : `Правильно: ${tasks[current].a}`}</div>}
    </div>
  );
}

function MalwareIdentify({ onLessonComplete }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [finished, setFinished] = useState(false);

  const samples = useMemo(() => [
    { desc: 'Программа маскируется под антивирус, но на самом деле крадёт пароли', a: 'Троян', opts: ['Вирус', 'Троян', 'Червь'] },
    { desc: 'Шифрует все файлы на компьютере и требует биткоины за ключ', a: 'Рансомвер', opts: ['Рансомвер', 'Кейлогер', 'Руткит'] },
    { desc: 'Записывает каждое нажатие клавиш и отправляет хакеру', a: 'Кейлогер', opts: ['Кейлогер', 'Спайуэр', 'Ботнет'] },
    { desc: 'Самораспространяется по сети, заражая компьютеры без участия человека', a: 'Червь', opts: ['Вирус', 'Червь', 'Троян'] },
    { desc: 'Скрывается в системе и перехватывает управление ОС', a: 'Руткит', opts: ['Руткит', 'Адвар', 'Спайуэр'] },
  ], []);

  const answer = (idx) => {
    const correct = idx === samples[current].opts.indexOf(samples[current].a);
    if (correct) setScore(s => s + 1);
    setShowResult({ correct });
    setTimeout(() => { setShowResult(null); if (current < samples.length - 1) setCurrent(c => c + 1); else setFinished(true); }, 1500);
  };

  if (finished) return (
    <div className="academy-exercise">
      <div className="academy-exercise-result">
        <div className="academy-exercise-score" style={{ color: score >= 4 ? '#ff4d4d' : '#f7b500' }}>{score}/{samples.length}</div>
        <div style={{ fontSize: '14px', color: '#fff' }}>{score === samples.length ? 'Эксперт по малварю!' : 'Изучи типы вредоносного ПО'}</div>
        <button className="academy-complete-btn" style={{ marginTop: '16px' }} onClick={() => onLessonComplete && onLessonComplete(Math.round((score / samples.length) * 100))}>
          <CheckCircle size={16} /> ЗАВЕРШИТЬ УРОК
        </button>
      </div>
    </div>
  );

  return (
    <div className="academy-exercise">
      <div className="academy-exercise-desc">Описание {current + 1}/{samples.length} — какой тип?</div>
      <div className="academy-email-card">
        <div className="academy-email-text">{samples[current].desc}</div>
      </div>
      {showResult ? (
        <div className={`academy-verdict ${showResult.correct ? 'correct' : 'wrong'}`}>{showResult.correct ? 'Верно!' : `Правильно: ${samples[current].a}`}</div>
      ) : (
        <div className="academy-answer-btns" style={{ flexDirection: 'column', maxWidth: '400px', margin: '0 auto' }}>
          {samples[current].opts.map((opt, i) => (
            <button key={i} className="academy-nav-btn" style={{ width: '100%', padding: '14px' }} onClick={() => answer(i)}>{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function WifiSecurity({ onLessonComplete }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(null);
  const [finished, setFinished] = useState(false);

  const networks = useMemo(() => [
    { name: 'Free_WiFi', security: 'Нет', desc: 'Открытая сеть в кафе', safe: false, tip: 'Открытые сети — Evil Twin. Хакер может перехватить данные.' },
    { name: 'Starbucks_Guest', security: 'WPA2', desc: 'Гостевая сеть Starbucks', safe: true, tip: 'WPA2-зашифрованная сеть. Относительно безопасно.' },
    { name: 'TP-LINK_A4F2', security: 'WPA3', desc: 'Домашний роутер', safe: true, tip: 'WPA3 — лучший стандарт. Безопасно при сильном пароле.' },
    { name: 'Airport_Free', security: 'Нет', desc: 'Бесплатный Wi-Fi в аэропорту', safe: false, tip: 'Публичный Wi-Fi в аэропорту — опасно. Используй VPN!' },
    { name: 'Mobile_Hotspot', security: 'WPA3', desc: 'Личная точка доступа', safe: true, tip: 'Личный hotspot — безопасный вариант.' },
    { name: 'Admin_Free', security: 'Нет', desc: 'Сеть "Admin" без пароля', safe: false, tip: 'Подозрительная сеть без пароля — возможная ловушка.' },
  ], []);

  const answer = (isSafe) => {
    const correct = networks[current].safe === isSafe;
    if (correct) setScore(s => s + 1);
    setShowResult({ correct, tip: networks[current].tip });
    setTimeout(() => { setShowResult(null); if (current < networks.length - 1) setCurrent(c => c + 1); else setFinished(true); }, 2000);
  };

  if (finished) return (
    <div className="academy-exercise">
      <div className="academy-exercise-result">
        <div className="academy-exercise-score" style={{ color: score >= 5 ? '#00ff41' : '#f7b500' }}>{score}/{networks.length}</div>
        <div style={{ fontSize: '14px', color: '#fff' }}>{score === networks.length ? 'Эксперт по Wi-Fi!' : 'Хорошо, но будь внимательнее'}</div>
        <button className="academy-complete-btn" style={{ marginTop: '16px' }} onClick={() => onLessonComplete && onLessonComplete(Math.round((score / networks.length) * 100))}>
          <CheckCircle size={16} /> ЗАВЕРШИТЬ УРОК
        </button>
      </div>
    </div>
  );

  const n = networks[current];
  return (
    <div className="academy-exercise">
      <div className="academy-exercise-desc">Сеть {current + 1}/{networks.length}</div>
      <div className="academy-email-card">
        <div className="academy-email-subject" style={{ fontSize: '18px' }}>Wi-Fi: {n.name}</div>
        <div className="academy-email-from">Защита: <b>{n.security || 'Нет'}</b></div>
        <div className="academy-email-text">{n.desc}</div>
      </div>
      {showResult ? (
        <div className={`academy-verdict ${showResult.correct ? 'correct' : 'wrong'}`}>{showResult.correct ? 'Верно!' : 'Неправильно!'} — {showResult.tip}</div>
      ) : (
        <div className="academy-answer-btns">
          <button className="academy-btn-safe" onClick={() => answer(true)}>БЕЗОПАСНА</button>
          <button className="academy-btn-phish" onClick={() => answer(false)}>ОПАСНА</button>
        </div>
      )}
    </div>
  );
}

const EXERCISES = {
  password_strength: PasswordStrength, phishing_advanced: PhishingAdvanced, cipher_encode: CipherEncode,
  social_engineering: SocialEngineering, port_quiz: PortQuiz, metadata_hunt: MetadataHunt,
  sql_practice: SqlPractice, malware_identify: MalwareIdentify, wifi_security: WifiSecurity
};

export default function Academy({ username }) {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [view, setView] = useState('menu');
  const [theoryIndex, setTheoryIndex] = useState(0);
  const [completions, setCompletions] = useState({});
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    if (!username) return;
    const load = async () => {
      const { data } = await supabase
        .from('academy_completions')
        .select('lesson_id, score')
        .eq('username', username);
      if (data) {
        const map = {};
        data.forEach(c => { map[c.lesson_id] = c.score; });
        setCompletions(map);
      }
    };
    load();
  }, [username]);

  const handleLessonComplete = async (lessonId, score) => {
    const prev = completions[lessonId] || 0;
    const newScore = Math.max(prev, score);
    setCompletions(prev => ({ ...prev, [lessonId]: newScore }));

    try {
      await supabase.from('academy_completions').upsert({
        username,
        lesson_id: lessonId,
        score: newScore
      }, { onConflict: 'username,lesson_id' });
    } catch (e) {
      console.error('Failed to save completion:', e);
    }

    setShowCompleted(true);
    setTimeout(() => {
      setShowCompleted(false);
      setSelectedLesson(null);
      setView('menu');
    }, 2000);
  };

  const openLesson = (id) => {
    setSelectedLesson(id);
    setView('theory');
    setTheoryIndex(0);
  };

  if (selectedLesson) {
    const lesson = LESSONS.find(l => l.id === selectedLesson);
    const ExerciseComponent = EXERCISES[lesson.exercise.type];

    if (view === 'theory') {
      const section = lesson.theory[theoryIndex];
      return (
        <div className="academy-exercise-screen window animate-fade">
          <div className="academy-exercise-header">
            <button className="academy-back" onClick={() => { setSelectedLesson(null); setView('menu'); }}><ArrowLeft size={16} /> НАЗАД</button>
            <div className="academy-exercise-title" style={{ color: lesson.color }}>{lesson.icon} {lesson.title}</div>
            <span style={{ fontSize: '11px', color: '#888' }}>{theoryIndex + 1}/{lesson.theory.length}</span>
          </div>
          <div className="academy-theory-section">
            <div className="academy-theory-title" style={{ color: lesson.color }}>{section.title}</div>
            <div className="academy-theory-text">
              {section.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
          </div>
          <div className="academy-lesson-nav">
            <div />
            <div className="academy-nav-btns">
              {theoryIndex > 0 && <button className="academy-nav-btn" onClick={() => setTheoryIndex(theoryIndex - 1)}>Назад</button>}
              {theoryIndex < lesson.theory.length - 1 ? (
                <button className="academy-nav-btn primary" onClick={() => setTheoryIndex(theoryIndex + 1)}>Далее</button>
              ) : (
                <button className="academy-nav-btn primary" onClick={() => setView('practice')}>Перейти к практике</button>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (view === 'practice') {
      return (
        <div className="academy-exercise-screen window animate-fade">
          <div className="academy-exercise-header">
            <button className="academy-back" onClick={() => setView('theory')}><ArrowLeft size={16} /> К ТЕОРИИ</button>
            <div className="academy-exercise-title" style={{ color: lesson.color }}>Практика</div>
          </div>
          <ExerciseComponent onLessonComplete={(score) => handleLessonComplete(selectedLesson, score)} />
        </div>
      );
    }
  }

  return (
    <>
      <AnimatePresence>
        {showCompleted && (
          <motion.div
            className="academy-completed-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Trophy size={16} color="#00ff41" />
            <span>УРОК ЗАВЕРШЁН!</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="academy-grid">
        {LESSONS.map(l => {
          const score = completions[l.id];
          const done = score !== undefined;
          return (
            <motion.div key={l.id} className={`academy-card ${done ? 'academy-card-done' : ''}`} whileHover={{ y: -4 }} onClick={() => openLesson(l.id)}>
              <div className="academy-card-icon" style={{ borderColor: l.color, color: l.color }}>{l.icon}</div>
              <div className="academy-card-content">
                <div className="academy-card-title">{l.title}</div>
                <div className="academy-card-desc">{l.theory.length} разделов теории + практика</div>
                {done && <div className="academy-card-score" style={{ color: l.color }}>Лучший результат: {score}%</div>}
              </div>
              {done ? <CheckCircle size={18} color={l.color} /> : <ChevronRight size={16} color="#444" />}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
