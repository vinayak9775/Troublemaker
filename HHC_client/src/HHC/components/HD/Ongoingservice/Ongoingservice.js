import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery, CircularProgress, TextField, Box, Stack, Button, AppBar, InputBase, Menu, MenuItem, Modal, Card, CardContent, Typography, Table, TableHead, TableRow, TableBody, TableContainer, TablePagination, Tooltip, IconButton } from '@mui/material';
import { border, styled } from '@mui/system';
import CircleIcon from '@mui/icons-material/Circle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import { DateRangePicker } from '@mui/x-date-pickers/DateRangePicker';
import Reschedule from './ActionComponents/Reschedule';
import Cancellation from './ActionComponents/Cancellation';
import Professional from './ActionComponents/Professional';
import RecvdPayment from './ActionComponents/RecvdPayment';
import EventDetails from './EventDetails/EventDetails';
import Sessions from './ActionComponents/Sessions';
import Feedback from './ActionComponents/Feedback';
import Invoice from './ActionComponents/Invoice';
import Payment from './../Viewservice/Payment';
import Navbar from '../../../Navbar';
import Footer from '../../../Footer';
// import Header from '../../../Header';
// import Payment from './ActionComponents/Payment';

const customStyles = {
    "& .Mui-focused": {
        outline: 'none',
    },
};
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    pt: 2,
    px: 4,
    pb: 3,
};
const OngoingServiceCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "55px",
    borderRadius: '10px',
    transition: '0.5s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        // cursor: 'pointer',
    },
});

const Ongoingservice = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const accessHospitalID = localStorage.getItem('hospitalID') || 0;
    const [serviceRequest, setServiceRequest] = useState([]);
    const [requestAllocation, setRequestAllocation] = useState({});
    const [eventID, setEventID] = useState('');


    useEffect(() => {
        const getServiceRequest = async () => {
            // if (accessHospitalID) {
            try {
                const res = await fetch(`${port}/web/service_request/${accessHospitalID}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Service Request Data.........", data);
                setServiceRequest(data.event_code);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Service Request Data:", error);
                setLoading(false);
            }
            // }
        };
        getServiceRequest();
    }, [accessHospitalID]);


    // const filteredData1 = serviceRequest.filter(item => {
    //     const isDateMatch = !selectedDate || (item.event_start_date && item.event_start_date.includes(selectedDate));
    //     const isServiceMatch = !selectedService || (item.service_name && item.service_name.toLowerCase().includes(selectedService.toLowerCase()));
    //     const isCallerStatusMatch = !selectedCallerStatus || selectedCallerStatus === 5 || item.caller_status === selectedCallerStatus;

    //     return isDateMatch && isServiceMatch && isCallerStatusMatch;
    // });

      // useEffect(() => {  
        const getRequestAllocation = async () => {
            if (eventID) {
                try {
                    // const res = await fetch(`${port}/web/agg_hhc_srv_req_prof_allocate/${eventID}`);
                    const res = await fetch(`${port}/web/agg_hhc_srv_req_prof_allocate/${eventID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Request Allocation Data.........", data);
                    setRequestAllocation(data);
                    const eventValue = data.Event_ID;
                    const patientValue = data.patient_details.agg_sp_pt_id;
                    const callerValue = data.caller_details.caller_id;
                    const eventPlanValue = data.POC[0].eve_poc_id;

                    console.log("eventID", eventValue);
                    console.log("patientID", patientValue);
                    console.log("callerID", callerValue);
                    console.log("eventPlanID", eventPlanValue);
                    navigate('/viewservice', {
                        state: {
                            patientID: patientValue,
                            callerID: callerValue,
                            eventPlanID: eventPlanValue,
                            eventID: eventValue,
                            flag: 2
                        },
                    });
                } catch (error) {
                    console.error("Error fetching Request Allocation:", error);
                }
            }
        };
        // getRequestAllocation();
    // }, [eventID]);

    const getEventIDRequest = (eveId) => {
        const selectedRequest = serviceRequest.find(item => item.event_id === eveId);
        console.log("Selected Event:", selectedRequest);
        if (selectedRequest) {
            console.log("Selected Event ID:", selectedRequest.event_id);
            setEventID(selectedRequest.event_id);
        }
        getRequestAllocation()
    };

  






    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openReschedule, setOpenReschedule] = useState(false);
    const [openSrvExtend, setOpenSrvExtend] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [openPayment, setOpenPayment] = useState(false);
    const [openProfessional, setOpenProfessional] = useState(false);
    const [openSession, setOpenSession] = useState(false);
    const [openInvoice, setOpenInvoice] = useState(false);
    const [openDetails, setOpenDeatils] = useState(false);
    const [onServices, setOnServices] = useState([]);

    // Usestate for getting data event id wise
    // const [eventID, setEventID] = useState(null);
    const [patientID, setPatientID] = useState(null);

    const [eventCode, setEventCode] = useState(null);
    const [serviceID, setServiceID] = useState(null);
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState(null);
    const [ptnName, setPtnName] = useState(null);
    const [ptnPhn, setPtnPhn] = useState(null);
    const [clrPhn, setClrPhn] = useState(null);
    const [profName, setProfName] = useState(null);
    const [ptnRecord, setPtnRecord] = useState(null);
    const [payAmount, setPayAmount] = useState(null);
    const [sesCount, setSesCount] = useState(null);
    const [payment, setPayment] = useState({});
    const [subSrvID, setSubSrvID] = useState(null);
    const [jobClosureStatus, setJobClosureStatus] = useState(null);
    const [evePlanID, setEvePlanID] = useState(null);
    const [ptnZone, setPtnZone] = useState(null);

    // Usestate for Filter values in input field
    // const [filteredData, setFilteredData] = useState(onServices);
    const filteredData = onServices;
    const [inputType, setInputType] = useState('date');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedProfessional, setSelectedProfessional] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const [filterType, setFilterType] = useState('searchby');
    const [searchValue, setSearchValue] = useState('');
    const [showSearchBox, setShowSearchBox] = useState(false);

    const [tempSearchValue, setTempSearchValue] = useState('');
    const [tempStartDateTime, setTempStartDateTime] = useState('');

    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(true);

    const [tableHeight, setTableHeight] = useState('auto');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const [isInvoicePopup, setIsInvoicePopup] = useState(false);

    const [openRecPayment, setOpenRecPayment] = useState(false);


    /////Anjali's Code Start (FEEDBACK)
    const [openFeedback, setOpenFeedback] = useState(false);
    const [totalSessionCount, setTotalSessionCount] = useState(null);
    const [jobClosureCount, setJobClosureCount] = useState(null);

    const handleOpenFeedback = () => {
        setOpenFeedback(true);
    }
    const handleCloseFeedback = () => {
        setOpenFeedback(false);
        // window.location.reload();
    }
    /////Anjali's Code End

    const toggleInputType = () => {
        setInputType(prevType => (prevType === 'date' ? 'month' : 'date'));
    };
    const handleOpenRecPayment = () => {
        setOpenRecPayment(true);
    };
    const handleCloseRecPayment = () => {
        setOpenRecPayment(false);
    };
    const handleOpenIsInvoice = () => {
        setIsInvoicePopup(true);
    };
    const handleCloseIsInvoice = () => {
        setIsInvoicePopup(false);
    };
    const handleProfChange = (e) => {
        setSelectedProfessional(e.target.value);
        setPage(0);
    };
    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
        setPage(0);
    };
    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
        setPage(0);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleChange = (event) => {
        setAuth(event.target.checked);
    };
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    //Model open and close function
    const handleOpenReschedule = () => {
        setOpenReschedule(true);
    };
    const handleCloseReschedule = () => {
        setOpenReschedule(false);
    };
    const handleOpenSrvExtend = () => {
        setOpenSrvExtend(true);
    };
    const handleCloseSrvExtend = () => {
        setOpenSrvExtend(false);
    };
    const handleOpenCancel = () => {
        setOpenCancel(true);
    };
    const handleCloseCancel = () => {
        setOpenCancel(false);
    };
    const handleOpenPayment = () => {
        setOpenPayment(true);
    };
    const handleClosePayment = () => {
        setOpenPayment(false);
    };
    const handleOpenProfessional = () => {
        setOpenProfessional(true);
    };
    const handleCloseProfessional = () => {
        setOpenProfessional(false);
    };
    const handleOpenSession = () => {
        setOpenSession(true);
    };
    const handleCloseSession = () => {
        setOpenSession(false);
    };
    const handleOpenInvoice = () => {
        setOpenInvoice(true);
    };
    const handleCloseInvoice = () => {
        setOpenInvoice(false);
    };
    const handleOpenDetails = () => {
        setOpenDeatils(true);
    };
    const handleCloseDetails = () => {
        setOpenDeatils(false);
    };

    useEffect(() => {
        const setDynamicHeight = () => {
            const screenHeight = window.innerHeight;
            var tableContainerHeight = screenHeight -
                setTableHeight(tableContainerHeight + 'px');
        };
        setDynamicHeight();
        window.addEventListener('resize', setDynamicHeight);
        return () => {
            window.removeEventListener('resize', setDynamicHeight);
        };
    }, []);

    // useEffect(() => {
    //     const getOngoingServices = async () => {
    //         try {
    //             const res = await fetch(`${port}/web/Ongoing_Event/`, {
    //                 headers: {
    //                     'Authorization': `Bearer ${accessToken}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             });
    //             const data = await res.json();
    //             console.log("Ongoing Services Data.........", data);
    //             setOnServices(data);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching Ongoing Services Data:", error);
    //             setLoading(false);
    //         }
    //     };
    //     getOngoingServices();
    // }, []);

    // useEffect(() => {
    const getOngoingServices = async () => {
        setLoading(true);
        try {
            let apiUrl = `${port}/web/Ongoing_Event/`;
            if (filterType === 'eventCode' && searchValue) {
                apiUrl = `${port}/web/Ongoing_Event/?eve_code=${searchValue}`;
            } else if (filterType === 'ptnPhn' && searchValue) {
                apiUrl = `${port}/web/Ongoing_Event/?patient_no=${searchValue}&date=${startDateTime}`;
            } else if (filterType === 'ptnName' && searchValue) {
                apiUrl = `${port}/web/Ongoing_Event/?patient_name=${searchValue}&date=${startDateTime}`;
            } else if (filterType === 'clrPhn' && searchValue) {
                apiUrl = `${port}/web/Ongoing_Event/?caller_no=${searchValue}&date=${startDateTime}`;
            } else if (filterType === 'profName' && searchValue) {
                apiUrl = `${port}/web/Ongoing_Event/?prof_name=${searchValue}&date=${startDateTime}`;
            } else if (startDateTime) {
                apiUrl = `${port}/web/Ongoing_Event/?date=${startDateTime}`;
            }
            const res = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            console.log("Ongoing Services Data.........", data);
            if (data.msg === 'data not foundf') {
                setOnServices([]);
            } else {
                setOnServices(data);
            }
        } catch (error) {
            console.error("Error fetching Ongoing Services Data:", error);
        } finally {
            setLoading(false);
        }
    };
    // getOngoingServices();
    // }, [filterType, searchValue, startDateTime]);

    useEffect(() => {
        getOngoingServices();
    }, [searchValue, startDateTime]);

    const handleReset = () => {
        setStartDateTime('');
        setTempStartDateTime('');
        setFilterType('searchby');
        setShowSearchBox(false);
        setSearchValue('');
        setTempSearchValue('');
        // setOnServices([]);
        setLoading(false);
    };

    const handleFilterTypeChange = (event) => {
        // setFilterType(event.target.value);
        const value = event.target.value;
        setFilterType(value);
        // setSearchValue('');
        setTempSearchValue('');
        setShowSearchBox(value !== 'searchby');
    };

    const handleTempSearchChange = (event) => {
        setTempSearchValue(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleSubmit = () => {
        // setLoading(true);
        setSearchValue(tempSearchValue);
        setStartDateTime(tempStartDateTime);
        // getOngoingServices();
    };

    const getPlaceholderText = () => {
        switch (filterType) {
            case 'eventCode':
                return 'Search by event code...';
            case 'ptnPhn':
                return 'Search by patient number...';
            case 'ptnName':
                return 'Search by patient name...';
            case 'clrPhn':
                return 'Search by caller number...';
            case 'profName':
                return 'Search by professional name...';
            default:
                return 'Search here...';
        }
    };

    const eventIDRequest = (eveId) => {
        const selectedReschedule = onServices.find(item => item.eve_id === eveId);
        if (selectedReschedule) {
            console.log("Selected Event ID:", selectedReschedule.eve_id);
            // setServiceID(selectedReschedule.srv_prof_id[0].srv_id.srv_id);
            // setStartDateTime(selectedReschedule.srv_prof_id[0].start_date);
            // setEndDateTime(selectedReschedule.srv_prof_id[0].end_date);
            // setPtnPhn(selectedReschedule.agg_sp_pt_id.phone_no);
            // setSubSrvID(selectedReschedule.srv_prof_id[0].sub_srv_id?.sub_srv_id);
            // console.log("Selected Sub Service ID:", selectedReschedule.srv_prof_id[0].sub_srv_id?.sub_srv_id);
            // console.log("Session Jobclosure Status-------:", selectedReschedule.session_status[0].Session_jobclosure_status)
            // setJobClosureStatus(selectedReschedule.session_status[0].Session_jobclosure_status);
            // console.log("Session Jobclosure Status-------:", selectedReschedule.session_status[0].Session_jobclosure_status)
            // setEvePlanID(selectedReschedule.srv_prof_id[0].eve_poc_id)
            // setPtnZone(selectedReschedule.agg_sp_pt_id.prof_zone_id?.prof_zone_id)
            setEventID(selectedReschedule.eve_id);
            setPatientID(selectedReschedule.agg_sp_pt_id.patient_id);
            setEventCode(selectedReschedule.event_code)
            setPtnRecord(selectedReschedule.agg_sp_pt_id);
            setPayAmount(selectedReschedule.payment)
            // setStartDateTime(selectedReschedule.service.start_date);
            setEndDateTime(selectedReschedule.service.end_date);
            setPtnName(selectedReschedule.agg_sp_pt_id.name);
            setPtnPhn(selectedReschedule.agg_sp_pt_id.phone);
            setClrPhn(selectedReschedule.agg_sp_pt_id.caller_phone);
            setProfName(selectedReschedule.job_closure.service_professional);
            setServiceID(selectedReschedule.service.service_id);
            setSubSrvID(selectedReschedule.service.sub_service_id);
            setJobClosureStatus(selectedReschedule.job_closure.job_closure_count);
            setSesCount(selectedReschedule.job_closure.total_session)
            setEvePlanID(selectedReschedule.service.eve_poc_id)
            setPtnZone(selectedReschedule.agg_sp_pt_id.zone_id)

            ////Anjali's Code Start
            console.log("Total Session:", selectedReschedule.job_closure.total_session); // Log total_session
            console.log("Job Closure Count:", selectedReschedule.job_closure.job_closure_count); // Log total_session
            setJobClosureCount(selectedReschedule.job_closure.job_closure_count);
            setTotalSessionCount(selectedReschedule.job_closure.total_session)
            ////Anjali's Code End
        }
    };

    useEffect(() => {
        const getPaymentDetails = async () => {
            if (eventID) {
                console.log("Payment Event ID", eventID)
                try {
                    const res = await fetch(`${port}/web/get_payment_details/${eventID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    // console.log("Payment Payment Details ID wise.....", data);
                    setPayment(data);
                } catch (error) {
                    console.error("Error fetching Payment Details ID wise:", error);
                }
            }
        };
        getPaymentDetails();
    }, [eventID]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Get day with leading zero
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month with leading zero
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const getServiceStatusTooltip = (serviceStatus) => {
        const title =
            serviceStatus === 1
                ? "Service about to end"
                : serviceStatus === 2
                    ? "Acknowledge pending"
                    : serviceStatus === 3
                        ? "Acknowledge by professional"
                        : serviceStatus === 4
                            ? "Closure completed"
                            : serviceStatus === 5
                                ? "Pending for closure"
                                : "";

        const iconColor =
            serviceStatus === 1
                ? "#D61616"
                : serviceStatus === 2
                    ? "#2A1D1D"
                    : serviceStatus === 3
                        ? "#3D8A00"
                        : serviceStatus === 4
                            ? "#1342BA"
                            : serviceStatus === 5
                                ? "#BA139F"
                                : "#000000";

        return (
            <Tooltip title={title} arrow>
                <IconButton>
                    <CircleIcon style={{ color: iconColor, fontSize: '20px' }} />
                </IconButton>
            </Tooltip>
        );
    };

    // useEffect(() => {
    //     const filtered = onServices.filter(item => {

    //         const itemDateMatches = !selectedDate || Object.values(item.service || {}).some(prop => {
    //             if (typeof prop === 'string') {
    //                 return prop.toLowerCase().includes(selectedDate.toLowerCase());
    //             } else if (prop && prop.start_date) {
    //                 const itemDate = new Date(prop.start_date);
    //                 const selected = new Date(selectedDate);
    //                 return itemDate.toDateString() === selected.toDateString();
    //             }
    //             return false;
    //         });

    //         const profNameMatches = !selectedProfessional || Object.values(item.job_closure).some(prop => {
    //             if (typeof prop === 'string') {
    //                 return prop.toLowerCase().includes(selectedProfessional.toLowerCase());
    //             }
    //             return false;
    //         });

    //         const serviceNameMatches = !selectedService || Object.values(item.service || {}).some(prop => {
    //             if (typeof prop === 'string') {
    //                 return prop.toLowerCase().includes(selectedService.toLowerCase());
    //             }
    //             return false;
    //         });

    //         const searchMatches = !searchInput ||
    //             item.event_code.toLowerCase().includes(searchInput.toLowerCase()) ||
    //             item.agg_sp_pt_id.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    //             item.agg_sp_pt_id.phone.toString().includes(searchInput);

    //         return itemDateMatches && profNameMatches && serviceNameMatches && searchMatches;
    //     });

    //     setFilteredData(filtered);
    //     setPage(0);
    // }, [selectedDate, selectedProfessional, selectedService, onServices, searchInput]);

    const handleExtendService = () => {
        navigate('/addservice', { state: { eventID } });
    };

    const handleProfReschedule = () => {
        navigate('/viewservice', { state: { eventID } });
    };

    return (
        <>
            <Navbar />
            <Box sx={{ flexGrow: 1, mt: 14.6, ml: 1, mr: 1, mb: 2 }} >
                <Stack direction={isSmallScreen ? 'column' : 'row'} spacing={1} alignItems={isSmallScreen ? 'center' : 'flex-start'} sx={{ pt: 1 }}>
                    <Typography style={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>ONGOING SERVICES</Typography>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, mr: 1, flex: 1 }}
                            type='date'
                            // value={startDateTime}
                            // onChange={event => setStartDateTime(event.target.value)}
                            value={tempStartDateTime}
                            onChange={event => setTempStartDateTime(event.target.value)}
                        />
                    </Box>

                    {/* <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 245, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Professional |"
                            value={selectedProfessional}
                            // onChange={(e) => setSelectedProfessional(e.target.value)}
                            onChange={handleProfChange}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon style={{ color: "#7AB7EE" }} />
                        </IconButton>
                    </Box> */}

                    {/* <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 245, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1, }}
                            placeholder="Search Service |"
                            value={selectedService}
                            onChange={handleServiceChange}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon style={{ color: "#7AB7EE" }} />
                        </IconButton>
                    </Box> */}

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <TextField
                            select
                            size="small"
                            fullWidth
                            value={filterType}
                            onChange={handleFilterTypeChange}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                }, '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                },
                            }}
                        >
                            <MenuItem value="searchby" disabled>Search by</MenuItem>
                            <MenuItem value="clrPhn" style={{ fontSize: "15px" }}>Caller Number</MenuItem>
                            <MenuItem value="eventCode" style={{ fontSize: "15px" }}>Event Code</MenuItem>
                            <MenuItem value="ptnName" style={{ fontSize: "15px" }}>Patient Name</MenuItem>
                            <MenuItem value="ptnPhn" style={{ fontSize: "15px" }}>Patient Number</MenuItem>
                            <MenuItem value="profName" style={{ fontSize: "15px" }}>Professional Name</MenuItem>
                        </TextField>
                    </Box>
                    {showSearchBox && (
                        <Box
                            component="form"
                            sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                // placeholder="Search here..."
                                placeholder={getPlaceholderText()}
                                // value={searchValue}
                                // onChange={handleSearchChange}
                                value={tempSearchValue}
                                onChange={handleTempSearchChange}
                            />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon style={{ color: "#7AB7EE" }} />
                            </IconButton>
                        </Box>
                    )}
                    {/* <Button variant='contained' onClick={handleSubmit} sx={{ textTransform: "capitalize", height: "40px", borderRadius: "8px", width: "12ch" }}>Submit</Button> */}
                    <Button variant='contained' onClick={handleSubmit} disabled={loading} sx={{ textTransform: "capitalize", height: "40px", borderRadius: "8px", width: "12ch" }}>Submit</Button>
                    <Button variant='outlined' onClick={handleReset} sx={{ textTransform: "capitalize", height: "40px", borderRadius: "8px", width: "12ch" }}>Reset</Button>
                </Stack>

                <TableContainer
                    // style={{ height: tableHeight }}
                    sx={{ height: filteredData.length === 0 || filteredData.length < 5 ? "60vh" : "default" }}
                >
                    <Table>
                        <TableHead >
                            <TableRow >
                                <OngoingServiceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Event Code</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Patient Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Caller No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Professional</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Service Name</Typography>
                                    </CardContent >
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Start Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>End Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Payment Status</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Job Closure</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Added by</Typography>
                                    </CardContent>
                                    {/* <CardContent style={{ width: "5%", borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Status</Typography>
                                    </CardContent> */}
                                    <CardContent style={{ flex: 0.5 }}>
                                        <Typography variant='subtitle2'>Action</Typography>
                                    </CardContent>
                                </OngoingServiceCard>
                            </TableRow>
                        </TableHead>
                        {loading ? (
                            <Box sx={{ display: 'flex', mt: 20, ml: 80, height: '130px', }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <CardContent >
                                            <Typography variant="body2">
                                                No Data Available
                                            </Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <OngoingServiceCard style={{ height: "60px", }}>
                                                    <CardContent style={{ flex: 0.5, }}>
                                                        <Typography variant="body2">
                                                            {index + 1 + page * rowsPerPage}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 2 }}>
                                                        <button
                                                            onClick={() => {
                                                                eventIDRequest(row.eve_id);
                                                                handleOpenDetails();
                                                            }}
                                                            style={{
                                                                border: 'none',
                                                                background: 'none',
                                                                outline: 'none',
                                                                cursor: 'pointer',
                                                                // borderBottom: eventID === row.eve_id ? '2px solid #26C0E2' : 'none',
                                                                height: '40px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}> <Typography variant="body2">{row.event_code}</Typography></button>
                                                        <Modal
                                                            open={openDetails}
                                                            onClose={handleCloseDetails}
                                                            aria-labelledby="parent-modal-title"
                                                            aria-describedby="parent-modal-description"
                                                        >
                                                            <EventDetails eveID={eventID} open={openDetails}
                                                                onClose={handleCloseDetails} />
                                                        </Modal>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 2 }}>
                                                        <Typography variant="body2" textAlign="left">
                                                            {row.agg_sp_pt_id ? row.agg_sp_pt_id.name : ""}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        {/* <div style={{ display: "flex", alignItems: "flex-start", }}>
                                                            <LocalPhoneOutlinedIcon sx={{ color: "#3A974C", fontSize: "18px" }} />
                                                            <Typography variant='body2'>{row.agg_sp_pt_id ? row.agg_sp_pt_id.phone : ""}</Typography>
                                                        </div> */}
                                                        <Typography variant='body2'>{row.agg_sp_pt_id ? row.agg_sp_pt_id.caller_phone : ""}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 2 }}>
                                                        <Typography variant="body2" textAlign="left">
                                                            {/* {row.srv_prof_id[0] ? row.srv_prof_id[0].srv_prof_id?.prof_fullname : ""} */}
                                                            {row.job_closure ? row.job_closure.service_professional : ""}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 2 }}>
                                                        <Typography variant="body2" textAlign="left">
                                                            {/* {row.srv_prof_id[0] ? row.srv_prof_id[0].srv_id.service_title : ""} */}
                                                            {row.service ? row.service.service : ""}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5 }}>
                                                        {/* <div style={{ display: "flex" }}> */}
                                                        {/* <CalendarMonthOutlinedIcon sx={{ color: "#69A5EB", fontSize: "18px" }} /> */}
                                                        <Typography variant="body2">
                                                            {/* {formatDate(row.srv_prof_id[0] ? row.srv_prof_id[0].start_date : "")} */}
                                                            {formatDate(row.service ? row.service.start_date : "")}
                                                        </Typography>
                                                        {/* </div> */}
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5 }}>
                                                        {/* <div style={{ display: "flex" }}> */}
                                                        {/* <CalendarMonthOutlinedIcon sx={{ color: "#69A5EB", fontSize: "18px" }} /> */}
                                                        <Typography variant="body2">
                                                            {/* {formatDate(row.srv_prof_id[0] ? row.srv_prof_id[0].end_date : "")} */}
                                                            {formatDate(row.service ? row.service.end_date : "")}
                                                        </Typography>
                                                        {/* </div> */}
                                                    </CardContent>
                                                    <CardContent style={{ flex: 2 }}>
                                                        {row.payment.pending_amount === 0 ? (
                                                            <div style={{ display: "flex" }}>
                                                                <CheckCircleIcon style={{ fontSize: "16px", color: "#3D8A00" }} />
                                                                <Typography variant="body2" textAlign="left"
                                                                    sx={{ cursor: (row.payment.payment_status === 1 ? "pointer" : "default") }}
                                                                    onClick={row.payment.payment_status === 1 ? () => {
                                                                        eventIDRequest(row.eve_id);
                                                                        handleOpenRecPayment();
                                                                    } : undefined}
                                                                >{row.payment.payment_status === 1 ? 'Received by professional' : 'Received by desk'}</Typography>
                                                            </div>
                                                        ) : (
                                                            <Typography variant="body2" textAlign="left">
                                                                ₹ <span style={{ color: '#DA0000' }}>{parseInt(row.payment.pending_amount, 10).toString()}</span>/{parseInt(row.payment.final_amount, 10).toString()}
                                                            </Typography>
                                                        )}
                                                    </CardContent>

                                                    <Modal
                                                        open={openRecPayment}
                                                        onClose={handleCloseRecPayment}
                                                        aria-labelledby="modal-modal-title"
                                                        aria-describedby="modal-modal-description"
                                                    >
                                                        <Box sx={{ ...style, width: 300, borderRadius: "10px", border: "none" }}>
                                                            <AppBar position="static" style={{
                                                                background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                                width: '22.8rem',
                                                                height: '3rem',
                                                                marginTop: '-16px',
                                                                marginLeft: "-32px",
                                                                borderRadius: "8px 10px 0 0",
                                                            }}>
                                                                <div style={{ display: "flex" }}>
                                                                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "15px" }}>PAYMENT DETAILS</Typography>
                                                                    <Button onClick={handleCloseRecPayment} sx={{ marginLeft: "120px", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                                                </div>
                                                            </AppBar>
                                                            <RecvdPayment eveID={eventID} ptnData={ptnRecord} payAmt={payAmount} sesCount={sesCount} />
                                                        </Box>
                                                    </Modal>

                                                    <CardContent style={{ flex: 1.2 }}>
                                                        <Typography variant="body2">
                                                            {/* {row.session_status[0] ? row.session_status[0].Session_jobclosure_status : ""}/{row.session_status[0] ? row.session_status[0].Total_case_count : ""} */}
                                                            {row.job_closure ? row.job_closure.job_closure_count : ""}/{row.job_closure ? row.job_closure.total_session : ""}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5 }}>
                                                        <Typography variant="body2" textAlign="left">
                                                            {/* {row.session_status[0] ? row.session_status[0].session_done : ""}/{row.session_status[0] ? row.session_status[0].Total_case_count : ""} */}
                                                            {row ? row.added_by : '-'}
                                                        </Typography>
                                                    </CardContent>
                                                    {/* <CardContent style={{ width: "5%" }}>
                                                    <Typography variant="body2">
                                                        {getServiceStatusTooltip(row.srv_prof_id[0].service_status)}
                                                    </Typography>
                                                </CardContent> */}
                                                    <CardContent style={{ flex: 0.5 }}>
                                                        {auth && (
                                                            <div>
                                                                <IconButton
                                                                    size="large"
                                                                    aria-label="account of current user"
                                                                    aria-controls="menu-appbar"
                                                                    aria-haspopup="true"
                                                                    align="right"
                                                                    // onClick={handleMenu}
                                                                    onClick={(event) => {
                                                                        eventIDRequest(row.eve_id);
                                                                        handleMenu(event)
                                                                    }}
                                                                    color="inherit"
                                                                // disabled={row.session_status[0] ? row.session_status[0].Total_case_count : "" === row.session_status[0] ? row.session_status[0].Session_jobclosure_status : ""}
                                                                // disabled={row.session_status[0]?.Session_jobclosure_status === row.session_status[0]?.Total_case_count}

                                                                // disabled={row.job_closure?.job_closure_count === row.job_closure?.total_session}
                                                                >
                                                                    <MoreHorizIcon style={{ fontSize: "18px", cursor: "pointer" }} />
                                                                </IconButton>
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
                                                                    onClose={handleClose} s
                                                                >
                                                                    <MenuItem onClick={() => handleOpenReschedule(() => eventIDRequest(row.eve_id))}>Service Reschedule</MenuItem>
                                                                    <MenuItem onClick={() => handleOpenSrvExtend(() => eventIDRequest(row.eve_id))}>Service Extend</MenuItem>
                                                                    {/* <MenuItem onClick={() => handleOpenProfessional(() => eventIDRequest(row.eve_id))}>Professional Reschedule</MenuItem> */}
                                                                    {/* <MenuItem><Link to='/viewservice' style={{ textDecoration: 'none', color: 'inherit' }}>Professional Reschedule</Link></MenuItem> */}
                                                                    <MenuItem onClick={() => getEventIDRequest(row.eve_id)}>Professional Reschedule</MenuItem>
                                                                    <MenuItem onClick={() => handleOpenCancel(() => eventIDRequest(row.eve_id))}>Service Cancellation</MenuItem>
                                                                    <MenuItem onClick={() => handleOpenPayment(() => eventIDRequest(row.eve_id))}>Make Payment</MenuItem>
                                                                    <MenuItem onClick={() => handleOpenSession(() => eventIDRequest(row.eve_id))}>Closure</MenuItem>
                                                                    <MenuItem onClick={() => handleOpenInvoice(() => eventIDRequest(row.eve_id))}>Invoice</MenuItem>

                                                                    {/* Anjali's Code Start */}
                                                                    <MenuItem onClick={() => handleOpenFeedback(() => eventIDRequest(row.eve_id))}>Feedback</MenuItem>
                                                                    {/* {row.job_closure.job_closure_count === row.job_closure.total_session &&
                                                                    } */}
                                                                    {/* Anjali's Code  End */}

                                                                    {/* <Modal open={isInvoicePopup} onClose={handleCloseIsInvoice}>
                                                                        <Box sx={{ ...style, width: 250, borderRadius: "5px", border: "none" }}>
                                                                            <div style={{ display: "flex", }}>
                                                                                <Typography variant='subtitle2' sx={{ fontSize: "16px", fontWeight: "600", color: "gray" }}>INVOICE DETAILS</Typography>
                                                                                <Button onClick={handleCloseIsInvoice} sx={{ marginLeft: "55px", color: "gray" }}><CloseIcon /></Button>
                                                                            </div>
                                                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                                                                                <Button variant="contained" sx={{ textTransform: "capitalize" }} onClick={() => handleOpenInvoice(() => eventIDRequest(row.eve_id))}>
                                                                                    <RemoveRedEyeOutlinedIcon sx={{ fontSize: "20px" }} /> View
                                                                                </Button>
                                                                                <Button variant="contained" sx={{ textTransform: "capitalize" }}
                                                                                    // onClick={handleButtonClick}
                                                                                >
                                                                                    <FileDownloadOutlinedIcon /> Download
                                                                                </Button>
                                                                            </div>
                                                                        </Box>
                                                                    </Modal> */}

                                                                    <Modal
                                                                        open={openInvoice}
                                                                        onClose={handleCloseInvoice}
                                                                        aria-labelledby="parent-modal-title"
                                                                        aria-describedby="parent-modal-description"
                                                                    >
                                                                        <Invoice eveID={eventID} onClose={handleCloseInvoice} />
                                                                    </Modal>

                                                                    <Modal
                                                                        open={openReschedule}
                                                                        onClose={handleCloseReschedule}
                                                                        aria-labelledby="parent-modal-title"
                                                                        aria-describedby="parent-modal-description"
                                                                    >
                                                                        <Box sx={{ ...style, width: 300, borderRadius: "10px", border: "none" }}>
                                                                            <AppBar position="static" style={{
                                                                                background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                                                width: '22.8rem',
                                                                                height: '3rem',
                                                                                marginTop: '-16px',
                                                                                marginLeft: "-32px",
                                                                                borderRadius: "8px 10px 0 0",
                                                                            }}>
                                                                                <div style={{ display: "flex" }}>
                                                                                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "15px" }}>SERVICE RESCHEDULE</Typography>
                                                                                    <Button onClick={handleCloseReschedule} sx={{ marginLeft: "100px", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                                                                </div>
                                                                            </AppBar>
                                                                            <Reschedule eventID={eventID} eveStartDate={startDateTime} eveEndDate={endDateTime} open={openReschedule} jobClosureStatus={jobClosureStatus}
                                                                                sesCount={sesCount} onClose={handleCloseReschedule} />
                                                                        </Box>
                                                                    </Modal>

                                                                    <Modal
                                                                        open={openSrvExtend}
                                                                        onClose={handleCloseSrvExtend}
                                                                        aria-labelledby="parent-modal-title"
                                                                        aria-describedby="parent-modal-description"
                                                                    >
                                                                        <Box sx={{ ...style, width: 300, borderRadius: "10px", border: "none" }}>
                                                                            <div style={{ display: "flex" }}>
                                                                                <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "gray", marginTop: "10px" }}>SERVICE EXTEND</Typography>
                                                                                <Button onClick={handleCloseSrvExtend} sx={{ marginLeft: "105px", color: "gray", marginTop: "2px", }}><CloseIcon /></Button>
                                                                            </div>
                                                                            <div style={{ marginTop: "25px" }}>
                                                                                <Typography variant='subtitle2'>Are you sure want to extend the service?</Typography>
                                                                                <Button varaint="contained" onClick={handleExtendService} sx={{ backgroundColor: '#7AB8EE', borderRadius: "10px", color: "white", width: "14ch", marginLeft: "100px", marginTop: "25px", textTransform: "capitalize", '&:hover': { backgroundColor: '#5a9bd8', } }}>Yes</Button>
                                                                            </div>
                                                                        </Box>
                                                                    </Modal>

                                                                    <Modal
                                                                        open={openCancel}
                                                                        onClose={handleCloseCancel}
                                                                        aria-labelledby="parent-modal-title"
                                                                        aria-describedby="parent-modal-description"
                                                                    >
                                                                        <Box sx={{ ...style, width: 300, borderRadius: "10px", border: "none" }}>
                                                                            <AppBar position="static" style={{
                                                                                background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                                                width: '22.8rem',
                                                                                height: '3rem',
                                                                                marginTop: '-16px',
                                                                                marginLeft: "-32px",
                                                                                borderRadius: "8px 10px 0 0",
                                                                            }}>
                                                                                <div style={{ display: "flex" }}>
                                                                                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "15px" }}>SERVICE CANCELLATION</Typography>
                                                                                    <Button onClick={handleCloseCancel} sx={{ marginLeft: "6rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                                                                </div>
                                                                            </AppBar>
                                                                            <Cancellation eventID={eventID} subSrvID={subSrvID} jobClosureStatus={jobClosureStatus} endDateTime={endDateTime} onClose={handleCloseCancel} />
                                                                        </Box>
                                                                    </Modal>

                                                                    <Modal
                                                                        open={openPayment}
                                                                        onClose={handleClosePayment}
                                                                        aria-labelledby="parent-modal-title"
                                                                        aria-describedby="parent-modal-description"
                                                                    >
                                                                        <Box sx={{ ...style, width: 300, borderRadius: "10px", border: "none" }}>
                                                                            {/* {payment.Pending_Amount <= 0 ? ( */}
                                                                            {payment === "payment already done" || payment.Pending_Amount === 0 ? (
                                                                                <Button variant="contained" sx={{
                                                                                    mt: 2, ml: 6,
                                                                                    background: '#2CDFAA', borderRadius: '10px', textTransform: "capitalize", '&:hover': {
                                                                                        backgroundColor: '#2CDFAA',
                                                                                    },
                                                                                }}><CheckCircleOutlineIcon sx={{ fontSize: "20px", mr: "2px" }} /> Payment Completed</Button>
                                                                                // <Box sx={{
                                                                                //     background: '#2CDFAA', borderRadius: '10px', height: '40px', '&:hover': {
                                                                                //         backgroundColor: '#2CDFAA',
                                                                                //     },
                                                                                // }}>
                                                                                //     <Typography ><CheckCircleOutlineIcon sx={{ fontSize: "20px", mr: "2px", color: "#ffffff", ml: 2 }} /> Payment Completed</Typography>
                                                                                // </Box>

                                                                            ) : (
                                                                                <>
                                                                                    <AppBar position="static" style={{
                                                                                        background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                                                        width: '22.8rem',
                                                                                        height: '3rem',
                                                                                        marginTop: '-16px',
                                                                                        marginLeft: "-32px",
                                                                                        borderRadius: "8px 10px 0 0",
                                                                                    }}>
                                                                                        <div style={{ display: "flex" }}>
                                                                                            <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "15px" }}>PAYMENT DETAILS</Typography>
                                                                                            <Button onClick={handleClosePayment} sx={{ marginLeft: "8rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                                                                        </div>
                                                                                    </AppBar>
                                                                                    <Payment eveID={eventID} ptnData={ptnRecord} pay={payment} onServices={onServices} />
                                                                                </>
                                                                            )}
                                                                        </Box>
                                                                    </Modal>

                                                                    <Modal
                                                                        open={openProfessional}
                                                                        onClose={handleCloseProfessional}
                                                                        aria-labelledby="parent-modal-title"
                                                                        aria-describedby="parent-modal-description"
                                                                    >
                                                                        <Box sx={{ ...style, width: 300, borderRadius: "10px", border: "none" }}>
                                                                            <AppBar position="static" style={{
                                                                                background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                                                width: '22.8rem',
                                                                                height: '3rem',
                                                                                marginTop: '-16px',
                                                                                marginLeft: "-32px",
                                                                                borderRadius: "8px 10px 0 0",
                                                                            }}>
                                                                                <div style={{ display: "flex" }}>
                                                                                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "15px" }}>PROFESSIONAL RESCHEDULE</Typography>
                                                                                    <Button onClick={handleCloseProfessional} sx={{ marginLeft: "50px", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                                                                </div>
                                                                            </AppBar>
                                                                            <Professional eveID={eventID} serviceID={serviceID} subSrvID={subSrvID} ptnName={ptnName} ptnPhn={ptnPhn} evePlanID={evePlanID} ptnZone={ptnZone} startDateTime={startDateTime} endDateTime={endDateTime} onClose={handleCloseProfessional} />
                                                                        </Box>
                                                                    </Modal>

                                                                    <Modal
                                                                        open={openSession}
                                                                        onClose={handleCloseSession}
                                                                        aria-labelledby="parent-modal-title"
                                                                        aria-describedby="parent-modal-description"
                                                                    >
                                                                        <Box sx={{ ...style, width: 800, borderRadius: "10px", border: "none" }}>
                                                                            <div style={{ display: "flex" }}>
                                                                                <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, marginTop: "10px", marginLeft: "2px", color: "gray", }}>All SESSIONS</Typography>
                                                                                <Button onClick={handleCloseSession} sx={{ marginLeft: "39.5rem", color: "gray", marginTop: "2px", }}><CloseIcon /></Button>
                                                                            </div>
                                                                            <Sessions eveID={eventID} subSrvID={subSrvID} />
                                                                        </Box>
                                                                    </Modal>

                                                                    {/* Anjali's code start */}
                                                                    {totalSessionCount !== null && jobClosureCount !== null && (
                                                                        <Modal
                                                                            open={openFeedback}
                                                                            onClose={handleCloseFeedback}
                                                                            aria-labelledby="parent-modal-title"
                                                                            aria-describedby="parent-modal-description"
                                                                        >
                                                                            {totalSessionCount === jobClosureCount ? (
                                                                                <Box sx={{ ...style, width: '90%', maxWidth: 500, borderRadius: 2, border: 'none' }}>
                                                                                    <AppBar
                                                                                        position="static"
                                                                                        sx={{
                                                                                            background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                                                            width: '35.3em',
                                                                                            height: '3rem',
                                                                                            mt: '-16px',
                                                                                            ml: '-32px',
                                                                                            borderRadius: '8px 10px 0 0',
                                                                                        }}
                                                                                    >
                                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
                                                                                            <Typography
                                                                                                align="center"
                                                                                                sx={{
                                                                                                    fontSize: '16px',
                                                                                                    fontWeight: 600,
                                                                                                    color: '#FFFFFF',
                                                                                                    mt: '10px'
                                                                                                }}
                                                                                            >
                                                                                                FEEDBACK
                                                                                            </Typography>
                                                                                            <Button
                                                                                                onClick={handleCloseFeedback}
                                                                                                sx={{ color: '#FFFFFF', mt: '2px', ml: '76%' }}
                                                                                            >
                                                                                                <CloseIcon />
                                                                                            </Button>
                                                                                        </Box>
                                                                                    </AppBar>
                                                                                    <Feedback eveID={eventID} patId={patientID} />
                                                                                </Box>
                                                                            ) : (
                                                                                <Box sx={{ ...style, width: '80%', maxWidth: 500, borderRadius: 2, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 6 }}>
                                                                                    <Typography variant="body1">
                                                                                        Complete all job closure to open feedback.
                                                                                    </Typography>
                                                                                    <Button
                                                                                        onClick={handleCloseFeedback}
                                                                                        sx={{ color: 'blue' }}
                                                                                    >
                                                                                        <CloseIcon />
                                                                                    </Button>
                                                                                </Box>
                                                                            )}
                                                                        </Modal>
                                                                    )}
                                                                    {/* Anjali's code start */}
                                                                </Menu>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </OngoingServiceCard>
                                            </TableRow>
                                        )
                                        ))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box >
            <Footer />
        </>
    )
}
export default Ongoingservice

