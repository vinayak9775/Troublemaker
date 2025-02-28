import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Box, Grid, TextField, Button, MenuItem, CardContent, Snackbar, Alert, Typography, Modal, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from "react-multi-date-picker";
import dayjs from "dayjs";

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

const genders = [
    {
        value: '0',
        label: 'No Preference',
    },
    {
        value: '1',
        label: 'Male',
    },
    {
        value: '2',
        label: 'Female',
    },
];

const schedules = [
    {
        value: '1',
        label: 'Service',
    },
    {
        value: '2',
        label: 'Session',
    },
];

const calculateDateCount = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
};

const Reschedule = ({ eventID, eveStartDate, eveEndDate, sesCount, jobClosureStatus, getEventIDRequest, onClose }) => {
    const navigate = useNavigate();
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    console.log('Session Count....:', sesCount);
    console.log('Datesss....:', eveStartDate, eveEndDate);

    const [selectedOption, setSelectedOption] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [sessionDate, setSessionDate] = useState(eveStartDate);
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [remark, setRemark] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [openSesRschdl, setOpenSesRschdl] = useState(false);

    const [sessionDetails, setSessionDetails] = useState({});

    const [requestAllocation, setRequestAllocation] = useState({});

    const [values, setValues] = useState([]);
    const [chooseDates, setChooseDates] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [dateCount, setDateCount] = useState(0);
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];

    const [errors, setErrors] = useState({
        selectedOption: '',
        values: '',
        startTime: '',
        endTime: '',
        remark
    });

    const handleOpenSesRschdl = () => {
        setOpenSesRschdl(true);
    };

    const handleCloseSesRschdl = () => {
        setOpenSesRschdl(false);
    };

    const handleRadioChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);
        if (value === '1') {
            // getEventIDRequest();
            getRequestAllocation();
        }
    };

    const handleDateChange = (newValues) => {
        setValues(newValues || []);
        // setErrors({ values: '' });
    };

    useEffect(() => {
        if (values.length > 0) {
            const dateRanges = values.map(range => {
                if (range && range.length === 2) {
                    const startDate = range[0]?.format('YYYY-MM-DD');
                    const endDate = range[1]?.format('YYYY-MM-DD');
                    return [startDate, endDate];
                } else if (range && range.length === 1) {
                    const singleDate = range[0]?.format('YYYY-MM-DD');
                    return [singleDate, singleDate];
                }
                return ['', ''];
            });
            const totalDates = dateRanges.reduce((count, [start, end]) => {
                if (start && end) {
                    return count + calculateDateCount(start, end);
                }
                return count;
            }, 0);
            setChooseDates(dateRanges);
            setDateCount(totalDates);
        } else {
            setChooseDates([]);
            setDateCount(0);
        }
    }, [values]);

    console.log('Selected Date range:', chooseDates);
    console.log('Hiiiiiiii:', sessionDetails);

    const handleEmptyField = () => {
        const newErrors = {};

        if (!selectedOption) {
            newErrors.selectedOption = 'Schedule type is required';
        }
        if (!values) {
            newErrors.values = 'Date is required';
        }
        if (!startTime) {
            newErrors.startTime = 'Time is required';
        }
        if (!endTime) {
            newErrors.endTime = 'Time is required';
        }
        if (!remark) {
            newErrors.remark = 'Remark is required';
        } else if (remark.length < 15) {
            newErrors.remark = 'Remark must contain at least 15 characters';
        }
        // if (sesCount !== dateCount) {
        //     newErrors.values = 'Date is required';
        // }
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    //TextField change Logic
    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const getCurrentDateTimeString = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        // const hours = String(currentDate.getHours()).padStart(2, '0');
        // const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        // return `${year}-${month}-${day}T${hours}:${minutes}`;
        return `${year}-${month}-${day}`;
    };

    const getCurrentTimeString = () => {
        const currentDate = new Date();
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        // const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        // return `${hours}:${minutes}:${seconds}`;
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        setStartDate(eveStartDate);
        setEndDate(eveEndDate);
    }, [eveStartDate, eveEndDate]);

    useEffect(() => {
        if (eveEndDate) {
            const nextDay = new Date(eveEndDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextDayString = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;
            const rescheduleMinDate = nextDayString;
            setRescheduleDate(rescheduleMinDate);
        }
    }, [eveEndDate]);

    // const filteredSchedules = schedules.filter(option => !(jobClosureStatus >= 1 && option.value === '1'));
    const filteredSchedules = schedules.filter(option => {
        const isJobClosed = jobClosureStatus >= 1;
        const isSameDate = eveStartDate === eveEndDate;

        if (isJobClosed && option.value === '1') {
            return false;
        }
        if (isSameDate && option.value === '2') {
            return false;
        }
        return true;
    });

    async function handleRescheduleSubmit(event) {
        event.preventDefault();
        const hasEmptyFields = handleEmptyField();
        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill all required details.');
            setSnackbarSeverity('error');
            return;
        }
        if (sesCount !== dateCount) {
            setOpenSnackbar(true);
            setSnackbarMessage('Selected dates do not match the date count.');
            setSnackbarSeverity('error');
            console.log("Selected dates do not match the date count.")
        }
        if (remark.trim().length < 15) {
            setErrors({ remark: 'Remark must be at least 15 characters long.' });
            return;
        }
        const requestData = {
            // event_id: eventID,
            // actual_StartDate_Time: startDate,
            // actual_EndDate_Time: endDate,
            dates: chooseDates,
            start_time: startTime,
            end_time: endTime,
            remark: remark,
        };
        console.log("POST API Hitting......", requestData)
        if (eventID) {
            try {
                const response = await fetch(`${port}/web/service_reschedule/${eventID}/`, {
                    method: "PATCH",
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
                console.log("Successfully submitted Service Reschedule data", result);
                setOpenSnackbar(true);
                setSnackbarMessage('Service reschedule successfully!');
                setSnackbarSeverity('success');
                // onClose();
                window.location.reload();
            } catch (error) {
                console.error("Error fetching Service Reschedule:", error);
            }
        }
    }

    async function handleSessionSubmit(event) {
        event.preventDefault();
        const hasEmptyFields = handleEmptyField();
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
            session_date: sessionDate,
            reschedule_date: rescheduleDate,
            reschedule_start_time: startTime,
            reschedule_end_time: endTime,
            remark: remark,
        };
        console.log("Session Post API Hitting......", requestData)
        // if (eventID) {
        try {
            // const response = await fetch(`${port}/web/session_reschedule/${eventID}/`, {
            const response = await fetch(`${port}/web/session_reschedule/`, {
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
            console.log("Successfully submitted Session data", result);
            if (result.msg === "Professional has already a session") {
                // setOpenSnackbar(true);
                // setSnackbarMessage('Professional has already another session');
                // setSnackbarSeverity('warning');
                setOpenSesRschdl(true);
                setSessionDetails(result.current_sess_dtl);
            } else {
                setOpenSnackbar(true);
                setSnackbarMessage('Session updated successfully!');
                setSnackbarSeverity('success');
                window.location.reload();
                // onClose();
            }
            // onClose();
            // window.location.reload();
        } catch (error) {
            console.error("Error fetching Session:", error);
        }
        // }
    }

    const getRequestAllocation = async () => {
        if (eventID) {
            try {
                const res = await fetch(`${port}/web/agg_hhc_srv_req_prof_allocate/${eventID}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Request Allocation Data.........", data);
                setRequestAllocation(data);
                const eventValue = data.Event_ID;
                const patientValue = data.patient_details.agg_sp_pt_id;
                const callerValue = data.caller_details.caller_id;
                const eventPlanValue = data.POC[0].eve_poc_id;

                console.log("eventID", eventValue);
                console.log("patientID", patientValue);
                console.log("callerID", callerValue);
                console.log("eventPlanID", eventPlanValue);
                navigate('/viewservice', {
                    state: {
                        patientID: patientValue,
                        callerID: callerValue,
                        eventPlanID: eventPlanValue,
                        eventID: eventValue,
                        flag: 3,
                        startTime,
                        endTime,
                        rescheduleDate,
                        sessionDate,
                    },
                });
            } catch (error) {
                console.error("Error fetching Request Allocation:", error);
            }
        }
    };

    return (
        <Box>
            <CardContent>
                <Grid container spacing={3} sx={{ marginTop: "1px" }}>
                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            id="outlined-select-schedule"
                            select
                            label="Schedule Type"
                            value={selectedOption}
                            onChange={handleDropdownChange}
                            // disabled={eveStartDate === eveEndDate}
                            size="small"
                            fullWidth
                            error={!!errors.selectedOption}
                            helperText={errors.selectedOption}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '16px',
                                },
                            }}
                        >
                            {filteredSchedules.map((option) => (
                                <MenuItem key={option.value} value={option.value}
                                // disabled={eveStartDate === eveEndDate && option.value !== '1'}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    {selectedOption === '2' ? (
                        <>
                            <Grid item lg={12} sm={12} xs={12}>
                                <TextField
                                    required
                                    label="Session Start Date"
                                    type="date"
                                    id="session_date"
                                    name="session_date"
                                    value={sessionDate}
                                    onChange={(e) => setSessionDate(e.target.value)}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '16px',
                                        },
                                    }}
                                    inputProps={{
                                        min: getCurrentDateTimeString(),
                                        min: sessionDate,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid item lg={12} sm={12} xs={12}>
                                <TextField
                                    required
                                    label="Session Reschedule Date"
                                    type="date"
                                    id="reschedule_date"
                                    name="reschedule_date"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '16px',
                                        },
                                    }}
                                    inputProps={{
                                        min: getCurrentDateTimeString(),
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid container spacing={1} sx={{ mt: 1, ml: 2 }}>
                                <Grid item lg={6} sm={6} xs={6} >
                                    <TextField
                                        required
                                        label="Start Time"
                                        type="time"
                                        id="reschedule_start_time"
                                        name="reschedule_start_time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        size="small"
                                        fullWidth
                                        error={!!errors.startTime}
                                        helperText={errors.startTime}
                                        sx={{
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            min: getCurrentTimeString(),
                                        }}
                                    />
                                </Grid>

                                <Grid item lg={6} sm={6} xs={6}>
                                    <TextField
                                        required
                                        id="reschedule_end_time"
                                        name="reschedule_end_time"
                                        label="End Time"
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        size="small"
                                        fullWidth
                                        error={!!errors.endTime}
                                        helperText={errors.endTime}
                                        sx={{
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            min: getCurrentTimeString(),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <>
                            {sesCount !== dateCount && (
                                <Typography variant='subtitle2' sx={{ ml: 3, mt: 1, color: "red" }}>Note: The date count must be {sesCount} *</Typography>
                            )}

                            <Grid item lg={12} sm={12} xs={12} sx={{ mt: -1 }}>
                                {/* <TextField
                                    required
                                    label="Service Start Date"
                                    type="date"
                                    id="actual_StartDate_Time"
                                    name="actual_StartDate_Time"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '16px',
                                        },
                                    }}
                                    inputProps={{
                                        min: getCurrentDateTimeString(),
                                        min: sessionDate,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                /> */}
                                <DatePicker
                                    multiple
                                    range
                                    value={values}
                                    onChange={handleDateChange}
                                    style={{
                                        height: "30px",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        padding: "3px 0px",
                                    }}
                                    containerStyle={{
                                        width: "100%"
                                    }}
                                    minDate={currentDateString}
                                    render={(value, openCalendar) => (
                                        <TextField
                                            onClick={openCalendar}
                                            label='Select Service Date *'
                                            placeholder='YYYY/MM/DD'
                                            value={values}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            error={!!errors.values}
                                            helperText={errors.values}
                                            // InputLabelProps={{
                                            //     shrink: true,
                                            // }}
                                            sx={{
                                                textAlign: "left",
                                                '& input': {
                                                    fontSize: '14px',
                                                },
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid container spacing={1} sx={{ mt: 2, ml: 2 }}>
                                <Grid item lg={6} sm={6} xs={6} >
                                    <TextField
                                        required
                                        label="Start Time"
                                        type="time"
                                        id="start_time"
                                        name="start_time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        size="small"
                                        fullWidth
                                        error={!!errors.startTime}
                                        helperText={errors.startTime}
                                        sx={{
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            min: getCurrentTimeString(),
                                        }}
                                    />
                                </Grid>

                                <Grid item lg={6} sm={6} xs={6}>
                                    <TextField
                                        required
                                        id="end_time"
                                        name="end_time"
                                        label="End Time"
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        size="small"
                                        fullWidth
                                        error={!!errors.endTime}
                                        helperText={errors.endTime}
                                        sx={{
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            min: getCurrentTimeString(),
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {/* <Grid item lg={12} sm={12} xs={12}>
                                <TextField
                                    required
                                    id="actual_EndDate_Time"
                                    label="End Date and Time"
                                    type="datetime-local"
                                    name="actual_EndDate_Time"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                        min: getCurrentDateTimeString(), // Set min to current date and time
                                    }}
                                />
                            </Grid> */}
                        </>
                    )}
                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            id="outlined-select-consultant"
                            select
                            label="Consultant Preferred"
                            size="small"
                            fullWidth
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '16px',
                                },
                            }}
                        >
                            {genders.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            id="remark"
                            label="Remark"
                            placeholder='write remark here'
                            size="small"
                            name="remark"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            sx={{
                                '& input': {
                                    fontSize: '16px',
                                },
                            }}
                            error={!!errors.remark}
                            helperText={errors.remark || "Remark must be at least 15 characters"}
                        />
                    </Grid>
                    <Grid item lg={12} sm={12} xs={12}>
                        {selectedOption === '2' ? (
                            <Button variant="contained" sx={{ m: 1, width: '30ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", }} onClick={handleSessionSubmit}>
                                Update Session
                            </Button>
                        ) : (
                            <Button variant="contained" sx={{ m: 1, width: '30ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", }} onClick={handleRescheduleSubmit}>
                                Service Reschedule
                            </Button>
                        )}
                    </Grid>

                    <Modal
                        open={openSesRschdl}
                        onClose={handleCloseSesRschdl}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{ ...style, width: 300, borderRadius: "10px", border: "none" }}>
                            {/* <div style={{ display: "flex" }}>
                                <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "gray", marginTop: "10px", marginLeft: "15px" }}>SESSION RESCHEDULE DETAILS</Typography>
                                <Button onClick={handleCloseSesRschdl} sx={{ color: "gray", marginTop: "2px", }}><CloseIcon /></Button>
                            </div> */}
                            <Typography variant='subtitle2'>Professional has already a session</Typography>
                            <br />
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Do you want to reschedule this session?</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={selectedValue}
                                    onChange={handleRadioChange}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="2" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Modal>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                    >
                        <Alert variant="filled"
                            onClose={handleSnackbarClose}
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

export default Reschedule
