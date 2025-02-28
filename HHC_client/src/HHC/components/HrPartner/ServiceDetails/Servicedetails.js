import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Footer from '../../../Footer';
import HRNavbar from '../../HR/HRNavbar';
import { Grid, useMediaQuery, CircularProgress, TextField, Box, Stack, Button, AppBar, InputBase, Menu, MenuItem, Modal, Card, CardContent, Typography, Table, TableHead, TableRow, TableBody, TableContainer, TablePagination, Tooltip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DetailsCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '5px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "44px",
    borderRadius: '10px',
});

const ProfileCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "50px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        cursor: 'pointer',
    },
});

const Servicedetails = () => {

    const [company, setCompany] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem('companyID');
        setCompany(id);
    }, []);

    const [state, setState] = React.useState({
        gilad: true,
    });

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [searchQuery, setSearchQuery] = useState('');
    const [service, setService] = useState([]);
    const [selectService, setSelectService] = useState('')
    //////// permission start
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    console.log(permissions, 'fetching permission');
    const [profileData, setProfileData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [loading, setLoading] = useState(true);
    //// Modal Opening
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [fetchEventDetails, setFetchEventDetails] = useState([]);
    const [openSessions, setOpenSessions] = useState(false);
    const [sesDetails, setSesDetails] = useState([]);

    const handleOpenSessions = () => {
        setOpenSessions(true);
    };
    const handleCloseSessions = () => {
        setOpenSessions(false);
    };
    //date validation
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const handleServiceChange = (e) => {
        setSelectService(e.target.value)
    }

    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);
        if (toDate && new Date(toDate) <= new Date(selectedFromDate)) {
            setToDate("");
        }
    };

    const getMinToDate = () => {
        if (!fromDate) return undefined;
        const nextDay = new Date(fromDate);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString().split("T")[0];
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleViewClick = async (eveID) => {
        console.log(eveID, 'eveID');
        setSelectedProfile(eveID);
        setIsModalOpen(true);

        try {
            const response = await fetch(`${port}/web/SingleRecord/${eveID}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
            const data = await response.json();
            console.log(data.Event_Invoice, 'fetched ID Wise Data');
            setFetchEventDetails(data.Event_Invoice);
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProfile(null);
    };

    // service API
    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await fetch(`${port}/web/agg_hhc_services_api`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                });
                const data = await response.json();
                console.log(data, 'fetching service Name');
                setService(data);
            }
            catch (error) {
                console.log(error, 'Error Fetching Data...');

            }
        }
        fetchService()
    }, [])

    useEffect(() => {
        const getSesDetails = async () => {
            if (selectedProfile) {
                try {
                    const res = await fetch(`${port}/web/all_session_details/${selectedProfile}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Session Details....", data);
                    setSesDetails(data.all_session_details);
                } catch (error) {
                    console.error("Error fetching Session Details:", error);
                }
            }
        };
        getSesDetails();
    }, [selectedProfile]);

    useEffect(() => {
        const fetchDefaultData = async () => {
            if (!company) return;

            try {
                const res = await fetch(`${port}/hr/External_prof_Ongoing_Event/${company}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (res.status === 200) {
                    const data = await res.json();
                    console.log("Default Manage Professional Profile Data:", data);

                    if (Array.isArray(data) && data.length > 0) {
                        setProfileData(data);
                    } else {
                        setProfileData([]);
                    }
                } else {
                    console.error(`Default API returned status ${res.status}`);
                    setProfileData([]);
                }
            } catch (error) {
                console.error("Error fetching Default Manage Professional Profile Data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDefaultData();
    }, [company]); 

    // On View Button Click: Fetch filtered data
    const handelSearch = async () => {
        if (!company) return;

        let filterParams = '';

        if (selectService) {
            filterParams += `&service_id=${selectService}`;
        }
        if (fromDate) {
            filterParams += `&from_date=${fromDate}`;
        }
        if (toDate) {
            filterParams += `&to_date=${toDate}`;
        }
        if (searchQuery) {
            filterParams += `&search=${searchQuery}`;
        }

        setLoading(true);

        try {
            const res = await fetch(`${port}/hr/External_prof_Ongoing_Event/${company}/?${filterParams}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                const data = await res.json();
                console.log("Filtered Manage Professional Profile Data:", data);

                if (Array.isArray(data) && data.length > 0) {
                    setProfileData(data);
                } else {
                    setProfileData([]);
                }
            } else {
                console.error(`Filtered API returned status ${res.status}`);
                setProfileData([]);
            }
        } catch (error) {
            console.error("Error fetching Filtered Manage Professional Profile Data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, mt: 1, ml: 1, mr: 1, mb: 4 }}>
                <Stack direction={isSmallScreen ? 'column' : 'row'}
                    spacing={1}
                    alignItems={isSmallScreen ? 'center' : 'flex-start'}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>SERVICE DETAILS</Typography>
                    <Box
                        component="form"
                        sx={{
                            marginLeft: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            width: 200,
                            backgroundColor: "#ffffff",
                            boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                            borderRadius: "10px",
                        }}
                    >
                        <TextField
                            select
                            size='small'
                            label="Select Service"
                            variant="outlined"
                            sx={{ width: 250 }}
                            InputProps={{ style: { border: "0px solid white" } }}
                            inputProps={{ 'aria-label': 'Select Service' }}
                            // onChange={handleServiceChange}
                            onChange={(e) => setSelectService(e.target.value)}
                            value={selectService}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                    },
                                },
                            }}
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        sx: {
                                            maxHeight: service.length > 0 ? `${Math.min(service.length * 40, 200)}px` : 'auto',
                                            overflow: 'auto',
                                        },
                                    },
                                },
                            }}
                        >
                            {service.map((item) => (
                                <MenuItem key={item.srv_id} value={item.srv_id}>{item.service_title}</MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box
                        component="form"
                        sx={{
                            marginLeft: '2rem',
                            p: "2px 4px",
                            display: 'flex',
                            alignItems: 'center',
                            width: 200,
                            height: '2.5rem',
                            backgroundColor: "#ffffff",
                            boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                            borderRadius: "10px",
                            border: "1px solid #C9C9C9"
                        }}
                    >
                        <InputBase
                            sx={{ ml: 1, mr: 1, flex: 1 }}
                            type='date'
                            value={fromDate}
                            onChange={handleFromDateChange}
                        />
                    </Box>

                    <Box
                        component="to"
                        sx={{
                            marginLeft: '2rem',
                            p: "2px 4px",
                            display: 'flex',
                            alignItems: 'center',
                            width: 200,
                            height: '2.5rem',
                            backgroundColor: "#ffffff",
                            boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                            borderRadius: "10px",
                            border: "1px solid #C9C9C9"
                        }}
                    >
                        <InputBase
                            sx={{ ml: 1, mr: 1, flex: 1 }}
                            type='date'
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            inputProps={{
                                min: getMinToDate()
                            }}
                        />
                    </Box>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 200, height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <IconButton type="button" sx={{ color: "#69A5EB", height: "36px", width: "36px" }}>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, }}
                            placeholder="Search..."
                            inputProps={{ 'aria-label': 'select service' }}
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ minWidth: 120 }}
                        onClick={handelSearch}
                    >
                        View
                    </Button>
                </Stack>

                <TableContainer sx={{ height: "68vh" }}>
                    <Table >
                        <TableHead>
                            <TableRow>
                                {/* Table headers */}
                                <ProfileCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Email ID</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Phone Number</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.8, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Service Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Start Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">End Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Action</Typography>
                                    </CardContent>
                                </ProfileCard>
                            </TableRow>
                        </TableHead>

                        {loading ? (
                            <Box sx={{ display: 'flex', mt: 15, ml: 80, height: '100px' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableBody>
                                {profileData.length === 0 ? (
                                    <TableRow>
                                        <CardContent>
                                            <Typography variant="body2">No Data Available</Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    profileData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <TableRow key={row.eve_id}>
                                            <ProfileCard>
                                                <CardContent style={{ flex: 0.5 }}>
                                                    <Typography variant="body2">{index + 1 + page * rowsPerPage}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.5 }}>
                                                    <Typography variant="body2">{row.patient_name || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.5 }}>
                                                    <Typography variant="body2">{row.professional_email || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1 }}>
                                                    <Typography variant="body2">{row.caller_no || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.8 }}>
                                                    <Typography variant="body2">{row.service_name || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1 }}>
                                                    <Typography variant="body2">{row.st_date || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1 }}>
                                                    <Typography variant="body2">{row.en_date || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1 }}>
                                                    <Box display="flex" justifyContent="center" alignItems="center" gap={0}>
                                                        <IconButton onClick={() => handleViewClick(row.eve_id)} style={{ padding: 4 }}>
                                                            <RemoveRedEyeOutlinedIcon />
                                                        </IconButton>
                                                    </Box>
                                                </CardContent>
                                            </ProfileCard>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        )}
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component="div"
                        count={profileData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>

                <Modal open={isModalOpen} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 900,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 2,
                            borderRadius: '10px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                        }}
                    >
                        <Box sx={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'background.paper',
                            paddingBottom: 1,
                            marginBottom: 2,
                            borderBottom: '1px solid'
                        }}>
                            <Typography variant="h6" component="h2">
                                EVENT DETAILS
                            </Typography>
                            <IconButton
                                onClick={handleCloseModal}
                                sx={{
                                    color: 'grey.500',
                                }}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        {/* <hr /> */}

                        <Box sx={{
                            maxHeight: '70vh',  // Ensures content section is scrollable
                            overflowY: 'auto',  // Enables vertical scrolling
                            // paddingTop: 2,
                            paddingBottom: 2,
                            paddingRight: 2,
                        }}>
                            <div>
                                <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>CALLER DETAILS</Typography>
                                <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                    <Typography inline variant="body2" color="text.secondary">Contact</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 2 }}>+91 {fetchEventDetails[0]?.caller.caller_number ?? ""}</Typography>
                                </Grid>

                                <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                    <Typography inline variant="body2" color="text.secondary">Name</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 2 }}>{fetchEventDetails[0]?.caller.caller_name ?? ""}</Typography>
                                </Grid>
                            </div>

                            <div style={{ marginTop: "15px" }}>
                                <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>PATIENT DETAILS</Typography>
                                <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                    <Typography inline variant="body2" color="text.secondary">Name</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 2 }}>{fetchEventDetails[0]?.patient.patient_name ?? ""}</Typography>
                                </Grid>

                                <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                    <Typography inline variant="body2" color="text.secondary">Mobile</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 2 }}>+91 {fetchEventDetails[0]?.patient.patient_contact ?? ""}</Typography>
                                </Grid>

                                <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                    <Typography inline variant="body2" color="text.secondary">Age</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 2 }}> {fetchEventDetails[0]?.patient.patient_age ?? ""}</Typography>
                                </Grid>

                                <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                    <Typography inline variant="body2" color="text.secondary">Gender</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 2 }}> {fetchEventDetails[0]?.patient.patient_gender ?? ""}</Typography>
                                </Grid>

                                <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                    <Typography inline variant="body2" color="text.secondary">Email Id</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 2 }}>{fetchEventDetails[0]?.patient.patient_email ?? ""}</Typography>
                                </Grid>

                                <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                    <Typography inline variant="body2" color="text.secondary">Residential Address</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 2 }}>{fetchEventDetails[0]?.patient_Google_address ?? ""}</Typography>
                                </Grid>

                                <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                    <Typography inline variant="body2" color="text.secondary">Permanent Address</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 2 }}>{fetchEventDetails[0]?.patient_address ?? ""}</Typography>
                                </Grid>

                                <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                    <Typography inline variant="body2" color="text.secondary">Location</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 2 }}>Pune, Maharashtra, India</Typography>
                                </Grid>

                                <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                    <Typography inline variant="body2" color="text.secondary">Pincode</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 2 }}>411051</Typography>
                                </Grid>
                            </div>

                            <div style={{ marginTop: "15px" }}>
                                <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>SERVICE DETAILS</Typography>
                                <Typography variant='body2' sx={{ mt: 1 }}><b>Service:</b> {fetchEventDetails[0]?.service_name ?? ""}</Typography>
                                <Typography variant='body2' sx={{ mt: 1 }}><b>Sub Service:</b> {fetchEventDetails[0]?.service.sub_service ?? ""} </Typography>
                                <Typography variant='body2' sx={{ mt: 1 }}><b>Hospital Name:</b> {fetchEventDetails[0]?.service.hospital_name ?? ""} </Typography>
                                <Typography variant='body2' sx={{ mt: 1 }}><b>Consultant Name:</b> {fetchEventDetails[0]?.service.consultant_name ?? ""}</Typography>
                                <Typography variant='body2' sx={{ mt: 1 }}><b>Suffered From:</b> {fetchEventDetails[0]?.service.suffer_from ?? ""}</Typography>
                                <TableContainer sx={{ mt: 1 }}>
                                    <Table>
                                        <TableHead >
                                            <TableRow >
                                                <DetailsCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                                    <CardContent style={{ width: "15%" }}>
                                                        <Typography variant='subtitle2'>Professional Name</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ width: "5%", }}>
                                                        <Typography variant='subtitle2'>Sessions</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ width: "10%" }}>
                                                        <Typography variant='subtitle2'>Start Date</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ width: "10%" }}>
                                                        <Typography variant='subtitle2'>End Date</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ width: "10%" }}>
                                                        <Typography variant='subtitle2'>Session Amt</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ width: "10%" }}>
                                                        <Typography variant='subtitle2'>Convenience</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ width: "10%" }}>
                                                        <Typography variant='subtitle2'>Total Amt</Typography>
                                                    </CardContent>
                                                </DetailsCard>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {fetchEventDetails.length === 0 ? (
                                                <TableRow>
                                                    <CardContent >
                                                        <Typography variant="body2" sx={{ ml: 40 }}>
                                                            No Data Available
                                                        </Typography>
                                                    </CardContent>
                                                </TableRow>
                                            ) : (
                                                fetchEventDetails
                                                    .map((row, index) => (
                                                        <TableRow
                                                            key={index}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            {row.professional_amount.map((professional, profIndex) => (
                                                                <DetailsCard key={profIndex}>
                                                                    <CardContent style={{ width: "15%" }}>
                                                                        <Typography variant="body2">
                                                                            {professional.professional_name}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ width: "5%" }}>
                                                                        <Typography variant="body2">
                                                                            {professional.sessions}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ width: "10%" }}>
                                                                        <Typography variant="body2" >
                                                                            {professional.start_date}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ width: "10%" }}>
                                                                        <Typography variant="body2">
                                                                            {professional.end_date}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ width: "10%" }}>
                                                                        <Typography variant="body2">
                                                                            ₹{professional.amount}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ width: "10%" }}>
                                                                        <Typography variant="body2">
                                                                            ₹{professional.conv_charges ? professional.conv_charges : '0'}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ width: "10%" }}>
                                                                        <Typography variant="body2">
                                                                            ₹{professional.prof_tot_amt ? professional.prof_tot_amt : '0'}
                                                                        </Typography>
                                                                    </CardContent>
                                                                </DetailsCard>
                                                            ))}
                                                            <div style={{ display: "flex", marginTop: "12px" }}>
                                                                <Typography sx={{ ml: 2 }} variant='subtitle2'>View all session details:</Typography> <RemoveRedEyeOutlinedIcon sx={{ fontSize: "22px", color: "#606467", cursor: "pointer", ml: 85 }} onClick={handleOpenSessions} />
                                                            </div>
                                                        </TableRow>
                                                    )
                                                    ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>

                            <div style={{ marginTop: "15px" }}>
                                <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>PAYMENT DETAILS</Typography>
                                <DetailsCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="subtitle2">Payment date</Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="body2">Payment mode</Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="body2">Discount type</Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="body2">Discount Amt</Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="body2">Convenience charges</Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "20%" }}>
                                        <Typography variant="body2">UTR</Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="body2">Final Amt </Typography>
                                    </CardContent>
                                </DetailsCard>

                                <DetailsCard >
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="body2">
                                            {fetchEventDetails[0]?.payment_date ? fetchEventDetails[0].payment_date.slice(0, 10) : 'None'}
                                        </Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="body2">
                                            {fetchEventDetails[0]?.payment_mode === 1 ? 'Cash' :
                                                fetchEventDetails[0]?.payment_mode === 2 ? 'Cheque' :
                                                    fetchEventDetails[0]?.payment_mode === 3 ? 'Online' :
                                                        fetchEventDetails[0]?.payment_mode === 4 ? 'Card' :
                                                            fetchEventDetails[0]?.payment_mode === 5 ? 'QR' :
                                                                fetchEventDetails[0]?.payment_mode === 6 ? 'NEFT' : 'None'}
                                        </Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="body2">
                                            {fetchEventDetails[0]?.discount_type === 1 ? '%' :
                                                fetchEventDetails[0]?.discount_type === 2 ? '₹' :
                                                    fetchEventDetails[0]?.discount_type === 3 ? 'Complementary' :
                                                        fetchEventDetails[0]?.discount_type === 4 ? 'VIP' : 'None'}
                                        </Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="body2">
                                            {fetchEventDetails[0]?.discount_value ? fetchEventDetails[0]?.discount_value : "None"}
                                        </Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="body2">
                                            ₹{fetchEventDetails[0]?.conveniance_charges}
                                        </Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "20%" }}>
                                        <Typography variant="body2">
                                            {fetchEventDetails[0]?.utr ? fetchEventDetails[0]?.utr : "None"}
                                        </Typography>
                                    </CardContent>
                                    <CardContent style={{ width: "10%" }}>
                                        <Typography variant="body2">
                                            ₹{fetchEventDetails[0]?.Final_amount}
                                        </Typography>
                                    </CardContent>
                                </DetailsCard>
                            </div>

                            <Modal
                                open={openSessions}
                                onClose={handleCloseSessions}
                                aria-labelledby="parent-modal-title"
                                aria-describedby="parent-modal-description"
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 700,
                                        bgcolor: 'background.paper',
                                        boxShadow: 24,
                                        p: 2,
                                        borderRadius: '10px',
                                        maxHeight: '80vh',
                                        overflowY: 'auto',
                                    }}
                                >
                                    <div style={{ display: "flex" }}>
                                        <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "gray", marginTop: "10px" }}>SESSION DETAILS</Typography>
                                        <Button onClick={handleCloseSessions} sx={{ marginLeft: 'auto', color: "gray", marginTop: "2px", }}><CloseIcon /></Button>
                                    </div>

                                    <TableContainer sx={{ mt: 1, maxHeight: sesDetails.length >= 8 ? '450px' : 'auto', overflowY: sesDetails.length >= 8 ? 'scroll' : 'visible' }}>
                                        <Table>
                                            <TableHead >
                                                <TableRow >
                                                    <DetailsCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                                        <CardContent style={{ width: "30%" }}>
                                                            <Typography variant='subtitle2'>Professional Name</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ width: "20%" }}>
                                                            <Typography variant='subtitle2'>Start Date | Time</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ width: "20%" }}>
                                                            <Typography variant='subtitle2'>End Date | Time</Typography>
                                                        </CardContent>
                                                    </DetailsCard>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {sesDetails.length === 0 ? (
                                                    <TableRow>
                                                        <CardContent >
                                                            <Typography variant="body2" sx={{ ml: 40 }}>
                                                                No Data Available
                                                            </Typography>
                                                        </CardContent>
                                                    </TableRow>
                                                ) : (
                                                    sesDetails
                                                        .map((professional, index) => (
                                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                <DetailsCard key={index}>
                                                                    <CardContent style={{ width: "30%" }}>
                                                                        <Typography variant="body2">
                                                                            {professional.professional_name}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ width: "20%" }}>
                                                                        <Typography variant="body2" >
                                                                            {professional.start_date} | {professional.start_time}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ width: "20%" }}>
                                                                        <Typography variant="body2">
                                                                            {professional.end_date} | {professional.end_time}
                                                                        </Typography>
                                                                    </CardContent>
                                                                </DetailsCard>
                                                            </TableRow>
                                                        )
                                                        ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Modal>
                        </Box>
                    </Box>
                </Modal>
            </Box>
            <Footer />
        </>

    )
}

export default Servicedetails
