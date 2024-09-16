import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";

const Interview = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [interview, setInterview] = useState([]);

    useEffect(() => {
        const getInterview = async () => {
            if (value) {
                try {
                    const res = await fetch(`${port}/hr/post_interview/${value}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Interview Count.........", data);
                    setInterview(data);
                } catch (error) {
                    console.error("Error fetching Interview Count:", error);
                }
            }
        };
        getInterview();
    }, [value]);

    function generateSeries(interview) {
        return [
            interview.shortlisted || 0,
            interview.selection || 0,
            interview.rejection || 0,
        ];
    }

    const chartData = {
        series: generateSeries(interview),
        options: {
            chart: {
                type: 'pie',
            },
            // responsive: true,
            labels: ['Shortlisted', 'Selection', 'Rejection'],
            legend: {
                show: true,
                position: 'bottom',
            },
            colors: ['#FD7568', '#755CBB', '#FFA901'],
            dataLabels: {
                enabled: false,
                textAnchor: 'start',
            },
        },
    };

    return (
        <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>POST INTERVIEW SECTION</Typography>
            <Grid item xs={12} container spacing={1}>
                <Grid item lg={12} md={12} xs={12}>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="pie"
                        height="240"
                    />
                </Grid>
            </Grid>

        </Box>

    )
}

export default Interview
