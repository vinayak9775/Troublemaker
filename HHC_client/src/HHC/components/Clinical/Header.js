import React, { useState } from 'react';
import Header1 from '../ManagementDashboard/Header';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import ClosureDetails from './ClosureDetails';
import Navbar from '../../Navbar';
import TopHeader from './TopHeader';
import Telemedicine from './ClinicalComponents/Telemedicine';
import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import MedicationIcon from '@mui/icons-material/Medication';
import { BrowserRouter, Router, Routes, Route, Link, useLocation } from "react-router-dom";


const Header = () => {
    const location = useLocation();
    const [value, setValue] = useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div>
            {/* <Header1 /> */}
            {/* <div style={{ marginTop: '7.5em' }}> */}
            <Box sx={{ typography: 'body1', }}>
                {/* <div style={{ position: 'fixed', top: '0', width: '100%', zIndex: 1000, marginTop: '3.5em' }}> */}
                    <TabContext value={location.pathname}>
                        <Box
                            sx={{
                                typography: 'body1',
                                backgroundColor: '#FFFFFF',
                                boxShadow: '4px 4px 10px 7px rgba(0, 0, 0, 0.05)',
                                borderRadius: '10px',
                                width: "auto",
                                height: "3.5rem",
                                display: 'flex',
                                // justifyContent: 'space-around',
                                marginLeft: '8px',
                                marginRight: '8px',
                                marginBottom: '8px',
                                paddingLeft: '15px',
                                alignItems: 'center'
                            }}>
                            {/* <h3>
                                    Clinical Governance
                                </h3> */}
                            <TabList
                                className="tab-root"
                                onChange={handleChange}
                                textColor="#51DDD4"
                                TabIndicatorProps={{ style: { background: 'linear-gradient(90deg, rgba(31, 208, 196, 0.35) 0%, rgba(50, 142, 222, 0.35) 100%)', height: '40px', marginBottom: '15px', borderRadius: "5px" } }}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                            >
                                <Tab component={Link} to="/hhc/clinical/closure" value="hhc/clinical/closure" icon={<AssuredWorkloadOutlinedIcon style={{ fontSize: "18px" }} />} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize" }}>Clinical Governance</span>} />
                                <Tab component={Link} to="/hhc/clinical/telemed" value="/hhc/clinical/telemed" icon={<MedicationIcon style={{ fontSize: "20px" }} />} iconPosition="start" label={<span style={{ fontSize: '1rem', textTransform: "capitalize" }}>Telemedicine</span>} />
                            </TabList>
                        </Box>

                        <Box sx={{ width: '100%', typography: 'body1', m: 1 }}>
                            <Routes>
                                <Route exact path="/hhc/clinical/closure" element={<ClosureDetails />} />
                                <Route path="/hhc/clinical/telemed" element={<Telemedicine />} />
                            </Routes>
                        </Box>
                    </TabContext>
                {/* </div> */}
            </Box>
            {/* </div> */}
            {/* <ClosureDetails /> */}
        </div>
    )
}

export default Header