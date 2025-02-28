import React, { useState, useEffect } from 'react';
import LocalPostOfficeOutlinedIcon from '@mui/icons-material/LocalPostOfficeOutlined';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloseIcon from '@mui/icons-material/Close';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Typography, Modal, MenuItem, AppBar, Box, Grid, TextField, Button, Drawer, Snackbar, Alert, Tooltip, Badge, Fab, useMediaQuery, Tab } from '@mui/material';
import { Link, Routes, Route, Outlet, useLocation } from "react-router-dom";
import Addservice from './components/HD/Addservice';
import Viewservice from './components/HD/Viewservice';
import Ongoingservice from './components/HD/Ongoingservice/Ongoingservice';
import ServiceRequest from './components/HD/Servicerequest/ServiceRequest';
import ProfRequest from './components/HD/ProfRequest/ProfRequest';
import Enquiries from './components/HD/Enquiries/Enquiries';
import Schedule from './components/HD/Professional/Schedule';
import Dashboard from './components/HD/Dashboard/Dashboard';
import Membership from './components/HD/Membership/Membership';
import Footer from "./Footer";
import Navbar from "./Navbar";
import "./Header.css";

const Header = () => {
  // const accessHospital = sessionStorage.getItem('selectedHospital');
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const addedby = localStorage.getItem('clg_id');
  const location = useLocation();

  const [ptnName, setPtnName] = useState('');
  const [ptnNumber, setPtnNumber] = useState('');
  const [service, setService] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [value, setValue] = useState('1');

  const [showComponent, setShowComponent] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, setState] = useState({ right: false });
  const [dayPrint, setDayPrint] = useState({ right: false });
  const [callback, setCallback] = useState([]);
  const [isBlinking, setIsBlinking] = useState(false);
  const [profID, setProfID] = useState('');
  const [remark, setRemark] = useState('');
  const [remarkError, setRemarkError] = useState({ remark: '' });

  const [hospital, setHospital] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [date, setDate] = useState('');
  const [dayPrintErrors, setDayPrintErrors] = useState({ date: '', selectedHospital: '' });

  const [enqNotify, setEnqNotify] = useState(0);
  const [srvNotify, setSrvNotify] = useState(0);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [ptnNumberError, setPtnNumberError] = useState('');
  const [errors, setErrors] = useState({ ptnName: '', ptnNumber: '', selectedService: '', });

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ right: open });
  };

  const toggleDrawerDayPrint = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDayPrint({ right: open });
  };

  const handleDropdownHospital = (event) => {
    const selectedHospital = event.target.value;
    setSelectedHospital(selectedHospital);
  };

  const handleEmptyField = () => {
    const newErrors = {};

    if (!ptnName) {
      newErrors.ptnName = 'Name is required';
    }
    if (!ptnNumber) {
      newErrors.ptnNumber = 'Mobile No is required';
    }
    if (!selectedService) {
      newErrors.selectedService = 'Service is required';
    }
    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error !== '');
  };

  const handleEmptyRemark = () => {
    const newErrors = {};

    if (!remark) {
      newErrors.remark = 'Remark is required';
    }
    setRemarkError(newErrors);
    return Object.values(newErrors).some((error) => error !== '');
  };

  const handleEmptyDayPrint = () => {
    const newErrors = {};

    if (!date) {
      newErrors.date = 'This is required';
    }
    if (!selectedHospital) {
      newErrors.selectedHospital = 'This is required';
    }
    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error !== '');
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

  const handleSMSOpen = () => setIsModalOpen(true);
  const handleSMSClose = () => setIsModalOpen(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function formatTime(originalTime) {
    return new Date(originalTime).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC', // Assuming your input time is in UTC
    });
  }

  const convertTimeFormat = (timeString) => {
    const date = new Date(timeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  // useEffect(() => {
  //   if (location.pathname === '/dashboard') setValue('1');
  //   else if (location.pathname === '/addservice') setValue('2');
  //   else if (location.pathname === '/ongoing') setValue('3');
  //   else if (location.pathname === '/professional') setValue('4');
  //   else if (location.pathname === '/service-request') setValue('5');
  //   else if (location.pathname === '/enquiries') setValue('6');
  //   else if (location.pathname === '/membership') setValue('7');
  //   // else if (location.pathname === '/viewservice') setValue('8');
  // }, [location]);

  const handleDropdownService = (event) => {
    const selectedService = event.target.value;
    setSelectedService(selectedService);
  };

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await fetch(`${port}/web/enquiry_Service_Notification_count/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        // console.log("Notificationsss.........", data);
        setEnqNotify(data.enquiry_notification_count);
        setSrvNotify(data.service_request_count);
      } catch (error) {
        console.error("Error fetching Notificationsss:", error);
      }
    };
    getNotifications();
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
        // console.log("Service Data.........", data);
        setService(data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    getService();
  }, []);

  const fetchCallbackData = async () => {
    try {
      const res = await fetch(`${port}/web/call_back_notification_api`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      // console.log("Call Back.........", data);
      setCallback(data);
      setIsBlinking(data.length > 0);
    } catch (error) {
      console.error("Error fetching Call Back:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCallbackData();
      const interval = setInterval(fetchCallbackData, 5000);
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  useEffect(() => {
    const getHospital = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_hospitals_api`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        // setHospital(data);
        const allHospitalsOption = { hosp_id: '0', hospital_name: 'All' };
        setHospital([allHospitalsOption, ...data]);
      } catch (error) {
        console.error("Error fetching Hospital data:", error);
      }
    };
    getHospital();
  }, []);

  const callbackIDRequest = (callId) => {
    const selectedProf = callback.find(item => item.cb_id === callId);
    if (selectedProf) {
      console.log("Selected Prof ID:", selectedProf.cb_id);
      setProfID(selectedProf.cb_id);
      setRemark('');
    }
  };

  async function handleSubmitCallback(event) {
    event.preventDefault();
    handleEmptyRemark();
    const requestData = {
      cb_id: profID,
      clgs_id: addedby,
      remark: remark,
    };
    console.log("callback ......", requestData)
    try {
      const response = await fetch(`${port}/web/call_back_notification_api`, {
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
      console.log("callback......", result);
      fetchCallbackData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async function handleSubmitSMS(event) {
    event.preventDefault();
    const hasEmptyFields = handleEmptyField();
    if (hasEmptyFields) {
      setOpenSnackbar(true);
      setSnackbarMessage('Please fill all required details.');
      setSnackbarSeverity('error');
      return;
    } else {
      setOpenSnackbar(true);
      setSnackbarMessage('SMS link has been sent!!');
      setSnackbarSeverity('success');
    }
    const requestData = {
      patient_name: ptnName,
      phone_number: ptnNumber,
      srv_id: selectedService,
    };
    console.log("SMS link ......", requestData)
    try {
      const response = await fetch(`${port}/enq_send_sms/`, {
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
      if (result.message === "SMS sent successfully.") {
        setOpenSnackbar(true);
        setSnackbarMessage('SMS link has been sent!!.');
        setSnackbarSeverity('success');
        handleSMSClose();
        setPtnName('');
        setPtnNumber('');
        setSelectedService('');
      } else {
        setOpenSnackbar(true);
        setSnackbarMessage('Something went wrong..');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setSnackbarSeverity('error');
    }
  }

  // const getCurrentDate = () => {
  //   const currentDate = new Date();
  //   const year = currentDate.getFullYear();
  //   const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  //   const day = ('0' + currentDate.getDate()).slice(-2);
  //   const formattedDate = `${year}-${month}-${day}`;
  //   return formattedDate;
  // };

  const handleDownload = async () => {
    const hasErrors = handleEmptyDayPrint();
    if (hasErrors) {
      return;
    }
    try {
      // const currentDate = getCurrentDate();
      const apiUrl = `${port}/hr/DayPrint_excel_api/${date}/${date}/${selectedHospital}`;
      console.log("apiUrl", apiUrl)
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'DayPrintReport.csv');
      document.body.appendChild(link);

      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <Box sx={{
        typography: 'body1',
        // marginTop: "10px"
      }}
      // style={{ position: 'fixed', top: 55, width: '100%', zIndex: 1000 }}
      >
        <TabContext value={location.pathname}>
          <Box sx={{
            typography: 'body1',
            backgroundColor: '#FFFFFF',
            boxShadow: '4px 4px 10px 7px rgba(0, 0, 0, 0.05)',
            borderRadius: '10px',
            width: "auto",
            height: "3.6rem",
            display: 'flex',
            justifyContent: 'space-evenly',
            // justifyContent: 'flex-start',
            marginLeft: '8px',
            marginRight: '8px',
          }}>
            <TabList
              className="tab-root"
              onChange={handleChange}
              textColor="#51DDD4"
              TabIndicatorProps={{ style: { background: 'linear-gradient(90deg, rgba(31, 208, 196, 0.35) 0%, rgba(50, 142, 222, 0.35) 100%)', height: '40px', marginBottom: '10px', borderRadius: "5px" } }}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab component={Link} to="/dashboard" value="/dashboard" icon={<AccessTimeIcon style={{ fontSize: "18px", marginBottom: "18px" }} />} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize", marginBottom: "18px" }}>Dashboard</span>} />
              <Tab component={Link} to="/addservice" value="/addservice" icon={<AddCircleOutlineIcon style={{ fontSize: "18px", marginBottom: "18px" }} />} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize", marginBottom: "18px" }}>Add Service</span>} />
              <Tab component={Link} to="/ongoing" value="/ongoing" icon={<PersonOutlineIcon style={{ marginBottom: "18px" }} />} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize", marginBottom: "18px" }}>Ongoing Service</span>} />
              <Tab component={Link} to="/professional" value="/professional" icon={<CalendarTodayIcon style={{ fontSize: "16px", marginBottom: "18px" }} />} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize", marginBottom: "18px" }}>Professional Schedule</span>} />
              <Tab component={Link} to="/service-request" value="/service-request" icon={<Badge color="error" badgeContent={srvNotify} overlap="circular"><NotificationsNoneIcon style={{ fontSize: "22px", marginBottom: "18px" }} /></Badge>} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize", marginBottom: "18px" }}>Service Request</span>} />
              <Tab component={Link} to="/enquiries" value="/enquiries" icon={<Badge color="error" badgeContent={enqNotify} overlap="circular" ><ChatBubbleOutlineIcon style={{ fontSize: "18px", marginBottom: "18px" }} /></Badge>} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize", marginBottom: "18px" }}>Enquiries</span>} />
              <Tab component={Link} to="/prof-req" value="/prof-req" icon={<ChatBubbleOutlineIcon style={{ fontSize: "18px", marginBottom: "18px" }} />} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize", marginBottom: "18px" }}>Professional Request</span>} />
              {/* <Tab component={Link} to="/membership" value="/membership" icon={<StarBorderIcon style={{ fontSize: "20px", marginBottom: "18px" }} disabled />} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize", marginBottom: "18px" }} disabled >Spero Membership</span>} /> */}

              {/* <Tab component={Link} to="/viewservice" value="8" icon={<ChatBubbleOutlineIcon style={{ fontSize: "18px", marginBottom: "18px" }} />} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize", marginBottom: "18px" }}>View Service</span>} /> */}

              <Tab icon={<LocalPostOfficeOutlinedIcon style={{ fontSize: "20px", marginBottom: "18px" }} disabled />} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize", marginBottom: "18px" }} onClick={handleSMSOpen}>SMS</span>} />
            </TabList>
            {!isSmallScreen && (
              <>
                <Tooltip title="Callback Request">
                  <Fab
                    size="small"
                    color="primary"
                    aria-label="add"
                    style={{
                      // background: "#1FD0C4",
                      // background: "#F77B7B",
                      background: "#E90602",
                      marginTop: "10px",
                      height: "40px",
                      width: "40px",
                      animation: isBlinking ? 'blink-animation 1s infinite' : 'none',
                    }}
                  >
                    <LocalPhoneOutlinedIcon onClick={toggleDrawer(true)} sx={{ fontSize: "22px" }} />
                  </Fab>
                  <style>
                    {`
          @keyframes blink-animation {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
                  </style>
                </Tooltip>

                <Tooltip title="Day Print">
                  <Fab
                    size="small"
                    color="primary"
                    aria-label="add"
                    style={{
                      background: "#1FD0C4",
                      marginLeft: "5px",
                      marginTop: "10px",
                      height: "40px",
                      width: "40px",
                    }}
                  >
                    <CurrencyRupeeOutlinedIcon onClick={toggleDrawerDayPrint(true)} sx={{ fontSize: "22px" }} />
                  </Fab>
                </Tooltip>
              </>
            )}
          </Box>

          <Drawer
            anchor="right"
            open={state.right}
            onClose={toggleDrawer(false)}
            PaperProps={{
              style: {
                height: '92%',
                borderRadius: "5px",
                marginTop: "2px"
              },
            }}
          >
            <AppBar position="static" style={{
              background: 'linear-gradient(45deg, #1FD0C4 38.02%, #328EDF 100%)',
              width: '20rem',
              height: '3rem',
              overflow:"hidden"
              // borderRadius: "8px 10px 0 0",
            }}>
              <div style={{ display: "flex", }}>
                <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px" }}>Call Back Requests</Typography>
                <Button onClick={toggleDrawer(false)} sx={{ marginLeft: "6rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
              </div>
              {/* <div style={{ overflowY: 'auto', height: '100%' }}> */}
              <div style={{ marginTop: "25px", marginLeft: "20px", marginRight: "20px", marginBottom: "10px" }}>
                {callback.map((item, index) => (
                  <div key={index}>
                    <Grid item xs={12}>
                      <Grid container style={{ justifyContent: "space-between" }}>
                        <Typography inline variant="body2" color="text.secondary">Name</Typography>
                        <Typography inline variant="subtilte2" color="text.primary"
                          onClick={() => callbackIDRequest(item.cb_id)}
                          style={{ cursor: "pointer" }}
                        >{item ? item.professional_Name : ""}</Typography>
                      </Grid>
                      <Grid container style={{ justifyContent: "space-between", marginTop: "2px" }}>
                        <Typography variant='body2' color="text.secondary">Contact Number</Typography>
                        <Typography variant='subtilte2' color="text.primary"
                          onClick={() => callbackIDRequest(item.cb_id)}
                          style={{ cursor: "pointer" }}>+91 {item ? item.phone_number : ""}</Typography>
                      </Grid>
                      <Grid container style={{ justifyContent: "space-between", marginTop: "1px" }}>
                        <Typography variant='body2' sx={{ color: "#f44336" }}>Date & Time</Typography>
                        <Typography variant='body2' sx={{ color: "#f44336" }}>{convertTimeFormat(item ? item.time : "")}</Typography>
                      </Grid>
                      {profID === item.cb_id && (
                        <>
                          <Grid item xs={12} container spacing={1} sx={{ mt: 0.5 }}>
                            <Grid item lg={9} sm={9} xs={9}>
                              <TextField
                                required
                                label="Remark"
                                id="remark"
                                name="remark"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                placeholder='Remark'
                                size="small"
                                fullWidth
                                error={!!remarkError.remark}
                                helperText={remarkError.remark}
                                sx={{
                                  '& input': {
                                    fontSize: '14px',
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item lg={3} sm={3} xs={3}>
                              <Button variant="contained" onClick={handleSubmitCallback}><CheckOutlinedIcon /></Button>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Grid>
                    {index < callback.length - 1 && <hr sx={{ my: 2 }} />}
                  </div>
                ))}
              </div>
              {/* </div> */}
            </AppBar>
          </Drawer>

          <Drawer
            anchor="right"
            open={dayPrint.right}
            onClose={toggleDrawerDayPrint(false)}
            PaperProps={{
              style: {
                height: '52%',
                borderRadius: "5px",
                marginTop: "2px",
              },
            }}
          >
            <AppBar position="static" style={{
              background: 'linear-gradient(45deg, #1FD0C4 38.02%, #328EDF 100%)',
              width: '20rem',
              height: '3rem',
            }}>
              <div style={{ display: "flex" }}>
                <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px" }}>Day Print</Typography>
                <Button onClick={toggleDrawerDayPrint(false)} sx={{ marginLeft: "10rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
              </div>

              <div style={{ marginTop: "25px", marginLeft: "20px", marginRight: "20px", marginBottom: "10px" }}>

                <Grid item xs={12} spacing={2}>
                  <Grid item lg={12} sm={12} xs={12} sx={{ mt: 3 }}>
                    <TextField
                      required
                      label="Select Date"
                      id="select_date"
                      name="select_date"
                      type="date"
                      size="small"
                      fullWidth
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      error={!!errors.date}
                      helperText={errors.date}
                      sx={{
                        textAlign: "left", '& input': {
                          fontSize: '14px',
                        },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        max: new Date().toISOString().split('T')[0],
                      }}
                    />
                  </Grid>

                  <Grid item lg={12} sm={12} xs={12} sx={{ mt: 3 }}>
                    <TextField
                      required
                      label="Select Hospital"
                      id="preferred_hosp_id"
                      name="preferred_hosp_id"
                      select
                      size="small"
                      fullWidth
                      value={selectedHospital}
                      onChange={handleDropdownHospital}
                      error={!!errors.selectedHospital}
                      helperText={errors.selectedHospital}
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
                      {hospital.map((option) => (
                        <MenuItem key={option.hosp_id} value={option.hosp_id}
                          sx={{ fontSize: "14px", }}>
                          {option.hospital_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item lg={12} sm={12} xs={12} sx={{ mt: 4 }}>
                    <Button variant="contained" sx={{ textTransform: "capitalize", borderRadius: "8px", ml: 10 }} onClick={handleDownload}><FileDownloadOutlinedIcon /> Download</Button>
                  </Grid>
                </Grid>
              </div>
            </AppBar>
          </Drawer>

          <Modal
            open={isModalOpen}
            onClose={handleSMSClose}>
            <Box sx={{
              width: 300, height: 300, p: 2, position: 'absolute',
              top: '28%',
              left: '86%',
              transform: 'translate(-50%, -50%)',
              bgcolor: '#FFFFFF',
              borderRadius: '5px',
              '@media (max-width: 600px)': {
                left: '50%',
              },
            }}>
              <div style={{ display: "flex" }}>
                <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, marginTop: "10px", marginLeft: "18px" }}>Patient Details</Typography>
                <Button onClick={handleSMSClose} sx={{ marginLeft: "6.8rem", color: "gray" }}><CloseIcon /></Button>
              </div>
              <Grid container spacing={2} sx={{ p: 2 }} >
                <Grid item lg={12} sm={12} xs={12}>
                  <TextField
                    required
                    id="patient_name"
                    name="patient_name"
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
                <Grid item lg={12} sm={12} xs={12}>
                  <TextField
                    required
                    label="Contact"
                    id="phone_number"
                    name="phone_number"
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
                      <MenuItem key={option.srv_id} value={option.srv_id}
                        sx={{ fontSize: "14px", }}>
                        {option.service_title}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item lg={12} sm={12} xs={12}>
                  <Button variant="contained" sx={{ ml: 9, width: "15ch", marginTop: "6px", borderRadius: "10px", textTransform: "capitalize" }} onClick={handleSubmitSMS}>Send Link</Button>
                  <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                  >
                    <Alert variant="filled"
                      onClose={handleSnackbarClose}
                      // severity="success"
                      severity={snackbarSeverity}
                      sx={{ width: '100%', }}
                    >
                      {snackbarMessage}
                    </Alert>
                  </Snackbar>
                </Grid>
              </Grid>
            </Box>
          </Modal>

          <Box sx={{ width: '100%', typography: 'body1', m: 1 }}>
            {/* <Box sx={{ width: '100%', typography: 'body1', marginTop: '-10px' }}> */}
            {/* {value === '1' && <TabPanel value="1"><Dashboard /></TabPanel>}
            {value === '2' && <TabPanel value="2"><Addservice /></TabPanel>}
            {/* {value === '2' && <TabPanel value="2"><Viewservice /></TabPanel>} */}
            {/* {value === '3' && <TabPanel value="3"><Ongoingservice /></TabPanel>} */}
            {/* {value === '4' && <TabPanel value="4"><Schedule /></TabPanel>}
            {value === '5' && <TabPanel value="5"><ServiceRequest /></TabPanel>}
            {value === '6' && <TabPanel value="6"><Enquiries /></TabPanel>}
            {value === '7' && <TabPanel value="7">Spero Membership</TabPanel>} */}
            <Routes>
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/addservice" element={<Addservice />} />
              <Route path="/ongoing" element={<Ongoingservice />} />
              <Route path="/professional" exact element={<Schedule />} />
              <Route path="/service-request" element={<ServiceRequest />} />
              <Route path="/enquiries" element={<Enquiries />} />
              <Route path="/prof-req" element={<ProfRequest />} />
              {/* <Route path="/membership" element={<Membership />} /> */}
              <Route path="/viewservice" element={<Viewservice />} />
            </Routes>
          </Box>
        </TabContext>
      </Box>
      {/* <Footer /> */}
    </>
  )
}

export default Header

