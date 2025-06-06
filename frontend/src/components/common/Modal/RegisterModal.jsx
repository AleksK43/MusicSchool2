// src/components/common/Modal/RegisterModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin, onRegistrationSuccess }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    instrument: '',
    experience: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const instruments = [
    'Wokal', 'Gitara', 'Fortepian', 'Skrzypce', 'Perkusja', 
    'Bas', 'Saksofon', 'Flet', 'Inne'
  ];

  const experienceLevels = [
    'Początkująca', 'Podstawowy', 'Średniozaawansowany', 'Zaawansowany'
  ];

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        instrument: formData.instrument,
        phone: formData.phone
      };

      const response = await register(registrationData);
      
      if (onRegistrationSuccess) {
        onRegistrationSuccess(response.user);
      }
      
      onClose();
      
      // Reset formularza
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        instrument: '',
        experience: ''
      });
      setStep(1);
    } catch (error) {
      setError(error.message || 'Wystąpił błąd podczas rejestracji');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const validateStep1 = () => {
    return formData.firstName && formData.lastName && formData.email && 
           formData.password && formData.confirmPassword;
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

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
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
              className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-light text-white">Dołącz do Artyz</h2>
                  <p className="text-slate-400 text-sm mt-1">Krok {step} z 2</p>
                </div>
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

              <div className="mb-8">
                <div className="flex items-center">
                  <div className={`w-1/2 h-2 rounded-l-full transition-all duration-300 ${
                    step >= 1 ? 'bg-blue-500' : 'bg-slate-600'
                  }`}></div>
                  <div className={`w-1/2 h-2 rounded-r-full transition-all duration-300 ${
                    step >= 2 ? 'bg-blue-500' : 'bg-slate-600'
                  }`}></div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">Imię</label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                        placeholder="Twoje imię"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">Nazwisko</label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                        placeholder="Twoje nazwisko"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">Email</label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                        placeholder="twoj@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">Hasło</label>
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

                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">Potwierdź hasło</label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={nextStep}
                      disabled={!validateStep1()}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-light tracking-wide hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Dalej
                    </motion.button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">
                        Jakiego instrumentu chcesz się uczyć?
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

                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">
                        Jaki jest Twój poziom zaawansowania?
                      </label>
                      <motion.select
                        whileFocus={{ scale: 1.02 }}
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                      >
                        <option value="">Wybierz poziom</option>
                        {experienceLevels.map((level) => (
                          <option key={level} value={level} className="bg-slate-800">
                            {level}
                          </option>
                        ))}
                      </motion.select>
                    </div>

                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        🎵 <strong>Witaj w Artyz!</strong> Twoja muzyczna podróż rozpocznie się od bezpłatnej lekcji próbnej. 
                        Skontaktujemy się z Tobą w ciągu 24 godzin.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={prevStep}
                        className="flex-1 border border-slate-600/50 text-slate-300 py-3 rounded-lg font-light tracking-wide hover:bg-slate-700/30 transition-all duration-300"
                      >
                        Wstecz
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-light tracking-wide hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                            />
                            Rejestracja...
                          </div>
                        ) : (
                          'Zarejestruj się'
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="my-6 flex items-center">
                <div className="flex-1 h-px bg-slate-600/50"></div>
                <span className="px-4 text-slate-400 text-sm">lub</span>
                <div className="flex-1 h-px bg-slate-600/50"></div>
              </div>

              <div className="text-center">
                <span className="text-slate-400 text-sm">Masz już konto? </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={onSwitchToLogin}
                  className="text-blue-400 hover:text-blue-300 text-sm font-light transition-colors"
                >
                  Zaloguj się
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;