import React, { useState } from 'react';
import '../../HD/Dashboard/Dashboard.css'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import HRNavbar from '../../HR/HRNavbar';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import ServiceDetail from './ServiceDetail';
import EnquiriesHosp from './EnquiriesHosp';
import EnquiryStatusHosp from './EnquiryStatusHosp';
import Footer from '../../../Footer';
import ServiceStatus from './ServiceStatus';
import Button from '@mui/material/Button';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const Dashboard = () => {
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, width: "100%" }}>
                <TabContext value={value}>
                    <Stack direction="row" gap={0} justifyContent="space-between" alignItems="center">
                        <Box sx={{
                            typography: 'body1',
                            background: "#FFFFFF",
                            borderRadius: '10px',
                            width: "20rem",
                            height: "2.8rem",
                            display: 'flex',
                            justifyContent: 'center',
                            marginLeft: '8px',
                            marginRight: '8px',
                        }}>
                            <TabList
                                className="tab-root"
                                onChange={handleChange}
                                textColor="#51DDD4"
                                sx={{ position: 'relative' }}
                                TabIndicatorProps={{ style: { background: '#69A5EB', height: '36px', marginBottom: '8px', borderRadius: "10px" } }}
                            >
                                <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "1" ? '#ffffff' : 'black' }}>Today</span>} value="1" sx={{ position: 'relative', zIndex: 1, }} />
                                <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "2" ? '#ffffff' : 'black' }}>This Week</span>} value="2" sx={{ position: 'relative', zIndex: 1, }} />
                                <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "3" ? '#ffffff' : 'black' }}>This Month</span>} value="3" sx={{ position: 'relative', zIndex: 1, }} />
                            </TabList>
                        </Box>
                        {/* <Button variant="contained" style={{ backgroundColor: "#69A5EB", textTransform: "capitalize", borderRadius: "8px", marginRight: '10px' }}><FileDownloadOutlinedIcon />Download Report</Button> */}
                    </Stack>

                    <Box sx={{ width: '100%', typography: 'body1', marginTop: '-15px' }}>
                        <TabPanel value="1">
                            <Grid container spacing={1}>
                                <Grid item lg={3} md={12} xs={12}>
                                    <ServiceDetail value={1} />
                                </Grid>

                                <Grid item lg={3} md={12} xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <EnquiriesHosp value={1} />
                                        </Grid>
                                        <Grid item lg={12} md={6} xs={12}>
                                            <EnquiryStatusHosp value={1} />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item lg={6} md={12} xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <ServiceStatus value={1} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value="2">
                            <Grid container spacing={1}>
                                <Grid item lg={3} md={12} xs={12}>
                                    <ServiceDetail value={2} />
                                </Grid>

                                <Grid item lg={3} md={12} xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <EnquiriesHosp value={2} />
                                        </Grid>
                                        <Grid item lg={12} md={6} xs={12}>
                                            <EnquiryStatusHosp value={2} />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item lg={6} md={12} xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <ServiceStatus value={2} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value="3">
                            <Grid container spacing={1}>
                                <Grid item lg={3} md={12} xs={12}>
                                    <ServiceDetail value={3} />
                                </Grid>

                                <Grid item lg={3} md={12} xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <EnquiriesHosp value={3} />
                                        </Grid>
                                        <Grid item lg={12} md={6} xs={12}>
                                            <EnquiryStatusHosp value={3} />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item lg={6} md={12} xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <ServiceStatus value={3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </Box>
                </TabContext>
                <Footer />
            </Box>
        </>
    )
}

export default Dashboard


