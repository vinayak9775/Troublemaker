import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Box, Button, Snackbar, AppBar, Alert, CircularProgress, Checkbox, Tooltip, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, Card, CardContent, Stack, Typography, TextField, Menu, Autocomplete, Modal, MenuItem, Table, TableHead, TableRow, TableBody, TableContainer, TablePagination } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
// import CalendarComponent from './Professional/calendar/CalendarComponent';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CalenderView from './Viewservice/CalenderView';
import PatientView from './Viewservice/PatientView';
import CircleIcon from '@mui/icons-material/Circle';
import ServiceInfo from './Addservice/ServiceInfo';
import CallerView from './Viewservice/CallerView';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from "react-multi-date-picker";
import EditImage from "../../assets/editing.png";
import { styled } from '@mui/material/styles';
import Payment from './Viewservice/Payment';
import Footer from '../../Footer';
import Navbar from '../../Navbar';
import dayjs from "dayjs";

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

const ViewServiceCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: '#FFFFFF',
    boxShadow: '4px 4px 10px 7px rgba(100, 135, 135, 0.05)',
    height: "52px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: 'white',
        cursor: 'pointer',
    },
});

const calculateDateCount = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
};

const searchBy = [
    {
        value: 1,
        label: 'Home location distance',
    },
    {
        value: 2,
        label: 'Work location distance',
    },
];

const Viewservice = () => {
    const navigate = useNavigate();
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const location = useLocation();
    const { eventID, patientID, callerID, eventPlanID, startTime, endTime, rescheduleDate, sessionDate, flag, paymentStatus } = location.state;
    console.log('111111111', startTime, endTime, rescheduleDate, sessionDate);
    // console.log('fffffffffffffff, paydonemmmmmmmmmmm', flag, paydone);
    console.log('service request data', patientID, callerID, eventPlanID, eventID, flag, paymentStatus);

    // const eventValue = location.state?.eventValue;
    const payStatus = paymentStatus || false;

    const [profID, setProfID] = useState('');
    const [cityID, setCityID] = useState('');
    const [caller, setCaller] = useState('');
    const [service, setService] = useState('');
    const [patient, setPatient] = useState('');
    const [hospital, setHospital] = useState('');
    const [serviceID, setserviceID] = useState('');
    const [ptnZoneID, setPtnZoneID] = useState('');
    const [searchProf, setSearchProf] = useState('');
    const [professional, setProfessional] = useState([]);
    const [selectedProfessional, setSelectedProfessional] = useState('');
    const [selectedSearchID, setSelectedSearchID] = useState('1')

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);

    const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
    const [selectedProfessionalEvents, setSelectedProfessionalEvents] = useState([]);

    const [zone, setZone] = useState([]);
    const [zoneID, setZoneID] = useState("");
    const [remark, setRemark] = useState(null)
    const [payment, setPayment] = useState({});
    const [denialReason, setDenialReason] = useState([])
    const [selectedDenialReason, setSelectedDenialReason] = useState('');

    const [openDenial, setOpenDenial] = useState(false);
    const [openCaller, setOpenCaller] = useState(false);
    const [openPatient, setOpenPatient] = useState(false);
    const [openService, setOpenService] = useState(false);
    const [openCalender, setOpenCalender] = useState(false);
    const [openAllocation, setOpenAllocation] = useState(false);
    const [openAllocateRemark, setOpenAllocateRemark] = useState(false);

    const [value, setValue] = useState('2');
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showActions, setShowActions] = useState(true);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openSnackbar1, setOpenSnackbar1] = useState(false);

    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDetails, setModalDetails] = useState([]);

    const [convnce, setConvnce] = useState(0);
    const [calculateConvnce, setCalculateConvnce] = useState(0);
    const [viewConvenience, setViewConvenience] = useState('no');
    const [openConvenience, setOpenConvenience] = useState(false);

    const [convnceCharge, setConvnceCharge] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [toDateError, setToDateError] = useState('');
    const [selected, setSelected] = useState([]);
    const [selectedDates, setSelectedDates] = useState({});
    const [profAvail, setProfAvail] = useState([]);

    const [values, setValues] = useState([]);
    const [chooseDates, setChooseDates] = useState([]);
    const [dateCount, setDateCount] = useState(0);
    const [blockedDates, setBlockedDates] = useState([]);
    const [eventDates, setEventDates] = useState([]);

    const [srvProfDateAndId, setSrvProfDateAndId] = useState({});
    const [srvProfDateAndId1, setSrvProfDateAndId1] = useState({});

    const [dateRangesByProfId, setDateRangesByProfId] = useState({});
    const [selectedProf, setSelectedProf] = useState([]);
    const srvProfIdRef = useRef(null);

    console.log('Professional IDs with Date and Convenience charge:', srvProfDateAndId);

    //Models
    const handleOpenAllocateRemark = () => setOpenAllocateRemark(true);
    const handleCloseAllocateRemark = () => setOpenAllocateRemark(false);

    const handleOpenCaller = () => setOpenCaller(true);
    const handleCloseCaller = () => setOpenCaller(false);

    const handleOpenPatient = () => setOpenPatient(true);
    const handleClosePatient = () => setOpenPatient(false);

    const handleOpenService = () => setOpenService(true);
    const handleCloseService = () => setOpenService(false);

    const handleOpenCalender = () => setOpenCalender(true);
    const handleCloseCalender = () => setOpenCalender(false);

    const handleOpenDenial = () => setOpenDenial(true);
    const handleCloseDenial = () => setOpenDenial(false);

    const handleOpenAllocation = () => setOpenAllocation(true);
    const handleCloseAllocation = () => setOpenAllocation(false);

    const handleSearchIDChange = (event) => {
        setSelectedSearchID(event.target.value);
        console.log("hiiiii roshhhhhh", selectedSearchID)
    };

    const handleDateChange = (newValues) => {
        setValues(newValues || []);
        setErrors({ values: '' });
    };

    // Multi range select dates
    useEffect(() => {
        if (values.length > 0) {
            const dateRanges = values.map(range => {
                if (range && range.length === 2) {
                    const startDate = range[0]?.format('YYYY-MM-DD');
                    const endDate = range[1]?.format('YYYY-MM-DD');
                    return [startDate, endDate];
                } else if (range && range.length === 1) {
                    const singleDate = range[0]?.format('YYYY-MM-DD');
                    return [singleDate, singleDate];
                }
                return ['', ''];
            });
            const totalDates = dateRanges.reduce((count, [start, end]) => {
                if (start && end) {
                    return count + calculateDateCount(start, end);
                }
                return count;
            }, 0);
            setChooseDates(dateRanges);
            setDateCount(totalDates);
        } else {
            setChooseDates([]);
            setDateCount(0);
        }
    }, [values]);

    console.log('Selected Date range:', chooseDates);
    console.log('Selected Date count:', dateCount);

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

    // Professional Avaiability with different colors
    const availDates = profAvail?.available_days || [];
    const busyDates = profAvail?.busy_days || [];
    const leaveDates = profAvail?.leave_days || [];
    const unAvailDates = profAvail?.unavailable_days || [];

    // Enabled calender only service start to end date
    // const startDate = new Date(service.start_date);
    // let endDate = dayjs(service.end_date);
    // endDate = endDate.add(1, 'day');

    const mapDays = ({ date, today, selectedDate }) => {
        const dateString = date.format('YYYY-MM-DD');

        if (busyDates.includes(dateString)) {
            return {
                disabled: true,
                style: { backgroundColor: '#E5492F', color: "white", pointerEvents: 'none', cursor: 'not-allowed' }
            };
        }
        if (leaveDates.includes(dateString)) {
            return {
                disabled: true,
                style: { backgroundColor: '#FABC23', color: "white", pointerEvents: 'none', cursor: 'not-allowed' }
            };
        }
        if (unAvailDates.includes(dateString)) {
            return {
                disabled: true,
                style: { backgroundColor: '#9E9E9E', color: "white", pointerEvents: 'none', cursor: 'not-allowed' }
            };
        }
        // if (availDates.includes(dateString)) {
        //     return {
        //         style: { backgroundColor: '#98B433' }
        //     };
        // }

        // if (date < startDate || date > endDate || blockedDates.includes(dateString)) {
        //     return {
        //         disabled: true,
        //         style: { color: "#ccc" },
        //     };
        // }

        if (availDates.includes(dateString)) {
            if (blockedDates.includes(dateString)) {
                return {
                    disabled: true,
                    style: { backgroundColor: '#DAF1DE', color: "#51DDAB", pointerEvents: 'none', cursor: 'not-allowed' }
                };
            }
            return {
                style: { backgroundColor: '#51DDAB', color: "white", }
            };
        }

        // if (!eventDates.includes(dateString)) {
        //     return {
        //         disabled: true,
        //         style: { color: "#ccc" },
        //     };
        // }
        if (flag === 3) {
            if (!rescheduleDate.includes(dateString)) {
                return {
                    disabled: true,
                    style: { color: "#ccc" },
                };
            }
        } else {
            if (!eventDates.includes(dateString)) {
                return {
                    disabled: true,
                    style: { color: "#ccc" },
                };
            }
        }
        if (blockedDates.includes(dateString)) {
            return {
                disabled: true,
                style: { backgroundColor: 'lightgray', color: "white", pointerEvents: 'none', cursor: 'not-allowed' }
            };
        }
        return {};
    };

    const [errors, setErrors] = useState({
        // fromDate: '',
        // toDate: '',
        values: '',
    });

    const handleDateEmptyField = () => {
        const newErrors = {};

        // if (!fromDate) {
        //     newErrors.fromDate = 'From date is required';
        // }
        // if (!toDate) {
        //     newErrors.toDate = 'To date is required';
        // }
        if (values.length === 0) {
            newErrors.values = 'Please select a date';
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

    const handleSnackbarClose1 = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar1(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleFromDateChange = (event) => {
        setFromDate(event.target.value);
        validateToDate(event.target.value, toDate);
    };

    const handleToDateChange = (event) => {
        setToDate(event.target.value);
        validateToDate(fromDate, event.target.value);
    };

    const validateToDate = (start, end) => {
        if (start && end) {
            const startDateObj = new Date(start);
            const endDateObj = new Date(end);

            if (endDateObj < startDateObj) {
                setToDateError("To date can't be earlier than the from date");
            }
            // else if (endDateObj.toISOString() === startDateObj.toISOString()) {
            //     setEndDateError("End date time cannot be the same as the start date time");
            // } 
            else {
                setToDateError('');
            }
        } else {
            setToDateError('');
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDenialReasonChange = (event) => {
        setSelectedDenialReason(event.target.value);
    };

    const handleChangeAction = (event) => {
        setShowActions(event.target.checked);
    };

    // const handleOpenConvenience = (srv_prof_id) => {
    //     setOpenConvenience(true);
    //     console.log("handleOpenConvenience....", srv_prof_id);
    //     srvProfIdRef.current = srv_prof_id;
    // };

    const handleOpenConvenience = (srv_prof_id) => {
        setOpenConvenience(srv_prof_id);
        setValues([]);
        setConvnce(0);
        setViewConvenience('no');
    };

    const handleSaveConvenience = (srv_prof_id) => {
        const isDateFieldEmpty = handleDateEmptyField();
        if (!isDateFieldEmpty) {
            const dateRanges = values.map(range => {
                if (range && range.length === 2) {
                    const startDate = range[0]?.format('YYYY-MM-DD');
                    const endDate = range[1]?.format('YYYY-MM-DD');
                    return [startDate, endDate];
                } else if (range && range.length === 1) {
                    const singleDate = range[0]?.format('YYYY-MM-DD');
                    return [singleDate, singleDate];
                }
                return ['', ''];
            });

            const convnceCharge = viewConvenience === 'yes' ? parseInt(convnce, 10) : 0;

            setSrvProfDateAndId(prevState => ({
                ...prevState,
                [srv_prof_id]:
                    [dateRanges, convnceCharge]

            }));

            setSrvProfDateAndId1(prevState => ({
                ...prevState,
                [srv_prof_id]:
                    dateRanges

            }));

            setSelectedProf(prevState => [...prevState, srv_prof_id]);

            // setDateRangesByProfId(prevState => ({
            //     ...prevState,
            //     [srv_prof_id]: dateRanges
            // }));

            const formattedDateRanges = dateRanges.map(range => {
                return range.length === 2 ? `${range[0]} to ${range[1]}` : range[0];
            }).join(', ');

            setDateRangesByProfId(prevState => ({
                ...prevState,
                [srv_prof_id]: formattedDateRanges
            }));

            // Add the selected dates to blockedDates
            const newBlockedDates = [];
            dateRanges.forEach(([start, end]) => {
                let current = dayjs(start);
                const endDate = dayjs(end);
                while (current.isBefore(endDate) || current.isSame(endDate)) {
                    newBlockedDates.push(current.format('YYYY-MM-DD'));
                    current = current.add(1, 'day');
                }
            });
            setBlockedDates(prevState => [...prevState, ...newBlockedDates]);
            setOpenConvenience(false);
        } else {
            console.log('Date field is required.');
        }
    };

    const handleCloseConvenience = (srv_prof_id) => {
        // setConvnce('');
        // setConvnceCharge('');
        // setViewConvenience('no');
        // setFromDate('');
        // setToDate('');
        // const newSelected = selected.filter((id) => id !== srv_prof_id);
        // setSelected(newSelected);
        // setOpenConvenience(false);
        setConvnce(0);
        setViewConvenience('no');
        setValues([]);
        setOpenConvenience(null);
        const updatedSelectedDates = { ...chooseDates };
        delete updatedSelectedDates[srv_prof_id];
        setChooseDates(updatedSelectedDates);
    };

    const handleRadioChange = (e, srv_prof_id) => {
        // setViewConvenience(e.target.value);
        if (e && e.target) {
            setViewConvenience(e.target.value);
        }
        srvProfIdRef.current = srv_prof_id;
    };

    const handleClick = (event, srv_prof_id) => {
        const selectedIndex = selected.indexOf(srv_prof_id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, srv_prof_id];
        } else {
            newSelected = selected.filter((id) => id !== srv_prof_id);
        }
        console.log("Selected Professional Id", newSelected);
        setSelected(newSelected);

        handleOpenConvenience(srv_prof_id);
        // handleOpenConvenience(newSelected[newSelected.length - 1]);
        handleRadioChange()
        onSlelect(newSelected)
    };

    const isSelected = (srv_prof_id) => selected.indexOf(srv_prof_id) !== -1;

    const onSlelect = () => {
        if (openConvenience && selected.length > 0) {
            setSelectedDates(prevSelectedDates => {
                const newSelectedDates = { ...prevSelectedDates };

                // Remove dates for professionals that are no longer selected
                Object.keys(newSelectedDates).forEach((srv_prof_id) => {
                    if (!selected.includes(parseInt(srv_prof_id))) {
                        const deletedEntry = { [srv_prof_id]: newSelectedDates[srv_prof_id] };
                        console.log("Removed Professional with dates..", deletedEntry);
                        delete newSelectedDates[srv_prof_id];
                        // delete { [srv_prof_id]: newSelectedDates[srv_prof_id] };
                    }
                });

                if (selected.length > 0) {
                    const currentSrvProfId = selected[selected.length - 1];

                    if (!newSelectedDates[currentSrvProfId]) {
                        newSelectedDates[currentSrvProfId] = [
                            fromDate.toString().split('T')[0],
                            toDate.toString().split('T')[0],
                            viewConvenience,
                        ];
                        console.log("heellllooo", newSelectedDates[currentSrvProfId])
                    } else {
                        newSelectedDates[currentSrvProfId][0] = fromDate.toString().split('T')[0];
                        newSelectedDates[currentSrvProfId][1] = toDate.toString().split('T')[0];
                        newSelectedDates[currentSrvProfId][2] = viewConvenience;
                    }
                }
                console.log("Selected Professional with Dates....", newSelectedDates);
                return newSelectedDates;
            });
        }
    };

    useEffect(() => {
        onSlelect();
    }, [openConvenience, fromDate, toDate, viewConvenience, selected]);

    useEffect(() => {
        const getCallerDetails = async () => {
            if (callerID) {
                try {
                    // const res = await fetch(`${port}/web/Caller_details_api/${callerID}`);
                    const res = await fetch(`${port}/web/Caller_details_api/${callerID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Caller Details ID wise", data);
                    setCaller(data.caller);
                    // setRelation(data.caller.caller_rel_id);
                } catch (error) {
                    console.error("Error fetching Caller Details ID wise:", error);
                }
            }
        };
        getCallerDetails();
    }, [callerID]);

    useEffect(() => {
        const getPatientDetails = async () => {
            if (patientID) {
                console.log("Patient ID", patientID)
                try {
                    const res = await fetch(`${port}/web/patient_detail_info_api/${patientID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Patient Details ID wise", data);
                    setPatient(data.patient);
                    setHospital(data.hospital);
                    setCityID(data.patient.city_id.city_id);
                    console.log("Patient Details zone", data.patient.prof_zone_id.prof_zone_id);
                    setPtnZoneID(data.patient.prof_zone_id.prof_zone_id);
                    // const ptnZoneID = data.patient.prof_zone_id.prof_zone_id
                    // localStorage.setItem("ptnZoneID", ptnZoneID)

                } catch (error) {
                    console.error("Error fetching Patient Details ID wise:", error);
                }
            }
        };
        getPatientDetails();
    }, [patientID]);

    useEffect(() => {
        const getServiceDetails = async () => {
            if (eventPlanID) {
                try {
                    // const res = await fetch(`${port}/web/Service_requirment_api/${eventPlanID}`);
                    const res = await fetch(`${port}/web/Service_requirment_api/${eventPlanID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Service Details ID wise", data);
                    setService(data.services);
                    setserviceID(data.services.srv_id.srv_id);
                    console.log("Service ID....", data.services.srv_id.srv_id)
                } catch (error) {
                    console.error("Error fetching Service Details ID wise:", error);
                }
            }
        };
        getServiceDetails();
    }, [eventPlanID]);

    useEffect(() => {
        const getPaymentDetails = async () => {
            if (eventID) {
                try {
                    const res = await fetch(`${port}/web/get_payment_details/${eventID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Payment Payment Details ID wise.....", data);
                    setPayment(data);
                } catch (error) {
                    console.error("Error fetching Payment Details ID wise:", error);
                }
            }
        };
        getPaymentDetails();
    }, [eventID]);

    useEffect(() => {
        const getZone = async () => {
            if (cityID) {
                try {
                    const res = await fetch(`${port}/web/agg_hhc_zone_api/${cityID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Zone List.........", data);
                    setZone(data);
                } catch (error) {
                    console.error("Error fetching Zone List:", error);
                }
            }
        };
        getZone();
    }, [cityID]);

    // Professional GET API
    useEffect(() => {
        const getProfessional = async () => {
            if (ptnZoneID) {
                setLoading(true);
                try {
                    let apiUrl = `${port}/web/agg_hhc_event_professional_api/?home_loc=${selectedSearchID}&zone=${ptnZoneID}&eve_poc_id=${eventPlanID}`;
                    // let apiUrl = `${port}/web/agg_hhc_event_professional_api`;
                    console.log("apiUrl", apiUrl)
                    if (zoneID) {
                        // apiUrl = `${port}/web/agg_hhc_event_professional_api/?zone=${zoneID}&srv=${serviceID}`;
                        apiUrl = `${port}/web/agg_hhc_event_professional_api/?zone=${zoneID}&eve_poc_id=${eventPlanID}`;
                        console.log("apiUrl", apiUrl)
                    } else if (searchProf) {
                        apiUrl = `${port}/web/agg_hhc_event_professional_api/?zone=${zoneID}&eve_poc_id=${eventPlanID}&srv=${serviceID}&prof_name=${searchProf}`;
                        console.log("apiUrl", apiUrl)
                    }
                    const res = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Professional List.........", data);
                    if (data["not found"] === "Record not found") {
                        setProfessional([]);
                        setLoading(false);
                    } else if (data["Not found"] === "Professionals for this service is not available for now.") {
                        console.log("Professionals for this service is not available");
                        setProfessional([]);
                        setLoading(false);
                    } else {
                        setProfessional(data);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("Error fetching Professional List:", error);
                    setLoading(false);
                }
            };
        }
        getProfessional();
    }, [ptnZoneID, selectedSearchID, eventPlanID, zoneID, serviceID, searchProf]);

    useEffect(() => {
        const getCancelReason = async () => {
            try {
                const res = await fetch(`${port}/web/professional_Denial_api`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Denial Reason.........", data);
                setDenialReason(data);
            } catch (error) {
                console.error("Error fetching Cancel by with Reason:", error);
            }
        }
        getCancelReason();
    }, []);

    // Convienence charge GET API
    useEffect(() => {
        const getConvenience = async () => {
            if (eventID && selectedProfessional) {
                console.log("eve, prof ID", eventID, selectedProfessional)
                try {
                    const res = await fetch(`${port}/web/add_convinance_charges/${eventID}/${selectedProfessional}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Convenience charge.........", data.day_convinance);
                    setConvnce(data.day_convinance);
                    // setCalculateConvnce(data.day_convinance);
                } catch (error) {
                    console.error("Error fetching Convenience:", error);
                }
            }
        };
        getConvenience();
    }, [eventID, selectedProfessional]);

    useEffect(() => {
        setCalculateConvnce(convnce * dateCount);
    }, [convnce, dateCount]);

    useEffect(() => {
        const getConvenienceDatewise = async () => {
            if (fromDate && toDate && convnce) {
                console.log("fromDate && toDate && convnce", fromDate, toDate, convnce)
                try {
                    const res = await fetch(`${port}/web/conveniance_charges_count/${fromDate}/${toDate}/${convnce}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Convenience charge datewise.........", data.conve_charge);
                    setConvnceCharge(data.conve_charge);
                } catch (error) {
                    console.error("Error fetching Convenience:", error);
                }
            }
        };
        getConvenienceDatewise();
    }, [fromDate, toDate, convnce]);

    const handleConvnceChargeChange = (event) => {
        setConvnceCharge(event.target.value);
    };

    const formatDate = (dateString) => {
        const dateTime = new Date(dateString);
        const day = dateTime.getDate().toString().padStart(2, '0'); // Get day with leading zero
        const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Get month with leading zero
        const year = dateTime.getFullYear();
        // const hours = dateTime.getHours() % 12 || 12; // Get hours in 12-hour format
        // const minutes = dateTime.getMinutes().toString().padStart(2, '0'); // Get minutes with leading zero
        // const ampm = dateTime.getHours() >= 12 ? 'PM' : 'AM'; // Determine AM or PM
        // console.log("Time........:", hours, minutes, ampm)

        // return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
        return `${day}/${month}/${year}`;
    };

    const handleProfessionalSelect = (profId) => {
        const selectedProfessional = professional.find((item) => item.srv_prof_id === profId);
        if (selectedProfessional) {
            console.log("selectedProfessional....", selectedProfessional.srv_prof_id)
            setProfID(selectedProfessional.srv_prof_id);
            handleAllocation(selectedProfessional.srv_prof_id);
        }
    };

    const handleEventSelect = (professionalID) => {
        console.log("Selected professionalID.....>>>", professionalID);
        if (professional.length > 0) {
            const selectedProfessional = professional.find((item) => item.srv_prof_id === professionalID);
            if (selectedProfessional) {
                setSelectedProfessional(selectedProfessional.srv_prof_id);
                console.log("Selected Professional.....>>>", selectedProfessional.srv_prof_id);
            } else {
                console.log("Professional not found.");
            }
        } else {
            console.log("Professional list is empty.");
        }
    };

    useEffect(() => {
        const getProfessionalEvent = async () => {
            if (selectedProfessional) {
                console.log("Selected Professional Id......>>>", selectedProfessional);
                try {
                    const res = await fetch(`${port}/web/agg_hhc_detailed_event_plan_of_care/?pro=${selectedProfessional}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    // console.log("Professional Against All Events......", data);
                    if (data === 'not found') {
                        setSelectedProfessionalEvents([]);
                        setIsEventDetailsModalOpen(false);
                    } else {
                        setSelectedProfessionalEvents(data);
                        setIsEventDetailsModalOpen(true);
                    }
                } catch (error) {
                    console.error("Error fetching Professional All Events:", error);
                }
            }
            else {
                setSelectedProfessionalEvents([]);
                setIsEventDetailsModalOpen(false);
            }
        };
        getProfessionalEvent();
    }, [selectedProfessional]);

    //Check Professional Avialability (Leave,Busy,Available)
    // useEffect(() => {
    //     const getProfAvail = async () => {
    //         if (eventPlanID && selectedProfessional) {
    //             console.log("EPOC ID, Prof ID", eventPlanID, selectedProfessional)
    //             try {
    //                 const res = await fetch(`${port}/web/agg_hhc_busydays_profs_api/?eve_poc_id=${eventPlanID}&pro=${selectedProfessional}`, {
    //                     headers: {
    //                         'Authorization': `Bearer ${accessToken}`,
    //                         'Content-Type': 'application/json',
    //                     },
    //                 });
    //                 const data = await res.json();
    //                 console.log("Check Prof Availability.........", data);
    //                 setProfAvail(data.Data);
    //             } catch (error) {
    //                 console.error("Error fetching Check Prof Avail:", error);
    //             }
    //         }
    //     };
    //     getProfAvail();
    // }, [eventPlanID, selectedProfessional]);

    useEffect(() => {
        const getProfAvail = async () => {
            if (eventPlanID && selectedProfessional) {
                // const dates = eventDates;
                let dates;
                if (flag === 3) {
                    dates = [rescheduleDate];
                    console.log("date_roshni_111111111...........", dates)
                } else {
                    dates = eventDates;
                    console.log("date_roshni_222222222...........", dates)
                }
                try {
                    const res = await fetch(`${port}/web/agg_hhc_busydays_profs_api/?eve_poc_id=${eventPlanID}&pro=${selectedProfessional}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            data: dates
                        }),
                    });
                    const data = await res.json();
                    console.log("Check Prof Availability.........", data);
                    setProfAvail(data.Data);
                } catch (error) {
                    console.error("Error fetching Check Prof Avail:", error);
                }
            }
        };
        getProfAvail();
    }, [eventPlanID, selectedProfessional]);

    console.log("ProfAvailability.....", profAvail)

    useEffect(() => {
        const getServiceDates = async () => {
            if (eventID) {
                try {
                    const res = await fetch(`${port}/web/get_event_dates/${eventID}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    // console.log("Events dates......", data);
                    setEventDates(data.dates);
                } catch (error) {
                    console.error("Events dates error:", error);
                }
            }
        };
        getServiceDates();
    }, [eventID]);

    console.log("Events dates......", eventDates);

    async function handleConsentForm(event) {
        if (event) {
            event.preventDefault();
        }
        // event.preventDefault();
        console.log('preventtttttttttttttttt');

        if (eventID) {
            try {
                const response = await fetch(`${port}/concent_sms/${eventID}`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}`);
                    return;
                }
                const result = await response.json();
                console.log("Successfully Hitting Consent Data", result);
            } catch (error) {
                console.error("Error fetching Consent Data:", error);
            }
        }
    }

    async function handleAllocation(profID) {
        // event.preventDefault();
        const requestData = {
            eve_id: eventID,
            srv_prof_id: profID,
            srv_id: serviceID,
        };
        console.log("Professional Allocation API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/allocate_api`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Prof Allocation details.....", result);
            navigate('/ongoing');
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    async function handleBroadcasting(event) {
        event.preventDefault();
        if (eventID) {
            try {
                const response = await fetch(`${port}/web/FindProfessionalBySubService/${eventID}/`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    // body: JSON.stringify(requestData),
                });
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}`);
                    return;
                }
                const result = await response.json();
                console.log("Successfully Hitting Broadcasting data", result);
                // window.location.reload();
            } catch (error) {
                console.error("Error fetching Broadcasting:", error);
            }
        }
    }

    async function handleDenial(profID) {
        // event.preventDefault();
        const requestData = {
            eve_id: eventID,
            srv_prof_id: profID,
            reason_note: remark,
            Reason_lst_id: selectedDenialReason,
            // added_by: added_by,
        };
        console.log("Denial API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/professional_Denial_api`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            // console.log("Results.....", result);
            handleCloseDenial();
            // window.location.reload();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    async function handleMultiAllocation1(event) {
        console.log('pppppppppppppp', values.length);
        console.log('pppppppppppppp', flag);
        if (values.length > 0) {
            if (flag === 1) {
                handleMultiAllocation();
                setTimeout(() => {
                    navigate('/ongoing');
                }, 2000);
            } else if (flag === 2) {
                handleOpenAllocateRemark();
            } else if (flag === 3) {
                handleOpenAllocateRemark();
            } else {
                handleMultiAllocation();
                setTimeout(() => {
                    navigate('/ongoing');
                }, 2000);
            }
        }
        else if (values.length <= 0) {
            setOpenSnackbar1(true);
        }
    }

    // async function handleMultiAllocation1(event) {
    //     handleMultiAllocation();
    //     if (flag === '1') {
    //         handleMultiAllocation(); // Use await if handleMultiAllocation is asynchronous
    //         console.log('flag 1');

    //     } else if (flag === '2') {
    //         if (values.length > 0) {
    //             handleOpenAllocateRemark(); // Assuming handleOpenAllocateRemark is synchronous
    //             // Uncomment the following block if needed and ensure it works as expected
    //             // if (openAllocateRemark === false) {
    //             //     await handleMultiAllocation();
    //             // }
    //             console.log('flag 2');

    //         }
    //     }
    // }

    async function handleMultiAllocation(event) {
        // if (values.length > 0) {
        //     handleOpenAllocateRemark();
        // }
        handleCloseAllocateRemark()
        console.log(values, 'selected dateeeeeeeeeeeeeeeee');

        // event.preventDefault();

        const filteredDates = Object.fromEntries(
            Object.entries(selectedDates)
                .filter(([key, value]) => value.every(item => item !== ""))
            // Object.entries(selectedDates)
            //     .filter(([key, value]) => value.every(item => item !== ""))
            //     .map(([key, value]) => [key, value[value.length - 1]])
        );
        const requestData = {
            flag_id: flag,
            eve_id: eventID,
            // srv_prof_date_and_id: selectedDates,
            // srv_prof_date_and_id: filteredDates,
            // conve_charge: convnce,
            // start_date: service.start_date,
            // end_date: service.end_date,
            caller_id: callerID,
            agg_sp_pt_id: patientID,
            srv_prof_date_and_id: srvProfDateAndId,
            // "srv_prof_date_and_id":{"120":[[["2024-04-08, 2024-04-09"]],500],"157":[[["2024-04-11, 2024-04-11"]],0],"2":[[["2024-04-10, 2024-04-10"]],127]}
        };

        if (flag === 2) {
            console.log("Remark value:", remark);
            requestData.remark = remark;
            requestData.srv_prof_date_and_id = srvProfDateAndId1
        }
        if (flag === 3) {
            console.log("Remark value:", remark);
            requestData.flag_id = flag;
            requestData.eve_id = eventID;
            requestData.session_date = sessionDate;
            requestData.srv_prof_date_and_id = srvProfDateAndId1;
            requestData.remark = remark;
            requestData.start_time = startTime;
            requestData.end_time = endTime;

        }
        console.log("Multiple Professional Allocation......", requestData)
        try {
            const response = await fetch(`${port}/web/multiple_allocate_api`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            // if (!response.ok) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }
            const result = await response.json();
            console.log("Multiple Prof Allocation.....", result);
            if (result.message === "professional already Allocated") {
                console.log(`Professional already allocated on ${result.date}`);
                setOpenSnackbar(true);
                setSnackbarMessage('Professional has already been assigned for the dates you selected.');
                setSnackbarSeverity('warning');
                // setModalDetails(result.date);
                // handleOpenModal();
            } else if (result.message === "Select proper dates") {
                console.log("Please select all dates");
                setOpenSnackbar(true);
                // setSnackbarMessage('Please choose dates according to the service requirements.');
                setSnackbarMessage('Please select dates based on service requirements.')
                setSnackbarSeverity('error');
            } else {
                console.log("Allocation successful");
                setOpenSnackbar(true);
                setSnackbarMessage('Allocation done successfullyl!!.');
                setSnackbarSeverity('success');
                // handleConsentForm();
                console.log('before');

                handleConsentForm(event);
                console.log('after');

                setTimeout(() => {
                    navigate('/ongoing');
                }, 2000);
            }
            handleCloseAllocateRemark();
            console.log('lllllll');

            setTimeout(() => {
                navigate('/ongoing');
            }, 2000);

        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <>
            <Navbar />
            <Box sx={{ mt: 14.6, ml: 1, mr: 1, typography: 'body1', mb: 2 }}>
                <Box sx={{ flexGrow: 1, width: "100%", pt: 1 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <Grid item xs={12}>
                                <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>CALLER DETAILS</Typography>
                                            <Button style={{ height: "2rem" }} onClick={handleOpenCaller}><img src={EditImage} style={{ height: "20px" }} alt="" /></Button>
                                        </Stack>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Contact Number</Typography>
                                            <Typography inline variant="body2" style={{ marginLeft: "15px" }}>{caller ? caller.phone : ""}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Name</Typography>
                                            <Typography inline variant="body2">{caller ? caller.caller_fullname : ""}</Typography>
                                        </Grid>

                                        {/* <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}> */}
                                        {/* <Typography inline variant="body2" color="text.secondary">Relation</Typography> */}
                                        {/* <Typography inline variant="body2">{caller.caller_rel_id.relation}</Typography> */}
                                        {/* <Typography inline variant="body2">Friend</Typography> */}
                                        {/* </Grid> */}

                                        <Modal
                                            open={openCaller}
                                            onClose={handleCloseCaller}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box sx={{ ...style, width: 300, borderRadius: "10px" }}>

                                                <AppBar position="static" style={{
                                                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                    width: '22.8rem',
                                                    height: '3rem',
                                                    marginTop: '-16px',
                                                    marginLeft: "-32px",
                                                    borderRadius: "8px 10px 0 0",
                                                }}>
                                                    <div style={{ display: "flex" }}>
                                                        <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px" }}>CALLER DETAILS</Typography>
                                                        <Button onClick={handleCloseCaller} sx={{ marginLeft: "9rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                                    </div>
                                                </AppBar>
                                                <CallerView caller={caller} clrID={callerID} onClose={handleCloseCaller} />
                                            </Box>
                                        </Modal>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid xs={12} >
                                <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px', marginTop: "10px" }}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>PATIENT DETAILS</Typography>
                                            <Button style={{ height: "2rem" }} onClick={handleOpenPatient}><img src={EditImage} style={{ height: "20px" }} alt="" /></Button>
                                        </Stack>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Contact Number</Typography>
                                            <Typography inline variant="body2">{patient ? patient.phone_no : ""}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Email</Typography>
                                            <Typography inline variant="body2">{patient ? patient.patient_email_id : ""}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Name</Typography>
                                            <Typography inline variant="body2">{patient ? patient.name : ""}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Gender</Typography>
                                            <Typography inline variant="body2">{patient ? patient.gender_id === 1 ? 'Male' : 'Female' : ""}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Age</Typography>
                                            <Typography inline variant="body2">{patient ? patient.Age : ""} Years</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Consultant</Typography>
                                            <Typography inline variant="body2">{patient.doct_cons_id ? patient.doct_cons_id.cons_fullname : ""}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Remark</Typography>
                                            <Typography inline variant="body2">{patient ? patient.Suffered_from : ""}</Typography>
                                        </Grid>

                                        {/* <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Preferred Hospital</Typography>
                                            <Typography inline variant="body2">{patient.preferred_hosp_id ? patient.preferred_hosp_id.hospital_name : "-" }</Typography>
                                        </Grid> */}

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Zone</Typography>
                                            <Typography inline variant="body2">{patient.prof_zone_id ? patient.prof_zone_id.Name : '-'}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "8px" }}>
                                            <Typography inline variant="body2" color="text.secondary">City</Typography>
                                            <Typography inline variant="body2">{patient.city_id ? patient.city_id.city_name : '-'}</Typography>
                                        </Grid>

                                        {/* <Grid container style={{ justifyContent: "space-between", marginTop: "8px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Address</Typography>
                                            <Typography inline variant="body2">{patient ? patient.address : ""}</Typography>
                                        </Grid> */}
                                        <Modal
                                            open={openPatient}
                                            onClose={handleClosePatient}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box sx={{ ...style, width: 400, borderRadius: "10px" }}>

                                                <AppBar position="static" style={{
                                                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                    width: '29rem',
                                                    height: '3rem',
                                                    marginTop: '-16px',
                                                    marginLeft: "-32px",
                                                    borderRadius: "8px 10px 0 0",
                                                }}>
                                                    <div style={{ display: "flex" }}>
                                                        <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px" }}>PATIENT DETAILS</Typography>
                                                        <Button onClick={handleClosePatient} sx={{ marginLeft: "15rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                                    </div>
                                                </AppBar>
                                                <PatientView ptnID={patientID} ptnData={patient} hospData={hospital} onClose={handleClosePatient} />
                                            </Box>
                                        </Modal>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={3}>

                            <Grid item xs={12}>
                                <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px', }}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>SERVICE REQUIREMENTS</Typography>
                                            <Button style={{ height: "2rem" }} onClick={handleOpenService} disabled><img src={EditImage} style={{ height: "20px" }} alt="" /></Button>
                                        </Stack>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary" >Service</Typography>
                                            <Typography inline variant="body2">{service.srv_id ? service.srv_id.service_title : '-'}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary" >Sub Service</Typography>
                                            <Typography inline variant="body2">{service.sub_srv_id ? service.sub_srv_id.recommomded_service : '-'}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Start Date</Typography>
                                            <Typography inline variant="body2">{service ? formatDate(service.start_date) : ""}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">End Date</Typography>
                                            <Typography inline variant="body2">{service ? formatDate(service.end_date) : ""}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Start Time</Typography>
                                            <Typography inline variant="body2">{service ? service.start_time : ""} </Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">End Time</Typography>
                                            <Typography inline variant="body2">{service ? service.end_time : ""}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Preferred Professional</Typography>
                                            <Typography inline variant="body2">{service ? (service.prof_prefered === 1 ? 'Male' : service.prof_prefered === 2 ? 'Female' : "No Preference") : ''}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Remark</Typography>
                                            <Typography inline variant="body2">{service ? service.remark : ""}</Typography>
                                        </Grid>

                                        <Modal
                                            open={openService}
                                            onClose={handleCloseService}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box sx={{ ...style, width: 300, borderRadius: "10px" }}>
                                                <AppBar position="static" style={{
                                                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                    width: '22.8rem',
                                                    height: '3rem',
                                                    marginTop: '-16px',
                                                    marginLeft: "-32px",
                                                    borderRadius: "8px 10px 0 0",
                                                }}>
                                                    <div style={{ display: "flex" }}>
                                                        <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px" }}>SERVICE DETAILS</Typography>
                                                        <Button onClick={handleCloseService} sx={{ marginLeft: "9rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                                    </div>
                                                </AppBar>
                                                <ServiceInfo eveID={eventPlanID} srvData={service} />
                                            </Box>
                                        </Modal>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px', marginTop: "10px" }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="left">
                                            <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>PAYMENT STATUS</Typography>
                                        </Stack>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Total Amount</Typography>
                                            <Typography inline variant="body2">{payment ? payment.Total_Amount : ""} ₹</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Paid</Typography>
                                            <Typography inline variant="body2">{payment ? payment.Paid_Amount : ""} ₹</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Pending Amount</Typography>
                                            <Typography inline variant="body2">{payment ? payment.Pending_Amount : ""} ₹</Typography>
                                        </Grid>
                                        {/* {payment.Pending_Amount === 0 ? (
                                            <Button variant="contained" sx={{ mt: 4, mb:2,
                                                background: '#2CDFAA', borderRadius: '10px', textTransform: "capitalize", '&:hover': {
                                                    backgroundColor: '#2CDFAA',
                                                },
                                            }}><CheckCircleOutlineIcon sx={{ fontSize: "20px", mr: "2px" }} /> Payment Completed</Button>
                                        ) : (
                                            <Button variant="contained" sx={{ mt: 4, mb:2, background: '#69A5EB', borderRadius: '10px', textTransform: "capitalize", }} onClick={handleOpenModal}>Make Payment</Button>
                                        )} */}
                                        {/* <Modal
                                            open={isModalOpen}
                                            onClose={handleCloseModal}
                                            aria-labelledby="modal-title"
                                            aria-describedby="modal-description"
                                        >
                                            <Box sx={{ ...style, width: 300, borderRadius: "10px" }}>
                                                <AppBar position="static" style={{
                                                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                    width: '22.8rem',
                                                    height: '3rem',
                                                    marginTop: '-16px',
                                                    marginLeft: "-32px",
                                                    borderRadius: "8px 10px 0 0",
                                                }}>
                                                    <div style={{ display: "flex" }}>
                                                        <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px" }}>Billing Information</Typography>
                                                        <Button onClick={handleCloseModal} sx={{ marginLeft: "9rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                                    </div>
                                                </AppBar>
                                                <Payment eveID={eventID} pay={payment} ptnData={patient} onClose={handleCloseModal} />
                                            </Box>
                                        </Modal> */}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={6}>
                            <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px', }}>
                                <CardContent>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                                        <Typography sx={{ fontSize: 16, fontWeight: 600 }} color="text.secondary">PROFESSIONAL AVAILABILITY</Typography>
                                        <TextField
                                            id="Name"
                                            placeholder='Search Professional'
                                            size="small"
                                            value={searchProf}
                                            onChange={(e) => setSearchProf(e.target.value)}
                                            sx={{ width: '14ch', textAlign: "left", }}
                                        />

                                        <TextField
                                            id="Name"
                                            size="small"
                                            label="Select"
                                            select
                                            sx={{ width: '14ch', textAlign: "left", }}
                                            value={selectedSearchID}
                                            onChange={handleSearchIDChange}
                                        >
                                            {searchBy.map((option) => (
                                                <MenuItem key={option.value} value={option.value} sx={{ fontSize: '14px' }}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <Autocomplete
                                            id="zone-select"
                                            options={zone}
                                            getOptionLabel={(option) => option.Name}
                                            sx={{ width: '14ch', textAlign: 'left', }}
                                            renderInput={(params) => <TextField {...params} label="Select Zone" size="small"
                                            />}
                                            onChange={(e, selectedOption) => {
                                                if (selectedOption) {
                                                    console.log("selectedOption", selectedOption.prof_zone_id)
                                                    setZoneID(selectedOption.prof_zone_id);
                                                } else {
                                                    setZoneID("");
                                                }
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: '200px',
                                                        // overflowY: 'auto',
                                                    },
                                                },
                                            }}
                                            renderOption={(props, option) => (
                                                <MenuItem
                                                    {...props}
                                                    sx={{ fontSize: '14px' }}
                                                >
                                                    {option.Name}
                                                </MenuItem>
                                            )}
                                        />
                                        {/* <Button variant="contained" sx={{ width: "7.2rem", textTransform: "capitalize", borderRadius: "10px", background: "#FF8F6B" }} onClick={handleBroadcasting}>Broadcast</Button> */}
                                    </Stack>

                                    <Box sx={{ height: "auto", marginTop: "5px", overflowX: 'auto' }}>
                                        <style>
                                            {`
        .custom-scrollbar::-webkit-scrollbar {
            height: 8px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1; 
        }
        `}
                                        </style>
                                        <TableContainer className="custom-scrollbar" sx={{ height: professional.length === 0 || professional.length < 5 ? "48vh" : "default" }}>
                                            <Table sx={{ minWidth: 800 }}>
                                                <TableHead >
                                                    <TableRow>
                                                        <ViewServiceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                                            <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                                <Typography variant='subtitle2'>Professional Name</Typography>
                                                            </CardContent>
                                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                                <Typography variant='subtitle2'>Contact</Typography>
                                                            </CardContent>
                                                            <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                                <Typography variant='subtitle2'>Availability Zone</Typography>
                                                            </CardContent>
                                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                                <Typography variant='subtitle2'>ETA</Typography>
                                                            </CardContent>
                                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                                <Typography variant='body2'>Service Count</Typography>
                                                            </CardContent>
                                                            {/* <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                                                <Typography variant='subtitle2'>Availability</Typography>
                                                            </CardContent>
                                                            <CardContent style={{ flex: 4.5, borderRight: "1px solid #FFFFFF" }}>
                                                                <Typography variant='subtitle2'>Schedule</Typography>
                                                            </CardContent> */}
                                                            <CardContent style={{ flex: 1 }}>
                                                                <Typography variant='subtitle2'>Action</Typography>
                                                            </CardContent>
                                                        </ViewServiceCard>
                                                    </TableRow>
                                                </TableHead>
                                                {loading ? (
                                                    <Box sx={{ display: 'flex', mt: 15, ml: 40, height: '100px', }}>
                                                        <CircularProgress />
                                                    </Box>
                                                ) : (
                                                    <TableBody>
                                                        {professional.length === 0 ? (
                                                            <TableRow>
                                                                <CardContent >
                                                                    <Typography variant="body2">
                                                                        {professional["Not found"] === "Professionals for this service is not available for now."
                                                                            ? "Professionals for this service are not available at the moment."
                                                                            : "No Data Available"}
                                                                        {/* No Data Available */}
                                                                    </Typography>
                                                                </CardContent>
                                                            </TableRow>
                                                        ) : (
                                                            professional.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                                                const isItemSelected = isSelected(row.srv_prof_id);
                                                                const labelId = `enhanced-table-checkbox-${index}`;
                                                                return (
                                                                    <TableRow
                                                                        key={row.srv_prof_id}
                                                                        value={row.srv_prof_id}
                                                                        sx={{
                                                                            '&:last-child td, &:last-child th': { border: 0 },
                                                                        }}
                                                                    >
                                                                        <ViewServiceCard
                                                                            style={{ backgroundColor: selectedProf.includes(row.srv_prof_id) ? '#D0F4F5' : 'white' }}
                                                                        >
                                                                            <CardContent style={{ flex: 2, }}>
                                                                                <Tooltip
                                                                                    title={dateRangesByProfId[row.srv_prof_id]}
                                                                                    // title={dateRangesByProfId[row.srv_prof_id]?.map(({ startDate, endDate }) => `${startDate} to ${endDate}`).join(", ") || "No dates selected"}
                                                                                    placement="right"
                                                                                >
                                                                                    <Typography variant='body2' textAlign="left"
                                                                                        sx={{
                                                                                            mt: "8px",
                                                                                            cursor: srvProfDateAndId[row.srv_prof_id] ? 'default' : 'pointer',
                                                                                        }} onClick={(event) => {
                                                                                            handleEventSelect(row.srv_prof_id)
                                                                                            // handleClick(event, row.srv_prof_id)
                                                                                            // handleOpenConvenience(row.srv_prof_id)
                                                                                            if (!srvProfDateAndId[row.srv_prof_id]) {
                                                                                                handleOpenConvenience(row.srv_prof_id);
                                                                                            }
                                                                                        }}>{row.prof_fullname}</Typography>
                                                                                </Tooltip>

                                                                                <Modal
                                                                                    open={openConvenience === row.srv_prof_id}
                                                                                    onClose={handleCloseConvenience}
                                                                                    aria-labelledby="modal-modal-title"
                                                                                    aria-describedby="modal-modal-description">
                                                                                    <Box sx={{ ...style, width: 350, borderRadius: "5px" }}>
                                                                                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                                                                            <Button onClick={() => handleCloseConvenience(row.srv_prof_id)} sx={{ marginLeft: "20rem", color: "gray" }}><CloseIcon /></Button>

                                                                                            {/* <Grid item lg={6} sm={6} xs={6}>
                                                                                                <TextField
                                                                                                    id="start_date"
                                                                                                    name="start_date"
                                                                                                    label="From Date"
                                                                                                    type="date"
                                                                                                    value={fromDate}
                                                                                                    onChange={handleFromDateChange}
                                                                                                    size="small"
                                                                                                    fullWidth
                                                                                                    variant="standard"
                                                                                                    error={!!errors.fromDate}
                                                                                                    helperText={errors.fromDate}
                                                                                                    sx={{
                                                                                                        '& input': {
                                                                                                            fontSize: '14px',
                                                                                                        },
                                                                                                    }}
                                                                                                    InputLabelProps={{
                                                                                                        shrink: true,
                                                                                                    }}
                                                                                                    inputProps={{
                                                                                                        // min: getCurrentDateTimeString(),
                                                                                                        min: service ? service.start_date : getCurrentDateTimeString(),
                                                                                                        max: service ? service.end_date : undefined,
                                                                                                    }}
                                                                                                />
                                                                                            </Grid>

                                                                                            <Grid item lg={6} sm={6} xs={6}>
                                                                                                <TextField
                                                                                                    id="end_date"
                                                                                                    name="end_date"
                                                                                                    label="To Date"
                                                                                                    type="date"
                                                                                                    value={toDate}
                                                                                                    onChange={handleToDateChange}
                                                                                                    size="small"
                                                                                                    fullWidth
                                                                                                    variant="standard"
                                                                                                    sx={{
                                                                                                        '& input': {
                                                                                                            fontSize: '14px',
                                                                                                        },
                                                                                                    }}
                                                                                                    InputLabelProps={{
                                                                                                        shrink: true,
                                                                                                    }}
                                                                                                    error={toDateError !== '' || !!errors.toDate}
                                                                                                    helperText={toDateError || errors.toDate}
                                                                                                    inputProps={{
                                                                                                        // min: getCurrentDateTimeString(),
                                                                                                        min: service ? service.start_date : getCurrentDateTimeString(),
                                                                                                        max: service ? service.end_date : undefined,
                                                                                                    }}
                                                                                                />
                                                                                            </Grid> */}

                                                                                            <Grid item lg={12} sm={12} xs={12}>
                                                                                                <div style={{ display: "flex" }}>
                                                                                                    <div style={{ display: "flex" }}>
                                                                                                        <CircleIcon style={{ color: "#E5492F", fontSize: '20px' }} />
                                                                                                        <Typography variant='subtitle2' sx={{ ml: 0.5 }}>Busy</Typography>
                                                                                                    </div>
                                                                                                    <div style={{ display: "flex", marginLeft: "10px" }}>
                                                                                                        <CircleIcon style={{ color: "#FABC23", fontSize: '20px' }} />
                                                                                                        <Typography variant='subtitle2' sx={{ ml: 0.5 }}>Leave</Typography>
                                                                                                    </div>
                                                                                                    <div style={{ display: "flex", marginLeft: "10px" }}>
                                                                                                        <CircleIcon style={{ color: "#51DDAB", fontSize: '20px' }} />
                                                                                                        <Typography variant='subtitle2' sx={{ ml: 0.5 }}>Available</Typography>
                                                                                                    </div>
                                                                                                    <div style={{ display: "flex", marginLeft: "10px" }}>
                                                                                                        <CircleIcon style={{ color: "#9E9E9E", fontSize: '20px' }} />
                                                                                                        <Typography variant='subtitle2' sx={{ ml: 0.5 }}>Unavailable</Typography>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </Grid>

                                                                                            <Grid item lg={12} sm={12} xs={12}>
                                                                                                <DatePicker
                                                                                                    multiple
                                                                                                    range
                                                                                                    value={values}
                                                                                                    onChange={handleDateChange}
                                                                                                    placeholder='  YYYY/MM/DD'
                                                                                                    style={{
                                                                                                        height: "30px",
                                                                                                        borderRadius: "4px",
                                                                                                        fontSize: "14px",
                                                                                                        padding: "3px 0px",
                                                                                                    }}
                                                                                                    containerStyle={{
                                                                                                        width: "100%"
                                                                                                    }}
                                                                                                    mapDays={mapDays}
                                                                                                    // minDate={today}

                                                                                                    render={(value, openCalendar) => (
                                                                                                        <TextField
                                                                                                            onClick={openCalendar}
                                                                                                            label='Check Availability and Book *'
                                                                                                            placeholder='YYYY/MM/DD'
                                                                                                            size="small"
                                                                                                            fullWidth
                                                                                                            value={values}
                                                                                                            variant="standard"
                                                                                                            error={!!errors.values}
                                                                                                            helperText={errors.values}
                                                                                                            InputLabelProps={{
                                                                                                                shrink: true,
                                                                                                            }}
                                                                                                            sx={{
                                                                                                                textAlign: "left",
                                                                                                                '& input': {
                                                                                                                    fontSize: '14px',
                                                                                                                },
                                                                                                            }}
                                                                                                            inputProps={{
                                                                                                                // min: getCurrentDateTimeString(),
                                                                                                                min: service ? service.start_date : getCurrentDateTimeString(),
                                                                                                                max: service ? service.end_date : undefined,
                                                                                                            }}
                                                                                                        />
                                                                                                    )}
                                                                                                />
                                                                                            </Grid>
                                                                                            {/* {flag == '1' &&
                                                                                                <Grid item lg={12} sm={12} xs={12} sx={{ mt: 1 }}>
                                                                                                    <FormControl>
                                                                                                        <div style={{ display: "flex" }}>
                                                                                                            <ErrorOutlineIcon style={{ color: "#BC0000", fontSize: "22px", marginRight: "5px" }} />
                                                                                                            <FormLabel id="demo-row-radio-buttons-group-label"> Convenience charges required</FormLabel>
                                                                                                        </div>

                                                                                                        <RadioGroup
                                                                                                            row
                                                                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                                                                            // id="conve_list"
                                                                                                            // name="conve_list"
                                                                                                            value={viewConvenience}
                                                                                                            onChange={(event) => handleRadioChange(event, row.srv_prof_id)}
                                                                                                        >
                                                                                                            <FormControlLabel value="yes" control={<Radio data-srv_prof_id={row.srv_prof_id} />} label="Yes" />
                                                                                                            <FormControlLabel value="no" control={<Radio data-srv_prof_id={row.srv_prof_id} />} label="No" />
                                                                                                        </RadioGroup>
                                                                                                    </FormControl>
                                                                                                    {viewConvenience === 'yes' && (
                                                                                                        <div style={{ display: "felx" }}>
                                                                                                            <TextField
                                                                                                                required
                                                                                                                id="convnceCharge"
                                                                                                                name="convnceCharge"
                                                                                                                label="Day Convenience"
                                                                                                                size="small"
                                                                                                                type="number"
                                                                                                                value={convnce}
                                                                                                                onChange={(e) => setConvnce(e.target.value)}
                                                                                                                variant="standard"
                                                                                                                InputLabelProps={{
                                                                                                                    shrink: true,
                                                                                                                }}
                                                                                                                sx={{
                                                                                                                    textAlign: "left",
                                                                                                                    mt: "10px",
                                                                                                                    '& input': {
                                                                                                                        fontSize: '14px',
                                                                                                                    },
                                                                                                                }}
                                                                                                            />
                                                                                                            <TextField
                                                                                                                required
                                                                                                                id="convnceCharge"
                                                                                                                name="convnceCharge"
                                                                                                                label="Total Convenience"
                                                                                                                size="small"
                                                                                                                // value={convnceCharge}
                                                                                                                // onChange={handleConvnceChargeChange}
                                                                                                                value={calculateConvnce}
                                                                                                                variant="standard"
                                                                                                                InputLabelProps={{
                                                                                                                    shrink: true,
                                                                                                                }}
                                                                                                                sx={{
                                                                                                                    textAlign: "left",
                                                                                                                    mt: "10px", ml: 2,
                                                                                                                    '& input': {
                                                                                                                        fontSize: '14px',
                                                                                                                    },
                                                                                                                }}
                                                                                                            />
                                                                                                        </div>
                                                                                                    )}
                                                                                                </Grid>
                                                                                            } */}

                                                                                            {(flag === 1 && payStatus === false) && 
                                                                                            (
                                                                                                <Grid item lg={12} sm={12} xs={12} sx={{ mt: 1 }}>
                                                                                                    <FormControl>
                                                                                                        <div style={{ display: "flex" }}>
                                                                                                            <ErrorOutlineIcon style={{ color: "#BC0000", fontSize: "22px", marginRight: "5px" }} />
                                                                                                            <FormLabel id="demo-row-radio-buttons-group-label"> Convenience charges required</FormLabel>
                                                                                                        </div>

                                                                                                        <RadioGroup
                                                                                                            row
                                                                                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                                                                                            // id="conve_list"
                                                                                                            // name="conve_list"
                                                                                                            value={viewConvenience}
                                                                                                            onChange={(event) => handleRadioChange(event, row.srv_prof_id)}
                                                                                                        >
                                                                                                            <FormControlLabel value="yes" control={<Radio data-srv_prof_id={row.srv_prof_id} />} label="Yes" />
                                                                                                            <FormControlLabel value="no" control={<Radio data-srv_prof_id={row.srv_prof_id} />} label="No" />
                                                                                                        </RadioGroup>
                                                                                                    </FormControl>
                                                                                                    {viewConvenience === 'yes' && (
                                                                                                        <div style={{ display: "flex" }}>
                                                                                                            <TextField
                                                                                                                required
                                                                                                                id="convnceCharge"
                                                                                                                name="convnceCharge"
                                                                                                                label="Day Convenience"
                                                                                                                size="small"
                                                                                                                type="number"
                                                                                                                value={convnce}
                                                                                                                onChange={(e) => setConvnce(e.target.value)}
                                                                                                                variant="standard"
                                                                                                                InputLabelProps={{
                                                                                                                    shrink: true,
                                                                                                                }}
                                                                                                                sx={{
                                                                                                                    textAlign: "left",
                                                                                                                    mt: "10px",
                                                                                                                    '& input': {
                                                                                                                        fontSize: '14px',
                                                                                                                    },
                                                                                                                }}
                                                                                                            />
                                                                                                            <TextField
                                                                                                                required
                                                                                                                id="convnceCharge"
                                                                                                                name="convnceCharge"
                                                                                                                label="Total Convenience"
                                                                                                                size="small"
                                                                                                                // value={convnceCharge}
                                                                                                                // onChange={handleConvnceChargeChange}
                                                                                                                value={calculateConvnce}
                                                                                                                variant="standard"
                                                                                                                InputLabelProps={{
                                                                                                                    shrink: true,
                                                                                                                }}
                                                                                                                sx={{
                                                                                                                    textAlign: "left",
                                                                                                                    mt: "10px", ml: 2,
                                                                                                                    '& input': {
                                                                                                                        fontSize: '14px',
                                                                                                                    },
                                                                                                                }}
                                                                                                            />
                                                                                                        </div>
                                                                                                    )}
                                                                                                </Grid>
                                                                                            )}

                                                                                            <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                                                                                <Button variant='contained' onClick={() => handleSaveConvenience(row.srv_prof_id)} sx={{ textTransform: "capitalize", marginLeft: "6rem", width: "20ch", borderRadius: "8px" }}>Save</Button>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </Box>
                                                                                </Modal>
                                                                            </CardContent>
                                                                            <CardContent style={{ flex: 1 }}>
                                                                                <Typography variant='body2' textAlign="center">{row.work_phone_no}</Typography>
                                                                            </CardContent>
                                                                            <CardContent style={{ flex: 2 }}>
                                                                                <Typography variant='body2' textAlign="center">{row.prof_zone_name}</Typography>
                                                                            </CardContent>
                                                                            <CardContent style={{ flex: 1 }}>
                                                                                <Typography variant='body2' textAlign="center">{row ? row.zone_distance : "-"}</Typography>
                                                                            </CardContent>
                                                                            <CardContent style={{ flex: 1 }}>
                                                                                <Typography variant='body2' textAlign="center">{row.service_count}</Typography>
                                                                            </CardContent>

                                                                            {/* <CardContent style={{ flex: 0.5 }}>
                                                                                <Typography variant='body2'><AccessTimeOutlinedIcon sx={{ fontSize: "20px", color: "#69A5EB" }}
                                                                                    onClick={() => {
                                                                                        handleOpenCalender();
                                                                                        handleEventSelect(row.srv_prof_id);
                                                                                    }}
                                                                                /></Typography>
                                                                                <Modal
                                                                                    open={openCalender}
                                                                                    onClose={handleCloseCalender}
                                                                                    aria-labelledby="modal-modal-title"
                                                                                    aria-describedby="modal-modal-description"
                                                                                >
                                                                                    <Box sx={{ ...style, width: 900, borderRadius: "5px" }}>
                                                                                        <div style={{ display: "flex" }}>
                                                                                            <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, marginTop: "10px" }}>PROFESSIONAL AVAILABILITY</Typography>
                                                                                            <Button onClick={handleCloseCalender} sx={{ marginLeft: "38rem", color: "gray", }}><CloseIcon /></Button>
                                                                                        </div>
                                                                                        <CalenderView events={selectedProfessionalEvents} />
                                                                                    </Box>
                                                                                </Modal>
                                                                            </CardContent> */}
                                                                            {/* <CardContent style={{ flex: 4.5 }}>
                                                                                <Grid container spacing={1} sx={{ ml: 2 }}>
                                                                                    <Grid item lg={6} sm={6} xs={6}>
                                                                                        <Typography variant="body2">{isSelected(row.srv_prof_id) ? `${selectedDates[row.srv_prof_id]?.[0] || 'dd-mm-yyyy'}` : 'dd-mm-yyyy'}</Typography>
                                                                                    </Grid>
                                                                                    <Grid item lg={6} sm={6} xs={6}>
                                                                                        <Typography variant="body2">{isSelected(row.srv_prof_id) ? `${selectedDates[row.srv_prof_id]?.[1] || 'dd-mm-yyyy'}` : 'dd-mm-yyyy'}</Typography>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </CardContent> */}
                                                                            <CardContent style={{ flex: 1 }}>
                                                                                {/* <IconButton
                                                                            size="large"
                                                                            aria-label="account of current user"
                                                                            aria-controls="menu-appbar"
                                                                            aria-haspopup="true"
                                                                            align="right"
                                                                            onClick={(event) => {
                                                                                handleEventSelect(row.srv_prof_id);
                                                                                handleMenu(event);
                                                                            }}
                                                                            color="inherit"
                                                                        >
                                                                            <MoreHorizOutlinedIcon style={{ fontSize: "18px", cursor: "pointer" }} />
                                                                        </IconButton> */}
                                                                                {/* {showActions && (
                                                                            <Menu
                                                                                id="menu-appbar"
                                                                                anchorEl={anchorEl}
                                                                                anchorOrigin={{
                                                                                    vertical: 'top',
                                                                                    horizontal: 'right',
                                                                                }}
                                                                                keepMounted
                                                                                transformOrigin={{
                                                                                    vertical: 'top',
                                                                                    horizontal: 'right',
                                                                                }}
                                                                                open={Boolean(anchorEl)}
                                                                                onClose={handleClose}
                                                                            >
                                                                                <MenuItem sx={{ color: "#2CDFAA" }}
                                                                                    onClick={(event) => {
                                                                                        event.preventDefault();
                                                                                        // handleProfessionalSelect(row.srv_prof_id);
                                                                                        handleOpenAllocation(row.srv_prof_id);
                                                                                    }}
                                                                                >Allocate</MenuItem>

                                                                                <MenuItem sx={{ color: "#E80054" }}
                                                                                    onClick={(event) => {
                                                                                        event.preventDefault();
                                                                                        handleOpenDenial(row.srv_prof_id);
                                                                                    }}>Denial</MenuItem>
                                                                            </Menu>
                                                                        )} */}

                                                                                {/* <Modal
                                                                            open={openAllocation}
                                                                            onClose={handleCloseAllocation}
                                                                            aria-labelledby="modal-modal-title"
                                                                            aria-describedby="modal-modal-description"
                                                                        >
                                                                            <Box sx={{ ...style, width: 340, borderRadius: "5px" }}>
                                                                                <div style={{ display: "flex" }}>
                                                                                    <Button onClick={handleCloseAllocation} sx={{ marginLeft: "18rem", color: "gray", }}><CloseIcon /></Button>
                                                                                </div>

                                                                                <FormControl>
                                                                                    <FormLabel id="demo-row-radio-buttons-group-label">View convenience charge</FormLabel>
                                                                                    <RadioGroup
                                                                                        row
                                                                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                                                                        name="row-radio-buttons-group"
                                                                                        value={viewConvenience}
                                                                                        onChange={handleRadioChange}
                                                                                    >
                                                                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                                                                    </RadioGroup>
                                                                                </FormControl>
                                                                               
                                                                                {viewConvenience !== '' && (
                                                                                    <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                                                                        <Button
                                                                                            variant="contained"
                                                                                            sx={{ ml: 10, width: "25ch", textTransform: "capitalize", borderRadius: "8px" }}
                                                                                            onClick={() => handleProfessionalSelect(row.srv_prof_id)}
                                                                                        >
                                                                                            Professional Allocate
                                                                                        </Button>
                                                                                    </Grid>
                                                                                )}
                                                                            </Box>
                                                                        </Modal> */}

                                                                                {/* <Modal
                                                                            open={openDenial}
                                                                            onClose={handleCloseDenial}
                                                                            aria-labelledby="modal-modal-title"
                                                                            aria-describedby="modal-modal-description"
                                                                        >
                                                                            <Box sx={{ ...style, width: 300, borderRadius: "5px" }}>
                                                                                <div style={{ display: "flex" }}>
                                                                                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, marginTop: "10px" }}>Denial Reason</Typography>
                                                                                    <Button onClick={handleCloseDenial} sx={{ marginLeft: "8.2rem", color: "gray", }}><CloseIcon /></Button>
                                                                                </div>
                                                                                <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                                                                    <TextField
                                                                                        required
                                                                                        id="Reason_lst_id"
                                                                                        name="Reason_lst_id"
                                                                                        select
                                                                                        label="Denial Reason"
                                                                                        size="small"
                                                                                        value={selectedDenialReason}
                                                                                        onChange={handleDenialReasonChange}
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
                                                                                        {denialReason.map((option) => (
                                                                                            <MenuItem key={option.Reason_lst_id} value={option.Reason_lst_id} sx={{ fontSize: "14px", }}>
                                                                                                {option.reason}
                                                                                            </MenuItem>
                                                                                        ))}
                                                                                    </TextField>
                                                                                </Grid>
                                                                                {selectedDenialReason === 0 ? (
                                                                                    <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                                                                        <TextField
                                                                                            required
                                                                                            id="reason_note"
                                                                                            name="reason_note"
                                                                                            label="Remark"
                                                                                            size="small"
                                                                                            multiline
                                                                                            rows={2}
                                                                                            value={remark}
                                                                                            onChange={(e) => setRemark(e.target.value)}
                                                                                            fullWidth
                                                                                            sx={{
                                                                                                textAlign: "left", '& input': {
                                                                                                    fontSize: '14px',
                                                                                                },
                                                                                            }}
                                                                                        />
                                                                                    </Grid>
                                                                                ) : (null)}
                                                                                <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                                                                    <Button variant='contained' sx={{ ml: 10, width: "8rem", textTransform: "capitalize", borderRadius: "8px" }} onClick={() => handleDenial(row.srv_prof_id)}>Submit</Button>
                                                                                </Grid>
                                                                            </Box>
                                                                        </Modal> */}
                                                                                <Button variant='outlined' sx={{ width: "4rem", textTransform: "capitalize", color: "#D10A0A", border: "none" }} onClick={() => handleOpenDenial(row.srv_prof_id)}>Denial</Button>
                                                                                {/* <Button variant='outlined' sx={{ width: "4rem", textTransform: "capitalize", }} onClick={() => handleProfessionalSelect(row.srv_prof_id)}><HowToRegIcon /></Button> */}

                                                                                <Modal
                                                                                    open={openDenial}
                                                                                    onClose={handleCloseDenial}
                                                                                    aria-labelledby="modal-modal-title"
                                                                                    aria-describedby="modal-modal-description"
                                                                                >
                                                                                    <Box sx={{ ...style, width: 300, borderRadius: "5px" }}>
                                                                                        <div style={{ display: "flex" }}>
                                                                                            <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, marginTop: "10px" }}>Denial Reason</Typography>
                                                                                            <Button onClick={handleCloseDenial} sx={{ marginLeft: "8.2rem", color: "gray", }}><CloseIcon /></Button>
                                                                                        </div>
                                                                                        <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                                                                            <TextField
                                                                                                required
                                                                                                id="Reason_lst_id"
                                                                                                name="Reason_lst_id"
                                                                                                select
                                                                                                label="Denial Reason"
                                                                                                size="small"
                                                                                                value={selectedDenialReason}
                                                                                                onChange={handleDenialReasonChange}
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
                                                                                                {denialReason.map((option) => (
                                                                                                    <MenuItem key={option.Reason_lst_id} value={option.Reason_lst_id} sx={{ fontSize: "14px", }}>
                                                                                                        {option.reason}
                                                                                                    </MenuItem>
                                                                                                ))}
                                                                                            </TextField>
                                                                                        </Grid>
                                                                                        {selectedDenialReason === 0 ? (
                                                                                            <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                                                                                <TextField
                                                                                                    required
                                                                                                    id="reason_note"
                                                                                                    name="reason_note"
                                                                                                    label="Remark"
                                                                                                    size="small"
                                                                                                    multiline
                                                                                                    rows={2}
                                                                                                    value={remark}
                                                                                                    onChange={(e) => setRemark(e.target.value)}
                                                                                                    fullWidth
                                                                                                    sx={{
                                                                                                        textAlign: "left", '& input': {
                                                                                                            fontSize: '14px',
                                                                                                        },
                                                                                                    }}
                                                                                                />
                                                                                            </Grid>
                                                                                        ) : (null)}
                                                                                        <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                                                                            <Button variant='contained' sx={{ ml: 10, width: "8rem", textTransform: "capitalize", borderRadius: "8px" }} onClick={() => handleDenial(row.srv_prof_id)}>Submit</Button>
                                                                                        </Grid>
                                                                                    </Box>
                                                                                </Modal>
                                                                            </CardContent>
                                                                        </ViewServiceCard>
                                                                    </TableRow>
                                                                )
                                                            }))}
                                                    </TableBody>
                                                )}
                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[4, 10, 25, 100]}
                                            component="div"
                                            count={professional.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Box>
                                    <Button variant='contained' startIcon={<HowToRegIcon style={{ fontSize: "25px" }} />} sx={{ textTransform: "capitalize", borderRadius: "10px", width: "22ch", background: "#69A5EB" }}
                                        // onClick={handleOpenAllocateRemark}
                                        onClick={handleMultiAllocation1}>Allocate</Button>
                                    <Snackbar
                                        open={openSnackbar}
                                        autoHideDuration={6000}
                                        onClose={handleSnackbarClose}
                                    >
                                        <Alert variant="filled"
                                            onClose={handleSnackbarClose}
                                            severity={snackbarSeverity}
                                            sx={{ width: '50%', mb: 10, ml: 100 }}
                                        >
                                            {snackbarMessage}
                                        </Alert>
                                    </Snackbar>

                                    <Snackbar
                                        open={openSnackbar1}
                                        autoHideDuration={6000}
                                        onClose={handleSnackbarClose1}
                                    >
                                        <Alert variant="filled"
                                            onClose={handleSnackbarClose1}
                                            severity='error'
                                            sx={{ width: '50%', mb: 10, ml: 100 }}
                                        >
                                            Choose at least one date..!
                                        </Alert>
                                    </Snackbar>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* ====================Remark Modal============== */}
                <Modal
                    open={openAllocateRemark}
                    onClose={handleCloseAllocateRemark}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ ...style, width: 320, borderRadius: "5px" }}>
                        <div style={{ display: "flex" }}>
                            <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, marginTop: "10px" }}>Allocate Remark</Typography>
                            <Button onClick={handleCloseAllocateRemark} sx={{ marginLeft: "8.2rem", color: "gray", }}><CloseIcon /></Button>
                        </div>
                        <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>

                        </Grid>
                        <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                required
                                id="reason_note"
                                name="reason_note"
                                label="Remark"
                                size="small"
                                multiline
                                rows={2}
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                fullWidth
                                sx={{
                                    textAlign: "left", '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>
                            <Button variant='contained' sx={{ ml: 10, width: "8rem", textTransform: "capitalize", borderRadius: "8px" }}
                                onClick={() => handleMultiAllocation()}
                            // onClick={() => handleCloseAllocateRemark}
                            >Submit</Button>
                        </Grid>
                    </Box>
                </Modal>

                <Modal
                    open={isModalOpen}
                    onClose={handleCloseModal}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 360,
                        background: '#FFFFFF',
                        pt: 2,
                        px: 4,
                        pb: 3,
                        borderRadius: "5px",
                    }}>
                        <div style={{ display: "flex", marginTop: "10px" }}>
                            <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, marginTop: "10px", marginLeft: "18px" }}>Professional already allocated</Typography>
                            <Button onClick={handleCloseModal} sx={{ marginLeft: "2rem", color: "gray", marginTop: "2px", }}><CloseIcon /></Button>
                        </div>
                        <div style={{ marginTop: "10px", marginBottom: "15px" }}>
                            <div>
                                {modalDetails.map((item, index) => (
                                    <div key={index}>
                                        <Typography variant='body2' sx={{ ml: 3, mb: 1 }}>{item}</Typography>
                                    </div>
                                ))}
                            </div>
                            {/* <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {modalDetails.map((item, index) => (
                                    <div key={index} style={{ flexBasis: '20%', padding: '5px' }}>
                                        <Typography variant='body2' sx={{ mb: 1 }}>{item}</Typography>
                                    </div>
                                ))}
                            </div> */}
                        </div>
                    </div>
                </Modal>
            </Box>
            <Footer />
        </>
    )
}

export default Viewservice
