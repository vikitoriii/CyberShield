import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Users, UserPlus, Send, X, Check, Trophy, MessageSquare, Search, Zap, Gift, Swords, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentDuel from './AgentDuel';
import FriendProfile from './FriendProfile';

const MISSION_NAMES = {
  password: 'СТОЙКОСТЬ ПАРОЛЯ', phishing: 'ДЕТЕКТОР ФИШИНГА', firewall: 'СЕТЕВОЙ ЭКРАН',
  database: 'БАЗА ДАННЫХ', social: 'СОЦ. ИНЖЕНЕРИЯ', crypto: 'КРИПТОГРАФИЯ',
  metadata: 'ЦИФРОВОЙ СЛЕД', sniffer: 'ВЗЛОМ СЕЙФА', portal: 'СКРЫТЫЙ ПОРТАЛ', final: 'ФИНАЛЬНАЯ ОПЕРАЦИЯ'
};

export default function FriendsSystem({ username, points, onChallengeStart, onGiftReceived }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [chatWith, setChatWith] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [challenges, setChallenges] = useState([]);
  const [duelWith, setDuelWith] = useState(null);
  const [duelGameId, setDuelGameId] = useState(null);
  const [viewProfile, setViewProfile] = useState(null);
  const [showGiftModal, setShowGiftModal] = useState(null);
  const [todaySent, setTodaySent] = useState([]);
  const messagesEndRef = useRef(null);
  const loadDataRef = useRef(null);

  useEffect(() => {
    loadDataRef.current = loadData;
  }, [username]);

  useEffect(() => {
    if (!isOpen) return;
    loadData();

    const interval = setInterval(() => loadData(), 5000);

    return () => clearInterval(interval);
  }, [isOpen, username]);

  useEffect(() => {
    if (!chatWith) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('private_messages')
        .select('*')
        .or(`and(sender.eq.${username},receiver.eq.${chatWith}),and(sender.eq.${chatWith},receiver.eq.${username})`)
        .order('created_at', { ascending: true })
        .limit(100);
      if (data) setMessages(data);
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatWith, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadData = async () => {
    try {
      const { data: friendsData } = await supabase
        .from('friends')
        .select('*')
        .or(`user_a.eq.${username},user_b.eq.${username}`);

      if (friendsData) {
        setFriends(friendsData.filter(f => f.status === 'accepted'));
        setRequests(friendsData.filter(f => f.status === 'pending' && f.user_b === username));
      }

      const { data: challengesData } = await supabase
        .from('friend_challenges')
        .select('*')
        .or(`challenger.eq.${username},challenged.eq.${username}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (challengesData) setChallenges(challengesData);

      const today = new Date().toISOString().split('T')[0];
      const { data: sentData } = await supabase
        .from('agent_gifts')
        .select('receiver')
        .eq('sender', username)
        .eq('gift_date', today);

      if (sentData) setTodaySent(sentData.map(g => g.receiver));
    } catch (e) {
      console.error('Load data error:', e);
    }
  };

  const searchUserFunc = async () => {
    if (!searchUser.trim() || searchUser === username) return;
    const { data } = await supabase
      .from('profiles')
      .select('username, points')
      .eq('username', searchUser)
      .single();

    if (data) {
      const { data: friendStatus } = await supabase
        .from('friends')
        .select('status')
        .or(`and(user_a.eq.${username},user_b.eq.${searchUser}),and(user_a.eq.${searchUser},user_b.eq.${username})`)
        .limit(1);

      setSearchResult({ ...data, isFriend: friendStatus && friendStatus.length > 0 });
    } else {
      setSearchResult(null);
    }
  };

  const sendFriendRequest = async () => {
    if (!searchResult || searchResult.isFriend) return;
    await supabase.from('friends').insert([{
      user_a: username,
      user_b: searchResult.username,
      status: 'pending'
    }]);
    setSearchResult({ ...searchResult, isFriend: true });
  };

  const acceptRequest = async (fromUser) => {
    await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('user_a', fromUser)
      .eq('user_b', username);
    loadData();
  };

  const declineRequest = async (fromUser) => {
    await supabase
      .from('friends')
      .delete()
      .eq('user_a', fromUser)
      .eq('user_b', username);
    loadData();
  };

  const removeFriend = async (friendName) => {
    await supabase
      .from('friends')
      .delete()
      .or(`and(user_a.eq.${username},user_b.eq.${friendName}),and(user_a.eq.${friendName},user_b.eq.${username})`);
    loadData();
  };

  const sendMessage = async () => {
    if (!msgInput.trim() || !chatWith) return;
    const msg = msgInput.trim();
    setMsgInput('');
    await supabase.from('private_messages').insert([{ sender: username, receiver: chatWith, message: msg }]);
  };

  const startDuel = async (friendName) => {
    const { data, error } = await supabase.from('friend_challenges').insert([{
      challenger: username,
      challenged: friendName,
      mission_id: 'duel',
      status: 'pending'
    }]).select();

    if (data && data[0]) {
      setDuelGameId(data[0].id);
      setDuelWith(friendName);
    }
  };

  const acceptDuel = async (challenge) => {
    await supabase
      .from('friend_challenges')
      .update({ status: 'active' })
      .eq('id', challenge.id);
    setDuelGameId(challenge.id);
    setDuelWith(challenge.challenger);
  };

  const declineDuel = async (challengeId) => {
    await supabase
      .from('friend_challenges')
      .update({ status: 'declined' })
      .eq('id', challengeId);
    loadData();
  };

  const getFriendName = (f) => f.user_a === username ? f.user_b : f.user_a;

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const pendingDuels = challenges.filter(c => c.challenged === username && c.status === 'pending' && c.mission_id === 'duel');
  const myDuels = challenges.filter(c => (c.challenger === username || c.challenged === username) && c.mission_id === 'duel' && c.status !== 'pending');

  if (duelWith && duelGameId) {
    return (
      <div className="duel-overlay">
        <AgentDuel
          username={username}
          opponent={duelWith}
          gameId={duelGameId}
          onEnd={() => { setDuelWith(null); setDuelGameId(null); loadData(); }}
        />
      </div>
    );
  }

  return (
    <>
      <button className="friends-toggle" onClick={() => setIsOpen(!isOpen)}>
        <Users size={20} />
        {pendingDuels.length > 0 && <span className="friends-unread">{pendingDuels.length}</span>}
      </button>

      <AnimatePresence>
        {viewProfile && (
          <FriendProfile
            username={username}
            friendName={viewProfile}
            onClose={() => setViewProfile(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="friends-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="friends-header">
              <div className="friends-header-left">
                <Users size={16} color="#00ff41" />
                <span>ДРУЗЬЯ</span>
              </div>
              <button className="friends-close" onClick={() => { setIsOpen(false); setChatWith(null); }}>
                <X size={16} />
              </button>
            </div>

            {chatWith ? (
              <div className="friends-chat-view">
                <div className="friends-chat-header">
                  <button className="friends-back" onClick={() => setChatWith(null)}>←</button>
                  <span className="friends-chat-name">{chatWith.toUpperCase()}</span>
                  <div className="friends-chat-actions">
                    <button className="friends-btn-small" onClick={() => setViewProfile(chatWith)}>
                      <Eye size={14} />
                    </button>
                    <button className="friends-btn-small duel" onClick={() => startDuel(chatWith)}>
                      <Swords size={14} />
                    </button>
                  </div>
                </div>

                <div className="friends-chat-messages">
                  {messages.map((msg, i) => (
                    <div key={msg.id || i} className={`friends-msg ${msg.sender === username ? 'self' : ''}`}>
                      <div className="friends-msg-text">{msg.message}</div>
                      <div className="friends-msg-time">{formatTime(msg.created_at)}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="friends-chat-input">
                  <input
                    type="text"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Сообщение..."
                  />
                  <button onClick={sendMessage} disabled={!msgInput.trim()}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="friends-tabs">
                  <button className={tab === 'friends' ? 'active' : ''} onClick={() => setTab('friends')}>
                    Друзья ({friends.length})
                  </button>
                  <button className={tab === 'requests' ? 'active' : ''} onClick={() => setTab('requests')}>
                    Заявки ({requests.length})
                  </button>
                  <button className={tab === 'duels' ? 'active' : ''} onClick={() => setTab('duels')}>
                    <Swords size={12} /> Дуэли
                  </button>
                  <button className={tab === 'search' ? 'active' : ''} onClick={() => setTab('search')}>
                    Найти
                  </button>
                </div>

                <div className="friends-content">
                  {tab === 'friends' && (
                    <>
                      {friends.length === 0 && (
                        <div className="friends-empty">Пока нет друзей. Найди агентов!</div>
                      )}
                      {friends.map((f, i) => {
                        const friendName = getFriendName(f);
                        return (
                          <div key={i} className="friends-item">
                            <div className="friends-item-avatar" onClick={() => setViewProfile(friendName)} style={{ cursor: 'pointer' }}>
                              {friendName[0].toUpperCase()}
                            </div>
                            <div className="friends-item-info" onClick={() => setViewProfile(friendName)} style={{ cursor: 'pointer' }}>
                              <div className="friends-item-name">{friendName.toUpperCase()}</div>
                            </div>
                            <div className="friends-item-actions">
                              <button className="friends-btn-chat" onClick={() => setChatWith(friendName)}>
                                <MessageSquare size={14} />
                              </button>
                              <button className="friends-btn-duel" onClick={() => startDuel(friendName)}>
                                <Swords size={14} />
                              </button>
                              <button className="friends-btn-remove" onClick={() => removeFriend(friendName)}>
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}

                  {tab === 'requests' && (
                    <>
                      {requests.length === 0 && (
                        <div className="friends-empty">Нет входящих заявок</div>
                      )}
                      {requests.map((r, i) => (
                        <div key={i} className="friends-item">
                          <div className="friends-item-avatar">{r.user_a[0].toUpperCase()}</div>
                          <div className="friends-item-info">
                            <div className="friends-item-name">{r.user_a.toUpperCase()}</div>
                            <div className="friends-item-sub">хочет добавить в друзья</div>
                          </div>
                          <div className="friends-item-actions">
                            <button className="friends-btn-accept" onClick={() => acceptRequest(r.user_a)}>
                              <Check size={14} />
                            </button>
                            <button className="friends-btn-decline" onClick={() => declineRequest(r.user_a)}>
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {tab === 'duels' && (
                    <>
                      {pendingDuels.length === 0 && myDuels.length === 0 && (
                        <div className="friends-empty">Нет активных дуэлей</div>
                      )}
                      {pendingDuels.length > 0 && (
                        <div className="friends-challenges-section">
                          <div className="friends-challenges-title">ВХОДЯЩИЕ ВЫЗОВЫ</div>
                          {pendingDuels.map((c, i) => (
                            <div key={i} className="friends-challenge-card incoming">
                              <div className="friends-challenge-info">
                                <div className="friends-challenge-from">{c.challenger.toUpperCase()}</div>
                                <div className="friends-challenge-mission-name">ДУЭЛЬ</div>
                              </div>
                              <div className="friends-challenge-actions">
                                <button className="friends-btn-accept" onClick={() => acceptDuel(c)}>
                                  <Zap size={14} /> ПРИНЯТЬ
                                </button>
                                <button className="friends-btn-decline" onClick={() => declineDuel(c.id)}>
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {myDuels.length > 0 && (
                        <div className="friends-challenges-section">
                          <div className="friends-challenges-title">МОИ ДУЭЛИ</div>
                          {myDuels.map((c, i) => (
                            <div key={i} className={`friends-challenge-card ${c.status}`}>
                              <div className="friends-challenge-info">
                                <div className="friends-challenge-vs">
                                  {c.challenger.toUpperCase()} vs {c.challenged.toUpperCase()}
                                </div>
                              </div>
                              <span className={`friends-challenge-status-badge ${c.status}`}>
                                {c.status === 'active' ? 'АКТИВЕН' : c.status === 'completed' ? 'ЗАВЕРШЁН' : 'ОТКЛОНЁН'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {tab === 'search' && (
                    <div className="friends-search">
                      <div className="friends-search-row">
                        <input
                          type="text"
                          value={searchUser}
                          onChange={(e) => setSearchUser(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && searchUserFunc()}
                          placeholder="Имя агента..."
                        />
                        <button onClick={searchUserFunc} disabled={!searchUser.trim()}>
                          <Search size={16} />
                        </button>
                      </div>
                      {searchResult && (
                        <div className="friends-search-result">
                          <div className="friends-item-avatar" onClick={() => setViewProfile(searchResult.username)} style={{ cursor: 'pointer' }}>
                            {searchResult.username[0].toUpperCase()}
                          </div>
                          <div className="friends-item-info" onClick={() => setViewProfile(searchResult.username)} style={{ cursor: 'pointer' }}>
                            <div className="friends-item-name">{searchResult.username.toUpperCase()}</div>
                            <div className="friends-item-sub">{searchResult.points} XP</div>
                          </div>
                          {!searchResult.isFriend ? (
                            <button className="friends-btn-add" onClick={sendFriendRequest}>
                              <UserPlus size={14} />
                            </button>
                          ) : (
                            <span className="friends-already">Уже в друзьях</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
