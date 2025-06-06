// src/pages/student/Dashboard/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import AuthService from '../../../services/AuthService';

const StudentDashboard = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayLessons, setTodayLessons] = useState([]);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [recentLessons, setRecentLessons] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchPendingApprovals();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.apiCall('/student/dashboard');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setTodayLessons(data.today_lessons);
        setUpcomingLessons(data.upcoming_lessons);
        setRecentLessons(data.recent_lessons);
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

  const fetchPendingApprovals = async () => {
    try {
      const response = await AuthService.apiCall('/student/pending-approvals');
      if (response.ok) {
        const data = await response.json();
        setPendingApprovals(data.pending_approvals);
      }
    } catch (error) {
      console.error('Pending approvals error:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  const handleApproveReschedule = async (lessonId) => {
    try {
      const response = await AuthService.apiCall(`/student/lessons/${lessonId}/approve-reschedule`, {
        method: 'PATCH'
      });

      if (response.ok) {
        fetchDashboardData();
        fetchPendingApprovals();
      }
    } catch (error) {
      console.error('Approve reschedule error:', error);
    }
  };

  const handleRejectReschedule = async (lessonId, reason) => {
    try {
      const response = await AuthService.apiCall(`/student/lessons/${lessonId}/reject-reschedule`, {
        method: 'PATCH',
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        fetchDashboardData();
        fetchPendingApprovals();
      }
    } catch (error) {
      console.error('Reject reschedule error:', error);
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
      'pending_student_approval': 'Oczekuje na Twoją akceptację',
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
      title: 'Nadchodzące lekcje',
      value: stats?.upcoming_lessons || 0,
      icon: '⏰',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-500/10 to-green-600/10'
    },
    {
      title: 'Zakończone lekcje',
      value: stats?.completed_lessons || 0,
      icon: '✅',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-600/10'
    },
    {
      title: 'Godziny nauki',
      value: Math.round(stats?.total_hours || 0),
      icon: '🎵',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-500/10 to-indigo-600/10'
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
          <p className="text-slate-300 text-lg">Ładowanie panelu studenta...</p>
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
                Panel Studenta
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400"
              >
                Witaj {user?.name}, kontynuuj swoją muzyczną podróż
              </motion.p>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('student-book-lesson')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                Umów lekcję
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

        {/* Pending Approvals Alert */}
        {pendingApprovals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg"
          >
            <h3 className="text-orange-300 font-medium mb-2">
              Wymagana akceptacja ({pendingApprovals.length})
            </h3>
            <p className="text-orange-200/80 text-sm mb-3">
              Nauczyciel zaproponował zmiany terminów lekcji. Sprawdź i zatwierdź nowe terminy.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('student-approvals')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
            >
              Zobacz zmiany
            </motion.button>
          </motion.div>
        )}

        <div className="space-y-8">
          {/* Stats Cards */}
          <div>
            <h2 className="text-2xl font-light text-white mb-6">Twoje statystyki</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                          })} - {lesson.teacher.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(lesson.status)}`}>
                          {getStatusText(lesson.status)}
                        </span>
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
                    onClick={() => onNavigate('student-book-lesson')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    Umów lekcję
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
                  title: 'Umów nową lekcję',
                  description: 'Znajdź nauczyciela i zarezerwuj termin',
                  icon: '📅',
                  action: () => onNavigate('student-book-lesson'),
                  color: 'from-blue-500 to-indigo-600'
                },
                {
                  title: 'Mój kalendarz',
                  description: 'Zobacz wszystkie swoje lekcje',
                  icon: '📊',
                  action: () => onNavigate('student-calendar'),
                  color: 'from-green-500 to-emerald-600'
                },
                {
                  title: 'Historia lekcji',
                  description: 'Przeglądaj zakończone lekcje i notatki',
                  icon: '📚',
                  action: () => onNavigate('student-lessons'),
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
                  className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 cursor-pointer hover:bg-slate-800/70 transition-all duration-300"
                >
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
                        <p className="text-slate-500 text-xs">{lesson.teacher.name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(lesson.status)}`}>
                          {getStatusText(lesson.status)}
                        </span>
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
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;