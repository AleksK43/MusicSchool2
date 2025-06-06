// src/services/AuthService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api';
    this.tokenKey = 'auth_token';
  }

  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem(this.tokenKey);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    console.log('🔔 Making API call to:', url, 'with config:', config);

    try {
      const response = await fetch(url, config);
      console.log('🔔 API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('🔔 API error response:', errorData);
        
        // Sprawdź czy to błędy walidacji (422)
        if (response.status === 422 && errorData.errors) {
          const validationErrors = Object.values(errorData.errors).flat().join(', ');
          throw new Error(validationErrors);
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔔 API success response:', data);
      return data;
    } catch (error) {
      console.error('🔔 API call failed:', error);
      throw error;
    }
  }

  async register(userData) {
    console.log('🔔 AuthService.register called with:', userData);
    
    try {
      const response = await this.apiCall('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      return response;
    } catch (error) {
      console.error('🔔 AuthService.register error:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await this.apiCall('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (response.token) {
        localStorage.setItem(this.tokenKey, response.token);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.apiCall('/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(this.tokenKey);
    }
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem(this.tokenKey);
      if (!token) return null;

      const response = await this.apiCall('/user');
      return response.user;
    } catch (error) {
      localStorage.removeItem(this.tokenKey);
      return null;
    }
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();