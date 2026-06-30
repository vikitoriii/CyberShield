import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldAlert, AlertTriangle, MessageSquare, Info, ChevronRight, CheckCircle2, Search, Award, ShieldCheck, HelpCircle } from 'lucide-react';

const SocialMission = ({ username, currentPoints, onComplete }) => {
    const [step, setStep] = useState(0); // 0: Intro, 1: Cases, 2: Victory
    const [currentCase, setCurrentCase] = useState(0);
    const [analyzedIds, setAnalyzedIds] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [totalXp, setTotalXp] = useState(0);
    const [showHint, setShowHint] = useState(false);

    const CASES = [
        {
            title: "КЕЙС #101: ТЕХПОДДЕРЖКА В ПАНИКЕ",
            difficulty: "НИЗКИЙ",
            description: "Классическая атака через страх и спешку. Хакер имитирует системного администратора в критической ситуации.",
            threatsCount: 3,
            logs: [
                { id: "1-1", sender: "SYS_ADMIN_ROBOT", text: "Здравствуйте! Это дежурный техник. В системе зафиксирована утечка ваших данных в реальном времени! Мы видим, как файлы копируются на внешний сервер из-под вашей учетки прямо сейчас!", type: "THREAT", tactic: "СТРАХ И ШОК", reason: "Сообщение начинается с шокирующего заявления, чтобы парализовать логическое мышление сотрудника." },
                { id: "1-2", sender: "ИВАН (БУХГАЛТЕРИЯ)", text: "О боже! Но я просто открыл таблицу с отчетами. Что мне делать? Закрыть всё?", type: "SAFE" },
                { id: "1-3", sender: "SYS_ADMIN_ROBOT", text: "НЕТ! Ничего не нажимайте! Если закроете — данные заблокируются навсегда. Мне нужно, чтобы вы ПРЯМО СЕЙЧАС продиктовали код из SMS, который вам придет. БЫСТРЕЕ, у нас осталось 30 секунд!", type: "THREAT", tactic: "ЛОЖНАЯ СРОЧНОСТЬ", reason: "Установка жесткого лимита времени (30 секунд) заставляет жертву совершать ошибки и игнорировать правила безопасности." },
                { id: "1-4", sender: "ИВАН (БУХГАЛТЕРИЯ)", text: "Код пришел... Но нам на обучении говорили никогда не давать коды по телефону или в чате.", type: "SAFE" },
                { id: "1-5", sender: "SYS_ADMIN_ROBOT", text: "Послушайте, Иван, мне некогда вас уговаривать! Я пишу докладную записку в СБ. Либо вы даете код, либо завтра вы ищете новую работу за разглашение коммерческой тайны. Решайте!", type: "THREAT", tactic: "УГРОЗА КАРЬЕРЕ", reason: "Прямая угроза увольнением — мощнейший рычаг давления в социальной инженерии. Это типичный признак злоумышленника." }
            ]
        },
        {
            title: "КЕЙС #202: КОРПОРАТИВНЫЙ БОНУС",
            difficulty: "СРЕДНИЙ",
            description: "Атака через доверие и жадность. Хакер притворяется новым сотрудником HR-отдела.",
            threatsCount: 3,
            logs: [
                { id: "2-1", sender: "ЕЛЕНА (HR_ASSISTANT)", text: "Привет! Я Лена, новенькая в отделе кадров. Поздравляю, ты попал в список на годовую премию! 🥳", type: "SAFE" },
                { id: "2-2", sender: "АЛЕКСЕЙ (РАЗРАБОТКА)", text: "О, круто! Спасибо за новости. А я думал, списки будут только в следующем месяце.", type: "SAFE" },
                { id: "2-3", sender: "ЕЛЕНА (HR_ASSISTANT)", text: "Ну, мы решили сделать сюрприз. Слушай, я еще не во всем разобралась в системе. Можешь помочь коллеге? Мне нужно подтвердить твой отдел. Скинь мне скриншот твоего внутреннего рабочего стола со всеми открытыми вкладками.", type: "THREAT", tactic: "СБОР ДАННЫХ (RECON)", reason: "Просьба прислать скриншот рабочего стола — это сбор информации об используемом софте и открытых портах. Очень опасно." },
                { id: "2-4", sender: "АЛЕКСЕЙ (РАЗРАБОТКА)", text: "Да, секунду. А зачем скриншот? У тебя же есть доступ к базе.", type: "SAFE" },
                { id: "2-5", sender: "ЕЛЕНА (HR_ASSISTANT)", text: "База глючит сегодня! Кстати, чтобы премия пришла быстрее, пройди по ссылке и заполни анкету 'Мои достижения': http://hr-portal-neocorp.online/rewards. Только делай это с рабочего ПК, там авторизация через домен.", type: "THREAT", tactic: "ФИШИНГОВАЯ ССЫЛКА", reason: "Домен .online вместо официального корпоративного. Призыв делать это с рабочего ПК нужен для перехвата токена Windows-авторизации." },
                { id: "2-6", sender: "ЕЛЕНА (HR_ASSISTANT)", text: "И еще маленькая просьба — не говори пока никому в отделе, списки еще не утверждены до конца, не хочу чтобы другие расстроились раньше времени. Окей? 😉", type: "THREAT", tactic: "ИЗОЛЯЦИЯ ЖЕРТВЫ", reason: "Хакер просит хранить секрет, чтобы жертва не посоветовалась с коллегами или ИТ-отделом, которые сразу заметят подвох." }
            ]
        },
        {
            title: "КЕЙС #303: ТЕНЬ В СЕТИ",
            difficulty: "ВЫСОКИЙ",
            description: "Самый сложный случай. Профессиональная разведка под видом технического аудита. Минимум эмоций, максимум деталей.",
            threatsCount: 4,
            logs: [
                { id: "3-1", sender: "IT_AUDIT_SERVICE", text: "В рамках планового обновления сетевой инфраструктуры требуется верификация конфигураций конечных точек в секторе B-12.", type: "SAFE" },
                { id: "3-2", sender: "ВИКТОР (IT_LEAD)", text: "Принято. Какие именно параметры вас интересуют? У нас всё по регламенту.", type: "SAFE" },
                { id: "3-3", sender: "IT_AUDIT_SERVICE", text: "Нам нужны версии установленных драйверов для сетевых карт и текущий аптайм сервера. Также подтвердите, установлен ли у вас патч безопасности KB5004945.", type: "THREAT", tactic: "ТЕХНИЧЕСКАЯ РАЗВЕДКА", reason: "Запрос конкретной версии патча помогает хакеру понять, какие уязвимости (CVE) всё еще открыты на вашем компьютере." },
                { id: "3-4", sender: "IT_AUDIT_SERVICE", text: "Для ускорения процесса мы создали временный сетевой диск для выгрузки ваших логов. Подключите его командой: net use Z: \\\\10.22.4.15\\audit /user:guest", type: "THREAT", tactic: "ВНЕДРЕНИЕ (SMB)", reason: "Попытка заставить администратора подключить сторонний сетевой ресурс. Это может привести к краже NTLM-хэшей пароля." },
                { id: "3-5", sender: "ВИКТОР (IT_LEAD)", text: "Странно, IP адрес ресурса не из нашей подсети. Кто инициировал запрос?", type: "SAFE" },
                { id: "3-6", sender: "IT_AUDIT_SERVICE", text: "Запрос инициирован отделом Глобальной Безопасности. Ваша задержка мешает графику развертывания критических обновлений всей компании.", type: "THREAT", tactic: "АПЕЛЛЯЦИЯ К АВТОРИТЕТУ", reason: "Ссылка на 'Глобальную Безопасность' нужна, чтобы подавить сомнения эксперта и заставить его подчиниться 'высшему руководству'." },
                { id: "3-7", sender: "IT_AUDIT_SERVICE", text: "Просто скопируйте файл конфигурации 'config.xml' из корневой папки системы в указанную папку. Мы сами всё проверим. Это займет меньше минуты.", type: "THREAT", tactic: "КРАЖА КОНФИГУРАЦИИ", reason: "Файлы config.xml часто содержат пароли от баз данных или секретные ключи API в открытом виде." }
            ]
        }
    ];

    const handleSelect = (msg) => {
        if (analyzedIds.includes(msg.id)) return;
        if (msg.type === "THREAT") {
            setFeedback({ isCorrect: true, tactic: msg.tactic, text: msg.reason });
            setTotalXp(v => v + 500);
        } else {
            setFeedback({ isCorrect: false, tactic: "ОШИБКА АНАЛИЗА", text: "Это сообщение выглядит как обычный рабочий диалог. Хакеры часто используют 'белый шум', чтобы усыпить бдительность. Ищите скрытый умысел в других фразах." });
        }
        setAnalyzedIds([...analyzedIds, msg.id]);
    };

    const nextCase = () => {
        if (currentCase < CASES.length - 1) {
            setCurrentCase(v => v + 1);
            setAnalyzedIds([]);
            setFeedback(null);
        } else {
            setStep(2); // Переход к экрану победы
        }
    };

    const threatsFoundInCurrentCase = analyzedIds.filter(id => 
        CASES[currentCase].logs.find(l => l.id === id && l.type === "THREAT")
    ).length;

    // 1. ПРИВЕТСТВИЕ
    if (step === 0) return (
        <div className="window animate-fade mission-intro" style={{ textAlign: 'center', padding: '40px 16px', background: 'radial-gradient(circle, #0a1a0a 0%, #050505 100%)' }}>
            <div className="mission-intro-icon"><MessageSquare size={72} color="#00ff41" /></div>
            <h1 className="glitch-text" style={{ color: '#00ff41', marginTop: '20px' }}>ПСИХОЛОГИЧЕСКИЙ АНАЛИЗ</h1>
            <div style={{ maxWidth: '700px', margin: '30px auto', textAlign: 'left' }}>
                <div style={{ background: '#000', border: '1px solid #222', padding: '20px', marginBottom: '20px' }}>
                    <div style={{ color: '#f7b500', fontSize: '11px', letterSpacing: '2px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={14} /> МИССИЯ 5
                    </div>
                    <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                        Агент, хакеры редко ломают систему «в лоб». Им проще обмануть человека. 
                        Из предыдущих миссий известно, что <b style={{ color: '#ff4d4d' }}>Shadow_Walker</b> работает 
                        при поддержке <b style={{ color: '#ff4d4d' }}>внутреннего агента</b>. 
                        Ваша задача — изучить архивы переписки сотрудников Neocorp и выявить <b style={{ color: '#ff4d4d' }}>скрытые манипуляции</b>.
                    </p>
                </div>
                <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
                    Внимательно читайте каждое слово. Хакер может быть вежливым, официальным или агрессивным. 
                    Используйте <b style={{ color: '#f7b500' }}>подсказки</b> для анализа тактик.
                </p>
            </div>
            <button className="btn-main" onClick={() => setStep(1)}>НАЧАТЬ ЭКСПЕРТИЗУ</button>
        </div>
    );

    // 2. ЭКРАН ПОБЕДЫ
    if (step === 2) return (
        <div className="window animate-fade mission-win">
            <div className="mission-win-icon">
                <Award size={72} color="#00ff41" />
            </div>
            <h1 className="glitch-text mission-win-title" style={{ color: '#00ff41' }}>АТТЕСТАЦИЯ ПРОЙДЕНА</h1>
            <div className="mission-stats">
                <div className="mission-stat">
                    <div className="mission-stat-label">СТАТУС</div>
                    <div className="mission-stat-value" style={{ color: '#00ff41', fontSize: '14px' }}>ЭКСПЕРТ</div>
                </div>
                <div className="mission-stat">
                    <div className="mission-stat-label">ОЧКИ</div>
                    <div className="mission-stat-value" style={{ color: '#f7b500' }}>+{totalXp}</div>
                </div>
                <div className="mission-stat">
                    <div className="mission-stat-label">РЕЗУЛЬТАТ</div>
                    <div className="mission-stat-value" style={{ color: '#00ff41', fontSize: '14px' }}>ПРОЙДЕНО</div>
                </div>
            </div>
            <div className="mission-clue">
                <div className="mission-clue-label" style={{ color: '#00ff41' }}>УЛИКА #5</div>
                <p className="mission-clue-text">
                    Иван из бухгалтерии признался: ему позвонили и представились вами. 
                    Сказали, что у вас ЧП. Хакер работает <b style={{ color: '#ff4d4d' }}>внутри офиса</b>!
                </p>
            </div>
            <button className="btn-huge" onClick={() => onComplete(currentPoints + totalXp)}>ЗАВЕРШИТЬ МИССИЮ</button>
        </div>
    );

    // 3. ГЕЙМПЛЕЙ
    return (
        <div className="social-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '16px', height: '100%', padding: '10px' }}>
            
            {/* ЧАТ */}
            <div className="window" style={{ display: 'flex', flexDirection: 'column', background: '#050505', border: '1px solid #222' }}>
                <div className="panel-header" style={{ padding: '15px', background: '#0a0a0a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={16} color="#00ff41" />
                        <span style={{ fontWeight: 'bold' }}>{CASES[currentCase].title}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#f7b500' }}>СЛОЖНОСТЬ: {CASES[currentCase].difficulty}</div>
                </div>

                <div style={{ flex: 1, padding: '25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {CASES[currentCase].logs.map((msg) => {
                        const isUser = msg.sender.includes('ИВАН') || msg.sender.includes('АЛЕКСЕЙ') || msg.sender.includes('ВИКТОР');
                        return (
                            <motion.div 
                                key={msg.id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => handleSelect(msg)}
                                style={{
                                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    padding: '20px',
                                    background: isUser ? '#111' : '#0a0a0a',
                                    border: analyzedIds.includes(msg.id) ? `2px solid ${msg.type === 'THREAT' ? '#00ff41' : '#ff4d4d'}` : '1px solid #1a1a1a',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    position: 'relative',
                                    boxShadow: analyzedIds.includes(msg.id) && msg.type === 'THREAT' ? '0 0 15px rgba(0,255,65,0.2)' : 'none'
                                }}
                            >
                                <div style={{ fontSize: '11px', color: isUser ? '#4d94ff' : '#00ff41', marginBottom: '8px', fontWeight: 'bold', letterSpacing: '1px' }}>
                                    {msg.sender}
                                </div>
                                <div style={{ fontSize: '14px', color: '#eee', lineHeight: '1.6' }}>{msg.text}</div>
                                {analyzedIds.includes(msg.id) && msg.type === 'THREAT' && (
                                    <ShieldCheck size={20} color="#00ff41" style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#000', borderRadius: '50%' }} />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* ПАНЕЛЬ АНАЛИЗА */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="window" style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column' }}>
                    <div className="panel-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={16} /> АНАЛИЗАТОР ПОВЕДЕНИЯ</div>
                        <button onClick={() => setShowHint(!showHint)} style={{ background: 'none', border: 'none', color: showHint ? '#f7b500' : '#444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', letterSpacing: '1px' }}>
                            <HelpCircle size={14} /> ПОДСКАЗКА
                        </button>
                    </div>

                    {showHint && (
                        <div style={{ background: '#000', border: '1px solid #f7b500', padding: '14px', marginBottom: '16px', color: '#f7b500', fontSize: '11px', lineHeight: '1.5' }}>
                            {CASES[currentCase].difficulty === 'НИЗКИЙ' && 'Ищите: страх, давление, просьбу о данных, угрозы. Настоящий сотрудник НЕ просит коды и пароли по чату.'}
                            {CASES[currentCase].difficulty === 'СРЕДНИЙ' && 'Обращайте внимание на: необычные ссылки (.online, .ru), просьбы о скриншотах, просьбы хранить секрет. HR работает через корпоративный портал.'}
                            {CASES[currentCase].difficulty === 'ВЫСОКИЙ' && 'Это профессиональная разведка. Ищите: запросы версий ПО, подключения сетевых дисков, ссылки на "высшее руководство", прямые просьбы о файлах конфигурации.'}
                        </div>
                    )}
                    
                    <div style={{ flex: 1 }}>
                        <AnimatePresence mode="wait">
                            {feedback ? (
                                <motion.div key={feedback.text} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                                    <div style={{ color: feedback.isCorrect ? '#00ff41' : '#ff4d4d', fontWeight: 'bold', fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {feedback.isCorrect ? <ShieldCheck size={24}/> : <AlertTriangle size={24}/>}
                                        {feedback.tactic}
                                    </div>
                                    <div style={{ padding: '20px', background: '#000', borderLeft: `4px solid ${feedback.isCorrect ? '#00ff41' : '#ff4d4d'}`, lineHeight: '1.7', color: '#aaa', fontSize: '15px' }}>
                                        {feedback.text}
                                    </div>
                                </motion.div>
                            ) : (
                                <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.2 }}>
                                    <Search size={80} />
                                    <p style={{ marginTop: '20px', fontSize: '18px' }}>Кликните по фрагменту чата <br/>для детальной проверки</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div style={{ borderTop: '1px solid #222', paddingTop: '25px', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
                            <span style={{ color: '#444' }}>ПРОГРЕСС КЕЙСА:</span>
                            <span style={{ color: '#00ff41', fontWeight: 'bold' }}>{threatsFoundInCurrentCase} / {CASES[currentCase].threatsCount}</span>
                        </div>
                        
                        {threatsFoundInCurrentCase >= CASES[currentCase].threatsCount && (
                            <button className="btn-huge ready animate-fade" onClick={nextCase} style={{ width: '100%', padding: '20px' }}>
                                {currentCase < CASES.length - 1 ? "СЛЕДУЮЩЕЕ ДЕЛО" : "ЗАВЕРШИТЬ РАССЛЕДОВАНИЕ"} <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* ОБЩИЙ ПРОГРЕСС */}
                <div className="window" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '11px', color: '#444' }}>
                        <span>ОБЩАЯ ГОТОВНОСТЬ:</span>
                        <span>{Math.round(((currentCase + 1) / CASES.length) * 100)}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#111', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div animate={{ width: `${((currentCase + 1) / CASES.length) * 100}%` }} style={{ height: '100%', background: '#00ff41' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialMission;