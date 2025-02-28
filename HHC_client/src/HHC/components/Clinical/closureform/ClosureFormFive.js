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

const ClosureFormFive = ({handleEvent,eid,dtlEventID,closureStatus, formNo, evtId, Cathetertype1, Sizecatheter1, Procedure1, RemarkN }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [catheter, setCatheter] = useState(Cathetertype1);
    const [cathSize, setCathSize] = useState(Sizecatheter1);
    const [procedure, setProcedure] = useState(Procedure1);
    const [remark, setRemark] = useState(RemarkN);
    const [medGovRemark, setMedGovRemark1] = useState('');
    console.log(evtId,'lllllll');
    

    // useEffect(() => {
    //     // Update local states when props change
    //     setCatheter(Cathetertype1);
    //     setCathSize(Sizecatheter1);
    //     setProcedure(Procedure1);
    //     setRemark(RemarkN);

    // }, [Cathetertype1, Sizecatheter1, Procedure1, RemarkN]);


    useEffect(() => {
        // Update local states when props change
        setCatheter(Cathetertype1 || '');
        setCathSize(Sizecatheter1 || '');
        setProcedure(Procedure1 || '');
        setRemark(RemarkN || '');
    }, [Cathetertype1, Sizecatheter1, Procedure1, RemarkN]);

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


    async function handleClosureFiveSubmit(event) {
        event.preventDefault();
        // handleEmptyField();

        const requestData = {
            form_number: formNo,
            Catheter_type: catheter,
            Size_catheter: cathSize,
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
{console.log(catheter)}
                <Grid item xs={12} container spacing={1} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Catheter Removal</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Catheter_type"
                                    value={catheter || ''}
                                    onChange={(e) => setCatheter(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Silicon" />
                                    <FormControlLabel value="2" control={<Radio />} label="Simple" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Size of catheter</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Size_catheter"
                                    value={cathSize || ''}
                                    onChange={(e) => setCathSize(e.target.value)}
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
                        // error={!!errors.remark}
                        // helperText={errors.remark} 
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
                            rows={3}
                            sx={{ width: '42ch' }}
                            name="Remark"
                            onChange={(e) => setMedGovRemark1(e.target.value)}

                        // value={remark}
                        // onChange={(e) => onRemarkChange(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6} sx={{ mt: 2, }}>
                        <Button variant="contained" sx={{ width: '20ch', borderRadius: "12px", ml: "2rem", mt: 2, textTransform: "capitalize" }}
                            onClick={handleClosureFiveSubmit}
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

export default ClosureFormFive
