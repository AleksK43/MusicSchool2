// src/pages/teacher/Dashboard/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import AuthService from '../../../services/AuthService';

const TeacherDashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayLessons, setTodayLessons] = useState([]);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchPendingRequests();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.apiCall('/teacher/dashboard');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setTodayLessons(data.today_lessons);
        setUpcomingLessons(data.upcoming_lessons);
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

  const fetchPendingRequests = async () => {
    try {
      const response = await AuthService.apiCall('/teacher/pending-requests');
      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data.pending_requests);
      }
    } catch (error) {
      console.error('Pending requests error:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  const handleApproveRequest = async (lessonId) => {
    try {
      const response = await AuthService.apiCall(`/teacher/lessons/${lessonId}/approve`, {
        method: 'PATCH'
      });

      if (response.ok) {
        fetchDashboardData();
        fetchPendingRequests();
      }
    } catch (error) {
      console.error('Approve request error:', error);
    }
  };

  const handleRejectRequest = async (lessonId, reason) => {
    try {
      const response = await AuthService.apiCall(`/teacher/lessons/${lessonId}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        fetchDashboardData();
        fetchPendingRequests();
      }
    } catch (error) {
      console.error('Reject request error:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'scheduled': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'pending_student_approval': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'completed': 'bg-green-500/20 text-green-300 border-green-500/30',
      'cancelled': 'bg-red-500/20 text-red-300 border-red-500/30',
      'no_show': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[status] || colors['scheduled'];
  };

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Oczekuje na potwierdzenie',
      'scheduled': 'Zaplanowana',
      'pending_student_approval': 'Oczekuje na akceptację studenta',
      'completed': 'Zakończona',
      'cancelled': 'Anulowana',
      'no_show': 'Nieobecność'
    };
    return texts[status] || 'Nieznany status';
  };

  const statsCards = [
    {
      title: 'Dzisiejsze lekcje',
      value: stats?.today_lessons || 0,
      icon: '📅',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10'
    },
    {
      title: 'Lekcje w tym tygodniu',
      value: stats?.week_lessons || 0,
      icon: '📊',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-500/10 to-green-600/10'
    },
    {
      title: 'Nadchodzące lekcje',
      value: stats?.upcoming_lessons || 0,
      icon: '⏰',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-600/10'
    },
    {
      title: 'Liczba studentów',
      value: stats?.total_students || 0,
      icon: '👥',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-500/10 to-indigo-600/10'
    },
    {
      title: 'Ukończone w tym miesiącu',
      value: stats?.completed_this_month || 0,
      icon: '✅',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-500/10 to-emerald-600/10'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full mx-auto mb-4"
          />
          <p className="text-slate-300 text-lg">Ładowanie panelu nauczyciela...</p>
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
                Panel Nauczyciela
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400"
              >
                Witaj {user?.name}, zarządzaj swoimi lekcjami i studentami
              </motion.p>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('teacher-create-lesson')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                Dodaj lekcję
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('teacher-calendar')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                📅 Kalendarz
              </motion.button>
              
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

        {/* Pending Requests Alert */}
        {pendingRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg"
          >
            <h3 className="text-blue-300 font-medium mb-2">
              Nowe prośby o lekcje ({pendingRequests.length})
            </h3>
            <p className="text-blue-200/80 text-sm mb-3">
              Studenci wysłali nowe prośby o lekcje. Sprawdź i zatwierdź terminy.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('teacher-requests')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
            >
              Zobacz prośby
            </motion.button>
          </motion.div>
        )}

        <div className="space-y-8">
          {/* Stats Cards */}
          <div>
            <h2 className="text-2xl font-light text-white mb-6">Twoje statystyki</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {statsCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
          </div>

          {/* Today's Lessons */}
          <div>
            <h2 className="text-2xl font-light text-white mb-6">Dzisiejsze lekcje</h2>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              {todayLessons.length > 0 ? (
                <div className="space-y-4">
                  {todayLessons.map((lesson) => (
                    <motion.div
                      key={lesson.id}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                    >
                      <div>
                        <h3 className="text-white font-medium">{lesson.title}</h3>
                        <p className="text-slate-400 text-sm">
                          {new Date(lesson.start_time).toLocaleTimeString('pl-PL', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {lesson.student?.name}
                        </p>
                        <p className="text-slate-500 text-xs">{lesson.location}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(lesson.status)}`}>
                          {getStatusText(lesson.status)}
                        </span>
                        {lesson.status === 'scheduled' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {/* Mark as completed */}}
                            className="mt-2 block bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-all duration-300"
                          >
                            Zakończ lekcję
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📅</div>
                  <p className="text-slate-400">Brak lekcji na dziś</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate('teacher-create-lesson')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    Dodaj lekcję
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-light text-white mb-6">Szybkie akcje</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Zarządzaj prośbami',
                  description: `${pendingRequests.length} oczekujących prośb o lekcje`,
                  icon: '📋',
                  action: () => onNavigate('teacher-requests'),
                  color: 'from-blue-500 to-indigo-600',
                  highlight: pendingRequests.length > 0
                },
                {
                  title: 'Mój kalendarz',
                  description: 'Zobacz wszystkie swoje lekcje i dostępność',
                  icon: '📊',
                  action: () => onNavigate('teacher-calendar'),
                  color: 'from-green-500 to-emerald-600'
                },
                {
                  title: 'Moi studenci',
                  description: 'Zarządzaj listą studentów i ich postępami',
                  icon: '👥',
                  action: () => onNavigate('teacher-students'),
                  color: 'from-purple-500 to-violet-600'
                }
              ].map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className={`relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 cursor-pointer hover:bg-slate-800/70 transition-all duration-300 ${
                    action.highlight ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                >
                  {action.highlight && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                  <div className="text-4xl mb-4">{action.icon}</div>
                  <h3 className="text-xl font-light text-white mb-2">{action.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{action.description}</p>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className={`bg-gradient-to-r ${action.color} text-white px-4 py-2 rounded-lg font-light text-sm`}
                  >
                    Otwórz →
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Lessons */}
          <div>
            <h2 className="text-2xl font-light text-white mb-6">Nadchodzące lekcje</h2>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              {upcomingLessons.length > 0 ? (
                <div className="space-y-4">
                  {upcomingLessons.map((lesson) => (
                    <motion.div
                      key={lesson.id}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                    >
                      <div>
                        <h3 className="text-white font-medium">{lesson.title}</h3>
                        <p className="text-slate-400 text-sm">
                          {new Date(lesson.start_time).toLocaleDateString('pl-PL')} o {new Date(lesson.start_time).toLocaleTimeString('pl-PL', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <p className="text-slate-500 text-xs">{lesson.student?.name} • {lesson.location}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(lesson.status)}`}>
                          {getStatusText(lesson.status)}
                        </span>
                        {lesson.price && (
                          <p className="text-slate-400 text-xs mt-1">{lesson.price} zł</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⏰</div>
                  <p className="text-slate-400">Brak nadchodzących lekcji</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-light text-white mb-6">Ostatnia aktywność</h2>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <div className="space-y-4">
                {pendingRequests.slice(0, 3).map((request) => (
                  <motion.div
                    key={request.id}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                  >
                    <div>
                      <h3 className="text-white font-medium">Nowa prośba o lekcję</h3>
                      <p className="text-slate-400 text-sm">
                        {request.student?.name} - {new Date(request.start_time).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApproveRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-all duration-300"
                      >
                        Zatwierdź
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRejectRequest(request.id, 'Brak dostępności')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-all duration-300"
                      >
                        Odrzuć
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
                
                {pendingRequests.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-slate-400">Brak nowych aktywności</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;