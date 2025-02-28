import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { TextField, Checkbox, FormControlLabel } from '@mui/material';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { CardContent } from '@mui/material';
import Footer from '../../../Footer';
import HRNavbar from '../../HR/HRNavbar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate, useLocation } from "react-router-dom";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { FormGroup, FormLabel, FormHelperText } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

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

function AddProfPartner() {

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
  const [refId, setRefId] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('clg_id');
    const ref_id = localStorage.getItem('clgrefId');
    setClgId(id);
    setRefId(ref_id);
  }, []);

  useEffect(() => {
    const id = localStorage.getItem('companyID');
    setCompany(id);
  }, []);

  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const { professionalId } = location.state || {}
  console.log(professionalId, 'professional ID is fetching from Table');
  const showSubmit = location.state?.showSubmit;

  // PROFESSIONAL DETAILS
  const [selectedTitle, setSelectedTitle] = useState('')
  const [fstName, setFstName] = useState('');
  const [lstName, setLstName] = useState('');
  const [gender, setGender] = useState([]);
  const [selectedGender, setSelectedGender] = useState('')
  const [dob, setDOB] = useState('')
  const [doj, setDOJ] = useState('')

  //EDUCATIONAL DETAILS
  const [qualification, setQualification] = useState([]);
  const [selectedQualification, setSelectedQualification] = useState('');
  const [specialization, setSpecialization] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [certificateRegNo, setCertificateRegNo] = useState('');
  const [cv, setCv] = useState(null);

  //SERVICE DETAILS
  const [service, setService] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [subService, setSubService] = useState([]);
  const [selectedSubService, setSelectedSubService] = useState([]);
  console.log(selectedSubService, 'selected Sub Services.....');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [subServiceErrors, setSubServiceErrors] = useState({});

  //CONTACT DETAILS
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [altrContact, setAltrContact] = useState('');
  const [contactError, setContactError] = useState('');
  const [emeContact, setEmeContact] = useState('');
  const [selectedRelation, setSelectedRelation] = useState('');
  const [emeName, setEmeName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState('1');
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [zone, setZone] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  console.log(selectedZone, 'Selected Zones Name...');
  const [subServiceCosts, setSubServiceCosts] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  console.log(uploadedDocuments, 'uploadedDocuments');

  const handleFileUpload = (event, docId) => {
    const files = event.target.files;
    setUploadedDocuments(prevState => ({
      ...prevState,
      [docId]: files
    }));
  };

  const handleTextFieldChange = (event, subServiceId, cost) => {
    let { value } = event.target;

    const numericValue = value.replace(/[^0-9]/g, '');
    if (Number(numericValue) <= cost) {
      setSubServiceCosts((prevState) => ({
        ...prevState,
        [subServiceId]: numericValue,
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCv(file)
      console.log("Selected file:", file);
    }
  };

  const [altrContactError, setAltrContactError] = useState('');
  const [emeContactError, setEmeContactError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [relation, setRelation] = useState([]);

  // SCHEDULE INTERVIEW
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [cvUrl, setCvUrl] = useState(null);
  console.log(uploadedFiles, 'uploadedFiles');

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // DOB Validation
  const calculateMinDate = () => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 18);
    return minDate.toISOString().split('T')[0];
  };

  // DOJ Validation
  const calculateMinDateDOj = () => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 0);
    return minDate.toISOString().split('T')[0];
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const [errors, setErrors] = useState({
    //professional details
    selectedTitle: '',
    fstName: '',
    lstName: '',
    selectedGender: '',
    dob: '',
    doj: '',

    //education detils
    selectedQualification: '',
    certificateRegNo: '',
    selectedJobType: '',

    //service details
    selectedService: '',
    selectedSubService: '',

    // Contact Details
    contact: '',
    email: '',
    altrContact: '',
    emeContact: '',
    selectedState: '',
    selectedCity: '',
    selectedZone: '',
    manualAddress: '',
    // Documents
    documentErrors: {},
    gisAddress: '',
    lat: '',
    long: '',
  });

  const handleEmptyField = () => {
    const newErrors = {};
    const subServiceErrorsTemp = {};

    if (!lat) {
      newErrors.lat = 'Lattitude is required';
    }
    if (!long) {
      newErrors.long = 'Longitude is required';
    }

    if (!selectedTitle) {
      newErrors.selectedTitle = 'Required';
    }
    if (!fstName) {
      newErrors.fstName = 'Required';
    }
    if (!lstName) {
      newErrors.lstName = 'Required';
    }
    if (!selectedGender) {
      newErrors.selectedGender = 'Required';
    }
    if (!dob) {
      newErrors.dob = 'Required';
    }
    if (!doj) {
      newErrors.doj = 'Required';
    }

    if (!selectedService) {
      newErrors.selectedService = 'Required';
    }
    if (!selectedSubService) {
      newErrors.selectedSubService = 'Required';
    }

    if (!selectedQualification) {
      newErrors.selectedQualification = 'Required';
    }
    if (!certificateRegNo) {
      newErrors.certificateRegNo = 'Required';
    }
    if (!selectedJobType) {
      newErrors.selectedJobType = 'Required';
    }
    if (!gisAddress) {
      newErrors.gisAddress = 'Required';
    }
    if (!manualAddress) {
      newErrors.manualAddress = 'Required';
    }

    // Check required documents
    const requiredDocuments = ["Aadhaar Card", "PAN Card"];
    const documentErrors = {};

    requiredDocuments.forEach((docName) => {
      const doc = documentFiles.find((d) => d.Documents_name === docName);
      if (!uploadedDocuments[doc?.doc_li_id]) {
        documentErrors[docName] = `${docName} is required.`;
      }
    });

    if (Object.keys(documentErrors).length > 0) {
      newErrors.documentErrors = documentErrors;
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

    // Validate selected sub-services
    selectedSubService.forEach((subServiceId) => {
      const cost = subServiceCosts[subServiceId];
      const trimmedCost = cost !== undefined && cost !== null ? String(cost).trim() : '';
      if (!trimmedCost) {
        subServiceErrorsTemp[subServiceId] = 'Amount is required';
      }
    });

    if (Object.keys(subServiceErrorsTemp).length > 0) {
      setSubServiceErrors(subServiceErrorsTemp);
    } else {
      setSubServiceErrors({});
    }

    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error !== '') || Object.keys(subServiceErrorsTemp).length > 0;
  };

  // Validations //
  const handlePhoneNumberChange = async (e) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, '');
    setContact(numericValue);
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
      setEmeContactError('Please enter a valid contact')
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
      if (selectedService) {
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
    console.log(professionalId, 'iiiiiiiiiii');

    if (professionalId) {
      console.log('oooooooooooooooooooooooo');

      const fetchProfessionalData = async () => {
        try {
          const response = await fetch(`${port}/hr/update_professional_data_get/${professionalId}/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            console.error(`Error fetching professional data: ${response.status}`);
            return;
          }

          const data = await response.json();
          console.log('fetched the ProfessionalData...', data);
          setSelectedTitle(data[0].title)
          const fullName = data[0].prof_fullname;
          const nameParts = fullName.split(' ');
          const firstName = nameParts.slice(1, nameParts.length - 1).join(' ');
          const lastName = nameParts[nameParts.length - 1];
          setFstName(firstName);
          setLstName(lastName);
          setSelectedGender(data[0].gender)
          setDOJ(data[0].doj)
          setDOB(data[0].dob)
          setSelectedQualification(data[0].Education_level)
          setCertificateRegNo(data[0].certificate_registration_no)
          setSelectedJobType(data[0].Job_type)
          setSelectedSpecialization(data[0].clg_details.clg_specialization)
          setSelectedService(data[0].srv_id)
          console.log(data[0].srv_id, 'new');
          const costsMap = {};
          data[0]?.sub_services_details?.forEach(service => {
            costsMap[service.sub_srv_id] = service.prof_cost;
          });
          setSubServiceCosts(costsMap);
          setSelectedSubService(data[0]?.sub_services_details?.map(service => service.sub_srv_id) || []);
          setContact(data[0].phone_no)
          setEmail(data[0].email_id)
          setAltrContact(data[0].alt_phone_no)
          setEmeContact(data[0].eme_contact_no)
          setSelectedRelation(data[0].eme_contact_relation)
          setEmeName(data[0].eme_conact_person_name)
          setSelectedZone(data[0].prof_zone_id)
          setPinCode(data[0].pin_code_id)
          setGisAddress(data[0].google_home_location)
          setManualAddress(data[0].prof_address)
          const documentMap = {};
          data[0]?.doc_details?.forEach(doc => {
            documentMap[doc.doc_li_id] = {
              professional_document: doc.professional_document,
              prof_doc_id: doc.prof_doc_id,
            };
          });
          setUploadedDocuments(documentMap);

          const cvUrl = data[0].cv_file;
          setCvUrl(cvUrl);
          // if (response?.service_professional?.cv_file) {
          //   const cvUrl = response.service_professional.cv_file;
          //   return cvUrl.split('/').pop();
          // }
          // return null;
          setLat(data[0].lattitude)
          setLong(data[0].langitude)
        } catch (error) {
          console.error('Error fetching professional data:', error);
        }
      };

      fetchProfessionalData();
    }
  }, [professionalId]);

  const handleDownload = (filePath) => {
    // const fullPath = `${port}${filePath}`;
    const newTab = window.open(`${port}${filePath}`, '_blank');

    if (newTab) {
      newTab.focus();
    } else {
      window.location.href = `${port}${filePath}`;
      // setCvUrl(fullPath);
    }
  };

  async function handleAddProf(event) {
    event.preventDefault();
    const hasEmptyFields = handleEmptyField();

    if (selectedSubService.length === 0) {
      setOpenSnackbar(true);
      setSnackbarMessage('Please select at least one sub-service.');
      setSnackbarSeverity('error');
      return;
    }

    selectedSubService.forEach((subServiceId) => {
      const cost = subServiceCosts[subServiceId];
      const trimmedCost = cost !== undefined && cost !== null ? String(cost).trim() : '';
      if (!trimmedCost) {
        hasEmptyFields = true;
      }
    });

    if (hasEmptyFields) {
      setOpenSnackbar(true);
      setSnackbarMessage('Please fill all required details.');
      setSnackbarSeverity('error');
      return;
    }
    const formData = new FormData();
    formData.append('title', selectedTitle);
    formData.append('clg_first_name', fstName);
    formData.append('clg_last_name', lstName);
    formData.append('gender', selectedGender);
    formData.append('dob', dob);
    formData.append('doj', doj);
    formData.append('qualification', selectedQualification);
    formData.append('certificate_registration_no', certificateRegNo);
    formData.append('clg_specialization', selectedSpecialization);
    formData.append('Job_type', selectedJobType);

    if (cv) {
      formData.append('cv_file', cv);
    }
    // else if (cvUrl) {
    //   formData.append('cv_file', cvUrl);
    // }

    formData.append('srv_id', selectedService);
    const subServiceIds = selectedSubService.map(Number);
    const profCosts = selectedSubService.map(subServiceId => {
      return parseInt(subServiceCosts[subServiceId], 10) || 0;
    });

    if (!professionalId) {
      selectedSubService.forEach((subServiceId, index) => {
        const subServiceOption = subService.find(option => option.sub_srv_id === subServiceId);
        formData.append(`sub_services[${index}][sub_srv_id]`, subServiceId);
        const cost = subServiceCosts[subServiceId] || subServiceOption?.cost || 0;
        formData.append(`sub_services[${index}][prof_cost]`, cost);
      });
    } else {
      formData.append('sub_services', JSON.stringify(subServiceIds));
      formData.append('prof_cost', JSON.stringify(profCosts));
    }

    Object.keys(uploadedDocuments).forEach(docId => {
      const files = uploadedDocuments[docId];
      for (let i = 0; i < files.length; i++) {
        formData.append(`professional_document[${docId}]`, files[i]);
      }
    });

    formData.append('contact_number', contact);
    formData.append('email', email);
    formData.append('alternate_number', altrContact);
    formData.append('emergency_contact_number', emeContact);
    formData.append('emergency_relation', selectedRelation);
    formData.append('emergency_name', emeName);
    formData.append('state', selectedState);
    formData.append('city', selectedCity);
    formData.append('zone', selectedZone || null);
    formData.append('pincode', pinCode);
    formData.append('google_home_location', gisAddress);
    formData.append('address', manualAddress);
    formData.append('added_by', refId);
    formData.append('last_modified_by', refId);
    formData.append('prof_compny', company);
    formData.append('langitude', long);
    formData.append('lattitude', lat);

    console.log("POST API Hitting......", formData);

    try {
      let response;
      if (professionalId) {
        response = await fetch(`${port}/hr/update_professional_data_get/${professionalId}/`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(`${port}/hr/add_proffessional/`, {
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
        setOpenSnackbar(true);
        setSnackbarMessage('Professional data submitted successfully!');
        setSnackbarSeverity('success');
        setTimeout(() => {
          navigate('/hr partner/manage professionals');
        }, 2000);
      }
      else if (response.status === 200) {
        const result = await response.json();
        console.log("Successfully Updated Professional data", result);
        setOpenSnackbar(true);
        setSnackbarMessage('Professional data updated successfully!');
        setSnackbarSeverity('success');
        setTimeout(() => {
          navigate('/hr partner/manage professionals');
        }, 2000);
      }
      else if (response.status === 400) {
        setOpenSnackbar(true);
        setSnackbarMessage('Error While Submitting the Form');
        setSnackbarSeverity('error');
      }
      else if (response.status === 409) {
        const errorResult = await response.json();

        let formattedMessage = '';
        if (errorResult.service_professional_errors && errorResult.service_professional_errors.length > 0) {
          const errors = errorResult.service_professional_errors;
          if (errors.includes("Phone no already exists.") && errors.includes("Certificate registration number already exists.")) {
            formattedMessage = "Phone Number and Certification Number already exist.";
          } else if (errors.includes("Phone no already exists.")) {
            formattedMessage = "Phone Number already exists.";
          } else if (errors.includes("Certificate registration number already exists.")) {
            formattedMessage = "Certification number already exists.";
          } else {
            formattedMessage = errors.join(' ');
          }
        }

        let formattedMessage2 = '';
        if (errorResult.conflicts && errorResult.conflicts.length > 0) {
          formattedMessage2 = errorResult.conflicts.join(' ');
        } else {
          formattedMessage2 = '';
        }

        const finalMessage = [formattedMessage, formattedMessage2].filter(Boolean).join(' ');

        setOpenSnackbar(true);
        setSnackbarMessage(finalMessage);
        setSnackbarSeverity('error');

        // Automatically close snackbar after 2 seconds
        setTimeout(() => {
          setOpenSnackbar(false);
        }, 2000);
      }
      else if (response.status === 500) {
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

  //files GET API
  useEffect(() => {
    const fecthDocuments = async () => {
      try {
        const res = await fetch(`${port}/hr/proffessional_documents_get/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        console.log("State List....", data);
        setDocumentFiles(data);
      } catch (error) {
        console.error("Error fetching State data:", error);
      }
    };
    fecthDocuments();
  }, []);

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

  // const downloadCV = async () => {
  //   try {
  //     const response = await fetch(`${port}${cvUrl}`, {
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       console.error(`Error fetching CV file: ${response.status}`);
  //       return;
  //     }

  //     // Create a Blob from the PDF response
  //     const blob = await response.blob();

  //     // Create a link element
  //     const link = document.createElement('a');

  //     // Set the download attribute with a filename (optional)
  //     link.download = 'CV.pdf';

  //     // Create an object URL for the Blob and set it as the href of the link
  //     link.href = URL.createObjectURL(blob);

  //     // Append the link to the body, trigger a click event to start the download, then remove the link
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error('Error fetching CV file:', error);
  //   }
  // };

  const downloadCV = (cvUrl, event) => {
    event.preventDefault();
    const newTab = window.open(`${port}${cvUrl}`, '_blank');

    if (newTab) {
      newTab.focus();
    } else {
      window.location.href = `${port}${cvUrl}`;
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

                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      required
                      id="doj"
                      label="DOJ"
                      type="date"
                      value={doj}
                      onChange={(e) => setDOJ(e.target.value)}
                      size="small"
                      fullWidth
                      error={!!errors.doj}
                      helperText={errors.doj}
                      sx={{
                        textAlign: "left", '& input': {
                          fontSize: '14px',
                        },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    // inputProps={{
                    //   max: calculateMinDateDOj(),
                    // }}
                    />
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
                height: "100%",
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
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      select
                      id="qualification"
                      name="qualification"
                      label="Qualification*"
                      size="small"
                      fullWidth
                      value={selectedQualification}
                      onChange={handleDropdownQualifictn}
                      error={!!errors.selectedQualification}
                      helperText={errors.selectedQualification}
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

                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="certificate_registration_no"
                      name="certificate_registration_no"
                      label="Certificate Registration No*"
                      size="small"
                      fullWidth
                      value={certificateRegNo}
                      error={!!errors.certificateRegNo}
                      helperText={errors.certificateRegNo}
                      // onChange={(e) => setCertificateRegNo(e.target.value)}
                      onChange={(e) => {
                        setCertificateRegNo(e.target.value); // Update local state
                        fetchData(e.target.value); // Call API
                      }}
                      sx={{
                        textAlign: "left",
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item lg={4} md={4} xs={12}>
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

                  <Grid item lg={3} sm={3} xs={12}>
                    <TextField
                      select
                      id="Job_type"
                      name="Job_type"
                      label="Job Type*"
                      size="small"
                      fullWidth
                      value={selectedJobType}
                      onChange={handleDropdownJobType}
                      error={!!errors.selectedJobType}
                      helperText={errors.selectedJobType}
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

                  <Grid item lg={3} sm={3} xs={12}>
                    <TextField
                      id="cv"
                      name="cv"
                      type='file'
                      size="small"
                      fullWidth
                      inputProps={{
                        accept: ".pdf,.doc,.docx",
                      }}
                      onChange={handleFileChange}
                      error={!!errors.cv}
                      helperText={errors.cv}
                      sx={{
                        textAlign: "left",
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item lg={1} sm={1} xs={12}>
                    {cvUrl && (
                      <Button
                        variant="outlined"
                        sx={{ width: "9%", marginRight: "-10px" }}
                        onClick={(event) => downloadCV(cvUrl, event)}
                      >
                        <DownloadIcon />
                      </Button>
                    )}
                  </Grid>

                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} container spacing={1}>
            <Grid item lg={4} md={4} xs={12}>
              <Card
                sx={{
                  width: "100%",
                  borderRadius: "10px",
                  bgcolor: "white",
                  boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
                }}
              >
                <CardContent sx={{
                  maxHeight: "300px",
                  overflowY: "auto",
                }}>
                  <Typography align="left" sx={{ fontSize: "16px", fontWeight: 600, mb: 2 }}>
                    UPLOAD DOCUMENTS
                  </Typography>

                  {
                    documentFiles.map((item) => (
                      <>
                        <Grid container spacing={2} alignItems="center" key={item.doc_li_id}>
                          <Grid item xs={8}>
                            <Typography
                              component="label"
                              variant="body1"
                              sx={{
                                marginTop: '7px',
                                fontSize: '17px',
                                textAlign: 'left',
                                display: 'block',
                              }}
                            >
                              {item.Documents_name}
                            </Typography>
                          </Grid>

                          <Grid item xs={2}>
                            <Button
                              component="label"
                              variant="contained"
                              startIcon={<CloudUploadIcon />}
                              sx={{
                                bgcolor: '#e0e0e0',
                                color: 'black',
                                marginBottom: '11px',
                                marginLeft: '-15px',
                                '&:hover': {
                                  bgcolor: '#e0e0e0',
                                  color: 'black',
                                },
                              }}
                            >
                              <VisuallyHiddenInput
                                type="file"
                                onChange={(event) => handleFileUpload(event, item.doc_li_id)}
                                multiple
                              />
                            </Button>
                            {errors.documentErrors?.[item.Documents_name] && (
                              <Typography color="error" variant="body2">
                                {errors.documentErrors[item.Documents_name]}
                              </Typography>
                            )}
                          </Grid>

                          {/* Download Button */}
                          <Grid item xs={2}>
                            {professionalId ? (
                              (() => {
                                const matchingFile = uploadedDocuments[item.doc_li_id];

                                return matchingFile && matchingFile.professional_document ? (
                                  <Button
                                    variant="outlined"
                                    sx={{ width: "9%", marginTop: "-10px", marginRight: "-10px" }}
                                    onClick={() => handleDownload(matchingFile.professional_document)}
                                  >
                                    <DownloadIcon />
                                  </Button>
                                ) : null;
                              })()
                            ) : (
                              uploadedDocuments[item.doc_li_id]?.professional_document && (
                                <Button
                                  variant="outlined"
                                  sx={{ width: "9%", marginTop: "-10px", marginRight: "-10px" }}
                                  onClick={() => handleDownload(uploadedDocuments[item.doc_li_id].professional_document)}
                                >
                                  <DownloadIcon />
                                </Button>
                              )
                            )}
                          </Grid>
                        </Grid>
                      </>
                    ))
                  }

                </CardContent>
              </Card>
            </Grid>

            <Grid item lg={4} md={4} xs={12}>
              <Card
                sx={{
                  width: "100%",
                  borderRadius: "10px",
                  bgColor: "white",
                  boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
                  height: '100%',
                }}
              >
                <CardContent
                  sx={{
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}>
                  <Grid container>
                    <Typography align="left" style={{ fontSize: "16px", fontWeight: 600 }}>SERVICE DETAILS</Typography>
                  </Grid>
                  {console.log(selectedService)}
                  <Grid container spacing={2} sx={{ marginTop: "1px" }} >
                    <Grid item lg={12} sm={12} xs={12}>
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

                    <Grid container spacing={2}>
                      <Grid item lg={12} sm={12} xs={12}>
                        <FormGroup>
                          <FormLabel
                            required
                            sx={{
                              textAlign: 'left',
                              ml: 2,
                              mt: 2
                            }}
                          >
                            Sub Service List
                          </FormLabel>

                          {/* {subService.map(option => (
                            <Grid container key={option.sub_srv_id} spacing={0} alignItems="flex-start">
                              <Grid item lg={12} sm={12} xs={12}>
                                <MenuItem value={option.sub_srv_id}>
                                  <FormControlLabel
                                    sx={{
                                      textAlign: 'left',
                                      marginBottom: 0,
                                      '& .MuiFormControlLabel-label': {
                                        fontSize: '16px',
                                        marginLeft: '7px',
                                      },
                                    }}
                                    control={
                                      <Checkbox
                                        checked={selectedSubService.includes(Number(option.sub_srv_id))}
                                        onChange={handleCheckboxChange}
                                        name={option.sub_srv_id.toString()}
                                      />
                                    }
                                    label={option.recommomded_service + `[Rs.${option.cost}]`}
                                  />
                                </MenuItem>
                              </Grid>
                              <Grid item lg={12} sm={12} xs={12}>
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  sx={{
                                    fontSize: '10px',
                                    marginTop: '-8px',
                                    marginLeft: '-100px',
                                    width: 'calc(100% - 200px)',
                                  }}
                                  placeholder={`Enter Amount for ${option.recommomded_service}`}
                                  value={subServiceCosts[option.sub_srv_id] || ''}
                                  onChange={(e) => handleTextFieldChange(e, option.sub_srv_id, option.cost)}
                                  error={!!subServiceErrors[option.sub_srv_id]}
                                  helperText={subServiceErrors[option.sub_srv_id] || ''}
                                />
                              </Grid>
                            </Grid>
                          ))} */}

                          {subService.map(option => (
                            <Grid container key={option.sub_srv_id} spacing={0} alignItems="flex-start">
                              <Grid item lg={12} sm={12} xs={12}>
                                <MenuItem value={option.sub_srv_id}>
                                  <FormControlLabel
                                    sx={{
                                      textAlign: 'left',
                                      marginBottom: 0,
                                      '& .MuiFormControlLabel-label': {
                                        fontSize: '16px',
                                        marginLeft: '7px',
                                      },
                                    }}
                                    control={
                                      <Checkbox
                                        checked={selectedSubService.includes(Number(option.sub_srv_id))}
                                        onChange={handleCheckboxChange}
                                        name={option.sub_srv_id.toString()}
                                      />
                                    }
                                    label={option.recommomded_service + `[Rs.${option.cost}]`}
                                  />
                                </MenuItem>
                              </Grid>
                              <Grid item lg={12} sm={12} xs={12}>
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  sx={{
                                    fontSize: '10px',
                                    marginTop: '-8px',
                                    marginLeft: '-100px',
                                    width: 'calc(100% - 200px)',
                                  }}
                                  placeholder={`Enter Amount for ${option.recommomded_service}`}
                                  value={subServiceCosts[option.sub_srv_id] || ''}
                                  onChange={(e) => handleTextFieldChange(e, option.sub_srv_id, option.cost)}
                                  error={!!subServiceErrors[option.sub_srv_id]}
                                  helperText={subServiceErrors[option.sub_srv_id] || ''}
                                  disabled={!selectedSubService.includes(Number(option.sub_srv_id))}
                                />
                              </Grid>
                            </Grid>
                          ))}

                          {errors.selectedSubService && (
                            <FormHelperText error>{errors.selectedSubService}</FormHelperText>
                          )}

                          {errors.selectedSubService && (
                            <FormHelperText error>{errors.selectedSubService}</FormHelperText>
                          )}
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item lg={4} md={4} xs={12}>
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
                    <Typography align="left" style={{ fontSize: "16px", fontWeight: 600 }}>CONTACT DETAILS</Typography>
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
                        // onInput={handlePhoneNumberChange}
                        onChange={(e) => handlePhoneNumberChange(e)}
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
                        label="Alternate Number*"
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
                        label="Emergency Contact Name"
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
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                          >
                            {zone
                              .filter(option => option.Name !== "All")
                              .map(option => (
                                <MenuItem key={option.prof_zone_id} value={option.Name}>
                                  {option.Name}
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={3}>
                          <TextField
                            label="Pincode"
                            id="outlined-size-small"
                            name='pincode'
                            placeholder='Pincode'
                            size="small"
                            fullWidth
                            value={pinCode}
                            // onChange={(e) => setPinCode(e.target.value)}
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
                      </Grid>
                    </Grid>

                    <Grid item lg={6} sm={6} xs={12}>
                      {/* <TextField
                        id="alternate_number"
                        name="alternate_number"
                        label="Google Address*"
                        size="small"
                        fullWidth
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

                    <Grid item lg={6} sm={6} xs={12}>
                      <TextField
                        id="alternate_number"
                        name="alternate_number"
                        label="Manual Address*"
                        size="small"
                        fullWidth
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

        <Grid item lg={12} sm={12} xs={12} sx={{ marginTop: "20px" }}>
          <Button variant="contained"
            sx={{ mt: 1, mb: 2, width: '30ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", }}
            type="submit" onClick={handleAddProf}>
            Submit
          </Button>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              variant="filled"
              sx={{
                width: '100%',
                bgColor: snackbarSeverity === 'success' ? 'green' : 'red',
                mb: 20,
              }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Grid>

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
            zIndex: 9999,
            marginTop: '20%'
          }}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Box>
      <Footer />
    </>

  )
}

export default AddProfPartner
