// src/pages/admin/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import AuthService from '../../../services/AuthService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNavMenu, setShowNavMenu] = useState(false);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await AuthService.apiCall('/admin/dashboard');
      
      console.log('Dashboard data received:', data);
      
      setStats(data.stats);
      setRecentUsers(data.recent_users);
      setPendingRegistrations(data.pending_registrations || []);
    } catch (error) {
      console.error('Dashboard error details:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRegistration = async (registrationId) => {
    try {
      const data = await AuthService.apiCall(`/admin/registrations/${registrationId}/approve`, {
        method: 'PATCH'
      });
      
      console.log('Approve response:', data);
      fetchDashboardData(); // Odśwież dane
    } catch (error) {
      console.error('Approve error:', error);
      setError(error.message);
    }
  };

  const handleRejectRegistration = async (registrationId, reason) => {
    try {
      const data = await AuthService.apiCall(`/admin/registrations/${registrationId}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason })
      });
      
      console.log('Reject response:', data);
      fetchDashboardData(); // Odśwież dane
    } catch (error) {
      console.error('Reject error:', error);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Wystąpił błąd podczas wylogowywania');
    }
  };

  const handleNavigation = (page) => {
    switch(page) {
      case 'admin-users':
        navigate('/admin/users');
        break;
      case 'admin-registrations':
        navigate('/admin/registrations');
        break;
      case 'admin-lessons':
        // TODO: Implement lessons page
        console.log('Lessons page - coming soon');
        break;
      case 'admin-reports':
        // TODO: Implement reports page
        console.log('Reports page - coming soon');
        break;
      case 'admin-settings':
        // TODO: Implement settings page
        console.log('Settings page - coming soon');
        break;
      default:
        break;
    }
    setShowNavMenu(false); // Zamknij menu po kliknięciu
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
      title: 'Oczekujące rejestracje',
      value: stats?.pending_registrations || 0,
      icon: '⏳',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-500/10 to-orange-600/10'
    }
  ];

  const adminActions = [
    {
      title: 'Zarządzaj użytkownikami',
      description: 'Przeglądaj, edytuj i zarządzaj kontami użytkowników',
      icon: '👥',
      action: () => navigate('/admin/users'), // Popraw nawigację
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Statystyki',
      description: 'Szczegółowe raporty i analizy',
      icon: '📊',
      action: () => console.log('Stats page - coming soon'), // TODO: Implement
      color: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Ustawienia',
      description: 'Konfiguracja systemu i preferencje',
      icon: '⚙️',
      action: () => console.log('Settings page - coming soon'), // TODO: Implement
      color: 'from-gray-500 to-slate-600'
    }
  ];

  const adminNavItems = [
    {
      name: 'Użytkownicy',
      key: 'admin-users',
      icon: '👥',
      color: 'text-blue-400'
    },
    {
      name: 'Rejestracje',
      key: 'admin-registrations',
      icon: '📋',
      color: 'text-orange-400',
      badge: pendingRegistrations.length
    },
    {
      name: 'Lekcje',
      key: 'admin-lessons',
      icon: '📚',
      color: 'text-green-400'
    },
    {
      name: 'Raporty',
      key: 'admin-reports',
      icon: '📊',
      color: 'text-purple-400'
    },
    {
      name: 'Ustawienia',
      key: 'admin-settings',
      icon: '⚙️',
      color: 'text-slate-400'
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
    <div className="min-h-screen bg-slate-900 pt-20"> {/* Dodaj pt-20 dla fixed header */}
      
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

        {/* Pending Registrations Alert */}
        {pendingRegistrations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg"
          >
            <h3 className="text-orange-300 font-medium mb-2">
              Nowe rejestracje ({pendingRegistrations.length})
            </h3>
            <p className="text-orange-200/80 text-sm mb-3">
              Użytkownicy czekają na akceptację swoich kont.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin/registrations')} // Popraw nawigację
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
            >
              Zobacz rejestracje
            </motion.button>
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

          {/* Pending Registrations */}
          {pendingRegistrations.length > 0 && (
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-light text-white mb-6">Oczekujące rejestracje</h2>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <div className="space-y-4">
                  {pendingRegistrations.map((registration) => (
                    <motion.div
                      key={registration.id}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg"
                    >
                      <div>
                        <h3 className="text-white font-medium">{registration.name}</h3>
                        <p className="text-slate-400 text-sm">{registration.email}</p>
                        <p className="text-slate-500 text-xs">
                          {registration.instrument} • {registration.experience}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApproveRegistration(registration.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-all duration-300"
                        >
                          Zaakceptuj
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRejectRegistration(registration.id, 'Brak szczegółów')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-all duration-300"
                        >
                          Odrzuć
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

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