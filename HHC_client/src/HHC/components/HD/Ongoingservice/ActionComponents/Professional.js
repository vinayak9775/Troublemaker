import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { CardContent } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { isDateDisabled } from "../../../Utils/ValidationUtils";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Professional = ({ eveID, serviceID, subSrvID, ptnName, ptnPhn, evePlanID, ptnZone, startDateTime, endDateTime, onClose }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [prof, setProf] = useState([]);
    const [selectedProf, setSelectedProf] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [remark, setRemark] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [zone, setZone] = useState([]);
    const [selectedZone, setSelectedZone] = useState('');
    const [errors, setErrors] = useState({
        selectedProf: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        remark
    });

    const handleEmptyField = () => {
        const newErrors = {};

        if (!selectedProf) {
            newErrors.selectedProf = 'This is required';
        }
        if (!startDate) {
            newErrors.startDate = 'Date is required';
        }
        if (!endDate) {
            newErrors.endDate = 'Date is required';
        }
        if (!startTime) {
            newErrors.startTime = 'Time is required';
        }
        if (!endTime) {
            newErrors.endTime = 'Time is required';
        }
        if (!remark) {
            newErrors.remark = 'Remark is required';
        }
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    console.log("Zone ID,,,,,", ptnZone)

    useEffect(() => {
        const getZone = async () => {
            try {
                const res = await fetch(`${port}/web/agg_hhc_all_zone_api/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                setZone(data);
            } catch (error) {
                console.error("Error fetching Zone data:", error);
            }
        };
        getZone();
    }, []);

    // useEffect(() => {
    //     const getProfessional = async () => {
    //         if (subSrvID && startDate && endDate) {
    //             console.log("Sub Service ID, startDate, endDate.....", subSrvID, startDate, endDate)
    //             try {
    //                 const res = await fetch(`${port}/web/professional_availability_api/${subSrvID}/${startDate}/${endDate}`, {
    //                     headers: {
    //                         'Authorization': `Bearer ${accessToken}`,
    //                         'Content-Type': 'application/json',
    //                     },
    //                 });
    //                 const data = await res.json();
    //                 console.log("Professional Availability.........", data);
    //                 if (data.msg === "Professional Not Available") {
    //                     setProf([]);
    //                 } else {
    //                     setProf(data);
    //                 }
    //             } catch (error) {
    //                 console.error("Error fetching Professional:", error);
    //             }
    //         }
    //     };
    //     getProfessional();
    // }, [subSrvID, startDate, endDate]);

    useEffect(() => {
        const getProfessional = async () => {
            const zoneToUse = selectedZone || ptnZone;
            console.log("zone", selectedZone, ptnZone)
            if (zoneToUse && serviceID && startDate && endDate && startTime && endTime) {
                console.log("zoneToUse...", zoneToUse, serviceID, startDate, endDate, startTime, endTime)
                try {
                    let apiUrl = `${port}/web/agg_hhc_event_professional_reschdl_api/?zone=${zoneToUse}&actual_StartDate_Time=${startDate}&actual_EndDate_Time=${endDate}&start_time=${startTime}:00&end_time=${endTime}:00&srv=${serviceID}`;
                    const res = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Professional List.........", data);
                    if (data.msg === "Professional Not Available") {
                        setProf([]);
                    } else {
                        setProf(data);
                    }
                } catch (error) {
                    console.error("Error fetching Professional List:", error);
                    // setLoading(false);
                }
            };
        }
        getProfessional();
    }, [ptnZone, selectedZone, serviceID, startDate, endDate, startTime, endTime]);

    async function handleProfessional(event) {
        event.preventDefault();
        const hasEmptyFields = handleEmptyField();
        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill all required details.');
            setSnackbarSeverity('error');
            return;
        }
        const requestData = {
            eve_id: eveID,
            actual_StartDate_Time: startDate,
            actual_EndDate_Time: endDate,
            // start_time: startTime,
            // end_time: endTime,
            srv_prof_id: selectedProf,
            remark: remark,
        };
        console.log("POST API Hitting......", requestData)
        if (eveID) {
            try {
                const response = await fetch(`${port}/web/prof_reschedule/${eveID}/`, {
                    method: "PATCH",
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
                console.log("Successfully submitted Professional Reschedule data", result);
                setOpenSnackbar(true);
                setSnackbarMessage('Professional reschedule successfully!');
                setSnackbarSeverity('success');
                // onClose();
                window.location.reload();
            } catch (error) {
                console.error("Error fetching Professional Reschedule:", error);
            }
        }
    }

    return (
        <Box>
            <CardContent>
                <Grid container spacing={2} sx={{ marginTop: "1px" }}>
                    <Grid item lg={12} sm={12} xs={12}>
                        <div style={{ display: "flex" }}>
                            <Typography variant='body2' sx={{ width: "44%" }} color="text.secondary">Patient Name:</Typography>
                            <Typography variant='subtitle2'>{ptnName}</Typography>
                        </div>
                        <div style={{ display: "flex" }}>
                            <Typography variant='body2' sx={{ width: "44%" }} color="text.secondary">Contact Number:</Typography>
                            <Typography variant='subtitle2'>{ptnPhn}</Typography>
                        </div>
                    </Grid>

                    <Grid container spacing={1} sx={{ mt: 2, ml: 1 }}>
                        <Grid item lg={6} sm={6} xs={6} >
                            <TextField
                                required
                                id="start_date"
                                name="actual_StartDate_Time"
                                label="From Date"
                                type="date"
                                size="small"
                                fullWidth
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                error={!!errors.startDate}
                                helperText={errors.startDate}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                // inputProps={{
                                //     min: new Date().toISOString().split('T')[0],
                                //     disabledDates: { 
                                //         isDisabled: isDateDisabled,
                                //     },
                                // }}
                                inputProps={{
                                    // min: getCurrentDateTimeString(),
                                    min: startDateTime ? startDateTime : new Date().toISOString().split('T')[0],
                                    max: endDateTime ? endDateTime : undefined,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item lg={6} sm={6} xs={6}>
                            <TextField
                                required
                                id="start_time"
                                name="start_time"
                                label="Time"
                                type="time"
                                size="small"
                                fullWidth
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
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
                    </Grid>

                    <Grid container spacing={1} sx={{ mt: 2, ml: 1 }}>
                        <Grid item lg={6} sm={6} xs={6} >
                            <TextField
                                required
                                id="end_date"
                                name="actual_EndDate_Time"
                                label="To Date"
                                // type="datetime-local"
                                type="date"
                                size="small"
                                fullWidth
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                error={!!errors.endDate}
                                helperText={errors.endDate}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                inputProps={{
                                    // min: startDate, 
                                    // disabledDates: {
                                    //     isDisabled: isDateDisabled, 
                                    // },
                                    min: startDateTime ? startDateTime : new Date().toISOString().split('T')[0],
                                    max: endDateTime ? endDateTime : undefined,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item lg={6} sm={6} xs={6}>
                            <TextField
                                required
                                id="end_time"
                                name="end_time"
                                label="Time"
                                type="time"
                                size="small"
                                fullWidth
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
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

                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            label="Select zone"
                            id="prof_zone_id"
                            name="prof_zone_id"
                            select
                            size="small"
                            fullWidth
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                },
                            }}
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            maxHeight: '120px',
                                            maxWidth: '200px',
                                        },
                                    },
                                },
                            }}
                        >
                            {zone.map((option) => (
                                <MenuItem key={option.prof_zone_id} value={option.prof_zone_id}
                                    sx={{ fontSize: "14px" }}>
                                    {option.Name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            id="srv_prof_id"
                            name="srv_prof_id"
                            select
                            label="Professional Available"
                            size="small"
                            fullWidth
                            value={selectedProf}
                            onChange={(e) => setSelectedProf(e.target.value)}
                            error={!!errors.selectedProf}
                            helperText={errors.selectedProf}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                },
                            }}
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            maxHeight: '120px',
                                            maxWidth: '200px',
                                        },
                                    },
                                },
                            }}
                        >
                            {prof.map((option) => (
                                <MenuItem key={option.srv_prof_id} value={option.srv_prof_id} sx={{ fontSize: "14px" }}>
                                    {/* {option.srv_prof_id ? option.srv_prof_id.prof_fullname : "Not Available"} */}
                                    {option.prof_fullname}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            id="remark"
                            name="remark"
                            label="Remark"
                            placeholder='write remark here'
                            size="small"
                            fullWidth
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            multiline
                            rows={2}
                            error={!!errors.remark}
                            helperText={errors.remark}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        <Button variant="contained" sx={{ m: 1, width: '30ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", }} onClick={handleProfessional}>
                            Professional Reschedule
                        </Button>
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
                            sx={{ width: "18rem", mb: 10 }}
                        >
                            {snackbarMessage}
                        </Alert>

                    </Snackbar>
                </Grid>
            </CardContent>
        </Box>
    )
}

export default Professional
