import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Button, CardContent, Tab, Tabs, FormControl, FormControlLabel,
    Radio, RadioGroup, Typography, TextField, Rating, Snackbar, InputLabel, Select, MenuItem
} from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MuiAlert from '@mui/material/Alert';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Feedback = ({ eveID, patId }) => {

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    console.log(accessToken);
    const [tabValue, setTabValue] = useState('patient');
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [textInputs, setTextInputs] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [feedbackDataState, setFeedbackDataState] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    console.log(feedbackDataState, 'fetched Data');

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [errors, setErrors] = useState({});
    const [feedbackDataFound, setFeedbackDataFound] = useState(true);

    const [options, setOptions] = useState([]);
    const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
    const [dropdownError, setDropdownError] = useState('');

    useEffect(() => {
        const fetchProfessionalData = async () => {
            try {
                const response = await fetch(`${port}/web/Prof_names_eve_wise/${eveID}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error('Error fetching professional data:', error);
            }
        };

        fetchProfessionalData();
    }, [port, eveID, accessToken]);

    const handleChange = (event) => {
        setSelectedDropdownValue(event.target.value);
        setDropdownError('');
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`${port}/web/feedback_questions/?lang=eng`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                setQuestions(data.data);
            } catch (error) {
                console.error('Error fetching feedback questions:', error);
            }
        };

        fetchQuestions();

        // Fetch feedback data based on eveID and patId
    }, [accessToken, eveID, patId, port]);

    const fetchFeedbackData = async () => {
        try {
            const response = await fetch(`${port}/web/save_feedback_q/?eve_id=${eveID}&ptn_id=${patId}&prof_id=${selectedDropdownValue}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFeedbackDataState(data);
                const selectedAnswersFromData = {};
                const textInputsFromData = {};
                let profId = '';

                data.forEach(item => {
                    selectedAnswersFromData[item.f_questions] = item.answer;
                    textInputsFromData[item.f_questions] = '';
                    if (item.prof_id) {
                        profId = item.prof_id;
                    }
                });

                setSelectedAnswers(selectedAnswersFromData);
                setTextInputs(textInputsFromData);
                setSelectedDropdownValue(profId);
                setFeedbackDataFound(true); // Feedback data found
            } else {
                console.error('Failed to fetch feedback data:', response.statusText);
                setFeedbackDataState([]);
                setSelectedAnswers({});
                setTextInputs({});
                setFeedbackDataFound(false); // Feedback data not found
            }
        } catch (error) {
            console.error('Error fetching feedback data:', error);
            setFeedbackDataState([]);
            setSelectedAnswers({});
            setTextInputs({});
            setFeedbackDataFound(false); // Feedback data not found
        }
    };

    useEffect(() => {
        if (selectedDropdownValue) {
            fetchFeedbackData();
        }
    }, [selectedDropdownValue]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleAnswerSelection = (questionId, selectedValue) => {
        setSelectedAnswers(prevState => ({
            ...prevState,
            [questionId]: selectedValue
        }));
    };

    const handleTextChange = (questionId, textValue) => {
        setTextInputs(prevState => ({
            ...prevState,
            [questionId]: textValue
        }));
    };

    const handleRatingChange = (questionId, ratingValue) => {
        setSelectedAnswers(prevState => ({
            ...prevState,
            [questionId]: ratingValue
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        console.log('Selected image:', file);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        setSelectedVideo(file);
        console.log('Selected Video:', file);
    };

    const validateFields = () => {
        const newErrors = {};
        let isValid = true;

        if (!selectedDropdownValue) {
            setDropdownError('Please select an option');
            isValid = false;
        } else {
            setDropdownError('');
        }

        questions.forEach(question => {
            if ([16, 17, 18].includes(question.F_questions)) {
                const answer = selectedAnswers[question.F_questions] || textInputs[question.F_questions];
                if (!answer) {
                    newErrors[question.F_questions] = 'This field is required';
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handlePatientSubmit = async () => {
        if (!validateFields()) {
            setSnackbarSeverity('error');
            setSnackbarMessage('Please fill mandatory fields');
            setTimeout(() => {
                setSnackbarMessage('');
            }, 2000);
            return;
        }

        const feedbackData = questions.map(question => ({
            que: question.F_questions,
            ans: selectedAnswers[question.F_questions] || textInputs[question.F_questions] || '',
        }));

        console.log('Submitting Patient feedback:', feedbackData);

        try {
            const formData = new FormData();
            formData.append('eve_id', eveID);
            formData.append('ptn_id', patId);
            formData.append('prof_id', selectedDropdownValue);
            if (selectedImage) {
                formData.append('media', selectedImage);
            }
            if (selectedVideo) {
                formData.append('video', selectedVideo);
            }
            formData.append('feedback', JSON.stringify(feedbackData));

            const response = await fetch(`${port}/web/save_feedback_q/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData
            });

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem('feedbackData', JSON.stringify(responseData));
                setFeedbackDataState(responseData);
                setSnackbarSeverity('success');
                setSnackbarMessage(responseData.message);
                setFormSubmitted(true);
            } else {
                console.error('Failed to submit feedback');
                setSnackbarSeverity('error');
                setSnackbarMessage('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSnackbarSeverity('error');
            setSnackbarMessage('Error submitting feedback');
        } finally {
            setTimeout(() => {
                setSnackbarMessage('');
            }, 2000);
        }
    };

    // const handlePatientSubmit = async () => {
    //     if (!validateFields()) {
    //         setSnackbarMessage('Please fill * mark fields');
    //         return;
    //     }

    //     const feedbackData = questions.map(question => ({
    //         que: question.F_questions,
    //         ans: selectedAnswers[question.F_questions] || textInputs[question.F_questions] || '',
    //     }));

    //     console.log('Submitting Patient feedback:', feedbackData);

    //     try {
    //         const formData = new FormData();
    //         formData.append('eve_id', eveID);
    //         formData.append('ptn_id', patId);
    //         formData.append('prof_id', selectedDropdownValue); /// pass the selected Dropdwon Value
    //         if (selectedImage) {
    //             formData.append('media', selectedImage);
    //         }
    //         if (selectedVideo) {
    //             formData.append('video', selectedVideo);
    //         }
    //         formData.append('feedback', JSON.stringify(feedbackData));

    //         const response = await fetch(`${port}/web/save_feedback_q/`, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //             body: formData
    //         });

    //         if (response.status === 201) {
    //             const responseData = await response.json();
    //             localStorage.setItem('feedbackData', JSON.stringify(responseData));
    //             setFeedbackDataState(responseData);
    //             setSnackbarMessage('Feedback submitted successfully!');
    //             // window.location.reload();
    //         } else {
    //             console.error('Failed to submit feedback');
    //             setSnackbarMessage('Failed to submit feedback');
    //         }
    //     } catch (error) {
    //         console.error('Error submitting feedback:', error);
    //         setSnackbarMessage('Error submitting feedback');
    //     }
    // };

    const handleProfessionalSubmit = async () => {
        // Similar handling for professional feedback if needed
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarMessage('');
    };

    return (
        <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
            <CardContent>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    aria-label="Feedback Tabs"
                    sx={{ marginBottom: '16px', marginTop: '16px' }}
                >
                    <Tab label="Patient" value="patient" />
                    {/* <Tab label="Professional" value="professional" /> */}
                </Tabs>

                {tabValue === 'patient' && (
                    <Grid container spacing={2} sx={{ marginTop: "1px" }}>
                        <FormControl sx={{ width: '90%', marginLeft: '1em' }}>
                            <InputLabel id="dropdown-label">Prof Name *</InputLabel>
                            <Select
                                value={selectedDropdownValue}
                                label="Select Option"
                                onChange={handleChange}
                                size="small"
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.srv_prof_id} value={option.srv_prof_id}>
                                        {option.prof_name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {dropdownError && (
                                <Typography variant="caption" color="red">
                                    {dropdownError}
                                </Typography>
                            )}
                        </FormControl>

                        {questions.map((question, index) => (
                            <Grid key={index} item lg={12} sm={12} xs={12}>
                                <Typography variant="h6" style={{ fontSize: '16px' }}>
                                    {question.question}
                                    {([16, 17, 18].includes(question.F_questions)) && <span style={{ color: 'red' }}>*</span>}
                                </Typography>

                                <FormControl component="fieldset">
                                    {question.answer_options.length === 0 ?
                                        (
                                            <>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    placeholder=""
                                                    name={`feedback-${question.F_questions}`}
                                                    sx={{ marginTop: '8px', width: '28em' }}
                                                    size='small'
                                                    // value={textInputs[question.F_questions] || ''}
                                                    value={textInputs[question.F_questions] || selectedAnswers[question.F_questions] || ''}
                                                    onChange={(event) => handleTextChange(question.F_questions, event.target.value)}
                                                />
                                            </>
                                        )
                                        :
                                        question.answer_options[0].star ? (
                                            <Typography variant="body1" style={{ fontSize: '15px' }}>
                                                <Rating
                                                    name={`rating-${question.F_questions}`}
                                                    value={selectedAnswers[question.F_questions] || 0}
                                                    // max={10}
                                                    max={question.answer_options[0].star} // Use the max star value from API
                                                    size="large"
                                                    onChange={(event, newValue) => handleRatingChange(question.F_questions, newValue)}
                                                />
                                            </Typography>
                                        ) :
                                            (
                                                <RadioGroup
                                                    row
                                                    aria-label={`feedback-${question.F_questions}`}
                                                    name={`feedback-${question.F_questions}`}
                                                    value={selectedAnswers[question.F_questions] || ''}
                                                    onChange={(event) => handleAnswerSelection(question.F_questions, event.target.value)}
                                                >
                                                    {question.answer_options.map((answer, index) => (
                                                        <FormControlLabel
                                                            key={index}
                                                            value={answer}
                                                            control={<Radio />}
                                                            label={answer}
                                                            style={{ fontSize: '15px' }}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            )}
                                </FormControl>
                            </Grid>
                        ))}

                        {/* Buttons for image and video uploads */}
                        <Button
                            component="label"
                            accept="image/*"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            style={{
                                marginTop: '16px',
                                marginLeft: '15px',
                                backgroundColor: '#ffffff',
                                color: 'purple',
                                border: '1px solid purple',
                            }}
                        >
                            Upload Image
                            <VisuallyHiddenInput type="file" onChange={handleImageChange} />
                        </Button>

                        <Button
                            component="label"
                            accept="image/*"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            onChange={(e) => console.log('Selected Video:', e.target.files[0])}
                            style={{
                                marginTop: '16px',
                                marginLeft: '15px',
                                backgroundColor: '#ffffff',
                                color: 'red',
                                border: '1px solid red',
                            }}
                        >
                            Upload Video
                            <VisuallyHiddenInput type="file" onChange={handleVideoChange} />
                        </Button>

                        <Grid item lg={12} sm={12} xs={12} style={{ textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={handlePatientSubmit}
                                style={{
                                    backgroundColor: formSubmitted || feedbackDataState.length > 0 ? 'grey' : undefined,
                                    color: formSubmitted || feedbackDataState.length > 0 ? 'white' : undefined,
                                    textTransform: 'uppercase'
                                }}
                                disabled={formSubmitted || feedbackDataState.length > 0}

                            >
                                {formSubmitted || feedbackDataState.length ? 'Feedback Submitted' : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                )}

                {/* Professional tab content */}
                {tabValue === 'professional' && (
                    <Grid container spacing={2} sx={{ marginTop: "1px" }}>
                        {questions.map((question, index) => (
                            <Grid key={index} item lg={12} sm={12} xs={12}>
                                <Typography variant="h6" style={{ fontSize: '16px' }}>{question.question}</Typography>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        row
                                        aria-label={`feedback-${question.F_questions}`}
                                        name={`feedback-${question.F_questions}`}
                                        value={selectedAnswers[question.F_questions] || ''}
                                        onChange={(event) => handleAnswerSelection(question.F_questions, event.target.value)}
                                    >
                                        {question.answer_options.map((answer, index) => (
                                            <FormControlLabel
                                                key={index}
                                                value={answer}
                                                control={<Radio />}
                                                label={answer}
                                                style={{ fontSize: '15px' }}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        ))}
                        <Grid item lg={12} sm={12} xs={12}>
                            <Button variant="contained" onClick={handleProfessionalSubmit}>
                                Submit Professional Feedback
                            </Button>
                        </Grid>
                    </Grid>
                )}

                {/* Snackbar for displaying feedback submission status */}
                <Snackbar
                    open={!!snackbarMessage}
                    autoHideDuration={2000}
                    onClose={handleCloseSnackbar}
                    style={{
                        position: 'absolute',
                        left: '20%',
                        bottom: '10px',
                        width: '30em',
                    }}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={handleCloseSnackbar}
                        severity={snackbarSeverity}
                    >
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
            </CardContent>
        </Box>
    );
}

export default Feedback;
