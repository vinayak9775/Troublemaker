import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";

const Enquirystatus = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [enqStatus, setEnqStatus] = useState([]);

    useEffect(() => {
        const getEnqStatus = async () => {
            if (value) {
                try {
                    // const res = await fetch(`${port}/web/Dashboard_enquiry_status_count_api/${value}`);
                    const res = await fetch(`${port}/web/Dashboard_enquiry_status_count_api/${value}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    // console.log("Enquiries Status Count.........", data);
                    setEnqStatus(data);
                } catch (error) {
                    console.error("Error fetching Enquiries Status Count:", error);
                }
            }
        };
        getEnqStatus();
    }, [value]);

    const chartData = {
        // series: [44, 55],
        series: [],
        options: {
            chart: {
                type: 'donut'
            },

            labels: ['Converted', 'In Follow up'],
            legend: {
                position: 'top',
                // horizontalAlign: 'left',
            },
            colors: ['#2EAED6', '#FF8008'],
            dataLabels: {
                enabled: false,
            },
        }
    };

    const seriesData = [
        enqStatus["converted_to_service"],
        enqStatus["in_follow_up"],
    ];
    chartData.series = seriesData;
    return (
        <Box sx={{ flexGrow: 1, width: "100%", }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '8px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>ENQUIRY STATUS</Typography>
            <Grid item xs={12} container spacing={1}>
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="donut"
                    height="220"
                />
            </Grid>
        </Box>
    )
}

export default Enquirystatus
