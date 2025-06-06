import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AuthService from '../../../services/AuthService';

const StudentBookLesson = () => {  // Usuń onNavigate prop
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    duration: 45,
    message: '',
    lesson_type: 'individual'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedTeacher && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedTeacher, selectedDate]);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('📚 Fetching teachers...');
      
      // Używamy AuthService.apiCall który już zwraca JSON
      const data = await AuthService.apiCall('/student/teachers');
      console.log('📚 Teachers response:', data);
      
      setTeachers(data.teachers || []);
    } catch (error) {
      setError(error.message);
      console.error('📚 Fetch teachers error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setError('');
      console.log('📅 Fetching available slots...');
      
      // Użyj query parametrów zamiast URL parametru
      const data = await AuthService.apiCall(
        `/student/available-slots?teacher_id=${selectedTeacher.id}&date=${selectedDate}&duration=${formData.duration}`
      );
      console.log('📅 Available slots response:', data);
      
      setAvailableSlots(data.available_slots || []);
    } catch (error) {
      setError(error.message);
      console.error('📅 Fetch slots error:', error);
      setAvailableSlots([]);
    }
  };

  const handleBookLesson = async () => {
    if (!selectedTeacher || !selectedSlot) return;

    try {
      setIsBooking(true);
      setError('');
      console.log('📝 Booking lesson...');
      
      const bookingData = {
        teacher_id: selectedTeacher.id,
        preferred_date: selectedDate,
        preferred_time: selectedSlot.start_time,
        duration: formData.duration,
        message: formData.message,
        lesson_type: formData.lesson_type
      };
      
      console.log('📝 Booking data:', bookingData);
      
      const data = await AuthService.apiCall('/student/request-lesson', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
      
      console.log('📝 Booking response:', data);
      
      // Success - redirect to dashboard
      navigate('/student/dashboard');
    } catch (error) {
      setError(error.message);
      console.error('📝 Book lesson error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 dni do przodu
    return maxDate.toISOString().split('T')[0];
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedStep1 = selectedTeacher !== null;
  const canProceedStep2 = selectedDate && selectedSlot;
  const canBookLesson = canProceedStep2 && formData.duration;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full mx-auto mb-4"
          />
          <p className="text-slate-300 text-lg">Ładowanie nauczycieli...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
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
                Umów lekcję
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400"
              >
                Wybierz nauczyciela i zarezerwuj termin na lekcję
              </motion.p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/student/dashboard')}
              className="border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
            >
              Powrót do panelu
            </motion.button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                currentStep >= step 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                  currentStep > step ? 'bg-blue-500' : 'bg-slate-700'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mb-8">
          <p className="text-slate-400">
            {currentStep === 1 && 'Wybierz nauczyciela'}
            {currentStep === 2 && 'Wybierz termin'}
            {currentStep === 3 && 'Potwierdź szczegóły'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto px-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300"
          >
            {error}
          </motion.div>
        </div>
      )}

      {/* Step Content */}
      <div className="container mx-auto px-6 pb-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Choose Teacher */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-light text-white mb-6">Wybierz nauczyciela</h2>
              
              {teachers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👨‍🏫</div>
                  <p className="text-slate-400 text-lg">Brak dostępnych nauczycieli</p>
                  <p className="text-slate-500 text-sm mt-2">Spróbuj ponownie później</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teachers.map((teacher) => (
                    <motion.div
                      key={teacher.id}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTeacher(teacher)}
                      className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                        selectedTeacher?.id === teacher.id
                          ? 'bg-blue-500/20 border border-blue-500/50 ring-2 ring-blue-500/30'
                          : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white font-bold text-lg">
                            {teacher.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">{teacher.name}</h3>
                        <p className="text-blue-400 text-sm mb-3">{teacher.instrument || 'Instrument nieokreślony'}</p>
                        {teacher.bio && (
                          <p className="text-slate-400 text-sm line-clamp-3">{teacher.bio}</p>
                        )}
                        <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-slate-500">
                          <span>📧 {teacher.email}</span>
                          {teacher.phone && <span>📞 {teacher.phone}</span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Choose Date and Time */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {selectedTeacher?.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-light text-white">Wybierz termin</h2>
                  <p className="text-slate-400">Nauczyciel: {selectedTeacher?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-light text-white mb-4">Wybierz datę</h3>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot(null);
                    }}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                  />
                  
                  {/* Duration Selection */}
                  <div className="mt-4">
                    <label className="block text-slate-300 text-sm font-light mb-2">
                      Czas trwania lekcji
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => {
                        setFormData({...formData, duration: parseInt(e.target.value)});
                        setSelectedSlot(null); // Reset slot when duration changes
                        if (selectedDate) {
                          // Refresh slots with new duration
                          fetchAvailableSlots();
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                    >
                      <option value={30}>30 minut</option>
                      <option value={45}>45 minut</option>
                      <option value={60}>60 minut</option>
                      <option value={90}>90 minut</option>
                    </select>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-light text-white mb-4">Dostępne godziny</h3>
                  {selectedDate ? (
                    availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                        {availableSlots.map((slot, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedSlot(slot)}
                            disabled={!slot.is_available}
                            className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                              selectedSlot?.start_time === slot.start_time
                                ? 'bg-blue-500 text-white'
                                : slot.is_available
                                ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700/70'
                                : 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {slot.start_time} - {slot.end_time}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">📅</div>
                        <p className="text-slate-400">Brak dostępnych terminów na wybrany dzień</p>
                        <p className="text-slate-500 text-sm mt-2">Wybierz inną datę lub zmień czas trwania lekcji</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📅</div>
                      <p className="text-slate-400">Wybierz datę, aby zobaczyć dostępne godziny</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Lesson Details and Confirmation */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-light text-white mb-6">Szczegóły lekcji</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Lesson Details Form */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-light text-white mb-4">Dodatkowe informacje</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">
                        Typ lekcji
                      </label>
                      <select
                        value={formData.lesson_type}
                        onChange={(e) => setFormData({...formData, lesson_type: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-blue-400 focus:outline-none transition-all duration-300"
                      >
                        <option value="individual">Indywidualna</option>
                        <option value="group">Grupowa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-light mb-2">
                        Wiadomość do nauczyciela (opcjonalnie)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={4}
                        placeholder="Opisz swoje potrzeby, poziom zaawansowania lub pytania..."
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none transition-all duration-300 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-light text-white mb-4">Podsumowanie</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Nauczyciel:</span>
                      <span className="text-white">{selectedTeacher?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Instrument:</span>
                      <span className="text-white">{selectedTeacher?.instrument || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Data:</span>
                      <span className="text-white">
                        {selectedDate && new Date(selectedDate).toLocaleDateString('pl-PL', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Godzina:</span>
                      <span className="text-white">{selectedSlot?.start_time} - {selectedSlot?.end_time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Czas trwania:</span>
                      <span className="text-white">{formData.duration} minut</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Typ lekcji:</span>
                      <span className="text-white">
                        {formData.lesson_type === 'individual' ? 'Indywidualna' : 'Grupowa'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      📝 Twoja prośba zostanie wysłana do nauczyciela. Otrzymasz powiadomienie o akceptacji lub propozycji innego terminu.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border border-slate-600 text-slate-300 px-6 py-3 rounded-lg hover:bg-slate-700/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Wstecz
          </motion.button>

          <div className="flex space-x-4">
            {currentStep < 3 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !canProceedStep1) ||
                  (currentStep === 2 && !canProceedStep2)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Dalej
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookLesson}
                disabled={!canBookLesson || isBooking}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? (
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    Wysyłanie prośby...
                  </div>
                ) : (
                  'Wyślij prośbę o lekcję'
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBookLesson;