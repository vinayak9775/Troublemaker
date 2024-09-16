import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";

const ServiceDetail = ({ value }) => {

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const hospID = localStorage.getItem('hospitalId'); 
    console.log('service detail', hospID);

    const [service, setService] = useState({
        Total_services: 0,
        Completed_services: {
            completed_srv: 0
        },
        Pending_services: {
            Pending_srv: 0
        },
        ongoing_services: {
            Ongoing_srv: 0
        }
    });

    useEffect(() => {
        const getServiceData = async () => {
            if (value && hospID) {
                try {
                    const res = await fetch(`${port}/web/hospital_dashboard_srv_count/${hospID}/${value}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    setService(data);
                } catch (error) {
                    console.error("Error fetching Services Data:", error);
                }
            }
        };
        getServiceData();
    }, [value, hospID]);

    function generateSeries(service) {
        return [
            service.Completed_services?.completed_srv || 0,
            service.Pending_services?.Pending_srv || 0,
            service.ongoing_services?.Ongoing_srv || 0,
        ];
    }

    const chartData = {
        series: generateSeries(service),
        options: {
            chart: {
                type: 'pie',
            },
            labels: ['Completed Services', 'Pending', 'Ongoing'],
            legend: {
                show: false,
                position: 'bottom',
                horizontalAlign: 'left',
            },
            colors: ['#D2709D', '#FECA57', '#3A0CA3'],
            dataLabels: {
                enabled: false,
                textAnchor: 'start',
                formatter: function (val, opts) {
                    return opts.w.globals.labels[opts.seriesIndex];
                },
                style: {
                    fontSize: '12px',
                },
            },
        },
    };

    return (
        <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '8px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>SESSION DETAILS</Typography>
            <Grid item xs={12} container spacing={1}>
                <Grid item lg={12} md={12} xs={12}>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="pie"
                        height="300"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 20px' }}>
                        <Typography variant='body2' align='left' sx={{ fontSize: "20px", mb: 2, fontWeight: 600 }}>Total Services</Typography>
                        <Typography variant='body2' align='right' sx={{ fontSize: "20px", mb: 2, fontWeight: 600 }}>{service.Total_services}</Typography>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 30px' }}>
                        <Typography variant='body2' align='left' sx={{ fontSize: "14px", mb: 2, fontWeight: 500 }}>Completed Services </Typography>
                        <Typography variant='body2' align='right' sx={{ fontSize: "14px", mb: 2, fontWeight: 500 }}>{service.Completed_services?.completed_srv || 0}</Typography>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 30px' }}>
                        <Typography variant='body2' align='left' sx={{ fontSize: "14px", mb: 2, fontWeight: 500 }}>Pending</Typography>
                        <Typography variant='body2' align='right' sx={{ fontSize: "14px", mb: 2, fontWeight: 500 }}>{service.Pending_services?.Pending_srv || 0}</Typography>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 30px' }}>
                        <Typography variant='body2' align='left' sx={{ fontSize: "14px", mb: 2, fontWeight: 500 }}>Ongoing</Typography>
                        <Typography variant='body2' align='right' sx={{ fontSize: "14px", mb: 2, fontWeight: 500 }}>{service.ongoing_services?.Ongoing_srv || 0}</Typography>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 30px' }}>
                        <Typography variant='body2' align='left' sx={{ fontSize: "14px", mb: 2, fontWeight: 500 }}>Schedule Service</Typography>
                        <Typography variant='body2' align='right' sx={{ fontSize: "14px", mb: 2, fontWeight: 500 }}>{service.ongoing_services?.Ongoing_srv || 0}</Typography>
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ServiceDetail;
