import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Link } from "react-router-dom";
import { CardContent } from '@mui/material';

const CallerDetails = () => {
    const [dob, setDOB] = useState('');
    const [age, setAge] = useState('');
    const [changeAge, setChangeAge] = useState('');
    const [gender, setGender] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [relation, setRelation] = useState([]);
    const [selectedRelation, setSelectedRelation] = useState('');
    const [call, setCall] = useState([]);
    const [selectedCall, setSelectedCall] = useState('');
    const [locality, setLocality] = useState([]);
    const [selectedLocality, setSelectedLocality] = useState('');
    const [service, setService] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [subService, setSubService] = useState([]);
    const [selectedSubService, setSelectedSubService] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [ptnNumber, setPtnNumber] = useState('');
    const [referHospital, setReferHospital] = useState([]);
    const [selctedReferHospital, setSelectedReferHospital] = useState('');
    const [ptnNumberError, setPtnNumberError] = useState('');
    const [callerDetails, setCallerDetails] = useState(null);
    const [patientDetails, setPatientDetails] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [selectedOption, setSelectedOption] = useState('');

    const [showAddPatient, setShowAddPatient] = useState(false);

    const handleAddNewClick = () => {
        setShowAddPatient(true);
    };

    const handleAgeChange = (event) => {
        setChangeAge(event.target.value);
    };

    //Age Calculation Logic
    const calculateAge = selectedDOB => {
        const currentDate = new Date()
        const selectedDate = new Date(selectedDOB)
        const timeDiff = Math.abs(currentDate - selectedDate)

        //Calculate Age in Years
        const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365))
        setAge(years)
    }

    const handleDOB = e => {
        const selectedDOB = e.target.value
        setDOB(selectedDOB)
        calculateAge(selectedDOB);
    }

    //TextField change Logic
    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleDropdownGender = (event) => {
        const selectedGender = event.target.value;
        setSelectedGender(selectedGender);
    };

    const handleDropdownRelation = (event) => {
        const selectedRelation = event.target.value;
        setSelectedRelation(selectedRelation);
    };

    const handleDropdownCall = (event) => {
        const selectedCall = event.target.value;
        setSelectedCall(selectedCall);
    };

    const handleDropdownLocality = (event) => {
        const selectedLocality = event.target.value;
        setSelectedLocality(selectedLocality);
    };

    const handleDropdownService = (event) => {
        const selectedService = event.target.value;
        setSelectedService(selectedService);
    };

    const handleDropdownSubService = (event) => {
        const selectedSubService = event.target.value;
        setSelectedSubService(selectedSubService);
    };

    //Phone Number Validation//
    const handlePhoneNumberChange = (event) => {
        const { value } = event.target;
        setPhoneNumber(value);
    };

    const validatePhoneNumber = () => {
        const numberRegex = /^\d+$/; // Regular expression for numbers only

        if (phoneNumber.trim() === '') {
            setPhoneNumberError('Please enter a mobile number');
        } else if (!numberRegex.test(phoneNumber)) {
            setPhoneNumberError('Mobile number should contain only numbers');
        } else {
            setPhoneNumberError('');
        }
    };

    const handleInput = (event) => {
        const { value } = event.target;
        // Remove any non-numeric characters from the input value
        const numericValue = value.replace(/[^0-9]/g, '');
        // Update the phone number state and validate it
        setPhoneNumber(numericValue);
        validatePhoneNumber();
    };

    //Patient Phone Number Validation//
    const handlePtnNumberChange = (event) => {
        const { value } = event.target;
        setPtnNumber(value);
    };

    const validatePtnNumber = () => {
        const numberRegex = /^\d+$/; // Regular expression for numbers only

        if (ptnNumber.trim() === '') {
            setPtnNumberError('Please enter a mobile number');
        } else if (!numberRegex.test(ptnNumber)) {
            setPtnNumberError('Mobile number should contain only numbers');
        } else {
            setPtnNumberError('');
        }
    };

    const handlePtnInput = (event) => {
        const { value } = event.target;
        // Remove any non-numeric characters from the input value
        const numericValue = value.replace(/[^0-9]/g, '');
        // Update the phone number state and validate it
        setPtnNumber(numericValue);
        validatePtnNumber();
    };

    //Email validation//
    const handleEmailChange = (event) => {
        const { value } = event.target;
        setEmail(value);
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation

        if (email.trim() === '') {
            setEmailError('Please enter an email address');
        } else if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    useEffect(() => {
        const getGender = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/web/agg_hhc_gender_api");
                const data = await res.json();
                console.log(data);
                setGender(data);
            } catch (error) {
                console.error("Error fetching gender data:", error);
            }
        };
        getGender();
    }, []);

    useEffect(() => {
        const getRelation = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/web/agg_hhc_caller_relation_api");
                const data = await res.json();
                console.log("Relation...", data)
                setRelation(data);
            } catch (error) {
                console.error("Error fetching Relation data:", error);
            }
        };
        getRelation();
    }, []);

    useEffect(() => {
        const callPurpose = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/web/agg_hhc_purpose_call_api");
                const data = await res.json();
                console.log("Call Purpose", data);
                setCall(data);
            } catch (error) {
                console.error("Error fetching Call purpose data:", error);
            }
        };
        callPurpose();
    }, []);

    useEffect(() => {
        const getLocality = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/web/agg_hhc_locations_api");
                const data = await res.json();
                console.log("Locality data", data);
                setLocality(data);
            } catch (error) {
                console.error("Error fetching Locality data:", error);
            }
        };
        getLocality();
    }, []);

    useEffect(() => {
        const getreferHospital = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/web/agg_hhc_hospitals_api");
                const data = await res.json();
                console.log("Refer Hospital data", data);
                setReferHospital(data);
            } catch (error) {
                console.error("Error fetching Refer Hospital data:", error);
            }
        };
        getreferHospital();
    }, []);

    useEffect(() => {
        const getService = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/web/agg_hhc_services_api");
                const data = await res.json();
                console.log("Service Data", data);
                setService(data);
            } catch (error) {
                console.error("Error fetching service data:", error);
            }
        };
        getService();
    }, []);

    useEffect(() => {
        if (selectedService) {
            fetch(`http://127.0.0.1:8000/web/agg_hhc_sub_services_api/${selectedService}`)
                .then((response) => {
                    setSubService(response.data);
                    console.log('Sub Services Data:', response.data);
                })
                .catch((error) => {
                    console.error('Error fetching Sub Services Data:', error);
                });
        }
    }, [selectedService]);

    // Function to fetch caller details from API
    const fetchCallerData = () => {
        fetch(`http://127.0.0.1:8000/web/agg_hhc_patient_from_callers_phone_no/${phoneNumber}`)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("Caller Details Data......", responseData);
                setCallerDetails(responseData.caller);
                console.log("Patient Records......", responseData.patients);
                setPatientDetails(responseData.patients);
            })
            .catch((error) => {
                console.error('No Caller Data Found......:', error);
                setCallerDetails(null);
                setPatientDetails(null);
            });
    };

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            fetchCallerData();
        }
    };

    // useEffect to fetch Caller Details on component mount
    useEffect(() => {
        if (phoneNumber) {
            fetchCallerData(phoneNumber);
        }
    }, [phoneNumber]);

    // Function to handle patient selection from dropdown
    const handlePatientSelect = (e) => {
        const selectedPatientId = parseInt(e.target.value);
        const patient = patientDetails.find((patient) => patient.agg_sp_pt_id === selectedPatientId);
        setSelectedPatient(patient);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        validatePhoneNumber();
        validateEmail();

    };

    // async function handleSubmit(data, event) {
    //     event.preventDefault();
    //     console.log(data);
    //     let result = await fetch("http://127.0.0.1:8000/app/agg_hhc_callers_api", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //       },
    //       body: JSON.stringify(data),
    //     });
    //     result = await result.json();
    //     setsp_emp_code(result);
    //     if (result.status === 200) {
    //       console.log("error");
    //     } else {
    //       localStorage.setItem("user-form", JSON.stringify(result));
    //       navigate(`/user/add/${sp_emp_code}`);
    //     }
    //   }

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Card
                    sx={{ width: "100%", borderRadius: "10px", bgColor: "white", boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)' }}
                >
                    <CardContent>
                        <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, }}>CALLER DETAILS</Typography>
                        <Grid container spacing={2} sx={{ marginTop: "1px" }}>

                            <Grid item lg={6} sm={6} xs={12}>
                                <TextField
                                    required
                                    id="phoneNumber"
                                    label="Mobile"
                                    placeholder="+91 |"
                                    size="small"
                                    fullWidth
                                    value={phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    onInput={handleInput}
                                    onKeyPress={handleSearch}
                                    error={!!phoneNumberError}
                                    helperText={phoneNumberError}
                                    inputProps={{
                                        minLength: 10,
                                        maxLength: 10, // Maximum length of the mobile number

                                    }}
                                    sx={{
                                        '& input': {
                                            fontSize: '14px', // Replace with your desired font size
                                        },
                                    }}

                                />
                            </Grid>

                            {callerDetails ? (
                                <Grid item lg={6} sm={6} xs={12}>
                                    <TextField
                                        required
                                        label="Full Name"
                                        id="fname"
                                        name="fname"
                                        placeholder="First Name | Last Name *"
                                        value={callerDetails.fname}
                                        size="small"
                                        fullWidth
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
                            ) : (

                                <Grid item lg={6} sm={6} xs={12}>
                                    <TextField
                                        required
                                        label="Full Name"
                                        id="fname"
                                        name="fname"
                                        placeholder="First Name | Last Name *"
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                </Grid>
                            )}

                            <Grid item lg={6} sm={6} xs={12}>
                                <TextField
                                    required
                                    id="name"
                                    select
                                    label="Select Call Type"
                                    // value={selectedCall}
                                    value={selectedCall}
                                    onChange={handleDropdownCall}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        textAlign: "left", '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                >
                                    {call.map((option) => (
                                        <MenuItem key={option.purp_call_id} value={option.purp_call_id}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item lg={6} sm={6} xs={12}>
                                <TextField
                                    required
                                    id="relation"
                                    select
                                    label="Select Relation"
                                    // defaultValue={selectedRelation}
                                    value={selectedRelation}
                                    onChange={handleDropdownRelation}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        textAlign: "left", '& input': {
                                            fontSize: '14px', // Replace with your desired font size
                                        },
                                    }}
                                >
                                    {relation.map((option) => (
                                        <MenuItem key={option.caller_rel_id} value={option.caller_rel_id}>
                                            {option.relation}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                        </Grid>
                    </CardContent>
                </Card>

                <Card
                    sx={{
                        width: "100%",
                        borderRadius: "10px",
                        marginTop: "8px",
                        bgColor: "white",
                        boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',

                    }}
                >
                    <CardContent
                        // sx={{
                        //     height: "18.5rem",
                        //     overflowY: "scroll",
                        //     overflowX: "hidden",
                        //     scrollbarWidth: 'thin',
                        //     '&::-webkit-scrollbar': {
                        //         width: '0.2em',
                        //     },
                        //     '&::-webkit-scrollbar-track': {
                        //         background: "#DCDCDE",
                        //     },
                        //     '&::-webkit-scrollbar-thumb': {
                        //         backgroundColor: '#69A5EB',
                        //     },
                        //     '&::-webkit-scrollbar-thumb:hover': {
                        //         background: '#69A5EB'
                        //     }
                        // }}
                    >
                        <Grid container>
                            <Typography align="left" style={{ fontSize: "16px", fontWeight: 600 }}>PATIENT DETAILS  </Typography>
                            {/* <Grid item xs={6}>
                                <Typography align="left" style={{ fontSize: "16px", fontWeight: 600 }}>PATIENT DETAILS  </Typography>
                            </Grid> */}

                            {/* <Grid item xs={6} container justifyContent="flex-end">
                                <Button variant="outlined" style={{ color: "gray", textTransform: "capitalize", }} startIcon={<PersonAddAltIcon />} onClick={handleAddNewClick}>
                                    Add New
                                </Button>
                            </Grid> */}
                        </Grid>

                        <Grid container spacing={2} sx={{ marginTop: "1px" }} >
                            {patientDetails ? (
                                <>
                                    <Grid item lg={6} sm={6} xs={12}>
                                        <TextField
                                            id="outlined-select-patient"
                                            select
                                            label="Select Patient"
                                            size="small"
                                            onChange={handlePatientSelect}
                                            fullWidth
                                            sx={{
                                                textAlign: "left", '& input': {
                                                    fontSize: '14px',
                                                },
                                            }}
                                        >
                                            {patientDetails.map((option) => (
                                                <MenuItem key={option.agg_sp_pt_id
                                                } value={option.agg_sp_pt_id
                                                }>
                                                    {option.first_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                    </Grid>

                                    {selectedPatient && (
                                        <>
                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    id="Gender"
                                                    name="Gender"
                                                    // select
                                                    label="Select Gender"
                                                    value={selectedPatient.Gender}
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: "left",
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                // onChange={handleDropdownGender}
                                                />
                                            </Grid>
                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    label="Suffered From"
                                                    id="outlined-size-small"
                                                    placeholder='Remark'
                                                    value={selectedPatient.Suffered_from}
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                // InputProps={{ sx: { height: 36 } }}
                                                />
                                            </Grid>
                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    label="Hospital Name"
                                                    id="outlined-size-small"
                                                    placeholder='Name'
                                                    value={selectedPatient.Hospital_name}
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: "left", '& input': {
                                                            fontSize: '14px', // Replace with your desired font size
                                                        },
                                                    }}
                                                // InputProps={{ sx: { height: 36 } }}
                                                />
                                            </Grid>
                                            <Grid item lg={6} sm={6} xs={12}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={8}>
                                                        <TextField
                                                            label="DOB"
                                                            id="outlined-size-small"
                                                            type="date"
                                                            // defaultValue="DD/MM/YYYY"
                                                            value={selectedPatient.dob}
                                                            size="small"
                                                            fullWidth
                                                            sx={{
                                                                '& input': {
                                                                    fontSize: '14px', // Replace with your desired font size
                                                                },
                                                            }}
                                                            onChange={handleDOB}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        // InputProps={{ sx: { height: 36 } }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <TextField
                                                            label="Age"
                                                            id="outlined-size-small"
                                                            value={selectedPatient.Age}
                                                            size="small"
                                                            fullWidth
                                                            sx={{
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}

                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    label="Contact"
                                                    id="ptnNumber"
                                                    placeholder='+91 |'
                                                    size="small"
                                                    fullWidth
                                                    value={selectedPatient.mobile_no}
                                                    // value={ptnNumber}
                                                    // onChange={handlePtnNumberChange}
                                                    // onInput={handlePtnInput}
                                                    // error={!!ptnNumberError}
                                                    // helperText={ptnNumberError}
                                                    // inputProps={{
                                                    //     minLength: 10,
                                                    //     maxLength: 10, 

                                                    // }}
                                                    sx={{
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                // InputProps={{ sx: { height: 36 } }}
                                                />
                                            </Grid>
                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    label="Email"
                                                    id="email"
                                                    placeholder='example@gmail.com'
                                                    value={selectedPatient.email_id}
                                                    // value={email}
                                                    // onChange={handleEmailChange}
                                                    // error={!!emailError}
                                                    // helperText={emailError}
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        '& input': {
                                                            fontSize: '14px', // Replace with your desired font size
                                                        },
                                                    }}
                                                // InputProps={{ sx: { height: 36 } }}
                                                />
                                            </Grid>

                                        </>
                                    )}
                                </>

                            ) : (
                                <>
                                    <Grid item lg={6} sm={6} xs={12}>
                                        <TextField
                                            id="outlined-patient-name"
                                            label="Patient Name"
                                            placeholder="First Name | Last Name *"
                                            size="small"
                                            fullWidth
                                            sx={{
                                                textAlign: "left", '& input': {
                                                    fontSize: '14px',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item lg={6} sm={6} xs={12}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={5}>
                                                <TextField
                                                    id="name"
                                                    select
                                                    label="Gender"
                                                    defaultValue={selectedGender}
                                                    name="name"
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: "left",
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                    onChange={handleDropdownGender}
                                                >
                                                    {gender.map((option) => (
                                                        <MenuItem key={option.gender_id} value={option.gender_id}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={7}>
                                                <TextField
                                                    label="Suffered From"
                                                    id="outlined-size-small"
                                                    placeholder='Remark'
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item lg={6} sm={6} xs={12}>
                                        <TextField
                                            label="Hospital Name"
                                            id="outlined-size-small"
                                            select
                                            placeholder='Name'
                                            size="small"
                                            fullWidth
                                            sx={{
                                                textAlign: "left", '& input': {
                                                    fontSize: '14px', // Replace with your desired font size
                                                },
                                            }}
                                        >
                                            {referHospital.map((option) => (
                                                <MenuItem key={option.hosp_id} value={option.hosp_id}>
                                                    {option.hospital_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item lg={6} sm={6} xs={12}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={8}>
                                                <TextField
                                                    label="DOB"
                                                    id="outlined-size-small"
                                                    type="date"
                                                    defaultValue="DD/MM/YYYY"
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        '& input': {
                                                            fontSize: '14px', // Replace with your desired font size
                                                        },
                                                    }}
                                                    onChange={handleDOB}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                // InputProps={{ sx: { height: 36 } }}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    label="Age"
                                                    id="outlined-size-small"
                                                    value={age}
                                                    // value={changeAge}
                                                    onChange={handleAgeChange}
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        '& input': {
                                                            fontSize: '14px', // Replace with your desired font size
                                                        },
                                                    }}
                                                // InputProps={{ sx: { height: 36 } }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item lg={6} sm={6} xs={12}>
                                        <TextField
                                            label="Contact"
                                            id="ptnNumber"
                                            placeholder='+91 |'
                                            // defaultValue="+91 | "
                                            size="small"
                                            fullWidth
                                            value={ptnNumber}
                                            onChange={handlePtnNumberChange}
                                            onInput={handlePtnInput}
                                            error={!!ptnNumberError}
                                            helperText={ptnNumberError}
                                            inputProps={{
                                                minLength: 10,
                                                maxLength: 10, // Maximum length of the mobile number

                                            }}
                                            sx={{
                                                '& input': {
                                                    fontSize: '14px', // Replace with your desired font size
                                                },
                                            }}
                                        // InputProps={{ sx: { height: 36 } }}
                                        />
                                    </Grid>
                                    <Grid item lg={6} sm={6} xs={12}>
                                        <TextField
                                            label="Email"
                                            id="email"
                                            placeholder='example@gmail.com'
                                            value={email}
                                            onChange={handleEmailChange}
                                            error={!!emailError}
                                            helperText={emailError}
                                            size="small"
                                            fullWidth
                                            sx={{
                                                '& input': {
                                                    fontSize: '14px',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item lg={6} sm={6} xs={12}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Referred Hospital"
                                                    id="hospital"
                                                    select
                                                    defaultValue={selectedLocality}
                                                    onChange={handleDropdownLocality}
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: "left", '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                >
                                                    {locality.map((option) => (
                                                        <MenuItem key={option.loc_id} value={option.loc_id}>
                                                            {option.location}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Address Type"
                                                    id="address"
                                                    select
                                                    defaultValue={selectedLocality}
                                                    onChange={handleDropdownLocality}
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: "left", '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}

                                                >
                                                    {locality.map((option) => (
                                                        <MenuItem key={option.loc_id} value={option.loc_id}>
                                                            {option.location}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                    </Grid>


                                    <Grid item lg={6} sm={6} xs={12}>
                                        <TextField
                                            label="Address"
                                            id="outlined-size-small"
                                            placeholder='House No,Building,Street,Area'
                                            // defaultValue="Lane,Area,Street"
                                            size="small"
                                            fullWidth
                                            sx={{
                                                '& input': {
                                                    fontSize: '14px', // Replace with your desired font size
                                                },
                                            }}
                                        // InputProps={{ sx: { height: 36 } }}
                                        />
                                    </Grid>

                                    <Grid item lg={6} sm={6} xs={12}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Select Zone"
                                                    id="location"
                                                    select
                                                    defaultValue={selectedLocality}
                                                    onChange={handleDropdownLocality}
                                                    // placeholder='Locality'
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: "left", '& input': {
                                                            fontSize: '14px', // Replace with your desired font size
                                                        },
                                                    }}
                                                // InputProps={{ sx: { height: 36 } }}
                                                >
                                                    {locality.map((option) => (
                                                        <MenuItem key={option.loc_id} value={option.loc_id}>
                                                            {option.location}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Select City"
                                                    id="city"
                                                    select
                                                    defaultValue={selectedLocality}
                                                    onChange={handleDropdownLocality}
                                                    // placeholder='Locality'
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: "left", '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                >
                                                    {locality.map((option) => (
                                                        <MenuItem key={option.loc_id} value={option.loc_id}>
                                                            {option.location}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item lg={6} sm={6} xs={12}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    id="pincode"
                                                    label="Pincode"
                                                    placeholder='Pincode'
                                                    name="pincode"
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: "left",
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                // onChange={handleDropdownGender}
                                                />

                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="State"
                                                    id="outlined-size-small"
                                                    select
                                                    placeholder='State'
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            )}


                            {/* {selectedOption === '2' && (
                                <Grid item lg={6} sm={6} xs={12}>
                                    <TextField
                                        id="outlined-select-service"
                                        select
                                        label="Select Service"
                                        placeholder='Service'
                                      
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '& input': {
                                                fontSize: '14px', 
                                            },
                                        }}
                                    
                                    />
                                </Grid>
                            )}
                            {selectedOption === '2' && (
                                <Grid item lg={6} sm={6} xs={12}>
                                    <TextField
                                        id="outlined-select-service"
                                        select
                                        label="Select Sub Service"
                                        placeholder='Sub Service'
                                       
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '& input': {
                                                fontSize: '14px', 
                                            },
                                        }}
                                 
                                    />
                                </Grid>
                            )} */}

                            {/* <Grid item lg={12} sm={12} xs={12}>
                                <TextField
                                    label="Address"
                                    id="outlined-size-small"
                                    placeholder='Lane,Area,Street'
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '14px', 
                                        },
                                    }}
                               
                                />
                            </Grid> */}

                            {/* <Grid item lg={12} sm={12} xs={12}>
                                <Button variant="contained" sx={{ m: 1, width: '30ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", }} type="submit">Submit</Button>
                            </Grid> */}
                        </Grid>
                    </CardContent>
                </Card>
            </form>
        </Box>
    )
}

export default CallerDetails
