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

const Closuretwo = ({ getSessionDetils, setSessions, closureDone, srvProfId, hcaQue, selectedID, formNo, eveID, evePlanID, srvProfID, profSD, profST, profED, profET, sessions, onClose }) => {

    useEffect(() => {
        if (hcaQue && hcaQue.length > 0) {
            const initialSelectedOptions = {};
            const initialDateAndTime = {};
            const initialRemark = {};

            hcaQue.forEach((item, index) => {
                Object.keys(item).forEach((key) => {
                    if (key.includes('datetime_remark')) {
                        if (closureDone === true) {
                            if (item[key]) {
                                if (item[key].includes('T')) {
                                    initialDateAndTime[index] = { dateAndTime: item[key] };
                                }
                                // else {
                                //     initialRemark[index] = { remark: item[key] };
                                // }
                                else {
                                    const datetimeParts = item[key].split(' ');
                                    if (datetimeParts.length === 2) {
                                        const formattedDate = datetimeParts[0];
                                        const formattedTime = datetimeParts[1];
                                        initialDateAndTime[index] = { dateAndTime: `${formattedDate}T${formattedTime}` };
                                    } else {
                                        initialRemark[index] = { remark: item[key] };
                                    }
                                }
                            }
                        } else {
                            initialRemark[index] = { remark: '' };
                        }
                    } else if (item[key] === 1) {
                        initialSelectedOptions[index] = '1';
                    } else if (item[key] === 2) {
                        initialSelectedOptions[index] = '2';
                    }
                });
            });

            setSelectedOption(initialSelectedOptions);
            setDateAndTime(initialDateAndTime);
            setRemark(initialRemark);
        }
    }, [hcaQue]);

    console.log("Received HCA Questions:", hcaQue);
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    console.log(evePlanID, "sevProfID.......");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endDateError, setEndDateError] = useState("");
    const [endTime, setEndTime] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [closureData, setClosureData] = useState([]);

    useEffect(() => {
        console.log(closureData);
    }, [closureData]);

    const question = selectedID.hca_jc
    console.log(question, 'questionquestion');

    const jobClosureDtl = closureData[0]?.job_closure_dtl || [];
    console.log(jobClosureDtl, 'jobClosureDtl');

    const hca_jc = (closureData[0]?.job_closure_dtl && closureData[0].job_closure_dtl[0]?.hca_jc) || [];
    const fetchedQuestion = hca_jc[0]?.hca_que;

    const selectedAnswer = (closureData[0]?.job_closure_dtl && closureData[0].job_closure_dtl[0]?.hca_jc) || [];
    const selectedAnswer1 = selectedAnswer[0]?.Vital_care;

    console.log(selectedAnswer1, 'selectedAnswer1');
    console.log(fetchedQuestion, 'hca_jc');

    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [selectedOption, setSelectedOption] = useState({});
    console.log(selectedOption, 'selectedOption');

    const [dateAndTime, setDateAndTime] = useState({});
    console.log(dateAndTime, 'dateAndTime');
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

   const [closureRevalidateRemark, setClosureRevalidateRemark] = useState('');

  
  

    const handleDateTimeChange = (e, index) => {
        const value = e.target.value;
        setDateAndTime(prevState => ({
            ...prevState,
            [index]: { dateAndTime: value }
        }));
        setErrorsValue(prevState => ({
            ...prevState,
            [`dateAndTime-${index}`]: value ? '' : 'Required'
        }));
    };

    const handleRemarkChange = (e, index) => {
        const value = e.target.value;
        setRemark(prevState => ({
            ...prevState,
            [index]: { remark: value }
        }));
        setErrorsValue(prevState => ({
            ...prevState,
            [`remark-${index}`]: value ? '' : 'Required'
        }));
    };

    // const handleDateTimeChange = (e, index) => {
    //     const value = e.target.value;
    //     setDateAndTime(prevState => ({
    //         ...prevState,
    //         [index]: {
    //             ...prevState[index],
    //             dateAndTime: value
    //         }
    //     }));
    // };

    // const handleRemarkChange = (e, index) => {
    //     const value = e.target.value;
    //     setRemark(prevState => ({
    //         ...prevState,
    //         [index]: {
    //             ...prevState[index],
    //             remark: value
    //         }
    //     }));
    // };

    useEffect(() => {
        if (selectedAnswer1) {
            setSelectedOption((prevState) => ({
                ...prevState,
                0: selectedAnswer1,
            }));
        }
    }, [selectedAnswer1]);

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
        if (!closureRevalidateRemark) {
            newErrors.closureRevalidateRemark = "Required";
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

        closureData.forEach((item, index) => {
            const selectedValue = selectedOption[index] || '';
            if (selectedValue === '1' && !dateAndTime[index]?.dateAndTime) {
                newErrors[`dateAndTime-${index}`] = 'Date and Time is required';
            }
            if (selectedValue === '2' && !remark[index]?.remark) {
                newErrors[`remark-${index}`] = 'Remark is required';
            }


        });
        setErrorsValue(newErrors);
        return Object.keys(newErrors).length > 0;
    };

    useEffect(() => {
        setStartDate(profSD);
        setStartTime(profST);
        setEndDate(profED);
        setEndTime(profET);
    }, [profSD, profST, profED, profET]);

    // const handleSubmit = () => {
    //     const isDateFieldEmpty = handleEmptySelectedValue();
    //     if (!isDateFieldEmpty) {
    //         setOpenModal(false);
    //     } else {
    //         console.log('This field is required.');
    //         console.log(errorsValue);
    //     }
    // };

    async function handleClosureTwoSubmit(event) {
        event.preventDefault();

        const hasEmptyFields = handleEmptyField();
        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill all the fields.');
            setSnackbarSeverity('error');
            return;
        }

        if (sessions.length === 0) {
            console.error("No session data available.");
            setOpenSnackbar(true);
            setSnackbarMessage('No session data available.');
            setSnackbarSeverity('error');
            return;
        }

        const questionDataArray = hcaQue.map((item, index) => {
            const selectedValue = selectedOption[index] || "";
            const questionDataItem = {};

            Object.keys(item).forEach((key) => {
                if (key.endsWith("_datetime_remark") || key.includes("_datetime_remark")) {
                    const mainKey = key.split("_datetime_remark")[0];
                    const relatedKey = `${mainKey}_datetime_remark`;

                    questionDataItem[mainKey] = null;
                    questionDataItem[relatedKey] = null;
                }
            });

            if (selectedValue === "1" || selectedValue === "2") {
                Object.keys(item).forEach((key) => {
                    if (key.endsWith("_datetime_remark") || key.includes("_datetime_remark")) {
                        const mainKey = key.split("_datetime_remark")[0];
                        const relatedKey = `${mainKey}_datetime_remark`;

                        questionDataItem[mainKey] = selectedValue === "1" ? 1 : 2;

                        questionDataItem[relatedKey] = selectedValue === "1"
                            ? dateAndTime[index]?.dateAndTime
                            : remark[index]?.remark || "";
                    }
                });
            }

            return questionDataItem;
        });
        const requestData = {
            form_number: formNo,
            prof_session_start_date: startDate,
            prof_session_start_time: startTime,
            prof_session_end_date: endDate,
            prof_session_end_time: endTime,
            question_data: questionDataArray,
            closure_revalidate: 1,
            closure_revalidate_remark: closureRevalidateRemark,
        };

        console.log("POST API Request Data:", requestData);

        try {
            const response = await fetch(`${port}/hr/job_closure_srv_sess_wise_Closure_Revalidate/${srvProfId}/${evePlanID}/`, {
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
                setOpenSnackbar(true);
                setSnackbarMessage(`Error: ${response.statusText}`);
                setSnackbarSeverity('error');
                return;
            }
            const result = await response.json();
            console.log("Closure data submitted successfully:", result);
            setSnackbarMessage('Closure data submitted successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(async () => {
                onClose();
                await getSessionDetils();
            }, 2000);
        } catch (error) {
            console.error("An error occurred:", error);
            setOpenSnackbar(true);
            setSnackbarMessage('An error occurred while submitting closure data.');
            setSnackbarSeverity('error');
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
                    {hcaQue.map((item, index) => (
                        <Grid key={`question-${index}`} item xs={4} sm={4} md={4} lg={4}>
                            <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '10px' }}>
                                <FormControl sx={{ marginBottom: '10px' }}>
                                    <FormLabel id={`demo-row-radio-buttons-group-label-${index}`}>
                                        {item.hca_que}
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby={`demo-row-radio-buttons-group-label-${index}`}
                                        value={selectedOption[index] || ''}
                                        onChange={(e) => handleOptionChange(e, index)}
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="2" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>

                                {selectedOption[index] === "1" && (
                                    <Box sx={{ mt: 2 }}>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <FormLabel>Date and Time *</FormLabel>
                                            <TextField
                                                required
                                                id={`datetime-local-${index}`}
                                                name="dateAndTime"
                                                type="datetime-local"
                                                size="small"
                                                value={dateAndTime[index]?.dateAndTime || ''}
                                                onChange={(e) => handleDateTimeChange(e, index)}
                                                error={!!errorsValue[`dateAndTime-${index}`]}
                                                helperText={errorsValue[`dateAndTime-${index}`]}
                                            />
                                        </FormControl>

                                        {/* <Button
                                            // onClick={() => handleSubmit(index)}
                                            sx={{ mt: 2 }}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Submit
                                        </Button> */}
                                    </Box>
                                )}

                                {selectedOption[index] === "2" && (
                                    <Box sx={{ mt: 2 }}>
                                        <FormControl fullWidth>
                                            <FormLabel>Remark *</FormLabel>
                                            <TextField
                                                required
                                                id={`remark-${index}`}
                                                name="remark"
                                                placeholder='Write your remark here'
                                                value={remark[index]?.remark || ''}
                                                onChange={(e) => handleRemarkChange(e, index)}
                                                error={!!errorsValue[`remark-${index}`]}
                                                helperText={errorsValue[`remark-${index}`]}
                                                multiline
                                                rows={2}
                                            />
                                        </FormControl>

                                        {/* <Button
                                            // onClick={() => handleSubmit(index)}
                                            sx={{ mt: 2 }}
                                            variant="contained"
                                            color="primary"
                                        >
                                            Submit
                                        </Button> */}
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    ))}

                    {/* <Modal
                        open={openModal && modalIndex !== null}
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
                                        value={dateAndTime[modalIndex]?.dateAndTime || ''}
                                        onChange={(e) => handleDateTimeChange(e, modalIndex)}
                                        error={!!errorsValue[`dateAndTime-${modalIndex}`]}
                                        helperText={errorsValue[`dateAndTime-${modalIndex}`]}
                                    />
                                ) : (
                                    <TextField
                                        required
                                        id="remark"
                                        name="remark"
                                        placeholder='Write your remark here'
                                        value={remark[modalIndex]?.remark || ''}
                                        onChange={(e) => handleRemarkChange(e, modalIndex)}
                                        error={!!errorsValue[`remark-${modalIndex}`]}
                                        helperText={errorsValue[`remark-${modalIndex}`]}
                                        sx={{ mt: 1 }} multiline rows={2} fullWidth
                                    />
                                )}
                            </FormControl>
                            <Button onClick={handleSubmit} sx={{ mt: 3 }} variant="contained" color="primary">
                                Submit
                            </Button>
                        </Box>
                    </Modal> */}
                </Grid>

                <Grid item xs={2} sm={2} lg={2} sx={{ mt: 1, ml: 1 }}>
                    <TextField
                                              id="closure_revalidate_remark"
                                              name="closure_revalidate_remark"
                                              label="Closure Revalidate Remark"
                                              variant="outlined"
                                              multiline
                                              RowsMax={4}
                                              required
                                              rows={2}
                                              fullWidth
                                              value={closureRevalidateRemark}
                                              onChange={(e) => setClosureRevalidateRemark(e.target.value)}
                                              error={!!errors.closureRevalidateRemark}
                                              helperText={errors.closureRevalidateRemark}
                                            />
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
