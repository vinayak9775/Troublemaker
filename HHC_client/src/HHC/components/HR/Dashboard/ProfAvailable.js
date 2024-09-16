import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import men from "../../../assets/men.png"
import women from "../../../assets/women.png"
import Brightness1Icon from '@mui/icons-material/Brightness1';


const ProfAvailable = ({ value }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [professional, setProfessional] = useState([]);

    useEffect(() => {
        const getProfessional = async () => {
            if (value) {
                try {
                    const res = await fetch(`${port}/hr/male_female_employee/${value}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Prof Available Count.........", data);
                    setProfessional(data);
                } catch (error) {
                    console.error("Error fetching Prof Available Count:", error);
                }
            }
        };
        getProfessional();
    }, [value]);

    return (
        <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
            <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>PROFESSIONAL AVAILABLE</Typography>
            <Grid item xs={12} container spacing={1} sx={{mt:4}}>
                <Grid item lg={12} md={12} xs={12}>
                    <img src={men} alt="" />
                    <img src={women} alt="" />
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                    <div style={{ display: "inline-flex", alignItems: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center" }}>
                            <Brightness1Icon sx={{color:"#23538F", fontSize:"20px"}}/>
                            <Typography align="center" sx={{ fontSize: 16, fontWeight: 400, pl: "10px", pt: "8px" }} gutterBottom> Male</Typography>
                            <Typography align="center" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} gutterBottom>{professional.Male}</Typography>
                        </div>

                        <div style={{ display: "inline-flex", alignItems: "center", marginLeft:"10px" }}>
                            <Brightness1Icon sx={{color:"#CA2B7A", fontSize:"20px"}}/>
                            <Typography align="center" sx={{ fontSize: 16, fontWeight: 400, pl: "10px", pt: "8px" }} gutterBottom> Female</Typography>
                            <Typography align="center" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} gutterBottom>{professional.Female}</Typography>
                        </div>
                    </div>

                </Grid>
            </Grid>

        </Box>
    )
}

export default ProfAvailable

