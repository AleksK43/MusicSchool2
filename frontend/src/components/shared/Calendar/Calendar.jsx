import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthService from '../../../services/AuthService';

const Calendar = ({ userType }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewType, setViewType] = useState('month'); // 'month', 'week', 'day'
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchLessons();
  }, [currentDate, userType, viewType]);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      let endpoint;
      let startDate, endDate;

      if (viewType === 'month') {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        endpoint = userType === 'teacher' 
          ? `/teacher/calendar/${year}/${month}`
          : `/student/calendar/${year}/${month}`;
      } else if (viewType === 'week') {
        startDate = getStartOfWeek(currentDate).toISOString().split('T')[0];
        endDate = getEndOfWeek(currentDate).toISOString().split('T')[0];
        endpoint = userType === 'teacher' 
          ? `/teacher/calendar?start_date=${startDate}&end_date=${endDate}`
          : `/student/calendar?start_date=${startDate}&end_date=${endDate}`;
      } else { // day
        startDate = endDate = currentDate.toISOString().split('T')[0];
        endpoint = userType === 'teacher' 
          ? `/teacher/calendar?start_date=${startDate}&end_date=${endDate}`
          : `/student/calendar?start_date=${startDate}&end_date=${endDate}`;
      }
      
      console.log(`📅 Fetching ${viewType} calendar:`, endpoint);
      
      const data = await AuthService.apiCall(endpoint);
      console.log('📅 Calendar response:', data);
      
      setLessons(data.lessons || []);
    } catch (error) {
      console.error('📅 Calendar error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date) => {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  };

  const navigate = (direction) => {
    const newDate = new Date(currentDate);
    
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else { // day
      newDate.setDate(newDate.getDate() + direction);
    }
    
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const getLessonsForTimeSlot = (date, timeSlot) => {
    const slotDateTime = new Date(`${date.toISOString().split('T')[0]}T${timeSlot}:00`);
    
    return lessons.filter(lesson => {
      const lessonStart = new Date(lesson.start_time);
      const lessonEnd = new Date(lesson.end_time);
      
      return lessonStart <= slotDateTime && lessonEnd > slotDateTime;
    });
  };

  const getLessonDuration = (lesson) => {
    const start = new Date(lesson.start_time);
    const end = new Date(lesson.end_time);
    return Math.ceil((end - start) / (1000 * 60 * 30)); // 30-minute slots
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-500 border-yellow-400',
      'scheduled': 'bg-blue-500 border-blue-400',
      'pending_student_approval': 'bg-orange-500 border-orange-400',
      'completed': 'bg-green-500 border-green-400',
      'cancelled': 'bg-red-500 border-red-400',
      'no_show': 'bg-gray-500 border-gray-400',
      'rejected': 'bg-red-600 border-red-500'
    };
    return colors[status] || 'bg-blue-500 border-blue-400';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'pending': 'Oczekuje',
      'scheduled': 'Zaplanowana',
      'pending_student_approval': 'Czeka na studenta',
      'completed': 'Zakończona',
      'cancelled': 'Anulowana',
      'no_show': 'Nieobecność',
      'rejected': 'Odrzucona'
    };
    return statusTexts[status] || status;
  };

  const formatDateHeader = () => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    if (viewType === 'month') {
      return `${currentDate.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}`;
    } else if (viewType === 'week') {
      const startOfWeek = getStartOfWeek(currentDate);
      const endOfWeek = getEndOfWeek(currentDate);
      return `${startOfWeek.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('pl-PL', options);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getLessonsForDay = (day) => {
    if (!day) return [];
    
    const dayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return lessons.filter(lesson => {
      const lessonDate = new Date(lesson.start_time).toISOString().split('T')[0];
      return lessonDate === dayStr;
    });
  };

  // Zmień nazwę funkcji żeby uniknąć konfliktu
  const checkIsToday = (day) => {
    return day && 
      new Date().getDate() === day && 
      new Date().getMonth() === currentDate.getMonth() && 
      new Date().getFullYear() === currentDate.getFullYear();
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setCurrentDate(clickedDate);
    setViewType('day');
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const dayNames = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];

    return (
      <>
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day, index) => {
            const dayLessons = day ? getLessonsForDay(day) : [];
            const isDayToday = day && checkIsToday(day); // Użyj nowej nazwy

            return (
              <motion.div
                key={index}
                whileHover={day ? { scale: 1.02 } : {}}
                onClick={() => day && handleDateClick(day)}
                className={`
                  relative min-h-[100px] p-2 rounded-lg cursor-pointer transition-all duration-300 border
                  ${day ? 'hover:bg-slate-700/30 border-slate-600/30' : 'border-transparent'}
                  ${isDayToday ? 'bg-blue-600/10 border-blue-500/30' : ''}
                `}
              >
                {day && (
                  <>
                    <span className={`text-sm font-medium ${isDayToday ? 'text-blue-300' : 'text-slate-300'}`}>
                      {day}
                    </span>
                    
                    <div className="mt-1 space-y-1">
                      {dayLessons.slice(0, 3).map((lesson, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-1 rounded text-white truncate ${getStatusColor(lesson.status)}`}
                        >
                          {new Date(lesson.start_time).toLocaleTimeString('pl-PL', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} {lesson.title || 'Lekcja'}
                        </div>
                      ))}
                      {dayLessons.length > 3 && (
                        <div className="text-xs text-slate-400">
                          +{dayLessons.length - 3} więcej
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    const timeSlots = getTimeSlots();

    return (
      <div className="flex flex-col">
        {/* Week Header */}
        <div className="grid grid-cols-8 gap-2 mb-4 sticky top-0 bg-slate-800/90 z-10 py-2">
          <div className="text-sm font-medium text-slate-400 py-2">Godzina</div>
          {weekDays.map((day, index) => (
            <div key={index} className="text-center">
              <div className={`text-sm font-medium py-2 rounded-lg ${
                day.toDateString() === new Date().toDateString() 
                  ? 'text-blue-300 bg-blue-600/20' 
                  : 'text-slate-300'
              }`}>
                <div>{day.toLocaleDateString('pl-PL', { weekday: 'short' })}</div>
                <div className="text-lg">{day.getDate()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="flex-1 max-h-[600px] overflow-y-auto">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 gap-2 border-b border-slate-700/30">
              <div className="text-xs text-slate-400 py-4 text-right pr-2">
                {timeSlot}
              </div>
              {weekDays.map((day, dayIndex) => {
                const slotLessons = getLessonsForTimeSlot(day, timeSlot);
                
                return (
                  <div key={dayIndex} className="min-h-[50px] border-l border-slate-700/20 p-1">
                    {slotLessons.map((lesson) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`
                          text-xs p-2 rounded mb-1 text-white cursor-pointer
                          ${getStatusColor(lesson.status)}
                        `}
                        style={{
                          height: `${getLessonDuration(lesson) * 25}px`,
                          minHeight: '30px'
                        }}
                      >
                        <div className="font-medium truncate">
                          {lesson.title || 'Lekcja'}
                        </div>
                        <div className="truncate opacity-90">
                          {userType === 'teacher' ? lesson.student?.name : lesson.teacher?.name}
                        </div>
                        <div className="text-xs opacity-75">
                          {new Date(lesson.start_time).toLocaleTimeString('pl-PL', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const timeSlots = getTimeSlots();
    const dayLessons = lessons.filter(lesson => {
      const lessonDate = new Date(lesson.start_time).toDateString();
      return lessonDate === currentDate.toDateString();
    });

    return (
      <div className="space-y-2">
        <div className="mb-4 p-4 bg-slate-700/30 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-2">
            {currentDate.toLocaleDateString('pl-PL', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          <p className="text-slate-400">
            {dayLessons.length} {dayLessons.length === 1 ? 'lekcja' : 'lekcji'} zaplanowanych
          </p>
        </div>

        <div className="space-y-1">
          {timeSlots.map((timeSlot) => {
            const slotLessons = getLessonsForTimeSlot(currentDate, timeSlot);
            
            return (
              <div key={timeSlot} className="flex border-b border-slate-700/30">
                <div className="w-20 text-sm text-slate-400 py-4 text-right pr-4">
                  {timeSlot}
                </div>
                <div className="flex-1 min-h-[60px] p-2">
                  {slotLessons.map((lesson) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`
                        p-4 rounded-lg mb-2 border-l-4 text-white
                        ${getStatusColor(lesson.status)}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">
                            {lesson.title || 'Lekcja muzyki'}
                          </h4>
                          <p className="opacity-90">
                            {userType === 'teacher' ? lesson.student?.name : lesson.teacher?.name}
                          </p>
                          <p className="text-sm opacity-75">
                            {new Date(lesson.start_time).toLocaleTimeString('pl-PL', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - {new Date(lesson.end_time).toLocaleTimeString('pl-PL', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                          {lesson.location && (
                            <p className="text-sm opacity-75">📍 {lesson.location}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xs px-2 py-1 bg-black/20 rounded">
                            {getStatusText(lesson.status)}
                          </span>
                          {lesson.price && (
                            <p className="text-sm mt-1 opacity-75">{lesson.price} zł</p>
                          )}
                        </div>
                      </div>
                      {lesson.description && (
                        <p className="text-sm mt-2 opacity-80">{lesson.description}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full mx-auto mb-4"
          />
          <p className="text-slate-400">Ładowanie kalendarza...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-300 mb-2">Błąd ładowania kalendarza</p>
          <p className="text-slate-400 text-sm">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchLessons}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            Spróbuj ponownie
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-all duration-300"
          >
            ←
          </motion.button>
          
          <h3 className="text-xl font-light text-white">
            {formatDateHeader()}
          </h3>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(1)}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-all duration-300"
          >
            →
          </motion.button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          {['month', 'week', 'day'].map((view) => (
            <motion.button
              key={view}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewType(view)}
              className={`
                px-3 py-1 rounded-lg text-sm transition-all duration-300
                ${viewType === view 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }
              `}
            >
              {view === 'month' ? 'Miesiąc' : view === 'week' ? 'Tydzień' : 'Dzień'}
            </motion.button>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 rounded-lg text-sm bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-all duration-300"
          >
            Dziś
          </motion.button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="min-h-[400px]">
        {viewType === 'month' && renderMonthView()}
        {viewType === 'week' && renderWeekView()}
        {viewType === 'day' && renderDayView()}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <p className="text-slate-400 text-xs mb-2">Legenda:</p>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-slate-400">Zaplanowana</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span className="text-slate-400">Oczekuje</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span className="text-slate-400">Czeka na studenta</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-slate-400">Zakończona</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-slate-400">Anulowana</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;