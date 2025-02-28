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
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import Stack from '@mui/material/Stack';

export default function TopHeader() {
    const navigate = useNavigate();
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const addedby = localStorage.getItem('clg_id');

    const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const userPicture = localStorage.getItem('user-image');
    const userName = localStorage.getItem('user-name');
    const userLastName = localStorage.getItem('user-lname');
    const userDesignation = localStorage.getItem('user-designation');
    const userEmail = localStorage.getItem('user-email');
    const userPhone = localStorage.getItem('user-phone');
    const userAddress = localStorage.getItem('user-loc');
    const userID = localStorage.getItem('clg_id');

    const permissions = JSON.parse(localStorage.getItem('permissions'));
    console.log(permissions, 'permissionspermissions');

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

    //User Logout Api
    const handleLogout = async () => {
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
        navigate("/");
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

    return (
        <>
            <Box sx={{ flexGrow: 1 }}
             style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000,
                backgroundColor: "#F2F2F2",
              }}>
                <AppBar position="static" style={{
                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                    height: '3rem'
                }}>
                    <Toolbar variant='dense' sx={{ display: 'flex', justifyContent: 'space-between' }}>

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
                                </div>
                            </>
                        )}
                        {auth && (
                            <Stack direction='row'
                                justifyContent="flex-end"
                                alignItems={isSmallScreen ? 'center' : 'stretch'}
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
                                    <MenuItem onClick={handleLogout}><PowerSettingsNewIcon style={{ fontSize: "20px", marginRight: "10px" }} />Logout</MenuItem>
                                </Menu>

                                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                                    <Box sx={{
                                        width: 280, height: 200, p: 2, position: 'absolute',
                                        top: '28%',
                                        left: '86%',
                                        transform: 'translate(-50%, -50%)',
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
                                                color="inherit"
                                            >
                                                <Avatar alt="Shamal Bhagat" src="/static/images/avatar/2.jpg" />
                                            </IconButton>
                                            <Typography variant="subtitle2" sx={{ mt: 2 }}>{userName} {userLastName} <br />HR</Typography><br />
                                        </div>

                                        <br />
                                        <div class="contact-info"><EmailOutlinedIcon sx={{ color: "#69A5EB" }} /><Typography variant="body2">{userEmail}</Typography></div><br />
                                        <div class="contact-info"><LocalPhoneOutlinedIcon sx={{ color: "#69A5EB" }} /><Typography variant="body2">{userPhone}</Typography></div><br />
                                        <div class="contact-info"><LocationOnOutlinedIcon sx={{ color: "#69A5EB" }} /><Typography variant="body2">{userAddress}</Typography></div>
                                    </Box>
                                </Modal>
                            </Stack>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
}
