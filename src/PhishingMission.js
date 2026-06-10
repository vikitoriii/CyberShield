import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldAlert, ShieldCheck, Search, ChevronRight, AlertCircle, Info, CheckCircle } from 'lucide-react';

const PhishingMission = ({ username, currentPoints, onComplete }) => {
  const [selectedMail, setSelectedMail] = useState(null);
  const [processedIds, setProcessedIds] = useState([]);
  const [results, setResults] = useState({});
  const [filter, setFilter] = useState('all'); // Смена логики: all, unread, completed
  const [isFinished, setIsFinished] = useState(false);

  const emails = [
    { id: 1, sender: "no-reply@paypaI.com", subject: "Your account is limited", type: "phishing", text: "Ваш аккаунт PayPal был временно ограничен. Пожалуйста, войдите в систему, чтобы подтвердить свои данные.", analysis: "ОМОГРАФ: В адресе вместо маленькой 'l' (L) использована большая 'I' (i). Визуально это почти не отличить: paypaI vs paypal." },
    { id: 2, sender: "hr-portal@megacorp.ru", subject: "Обновление страховки", type: "safe", text: "Коллеги, до конца недели нужно заполнить данные для полиса ДМС на внутреннем портале.", analysis: "БЕЗОПАСНО: Внутренний корпоративный домен, нет подозрительных внешних ссылок." },
    { id: 3, sender: "delivery@fedex-courier.net", subject: "Parcel tracking #99201", type: "phishing", text: "Ваша посылка задерживается на таможне. Скачайте 'invoice.zip' для оплаты пошлины.", analysis: "ВРЕДОНОСНОЕ ПО: Архивы (.zip, .rar) от неизвестных отправителей — это 99% вирусы. Домен .net вместо официального .com." },
    { id: 4, sender: "support@steampowered.com", subject: "Password reset request", type: "safe", text: "Был запрошен сброс пароля для вашего аккаунта. Если вы этого не делали, просто удалите письмо.", analysis: "БЕЗОПАСНО: Официальный домен Steam. Письмо не требует вводить данные, а дает инструкции по безопасности." },
    { id: 5, sender: "it-service@googIe.support", subject: "Unauthorized login attempt", type: "phishing", text: "Обнаружена попытка входа из КНДР. Нажмите 'Это не я', чтобы заблокировать доступ.", analysis: "ПСИХОЛОГИЯ: Вас пугают 'входом из КНДР', чтобы вы в панике нажали на кнопку. В домене googIe — снова заглавная 'i' вместо 'l'." },
    { id: 6, sender: "newsletter@medium.com", subject: "Top stories for you", type: "safe", text: "Вот подборка статей, которые могут вам понравиться на этой неделе.", analysis: "БЕЗОПАСНО: Обычная рассылка. Ссылки ведут на официальные статьи Medium." },
    { id: 7, sender: "admin@gos-uslugi.online", subject: "Вам положена выплата", type: "phishing", text: "В соответствии с указом №124, вам начислена социальная выплата в размере 15 400 руб. Укажите карту для зачисления.", analysis: "ГОС-ФИШИНГ: Госуслуги никогда не используют домен .online. Официальный домен — gosuslugi.ru. Обещание внезапных денег — признак мошенников." },
    { id: 8, sender: "noreply@github.com", subject: "Security vulnerability in your repo", type: "safe", text: "Мы обнаружили уязвимость в одной из ваших библиотек. Посмотрите Dependabot alert.", analysis: "БЕЗОПАСНО: Реальное техническое уведомление от GitHub для разработчиков." },
    { id: 9, sender: "ceo@ваша-компания.ru", subject: "Срочный перевод (Конфиденциально)", type: "phishing", text: "Привет, я на встрече, не могу говорить. Срочно оплати этот счет, я пришлю детали позже. Это очень важно для сделки.", analysis: "CEO-FRAUD: Подделка под начальника. Используется авторитет и срочность. Проверяйте реальный адрес отправителя, даже если имя совпадает." },
    { id: 10, sender: "info@nalog.gov.ru", subject: "Задолженность по налогам", type: "safe", text: "У вас имеется неоплаченная задолженность по транспортному налогу. Подробности в личном кабинете налогоплательщика.", analysis: "БЕЗОПАСНО: Домен .gov.ru принадлежит государственным органам. Письмо не просит карту, а отправляет в личный кабинет." }
  ];

  const handleAction = (isPhishingClaim) => {
    if (processedIds.includes(selectedMail.id)) return;
    const isActuallyPhishing = selectedMail.type === 'phishing';
    const isCorrect = isPhishingClaim === isActuallyPhishing;
    setResults(prev => ({ ...prev, [selectedMail.id]: isCorrect ? 'correct' : 'wrong' }));
    setProcessedIds(prev => [...prev, selectedMail.id]);
  };

  const finishMission = async () => {
    const correctCount = Object.values(results).filter(r => r === 'correct').length;
    const reward = correctCount * 100;
    const { error } = await supabase.from('profiles').update({ points: currentPoints + reward }).eq('username', username);
    if (!error) { setIsFinished(true); onComplete(currentPoints + reward); }
  };

  // НОВАЯ ЛОГИКА ФИЛЬТРАЦИИ
  const filteredEmails = emails.filter(e => {
    if (filter === 'unread') return !processedIds.includes(e.id);
    if (filter === 'completed') return processedIds.includes(e.id);
    return true; // all
  });

  if (isFinished) return (
    <div className="window success-screen animate-fade">
      <div className="glitch-text">DATA CLEANSED</div>
      <p>Вы проанализировали {emails.length} объектов. Правильных диагнозов: {Object.values(results).filter(r => r === 'correct').length}</p>
      <button className="btn-huge" onClick={() => window.location.reload()}>ВЕРНУТЬСЯ В ШТАБ</button>
    </div>
  );

  return (
    <div className="phishing-container">
      <div className="phishing-header">
        <div className="title-group">
          <Search size={20} color="#00ff41" />
          <h3>TRAFFIC_ANALYZER: {processedIds.length}/{emails.length}</h3>
        </div>
        <div className="filter-pills">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>ВСЕ</button>
          <button onClick={() => setFilter('unread')} className={filter === 'unread' ? 'active' : ''}>НОВЫЕ</button>
          <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>АНАЛИЗ</button>
        </div>
      </div>

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
                <p>ВЫБЕРИТЕ ОБЪЕКТ ДЛЯ ЗАПУСКА СКАНЕРА</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {processedIds.length === emails.length && (
        <button className="btn-huge finish-btn animate-fade" onClick={finishMission}>
          ЗАВЕРШИТЬ МИССИЮ
        </button>
      )}
    </div>
  );
};

export default PhishingMission;