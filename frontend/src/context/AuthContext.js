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
      // Don't set error for authentication failures
      if (error.response?.status !== 401) {
        setError(error.response?.data?.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkUser();
      } catch (error) {
        // Only log non-auth errors
        if (error.response?.status !== 401) {
          console.error('Auth initialization failed:', error);
        }
      } finally {
        setIsInitialized(true);
        setLoading(false);
      }
    };
    initializeAuth();
  }, [checkUser]);

  const login = async credentials => {
    try {
      setLoading(true);
      const res = await api.post('/api/auth/login', credentials);
      setUser(res.data.data);
      return res.data.data;
    } catch (error) {
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
      return res.data.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.post('/api/auth/logout');
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        checkUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
