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
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await api.get('/api/auth/me');
        setUser(res.data.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setError(error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkUser();
      } catch (error) {
        // eslint-disable-next-line no-console
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
      const { token, ...userData } = res.data.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
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
      const res = await api.post('/api/auth/register', userData);
      localStorage.setItem('token', res.data.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.token}`;
      setUser(res.data.data);
      return res.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
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
