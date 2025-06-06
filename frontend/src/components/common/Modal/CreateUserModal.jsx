// src/components/common/Modal/CreateUserModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateUserModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit, 
  isLoading 
}) => {
  const instruments = [
    'Wokal', 'Gitara', 'Fortepian', 'Skrzypce', 'Perkusja', 
    'Bas', 'Saksofon', 'Flet', 'Inne'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-light text-white">Dodaj nowego użytkownika</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imię i nazwisko */}
                <div>
                  <label className="block text-slate-300 text-sm font-light mb-2">
                    Imię i nazwisko *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="Jan Kowalski"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-300 text-sm font-light mb-2">
                    Email *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="jan@example.com"
                  />
                </div>

                {/* Hasło */}
                <div>
                  <label className="block text-slate-300 text-sm font-light mb-2">
                    Hasło *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>

                {/* Rola */}
                <div>
                  <label className="block text-slate-300 text-sm font-light mb-2">
                    Rola *
                  </label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Nauczyciel</option>
                    <option value="admin">Administrator</option>
                  </motion.select>
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-slate-300 text-sm font-light mb-2">
                    Telefon
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="+48 123 456 789"
                  />
                </div>

                {/* Instrument */}
                <div>
                  <label className="block text-slate-300 text-sm font-light mb-2">
                    Instrument
                  </label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    name="instrument"
                    value={formData.instrument}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                  >
                    <option value="">Wybierz instrument</option>
                    {instruments.map((instrument) => (
                      <option key={instrument} value={instrument} className="bg-slate-800">
                        {instrument}
                      </option>
                    ))}
                  </motion.select>
                </div>
              </div>

              {/* Bio - pełna szerokość */}
              <div className="mt-6">
                <label className="block text-slate-300 text-sm font-light mb-2">
                  Biografia
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300 resize-none"
                  placeholder="Krótka biografia użytkownika..."
                />
              </div>

              {/* Status aktywny */}
              <div className="mt-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="text-slate-300 text-sm font-light">
                    Konto aktywne
                  </label>
                </div>
              </div>

              {/* Przyciski */}
              <div className="flex space-x-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 border border-slate-600 text-slate-300 py-3 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                >
                  Anuluj
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                      Tworzenie...
                    </div>
                  ) : (
                    'Utwórz użytkownika'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateUserModal;