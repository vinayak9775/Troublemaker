import React, { useState } from 'react';
import HRNavbar from '../../HR/HRNavbar';
import MultiDatePicker from 'react-multi-date-picker';

const PaymentCancellation = () => {
    const [selectedDates, setSelectedDates] = useState([]);

    const handleDateChange = (dates) => {
        // Filter out any dates that are already present in selectedDates
        const uniqueDates = dates.filter(date => !selectedDates.includes(date));
        // Combine the unique dates with the existing selectedDates array
        const updatedSelectedDates = [...selectedDates, ...uniqueDates];
        setSelectedDates(updatedSelectedDates);
        console.log("Selected Dates:", updatedSelectedDates);
    };

    return (
        <div>
            <HRNavbar />
            PaymentCancellation
            <MultiDatePicker
                value={selectedDates}
                onChange={handleDateChange}
                format="MM/DD/YYYY"
                multiple
                range
            />
        </div>
    );
};

export default PaymentCancellation;
