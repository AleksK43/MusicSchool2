import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin, onRegistrationSuccess }) => {
  const { register } = useAuth();
  const { success, error } = useNotifications();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    instrument: '',
    experience: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMessage, setError] = useState('');

  const instruments = [
    'Wokal', 'Gitara', 'Fortepian', 'Skrzypce', 'Perkusja', 
    'Bas', 'Saksofon', 'Flet', 'Inne'
  ];

  const experienceLevels = [
    'Początkujący', 'Podstawowy', 'Średniozaawansowany', 'Zaawansowany'
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
        experience: formData.experience,
        phone: formData.phone
      };

      const response = await register(registrationData);
      
      if (response.success) {
        success(response.message || 'Rejestracja została wysłana pomyślnie!');
      } else {
        error(response.message || 'Wystąpił błąd podczas rejestracji');
      }
      
      if (onRegistrationSuccess) {
        onRegistrationSuccess(response);
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
        experience: '',
        phone: ''
      });
      setStep(1);
    } catch (err) {
      error(err.message || 'Wystąpił błąd podczas rejestracji');
      setError(err.message || 'Wystąpił błąd podczas rejestracji');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Proszę wypełnić wszystkie wymagane pola');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Hasła nie są identyczne');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-light text-white mb-2">
              {step === 1 ? 'Utwórz konto' : 'Dodatkowe informacje'}
            </h2>
            <p className="text-slate-400 text-sm">
              {step === 1 ? 'Rozpocznij swoją muzyczną przygodę' : 'Uzupełnij swój profil'}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step >= 1 ? 'bg-blue-400' : 'bg-slate-600'
              }`}></div>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step >= 2 ? 'bg-blue-400' : 'bg-slate-600'
              }`}></div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); step === 2 ? handleSubmit() : nextStep(); }}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">
                      Imię *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                      placeholder="Jan"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 text-sm font-light mb-2">
                      Nazwisko *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                      placeholder="Kowalski"
                      required
                    />
                  </div>
                </div>

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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="jan@example.com"
                    required
                  />
                </div>

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
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-light mb-2">
                    Potwierdź hasło *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
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
                    {instruments.map(instrument => (
                      <option key={instrument} value={instrument}>{instrument}</option>
                    ))}
                  </motion.select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-light mb-2">
                    Poziom zaawansowania
                  </label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                  >
                    <option value="">Wybierz poziom</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </motion.select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-light mb-2">
                    Telefon (opcjonalnie)
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="123 456 789"
                  />
                </div>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
              >
                {errorMessage}
              </motion.div>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={prevStep}
                  className="border border-slate-600 text-slate-300 px-6 py-3 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                >
                  Wstecz
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Przetwarzanie...</span>
                  </div>
                ) : step === 2 ? 'Zarejestruj się' : 'Dalej'}
              </motion.button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Masz już konto?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Zaloguj się
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegisterModal;