
import React, { useState, useEffect } from 'react';
import { Button, Snackbar, CardContent, Alert, CircularProgress, TableCell, Grid, MenuItem, AppBar, IconButton, InputBase, Modal, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography, Card, TablePagination, Popover } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SystemProfessional from './SystemProfessional';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import TabContext from '@mui/lab/TabContext';
import HRNavbar from '../../HR/HRNavbar';
import { Box, Stack } from '@mui/system';
import TabList from '@mui/lab/TabList';
import Footer from '../../../Footer';
import { styled } from '@mui/system';
import Tab from '@mui/material/Tab';
import { useLocation } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

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
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#F7F7F7',
    },
});

const SystemUser = () => {

    const [company, setCompany] = useState(null);
    const [refId, setRefId] = useState(null);

    useEffect(() => {
        const ref_id = localStorage.getItem('clgrefId');
        setRefId(ref_id);
    }, []);

    useEffect(() => {
        const id = localStorage.getItem('companyID');
        setCompany(id);
    }, []);

    const [value, setValue] = useState('1');
    const [openProfessional, setOpenProfessional] = useState(false);
    console.log(openProfessional, 'openProfessional');

    const handleChangeStatus = (event, newValue) => {
        setValue(newValue);
        setOpenProfessional(false);
    };

    // DOB Validation
    const calculateMinDate = () => {
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 18);
        return minDate.toISOString().split('T')[0];
    };

    const handleAddProfessional = () => {
        setOpenAddOrganisation(true);
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
            clg_work_email_id: '',
            clg_Work_phone_number: '',
        });
        resetFields();
        setErrors({})
    };

    const handleCloseOrgnisation = () => {
        setOpenAddOrganisation(false);
    };

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const location = useLocation();
    const [openModal, setOpenModal] = useState(false);
    const [openAddOrganisation, setOpenAddOrganisation] = useState(false);
    console.log(openModal, 'openModal');

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
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [cmpData, setCmpData] = useState([]);
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
        setPage(0);
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

    const handleSearchCmp = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        console.log("Search Query: ", query);
        setPage(0);
    };

    const filteredCmpData = cmpData.filter((item) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (item.company_name || '').toLowerCase().includes(searchLower) ||
            (item.company_mail || '').toLowerCase().includes(searchLower) ||
            (item.company_contact_number ? item.company_contact_number.toString().toLowerCase().includes(searchLower) : false)
        );
    });

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

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

    useEffect(() => {
        fetchUserDetails();
    }, [])

    const fetchCompanyDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${port}/hr/get_company_details/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            console.log('Fetching the organizationnnn data', data);
            setCmpData(data);
            setLoading(false);
        }
        catch (error) {
            console.log('Error fetching Data');
        }
    }

    useEffect(() => {
        fetchCompanyDetails();
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

    const userModalClose = (() => {
        setOpenModal(false)
    })

    const handleProfClose = (() => {
        setOpenProfessional(false);
    });

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

    // const handleEditClick = (user) => {
    //     console.log("Clicked Edit pk:", user.pk);
    // };

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

    ////// Form Validation
    const handleChange = async (e) => {
        const { name, value } = e.target;
    
        if (name === "clg_mobile_no") {
            // Remove non-numeric characters and limit to 10 digits
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
    
            setFormData((prevData) => ({
                ...prevData,
                [name]: numericValue,
            }));
        } else if (name === "clg_first_name" || name === "clg_ref_id") {
            // Remove numeric characters
            const textValue = value.replace(/[0-9]/g, '');
    
            setFormData((prevData) => ({
                ...prevData,
                [name]: textValue,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    
        // Clear error messages
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    
        try {
            let queryParam = [];
    
            if (name === "clg_mobile_no" && value) {
                queryParam.push(`clg_Work_phone_number=${value}`);
            }
    
            if (name === "clg_email" && value) {
                queryParam.push(`clg_work_email_id=${value}`);
            }
    
            if (name === "clg_ref_id" && value) {
                queryParam.push(`clg_ref_id=${value}`);
            }
    
            if (queryParam.length === 0) {
                return;
            }
    
            const apiUrl = `${port}/hr/clg_is_already_exists/?${queryParam.join('&')}`;
    
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: '',
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [name]: data.message || 'Invalid input',
                }));
            }
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: 'Error checking value',
            }));
        }
    };
    
    // const handleChange = async (e) => {
    //     const { name, value } = e.target;

    //     setFormData((prevFormData) => ({
    //         ...prevFormData,
    //         [name]: value,
    //     }));

    //     // if (name === "clg_mobile_no") {
    //     //     const numericValue = value.replace(/\D/g, '');
    //     //     if (numericValue.length <= 10) {
    //     //         setFormData(prevData => ({
    //     //             ...prevData,
    //     //             [name]: numericValue
    //     //         }));
    //     //     }
    //     // } else {
    //     //     setFormData(prevData => ({
    //     //         ...prevData,
    //     //         [name]: value
    //     //     }));
    //     // }
    //     if (name === "clg_mobile_no") {
    //         // Remove all non-numeric characters from the value
    //         const numericValue = value.replace(/\D/g, '');

    //         // Limit to 10 digits
    //         if (numericValue.length <= 10) {
    //             // Update the form data with the sanitized value (only numbers)
    //             setFormData(prevData => ({
    //                 ...prevData,
    //                 [name]: numericValue
    //             }));
    //         }
    //     } else {
    //         // For other fields, update the form data normally
    //         setFormData(prevData => ({
    //             ...prevData,
    //             [name]: value
    //         }));
    //     }

    //     if (name === "clg_first_name" || name === "clg_ref_id") {
    //         const textValue = value.replace(/[0-9]/g, '');

    //         setFormData(prevData => ({
    //             ...prevData,
    //             [name]: textValue
    //         }));
    //     } else {
    //         setFormData(prevData => ({
    //             ...prevData,
    //             [name]: value
    //         }));
    //     }

    //     setErrors((prevErrors) => ({
    //         ...prevErrors,
    //         [name]: '',
    //     }));

    //     // try {
    //     //     const response = await fetch(`${port}/hr/clg_is_already_exists/?clg_Work_phone_number=${formData.clg_first_name}&clg_work_email_id=${formData.clg_first_name}&clg_ref_id=${formData.clg_first_nam}`, {
    //     //         headers: {
    //     //             'Authorization': `Bearer ${accessToken}`,
    //     //             'Content-Type': 'application/json'
    //     //         }
    //     //     });
    //     //     console.log(response.data.message);
    //     // } catch (error) {
    //     //     console.log('Error while fetching data', error);
    //     // } finally {
    //     //     setLoading(false);
    //     // }


    //     try {
    //         let queryParam = [];

    //         if (name === "clg_mobile_no" && value) {
    //             queryParam.push(`clg_Work_phone_number=${value}`);
    //         }

    //         if (name === "clg_email" && value) {
    //             queryParam.push(`clg_work_email_id=${value}`);
    //         }

    //         if (name === "clg_ref_id" && value) {
    //             queryParam.push(`clg_ref_id=${value}`);
    //         }

    //         if (queryParam.length === 0) {
    //             return;
    //         }

    //         const apiUrl = `${port}/hr/clg_is_already_exists/?${queryParam.join('&')}`;

    //         const response = await fetch(apiUrl, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${accessToken}`,
    //             },
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             setErrors((prevErrors) => ({
    //                 ...prevErrors,
    //                 [name]: '',
    //             }));
    //         } else {
    //             setErrors((prevErrors) => ({
    //                 ...prevErrors,
    //                 [name]: data.message || 'Invalid input',
    //             }));
    //         }
    //     } catch (error) {
    //         setErrors((prevErrors) => ({
    //             ...prevErrors,
    //             [name]: 'Error checking value',
    //         }));
    //     }
    // };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.clg_ref_id) formErrors.clg_ref_id = 'User Name is required';
        if (!formData.clg_first_name) formErrors.clg_first_name = 'Full Name is required';
        if (!formData.clg_email) formErrors.clg_email = 'Email ID is required';
        // if (!formData.clg_mobile_no) formErrors.clg_mobile_no = 'Mobile Number is required';
        if (!formData.clg_mobile_no) {
            formErrors.clg_mobile_no = 'Mobile Number is required';
        } else if (formData.clg_mobile_no.length !== 10) {
            formErrors.clg_mobile_no = 'Mobile Number must be exactly 10 digits';
        }
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
                const formDataToSubmit = {
                    ...formData,
                    clg_work_email_id: formData.clg_email,
                    clg_Work_phone_number: formData.clg_mobile_no,
                    prof_compny: company,
                    last_modified_by: refId
                };

                let response;

                if (formData.pk) {
                    response = await fetch(`${port}/web/Edit_User/${formData.pk}/`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formDataToSubmit),
                    });
                } else {
                    response = await fetch(`${port}/web/Post_User/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formDataToSubmit),
                    });
                }

                if (response.ok && response.status === 201) {
                    const result = await response.json();
                    setTableData((prevData) => [...prevData, result]);
                    await fetchUserDetails();
                    setSnackbarMessage("User Registered Successfully!");
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    setOpenModal(false);
                    setTimeout(() => {
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
                    }, 2500);
                } else if (response.ok && response.status === 200) {
                    const result = await response.json();
                    setTableData((prevData) =>
                        prevData.map((user) =>
                            user.pk === formData.pk ? result : user
                        )
                    );
                    setSnackbarMessage("User Data Updated Successfully!");
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    setOpenModal(false);
                    await fetchUserDetails();
                } else if (response.status === 500) {
                    setSnackbarMessage("Internal Server Error!");
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                } else if (response.status === 409) {
                    const errorData = await response.json();
                    setSnackbarMessage(errorData.error);
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                } else if (!response.ok) {
                    throw new Error("Unexpected error occurred");
                }
                setTimeout(() => {
                    setSnackbarOpen(false);
                }, 2000);
            } catch (error) {
                console.error("Error submitting form:", error);
                setSnackbarMessage("Something Went Wrong!");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        }
    };

    const handleStatusChange = async (userId, currentStatus) => {
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

    //_________________________________System Professional_______________________________________
    const [orgID, setOrgID] = useState('');
    const [docData, setDocData] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobNo, setMobNo] = useState('');
    const [files, setFiles] = useState({});
    const [cmpName, setCmpName] = useState('');
    const [agrDate, setAgrDate] = useState('');
    const [cmpRegNo, setCmpRegNo] = useState('');
    const [modifyby, setModifyby] = useState('');
    const [altrMobNo, setAlterMobNo] = useState('');
    const [userName, setUserName] = useState('');
    const [openRModal, setOpenRModal] = useState(false);
    const [errorRemark, setErrorRemak] = useState({
        remark: '',
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [remark, setRemark] = useState('');
    const addedby = localStorage.getItem('clg_id');

    const [preloadedData, setPreloadedData] = useState({
        cmpName: '',
        email: '',
        name: '',
        mobNo: '',
        altrMobNo: '',
        cmpRegNo: '',
        userName: '',
        agrDate: '',
    });

    const handleCloseRModal = () => {
        setOpenRModal(false);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
        setOpenSnackbar(false);
    };

    function resetFields() {
        setCmpName('');
        setEmail('');
        setName('');
        setMobNo('');
        setAlterMobNo('');
        setCmpRegNo('');
        setAgrDate('');
        setUserName('');
        setFiles({});
        // setDocData([]);
    }

    const handleCloseModal = () => {
        setOpenAddOrganisation(true);
    };

    const handleEmptyRemark = () => {
        const newErrors = {};
        if (!remark) {
            newErrors.remark = 'Required';
        }
        setErrorRemak(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    async function handleRemark(event) {
        event.preventDefault();
        const hasEmptyFields = handleEmptyRemark();
        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill remark.');
            setSnackbarSeverity('error');
            return;
        }
        const formData = {
            remark: remark,
            status: 2,
        };
        console.log("POST API Hitting......", formData);
        if (orgID) {
            try {
                let response;
                response = await fetch(`${port}/hr/company_status/${orgID}/`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("Successfully submitted Remark", result);
                    handleCloseRModal();
                    fetchCompanyDetails();
                    setRemark('');
                } else if (response.status === 400) {
                    setOpenSnackbar(true);
                    setSnackbarMessage('Error While Submitting the Form');
                    setSnackbarSeverity('error');
                }
                else if (response.status === 409) {
                    const errorResult = await response.json();
                    setOpenSnackbar(true);
                    setSnackbarMessage(errorResult.error);
                    setSnackbarSeverity('error');
                } else if (response.status === 500) {
                    setOpenSnackbar(true);
                    setSnackbarMessage('Something went wrong. Please try again later.');
                    setSnackbarSeverity('error');
                } else {
                    console.error(`Unhandled status code: ${response.status}`);
                }
            } catch (error) {
                console.error("Error fetching Remark:", error);
                setOpenSnackbar(true);
                setSnackbarMessage('Failed to submit Remark. Please try again.');
                setSnackbarSeverity('error');
            }
        }
    }

    const handleEmailChange = (e) => {
        const input = e.target.value;
        setEmail(input);
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(input)) {
            setErrors({ ...errors, email: 'Please enter a valid email' });
        } else {
            setErrors({ ...errors, email: '' });
        }
    };

    const handleMobChange = (e) => {
        const input = e.target.value;
        const numericValue = input.replace(/[^0-9]/g, '');
        setMobNo(numericValue);
        if (!/^[6789]\d{9}$/.test(numericValue)) {
            setErrors({ ...errors, mobNo: 'Please enter a valid mobile no' });
        } else if (parseInt(numericValue) < 0) {
            setErrors({ ...errors, mobNo: 'Mobile No should be a positive number' });
        } else {
            setErrors({ ...errors, mobNo: '' });
        }
    };

    const handleAltrMobChange = (e) => {
        const input = e.target.value;
        const numericValue = input.replace(/[^0-9]/g, '');
        setAlterMobNo(numericValue);
        if (!/^[6789]\d{9}$/.test(numericValue)) {
            setErrors({ ...errors, altrMobNo: 'Please enter a valid mobile no' });
        } else if (parseInt(numericValue) < 0) {
            setErrors({ ...errors, altrMobNo: 'Mobile No should be a positive number' });
        } else {
            setErrors({ ...errors, altrMobNo: '' });
        }
    };

    const handleOpenModal = () => {
        setOpenAddOrganisation(true);
    };

    const handleOpenRModal = () => {
        setOpenRModal(true);
    };

    const handleDownload = async (filePath) => {
        try {
            const response = await fetch(`${port}${filePath}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf',
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const link = document.createElement('a');
                const downloadUrl = URL.createObjectURL(blob);

                link.href = downloadUrl;
                link.download = filePath.split('/').pop();
                link.click();
                URL.revokeObjectURL(downloadUrl);
            } else {
                console.error('Failed to download file:', response.statusText);
            }
        } catch (error) {
            console.error('Error during file download:', error);
        }
    };

    const handleFileChange = (doc_li_id, event) => {
        const file = event.target.files[0];
        if (file) {
            setFiles(prevFiles => ({
                ...prevFiles,
                [doc_li_id]: file
            }));
        }
    };

    const orgIDRequest = (eveId) => {
        const selectedRequest = cmpData.find(item => item.company_pk_id === eveId);
        console.log("Selected organization", selectedRequest);
        if (selectedRequest) {
            console.log("Selected org ID:", selectedRequest.company_pk_id);
            setOrgID(selectedRequest.company_pk_id);
        }
    };

    const handleEmptyField = () => {
        const newErrors = {};

        const fields = [
            { name: 'cmpName', value: cmpName },
            { name: 'email', value: email },
            { name: 'name', value: name },
            { name: 'mobNo', value: mobNo },
            { name: 'altrMobNo', value: altrMobNo },
            { name: 'cmpRegNo', value: cmpRegNo },
            { name: 'userName', value: userName },
            { name: 'agrDate', value: agrDate }
        ];

        fields.forEach(({ name, value }) => {
            if (!value || String(value).trim() === '') {
                newErrors[name] = 'required';
            }
        });

        [1].forEach((requiredDocId) => {
            const documentExists = preloadedData.documents && preloadedData.documents.some(doc => doc.doc_list_id === requiredDocId && doc.company_documents);
            console.log(documentExists, 'documentExists');

            const fileUploaded = files[requiredDocId];

            if (!fileUploaded && !documentExists) {
                if (requiredDocId === 1) {
                    newErrors[`doc_${requiredDocId}`] = "Aadhar Card is required.";
                }
                // else if (requiredDocId === 2) {
                //     newErrors[`doc_${requiredDocId}`] = "Pan Card is required.";
                // } 
                else {
                    newErrors[`doc_${requiredDocId}`] = `Document ${requiredDocId} is required.`;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length > 0;
    };

    useEffect(() => {
        const fetchDocsDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${port}/hr/company_document_get/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                console.log('Fetching the Table Data11111111', data);
                setDocData(data);
            }
            catch (error) {
                console.log('Error fetching Data');
            }
        }
        fetchDocsDetails();
    }, [])

    async function handleAddCompany(event) {
        event.preventDefault();
        const hasEmptyFields = handleEmptyField();
        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill all required details.');
            setSnackbarSeverity('error');
            return;
        }
        const formData = new FormData();
        formData.append('company_name', cmpName);
        formData.append('company_mail', email);
        formData.append('company_contact_person', name);
        formData.append('company_contact_number', mobNo);
        formData.append('company_alt_contact_person', altrMobNo);
        formData.append('company_registration_number', cmpRegNo);
        formData.append('company_agreement_validity_period', agrDate);
        formData.append('username', userName);
        formData.append('added_by', addedby);
        docData.forEach((doc) => {
            if (files[doc.doc_li_id]) {
                formData.append(`company_documents[${doc.doc_li_id}]`, files[doc.doc_li_id]);
            }
        });
        if (orgID) {
            formData.append('last_modified_by', modifyby);
        }
        console.log("POST API Hitting......", formData);
        try {
            let response;
            if (orgID) {
                response = await fetch(`${port}/hr/update_company_details/${orgID}/`, {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: formData,
                });
            } else {
                response = await fetch(`${port}/hr/add_company/`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: formData,
                });
            }
            if (response.status === 201) {
                const result = await response.json();
                console.log("Successfully submitted company data", result);
                setOpenSnackbar(true);
                setSnackbarMessage('Organisation Registered Successfully');
                setSnackbarSeverity('success');

                setTimeout(() => {
                    handleCloseOrgnisation();
                    fetchCompanyDetails();
                    resetFields();
                }, 2000);

            } else if (response.status === 200) {
                const result = await response.json();
                console.log("Successfully submitted company data", result);
                setOpenSnackbar(true);
                setSnackbarMessage('Organisation Updated Successfully');
                setSnackbarSeverity('success');

                setTimeout(() => {
                    handleCloseOrgnisation();
                    fetchCompanyDetails();
                    resetFields();
                }, 2000);
            }
            else if (response.status === 400) {
                setOpenSnackbar(true);
                setSnackbarMessage('Error while submitting the form');
                setSnackbarSeverity('error');
            }
            else if (response.status === 409) {
                const errorResult = await response.json();
                setOpenSnackbar(true);
                setSnackbarMessage(errorResult.error);
                setSnackbarSeverity('error');
            } else if (response.status === 500) {
                setOpenSnackbar(true);
                setSnackbarMessage('Something went wrong. Please try again later.');
                setSnackbarSeverity('error');
            } else {
                console.error(`Unhandled status code: ${response.status}`);
            }

        } catch (error) {
            console.error("Error fetching company data:", error);
            setOpenSnackbar(true);
            setSnackbarMessage('Failed to submit company data. Please try again.');
            setSnackbarSeverity('error');
        }
    }

    useEffect(() => {
        const getOrgData = async () => {
            if (orgID) {
                try {
                    const res = await fetch(`${port}/hr/update_company_details/${orgID}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    setCmpName(data.company_name);
                    setEmail(data.company_mail);
                    setName(data.company_contact_person);
                    setMobNo(data.company_contact_number);
                    setAlterMobNo(data.company_alt_contact_person);
                    setCmpRegNo(data.company_registration_number);
                    const formattedDate = data.company_agreement_validity_period.split('T')[0];
                    setAgrDate(formattedDate);
                    setUserName(data.username);
                    setFiles(data.documents);
                    setModifyby(data.last_modified_by);

                    setPreloadedData({
                        cmpName: data.company_name,
                        email: data.company_mail,
                        name: data.company_contact_person,
                        mobNo: data.company_contact_number,
                        altrMobNo: data.company_alt_contact_person,
                        cmpRegNo: data.company_registration_number,
                        userName: data.username,
                        agrDate: formattedDate,
                        documents: data.documents || []
                    });
                } catch (error) {
                    console.error("Error fetching Organization Data:", error);
                }
            }
        };
        getOrgData();
    }, [orgID]);

    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, }}>
                <TabContext value={value}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography sx={{ fontSize: 16, fontWeight: 600 }} color="text.secondary">
                            {
                                value === '1' ? 'Manage User' : 'Manage Organization'
                            }
                        </Typography>

                        <Box
                            component="form"
                            sx={{
                                ml: 2,
                                p: "2px 4px",
                                display: 'flex',
                                alignItems: 'center',
                                width: 300,
                                height: '2.5rem',
                                backgroundColor: "#F2F2F2",
                                boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                                borderRadius: "10px",
                                border: "1px solid #C9C9C9"
                            }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search here |"
                                inputProps={{ 'aria-label': 'search here' }}
                                value={searchQuery}
                                // onChange={handleSearch}
                                onChange={(event) => {
                                    if (value === '1') {
                                        handleSearch(event);
                                    } else if (value === '2') {
                                        handleSearchCmp(event);
                                    }
                                }}
                            />
                            <IconButton type="button" sx={{ p: '10px' }}>
                                <SearchIcon sx={{ color: "#7AB7EE" }} />
                            </IconButton>
                        </Box>

                        <Box sx={{
                            typography: 'body1',
                            background: "#FFFFFF",
                            borderRadius: '10px',
                            width: "23rem",
                            height: "2.8rem",
                            display: 'flex',
                            justifyContent: 'center',
                            marginLeft: '8px',
                            marginRight: '8px',
                            ml: "auto",
                        }}>
                            <TabList
                                className="tab-root"
                                onChange={handleChangeStatus}
                                textColor="#51DDD4"
                                sx={{ position: 'relative' }}
                                TabIndicatorProps={{ style: { background: '#69A5EB', height: '36px', marginBottom: '8px', borderRadius: "10px" } }}
                            >
                                <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "1" ? '#ffffff' : 'black' }}>Spero System User</span>} value="1" sx={{ position: 'relative', zIndex: 1, }} />
                                <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "2" ? '#ffffff' : 'black' }}>Update Organization</span>} value="2" sx={{ position: 'relative', zIndex: 1, }} />
                            </TabList>
                        </Box>

                        {
                            value === '1' &&
                            (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ ml: "auto", display: 'flex', borderRadius: "10px", alignItems: 'center', fontSize: "16px", textTransform: "capitalize" }}
                                    onClick={userModalOpen}
                                >
                                    <AddIcon sx={{ fontSize: "22px" }} />
                                    Add User
                                </Button>
                            )
                        }

                        {
                            value === '2' &&
                            (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ ml: "auto", display: 'flex', borderRadius: "10px", fontSize: "16px", alignItems: 'center', textTransform: "capitalize" }}
                                    onClick={handleAddProfessional}
                                >
                                    <AddIcon sx={{ fontSize: "22px" }} />
                                    Add Organization
                                </Button>
                            )
                        }
                    </Stack>
                </TabContext>

                {
                    value === '1' &&
                    (
                        <>
                            <TableContainer sx={{ height: "68vh" }}>
                                <Table >
                                    <TableHead>
                                        <TableRow >
                                            <UserCard style={{ height: '3rem', background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                                <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">Sr. No</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">Full Name</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">User Name</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">Email ID</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">Mobile Number</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">User Group</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">Added Date</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
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
                                                            <TableRow key={user}>
                                                                <UserCard>
                                                                    <CardContent style={{ flex: 0.5 }}>
                                                                        <Typography variant="subtitle2">{index + 1}</Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 1.6 }}>
                                                                        <Typography variant="subtitle2">{user.clg_first_name || '-'}</Typography>
                                                                    </CardContent>
                                                                    {/* <CardContent style={{ flex: 1.6 }}>
                                                                        <Typography variant="subtitle2">{user.clg_ref_id || '-'}</Typography>
                                                                    </CardContent> */}
                                                                    <CardContent style={{ flex: 1.6 }}>
                                                                        <Tooltip title={user.clg_ref_id || '-'} arrow>
                                                                            <Typography variant="subtitle2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                                {user.clg_ref_id && user.clg_ref_id.length > 17
                                                                                    ? `${user.clg_ref_id.substring(0, 17)}...`
                                                                                    : user.clg_ref_id || '-'}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 2 }}>
                                                                        <Tooltip title={user.clg_email || '-'} arrow>
                                                                            <Typography variant="subtitle2" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                                {user.clg_email && user.clg_email.length > 17
                                                                                    ? `${user.clg_email.substring(0, 17)}...`
                                                                                    : user.clg_email || '-'}
                                                                            </Typography>
                                                                        </Tooltip>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 1.6 }}>
                                                                        <Typography variant="subtitle2">{user.clg_Work_phone_number || '-'}</Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 1 }}>
                                                                        <Typography variant="subtitle2">
                                                                            {user.type
                                                                                ? user.type.charAt(0).toUpperCase() + user.type.slice(1).toLowerCase()
                                                                                : '-'}
                                                                        </Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 1 }}>
                                                                        <Typography variant="subtitle2">{new Date(user.added_date).toLocaleDateString()}</Typography>
                                                                    </CardContent>
                                                                    <CardContent style={{ flex: 1 }}>
                                                                        <EditIcon sx={{ cursor: "pointer", color: "#17A2F4" }} onClick={() => handleEditClick(user)} />
                                                                        {user.clg_status === "True" ? (
                                                                            <>
                                                                                <CancelIcon sx={{ color: 'red' }} onClick={() => handleStatusChange(user.pk, user.clg_status)} />
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <CheckCircleIcon sx={{ color: 'green' }} onClick={() => handleStatusChange(user.pk, user.clg_status)} />
                                                                            </>
                                                                        )}
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
                                                                maxLength: 10,   // Limits the number of characters to 10
                                                                pattern: "[0-9]{10}", // Ensures exactly 10 digits are entered
                                                                inputMode: "numeric", // Improves numeric input on mobile
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
                                                            // InputLabelProps={{
                                                            //     shrink: true,
                                                            // }}
                                                            // inputProps={{
                                                            //     max: new Date().toISOString().split('T')[0],
                                                            //     readOnly: isViewMode,
                                                            // }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            inputProps={{
                                                                max: calculateMinDate(),
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
                                                                            {/* {item.grp_name} */}
                                                                            {item.grp_name.charAt(0).toUpperCase() + item.grp_name.slice(1).toLowerCase()}
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
                                        onClick={isEditMode ? handleEditClick : handleSubmit}
                                        sx={{
                                            backgroundColor: '#007bff',
                                            '&:hover': {
                                                backgroundColor: '#0056b3',
                                            },
                                        }}
                                    >
                                        {
                                            isEditMode ? 'Update' : 'Submit'
                                        }
                                    </Button>
                                </Box>
                            </Modal>
                        </>
                    )
                }

                {
                    value === '2' &&
                    (
                        <>
                            {/* <SystemProfessional openProfessional={openProfessional} fetchCompanyDetails={fetchCompanyDetails} cmpData={cmpData} filteredCmpData={filteredCmpData} /> */}
                            <TableContainer sx={{ height: "68vh" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <UserCard style={{ height: '3rem', background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                                <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">Sr. No</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">Organization Name</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">Email ID</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">Contact Number</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
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
                                            ) : filteredCmpData.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                                        <Typography variant="subtitle1">No data found</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredCmpData
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((user, index) => (
                                                        <TableRow key={user.company_pk_id}>
                                                            <UserCard>
                                                                <CardContent style={{ flex: 0.5 }}>
                                                                    <Typography variant="subtitle2">{index + 1 + page * rowsPerPage}</Typography>
                                                                </CardContent>
                                                                <CardContent style={{ flex: 1.6 }}>
                                                                    <Typography variant="subtitle2">{user.company_name || '-'}</Typography>
                                                                </CardContent>
                                                                <CardContent style={{ flex: 2 }}>
                                                                    <Typography variant="subtitle2">{user.company_mail || '-'}</Typography>
                                                                </CardContent>
                                                                <CardContent style={{ flex: 2 }}>
                                                                    <Typography variant="subtitle2">{user.company_contact_number || '-'}</Typography>
                                                                </CardContent>
                                                                <CardContent style={{ flex: 1 }}>
                                                                    <EditIcon sx={{ cursor: "pointer", color: "#17A2F4" }} onClick={() => handleOpenModal(orgIDRequest(user.company_pk_id))} />
                                                                    <DeleteOutlineIcon sx={{ cursor: "pointer", color: "#E54153", ml: 2 }} onClick={() => handleOpenRModal(orgIDRequest(user.company_pk_id))} />
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
                                    count={filteredCmpData.length}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 25, 100]}
                                />
                            </TableContainer>

                            <Modal
                                open={openAddOrganisation}
                                onClose={handleCloseOrgnisation}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
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
                                        width: 790,
                                        height: 500,
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
                                                    {orgID ? "View Organization" : "Add Organization"}
                                                </Typography>
                                                <IconButton sx={{ color: '#FFFFFF', mt: '2px' }} onClick={handleCloseOrgnisation}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
                                        </AppBar>
                                    </Box>

                                    <Grid container spacing={2} sx={{ marginTop: '15px', marginBottom: '15px', width: '100%' }}>
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
                                                        <Typography align="left" style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', }}> ORGANIZATION DETAILS </Typography>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} sm={12}>
                                                                <TextField
                                                                    id="cmpName"
                                                                    label="Company Name*"
                                                                    name="company_name"
                                                                    value={cmpName}
                                                                    onChange={(e) => setCmpName(e.target.value)}
                                                                    size="small"
                                                                    fullWidth
                                                                    sx={{
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                    error={!!errors.cmpName}
                                                                    helperText={errors.cmpName}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sm={12}>
                                                                <TextField
                                                                    id="email"
                                                                    label="Email ID*"
                                                                    name="company_mail"
                                                                    value={email}
                                                                    onInput={handleEmailChange}
                                                                    size="small"
                                                                    fullWidth
                                                                    sx={{
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                    error={!!errors.email}
                                                                    helperText={errors.email}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sm={12}>
                                                                <TextField
                                                                    id="fullName"
                                                                    label="Contact Person Name*"
                                                                    name="company_contact_person"
                                                                    value={name}
                                                                    // onChange={(e) => setName(e.target.value)}
                                                                    onChange={(e) => {
                                                                        const inputValue = e.target.value;
                                                                        if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                                                                            setName(inputValue);
                                                                        }
                                                                    }}
                                                                    size="small"
                                                                    fullWidth
                                                                    sx={{
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                    error={!!errors.name}
                                                                    helperText={errors.name}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sm={12}>
                                                                <TextField
                                                                    id="company_contact_number"
                                                                    label="Contact Number*"
                                                                    name="company_contact_number"
                                                                    value={mobNo}
                                                                    onInput={handleMobChange}
                                                                    size="small"
                                                                    fullWidth
                                                                    inputProps={{
                                                                        maxLength: 10,
                                                                        pattern: "[0-9]*",
                                                                    }}
                                                                    sx={{
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                    error={!!errors.mobNo}
                                                                    helperText={errors.mobNo}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sm={12}>
                                                                <TextField
                                                                    id="company_alt_contact_person"
                                                                    label="Alternate Contact Number*"
                                                                    name="company_alt_contact_person"
                                                                    value={altrMobNo}
                                                                    onInput={handleAltrMobChange}
                                                                    size="small"
                                                                    fullWidth
                                                                    inputProps={{
                                                                        maxLength: 10,
                                                                        pattern: "[0-9]*",
                                                                    }}
                                                                    sx={{
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                    error={!!errors.altrMobNo}
                                                                    helperText={errors.altrMobNo}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sm={12}>
                                                                <TextField
                                                                    id="company_registration_number"
                                                                    label="Company Registeration Number*"
                                                                    name="company_registration_number"
                                                                    value={cmpRegNo}
                                                                    onChange={(e) => setCmpRegNo(e.target.value)}
                                                                    size="small"
                                                                    fullWidth
                                                                    inputProps={{
                                                                        maxLength: 10,
                                                                        pattern: "[0-9]*",
                                                                    }}
                                                                    sx={{
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                    error={!!errors.cmpRegNo}
                                                                    helperText={errors.cmpRegNo}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sm={12}>
                                                                <TextField
                                                                    id="username"
                                                                    label="User Name*"
                                                                    name="username"
                                                                    value={userName}
                                                                    onChange={(e) => setUserName(e.target.value)}
                                                                    size="small"
                                                                    fullWidth
                                                                    sx={{
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                    error={!!errors.userName}
                                                                    helperText={errors.userName}
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
                                                        <Typography align="left" style={{ fontSize: '14px', fontWeight: 600, marginBottom: '5px' }}> UPLOAD DOCUMENTS </Typography>
                                                        <Grid container spacing={1} alignItems="center">
                                                            {docData.map((doc) => (
                                                                <>
                                                                    <Grid item xs={7} key={doc.doc_li_id}>
                                                                        <Typography
                                                                            component="label"
                                                                            variant="body1"
                                                                            sx={{ textAlign: 'left', alignItems: 'flex-start' }}
                                                                        >
                                                                            {doc.Documents_name}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={5}>
                                                                        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <Grid item xs={6}>
                                                                                <Button
                                                                                    component="label"
                                                                                    variant="contained"
                                                                                    startIcon={<CloudUploadIcon />}
                                                                                    sx={{
                                                                                        width: "100%",
                                                                                        bgcolor: "#e0e0e0",
                                                                                        color: 'black',
                                                                                        marginBottom: '11px',
                                                                                        '&:hover': {
                                                                                            bgcolor: '#e0e0e0',
                                                                                            color: 'black',
                                                                                        },
                                                                                        textTransform: "capitalize"
                                                                                    }}
                                                                                >
                                                                                    <VisuallyHiddenInput
                                                                                        type="file"
                                                                                        onChange={(e) => handleFileChange(doc.doc_li_id, e)}
                                                                                        multiple
                                                                                    />
                                                                                </Button>
                                                                            </Grid>
                                                                            <Grid item xs={6}>
                                                                                {orgID ? (
                                                                                    (() => {
                                                                                        const matchingFile = Object.values(files).find(file => file.doc_list_id === doc.doc_li_id);

                                                                                        return matchingFile ? (
                                                                                            <Button
                                                                                                variant="outlined"
                                                                                                sx={{ width: "100%", marginTop: "-10px" }}
                                                                                                onClick={() => handleDownload(matchingFile.company_documents)}
                                                                                            >
                                                                                                <DownloadIcon />
                                                                                            </Button>
                                                                                        ) : null;
                                                                                    })()
                                                                                ) : (
                                                                                    files[doc.doc_li_id] && (
                                                                                        <Button
                                                                                            variant="outlined"
                                                                                            sx={{ width: "100%", marginTop: "-10px" }}
                                                                                            onClick={() => handleDownload(files[doc.doc_li_id].company_documents)}
                                                                                        >
                                                                                            <DownloadIcon />
                                                                                        </Button>
                                                                                    )
                                                                                )}
                                                                            </Grid>
                                                                        </Grid>

                                                                        {errors[`doc_${doc.doc_li_id}`] && (
                                                                            <Typography color="error">
                                                                                {errors[`doc_${doc.doc_li_id}`]}
                                                                            </Typography>
                                                                        )}
                                                                    </Grid>
                                                                </>
                                                            ))}
                                                        </Grid>

                                                        <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                                                            <TextField
                                                                label="Agreement Validity Period *"
                                                                type="date"
                                                                name="company_agreement_validity_period"
                                                                value={agrDate}
                                                                onChange={(e) => setAgrDate(e.target.value)}
                                                                size="small"
                                                                fullWidth
                                                                InputLabelProps={{ shrink: true }}
                                                                sx={{
                                                                    '& input': {
                                                                        fontSize: '14px',
                                                                    },
                                                                }}
                                                                error={!!errors.agrDate}
                                                                helperText={errors.agrDate}
                                                            />
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            backgroundColor: '#007bff',
                                            '&:hover': {
                                                backgroundColor: '#0056b3',
                                            },
                                            textTransform: "capitalize",
                                            borderRadius: "10px",
                                            width: "20ch",
                                        }}
                                        onClick={handleAddCompany}
                                    >
                                        Submit
                                    </Button>

                                    <Snackbar
                                        open={openSnackbar}
                                        autoHideDuration={2000}
                                        onClose={handleSnackbarClose}
                                    >
                                        <Alert variant="filled"
                                            onClose={handleSnackbarClose}
                                            severity={snackbarSeverity}
                                            sx={{ width: '100%', ml: 30, mb: 20 }}
                                        >
                                            {snackbarMessage}
                                        </Alert>
                                    </Snackbar>
                                </Box>
                            </Modal>

                            <Modal
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                open={openRModal}
                                onClose={handleCloseRModal}
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
                                        width: 300,
                                        height: 220,
                                        backgroundColor: '#F2F2F2',
                                        borderRadius: '8px',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                        padding: '15px',
                                        overflowY: 'auto'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                                        <Typography variant="h6" component="h4" sx={{ flexGrow: 1 }}>
                                            Remove Organization
                                        </Typography>
                                        <IconButton sx={{ ml: 5, color: "black" }} onClick={handleCloseRModal}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                    <Grid container spacing={2} sx={{ marginTop: '10px', marginBottom: '15px', width: '100%' }}>
                                        <Grid item xs={12} sm={12} lg={12}>
                                            <TextField
                                                id="remark"
                                                label="Remark *"
                                                name="remark"
                                                value={remark}
                                                onChange={(e) => setRemark(e.target.value)}
                                                size="small"
                                                fullWidth
                                                multiline
                                                rows={2}
                                                sx={{
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                error={!!errorRemark.remark}
                                                helperText={errorRemark.remark}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{
                                            backgroundColor: '#007bff',
                                            '&:hover': {
                                                backgroundColor: '#0056b3',
                                            },
                                            textTransform: "capitalize",
                                            borderRadius: "10px",
                                            width: "20ch",
                                            mt: 2
                                        }}
                                        onClick={handleRemark}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Modal>
                        </>
                    )
                }
                <Footer />
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    '& .MuiPaper-root': {
                        backgroundColor: snackbarSeverity === "success" ? "green" : "red",
                        color: "white",
                    },
                }}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleSnackbarClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
            {/* <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
                }}
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Alert
                    severity={snackbarSeverity}
                    sx={{
                        backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
                        color: 'white',
                        width: '100%',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar> */}
        </div>
    )
}

export default SystemUser
