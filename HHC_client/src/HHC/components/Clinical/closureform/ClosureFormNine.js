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

const ClosureFormNine = ({handleEvent,eid,dtlEventID, closureStatus, formNo, evtId, rtSize9, procedure9, remarkLab }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [rtSize, setRTSize] = useState(rtSize9);
    const [procedure, setProcedure] = useState(procedure9);
    const [remark, setRemark] = useState(remarkLab);
    const [medGovRemark, setMedGovRemark1] = useState('');


    useEffect(() => {
        setRTSize(rtSize9);
        setProcedure(procedure9);
        setRemark(remarkLab);
    }, [rtSize9, procedure9, remarkLab]);


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

    async function handleClosureNineSubmit(event) {
        event.preventDefault();

        const requestData = {
            form_number: formNo,
            Size_RT: rtSize,
            Procedure: procedure,
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
            <Box sx={{ flexGrow: 1, bgcolor: "#ffffff" }}>
                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Size of RT</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Size_RT"
                                    value={rtSize || ''}
                                    onChange={(e) => setRTSize(e.target.value)}
                                >
                                    <FormControlLabel value="14" control={<Radio />} label="14" />
                                    <FormControlLabel value="16" control={<Radio />} label="16" />
                                    <FormControlLabel value="18" control={<Radio />} label="18" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Procedure</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Procedure"
                                    value={procedure || ''}
                                    onChange={(e) => setProcedure(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Eventful" />
                                    <FormControlLabel value="2" control={<Radio />} label="Uneventful" />

                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        {/* <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}> */}
                        <TextField id="standard-basic" label="Remark" variant="outlined" multiline
                            rows={2} sx={{ width: '44ch' }} name="Remark"
                            value={remark || ''} onChange={(e) => setRemark(e.target.value)}
                        />
                        {/* </Box> */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <TextField
                            id="standard-basic"
                            // required
                            label="MedGovRemark"
                            variant="outlined"
                            multiline
                            rows={2}
                            sx={{ width: '44ch' }}
                            name="Remark"
                            onChange={(e) => setMedGovRemark1(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} lg={12} sx={{ mt: 1, ml: "20rem" }}>
                    <Button variant="contained" sx={{ width: '20ch', borderRadius: "12px", textTransform: "capitalize" }} onClick={handleClosureNineSubmit}>Submit</Button>
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

export default ClosureFormNine
