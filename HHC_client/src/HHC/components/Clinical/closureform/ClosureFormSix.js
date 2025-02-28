import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const ClosureFormSix = ({handleEvent,eid,dtlEventID,remark,evtId,formNo,closureStatus}) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    console.log(evtId,formNo,'evnt iddd');
    
    const [remark1, setRemark1] = useState(remark);
    const [medGovRemark, setMedGovRemark1] = useState('');

    useEffect(() => {
        setRemark1(remark);
    }, [remark]);

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
    
    async function handleClosureSixSubmit(event) {
        event.preventDefault();
        const requestData = {
            Remark: remark1,
            medical_goernance_ramark: medGovRemark,
            form_number: formNo,
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
            <Box sx={{ flexGrow: 1, bgcolor: "#ffffff"  }}>
                <Grid item xs={12} md={12} lg={12} container spacing={1} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <TextField
                            id="standard-basic"
                            // required
                            label="Remark"
                            variant="outlined"
                            multiline
                            rows={3}
                            sx={{ width: '42ch' }}
                            name="Remark"
                            value={remark1 || ''}
                            onChange={(e) => setRemark1(e.target.value)}
                            // InputLabelProps={{
                            //     shrink: remark1 && remark1.length > 0  // Ensure remark1 is not undefined or null
                            // }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <TextField
                            id="standard-basic"
                            // required
                            label="Medical Governance Remark"
                            variant="outlined"
                            multiline
                            rows={3}
                            sx={{ width: '42ch' }}
                            name="medGovRemark"
                            // value={remark}
                            onChange={(e) => setMedGovRemark1(e.target.value)}
                        />
                    </Grid>
                </Grid>
             
                <Grid item xs={12} sm={12} lg={12} sx={{ mt: 2, mb:2}}>
                    <Button variant="contained" sx={{ width: '20ch', borderRadius: "12px", ml: "20rem", textTransform: "capitalize" }}
                        onClick={handleClosureSixSubmit}
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

export default ClosureFormSix
