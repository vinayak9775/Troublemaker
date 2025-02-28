import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";

const Cancellation = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [serviceCancel, setServiceCancel] = useState([]);

    useEffect(() => {
        const getCancelService = async () => {
            if (value) {
                try {
                    // const res = await fetch(`${port}/web/srv_cancel_count_dashbord/${value}`);
                    const res = await fetch(`${port}/web/srv_cancel_count_dashbord/${value}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    // console.log("Service Cancel Count.........", data);
                    setServiceCancel(data);
                } catch (error) {
                    console.error("Error fetching Service Cancel Count:", error);
                }
            }
        };
        getCancelService();
    }, [value]);

    function generateSeries(serviceCancel) {
        return [
            serviceCancel.today_cancel_data?.cancel_by_spero_count || 0,
            serviceCancel.today_cancel_data?.cancel_by_customer_count || 0,
        ];
    }

    const chartData = {
        // series: [44, 55],
        series: generateSeries(serviceCancel),
        options: {
            chart: {
                type: 'donut'
            },
            labels: ['By Spero', 'By Customer'],
            legend: {
                position: 'bottom',
            },
            colors: ['#E80054', '#15CFCA'],
            dataLabels: {
                enabled: false,
            },
        }
    };

    return (
        <Box sx={{ flexGrow: 1, width: "100%", }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '8px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>CANCELLATION</Typography>
            <Grid item xs={12} container spacing={1} sx={{ pb: 2 }}>
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="donut"
                    height="250"
                />
            </Grid>
        </Box>
    )
}

export default Cancellation
