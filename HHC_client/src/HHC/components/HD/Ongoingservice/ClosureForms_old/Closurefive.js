import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Closurefive = ({ formNo, evePlanID, profSD, profST, profED, profET, onClose }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endDateError, setEndDateError] = useState("");
    const [endTime, setEndTime] = useState("");
    const [catheter, setCatheter] = useState();
    const [cathSize, setCathSize] = useState();
    const [procedure, setProcedure] = useState();
    const [remark, setRemark] = useState("");
    const [errors, setErrors] = useState({
        remark: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        console.log(startDate);
        validateEndDate(event.target.value, endDate);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        validateEndDate(startDate, event.target.value);
    };

    const validateEndDate = (start, end) => {
        if (start && end) {
            const startDateObj = new Date(start);
            const endDateObj = new Date(end);

            if (endDateObj < startDateObj) {
                setEndDateError("End date can't be earlier than the start date");
            }
            else {
                setEndDateError('');
            }
        } else {
            setEndDateError('');
        }
    };

    const getCurrentDateTimeString = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleEmptyField = () => {
        const newErrors = {};
        if (!startDate) {
            newErrors.startDate = 'Required';
        }
        if (!startTime) {
            newErrors.startTime = 'Required';
        }
        if (!endDate) {
            newErrors.endDate = 'Required';
        }
        if (!endTime) {
            newErrors.endTime = 'Required';
        }
        if (!remark) {
            newErrors.remark = 'Required';
        }
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    useEffect(() => {
        setStartDate(profSD);
        setStartTime(profST);
        setEndDate(profED);
        setEndTime(profET);
    }, [profSD, profST, profED, profET]);
    console.log("Closure Form 5", startDate, startTime, endDate, endTime)

    async function handleClosureFiveSubmit(event) {
        event.preventDefault();
        handleEmptyField();
        const requestData = {
            form_number: formNo,
            prof_st_dt: startDate,
            prof_st_time: startTime,
            prof_ed_dt: endDate,
            prof_ed_time: endTime,
            Catheter_type: catheter,
            Size_catheter: cathSize,
            Procedure: procedure,
            Remark: remark,
        };
        console.log("POST API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/agg_hhc_session_job_closure/?dtl_eve=${evePlanID}`, {
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
            console.log("Closure data", result);
            setOpenSnackbar(true);
            setSnackbarMessage('Closure data submitted successfully!');
            // onClose();
            window.location.reload();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <>
            <Box sx={{ flexGrow: 1, bgcolor: "#ffffff" }}>
                <div style={{ display: "flex", }}>
                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, marginTop: "10px", }}>CLOSURE FORM</Typography>
                    <Button onClick={onClose} sx={{ marginLeft: "160px", marginTop: "2px", color: "gray" }}><CloseIcon /></Button>
                </div>

                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={6} sm={6} lg={6}>
                        <TextField
                            required
                            id="prof_st_dt"
                            name="prof_st_dt"
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            size="small"
                            fullWidth
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        // inputProps={{
                        //     min: getCurrentDateTimeString(),
                        // }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} lg={6}>
                        <TextField
                            required
                            id="prof_st_time"
                            name="prof_st_time"
                            label="Start Time"
                            type="time"
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
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} container spacing={1} sx={{ mt: 2 }}>
                    <Grid item xs={6} sm={6} lg={6}>
                        <TextField
                            required
                            id="prof_ed_dt"
                            name="prof_ed_dt"
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            size="small"
                            fullWidth
                            error={endDateError !== '' || !!errors.endDate}
                            helperText={endDateError || errors.endDate}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        // inputProps={{
                        //     min: getCurrentDateTimeString(),
                        // }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6} lg={6}>
                        <TextField
                            required
                            id="prof_ed_time"
                            name="prof_ed_time"
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
                        />
                    </Grid>
                </Grid> 

                <Grid item xs={12} container spacing={1} sx={{ mt: 2 }}>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Catheter Removal</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Catheter_type"
                                    value={catheter}
                                    onChange={(e) => setCatheter(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Silicon" />
                                    <FormControlLabel value="2" control={<Radio />} label="Simple" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Size of catheter</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Size_catheter"
                                    value={cathSize}
                                    onChange={(e) => setCathSize(e.target.value)}
                                >
                                    <FormControlLabel value="14" control={<Radio />} label="14" />
                                    <FormControlLabel value="16" control={<Radio />} label="16" />
                                    <FormControlLabel value="18" control={<Radio />} label="18" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Procedure</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Procedure"
                                    value={procedure}
                                    onChange={(e) => setProcedure(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Eventful" />
                                    <FormControlLabel value="2" control={<Radio />} label="Uneventful" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        {/* <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}> */}
                        <TextField id="standard-basic" label="Remark" variant="outlined" multiline
                            rows={2} sx={{ width: '42ch' }} name="Remark"
                            value={remark} onChange={(e) => setRemark(e.target.value)}
                        // error={!!errors.remark}
                        // helperText={errors.remark} 
                        />
                        {/* </Box> */}
                    </Grid>

                </Grid>

                <Grid item xs={12} sm={12} lg={12} sx={{ mt: 2, }}>
                    <Button variant="contained" sx={{ width: '25ch', borderRadius: "12px", ml: "4.6rem", textTransform: "capitalize" }}
                        onClick={handleClosureFiveSubmit}
                    >Submit</Button>
                </Grid>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <Alert variant="filled"
                        onClose={handleSnackbarClose}
                        severity="success"
                        sx={{ width: "20rem", ml: 3, mb: 10 }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    )
}

export default Closurefive
