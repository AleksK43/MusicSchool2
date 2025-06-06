import React from 'react';
import { motion } from 'framer-motion';
import Calendar from '../../../components/shared/Calendar/Calendar';

const TeacherCalendar = ({ onNavigate }) => {
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
                Mój Kalendarz
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400"
              >
                Zarządzaj swoimi lekcjami i terminami
              </motion.p>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('teacher-dashboard')}
                className="border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
              >
                Powrót do dashboardu
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="container mx-auto px-6 py-8">
        <Calendar userType="teacher" onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default TeacherCalendar;