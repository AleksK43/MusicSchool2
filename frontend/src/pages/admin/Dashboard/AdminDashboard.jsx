// src/pages/admin/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import AuthService from '../../../services/AuthService';

const AdminDashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.apiCall('/admin/dashboard');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentUsers(data.recent_users);
      } else {
        throw new Error('Nie udało się pobrać danych');
      }
    } catch (error) {
      setError(error.message);
      console.error('Dashboard error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  const statsCards = [
    {
      title: 'Wszyscy użytkownicy',
      value: stats?.total_users || 0,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10'
    },
    {
      title: 'Studenci',
      value: stats?.total_students || 0,
      icon: '🎓',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-500/10 to-green-600/10'
    },
    {
      title: 'Nauczyciele',
      value: stats?.total_teachers || 0,
      icon: '👨‍🏫',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-600/10'
    },
    {
      title: 'Aktywni użytkownicy',
      value: stats?.active_users || 0,
      icon: '✅',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-500/10 to-emerald-600/10'
    },
    {
      title: 'Nowe rejestracje (7 dni)',
      value: stats?.recent_registrations || 0,
      icon: '📈',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-500/10 to-orange-600/10'
    }
  ];

  const adminActions = [
    {
      title: 'Zarządzaj użytkownikami',
      description: 'Przeglądaj, edytuj i zarządzaj kontami użytkowników',
      icon: '👥',
      action: () => onNavigate('admin-users'),
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Statystyki',
      description: 'Szczegółowe raporty i analizy',
      icon: '📊',
      action: () => {}, // TODO: Implement stats page
      color: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Ustawienia',
      description: 'Konfiguracja systemu i preferencje',
      icon: '⚙️',
      action: () => {}, // TODO: Implement settings page
      color: 'from-gray-500 to-slate-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full mx-auto mb-4"
          />
          <p className="text-slate-300 text-lg">Ładowanie panelu admina...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-light text-white mb-2"
              >
                Panel Administratora
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400"
              >
                Witaj {user?.name}, zarządzaj swoją szkołą muzyczną
              </motion.p>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('home')}
                className="border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
              >
                Powrót do strony
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                Wyloguj się
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Cards */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-light text-white mb-6">Statystyki</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {statsCards.map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`bg-gradient-to-br ${card.bgColor} border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{card.icon}</div>
                    <div className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                      {card.value}
                    </div>
                  </div>
                  <h3 className="text-slate-300 font-light">{card.title}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-light text-white mb-6">Szybkie akcje</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {adminActions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 cursor-pointer hover:bg-slate-800/70 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{action.icon}</div>
                  <h3 className="text-xl font-light text-white mb-2">{action.title}</h3>
                  <p className="text-slate-400 text-sm">{action.description}</p>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className={`mt-4 bg-gradient-to-r ${action.color} text-white px-4 py-2 rounded-lg font-light text-sm`}
                  >
                    Otwórz →
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Users */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-light text-white mb-6">Ostatnio zarejestrowani</h2>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-light">{user.name}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs px-2 py-1 rounded-full ${
                          user.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                          user.role === 'teacher' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {user.role}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          {new Date(user.created_at).toLocaleDateString('pl-PL')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👥</div>
                  <p className="text-slate-400">Brak ostatnich rejestracji</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* System Info */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-light text-white mb-6">Informacje systemowe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-light text-white mb-4">Wersja systemu</h3>
                <p className="text-slate-300">Artyz v1.0.0</p>
                <p className="text-slate-400 text-sm">Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}</p>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-light text-white mb-4">Status serwera</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300">Online</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">Wszystkie usługi działają prawidłowo</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;