// src/pages/teacher/Requests/TeacherRequests.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import AuthService from '../../../services/AuthService';

const TeacherRequests = ({ onNavigate }) => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rescheduleData, setRescheduleData] = useState({
    new_start_time: '',
    new_end_time: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.apiCall('/teacher/pending-requests');
      
      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data.pending_requests);
      } else {
        throw new Error('Nie udało się pobrać prośb o lekcje');
      }
    } catch (error) {
      setError(error.message);
      console.error('Fetch requests error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setActionLoading(true);
      const response = await AuthService.apiCall(`/teacher/lessons/${requestId}/approve`, {
        method: 'PATCH'
      });

      if (response.ok) {
        await fetchPendingRequests();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nie udało się zatwierdzić lekcji');
      }
    } catch (error) {
      setError(error.message);
      console.error('Approve error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      setActionLoading(true);
      const response = await AuthService.apiCall(`/teacher/lessons/${selectedRequest.id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: rejectReason })
      });

      if (response.ok) {
        await fetchPendingRequests();
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedRequest(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nie udało się odrzucić lekcji');
      }
    } catch (error) {
      setError(error.message);
      console.error('Reject error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProposeAlternative = async () => {
    if (!selectedRequest) return;

    try {
      setActionLoading(true);
      const response = await AuthService.apiCall(`/teacher/lessons/${selectedRequest.id}/propose-alternative`, {
        method: 'PATCH',
        body: JSON.stringify(rescheduleData)
      });

      if (response.ok) {
        await fetchPendingRequests();
        setShowRescheduleModal(false);
        setRescheduleData({ new_start_time: '', new_end_time: '', message: '' });
        setSelectedRequest(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nie udało się zaproponować alternatywnego terminu');
      }
    } catch (error) {
      setError(error.message);
      console.error('Propose alternative error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('pl-PL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
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
          <p className="text-slate-300 text-lg">Ładowanie prośb o lekcje...</p>
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
                Prośby o lekcje
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400"
              >
                Zarządzaj prośbami studentów o lekcje ({pendingRequests.length} oczekujących)
              </motion.p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('teacher-dashboard')}
              className="border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
            >
              Powrót do panelu
            </motion.button>
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

        {/* Requests List */}
        {pendingRequests.length > 0 ? (
          <div className="space-y-6">
            {pendingRequests.map((request) => {
              const { date, time } = formatDateTime(request.start_time);
              const endTime = new Date(request.end_time).toLocaleTimeString('pl-PL', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {request.student?.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-white">{request.student?.name}</h3>
                          <p className="text-slate-400 text-sm">Prośba o lekcję {request.instrument}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h4 className="text-slate-300 font-medium mb-2">Szczegóły terminu</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">📅</span>
                              <span className="text-slate-300">{date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">⏰</span>
                              <span className="text-slate-300">{time} - {endTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">🎵</span>
                              <span className="text-slate-300">{request.instrument}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">👥</span>
                              <span className="text-slate-300">
                                {request.lesson_type === 'individual' ? 'Indywidualna' : 'Grupowa'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {request.description && (
                          <div>
                            <h4 className="text-slate-300 font-medium mb-2">Wiadomość od studenta</h4>
                            <div className="bg-slate-700/30 rounded-lg p-4">
                              <p className="text-slate-300 italic">"{request.description}"</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <span>⏱️</span>
                        <span>Otrzymano: {new Date(request.created_at).toLocaleDateString('pl-PL')} o {new Date(request.created_at).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3 ml-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(request.id)}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <span>✅</span>
                        <span>Zatwierdź</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRescheduleModal(true);
                        }}
                        disabled={actionLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <span>🔄</span>
                        <span>Zaproponuj inny termin</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRejectModal(true);
                        }}
                        disabled={actionLoading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <span>❌</span>
                        <span>Odrzuć</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📋</div>
            <h2 className="text-2xl font-light text-white mb-4">Brak nowych prośb</h2>
            <p className="text-slate-400 mb-8">
              Aktualnie nie masz żadnych oczekujących prośb o lekcje od studentów.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('teacher-dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              Powrót do dashboardu
            </motion.button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowRejectModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-light text-white mb-6">Odrzuć prośbę</h3>
                <p className="text-slate-300 mb-4">
                  Czy na pewno chcesz odrzucić prośbę od {selectedRequest?.student?.name}?
                </p>
                
                <div className="mb-6">
                  <label className="block text-slate-300 text-sm font-light mb-2">
                    Powód odrzucenia (opcjonalnie)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Wyjaśnij studentowi powód odrzucenia..."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-red-400 focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 border border-slate-600 text-slate-300 py-3 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                  >
                    Anuluj
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {actionLoading ? 'Odrzucanie...' : 'Odrzuć prośbę'}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showRescheduleModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowRescheduleModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-light text-white mb-6">Zaproponuj alternatywny termin</h3>
                <p className="text-slate-300 mb-6">
                  Zaproponuj nowy termin dla {selectedRequest?.student?.name}
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">
                      Nowy termin rozpoczęcia
                    </label>
                    <input
                      type="datetime-local"
                      value={rescheduleData.new_start_time}
                      onChange={(e) => setRescheduleData({...rescheduleData, new_start_time: e.target.value})}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">
                      Nowy termin zakończenia
                    </label>
                    <input
                      type="datetime-local"
                      value={rescheduleData.new_end_time}
                      onChange={(e) => setRescheduleData({...rescheduleData, new_end_time: e.target.value})}
                      min={rescheduleData.new_start_time}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">
                      Wiadomość do studenta (opcjonalnie)
                    </label>
                    <textarea
                      value={rescheduleData.message}
                      onChange={(e) => setRescheduleData({...rescheduleData, message: e.target.value})}
                      rows={3}
                      placeholder="Wyjaśnij dlaczego proponujesz zmianę terminu..."
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRescheduleModal(false)}
                    className="flex-1 border border-slate-600 text-slate-300 py-3 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                  >
                    Anuluj
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleProposeAlternative}
                    disabled={actionLoading || !rescheduleData.new_start_time || !rescheduleData.new_end_time}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {actionLoading ? 'Wysyłanie...' : 'Wyślij propozycję'}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherRequests;