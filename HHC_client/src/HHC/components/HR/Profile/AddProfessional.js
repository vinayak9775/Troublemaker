import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { TextField, Checkbox, FormControlLabel } from '@mui/material';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { CardContent } from '@mui/material';
import Navbar from '../../../Navbar';
import Footer from '../../../Footer';
import HRNavbar from '../HRNavbar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";

const role = [
  {
    role_id: 1,
    label: 'Professional',
  },
  {
    role_id: 2,
    label: 'Vendor',
  },
];

const title = [
  {
    title_id: 1,
    label: 'Dr',
  },
  {
    title_id: 2,
    label: 'Mr',
  },
  {
    title_id: 3,
    label: 'Mrs',
  },
];

const jobType = [
  {
    jobType_id: 1,
    label: 'Full Time',
  },
  {
    jobType_id: 2,
    label: 'On Call',
  },
];

const serviceMode = [
  {
    srvMode_id: 1,
    label: 'Consultant',
  },
  {
    srvMode_id: 2,
    label: 'Employment',
  },
];

const intMode = [
  {
    intMode_id: 1,
    label: 'Offline',
  },
  {
    intMode_id: 2,
    label: 'Online',
  },
];

const intRound = [
  {
    intRound_id: 1,
    label: 'Select 1',
  },
  {
    intRound_id: 2,
    label: 'Select 2',
  },
  {
    intRound_id: 3,
    label: 'Select 3',
  },
  {
    intRound_id: 4,
    label: 'Select 4',
  },
];

function AddProfessional() {
  const navigate = useNavigate();
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');

  // PROFESSIONAL DETAILS
  const [fstName, setFstName] = useState('');
  const [lstName, setLstName] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [gender, setGender] = useState([]);
  const [selectedGender, setSelectedGender] = useState('')
  const [dob, setDOB] = useState('')

  //EDUCATIONAL DETAILS
  const [qualification, setQualification] = useState([]);
  const [selectedQualification, setSelectedQualification] = useState('');
  const [specialization, setSpecialization] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [certificateRegNo, setCertificateRegNo] = useState('');
  const [intAvail, setIntAvail] = useState('');
  const [cv, setCV] = useState('');

  //SERVICE DETAILS
  const [service, setService] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [subService, setSubService] = useState([]);
  const [selectedSubService, setSelectedSubService] = useState([])

  //CONTACT DETAILS
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState('');
  const [altrContact, setAltrContact] = useState('');
  const [altrContactError, setAltrContactError] = useState('');
  const [emeContact, setEmeContact] = useState('');
  const [emeContactError, setEmeContactError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emeName, setEmeName] = useState('');
  const [relation, setRelation] = useState([]);
  const [selectedRelation, setSelectedRelation] = useState('');

  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedSrvMode, setSelectedSrvMode] = useState('');

  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [zone, setZone] = useState([]);
  const [selectedZone, setSelectedZone] = useState([]);

  // SCHEDULE INTERVIEW
  const [selectedIntMode, setSelectedIntMode] = useState('');
  const [selectedIntRnd, setSelectedIntRnd] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [intDate, setIntDate] = useState('');
  const [intTime, setIntTime] = useState('');

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Usestate for handling empty data
  const [errors, setErrors] = useState({
    selectedTitle: '',
    selectedRole: '',
    fstName: '',
    lstName: '',
    selectedGender: '',
    dob: '',

    selectedService: '',
    selectedSubService: '',

    contact: '',
    email: '',
    altrContact: '',
    emeContact: '',
    selectedState: '',
    selectedCity: '',
    selectedZone: '',
  });

  const handleEmptyField = () => {
    const newErrors = {};

    if (!selectedTitle) {
      newErrors.selectedTitle = 'Required';
    }
    if (!fstName) {
      newErrors.fstName = 'Required';
    }
    if (!lstName) {
      newErrors.lstName = 'Required';
    }
    if (!selectedRole) {
      newErrors.selectedRole = 'Required';
    }
    if (!selectedGender) {
      newErrors.selectedGender = 'Required';
    }
    if (!dob) {
      newErrors.dob = 'Required';
    }
    if (!selectedService) {
      newErrors.selectedService = 'Required';
    }
    if (!selectedSubService) {
      newErrors.selectedSubService = 'Required';
    }
    if (!contact) {
      newErrors.contact = 'Required';
    }
    if (!email) {
      newErrors.email = 'Required';
    }
    if (!altrContact) {
      newErrors.altrContact = 'Required';
    }
    if (!emeContact) {
      newErrors.emeContact = 'Required';
    }
    if (!selectedState) {
      newErrors.selectedState = 'Required';
    }
    if (!selectedCity) {
      newErrors.selectedCity = 'Required';
    }
    if (!selectedZone) {
      newErrors.selectedZone = 'Required';
    }
    // if (!address) {
    //     newErrors.address = 'Required';
    // }

    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error !== '');
  };

  // Validations //
  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, '');
    setContact(numericValue);
    // setAltrContact(numericValue);
    if (!numericValue) {
      setContactError('Contact is required');
      setErrors({ ...errors, contact: 'Contact is required' });
    } else if (!/^[6789]\d{9}$/.test(numericValue)) {
      setContactError('Please enter a valid contact');
      setErrors({ ...errors, contact: 'Please enter a valid contact' });
    } else if (parseInt(numericValue) < 0) {
      setContactError('Contact No should be a positive number');
      setErrors({ ...errors, contact: 'Contact No should be a positive number' });
    } else {
      setContactError('');
      setErrors({ ...errors, contact: '' });
    }
  };

  const handleAlterContactChange = (e) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, '');
    setAltrContact(numericValue);
    if (!numericValue) {
      setAltrContactError('Contact is required');
      setErrors({ ...errors, altrContact: 'Contact is required' });
    } else if (!/^[6789]\d{9}$/.test(numericValue)) {
      setAltrContactError('Please enter a valid contact');
      setErrors({ ...errors, altrContact: 'Please enter a valid contact' });
    } else if (parseInt(numericValue) < 0) {
      setAltrContactError('Contact No should be a positive number');
      setErrors({ ...errors, altrContact: 'Contact No should be a positive number' });
    } else {
      setAltrContactError('');
      setErrors({ ...errors, altrContact: '' });
    }
  };

  const handleEmeContactChange = (e) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, '');
    setEmeContact(numericValue);
    if (!numericValue) {
      setEmeContactError('Contact is required');
      setErrors({ ...errors, emeContact: 'Contact is required' });
    } else if (!/^[6789]\d{9}$/.test(numericValue)) {
      setEmeContactError('Please enter a valid contact');
      setErrors({ ...errors, emeContact: 'Please enter a valid contact' });
    } else if (parseInt(numericValue) < 0) {
      setEmeContactError('Contact No should be a positive number');
      setErrors({ ...errors, emeContact: 'Contact No should be a positive number' });
    } else {
      setEmeContactError('');
      setErrors({ ...errors, emeContact: '' });
    }
  };

  const handleEmailChange = (e) => {
    const input = e.target.value;
    setEmail(input);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!input) {
      setEmailError('Email is required');
      setErrors({ ...errors, email: 'Email is required' });
    } else if (!emailPattern.test(input)) {
      setEmailError('Please enter a valid email');
      setErrors({ ...errors, email: 'Please enter a valid email' });
    } else {
      setEmailError('');
      setErrors({ ...errors, email: '' });
    }
  };

  const handleDropdownTitle = (event) => {
    const selectedTitle = event.target.value;
    setSelectedTitle(selectedTitle);
  };

  const handleDropdownRole = (event) => {
    const selectedRole = event.target.value;
    setSelectedRole(selectedRole);
  };

  const handleDropdownRelation = (event) => {
    const selectedRelation = event.target.value;
    setSelectedRelation(selectedRelation);
  };

  const handleDropdownGender = (event) => {
    const selectedGender = event.target.value;
    setSelectedGender(selectedGender);
  };

  const handleDropdownQualifictn = (event) => {
    const selectedQualifi = event.target.value;
    setSelectedQualification(selectedQualifi);
  };

  const handleDropdownSpeclization = (event) => {
    const selectedSpecil = event.target.value;
    setSelectedSpecialization(selectedSpecil);
  };

  const handleDropdownService = (event) => {
    const selectedService = event.target.value;
    console.log("Selected Service...", selectedService)
    setSelectedService(selectedService);
  };

  const handleDropdownJobType = (event) => {
    const selectedJobType = event.target.value;
    setSelectedJobType(selectedJobType);
  };

  const handleDropdownSrvMode = (event) => {
    const selectedSrvMode = event.target.value;
    setSelectedSrvMode(selectedSrvMode);
  };

  const handleDropdownIntMode = (event) => {
    const selectedIntMode = event.target.value;
    setSelectedIntMode(selectedIntMode);
  };

  const handleDropdownIntRound = (event) => {
    const selectedIntRnd = event.target.value;
    setSelectedIntRnd(selectedIntRnd);
  };

  useEffect(() => {
    const getRelation = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_caller_relation_api`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
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
    const getGender = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_gender_api`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        console.log(data);
        setGender(data);
      } catch (error) {
        console.error("Error fetching gender data:", error);
      }
    };
    getGender();
  }, []);

  /// Qualification
  useEffect(() => {
    const getQualifictn = async () => {
      try {
        const res = await fetch(`${port}/hr/qualification_get_api`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        console.log("Qualification Data.........", data.qualification);
        setQualification(data.qualification);
      } catch (error) {
        console.error("Error fetching Qualification data:", error);
      }
    };
    getQualifictn();
  }, []);

  /// Specilization
  useEffect(() => {
    const getSpecialization = async () => {
      if (selectedQualification) {
        console.log("service Id", selectedQualification);
        try {
          const res = await fetch(`${port}/hr/qualification_specialization_get_api/${selectedQualification}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await res.json();
          console.log("Specilaization Data.........", data.specialization);
          setSpecialization(data.specialization)
        } catch (error) {
          console.error("Error fetching Specilaization data:", error);
        }
      }
    };
    getSpecialization();
  }, [selectedQualification]);

  useEffect(() => {
    const getService = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_services_api`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        console.log("Service Data.........", data);
        setService(data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    getService();
  }, []);

  useEffect(() => {
    const getSubService = async () => {
      console.log("selct service Id", selectedService);
      if (selectedService) {
        console.log("service Id", selectedService);
        try {
          const res = await fetch(`${port}/web/agg_hhc_sub_services_api/${selectedService}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await res.json();
          console.log("Sub Service Data", data);
          setSubService(data);
          // const initialSelectedSubServices = data.map((subService) => subService.sub_srv_id);
          // setSelectedSubService(initialSelectedSubServices);
        } catch (error) {
          console.error("Error fetching sub service data:", error);
        }
      } else {
        // Handle the case when selectedService is undefined
        setSubService([]);
      }
    };
    getSubService();
  }, [selectedService]);

  // const handleSubServiceSelect = (event) => {
  //   const subServiceId = event.target.value;
  //   const selectedSubService = subService.find(item => item.sub_srv_id === subServiceId);
  //   if (selectedSubService) {
  //     setSelectedSubService(subServiceId);
  //   }
  // };

  const handleCheckboxChange = (event) => {
    const checkedId = parseInt(event.target.name);
    if (event.target.checked) {
      setSelectedSubService(prevChecked => [...prevChecked, checkedId]);
    } else {
      setSelectedSubService(prevChecked => prevChecked.filter(id => id !== checkedId));
    }
  };

  // state data today
  useEffect(() => {
    const getState = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_state_api`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        console.log("State List....", data);
        setState(data);
      } catch (error) {
        console.error("Error fetching State data:", error);
      }
    };
    getState();
  }, []);

  useEffect(() => {
    if (state.length > 0 && !selectedState) {
      setSelectedState(state[0].state_id);
    }
  }, [state, selectedState]);

  // city data today
  useEffect(() => {
    const getCity = async () => {
      if (selectedState) {
        try {
          const res = await fetch(`${port}/web/agg_hhc_city_api/${selectedState}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await res.json();
          console.log("City List a/c to State Data", data);
          setCity(data);
        } catch (error) {
          console.error("Error fetching city data:", error);
        }
      }
    };
    getCity();
  }, [selectedState]);

  useEffect(() => {
    if (city.length > 0 && !selectedCity) {
      setSelectedCity(city[0].city_id);
    }
  }, [city, selectedCity]);

  // zone data today
  useEffect(() => {
    const getZone = async () => {
      if (selectedCity) {
        try {
          const res = await fetch(`${port}/web/agg_hhc_zone_api/${selectedCity}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await res.json();
          console.log("Zone List a/c to City Data", data);
          setZone(data);
        } catch (error) {
          console.error("Error fetching Zone data:", error);
        }
      }
    };
    getZone();
  }, [selectedCity]);

  const handleCheckboxZoneChange = (event) => {
    const checkedId = parseInt(event.target.name); // Convert to integer
    if (event.target.checked) {
      setSelectedZone(prevChecked => [...prevChecked, checkedId]);
    } else {
      setSelectedZone(prevChecked => prevChecked.filter(id => id !== checkedId));
    }
  };

  async function handleAddProf(event) {
    event.preventDefault();
    const hasEmptyFields = handleEmptyField();
    if (hasEmptyFields) {
      setOpenSnackbar(true);
      setSnackbarMessage('Please fill all required details.');
      setSnackbarSeverity('error');
      return;
    }

    const selectedServiceTitle = service.find((option) => option.srv_id === selectedService)?.service_title;

    // Create a FormData object
    const formData = new FormData();
    formData.append('title', selectedTitle);
    formData.append('role', selectedRole);
    formData.append('first_name', fstName);
    formData.append('last_name', lstName);
    formData.append('gender', selectedGender);
    formData.append('dob', dob);
    formData.append('qualification', selectedQualification);
    formData.append('certificate_registration_no', certificateRegNo);
    formData.append('specialization', selectedSpecialization);
    formData.append('availability_for_interview', intAvail);

    // Append the file
    if (cv) {
      formData.append('prof_CV', cv);
    }

    formData.append('service_title', selectedServiceTitle);
    formData.append('sub_services', selectedSubService);
    formData.append('Job_type', selectedJobType);
    formData.append('phone_no', contact);
    formData.append('alt_phone_no', altrContact);
    formData.append('eme_contact_no', emeContact);
    formData.append('email_id', email);
    formData.append('eme_conact_person_name', emeName);
    formData.append('eme_contact_relation', selectedRelation);
    formData.append('state_name', selectedState);
    formData.append('city', selectedCity);
    formData.append('prof_zones', selectedZone);
    formData.append('int_round', selectedIntRnd);
    formData.append('int_mode', selectedIntMode);
    formData.append('int_schedule_with', interviewer);
    formData.append('int_schedule_date', intDate);
    formData.append('int_schedule_time', intTime);

    console.log("POST API Hitting......", formData);

    try {
      const response = await fetch(`${port}/hr/Register_professioanl_for_HR/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log("Successfully submitted Professional data", result);
      setOpenSnackbar(true);
      setSnackbarMessage('Professional data submitted successfully!');
      setSnackbarSeverity('success');
      navigate('/hr/manage profiles');  
    } catch (error) {
      console.error("Error fetching professional data:", error);
    }
  }

  // async function handleAddProf(event) {
  //   event.preventDefault();
  //   const hasEmptyFields = handleEmptyField();
  //   if (hasEmptyFields) {
  //     setOpenSnackbar(true);
  //     setSnackbarMessage('Please fill all required details.');
  //     setSnackbarSeverity('error');
  //     return;
  //   }

  //   const selectedServiceTitle = service.find((option) => option.srv_id === selectedService)?.service_title;

  //   const requestData = {
  //     title: selectedTitle,
  //     role: selectedRole,
  //     first_name: fstName,
  //     last_name: lstName,
  //     gender: selectedGender,
  //     dob: dob,

  //     qualification: selectedQualification,
  //     certificate_registration_no: certificateRegNo,
  //     specialization: selectedSpecialization,
  //     availability_for_interview: intAvail,
  //     prof_CV: cv,

  //     // srv_id: selectedService,
  //     service_title: selectedServiceTitle, // Pass the service title instead of the ID
  //     sub_services: selectedSubService,
  //     Job_type: selectedJobType,
  //     // mode_of_service: selectedSrvMode,

  //     phone_no: contact,
  //     alt_phone_no: altrContact,
  //     eme_contact_no: emeContact,
  //     email_id: email,
  //     eme_conact_person_name: emeName,
  //     eme_contact_relation: selectedRelation,

  //     state_name: selectedState,
  //     city: selectedCity,
  //     prof_zones: selectedZone,
  //     // address: toDate,

  //     int_round: selectedIntRnd,
  //     int_mode: selectedIntMode,
  //     int_schedule_with: interviewer,
  //     int_schedule_date: intDate,
  //     int_schedule_time: intTime,
  //   };
  //   console.log("POST API Hitting......", requestData)
  //   try {
  //     const response = await fetch(`${port}/hr/Register_professioanl_for_HR/`, {
  //       method: "POST",
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       body: JSON.stringify(requestData),
  //     });
  //     if (!response.ok) {
  //       console.error(`HTTP error! Status: ${response.status}`);
  //       return;
  //     }
  //     const result = await response.json();
  //     console.log("Successfully submitted Professional data", result);
  //     setOpenSnackbar(true);
  //     setSnackbarMessage('Professional data submitted successfully!');
  //     setSnackbarSeverity('success');
  //     // navigate('/manage-profile',)
  //     // onClose();
  //     // window.location.reload();
  //   } catch (error) {
  //     console.error("Error fetching professional data:", error);
  //   }
  // }

  return (
    <>
      <HRNavbar />
      <Box sx={{ m: 1, marginBottom: '2em' }}>
        <Grid item xs={12} container spacing={1}>
          <Grid item lg={6} md={6} xs={12}>
            <Card
              sx={{ width: "100%", borderRadius: "10px", bgColor: "white", boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)' }}
            >
              <CardContent>
                <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, }}>PROFESSIONAL DETAILS</Typography>
                <Grid container spacing={2} sx={{ marginTop: "1px" }}>
                  <Grid item lg={2} sm={6} xs={12}>
                    <TextField
                      required
                      select
                      id="title"
                      name="title"
                      label="Title"
                      placeholder="Dr/Mr/Mrs"
                      size="small"
                      fullWidth
                      value={selectedTitle}
                      onChange={handleDropdownTitle}
                      error={!!errors.selectedTitle}
                      helperText={errors.selectedTitle}
                      sx={{
                        textAlign: "left",
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                    >
                      {title.map((option) => (
                        <MenuItem key={option.title_id} value={option.title_id}
                          sx={{ fontSize: "14px" }}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item lg={5} sm={6} xs={12}>
                    <TextField
                      required
                      id="first_name"
                      name="first_name"
                      label="First Name"
                      value={fstName}
                      onChange={(e) => setFstName(e.target.value)}
                      size="small"
                      fullWidth
                      error={!!errors.fstName}
                      helperText={errors.fstName}
                      sx={{
                        textAlign: "left", '& input': {
                          fontSize: '14px',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item lg={5} md={6} sm={6} xs={12}>
                    <TextField
                      required
                      id="last_name"
                      name="last_name"
                      label="Last Name"
                      size="small"
                      fullWidth
                      value={lstName}
                      onChange={(e) => setLstName(e.target.value)}
                      error={!!errors.lstName}
                      helperText={errors.lstName}
                      sx={{
                        textAlign: "left", '& input': {
                          fontSize: '14px',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      required
                      select
                      id="role"
                      label="Role"
                      placeholder="Professional/Vendor"
                      size="small"
                      fullWidth
                      value={selectedRole}
                      onChange={handleDropdownRole}
                      error={!!errors.selectedRole}
                      helperText={errors.selectedRole}
                      sx={{
                        textAlign: "left",
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                    >
                      {role.map((option) => (
                        <MenuItem key={option.role_id} value={option.role_id}
                          sx={{ fontSize: "14px" }}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item lg={4} sm={6} xs={12}>
                    <TextField
                      required
                      id="gender"
                      name="gender"
                      select
                      label="Gender"
                      value={selectedGender}
                      onChange={handleDropdownGender}
                      size="small"
                      fullWidth
                      error={!!errors.selectedGender}
                      helperText={errors.selectedGender}
                      sx={{
                        textAlign: "left", '& input': {
                          fontSize: '14px',
                        },
                      }}
                    >
                      {gender.map((option) => (
                        <MenuItem key={option.gender_id} value={option.gender_id}
                          sx={{ fontSize: "14px" }}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item lg={4} sm={6} xs={12}>
                    <TextField
                      required
                      id="dob"
                      label="DOB"
                      type="date"
                      value={dob}
                      onChange={(e) => setDOB(e.target.value)}
                      size="small"
                      fullWidth
                      error={!!errors.dob}
                      helperText={errors.dob}
                      sx={{
                        textAlign: "left", '& input': {
                          fontSize: '14px',
                        },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item lg={6} md={6} xs={12}>
            <Card
              sx={{
                width: "100%",
                borderRadius: "10px",
                bgColor: "white",
                boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
              }}
            >
              <CardContent>
                <Grid container>
                  <Typography align="left" style={{ fontSize: "16px", fontWeight: 600 }}>EDUCATIONAL DETAILS  </Typography>
                </Grid>

                <Grid container spacing={2} sx={{ marginTop: "1px" }} >
                  <Grid item lg={6} sm={6} xs={12}>
                    <TextField
                      select
                      id="qualification"
                      name="qualification"
                      label="Qualification"
                      size="small"
                      fullWidth
                      value={selectedQualification}
                      onChange={handleDropdownQualifictn}
                      sx={{
                        textAlign: "left", '& input': {
                          fontSize: '14px',
                        },
                      }}
                    >
                      {qualification.map((option) => (
                        <MenuItem key={option.quali_id} value={option.quali_id}
                          sx={{ fontSize: "14px", }}>
                          {option.qualification}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item lg={6} sm={6} xs={12}>
                    <TextField
                      id="certificate_registration_no"
                      name="certificate_registration_no"
                      label="Certificate Registration No"
                      size="small"
                      fullWidth
                      value={certificateRegNo}
                      onChange={(e) => setCertificateRegNo(e.target.value)}
                      sx={{
                        textAlign: "left",
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item lg={12} sm={12} xs={12}>
                    <Grid container spacing={1}>
                      <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                          select
                          id="specialization"
                          name="specialization"
                          label="Specialization"
                          size="small"
                          fullWidth
                          value={selectedSpecialization}
                          onChange={handleDropdownSpeclization}
                          sx={{
                            textAlign: "left",
                            '& input': {
                              fontSize: '14px',
                            },
                          }}
                        >
                          {specialization.map((option) => (
                            <MenuItem key={option.quali_sp} value={option.quali_sp}
                              sx={{ fontSize: "14px", }}>
                              {option.specialization}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                          label="Interview Availability"
                          id="availability_for_interview"
                          name="availability_for_interview"
                          type="date"
                          size="small"
                          fullWidth
                          value={intAvail}
                          onChange={(e) => setIntAvail(e.target.value)}
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

                      <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                          label="View CV"
                          id="prof_CV"
                          name="prof_CV"
                          type="file"
                          size="small"
                          fullWidth
                          onChange={(e) => setCV(e.target.files[0])}
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
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} container spacing={1}>

            <Grid item lg={3} md={3} xs={12}>
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                  bgColor: "white",
                  boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
                }}
              >
                <CardContent>
                  <Grid container>
                    <Typography align="left" style={{ fontSize: "16px", fontWeight: 600 }}>SERVICE DETAILS  </Typography>
                  </Grid>

                  <Grid container spacing={2} sx={{ marginTop: "1px" }} >
                    <Grid item xs={12}>
                      <TextField
                        required
                        id="srv_id"
                        name="srv_id"
                        select
                        label="Select Service"
                        value={selectedService}
                        onChange={handleDropdownService}
                        size="small"
                        fullWidth
                        error={!!errors.selectedService}
                        helperText={errors.selectedService}
                        sx={{
                          textAlign: "left", '& input': {
                            fontSize: '14px',
                          },
                        }}
                        SelectProps={{
                          MenuProps: {
                            PaperProps: {
                              style: {
                                maxHeight: '200px',
                                maxWidth: '200px',
                              },
                            },
                          },
                        }}
                      >
                        {service.map((option) => (
                          <MenuItem key={option.srv_id} value={option.srv_id}
                            sx={{ fontSize: "14px", }}>
                            {option.service_title}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      {/* <TextField
                        required
                        id="sub_services"
                        name="sub_services"
                        select
                        label="Select Sub Service"
                        size="small"
                        fullWidth
                        error={!!errors.selectedSubService}
                        helperText={errors.selectedSubService}
                        SelectProps={{
                          MenuProps: {
                            PaperProps: {
                              style: {
                                maxHeight: '200px',
                                maxWidth: '200px',
                              },
                            },
                          },
                        }}
                      >
                        {subService.map(option => (
                          <FormControlLabel
                            key={option.sub_srv_id}
                            sx={{
                              textAlign: "left", '& .MuiFormControlLabel-label': {
                                fontSize: '14px',
                              }
                            }}
                            control={
                              <Checkbox
                                checked={selectedSubService.includes(option.sub_srv_id)}
                                onChange={handleCheckboxChange}
                                name={option.sub_srv_id.toString()}
                                // size="medium"
                                sx={{ ml: "15px" }}
                              />
                            }
                            label={option.recommomded_service}
                          />
                        ))}
                      </TextField> */}
                      <TextField
                        required
                        id="sub_services"
                        name="sub_services"
                        select
                        label="Select Sub Service"
                        size="small"
                        fullWidth
                        value={selectedSubService.map(id => {
                          const service = subService.find(option => option.sub_srv_id === id);
                          return service ? service.recommomded_service : '';
                        }).join(', ')} // Display selected sub-service names
                        error={!!errors.selectedSubService}
                        helperText={errors.selectedSubService}
                        SelectProps={{
                          multiple: true, // Allow multiple selections
                          value: selectedSubService, // Keep selected values
                          renderValue: (selected) => selected.map(id => {
                            const service = subService.find(option => option.sub_srv_id === id);
                            return service ? service.recommomded_service : '';
                          }).join(', '), // Format how selected names appear
                          MenuProps: {
                            PaperProps: {
                              style: {
                                maxHeight: '200px',
                                maxWidth: '200px',
                              },
                            },
                          },
                        }}
                      >
                        {subService.map(option => (
                          <MenuItem key={option.sub_srv_id} value={option.sub_srv_id}>
                            <FormControlLabel
                              sx={{
                                textAlign: "left", '& .MuiFormControlLabel-label': {
                                  fontSize: '14px',
                                }
                              }}
                              control={
                                <Checkbox
                                  checked={selectedSubService.includes(option.sub_srv_id)}
                                  onChange={handleCheckboxChange}
                                  name={option.sub_srv_id.toString()}
                                  sx={{ ml: "15px" }}
                                />
                              }
                              label={option.recommomded_service}
                            />
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        select
                        id="Job_type"
                        name="Job_type"
                        label="Job Type"
                        size="small"
                        fullWidth
                        value={selectedJobType}
                        onChange={handleDropdownJobType}
                        sx={{
                          textAlign: "left", '& input': {
                            fontSize: '14px',
                          },
                        }}
                      >
                        {jobType.map((option) => (
                          <MenuItem key={option.jobType_id} value={option.jobType_id}
                            sx={{ fontSize: "14px", }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* <Grid item xs={12}>
                      <TextField
                        select
                        id="mode_of_service"
                        name="mode_of_service"
                        label="Mode of Service"
                        size="small"
                        fullWidth
                        value={selectedSrvMode}
                        onChange={handleDropdownSrvMode}
                        sx={{
                          textAlign: "left", '& input': {
                            fontSize: '14px',
                          },
                        }}
                      >
                        {serviceMode.map((option) => (
                          <MenuItem key={option.srvMode_id} value={option.srvMode_id}
                            sx={{ fontSize: "14px", }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid> */}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item lg={6} md={3} xs={12}>
              <Card
                sx={{
                  width: "100%",
                  borderRadius: "10px",
                  bgColor: "white",
                  boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
                }}
              >
                <CardContent>
                  <Grid container>
                    <Typography align="left" style={{ fontSize: "16px", fontWeight: 600 }}>CONTACT DETAILS  </Typography>
                  </Grid>

                  <Grid container spacing={2} sx={{ marginTop: "1px" }} >
                    <Grid item lg={6} sm={6} xs={12}>
                      <TextField
                        id="phone_no"
                        name="phone_no"
                        label="Contact No"
                        size="small"
                        fullWidth
                        value={contact}
                        onInput={handlePhoneNumberChange}
                        error={!!contactError || !!errors.contact}
                        helperText={contactError || errors.contact}
                        inputProps={{
                          minLength: 10,
                          maxLength: 10,
                        }}
                        sx={{
                          textAlign: "left", '& input': {
                            fontSize: '14px',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item lg={6} sm={6} xs={12}>
                      <TextField
                        id="email_id"
                        name="email_id"
                        label="Email"
                        placeholder='example@gmail.com'
                        size="small"
                        fullWidth
                        value={email}
                        onInput={handleEmailChange}
                        error={!!emailError || errors.email}
                        helperText={emailError || errors.email}
                        sx={{
                          textAlign: "left",
                          '& input': {
                            fontSize: '14px',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item lg={6} sm={6} xs={12}>
                      <TextField
                        id="alt_phone_no"
                        name="alt_phone_no"
                        label="Alternate Contact"
                        size="small"
                        fullWidth
                        value={altrContact}
                        onInput={handleAlterContactChange}
                        error={!!altrContactError || !!errors.altrContact}
                        helperText={altrContactError || errors.altrContact}
                        inputProps={{
                          minLength: 10,
                          maxLength: 10,
                        }}
                        sx={{
                          textAlign: "left",
                          '& input': {
                            fontSize: '14px',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item lg={6} sm={6} xs={12}>
                      <TextField
                        id="eme_contact_no"
                        name="eme_contact_no"
                        label="Emergency Contact"
                        size="small"
                        fullWidth
                        value={emeContact}
                        onInput={handleEmeContactChange}
                        error={!!emeContactError || !!errors.emeContact}
                        helperText={emeContactError || errors.emeContact}
                        inputProps={{
                          minLength: 10,
                          maxLength: 10,
                        }}
                        sx={{
                          textAlign: "left",
                          '& input': {
                            fontSize: '14px',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item lg={6} sm={6} xs={12}>
                      <TextField
                        id="eme_contact_relation"
                        name="eme_contact_relation"
                        select
                        label="Emergency Contact Relation"
                        value={selectedRelation}
                        onChange={handleDropdownRelation}
                        size="small"
                        fullWidth
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
                        {relation.map((option) => (
                          <MenuItem key={option.caller_rel_id} value={option.caller_rel_id}
                            sx={{ fontSize: "14px" }}>
                            {option.relation}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item lg={6} sm={6} xs={12}>
                      <TextField
                        id="eme_conact_person_name"
                        name="eme_conact_person_name"
                        label="Name"
                        size="small"
                        fullWidth
                        value={emeName}
                        onChange={(e) => setEmeName(e.target.value)}
                        sx={{
                          textAlign: "left",
                          '& input': {
                            fontSize: '14px',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={3}>
                          <TextField
                            required
                            label="State"
                            id="state_id"
                            name="state_id"
                            select
                            placeholder='State'
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            size="small"
                            fullWidth
                            error={!!errors.selectedState}
                            helperText={errors.selectedState}
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
                            {state.map((option) => (
                              <MenuItem key={option.state_id} value={option.state_id}
                                sx={{ fontSize: "14px" }}>
                                {option.state_name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            required
                            label="City"
                            id="city"
                            name="city"
                            select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            size="small"
                            fullWidth
                            error={!!errors.selectedCity}
                            helperText={errors.selectedCity}
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
                            {city.map((option) => (
                              <MenuItem key={option.city_id} value={option.city_id}
                                sx={{ fontSize: "14px" }}>
                                {option.city_name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            required
                            // label="Preferred Location"
                            label="Zone"
                            id="prof_zones"
                            name="prof_zones"
                            select
                            size="small"
                            fullWidth
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
                                    maxWidth: '120px',
                                  },
                                },
                              },
                            }}
                          >
                            {/* {zone.map((option) => (
                          <MenuItem key={option.prof_zone_id} value={option.prof_zone_id}
                            sx={{ fontSize: "14px" }}>
                            {option.Name}
                          </MenuItem>
                        ))} */}
                            {zone.map(option => (
                              <FormControlLabel
                                key={option.prof_zone_id}
                                sx={{
                                  textAlign: "left", '& .MuiFormControlLabel-label': {
                                    fontSize: '14px',
                                  }
                                }}
                                control={
                                  <Checkbox
                                    checked={selectedZone.includes(option.prof_zone_id)}
                                    onChange={handleCheckboxZoneChange}
                                    name={option.prof_zone_id.toString()}
                                    sx={{ ml: "15px" }}
                                  />
                                }
                                label={option.Name}
                              />
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            label="Pincode"
                            id="outlined-size-small"
                            placeholder='Pincode'
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
                  </Grid>

                </CardContent>
              </Card>
            </Grid>

            <Grid item lg={3} md={3} xs={12}>
              <Card
                sx={{
                  width: "100%",
                  borderRadius: "10px",
                  bgColor: "white",
                  boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
                }}
              >
                <CardContent>
                  <Grid container>
                    <Typography align="left" style={{ fontSize: "16px", fontWeight: 600 }}>SCHEDULE INTERVIEW</Typography>
                  </Grid>

                  <Grid container spacing={2} sx={{ marginTop: "1px" }} >
                    <Grid item xs={12}>
                      <TextField
                        select
                        id="int_round"
                        name="int_round"
                        label="Interview Round"
                        size="small"
                        fullWidth
                        defaultValue={selectedIntRnd}
                        onchange={handleDropdownIntRound}
                        sx={{
                          textAlign: "left", '& input': {
                            fontSize: '14px',
                          },
                        }}
                      >
                        {intRound.map((option) => (
                          <MenuItem key={option.intRound_id} value={option.intRound_id}
                            sx={{ fontSize: "14px", }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        select
                        id="int_mode"
                        name="int_mode"
                        label="Mode of Interview"
                        size="small"
                        fullWidth
                        value={selectedIntMode}
                        onChange={handleDropdownIntMode}
                        sx={{
                          textAlign: "left",
                          '& input': {
                            fontSize: '14px',
                          },
                        }}
                      >
                        {intMode.map((option) => (
                          <MenuItem key={option.intMode_id} value={option.intMode_id}
                            sx={{ fontSize: "14px", }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        id="int_schedule_with"
                        name="int_schedule_with"
                        label="Interview Schedule with"
                        size="small"
                        fullWidth
                        value={interviewer}
                        onChange={(e) => setInterviewer(e.target.value)}
                        sx={{
                          textAlign: "left",
                          '& input': {
                            fontSize: '14px',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <TextField
                            id="int_schedule_date"
                            name="int_schedule_date"
                            type="date"
                            label="Date"
                            size="small"
                            fullWidth
                            value={intDate}
                            onChange={(e) => setIntDate(e.target.value)}
                            sx={{
                              textAlign: "left",
                              '& input': {
                                fontSize: '14px',
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            label="Time"
                            id="oint_schedule_time"
                            name="int_schedule_time"
                            type="time"
                            size="small"
                            fullWidth
                            value={intTime}
                            onChange={(e) => setIntTime(e.target.value)}
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
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={12} sm={12} xs={12}>
          <Button variant="contained"
            sx={{ mt: 1, mb: 2, width: '30ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", }}
            type="submit" onClick={handleAddProf}>
            Submit
          </Button>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
          >
            <Alert variant="filled"
              onClose={handleSnackbarClose}
              // severity="success"
              severity={snackbarSeverity}
              sx={{ width: '100%', ml: 64, mb: 20 }}
            >
              {snackbarMessage}
            </Alert>

          </Snackbar>
        </Grid>
      </Box>
      <Footer />
    </>

  )
}

export default AddProfessional
