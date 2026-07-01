import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, Info, CheckCircle, CheckCircle2, HelpCircle } from 'lucide-react';

const PhishingMission = ({ username, currentPoints, onComplete }) => {
  const [selectedMail, setSelectedMail] = useState(null);
  const [processedIds, setProcessedIds] = useState([]);
  const [results, setResults] = useState({});
  const [filter, setFilter] = useState('all');
  const [isFinished, setIsFinished] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const emails = [
    {
      id: 1,
      sender: "no-reply@paypaI.com",
      subject: "Ваш аккаунт ограничен",
      type: "phishing",
      text: "Ваш аккаунт PayPal был временно ограничен из-за подозрительной активности. Подтвердите данные для восстановления доступа.",
      analysis: "ОМОГРАФ: В адресе вместо маленькой 'l' использована большая 'I'. paypaI.com вместо paypal.com. Визуально почти неотличимо!"
    },
    {
      id: 2,
      sender: "hr@nasha-firma.by",
      subject: "Заполните данные для ДМС",
      type: "safe",
      text: "Коллеги, до конца недели нужно заполнить данные для полиса ДМС на внутреннем портале. Ссылка: intranet.nasha-firma.by/dms",
      analysis: "БЕЗОПАСНО: Корпоративный домен .by, внутренняя ссылка на интранет. Письмо от HR — нормальная рабочая ситуация."
    },
    {
      id: 3,
      sender: "delivery@fedex-courier.net",
      subject: "Посылка задержана на таможне",
      type: "phishing",
      text: "Ваша посылка задерживается на таможне. Скачайте invoice.zip для оплаты пошлины и получения посылки.",
      analysis: "ШКОДНОСТЬ: Архив .zip от неизвестного отправителя — это вирус в 99% случаев. Настоящий FedEx не отправляет .zip файлы."
    },
    {
      id: 4,
      sender: "support@steampowered.com",
      subject: "Запрос на сброс пароля",
      type: "safe",
      text: "Был запрошен сброс пароля для вашего аккаунта Steam. Если вы этого не делали, просто удалите это письмо.",
      analysis: "БЕЗОПАСНО: Официальный домен Steam. Письмо не просит ввести данные, а просто информирует. Это правильно."
    },
    {
      id: 5,
      sender: "it-service@googIe.support",
      subject: "Попытка входа из Северной Кореи",
      type: "phishing",
      text: "Обнаружена попытка входа в ваш аккаунт из Северной Кореи. Нажмите 'Это не я' для блокировки доступа.",
      analysis: "ПСИХОЛОГИЯ: Вас пугают 'входом из КНДР', чтобы вы в панике нажали кнопку. В домене googIe — заглавная 'i' вместо 'l'."
    },
    {
      id: 6,
      sender: "newsletter@onliner.by",
      subject: "Лучшие статьи недели",
      type: "safe",
      text: "Вот подборка статей, которые могут вам понравиться на этой неделе. Технологии, авто, недвижимость.",
      analysis: "БЕЗОПАСНО: Обычная рассылка от крупнейшего белорусского портала. Ссылки ведут на реальные статьи."
    },
    {
      id: 7,
      sender: "alerts@belarusbank-by.info",
      subject: "Ваша карта заблокирована — срочно подтвердите данные",
      type: "phishing",
      text: "Уважаемый клиент! Ваша банковская карта Беларусбанк была заблокирована из-за подозрительной транзакции на сумму 4 750 BYN. Для разблокировки перейдите по ссылке и введите данные карты. У вас есть 20 минут, иначе карта будет аннулирована.",
      analysis: "ФИШИНГ: Настоящий Беларусбанк НИКОГДА не просит ввести данные карты по ссылке из email. Домен .by.info вместо официального .by. Давление сроками (20 минут) — классический триггер паники."
    },
    {
      id: 8,
      sender: "noreply@github.com",
      subject: "Уязвимость в вашем репозитории",
      type: "safe",
      text: "Мы обнаружили уязвимость в одной из ваших библиотек. Посмотрите Dependabot alert в настройках репозитория.",
      analysis: "БЕЗОПАСНО: Реальное техническое уведомление от GitHub. Никаких ссылок на внешние ресурсы — всё в داخلнем интерфейсе."
    },
    {
      id: 9,
      sender: "ceo@nasha-firma.by",
      subject: "Срочный перевод (Конфиденциально)",
      type: "phishing",
      text: "Привет, я на встрече, не могу говорить. Срочно оплати этот счёт, я пришлю детали позже. Это очень важно для сделки.",
      analysis: "CEO-FRAUD: Подделка под начальника. Используется авторитет и срочность. Реальный CEO никогда не просит оплатить счёт по письму."
    },
    {
      id: 10,
      sender: "info@nalog.gov.by",
      subject: "Задолженность по налогам",
      type: "safe",
      text: "У вас имеется неоплаченная задолженность по транспортному налогу. Подробности в личном кабинете налогоплательщика.",
      analysis: "БЕЗОПАСНО: Домен .gov.by — официальный государственный домен. Письмо не просит карту, а направляет в личный кабинет."
    }
  ];

  const handleAction = (isPhishingClaim) => {
    if (processedIds.includes(selectedMail.id)) return;
    const isActuallyPhishing = selectedMail.type === 'phishing';
    const isCorrect = isPhishingClaim === isActuallyPhishing;
    setResults(prev => ({ ...prev, [selectedMail.id]: isCorrect ? 'correct' : 'wrong' }));
    setProcessedIds(prev => [...prev, selectedMail.id]);

    if (!isCorrect) {
      const wrongCount = Object.values(results).filter(r => r === 'wrong').length + 1;
      if (wrongCount >= 3) {
        setTimeout(() => {
          setProcessedIds([]);
          setResults({});
          setSelectedMail(null);
          setFilter('all');
        }, 1500);
      }
    }
  };

  const finishMission = () => {
    const correctCount = Object.values(results).filter(r => r === 'correct').length;
    setIsFinished(true);
    onComplete(currentPoints + correctCount * 100);
  };

  const filteredEmails = emails.filter(e => {
    if (filter === 'unread') return !processedIds.includes(e.id);
    if (filter === 'completed') return processedIds.includes(e.id);
    return true;
  });

  if (isFinished) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="win-box animate-fade">
      <CheckCircle2 size={80} color="#00ff41" style={{ margin: '0 auto 20px' }} />
      <div className="glitch-text">ДАННЫЕ ОЧИЩЕНЫ</div>
      <p style={{ color: '#888', marginBottom: '20px' }}>Вы проанализировали {emails.length} писем. Правильных: {Object.values(results).filter(r => r === 'correct').length}</p>
      <div style={{ background: '#000', border: '1px solid #00ff41', padding: '15px', marginBottom: '20px', textAlign: 'left' }}>
        <div style={{ color: '#00ff41', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>УЛИКА #2:</div>
        <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
          Одно из писем содержало гомограф — кириллическую 'о' вместо латинской. 
          Адрес отправителя: <b style={{ color: '#ff4d4d' }}>no-reply@paypaI.com</b>. 
          Это указывает на <b style={{ color: '#ff4d4d' }}>внутреннего агента</b> компании Neocorp.
        </p>
      </div>
      <button className="btn-huge" onClick={() => onComplete(currentPoints)}>ВЕРНУТЬСЯ В ТЕРМИНАЛ</button>
    </motion.div>
  );

  if (showIntro) return (
    <div className="window animate-fade" style={{ textAlign: 'center', padding: '60px', background: 'radial-gradient(circle, #1a1a0a 0%, #050505 100%)' }}>
      <Search size={80} color="#f7b500" />
      <h1 className="glitch-text" style={{ color: '#f7b500', marginTop: '20px' }}>ДЕТЕКТИВ ФИШИНГА</h1>
      <div style={{ maxWidth: '700px', margin: '30px auto', textAlign: 'left' }}>
        <div style={{ background: '#000', border: '1px solid #222', padding: '20px', marginBottom: '20px' }}>
          <div style={{ color: '#f7b500', fontSize: '11px', letterSpacing: '2px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={14} /> МИССИЯ 2
          </div>
          <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
            На корпоративную почту сотрудников Neocorp пришли подозрительные письма. 
            Среди них <b style={{ color: '#00ff41' }}>настоящие уведомления</b> 
            и <b style={{ color: '#ff4d4d' }}>фишинговые атаки</b>. 
            По данным разведки, атака связана с внутренним агентом — 
            используйте навыки из <b style={{ color: '#00ff41' }}>Академии</b> для анализа.
          </p>
        </div>
        <div style={{ background: '#000', border: '1px solid #222', padding: '15px' }}>
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
            ⚠️ Обращайте внимание на домены отправителей, подозрительные ссылки и архивы. 
            Кириллические буквы могут маскироваться под латинские!
          </p>
        </div>
      </div>
      <button className="btn-main" onClick={() => setShowIntro(false)}>НАЧАТЬ АНАЛИЗ</button>
    </div>
  );

  return (
    <div className="phishing-container">
      <div className="phishing-header" style={{ flexWrap: 'wrap', gap: '8px' }}>
        <div className="title-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={20} color="#00ff41" />
          <h3 style={{ fontSize: '12px', margin: 0 }}>TRAFFIC_ANALYZER: {processedIds.length}/{emails.length}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => { setShowHint(!showHint); if (!showHint) setHintLevel(1); }} style={{ background: 'none', border: 'none', color: showHint ? '#f7b500' : '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', letterSpacing: '1px' }}>
            <HelpCircle size={14} /> ПОДСКАЗКА
          </button>
          <div className="filter-pills">
            <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>ВСЕ</button>
            <button onClick={() => setFilter('unread')} className={filter === 'unread' ? 'active' : ''}>НОВЫЕ</button>
            <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>АНАЛИЗ</button>
          </div>
        </div>
      </div>

      {showHint && (
        <div style={{ background: '#000', border: '1px solid #f7b500', padding: '12px 16px', marginBottom: '16px', color: '#f7b500', fontSize: '11px', lineHeight: '1.5' }}>
          {hintLevel === 1 && (
            <div>
              <b>Как отличить фишинг:</b> Проверяйте домен отправителя (опечатки, подмена букв), 
              ссылки ведут на подозрительные сайты? Просьбы о паролях/кодах — всегда фишинг. 
              Срочность + страх = признак атаки. Настоящие сервисы не просят данные по email.
              <button onClick={() => setHintLevel(2)} style={{ marginTop: '8px', background: '#f7b500', color: '#000', border: 'none', padding: '3px 8px', fontSize: '10px', cursor: 'pointer' }}>
                Показать ответ
              </button>
            </div>
          )}
          {hintLevel === 2 && (
            <div>
              <b>ОТВЕТЫ:</b><br/>
              1. paypaI.com — <span style={{ color: '#ff4d4d' }}>ФИШИНГ</span> (кириллическая I)<br/>
              2. nasha-firma.by — <span style={{ color: '#00ff41' }}>БЕЗОПАСНО</span> (корпоративный домен)<br/>
              3. fedex-courier.net — <span style={{ color: '#ff4d4d' }}>ФИШИНГ</span> (.zip архив)<br/>
              4. steampowered.com — <span style={{ color: '#00ff41' }}>БЕЗОПАСНО</span> (официальный)<br/>
              5. googIe.support — <span style={{ color: '#ff4d4d' }}>ФИШИНГ</span> (подмена l→I)<br/>
              6. onliner.by — <span style={{ color: '#00ff41' }}>БЕЗОПАСНО</span> (обычная рассылка)<br/>
              7. belarusbank-by.info — <span style={{ color: '#ff4d4d' }}>ФИШИНГ</span> (данные карты)<br/>
              8. github.com — <span style={{ color: '#00ff41' }}>БЕЗОПАСНО</span> (официальный)<br/>
              9. nasha-firma.by — <span style={{ color: '#ff4d4d' }}>ФИШИНГ</span> (CEO-FRAUD)<br/>
              10. nalog.gov.by — <span style={{ color: '#00ff41' }}>БЕЗОПАСНО</span> (.gov.by)
            </div>
          )}
        </div>
      )}

      <div className="phishing-content">
        <div className="mail-sidebar window">
          {filteredEmails.map(mail => (
            <div 
              key={mail.id} 
              className={`mail-card ${selectedMail?.id === mail.id ? 'selected' : ''} ${processedIds.includes(mail.id) ? 'processed' : ''}`}
              onClick={() => setSelectedMail(mail)}
            >
              <div className="status-dot">
                {results[mail.id] === 'correct' && <CheckCircle size={14} color="#00ff41" />}
                {results[mail.id] === 'wrong' && <AlertCircle size={14} color="#ff4d4d" />}
                {!results[mail.id] && <div className="dot-unread" />}
              </div>
              <div className="mail-meta">
                <span className="m-sender">{mail.sender}</span>
                <span className="m-subject">{mail.subject}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mail-details-area">
          <AnimatePresence mode="wait">
            {selectedMail ? (
              <motion.div key={selectedMail.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="window detail-view">
                <div className="detail-header">
                  <span className="tag">OBJECT_ID: {selectedMail.id}</span>
                  <h2>{selectedMail.subject}</h2>
                  <p className="sender-info">SENDER: <code>{selectedMail.sender}</code></p>
                </div>

                <div className="mail-body">{selectedMail.text}</div>

                {processedIds.includes(selectedMail.id) ? (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className={`analysis-box ${results[selectedMail.id]}`}>
                    <h4><Info size={16} /> ЭКСПЕРТНОЕ ЗАКЛЮЧЕНИЕ:</h4>
                    <p>{selectedMail.analysis}</p>
                    <div className={`status-badge ${results[selectedMail.id]}`}>
                      {results[selectedMail.id] === 'correct' ? "ВЕРНО" : "ОШИБКА"}
                    </div>
                  </motion.div>
                ) : (
                  <div className="action-buttons">
                    <button className="btn-phish" onClick={() => handleAction(true)}>УГРОЗА: ФИШИНГ</button>
                    <button className="btn-safe-action" onClick={() => handleAction(false)}>БЕЗОПАСНО</button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="empty-view">
                <div className="radar"></div>
                <p>ВЫБЕРИТЕ ПИСЬМО ДЛЯ АНАЛИЗА</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {processedIds.length === emails.length && (
        <button className="btn-huge finish-btn animate-fade" onClick={finishMission} style={{ padding: '14px', fontSize: '12px' }}>
          ЗАВЕРШИТЬ МИССИЮ
        </button>
      )}
    </div>
  );
};

export default PhishingMission;
