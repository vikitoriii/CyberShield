import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Package, X, Zap, Heart, Star, Send } from 'lucide-react';

const GIFT_TYPES = [
  { id: 'xp_small', name: 'XP ПАКЕТ', amount: 100, icon: <Zap size={16} />, color: '#00ff41', desc: '+100 XP' },
  { id: 'xp_medium', name: 'XP БУСТЕР', amount: 250, icon: <Zap size={16} />, color: '#4d94ff', desc: '+250 XP' },
  { id: 'xp_large', name: 'XP СУПЕР', amount: 500, icon: <Star size={16} />, color: '#f7b500', desc: '+500 XP' },
  { id: 'love', name: 'СЕРДЦЕ', amount: 50, icon: <Heart size={16} />, color: '#ff4d4d', desc: '+50 XP + ❤️' }
];

export default function GiftSystem({ username, onGiftReceived }) {
  const [gifts, setGifts] = useState([]);
  const [showSendModal, setShowSendModal] = useState(null);
  const [todaySent, setTodaySent] = useState([]);
  const [claimAnimation, setClaimAnimation] = useState(null);

  useEffect(() => {
    loadGifts();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('gifts-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'agent_gifts', filter: `receiver=eq.${username}` },
        (payload) => {
          setGifts(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [username]);

  const loadGifts = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('agent_gifts')
      .select('*')
      .eq('receiver', username)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setGifts(data);

    const { data: sentData } = await supabase
      .from('agent_gifts')
      .select('receiver')
      .eq('sender', username)
      .eq('gift_date', today);

    if (sentData) setTodaySent(sentData.map(g => g.receiver));
  };

  const sendGift = async (receiver, giftType) => {
    const gift = GIFT_TYPES.find(g => g.id === giftType);
    if (!gift) return;

    const today = new Date().toISOString().split('T')[0];

    await supabase.from('agent_gifts').insert([{
      sender: username,
      receiver,
      gift_type: gift.id,
      amount: gift.amount,
      message: gift.name,
      gift_date: today
    }]);

    setTodaySent([...todaySent, receiver]);
    setShowSendModal(null);
  };

  const claimGift = async (gift) => {
    if (gift.opened) return;

    setClaimAnimation(gift.id);

    await supabase
      .from('agent_gifts')
      .update({ opened: true })
      .eq('id', gift.id);

    if (onGiftReceived) onGiftReceived(gift.amount);

    setTimeout(() => {
      setGifts(prev => prev.map(g => g.id === gift.id ? { ...g, opened: true } : g));
      setClaimAnimation(null);
    }, 1000);
  };

  const unclaimedGifts = gifts.filter(g => !g.opened);
  const claimedGifts = gifts.filter(g => g.opened);

  return (
    <div className="gift-system">
      <div className="gift-header">
        <Gift size={16} color="#f7b500" />
        <span>ПОДАРКИ</span>
        {unclaimedGifts.length > 0 && (
          <span className="gift-unclaimed-badge">{unclaimedGifts.length}</span>
        )}
      </div>

      {unclaimedGifts.length > 0 && (
        <div className="gift-section">
          <div className="gift-section-title">НЕОТКРЫТЫЕ</div>
          {unclaimedGifts.map((gift) => {
            const giftInfo = GIFT_TYPES.find(g => g.id === gift.gift_type) || GIFT_TYPES[0];
            return (
              <motion.div
                key={gift.id}
                className={`gift-card unclaimed ${claimAnimation === gift.id ? 'claiming' : ''}`}
                onClick={() => claimGift(gift)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="gift-card-icon" style={{ color: giftInfo.color }}>
                  <Package size={20} />
                </div>
                <div className="gift-card-info">
                  <div className="gift-card-from">От: {gift.sender.toUpperCase()}</div>
                  <div className="gift-card-type" style={{ color: giftInfo.color }}>{giftInfo.name}</div>
                </div>
                <div className="gift-card-amount" style={{ color: giftInfo.color }}>
                  {giftInfo.desc}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {claimedGifts.length > 0 && (
        <div className="gift-section">
          <div className="gift-section-title">ПОЛУЧЕННЫЕ</div>
          {claimedGifts.slice(0, 5).map((gift) => {
            const giftInfo = GIFT_TYPES.find(g => g.id === gift.gift_type) || GIFT_TYPES[0];
            return (
              <div key={gift.id} className="gift-card claimed">
                <div className="gift-card-icon" style={{ color: giftInfo.color, opacity: 0.5 }}>
                  {giftInfo.icon}
                </div>
                <div className="gift-card-info">
                  <div className="gift-card-from">{gift.sender.toUpperCase()}</div>
                  <div className="gift-card-type">{giftInfo.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showSendModal && (
          <motion.div
            className="gift-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="gift-modal-content">
              <div className="gift-modal-header">
                <span>ОТПРАВИТЬ {showSendModal.toUpperCase()}</span>
                <button onClick={() => setShowSendModal(null)}><X size={16} /></button>
              </div>
              <div className="gift-modal-list">
                {GIFT_TYPES.map((gift) => {
                  const canSend = !todaySent.includes(showSendModal);
                  return (
                    <button
                      key={gift.id}
                      className="gift-modal-item"
                      onClick={() => canSend && sendGift(showSendModal, gift.id)}
                      disabled={!canSend}
                      style={{ borderColor: canSend ? gift.color : '#333' }}
                    >
                      <div className="gift-modal-icon" style={{ color: canSend ? gift.color : '#666' }}>
                        {gift.icon}
                      </div>
                      <div className="gift-modal-info">
                        <div className="gift-modal-name">{gift.name}</div>
                        <div className="gift-modal-desc">{gift.desc}</div>
                      </div>
                      {todaySent.includes(showSendModal) && (
                        <span className="gift-modal-sent">ОТПРАВЛЕН</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="gift-modal-note">Лимит: 1 подарок в день другу</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function GiftSendButton({ username, friendName, todaySent, onSend }) {
  return (
    <button
      className="friends-btn-gift"
      onClick={() => onSend(friendName)}
      disabled={todaySent.includes(friendName)}
      title={todaySent.includes(friendName) ? 'Уже отправлен сегодня' : 'Отправить подарок'}
    >
      <Gift size={14} />
    </button>
  );
}
