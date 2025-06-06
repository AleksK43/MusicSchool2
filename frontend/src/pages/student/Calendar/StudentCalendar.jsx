import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Calendar from '../../../components/shared/Calendar/Calendar';

const StudentCalendar = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
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
                Zobacz swoje lekcje i terminy
              </motion.p>
            </div>

            {/* Dodaj przycisk powrotu */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/student/dashboard')}
                className="border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
              >
                Powrót do dashboardu
              </motion.button>
            </div>
          </div>
        </div>

        <Calendar userType="student" />
      </div>
    </div>
  );
};

export default StudentCalendar;