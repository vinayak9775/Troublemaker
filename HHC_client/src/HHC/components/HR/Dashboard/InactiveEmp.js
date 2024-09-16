import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";

const InactiveEmp = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [Interview, setService] = useState([]);

    useEffect(() => {
        const getService = async () => {
            if (value) {
                try {
                    // const res = await fetch(`${port}/web/srv_dtl_dash/${value}`);
                    const res = await fetch(`${port}/web/srv_dtl_dash/${value}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Interview Count.........", data);
                    setService(data);
                } catch (error) {
                    console.error("Error fetching Interview Count:", error);
                }
            }
        };
        getService();
    }, [value]);

    function generateSeries(Interview) {
        return [
            Interview.Completed_services?.completed_srv || 0,
            Interview.Pending_services?.Pending_srv || 0,
            Interview.ongoing_services?.Ongoing_srv || 0,
            // Interview.schedule_services || 0
        ];
    }

    const chartData = {
        // series: generateSeries(Interview),
        // options: {
        //     chart: {
        //       type: 'bar',
        //       height: 380
        //     },
        //     plotOptions: {
        //       bar: {
        //         barHeight: '100%',
        //         distributed: true,
        //         horizontal: true,
        //         dataLabels: {
        //           position: 'bottom'
        //         },
        //       }
        //     },
        // }
        series: [{
            data: [400, 430, 448, 470, 540,]
        }],
        options: {
            chart: {
                type: 'bar',
                height: 380
            },
            plotOptions: {
                bar: {
                    barHeight: '100%',
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: 'bottom'
                    },
                }
            },
            colors: ['#00E5D1', '#00B4D8', '#755CBB', '#FD7568', '#FFA901'],
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {
                    colors: ['#fff']
                },
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {
                    enabled: true
                }
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            xaxis: {
                categories: ['Private conversation', 'Fraud at pt. location', 'Absconded', 'Resigned', 'Blacklisted'],
            },
            yaxis: {
                labels: {
                    show: false
                }
            },
            title: {
                text: '200 Inactive',
                align: 'center',
                floating: true
            },
            // subtitle: {
            //     text: 'Category Names as DataLabels inside bars',
            //     align: 'center',
            // },
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return ''
                        }
                    }
                }
            }
        },
    };

    return (
        <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>INACTIVE EMPLOYEE</Typography>
            <Grid item xs={12} container spacing={1}>
                <Grid item lg={12} md={12} xs={12}>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="bar"
                        height="300"
                    />
                </Grid>
            </Grid>

        </Box>

    )
}

export default InactiveEmp
