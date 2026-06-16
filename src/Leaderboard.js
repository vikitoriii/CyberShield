import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Trophy, Medal, User, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
    const [agents, setAgents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaders();
    }, []);

    const fetchLeaders = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('username, points')
            .order('points', { ascending: false })
            .limit(10);
        
        if (!error) setAgents(data);
        setLoading(false);
    };

    // Фильтрация агентов (Требование №5)
    const filteredAgents = agents.filter(agent => 
        agent.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="window animate-fade" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#00ff41', margin: 0, display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Trophy color="#f7b500" /> РЕЙТИНГ АГЕНТОВ CS-OS
                </h2>
                {/* Поиск/Фильтр */}
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#444' }} />
                    <input 
                        type="text" 
                        placeholder="Поиск агента..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: '#000', border: '1px solid #333', color: '#00ff41', padding: '10px 10px 10px 35px', outline: 'none' }}
                    />
                </div>
            </div>

            {loading ? (
                <div className="blink">СИНХРОНИЗАЦИЯ С БАЗОЙ ДАННЫХ...</div>
            ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                    {filteredAgents.map((agent, index) => (
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            key={agent.username} 
                            style={{ 
                                display: 'flex', justifyContent: 'space-between', padding: '15px 25px', 
                                background: index === 0 ? 'rgba(247, 181, 0, 0.05)' : '#0a0a0a', 
                                border: `1px solid ${index === 0 ? '#f7b500' : '#222'}` 
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <span style={{ color: index < 3 ? '#f7b500' : '#444', fontWeight: 'bold' }}>
                                    {index === 0 ? <Medal size={18} /> : `#${index + 1}`}
                                </span>
                                <User size={14} color="#666" />
                                <span style={{ fontWeight: 'bold', color: index === 0 ? '#f7b500' : '#eee' }}>
                                    {agent.username.toUpperCase()}
                                </span>
                            </div>
                            <div style={{ color: '#00ff41', fontFamily: 'monospace' }}>{agent.points} XP</div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Leaderboard;