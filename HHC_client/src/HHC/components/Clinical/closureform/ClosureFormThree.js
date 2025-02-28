import React, { useState, useEffect } from 'react';
import { Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ClosureFormThree = ({handleEvent,eid,dtlEventID,evtId, formNo, closureStatus,wound2,oozing2,discharge2,dressing2}) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    console.log(wound2,'www');
    

    const [wound, setWound] = useState(wound2);
    const [oozing, setOozing] = useState(oozing2);
    const [discharge, setDischarge] = useState(discharge2);
    const [dressing, setDressing] = useState(dressing2);
    const [medGovRemark, setMedGovRemark1] = useState('');


    useEffect(() => {
        // Update local states when props change
        setWound(wound2);
        setOozing(oozing2);
        setDischarge(discharge2);
        setDressing(dressing2);

    }, [wound2,oozing2,discharge2,dressing2]);

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

    async function handleClosureThreeSubmit(event) {
        event.preventDefault();
       
        const requestData = {
            form_number: formNo,
            Wound: wound,
            Oozing: oozing,
            Discharge: discharge,
            Dressing_status: dressing,
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
            <Box sx={{ flexGrow: 1, bgcolor: "#ffffff" }}>

                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Wound</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Wound"
                                    value={wound || ''}
                                    onChange={(e) => setWound(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Healthy" />
                                    <FormControlLabel value="2" control={<Radio />} label="Unhealthy" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Discharge</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Discharge"
                                    value={discharge || ''}
                                    onChange={(e) => setDischarge(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Serious" />
                                    <FormControlLabel value="2" control={<Radio />} label="Serosanguinous" />
                                    <FormControlLabel value="3" control={<Radio />} label="Sanguinous" />
                                    <FormControlLabel value="4" control={<Radio />} label="Purulent" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Oozing</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Oozing"
                                    value={oozing || ''}
                                    onChange={(e) => setOozing(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Present" />
                                    <FormControlLabel value="2" control={<Radio />} label="Absent" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Healing</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Dressing_status"
                                    value={dressing || ''}
                                    onChange={(e) => setDressing(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Healing" />
                                    <FormControlLabel value="2" control={<Radio />} label="NotHealing" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <TextField
                            id="standard-basic"
                            // required
                            label="Governance Remark"
                            variant="outlined"
                            multiline
                            rows={2}
                            sx={{ width: '29ch' }}
                            name="medGovRemark"
                            // value={remark}
                            onChange={(e) => setMedGovRemark1(e.target.value)}
                        />
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} lg={12} sx={{ mt: 2, }}>
                    <Button variant="contained" sx={{ width: '20ch', borderRadius: "12px", ml: "20rem", textTransform: "capitalize" }}
                        onClick={handleClosureThreeSubmit}
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

export default ClosureFormThree
