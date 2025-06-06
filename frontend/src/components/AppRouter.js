import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from './common/Header/Header';
import ArtyzLoadingAnimation from './common/Loading/ArtyzLoadingAnimation';

// Public pages
import Home from '../pages/public/Home/Home';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard/AdminDashboard';
import AdminUsers from '../pages/admin/Users/AdminUsers';
import AdminRegistrations from '../pages/admin/Registrations/AdminRegistrations';

// Teacher pages
import TeacherDashboard from '../pages/teacher/Dashboard/TeacherDashboard';
import TeacherRequests from '../pages/teacher/Requests/TeacherRequests';
import TeacherCalendar from '../pages/teacher/Calendar/TeacherCalendar';

// Student pages
import StudentDashboard from '../pages/student/Dashboard/StudentDashboard';
import StudentBookLesson from '../pages/student/BookLesson/StudentBookLesson';
import StudentPendingApprovals from '../pages/student/Approvals/StudentPendingApprovals';
import StudentCalendar from '../pages/student/Calendar/StudentCalendar';

const AppRouter = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [showInitialLoading, setShowInitialLoading] = useState(true);

  useEffect(() => {
    // Jeśli auth się załadował, pokaż animację przez 2 sekundy na początku
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowInitialLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Pokaż animację loading tylko przy pierwszym ładowaniu lub gdy auth się ładuje
  if (isLoading || showInitialLoading) {
    return (
      <ArtyzLoadingAnimation 
        onComplete={() => setShowInitialLoading(false)}
      />
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        
        {/* Admin routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            isAuthenticated && user?.role === 'admin' ? 
            <AdminDashboard /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            isAuthenticated && user?.role === 'admin' ? 
            <AdminUsers /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/admin/registrations" 
          element={
            isAuthenticated && user?.role === 'admin' ? 
            <AdminRegistrations /> : 
            <Navigate to="/" />
          } 
        />
        
        {/* Teacher routes */}
        <Route 
          path="/teacher/dashboard" 
          element={
            isAuthenticated && user?.role === 'teacher' ? 
            <TeacherDashboard /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/teacher/requests" 
          element={
            isAuthenticated && user?.role === 'teacher' ? 
            <TeacherRequests /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/teacher/calendar" 
          element={
            isAuthenticated && user?.role === 'teacher' ? 
            <TeacherCalendar /> : 
            <Navigate to="/" />
          } 
        />
        
        {/* Student routes */}
        <Route 
          path="/student/dashboard" 
          element={
            isAuthenticated && user?.role === 'student' ? 
            <StudentDashboard /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/student/book-lesson" 
          element={
            isAuthenticated && user?.role === 'student' ? 
            <StudentBookLesson /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/student/approvals" 
          element={
            isAuthenticated && user?.role === 'student' ? 
            <StudentPendingApprovals /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/student/calendar" 
          element={
            isAuthenticated && user?.role === 'student' ? 
            <StudentCalendar /> : 
            <Navigate to="/" />
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;