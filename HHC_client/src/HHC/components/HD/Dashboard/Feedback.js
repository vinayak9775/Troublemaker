import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Box, Grid, Typography } from '@mui/material';

const Feedback = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        const getFeedback = async () => {
            if (value) {
                try {
                    const res = await fetch(`${port}/web/feedback_complent_dashbord_count/1/${value}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Feedback Count.........", data.feedback_count);
                    setFeedback(data.feedback_count);
                } catch (error) {
                    console.error("Error fetching Feedback Count:", error);
                }
            }
        };
        getFeedback();
    }, [value]);

    function generateSeries(feedback) {
        return [
            feedback.feed_good ? feedback.feed_good : 0,
            feedback.feed_excellent ? feedback.feed_excellent : 0,
            feedback.feed_poor ? feedback.feed_poor : 0,
        ];
    }

    const chartData = {
        series: [{ data: generateSeries(feedback) }],
        options: {
            chart: {
                height: 300,
                type: 'bar',
                toolbar: {
                    show: false,
                    tools: {
                        download: false
                    }
                }
            },
            colors: ['#FD7568', '#00E5D1', '#00B4D8'],
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: ['Good', 'Excellent', 'Average'],
            },
            grid: {
                show: false,
            },
        }
    };

    return (
        <Box sx={{ flexGrow: 1, width: "100%", }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '8px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>FEEDBACK RECEIVED</Typography>
            <Grid item xs={12} container spacing={1}>
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="bar"
                    height="210"
                />
            </Grid>
        </Box>
    )
}

export default Feedback
