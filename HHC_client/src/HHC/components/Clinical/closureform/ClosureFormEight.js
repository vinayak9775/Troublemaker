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

const ClosureFormEight = ({handleEvent,eid,dtlEventID, evtId, formNo, closureStatus, sutures1, staples1, dehiWound1, wound18, remark8 }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');


    const [sutures, setSutures] = useState(sutures1);
    const [staples, setStaples] = useState(staples1);
    const [dehiWound, setDehiWound] = useState(dehiWound1);
    const [wound, setWound] = useState(wound18);
    const [remark, setRemark] = useState(remark8)
    const [medGovRemark, setMedGovRemark1] = useState('');



    useEffect(() => {
        setSutures(sutures1);
        setStaples(staples1);
        setDehiWound(dehiWound1);
        setWound(wound18);
        setRemark(remark8)
    }, [sutures1, staples1, dehiWound1, wound18, remark8]);

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

    async function handleClosureEightSubmit(event) {
        event.preventDefault();
        const requestData = {
            form_number: formNo,
            Sutures_type: sutures,
            Num_Sutures_staples: staples,
            Wound_dehiscence: dehiWound,
            Wound: wound,
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
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Satures Type</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Sutures_type"
                                    value={sutures || ''}
                                    onChange={(e) => setSutures(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Satures" />
                                    <FormControlLabel value="2" control={<Radio />} label="Staples" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <Typography variant="subtitle1" sx={{ ml: 2 }}>
                                No of Sutures/Staples
                            </Typography>
                            <TextField id="standard-basic" variant="standard"
                                name="Num_Sutures_staples"
                                value={staples || ''}
                                onChange={(e) => setStaples(e.target.value)}
                            // error={!!errors.fluid}
                            // helperText={errors.fluid} 
                            />
                        </Box>
                    </Grid>
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
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}>
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Wound Dehiscence</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="row-radio-buttons-group"
                                    name="Wound_dehiscence"
                                    value={dehiWound || ''}
                                    onChange={(e) => setDehiWound(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="2" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        {/* <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '8px' }}> */}
                        <TextField id="standard-basic" label="Remark" variant="outlined" multiline
                            rows={2} sx={{ width: '29ch' }} name="Remark"
                            value={remark || ''} onChange={(e) => setRemark(e.target.value)}
                        // error={!!errors.remark}
                        // helperText={errors.remark}
                        />
                        {/* </Box> */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <TextField
                            id="standard-basic"
                            // required
                            label="Medical Governance Remark"
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
                        onClick={handleClosureEightSubmit}
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

export default ClosureFormEight;
