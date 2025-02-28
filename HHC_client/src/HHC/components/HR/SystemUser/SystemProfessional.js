import React, { useState, useEffect } from 'react';
import { Card, CardContent, Alert, Snackbar, IconButton, Grid, TextField, TableBody, TableContainer, TableHead, TableRow, TableCell, Typography, TablePagination, Modal, Box, CircularProgress, Table, MenuItem, Button, AppBar } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';

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
    '&:hover': {
        backgroundColor: '#F7F7F7',
    },
});

const SystemProfessional = ({ openProfessional, cmpData, fetchCompanyDetails, clickedValue }) => {

    useEffect(() => {
        console.log(clickedValue);
        console.log(clickedValue, 'clickedValue');

    }, [clickedValue]);

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const addedby = localStorage.getItem('clg_id');

    // const [cmpData, setCmpData] = useState([]);
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

    const [remark, setRemark] = useState('');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openModal, setOpenModal] = useState(false);
    const [openRModal, setOpenRModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
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
    // const handleFileChange = (doc_li_id, event) => {
    //     const file = event.target.files[0];
    //     setFiles(prevFiles => ({
    //         ...prevFiles,
    //         [doc_li_id]: file
    //     }));
    // };

    const [errorRemark, setErrorRemak] = useState({
        remark: '',
    });
    const handleEmptyRemark = () => {
        const newErrors = {};
        if (!remark) {
            newErrors.remark = 'Required';
        }
        setErrorRemak(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    const [errors, setErrors] = useState({
        cmpName: '',
        email: '',
        name: '',
        mobNo: '',
        altrMobNo: '',
        cmpRegNo: '',
        userName: '',
        agrDate: '',
    });

    const handleEmptyField = () => {
        const newErrors = {};

        // Ensure each field is treated as a string before calling .trim()
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

    // const handleEmptyField = () => {
    //     const newErrors = {};
    //     if (!cmpName || cmpName.trim() === '') {
    //         newErrors.cmpName = 'required';
    //     }
    //     if (!email || email.trim() === '') {
    //         newErrors.email = 'required';
    //     }
    //     if (!name || name.trim() === '') {
    //         newErrors.name = 'required';
    //     }
    //     if (!mobNo || mobNo.trim() === '') {
    //         newErrors.mobNo = 'required';
    //     }
    //     if (!altrMobNo || altrMobNo.trim() === '') {
    //         newErrors.altrMobNo = 'required';
    //     }
    //     if (!cmpRegNo || cmpRegNo.trim() === '') {
    //         newErrors.cmpRegNo = 'required';
    //     }
    //     if (!userName || userName.trim() === '') {
    //         newErrors.userName = 'required';
    //     }
    //     if (!agrDate || agrDate.trim() === '') {
    //         newErrors.agrDate = 'required';
    //     }

    //     [1, 2].forEach((requiredDocId) => {
    //         if (!files[requiredDocId]) {
    //             if (requiredDocId === 1) {
    //                 newErrors[`doc_${requiredDocId}`] = "Aadhar Card is required.";
    //             } else if (requiredDocId === 2) {
    //                 newErrors[`doc_${requiredDocId}`] = "Pan Card is required.";
    //             } else {
    //                 newErrors[`doc_${requiredDocId}`] = `Document ${requiredDocId} is required.`;
    //             }
    //         }
    //     });

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length > 0;
    // };

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

    useEffect(() => {
        setOpenModal(openProfessional);
    }, [openProfessional]);

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
    const handleOpenModal = () => {
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenRModal = () => {
        setOpenRModal(true);
    };
    const handleCloseRModal = () => {
        setOpenRModal(false);
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
                setLoading(false);
            }
            catch (error) {
                console.log('Error fetching Data');
            }
        }
        fetchDocsDetails();
    }, [])

    // useEffect(() => {
    //     const fetchDcocsDetails = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await fetch(`${port}/hr/company_status/21/`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${accessToken}`
    //                 }
    //             });
    //             const data = await response.json();
    //             console.log('Fetching the Table Data11111111', data);
    //             setDocData(data);
    //             setLoading(false);
    //         }
    //         catch (error) {
    //             console.log('Error fetching Data');
    //         }
    //     }
    //     fetchDcocsDetails();
    // }, [])

    // useEffect(() => {
    // const fetchCompanyDetails = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await fetch(`${port}/hr/get_company_details/`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${accessToken}`
    //             }
    //         });
    //         const data = await response.json();
    //         console.log('Fetching the organizationnnn data', data);
    //         setCmpData(data);
    //         setLoading(false);
    //     }
    //     catch (error) {
    //         console.log('Error fetching Data');
    //     }
    // }
    // fetchCompanyDetails();
    // }, [])
    // const fetchCompanyDetails = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await fetch(`${port}/hr/get_company_details/`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${accessToken}`
    //             }
    //         });
    //         const data = await response.json();
    //         console.log('Fetching the organizationnnn data', data);
    //         setCmpData(data);
    //         setLoading(false);
    //     }
    //     catch (error) {
    //         console.log('Error fetching Data');
    //     }
    // }

    // useEffect(() => {
    //     fetchCompanyDetails();
    // }, [])

    const orgIDRequest = (eveId) => {
        const selectedRequest = cmpData.find(item => item.company_pk_id === eveId);
        console.log("Selected organization", selectedRequest);
        if (selectedRequest) {
            console.log("Selected org ID:", selectedRequest.company_pk_id);
            setOrgID(selectedRequest.company_pk_id);
        }
    };

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
                console.log("Successfully updated company data", result);
                setOpenSnackbar(true);
                setSnackbarMessage('Organization Data Submitted Successfully');
                setSnackbarSeverity('success');
                handleCloseModal();
                fetchCompanyDetails();
            } else if (response.status === 200) {
                const result = await response.json();
                console.log("Successfully submitted company data", result);
                setOpenSnackbar(true);
                setSnackbarMessage('Updated Successfully');
                setSnackbarSeverity('success');
                handleCloseModal();
                fetchCompanyDetails();
            }
            else if (response.status === 400) {
                setOpenSnackbar(true);
                setSnackbarMessage('Error while submitting the form');
                setSnackbarSeverity('error');
            }
            else if (response.status === 409) {
                const errorResult = await response.json();
                const errorMessage = Array.isArray(errorResult.error) ? errorResult.error[0] : 'Conflict error occurred.';
                setOpenSnackbar(true);
                setSnackbarMessage(errorMessage);
                setSnackbarSeverity('error');
            }
            else if (response.status === 500) {
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

    return (
        <div>
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
                open={openModal}
                onClose={handleCloseModal}
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
                                <IconButton sx={{ color: '#FFFFFF', mt: '2px' }} onClick={handleCloseModal}>
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
                                                    onChange={(e) => setName(e.target.value)}
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
                                                        {/* Flex container to align buttons in a single row */}
                                                        <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
                                                            {/* Upload Button */}
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

                                                        {/* {
                                                            orgID ? (
                                                                (() => {
                                                                    const matchingFile = Object.values(files).find(file => file.doc_list_id === doc.doc_li_id);

                                                                    return matchingFile ? (
                                                                        <Typography variant="body2" sx={{ marginTop: '5px' }}>
                                                                            {matchingFile.name || matchingFile.company_documents.split('/').pop()}
                                                                        </Typography>
                                                                    ) : null;
                                                                })()
                                                            ) : (
                                                                files[doc.doc_li_id] && (
                                                                    <Typography variant="body2" sx={{ marginTop: '5px' }}>
                                                                        {files[doc.doc_li_id].name}
                                                                    </Typography>
                                                                )
                                                            )
                                                        } */}
                                                    </Grid>
                                                </>
                                            ))}
                                            {/* {docData.map((doc) => (
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
                                                        <Button
                                                            component="label"
                                                            variant="contained"
                                                            startIcon={<CloudUploadIcon />}
                                                            sx={{
                                                                width: "80%",
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
                                                        {errors[`doc_${doc.doc_li_id}`] && (
                                                            <Typography color="error">
                                                                {errors[`doc_${doc.doc_li_id}`]}
                                                            </Typography>
                                                        )}
                                                        {
                                                            orgID ? (
                                                                (() => {
                                                                    const matchingFile = Object.values(files).find(file => file.doc_list_id === doc.doc_li_id);

                                                                    return matchingFile ? (
                                                                        <Typography variant="body2" sx={{ marginTop: '5px' }}>
                                                                            {
                                                                                matchingFile.name || matchingFile.company_documents.split('/').pop()
                                                                            }
                                                                        </Typography>
                                                                    ) : null;
                                                                })()
                                                            ) : (
                                                                files[doc.doc_li_id] && (
                                                                    <Typography variant="body2" sx={{ marginTop: '5px' }}>
                                                                        {files[doc.doc_li_id].name}
                                                                    </Typography>
                                                                )
                                                            )
                                                        }
                                                    </Grid>
                                                </>
                                            ))} */}
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
        </div>
    );
}

export default SystemProfessional;

