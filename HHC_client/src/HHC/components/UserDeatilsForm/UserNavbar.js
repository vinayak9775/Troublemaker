import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from "react-router-dom";

export default function UserNavbar() {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const isSmallScreen = useMediaQuery('(max-width:350px)');

    const navigate = useNavigate();

    //User Logout Api

    // const handleLogout = async () => {
    //     const response = await fetch(`${port}/web/logout/`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ "refresh": localStorage.getItem('refresh') })

    //     });
    //     // alert("You have successfully logout..!")
    //     navigate("/");
    // };

    return (
        <Box sx={{ flexGrow: 1, }}>
            <AppBar position="static" style={{
                background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                height: '3rem'
            }}>
                <Toolbar variant='dense' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* <img style={{ height: '36px', width: '76px', marginTop: "2px", marginLeft: "-12px", color: "#ffffff" }} src={Logo} alt="Spero" /> */}

                    {!isSmallScreen && (
                        <Typography variant="h6" component="div" align="center"
                            sx={{
                                flexGrow: 1,
                                fontFamily: 'sans-serif',
                                fontWeight: 600,
                                fontStyle: 'normal',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}>
                            Spero Home Healthcare Services
                        </Typography>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}