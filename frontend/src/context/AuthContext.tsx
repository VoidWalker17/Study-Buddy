import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sb_auth_token'));
  const [loading, setLoading] = useState(true);

  // Sync token to axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('sb_auth_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('sb_auth_token');
    }
  }, [token]);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('sb_auth_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        if (res.data?.user) {
          setUser(res.data.user);
          setToken(savedToken);
        }
      } catch (err) {
        console.warn('Session expired or invalid, logging out.');
        setUser(null);
        setToken(null);
        localStorage.removeItem('sb_auth_token');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password: pass });
      if (res.data?.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.detail || err.message || 'Unable to connect to server.'
      };
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password: pass });
      if (res.data?.token) {
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.detail || err.message || 'Unable to register account.'
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('sb_auth_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
