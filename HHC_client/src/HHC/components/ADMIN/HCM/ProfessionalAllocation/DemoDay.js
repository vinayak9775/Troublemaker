import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';

const DemoDay = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const [selectedDays, setSelectedDays] = useState([]);

    console.log(selectedDays, 'selectedDaysselectedDays');

    const isDaySelected = (day) => selectedDays.includes(day);

    const handleDayClick = (day) => {
        setSelectedDays((prevDays) => {
            const updatedDays = prevDays.includes(day)
                ? prevDays.filter(selectedDay => selectedDay !== day)
                : [...prevDays, day];

            return updatedDays;
        });
    };

    return (
        <div>
            <Box sx={{ height: 300, marginTop: '0.7rem' }}>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    {days.map((day, index) => (
                        <Grid key={index} item xs={10} sm={1.4} sx={{ paddingLeft: '4rem', marginTop: '0.5em' }}>
                            <ToggleButton
                                value={day}
                                onClick={() => handleDayClick(day)}
                                sx={{
                                    borderRadius: '0.5em',
                                    height: '55%',
                                    marginLeft: '8em',
                                    width: '5em',
                                    marginTop: '1em',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #69A5EB',
                                    backgroundColor: isDaySelected(day) ? '#69A5EB' : 'white',
                                    color: isDaySelected(day) ? 'black' : 'black',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        backgroundColor: isDaySelected(day) ? '#69A5EB' : 'white',
                                        color: isDaySelected(day) ? 'black' : 'black',
                                    },
                                }}
                            >
                                {day}
                            </ToggleButton>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    );
};

export default DemoDay;
