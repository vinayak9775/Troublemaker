import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import dayjs from 'dayjs';
import IconButton from '@mui/material/IconButton';
import ProfessionalList from './ProfessionalList';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import CalendarComponent from './calendar/CalendarComponent';
import Navbar from '../../../Navbar';
import Footer from '../../../Footer';
import Header from '../../../Header';
import { TabContext, TabPanel } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';

const ScheduleCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "52px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        // cursor: 'pointer',
    },
});

const Schedule = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [value, setValue] = useState(dayjs('2023-05-30'));
    const [tabIndex, setTabIndex] = useState(1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [professionalList, setProfessionalList] = useState([]);
    const [selectedProfessional, setSelectedProfessional] = useState('');
    const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
    const [selectedProfessionalEvents, setSelectedProfessionalEvents] = useState([]);

    const [viewProfList, setViewProfList] = useState([]);

    const [selectedProfName, setselectedProfName] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [loading, setLoading] = useState(true);

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleProfChange = (e) => {
        setselectedProfName(e.target.value);
        setPage(0);
    };

    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        const getProfessionalList = async () => {
            try {
                // const res = await fetch(`${port}/web/agg_hhc_event_professional_api/`);
                const res = await fetch(`${port}/web/agg_hhc_event_professional_api/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Professional Data.........", data);
                // setProfessionalList(data);
                // setLoading(false);
                if (data["not found"] === "Record not found") {
                    setProfessionalList([]);
                    setLoading(false);
                } else {
                    setProfessionalList(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching Profession Data:", error);
                setLoading(false);
            }
        };
        getProfessionalList();
    }, []);

    const handleEventSelect = (professionalID) => {
        if (professionalList.length > 0) {
            const selectedProfessional = professionalList.find((item) => item.srv_prof_id === professionalID);
            if (selectedProfessional) {
                setSelectedProfessional(selectedProfessional.srv_prof_id);
                console.log("Selected Professional.....>>>", selectedProfessional.srv_prof_id);
            } else {
                console.log("Professional not found.");
            }
        } else {
            console.log("Professional list is empty.");
        }
    };

    useEffect(() => {
        const getProfessionalEvent = async () => {
            if (selectedProfessional) {
                const currentSelectedProfessional = selectedProfessional;
                console.log("currentSelectedProfessional Id......>>>", currentSelectedProfessional);
                try {
                    const res = await fetch(`${port}/web/agg_hhc_detailed_event_plan_of_care/?pro=${currentSelectedProfessional}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Professional Against All Events......", data);
                    // setSelectedProfessionalEvents(data)
                    // setIsEventDetailsModalOpen(true);
                    if (data === 'not found') {
                        setSelectedProfessionalEvents([]);
                        setIsEventDetailsModalOpen(false);
                    } else {
                        setSelectedProfessionalEvents(data);
                        setIsEventDetailsModalOpen(true);
                    }
                } catch (error) {
                    console.error("Error fetching Professional All Events:", error);
                }
            }
            else {
                setSelectedProfessionalEvents([]);
                setIsEventDetailsModalOpen(false);
            }
        };
        getProfessionalEvent();
    }, [selectedProfessional]);

    useEffect(() => {
        const getViewProfList = async () => {
            try {
                const res = await fetch(`${port}/web/total_services/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("View Professional.........", data);
                setViewProfList(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching View Professional:", error);
                setLoading(false);
            }
        };
        getViewProfList();
    }, []);

    const filteredData = professionalList.filter((item) => {
        if (
            (selectedProfName === '' || item.prof_fullname.toLowerCase().includes(selectedProfName.toLowerCase())) &&
            (selectedService === '' || item.srv_id.toLowerCase().includes(selectedService.toLowerCase()))
        ) {
            return true;
        }
        return false;
    });

    const viewFilteredData = viewProfList.filter((item) => {
        if (
            (selectedProfName === '' || item.prof_fullname.toLowerCase().includes(selectedProfName.toLowerCase())) &&
            (selectedService === '' || item.srv_id.toLowerCase().includes(selectedService.toLowerCase()))
        ) {
            return true;
        }
        return false;
    });
    // let filteredData;
    // if (selectedProfName || selectedService) {
    //     filteredData = professionalList.filter((item) => {
    //         if (
    //             (selectedProfName === '' || item.prof_fullname.toLowerCase().includes(selectedProfName.toLowerCase())) &&
    //             (selectedService === '' || item.srv_id.toLowerCase().includes(selectedService.toLowerCase()))
    //         ) {
    //             return true;
    //         }
    //         return false;
    //     });
    // } else {
    //     filteredData = viewProfList.filter((item) => {
    //         if (
    //             (selectedProfName === '' || item.prof_fullname.toLowerCase().includes(selectedProfName.toLowerCase())) &&
    //             (selectedService === '' || item.srv_id.toLowerCase().includes(selectedService.toLowerCase()))
    //         ) {
    //             return true;
    //         }
    //         return false;
    //     });
    // }


    return (
        <>
            <Navbar />
            {/* <TabContext> */}
            {/* <TabPanel> */}
            <Box sx={{ flexGrow: 1, mt: 14.6, mb: 2, ml: 1, mr: 1, }}>
                <Stack direction={isSmallScreen ? 'column' : 'row'}
                    spacing={1}
                    alignItems={isSmallScreen ? 'center' : 'flex-start'} sx={{pt:1}}>
                    {/* <div>
                    {
                        tabIndex === 1 && (
                            <div>
                                <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>PROFESSIONAL SCHEDULE</Typography>
                            </div>
                        )
                    }
                </div>
                <div>
                    {
                        tabIndex === 2 && (
                            <div>
                                <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>PROFESSIONAL LIST</Typography>
                            </div>
                        )
                    }
                </div> */}
                    <Typography style={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>PROFESSIONAL SCHEDULE</Typography>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 250, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1, }}
                            placeholder="Search Service |"
                            inputProps={{ 'aria-label': 'select service' }}
                            value={selectedService}
                            onChange={handleServiceChange}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon style={{ color: "#7AB7EE" }} />
                        </IconButton>
                    </Box>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 260, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Professional Name |"
                            inputProps={{ 'aria-label': 'search professional' }}
                            value={selectedProfName}
                            onChange={handleProfChange}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon style={{ color: "#7AB7EE" }} />
                        </IconButton>
                    </Box>

                    <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: tabIndex === 1 ? '#69A5EB' : 'inherit', color: tabIndex === 1 ? '#FFFFFF' : 'inherit', }} onClick={() => setTabIndex(1)}>View Professional Schedule</Button>
                    <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: tabIndex === 2 ? '#69A5EB' : 'inherit', color: tabIndex === 2 ? '#FFFFFF' : 'inherit', }} onClick={() => setTabIndex(2)}>Professional List</Button>
                </Stack>

                <div>
                    {
                        tabIndex === 1 && (
                            <div>
                                <Grid item xs={12} container spacing={1}>
                                    <Grid item lg={5} md={6} xs={12}>
                                        <TableContainer
                                            sx={{ height: filteredData.length === 0 || filteredData.length < 5 ? "60vh" : "default" }}>
                                            <Table>
                                                <TableHead >
                                                    <TableRow>
                                                        <ScheduleCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                                <Typography variant='subtitle2'>Professional Name</Typography>
                                                            </CardContent>
                                                            <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                                <Typography variant='subtitle2'>Service Name</Typography>
                                                            </CardContent>
                                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                                <Typography variant='subtitle2'>Home Zone</Typography>
                                                            </CardContent>
                                                            <CardContent style={{ flex: 1 }}>
                                                                <Typography variant='subtitle2'>Type</Typography>
                                                            </CardContent>
                                                        </ScheduleCard>
                                                    </TableRow>
                                                </TableHead>
                                                {loading ? (
                                                    <Box sx={{ display: 'flex', mt: 15, ml: 30, height: '100px', }}>
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
                                                            filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                                <TableRow
                                                                    key={row.first_name}
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                                                                >
                                                                    <ScheduleCard>
                                                                        <CardContent onClick={() => handleEventSelect(row.srv_prof_id)}
                                                                            style={{
                                                                                flex: 3,
                                                                                border: 'none',
                                                                                background: 'none',
                                                                                outline: 'none',
                                                                                cursor: 'pointer',
                                                                                // paddingLeft: '10px',
                                                                                borderLeft: selectedProfessional === row.srv_prof_id ? '3px solid #69A5EB' : 'none',
                                                                                height: '40px',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                            }}>
                                                                            <Typography variant='body2' textAlign="left">{row.prof_fullname}</Typography>
                                                                        </CardContent>
                                                                        <CardContent style={{ flex: 2 }}>
                                                                            <Typography variant='body2' textAlign="left">{row.srv_id}</Typography>
                                                                        </CardContent>
                                                                        <CardContent style={{ flex: 1 }}>
                                                                            <Typography variant='body2'>{row.prof_zone_id ? row.prof_zone_id : "-"}</Typography>
                                                                        </CardContent>
                                                                        <CardContent style={{ flex: 1 }}>
                                                                            {row.Job_type === 1 ? (
                                                                                <Typography variant='body2'>On Call</Typography>
                                                                            ) : row.Job_type === 2 ? (
                                                                                <Typography variant='body2'>Full Time</Typography>
                                                                            ) : row.Job_type === 3 ? (
                                                                                <Typography variant='body2'>Part Time</Typography>
                                                                            ) : (
                                                                                <Typography variant='body2'>-</Typography>
                                                                            )}
                                                                        </CardContent>
                                                                    </ScheduleCard>
                                                                </TableRow>
                                                            )
                                                            ))}
                                                    </TableBody>
                                                )}
                                            </Table>
                                        </TableContainer>
                                        <TablePagination
                                            rowsPerPageOptions={[7, 25, 100]}
                                            component="div"
                                            count={filteredData.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Grid>

                                    <Grid item lg={7} md={6} xs={12} sx={{ marginTop: "7px" }}>
                                        <Card sx={{ backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px" }}>
                                            <div style={{ paddingTop: "20px", paddingLeft: "5px", paddingRight: "5px", paddingBottom: "5px" }}>
                                                <CalendarComponent events={selectedProfessionalEvents} />
                                            </div>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </div>
                        )
                    }
                </div >

                <div>
                    {
                        tabIndex === 2 && (
                            <div>
                                <ProfessionalList viewProfList={viewProfList} loading={loading} filteredData={viewFilteredData} />
                            </div>
                        )
                    }
                </div>
            </Box >
            {/* </TabPanel> */}
            {/* </TabContext> */}
            <Footer />
        </>
    )
}

export default Schedule
