// src/pages/teacher/Dashboard/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import AuthService from '../../../services/AuthService';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayLessons, setTodayLessons] = useState([]);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper functions
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return 'border-yellow-500 text-yellow-300 bg-yellow-500/20';
      case 'scheduled':
        return 'border-blue-500 text-blue-300 bg-blue-500/20';
      case 'completed':
        return 'border-green-500 text-green-300 bg-green-500/20';
      case 'cancelled':
        return 'border-red-500 text-red-300 bg-red-500/20';
      case 'rescheduled':
        return 'border-orange-500 text-orange-300 bg-orange-500/20';
      default:
        return 'border-slate-500 text-slate-300 bg-slate-500/20';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending':
        return 'Oczekuje';
      case 'scheduled':
        return 'Zaplanowana';
      case 'completed':
        return 'Zakończona';
      case 'cancelled':
        return 'Anulowana';
      case 'rescheduled':
        return 'Przełożona';
      default:
        return 'Nieznany';
    }
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Dzisiejsze lekcje',
      value: todayLessons?.length || 0,
      icon: '📅',
      color: 'from-blue-400 to-indigo-600',
      bgColor: 'from-blue-900/20 to-indigo-900/30'
    },
    {
      title: 'Nadchodzące lekcje',
      value: upcomingLessons?.length || 0,
      icon: '⏰',
      color: 'from-green-400 to-emerald-600',
      bgColor: 'from-green-900/20 to-emerald-900/30'
    },
    {
      title: 'Oczekujące prośby',
      value: pendingRequests?.length || 0,
      icon: '📋',
      color: 'from-yellow-400 to-orange-600',
      bgColor: 'from-yellow-900/20 to-orange-900/30'
    },
    {
      title: 'Łączne lekcje',
      value: stats?.total_lessons || 0,
      icon: '🎯',
      color: 'from-purple-400 to-violet-600',
      bgColor: 'from-purple-900/20 to-violet-900/30'
    },
    {
      title: 'Aktywni studenci',
      value: stats?.active_students || 0,
      icon: '👥',
      color: 'from-pink-400 to-rose-600',
      bgColor: 'from-pink-900/20 to-rose-900/30'
    }
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchPendingRequests();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await AuthService.apiCall('/teacher/dashboard');
      console.log('Teacher dashboard data:', data);
      
      setStats(data.stats || {});
      setTodayLessons(data.today_lessons || []);
      setUpcomingLessons(data.upcoming_lessons || []);
    } catch (error) {
      setError(error.message);
      console.error('Dashboard error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const data = await AuthService.apiCall('/teacher/pending-requests');
      setPendingRequests(data.pending_requests || []);
    } catch (error) {
      console.error('Pending requests error:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleApproveRequest = async (lessonId) => {
    try {
      const data = await AuthService.apiCall(`/teacher/lessons/${lessonId}/approve`, {
        method: 'PATCH'
      });
      console.log('Approve response:', data);
      await fetchPendingRequests();
      await fetchDashboardData();
    } catch (error) {
      console.error('Approve error:', error);
      setError(error.message);
    }
  };

  const handleRejectRequest = async (lessonId, reason) => {
    try {
      const data = await AuthService.apiCall(`/teacher/lessons/${lessonId}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason })
      });
      console.log('Reject response:', data);
      await fetchPendingRequests();
      await fetchDashboardData();
    } catch (error) {
      console.error('Reject error:', error);
      setError(error.message);
    }
  };

  const handleMarkCompleted = async (lessonId) => {
    try {
      const data = await AuthService.apiCall(`/teacher/lessons/${lessonId}/complete`, {
        method: 'PATCH'
      });
      console.log('Mark completed response:', data);
      await fetchDashboardData();
    } catch (error) {
      console.error('Mark completed error:', error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Ładowanie panelu nauczyciela...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
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
              onClick={() => navigate('/teacher/requests')}
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
                        <h3 className="text-white font-medium">{lesson.title || 'Lekcja muzyki'}</h3>
                        <p className="text-slate-400 text-sm">
                          {new Date(lesson.start_time).toLocaleTimeString('pl-PL', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {lesson.student?.name || 'Nieznany student'}
                        </p>
                        <p className="text-slate-500 text-xs">{lesson.location || 'Brak lokalizacji'}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(lesson.status)}`}>
                          {getStatusText(lesson.status)}
                        </span>
                        {lesson.status === 'scheduled' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMarkCompleted(lesson.id)}
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
                    onClick={() => navigate('/teacher/calendar')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    Zobacz kalendarz
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
                  action: () => navigate('/teacher/requests'),
                  color: 'from-blue-500 to-indigo-600',
                  highlight: pendingRequests.length > 0
                },
                {
                  title: 'Mój kalendarz',
                  description: 'Zobacz wszystkie swoje lekcje i dostępność',
                  icon: '📊',
                  action: () => navigate('/teacher/calendar'),
                  color: 'from-green-500 to-emerald-600'
                },
                {
                  title: 'Moi studenci',
                  description: 'Zarządzaj listą studentów i ich postępami',
                  icon: '👥',
                  action: () => console.log('Students page - coming soon'),
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
                        <h3 className="text-white font-medium">{lesson.title || 'Lekcja muzyki'}</h3>
                        <p className="text-slate-400 text-sm">
                          {new Date(lesson.start_time).toLocaleDateString('pl-PL')} o {new Date(lesson.start_time).toLocaleTimeString('pl-PL', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <p className="text-slate-500 text-xs">{lesson.student?.name || 'Nieznany student'} • {lesson.location || 'Brak lokalizacji'}</p>
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
                        {request.student?.name || 'Nieznany student'} - {new Date(request.start_time).toLocaleDateString('pl-PL')}
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