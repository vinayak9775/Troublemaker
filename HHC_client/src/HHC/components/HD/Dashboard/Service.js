import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

const Service = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [selectedSliceData, setSelectedSliceData] = useState(null);
    const [selectedSliceData, setSelectedSliceData] = useState({ label: '', value: 0 });
    const [service, setService] = useState([]);

    // console.log("Selected Slice Data...", selectedSliceData)

    useEffect(() => {
        const getService = async () => {
            if (value) {
                try {
                    const res = await fetch(`${port}/web/srv_dtl_dash/${value}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    // console.log("Service Count.........", data);
                    setService(data);
                } catch (error) {
                    console.error("Error fetching Service Count:", error);
                }
            }
        };
        getService();
    }, [value]);

    function generateSeries(service) {
        return [
            service.Completed_services?.completed_srv || 0,
            service.Pending_services?.Pending_srv || 0,
            service.ongoing_services?.Ongoing_srv || 0,
            // service.schedule_services || 0
        ];
    }

    // function generateSeries(service) {
    //     return [
    //         {
    //             name: 'Completed Services',
    //             value: service.Completed_services?.completed_srv || 0,
    //             details: {
    //                 count_physio: service.Completed_services?.comp_srv_dtl?.count_physio || 0,
    //                 count_physician: service.Completed_services?.comp_srv_dtl?.count_physician || 0,
    //                 count_heal_attend: service.Completed_services?.comp_srv_dtl?.count_heal_attend || 0,
    //                 count_X_ray: service.Completed_services?.comp_srv_dtl?.count_X_ray || 0,
    //                 count_nurse: service.Completed_services?.comp_srv_dtl?.count_nurse || 0,
    //                 count_patheylogy: service.Completed_services?.comp_srv_dtl?.count_patheylogy || 0
    //             }
    //         },
    //         {
    //             name: 'Pending',
    //             value: service.Pending_services?.Pending_srv || 0,
    //             details: {
    //                 count_physio: service.Pending_services?.pend_srv_dtl?.count_physio || 0,
    //                 count_physician: service.Pending_services?.pend_srv_dtl?.count_physician || 0,
    //                 count_heal_attend: service.Pending_services?.pend_srv_dtl?.count_heal_attend || 0,
    //                 count_X_ray: service.Pending_services?.pend_srv_dtl?.count_X_ray || 0,
    //                 count_nurse: service.Pending_services?.pend_srv_dtl?.count_nurse || 0,
    //                 count_patheylogy: service.Pending_services?.pend_srv_dtl?.count_patheylogy || 0
    //             }
    //         },
    //         {
    //             name: 'Ongoing',
    //             value: service.ongoing_services?.Ongoing_srv || 0,
    //             details: {
    //                 count_physio: service.ongoing_services?.ong_srv_dtl?.count_physio || 0,
    //                 count_physician: service.ongoing_services?.ong_srv_dtl?.count_physician || 0,
    //                 count_heal_attend: service.ongoing_services?.ong_srv_dtl?.count_heal_attend || 0,
    //                 count_X_ray: service.ongoing_services?.ong_srv_dtl?.count_X_ray || 0,
    //                 count_nurse: service.ongoing_services?.ong_srv_dtl?.count_nurse || 0,
    //                 count_patheylogy: service.ongoing_services?.ong_srv_dtl?.count_patheylogy || 0
    //             }
    //         },
    //         // { name: 'Scheduled', value: service.schedule_services || 0, details: null }
    //     ];
    // }


    const chartData = {
        series: generateSeries(service),
        // series: [],
        options: {
            chart: {
                type: 'pie',
                // events: {
                //     click: (event, chartContext, config) => {
                //         if (!config || config.dataPointIndex === undefined || config.seriesIndex === undefined) {
                //             return;
                //         }
                //         const { dataPointIndex } = config;
                //         const { labels, series } = chartContext.w.config;
                //         console.log("labels", labels);
                //         console.log("series", series);

                //         const selectedLabel = labels[dataPointIndex];
                //         const selectedValue = series[dataPointIndex];
                //         console.log("helloooo", selectedValue)
                //         setSelectedSliceData({ label: selectedLabel, value: selectedValue });
                //         setIsModalOpen(true);
                //     }
                // }
            },
            labels: ['Completed Services', 'Pending', 'Ongoing'],
            legend: {
                show: true,
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
            stroke: {
                show: false,
            },
        },
    };

    const generateDetailSeries = (service, label) => {

        if (label === "Completed_services") {
            // return Object.values(service.Completed_services?.comp_srv_dtl || {});
            return [
                service.Completed_services?.comp_srv_dtl.count_X_ray || 0,
                service.Completed_services?.comp_srv_dtl.count_heal_attend || 0,
                service.Completed_services?.comp_srv_dtl.count_nurse || 0,
                service.Completed_services?.comp_srv_dtl.count_patheylogy || 0,
                service.Completed_services?.comp_srv_dtl.count_physician || 0,
                service.Completed_services?.comp_srv_dtl.count_physio || 0,
            ];
        } else if (label === "Pending_services") {
            // return Object.values(service.Pending_services?.pend_srv_dtl || {});
            return [
                service.Pending_services?.pend_srv_dtl.count_X_ray || 0,
                service.Pending_services?.pend_srv_dtl.count_heal_attend || 0,
                service.Pending_services?.pend_srv_dtl.count_nurse || 0,
                service.Pending_services?.pend_srv_dtl.count_patheylogy || 0,
                service.Pending_services?.pend_srv_dtl.count_physician || 0,
                service.Pending_services?.pend_srv_dtl.count_physio || 0,
            ];
        } else if (label === "ongoing_services") {
            // return Object.values(service.ongoing_services?.ong_srv_dtl || {});
            return [
                service.ongoing_services?.ong_srv_dtl.count_X_ray || 0,
                service.ongoing_services?.ong_srv_dtl.count_heal_attend || 0,
                service.ongoing_services?.ong_srv_dtl.count_nurse || 0,
                service.ongoing_services?.ong_srv_dtl.count_patheylogy || 0,
                service.ongoing_services?.ong_srv_dtl.count_physician || 0,
                service.ongoing_services?.ong_srv_dtl.count_physio || 0,
            ];
        }
    };


    const detailChartData = {
        series: generateDetailSeries(service, selectedSliceData.label),
        options: {
            chart: {
                type: 'pie',
            },
            labels: ['X Ray at Home', 'Healthcare Attendants', 'Nurse', 'Pathology Laboratory', 'Physician Assistant Doctor', 'Physiotherapy'],
            legend: {
                show: true,
                position: 'bottom',
                horizontalAlign: 'left',
            },
            colors: ['#D2709D', '#FECA57', '#3A0CA3', '#00C5C9', '#B5179E', '#F72585'],
        },
    };

    return (
        <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '8px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>SESSION DETAILS</Typography>
            <Grid item xs={12} container spacing={1}>
                <Grid item lg={12} md={12} xs={12}>
                    <Typography variant='h5' sx={{ fontWeight: "600" }}>{service.Total_services}</Typography>
                    <Typography variant='subtitle2'>TOTAL SESSION</Typography>

                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="pie"
                        height="400"
                    // width="400"
                    />
                    <Typography variant='body2' align='left' sx={{ ml: 4, fontSize: "12px", mb: 2 }}>Schedule Service: {service.schedule_services}</Typography>
                    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <Box sx={{
                            width: 320, height: 320, p: 2, position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                        }}>
                            <div style={{ display: "flex" }}>
                                <Typography variant="subtitle2" sx={{ fontSize: "18px", fontWeight: "600", pt: 1, color: "gray" }}>Services: {selectedSliceData.value}</Typography>
                                <Button onClick={() => setIsModalOpen(false)} sx={{ marginLeft: "12rem", color: "gray", }}><CloseIcon /></Button>
                            </div>

                            <Chart
                                options={detailChartData.options}
                                series={detailChartData.series}
                                type="pie"
                                height="300"
                            />
                            {/* <hr /> */}
                            {/* <Typography variant="body1" sx={{ pt: 1 }}>X Ray at Home: {selectedSliceData.value}</Typography>
                            <Typography variant="body1" sx={{ pt: 1 }}>Healthcare Attendants: {selectedSliceData.value}</Typography>
                            <Typography variant="body1" sx={{ pt: 1 }}>Nurse: {selectedSliceData.value}</Typography>
                            <Typography variant="body1" sx={{ pt: 1 }}>Pathology Laboratory: {selectedSliceData.value}</Typography>
                            <Typography variant="body1" sx={{ pt: 1 }}>Physician Assistant Doctor: {selectedSliceData.value}</Typography>
                            <Typography variant="body1" sx={{ pt: 1 }}>Physiotherapy: {selectedSliceData.value}</Typography> */}
                        </Box>
                    </Modal>
                </Grid>
            </Grid>

        </Box>

    )
}

export default Service
