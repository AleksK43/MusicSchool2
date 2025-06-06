import React from 'react';
import { motion } from 'framer-motion';

const Toast = ({ notification, onRemove }) => {
  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-green-500/90',
          border: 'border-green-400/50',
          icon: '✅',
          color: 'text-green-100'
        };
      case 'error':
        return {
          bg: 'bg-red-500/90',
          border: 'border-red-400/50',
          icon: '❌',
          color: 'text-red-100'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/90',
          border: 'border-orange-400/50',
          icon: '⚠️',
          color: 'text-orange-100'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500/90',
          border: 'border-blue-400/50',
          icon: 'ℹ️',
          color: 'text-blue-100'
        };
    }
  };

  const styles = getVariantStyles(notification.variant);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`${styles.bg} ${styles.border} border backdrop-blur-xl rounded-lg p-4 shadow-xl max-w-sm`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-xl">{styles.icon}</div>
        <div className="flex-1">
          <h4 className={`font-medium ${styles.color}`}>
            {notification.title}
          </h4>
          <p className={`text-sm ${styles.color} opacity-90 mt-1`}>
            {notification.message}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(notification.id)}
          className={`${styles.color} opacity-60 hover:opacity-100 transition-opacity`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Toast;