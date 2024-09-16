import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonOutlineSharpIcon from '@mui/icons-material/PersonOutlineSharp';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// import CallerDetails from "./Addservice/CallerInfo";
// import ServiceInfo from './Addservice/ServiceInfo';
import smile from "../../assets/smile.png";
import { useNavigate } from "react-router-dom";
import Navbar from '../../Navbar';
import Footer from '../../Footer';
import ViewService from "./Viewservice";
import Header from '../../Header';
import TimePicker from 'react-time-picker';
import Modal from '@mui/material/Modal';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,

}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    pt: 2,
    px: 4,
    pb: 3,
};

const discount = [
    {
        discount_id: 1,
        label: '%',
    },
    {
        discount_id: 2,
        label: '₹',
    },
    {
        discount_id: 3,
        label: 'Complementary',
    },
    {
        discount_id: 4,
        label: 'VIP',
    },
];

const Addservice = () => {
    const navigate = useNavigate();
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const location = useLocation();
    const eventValue = location.state?.eventValue;
    console.log("Event Value...", eventValue);

    // Get Enquiry data from Enquiry Screen
    const [enqToServiceClr, setEnqToServiceClr] = useState('');
    const [enqToServicePtn, setEnqToServicePtn] = useState('');
    const [enqToServiceSrv, setEnqToServiceSrv] = useState('');
    const [enqToServicePay, setEnqToServicePay] = useState('');

    // const [enqToServiceSrvData, setEnqToServiceSrvData] = useState({ ...enqToServiceSrv });

    const [patientEnqData, setPatientEnqData] = useState({ ...enqToServicePtn });

    const [clrName, setClrName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [call, setCall] = useState([]);
    const [selectedCall, setSelectedCall] = useState('');
    const [relation, setRelation] = useState([]);
    const [selectedRelation, setSelectedRelation] = useState('');

    const [ptnName, setPtnName] = useState('');
    const [gender, setGender] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [age, setAge] = useState(null);
    const [referHospital, setReferHospital] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState('');
    const [suffered, setSuffered] = useState('');
    const [ptnNumber, setPtnNumber] = useState('');
    const [ptnNumberError, setPtnNumberError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [consultant, setConsultant] = useState([]);
    const [selectedConsultant, setSelectedConsultant] = useState('');
    const [consultantMobile, setConsultantMobile] = useState('');
    const [state, setState] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [city, setCity] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [zone, setZone] = useState([]);
    const [selectedZone, setSelectedZone] = useState('');

    const [pincode, setPincode] = useState(null);
    const [pincodeError, setPincodeError] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    const [service, setService] = useState([]);
    const [selectedService, setSelectedService] = useState(enqToServiceSrv ? enqToServiceSrv.srv_id : '');
    const [subService, setSubService] = useState([]);
    // const [selectedSubService, setSelectedSubService] = useState('');
    const [selectedSubService, setSelectedSubService] = useState(enqToServiceSrv.sub_srv_id ? enqToServiceSrv.sub_srv_id.sub_srv_id : '');
    const [startDate, setStartDate] = useState(enqToServiceSrv ? enqToServiceSrv.start_date : '');
    // const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('');
    const [endDateError, setEndDateError] = useState('');
    const [convertedStartDate, setConvertedStartDate] = useState('');
    const [convertedEndDate, setConvertedEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [convenience, setConvenience] = useState(0);
    const [dayConvinance, setDayConvenience] = useState(0);
    const [profGender, setProfGender] = useState([]);
    const [selectedProfGender, setSelectedProfGender] = useState(null);
    const [remark, setRemark] = useState('');
    const [openAmount, setOpenAmount] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    // will remove these useState in future
    const [dob, setDOB] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [changeAge, setChangeAge] = useState('');
    const [stateName, setStateName] = useState('');

    // const [getCost, setGetCost] = useState('');
    const [getCost, setGetCost] = useState(enqToServicePay ? enqToServicePay.Total_cost : '');
    const [calculatedAmount, setCalculatedAmount] = useState('');

    const [selectedDiscountId, setSelectedDiscountId] = useState(5);
    const [discountValue, setDiscountValue] = useState(selectedDiscountId === 3 || selectedDiscountId === 4 ? 0 : null);
    const [totalDiscount, setTotalDiscount] = useState('');
    // const [totalDiscount, setTotalDiscount] = useState(0);
    // const [totalDiscount, setTotalDiscount] = useState(null);

    const [coupon, setCoupon] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState('');

    const [callerDetails, setCallerDetails] = useState(null);
    const [patientDetails, setPatientDetails] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');

    const [showAddPatient, setShowAddPatient] = useState(false);

    // Getting previous Patient details
    const [selectedPatientID, setSelectedPatientID] = useState('');
    const [prePatient, setPrePatient] = useState([]);
    const [preStartDate, setPreStartDate] = useState('');
    const [preEndDate, setPreEndDate] = useState('');
    const [prePayment, setPrePayment] = useState('');

    const [editedPrePatient, setEditedPrePatient] = useState({ ...prePatient });
    const [editedPreCaller, setEditedPreCaller] = useState(null);

    const [feedback, setFeedback] = useState(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [openConsult, setOpenConsult] = useState(false);
    const [consultName, setConsultName] = useState('');
    const [consultNo, setConsultNo] = useState('');
    const [consultNoError, setConsultNoError] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleOpenAmount = () => setOpenAmount(true);
    const handleCloseAmount = () => setOpenAmount(false);

    const handleOpenConsult = () => setOpenConsult(true);
    const handleCloseConsult = () => setOpenConsult(false);

    const handleFieldEdit = (field, value) => {
        setEditedPrePatient({ ...editedPrePatient, [field]: value });
        if (callerDetails) {
            setCallerDetails({ ...callerDetails, [field]: value });
        }

        if (editedPreCaller) {
            setEditedPreCaller({ ...editedPreCaller, [field]: value });
        }
    };

    useEffect(() => {
        setEditedPreCaller({ ...callerDetails });
    }, [callerDetails]);

    const handleFieldChange = (field, value) => {
        if (enqToServicePtn) {
            setEnqToServicePtn({ ...enqToServicePtn, [field]: value });
        } else if (patientEnqData) {
            setPatientEnqData({ ...patientEnqData, [field]: value });
        }
        // else if (enqToServiceSrv) {
        //     setEnqToServiceSrv({ ...enqToServiceSrv, [field]: value });
        // }
        if (!enqToServiceSrv) {
            setEnqToServiceSrv({});
        }
        setEnqToServiceSrv((prevData) => ({ ...prevData, [field]: value }));
        if (!enqToServicePay) {
            setEnqToServicePay({});
        }

    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    // Usestate for handling empty data
    const [errors, setErrors] = useState({
        clrName: '',
        phoneNumber: '',
        selectedCall: '',
        ptnName: '',
        selectedGender: '',
        age: '',
        selectedHospital: '',
        suffered: '',
        ptnNumber: '',
        email: '',
        selectedConsultant: '',
        consultantMobile: '',
        selectedState: '',
        selectedCity: '',
        selectedZone: '',
        // pincode: '',
        address: '',
        lat: '',
        long: '',
        selectedService: '',
        selectedSubService: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
    });

    const [consultErrors, setConsultErrors] = useState({
        consultName: '',
        consultNo: '',
    });

    // Function to handle empty fields
    const handleEmptyField = () => {
        const newErrors = {};

        if (!clrName) {
            newErrors.clrName = 'Name is required';
        }
        if (!phoneNumber) {
            newErrors.phoneNumber = 'Mobile No is required';
        }
        if (!selectedCall) {
            newErrors.selectedCall = 'Call Purpose is required';
        }
        if (!ptnName) {
            newErrors.ptnName = 'Name is required';
        }
        if (!selectedGender) {
            newErrors.gender = 'Gender is required';
        }
        if (!age) {
            newErrors.age = 'Age is required';
        }
        if (!selectedHospital) {
            newErrors.hospital = 'Hospital Name is required';
        }
        if (!suffered) {
            newErrors.suffered = 'Suffered From is required';
        }
        if (!ptnNumber) {
            newErrors.ptnNumber = 'No is required';
        }
        if (!email) {
            newErrors.email = 'Email is required';
        }
        if (!selectedConsultant) {
            newErrors.selectedConsultant = 'This field is required';
        }
        if (!consultantMobile) {
            newErrors.consultantMobile = 'This field is required';
        }
        if (!selectedState) {
            newErrors.selectedState = 'State is required';
        }
        if (!selectedCity) {
            newErrors.selectedCity = 'City is required';
        }
        if (!selectedZone) {
            newErrors.selectedZone = 'Zone is required';
        }
        if (!address) {
            newErrors.address = 'Address is required';
        }
        if (!lat) {
            newErrors.lat = 'Lattitude is required';
        }
        if (!long) {
            newErrors.long = 'Longitude is required';
        }
        if (!selectedService) {
            newErrors.selectedService = 'Service is required';
        }
        if (!selectedSubService) {
            newErrors.selectedSubService = 'Sub Service is required';
        }
        if (!startDate) {
            newErrors.startDate = 'This field is required';
        }
        if (!endDate) {
            newErrors.endDate = 'This field is required';
        }
        if (!startTime) {
            newErrors.startTime = 'This field is required';
        }
        if (!endTime) {
            newErrors.endTime = 'This field is required';
        }
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    const handleConsultEmptyField = () => {
        const newErrors = {};

        if (!consultName) {
            newErrors.consultName = 'Name is required';
        }
        if (!consultNo) {
            newErrors.consultNo = 'Mobile No is required';
        }
        setConsultErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    // Validations //
    const handlePhoneNumberChange = (e) => {
        const input = e.target.value;
        const numericValue = input.replace(/[^0-9]/g, '');
        setPhoneNumber(numericValue);

        if (!numericValue) {
            setPhoneNumberError('Mobile No is required');
            setErrors({ ...errors, phoneNumber: 'Mobile No is required' });
        } else if (!/^[6789]\d{9}$/.test(numericValue)) {
            setPhoneNumberError('Please enter a valid mobile no');
            setErrors({ ...errors, phoneNumber: 'Please enter a valid mobile no' });
        } else if (parseInt(numericValue) < 0) {
            setPhoneNumberError('Contact No should be a positive number');
            setErrors({ ...errors, phoneNumber: 'Mobile No should be a positive number' });
        } else {
            setPhoneNumberError('');
            setErrors({ ...errors, phoneNumber: '' });
        }
    };

    const validateFullName = (name) => {
        const nameRegex = /^[A-Za-z]+( [A-Za-z]+){0,2}$/;
        if (!name) {
            return "Name is required";
        } else if (!nameRegex.test(name)) {
            return "Name accept only characters, Up to 3 spaces";
        }
        return null;
    };

    //Patient Phone Validation//
    const handlePtnNumberChange = (e) => {
        const input = e.target.value;
        const numericValue = input.replace(/[^0-9]/g, '');
        setPtnNumber(numericValue);

        if (!numericValue) {
            setPtnNumberError('Mobile No is required');
            setErrors({ ...errors, ptnNumber: 'Mobile No is required' });
        } else if (!/^[6789]\d{9}$/.test(numericValue)) {
            setPtnNumberError('Enter a valid mobile');
            setErrors({ ...errors, ptnNumber: 'Enter a valid mobile' });
        } else if (parseInt(numericValue) < 0) {
            setPtnNumberError('Moblile No should be a positive number');
            setErrors({ ...errors, ptnNumber: 'Mobile No should be a positive number' });
        } else {
            setPtnNumberError('');
            setErrors({ ...errors, ptnNumber: '' });
        }
    };

    const handleConsultNumberChange = (e) => {
        const input = e.target.value;
        const numericValue = input.replace(/[^0-9]/g, '');
        setConsultNo(numericValue);

        if (!numericValue) {
            setConsultNoError('Mobile No is required');
            setConsultErrors({ ...errors, consultNo: 'Mobile No is required' });
        } else if (!/^[6789]\d{9}$/.test(numericValue)) {
            setConsultNoError('Enter a valid mobile');
            setConsultErrors({ ...errors, consultNo: 'Enter a valid mobile' });
        } else if (parseInt(numericValue) < 0) {
            setConsultNoError('Moblile No should be a positive number');
            setConsultErrors({ ...errors, consultNo: 'Mobile No should be a positive number' });
        } else {
            setConsultNoError('');
            setConsultErrors({ ...errors, consultNo: '' });
        }
    };

    //Patient Email validation//
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

    //Age Validation 
    const handleAgeValidation = (event) => {
        const inputAge = event.target.value;
        const numericValue = inputAge.replace(/\D/g, '');
        setAge(numericValue);

        if (inputAge !== numericValue) {
            setValidationMessage('Age must contain only numbers.');
        } else {
            const parsedAge = parseInt(numericValue, 10);
            if (isNaN(parsedAge)) {
                setValidationMessage('Age must be a no.');
            } else if (parsedAge < 0) {
                setValidationMessage('Age cannot be negative.');
            } else if (parsedAge > 100) {
                setValidationMessage('Age cannot exceed 100.');
            } else {
                setValidationMessage('');
            }
        }
    };

    const validateLat = (value) => {
        const latValue = parseFloat(value);
        if (isNaN(latValue) || latValue < -90 || latValue > 90) {
            return 'Invalid latitude';
        }
        // return '';
        const decimalPart = (value.split('.')[1] || '').length;
        if (decimalPart < 6) {
            return 'Latitude should have at least 6 digits after the decimal point';
        }

        return '';
    };

    const validateLong = (value) => {
        const longValue = parseFloat(value);
        if (isNaN(longValue) || longValue < -180 || longValue > 180) {
            return 'Invalid longitude';
        }
        return '';
    };

    const handleDiscountChange = (e) => {
        const value = e.target.value;

        // Regular expression to match only integer values
        const integerPattern = /^\d*$/;

        if (value === '' || integerPattern.test(value)) {
            setDiscountValue(value);
        }
    };

    const isDiscountValueValid = () => {
        return (
            (selectedDiscountId === 1 || selectedDiscountId === 2) &&
            (typeof discountValue === 'string' && discountValue.trim() !== '')
        );
    };

    useEffect(() => {
        if (startDate && endDate) {
            const originalStartDate = new Date(startDate);
            const originalEndDate = new Date(endDate);

            const convertedStartDateTime = formatDate(originalStartDate);
            const convertedEndDateTime = formatDate(originalEndDate);

            setConvertedStartDate(convertedStartDateTime);
            setConvertedEndDate(convertedEndDateTime);
        }
    }, [startDate, endDate]);

    function formatDate(date) {
        // return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())} ${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(date.getSeconds())}`;
        return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
    }

    function padNumber(number) {
        return number.toString().padStart(2, '0');
    }

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
            // else if (endDateObj.toISOString() === startDateObj.toISOString()) {
            //     setEndDateError("End date time cannot be the same as the start date time");
            // } 
            else {
                setEndDateError('');
            }
        } else {
            setEndDateError('');
        }
    };

    // Function to format the current date and time as a string
    const getCurrentDateTimeString = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        // const hours = String(currentDate.getHours()).padStart(2, '0');
        // const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        // return `${year}-${month}-${day}T${hours}:${minutes}`;
        return `${year}-${month}-${day}`;
    };

    const handlePincodeChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,6}$/.test(value) || value === '') {
            setPincode(value);
            setPincodeError(''); // Clear any previous error message
        } else {
            setPincodeError('Pincode must be a 6-digit number');
        }
    };

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

    const handleDropdownProfGender = (event) => {
        const selectedProfGender = event.target.value;
        setSelectedProfGender(selectedProfGender);
    };

    const handleDropdownConsultant = (event) => {
        const selectedValue = event.target.value;
        setSelectedConsultant(selectedValue);

        // Find the selected consultant's mobile number and set it as the selected contact
        const selectedConsultantData = consultant.find(consult => consult.doct_cons_id === selectedValue);
        if (selectedConsultantData) {
            setConsultantMobile(selectedConsultantData.mobile_no);
        } else {
            setConsultantMobile('');
        }
    };

    useEffect(() => {
        setSelectedService(enqToServiceSrv ? enqToServiceSrv.srv_id : '');
        setSelectedSubService(enqToServiceSrv.sub_srv_id ? enqToServiceSrv.sub_srv_id.sub_srv_id : '');
        setStartDate(enqToServiceSrv ? enqToServiceSrv.start_date : '');
        setEndDate(enqToServiceSrv ? enqToServiceSrv.end_date : '');
        setGetCost(enqToServicePay ? enqToServicePay.Total_cost : '')
        // setTotalDiscount(enqToServicePay ? enqToServicePay.final_amount : totalDiscount)
        // setCalculatedAmount(enqToServicePay ? enqToServicePay.Total_cost : calculatedAmount)
    }, [enqToServiceSrv]);

    useEffect(() => {
        if (selectedConsultant === 0) {
            handleOpenConsult();
        }
    }, [selectedConsultant]);

    const handleDropdownRelation = (event) => {
        const selectedRelation = event.target.value;
        setSelectedRelation(selectedRelation);
    };

    const handleDropdownCall = (event) => {
        const selectedCall = event.target.value;
        setSelectedCall(selectedCall);
    };

    const handleDropdownService = (event) => {
        const selectedService = event.target.value;
        console.log("Selected Service...", selectedService)
        setSelectedService(selectedService);
    };

    const handleDropdownSubService = (event) => {
        const selectedSubService = event.target.value;
        setSelectedSubService(selectedSubService);
    };

    const handleDropdownGetCost = (event) => {
        const getCost = event.target.value;
        setGetCost(getCost);
    };

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
                console.log("Gender", data);
                const filteredGender = data.filter(item => item.gender_id === 1 || item.gender_id === 2);
                setGender(filteredGender);
                setProfGender(data)
            } catch (error) {
                console.error("Error fetching gender data:", error);
            }
        };
        getGender();
    }, []);

    useEffect(() => {
        if (profGender.length > 0 && !selectedProfGender) {
            setSelectedProfGender(profGender[2].gender_id);
        }
    }, [profGender, selectedProfGender]);

    useEffect(() => {
        const getRelation = async () => {
            try {
                // const res = await fetch(`${port}/web/agg_hhc_caller_relation_api`);
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
        const callPurpose = async () => {
            try {
                // const res = await fetch(`${port}/web/agg_hhc_purpose_call_api`);
                const res = await fetch(`${port}/web/agg_hhc_purpose_call_api`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Call Purpose", data);
                setCall(data);
            } catch (error) {
                console.error("Error fetching Call purpose data:", error);
            }
        };
        callPurpose();
    }, []);

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
        const getreferHospital = async () => {
            try {
                const res = await fetch(`${port}/web/agg_hhc_hospitals_api`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Refer Hospital data", data);
                setReferHospital(data);
            } catch (error) {
                console.error("Error fetching Refer Hospital data:", error);
            }
        };
        getreferHospital();
    }, []);

    const getConsultant = async () => {
        try {
            const res = await fetch(`${port}/web/agg_hhc_consultant_HD_api/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            console.log("Consultant data", data);
            setConsultant(data);
        } catch (error) {
            console.error("Error fetching Consultant data:", error);
        }
    };

    useEffect(() => {
        getConsultant();
    }, []);

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

    const handleSubServiceSelect = (event) => {
        const subServiceId = event.target.value;
        const selectedSubService = subService.find(item => item.sub_srv_id === subServiceId);
        if (selectedSubService) {
            setSelectedSubService(subServiceId);
            setGetCost(selectedSubService.cost);
        }
    };

    const subServiceData = subService[selectedService] || [];

    useEffect(() => {
        const calculateTotalAmount = async () => {
            // console.log("Cost, Dates lat long1234.....", getCost, startDate, endDate, lat, long);
            if (getCost && startDate && endDate) {
                // if (selectedSubService && startDate && endDate && lat && long) {
                console.log("Cost, Dates lat long.....", getCost, startDate, endDate);
                try {
                    // const url = `${port}/web/calculate_total_amount/${getCost}/${startDate}/${endDate}/?latitude=${lat}&longitude=${long}`;
                    const url = `${port}/web/calculate_total_amount/${getCost}/${startDate}/${endDate}/`;
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Calculated Service Cost datewise.....", data.days_difference);
                    const total = data.days_difference + data.total_convinance;
                    setCalculatedAmount(data.days_difference);
                    setConvenience(data.total_convinance);
                    setDayConvenience(data.day_convinance);
                    // setTotalAmount(total);

                    setEnqToServicePay(prevState => ({
                        ...prevState,
                        final_amount: data.days_difference,
                    }));
                } catch (error) {
                    console.error("Error fetching Calculated Amount:", error);
                }
            }
        };
        calculateTotalAmount();
    }, [getCost, startDate, endDate]);

    useEffect(() => {
        const calculateDiscount = async () => {
            // if (calculatedAmount && selectedDiscountId && discountValue && convenience !== null) {
            if (calculatedAmount && selectedDiscountId && discountValue !== null) {
                console.log("Discount Amount.....", selectedDiscountId, discountValue, calculatedAmount);
                try {
                    let url;
                    if (selectedDiscountId === 3) {
                        url = `${port}/web/calculate_discount_api/${selectedDiscountId}/0/${calculatedAmount}`;
                    } else if (selectedDiscountId === 4) {
                        url = `${port}/web/calculate_discount_api/${selectedDiscountId}/0/${calculatedAmount}`;
                    } else if (selectedDiscountId === 1 || selectedDiscountId === 2) {
                        url = `${port}/web/calculate_discount_api/${selectedDiscountId}/${discountValue}/${calculatedAmount}`;
                    }
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    setTotalDiscount(data.final_amount);
                    setEnqToServicePay(prevState => ({
                        ...prevState,
                        final_amount: data.final_amount,
                    }));
                    console.log("Calculated Amount with Discount.....", data.final_amount);
                } catch (error) {
                    console.error("Error fetching Calculated Amount with Discount:", error);
                }
            } else {
                setTotalDiscount(calculatedAmount);
            }
        };
        calculateDiscount();
    }, [calculatedAmount, selectedDiscountId, discountValue]);

    // useEffect(() => {
    //     const getCoupon = async () => {
    //         try {
    //             const res = await fetch(`${port}/web/coupon_code_api`);
    //             const data = await res.json();
    //             console.log("Coupon data", data);
    //             setCoupon(data);
    //         } catch (error) {
    //             console.error("Error fetching Coupon data:", error);
    //         }
    //     };
    //     getCoupon();
    // }, []);

    // Function to handle coupon selection
    const handleCouponSelect = (couponId) => {
        const selectedCoupon = coupon.find((item) => item.coupon_id === couponId.target.value);
        if (selectedCoupon) {
            setSelectedCoupon(selectedCoupon.coupon_code);
        }
    };

    useEffect(() => {
        const calculateCouponDiscount = async () => {
            if (calculatedAmount && selectedCoupon) {
                console.log("Discount with coupon Amount", calculatedAmount, selectedCoupon)
                try {
                    const url = `${port}/web/coupon_code_post_api/${selectedCoupon}/${calculatedAmount}`;
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Calculated Amount with Coupon Code.....", data);
                    setTotalDiscount(data.final_amount);
                } catch (error) {
                    console.error("Error fetching Calculated Amount with Coupon Code:", error);
                }
            }
        };
        calculateCouponDiscount();
    }, [selectedCoupon, calculatedAmount]);

    // fetch caller details
    const fetchCallerData = () => {
        fetch(`${port}/web/agg_hhc_patient_from_callers_phone_no/${phoneNumber}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
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
        // if (event.key === 'Enter') {
        //     fetchCallerData();
        // }
        if (event.key === 'Enter' && phoneNumber.length === 10) {
            fetchCallerData();
        }
    };

    // useEffect to fetch Caller Details
    useEffect(() => {
        // if (phoneNumber) {
        //     fetchCallerData(phoneNumber);
        // }
        if (phoneNumber && phoneNumber.length === 10) {
            fetchCallerData(phoneNumber);
        }
    }, [phoneNumber]);

    // Function to handle patient selection from dropdown
    const handlePatientSelect = (e) => {
        const selectedPatientId = parseInt(e.target.value);
        const patient = patientDetails.find((patient) => patient.agg_sp_pt_id === selectedPatientId);
        setSelectedPatient(patient);
        setSelectedPatientID(patient.agg_sp_pt_id);
        console.log('Selected Patient....:', patient);
    };

    useEffect(() => {
        const getPatientPreDetails = async () => {
            if (selectedPatientID) {
                console.log("Selected Patient ID", selectedPatientID);
                try {
                    const url = `${port}/web/last_patient_service_info/${selectedPatientID}`;
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Patient Previous Details.....", data);
                    setPrePatient(data);
                    setPreStartDate(data.Date.start_date)
                    setPreEndDate(data.Date.end_date)
                    console.log("Start Date:", data.Date.start_date, "End Date:", data.Date.end_date)
                } catch (error) {
                    console.error("Error fetching Patient Previous Details:", error);
                }
            }
        };
        getPatientPreDetails();
    }, [selectedPatientID]);

    useEffect(() => {
        const getPaymentStatus = async () => {
            if (selectedPatientID) {
                console.log("Selected Patient ID", selectedPatientID);
                try {
                    const url = `${port}/web/previous_patient_pending_amount/${selectedPatientID}`;
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Previous Payment Details.....", data);
                    setPrePayment(data);
                } catch (error) {
                    console.error("Error fetching Previous Payment Details:", error);
                }
            }
        };
        getPaymentStatus();
    }, [selectedPatientID]);

    useEffect(() => {
        const getFeedback = async () => {
            if (selectedPatientID) {
                console.log("Selected Patient ID", selectedPatientID);
                try {
                    const url = `${port}/web/patient_last_feedback/${selectedPatientID}`;
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Feedback Details.....", data);
                    setFeedback(data);
                } catch (error) {
                    console.error("Error fetching Feedback Details:", error);
                }
            }
        };
        getFeedback();
    }, [selectedPatientID]);

    const maxRating = 5;
    const generateRatingIcons = (rating) => {
        const filledIcons = Math.floor(rating);
        const remainder = rating % 1;
        const filled = Array.from({ length: filledIcons }, (_, index) => <FavoriteIcon key={index} />);
        if (remainder > 0) {
            filled.push(
                <span key="half-filled" style={{ position: 'relative', display: 'inline-block' }}>
                    <FavoriteIcon style={{ position: 'absolute', clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
                    <FavoriteBorderIcon style={{ position: 'relative' }} />
                </span>
            );
        }
        const empty = Array.from({ length: maxRating - filledIcons - (remainder > 0 ? 1 : 0) }, (_, index) => <FavoriteBorderIcon key={index} />);
        return filled.concat(empty);
    };

    useEffect(() => {
        const enquiryToService = async () => {
            if (eventValue) {
                console.log("Event Value", eventValue)
                try {
                    const url = `${port}/web/agg_hhc_add_service_details_api/${eventValue}`;
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Enquiry Convert to Service Data.....", data);
                    setEnqToServiceClr(data.caller_id);
                    setEnqToServicePtn(data.agg_sp_pt_id);
                    setEnqToServiceSrv(data.POC);
                    setEnqToServicePay(data.eve_id);
                } catch (error) {
                    console.error("Error fetching Enquiry Convert to Service Data:", error);
                }
            }
        };
        enquiryToService();
    }, [eventValue]);

    const formatDateRange = (preStartDate, preEndDate) => {
        const startDate = new Date(preStartDate);
        const endDate = new Date(preEndDate);

        const startOptions = { day: "numeric", month: "short" };
        const endOptions = { day: "numeric", month: "short", year: "numeric" };

        const startFormatted = startDate.toLocaleDateString("en-US", startOptions);
        const endFormatted = endDate.toLocaleDateString("en-US", endOptions);

        return `${startFormatted} - ${endFormatted}`;
    };

    const startDateTimeString = preStartDate;
    const endDateTimeString = preEndDate;
    const formattedDateRange = formatDateRange(startDateTimeString, endDateTimeString);

    async function handleConsultSubmit(event) {
        event.preventDefault();
        handleConsultEmptyField()
        const requestData = {
            cons_fullname: consultName,
            mobile_no: consultNo
        };
        console.log("POST API Hitting......", requestData)
        try {
            let apiUrl = `${port}/web/add_consultant/`;
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Results.....", result);
            setOpenSnackbar(true);
            setSnackbarMessage('Consultant details saved successfully.');
            getConsultant();
            handleCloseConsult();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    async function handleSubmit(event, actionType) {
        event.preventDefault();
        // const hasEmptyFields = handleEmptyField();

        let hasEmptyFields = true;
        const hasSelectedObject = enqToServiceClr || callerDetails || enqToServicePtn || enqToServicePay || selectedPatient || enqToServiceSrv;
        if (hasSelectedObject) {
            hasEmptyFields = false;
        } else {
            hasEmptyFields = handleEmptyField();
        }
        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill all required details.');
            setSnackbarSeverity('error');
            return;
        }

        let successMessage = '';

        if (actionType === 'CreateService') {
            successMessage = 'Your form received successfully.';
        } else if (actionType === 'Enquiry') {
            successMessage = 'Your Enquiry has been saved successfully.';
        }

        // const totalCostValue =
        //     selectedDiscountId === 4 ? parseFloat(totalAmount).toFixed(2) : (discountValue === '' || discountValue === null) ? totalAmount : totalDiscount !== null && totalDiscount !== undefined ? totalDiscount : calculatedAmount
        const requestData = {
            srv_id: selectedService,
            sub_srv_id: selectedSubService,
            start_date: convertedStartDate,
            end_date: convertedEndDate,
            start_time: startTime,
            end_time: endTime,
            prof_prefered: selectedProfGender,
            remark: remark,
            Total_cost: calculatedAmount,
            // Total_cost: totalCostValue,
            discount_type: selectedDiscountId,
            discount_value: discountValue,
            final_amount: totalDiscount,
            final_amount: selectedDiscountId === 3 ? 0 : totalDiscount || calculatedAmount,
            // final_amount: totalCostValue

            // getCost,
            // selectedDiscountId,
            // coupon,
            // selectedCoupon,
        };

        if (enqToServiceClr) {
            requestData.phone = enqToServiceClr.phone;
            requestData.caller_fullname = enqToServiceClr.caller_fullname;
            requestData.purp_call_id = 1;
            requestData.caller_rel_id = selectedRelation;
        } else if (callerDetails) {
            requestData.phone = callerDetails.phone;
            requestData.caller_fullname = callerDetails.caller_fullname;
            requestData.purp_call_id = selectedCall;
            requestData.caller_rel_id = selectedRelation;
        } else {
            requestData.phone = phoneNumber;
            requestData.caller_fullname = clrName;
            requestData.purp_call_id = selectedCall;
            requestData.caller_rel_id = selectedRelation;
        }

        if (enqToServicePtn && enqToServicePay) {
            requestData.agg_sp_pt_id = enqToServicePtn.agg_sp_pt_id;
            requestData.name = enqToServicePtn.name;
            requestData.gender_id = enqToServicePtn.gender_id.gender_id;
            requestData.Age = enqToServicePtn.Age;
            requestData.preferred_hosp_id = enqToServicePtn.preferred_hosp_id ? enqToServicePtn.preferred_hosp_id.hosp_id : selectedHospital;
            requestData.Suffered_from = enqToServicePtn.Suffered_from;
            requestData.phone_no = enqToServicePtn.phone_no;
            requestData.patient_email_id = enqToServicePtn.patient_email_id ? enqToServicePtn.patient_email_id : email;
            requestData.doct_cons_id = enqToServicePtn.doct_cons_id ? enqToServicePtn.doct_cons_id.doct_cons_id : selectedConsultant;
            requestData.doct_cons_phone = enqToServicePtn.doct_cons_id ? enqToServicePtn.doct_cons_id.mobile_no : consultantMobile;
            // requestData.state_id = enqToServicePtn.state_id.state_id;
            requestData.state_id = selectedState;
            requestData.city_id = enqToServicePtn.city_id ? enqToServicePtn.city_id.city_id : selectedCity;
            requestData.prof_zone_id = enqToServicePtn.prof_zone_id ? enqToServicePtn.prof_zone_id.prof_zone_id : selectedZone;
            requestData.pincode = pincode;
            requestData.address = enqToServicePtn.address;
            requestData.lattitude = enqToServicePtn.lattitude ? enqToServicePtn.lattitude : lat;
            requestData.langitude = enqToServicePtn.langitude ? enqToServicePtn.langitude : long;
            requestData.Total_cost = enqToServicePay.Total_cost ? enqToServicePay.Total_cost : calculatedAmount;
            requestData.discount_type = enqToServicePay.discount_type ? enqToServicePay.discount_type : selectedDiscountId;
            requestData.discount_value = enqToServicePay.discount_value ? enqToServicePay.discount_value : discountValue;
            requestData.final_amount = selectedDiscountId === 3 ? 0 : enqToServicePay.final_amount ? enqToServicePay.final_amount : totalDiscount;

            // requestData.preferred_hosp_id = selectedHospital;
            // requestData.state_id = selectedState;
            // requestData.city_id = selectedCity;
            // requestData.prof_zone_id = selectedZone;
            // requestData.lattitude = lat;
            // requestData.langitude = long;
            // requestData.Total_cost = calculatedAmount;
            // requestData.discount_type = selectedDiscountId;
            // requestData.discount_value = discountValue;
            // requestData.final_amount = totalDiscount;

            // requestData.day_convinance = enqToServicePay.day_convinance;
            // requestData.total_convinance = enqToServicePay.total_convinance;
        } else if (selectedPatient) {
            requestData.agg_sp_pt_id = selectedPatient.agg_sp_pt_id;
            requestData.name = selectedPatient.name;
            requestData.gender_id = selectedPatient.gender.gender_id;
            requestData.Age = selectedPatient.Age;
            requestData.preferred_hosp_id = selectedPatient.preferred_hosp.hosp_id;
            requestData.Suffered_from = selectedPatient.Suffered_from;
            requestData.phone_no = selectedPatient.phone_no;
            requestData.patient_email_id = selectedPatient.patient_email_id;
            requestData.doct_cons_id = selectedPatient.doct_cons.doct_cons_id;
            requestData.doct_cons_phone = selectedPatient.doct_cons.mobile_no;
            requestData.state_id = selectedPatient.state.state_id;
            requestData.city_id = selectedPatient.city.city_id;
            requestData.prof_zone_id = selectedPatient.zone.prof_zone_id;
            requestData.pincode = selectedPatient.pincode;
            requestData.address = selectedPatient.address;
            requestData.lattitude = selectedPatient.lattitude;
            requestData.langitude = selectedPatient.langitude;
            // requestData.day_convinance = dayConvinance;
            // requestData.total_convinance = convenience;
        } else {
            requestData.agg_sp_pt_id = null;
            requestData.name = ptnName;
            requestData.gender_id = selectedGender;
            requestData.Age = age;
            requestData.preferred_hosp_id = selectedHospital;
            requestData.Suffered_from = suffered;
            requestData.phone_no = ptnNumber;
            requestData.patient_email_id = email;
            requestData.doct_cons_id = selectedConsultant;
            requestData.doct_cons_phone = consultantMobile;
            requestData.state_id = selectedState;
            requestData.city_id = selectedCity;
            requestData.prof_zone_id = selectedZone;
            requestData.pincode = pincode;
            requestData.address = address;
            requestData.lattitude = lat;
            requestData.langitude = long;
            // requestData.total_convinance = convenience;
            // requestData.day_convinance = dayConvinance;
        }

        if (enqToServiceSrv) {
            // requestData.srv_id = enqToServiceSrv.srv_id;
            // requestData.sub_srv_id = enqToServiceSrv.sub_srv_id ? enqToServiceSrv.sub_srv_id.sub_srv_id : selectedSubService;
            requestData.srv_id = selectedService;
            requestData.sub_srv_id = selectedSubService;
            // requestData.start_date = enqToServiceSrv.start_date;
            requestData.start_date = startDate;
            // requestData.end_date = enqToServiceSrv.end_date ? enqToServiceSrv.end_date : endDate;
            requestData.end_date = endDate;
            requestData.start_time = enqToServiceSrv.start_time;
            requestData.end_time = enqToServiceSrv.end_time ? enqToServiceSrv.end_time : endTime;
            requestData.prof_prefered = enqToServiceSrv.prof_prefered ? enqToServiceSrv.prof_prefered : selectedProfGender;
            requestData.remark = enqToServiceSrv.remark ? enqToServiceSrv.remark : remark;
            // requestData.sub_srv_id = selectedSubService;
            // requestData.start_date = convertedStartDate;
            // requestData.end_date = convertedEndDate;
            // requestData.start_time = startTime;
            // requestData.end_time = endTime;
            // requestData.prof_prefered = selectedProfGender;
            // requestData.remark = remark;
        } else {
            requestData.srv_id = selectedService;
            requestData.sub_srv_id = selectedSubService;
            requestData.start_date = convertedStartDate;
            requestData.end_date = convertedEndDate;
            requestData.start_time = startTime;
            requestData.end_time = endTime;
            requestData.prof_prefered = selectedProfGender;
            requestData.remark = remark;
            requestData.Total_cost = calculatedAmount;
            requestData.discount_type = selectedDiscountId;
            requestData.discount_value = discountValue;
            // requestData.final_amount = totalCostValue;

            // requestData.final_amount = totalDiscount;
            requestData.final_amount = selectedDiscountId === 3 ? 0 : totalDiscount || calculatedAmount;
        }
        console.log("POST API Hitting......", requestData)
        try {
            let apiUrl = `${port}/web/agg_hhc_add_service_details_api/`;

            if (eventValue) {
                apiUrl = `${port}/web/agg_hhc_add_service_details_api/${eventValue}`;
                console.log("apiUrl", apiUrl)
            }
            const method = eventValue ? "PUT" : "POST";
            const response = await fetch(apiUrl, {
                method,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),

            });
            // if (!response.ok) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }
            if (response.ok) {
                const result = await response.json();
                console.log("Results.....", result);
                // if (actionType === "CreateService") {
                if (actionType === "CreateService" && result && result["Service Created Event Code"] && result["Service Created Event Code"].length > 0) {
                    setOpenSnackbar(true);
                    setSnackbarMessage('Your form received successfully.');
                    setSnackbarSeverity('success');

                    const eventValue = result["Service Created Event Code"][0]["event_id"];
                    const patientValue = result["Service Created Event Code"][1]["agg_sp_pt_id"];
                    const callerValue = result["Service Created Event Code"][1]["caller_id"];
                    const eventPlanValue = result["Service Created Event Code"][2]["event_plan_of_care_id"][0];

                    console.log("event ID", eventValue);
                    console.log("patientID", patientValue);
                    console.log("callerID", callerValue);
                    console.log("eventPlanID", eventPlanValue);

                    // navigate('/viewservice', {
                    //     state: {
                    //         patientID: patientValue,
                    //         callerID: callerValue,
                    //         eventPlanID: eventPlanValue,
                    //         eventID: eventValue,
                    //     },
                    // });
                    setTimeout(() => {
                        navigate('/viewservice', {
                            state: {
                                patientID: patientValue,
                                callerID: callerValue,
                                eventPlanID: eventPlanValue,
                                eventID: eventValue,
                            },
                        });
                    }, 2000);
                } else if (result && result.error === 'fill all required fields') {
                    setOpenSnackbar(true);
                    setSnackbarMessage('Please fill all required fields.');
                    setSnackbarSeverity('error');
                }

                else if (actionType === "Enquiry") {
                    setOpenSnackbar(true);
                    setSnackbarMessage('Your Enquiry has been saved successfully.');
                    setSnackbarSeverity('success');
                    setClrName('')
                    setPhoneNumber('')
                    setSelectedCall('')
                    setSelectedRelation('')
                    setPtnName('');
                    setPtnNumber('');
                    setSelectedGender('');
                    setAge('');
                    setEmail('')
                    setSelectedHospital('');
                    setSuffered('');
                    setSelectedState('');
                    setSelectedCity('');
                    setSelectedZone('')
                    setSelectedConsultant('')
                    setConsultantMobile('')
                    setPincode('')
                    setAddress('')
                    setLat('')
                    setLong('')
                    setSelectedService('')
                    setSelectedSubService('')
                    setStartDate('')
                    setEndDate('')
                    setStartTime('')
                    setEndTime('')
                    setSelectedProfGender('')
                    setRemark('')
                    setCalculatedAmount('')
                    setTotalAmount('')
                    setSelectedDiscountId('')
                    setDiscountValue('')
                    setTotalDiscount('')
                }
            } else {
                if (response.status === 404 || response.status === 500 || response.status === 400) {
                    setOpenSnackbar(true);
                    setSnackbarMessage("Something went wrong..!!");
                    setSnackbarSeverity('error');
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }
        } catch (error) {
            // console.error("An error occurred:", error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                setOpenSnackbar(true);
                setSnackbarMessage('Something went wrong...!!!');
                setSnackbarSeverity('error');
            } else {
                console.error("An error occurred:", error);
            }
        }
    }

    return (
        <>
            <Navbar style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }} />
            {/* <Header /> */}
            <Box sx={{ flexGrow: 1, mb: 2, ml: 1, mr: 1, }}>
                <Grid item xs={12} container spacing={1}>
                    {/* Previous Caller, Service and Payment Details */}
                    <Grid item lg={3} md={3} xs={12}>
                        <Grid item md={6} lg={12} >
                            <Card sx={{ minWidth: 200 }} style={{ background: 'linear-gradient(90deg, #C5EEEC 20%, #D0E3F3 100%)', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="left" gap={10}>
                                        <PersonOutlineSharpIcon />
                                        <Typography sx={{ fontSize: 16, fontWeight: 600, }} gutterBottom>Caller Details</Typography>
                                    </Stack>
                                    {callerDetails ? (
                                        <>
                                            <Typography sx={{ fontSize: 14 }} gutterBottom>
                                                Name: {callerDetails.caller_fullname}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14 }} gutterBottom>
                                                Contact: {callerDetails.phone}
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <Typography variant='subtitle2' sx={{ fontSize: 14 }} gutterBottom>
                                                    Welcome to Spero Homehealthcare
                                                    {/* 😊 */}
                                                </Typography>
                                                <img src={smile} alt="" style={{ width: "22px", height: "22px", marginLeft: "2px" }} />
                                            </div>
                                            <Typography sx={{ fontSize: 14 }} gutterBottom>
                                                Name & Contact
                                            </Typography>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item md={6} lg={12}>
                            <Card sx={{ minWidth: 200, mt: 1 }} style={{ background: 'linear-gradient(90deg, #C5EEEC 0%, #D0E3F3 100%)', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="left" gap={8}>
                                        <FavoriteBorderOutlinedIcon />
                                        <Typography sx={{ fontSize: 16, fontWeight: 600, }} gutterBottom>Previous Services</Typography>
                                    </Stack>

                                    {prePatient && prePatient.service ? (
                                        <>
                                            <Typography sx={{ fontSize: 14 }} gutterBottom>
                                                {prePatient.service}
                                            </Typography>
                                            <Typography sx={{ fontSize: 12 }}>{formattedDateRange}</Typography>
                                        </>
                                    ) : (
                                        <Typography sx={{ fontSize: 14 }} gutterBottom>
                                            Service Name
                                        </Typography>
                                    )}

                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item md={6} lg={12}>
                            <Card sx={{ minWidth: 200, mt: 1 }} style={{ background: 'linear-gradient(90deg, #C5EEEC 0%, #D0E3F3 100%)', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
                                <CardContent>
                                    <Stack direction="row" alignItems="left" gap={8}>
                                        <CreditCardOutlinedIcon />
                                        <Typography sx={{ fontSize: 16, fontWeight: 600, }} gutterBottom>Payment Status</Typography>
                                    </Stack>

                                    {prePayment ? (
                                        <Typography sx={{ fontSize: 14 }} gutterBottom>
                                            Pending Amount: {prePayment.Remaining_payment}
                                        </Typography>
                                    ) : (
                                        <Typography sx={{ fontSize: 14 }} gutterBottom>
                                            Pending Amount: 0
                                        </Typography>
                                    )}

                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item md={6} lg={12}>
                            <Card sx={{ minWidth: 200, mt: 1, }} style={{ background: 'linear-gradient(90deg, #C5EEEC 0%, #D0E3F3 100%)', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px', }}>
                                <CardContent
                                    sx={{
                                        height: "9.2rem",
                                        // overflowY: "scroll",
                                        // overflowX: "hidden",
                                        // scrollbarWidth: 'thin',
                                        // '&::-webkit-scrollbar': {
                                        //     width: '0.2em',
                                        // },
                                        // '&::-webkit-scrollbar-track': {
                                        //     background: "#DCDCDE",
                                        // },
                                        // '&::-webkit-scrollbar-thumb': {
                                        //     backgroundColor: '#7AB8EE',
                                        // },
                                        // '&::-webkit-scrollbar-thumb:hover': {
                                        //     background: '#7AB8FF'
                                        // }
                                    }}
                                >
                                    <Stack direction="row" alignItems="left" gap={10}>
                                        <StarOutlineOutlinedIcon />
                                        <Typography sx={{ fontSize: 16, fontWeight: 600, }} gutterBottom>Feedback</Typography>
                                    </Stack>

                                    {feedback ? (
                                        <>
                                            <Typography sx={{ fontSize: 14, color: '#D62E4B' }} gutterBottom>{generateRatingIcons(feedback.rating)}</Typography>
                                            <Typography variant="body2">
                                                <br />
                                                {"\"" + (feedback.comment || 'No feedback received from the patient.') + "\""}
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Typography sx={{ fontSize: 14, color: '#D62E4B' }} gutterBottom><FavoriteBorderIcon /><FavoriteBorderIcon /><FavoriteBorderIcon /><FavoriteBorderIcon /><FavoriteBorderIcon /></Typography>
                                            <Typography variant="body2">
                                                <br />
                                                {'"We are waiting for your valuable feedback, stay happy and healthy :)"'}
                                            </Typography>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Caller and Patient Details */}
                    <Grid item lg={6} md={6} xs={12}>
                        <Card sx={{ width: "100%", borderRadius: "10px", bgColor: "white", boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)' }}>
                            <CardContent>
                                <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, }}>CALLER DETAILS</Typography>
                                <Grid container spacing={2} sx={{ marginTop: "1px" }}>

                                    <Grid item lg={6} sm={6} xs={12}>
                                        <TextField
                                            required
                                            id="phone"
                                            name="phone"
                                            label="Mobile"
                                            placeholder="+91 |"
                                            size="small"
                                            fullWidth
                                            // value={phoneNumber}
                                            value={enqToServiceClr ? enqToServiceClr.phone.toString() : phoneNumber}
                                            onInput={handlePhoneNumberChange}
                                            onKeyPress={handleSearch}
                                            // error={!!phoneNumberError || !!errors.phoneNumber}
                                            // helperText={phoneNumberError || errors.phoneNumber}
                                            error={enqToServiceClr ? false : !!phoneNumberError || !!errors.phoneNumber}
                                            helperText={enqToServiceClr ? '' : phoneNumberError || errors.phoneNumber}
                                            inputProps={{
                                                minLength: 10,
                                                maxLength: 10,
                                            }}
                                            sx={{
                                                '& input': {
                                                    fontSize: '14px',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {callerDetails ? (
                                        <Grid item lg={6} sm={6} xs={12}>
                                            <TextField
                                                required
                                                label="Full Name"
                                                id="caller_fullname"
                                                name="caller_fullname"
                                                placeholder="First Name | Last Name *"
                                                value={callerDetails ? callerDetails.caller_fullname : clrName}
                                                onChange={(e) => callerDetails ? handleFieldEdit("caller_fullname", e.target.value) : setClrName(e.target.value)}
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
                                                id="caller_fullname"
                                                name="caller_fullname"
                                                type="text"
                                                // value={clrName}
                                                value={enqToServiceClr ? enqToServiceClr.caller_fullname : clrName}
                                                onChange={(e) => {
                                                    const inputName = e.target.value;
                                                    setClrName(inputName);
                                                    const validationError = validateFullName(inputName);
                                                    setErrors((prevErrors) => ({ ...prevErrors, clrName: validationError }));
                                                }}
                                                placeholder="First Name | Last Name *"
                                                size="small"
                                                fullWidth
                                                // error={!!errors.clrName}
                                                // helperText={errors.clrName}
                                                error={enqToServiceClr ? false : !!errors.clrName}
                                                helperText={enqToServiceClr ? '' : errors.clrName}
                                                sx={{
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    )}

                                    {enqToServiceClr ? (
                                        <>
                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    required
                                                    id="purp_call_id"
                                                    name="purp_call_id"
                                                    select
                                                    label="Select Call Type"
                                                    value={enqToServiceClr ? 1 : selectedCall}
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
                                                    {call.map((option) => (
                                                        <MenuItem key={option.purp_call_id} value={option.purp_call_id}
                                                            sx={{ fontSize: "14px" }}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    id="caller_rel_id"
                                                    name="caller_rel_id"
                                                    select
                                                    label="Select Relation"
                                                    // defaultValue={selectedRelation}
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
                                                                    maxHeight: '120px', // Adjust the height as needed
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
                                        </>
                                    ) : (
                                        <>
                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    required
                                                    id="purp_call_id"
                                                    name="purp_call_id"
                                                    select
                                                    label="Select Call Type"
                                                    // value={enqToServiceClr ? enqToServiceClr.purp_call_id.purp_call_id : selectedCall}
                                                    // onChange={(e) => enqToServiceClr ? handleFieldEdit("purp_call_id", e.target.value) : handleDropdownCall}
                                                    // value={enqToServiceClr ? 1 : selectedCall}
                                                    value={selectedCall}
                                                    onChange={handleDropdownCall}
                                                    size="small"
                                                    fullWidth
                                                    error={!!errors.selectedCall}
                                                    helperText={errors.selectedCall}
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
                                                    {call.map((option) => (
                                                        <MenuItem key={option.purp_call_id} value={option.purp_call_id}
                                                            sx={{ fontSize: "14px" }}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    id="caller_rel_id"
                                                    name="caller_rel_id"
                                                    select
                                                    label="Select Relation"
                                                    // defaultValue={selectedRelation}
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
                                                                    maxHeight: '120px', // Adjust the height as needed
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
                                        </>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Patient Details */}
                        <Card
                            sx={{
                                width: "100%",
                                borderRadius: "10px",
                                marginTop: "8px",
                                bgColor: "white",
                                boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',

                            }}
                        >
                            <CardContent>
                                <Grid container>
                                    <Stack direction="row">
                                        <Typography style={{ fontSize: "16px", fontWeight: 600 }}>PATIENT DETAILS  </Typography>
                                        {callerDetails ?
                                            (
                                                <Button variant='outlined' sx={{
                                                    textTransform: "capitalize", height: "30px",
                                                    borderRadius: "6px",
                                                    ml: isSmallScreen ? 2 : 50,
                                                }} onClick={handleAddNewClick}><PersonAddAltOutlinedIcon style={{ fontSize: "18px", marginRight: "4px" }} />Patient</Button>
                                            )
                                            : (null)}
                                    </Stack>
                                </Grid>

                                <Grid container spacing={2} sx={{ marginTop: "1px" }} >

                                    {showAddPatient ? (
                                        <>
                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    required
                                                    id="name"
                                                    name="name"
                                                    label="Patient Name"
                                                    placeholder="First Name | Last Name "
                                                    value={ptnName}
                                                    onChange={(e) => {
                                                        const inputName = e.target.value;
                                                        setPtnName(inputName);
                                                        const validationError = validateFullName(inputName);
                                                        setErrors((prevErrors) => ({ ...prevErrors, ptnName: validationError }));
                                                    }}
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: 'left',
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                    error={!!errors.ptnName}
                                                    helperText={errors.ptnName}
                                                />
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            id="gender_id"
                                                            name="gender_id"
                                                            select
                                                            label="Gender"
                                                            value={selectedGender}
                                                            onChange={handleDropdownGender}
                                                            size="small"
                                                            fullWidth
                                                            sx={{
                                                                textAlign: "left",
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            error={!!errors.gender}
                                                            helperText={errors.gender}
                                                        >
                                                            {gender.map((option) => (
                                                                <MenuItem key={option.gender_id} value={option.gender_id}
                                                                    sx={{ fontSize: "14px", }}>
                                                                    {option.name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            label="Age"
                                                            id="outlined-size-small"
                                                            name="Age"
                                                            value={age}
                                                            onChange={handleAgeValidation}
                                                            size="small"
                                                            fullWidth
                                                            error={!!validationMessage || !!errors.age}
                                                            helperText={validationMessage || errors.age}
                                                            inputProps={{
                                                                maxLength: 3,
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
                                                <TextField
                                                    required
                                                    label="Hospital Name"
                                                    id="preferred_hosp_id"
                                                    name="preferred_hosp_id"
                                                    select
                                                    placeholder='Hospital Name'
                                                    size="small"
                                                    fullWidth
                                                    value={selectedHospital}
                                                    onChange={(e) => setSelectedHospital(e.target.value)}
                                                    error={!!errors.hospital}
                                                    helperText={errors.hospital}
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
                                                    {referHospital.map((option) => (
                                                        <MenuItem key={option.hosp_id} value={option.hosp_id}
                                                            sx={{ fontSize: "14px", }}>
                                                            {option.hospital_name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    required
                                                    label="Suffered From"
                                                    id="Suffered_from"
                                                    name="Suffered_from"
                                                    value={suffered}
                                                    onChange={(e) => setSuffered(e.target.value)}
                                                    placeholder='Remark'
                                                    type="textarea"
                                                    size="small"
                                                    fullWidth
                                                    error={!!errors.suffered}
                                                    helperText={errors.suffered}
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
                                                            required
                                                            label="Contact"
                                                            id="phone_no"
                                                            name="phone_no"
                                                            placeholder='+91 |'
                                                            size="small"
                                                            fullWidth
                                                            value={ptnNumber}
                                                            // onChange={handlePtnNumberChange}
                                                            onInput={handlePtnNumberChange}
                                                            error={!!ptnNumberError || !!errors.ptnNumber}
                                                            helperText={ptnNumberError || errors.ptnNumber}
                                                            inputProps={{
                                                                minLength: 10,
                                                                maxLength: 10,
                                                            }}
                                                            sx={{
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            label="Email"
                                                            id="patient_email_id"
                                                            placeholder='example@gmail.com'
                                                            name="patient_email_id"
                                                            value={email}
                                                            // onChange={handleEmailChange}
                                                            onInput={handleEmailChange}
                                                            error={!!emailError || errors.email}
                                                            helperText={emailError || errors.email}
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
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            label="Consultant"
                                                            id="doct_cons_id"
                                                            name="doct_cons_id"
                                                            select
                                                            placeholder='Enter Name'
                                                            size="small"
                                                            value={selectedConsultant}
                                                            onChange={handleDropdownConsultant}
                                                            fullWidth
                                                            error={!!errors.selectedConsultant}
                                                            helperText={errors.selectedConsultant}
                                                            sx={{
                                                                textAlign: "left", '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            SelectProps={{
                                                                MenuProps: {
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: '120px', // Adjust the height as needed
                                                                            maxWidth: '200px',
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            {consultant.map((option) => (
                                                                <MenuItem key={option.doct_cons_id} value={option.doct_cons_id}
                                                                    sx={{ fontSize: "14px" }}>
                                                                    {option.cons_fullname}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>
                                                    {selectedConsultant === 0 && (
                                                        <Modal
                                                            open={openConsult}
                                                            onClose={handleCloseConsult}
                                                            aria-labelledby="modal-modal-title"
                                                            aria-describedby="modal-modal-description"
                                                        >
                                                            <Box sx={{ ...style, width: 300, borderRadius: "5px" }}>
                                                                <div style={{ display: "flex" }}>
                                                                    <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "gray", marginTop: "10px", }}>CONSULTANT DETAILS</Typography>
                                                                    <Button onClick={handleCloseConsult} sx={{ marginLeft: "4rem", color: "gray", marginTop: "2px" }}><CloseIcon /></Button>
                                                                </div>
                                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                                    <Grid item lg={12} sm={12} xs={12}>
                                                                        <TextField
                                                                            required
                                                                            label="Consultant Name"
                                                                            id="doct_cons_id"
                                                                            name="doct_cons_id"
                                                                            placeholder='Enter Name'
                                                                            size="small"
                                                                            fullWidth
                                                                            value={consultName}
                                                                            onChange={(e) => {
                                                                                const inputName = e.target.value;
                                                                                setConsultName(inputName);
                                                                                const validationError = validateFullName(inputName);
                                                                                setConsultErrors((prevErrors) => ({ ...prevErrors, consultName: validationError }));
                                                                            }}
                                                                            sx={{
                                                                                '& input': {
                                                                                    fontSize: '14px',
                                                                                },
                                                                            }}
                                                                            error={!!consultErrors.consultName}
                                                                            helperText={consultErrors.consultName}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={12} sm={12} xs={12}>
                                                                        <TextField
                                                                            required
                                                                            label="Contact"
                                                                            id="doct_cons_phone"
                                                                            name="doct_cons_phone"
                                                                            placeholder='+91 |'
                                                                            size="small"
                                                                            fullWidth
                                                                            value={consultNo}
                                                                            onInput={handleConsultNumberChange}
                                                                            inputProps={{
                                                                                minLength: 10,
                                                                                maxLength: 10,
                                                                            }}
                                                                            sx={{
                                                                                '& input': {
                                                                                    fontSize: '14px',
                                                                                },
                                                                            }}
                                                                            error={!!consultNoError || !!consultErrors.consultNo}
                                                                            helperText={consultNoError || consultErrors.consultNo}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={12} sm={12} xs={12} sx={{ ml: 10, mt: 2 }}>
                                                                        <Button variant='contained' sx={{ textTransform: 'capitalize', borderRadius: "8px", width: "18ch" }} onClick={handleConsultSubmit}>Submit</Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                        </Modal>
                                                    )}
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            label="Contact"
                                                            id="doct_cons_phone"
                                                            name="doct_cons_phone"
                                                            placeholder='+91 |'
                                                            size="small"
                                                            fullWidth
                                                            value={consultantMobile}
                                                            error={!!errors.consultantMobile}
                                                            helperText={errors.consultantMobile}
                                                            inputProps={{
                                                                minLength: 10,
                                                                maxLength: 10,
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
                                                <Grid container spacing={1}>
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
                                                            id="city_id"
                                                            name="city_id"
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
                                                </Grid>
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            label="Zone"
                                                            id="prof_zone_id"
                                                            name="prof_zone_id"
                                                            select
                                                            value={selectedZone}
                                                            onChange={(e) => setSelectedZone(e.target.value)}
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
                                                                            maxHeight: '120px', // Adjust the height as needed
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

                                                    <Grid item xs={6}>
                                                        <TextField
                                                            id="pincode"
                                                            label="Pincode"
                                                            placeholder='Pincode'
                                                            name="pincode"
                                                            size="small"
                                                            fullWidth
                                                            value={pincode}
                                                            onChange={handlePincodeChange}
                                                            inputProps={{
                                                                minLength: 6,
                                                                maxLength: 6,
                                                            }}
                                                            sx={{
                                                                textAlign: "left",
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            error={Boolean(pincodeError)}
                                                            helperText={pincodeError}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    required
                                                    label="GIS Address"
                                                    id="address"
                                                    name="address"
                                                    placeholder='House No,Building,Street,Area'
                                                    size="small"
                                                    fullWidth
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    error={!!errors.address}
                                                    helperText={errors.address}
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
                                                            required
                                                            label="Lat"
                                                            id="lat"
                                                            name="lat"
                                                            size="small"
                                                            fullWidth
                                                            value={lat}
                                                            onChange={(event) => {
                                                                const value = event.target.value;
                                                                if (!/^-?\d{0,2}(?:\.\d{0,6})?$/.test(value)) {
                                                                    return;
                                                                }
                                                                setLat(value);
                                                                const latError = validateLat(value);
                                                                setErrors(latError);
                                                            }}
                                                            sx={{
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            error={!!errors.lat}
                                                            helperText={errors.lat}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            label="Long"
                                                            id="long"
                                                            name="long"
                                                            size="small"
                                                            fullWidth
                                                            value={long}
                                                            onChange={(event) => {
                                                                const value = event.target.value;
                                                                if (!/^-?\d{0,2}(?:\.\d{0,6})?$/.test(value)) {
                                                                    return;
                                                                }
                                                                setLong(value);
                                                                const longError = validateLong(value);
                                                                setErrors(longError);
                                                            }}
                                                            sx={{
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            error={!!errors.long}
                                                            helperText={errors.long}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item lg={12} sm={12} xs={12}>
                                                <TextField
                                                    required
                                                    label="Manual Address"
                                                    id="address"
                                                    name="address"
                                                    placeholder='House No,Building,Street,Area'
                                                    size="small"
                                                    fullWidth
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    error={!!errors.address}
                                                    helperText={errors.address}
                                                    sx={{
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    ) : patientDetails ? (
                                        <>
                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    required
                                                    id="name"
                                                    name="name"
                                                    select
                                                    label="Select Patient"
                                                    size="small"
                                                    defaultValue={selectedPatient}
                                                    onChange={handlePatientSelect}
                                                    // error={!!validationMessage || !!errors.name}
                                                    // helperText={validationMessage || errors.name}
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
                                                                    maxHeight: '200px',
                                                                    maxWidth: '200px',
                                                                },
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {patientDetails.map((option) => (
                                                        <MenuItem key={option.agg_sp_pt_id
                                                        } value={option.agg_sp_pt_id
                                                        } sx={{ fontSize: "14px" }}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            {selectedPatient && (
                                                <>
                                                    <Grid item lg={6} sm={6} xs={12}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    required
                                                                    id="gender_id"
                                                                    name="gender_id"
                                                                    label="Gender"
                                                                    select
                                                                    defaultValue={selectedPatient ? selectedPatient.gender.gender_id : selectedGender}
                                                                    onChange={(e) => selectedPatient ? handleFieldEdit("gender_id", e.target.value) : handleDropdownGender}
                                                                    size="small"
                                                                    fullWidth
                                                                    sx={{
                                                                        textAlign: "left",
                                                                        '& input': {
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
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    required
                                                                    label="Age"
                                                                    id="Age"
                                                                    name="Age"
                                                                    size="small"
                                                                    fullWidth
                                                                    value={selectedPatient ? selectedPatient.Age : age}
                                                                    onChange={(e) => handleFieldEdit("Age", e.target.value)}
                                                                    // error={!!validationMessage || !!errors.age}
                                                                    // helperText={validationMessage || errors.age}
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
                                                            id="hosp_id"
                                                            name="hosp_id"
                                                            select
                                                            placeholder='Name'
                                                            defaultValue={selectedPatient ? selectedPatient.preferred_hosp.hosp_id : selectedHospital}
                                                            onChange={(e) => selectedPatient ? handleFieldEdit("hosp_id", e.target.value) : setSelectedHospital(e.target.value)}
                                                            size="small"
                                                            fullWidth
                                                            sx={{
                                                                textAlign: "left", '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true,
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
                                                            {referHospital.map((option) => (
                                                                <MenuItem key={option.hosp_id} value={option.hosp_id}
                                                                    sx={{ fontSize: "14px", }}>
                                                                    {option.hospital_name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>

                                                    <Grid item lg={6} sm={6} xs={12}>
                                                        <TextField
                                                            label="Suffered From"
                                                            id="Suffered_from"
                                                            name="Suffered_from"
                                                            placeholder='Remark'
                                                            type="textarea"
                                                            value={selectedPatient ? selectedPatient.Suffered_from : suffered}
                                                            onChange={(e) => selectedPatient ? handleFieldEdit("Suffered_from", e.target.value) : setSuffered(e.target.value)}
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

                                                    <Grid item lg={6} sm={6} xs={12}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    label="Contact"
                                                                    id="phone_no"
                                                                    name="phone_no"
                                                                    placeholder='+91 |'
                                                                    size="small"
                                                                    fullWidth
                                                                    value={selectedPatient ? selectedPatient.phone_no : ptnNumber}
                                                                    onChange={(e) => selectedPatient ? handleFieldEdit("phone_no", e.target.value) : handlePtnNumberChange}
                                                                    sx={{
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    label="Email"
                                                                    id="patient_email_id"
                                                                    name="patient_email_id"
                                                                    placeholder='example@gmail.com'
                                                                    value={selectedPatient ? selectedPatient.patient_email_id : email}
                                                                    onChange={(e) => selectedPatient ? handleFieldEdit("patient_email_id", e.target.value) : handleEmailChange}
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
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    select
                                                                    label="Consultant"
                                                                    id="doct_cons_id"
                                                                    name="doct_cons_id"
                                                                    size="small"
                                                                    fullWidth
                                                                    defaultValue={selectedPatient ? selectedPatient.doct_cons.doct_cons_id : selectedConsultant}
                                                                    onChange={(e) => selectedPatient ? handleFieldEdit("doct_cons_id", e.target.value) : handleDropdownConsultant}
                                                                    sx={{
                                                                        textAlign: "left",
                                                                        '& input': {
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
                                                                    {consultant.map((option) => (
                                                                        <MenuItem key={option.doct_cons_id} value={option.doct_cons_id}
                                                                            sx={{ fontSize: "14px" }}>
                                                                            {option.cons_fullname}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                            </Grid>

                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    label="Contact"
                                                                    id="doct_cons_phone"
                                                                    name="doct_cons_phone"
                                                                    placeholder='+91 |'
                                                                    size="small"
                                                                    fullWidth
                                                                    defaultValue={selectedPatient ? selectedPatient.doct_cons.mobile_no : consultantMobile}
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

                                                    <Grid item lg={6} sm={6} xs={12}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    label="State"
                                                                    id="state_id"
                                                                    name="state_id"
                                                                    placeholder='State'
                                                                    select
                                                                    value={selectedPatient ? selectedPatient.state.state_id : selectedState}
                                                                    onChange={(e) => selectedPatient ? handleFieldEdit("state_id", e.target.value) : setSelectedState(e.target.value)}
                                                                    size="small"
                                                                    fullWidth
                                                                    // error={!!errors.selectedState}
                                                                    // helperText={errors.selectedState}
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
                                                                    label="City"
                                                                    id="city_id"
                                                                    name="city_id"
                                                                    placeholder='City'
                                                                    select
                                                                    value={selectedPatient ? selectedPatient.city.city_id : selectedCity}
                                                                    onChange={(e) => selectedPatient ? handleFieldEdit("city_id", e.target.value) : setSelectedCity(e.target.value)}
                                                                    size="small"
                                                                    fullWidth
                                                                    // error={!!errors.selectedCity}
                                                                    // helperText={errors.selectedCity}
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
                                                                    {/* {city.map((option) => (
                                                                        <MenuItem key={option.city_id} value={option.city_id}
                                                                            sx={{ fontSize: "14px" }}>
                                                                            {option.city_name}
                                                                        </MenuItem>
                                                                    ))} */}
                                                                    {!selectedPatient && (
                                                                        <>
                                                                            {/* <MenuItem value="" disabled>Select City</MenuItem> */}
                                                                            {city.map((option) => (
                                                                                <MenuItem key={option.city_id} value={option.city_id}>
                                                                                    {option.city_name}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </>
                                                                    )}
                                                                    {selectedPatient && selectedPatient.city && (
                                                                        <MenuItem value={selectedPatient.city.city_id}>
                                                                            {selectedPatient.city.city_name}
                                                                        </MenuItem>
                                                                    )}
                                                                </TextField>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item lg={6} sm={6} xs={12}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    label="Zone"
                                                                    id="prof_zone_id"
                                                                    name="prof_zone_id"
                                                                    select
                                                                    value={selectedPatient ? selectedPatient.zone.prof_zone_id : selectedZone}
                                                                    onChange={(e) => selectedPatient ? handleFieldEdit("prof_zone_id", e.target.value) : setSelectedZone(e.target.value)}
                                                                    size="small"
                                                                    fullWidth
                                                                    // error={!!errors.selectedZone}
                                                                    // helperText={errors.selectedZone}
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
                                                                    {/* {zone.map((option) => (
                                                                        <MenuItem key={option.prof_zone_id} value={option.prof_zone_id}
                                                                            sx={{ fontSize: "14px" }}>
                                                                            {option.Name}
                                                                        </MenuItem>
                                                                    ))} */}
                                                                    {!selectedPatient && (
                                                                        <>
                                                                            {zone.map((option) => (
                                                                                <MenuItem key={option.prof_zone_id} value={option.prof_zone_id}>
                                                                                    {option.Name}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </>
                                                                    )}
                                                                    {selectedPatient && selectedPatient.zone && (
                                                                        <MenuItem value={selectedPatient.zone.prof_zone_id}>
                                                                            {selectedPatient.zone.Name}
                                                                        </MenuItem>
                                                                    )}
                                                                </TextField>
                                                            </Grid>

                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    id="pincode"
                                                                    label="Pincode"
                                                                    placeholder='Pincode'
                                                                    name="pincode"
                                                                    // type="number"
                                                                    value={selectedPatient ? selectedPatient.pincode : pincode}
                                                                    // onChange={(e) => selectedPatient ? handleFieldEdit("pincode", e.target.value) : handlePincodeChange}
                                                                    size="small"
                                                                    fullWidth
                                                                    sx={{
                                                                        textAlign: "left",
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                    error={Boolean(pincodeError)}
                                                                    helperText={pincodeError}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item lg={6} sm={6} xs={12}>
                                                        <TextField
                                                            required
                                                            label="GIS Address"
                                                            id="address"
                                                            name="address"
                                                            placeholder='House No,Building,Street,Area'
                                                            size="small"
                                                            fullWidth
                                                            defaultValue={selectedPatient ? selectedPatient.address : address}
                                                            onChange={(e) => selectedPatient ? handleFieldEdit("address", e.target.value) : setAddress(e.target.value)}
                                                            // error={!!errors.address}
                                                            // helperText={errors.address}
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
                                                                    required
                                                                    label="Lat"
                                                                    id="lat"
                                                                    name="lat"
                                                                    size="small"
                                                                    fullWidth
                                                                    value={lat}
                                                                    onChange={(event) => {
                                                                        const value = event.target.value;
                                                                        if (!/^-?\d{0,2}(?:\.\d{0,6})?$/.test(value)) {
                                                                            return;
                                                                        }
                                                                        setLat(value);
                                                                        const latError = validateLat(value);
                                                                        setErrors(latError);
                                                                    }}
                                                                    sx={{
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                    error={!!errors.lat}
                                                                    helperText={errors.lat}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <TextField
                                                                    required
                                                                    label="Long"
                                                                    id="long"
                                                                    name="long"
                                                                    size="small"
                                                                    fullWidth
                                                                    value={long}
                                                                    onChange={(event) => {
                                                                        const value = event.target.value;
                                                                        if (!/^-?\d{0,2}(?:\.\d{0,6})?$/.test(value)) {
                                                                            return;
                                                                        }
                                                                        setLong(value);
                                                                        const longError = validateLong(value);
                                                                        setErrors(longError);
                                                                    }}
                                                                    sx={{
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                    error={!!errors.long}
                                                                    helperText={errors.long}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item lg={12} sm={12} xs={12}>
                                                        <TextField
                                                            required
                                                            label="Manual Address"
                                                            id="address"
                                                            name="address"
                                                            placeholder='House No,Building,Street,Area'
                                                            size="small"
                                                            fullWidth
                                                            defaultValue={selectedPatient ? selectedPatient.address : address}
                                                            onChange={(e) => selectedPatient ? handleFieldEdit("address", e.target.value) : setAddress(e.target.value)}
                                                            // error={!!errors.address}
                                                            // helperText={errors.address}
                                                            sx={{
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                        />
                                                    </Grid>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    required
                                                    id="name"
                                                    name="name"
                                                    label="Patient Name"
                                                    placeholder="First Name | Last Name "
                                                    value={enqToServicePtn ? enqToServicePtn.name : ptnName}
                                                    onChange={(e) => {
                                                        const inputName = e.target.value;
                                                        setPtnName(inputName);
                                                        const validationError = validateFullName(inputName);
                                                        setErrors((prevErrors) => ({ ...prevErrors, ptnName: validationError }));
                                                    }}
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: 'left',
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                    // error={!!errors.ptnName}
                                                    // helperText={errors.ptnName}
                                                    error={enqToServicePtn ? false : !!errors.ptnName}
                                                    helperText={enqToServicePtn ? '' : errors.ptnName}
                                                />
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            id="gender_id"
                                                            name="gender_id"
                                                            select
                                                            label="Gender"
                                                            onChange={handleDropdownGender}
                                                            value={enqToServicePtn ? enqToServicePtn.gender_id.gender_id : selectedGender}
                                                            // onChange={(e) => enqToServicePtn ? handleFieldChange("gender_id", e.target.value) : handleDropdownGender}
                                                            size="small"
                                                            fullWidth
                                                            sx={{
                                                                textAlign: "left",
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            // error={!!errors.gender}
                                                            // helperText={errors.gender}
                                                            error={enqToServicePtn ? false : !!errors.gender}
                                                            helperText={enqToServicePtn ? '' : errors.gender}
                                                        >
                                                            {gender.map((option) => (
                                                                <MenuItem key={option.gender_id} value={option.gender_id}
                                                                    sx={{ fontSize: "14px" }}>
                                                                    {option.name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            label="Age"
                                                            id="outlined-size-small"
                                                            name="Age"
                                                            onChange={handleAgeValidation}
                                                            value={enqToServicePtn ? enqToServicePtn.Age : age}
                                                            // onChange={(e) => enqToServicePtn ? handleFieldChange("Age", e.target.value) : handleAgeValidation}
                                                            size="small"
                                                            fullWidth
                                                            // error={!!validationMessage || !!errors.age}
                                                            // helperText={validationMessage || errors.age}
                                                            error={enqToServicePtn ? false : !!validationMessage || !!errors.age}
                                                            helperText={enqToServicePtn ? '' : validationMessage || errors.age}
                                                            inputProps={{
                                                                maxLength: 3,
                                                            }}
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

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    required
                                                    label="Hospital Name"
                                                    id="preferred_hosp_id"
                                                    name="preferred_hosp_id"
                                                    select
                                                    size="small"
                                                    fullWidth
                                                    value={enqToServicePtn.preferred_hosp_id ? enqToServicePtn.preferred_hosp_id.hosp_id : selectedHospital}
                                                    onChange={(e) => setSelectedHospital(e.target.value)}
                                                    error={enqToServicePtn.preferred_hosp_id === null && !selectedHospital || !!errors.hospital}
                                                    helperText={enqToServicePtn.preferred_hosp_id === null && !selectedHospital ? 'Hospital is required' : errors.hospital || ''}
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
                                                    {referHospital.map((option) => (
                                                        <MenuItem key={option.hosp_id} value={option.hosp_id}
                                                            sx={{ fontSize: "14px", }}>
                                                            {option.hospital_name}
                                                        </MenuItem>
                                                    ))}

                                                    {enqToServicePtn && enqToServicePtn.preferred_hosp_id?.hosp_id && (
                                                        <MenuItem value={enqToServicePtn.preferred_hosp_id?.hosp_id}>
                                                            {enqToServicePtn.preferred_hosp_id?.hospital_name}
                                                        </MenuItem>
                                                    )}
                                                </TextField>
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    required
                                                    label="Suffered From"
                                                    id="Suffered_from"
                                                    name="Suffered_from"
                                                    value={enqToServicePtn ? enqToServicePtn.Suffered_from : suffered}
                                                    onChange={(e) => enqToServicePtn ? handleFieldChange("Suffered_from", e.target.value) : setSuffered(e.target.value)}
                                                    placeholder='Remark'
                                                    type="textarea"
                                                    size="small"
                                                    fullWidth
                                                    // error={!!errors.suffered}
                                                    // helperText={errors.suffered}
                                                    error={enqToServicePtn ? false : !!errors.suffered}
                                                    helperText={enqToServicePtn ? '' : errors.suffered}
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
                                                            required
                                                            label="Contact"
                                                            id="phone_no"
                                                            name="phone_no"
                                                            placeholder='+91 |'
                                                            size="small"
                                                            fullWidth
                                                            onInput={handlePtnNumberChange}
                                                            value={enqToServicePtn ? enqToServicePtn.phone_no.toString() : ptnNumber}
                                                            // onInput={(e) => enqToServicePtn ? handleFieldChange("phone_no", e.target.value) : handlePtnNumberChange}
                                                            // error={!!ptnNumberError || !!errors.ptnNumber}
                                                            // helperText={ptnNumberError || errors.ptnNumber}
                                                            error={enqToServicePtn ? false : !!ptnNumberError || !!errors.ptnNumber}
                                                            helperText={enqToServicePtn ? '' : ptnNumberError || errors.ptnNumber}
                                                            inputProps={{
                                                                minLength: 10,
                                                                maxLength: 10,
                                                            }}
                                                            sx={{
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            label="Email"
                                                            id="patient_email_id"
                                                            placeholder='example@gmail.com'
                                                            name="patient_email_id"
                                                            value={enqToServicePtn.patient_email_id ? enqToServicePtn.patient_email_id : email}
                                                            onInput={(e) => enqToServicePtn.patient_email_id ? handleFieldChange("patient_email_id", e.target.value) : handleEmailChange(e)}
                                                            error={enqToServicePtn.patient_email_id === null && !email || !!errors.email}
                                                            helperText={enqToServicePtn.patient_email_id === null && !email ? 'Email is required' : errors.email || ''}
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
                                                </Grid>
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            label="Consultant"
                                                            id="doct_cons_id"
                                                            name="doct_cons_id"
                                                            select
                                                            placeholder='Enter Name'
                                                            size="small"
                                                            fullWidth
                                                            value={enqToServicePtn.doct_cons_id ? enqToServicePtn.doct_cons_id.doct_cons_id : selectedConsultant}
                                                            onChange={handleDropdownConsultant}
                                                            // onChange={(e) => enqToServicePtn ? handleFieldChange("doct_cons_id", e.target.value) : handleDropdownConsultant}
                                                            error={enqToServicePtn.doct_cons_id === null && !selectedConsultant || !!errors.selectedConsultant}
                                                            helperText={enqToServicePtn.doct_cons_id === null && !selectedConsultant ? 'This is required' : errors.selectedConsultant || ''}
                                                            sx={{
                                                                textAlign: "left", '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            SelectProps={{
                                                                MenuProps: {
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: '150px',
                                                                            maxWidth: '200px',
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            {consultant.map((option) => (
                                                                <MenuItem key={option.doct_cons_id} value={option.doct_cons_id}
                                                                    sx={{ fontSize: "14px" }}>
                                                                    {option.cons_fullname}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>

                                                    {selectedConsultant === 0 && (
                                                        <Modal
                                                            open={openConsult}
                                                            onClose={handleCloseConsult}
                                                            aria-labelledby="modal-modal-title"
                                                            aria-describedby="modal-modal-description"
                                                        >
                                                            <Box sx={{ ...style, width: 300, borderRadius: "5px" }}>
                                                                <div style={{ display: "flex" }}>
                                                                    <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "gray", marginTop: "10px", }}>CONSULTANT DETAILS</Typography>
                                                                    <Button onClick={handleCloseConsult} sx={{ marginLeft: "4rem", color: "gray", marginTop: "2px" }}><CloseIcon /></Button>
                                                                </div>
                                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                                    <Grid item lg={12} sm={12} xs={12}>
                                                                        <TextField
                                                                            required
                                                                            label="Consultant Name"
                                                                            id="doct_cons_id"
                                                                            name="doct_cons_id"
                                                                            placeholder='Enter Name'
                                                                            size="small"
                                                                            fullWidth
                                                                            value={consultName}
                                                                            // onChange={(e) => setConsultName(e.target.value)}
                                                                            onChange={(e) => {
                                                                                const inputName = e.target.value;
                                                                                setConsultName(inputName);
                                                                                const validationError = validateFullName(inputName);
                                                                                setConsultErrors((prevErrors) => ({ ...prevErrors, consultName: validationError }));
                                                                            }}
                                                                            sx={{
                                                                                '& input': {
                                                                                    fontSize: '14px',
                                                                                },
                                                                            }}
                                                                            error={!!consultErrors.consultName}
                                                                            helperText={consultErrors.consultName}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={12} sm={12} xs={12}>
                                                                        <TextField
                                                                            required
                                                                            label="Contact"
                                                                            id="doct_cons_phone"
                                                                            name="doct_cons_phone"
                                                                            placeholder='+91 |'
                                                                            size="small"
                                                                            fullWidth
                                                                            value={consultNo}
                                                                            // onChange={(e) => setConsultNo(e.target.value)}
                                                                            onInput={handleConsultNumberChange}
                                                                            // value={enqToServicePtn ? enqToServicePtn.phone_no.toString() : ptnNumber}
                                                                            // onInput={(e) => enqToServicePtn ? handleFieldChange("phone_no", e.target.value) : handlePtnNumberChange}
                                                                            inputProps={{
                                                                                minLength: 10,
                                                                                maxLength: 10,
                                                                            }}
                                                                            sx={{
                                                                                '& input': {
                                                                                    fontSize: '14px',
                                                                                },
                                                                            }}
                                                                            error={!!consultNoError || !!consultErrors.consultNo}
                                                                            helperText={consultNoError || consultErrors.consultNo}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={12} sm={12} xs={12} sx={{ ml: 10, mt: 2 }}>
                                                                        <Button variant='contained' sx={{ textTransform: 'capitalize', borderRadius: "8px", width: "18ch" }} onClick={handleConsultSubmit}>Submit</Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                        </Modal>
                                                    )}

                                                    <Grid item xs={6}>
                                                        <TextField
                                                            label="Contact"
                                                            id="doct_cons_phone"
                                                            name="doct_cons_phone"
                                                            placeholder='+91 |'
                                                            size="small"
                                                            fullWidth
                                                            // value={consultantMobile}
                                                            value={enqToServicePtn.doct_cons_id ? enqToServicePtn.doct_cons_id.mobile_no : consultantMobile}
                                                            // error={!!errors.consultantMobile}
                                                            // helperText={errors.consultantMobile}
                                                            error={enqToServicePtn ? false : !!errors.consultantMobile}
                                                            helperText={enqToServicePtn ? '' : errors.consultantMobile}
                                                            inputProps={{
                                                                minLength: 10,
                                                                maxLength: 10,
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
                                                <Grid container spacing={1}>
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
                                                            // value={enqToServicePtn ? enqToServicePtn.state_id?.state_id : selectedState}
                                                            // onChange={(e) => enqToServicePtn ? handleFieldChange("state_id", e.target.value) : setSelectedState(e.target.value)}
                                                            size="small"
                                                            fullWidth
                                                            // error={!!errors.selectedState}
                                                            // helperText={errors.selectedState}
                                                            error={enqToServicePtn ? false : !!errors.selectedState}
                                                            helperText={enqToServicePtn ? '' : errors.selectedState}
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
                                                            id="city_id"
                                                            name="city_id"
                                                            select
                                                            value={enqToServicePtn.city_id ? enqToServicePtn.city_id.city_id : selectedCity}
                                                            onChange={(e) => setSelectedCity(e.target.value)}
                                                            size="small"
                                                            fullWidth
                                                            // error={!!errors.selectedCity}
                                                            // helperText={errors.selectedCity}
                                                            error={enqToServicePtn ? false : !!errors.selectedCity}
                                                            helperText={enqToServicePtn ? '' : errors.selectedCity}
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
                                                                <MenuItem key={option.city_id} value={option.city_id}>
                                                                    {option.city_name}
                                                                </MenuItem>
                                                            ))}

                                                            {enqToServicePtn.city_id ? (
                                                                <MenuItem value={enqToServicePtn.city_id.city_id}>
                                                                    {enqToServicePtn.city_id.city_name}
                                                                </MenuItem>
                                                            ) : null
                                                            }
                                                        </TextField>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            label="Zone"
                                                            id="prof_zone_id"
                                                            name="prof_zone_id"
                                                            select
                                                            value={enqToServicePtn.prof_zone_id ? enqToServicePtn.prof_zone_id.prof_zone_id : selectedZone}
                                                            onChange={(e) => setSelectedZone(e.target.value)}
                                                            size="small"
                                                            fullWidth
                                                            error={enqToServicePtn.prof_zone_id === null && !selectedZone || !!errors.selectedZone}
                                                            helperText={enqToServicePtn.prof_zone_id === null && !selectedZone ? 'Zone is required' : errors.selectedZone || ''}
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
                                                            {enqToServicePtn.prof_zone_id ? (
                                                                <MenuItem value={enqToServicePtn.prof_zone_id.prof_zone_id} sx={{ fontSize: "14px", }}>
                                                                    {enqToServicePtn.prof_zone_id.Name}
                                                                </MenuItem>
                                                            ) : null
                                                            }
                                                        </TextField>
                                                    </Grid>

                                                    <Grid item xs={6}>
                                                        <TextField
                                                            id="pincode"
                                                            label="Pincode"
                                                            placeholder='Pincode'
                                                            name="pincode"
                                                            size="small"
                                                            fullWidth
                                                            value={enqToServicePtn ? enqToServicePtn.pincode : pincode}
                                                            onChange={handlePincodeChange}
                                                            inputProps={{
                                                                minLength: 6,
                                                                maxLength: 6,
                                                            }}
                                                            sx={{
                                                                textAlign: "left",
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            error={Boolean(pincodeError)}
                                                            helperText={pincodeError}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item lg={6} sm={6} xs={12}>
                                                <TextField
                                                    required
                                                    label="GIS Address"
                                                    id="address"
                                                    name="address"
                                                    placeholder='House No,Building,Street,Area'
                                                    size="small"
                                                    fullWidth
                                                    // value={address}
                                                    // onChange={(e) => setAddress(e.target.value)}
                                                    value={enqToServicePtn ? enqToServicePtn.address : address}
                                                    onChange={(e) => enqToServicePtn ? handleFieldChange("address", e.target.value) : setAddress(e.target.value)}
                                                    // error={!!errors.address}
                                                    // helperText={errors.address}
                                                    error={enqToServicePtn ? false : !!errors.address}
                                                    helperText={enqToServicePtn ? '' : errors.address}
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
                                                            required
                                                            label="Lat"
                                                            id="lat"
                                                            name="lat"
                                                            size="small"
                                                            fullWidth
                                                            // value={lat}
                                                            value={enqToServicePtn ? enqToServicePtn.lattitude : lat}
                                                            onChange={(event) => {
                                                                const value = event.target.value;
                                                                if (!/^-?\d{0,2}(?:\.\d{0,6})?$/.test(value)) {
                                                                    return;
                                                                }
                                                                setLat(value);
                                                                const latError = validateLat(value);
                                                                setErrors(latError);
                                                            }}
                                                            sx={{
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            inputProps={{
                                                                maxLength: 9,
                                                                minLength: 9,
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            error={enqToServicePtn.lattitude === null && !lat || !!errors.lat}
                                                            helperText={enqToServicePtn.lattitude === null && !lat ? 'Lattitude is required' : errors.lat || ''}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            required
                                                            label="Long"
                                                            id="long"
                                                            name="long"
                                                            size="small"
                                                            fullWidth
                                                            value={enqToServicePtn ? enqToServicePtn.langitude : long}
                                                            onChange={(event) => {
                                                                const value = event.target.value;
                                                                if (!/^-?\d{0,2}(?:\.\d{0,6})?$/.test(value)) {
                                                                    return;
                                                                }
                                                                setLong(value);
                                                                const longError = validateLong(value);
                                                                setErrors(longError);
                                                            }}
                                                            sx={{
                                                                '& input': {
                                                                    fontSize: '14px',
                                                                },
                                                            }}
                                                            inputProps={{
                                                                maxLength: 9,
                                                                minLength: 9,
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            error={enqToServicePtn.langitude === null && !long || !!errors.long}
                                                            helperText={enqToServicePtn.langitude === null && !long ? 'Longitude is required' : errors.long || ''}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item lg={12} sm={12} xs={12}>
                                                <TextField
                                                    required
                                                    label="Manual Address"
                                                    id="address"
                                                    name="address"
                                                    placeholder='House No,Building,Street,Area'
                                                    size="small"
                                                    fullWidth
                                                    // value={address}
                                                    // onChange={(e) => setAddress(e.target.value)}
                                                    value={enqToServicePtn ? enqToServicePtn.address : address}
                                                    onChange={(e) => enqToServicePtn ? handleFieldChange("address", e.target.value) : setAddress(e.target.value)}
                                                    // error={!!errors.address}
                                                    // helperText={errors.address}
                                                    error={enqToServicePtn ? false : !!errors.address}
                                                    helperText={enqToServicePtn ? '' : errors.address}
                                                    sx={{
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Service Details */}
                    <Grid item lg={3} md={3} xs={12} >
                        <Card sx={{ width: "100%", borderRadius: "10px", bgColor: "white", boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)' }}>
                            <CardContent>
                                <Typography align="center" style={{ fontSize: "16px", fontWeight: 600 }}>SERVICE DETAILS</Typography>
                                <Grid container spacing={2} sx={{ marginTop: "1px" }}>

                                    {enqToServiceSrv ? (
                                        <>
                                            <Grid item lg={12} sm={12} xs={12}>
                                                <TextField
                                                    required
                                                    id="srv_id"
                                                    name="srv_id"
                                                    select
                                                    label="Select Service"
                                                    value={selectedService}
                                                    onChange={handleDropdownService}
                                                    // value={enqToServiceSrv ? enqToServiceSrv.srv_id : selectedService}
                                                    // onChange={(e) => enqToServiceSrv ? handleFieldChange("srv_id", e.target.value) : handleDropdownService(e)}
                                                    size="small"
                                                    fullWidth
                                                    error={enqToServiceSrv ? false : !!errors.selectedService}
                                                    helperText={enqToServiceSrv ? '' : errors.selectedService}
                                                    sx={{
                                                        textAlign: "left", '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                    SelectProps={{
                                                        MenuProps: {
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: '200px', // Adjust the height as needed
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

                                            <Grid item lg={12} sm={12} xs={12}>
                                                <TextField
                                                    required
                                                    id="sub_srv_id"
                                                    name="sub_srv_id"
                                                    select
                                                    label="Select Sub Service"
                                                    // value={enqToServiceSrv.sub_srv_id ? enqToServiceSrv.sub_srv_id.sub_srv_id : selectedSubService}
                                                    // onChange={(e) => enqToServiceSrv.sub_srv_id ? handleFieldChange("sub_srv_id", e.target.value) : handleSubServiceSelect(e)}
                                                    value={selectedSubService}
                                                    onChange={handleSubServiceSelect}
                                                    // onChange={handleDropdownSubService}
                                                    size="small"
                                                    fullWidth
                                                    // multiple
                                                    // error={!enqToServiceSrv.sub_srv_id || enqToServiceSrv.sub_srv_id.sub_srv_id === '' || !!errors.selectedSubService}
                                                    // helperText={!enqToServiceSrv.sub_srv_id || enqToServiceSrv.sub_srv_id.sub_srv_id === '' ? 'Sub Service is required' : errors.selectedSubService}
                                                    error={enqToServiceSrv.sub_srv_id === null && !selectedSubService || !!errors.selectedSubService}
                                                    helperText={enqToServiceSrv.sub_srv_id === null && !selectedSubService ? 'Sub Service is required' : errors.selectedSubService || ''}
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
                                                    {subService.map((option) => (
                                                        <MenuItem key={option.sub_srv_id} value={option.sub_srv_id} sx={{ fontSize: "14px" }}>
                                                            {selectedService && option.recommomded_service}
                                                        </MenuItem>
                                                    ))}

                                                    {enqToServiceSrv && enqToServiceSrv.sub_srv_id?.sub_srv_id ? (
                                                        <MenuItem value={enqToServiceSrv.sub_srv_id?.sub_srv_id} sx={{ fontSize: "14px", }}>
                                                            {enqToServiceSrv.sub_srv_id?.recommomded_service}
                                                        </MenuItem>
                                                    ) : null
                                                    }

                                                </TextField>
                                            </Grid>

                                            <Grid container spacing={1} sx={{ mt: 2, ml: 1 }}>
                                                <Grid item lg={6} sm={6} xs={6}>
                                                    <TextField
                                                        required
                                                        id="start_date"
                                                        name="start_date"
                                                        label="Start Date"
                                                        type="date"
                                                        value={startDate}
                                                        onChange={handleStartDateChange}
                                                        // value={enqToServiceSrv ? enqToServiceSrv.start_date : startDate}
                                                        // onChange={(e) => enqToServiceSrv ? handleFieldChange("start_date", e.target.value) : handleStartDateChange(e.target.value)}
                                                        size="small"
                                                        fullWidth
                                                        error={enqToServiceSrv ? false : !!errors.startDate}
                                                        helperText={enqToServiceSrv ? '' : errors.startDate}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        inputProps={{
                                                            min: getCurrentDateTimeString(),
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item lg={6} sm={6} xs={6}>
                                                    <TextField
                                                        required
                                                        id="end_date"
                                                        name="end_date"
                                                        label="End Date"
                                                        type="date"
                                                        // value={enqToServiceSrv ? enqToServiceSrv.end_date : endDate}
                                                        value={endDate}
                                                        onChange={handleEndDateChange}
                                                        // onChange={(e) => enqToServiceSrv ? handleFieldChange("end_date", e.target.value) : handleEndDateChange(e.target.value)}
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
                                                        error={enqToServiceSrv.end_date === null && !endDate || endDateError !== '' || !!errors.endDate}
                                                        helperText={enqToServiceSrv.end_date === null && !endDate ? 'This field is required' : endDateError || errors.endDate || ''}
                                                        inputProps={{
                                                            min: getCurrentDateTimeString(),
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Grid container spacing={1} sx={{ mt: 2, ml: 1 }}>
                                                <Grid item lg={6} sm={6} xs={6}>
                                                    <TextField
                                                        required
                                                        id="start_time"
                                                        name="start_time"
                                                        label="Start Time"
                                                        type="time"
                                                        value={enqToServiceSrv ? enqToServiceSrv.start_time : startTime}
                                                        // onChange={(e) => setStartTime(e.target.value)}
                                                        onChange={(e) => enqToServiceSrv ? handleFieldChange("start_time", e.target.value) : setStartTime(e.target.value)}
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
                                                        error={enqToServiceSrv ? false : !!errors.startTime}
                                                        helperText={enqToServiceSrv ? '' : errors.startTime}
                                                    // inputProps={{
                                                    //     min: getCurrentDateTimeString(),
                                                    // }}
                                                    />
                                                </Grid>

                                                <Grid item lg={6} sm={6} xs={6}>
                                                    <TextField
                                                        required
                                                        id="end_time"
                                                        name="end_time"
                                                        label="End Time"
                                                        type="time"
                                                        value={enqToServiceSrv.end_time ? enqToServiceSrv.end_time : endTime}
                                                        // onChange={(e) => setEndTime(e.target.value)}
                                                        onChange={(e) => enqToServiceSrv.end_time ? handleFieldChange("end_time", e.target.value) : setEndTime(e.target.value)}
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

                                                        error={enqToServiceSrv.end_time === null && !endTime || !!errors.endTime}
                                                        helperText={enqToServiceSrv.end_time === null && !endTime ? 'This field is required' : errors.endTime || ''}
                                                    // inputProps={{
                                                    //     min: getCurrentDateTimeString(), // Set min to current date and time
                                                    // }}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Grid item lg={12} sm={12} xs={12}>
                                                <TextField
                                                    id="prof_prefered"
                                                    select
                                                    name="prof_prefered"
                                                    label="Preferred Professional"
                                                    value={enqToServiceSrv.prof_prefered ? enqToServiceSrv.prof_prefered : selectedProfGender}
                                                    onChange={(e) => enqToServiceSrv.prof_prefered ? handleFieldChange("prof_prefered", e.target.value) : handleDropdownProfGender(e)}
                                                    size="small"
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{
                                                        textAlign: "left", '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                >
                                                    {profGender.map((option) => (
                                                        <MenuItem key={option.gender_id} value={option.gender_id}
                                                            sx={{ fontSize: "14px", }}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            <Grid item lg={12} sm={12} xs={12}>
                                                <TextField
                                                    id="remark"
                                                    name="remark"
                                                    label="Remark"
                                                    placeholder='write remark here'
                                                    size="small"
                                                    fullWidth
                                                    value={enqToServiceSrv ? enqToServiceSrv.remark : remark}
                                                    onChange={(e) => enqToServiceSrv ? handleFieldChange("remark", e.target.value) : setRemark(e.target.value)}
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
                                        </>
                                    ) : (
                                        <>
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
                                                                    maxHeight: '200px', // Adjust the height as needed
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

                                            <Grid item lg={12} sm={12} xs={12}>
                                                <TextField
                                                    required
                                                    id="sub_srv_id"
                                                    name="sub_srv_id"
                                                    select
                                                    label="Select Sub Service"
                                                    // defaultValue={selectedSubService}
                                                    value={selectedSubService}
                                                    onChange={handleSubServiceSelect}
                                                    // onChange={handleDropdownSubService}
                                                    size="small"
                                                    fullWidth
                                                    multiple
                                                    error={!!errors.selectedSubService}
                                                    helperText={errors.selectedSubService}
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
                                                    {subService.map((option) => (
                                                        <MenuItem key={option.sub_srv_id} value={option.sub_srv_id}
                                                            sx={{ fontSize: "14px", }}>
                                                            {selectedService && (
                                                                <>
                                                                    {option.recommomded_service}
                                                                </>
                                                            )}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            <Grid container spacing={1} sx={{ mt: 2, ml: 1 }}>
                                                <Grid item lg={6} sm={6} xs={6}>
                                                    <TextField
                                                        required
                                                        id="start_date"
                                                        name="start_date"
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
                                                        inputProps={{
                                                            min: getCurrentDateTimeString(),
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item lg={6} sm={6} xs={6}>
                                                    <TextField
                                                        required
                                                        id="end_date"
                                                        name="end_date"
                                                        label="End Date"
                                                        type="date"
                                                        value={endDate}
                                                        onChange={handleEndDateChange}
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
                                                        error={endDateError !== '' || !!errors.endDate}
                                                        helperText={endDateError || errors.endDate}
                                                        inputProps={{
                                                            min: getCurrentDateTimeString(),
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Grid container spacing={1} sx={{ mt: 2, ml: 1 }}>
                                                <Grid item lg={6} sm={6} xs={6}>
                                                    <TextField
                                                        required
                                                        id="start_time"
                                                        name="start_time"
                                                        label="Start Time"
                                                        type="time"
                                                        value={startTime}
                                                        onChange={(e) => setStartTime(e.target.value)}
                                                        // format="HH:mm:ss"
                                                        // step="3600" min="00:00" max="23:59" pattern="[0-2][0-9]:[0-5][0-9]"
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
                                                        error={!!errors.startTime}
                                                        helperText={errors.startTime}
                                                    // inputProps={{
                                                    //     min: getCurrentDateTimeString(),
                                                    // }}
                                                    />
                                                </Grid>

                                                <Grid item lg={6} sm={6} xs={6}>
                                                    <TextField
                                                        required
                                                        id="end_time"
                                                        name="end_time"
                                                        label="End Time"
                                                        type="time"
                                                        value={endTime}
                                                        onChange={(e) => setEndTime(e.target.value)}
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
                                                        error={!!errors.endTime}
                                                        helperText={errors.endTime}
                                                    // inputProps={{
                                                    //     min: getCurrentDateTimeString(), // Set min to current date and time
                                                    // }}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Grid item lg={12} sm={12} xs={12}>
                                                <TextField
                                                    id="prof_prefered"
                                                    select
                                                    name="prof_prefered"
                                                    label="Preferred Professional"
                                                    value={selectedProfGender}
                                                    onChange={handleDropdownProfGender}
                                                    size="small"
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    sx={{
                                                        textAlign: "left", '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                >
                                                    {profGender.map((option) => (
                                                        <MenuItem key={option.gender_id} value={option.gender_id}
                                                            sx={{ fontSize: "14px", }}>
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            <Grid item lg={12} sm={12} xs={12}>
                                                <TextField
                                                    id="remark"
                                                    name="remark"
                                                    label="Remark"
                                                    placeholder='write remark here'
                                                    size="small"
                                                    fullWidth
                                                    value={remark}
                                                    onChange={(e) => setRemark(e.target.value)}
                                                    sx={{
                                                        '& input': {
                                                            fontSize: '14px',
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    )}

                                    <Grid item lg={12} sm={12} xs={12} sx={{ ml: 1 }}>
                                        <Grid container spacing={1}>
                                            <Grid xs={(selectedDiscountId === 3 || selectedDiscountId === 4 || selectedDiscountId === 5) ? 12 : 6} sx={{ marginTop: 1 }}>
                                                <TextField
                                                    id="outlined-select-percentage"
                                                    name="discount_type"
                                                    select
                                                    label="Discount Type"
                                                    value={enqToServicePay.discount_type ? enqToServicePay.discount_type : selectedDiscountId}
                                                    onChange={(e) => {
                                                        setSelectedDiscountId(e.target.value);
                                                        setEnqToServicePay((prev) => ({ ...prev, discount_type: e.target.value }));
                                                    }}
                                                    // onChange={(e) => enqToServicePay.discount_type ? handleFieldChange("discount_type", e.target.value) : setSelectedDiscountId(e.target.value)}
                                                    size="small"
                                                    fullWidth
                                                    sx={{
                                                        textAlign: "left",
                                                        '& input': {
                                                            fontSize: '12px',
                                                        },
                                                    }}
                                                >
                                                    {discount.map((option) => (
                                                        <MenuItem key={option.discount_id} value={option.discount_id}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            <Grid item xs={6}>
                                                {selectedDiscountId === 1 && (
                                                    <TextField
                                                        id="discount-percentage"
                                                        name="discount_value"
                                                        label="Discount in %"
                                                        size="small"
                                                        fullWidth
                                                        type="number"
                                                        value={enqToServicePay.discount_value ? enqToServicePay.discount_value : discountValue}
                                                        onChange={handleDiscountChange}
                                                        error={!isDiscountValueValid()}
                                                        helperText={!isDiscountValueValid() && 'This is required'}
                                                        sx={{
                                                            textAlign: "left",
                                                            '& input': {
                                                                fontSize: '16px',
                                                            },
                                                        }}
                                                    />
                                                )}

                                                {selectedDiscountId === 2 && (
                                                    <TextField
                                                        id="discount-currency"
                                                        name="discount_value"
                                                        label="Discount in ₹"
                                                        size="small"
                                                        fullWidth
                                                        type="number"
                                                        value={enqToServicePay.discount_value ? enqToServicePay.discount_value : discountValue}
                                                        onChange={handleDiscountChange}
                                                        error={!isDiscountValueValid()}
                                                        helperText={!isDiscountValueValid() && 'This is required'}
                                                        sx={{
                                                            textAlign: "left",
                                                            '& input': {
                                                                fontSize: '16px',
                                                            },
                                                        }}
                                                    />
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item lg={12} sm={12} xs={12}>
                                        <Box component="form" sx={{ p: "2px 4px", display: 'flex', alignItems: 'center', height: '2.4rem', backgroundColor: "#CBE3FF", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", }}>
                                            <Typography sx={{ ml: 1, }}>
                                                Amount:
                                            </Typography>
                                            <InputBase
                                                sx={{ ml: 1, flex: 1, }}
                                                inputProps={{ 'aria-label': 'Amount' }}
                                                // name={totalDiscount ? "final_amount" : "Total_cost"}
                                                // value={totalDiscount ? `₹${totalDiscount}` : `₹${calculatedAmount}`}

                                                // name={totalDiscount !== null && totalDiscount !== undefined ? "final_amount" : "Total_cost"}
                                                // value={`₹${selectedDiscountId === 4 ? parseFloat(totalAmount).toFixed(2) : totalDiscount !== null && totalDiscount !== undefined ? totalDiscount : calculatedAmount}`}
                                                name={totalDiscount !== null && totalDiscount !== undefined ? "final_amount" : "Total_cost"}
                                                // value={`₹${(selectedDiscountId === 4 ? parseFloat(totalAmount).toFixed(2) : (discountValue === '' || discountValue === null) ? totalAmount : totalDiscount !== null && totalDiscount !== undefined ? totalDiscount : calculatedAmount)}`}

                                                // value={`₹${(selectedDiscountId === 4 ? parseFloat(calculatedAmount).toFixed(2) : (discountValue === '' || discountValue === null) ? calculatedAmount : totalDiscount !== null && totalDiscount !== undefined ? totalDiscount : calculatedAmount)}`}

                                                // value={`₹${(selectedDiscountId === 4 ? parseFloat(calculatedAmount).toFixed(2) : (selectedDiscountId === 3 ? 0 : (discountValue === '' || discountValue === null) ? calculatedAmount : totalDiscount !== null && totalDiscount !== undefined ? totalDiscount : calculatedAmount))}`}
                                                // value={enqToServicePay ? enqToServicePay.final_amount : `₹${(selectedDiscountId === 4 ? parseFloat(calculatedAmount).toFixed(2) : (discountValue === '' || discountValue === null) ? calculatedAmount : totalDiscount !== null && totalDiscount !== undefined ? totalDiscount : calculatedAmount)}`}
                                                value={enqToServicePay.final_amount ? enqToServicePay.final_amount : (
                                                    selectedDiscountId === 3 ? 0 :
                                                        `₹${(selectedDiscountId === 4 ? parseFloat(calculatedAmount).toFixed(2) :
                                                            (discountValue === '' || discountValue === null) ? calculatedAmount :
                                                                totalDiscount !== null && totalDiscount !== undefined ? totalDiscount :
                                                                    calculatedAmount)}`
                                                )}
                                            // value={enqToServicePay ? (enqToServicePay.final_amount || `₹${(selectedDiscountId === 4 ? parseFloat(calculatedAmount).toFixed(2) : (discountValue === '' || discountValue === null) ? calculatedAmount : totalDiscount !== null && totalDiscount !== undefined ? totalDiscount : calculatedAmount)}`) : calculatedAmount}
                                            />
                                            {/* <RemoveRedEyeOutlinedIcon onClick={handleOpenAmount} sx={{ mr: 2, cursor: "pointer" }} /> */}
                                        </Box>
                                        {/* <Modal
                                            open={openAmount}
                                            onClose={handleCloseAmount}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box sx={{ ...style, width: 400, borderRadius: "10px" }}>
                                                <div style={{ display: "flex" }}>
                                                    <Typography sx={{ pl: 2, fontSize: 18, fontWeight: 600, }} color="text.secondary" gutterBottom>Amount Details</Typography>
                                                    <Button onClick={handleCloseAmount} sx={{ ml: 24, color: "gray", }}><CloseIcon /></Button>
                                                </div>
                                                <div style={{ display: "flex" }}>
                                                    <Typography sx={{ pl: 2 }} color="text.secondary" variant="body1">
                                                        Amount: ₹{enqToServicePay ? enqToServicePay.Total_cost : calculatedAmount}
                                                    </Typography>
                                                </div>

                                                {selectedDiscountId === 1 || selectedDiscountId === 2 || selectedDiscountId === 3 || selectedDiscountId === 4 ? (
                                                    <>
                                                        <Typography sx={{ pl: 2 }} color="text.secondary" variant="body1">
                                                            Discount Type: {enqToServicePay ? enqToServicePay.discount_type === 1 ? "%" : enqToServicePay.discount_type === 2 ? "₹" : "Complementary" : selectedDiscountId === 1 ? "%" : selectedDiscountId === 2 ? "₹" : selectedDiscountId === 3 ? "Complementary" : "VIP"}
                                                        </Typography>
                                                        <Typography sx={{ pl: 2 }} color="text.secondary" variant="body1">
                                                            Discount Value: {enqToServicePay ? enqToServicePay.discount_value : selectedDiscountId === 3 || selectedDiscountId === 4 ? "None" : discountValue}
                                                        </Typography>
                                                    </>
                                                ) : (null)}

                                                <hr />
                                                <div style={{ display: "flex" }}>
                                                    <Typography sx={{ pl: 2 }} variant="body1">
                                                        Total Amount:
                                                    </Typography>
                                                    <InputBase
                                                        sx={{ ml: 1, mt: -0.5 }}
                                                        inputProps={{ 'aria-label': 'Amount' }}
                                                        value={enqToServicePay ? enqToServicePay.final_amount : (
                                                            selectedDiscountId === 3 ? 0 :
                                                                `₹${(selectedDiscountId === 4 ? parseFloat(calculatedAmount).toFixed(2) :
                                                                    (discountValue === '' || discountValue === null) ? calculatedAmount :
                                                                        totalDiscount !== null && totalDiscount !== undefined ? totalDiscount :
                                                                            calculatedAmount)}`
                                                        )}
                                                    />
                                                </div>

                                            </Box>
                                        </Modal> */}
                                    </Grid>
                                </Grid>

                                {/* </Grid> */}
                                {/* </Grid> */}
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
                <Grid>
                    {selectedCall !== 2 && (
                        <Button variant="contained" sx={{ marginTop: "6px", width: '30ch', backgroundColor: '#69A5EB', borderRadius: "12px", textTransform: "capitalize", }} onClick={(event) => handleSubmit(event, "CreateService")}>Create Service</Button>
                    )}
                    {selectedCall === 2 && (
                        <Button variant="contained" sx={{ marginTop: "6px", width: '30ch', backgroundColor: '#69A5EB', borderRadius: "12px", textTransform: "capitalize", }} type="submit" onClick={(event) => handleSubmit(event, "Enquiry")}>Save Enquiry</Button>
                    )}
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
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
export default Addservice

