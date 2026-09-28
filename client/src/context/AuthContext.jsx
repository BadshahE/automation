import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('autosocial_user');
    return saved ? JSON.parse(saved) : {
      id: 'u-creator-001',
      email: 'creator@brand.com',
      name: 'Alex Vance (Apex Fitness)',
      role: 'creator'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('autosocial_token') || 'demo_token');

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('autosocial_user', JSON.stringify(userData));
    localStorage.setItem('autosocial_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('autosocial_user');
    localStorage.removeItem('autosocial_token');
  };

  const switchRole = (newRole) => {
    let updatedUser;
    if (newRole === 'admin') {
      updatedUser = {
        id: 'u-admin-001',
        email: 'admin@platform.com',
        name: 'System Administrator',
        role: 'admin'
      };
    } else {
      updatedUser = {
        id: 'u-creator-001',
        email: 'creator@brand.com',
        name: 'Alex Vance (Apex Fitness)',
        role: 'creator'
      };
    }
    login(updatedUser, `demo_token_${newRole}`);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      role: user?.role || 'creator',
      login,
      logout,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
