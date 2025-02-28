import React, { useState } from 'react';
import './Dashboard.css'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Service from './Service';
import Complaint from './Complaint';
import Feedback from './Feedback';
import Enquiries from './Enquiries';
import Enquirystatus from './Enquirystatus';
import Cancellation from './Cancellation';
import Professional from './Professional';
import Navbar from '../../../Navbar';
import Footer from '../../../Footer';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const Dashboard = () => {
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Navbar />
            <Box
                sx={{ flexGrow: 1, mt: 14, mb: 2, width: "100%", }}
            >
                <TabContext value={value}>
                    <Stack direction="row" gap={0} sx={{pt:1.5}}>
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
                        {/* <Button variant="contained" style={{ backgroundColor: "#69A5EB", textTransform: "capitalize", borderRadius: "8px", }}><FileDownloadOutlinedIcon /></Button> */}
                    </Stack>

                    <Box sx={{ width: '100%', typography: 'body1', marginTop: '-15px' }}>
                        <TabPanel value="1">
                            <Grid item xs={12} container spacing={1}>
                                <Grid item lg={3} md={12} xs={12}>
                                    <Service value={1} />
                                </Grid>
                                <Grid item lg={5} md={12} xs={12} xl={5}>
                                    <Enquiries value={1} />
                                    <Grid item xs={12} container spacing={1} sx={{ marginTop: 0 }}>
                                        <Grid item lg={6} md={12} xs={12}>
                                            <Professional />
                                        </Grid>
                                        <Grid item lg={6} md={12} xs={12}>
                                            <Complaint value={1} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={12} xs={12} xl={2}>
                                    <Enquirystatus value={1} />
                                    <Grid item xs={12} container spacing={1} sx={{ marginTop: 0 }}>
                                        <Grid item lg={12} md={12} xs={12}>
                                            <Cancellation value={1} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={12} xs={12} xl={2}>
                                    <Feedback value={1} />
                                    <Grid item xs={12} container spacing={1} sx={{ marginTop: 0 }}>
                                        <Grid item lg={12} md={12} xs={12} xl={12}>
                                            <Box sx={{ flexGrow: 1, width: "100%", height: "16.5rem", }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
                                                <Typography align="center" sx={{ fontSize: 16, fontWeight: 600, pt: "8px" }} color="text.secondary" gutterBottom>PREMIUM MEMBERSHIP</Typography><br />
                                                <Typography variant='h6'>00</Typography>
                                                <Typography>Active Members</Typography>
                                                <br />
                                                <Typography variant='h6'>00</Typography>
                                                <Typography>Inactive Members</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value="2">
                            <Grid item xs={12} container spacing={1}>
                                <Grid item lg={3} md={12} xs={12}>
                                    <Service value={2} />
                                </Grid>
                                <Grid item lg={5} md={12} xs={12} xl={5}>
                                    <Enquiries value={2} />
                                    <Grid item xs={12} container spacing={1} sx={{ marginTop: 0 }}>
                                        <Grid item lg={6} md={12} xs={12}>
                                            <Professional />
                                        </Grid>
                                        <Grid item lg={6} md={12} xs={12}>
                                            <Complaint value={2} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={12} xs={12} xl={2}>
                                    <Enquirystatus value={2} />
                                    <Grid item xs={12} container spacing={1} sx={{ marginTop: 0 }}>
                                        <Grid item lg={12} md={12} xs={12}>
                                            <Cancellation value={2} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={12} xs={12} xl={2}>
                                    <Feedback value={2} />
                                    <Grid item xs={12} container spacing={1} sx={{ marginTop: 0 }}>
                                        <Grid item lg={12} md={12} xs={12} xl={12}>
                                            <Box sx={{ flexGrow: 1, width: "100%", height: "16.5rem", }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
                                                <Typography align="center" sx={{ fontSize: 16, fontWeight: 600, pt: "8px" }} color="text.secondary" gutterBottom>PREMIUM MEMBERSHIP</Typography><br />
                                                <Typography variant='h6'>00</Typography>
                                                <Typography>Active Members</Typography>
                                                <br />
                                                <Typography variant='h6'>00</Typography>
                                                <Typography>Inactive Members</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value="3">
                            <Grid item xs={12} container spacing={1}>
                                <Grid item lg={3} md={12} xs={12}>
                                    <Service value={3} />
                                </Grid>
                                <Grid item lg={5} md={12} xs={12} xl={5}>
                                    <Enquiries value={3} />
                                    <Grid item xs={12} container spacing={1} sx={{ marginTop: 0 }}>
                                        <Grid item lg={6} md={12} xs={12}>
                                            <Professional />
                                        </Grid>
                                        <Grid item lg={6} md={12} xs={12}>
                                            <Complaint value={3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={12} xs={12} xl={2}>
                                    <Enquirystatus value={3} />
                                    <Grid item xs={12} container spacing={1} sx={{ marginTop: 0 }}>
                                        <Grid item lg={12} md={12} xs={12}>
                                            <Cancellation value={3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item lg={2} md={12} xs={12} xl={2}>
                                    <Feedback value={3} />
                                    <Grid item xs={12} container spacing={1} sx={{ marginTop: 0 }}>
                                        <Grid item lg={12} md={12} xs={12} xl={12}>
                                            <Box sx={{ flexGrow: 1, width: "100%", height: "16.5rem", }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
                                                <Typography align="center" sx={{ fontSize: 16, fontWeight: 600, pt: "8px" }} color="text.secondary" gutterBottom>PREMIUM MEMBERSHIP</Typography><br />
                                                <Typography variant='h6'>00</Typography>
                                                <Typography>Active Members</Typography>
                                                <br />
                                                <Typography variant='h6'>00</Typography>
                                                <Typography>Inactive Members</Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </Box>
                </TabContext>

            </Box>
            <Footer />
        </>
    )
}

export default Dashboard


