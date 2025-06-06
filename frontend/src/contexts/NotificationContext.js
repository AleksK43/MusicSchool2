import React, { createContext, useContext, useState, useEffect } from 'react';
import NotificationService from '../services/notifications/NotificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = NotificationService.subscribe(setNotifications);
    setNotifications(NotificationService.getAll());
    return unsubscribe;
  }, []);

  const value = {
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length,
    addNotification: NotificationService.add.bind(NotificationService),
    removeNotification: NotificationService.remove.bind(NotificationService),
    markAsRead: NotificationService.markAsRead.bind(NotificationService),
    markAllAsRead: NotificationService.markAllAsRead.bind(NotificationService),
    clearAll: NotificationService.clear.bind(NotificationService),
    success: NotificationService.success.bind(NotificationService),
    error: NotificationService.error.bind(NotificationService),
    warning: NotificationService.warning.bind(NotificationService),
    info: NotificationService.info.bind(NotificationService),
    system: NotificationService.system.bind(NotificationService),
    lesson: NotificationService.lesson.bind(NotificationService),
    registration: NotificationService.registration.bind(NotificationService)
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};