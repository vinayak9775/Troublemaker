import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, MenuItem, Button, CardContent, Snackbar, Alert } from "@mui/material"

const cancelby = [
    {
        value: 1,
        label: 'Spero',
    },
    {
        value: 2,
        label: 'Customer',
    },
];

const canceltypes = [
    {
        value: '1',
        label: 'Service',
    },
    {
        value: '2',
        label: 'Session',
    },
];

const Cancellation = ({ eventID, subSrvID, jobClosureStatus, endDateTime, onClose }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [cancelReason, setCancelReason] = useState([])
    const [selectedCancelReason, setSelectedCancelReason] = useState('');
    const [selectedReasonID, setSelectedReasonID] = useState('')
    const [amount, setAmount] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [remark, setRemark] = useState('')

    const [serviceCancel, setServiceCancel] = useState([])
    const [eventCancel, setEventCancel] = useState([])

    const [selectedOption, setSelectedOption] = useState('')

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [errors, setErrors] = useState({
        selectedOption: '',
        fromDate: '',
        toDate: '',
        remark: '',
        selectedCancelReason: '',
        selectedReasonID: ''
    });

    const handleEmptyFieldService = () => {
        const newErrors = {};

        if (!selectedOption) {
            newErrors.selectedOption = 'This is required';
        }
        if (!remark) {
            newErrors.remark = 'Remark is required';
        }
        if (!selectedCancelReason) {
            newErrors.selectedCancelReason = 'Remark is required';
        }
        if (!selectedReasonID) {
            newErrors.selectedReasonID = 'Remark is required';
        }
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    const handleEmptyFieldSession = () => {
        const newErrors = {};

        if (!selectedOption) {
            newErrors.selectedOption = 'This is required';
        }
        if (!fromDate) {
            newErrors.fromDate = 'Date is required';
        }
        if (!toDate) {
            newErrors.toDate = 'Date is required';
        }
        if (!remark) {
            newErrors.remark = 'Remark is required';
        }
        if (!selectedCancelReason) {
            newErrors.selectedCancelReason = 'Remark is required';
        }
        if (!selectedReasonID) {
            newErrors.selectedReasonID = 'Remark is required';
        }
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    //Text field change Logic
    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        const getCancelReason = async () => {
            if (selectedReasonID) {
                console.log("Cancel BY .....", selectedReasonID)
                try {
                    // const res = await fetch(`${port}/web/cancellation_reason_follow_up_list/${selectedReasonID}`);
                    const res = await fetch(`${port}/web/cancellation_reason_follow_up_list/${selectedReasonID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Cancel by with Reason.........", data);
                    setCancelReason(data);
                } catch (error) {
                    console.error("Error fetching Cancel by with Reason:", error);
                }
            }
        };
        getCancelReason();
    }, [selectedReasonID]);

    useEffect(() => {
        const getServiceCancel = async () => {
            if (eventID) {
                console.log("Event ID .....", eventID)
                try {
                    // const res = await fetch(`${port}/web/service_cancellation/${eventID}`);
                    const res = await fetch(`${port}/web/service_cancellation/${eventID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Service Cancel.........", data);
                    setServiceCancel(data.Service_date);
                    setEventCancel(data.event_data);
                } catch (error) {
                    console.error("Error fetching Service Cancel:", error);
                }
            }
        };
        getServiceCancel();
    }, [eventID]);

    useEffect(() => {
        const getAmountDeduct = async () => {
            if (eventID && subSrvID && fromDate && toDate) {
                console.log("Getting Cancel Session Amount .....", eventID, subSrvID, fromDate, toDate)
                try {
                    // const res = await fetch(`${port}/web/get_session_amt/${eventID}/${subSrvID}/${fromDate}/${toDate}/`);
                    const res = await fetch(`${port}/web/get_session_amt/${eventID}/${subSrvID}/${fromDate}/${toDate}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Amount Deduction.........", data);
                    setAmount(data);
                } catch (error) {
                    console.error("Error fetching Amount:", error);
                }
            }
        };
        getAmountDeduct();
    }, [eventID, subSrvID, fromDate, toDate]);

    //Cancel Reason change Logic
    const handleReasonChange = (event) => {
        setSelectedReasonID(event.target.value);
    };

    const handleCancelReasonChange = (event) => {
        setSelectedCancelReason(event.target.value);
    };

    const formatDate = (dateString) => {
        const dateTime = new Date(dateString);
        const day = dateTime.getDate().toString().padStart(2, '0'); // Get day with leading zero
        const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Get month with leading zero
        const year = dateTime.getFullYear();
        const hours = dateTime.getHours() % 12 || 12; // Get hours in 12-hour format
        const minutes = dateTime.getMinutes().toString().padStart(2, '0'); // Get minutes with leading zero
        const ampm = dateTime.getHours() >= 12 ? 'PM' : 'AM'; // Determine AM or PM

        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
    };

    const filteredCancelTypes = canceltypes.filter(option => !(jobClosureStatus >= 1 && option.value === '1'));

    async function handleCancelService(event) {
        event.preventDefault();
        const hasEmptyFields = handleEmptyFieldService();
        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill all required details.');
            setSnackbarSeverity('error');
            return;
        }

        if (remark.trim().length < 15) {
            setErrors({ remark: 'Remark must be at least 15 characters long.' });
            return;
        }
        const requestData = {
            event_id: eventID,
            cancellation_by: selectedReasonID,
            reason: selectedCancelReason,
            remark: remark,
        };
        console.log("POST API Hitting......", requestData)
        if (eventID) {
            try {
                const response = await fetch(`${port}/web/service_cancellation/${eventID}`, {
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
                console.log("Successfully submitted Service Cancellation data", result);
                setOpenSnackbar(true);
                setSnackbarMessage('Service Cancelled successfully!');
                setSnackbarSeverity('success');
                // onClose();
                // window.location.reload();
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } catch (error) {
                console.error("Error fetching Service Cancellation:", error);
            }
        }
    }

    async function handleCancelSession(event) {
        event.preventDefault();
        const hasEmptyFields = handleEmptyFieldService();

        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill all required details.');
            setSnackbarSeverity('error');
            return;
        }

        if (remark.trim().length < 15) {
            setErrors({ remark: 'Remark must be at least 15 characters long.' });
            return;
        }
        const requestData = {
            eve_id: eventID,
            sub_srv_id: subSrvID,
            cancellation_by: selectedReasonID,
            reason: selectedCancelReason,
            start_date_time: fromDate,
            end_date_time: toDate,
            remark: remark,
        };
        console.log("POST API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/session_cancellation/`, {
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
            if (result.msg === "Don't cancel the entire session.If you want to cancel the entire session, please use the Service Cancellation option.") {
                setOpenSnackbar(true);
                setSnackbarMessage('To cancel the entire session, please use the Service Cancellation option.');
                setSnackbarSeverity('error');
            } else if (result.msg === "Do not close the sessions, because job closure is done for that day.") {
                setOpenSnackbar(true);
                setSnackbarMessage(`The session cannot be canceled because the job closure has already been completed for ${result.date}`);
                setSnackbarSeverity('error');
            } else {
                console.log("Successfully submitted Session Cancellation data", result);
                setOpenSnackbar(true);
                setSnackbarMessage('Session Cancelled successfully!');
                setSnackbarSeverity('success');
                window.location.reload();
            }
            // onClose();
        } catch (error) {
            console.error("Error fetching Session Cancellation:", error);
        }
    }

    return (
        <Box>
            <CardContent>
                <Grid container spacing={2} sx={{ marginTop: "1px" }}>

                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            id="outlined-select-cancel"
                            select
                            label="Cancellation Type"
                            size="small"
                            fullWidth
                            value={selectedOption}
                            onChange={handleDropdownChange}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '16px',
                                },
                            }}
                            error={!!errors.selectedOption}
                            helperText={errors.selectedOption}
                        >
                            {filteredCancelTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            id="cancellation_by"
                            name="cancellation_by"
                            select
                            label="Cancellation by"
                            size="small"
                            fullWidth
                            value={selectedReasonID}
                            onChange={handleReasonChange}
                            error={!!errors.selectedReasonID}
                            helperText={errors.selectedReasonID}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        >
                            {cancelby.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            id="reason"
                            name="reason"
                            select
                            label="Cancellation Reason"
                            size="small"
                            fullWidth
                            value={selectedCancelReason}
                            onChange={handleCancelReasonChange}
                            error={!!errors.selectedCancelReason}
                            helperText={errors.selectedCancelReason}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                },
                            }}
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            maxHeight: '150px',
                                            maxWidth: '200px',
                                        },
                                    },
                                },
                            }}
                        >
                            {cancelReason.map((option) => (
                                <MenuItem key={option.cancelation_reason_id} value={option.cancelation_reason_id} sx={{ fontSize: "14px" }}>
                                    {option.cancelation_reason}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    {selectedOption === '2' ? (
                        <>
                            <Grid item lg={12} sm={12} xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            label="From Date"
                                            id="start_date_time"
                                            name="start_date_time"
                                            type="date"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                            size="small"
                                            fullWidth
                                            error={!!errors.fromDate}
                                            helperText={errors.fromDate}
                                            sx={{
                                                '& input': {
                                                    fontSize: '16px',
                                                },
                                            }}
                                            // inputProps={{
                                            // min: getCurrentDateTimeString(),

                                            // min: new Date().toISOString().split('T')[0],
                                            // max: endDateTime ? endDateTime : undefined,
                                            // }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            label="To Date"
                                            id="end_date_time"
                                            name="end_date_time"
                                            type="date"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                            size="small"
                                            fullWidth
                                            error={!!errors.toDate}
                                            helperText={errors.toDate}
                                            sx={{
                                                '& input': {
                                                    fontSize: '16px',
                                                },
                                            }}
                                            // inputProps={{
                                            // min: getCurrentDateTimeString(), // Set min to current date and time

                                            // min: new Date().toISOString().split('T')[0],
                                            // max: endDateTime ? endDateTime : undefined,
                                            // }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    ) : (null)}

                    <Grid item lg={12} sm={12} xs={12}>
                        {/* <Typography variant="body2" sx={{ fontSize: "12px" }}>Allocation Date Time: {formatDate(serviceCancel.start_date)}</Typography> */}

                        {selectedOption === '2' ? (
                            <Typography variant="body2" sx={{ fontSize: "12px" }}>Amount Deducted: {amount}</Typography>
                        ) : (
                            <Typography variant="body2" sx={{ fontSize: "12px" }}>Amount Deducted: {eventCancel.refund_amt}</Typography>
                        )}
                    </Grid>
                    <Typography variant='body2' color="primary" sx={{ marginTop: "10px", marginLeft: "16px", cursor: "pointer", fontSize: "10px" }}>Cancellation Policy</Typography>
                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            id="outlined-multiline-static"
                            label="Remark"
                            name="remark"
                            placeholder='write remark here'
                            size="small"
                            fullWidth
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            multiline
                            rows={2}
                            // error={!!errors.remark}
                            // helperText={errors.remark}
                            error={!!errors.remark}
                            helperText={errors.remark || "Remark must be at least 15 characters"}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        {selectedOption === '2' ? (
                            <Button variant="contained" sx={{ m: 1, width: '30ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", }}
                                onClick={handleCancelSession}>
                                Cancel Session
                            </Button>
                        ) : (
                            <Button variant="contained" sx={{ m: 1, width: '30ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", }}
                                onClick={handleCancelService}>
                                Cancel Service
                            </Button>
                        )}
                    </Grid>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                    >
                        <Alert variant="filled"
                            onClose={handleSnackbarClose}
                            // severity="success"
                            severity={snackbarSeverity}
                            sx={{ width: "18rem", mb: 10 }}
                        >
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Grid>
            </CardContent>
        </Box>
    )
}

export default Cancellation
