import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import { Popover, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Tooltip, IconButton, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import { Snackbar, Alert } from '@mui/material';
import Footer from '../../../Footer';
import HRNavbar from '../HRNavbar';
import { Table, AppBar } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import { useNavigate } from 'react-router-dom';

const Employee = () => {

    //////// permission start
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    console.log(permissions, 'fetching permission');

    const active = permissions.some(permission =>
        permission.modules_submodule.some(module =>
            module.modules.some(submodule =>
                submodule.submodules && submodule.submodules.some(sub =>
                    sub.submodule_name === 'Emp Active Deactivate'
                )
            )
        )
    );

    const documents = permissions.some(permission =>
        permission.modules_submodule.some(module =>
            module.modules.some(submodule =>
                submodule.submodules && submodule.submodules.some(sub =>
                    sub.submodule_name === 'Add Documents'
                )
            )
        )
    );

    const Professional = permissions.some(permission =>
        permission.modules_submodule.some(module =>
            module.modules.some(submodule =>
                submodule.submodules && submodule.submodules.some(sub =>
                    sub.submodule_name === 'View Professional'
                )
            )
        )
    );
    const Cost = permissions.some(permission =>
        permission.modules_submodule.some(module =>
            module.modules.some(submodule =>
                submodule.submodules && submodule.submodules.some(sub =>
                    sub.submodule_name === 'Professional Cost'
                )
            )
        )
    );

    //////// permisssion end

    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event, srv_prof_id) => {
        setAnchorEl(event.currentTarget);
        setActiveEmployeeId(activeEmployeeId === srv_prof_id ? null : srv_prof_id);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setActiveEmployeeId(null);
    };

    const isPopoverOpen = Boolean(anchorEl);
    //______________________

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    //////// permission start
    const [clgId, setClgId] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const id = localStorage.getItem('clg_id');
        setClgId(id);
    }, []);

    const navigate = useNavigate();

    const handleNavigation = (srv_prof_id) => {
        navigate('/hr/manage profiles/add-prof', { state: { srv_prof_id } });
    };

    const handleOnboarding = (srv_prof_id) => {
        navigate('/hr/onboarding', { state: { EmployeeProfessionalId: srv_prof_id } });
    };

    const [open, setOpen] = useState(false);
    const [srvProfId, setSrvProfId] = useState(null);
    const [subSrvCost, setSubSrvCost] = useState([]);
    const [profCode, setProfCode] = useState('');
    const [profName, setProfName] = useState('');
    const [profEmail, setProfEmail] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [activeEmployeeId, setActiveEmployeeId] = useState(null);
    const [loading, setLoading] = useState(true);
    /// EMPLOYEE Table LIST
    const [employeeList, setEmployeeList] = useState([]);
    console.log(employeeList, 'employee List');

    /// Sub Service MOdal Open
    const handleOpen = (srvProfId) => {
        console.log(srvProfId, 'fetched Srv Prof ID...');
        setSrvProfId(srvProfId)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const fetchSubSrvCost = async () => {
        console.log('Fetching data...');
        try {
            const response = await fetch(`${port}/hr/get_serv_subsrv_prof_paymt/${srvProfId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            console.log(data, 'fetched sub service data...');
            setSubSrvCost(data.sub_srv_data || []);
            setProfCode(data.prof_code);
            setProfName(data.prof_name);
            setProfEmail(data.prof_email);
        } catch (error) {
            console.error(error, 'Error fetching data..');
        }
    };

    useEffect(() => {
        console.log('useEffect triggered');
        fetchSubSrvCost();
    }, [srvProfId]);

    // POST API
    // const handleInputChange = (event, index) => {
    //     const updatedValue = event.target.value;
    //     setSubSrvCost((prevState) =>
    //         prevState.map((service, i) =>
    //             i === index ? { ...service, cost_prof_given: updatedValue } : service
    //         )
    //     );
    // };

    const handleInputChange = (event, index, maxCost) => {
        const value = event.target.value;

        if (value === '' || (Number(value) <= maxCost && !isNaN(value))) {
            const updatedSubSrvCost = [...subSrvCost];
            updatedSubSrvCost[index].cost_prof_given = value;
            setSubSrvCost(updatedSubSrvCost);
        }
    };

    const handleProfessionalCost = async () => {
        const dataToPost = subSrvCost.map((service) => ({
            prof_sub_srv_id: service.prof_sub_srv_id,
            srv_prof_id: service.srv_prof_id,
            Sub_srv_id: service.Sub_srv_id,
            sub_srv_name: service.sub_srv_name,
            prof_cost: service.prof_cost,
            cost_prof_given: service.cost_prof_given,
        }));

        console.log(dataToPost, 'post api hitting..');

        try {
            const response = await fetch(`${port}/hr/get_serv_subsrv_prof_paymt/${srvProfId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(dataToPost),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Data successfully posted:', data);

            // Show snackbar with success message
            setSnackbarMessage('Professional Cost Submitted Successfully');
            setOpenSnackbar(true);

            // Close snackbar after 3 seconds
            setTimeout(() => {
                setOpenSnackbar(false);
            }, 3000);

            await fetchSubSrvCost();
            handleClose();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    const fetchEmployee = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${port}/hr/Our_Employees_List/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log("Employee List Data Fetching......", data);
            // setEmployeeList(data)
            // setDoj(data.doj)
            if (data?.Res_Data?.msg === "No data found") {
                setEmployeeList([]);
            } else {
                setEmployeeList(data);
            }
        }
        catch (error) {
            console.log('Error Fetching Data');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEmployee();
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedEmployees = employeeList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleMoreClick = (srv_prof_id) => {
        setActiveEmployeeId(activeEmployeeId === srv_prof_id ? null : srv_prof_id);
    };

    /// search
    const [searchInput, setSearchInput] = useState("");

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        setPage(0);
    };

    const filteredEmployees = employeeList.filter((employee) => {
        const fullname = employee.prof_fullname ? employee.prof_fullname.toLowerCase() : '';
        const code = employee.professional_code ? employee.professional_code.toLowerCase() : '';
        const searchTerm = searchInput.toLowerCase();
        return fullname.includes(searchTerm) || code.includes(searchTerm);
    });

    // status modal open
    const [openModal, setOpenModal] = useState(false);
    const [selectedProfId, setSelectedProfId] = useState(null);
    const [status, setStatus] = useState(null);
    const [doj, setDoj] = useState(null);
    const [doe, setDoe] = useState(null);
    console.log(doj, 'dojdojdojdojdojdoj');

    const [remark, setRemark] = useState('');
    const [blacklistConfirmation, setBlacklistConfirmation] = useState(null);

    const handleOpenStatus = (srv_prof_id, currentStatus) => {
        setSelectedProfId(srv_prof_id);
        setStatus(currentStatus === 2 ? 1 : currentStatus);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const [openModal1, setOpenModal1] = useState(false);

    const handleOpenStatus1 = (srv_prof_id, currentStatus1) => {
        setSelectedProfId(srv_prof_id);
        setStatus(currentStatus1 === 1 ? 2 : currentStatus1);
        setOpenModal1(true);
    };

    const handleCloseModal1 = () => {
        setOpenModal1(false);
    };

    /// POST API Status for active
    const handleSubmit = async () => {
        const payload = {
            srv_prof_id: selectedProfId,
            status: status,
            doj: doj,
            last_modified_by: clgId,
            added_by: clgId
        };

        try {
            const response = await fetch(`${port}/hr/Our_Employees_Active_Inactive/${selectedProfId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Employee activated successfully');
                handleCloseModal();
                await fetchEmployee();
            } else {
                console.error('Error activating employee');
            }
        } catch (error) {
            console.error('Failed to send request:', error);
        }
    };

    /// POST API Status for InActive
    const handleSubmit1 = async () => {
        const payload = {
            srv_prof_id: selectedProfId,
            status: status,
            Black_list: blacklistConfirmation,
            Remark: remark,

            doe: doe,
            Join_Date: doj,
            Exit_Date: doe,
            last_modified_by: clgId,
            added_by: clgId
        };

        try {
            const response = await fetch(`${port}/hr/Our_Employees_Active_Inactive/${selectedProfId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Employee activated successfully');
                handleCloseModal1();
                await fetchEmployee();
            } else {
                console.error('Error activating employee');
            }
        } catch (error) {
            console.error('Failed to send request:', error);
        }
    };

    return (
        <>
            <HRNavbar style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }} />
            <Box sx={{ flexGrow: 1, mt: 1, ml: 1, mr: 1, mb: '2em' }}>
                <Stack direction={isSmallScreen ? 'column' : 'row'}
                    spacing={1}
                    alignItems={isSmallScreen ? 'center' : 'flex-start'}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>EMPLOYEE LIST</Typography>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 260, height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <IconButton type="button" sx={{ color: "#69A5EB", height: "36px", width: "36px" }}>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, }}
                            placeholder="Search Employee |"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                    </Box>

                    <Button
                        variant='contained'
                        sx={{
                            background: "#69A5EB",
                            textTransform: "capitalize",
                            borderRadius: "8px",
                            width: "14ch"
                        }}
                    >
                        View
                    </Button>
                </Stack>

                <Grid item xs={12} container spacing={1} sx={{ mt: 1, mb: 1 }}>
                    {loading ? (
                        <Grid item xs={12} style={{ textAlign: 'center', margin: '20px 0' }}>
                            <CircularProgress />
                        </Grid>
                    ) : (
                        filteredEmployees.length === 0 ? (
                            <Typography variant="h6" style={{ textAlign: 'center', marginTop: '20px', marginLeft: '50%' }}>
                                No data found
                            </Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((card) => (
                                    <Grid item xs={12} sm={6} lg={4} key={card.id} style={{ position: 'relative' }}>
                                        <Box sx={{ background: "#FFFFFF", borderRadius: "6px", padding: '6px' }}>
                                            <div style={{ display: "flex", width: "100%" }}>
                                                <div style={{ flex: '0 0 25%' }}>
                                                    <Avatar
                                                        alt={card.prof_fullname}
                                                        src={card.prof_fullname}
                                                        sx={{
                                                            border: `1.5px solid ${card.status === 1 ? '#00E08F' : card.status === 2 ? '#D62E4B' : '#C9C9C9'}`,
                                                            borderRadius: '50%',
                                                        }}
                                                    />
                                                    <Typography variant='body2' sx={{ mt: 1, fontWeight: 'bold' }}>
                                                        {card.professional_code ? card.professional_code : '-'}
                                                    </Typography>
                                                </div>

                                                <Box sx={{ borderLeft: '1px solid #767676', height: '122px', mx: 1, flex: '0 0 5%', flexDirection: 'column', justifyContent: 'space-between' }} />
                                                <div style={{ textAlign: 'left', flex: '0 0 60%' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                                        <Typography
                                                            variant='subtitle2'
                                                            sx={{
                                                                overflow: 'hidden',
                                                                whiteSpace: 'nowrap',
                                                                textOverflow: 'ellipsis',
                                                                flex: 1,
                                                            }}
                                                        >
                                                            {card.prof_fullname ? card.prof_fullname : '-'}
                                                        </Typography>

                                                        <div
                                                            style={{
                                                                marginLeft: '8px',
                                                                fontSize: '1.5rem',
                                                                lineHeight: 1,
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={(event) => handlePopoverOpen(event, card.srv_prof_id)}
                                                        >
                                                            <MoreHorizIcon />
                                                        </div>
                                                    </div>
                                                    <Typography variant='body2'>{card.srv_id ? card.srv_id : '-'}</Typography>
                                                    <Typography variant='body2'>{card.phone_no ? card.phone_no : '-'}</Typography>
                                                    <Box sx={{ borderBottom: '1px solid #767676', width: '150px', mr: 2, mt: 1, mb: 1 }} />
                                                    <div style={{ display: "flex" }}>
                                                        {
                                                            card.status === 1 ? (
                                                                <>
                                                                    <FmdGoodOutlinedIcon sx={{ fontSize: "18px", color: "#69A5EB" }} />
                                                                    <Typography variant='body2' sx={{ ml: 0.3, cursor: 'pointer' }}>
                                                                        {card.google_home_location && card.google_home_location.length > 20 ? (
                                                                            <Tooltip title={card.google_home_location} arrow>
                                                                                <span>{card.google_home_location.slice(0, 30) + '...'}</span>
                                                                            </Tooltip>
                                                                        ) : (
                                                                            <span>{card.google_home_location ? card.google_home_location : '-'}</span>
                                                                        )}
                                                                    </Typography>
                                                                </>
                                                            ) : (
                                                                <Box sx={{ ml: 0.3 }}>
                                                                    <Typography variant='body2'>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <CalendarTodayOutlinedIcon sx={{ mr: 0.7, fontSize: '16px', fontWeight: 'bold' }} />
                                                                            <Typography variant='body2' component='span' sx={{ fontWeight: 'bold', mr: 1.2 }}>
                                                                                DOJ
                                                                            </Typography>
                                                                            : {card.doj ? card.doj : '-'}
                                                                        </Box>
                                                                    </Typography>
                                                                    <Typography variant='body2'>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <CalendarTodayOutlinedIcon sx={{ mr: 0.7, fontSize: '16px', fontWeight: 'bold' }} />
                                                                            <Typography variant='body2' component='span' sx={{ fontWeight: 'bold', mr: 1.2 }}>
                                                                                DOE
                                                                            </Typography>
                                                                            : {card.doe ? card.doe : '-'}
                                                                        </Box>
                                                                    </Typography>
                                                                </Box>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {activeEmployeeId === card.srv_prof_id && (
                                                <Popover
                                                    open={isPopoverOpen}
                                                    anchorEl={anchorEl}
                                                    onClose={handlePopoverClose}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            padding: '10px',
                                                            backgroundColor: '#F5F5F5',
                                                            borderRadius: '5px',
                                                            width: '12em',
                                                        }}
                                                    >
                                                        {/* Dynamic Actions */}
                                                        {active && (
                                                            <div>
                                                                {card.status === 2 ?
                                                                    (
                                                                        <Typography
                                                                            sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                color: '#00E08F',
                                                                                cursor: 'pointer',
                                                                                fontSize: '14px',
                                                                                mb: 1,
                                                                            }}
                                                                            onClick={() => handleOpenStatus(card.srv_prof_id, card.status)}
                                                                        >
                                                                            <CheckIcon sx={{ mr: 1 }} />
                                                                            Mark Active
                                                                        </Typography>
                                                                    )
                                                                    :
                                                                    (
                                                                        <Typography
                                                                            sx={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                color: '#D62E4B',
                                                                                cursor: 'pointer',
                                                                                fontSize: '14px',
                                                                                mb: 1,
                                                                            }}
                                                                            onClick={() => handleOpenStatus1(card.srv_prof_id, card.status)}
                                                                        >
                                                                            <ClearIcon sx={{ mr: 1 }} />
                                                                            Mark Deactive
                                                                        </Typography>
                                                                    )
                                                                }
                                                            </div>
                                                        )}

                                                        {documents && (
                                                            <Typography
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    color: '#69A5EB',
                                                                    cursor: 'pointer',
                                                                    fontSize: '14px',
                                                                    mb: 1,
                                                                }}
                                                                onClick={() => handleOnboarding(card.srv_prof_id)}
                                                            >
                                                                <NoteAddOutlinedIcon sx={{ mr: 1 }} />
                                                                Add Documents
                                                            </Typography>
                                                        )}

                                                        {Professional && (
                                                            <Typography
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    color: '#9342C5',
                                                                    cursor: 'pointer',
                                                                    fontSize: '14px',
                                                                    mb: 1,
                                                                }}
                                                                onClick={() => handleNavigation(card.srv_prof_id)}
                                                            >
                                                                <RemoveRedEyeOutlinedIcon sx={{ mr: 1 }} />
                                                                View Professional
                                                            </Typography>
                                                        )}

                                                        {Cost && (
                                                            <Typography
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    color: 'green',
                                                                    cursor: 'pointer',
                                                                    fontSize: '14px',
                                                                    mb: 1,
                                                                }}
                                                                onClick={() => handleOpen(card.srv_prof_id)}
                                                            >
                                                                <CurrencyRupeeOutlinedIcon sx={{ mr: 1 }} />
                                                                Professional Cost
                                                            </Typography>
                                                        )}
                                                    </div>
                                                </Popover>
                                            )}

                                            <Modal open={open} onClose={handleClose}>
                                                <Box sx={{
                                                    position: 'absolute', top: '50%', left: '50%',
                                                    transform: 'translate(-50%, -50%)', width: 600,
                                                    bgcolor: 'background.paper', boxShadow: 24, p: 3,
                                                    borderRadius: 2,
                                                    overflowY: 'scroll', maxHeight: '400px'
                                                }}>
                                                    <Box sx={{ width: '90%', maxWidth: 500, borderRadius: 2, border: 'none' }}>
                                                        <AppBar
                                                            position="static"
                                                            sx={{
                                                                background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                                width: '40em',
                                                                height: '3rem',
                                                                mt: '-24px',
                                                                ml: '-24.7px',
                                                                borderRadius: '8px 0px 0 0',
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mt: 1 }}>
                                                                <Typography variant="h6" component="h2">Professional Payment Details</Typography>
                                                                <IconButton onClick={handleClose} size="small">
                                                                    <CloseIcon />
                                                                </IconButton>
                                                            </Box>
                                                        </AppBar>
                                                    </Box>

                                                    {/* Grid layout for displaying professionals */}
                                                    {/* <Grid container spacing={2} sx={{ mt: 0.1, mb: 1 }}>
                                                        <Grid item xs={6}>
                                                            <Typography component="h2">Professional Code</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography component="h2">{profCode}</Typography>
                                                        </Grid>
                                                    </Grid> */}

                                                    <Grid container spacing={2} sx={{ mb: 1, mt: 0.1 }}>
                                                        <Grid item xs={6}>
                                                            <Typography component="h2">Name</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography component="h2">{profName}</Typography>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container spacing={2} sx={{ mb: 1 }}>
                                                        <Grid item xs={6}>
                                                            <Typography component="h2">Email Address</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography component="h2">{profEmail}</Typography>
                                                        </Grid>
                                                    </Grid>

                                                    <Typography sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Allocated Sub Service</Typography>

                                                    <Grid container spacing={2} sx={{ mb: 1 }}>
                                                        {subSrvCost.map((service, index) => (
                                                            <React.Fragment key={service.prof_sub_srv_id}>
                                                                <Grid item xs={6}>
                                                                    <Typography component="h2" style={{ marginTop: '5px' }}>
                                                                        {service.sub_srv_name} <strong>[Rs.{service.prof_cost}]</strong>
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        label="Enter Professional Cost"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        size="small"
                                                                        value={service.cost_prof_given || ''}
                                                                        // onChange={(event) => handleInputChange(event, index)}
                                                                        onChange={(event) => handleInputChange(event, index, service.prof_cost)}
                                                                    />
                                                                </Grid>
                                                            </React.Fragment>
                                                        ))}
                                                    </Grid>
                                                    <Button style={{ backgroundColor: "#69A5EB", color: 'white', marginLeft: '19em', marginTop: '0.7em' }}
                                                        onClick={handleProfessionalCost}
                                                    >
                                                        Submit
                                                    </Button>
                                                </Box>
                                            </Modal>

                                            <Modal open={openModal} onClose={handleCloseModal}>
                                                <div style={{
                                                    padding: '20px',
                                                    backgroundColor: 'white',
                                                    borderRadius: '8px',
                                                    outline: 'none',
                                                    width: '400px',
                                                    position: 'relative',
                                                    margin: 'auto',
                                                    top: '20%',
                                                }}>
                                                    <IconButton
                                                        onClick={handleCloseModal}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            right: '10px',
                                                        }}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                    <h2>{card.status === 1 ? 'Deactivate Employee' : 'Activate Employee'}</h2>

                                                    <TextField
                                                        label="Select DOJ"
                                                        type="date"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        name='doj'
                                                        variant="outlined"
                                                        fullWidth
                                                        onChange={(e) => setDoj(e.target.value)}
                                                        size='small'
                                                    />

                                                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSubmit}
                                                        >
                                                            Submit
                                                        </Button>
                                                    </Box>
                                                </div>
                                            </Modal>

                                            <Modal open={openModal1} onClose={handleCloseModal1}>
                                                <div style={{
                                                    padding: '20px',
                                                    backgroundColor: 'white',
                                                    borderRadius: '8px',
                                                    outline: 'none',
                                                    width: '400px',
                                                    position: 'relative',
                                                    margin: 'auto',
                                                    top: '20%',
                                                }}>
                                                    <IconButton
                                                        onClick={handleCloseModal1}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            right: '10px',
                                                        }}
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>

                                                    <h2>{card.status === 1 ? 'Deactivate Employee' : 'Activate Employee'}</h2>
                                                    <TextField
                                                        label="Select DOE"
                                                        type="date"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        fullWidth
                                                        style={{ marginBottom: '0.5em' }}
                                                        size='small'
                                                        name='doe'
                                                        onChange={(e) => setDoe(e.target.value)}
                                                    />

                                                    <TextField
                                                        label="Remark"
                                                        variant="outlined"
                                                        fullWidth
                                                        size='small'
                                                        value={remark}
                                                        onChange={(e) => setRemark(e.target.value)}
                                                    />

                                                    <FormControl component="fieldset">
                                                        <h4 style={{ margin: 0 }}>Are you sure you want to blacklist the employee?</h4>
                                                        <RadioGroup
                                                            row
                                                            sx={{ margin: 0 }}
                                                            value={blacklistConfirmation}
                                                            onChange={(e) => setBlacklistConfirmation(Number(e.target.value))}
                                                        >
                                                            <FormControlLabel value={1} control={<Radio />} label="Yes" />
                                                            <FormControlLabel value={2} control={<Radio />} label="No" />
                                                        </RadioGroup>
                                                    </FormControl>

                                                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSubmit1}
                                                        >
                                                            Submit
                                                        </Button>
                                                    </Box>
                                                </div>
                                            </Modal>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        )
                    )}
                </Grid>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                <TablePagination
                    component="div"
                    count={filteredEmployees.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box >
            <Footer />
        </>
    );
};

export default Employee;
