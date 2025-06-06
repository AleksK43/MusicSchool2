// src/components/common/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import LoginModal from '../Modal/LoginModal';
import RegisterModal from '../Modal/RegisterModal';

const Header = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  const handleNavigation = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userData) => {
    // Sprawdź czy użytkownik to admin i przekieruj
    if (userData.role === 'admin') {
      onNavigate('admin-dashboard');
    }
  };

  const handleRegistrationSuccess = (userData) => {
    // Po rejestracji również sprawdź rolę
    if (userData.role === 'admin') {
      onNavigate('admin-dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    onNavigate('home');
  };

  const navigationItems = [
    { name: 'Strona Główna', key: 'home' },
    { name: 'O Nas', key: 'about' },
    { name: 'Kursy', key: 'courses' },
    { name: 'Nauczyciele', key: 'teachers' },
    { name: 'Kontakt', key: 'contact' }
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled 
            ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-xl' 
            : 'bg-slate-900/10 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNavigation('home')}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className={`w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isScrolled ? 'shadow-lg' : ''
              }`}>
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-2xl font-light text-white tracking-wider">
                Artyz
              </h1>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  onClick={() => handleNavigation(item.key)}
                  className={`font-light tracking-wide relative group transition-all duration-300 ${
                    isScrolled 
                      ? 'text-slate-200 hover:text-white' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </motion.button>
              ))}
              
              {/* Admin Dashboard link for admins */}
              {isAuthenticated && user?.role === 'admin' && (
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  onClick={() => handleNavigation('admin-dashboard')}
                  className={`font-light tracking-wide relative group transition-all duration-300 ${
                    isScrolled 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-300 hover:text-blue-200'
                  }`}
                >
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </motion.button>
              )}
            </nav>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                /* User Menu */
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700/50 px-4 py-2 rounded-full transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white font-light">{user?.name}</span>
                    <svg 
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        showUserMenu ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl py-2"
                    >
                      <div className="px-4 py-2 border-b border-slate-700/50">
                        <p className="text-sm text-slate-400">Zalogowany jako</p>
                        <p className="text-white font-light">{user?.email}</p>
                        {user?.role && (
                          <p className="text-xs text-blue-400 uppercase tracking-wide">{user.role}</p>
                        )}
                      </div>
                      
                      {user?.role === 'admin' && (
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            handleNavigation('admin-dashboard');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>Panel Admina</span>
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          setShowUserMenu(false);
                          // Tu możesz dodać nawigację do profilu
                        }}
                        className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Mój profil</span>
                      </motion.button>
                      
                      <div className="border-t border-slate-700/50 my-1"></div>
                      
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 transition-all duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Wyloguj się</span>
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              ) : (
                /* Login/Register Buttons */
                <>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openLoginModal}
                    className={`border border-blue-400/50 text-blue-300 px-5 py-2.5 rounded-full font-light tracking-wide hover:bg-blue-400/10 hover:border-blue-400 transition-all duration-300 ${
                      isScrolled 
                        ? 'shadow-md hover:shadow-lg' 
                        : 'shadow-sm hover:shadow-md'
                    }`}
                  >
                    Zaloguj się
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openRegisterModal}
                    className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2.5 rounded-full font-light tracking-wide hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ${
                      isScrolled 
                        ? 'shadow-xl hover:shadow-2xl' 
                        : 'shadow-lg hover:shadow-xl'
                    }`}
                  >
                    Zapisz się
                  </motion.button>
                </>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="text-white p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={closeModals}
        onSwitchToRegister={openRegisterModal}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <RegisterModal 
        isOpen={isRegisterModalOpen}
        onClose={closeModals}
        onSwitchToLogin={openLoginModal}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </>
  );
};

export default Header;