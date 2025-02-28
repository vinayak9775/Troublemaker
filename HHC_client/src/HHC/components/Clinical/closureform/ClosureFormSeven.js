import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
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

const ClosureFormSeven = ({handleEvent,eid,dtlEventID, evtId, formNo, closureStatus, pulse, temp, rr, gcs, sp, tb, bp, }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    console.log(pulse);
    

    const [pulse1, setPulse1] = useState(pulse);
    const [temp1, setTemp1] = useState(temp);
    const [rr1, setRR1] = useState(rr);
    const [gcs1, setGCS1] = useState(gcs);
    const [sp1, setSP1] = useState(sp);
    const [tb1, setTB1] = useState(tb);
    const [bp1, setBP1] = useState(bp);
    const [medGovRemark, setMedGovRemark1] = useState('');


    useEffect(() => {
        setPulse1(pulse);
        setTemp1(temp);
        setRR1(rr);
        setGCS1(gcs);
        setSP1(sp);
        setTB1(tb);
        setBP1(bp);
    }, [pulse, temp, rr, gcs, sp, tb, bp]);

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

    async function handleClosureSevenSubmit(event) {
        event.preventDefault();

        const requestData = {
            form_number: formNo,
            Temp_core: temp1,
            TBSL: tb1,
            Pulse: pulse1,
            SpO2: sp1,
            RR: rr1,
            GCS_Total: gcs1,
            BP: bp1,
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
                                value={pulse1 || ''} onChange={(e) => setPulse1(e.target.value)}
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
                                value={temp1 || ''} onChange={(e) => setTemp1(e.target.value)}
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
                                value={rr1 || ''} onChange={(e) => setRR1(e.target.value)}
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
                                value={gcs1 || ''} onChange={(e) => setGCS1(e.target.value)}
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
                                value={sp1 || ''} onChange={(e) => setSP1(e.target.value)}
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
                                value={tb1 || ''} onChange={(e) => setTB1(e.target.value)}
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
                                value={bp1 || ''} onChange={(e) => setBP1(e.target.value)}
                            // error={!!errors.bp}
                            // helperText={errors.bp} 
                            />/MmHg
                        </Box>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <TextField
                            id="standard-basic"
                            // required
                            label="Governance Remark"
                            variant="outlined"
                            multiline
                            rows={4}
                            sx={{ width: '21ch' }}
                            name="medGovRemark"
                            // value={remark}
                            onChange={(e) => setMedGovRemark1(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} lg={12} sx={{ mt: 1, ml: 40 }}>
                    <Button variant="contained" sx={{ width: '20ch', borderRadius: "12px", textTransform: "capitalize" }}
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

export default ClosureFormSeven
