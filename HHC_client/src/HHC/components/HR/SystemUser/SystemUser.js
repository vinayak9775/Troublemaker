
import React, { useState, useEffect } from 'react';
import HRNavbar from '../../HR/HRNavbar'
import { Box, Stack } from '@mui/system'
import {
    Button, CardContent, Grid, MenuItem, AppBar, IconButton, InputBase, Modal, Table,
    TableBody, TableContainer, TableHead, TableRow, TextField, Typography,
    Card, TablePagination, Popover
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Footer from '../../../Footer'
import TableCell from '@mui/material/TableCell';
import CircularProgress from '@mui/material/CircularProgress';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

const UserCard = styled(Card)({
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
    },
});

const SystemUser = () => {

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [openModal, setOpenModal] = useState(false);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [hosiptal, setHospital] = useState([]);
    const [user, setUser] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [errors, setErrors] = useState({});
    const [isViewMode, setIsViewMode] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false)

    ////// Form Validation
    const [formData, setFormData] = useState({
        clg_ref_id: '',
        clg_first_name: '',
        clg_email: '',
        clg_mobile_no: '',
        clg_gender: '',
        clg_marital_status: '',
        clg_Date_of_birth: '',
        clg_hos_id: '',
        grp_id: '',
        clg_joining_date: '',
        clg_address: '',
        clg_state: '',
        clg_district: '',
        clg_work_email_id: '',
        clg_Work_phone_number: '',
    });

    const handleMoreIconClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredTableData = tableData
        .filter((item) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                (item.clg_first_name || '').toLowerCase().includes(searchLower) ||
                (item.clg_work_clg_email_id || '').toLowerCase().includes(searchLower) ||
                (item.clg_Work_phone_number ? item.clg_Work_phone_number.toString().toLowerCase().includes(searchLower) : false)
            );
        });

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${port}/web/Get_User/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                console.log('Fetching the Table Data', data);
                setTableData(data);
                setLoading(false);
            }
            catch (error) {
                console.log('Error fetching Data');
            }
        }
        fetchUserDetails();
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${port}/web/Group_N/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    console.error('Failed to fetch data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchUser();
    }, [])

    useEffect(() => {
        const fetchHospital = async () => {
            const res = await fetch(`${port}/web/agg_hhc_hospitals_api`, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            const data = await res.json();
            console.log('fetching Hospital Data', data);
            setHospital(data)
        }
        fetchHospital();
    }, [])

    useEffect(() => {
        const fetchState = async () => {
            const response = await fetch(`${port}/web/agg_hhc_state_api`, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            console.log('Fetch the State Data', data);
            setState(data);
        }
        fetchState()
    }, [])

    useEffect(() => {
        if (formData.clg_state) {
            const fetchCity = async () => {
                try {
                    const response = await fetch(`${port}/web/agg_hhc_city_api/${formData.clg_state}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    console.log('Fetched City Data:', data);
                    setCity(data);
                } catch (error) {
                    console.error('Error fetching state data:', error);
                }
            };
            fetchCity();
        }
    }, [formData.clg_state]);

    const userModalOpen = (() => {
        setOpenModal(true)
        setFormData({})
        setErrors({})
    })

    const handleViewClick = ((user) => {
        setIsViewMode(true);
        setOpenModal(true);
        setFormData({
            ...formData,
            clg_ref_id: user.clg_ref_id,
            clg_first_name: user.clg_first_name,
            clg_email: user.clg_email,
            clg_mobile_no: user.clg_mobile_no,
            clg_gender: user.clg_gender,
            clg_marital_status: user.clg_marital_status,
            clg_Date_of_birth: user.clg_Date_of_birth,
            clg_hos_id: user.clg_hos_id,
            grp_id: user.grp_id,
            clg_joining_date: user.clg_joining_date,
            clg_address: user.clg_address,
            clg_state: user.clg_state,
            clg_district: user.clg_district,
            clg_work_email_id: user.clg_work_email_id,
            clg_Work_phone_number: user.clg_Work_phone_number,
        });

    })

    const handleEditClick = ((user) => {
        setOpenModal(true);
        setFormData({
            ...formData,
            pk: user.pk,
            clg_ref_id: user.clg_ref_id,
            clg_first_name: user.clg_first_name,
            clg_email: user.clg_email,
            clg_mobile_no: user.clg_mobile_no,
            clg_gender: user.clg_gender,
            clg_marital_status: user.clg_marital_status,
            clg_Date_of_birth: user.clg_Date_of_birth,
            clg_hos_id: user.clg_hos_id,
            grp_id: user.grp_id,
            clg_joining_date: user.clg_joining_date,
            clg_address: user.clg_address,
            clg_state: user.clg_state,
            clg_district: user.clg_district,
            clg_work_email_id: user.clg_work_email_id,
            clg_Work_phone_number: user.clg_Work_phone_number,
        });
    })

    const userModalClose = (() => {
        setOpenModal(false)
    })

    ////// Form Validation
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));

        // Check if value is a number and within the length limit
        if (name === "clg_mobile_no") {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData(prevData => ({
                    ...prevData,
                    [name]: numericValue
                }));
            }
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }

        if (name === "clg_first_name" || name === "clg_ref_id") {
            const textValue = value.replace(/[0-9]/g, '');

            setFormData(prevData => ({
                ...prevData,
                [name]: textValue
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }

        // Clear the error for the field being modified
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.clg_ref_id) formErrors.clg_ref_id = 'User Name is required';
        if (!formData.clg_first_name) formErrors.clg_first_name = 'Full Name is required';
        if (!formData.clg_email) formErrors.clg_email = 'Email ID is required';
        if (!formData.clg_mobile_no) formErrors.clg_mobile_no = 'Mobile Number is required';
        if (!formData.clg_gender) formErrors.clg_gender = 'Gender is required';
        if (!formData.clg_marital_status) formErrors.clg_marital_status = 'Marital Status is required';
        if (!formData.clg_Date_of_birth) formErrors.clg_Date_of_birth = 'Date of Birth is required';
        if (!formData.clg_hos_id) formErrors.clg_hos_id = 'Hospital Name is required';
        if (!formData.grp_id) formErrors.grp_id = 'User Group is required';
        if (!formData.clg_joining_date) formErrors.clg_joining_date = 'Date of Joining is required';
        if (!formData.clg_address) formErrors.clg_address = 'Address is required';
        if (!formData.clg_state) formErrors.clg_state = 'State is required';
        if (!formData.clg_district) formErrors.clg_district = 'City is required';

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                console.log('Form Data before submission:', formData);

                const formDataToSubmit = {
                    ...formData,
                    clg_work_email_id: formData.clg_email,
                    clg_Work_phone_number: formData.clg_mobile_no,
                };

                let response;
                let result;

                if (formData.pk) {
                    // Make the PUT request to update existing user data
                    response = await fetch(`${port}/web/Edit_User/${formData.pk}/`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formDataToSubmit),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    result = await response.json();
                    setTableData(prevData =>
                        prevData.map(user =>
                            user.pk === formData.pk ? result : user
                        )
                    );
                    console.log('User updated successfully', result);
                } else {
                    // Make the POST request to create a new user
                    response = await fetch(`${port}/web/Post_User/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formDataToSubmit),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    result = await response.json();
                    setTableData(prevData => [...prevData, result]);
                    console.log('User created successfully', result);
                }

                // Store formData in localStorage
                localStorage.setItem('formData', JSON.stringify(formData));

                // Log the data stored in localStorage
                const storedData = localStorage.getItem('formData');
                console.log('Stored Data in localStorage:', storedData);

                // Reset the form
                userModalClose();
                setFormData({
                    clg_ref_id: '',
                    clg_first_name: '',
                    clg_email: '',
                    clg_mobile_no: '',
                    clg_gender: '',
                    clg_marital_status: '',
                    clg_Date_of_birth: '',
                    clg_hos_id: '',
                    grp_id: '',
                    clg_joining_date: '',
                    clg_address: '',
                    clg_state: '',
                    clg_district: '',
                });
                console.log('Form reset after submission');
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    };

    const handleStatusChange = async (userId, currentStatus) => {
        // Ask for confirmation before proceeding
        const confirmChange = window.confirm('Are you sure you want to change the status?');

        if (!confirmChange) {
            return;
        }

        try {
            const newStatus = currentStatus === "True" ? "False" : "True";
            const url = `${port}/web/active_inActive_User/${userId}/`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clg_status: newStatus }),
            });

            if (response.ok) {
                console.log('Status updated successfully');
                window.location.reload();
                // setTableData(prevData =>
                //     prevData.map(user =>
                //         user.pk === userId
                //             ? { ...user, status: newStatus }
                //             : user
                //     )
                // );
            } else {
                console.error('Failed to update status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // const handleStatusChange = async (status, user) => {
    //     const newIsActive = status === "True" ? false : true;

    //     const updatedData = {
    //         ...user,
    //         clg_status: status,
    //     };

    //     try {
    //         const response = await fetch(`${port}/web/active_inActive_User/${user.pk}/`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${accessToken}`,
    //             },
    //             body: JSON.stringify(updatedData),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error: ${response.statusText}`);
    //         }

    //         const result = await response.json();

    //         setTableData((prevUsers) =>
    //             prevUsers.map((u) =>
    //                 u.pk === user.pk ? { ...u, clg_status: status, is_active: newIsActive } : u
    //             )
    //         );

    //         console.log('Update successful:', result);
    //     } catch (error) {
    //         console.error('Update failed:', error);
    //     }
    // };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (validateForm()) {
    //         try {
    //             console.log('Form Data before submission:', formData);

    //             const formDataToSubmit = {
    //                 ...formData,
    //                 clg_work_email_id: formData.clg_email,
    //                 clg_Work_phone_number: formData.clg_mobile_no,
    //             };

    //             // Make the POST request
    //             const response = await fetch(`${port}/web/Post_User/`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify(formDataToSubmit),
    //             });

    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }

    //             const result = await response.json();
    //             console.log('Form submitted successfully', result);

    //             // Store formData in localStorage
    //             localStorage.setItem('formData', JSON.stringify(formData));

    //             // Log the data stored in localStorage
    //             const storedData = localStorage.getItem('formData');
    //             console.log('Stored Data in localStorage:', storedData);

    //             // Reset the form
    //             userModalClose();
    //             setFormData({
    //                 clg_ref_id: '',
    //                 clg_first_name: '',
    //                 clg_email: '',
    //                 clg_mobile_no: '',
    //                 clg_gender: '',
    //                 clg_marital_status: '',
    //                 clg_Date_of_birth: '',
    //                 clg_hos_id: '',
    //                 grp_id: '',
    //                 clg_joining_date: '',
    //                 clg_address: '',
    //                 clg_state: '',
    //                 clg_district: '',
    //             });
    //             console.log('Form reset after submission');
    //         } catch (error) {
    //             console.error('Error submitting form:', error);
    //         }
    //     }
    // };

    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Manage User</Typography>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: '300px', height: '2.5rem', backgroundColor: "#F2F2F2", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search User |"
                            inputProps={{ 'aria-label': 'select service' }}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <IconButton type="button" sx={{ p: '10px' }}>
                            <SearchIcon style={{ color: "#7AB7EE" }} />
                        </IconButton>
                    </Box>
                    <Button variant="contained" color="primary" style={{ marginLeft: 'auto' }} onClick={userModalOpen}>
                        <AddIcon />
                        Add User
                    </Button>
                </Stack>

                <TableContainer sx={{ height: "68vh" }}>
                    <Table >
                        <TableHead>
                            <TableRow >
                                <UserCard style={{ height: '3rem', background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Email ID</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Mobile Number</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Type</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Added Date</Typography>
                                    </CardContent>
                                    {/* <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Status</Typography>
                                    </CardContent> */}
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Action</Typography>
                                    </CardContent>
                                </UserCard>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {
                                loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredTableData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                            <Typography variant="subtitle1">No data found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) :
                                    (
                                        filteredTableData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((user, index) => (
                                                <TableRow key={user.clg_ref_id}>
                                                    <UserCard>
                                                        <CardContent style={{ flex: 0.5 }}>
                                                            <Typography variant="subtitle2">{index + 1}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1.6 }}>
                                                            <Typography variant="subtitle2">{user.clg_first_name || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 2 }}>
                                                            <Typography variant="subtitle2">{user.clg_email || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 2 }}>
                                                            <Typography variant="subtitle2">{user.clg_Work_phone_number || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant="subtitle2">{user.type || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant="subtitle2">{new Date(user.added_date).toLocaleDateString()}</Typography>
                                                        </CardContent>
                                                        {/* <CardContent style={{ flex: 1 }}>
                                                            <Typography variant="subtitle2">{user.clg_status === 'True' ? 'Activated' : 'InActivated' || ' - '}</Typography>
                                                        </CardContent> */}

                                                        <CardContent style={{ flex: 0.5 }}>
                                                            <IconButton
                                                                onClick={(event) => handleMoreIconClick(event, index)}
                                                                sx={{ fontSize: "18px", mt: 1.5, color: 'black' }}
                                                            >
                                                                <MoreHorizIcon />
                                                            </IconButton>

                                                            <Popover
                                                                open={Boolean(anchorEl)}
                                                                anchorEl={anchorEl}
                                                                onClose={handleClose}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'left',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'left',
                                                                }}
                                                                style={{ marginRight: '2em' }}
                                                            >
                                                                <div style={{
                                                                    flexDirection: 'column', marginRight: '10px'
                                                                }}>
                                                                    <Typography variant="body1" sx={{ p: 1, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                                                        onClick={() => handleViewClick(user)}
                                                                    >
                                                                        <RemoveRedEyeIcon sx={{ mr: 1, color: 'skyblue' }} /> View
                                                                    </Typography>
                                                                    {/* {
                                                                        user.clg_status === "True" ?
                                                                            <Typography variant="body1" sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                                                                                <CancelIcon sx={{ mr: 1, color: 'red' }} /> InActivate
                                                                            </Typography> :
                                                                            <Typography variant="body1" sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                                                                                <CheckCircleIcon sx={{ mr: 1, color: 'green' }} /> Activate
                                                                            </Typography>
                                                                    } */}

                                                                    <Typography
                                                                        variant="body1"
                                                                        onClick={() => handleStatusChange(user.pk, user.clg_status)}
                                                                        sx={{ p: 1, display: 'flex', alignItems: 'center', cursor: 'pointer', width: '7em' }}
                                                                    >
                                                                        {user.clg_status === "True" ? (
                                                                            <>
                                                                                <CancelIcon sx={{ mr: 1, color: 'red' }} />
                                                                                InActivate
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <CheckCircleIcon sx={{ mr: 1, color: 'green' }} />
                                                                                Activate
                                                                            </>
                                                                        )}
                                                                    </Typography>


                                                                    <Typography variant="body1" sx={{ p: 1, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                                                        // onClick={handleViewClick}
                                                                        onClick={() => handleEditClick(user)}
                                                                    >
                                                                        <EditIcon sx={{ mr: 1, color: 'black' }} /> Edit
                                                                    </Typography>
                                                                </div>
                                                            </Popover>
                                                        </CardContent>
                                                    </UserCard>
                                                </TableRow>
                                            ))
                                    )
                            }
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={filteredTableData.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 100]}
                    />
                </TableContainer>

                {/* ADD User MODAL */}
                <Modal
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    open={openModal}
                    onClose={userModalClose}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: 780,
                            height: 520,
                            backgroundColor: '#F2F2F2',
                            borderRadius: '10px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            padding: '10px',
                            overflowY: 'auto'
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <AppBar
                                position="static"
                                sx={{
                                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                    width: '50em',
                                    height: '3rem',
                                    mt: '-10px',
                                    ml: '-10px',
                                    borderRadius: '8px 0 0 0',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '10px' }}>
                                    <Typography variant="h6" component="h4" sx={{ flexGrow: 1 }}>
                                        Add User
                                    </Typography>
                                    <IconButton sx={{ color: '#FFFFFF', mt: '2px' }} onClick={userModalClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </AppBar>
                        </Box>

                        <Grid container spacing={2} sx={{ marginTop: '15px', marginBottom: '15px', width: '100%' }}>
                            <Card
                                sx={{
                                    marginBottom: '15px',
                                    width: '100%',
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    ml: 2
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        align="left"
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            marginBottom: '5px',
                                        }}
                                    >
                                        USER DETAILS
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="userName"
                                                label="User Name*"
                                                name="clg_ref_id"
                                                size="small"
                                                fullWidth
                                                value={formData.clg_ref_id}
                                                onChange={handleChange}
                                                error={!!errors.clg_ref_id}
                                                helperText={errors.clg_ref_id}
                                                sx={{
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                InputProps={{
                                                    readOnly: isViewMode,
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="fullName"
                                                label="Full Name*"
                                                name="clg_first_name"
                                                size="small"
                                                fullWidth
                                                value={formData.clg_first_name}
                                                onChange={handleChange}
                                                error={!!errors.clg_first_name}
                                                helperText={errors.clg_first_name}
                                                sx={{
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                InputProps={{
                                                    readOnly: isViewMode,
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="clg_email"
                                                label="Email ID*"
                                                name="clg_email"
                                                size="small"
                                                fullWidth
                                                value={formData.clg_email}
                                                onChange={handleChange}
                                                error={!!errors.clg_email}
                                                helperText={errors.clg_email}
                                                sx={{
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                InputProps={{
                                                    readOnly: isViewMode,
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="mobileNumber"
                                                label="Mobile Number*"
                                                name="clg_mobile_no"
                                                size="small"
                                                fullWidth
                                                value={formData.clg_mobile_no}
                                                onChange={handleChange}
                                                error={!!errors.clg_mobile_no}
                                                helperText={errors.clg_mobile_no}
                                                inputProps={{
                                                    maxLength: 10,
                                                    pattern: "[0-9]*",
                                                }}
                                                sx={{
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                InputProps={{
                                                    readOnly: isViewMode,
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                id="clg_gender"
                                                select
                                                label="Gender*"
                                                name="clg_gender"
                                                size="small"
                                                fullWidth
                                                value={formData.clg_gender}
                                                onChange={handleChange}
                                                error={!!errors.clg_gender}
                                                helperText={errors.clg_gender}
                                                sx={{
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                InputProps={{
                                                    readOnly: isViewMode,
                                                }}
                                            >
                                                <MenuItem value="male">Male</MenuItem>
                                                <MenuItem value="female">Female</MenuItem>
                                                <MenuItem value="other">Other</MenuItem>
                                            </TextField>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                id="clg_marital_status"
                                                select
                                                label="Marital Status*"
                                                name="clg_marital_status"
                                                size="small"
                                                fullWidth
                                                value={formData.clg_marital_status}
                                                onChange={handleChange}
                                                error={!!errors.clg_marital_status}
                                                helperText={errors.clg_marital_status}
                                                sx={{
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                InputProps={{
                                                    readOnly: isViewMode,
                                                }}
                                            >
                                                <MenuItem value="Unmarried">Unmarried</MenuItem>
                                                <MenuItem value="Married">Married</MenuItem>
                                            </TextField>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                id="clg_Date_of_birth"
                                                label="DOB*"
                                                type="date"
                                                name="clg_Date_of_birth"
                                                size="small"
                                                fullWidth
                                                value={formData.clg_Date_of_birth}
                                                onChange={handleChange}
                                                error={!!errors.clg_Date_of_birth}
                                                helperText={errors.clg_Date_of_birth}
                                                sx={{
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    max: new Date().toISOString().split('T')[0],
                                                    readOnly: isViewMode,
                                                }}
                                            />

                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Grid container spacing={2} sx={{ width: '100%' }}>
                                <Grid item xs={12} sm={6}>
                                    <Card
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'white',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            ml: 1.8
                                        }}
                                    >
                                        <CardContent>
                                            <Typography
                                                align="left"
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    marginBottom: '5px',
                                                }}
                                            >
                                                OTHER DETAILS
                                            </Typography>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="outlined-select-hospital"
                                                        select
                                                        label="Hospital Name*"
                                                        name="clg_hos_id"
                                                        size="small"
                                                        fullWidth
                                                        error={!!errors.clg_hos_id}
                                                        helperText={errors.clg_hos_id}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                        SelectProps={{
                                                            MenuProps: {
                                                                PaperProps: {
                                                                    style: {
                                                                        maxHeight: '170px',
                                                                        maxWidth: '200px',
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                        value={formData.clg_hos_id}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            setFormData((prevFormData) => ({
                                                                ...prevFormData,
                                                                clg_hos_id: e.target.value,
                                                            }));
                                                        }}
                                                        InputProps={{
                                                            readOnly: isViewMode,
                                                        }}
                                                    >
                                                        {hosiptal.map((item) => (
                                                            <MenuItem key={item.hosp_id} value={item.hosp_id}>
                                                                {item.hospital_name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        id="outlined-select-clg_gender"
                                                        select
                                                        label="User Group*"
                                                        name="grp_id"
                                                        size="small"
                                                        fullWidth
                                                        value={formData.grp_id}
                                                        onChange={handleChange}
                                                        error={!!errors.grp_id}
                                                        helperText={errors.grp_id}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                        SelectProps={{
                                                            MenuProps: {
                                                                PaperProps: {
                                                                    style: {
                                                                        maxHeight: '170px',
                                                                        maxWidth: '200px',
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                        InputProps={{
                                                            readOnly: isViewMode,
                                                        }}
                                                    >
                                                        {user.map((item) => (
                                                            <MenuItem key={item.grp_id} value={item.grp_id}>
                                                                {item.grp_name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        id="clg_joining_date"
                                                        label="Date of Joining*"
                                                        type="date"
                                                        name="clg_joining_date"
                                                        size="small"
                                                        fullWidth
                                                        InputLabelProps={{ shrink: true }}
                                                        value={formData.clg_joining_date}
                                                        onChange={handleChange}
                                                        error={!!errors.clg_joining_date}
                                                        helperText={errors.clg_joining_date}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                        InputProps={{
                                                            readOnly: isViewMode,
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Card
                                        sx={{
                                            marginBottom: '15px',
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'white',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            ml: 1.8
                                        }}
                                    >
                                        <CardContent>
                                            <Typography
                                                align="left"
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    marginBottom: '5px',
                                                }}
                                            >
                                                ADDRESS
                                            </Typography>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="outlined-multiline-static"
                                                        label="Address*"
                                                        name="clg_address"
                                                        size="small"
                                                        fullWidth
                                                        value={formData.clg_address}
                                                        onChange={handleChange}
                                                        error={!!errors.clg_address}
                                                        helperText={errors.clg_address}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                        InputProps={{
                                                            readOnly: isViewMode,
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        id="clg_state"
                                                        select
                                                        label="State*"
                                                        name="clg_state"
                                                        size="small"
                                                        fullWidth
                                                        value={formData.clg_state}
                                                        onChange={handleChange}
                                                        error={!!errors.clg_state}
                                                        helperText={errors.clg_state}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                        InputProps={{
                                                            readOnly: isViewMode,
                                                        }}
                                                    >
                                                        {state.map((item, index) => (
                                                            <MenuItem key={item.state_id} value={item.state_id}
                                                                sx={{ fontSize: "14px" }}>
                                                                {item.state_name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        id="clg_district"
                                                        select
                                                        label="City*"
                                                        name="clg_district"
                                                        size="small"
                                                        fullWidth
                                                        value={formData.clg_district}
                                                        onChange={handleChange}
                                                        error={!!errors.clg_district}
                                                        helperText={errors.clg_district}
                                                        sx={{
                                                            '& input': {
                                                                fontSize: '14px',
                                                            },
                                                        }}
                                                        InputProps={{
                                                            readOnly: isViewMode,
                                                        }}
                                                    >
                                                        {city.map((item, index) => (
                                                            <MenuItem key={item.city_id} value={item.city_id}
                                                                sx={{ fontSize: "14px" }}>
                                                                {item.city_name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Button
                            variant="contained"
                            color="primary"
                            // onClick={handleSubmit}
                            onClick={isEditMode ? handleEditClick : handleSubmit}
                            sx={{
                                backgroundColor: '#007bff',
                                '&:hover': {
                                    backgroundColor: '#0056b3',
                                },
                            }}
                        >
                            {/* Submit */}
                            {
                                isEditMode ? 'Update' : 'Submit'
                            }
                        </Button>
                    </Box>
                </Modal>

                <Footer />
            </Box>
        </div >
    )
}

export default SystemUser
