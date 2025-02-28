import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Button, MenuItem, Snackbar, Alert } from "@mui/material"
import { getCurrentDateString } from "../../../Utils/ValidationUtils";

const Request = ({ eveId, sessionId, requestID, selectedRequestbyID, reqID, startDate, endDate, startTime, endTime, srvId, onClose, prof }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    console.log(eveId,sessionId,'eeeeeeeeeeeee');
    console.log(selectedRequestbyID,'selectedRequestbyID');
    console.log(requestID,'requestID');
    
    

    const [value, setValue] = useState('1');
    const [profData, setProfData] = useState([]);
    const [sesData, setSesData] = useState([]);
    const [profAtnData, setProfAtnData] = useState([]);
    const [selectedProf, setSelectedProf] = useState('');
    // const [startDate, setStartDate] = useState('');
    // const [startTime, setStartTime] = useState('');
    // const [endDate, setEndDate] = useState('');
    // const [endTime, setEndTime] = useState('');
    const [zone, setZone] = useState([]);
    const [selectedZone, setSelectedZone] = useState('');
    const [remark, setRemark] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [errors, setErrors] = useState({
        selectedZone: '',
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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // useEffect(() => {
    //     const getProfData = async () => {
    //         try {
    //             let url;
    //             if (eveId && sessionId) {
    //                 url = `${port}/web/professional_reuest_approval_rc/${eveId}/${sessionId}/`;
    //             } else {
    //                 url = `${port}/web/professional_reuest_approval_rc/${eveId}/`;
    //             }

    //             const res = await fetch(url, {
    //                 headers: {
    //                     'Authorization': `Bearer ${accessToken}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             });
    //             const data = await res.json();
    //             console.log("Professional Data.......", data);
    //             if (data.message === "Data not found.") {
    //                 setProfData([]);
    //                 setSesData([])
    //             } else {
    //                 setProfData(data.eve_data[0]);
    //                 setSesData(data.ses)
    //             }
    //         } catch (error) {
    //             console.error("Error fetching Professional Data:", error);
    //         }
    //     };
    //     getProfData();
    // }, [eveId, sessionId]);
     const [reschDate, setReschDate] = useState('');
    const fetchProfData = async (eveId, sessionId) => {
        try {
            let url;
            if (eveId && sessionId) {
                url = `${port}/web/professional_reuest_approval_rc/${eveId}/${sessionId}/`;
            } else {
                url = `${port}/web/professional_reuest_approval_rc/${eveId}/`;
            }
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            console.log("Professional Data.......", data);
            if (data.message === "Data not found.") {
                setProfData([]);
                setSesData([]);
            } else {
                console.log('data is set..');
                console.log(data.ses.reschedule_date,'data.sesdata.sesdata.ses');
                setReschDate(data.ses.reschedule_date);
                setProfData(data.eve_data[0]);
                setSesData(data.ses);
            }
        } catch (error) {
            console.error("Error fetching Professional Data:", error);
        }
    };

    useEffect(() => {
        if (eveId && sessionId) {
            fetchProfData(eveId, sessionId);
        }
        else if (eveId) {
            fetchProfData(eveId, sessionId);
        }
    }, [eveId, sessionId]);

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
                // console.log("Zone List a/c to City Data", data);
                setZone(data);
            } catch (error) {
                console.error("Error fetching Zone data:", error);
            }
        };
        getZone();
    }, []);

    useEffect(() => {
        const getProfessional = async () => {
            if (selectedZone && srvId && startDate && endDate && startTime && endTime) {
                console.log("ptnZone...", selectedZone, srvId, startDate, endDate, startTime, endTime)
                try {
                    let apiUrl = `${port}/web/agg_hhc_event_professional_reschdl_api/?zone=${selectedZone}&actual_StartDate_Time=${startDate}&actual_EndDate_Time=${endDate}&start_time=${startTime}&end_time=${endTime}&srv=${srvId}`;
                    const res = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Professional List.........", data);
                    if (data.msg === "Professional Not Available") {
                        setProfAtnData([]);
                    } else {
                        setProfAtnData(data);
                    }
                } catch (error) {
                    console.error("Error fetching Professional List:", error);
                    // setLoading(false);
                }
            };
        }
        getProfessional();
    }, [selectedZone, srvId, startDate, endDate, startTime, endTime]);

    async function handleApproveSubmit(event) {
        event.preventDefault();
        const requestData = {
            eve_id: eveId,
            remark: remark,
            session_id: sessionId,
        };
        console.log("POST API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/professional_reuest_approval/${reqID}/${requestID}/${selectedRequestbyID}/`, {
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
            console.log("Approve data", result);
            setOpenSnackbar(true);
            setSnackbarMessage('Request approved successfully!');
            onClose();
            // window.location.reload();
            // fetchProfData();
            prof();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    async function handleAtnSubmit(event) {
        event.preventDefault();
        const requestData = {
            eve_id: eveId,
            remark: remark,
            session_id: sessionId,
            srv_prof_id: selectedProf,
        };
        console.log("POST API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/professional_reuest_approval/${reqID}/${requestID}/${selectedRequestbyID}/`, {
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
            console.log("Approve data", result);
            setOpenSnackbar(true);
            setSnackbarMessage('Attendance approved successfully!');
            onClose();
            prof();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <>
            {(selectedRequestbyID === '1' || selectedRequestbyID === '2') ? (
                <Box sx={{ marginTop: "0px" }}>
                    {requestID === '1' && (
                        <Box sx={{ background: "#FFC9C9", mt: 2, pt: 1.5, px: 5, pb: 1.5, borderRadius: "8px" }}>
                            <Typography variant='subtitle2' style={{ fontSize: "20px", fontWeight: 600, color: "#B00000" }}>CANCEL REQUEST</Typography>
                        </Box>
                    )}
                    {requestID === '2' && (
                        <Box sx={{ background: "#E4ECFF", mt: 2, pt: 1.5, px: 5, pb: 1.5, borderRadius: "8px" }}>
                            <Typography variant='subtitle2' style={{ fontSize: "20px", fontWeight: 600, color: "#003FE0" }}>RESCHEDULE REQUEST</Typography>
                        </Box>
                    )}

                    <Typography variant='body2' style={{ fontWeight: 600, marginTop: "15px" }}>Service Summary</Typography>
                    <Box sx={{ background: "#F8F9FF", mt: 1, pt: 1, px: 2, pb: 1, borderRadius: "8px" }}>
                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                            <Typography inline variant="body2" color="text.secondary" >Patient Name</Typography>
                            <Typography inline variant="body2">{profData?.agg_sp_pt_id?.name || '-'}</Typography>
                        </Grid>

                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                            <Typography inline variant="body2" color="text.secondary" >Event ID</Typography>
                            <Typography inline variant="body2">{profData ? profData.event_code : '-'}</Typography>
                        </Grid>

                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                            <Typography inline variant="body2" color="text.secondary" >Service</Typography>
                            <Typography inline variant="body2">{profData?.epoc_data?.[0]?.srv_id?.service_title || '-'}</Typography>
                        </Grid>

                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                            <Typography inline variant="body2" color="text.secondary" >Existing Session Date</Typography>
                            <Typography inline variant="body2">  {profData?.epoc_data?.[0]?.start_date
                                ? formatDate(profData.epoc_data[0].start_date)
                                : '-'}</Typography>
                        </Grid>

                        {requestID === '2' && <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                            <Typography inline variant="body2" color="text.secondary" >Requested Date</Typography>
                            <Typography inline variant="body2">{reschDate ? formatDate(reschDate) : '-'}</Typography>
                        </Grid>}

                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                            <Typography inline variant="body2" color="text.secondary" >Remark</Typography>
                            <Typography inline variant="body2">{sesData.remark ? sesData.remark : '-'}</Typography>
                            <Typography inline variant="body2">{sesData ? formatDate(sesData.reschedule_date) : '-'}</Typography>
                        </Grid>
                    </Box>
                    <Grid sx={{ mt: 2 }}>
                        <TextField
                            required
                            id="remark"
                            name="remark"
                            label="Remark"
                            placeholder='write remark here'
                            size="small"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    {requestID === '1' && (
                        <Button variant="contained" sx={{ mt: 2, mb: 0, ml: 6, width: "25ch", textTransform: "capitalize", borderRadius: "8px", background: "#69A5EB" }} onClick={handleApproveSubmit}>Cancel Request</Button>
                    )}
                    {requestID === '2' && (
                        <Button variant="contained" sx={{ mt: 2, mb: 0, ml: 6, width: "25ch", textTransform: "capitalize", borderRadius: "8px", background: "#69A5EB" }} onClick={handleApproveSubmit}>Reschedule Request</Button>
                    )}
                </Box>
            ) : (
                <Box sx={{ marginTop: "20px" }}>
                    <Grid item lg={12} sm={12} xs={12} sx={{ mt: 4 }}>
                        <TextField
                            required
                            label="Select zone"
                            id="prof_zone_id"
                            name="prof_zone_id"
                            select
                            size="small"
                            fullWidth
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            error={!!errors.selectedZone}
                            helperText={errors.selectedZone}
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

                    <Grid item lg={12} sm={12} xs={12} sx={{ mt: 3 }}>
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
                            {profAtnData.map((option) => (
                                <MenuItem key={option.srv_prof_id} value={option.srv_prof_id} sx={{ fontSize: "14px" }}>
                                    {option.prof_fullname}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12} sx={{ mt: 3 }}>
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

                    <Grid item lg={12} sm={12} xs={12} sx={{ mb: 3 }}>
                        <Button variant="contained" sx={{ mt: 4, ml: 4, width: '30ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", }}
                            onClick={handleAtnSubmit}
                        >
                            Attendance Approve
                        </Button>
                    </Grid>
                </Box>
            )}
        </> 
    )
}

export default Request
