import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../../contexts/NotificationContext';
import Toast from './Toast';

const ToastContainer = () => {
  const { notifications, removeNotification } = useNotifications();
  
  const toastNotifications = notifications.filter(n => n.type === 'toast');

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3">
      <AnimatePresence>
        {toastNotifications.map(notification => (
          <Toast
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;