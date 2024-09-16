import React, { useState, useEffect } from 'react';
import { Card, Box, InputBase, Stack, CardContent, Tooltip, IconButton, CircularProgress, useMediaQuery, Modal, Typography, Table, TableBody, TableContainer, TableHead, TableRow, TablePagination, Button } from '@mui/material';
import { styled } from '@mui/system';
import Followup from './ActionComponent/Followup';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LanguageIcon from '@mui/icons-material/Language';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../../../Navbar';
import Footer from '../../../Footer';
import Header from '../../../Header';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    pt: 2,
    px: 4,
    pb: 3,
};

const EnquiryCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "54px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        // cursor: 'pointer',
    },
});

const Enquiries = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const accessHospitalID = localStorage.getItem('hospitalID') || 0;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [enq, setEnq] = useState([]);
    const [enqID, setEnqID] = useState([]);
    const [preFollowup, setPreFollowup] = useState([]);

    const [tableHeight, setTableHeight] = useState('auto');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedCallerStatus, setSelectedCallerStatus] = useState('');

    const [loading, setLoading] = useState(true);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setPage(0);
    };

    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //Code for Model
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const updateTableHeight = () => {
            const screenHeight = window.innerHeight;
            setTableHeight(`${screenHeight}px`);
        };
        updateTableHeight();
        window.addEventListener('resize', updateTableHeight);

        return () => {
            window.removeEventListener('resize', updateTableHeight);
        };
    }, []);

    useEffect(() => {
        const getEnquires = async () => {
            // if (accessHospitalID) {
            try {
                const res = await fetch(`${port}/web/Follow_Up_combined_table/${accessHospitalID}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                // console.log("Enquiries Data.........", data);
                if (data.detail === "No matching records found") {
                    setEnq([]);
                    setLoading(false);
                } else {
                    setEnq(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching Enquiries Data:", error);
                setLoading(false);
            }
            // }
        };
        getEnquires();
    }, [accessHospitalID]);

    function findPreFollowupRecords(eveId) {
        const matchingRecords = enq.find((record) => record.eve_id === eveId);
        if (matchingRecords) {
            // console.log("Previos Followup ID", matchingRecords.eve_id);
            setEnqID(matchingRecords.eve_id);
        }
    }

    useEffect(() => {
        const getPreFollowup = async () => {
            if (enqID) {
                console.log("Event ID.....", enqID)
                try {
                    const res = await fetch(`${port}/web/previous_follow_up/${enqID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    // console.log("Previous Followup Data.........", data);
                    setPreFollowup(data);
                } catch (error) {
                    console.error("Error fetching Previous Followup Data:", error);
                }
            }
        };
        getPreFollowup();
    }, [enqID]);

    // const filteredData = enq.filter((item) => {
    //     if (
    //         (selectedDate === '' || item.srv_id[0].start_date.includes(selectedDate)) &&
    //         (selectedService === '' || item.srv_id[0].srv_id.service_title.toLowerCase().includes(selectedService.toLowerCase())) &&
    //         (selectedCallerStatus === '' || selectedCallerStatus === 5 || item.patient_service_status === selectedCallerStatus)
    //     ) {
    //         return true;
    //     }
    //     return false;
    // });

    const filteredData = enq.filter((item) => {
        const hasValidService = item.srv_id && item.srv_id[0] && item.srv_id[0].srv_id;
        const hasValidStartDate = hasValidService && item.srv_id[0].start_date;

        const isDateMatch = selectedDate === '' || (hasValidStartDate && item.srv_id[0].start_date.includes(selectedDate));
        const isServiceMatch = selectedService === '' || (hasValidService && item.srv_id[0].srv_id.service_title.toLowerCase().includes(selectedService.toLowerCase()));
        const isCallerStatusMatch = selectedCallerStatus === '' || selectedCallerStatus === 5 || item.patient_service_status === selectedCallerStatus;

        return isDateMatch && isServiceMatch && isCallerStatusMatch;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Get day with leading zero
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month with leading zero
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const getEnquiryStatusTooltip = (enquiryStatus) => {
        const title =
            enquiryStatus === '1'
                ? "Follow up reschedule"
                : enquiryStatus === '2'
                    ? "Cancelled Enquiry"
                    : enquiryStatus === '3'
                        ? "Already tried to convert into service"
                        : enquiryStatus === '4'
                            ? "Follow up pending"
                            : "";

        const iconColor =
            enquiryStatus === '1'
                ? "#1342BA"
                : enquiryStatus === '2'
                    ? "#D61616"
                    : enquiryStatus === '3'
                        ? "#3D8A00"
                        : enquiryStatus === '4'
                            ? "#D61616"
                            : "#000000";

        return (
            <Tooltip title={title} arrow>
                <IconButton>
                    <CircleIcon style={{ color: iconColor, fontSize: '20px' }} />
                </IconButton>
            </Tooltip>
        );
    };

    const getCallerStatusTooltip = (callerStatus) => {
        const icon =
            callerStatus === 1
                ? <SmartphoneIcon style={{ color: "#EB8793" }} />
                : callerStatus === 2
                    ? <LanguageIcon style={{ color: "#7AB7EE" }} />
                    : callerStatus === 3
                        ? <DirectionsWalkOutlinedIcon style={{ color: "#84CDB1" }} />
                        : callerStatus === 4
                            ? <CallOutlinedIcon style={{ color: "#8D9BED" }} />
                            : callerStatus === 5
                                ? <DoneAllOutlinedIcon style={{ color: "#8D9BED" }} />
                                : <ErrorOutlineIcon style={{ color: "#EB8793" }} />;

        return (
            <IconButton>
                {icon}
            </IconButton>
        );
    };

    return (
        <>
            <Navbar />
            {/* <Header /> */}
            <Box sx={{ flexGrow: 1, mt: 14.6, ml: 1, mr: 1, mb: 2, }}>
                <Stack direction={isSmallScreen ? 'column' : 'row'}
                    spacing={1}
                    alignItems={isSmallScreen ? 'center' : 'flex-start'} sx={{ pt: 1 }}>
                    <Typography style={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>SERVICE ENQUIRIES</Typography>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, mr: 1, flex: 1 }}
                            placeholder="Select Date |  DD/MM/YYYY"
                            inputProps={{ 'aria-label': 'select date' }}
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </Box>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1, }}
                            placeholder="Search Service |"
                            inputProps={{ 'aria-label': 'select service' }}
                            value={selectedService}
                            onChange={handleServiceChange}
                        />
                        <IconButton type="button" sx={{ p: '10px' }}>
                            <SearchIcon style={{ color: "#7AB7EE" }} />
                        </IconButton>
                    </Box>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 310, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="View Enquiry by |"
                            inputProps={{ 'aria-label': 'view enquiry by' }}
                        />
                        <IconButton type="button" sx={{ p: '6px' }} aria-label="search">
                            <SmartphoneIcon style={{ color: "#EB8793" }}
                                onClick={() => setSelectedCallerStatus(1)} />
                        </IconButton>
                        <IconButton type="button" sx={{ p: '6px' }} aria-label="search">
                            <LanguageIcon style={{ color: "#7AB7EE" }}
                                onClick={() => setSelectedCallerStatus(2)} />
                        </IconButton>
                        <IconButton type="button" sx={{ p: '6px' }} aria-label="search">
                            <DirectionsWalkOutlinedIcon style={{ color: "#84CDB1" }}
                                onClick={() => setSelectedCallerStatus(3)} />
                        </IconButton>
                        <IconButton type="button" sx={{ p: '6px' }} aria-label="search">
                            <CallOutlinedIcon style={{ color: "#8D9BED" }}
                                onClick={() => setSelectedCallerStatus(4)} />
                        </IconButton>
                        <IconButton type="button" sx={{ p: '6px' }} aria-label="search">
                            <DoneAllOutlinedIcon style={{ color: "#F6900D" }}
                                onClick={() => setSelectedCallerStatus(5)} />
                        </IconButton>
                    </Box>
                </Stack >

                <TableContainer
                    sx={{ height: filteredData.length === 0 || filteredData.length < 5 ? "60vh" : "default" }}
                >
                    <Table >
                        <TableHead>
                            <TableRow >
                                <EnquiryCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 0.3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Source</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Event Code</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Patient Name</Typography>
                                    </CardContent>
                                    {/* <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Patient Mobile</Typography>
                                    </CardContent> */}
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Caller Mobile</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Service Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 0.8, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Diagnosis</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Start Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 0.8, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Zone</Typography>
                                    </CardContent>
                                    {/* <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Address</Typography>
                                    </CardContent> */}
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Status</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1 }}>
                                        <Typography variant="subtitle2">Action</Typography>
                                    </CardContent>
                                </EnquiryCard>
                            </TableRow>
                        </TableHead>
                        {loading ? (
                            <Box sx={{ display: 'flex', mt: 20, ml: 80, height: '130px', }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <CardContent >
                                            <Typography variant="body2">
                                                No Data Available
                                            </Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow
                                                key={row.eve_id}
                                                value={row.eve_id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                                            >
                                                <EnquiryCard>
                                                    <CardContent style={{ flex: 0.5 }}>
                                                        <Typography variant="body2">
                                                            {index + 1 + page * rowsPerPage}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 0.3 }}>
                                                        <Typography variant="body2">
                                                            {getCallerStatusTooltip(row.patient_service_status)}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2">
                                                            {row.event_code}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.2 }}>
                                                        <Typography variant="body2" textAlign="left">
                                                            {row.agg_sp_pt_id ? row.agg_sp_pt_id?.name : ""}
                                                        </Typography>
                                                    </CardContent>
                                                    {/* <CardContent style={{ flex: 1 }}>
                                                        <div style={{ display: "flex" }}>
                                                            <CallOutlinedIcon sx={{ color: "#3A974C", fontSize: "18px" }} />
                                                            <Typography variant="body2">{row.agg_sp_pt_id ? row.agg_sp_pt_id.phone_no : "-"}</Typography>
                                                        </div>
                                                    </CardContent> */}
                                                    <CardContent style={{ flex: 1 }}>
                                                        <div style={{ display: "flex" }}>
                                                            <CallOutlinedIcon sx={{ color: "#3A974C", fontSize: "18px" }} />
                                                            <Typography variant="body2">{row.caller_no ? row.caller_no : "-"}</Typography>
                                                        </div>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5 }}>
                                                        <Typography variant="body2" textAlign="left">
                                                            {row.srv_id[0] ? row.srv_id[0].srv_id.service_title : "-"}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 0.8 }}>
                                                        {/* <Typography variant="body2" textAlign="left">
                                                            {row.agg_sp_pt_id ? row.Suffered_from : "-"}
                                                        </Typography> */}

                                                        <Tooltip title={row.agg_sp_pt_id?.Suffered_from || ""} arrow>
                                                            <Typography variant="body2" textAlign="left">
                                                                {row.agg_sp_pt_id?.Suffered_from?.length > 10
                                                                    ? `${row.agg_sp_pt_id?.Suffered_from.slice(0, 6)}...`
                                                                    : row.agg_sp_pt_id?.Suffered_from}
                                                            </Typography>
                                                        </Tooltip>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <div style={{ display: "flex", }}>
                                                            <CalendarMonthOutlinedIcon sx={{ color: "#69A5EB", fontSize: "18px" }} />
                                                            <Typography variant="body2">{formatDate(row.srv_id[0] ? row.srv_id[0].start_date : "-")}</Typography>
                                                        </div>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 0.8 }}>
                                                        <Typography variant="body2">
                                                            {row.agg_sp_pt_id ? row.agg_sp_pt_id.prof_zone_id?.Name : "-"}
                                                        </Typography>
                                                    </CardContent>
                                                    {/* <CardContent style={{ flex: 1.5 }}>
                                                        <Tooltip title={row.agg_sp_pt_id?.address || ""} arrow>
                                                            <Typography variant="body2" textAlign="left">
                                                                {row.agg_sp_pt_id?.address?.length > 10
                                                                    ? `${row.agg_sp_pt_id?.address.slice(0, 10)}...`
                                                                    : row.agg_sp_pt_id?.address}
                                                            </Typography>
                                                        </Tooltip>
                                                    </CardContent> */}
                                                    <CardContent style={{ flex: 0.5 }}>
                                                        <Typography variant="body2">
                                                            {/* {getEnquiryStatusTooltip(
                                                                row.folloup_id[0] ? row.folloup_id[0].follow_up : '-'
                                                            )} */}
                                                            {getEnquiryStatusTooltip(
                                                                row.follow_up ? row.follow_up : ""
                                                            )}
                                                            {/* {row.follow_up ? row.follow_up : ""} */}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", width: "6rem", marginTop: "10px" }} onClick={() => handleOpen(findPreFollowupRecords(row.eve_id))}>Followup</Button>
                                                        <Modal
                                                            open={open}
                                                            onClose={handleClose}
                                                            aria-labelledby="modal-modal-title"
                                                            aria-describedby="modal-modal-description"
                                                        >
                                                            <Box sx={{ ...style, width: 320, borderRadius: "10px" }}>
                                                                <div style={{ display: "flex" }}>
                                                                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, marginLeft: "14px", marginTop: "10px" }}>FOLLOW UP</Typography>
                                                                    <Button onClick={handleClose} sx={{ marginLeft: "9rem", color: "gray", }}><CloseIcon /></Button>
                                                                </div>
                                                                <Followup sendData={preFollowup} enqData={enqID} onClose={handleClose} />
                                                            </Box>
                                                        </Modal>
                                                    </CardContent>
                                                </EnquiryCard>
                                            </TableRow>
                                        )
                                        ))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box >
            <Footer />
        </>
    )
}

export default Enquiries

