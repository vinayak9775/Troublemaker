import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import hrt from "../../../../../assets/heart.png";
import thermo from "../../../../../assets/Thermometer.png";
import brain from "../../../../../assets/Brain.png";
import vector from "../../../../../assets/Vector.png";
import spine from "../../../../../assets/Spine.png";
import blood from "../../../../../assets/blood.png";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Closureseven = ({ getSessionDetils, formNo, evePlanID, profSD, profST, profED, profET, sessions, onClose, eveID }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [pulse, setPulse] = useState();
    const [temp, setTemp] = useState();
    const [rr, setRR] = useState();
    const [gcs, setGCS] = useState();
    const [sp, setSP] = useState();
    const [tb, setTB] = useState();
    const [bp, setBP] = useState();
    // const [remark, setRemark] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endDateError, setEndDateError] = useState("");
    const [endTime, setEndTime] = useState("");
    const [closureRevalidateRemark, setClosureRevalidateRemark] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [Remark, setRemark] = useState('');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const [errors, setErrors] = useState({
        // pulse: '',
        // temp: '',
        // rr: '',
        // gcs: '',
        // sp: '',
        // tb: '',
        // bp: '',
        // remark: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''

    });

    // Function to handle empty fields
    const handleEmptyField = () => {
        const newErrors = {};
        // if (!pulse) {
        //     newErrors.pulse = 'Required';
        // }
        // if (!temp) {
        //     newErrors.temp = 'Required';
        // }
        // if (!rr) {
        //     newErrors.rr = 'Required';
        // }
        // if (!gcs) {
        //     newErrors.gcs = 'Required';
        // }
        // if (!sp) {
        //     newErrors.sp = 'Required';
        // }
        // if (!tb) {
        //     newErrors.tb = 'Required';
        // }
        // if (!bp) {
        //     newErrors.bp = 'Required';
        // }
        // if (!remark) {
        //     newErrors.remark = 'Required';
        // }
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
        if (!closureRevalidateRemark) {
            newErrors.closureRevalidateRemark = 'Required';
        }
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
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

    useEffect(() => {
        setStartDate(profSD);
        setStartTime(profST);
        setEndDate(profED);
        setEndTime(profET);
    }, [profSD, profST, profED, profET]);
    console.log("Closure Form 7", startDate, startTime, endDate, endTime)
    // apicall

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${port}/hr/event_wise_job_clouser_dtls/${eveID}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                const patientDetails = data[0]?.pt_dtt || {};
                const sessionDetails = data[0]?.job_closure_dtl || [];

                // Set default values based on API response
                // Populate other fields if applicable (e.g., wound, discharge)
                setStartDate(sessionDetails[0]?.sess_s_date || "");
                setEndDate(sessionDetails[0]?.sess_e_date || "");
                setStartTime(sessionDetails[0]?.sess_s_time || "");
                setEndTime(sessionDetails[0]?.sess_e_time || "");
                setRemark(sessionDetails[0]?.Remark || "");
                setClosureRevalidateRemark(
                    sessionDetails[0]?.closure_revalidate_remark || ""
                );
                setPulse(sessionDetails[0]?.Pulse || "");
                setTemp(sessionDetails[0]?.Temp_core || "");
                setRR(sessionDetails[0]?.RR || "");
                setGCS(sessionDetails[0]?.GCS_Total || "");
                setSP(sessionDetails[0]?.SpO2 || "");
                setTB(sessionDetails[0]?.TBSL || "");
                setBP(sessionDetails[0]?.BP || "");

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [eveID]);


    async function handleClosureSevenSubmit(event) {
        event.preventDefault();
        // handleEmptyField();
        const hasErrors = handleEmptyField();
        if (hasErrors) {
            return;
        }
        if (sessions.length === 0) {
            console.error("No session data available.");
            return;
        }
        const requestData = {
            form_number: formNo,
            Temp_core: temp,
            TBSL: tb,
            Pulse: pulse,
            SpO2: sp,
            RR: rr,
            GCS_Total: gcs,
            BP: bp,
            // Remark: remark,
            prof_st_dt: startDate,
            prof_st_time: startTime,
            prof_ed_dt: endDate,
            prof_ed_time: endTime,
            closure_revalidate_remark: closureRevalidateRemark,
            closure_revalidate: 1

        };
        console.log("POST API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/hr/agg_hhc_session_job_closure/?dtl_eve=${evePlanID}`, {
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
            setSnackbarMessage('Closure data submitted successfully!');
      setOpenSnackbar(true);
      setTimeout(async () => {
        onClose();
        await getSessionDetils();
      }, 2000);
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

                <Typography variant="subtitle1" align="left" sx={{ fontWeight: "600", mt: 1 }}>
                    VITALS
                </Typography>

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
                                value={pulse} onChange={(e) => setPulse(e.target.value)}
                            // error={!!errors.pulse}
                            // helperText={errors.pulse} 
                            />bpm
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
                                value={temp} onChange={(e) => setTemp(e.target.value)}
                            // error={!!errors.temp}
                            // helperText={errors.temp} 
                            />F
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
                                value={rr} onChange={(e) => setRR(e.target.value)}
                            // error={!!errors.rr}
                            // helperText={errors.rr} 
                            />bpm
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
                                value={gcs} onChange={(e) => setGCS(e.target.value)}
                            // error={!!errors.gcs}
                            // helperText={errors.gcs} 
                            />/15
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
                                value={sp} onChange={(e) => setSP(e.target.value)}
                            // error={!!errors.sp}
                            // helperText={errors.sp} 
                            />%
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
                                value={tb} onChange={(e) => setTB(e.target.value)}
                            // error={!!errors.tb}
                            // helperText={errors.tb} 
                            />mg/dl
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
                                value={bp} onChange={(e) => setBP(e.target.value)}
                            // error={!!errors.bp}
                            // helperText={errors.bp} 
                            />/MmHg
                        </Box>
                    </Grid>
                    {/* <Grid item xs={3} sm={3} md={3} lg={3}>
                        <TextField id="standard-basic" label="Remark" variant="outlined" multiline
                            rows={2} sx={{ width: '34ch' }} name="Remark"
                            value={remark} onChange={(e) => setRemark(e.target.value)} error={!!errors.remark}
                            helperText={errors.remark} />
                    </Grid> */}

                </Grid>
                <Grid item xs={12} container spacing={1} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                       <TextField
                                    id="closure_revalidate_remark"
                                    name="closure_revalidate_remark"
                                    label="Closure Revalidate Remark"
                                    variant="outlined"
                                    multiline
                                    RowsMax={4}
                                    required
                                    rows={2}
                                    fullWidth
                                    value={closureRevalidateRemark}
                                    onChange={(e) => setClosureRevalidateRemark(e.target.value)}
                                    error={!!errors.closureRevalidateRemark}
                                    helperText={errors.closureRevalidateRemark}
                                  />
                    </Grid>
                </Grid>


                <Grid item xs={12} sm={12} lg={12} sx={{ mt: 1, ml: 60 }}>
                    <Button variant="contained" sx={{ width: '30ch', borderRadius: "12px", textTransform: "capitalize" }}
                        onClick={handleClosureSevenSubmit}
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

export default Closureseven
