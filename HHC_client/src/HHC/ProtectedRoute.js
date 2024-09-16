import React, {useEffect} from 'react';
import { Route, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ canGoBack, ...rest }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const unblock = navigate(location => {
            if (!canGoBack) {
              return null; // Block the back navigation
            }
            return location; // Allow navigation
          });
      
          return () => {
            unblock(); // Remove the block when the component unmounts
          };
        }, [canGoBack, navigate]);

    return <Route {...rest} />;
};

export default ProtectedRoute;
