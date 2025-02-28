import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import doc from "./../../../assets/docm.png";
import onboard from "./../../../assets/onbo.png";
import sched from "./../../../assets/sched.png";

const Onboarding = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [onboarding, setOnboarding] = useState([]);

    useEffect(() => {
        const getOnboard = async () => {
            if (value) {
                try {
                    const res = await fetch(`${port}/hr/onboarding/${value}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Onboard Count.........", data);
                    setOnboarding(data);
                } catch (error) {
                    console.error("Error fetching Onboard Count:", error);
                }
            }
        };
        getOnboard();
    }, [value]);

    return (
        <>
            <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
                <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>ONBOARDING</Typography>

                <div style={{ marginTop: "20px" }}>
                    <Box sx={{ bgcolor: "#FFFAE5", borderRadius: "8px", m: '15px', height: "100px" }}>
                        <div style={{ display: "flex", }}>
                            <img src={doc} alt="" style={{ marginTop: "20px", marginLeft: "10px", height: "50px" }} />
                            <div style={{ marginLeft: "20px", marginTop: "20px" }}>
                                <Typography variant="subtitle2" sx={{ fontSize: 16, fontWeight: 600, }}>{onboarding.document_verification}</Typography>
                                <Typography variant="subtitle1">Document Verification</Typography>
                            </div>
                        </div>
                    </Box>

                    <Box sx={{ bgcolor: "#E9FBF9", borderRadius: "8px", m: '15px', height: "100px" }}>
                        <div style={{ display: "flex" }}>
                            <img src={onboard} alt="" style={{ marginTop: "20px", marginLeft: "10px", height: "50px" }} />
                            <div style={{ marginLeft: "20px", marginTop: "20px" }}>
                                <Typography variant="subtitle2" sx={{ fontSize: 16, fontWeight: 600, }}>{onboarding.onboarding}</Typography>
                                <Typography variant="subtitle1">Onboarding</Typography>
                            </div>
                        </div>
                    </Box>

                    <Box sx={{ bgcolor: "#F7EAFB", borderRadius: "8px", m: '15px', height: "100px" }}>
                        <div style={{ display: "flex" }}>
                            <img src={sched} alt="" style={{ marginTop: "20px", marginLeft: "10px", height: "50px" }} />
                            <div style={{ marginLeft: "20px", marginTop: "20px" }}>
                                <Typography variant="subtitle2" sx={{ fontSize: 16, fontWeight: 600, }}>00</Typography>
                                <Typography variant="subtitle1">Schedule on boarding </Typography>
                            </div>
                        </div>
                    </Box>

                </div>

            </Box>
        </>
    )
}

export default Onboarding
