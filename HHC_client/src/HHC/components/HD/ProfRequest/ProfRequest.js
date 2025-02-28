import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, MenuItem, Snackbar, Alert, CircularProgress, useMediaQuery, Modal, Autocomplete, AppBar, InputBase, Card, CardContent, Stack, Table, TableBody, TableContainer, TableHead, TableRow, TablePagination, Tooltip, IconButton, TextField } from "@mui/material"
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LanguageIcon from '@mui/icons-material/Language';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import Navbar from '../../../Navbar';
import Footer from '../../../Footer';
import Header from '../../../Header';
import Request from './ActionComponent/Request';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
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
    height: "52px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        // cursor: 'pointer',
    },
});

const request = [
    {
        value: 'default',
        label: 'Select Request'
    },
    {
        value: '1',
        label: 'Cancel',
    },
    {
        value: '2',
        label: 'Reschedule',
    },
];

const requestby = [
    {
        value: 'default',
        label: 'Request by'
    },
    // {
    //     value: '1',
    //     label: 'Service',
    // },
    {
        value: '2',
        label: 'Session',
    },
    {
        value: '3',
        label: 'Attendence',
    }
];

const selectType = [
    {
        value: 'default',
        label: 'Select Type'
    },
    {
        value: '1',
        label: 'Patient',
    },
    {
        value: '2',
        label: 'Professional',
    },
];

const ProfRequest = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const [rejectReqID, setRejectReqID] = useState('');
    const [rejectRemark, setRejectRemark] = useState('');

    const [profRequest, setProfRequest] = useState([]);
    const [profReqID, setProfReqID] = useState([]);
    const [eveId, setEveId] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [srvId, setSrvId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const extractedDate = startDate.split(' ')[0];
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');

    const [tableHeight, setTableHeight] = useState('auto');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const [loading, setLoading] = useState(true);

    const [selectedRequestID, setSelectedRequestID] = useState('default');
    const [selectedRequestbyID, setSelectedRequestbyID] = useState('default');
    const [selectedType, setSelectedType] = useState('default');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
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

    const handleOpenReject = () => setOpenReject(true);
    const handleCloseReject = () => setOpenReject(false);

    //Cancel Reason change Logic
    const handleRequestChange = (event) => {
        setSelectedRequestID(event.target.value);
    };

    const handleRequestbyChange = (event) => {
        setSelectedRequestbyID(event.target.value);
    };

    const handleSelectedTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

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

    // useEffect(() => {
    //     const getProfRequest = async () => {
    //         if (selectedRequestID && selectedRequestbyID) {
    //             try {
    //                 const res = await fetch(`${port}/web/get_reschedule_cancle_request/${selectedRequestID}/${selectedRequestbyID}/`, {
    //                     headers: {
    //                         'Authorization': `Bearer ${accessToken}`,
    //                         'Content-Type': 'application/json',
    //                     },
    //                 });
    //                 const data = await res.json();
    //                 console.log("Professional Request Data.......", data);
    //                 if (data.message === "Data not found.") {
    //                     setProfRequest([]);
    //                     setLoading(false);
    //                 } else {
    //                     setProfRequest(data);
    //                     setLoading(false);
    //                 }
    //             } catch (error) {
    //                 console.error("Error fetching Professional Request Data:", error);
    //                 setLoading(false);
    //             }
    //         }
    //     };
    //     getProfRequest();
    // }, [selectedRequestID, selectedRequestbyID]);

    const getProfRequest = async () => {
        if (selectedRequestID && selectedRequestbyID) {
            try {
                const res = await fetch(`${port}/web/get_reschedule_cancle_request/${selectedRequestID}/${selectedRequestbyID}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Professional Request Data.......", data);
                if (data.message === "Data not found.") {
                    setProfRequest([]);
                    setLoading(false);
                } else {
                    setProfRequest(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching Professional data:", error);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        getProfRequest();
    }, [selectedRequestID, selectedRequestbyID]);

    function findPreFollowupRecords(eveId) {
        const matchingRecords = profRequest.find((record) => record.eve_id === eveId);
        console.log(matchingRecords, 'kkkkkkkkkkkk');

        if (matchingRecords) {
            console.log("Prof request ID", matchingRecords.eve_id);
            setProfReqID(matchingRecords.eve_id);
            setEveId(matchingRecords.eve_id.eve_id)
            setSrvId(matchingRecords.epoc_id.srv_id?.srv_id)
            // setSessionId(matchingRecords.dtl_eve_id.agg_sp_dt_eve_poc_id)
            if (matchingRecords.dtl_eve_id !== null) {
                setSessionId(matchingRecords.dtl_eve_id.agg_sp_dt_eve_poc_id);
                setStartDate(matchingRecords.dtl_eve_id.actual_StartDate_Time);
                setEndDate(matchingRecords.dtl_eve_id.actual_EndDate_Time);
                setStartTime(matchingRecords.dtl_eve_id.start_time);
                setEndTime(matchingRecords.dtl_eve_id.end_time);
            } else {
                setSessionId(0);
                setStartDate('');
                setEndDate('');
                setStartTime('');
                setEndTime('');
            }
            if (matchingRecords.req_id !== null) {
                setRejectReqID(matchingRecords.req_id);
            } else {
                setRejectReqID(0);
            }
        }
    }

    async function handleRejectSubmit(event) {
        event.preventDefault();
        const requestData = {
            remark: rejectRemark,
        };
        console.log("POST API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/professional_request_rejection/${rejectReqID}/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                return;
            }
            const result = await response.json();
            console.log("Approve Rejection", result);
            setOpenSnackbar(true);
            setSnackbarMessage('Rejection approved successfully!');
            setSnackbarSeverity('success');
            handleCloseReject();
            // window.location.reload();
            getProfRequest();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <>
            <Navbar />
            <Box sx={{ flexGrow: 1, mt: 14.6, ml: 1, mb: 2, mr: 1, }}>
                <Stack direction={isSmallScreen ? 'column' : 'row'}
                    spacing={1}
                    alignItems={isSmallScreen ? 'center' : 'flex-start'} sx={{ pt: 1 }}>
                    <Typography style={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>PROFESSIONAL REQUEST</Typography>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <TextField
                            id="cancel_by"
                            name="cancel_by"
                            select
                            size="small"
                            fullWidth
                            value={selectedRequestID}
                            onChange={handleRequestChange}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                }, '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                },
                            }}
                        >
                            {request.map((option) => (
                                <MenuItem key={option.value} value={option.value} disabled={option.value === 'default'}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <TextField
                            id="cancel_by"
                            name="cancel_by"
                            select
                            // label="Request by"
                            size="small"
                            fullWidth
                            value={selectedRequestbyID}
                            onChange={handleRequestbyChange}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                }, '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                },
                            }}
                        >
                            {requestby.map((option) => (
                                <MenuItem key={option.value} value={option.value} disabled={option.value === 'default'}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <TextField
                            id="cancel_by"
                            name="cancel_by"
                            select
                            size="small"
                            fullWidth
                            value={selectedType}
                            onChange={handleSelectedTypeChange}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                }, '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                },
                            }}
                        >
                            {selectType.map((option) => (
                                <MenuItem key={option.value} value={option.value} disabled={option.value === 'default'}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    {/* <Button variant='contained' sx={{ textTransform: "capitalize", borderRadius: "8px", height: "40px", background: "#69A5EB", }}>View Request</Button> */}
                </Stack >

                <TableContainer
                    sx={{ height: profRequest.length === 0 || profRequest.length < 5 ? "60vh" : "default" }}
                >
                    <Table >
                        <TableHead>
                            <TableRow >
                                <EnquiryCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 0.3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 0.8, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Event Code</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Professional Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 0.8, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Professional Contact</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Service Name</Typography>
                                    </CardContent>

                                    {
                                        selectedRequestbyID !== '1' && (
                                            <>

                                                <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">Session ID</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">Session Date</Typography>
                                                </CardContent>
                                            </>
                                        )
                                    }

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
                                {profRequest.length === 0 ? (
                                    <TableRow>
                                        <CardContent >
                                            <Typography variant="body2">
                                                No Data Available
                                            </Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    profRequest.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow
                                                key={row.eve_id}
                                                value={row.eve_id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                                            >
                                                <EnquiryCard>
                                                    <CardContent style={{ flex: 0.3 }}>
                                                        <Typography variant="body2">
                                                            {index + 1 + page * rowsPerPage}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 0.8 }}>
                                                        <Typography variant="body2">
                                                            {row.eve_id.event_code}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        {/* <Typography variant="body2">
                                                            {row.dtl_eve_id ? row.dtl_eve_id?.srv_prof_id?.prof_fullname : "-"}
                                                        </Typography> */}
                                                        {
                                                            selectedRequestbyID === '1' ?
                                                                (
                                                                    <Typography variant="body2">
                                                                        {row.prof_name ? row.prof_name : "-"}
                                                                    </Typography>
                                                                ) :
                                                                (
                                                                    <Typography variant="body2">
                                                                        {row.dtl_eve_id ? row.dtl_eve_id?.srv_prof_id?.prof_fullname : "-"}
                                                                    </Typography>
                                                                )
                                                        }
                                                    </CardContent>
                                                    <CardContent style={{ flex: 0.8 }}>
                                                        {/* <Typography variant="body2">
                                                            +91 {row.dtl_eve_id ? row.dtl_eve_id?.srv_prof_id?.phone_no : "-"}
                                                        </Typography> */}

                                                        {
                                                            selectedRequestbyID === '1' ?
                                                                (
                                                                    <Typography variant="body2">
                                                                        +91 {row.prof_no ? row.prof_no : "-"}
                                                                    </Typography>
                                                                ) :
                                                                (
                                                                    <Typography variant="body2">
                                                                        +91 {row.dtl_eve_id ? row.dtl_eve_id?.srv_prof_id?.phone_no : "-"}
                                                                    </Typography>
                                                                )
                                                        }
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2">
                                                            {row.epoc_id ? row.epoc_id.srv_id?.service_title : "-"}
                                                        </Typography>
                                                    </CardContent>
                                                    {
                                                        selectedRequestbyID !== '1' && (
                                                            <>
                                                                <CardContent style={{ flex: 0.5 }}>
                                                                    <Typography variant="body2">{row.dtl_eve_id ? row.dtl_eve_id?.agg_sp_dt_eve_poc_id : '-'}</Typography>
                                                                </CardContent>
                                                                <CardContent style={{ flex: 1 }}>
                                                                    <Typography variant="body2">{row.dtl_eve_id ? row.dtl_eve_id?.actual_StartDate_Time : '-'}</Typography>
                                                                </CardContent>
                                                            </>
                                                        )
                                                    }
                                                    <CardContent style={{ flex: 1 }}>
                                                        <div style={{ display: "flex", }}>
                                                            <Button variant="contained" style={{ textTransform: "capitalize", borderRadius: "8px", marginTop: "10px", background: "#0CD5B8", marginRight: "8px" }} onClick={() => handleOpen(findPreFollowupRecords(row.eve_id))}>Approve</Button>
                                                            <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", marginTop: "10px", color: "gray", borderColor: "gray" }} onClick={() => handleOpenReject(findPreFollowupRecords(row.eve_id))}>Reject</Button>
                                                        </div>

                                                        <Modal
                                                            open={open}
                                                            onClose={handleClose}
                                                            aria-labelledby="modal-modal-title"
                                                            aria-describedby="modal-modal-description"
                                                        >
                                                            <Box sx={{ ...style, width: 300, borderRadius: "10px" }}>
                                                                <AppBar position="static" style={{
                                                                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                                    width: '22.8rem',
                                                                    height: '3rem',
                                                                    marginTop: '-16px',
                                                                    marginLeft: "-32px",
                                                                    borderRadius: "8px 10px 0 0",
                                                                }}>
                                                                    <div style={{ display: "flex" }}>
                                                                        <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "15px" }}>PROFESSIONAL REQUEST</Typography>
                                                                        <Button onClick={handleClose} sx={{ marginLeft: "80px", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                                                    </div>
                                                                </AppBar>
                                                                <Request eveId={eveId} sessionId={sessionId} requestID={selectedRequestID} selectedRequestbyID={selectedRequestbyID} srvId={srvId} reqID={rejectReqID} startDate={extractedDate} endDate={endDate} startTime={startTime} endTime={endTime} onClose={handleClose} prof={getProfRequest} />
                                                            </Box>
                                                        </Modal>

                                                        <Modal
                                                            open={openReject}
                                                            onClose={handleCloseReject}
                                                            aria-labelledby="modal-modal-title"
                                                            aria-describedby="modal-modal-description"
                                                        >
                                                            <Box sx={{ ...style, width: 300, borderRadius: "5px" }}>
                                                                <div style={{ display: "flex" }}>
                                                                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "gray", marginTop: "10px", marginLeft: "2px" }}>REJECT REQUEST</Typography>
                                                                    <Button onClick={handleCloseReject} sx={{ marginLeft: "100px", color: "gray", marginTop: "2px", }}><CloseIcon /></Button>
                                                                </div>

                                                                <div style={{ marginTop: "20px" }}>
                                                                    <TextField
                                                                        required
                                                                        id="remark"
                                                                        name="remark"
                                                                        label="Remark"
                                                                        placeholder='write remark here'
                                                                        size="small"
                                                                        value={rejectRemark}
                                                                        onChange={(e) => setRejectRemark(e.target.value)}
                                                                        fullWidth
                                                                        multiline
                                                                        rows={2}
                                                                        sx={{
                                                                            '& input': {
                                                                                fontSize: '14px',
                                                                            },
                                                                        }}
                                                                    />
                                                                </div>
                                                                <Button variant='contained' sx={{ textTransform: "capitalize", mt: "25px", mb: 1, ml: 8.5, width: "20ch", borderRadius: "12px" }} onClick={handleRejectSubmit}>Submit</Button>
                                                            </Box>
                                                        </Modal>
                                                        <Snackbar
                                                            open={openSnackbar}
                                                            autoHideDuration={6000}
                                                            onClose={handleSnackbarClose}
                                                        >
                                                            <Alert variant="filled"
                                                                onClose={handleSnackbarClose}
                                                                // severity="success"
                                                                severity={snackbarSeverity}
                                                                sx={{ width: "18rem", mb: 30, ml: 62 }}
                                                            >
                                                                {snackbarMessage}
                                                            </Alert>
                                                        </Snackbar>
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
                    count={profRequest.length}
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

export default ProfRequest

