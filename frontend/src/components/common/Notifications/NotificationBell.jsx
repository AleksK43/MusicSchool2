import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../../contexts/NotificationContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  
  const systemNotifications = notifications.filter(n => n.type === 'system');

  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'lesson':
        return { color: 'text-green-400', bg: 'bg-green-500/10', icon: '📚' };
      case 'registration':
        return { color: 'text-orange-400', bg: 'bg-orange-500/10', icon: '👤' };
      case 'error':
        return { color: 'text-red-400', bg: 'bg-red-500/10', icon: '⚠️' };
      default:
        return { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: 'ℹ️' };
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Teraz';
    if (diffInMinutes < 60) return `${diffInMinutes}m temu`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h temu`;
    return notificationTime.toLocaleDateString('pl-PL');
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-white font-medium">Powiadomienia</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Oznacz wszystkie
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAll}
                  className="text-xs text-slate-400 hover:text-slate-300"
                >
                  Wyczyść
                </motion.button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {systemNotifications.length > 0 ? (
                systemNotifications.map(notification => {
                  const styles = getVariantStyles(notification.variant);
                  return (
                    <motion.div
                      key={notification.id}
                      whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.3)' }}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 cursor-pointer border-b border-slate-700/30 ${
                        !notification.isRead ? 'bg-slate-700/20' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`${styles.bg} p-2 rounded-lg`}>
                          <span className="text-sm">{styles.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${styles.color}`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-slate-300 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🔔</div>
                  <p className="text-slate-400">Brak powiadomień</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;