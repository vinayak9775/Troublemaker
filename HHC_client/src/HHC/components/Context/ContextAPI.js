import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuth = () => {
    // setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn',setIsLoggedIn(true));
  };
  const handleAuthLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleAuth, handleAuthLogout}}>
      {children}
    </AuthContext.Provider>
  );
};