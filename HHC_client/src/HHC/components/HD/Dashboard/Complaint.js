import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Box, Grid } from '@mui/material';
import Typography from "@mui/material/Typography";

const Complaint = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [complaint, setComplaint] = useState([]);

    useEffect(() => {
        const getComplaint = async () => {
            if (value) {
                try {
                    const res = await fetch(`${port}/web/feedback_complent_dashbord_count/2/${value}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Complaint Count.........", data.complaint_count);
                    setComplaint(data.complaint_count);
                } catch (error) {
                    console.error("Error fetching Complaint Count:", error);
                }
            }
        };
        getComplaint();
    }, [value]);

    function generateSeries(complaint) {
        return [
            complaint.comp_completed ? complaint.comp_completed : 0,
            // complaint.comp_negative,
            complaint.comp_pending ? complaint.comp_pending : 0,
            complaint.comp_positive ? complaint.comp_pending : 0,
        ];
    }

    const chartData = {
        series: generateSeries(complaint),
        options: {
            chart: {
                type: 'pie',
            },
            // labels: ['Received', 'In Action', 'Resolved'],
            // labels: ['Resolved', 'Negative', 'Positive', 'Pending'],
            labels: ['Resolved', 'Positive', 'Pending'],
            legend: {
                position: 'bottom',
            },
            // colors: ['#7E41E2', '#B6034C', '#3EBAB2', '#FD7568'],
            colors: ['#7E41E2', '#3EBAB2', '#FD7568'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: false,
            },
        },
    };
    return (
        <Box sx={{ flexGrow: 1, width: "100%", }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '8px' }}>

            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>COMPLAINTS</Typography>

            <Grid item xs={12} container spacing={1} sx={{ pb: 2 }}>
                <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="pie"
                    // width="300"
                    height="250"
                />
            </Grid>
        </Box>

    )
}

export default Complaint
