// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      console.log('🔐 Initializing auth...');
      
      // Sprawdź czy token istnieje w localStorage
      const token = localStorage.getItem('auth_token');
      console.log('🔐 Token found:', !!token);
      
      if (!token) {
        console.log('🔐 No token found, user not authenticated');
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Sprawdź czy token jest ważny
      const currentUser = await AuthService.getCurrentUser();
      console.log('🔐 Current user response:', currentUser);
      
      if (currentUser) {
        console.log('🔐 User authenticated:', currentUser);
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        console.log('🔐 Token invalid, clearing auth');
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('🔐 Auth initialization failed:', error);
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('🔐 Auth initialization complete');
    }
  };

  const login = async (credentials) => {
    try {
      console.log('🔐 Logging in...');
      const response = await AuthService.login(credentials);
      console.log('🔐 Login response:', response);
      
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('🔐 Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const register = async (userData) => {
    console.log('🔐 Registering user:', userData);
    
    try {
      const response = await AuthService.register(userData);
      console.log('🔐 Register response:', response);
      return response;
    } catch (error) {
      console.error('🔐 Register failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🔐 Logging out...');
      await AuthService.logout();
    } catch (error) {
      console.error('🔐 Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      console.log('🔐 Logout complete');
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    initializeAuth,
    isAdmin: () => user?.role === 'admin',
    isTeacher: () => user?.role === 'teacher',
    isStudent: () => user?.role === 'student',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};