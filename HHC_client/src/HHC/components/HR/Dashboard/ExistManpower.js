import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";

const ExistManpower = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [existMan, setExistMan] = useState([]);

    useEffect(() => {
        const getExistMan = async () => {
            if (value) {
                try {
                    const res = await fetch(`${port}/hr/Total_employee/${value}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Enquiries Data.........", data);
                    setExistMan(data);
                } catch (error) {
                    console.error("Error fetching Enquiries Data:", error);
                }
            }
        };
        getExistMan();
    }, [value]);

    function generateSeries(existMan) {
        return [
            existMan.fulltime || 0,
            existMan.oncall || 0,
        ];
    }

    const chartData = {
        series: generateSeries(existMan),
        options: {
            chart: {
                type: 'pie',
            },
            labels: ['Retainer', 'On Call'],
            legend: {
                show: true,
                position: 'right',
            },
            colors: ['#1FD0C4', '#7F69B2'],
            dataLabels: {
                enabled: false,
                textAnchor: 'start',
            },
        },
    };

    return (
        <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>EXISTING MANPOWER STATUS</Typography>
            <Grid item xs={12} container spacing={1}>
                <Grid item lg={12} md={12} xs={12}>
                    <div style={{ display: "inline-flex", alignItems: "center" }}>
                        <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} gutterBottom>{existMan.total_emp}</Typography>
                        <Typography align="left" sx={{ fontSize: 16, fontWeight: 400, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom> Total Manpower</Typography>
                    </div>

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

export default ExistManpower

