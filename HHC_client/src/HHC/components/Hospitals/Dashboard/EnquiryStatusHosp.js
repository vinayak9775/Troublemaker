import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";

const EnquiryStatusHosp = ({ value }) => {
    const hospID = localStorage.getItem('hospitalId'); 
    const port = process.env.REACT_APP_API_KEY;
    const token = localStorage.getItem('token');
    console.log('Enquiry Status Hospi', hospID);
    const [enqStatus, setEnqStatus] = useState({ enquiry_converted: 0, enquiry_in_follow_up: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${port}/web/hospital_dashboard_enquiry_follow_up_count/${hospID}/${value}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setEnqStatus(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [hospID, value, token]);

    const chartData = {
        series: [enqStatus.enquiry_converted, enqStatus.enquiry_in_follow_up],
        options: {
            chart: {
                type: 'donut',
            },
            legend: {
                show: false,
            },
            colors: ['#2EAED6', '#FF8008'],
            dataLabels: {
                enabled: false,
            },
            labels: ['Converted', 'In Follow up'],
        },
    };

    return (
        <Box sx={{ flexGrow: 1, width: "100%", background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '8px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>ENQUIRY STATUS</Typography>
            <Grid container spacing={1} alignItems="center" justifyContent="center">
                <Grid item xs={6}>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="donut"
                        height="150"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Box display="flex" flexDirection="column" alignItems="flex-start" pl="10px">
                        <Box display="flex" alignItems="center" mb={1}>
                            <Box sx={{ width: 10, height: 10, bgcolor: '#2EAED6', borderRadius: '50%', mr: 1 }} />
                            <Typography sx={{ fontSize: '13px' }}>Converted: {enqStatus.enquiry_converted}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Box sx={{ width: 10, height: 10, bgcolor: '#FF8008', borderRadius: '50%', mr: 1 }} />
                            <Typography sx={{ fontSize: '13px' }}>In Follow up: {enqStatus.enquiry_in_follow_up}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default EnquiryStatusHosp;
