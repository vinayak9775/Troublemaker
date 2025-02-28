import React, { createContext, useContext, useState,useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const accessToken = localStorage.getItem('token');
  const apiKeymap = process.env.REACT_APP_API_KEY;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);


  const [cancellationData, setCancellationData] = useState([]);
  const [error, setError] = useState(null);



  const fetchCancellationData = async (cancel_flag, month_flag,srv_flag,can_res_id,prof_alloc) => {
    setError(null);
    try {
      const accessToken = localStorage.getItem('token');
      // console.log("all data",);
      
      const response = await axios.get(`${apiKeymap}/web/srv_enq_cancellation_data/`,{
        headers: {
          Authorization: `Bearer ${accessToken}` 
        },
        params: {
          cancel_flag,
          month_flag,
          srv_flag,
          can_res_id,
          prof_alloc
        }
      });
      setCancellationData(response.data);
      console.log("API Response:", response);

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


  const [submenuData, setSubmenuData] = useState([]);

  // Function to fetch cancellation reasons
  const fetchCancellationReasons = async (id) => {
   
  
    try {
      const response = await fetch(
        `${apiKeymap}/web/cancellation_reason_follow_up_list/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include token here
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setSubmenuData(data); // Use your state update function
      } else {
        console.error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching cancellation reasons:", error);
    }
  };



 // Function to fetch services data

  // Fetch services data
  const fetchServicesData = async () => {
    console.log("Fetching services data...");
    
    try {
      const response = await axios.get(`${apiKeymap}/web/agg_hhc_services_api`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setServiceData(response.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching services data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch services data on mount
  useEffect(() => {
    fetchServicesData(); 
  }, []); 

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleAuth, handleAuthLogout,cancellationData, fetchCancellationData, submenuData, fetchCancellationReasons, fetchServicesData, serviceData}}>
      {children}
    </AuthContext.Provider>
  );
};