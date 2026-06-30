import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

let notificationId = 0;
let addNotificationFn = null;

export function notify(type, message, duration = 4000) {
  if (addNotificationFn) {
    addNotificationFn({ id: ++notificationId, type, message, duration });
  }
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notif) => {
    setNotifications(prev => [...prev, notif]);
    if (notif.duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notif.id));
      }, notif.duration);
    }
  }, []);

  useEffect(() => {
    addNotificationFn = addNotification;
    return () => { addNotificationFn = null; };
  }, [addNotification]);

  const remove = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const icons = {
    success: <CheckCircle size={16} color="#00ff41" />,
    error: <AlertTriangle size={16} color="#ff4d4d" />,
    warning: <AlertTriangle size={16} color="#f7b500" />,
    info: <Info size={16} color="#4d94ff" />
  };

  const colors = {
    success: '#00ff41',
    error: '#ff4d4d',
    warning: '#f7b500',
    info: '#4d94ff'
  };

  return (
    <div className="notification-container">
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            className="notification-item"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ borderLeftColor: colors[n.type] }}
          >
            <div className="notification-icon">{icons[n.type]}</div>
            <div className="notification-text">{n.message}</div>
            <button className="notification-close" onClick={() => remove(n.id)}>
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
