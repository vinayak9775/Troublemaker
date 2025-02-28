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
import hrt from "../../../assets/heart.png";
import thermo from "../../../assets/Thermometer.png";
import brain from "../../../assets/Brain.png";
import vector from "../../../assets/Vector.png";
import spine from "../../../assets/Spine.png";
import blood from "../../../assets/blood.png";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Swal from 'sweetalert2';


const ClosureFormOne = ({ handleEvent, eid, baseline, airway, breathing, circ, skin, pulse, temp, rr, gcs, sp, tb, bp, Remark, closureStatus, formNo, evtId, dtlEventID }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    console.log(evtId, 'vvvvvvvvvv');

    const [baselineState, setBaseline] = useState(baseline);
    const [airwayState, setAirway] = useState(airway);
    const [breathingState, setBreathing] = useState(breathing);
    const [circState, setCirc] = useState(circ);
    const [skinState, setSkin] = useState(skin);
    const [pulseState, setPulse] = useState(pulse);
    const [tempState, setTemp] = useState(temp);
    const [rrState, setRR] = useState(rr);
    const [gcsState, setGCS] = useState(gcs);
    const [spState, setSP] = useState(sp);
    const [tbState, setTB] = useState(tb);
    const [bpState, setBP] = useState(bp);
    const [remark, setRemark] = useState(Remark);
    const [medGovRemark, setMedGovRemark1] = useState('');


    useEffect(() => {
        // Update local states when props change
        setBaseline(baseline);
        setAirway(airway);
        setBreathing(breathing);
        setCirc(circ);
        setSkin(skin);
        setPulse(pulse);
        setTemp(temp);
        setRR(rr);
        setGCS(gcs);
        setSP(sp);
        setTB(tb);
        setBP(bp);
        setRemark(Remark);
        console.log(baselineState, 'kkkkkkkk');

    }, [baseline, airway, breathing, circ, skin, pulse, temp, rr, gcs, sp, tb, bp, Remark]);

    const handleChange = () => {
        // Create an object with updated values
        const updatedValues = {
            baseline: baselineState,
            airway: airwayState,
            breathing: breathingState,
            circ: circState,
            skin: skinState,
            pulse: pulseState,
            temp: tempState,
            rr: rrState,
            gcs: gcsState,
            sp: spState,
            tb: tbState,
            bp: bpState,
            Remark: remark
            // ... include other states as needed
        };
        console.log(updatedValues, 'oooooooo');

        // Call the onUpdate function with updated values
        // onUpdate(updatedValues);
    };

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        console.log('snackkkkkkkkkkkkk');
        handleEvent(eid);
    };

    async function handleClosureOneSubmit(event) {
        event.preventDefault();

        const requestData = {
            form_number: formNo,
            Airway: airwayState,
            Breathing: breathingState,
            Circulation: circState,
            Temp_core: tempState,
            TBSL: tbState,
            Pulse: pulseState,
            SpO2: spState,
            RR: rrState,
            GCS_Total: gcsState,
            BP: bpState,
            Skin_Perfusion: skinState,
            Remark: remark,
            medical_goernance_ramark: medGovRemark,
        };
        console.log("POST API Hitting......", requestData)
        try {
            if (closureStatus == true) {
                const response = await fetch(`${port}/medical/update_job_closure_form_api/${evtId}/`, {
                    method: "PUT",
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
                // alert("Updated Succesfully..");
                setOpenSnackbar(true);
                setSnackbarMessage('Closure data updated successfully!');
                console.log("Closure data", result);
            }
            else if (closureStatus == false) {
                const response = await fetch(`${port}/medical/Medical_job_closure/?dtl_eve=${dtlEventID}`, {
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
                // alert("Submitted Succesfully..");
                setOpenSnackbar(true);
                setSnackbarMessage('Closure data submitted successfully!');
                console.log("Closure data", result);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }


    return (
        <>
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1, bgcolor: "#ffffff", }}>


                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>

                    <Grid item xs={4} sm={4} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Baseline</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="Baseline"
                                    value={baselineState || ''}
                                    onChange={(e) => {
                                        setBaseline(e.target.value);
                                        // handleChange(); // Update parent state when this changes
                                    }}
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
                                    value={airwayState || ''}
                                    onChange={(e) => {
                                        setAirway(e.target.value)
                                        // handleChange();
                                    }}
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
                                <FormLabel id="demo-row-radio-buttons-group-label">Skin Perfusion</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Skin_Perfusion"
                                    value={skinState || ''}
                                    onChange={(e) => {
                                        setSkin(e.target.value)
                                        // handleChange();
                                    }}
                                // error={!!errors.skin}
                                // helperText={errors.skin}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Normal" />
                                    <FormControlLabel value="2" control={<Radio />} label="Abnormal" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Breathing</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Breathing"
                                    value={breathingState || ''}
                                    onChange={(e) => {
                                        setBreathing(e.target.value)
                                        // handleChange();
                                    }}
                                // error={!!errors.breathing}
                                // helperText={errors.breathing}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Present" />
                                    <FormControlLabel value="2" control={<Radio />} label="Compromised" />
                                    <FormControlLabel value="3" control={<Radio />} label="Absent" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Circulation</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Circulation"
                                    value={circState || ''}
                                    onChange={(e) => {
                                        setCirc(e.target.value)
                                        // handleChange();
                                    }}
                                // error={!!errors.circ}
                                // helperText={errors.circ}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Radial" />
                                    <FormControlLabel value="2" control={<Radio />} label="Present" />
                                    <FormControlLabel value="3" control={<Radio />} label="Absent" />
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
                                value={pulseState || ''}
                                onChange={(e) => {
                                    setPulse(e.target.value)
                                    // handleChange();
                                }}
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
                                value={tempState || ''} onChange={(e) => {
                                    setTemp(e.target.value)
                                    // handleChange();
                                }}
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
                                value={rrState || ''} onChange={(e) => {
                                    setRR(e.target.value)
                                    // handleChange();
                                }}
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
                                value={gcsState || ''} onChange={(e) => {
                                    setGCS(e.target.value)
                                    // handleChange();
                                }}
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
                                value={spState || ''} onChange={(e) => {
                                    setSP(e.target.value)
                                    // handleChange();
                                }}
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
                                value={tbState || ''} onChange={(e) => {
                                    setTB(e.target.value)
                                    // handleChange();
                                }}
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
                                value={bpState || ''} onChange={(e) => {
                                    setBP(e.target.value)
                                    // handleChange();
                                }}
                            // error={!!errors.bp}
                            // helperText={errors.bp} 
                            />/MmHg
                        </Box>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <TextField id="standard-basic" label="Remark" variant="outlined" multiline
                            rows={3.8}
                            name="Remark"
                            value={remark || ''}
                            onChange={(e) => {
                                setRemark(e.target.value)
                                // handleChange();
                            }}
                        // error={!!errors.remark}
                        // helperText={errors.remark} 
                        />
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <TextField
                            id="standard-basic"
                            // required
                            label="MedGovRemark"
                            variant="outlined"
                            multiline
                            rows={3}
                            sx={{ width: '42ch' }}
                            name="Remark"
                            onChange={(e) => setMedGovRemark1(e.target.value)}

                        // value={remark}
                        // onChange={(e) => onRemarkChange(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6} md={6} sx={{ mt: 1, my: 4, mx: 'auto' }}>
                        <Button variant="contained" sx={{ width: '20ch', borderRadius: "12px", textTransform: "capitalize" }}
                            onClick={handleClosureOneSubmit}
                        >Submit</Button>
                    </Grid>
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
                        sx={{ width: "20rem", ml: 52, mb: 10 }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    )
}

export default ClosureFormOne
