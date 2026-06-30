import React from 'react';
import { Shield, Terminal, Code, Database, Lock, Globe, Users, Trophy, Zap, Book, Target, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  const technologies = [
    { name: "React 19", desc: "Фронтенд-фреймворк", icon: <Code size={16} /> },
    { name: "Supabase", desc: "База данных + Auth + Realtime", icon: <Database size={16} /> },
    { name: "Framer Motion", desc: "Анимации интерфейса", icon: <Zap size={16} /> },
    { name: "Lucide Icons", desc: "Иконки", icon: <Shield size={16} /> },
    { name: "jQuery UI", desc: "Drag-and-drop и слайдеры", icon: <Globe size={16} /> },
    { name: "Bootstrap 5", desc: "Базовые стили", icon: <Lock size={16} /> },
    { name: "SHA-256", desc: "Хеширование паролей", icon: <Terminal size={16} /> },
    { name: "WebSocket", desc: "Realtime обновления", icon: <Users size={16} /> },
  ];

  const features = [
    { title: "10 миссий", desc: "Пароли, фишинг, файрволы, SQL, социальная инженерия, криптография, форензика, взлом сейфов, проникновение в систему, финальная операция", icon: <Target size={20} /> },
    { title: "9 уроков Академии", desc: "Пароли, фишинг, криптография, социальная инженерия, сети, форензика, SQL, малварь, Wi-Fi безопасность", icon: <Book size={20} /> },
    { title: "Система рангов", desc: "Стажёр → Аналитик → Детектив → Легенда. Прогресс через XP", icon: <Trophy size={20} /> },
    { title: "Мультиплеер", desc: "Друзья, чат, дуэли, подарки, рейтинг агентов", icon: <Users size={20} /> },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <Shield size={60} color="#00ff41" style={{ marginBottom: '20px' }} />
        <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '4px', color: '#fff', marginBottom: '12px' }}>
          CYBER<span style={{ color: '#00ff41' }}>-</span>SHIELD
        </h1>
        <p style={{ color: '#888', fontSize: '14px', letterSpacing: '2px', marginBottom: '8px' }}>
          SECURE OPERATING SYSTEM v1.0.5
        </p>
        <p style={{ color: '#666', fontSize: '12px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
          Интерактивная обучающая платформа по кибербезопасности. 
          Проект разработан в рамках практики по веб-программированию (4 июня — 1 июля 2026).
        </p>
      </div>

      {/* About */}
      <div className="window" style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#00ff41', fontSize: '16px', letterSpacing: '2px', marginBottom: '16px' }}>О ПРОЕКТЕ</h2>
        <p style={{ color: '#ccc', fontSize: '13px', lineHeight: '1.8', marginBottom: '12px' }}>
          CYBER-SHIELD — это операционная система для обучения основам кибербезопасности. 
          Пользователь выступает в роли агента, расследующего киберпреступления компании Neocorp.
        </p>
        <p style={{ color: '#ccc', fontSize: '13px', lineHeight: '1.8', marginBottom: '12px' }}>
          <b style={{ color: '#f7b500' }}>Сюжет:</b> Хакер Shadow_Walker похитил сотрудника Макса и создал проект 
          «Мёртвая петля» — систему массового распознавания лиц. Ваша задача — собрать 10 улик, 
          пройти 10 миссий и остановить преступника.
        </p>
        <p style={{ color: '#ccc', fontSize: '13px', lineHeight: '1.8' }}>
          <b style={{ color: '#f7b500' }}>Образовательная часть:</b> 9 уроков Академии покрывают ключевые темы 
          информационной безопасности: пароли, фишинг, криптография, SQL-инъекции, социальная инженерия, 
          сетевая безопасность, цифровая форензика и другие.
        </p>
      </div>

      {/* Technologies */}
      <div className="window" style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#00ff41', fontSize: '16px', letterSpacing: '2px', marginBottom: '16px' }}>ТЕХНОЛОГИИ</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {technologies.map((tech, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#111', border: '1px solid #222' }}>
              <div style={{ color: '#00ff41' }}>{tech.icon}</div>
              <div>
                <div style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>{tech.name}</div>
                <div style={{ color: '#888', fontSize: '10px' }}>{tech.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="window" style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#00ff41', fontSize: '16px', letterSpacing: '2px', marginBottom: '16px' }}>ВОЗМОЖНОСТИ</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {features.map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', background: '#111', border: '1px solid #222' }}>
              <div style={{ color: '#00ff41', flexShrink: 0, marginTop: '2px' }}>{feat.icon}</div>
              <div>
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{feat.title}</div>
                <div style={{ color: '#888', fontSize: '12px', lineHeight: '1.5' }}>{feat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="window" style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#00ff41', fontSize: '16px', letterSpacing: '2px', marginBottom: '16px' }}>СООТВЕТСТВИЕ ТРЕБОВАНИЯМ</h2>
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            "HTML, CSS, JS (React) — клиентская часть",
            "UX/UI дизайн — киберпанк-стиль, анимации, интерактивность",
            "Адаптивный и кроссбраузерный дизайн",
            "BOM/DOM — Canvas частицы, таймеры, динамические элементы",
            "Интерактивные компоненты — слайдеры, формы, фильтры, пазлы",
            "React 19 — функциональные компоненты, хуки, состояние",
            "Оптимизация — production build, минификация",
            "Git — контроль версий, ветвление",
            "jQuery UI — drag-and-drop, слайдеры в миссиях",
            "Supabase — серверная часть (база данных, авторизация, Realtime)",
          ].map((req, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: i % 2 === 0 ? '#111' : 'transparent', fontSize: '12px', color: '#ccc' }}>
              <ChevronRight size={12} color="#00ff41" />
              {req}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '30px', color: '#444', fontSize: '11px', letterSpacing: '1px' }}>
        CYBER-SHIELD v1.0.5 | Практика по веб-программированию | 2026
      </div>
    </div>
  );
}
