import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import Loading from '../components/Loading';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkUser = useCallback(async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data.data);
    } catch (error) {
      // Don't set error if it's just an auth error
      if (error.response?.status !== 401) {
        setError(error.response?.data?.message || 'Authentication failed');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkUser();
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    initializeAuth();
  }, [checkUser]);

  const login = async credentials => {
    try {
      setLoading(true);
      const res = await api.post('/api/auth/login', credentials);
      setUser(res.data.data);
      return res.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async userData => {
    try {
      setLoading(true);
      const res = await api.post('/api/auth/register', userData);
      setUser(res.data.data);
      return res.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.get('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always redirect to login page after logout attempt
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    loading,
    error,
    isInitialized,
    login,
    register,
    logout,
    checkUser
  };

  if (!isInitialized) {
    return <Loading size="large" />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
