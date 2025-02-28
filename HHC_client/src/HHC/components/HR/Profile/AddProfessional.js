import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Snackbar, Alert, TextField, Typography, Checkbox, FormControlLabel, Box, Card, CardContent, Grid, Button, MenuItem } from '@mui/material';
import Footer from '../../../Footer';
import HRNavbar from '../HRNavbar';
import MuiAlert from "@mui/material/Alert";
import DownloadIcon from '@mui/icons-material/Download';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

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
  {
    title_id: 4,
    label: 'Ms',
  },
];

const jobType = [
  {
    jobType_id: 2,
    label: 'Full Time',
  },
  {
    jobType_id: 1,
    label: 'On Call',
  }
];

const libraries = ['places'];

function AddProfessional() {

  const [refId, setRefId] = useState(null);
  useEffect(() => {
    const id = localStorage.getItem('clg_id');
    const ref_id = localStorage.getItem('clgrefId');
    setClgId(id);
    setRefId(ref_id);
  }, []);

  ///GIS
  const [gisAddress, setGisAddress] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const addressRef = useRef();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [lat, setLat] = useState(null);
  console.log(lat, 'fetchedlat');

  const [long, setLong] = useState(null);
  console.log(long, 'fetchedlong');

  const validateLong = (value) => {
    const longValue = parseFloat(value);
    if (isNaN(longValue) || longValue < -180 || longValue > 180) {
      return 'Invalid longitude';
    }
    return '';
  };

  const handlePlaceChanged = () => {
    console.log("place select function hitting...");
    if (addressRef.current) {
      const place = addressRef.current.getPlace();
      setSelectedPlace(place);
      console.log("place select...", place.formatted_address);
      const { lat, lng } = place.geometry.location;

      const formattedLat = parseFloat(lat().toFixed(6));
      const formattedLng = parseFloat(lng().toFixed(6));
      setGisAddress(place.formatted_address);

      setLat(formattedLat);
      setLong(formattedLng);
      console.log('Latitude:', formattedLat);
      console.log('Longitude:', formattedLng);
    }
  };
  ///GIS

  const navigate = useNavigate();
  const location = useLocation();
  const [clgId, setClgId] = useState(null);
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const { professionalId } = location.state || {}
  console.log(professionalId, 'professional ID is fetching from Table');
  const srv_prof_id = location.state?.srv_prof_id || professionalId;
  console.log(srv_prof_id, 'gggggggg');

  useEffect(() => {
    if (srv_prof_id) {
      console.log("Fetched srv_prof_id:", srv_prof_id);
    } else {
      console.warn("srv_prof_id is missing in state.");
    }
  }, [srv_prof_id]);

  useEffect(() => {
    const id = localStorage.getItem('clg_id');
    setClgId(id);
  }, []);

  // PROFESSIONAL DETAILS
  const [selectedTitle, setSelectedTitle] = useState('')
  const [fstName, setFstName] = useState('');
  const [lstName, setLstName] = useState('');
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
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setIntAvail(today);
  }, []);
  const [cv, setCV] = useState('');
  const [error, setError] = useState('');
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCV(file);
  };

  //SERVICE DETAILS
  const [service, setService] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [subService, setSubService] = useState([]);
  const [selectedSubService, setSelectedSubService] = useState([])
  console.log(selectedSubService, 'selected Sub Services........');
  const [selectedJobType, setSelectedJobType] = useState('');

  //CONTACT DETAILS
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [altrContact, setAltrContact] = useState('');
  const [contactError, setContactError] = useState('');
  const [emeContact, setEmeContact] = useState('');
  const [selectedRelation, setSelectedRelation] = useState('');
  const [emeName, setEmeName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState('1');
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState('1');
  const [zone, setZone] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [altrContactError, setAltrContactError] = useState('');
  const [emeContactError, setEmeContactError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [relation, setRelation] = useState([]);
  // const [gisAddress, setGisAddress] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [cvFile, setCvFile] = useState("");

  // SCHEDULE INTERVIEW
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // DOB Validation
  const calculateMinDate = () => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 18);
    return minDate.toISOString().split('T')[0];
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Use State for handling empty data
  const [errors, setErrors] = useState({
    selectedTitle: '',
    selectedRole: '',
    fstName: '',
    lstName: '',
    selectedGender: '',
    dob: '',

    selectedService: '',
    selectedSubService: '',
    selectedJobType: '',
    certificateRegNo: '',

    contact: '',
    email: '',
    altrContact: '',
    emeContact: '',
    selectedState: '',
    selectedCity: '',
    selectedZone: '',
    manualAddress: '',
    cv: '',
    gisAddress: '',
    lat: '',
    long: '',
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
    // if (!cv) {
    //   newErrors.cv = 'Required';
    // }
    if (!cv && !cvFile) {
      newErrors.cv = 'Required';
    }
    if (!selectedJobType) {
      newErrors.selectedJobType = 'Required';
    }
    if (!certificateRegNo) {
      newErrors.certificateRegNo = 'Required';
    }
    if (!manualAddress) {
      newErrors.manualAddress = 'Required';
    }
    if (!gisAddress) {
      newErrors.gisAddress = 'Required';
    }
    if (!lat) {
      newErrors.lat = 'Lattitude is required';
    }
    if (!long) {
      newErrors.long = 'Longitude is required';
    }

    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error !== '');
  };

  // Validations //
  const handlePhoneNumberChange = async (e) => {
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

    if (numericValue.length === 10) {
      try {
        const response = await fetch(
          `${port}/hr/professional_is_already_exists/?phone_no=${numericValue}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          setSnackbarMessage("Professional Validated Successfully");
          setSnackbarSeverity("success");
        } else if (response.status === 409) {
          setSnackbarMessage("Phone Number already exists");
          setSnackbarSeverity("error");
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (error) {
        setSnackbarMessage("Error validating phone number.");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
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

    // Updated regex pattern for .com and .in only
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;

    if (!input) {
      setEmailError('Email is required');
      setErrors({ ...errors, email: 'Email is required' });
    } else if (!emailPattern.test(input)) {
      setEmailError('Please enter a valid email ending with .com or .in');
      setErrors({ ...errors, email: 'Please enter a valid email ending with .com or .in' });
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
        } catch (error) {
          console.error("Error fetching sub service data:", error);
        }
      } else {
        setSubService([]);
      }
    };
    getSubService();
  }, [selectedService]);

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

  useEffect(() => {
    if (srv_prof_id) {
      const fetchProfessionalData = async () => {
        try {
          const response = await fetch(`${port}/hr/edit_register_professional/${srv_prof_id}/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            console.error(`Error fetching professional data: ${response.status}`);
            return;
          }

          const data = await response.json();

          // Professional Data
          setSelectedService(data.service_professional?.srv_id);
          console.log('Service ID:', data.service_professional?.srv_id);

          // Update the state for selected sub-services
          const subServiceIds = data.sub_services.map(subService => subService.sub_srv_id);
          setSelectedSubService(subServiceIds);
          console.log('Sub-Service IDs:', subServiceIds);

          setSelectedJobType(data.service_professional?.Job_type);

          //________________Professional Details
          setSelectedTitle(data.service_professional?.title);
          setLat(data.service_professional?.lattitude)
          setLong(data.service_professional?.langitude)
          const fullName = data.service_professional?.prof_fullname;
          const nameParts = fullName.split(' ');
          const firstName = nameParts.slice(1, nameParts.length - 1).join(' ');
          console.log(firstName, 'firstName');

          const lastName = nameParts[nameParts.length - 1];
          setFstName(firstName);
          setLstName(lastName);
          setSelectedRole(data.service_professional?.role);
          setSelectedGender(data.service_professional?.gender);
          setDOB(data.service_professional?.dob);

          // Emergency Contact Details
          setContact(data.service_professional?.phone_no);
          setEmail(data.service_professional?.email_id);
          setAltrContact(data.service_professional?.alt_phone_no);
          setEmeContact(data.service_professional?.eme_contact_no);
          setSelectedRelation(data.service_professional?.eme_contact_relation);
          setEmeName(data.service_professional?.eme_conact_person_name);
          setGisAddress(data.service_professional?.google_home_location);
          setManualAddress(data.service_professional?.prof_address);

          // Address and Location Data
          setSelectedState(data.service_professional?.state_name);
          setSelectedCity(data.service_professional?.city);
          setPinCode(data.service_professional?.pin_code_id);
          if (data.service_professional && data.service_professional.cv_file) {
            setCvFile(data.service_professional.cv_file);
          }

          // Zones
          setZone(data.Zone || []);

          if (data.Zone && data.Zone.length > 0) {
            const selectedLocation = data.Zone[0].prof_zone_id;
            setSelectedZone(selectedLocation);
          }
          const cvFilePath = data.service_professional?.cv_file;
          if (cvFilePath) {
            const cvFileName = cvFilePath.split('/').pop();
            console.log('CV File Name:', cvFileName);
          }

          // Qualification Details
          if (data.int_services_data && data.int_services_data.length > 0) {
            const qualificationData = data.int_services_data[0];
            setSelectedQualification(qualificationData.qualification);
            setSelectedSpecialization(qualificationData.specialization);
            const interviewDate = qualificationData.availability_for_interview.split('T')[0];
            setIntAvail(interviewDate);
          }
          setCertificateRegNo(data.service_professional?.certificate_registration_no);

        } catch (error) {
          console.error('Error fetching professional data:', error);
        }
      };

      fetchProfessionalData();
    }
  }, [srv_prof_id]);

  async function handleAddProf(event) {
    event.preventDefault();
    const hasEmptyFields = handleEmptyField();
    if (hasEmptyFields) {
      setOpenSnackbar(true);
      setSnackbarMessage('Please fill all required details.');
      setSnackbarSeverity('error');
      return;
    }

    const formData = new FormData();
    //professional details
    formData.append('title', selectedTitle);
    formData.append('clg_first_name', fstName);
    formData.append('clg_last_name', lstName);
    formData.append('role', selectedRole);
    formData.append('gender', selectedGender);
    formData.append('dob', dob);

    //educations
    formData.append('qualification', selectedQualification);
    formData.append('certificate_registration_no', certificateRegNo);
    formData.append('clg_specialization', selectedSpecialization);
    formData.append('availability_for_interview', intAvail);
    // formData.append('cv_file', cv);
    if (cv) {
      formData.append('cv_file', cv);
    }
    //  else if (cvFile) {
    //   formData.append('cv_file', cvFile);
    // }

    //service details
    formData.append('srv_id', selectedService);
    // formData.append('service_title', selectedServiceTitle);
    formData.append('sub_services', JSON.stringify(selectedSubService) || '[]');
    formData.append('Job_type', selectedJobType);

    //contact details
    formData.append('contact_number', contact);
    formData.append('email', email);
    formData.append('alternate_number', altrContact);
    formData.append('emergency_contact_number', emeContact);
    formData.append('emergency_relation', selectedRelation);
    formData.append('emergency_name', emeName);

    // Address
    formData.append('state', selectedState);
    formData.append('city', selectedCity);
    formData.append('prof_zone', selectedZone ? [selectedZone] : []);
    formData.append('pincode', pinCode);
    formData.append('last_modified_by', clgId);
    formData.append('address', manualAddress);
    formData.append('google_home_location', gisAddress);
    formData.append('langitude', long);
    formData.append('lattitude', lat);
    formData.append('added_by', refId);
    formData.append('last_modified_by', refId);
    console.log("POST API Hitting......", formData);

    try {
      let response;
      if (srv_prof_id) {
        response = await fetch(`${port}/hr/edit_register_professional/${srv_prof_id}/`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(`${port}/hr/Register_professioanl_for_HR/`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        });
      }
      if (response.status === 201) {
        const result = await response.json();
        console.log("Successfully submitted Professional data", result);
        setSnackbarMessage('Professional data submitted successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        navigate('/hr/manage profiles');
      }
      else if (response.status === 200) {
        const result = await response.json();
        console.log("Successfully Updated Professional data", result);
        setSnackbarMessage('Professional data updated successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        navigate('/hr/manage profiles');
      }
      else if (response.status === 400) {
        const errorResult = await response.json();
        setOpenSnackbar(true);
        setSnackbarMessage(errorResult.error);
        setSnackbarSeverity('error');
      }
      else if (response.status === 409) {
        const errorResult = await response.json();
        setOpenSnackbar(true);
        setSnackbarMessage(errorResult.error);
        setSnackbarSeverity('error');
      } else if (response.status === 500) {
        setOpenSnackbar(true);
        setSnackbarMessage('Something went wrong. Please try again later.');
        setSnackbarSeverity('error');
      } else {
        console.error(`Unhandled status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching professional data:", error);
      setOpenSnackbar(true);
      setSnackbarMessage('Failed to submit professional data. Please try again.');
      setSnackbarSeverity('error');
    }
  }

  // Function to fetch data from API
  const fetchData = async (certificateRegNo) => {
    if (certificateRegNo.trim() === "") return;

    try {
      const response = await fetch(
        `${port}/hr/professional_is_already_exists/?certificate_registration_no=${certificateRegNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setSnackbarMessage("Registration Number Validated Successfully");
        setSnackbarSeverity("success");
      } else if (response.status === 409) {
        setSnackbarMessage("Registration Number already exists");
        setSnackbarSeverity("error");
      } else {
        setSnackbarMessage("Unexpected response status");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error validating phone number:", error);
      setSnackbarMessage("Error validating phone number.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  // useEffect(() => {
  //   fetchData(certificateRegNo);
  // }, [certificateRegNo]);

  const downloadCV = (cvFile, event) => {
    event.preventDefault();
    const newTab = window.open(`${port}${cvFile}`, '_blank');

    if (newTab) {
      newTab.focus();
    } else {
      window.location.href = `${port}${cvFile}`;
    }
  };


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
                      id="clg_first_name"
                      name="clg_first_name"
                      label="First Name"
                      value={fstName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z]*$/.test(value)) {
                          setFstName(value);
                        }
                      }}
                      size="small"
                      fullWidth
                      error={!!errors.fstName}
                      helperText={errors.fstName}
                      sx={{
                        textAlign: "left",
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item lg={5} md={6} sm={6} xs={12}>
                    <TextField
                      required
                      id="clg_last_name"
                      name="clg_last_name"
                      label="Last Name"
                      size="small"
                      fullWidth
                      value={lstName}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[a-zA-Z]*$/.test(value)) {
                          setLstName(value);
                        }
                      }} error={!!errors.lstName}
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
                      inputProps={{
                        max: calculateMinDate(),
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
                      label="Qualification*"
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
                      label="Certificate Registration No*"
                      size="small"
                      fullWidth
                      value={certificateRegNo}
                      // onChange={(e) => setCertificateRegNo(e.target.value)}
                      onChange={(e) => {
                        setCertificateRegNo(e.target.value);
                        fetchData(e.target.value);
                      }}
                      sx={{
                        textAlign: "left",
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                      error={!!errors.certificateRegNo}
                      helperText={errors.certificateRegNo}
                    />
                  </Grid>

                  <Grid item lg={12} sm={12} xs={12}>
                    <Grid container spacing={1}>
                      <Grid item lg={4} sm={4} xs={12}>
                        <TextField
                          select
                          id="clg_specialization"
                          name="clg_specialization"
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
                          disabled
                        />
                      </Grid>

                      <Grid item lg={3} sm={3} xs={12}>
                        <TextField
                          required
                          label="View CV"
                          id="cv_file"
                          name="cv_file"
                          type="file"
                          size="small"
                          fullWidth
                          onChange={handleFileChange}
                          sx={{
                            '& input': {
                              fontSize: '14px',
                            },
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            accept: ".doc,.docx,.pdf,.csv"
                          }}
                          error={!!errors.cv}
                          helperText={errors.cv}
                        />
                        {error && (
                          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                          </Typography>
                        )}
                      </Grid>

                      <Grid item lg={1} sm={1} xs={12}>
                        {cvFile && (
                          <Button
                            variant="outlined"
                            sx={{ width: "9%", marginRight: "-10px" }}
                            onClick={(event) => downloadCV(cvFile, event)}
                          >
                            <DownloadIcon />
                          </Button>
                        )}
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
                    <Typography align="left" style={{ fontSize: "16px", fontWeight: 600 }}>SERVICE DETAILS</Typography>
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
                          <MenuItem key={option.srv_id} value={option.srv_id} sx={{ fontSize: "14px" }}>
                            {option.service_title}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
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
                          multiple: true,
                          value: selectedSubService,
                          renderValue: (selected) => selected.map(id => {
                            const service = subService.find(option => option.sub_srv_id === id);
                            return service ? service.recommomded_service : '';
                          }).join(', '),
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
                        error={!!errors.selectedJobType}
                        helperText={errors.selectedJobType}
                      >
                        {jobType.map((option) => (
                          <MenuItem key={option.jobType_id} value={option.jobType_id}
                            sx={{ fontSize: "14px", }}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
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
                        id="contact_number"
                        name="contact_number"
                        label="Contact No*"
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
                        id="email"
                        name="email"
                        label="Email*"
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
                        id="alternate_number"
                        name="alternate_number"
                        label="Alternate Contact*"
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
                        id="emergency_contact_number"
                        name="emergency_contact_number"
                        label="Emergency Contact*"
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
                        id="emergency_relation"
                        name="emergency_relation"
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
                        id="emergency_name"
                        name="emergency_name"
                        label="Emergency Name"
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
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

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
                    <Typography align="left" style={{ fontSize: "16px", fontWeight: 600 }}>Address</Typography>
                  </Grid>

                  <Grid container spacing={2} sx={{ marginTop: "1px" }} >
                    <Grid item xs={6}>
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

                    <Grid item xs={6}>
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

                    <Grid item xs={6}>
                      <TextField
                        required
                        label="Home Zone"
                        id="zone"
                        name="zone"
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
                        // value={selectedZone}
                        value={selectedZone || ""}
                        onChange={(e) => setSelectedZone(e.target.value)}
                      >
                        {zone
                          .filter(option => option.Name !== "All")
                          .map(option => (
                            <MenuItem key={option.prof_zone_id} value={option.prof_zone_id}>
                              {option.Name}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        label="Pincode"
                        id="outlined-size-small"
                        name='pincode'
                        placeholder='Pincode'
                        size="small"
                        fullWidth
                        value={pinCode}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,6}$/.test(value)) {
                            setPinCode(value);
                          }
                        }}
                        sx={{
                          '& input': {
                            fontSize: '14px',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      {/* <TextField
                        label="Google Address"
                        id="outlined-size-small"
                        name='google_home_location'
                        placeholder='Google Address*'
                        size="small"
                        fullWidth
                        sx={{
                          '& input': {
                            fontSize: '14px',
                          },
                        }}
                        value={gisAddress}
                        onChange={(e) => setGisAddress(e.target.value)}
                        error={!!errors.gisAddress}
                        helperText={errors.gisAddress}
                      /> */}
                      {isLoaded && (
                        <Autocomplete
                          onLoad={(autocomplete) => (addressRef.current = autocomplete)}
                          onPlaceChanged={handlePlaceChanged}
                        >
                          <TextField
                            required
                            label="GIS Address"
                            id="google_address"
                            name="google_address"
                            placeholder='Search Address..'
                            size="small"
                            fullWidth
                            value={gisAddress}
                            onChange={(e) => setGisAddress(e.target.value)}
                            ref={addressRef}
                            error={!!errors.gisAddress}
                            helperText={errors.gisAddress}
                            sx={{
                              '& input': {
                                fontSize: '14px',
                              },
                            }}
                          />
                        </Autocomplete>
                      )}
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        label="Manual Address"
                        id="outlined-size-small"
                        name='address'
                        placeholder='Manual Address*'
                        size="small"
                        fullWidth
                        sx={{
                          '& input': {
                            fontSize: '14px',
                          },
                        }}
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        error={!!errors.manualAddress}
                        helperText={errors.manualAddress}
                      />
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
              severity={snackbarSeverity}
              sx={{ width: '100%', ml: 64, mb: 20 }}
            >
              {snackbarMessage}
            </Alert>

          </Snackbar>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              marginTop: '20%'
            }}
          >
            <MuiAlert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
        </Grid>
      </Box >
      <Footer />
    </>

  )
}

export default AddProfessional
