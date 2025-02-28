import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, MenuItem, Button, CardContent, Snackbar, Alert } from "@mui/material"
import DatePicker from 'react-multi-date-picker';

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

// const canceltypes = [
//     {
//         value: '1',
//         label: 'Service',
//     },
//     {
//         value: '2',
//         label: 'Session',
//     },
// ];

const ServiceCancellation = ({ eventID, subSrvID, jobClosureStatus, endDateTime, onClose }) => {
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

    const [availableDates, setAvailableDates] = useState([]);

    const canceltypes = availableDates.length === 1
        ? [{ value: '1', label: 'Service' }]
        : [
            { value: '1', label: 'Service' },
            { value: '2', label: 'Session' },
        ];

    const [selectedDates, setSelectedDates] = useState([]);
    const [values, setValues] = useState([]);

    console.log(selectedDates, 'selectedDates');

    const mapDays = ({ date }) => {
        const dateString = date.format("YYYY-MM-DD");
        if (availableDates.includes(dateString)) {
            return {
                style: {
                    backgroundColor: "#DAF1DE",
                    color: "#51DDAB",
                },
            };
        } else {
            return {
                disabled: true,
                style: {
                    backgroundColor: "#E0E0E0",
                    cursor: "not-allowed",
                },
            };
        }
    };

    const handleDateChange = (newValues) => {
        setValues(newValues || []);
        setErrors({ values: "" });

        // When new values are selected, update selectedDates with individual dates and ranges
        const allSelectedDates = newValues.flatMap(range => {
            if (range && range.length === 2) {
                const startDate = range[0]?.format("YYYY-MM-DD");
                const endDate = range[1]?.format("YYYY-MM-DD");

                // Generate all dates between startDate and endDate
                const datesInRange = generateDatesInRange(startDate, endDate);
                return datesInRange;
            } else if (range && range.length === 1) {
                const singleDate = range[0]?.format("YYYY-MM-DD");
                return [singleDate];
            }
            return [];
        });

        // Set selected dates including all dates in range
        setSelectedDates(allSelectedDates);
    };

    // Helper function to generate dates in the range
    const generateDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dates = [];

        let currentDate = new Date(start);
        while (currentDate <= end) {
            dates.push(currentDate.toISOString().split("T")[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    };

    useEffect(() => {
        if (values.length > 0) {
            const dateRanges = values.map((range) => {
                if (range && range.length === 2) {
                    const startDate = range[0]?.format("YYYY-MM-DD");
                    const endDate = range[1]?.format("YYYY-MM-DD");
                    return [startDate, endDate];
                } else if (range && range.length === 1) {
                    const singleDate = range[0]?.format("YYYY-MM-DD");
                    return [singleDate, singleDate];
                }
                return ["", ""];
            });
        }
    }, [values]);

    console.log("Current Values in DatePicker:", values);
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
        // if (!fromDate) {
        //     newErrors.fromDate = 'Date is required';
        // }
        // if (!toDate) {
        //     newErrors.toDate = 'Date is required';
        // }
        if (!values) {
            newErrors.values = 'Date is required';
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
                    const res = await fetch(`${port}/hr/ServiceCancellationView_Closure_Revalidate/${eventID}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Service Cancel.........", data);
                    setServiceCancel(data.Service_date);
                    setEventCancel(data.event_data);
                    setAvailableDates(data.Service_date.serivce_dates || []);
                } catch (error) {
                    console.error("Error fetching Service Cancel:", error);
                }
            }
        };
        getServiceCancel();
    }, [eventID, accessToken, port]);

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
    // Handle date selection
    // const handleDateChange = (selectedDates) => {
    //     const formattedDates = selectedDates.map((date) =>
    //         date instanceof Date ? date.toISOString().split("T")[0] : date
    //     );

    //     // Filter valid dates (ensure only available dates are stored)
    //     const validSelectedDates = formattedDates.filter((date) =>
    //         availableDates.includes(date)
    //     );

    //     if (validSelectedDates.length !== formattedDates.length) {
    //         setErrors({ values: "Only select available dates." });
    //     } else {
    //         setErrors({});
    //     }
    //     setValues(validSelectedDates); // Update the selected dates

    //     // Update the selected valid dates
    //     setSelectedDates(validSelectedDates);
    // };

    // const mapDays = ({ date, today, selectedDate }) => {
    //     const dateString = date.format("YYYY-MM-DD");

    //     if (availableDates.includes(dateString)) {
    //         return {
    //             disabled: true,
    //             style: {
    //                 backgroundColor: "#DAF1DE",
    //                 color: "#51DDAB",
    //                 pointerEvents: "none",
    //                 cursor: "not-allowed",
    //             },
    //         };
    //     }
    //     return {};
    // };

    // const mapDays = ({ date }) => {
    //     let formattedDate;

    //     if (date instanceof Date) {
    //         formattedDate = date.toISOString().split("T")[0];
    //     } else {
    //         try {
    //             formattedDate = new Date(date).toISOString().split("T")[0];
    //         } catch (error) {
    //             console.error("Invalid date:", date, error);
    //             return {};
    //         }
    //     }

    //     // Disable dates not in availableDates
    //     if (!availableDates.includes(formattedDate)) {
    //         return {
    //             disabled: true,
    //             style: { backgroundColor: "#f5f5f5", color: "#ccc" },
    //         };
    //     }

    //     return {}; 
    // };

    // const filteredCancelTypes = canceltypes.filter(option => !(jobClosureStatus >= 1 && option.value === '1'));

    async function handleCancelService(event) {
        event.preventDefault();
        const hasEmptyFields = handleEmptyFieldService();
        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill all required details.');
            setSnackbarSeverity('error');
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
                const response = await fetch(`${port}/hr/ServiceCancellationView_Closure_Revalidate/${eventID}/`, {
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
        const hasEmptyFields = handleEmptyFieldSession();
        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill all required details.');
            setSnackbarSeverity('error');
            return;
        }
        const requestData = {
            eve_id: eventID,
            sub_srv_id: subSrvID,
            cancellation_by: selectedReasonID,
            reason: selectedCancelReason,
            date_range: selectedDates,
            // start_date_time: fromDate,
            // end_date_time: toDate,
            remark: remark,
        };
        console.log("POST API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/hr/session_cancellation/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            const result = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    setOpenSnackbar(true);
                    setSnackbarMessage(`To cancel the entire session, please use the Service Cancellation option.`);
                    setSnackbarSeverity('error');
                    return;
                }
            }
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
                            {canceltypes.map((option) => (
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
                            {/* <Grid item lg={12} sm={12} xs={12}>
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
                            </Grid> */}

                            <Grid item xs={12}>
                                <DatePicker
                                    multiple
                                    range
                                    value={values}
                                    onChange={handleDateChange}
                                    placeholder="  YYYY/MM/DD"
                                    style={{
                                        height: "30px",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        padding: "3px 0px",
                                    }}
                                    containerStyle={{
                                        width: "100%",
                                    }}
                                    mapDays={mapDays}
                                    render={(
                                        value,
                                        openCalendar
                                    ) => (
                                        <TextField
                                            onClick={openCalendar}
                                            label="Select Cancellation Date *"
                                            placeholder="YYYY/MM/DD"
                                            size="small"
                                            fullWidth
                                            // value={values}
                                            value={selectedDates.join(", ")}
                                            variant="standard"
                                            error={!!errors.values}
                                            helperText={
                                                errors.values
                                            }
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            sx={{
                                                textAlign: "left",
                                                "& input": {
                                                    fontSize: "14px",
                                                },
                                            }}
                                        />
                                    )}
                                />
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
                            error={!!errors.remark}
                            helperText={errors.remark}
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

export default ServiceCancellation
