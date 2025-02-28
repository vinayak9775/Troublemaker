import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, TableContainer, Table, TableHead, TableRow, TableBody, TablePagination } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import Modal from '@mui/material/Modal';
import AppBar from '@mui/material/AppBar';
import CloseIcon from '@mui/icons-material/Close';
import { display, styled } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';


const AttendenceCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "52px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        cursor: 'pointer',
    },
});
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    pt: 2,
    px: 4,
    pb: 3,
};

const Services = ({abc, allServices,servicesname, enquiry, converted, followup, cancelled, services, value, cancelledEnq ,totalServiceCount, pendinginq}) => {
    console.log(allServices.services,'allServices');
    const [cat, setCat] = useState([]);

    useEffect(() => {
        const filterAllServicesEnquiries = () => {
            if (Array.isArray(servicesname)) {
                let filtered = [];
                if (value === '1' || value === '2' || value === '3') {
                    filtered = servicesname; // Ensure it's an array of strings
                }
                setCat(filtered);
                console.log(filtered, 'filtered'); // This should log the correct service names
            } else {
                console.error('allServices.services is not an array:', servicesname);
            }
        };
        filterAllServicesEnquiries();
    }, [value, servicesname]);

    useEffect(() => {
        console.log('Updated categories:', cat);
    }, [cat]);

     
    const getservices = () => {
        if (value === '1') return servicesname;
        if (value === '2') return servicesname;
        if (value === '3') return servicesname;
        return null; // Default case if value does not match any condition
      };
    const [filteredcompletedServices, setFilteredcompletedServices] = useState([]);

    useEffect(() => {
        const filtercompletedServicesEnquiries = () => {
            let filtered = [];
            if (value === '1') filtered = allServices.complete_service.today;
            if (value === '2') filtered = allServices.complete_service.this_month;
            if (value === '3') filtered = allServices.complete_service.till_date;
            setFilteredcompletedServices(filtered || []);
            // setPage(0);
            setCat(allServices.services);
            console.log(filtered,'fillllllllllll');
        };
        filtercompletedServicesEnquiries();
    }, [value, allServices.complete_service, allServices.services]);

    const [filteredOngoingServices, setFilteredOngoingServices] = useState([]);

    useEffect(() => {
        const filterOngoingServicesEnquiries = () => {
            let filtered = [];
            if (value === '1') filtered = allServices.ongoing_service.today;
            if (value === '2') filtered = allServices.ongoing_service.this_month;
            if (value === '3') filtered = allServices.ongoing_service.till_date;
            setFilteredOngoingServices(filtered || []);
            // setPage(0);
            console.log(filtered,'fillllllllllll');
        };
        filterOngoingServicesEnquiries();
    }, [value, allServices.ongoing_service]);

    const [filteredPendingServices, setFilteredPendingServices] = useState([]);

    useEffect(() => {
        const filterPendingServicesEnquiries = () => {
            let filtered = [];
            if (value === '1') filtered = allServices.pending_service.today;
            if (value === '2') filtered = allServices.pending_service.this_month;
            if (value === '3') filtered = allServices.pending_service.till_date;
            setFilteredPendingServices(filtered || []);
            // setPage(0);
            console.log(filtered,'fillllllllllll');
        };
        filterPendingServicesEnquiries();
    }, [value, allServices.pending_service]);


    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [series, setSeries] = useState([
        {
            name: 'Completed Services',
            data: []
        },
        {
            name: 'Ongoing',
            data: []
        },
        {
            name: 'Pending',
            data: []
        },
    ]);

    useEffect(() => {
        setSeries([
            {
                name: 'Completed Services',
                data: filteredcompletedServices
            },
            {
                name: 'Ongoing',
                data: filteredOngoingServices
            },
            {
                name: 'Pending',
                data: filteredPendingServices
            },
        ]);
        console.log('Updated series:', series);
    }, [filteredcompletedServices,filteredOngoingServices, filteredPendingServices]);

    const [options] = useState({
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: { show: false },
            dropShadow: { enabled: false },
            background: 'transparent',
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '80%',
                borderRadius: 3,
                dataLabels: { total: { enabled: false } }
            },
        },
        stroke: { width: 1 },
        title: {
            text: 'SERVICE DETAILS',
            align: 'center',
            style: { fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 'bold', color: '#000000' }
        },
        xaxis: {
            // categories:  ['Healthcare attendants', 'Physician service (MBBS)', 'Physician service (MD)', 'Respiratory care', 'Nurse', 'Physician assistant', 'Physiotherapy', 'Conveyance', 'Medical transportation', 'Medical Equipment', 'Laboratory services'],
            // categories:['Healthcare attendants', 'Physician service (MBBS)', 'Physician service (MD)', 'nurseone', 'Medical Equipment', 'Respiratory care', 'Nurse', 'Physician assistant', 'Physiotherapy', 'Conveyance', 'Medical transportation', 'demo Medical Equipment', 'Laboratory services'],
           
            categories: abc,
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            title: { text: undefined },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        tooltip: {
            y: { formatter: (val) => `${val}` }
        },
        fill: { opacity: 1 },
        legend: { position: 'top', horizontalAlign: 'left' },
        colors: ['#551F9C', '#6AA5EB', '#FD7568'],
        grid: { show: false }
    });

    const [options1] = useState({
        chart: { width: 380, type: 'pie' },
        title: {
            text: 'TOTAL SERVICES',
            align: 'center',
            style: { fontFamily: 'Roboto, sans-serif', fontSize: '16px', fontWeight: 'bold', color: '#000000' }
        },
        labels: ['Completed Services', 'Ongoing', 'Pending'],
        colors: ['#6AA5EB', '#EDC50D', '#FD7568'],
        dataLabels: {
            enabled: false,
            formatter: (val, opts) => `${opts.w.globals.series[opts.seriesIndex]}%`
        },
        legend: {
            position: 'bottom',
            formatter: (seriesName, opts) => `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: { width: 200 },
                legend: { position: 'bottom' }
            }
        }],
    });

    const getEnquiryDisplay = () => {
        if (value === '1') return enquiry.today;
        if (value === '2') return enquiry.month;
        if (value === '3') return enquiry.tilldate;
        return null;
    };

    const getConvertedDisplay = () => {
        if (value === '1') return converted.today;
        if (value === '2') return converted.month;
        if (value === '3') return converted.tilldate;
        return null;
    };

    const getFollowupDisplay = () => {
        if (value === '1') return followup.today;
        if (value === '2') return followup.month;
        if (value === '3') return followup.tilldate;
        return null;
    };

    const getCancelledDisplay = () => {
        if (value === '1') return cancelled.today;
        if (value === '2') return cancelled.month;
        if (value === '3') return cancelled.tilldate;
        return null;
    };
    const getPendingDisplay = () => {
        if (value === '1') return pendinginq.today;
        if (value === '2') return pendinginq.month;
        if (value === '3') return pendinginq.tilldate;
        return null;
    };
    const getTotalServicesDisplay = () => {
        if (value === '1') return services.total_service_today;
        if (value === '2') return services.total_service_this_month;
        if (value === '3') return services.total_servces_till_date;
        return null;
    };
    //total services pie
    const getServiceDisplay = () => {
        if (value === '1') return [services?.total_completed_servces_today || 0, services?.total_ongoing_today || 0, services?.total_pending_service_today || 0];
        if (value === '2') return [services?.total_completed_servces_this_month || 0, services?.total_ongoing_this_month || 0, services?.total_pending_service_this_month || 0];
        if (value === '3') return [services?.total_completed_servces_till_date || 0, services?.total_ongoing_till_date || 0, services?.total_pending_service_till_date || 0];
        return [0, 0, 0]; // Default case if value does not match any condition
    };

    const [filteredCancelledEnq, setFilteredCancelledEnq] = useState([]);

    const [openCancel, setOpenCancel] = useState(false);
    const handleOpenCancel = () => setOpenCancel(true);
    const handleCloseCancel = () => setOpenCancel(false);

    useEffect(() => {
        const filterCancelledEnquiries = () => {
            let filtered = [];
            if (value === '1') filtered = cancelledEnq.today;
            if (value === '2') filtered = cancelledEnq.month;
            if (value === '3') filtered = cancelledEnq.tilldate;
            setFilteredCancelledEnq(filtered || []);
            setPage(0);
        };
        filterCancelledEnquiries();
    }, [value, cancelledEnq]);

    return (
        <div>
            <Grid container spacing={2} style={{ paddingLeft: '7px', paddingRight: '7px', marginTop: '-10px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        border: '1px solid #8A8A8A',
                        borderRadius: '10px',
                        marginLeft: '15px',
                        padding: '20px 0px',
                        mt: 2,
                        backgroundColor: '#FEF7F7',
                    }}
                >
                    <Grid item md={2.4} xs={6}>
                        <Card style={{ backgroundColor: '#551F9C', color: '#fff', borderRadius: '10px', margin: ' 0 15px' }}>
                            <CardContent>
                                <Typography variant="h6" component="div" style={{ fontSize: '1rem' }}>
                                    Total Enquiry
                                </Typography>
                                <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                                    {getEnquiryDisplay()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={2.4} xs={6}>
                        <Card style={{ backgroundColor: '#ED6262', color: '#fff', borderRadius: '10px', margin: ' 0 15px' }}>
                            <CardContent>
                                <Typography variant="h6" component="div" style={{ fontSize: '1rem' }}>
                                    Converted
                                </Typography>
                                <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                                    {getConvertedDisplay()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={2.4} xs={6}>
                        <Card style={{ backgroundColor: '#45BEC6', color: '#fff', borderRadius: '10px', margin: ' 0 15px' }}>
                            <CardContent>
                                <Typography variant="h6" component="div" style={{ fontSize: '1rem' }}>
                                    In follow up
                                </Typography>
                                <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                                    {getFollowupDisplay()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={2.4} xs={6}>
                        <Card style={{ backgroundColor: '#EDC50D', color: '#fff', borderRadius: '10px', margin: ' 0 15px' ,cursor:'pointer'}} onClick={handleOpenCancel}>
                            <CardContent>
                                <Typography variant="h6" component="div" style={{ fontSize: '1rem' }}>
                                    Cancelled
                                </Typography>
                                <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                                    {getCancelledDisplay()}
                                </Typography>
                                {/* <Typography variant="p" component="div" style={{ fontSize: '.5rem' }}>
                                    Click Here
                                </Typography> */}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={2.4} xs={6}>
                        <Card style={{ backgroundColor: '#06AF87', color: '#fff', borderRadius: '10px', margin: ' 0 15px' }}>
                            <CardContent>
                                <Typography variant="h6" component="div" style={{ fontSize: '1rem' }}>
                                    Pending
                                </Typography>
                                <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                                    {getPendingDisplay()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Box>
                <Grid item lg={6} md={6} xs={12}>
                    <Card sx={{
                        height: '93%', mb: 2, border: '1px solid #8A8A8A',
                        borderRadius: '10px', backgroundColor: '#F4FEFF'
                    }}>
                        <CardContent>
                            <div id="chart">
                                <ReactApexChart options={options} series={series} type="bar" height={430} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <Grid item lg={12} md={12} xs={12}>
                        <Card style={{
                            borderRadius: '10px', margin: '0', border: '1px solid #8A8A8A',
                            borderRadius: '10px', backgroundColor: '#FD7568',color:'#fff'
                        }}>
                            <CardContent>
                                <Typography variant="h6" component="div" style={{ fontSize: '1.2rem', color: '#fff' }}>
                                    Service Till Date :     {totalServiceCount}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <Card sx={{
                            height: '100%', border: '1px solid #8A8A8A',
                            borderRadius: '10px', backgroundColor: '#FEF7F7', mt: 2, mb:4
                        }}>
                            <CardContent>
                                <div id="chart">
                                    <ReactApexChart options={options1} series={getServiceDisplay()} type="pie" width={380} />
                                    <h3>Total Services: {getTotalServicesDisplay()}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>



            {/* cancelled enq modal */}
            <Grid container spacing={1}>

                <Grid item xs={12}>
                    <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>

                        <Modal
                            open={openCancel}
                            onClose={handleCloseCancel}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={{ ...style, width: 1165, borderRadius: "10px" }}>

                                <AppBar position="static" style={{
                                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                    width: '76.9rem',
                                    height: '3rem',
                                    marginTop: '-16px',
                                    marginBottom: '1rem',
                                    marginLeft: "-32px",
                                    borderRadius: "8px 10px 0 0",
                                    lineHeight: 'auto'
                                }}>
                                    <div style={{ display: "flex" }}>
                                        <Typography align="center" style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "10px", width: '300px' }}>Cancelled Enquires </Typography>
                                        <Button onClick={handleCloseCancel} sx={{ marginLeft: "56.5rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                    </div>
                                </AppBar>
                                <TableContainer sx={{ height: "73vh" }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <AttendenceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                                                        <Typography variant="subtitle2">Sr. No</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                                                        <Typography variant="subtitle2">Event ID</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                                                        <Typography variant="subtitle2">Patient Name</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                                                        <Typography variant="subtitle2">Patient Number</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                                                        <Typography variant="subtitle2">Caller Number</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                                                        <Typography variant="subtitle2">Called by Spero/Customer</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                                                        <Typography variant="subtitle2">Reasons</Typography>
                                                    </CardContent>
                                                </AttendenceCard>
                                            </TableRow>
                                        </TableHead>
                                        {loading ? (
                                            <Box sx={{ display: 'flex', mt: 15, ml: 80, height: '100px' }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : (
                                            <TableBody>
                                                {filteredCancelledEnq.length === 0 ? (
                                                    <TableRow>
                                                        <CardContent colSpan={10} >
                                                            <Typography variant="body2" textAlign={'center'}>
                                                                No Data Available
                                                            </Typography>
                                                        </CardContent>
                                                    </TableRow>
                                                ) : (
                                                    filteredCancelledEnq.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row, index) => (
                                                            <TableRow
                                                                // key={row.eve_id}
                                                                // value={row.eve_id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <AttendenceCard>
                                                                    <CardContent style={{ flex: 0.5, textAlign: 'center' }}>
                                                                        <Typography variant="body2">
                                                                            {index + 1 + page * rowsPerPage}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                                                        <Typography variant="body2">
                                                                            {row.event_id}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                                                        <Typography variant="body2">
                                                                            {row.event_id__agg_sp_pt_id__name}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                                                        <Typography variant="body2">
                                                                            {row.event_id__agg_sp_pt_id__phone_no}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                                                        <Typography variant="body2">
                                                                            {row.event_id__caller_id__phone}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 1.5, textAlign: 'center' }}>
                                                                        <Typography>
                                                                            {row.canclation_reason__cancel_by_id}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 1.5, textAlign: 'center' }}>
                                                                        <Typography variant="body2">
                                                                            {row.canclation_reason__cancelation_reason}
                                                                        </Typography>
                                                                    </CardContent>
                                                                </AttendenceCard>
                                                            </TableRow>
                                                        ))
                                                )}
                                            </TableBody>
                                        )}
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={filteredCancelledEnq.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={(event, newPage) => setPage(newPage)}
                                        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                                    />
                                </TableContainer>
                            </Box>
                        </Modal>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default Services;
