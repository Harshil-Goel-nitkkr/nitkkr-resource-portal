import React, { useState, createContext, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { type: 'user' | 'admin', data: ... }
  const [loading, setLoading] = useState(false);

  // Mocking session check on load
  useEffect(() => {
    const storedUser = localStorage.getItem('nitkkr_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, type) => {
    const userObj = { ...userData, type };
    setUser(userObj);
    localStorage.setItem('nitkkr_user', JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nitkkr_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);