import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";

const EnquiriesHosp = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    console.log(accessToken);

    const hospID = localStorage.getItem('hospitalId');

    console.log('Enquiry Hospi', hospID);

    const [enquiry, setEnquiry] = useState({
        Walk_in: 0,
        Social: 0,
        Calls: 0,
        App: 0,
        Total_enquiries: 0
    });

    useEffect(() => {
        const getEnquires = async () => {
            if (value) {
                try {
                    const res = await fetch(`${port}/web/hospital_dashboard_enquiry_count/${hospID}/${value}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    const totalEnquiries = data.Total_enquiries;
                    setEnquiry({
                        ...data,
                        Walk_in_percentage: totalEnquiries ? (data.Walk_in / totalEnquiries) * 100 : 0,
                        Social_percentage: totalEnquiries ? (data.Social / totalEnquiries) * 100 : 0,
                        Calls_percentage: totalEnquiries ? (data.Calls / totalEnquiries) * 100 : 0,
                        App_percentage: totalEnquiries ? (data.App / totalEnquiries) * 100 : 0,
                    });
                } catch (error) {
                    console.error("Error fetching Enquiries Data:", error);
                }
            }
        };
        getEnquires();
    }, [value]);

    const chartData = {
        series: [
            enquiry.Walk_in_percentage || 0,
            enquiry.Social_percentage || 0,
            enquiry.Calls_percentage || 0,
            enquiry.App_percentage || 0,
        ],
        options: {
            chart: {
                height: 300, // Adjust the height here
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '16px', // Adjust the font size for fitting
                        },
                        value: {
                            fontSize: '14px', // Adjust the font size for fitting
                        },
                    }
                }
            },
            labels: ['Walk-in', 'Social', 'Calls', 'App'],
        },
    };

    return (
        <Box sx={{ flexGrow: 1, width: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '8px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>ENQUIRIES</Typography>
            <Grid container spacing={1}>
                <Grid item xs={10}>
                    <Stack direction="row" justifyContent="center" spacing={2}>
                        <Box sx={{ height: '100%', width: '100%' }}>
                            <Chart
                                options={chartData.options}
                                series={chartData.series}
                                type="radialBar"
                                height="200" // Ensure the chart takes the height of the container
                                width="300"  // Ensure the chart takes the width of the container
                            />
                        </Box>
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="center">
                        <Typography variant='subtitle2' sx={{ mt: "7px" }}>TOTAL ENQUIRIES</Typography>
                        <Typography variant='h5' sx={{ fontWeight: "600", ml: "10px" }}>{enquiry.Total_enquiries}</Typography>
                    </Stack>
                </Grid>

                <Grid item xs={11}>
                    <Stack direction="row" justifyContent="space-around" sx={{ mt: "10px", width: '110%' }}>
                        <div>
                            <Typography variant='h6' sx={{ fontWeight: "600", fontSize: '18px' }}>{enquiry.Walk_in}</Typography>
                            <Typography variant='body2' sx={{ fontSize: '13px' }}>Walk-in</Typography>
                            <Box
                                sx={{
                                    m: 1,
                                    width: 30,
                                    height: 10,
                                    borderRadius: '10px',
                                    backgroundColor: '#00D5FF',
                                }}
                            />
                        </div>
                        <div>
                            <Typography variant='h6' sx={{ fontWeight: "600", fontSize: '18px' }}>{enquiry.Social}</Typography>
                            <Typography variant='body2' sx={{ fontSize: '13px' }}>Web</Typography>
                            <Box
                                sx={{
                                    m: 1,
                                    width: 30,
                                    height: 10,
                                    borderRadius: '10px',
                                    backgroundColor: '#2CDFAA',
                                }}
                            />
                        </div>
                        <div>
                            <Typography variant='h6' sx={{ fontWeight: "600", fontSize: '18px' }}>{enquiry.Calls}</Typography>
                            <Typography variant='body2' sx={{ fontSize: '13px' }}>Calls</Typography>
                            <Box
                                sx={{
                                    m: 1,
                                    width: 30,
                                    height: 10,
                                    borderRadius: '10px',
                                    backgroundColor: '#FFC300',
                                }}
                            />
                        </div>
                        <div>
                            <Typography variant='h6' sx={{ fontWeight: "600", fontSize: '18px' }}>{enquiry.App}</Typography>
                            <Typography variant='body2' sx={{ fontSize: '13px' }}>App</Typography>
                            <Box
                                sx={{
                                    m: 1,
                                    width: 30,
                                    height: 10,
                                    borderRadius: '10px',
                                    backgroundColor: '#E80054',
                                }}
                            />
                        </div>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}

export default EnquiriesHosp;
