import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import AuthService from '../../../services/AuthService';

const AdminRegistrations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      setIsLoading(true);
      const data = await AuthService.apiCall('/admin/pending-registrations');
      console.log('Pending registrations data:', data);
      setPendingRegistrations(data.registrations || []);
    } catch (error) {
      console.error('Fetch pending registrations error:', error);
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
      await fetchPendingRegistrations();
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
      await fetchPendingRegistrations();
    } catch (error) {
      console.error('Reject error:', error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Ładowanie rejestracji...</p>
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
                Zarządzanie rejestracjami
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400"
              >
                Przeglądaj i zarządzaj oczekującymi rejestracjami
              </motion.p>
            </div>
            
          </div>
        </div>
      </div>

      {/* Content */}
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

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-2xl font-light text-white mb-6">
            Oczekujące rejestracje ({pendingRegistrations.length})
          </h2>

          {pendingRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-slate-400">Brak oczekujących rejestracji</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRegistrations.map((registration) => (
                <motion.div
                  key={registration.id}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-6 bg-orange-500/10 border border-orange-500/20 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-lg mb-2">{registration.name}</h3>
                    <p className="text-slate-400 text-sm mb-1">{registration.email}</p>
                    <p className="text-slate-400 text-sm mb-1">📞 {registration.phone}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>🎸 {registration.instrument}</span>
                      <span>📊 {registration.experience}</span>
                      <span>👤 {registration.role}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-2">
                      Zgłoszono: {new Date(registration.created_at).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApproveRegistration(registration.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Zaakceptuj</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRejectRegistration(registration.id, 'Odrzucono przez administratora')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Odrzuć</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrations;