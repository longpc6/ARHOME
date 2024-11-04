// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kiểm tra nếu token có sẵn trong localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Giả sử user info được lưu cùng token
      const userInfo = JSON.parse(localStorage.getItem('user')); 
      setUser(userInfo);
    }
  }, []);

  const login = (userInfo) => {
    localStorage.setItem('token', userInfo.token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
