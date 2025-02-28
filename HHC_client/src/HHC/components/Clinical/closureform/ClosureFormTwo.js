import React, { useState, useEffect } from 'react';
import { Grid, TextField, Modal } from '@mui/material';
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
import ClosureEvents from '../ClosureEvents';

const ClosureFormtwo = ({ handleEvent, eid, dtlEventID, events, closureStatus, formNo, evtId }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    console.log(dtlEventID, 'eeeeee');
    console.log(events, 'eventseventseventseventsevents');
    const initializeSelectedOptions = () =>
        events.map(event =>
            event.remark_type === undefined
                ? ""
                : (event.remark_type === "Remark" ? "2" : "1")
        );

    const initializeRemarks = () =>
        events.map(item => {
            if (item.remark_type === "Remark") {
                const remarkKey = Object.keys(item).find(key => key.endsWith('_datetime_remark'));
                return remarkKey ? item[remarkKey] : "";
            }
            return ""; 
        });

    const initializeDateAndTime = () =>
        events.map(item => {
            if (item.remark_type === "Datetime") {
                const remarkKey = Object.keys(item).find(key => key.endsWith('_datetime_remark'));
                return remarkKey ? item[remarkKey] : "";
            }
            return "";
        });
    const initializeRadioValues = () => events.map(item => (item.remark_type === "Remark" ? "1" : "2"));
    const [selectedOptions, setSelectedOptions] = useState(initializeSelectedOptions);
    const [remarks, setRemarks] = useState(initializeRemarks);
    const [dateAndTime, setDateAndTime] = useState(initializeDateAndTime);


    useEffect(() => {
        setSelectedOptions(initializeSelectedOptions());
        setRemarks(initializeRemarks());
        setDateAndTime(initializeDateAndTime());
        setRadioValues(initializeRadioValues());
    }, [events]);

    console.log(selectedOptions);
    const [medGovRemark, setMedGovRemark1] = useState('');

    const [radioValues, setRadioValues] = useState(events.map(item => (item.remark_type === "Remark" ? "1" : "2")));


    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [dynamicDateTimes, setDynamicDateTimes] = useState({});
    const handleDateTimeChange = (e, index, item) => {
        console.log(item);
        const newDateAndTime = [...dateAndTime];
        const newDynamicDateTimes = { ...dynamicDateTimes };
        newDateAndTime[index] = e.target.value;
        newDynamicDateTimes[item] = e.target.value;
        setDateAndTime(newDateAndTime);
        console.log(newDynamicDateTimes);
        setDynamicDateTimes(newDynamicDateTimes);
    };

    const handleRemarkChange = (e, index, item) => {
        console.log(item);
        const newRemarks = [...remarks];
        const newDynamicRemarks = { ...dynamicDateTimes };
        newRemarks[index] = e.target.value;
        newDynamicRemarks[item] = e.target.value;
        setRemarks(newRemarks);
        console.log(newDynamicRemarks);
        setDynamicDateTimes(newDynamicRemarks);
    };

    const [keyValuePairs, setKeyValuePairs] = useState({});
    const handleOptionChange = (event, index, secondKey) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index] = event.target.value;
        setSelectedOptions(newSelectedOptions);

        setKeyValuePairs(prevState => ({
            ...prevState,
            [secondKey]: event.target.value,
        }));
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        console.log('snackkkkkkkkkkkkk');
        handleEvent(eid);
    };

    async function handleClosureTwoSubmit(event) {
        event.preventDefault();

        const requestData = {
            form_number: formNo,
            ...dynamicDateTimes,
            ...keyValuePairs,
            medical_goernance_ramark: medGovRemark

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
            <Box sx={{
                flexGrow: 1, ml: 1, mr: 1, bgcolor: "#ffffff", overflowY: 'auto', maxHeight: '500px',
            }}>
                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>
                    {events && events.map((item, index) => {
                        // const thirdKey = Object.keys(item)[3];
                        const thirdKey = Object.keys(item).find(key => key.endsWith('_datetime_remark'));
                        const secondKey = Object.keys(item)[1];
                        // console.log(thirdKey);

                        return (
                            <>
                                <Grid key={index} item xs={12} sm={12} md={6} lg={6}>
                                    <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                                        <FormControl>
                                            <FormLabel id={`demo-row-radio-buttons-group-label-${index}`}>
                                                {item.hca_que}
                                            </FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby={`demo-row-radio-buttons-group-label-${index}`}
                                                value={selectedOptions[index] || ''}
                                                onChange={(e) => handleOptionChange(e, index, secondKey)}
                                            >
                                                <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="2" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                        {selectedOptions[index] === "2" && (
                                            <TextField
                                                required
                                                id="remark"
                                                name="remark"
                                                placeholder='write here remark'
                                                value={remarks[index] || ''}
                                                onChange={(e) => handleRemarkChange(e, index, thirdKey)}
                                                sx={{ mt: 1 }}
                                                multiline
                                                rows={2}
                                                fullWidth
                                            />
                                        )}
                                        {selectedOptions[index] === "1" && (
                                            <TextField
                                                required
                                                id="datetime-local"
                                                name="dateAndTime"
                                                type="datetime-local"
                                                size="small"
                                                sx={{ mt: 1 }}
                                                value={dateAndTime[index] || ''}
                                                onChange={(e) => handleDateTimeChange(e, index, thirdKey)}
                                            />
                                        )}
                                    </Box>
                                </Grid>
                            </>)
                    }

                    )}
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
                        />
                    </Grid>
                </Grid>



                <Grid item xs={12} sm={12} lg={12} sx={{ mt: 1, ml: "20rem", mb: 3 }}>
                    <Button variant="contained" sx={{ width: '20ch', borderRadius: "12px", textTransform: "capitalize" }} onClick={handleClosureTwoSubmit}>Submit</Button>
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

export default ClosureFormtwo
