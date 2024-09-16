import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";

const Employee = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [empRole, setEmpRole] = useState([]);

    useEffect(() => {
        const getEmpRole = async () => {
            if (value) {
                try {
                    const res = await fetch(`${port}/hr/employee_roles/${value}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Employee Role Count.........", data);
                    setEmpRole(data.message);
                } catch (error) {
                    console.error("Error fetching Employee Role Count:", error);
                }
            }
        };
        getEmpRole();
    }, [value]);

    const filteredData = empRole.filter(entry => entry.service_title !== null && entry.professional_count !== 0);

    const labels = filteredData.map(entry => entry.service_title);
    // const labels = ['Physician service (MD)', 'Healthcare attendants', 'Respiratory care', 'Nurse', 'Physician assistant', 'Physiotherapy', 'Laboratory services', 'Medical transportation', 'Medical Equipment'];
    const values = filteredData.map(entry => entry.professional_count);

    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'pie',
            },
            labels: [],
            legend: {
                show: true,
                position: 'bottom',
            },
            dataLabels: {
                enabled: false,
            },
        }
    });

    useEffect(() => {
        setChartData(prevState => ({
            ...prevState,
            series: values,
            options: {
                ...prevState.options,
                labels: labels
            }
        }));
    }, [empRole, labels, values]);

    return (
        <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>EMPLOYEE ROLES</Typography>
            <Grid item xs={12} container spacing={1}>
                <Grid item lg={12} md={12} xs={12}>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="pie"
                        height="360"
                    />

                </Grid>
            </Grid>
        </Box>

    )
}

export default Employee
