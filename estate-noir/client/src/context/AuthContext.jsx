import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ps_token'));
  const [loading, setLoading] = useState(true);

  const hydrateUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await apiClient.get('/auth/me');
      setUser(data.user);
    } catch {
      setToken(null);
      localStorage.removeItem('ps_token');
      localStorage.removeItem('ps_user');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('ps_token', newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ps_token');
  };

  const patchUser = (partial) => setUser((prev) => ({ ...prev, ...partial }));

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, patchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
