import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const apiKeymap = process.env.REACT_APP_API_KEY;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [cancellationData, setCancellationData] = useState([]);
  const [error, setError] = useState(null);

  const fetchCancellationData = async (cancel_flag, month_flag,srv_flag) => {
    setError(null);
    try {
      const response = await axios.get(`${apiKeymap}/web/srv_enq_cancellation_data/`, {
        params: {
          cancel_flag,
          month_flag,
          srv_flag
        }
      });
      setCancellationData(response.data);
    //   console.log("API Response:", response);

    } catch (err) {
      setError(err.message);
    }
  };

  const handleAuth = () => {
    // setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn',setIsLoggedIn(true));
  };
  const handleAuthLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleAuth, handleAuthLogout,cancellationData, fetchCancellationData}}>
      {children}
    </AuthContext.Provider>
  );
};