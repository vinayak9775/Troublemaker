import React, { useState, useEffect } from 'react';

const AvailabilityProgressBar = () => {
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    // Dummy data for demonstration
    const dummyData = {
      total: 20,
      available: 8,
      notAvailable: 5,
      tentativeAvailable: 7
    };

    setAvailability(dummyData);
  }, []);

  const calculateProgress = (status) => {
    if (availability.total && availability[status]) {
      return Math.floor((availability[status] / availability.total) * 100);
    }
    return 0;
  };

  const progressAvailable = calculateProgress('available');
  const progressNotAvailable = calculateProgress('notAvailable');
  const progressTentative = calculateProgress('tentativeAvailable');

  return (
    <div className="availability-progress-bar">
      <div
        className="progress-bar"
        style={{ width: `${progressAvailable}%`, backgroundColor: 'green' }}
      />
      <div
        className="progress-bar"
        style={{ width: `${progressTentative}%`, backgroundColor: 'orange' }}
      />
      <div
        className="progress-bar"
        style={{ width: `${progressNotAvailable}%`, backgroundColor: 'red' }}
      />
    </div>
  );
};

export default AvailabilityProgressBar;