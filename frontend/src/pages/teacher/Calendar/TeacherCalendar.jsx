import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Calendar from '../../../components/shared/Calendar/Calendar';

const TeacherCalendar = () => {  // Usuń onNavigate prop
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 pt-20"> {/* Dodaj pt-20 */}
      {/* Usuń duplicate header */}
      
      {/* Calendar Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Header w kontenerze */}
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
                Zarządzaj swoimi lekcjami i terminami
              </motion.p>
            </div>

          </div>
        </div>

        <Calendar userType="teacher" />
      </div>
    </div>
  );
};

export default TeacherCalendar;