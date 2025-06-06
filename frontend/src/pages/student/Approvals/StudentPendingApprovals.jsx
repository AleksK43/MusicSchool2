// src/pages/student/Approvals/StudentPendingApprovals.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import AuthService from '../../../services/AuthService';

const StudentPendingApprovals = ({ onNavigate }) => {
  const { user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.apiCall('/student/pending-approvals');
      
      if (response.ok) {
        const data = await response.json();
        setPendingApprovals(data.pending_approvals);
      } else {
        throw new Error('Nie udało się pobrać oczekujących zatwierdzeń');
      }
    } catch (error) {
      setError(error.message);
      console.error('Fetch approvals error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveReschedule = async (lessonId) => {
    try {
      setActionLoading(true);
      const response = await AuthService.apiCall(`/student/lessons/${lessonId}/approve-reschedule`, {
        method: 'PATCH'
      });

      if (response.ok) {
        await fetchPendingApprovals();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nie udało się zatwierdzić zmiany terminu');
      }
    } catch (error) {
      setError(error.message);
      console.error('Approve reschedule error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectReschedule = async () => {
    if (!selectedApproval) return;

    try {
      setActionLoading(true);
      const response = await AuthService.apiCall(`/student/lessons/${selectedApproval.id}/reject-reschedule`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: rejectReason })
      });

      if (response.ok) {
        await fetchPendingApprovals();
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedApproval(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nie udało się odrzucić zmiany terminu');
      }
    } catch (error) {
      setError(error.message);
      console.error('Reject reschedule error:', error);
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
          <p className="text-slate-300 text-lg">Ładowanie oczekujących zatwierdzeń...</p>
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
                Oczekujące zatwierdzenia
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400"
              >
                Nauczyciele zaproponowali zmiany terminów lekcji ({pendingApprovals.length} do sprawdzenia)
              </motion.p>
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

        {/* Pending Approvals List */}
        {pendingApprovals.length > 0 ? (
          <div className="space-y-6">
            {pendingApprovals.map((approval) => {
              const newDateTime = formatDateTime(approval.start_time);
              const endTime = new Date(approval.end_time).toLocaleTimeString('pl-PL', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 border border-orange-500/30 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {approval.teacher?.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-white">{approval.title}</h3>
                          <p className="text-orange-400 text-sm">
                            Nauczyciel {approval.teacher?.name} zaproponował zmianę terminu
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                        {/* Current/New Schedule */}
                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <h4 className="text-green-400 font-medium mb-3 flex items-center">
                            <span className="mr-2">✨</span>
                            Nowy termin (propozycja)
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">📅</span>
                              <span className="text-slate-200">{newDateTime.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">⏰</span>
                              <span className="text-slate-200">{newDateTime.time} - {endTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">🎵</span>
                              <span className="text-slate-200">{approval.instrument}</span>
                            </div>
                          </div>
                        </div>

                        {/* Teacher's Message */}
                        {approval.notes && (
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <h4 className="text-blue-400 font-medium mb-3 flex items-center">
                              <span className="mr-2">💬</span>
                              Wiadomość od nauczyciela
                            </h4>
                            <p className="text-slate-300 italic">"{approval.notes}"</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <span>⏱️</span>
                        <span>
                          Propozycja otrzymana: {new Date(approval.updated_at).toLocaleDateString('pl-PL')} o {new Date(approval.updated_at).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3 ml-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApproveReschedule(approval.id)}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <span>✅</span>
                        <span>Akceptuję nowy termin</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedApproval(approval);
                          setShowRejectModal(true);
                        }}
                        disabled={actionLoading}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                      >
                        <span>❌</span>
                        <span>Odrzuć zmianę</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-300 text-sm flex items-center">
                      <span className="mr-2">⚠️</span>
                      Jeśli odrzucisz zmianę terminu, lekcja zostanie anulowana. Możesz następnie umówić nową lekcję.
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-2xl font-light text-white mb-4">Brak oczekujących zatwierdzeń</h2>
            <p className="text-slate-400 mb-8">
              Aktualnie nie masz żadnych propozycji zmian terminów od nauczycieli.
            </p>

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
                <h3 className="text-2xl font-light text-white mb-6">Odrzuć zmianę terminu</h3>
                <p className="text-slate-300 mb-4">
                  Czy na pewno chcesz odrzucić propozycję zmiany terminu od {selectedApproval?.teacher?.name}?
                </p>
                
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ Odrzucenie spowoduje anulowanie lekcji. Będziesz musiał/a umówić nową lekcję.
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-slate-300 text-sm font-light mb-2">
                    Powód odrzucenia (opcjonalnie)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Wyjaśnij nauczycielowi dlaczego odrzucasz zmianę..."
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
                    onClick={handleRejectReschedule}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {actionLoading ? 'Odrzucanie...' : 'Odrzuć zmianę'}
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

export default StudentPendingApprovals;