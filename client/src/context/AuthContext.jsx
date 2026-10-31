import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (name, email, password, phone) => {
    const res = await api.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
