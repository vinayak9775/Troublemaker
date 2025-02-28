import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import hrt from "../../../../assets/heart.png";
import thermo from "../../../../assets/Thermometer.png";
import brain from "../../../../assets/Brain.png";
import vector from "../../../../assets/Vector.png";
import spine from "../../../../assets/Spine.png";
import blood from "../../../../assets/blood.png";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Closureone = ({ formNo, evePlanID, profSD, profST, profED, profET, onClose }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [baseline, setBaseline] = useState();
    const [airway, setAirway] = useState();
    const [breathing, setBreathing] = useState();
    const [circ, setCirc] = useState();
    const [skin, setSkin] = useState();
    const [pulse, setPulse] = useState();
    const [temp, setTemp] = useState();
    const [rr, setRR] = useState();
    const [gcs, setGCS] = useState();
    const [sp, setSP] = useState();
    const [tb, setTB] = useState();
    const [bp, setBP] = useState();
    const [remark, setRemark] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endDateError, setEndDateError] = useState("");
    const [endTime, setEndTime] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    console.log("From No....", formNo)

    const [errors, setErrors] = useState({
        baseline: '',
        airway: '',
        breathing: '',
        circ: '',
        skin: '',
        pulse: '',
        temp: '',
        rr: '',
        gcs: '',
        sp: '',
        tb: '',
        bp: '',
        remark: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''

    });

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

        if (!baseline) {
            newErrors.baseline = 'Required';
        }
        if (!airway) {
            newErrors.airway = 'Required';
        }
        if (!breathing) {
            newErrors.breathing = 'Required';
        }
        if (!circ) {
            newErrors.circ = 'Required';
        }
        if (!skin) {
            newErrors.skin = 'Required';
        }
        if (!pulse) {
            newErrors.pulse = 'Required';
        }
        if (!temp) {
            newErrors.temp = 'Required';
        }
        if (!rr) {
            newErrors.rr = 'Required';
        }
        if (!gcs) {
            newErrors.gcs = 'Required';
        }
        if (!sp) {
            newErrors.sp = 'Required';
        }
        if (!tb) {
            newErrors.tb = 'Required';
        }
        if (!bp) {
            newErrors.bp = 'Required';
        }
        if (!remark) {
            newErrors.remark = 'Required';
        }
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
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    useEffect(() => {
        setStartDate(profSD);
        setStartTime(profST);
        setEndDate(profED);
        setEndTime(profET);
    }, [profSD, profST, profED, profET]);
    console.log("Closure Form 1", startDate, startTime, endDate, endTime)

    async function handleClosureOneSubmit(event) {
        event.preventDefault();
        handleEmptyField();
        const requestData = {
            form_number: formNo,
            Airway: airway,
            Breathing: breathing,
            Circulation: circ,
            Temp_core: temp,
            TBSL: tb,
            Pulse: pulse,
            SpO2: sp,
            RR: rr,
            GCS_Total: gcs,
            BP: bp,
            Skin_Perfusion: skin,
            Remark: remark,
            prof_st_dt: startDate,
            prof_st_time: startTime,
            prof_ed_dt: endDate,
            prof_ed_time: endTime,
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
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1, bgcolor: "#ffffff", }}>
                <div style={{ display: "flex", }}>
                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, marginTop: "10px", }}>CLOSURE FORM</Typography>
                    <Button onClick={onClose} sx={{ marginLeft: "1000px", marginTop: "2px", color: "gray" }}><CloseIcon /></Button>
                </div>

                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={3} sm={3} lg={3}>
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
                    <Grid item xs={3} sm={3} lg={3}>
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
                    {/* </Grid> */}
                    {/* <Grid item xs={12} container spacing={1} sx={{ mt: 2 }}> */}
                    <Grid item xs={3} sm={3} lg={3}>
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
                    <Grid item xs={3} sm={3} lg={3}>
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

                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>

                    <Grid item xs={4} sm={4} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Baseline</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Baseline"
                                    value={baseline}
                                    onChange={(e) => setBaseline(e.target.value)}
                                    error={!!errors.baseline}
                                    helperText={errors.baseline}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="A" />
                                    <FormControlLabel value="2" control={<Radio />} label="V" />
                                    <FormControlLabel value="3" control={<Radio />} label="P" />
                                    <FormControlLabel value="4" control={<Radio />} label="U" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label"> Airway</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Airway"
                                    value={airway}
                                    onChange={(e) => setAirway(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Open" />
                                    <FormControlLabel value="2" control={<Radio />} label="Close" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Breathing</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Breathing"
                                    value={breathing}
                                    onChange={(e) => setBreathing(e.target.value)}
                                    error={!!errors.breathing}
                                    helperText={errors.breathing}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Present" />
                                    <FormControlLabel value="2" control={<Radio />} label="Compromised" />
                                    <FormControlLabel value="3" control={<Radio />} label="Absent" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Circulation</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Circulation"
                                    value={circ}
                                    onChange={(e) => setCirc(e.target.value)}
                                    error={!!errors.circ}
                                    helperText={errors.circ}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Radial" />
                                    <FormControlLabel value="2" control={<Radio />} label="Present" />
                                    <FormControlLabel value="3" control={<Radio />} label="Absent" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Skin Perfusion</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Skin_Perfusion"
                                    value={skin}
                                    onChange={(e) => setSkin(e.target.value)}
                                    error={!!errors.skin}
                                    helperText={errors.skin}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Normal" />
                                    <FormControlLabel value="2" control={<Radio />} label="Abnormal" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>

                <Typography variant="subtitle1" align="left" sx={{ fontWeight: "600", mt: 1 }}>
                    VITALS
                </Typography>
                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>

                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <div style={{ display: "flex" }}>
                                <Box sx={{ bgcolor: "#F2E3E8", height: "30px", width: "40px", borderRadius: "4px" }}>
                                    <img src={hrt} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                                </Box>

                                <Typography variant="subtitle1" sx={{ ml: 2 }}>
                                    Pulse-beats/min
                                </Typography>
                            </div>

                            <TextField id="standard-basic" label="Pulse" variant="standard" name="Pulse"
                                value={pulse} onChange={(e) => setPulse(e.target.value)} error={!!errors.pulse}
                                helperText={errors.pulse} />bpm
                        </Box>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <div style={{ display: "flex" }}>
                                <Box sx={{ bgcolor: "#F8DEBD", height: "30px", width: "40px", borderRadius: "4px" }}>
                                    <img src={thermo} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                                </Box>
                                <Typography variant="subtitle1" sx={{ ml: 2 }}>
                                    Temp (Core)
                                </Typography>
                            </div>

                            <TextField id="standard-basic" label="Temp" variant="standard" name="Temp_core"
                                value={temp} onChange={(e) => setTemp(e.target.value)} error={!!errors.temp}
                                helperText={errors.temp} />F
                        </Box>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <div style={{ display: "flex" }}>
                                <Box sx={{ bgcolor: "#F2E3E8", height: "30px", width: "40px", borderRadius: "4px" }}>
                                    <img src={hrt} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                                </Box>
                                <Typography variant="subtitle1" sx={{ ml: 2 }}>
                                    RR
                                </Typography>
                            </div>

                            <TextField id="standard-basic" label="RR" variant="standard" name="RR"
                                value={rr} onChange={(e) => setRR(e.target.value)} error={!!errors.rr}
                                helperText={errors.rr} />bpm
                        </Box>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <div style={{ display: "flex" }}>
                                <Box sx={{ bgcolor: "#E9F4EE", height: "30px", width: "40px", borderRadius: "4px" }}>
                                    <img src={brain} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                                </Box>
                                <Typography variant="subtitle1" sx={{ ml: 2 }}>
                                    GCS Total
                                </Typography>
                            </div>

                            <TextField id="standard-basic" label="GCS" variant="standard" name="GCS_Total"
                                value={gcs} onChange={(e) => setGCS(e.target.value)} error={!!errors.gcs}
                                helperText={errors.gcs} />/15
                        </Box>
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <div style={{ display: "flex" }}>
                                <Box sx={{ bgcolor: "#E6E2EF", height: "30px", width: "40px", borderRadius: "4px" }}>
                                    <img src={blood} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                                </Box>
                                <Typography variant="subtitle1" sx={{ ml: 2 }}>
                                    SpO2
                                </Typography>
                            </div>

                            <TextField id="standard-basic" label="SpO2" variant="standard" name="SpO2"
                                value={sp} onChange={(e) => setSP(e.target.value)} error={!!errors.sp}
                                helperText={errors.sp} />%
                        </Box>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <div style={{ display: "flex" }}>
                                <Box sx={{ bgcolor: "#DFE9F2", height: "30px", width: "40px", borderRadius: "4px" }}>
                                    <img src={spine} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                                </Box>
                                <Typography variant="subtitle1" sx={{ ml: 2 }}>
                                    TBSL
                                </Typography>
                            </div>

                            <TextField id="standard-basic" label="TBSL" variant="standard" name="TBSL"
                                value={tb} onChange={(e) => setTB(e.target.value)} error={!!errors.tb}
                                helperText={errors.tb} />mg/dl
                        </Box>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <div style={{ display: "flex" }}>
                                <Box sx={{ bgcolor: "#DEEFEE", height: "30px", width: "40px", borderRadius: "4px" }}>
                                    <img src={vector} alt="" style={{ marginTop: "4px", marginLeft: "11px", height: "20px" }} />
                                </Box>
                                <Typography variant="subtitle1" sx={{ ml: 2 }}>
                                    BP
                                </Typography>
                            </div>

                            <TextField id="standard-basic" label="BP" variant="standard" name="BP"
                                value={bp} onChange={(e) => setBP(e.target.value)} error={!!errors.bp}
                                helperText={errors.bp} />/MmHg
                        </Box>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <TextField id="standard-basic" label="Remark" variant="outlined" multiline
                            rows={3} sx={{ width: '34ch' }} name="Remark"
                            value={remark} onChange={(e) => setRemark(e.target.value)} error={!!errors.remark}
                            helperText={errors.remark} />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} lg={12} sx={{ mt: 1, ml: 60 }}>
                    <Button variant="contained" sx={{ width: '30ch', borderRadius: "12px", textTransform: "capitalize" }}
                        onClick={handleClosureOneSubmit}
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

export default Closureone
