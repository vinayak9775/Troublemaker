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

const ClosureFormFour = ({handleEvent,eid, dtlEventID,evtId, formNo, closureStatus,Nameinjectionfld1 ,InjsiteIM1, Dosefreq1,remark1}) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [fluid, setFluid] = useState(Nameinjectionfld1);
    const [im, setIM] = useState(InjsiteIM1);
    const [dose, setDose] = useState(Dosefreq1);
    const [remark, setRemark] = useState(remark1);
    const [medGovRemark, setMedGovRemark1] = useState('');


    useEffect(() => {
        // Update local states when props change
        setFluid(Nameinjectionfld1);
        setIM(InjsiteIM1);
        setDose(Dosefreq1);
        setRemark(remark1);

    }, [Nameinjectionfld1 ,InjsiteIM1, Dosefreq1,remark1]);

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

    async function handleClosureFourSubmit(event) {
        event.preventDefault();
    
        const requestData = {
            form_number: formNo,
            Name_injection_fld: fluid,
            Inj_site_IM: im,
            Dose_freq: dose,
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

                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <Typography variant="subtitle1" sx={{ ml: 2 }}>
                                Name of Injection / fluid
                            </Typography>
                            <TextField id="standard-basic" variant="standard"
                                name="Name_injection_fld"
                                value={fluid || ''} 
                                onChange={(e) => setFluid(e.target.value)}
                            // error={!!errors.fluid}
                            // helperText={errors.fluid} 
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '5px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Inj site for IM</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Inj_site_IM"
                                    value={im || ''}
                                    onChange={(e) => setIM(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Gluteal" />
                                    <FormControlLabel value="2" control={<Radio />} label="Deltoid" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '7px' }}>
                            <Typography variant="subtitle1" sx={{ ml: 2 }}>
                                Dose and frequency
                            </Typography>
                            <TextField id="standard-basic" variant="standard" name="Dose_freq"
                                value={dose || ''} onChange={(e) => setDose(e.target.value)}
                           
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <TextField id="standard-basic" label="Remark" variant="outlined" multiline
                            rows={2} sx={{ width: '42ch' }} name="Remark"
                            value={remark || ''} onChange={(e) => setRemark(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <TextField
                            id="standard-basic"
                            // required
                            label="Governance Remark"
                            variant="outlined"
                            multiline
                            rows={2}
                            sx={{ width: '44ch' }}
                            name="medGovRemark"
                            // value={remark}
                            onChange={(e) => setMedGovRemark1(e.target.value)}
                        />
                    </Grid>

                </Grid>

                <Grid item xs={12} sm={12} lg={12} sx={{ mt: 2, }}>
                    <Button variant="contained" sx={{ width: '20ch', borderRadius: "12px", ml: "20rem", textTransform: "capitalize" }}
                        onClick={handleClosureFourSubmit}
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

export default ClosureFormFour;
