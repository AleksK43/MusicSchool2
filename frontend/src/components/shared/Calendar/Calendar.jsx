import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthService from '../../../services/AuthService';

const Calendar = ({ userType, onNavigate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayLessons, setDayLessons] = useState([]);

  useEffect(() => {
    fetchMonthLessons();
  }, [currentDate, userType]);

  const fetchMonthLessons = async () => {
    try {
      setIsLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const endpoint = userType === 'teacher' 
        ? `/teacher/calendar/${year}/${month}`
        : `/student/calendar/${year}/${month}`;
        
      const response = await AuthService.apiCall(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Calendar error:', error);
    } finally {
      setIsLoading(false);
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
    
    // Puste dni na początku miesiąca
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Dni miesiąca
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

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-500',
      'scheduled': 'bg-blue-500',
      'pending_student_approval': 'bg-orange-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500',
      'no_show': 'bg-gray-500'
    };
    return colors[status] || 'bg-blue-500';
  };

  const handleDateClick = (day) => {
    if (!day) return;
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setDayLessons(getLessonsForDay(day));
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setDayLessons([]);
  };

  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  const dayNames = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];

  const days = getDaysInMonth(currentDate);

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

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateMonth(-1)}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-all duration-300"
        >
          ←
        </motion.button>
        
        <h3 className="text-xl font-light text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateMonth(1)}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 transition-all duration-300"
        >
          →
        </motion.button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((day, index) => {
          const dayLessons = getLessonsForDay(day);
          const isToday = day && 
            new Date().getDate() === day && 
            new Date().getMonth() === currentDate.getMonth() && 
            new Date().getFullYear() === currentDate.getFullYear();

          return (
            <motion.div
              key={index}
              whileHover={day ? { scale: 1.05 } : {}}
              whileTap={day ? { scale: 0.95 } : {}}
              onClick={() => handleDateClick(day)}
              className={`
                relative h-12 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300
                ${day ? 'hover:bg-slate-700/50' : ''}
                ${isToday ? 'bg-blue-600/20 border border-blue-500/50' : ''}
                ${selectedDate && selectedDate.getDate() === day ? 'bg-slate-600/50' : ''}
              `}
            >
              {day && (
                <>
                  <span className={`text-sm ${isToday ? 'text-blue-300 font-medium' : 'text-slate-300'}`}>
                    {day}
                  </span>
                  
                  {/* Lesson indicators */}
                  {dayLessons.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {dayLessons.slice(0, 3).map((lesson, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${getStatusColor(lesson.status)}`}
                        />
                      ))}
                      {dayLessons.length > 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected Day Details */}
      <AnimatePresence>
        {selectedDate && dayLessons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-700/50 pt-4"
          >
            <h4 className="text-lg font-light text-white mb-3">
              Lekcje na {selectedDate.toLocaleDateString('pl-PL')}
            </h4>
            
            <div className="space-y-2">
              {dayLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
                >
                  <div>
                    <h5 className="text-white font-medium">{lesson.title}</h5>
                    <p className="text-slate-400 text-sm">
                      {new Date(lesson.start_time).toLocaleTimeString('pl-PL', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {new Date(lesson.end_time).toLocaleTimeString('pl-PL', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {userType === 'teacher' ? lesson.student?.name : lesson.teacher?.name}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(lesson.status)}`}>
                      {lesson.status === 'scheduled' ? 'Zaplanowana' : 
                       lesson.status === 'pending' ? 'Oczekuje' : 
                       lesson.status === 'completed' ? 'Zakończona' : lesson.status}
                    </span>
                    {lesson.price && (
                      <p className="text-slate-400 text-xs mt-1">{lesson.price} zł</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-slate-400 text-xs mb-2">Legenda:</p>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-slate-400">Zaplanowana</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-slate-400">Oczekuje</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-slate-400">Zakończona</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-slate-400">Anulowana</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;