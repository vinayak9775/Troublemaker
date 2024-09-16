import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";

const NewManpower = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [manpowerCount, setManpowerCount] = useState([]);

    useEffect(() => {
        const getManpower = async () => {
            if (value) {
                try {
                    const res = await fetch(`${port}/hr/new_manpower_status/${value}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("New Manpower Count.........", data);
                    setManpowerCount(data);
                } catch (error) {
                    console.error("Error fetching New Manpower Count:", error);
                }
            }
        };
        getManpower();
    }, [value]);

    function generateSeries(manpowerCount) {
        return [
            manpowerCount.job_Applicant,
            manpowerCount.interview_scheduled,
        ];
    }


    const chartData = {
        // series: [55, 80],
        series: generateSeries(manpowerCount),
        options: {
            chart: {
                type: 'donut'
            },
            labels: ['Job Applicants', 'Interview Scheduled'],
            legend: {
                position: 'bottom',
            },
            colors: ['#FF8008', '#00C5C9'],
            dataLabels: {
                enabled: false,
            },
        }
    };
    return (
        <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>NEW MANPOWER STATUS</Typography>
            <Grid item xs={12} container spacing={1}>
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="donut"
                    height="240"
                />
            </Grid>
        </Box>
    )
}

export default NewManpower
