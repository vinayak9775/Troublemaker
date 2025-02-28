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

const Closuretwo = ({ formNo, eveID, evePlanID, srvProfID, profSD, profST, profED, profET, onClose }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endDateError, setEndDateError] = useState("");
    const [endTime, setEndTime] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [closureData, setClosureData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [selectedOption, setSelectedOption] = useState({});

    const [dateAndTime, setDateAndTime] = useState({});
    const [remark, setRemark] = useState({});
    const [modalIndex, setModalIndex] = useState(null);

    const [errors, setErrors] = useState({
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        selectedOption: '',
    });
    const [errorsValue, setErrorsValue] = useState({
        dateAndTime: '',
        remark: ''
    });

    const handleDateTimeChange = (e, index) => {
        const value = e.target.value;
        setDateAndTime(prevState => ({
            ...prevState,
            [index]: {
                ...prevState[index],
                dateAndTime: value
            }
        }));
    };

    const handleRemarkChange = (e, index) => {
        const value = e.target.value;
        setRemark(prevState => ({
            ...prevState,
            [index]: {
                ...prevState[index],
                remark: value
            }
        }));
    };

    const handleOptionChange = (e, index) => {
        const value = e.target.value;
        setSelectedOption(prevState => ({
            ...prevState,
            [index]: value
        }));
        setOpenModal(true);
        setModalIndex(index);
        setModalContent(value === '1' ? 'dateAndTime' : 'remark');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        console.log(startDate);
        validateEndDate(event.target.value, endDate);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        validateEndDate(startDate, event.target.value);
    };

    const validateEndDate = (start, end) => {
        if (start && end) {
            const startDateObj = new Date(start);
            const endDateObj = new Date(end);

            if (endDateObj < startDateObj) {
                setEndDateError("End date can't be earlier than the start date");
            }
            else {
                setEndDateError('');
            }
        } else {
            setEndDateError('');
        }
    };

    const getCurrentDateTimeString = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleEmptyField = () => {
        const newErrors = {};
        if (!startDate) {
            newErrors.startDate = 'Required';
        }
        if (!startTime) {
            newErrors.startTime = 'Required';
        }
        if (!endDate) {
            newErrors.endDate = 'Required';
        }
        if (!endTime) {
            newErrors.endTime = 'Required';
        }
        closureData.forEach((item, index) => {
            const selectedValue = selectedOption[index] || '';
            if (!selectedValue) {
                newErrors[`selectedOption-${index}`] = 'Required';
            }
        });

        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    const handleEmptySelectedValue = () => {
        const newErrors = {};

        // Check if the selected value is "Yes" or "No"
        closureData.forEach((item, index) => {
            const selectedValue = selectedOption[index] || '';

            // If "Yes" is selected, check for dateAndTime input
            if (selectedValue === '1' && !dateAndTime[index]?.dateAndTime) {
                newErrors[`dateAndTime-${index}`] = 'Date and Time is required';
            }

            // If "No" is selected, check for remark input
            if (selectedValue === '2' && !remark[index]?.remark) {
                newErrors[`remark-${index}`] = 'Remark is required';
            }
        });

        setErrorsValue(newErrors);

        // Return true if any error exists, else false
        return Object.keys(newErrors).length > 0;
    };

    useEffect(() => {
        setStartDate(profSD);
        setStartTime(profST);
        setEndDate(profED);
        setEndTime(profET);
    }, [profSD, profST, profED, profET]);

    useEffect(() => {
        const getClosure = async () => {
            if (eveID) {
                console.log("Event ID", eveID)
                try {
                    const url = `${port}/web/get_selected_job_closure_question/${eveID}/`;
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Closure Data.....", data);
                    setClosureData(data);
                } catch (error) {
                    console.error("Error fetching Closure Data:", error);
                }
            }
        };
        getClosure();
    }, [eveID]);

    const handleSubmit = () => {
        const isDateFieldEmpty = handleEmptySelectedValue();
        if (!isDateFieldEmpty) {
            setOpenModal(false);
        } else {
            console.log('This field is required.');
            console.log(errorsValue);
        }
    };

    async function handleClosureTwoSubmit(event) {
        event.preventDefault();

        // handleEmptyField();
        const hasEmptyFields = handleEmptyField();
        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill all the fields.');
            setSnackbarSeverity('error');
            return;
        }

        const questionDataArray = closureData.map((item, index) => {
            const selectedValue = selectedOption[index] || '';
            const questionDataItem = {};

            // Constructing individual question data object based on selected value
            if (selectedValue === '1') {
                questionDataItem[item.jcq_id.que_shrt_name] = 1;
                questionDataItem[`${item.jcq_id.date_time_remark_q_wise_name}`] = dateAndTime[index]?.dateAndTime || '';
            } else {
                questionDataItem[item.jcq_id.que_shrt_name] = 2;
                questionDataItem[`${item.jcq_id.date_time_remark_q_wise_name}`] = remark[index]?.remark || '';
            }

            return questionDataItem;
        });
        console.log("questions data...", questionDataArray)
        const requestData = {
            form_number: formNo,
            prof_session_start_date: startDate,
            prof_session_start_time: startTime,
            prof_session_end_date: endDate,
            prof_session_end_time: endTime,
            question_data: questionDataArray,
        };
        console.log("POST API Hitting......", requestData)
        try {
            // const response = await fetch(`${port}/web/agg_hhc_session_job_closure/?dtl_eve=${evePlanID}`, {
            const response = await fetch(`${port}/web/job_closure_srv_sess_wise/${srvProfID}/${evePlanID}/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: console.log("hello", JSON.stringify(requestData)),
            });
            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                return;
            }
            const result = await response.json();
            console.log("Closure data", result);
            setOpenSnackbar(true);
            setSnackbarMessage('Closure data submitted successfully!');
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <>
            <Box sx={{
                flexGrow: 1, ml: 1, mr: 1, bgcolor: "#ffffff", overflowY: 'auto', maxHeight: '500px',
            }}>
                <div style={{ display: "flex", }}>
                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, marginTop: "10px", }}>CLOSURE FORM</Typography>
                    <Button onClick={onClose} sx={{ marginLeft: "980px", marginTop: "2px", color: "gray" }}><CloseIcon /></Button>
                </div>

                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={3} sm={3} lg={3}>
                        <TextField
                            required
                            id="prof_session_start_date"
                            name="prof_session_start_date"
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            size="small"
                            fullWidth
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        // inputProps={{
                        //     min: getCurrentDateTimeString(),
                        // }}
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} lg={3}>
                        <TextField
                            required
                            id="prof_session_start_time"
                            name="prof_session_start_time"
                            label="Start Time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            size="small"
                            fullWidth
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
                    {/* </Grid> */}
                    {/* <Grid item xs={12} container spacing={1} sx={{ mt: 2 }}> */}
                    <Grid item xs={3} sm={3} lg={3}>
                        <TextField
                            required
                            id="prof_session_end_date"
                            name="prof_session_end_date"
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            size="small"
                            fullWidth
                            error={endDateError !== '' || !!errors.endDate}
                            helperText={endDateError || errors.endDate}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        // inputProps={{
                        //     min: getCurrentDateTimeString(),
                        // }}
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} lg={3}>
                        <TextField
                            required
                            id="prof_session_end_time"
                            name="prof_session_end_time"
                            label="End Time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            size="small"
                            fullWidth
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

                <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>
                    {closureData.map((item, index) => (
                        <>
                            <Grid key={index} item xs={4} sm={4} md={4} lg={4}>
                                <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                                    <FormControl>
                                        <FormLabel id={`demo-row-radio-buttons-group-label-${index}`}>
                                            {item.jcq_id.jcq_question}
                                        </FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby={`demo-row-radio-buttons-group-label-${index}`}
                                            value={selectedOption[index] || ''}
                                            onChange={(e) => handleOptionChange(e, index)}
                                            error={!!errors[`selectedOption-${index}`]}
                                            helperText={errors[`selectedOption-${index}`]}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="2" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Modal
                                // open={openModal}
                                open={openModal && modalIndex === index}
                                // onClose={handleCloseModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: 300 }}>
                                    <FormControl fullWidth>
                                        <FormLabel>{modalContent === 'dateAndTime' ? 'Date and Time *' : 'Remark *'}</FormLabel>
                                        {modalContent === 'dateAndTime' ? (
                                            <TextField
                                                required
                                                id="datetime-local"
                                                name="dateAndTime"
                                                type="datetime-local"
                                                size="small"
                                                sx={{ mt: 1 }}
                                                value={dateAndTime[index]?.dateAndTime || ''}
                                                onChange={(e) => handleDateTimeChange(e, index)}
                                                error={!!errorsValue[`dateAndTime-${index}`]}
                                                helperText={errorsValue[`dateAndTime-${index}`]}
                                            />
                                        ) : (
                                            <TextField
                                                required
                                                id="remark"
                                                name="remark"
                                                placeholder='write here remark'
                                                value={remark[index]?.remark || ''}
                                                onChange={(e) => handleRemarkChange(e, index)}
                                                error={!!errorsValue[`remark-${index}`]}
                                                helperText={errorsValue[`remark-${index}`]}
                                                sx={{ mt: 1 }} multiline rows={2} fullWidth />
                                        )}
                                    </FormControl>
                                    <Button onClick={handleSubmit} sx={{ mt: 3 }} variant="contained" color="primary">
                                        Submit
                                    </Button>
                                </Box>
                            </Modal>
                        </>
                    ))}
                </Grid>


                <Grid item xs={12} sm={12} lg={12} sx={{ mt: 1, ml: "30rem" }}>
                    <Button variant="contained" sx={{ width: '25ch', borderRadius: "12px", textTransform: "capitalize" }} onClick={handleClosureTwoSubmit}>Submit</Button>
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

export default Closuretwo
