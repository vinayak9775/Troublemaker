import React, { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Header from './Header';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Logo from "./assets/spero_logo.png";
import SOS from "./assets/sos.png";
import { Button } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Footer from "./Footer"
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import "./Navbar.css";
import { useAuth } from './components/Context/ContextAPI';

export default function Navbar() {

  const userGroup = localStorage.getItem('user_group');
  console.log('user_groupuser_groupuser_group', userGroup);

  
  const navigate = useNavigate();
  const { handleAuthLogout } = useAuth();
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const addedby = localStorage.getItem('clg_id');

  const accessHospitalName = localStorage.getItem('hospitalName');
  const accessHospitalID = localStorage.getItem('hospitalID') || 0;

  const [hospital, setHospital] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(0);
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenHosp, setIsModalOpenHosp] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [state, setState] = useState({ right: false });
  const [sosData, setSOSData] = useState([]);
  const [profID, setProfID] = useState('');
  const [remark, setRemark] = useState('');
  const [remarkError, setRemarkError] = useState({ remark: '' });

  const userPicture = localStorage.getItem('user-image');
  const userName = localStorage.getItem('user-name');
  const userLastName = localStorage.getItem('user-lname');
  const userDesignation = localStorage.getItem('user-designation');
  const userEmail = localStorage.getItem('user-email');
  const userPhone = localStorage.getItem('user-phone');
  const userAddress = localStorage.getItem('user-loc');
  const userID = localStorage.getItem('clg_id');

  // const [loggingOut, setLoggingOut] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ right: open });
  };

  const handleEmptyRemark = () => {
    const newErrors = {};

    if (!remark) {
      newErrors.remark = 'Remark is required';
    }
    setRemarkError(newErrors);
    return Object.values(newErrors).some((error) => error !== '');
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

  const handleProfile = () => {
    setIsModalOpen(true);
  };

  const handleHospital = () => {
    setIsModalOpenHosp(true);
  };

  function formatTime(originalTime) {
    return new Date(originalTime).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // timeZone: 'UTC', 
    });
  }

  useEffect(() => {
    const getHospital = async () => {
      try {
        const res = await fetch(`${port}/web/select_hospital_name`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        // console.log("Hospital data", data);
        setHospital(data);
      } catch (error) {
        console.error("Error fetching Hospital data:", error);
      }
    };
    getHospital();
  }, []);

  const handleHospitalSubmit = async () => {
    const response = await fetch(`${port}/web/select_hospital_name`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "hosp_id": selectedHospital })
    });
    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return;
    }
    const result = await response.json();
    console.log("Selected Hospital data", result);
    localStorage.setItem('hospitalID', result.hosp_id);
    localStorage.setItem('hospitalName', result.hospital_name);
    window.location.reload();
  };

  //User Logout Api
  const handleLogout = async () => {
    // setLoggingOut(true);
    try {
      const response = await fetch(`${port}/web/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "refresh": localStorage.getItem('refresh'), "clg_id": userID, })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // const result = await response.json();
      localStorage.removeItem('hospitalID');
      localStorage.removeItem('hospitalName');
      localStorage.removeItem('refresh');
      localStorage.removeItem('access');
      localStorage.clear();
      navigate("/");
      handleAuthLogout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
    // finally {
    // setLoggingOut(false);
    // }
  };

  useEffect(() => {
    const preventBack = () => {
      window.history.forward();
    };
    preventBack();

    window.onunload = preventBack;

    const cleanup = () => {
      handleLogout();
      window.removeEventListener('beforeunload', cleanup);
    };

    // window.addEventListener('beforeunload', cleanup);

    // return () => {
    //   cleanup();
    // };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      if (performance.navigation.type !== 1) {
        await handleLogout();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // window.addEventListener("beforeunload", function (e) {
  //   if (!loggingOut) {
  //     e.preventDefault(); // Cancel the default behavior of the event
  //     handleLogout(); // Call the logout function
  //     e.returnValue = ''; // Set a custom message to display (optional)
  //   }
  // });

  const fetchSOSData = async () => {
    try {
      const res = await fetch(`${port}/web/sos_detls/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      // console.log("SOS Emergency Calls.........", data);
      // setSOSData(data);
      if (data.msg === 'No Data Found') {
        setSOSData([]);
      } else {
        setSOSData(data);
      }

    } catch (error) {
      console.error("Error fetching SOS Emergency:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchSOSData();
    }
  }, [accessToken]);

  const sosIDRequest = (sosId) => {
    const selectedProf = sosData.find(item => item.sos_id === sosId);
    if (selectedProf) {
      // console.log("Selected Prof SOS ID:", selectedProf.sos_id);
      setProfID(selectedProf.sos_id);
      setRemark('');
    }
  };

  async function handleSubmitSOS(event) {
    event.preventDefault();
    handleEmptyRemark();
    const added = parseInt(addedby, 10);;
    const requestData = {
      sos_id: profID,
      action_status: 2,
      last_modified_by: added,
      last_modified_date: '',
      sos_remark: remark,
    };
    console.log("SOS data", requestData)
    try {
      const response = await fetch(`${port}/web/sos_detls/`, {
        method: "PUT",
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
      console.log("SOS data......", result);
      fetchSOSData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <>
      <Box
        // sx={{
        //   flexGrow: 1,
        // }}
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000,
          backgroundColor: "#F2F2F2",
        }}
        className="navbar-body"
      >
        <AppBar position="static" style={{
          background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
          height: '3rem'
        }}>
          <Toolbar variant='dense' sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* <img style={{ height: '36px', width: '76px', marginTop: "2px", marginLeft: "-12px", color: "#ffffff" }} src={Logo} alt="Spero" /> */}

            {!isSmallScreen && (
              <>
                <div style={{ display: "flex" }}>
                  <Typography variant="h6" component="div" align="left"
                    sx={{
                      flexGrow: 1,
                      fontFamily: 'sans-serif',
                      fontWeight: 600,
                      fontStyle: 'normal',
                      color: 'inherit',
                      marginLeft: "12px",
                      textDecoration: 'none',
                    }}>
                    Spero Home Healthcare Services
                  </Typography>
                  {/* <Typography variant="subtitile2" component="div" align="center"
                    sx={{
                      flexGrow: 1,
                      mt: 1,
                      ml: 40,
                      fontSize: "16px",
                      textDecoration: 'none',
                    }}>
                    {accessHospitalName}
                  </Typography> */}
                </div>
              </>
            )}
            {auth && (
              <Stack direction='row'
                // spacing={1}
                justifyContent="flex-end"
                alignItems={isSmallScreen ? 'center' : 'stretch'}
                sx={{ mr: -3 }}
              >
                <div style={{ marginBottom: isSmallScreen ? "10px" : "0px", marginTop: isSmallScreen ? "0px" : "20px" }}>
                  Welcome, {userName} {userLastName}
                </div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ mr: -3 }}
                >
                  <Avatar alt="Shamal Bhagat" src="/static/images/avatar/2.jpg" />
                </IconButton>
                <Button
                  onClick={toggleDrawer(true)}
                ><img src={SOS} alt="SOS" style={{ height: "45px", marginBottom: "3px" }} /></Button>
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
                    // borderRadius: "8px 10px 0 0",
                  }}>
                    <div style={{ display: "flex" }}>
                      <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px" }}>SOS Requests</Typography>
                      <Button onClick={toggleDrawer(false)} sx={{ marginLeft: "8rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                    </div>

                    <div style={{ marginTop: "25px", marginLeft: "20px", marginRight: "20px", marginBottom: "10px" }}>
                      {sosData.map((item, index) => (
                        <div key={index}>
                          <Grid item xs={12}>
                            <Grid container style={{ justifyContent: "space-between" }}>
                              <Typography inline variant="body2" color="text.secondary">Name</Typography>
                              <Typography inline variant="subtilte2" color="text.primary"
                                onClick={() => sosIDRequest(item.sos_id)}
                                style={{ cursor: "pointer" }}
                              >{item ? item.srv_prof_id : ""}</Typography>
                            </Grid>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "2px" }}>
                              <Typography variant='body2' color="text.secondary">Contact Number</Typography>
                              <Typography variant='subtilte2' color="text.primary">+91 {item ? item.srv_prof_con : ""}</Typography>
                            </Grid>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "1px" }}>
                              <Typography variant='body2' sx={{ color: "#f44336" }}>Date & Time</Typography>
                              <Typography variant='body2' sx={{ color: "#f44336" }}>{formatTime(item ? item.last_modified_date : "")}</Typography>
                            </Grid>
                            {profID === item.sos_id && (
                              <>
                                <Grid item xs={12} container spacing={1} sx={{ mt: 0.5 }}>
                                  <Grid item lg={9} sm={9} xs={9}>
                                    <TextField
                                      required
                                      label="Remark"
                                      id="sos_remark"
                                      name="sos_remark"
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
                                    <Button variant="contained" onClick={handleSubmitSOS}><CheckOutlinedIcon /></Button>
                                  </Grid>
                                </Grid>
                              </>
                            )}
                          </Grid>
                          {index < sosData.length - 1 && <hr sx={{ my: 2 }} />}
                        </div>
                      ))}
                    </div>
                  </AppBar>
                </Drawer>

                <Menu
                  sx={{ mt: '45px' }}
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
                  <MenuItem onClick={handleProfile} ><PersonOutlineIcon style={{ fontSize: "20px", marginRight: "10px" }} />Profile</MenuItem>
                  {/* <MenuItem onClick={handleHospital}><DomainAddOutlinedIcon style={{ fontSize: "20px", marginRight: "10px" }} />Hospital</MenuItem> */}
                  <MenuItem onClick={handleLogout}><PowerSettingsNewIcon style={{ fontSize: "20px", marginRight: "10px" }} />Logout</MenuItem>
                </Menu>

                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                  <Box sx={{
                    width: 280, height: 200, p: 2, position: 'absolute',
                    top: '28%',
                    left: '86%',
                    transform: 'translate(-50%, -50%)',
                    // bgcolor: 'background.paper',
                    bgcolor: '#F5F5F5',
                    borderRadius: '8px',
                    '@media (max-width: 600px)': {
                      left: '50%',
                    },
                  }}>
                    <div style={{ display: "flex" }}>
                      <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        //onClick={handleMenu}
                        color="inherit"
                      >
                        <Avatar alt="Shamal Bhagat" src="/static/images/avatar/2.jpg" />
                      </IconButton>
                      <Typography variant="subtitle2" sx={{ mt: 2 }}>{userName} {userLastName} <br />Healthcare Attendent</Typography><br />
                      {/* <Typography variant="bdoy2">{userDesignation}</Typography> */}
                    </div>

                    <br />
                    <div class="contact-info"><EmailOutlinedIcon sx={{ color: "#69A5EB" }} /><Typography variant="body2">{userEmail}</Typography></div><br />
                    <div class="contact-info"><LocalPhoneOutlinedIcon sx={{ color: "#69A5EB" }} /><Typography variant="body2">{userPhone}</Typography></div><br />
                    <div class="contact-info"><LocationOnOutlinedIcon sx={{ color: "#69A5EB" }} /><Typography variant="body2">{userAddress}</Typography></div>
                  </Box>
                </Modal>
              </Stack >
            )}
          </Toolbar>
        </AppBar>
        {/* <div style={{ marginTop: 10, }}>
          <Header />
        </div> */}

        <div>
          {/* <HRHeader /> */}
          {userGroup !== "HHC_Analytics" && <Header />}
        </div>
      </Box>
      {/* <div style={{ marginTop: 55, }}>
          <Header />
        </div> */}
      {/* <div style={{ marginTop: 10, }}>
        <Header />
      </div> */}
    </>
  );
}