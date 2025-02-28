import React, { useState, useEffect } from 'react';
import HRNavbar from '../../HR/HRNavbar'
import { Box, Stack } from '@mui/system'
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Button, CardContent, FormControlLabel, Grid, IconButton, Input, InputBase, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import Footer from '../../../Footer'

const ManageServiceCard = styled(Card)({
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
        cursor: 'pointer',
    },
});

const ManageService = () => {

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [serviceModal, setserviceModal] = useState(false); //// service modal
    const [subServiceModal, setSubServiceModal] = useState(false); //// sub service modal
    const [selectedService, setSelectedService] = useState(null); // Sub Service Modal
    console.log(selectedService, 'selectedServiceselectedServiceselectedService');
    const [service, setService] = useState([]); /// service variable get
    const [subServices, setSubServices] = useState([]); /// sub service variable

    ////// pagination and search
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset page when search query changes
    };

    const filteredService = service ? service.filter((item) =>
        (item.service_title || '').toLowerCase().includes((searchQuery || '').toLowerCase())
    ) : [];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page when rows per page changes
    };
    //// pagination end

    ///// service POST state
    const [formData, setFormData] = useState({
        srv_id: '',
        service_title: '',
        image_path: ''
    });

    ////// sub service POST useState
    const [subService, setSubService] = useState({
        srv_id: selectedService ? selectedService.srv_id : "",
        recommomded_service: "",
        cost: null,
        tax: null,
        deposit: null,
        UOM: null,
        sub_srv_id: null
    });

    ///////// service Modal Open and close
    const ServiceModalOpen = (item) => {
        setserviceModal(true);
        setFormData({
            ...formData,
            srv_id: item.srv_id,
            service_title: item.service_title,
        });

        console.log('srv id:', item.srv_id);
    };

    const closeServiceModal = () => {
        setserviceModal(false);
    };

    // Sub Service form modal open
    const SubServiceModalOpen = (subsrv) => {
        setSubServiceModal(true);
    };

    const closeSubServiceModal = () => {
        setSubServiceModal(false);
    };

    const handleSubServiceClick = (service) => {
        setSelectedService(service);
        SubServiceModalOpen();
        setSubServiceModal(true)  //// open the sub service modal for fetching the table

        setSubService(service); // fetched the data and shown it in the sub seervice form field
    };

    //////// SERVICE Sub Service API
    useEffect(() => {
        const fetchModuleName = async () => {
            try {
                const response = await fetch(`${port}/hhc_hcm/manage_srv/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                console.log(data, 'Manage Service List');
                setService(data);
                setSelectedService(data.srv_id)
            } catch (error) {
                console.error('Error Fetching Data:', error.message);
            }
        };
        fetchModuleName();
    }, [accessToken]);

    const fetchSubServices = async (selectedService) => {
        const accessToken = localStorage.getItem('token');
        try {
            const response = await fetch(`${port}/hhc_hcm/manage_sub_srv/?srv=${selectedService}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setSubServices(data);
                console.log('Sub-Services:', data);
            } else {
                console.error('Invalid response format:', data);
            }
        } catch (error) {
            console.error('Error fetching sub-services:', error);
        }
    };

    useEffect(() => {
        if (selectedService) {
            fetchSubServices(selectedService.srv_id);
        }
    }, [selectedService]);

    //////// POST Service API
    const [errorMessages, setErrorMessages] = useState({
        service_title: '',
        image_path: ''
    });

    const handleFormSubmit = async () => {
        try {
            const accessToken = localStorage.getItem('token');

            if (!accessToken) {
                console.error('Access token not found.');
                return;
            }

            const newErrorMessages = {};

            // Check if the service title is empty
            if (!formData.service_title) {
                newErrorMessages.service_title = 'Service Name is required.';
            }

            // Check if image is selected
            if (!formData.image_path) {
                newErrorMessages.image_path = 'Image is required.';
            }

            if (Object.keys(newErrorMessages).length > 0) {
                setErrorMessages(newErrorMessages);
                return;
            }

            let url = `${port}/hhc_hcm/manage_srv/`;

            let method = 'POST';

            if (formData.srv_id) {
                method = 'PUT';
            }

            const headers = {
                'Authorization': `Bearer ${accessToken}`,
            };

            let requestData;
            if (formData.image_path) {
                // If image is selected, append all fields to FormData
                const formDataToSend = new FormData();
                formDataToSend.append('service_title', formData.service_title);
                formDataToSend.append('image_path', formData.image_path, formData.image_path.name);

                requestData = formDataToSend;
            } else {
                requestData = JSON.stringify({
                    status: formData.status,
                    service_title: formData.service_title,
                    image_path: null,
                    srv_id: formData.srv_id
                });
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: requestData
            });

            if (response.status === 201 || response.status === 200) {
                const newServiceData = await response.json(); // Assuming the server returns the updated service data
                setService([...service, newServiceData]);

                setFormData({
                    srv_id: '',
                    service_title: '',
                    status: ''
                });

                closeServiceModal();
            } else if (response.status === 400) {
                console.error('Bad request: Invalid data.');
            } else if (response.status === 500) {
                console.error('Internal server error.');
            } else {
                console.error('Failed to send data. Unknown error.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    ///// POST-SUB service API
    const [errorMessagesSub, setErrorMessagesSub] = useState({
        recommomded_service: '',
        cost: '',
        tax: '',
        UOM: '',
    });

    const handleSubServiceForm = () => {
        const accessToken = localStorage.getItem('token');

        if (!accessToken) {
            console.error('Access token not found.');
            return;
        }

        const newErrorMessagesSub = {};

        // Check if the service title is empty
        if (!subService.recommomded_service) {
            newErrorMessagesSub.recommomded_service = 'Recommomded Service is required.';
        }

        if (!subService.cost) {
            newErrorMessagesSub.cost = 'Cost is required.';
        }

        if (!subService.tax) {
            newErrorMessagesSub.tax = 'Tax is required.';
        }

        if (!subService.UOM) {
            newErrorMessagesSub.UOM = 'UOM is required.';
        }

        if (Object.keys(newErrorMessagesSub).length > 0) {
            setErrorMessagesSub(newErrorMessagesSub);
            return;
        }

        let url = `${port}/hhc_hcm/manage_sub_srv/`;
        let method = 'POST'; // Default to POST

        // Check if sub_srv_id exists to determine whether it's an update or create action
        if (subService.sub_srv_id) {
            method = 'PUT';
        }

        // Prepare the data to be sent in the request body
        const requestData = {
            srv_id: selectedService ? selectedService.srv_id : "",
            sub_srv_id: selectedService ? selectedService.sub_srv_id : null,
            recommomded_service: subService.recommomded_service,
            cost: subService.cost,
            tax: subService.tax,
            deposit: subService.deposit,
            UOM: subService.UOM,
        };

        // Log the submitted data
        console.log('Submitted Data:', requestData);

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(requestData), // Include requestData in the body
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Submitted the Sub Service Form:', data);
                console.log(subService, 'kkkkkk');

                // Update state with new sub-service data
                if (method === 'POST') {
                    setSubServices(prevSubServices => [...prevSubServices, data]); // Add new sub-service to existing sub-services
                } else {
                    setSubServices(prevSubServices => prevSubServices.map(subService => subService.sub_srv_id === data.sub_srv_id ? data : subService)); // Update existing sub-service
                }

                setSubService({
                    srv_id: selectedService ? selectedService.srv_id : "",
                    sub_srv_id: selectedService ? selectedService.sub_srv_id : null,
                    recommomded_service: "",
                    cost: "",
                    tax: null,
                    deposit: null,
                    UOM: null,
                });
                closeSubServiceModal();
            })
            .catch(error => {
                console.error('Error while Submitting Sub-Service Form:', error);
            });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name !== 'image_path') {
            setFormData({
                ...formData,
                [name]: value
            });
        } else {
            // Handle image separately, for example:
            const file = event.target.files[0];
            setFormData({
                ...formData,
                image_path: file
            });
        }

        setSubService({
            ...subService,
            [name]: value
        });

        setErrorMessages({
            ...errorMessages,
            [name]: '' // Clear error message on input change
        });

        setErrorMessagesSub({
            ...errorMessagesSub,
            [name]: '' // Clear error message on input change
        });
    };
   
    ////// Sub Service Table Open Modal
    const [subServiceTable, setSubServiceTable] = useState(false);

    const openServiceModal = (item) => {
        fetchSubServices(item.srv_id) // Fetch sub-services when opening the modal
            .then((data) => {
                console.log("Sub-services data:", data); // Console log the fetched sub-services data
            })
            .catch((error) => {
                console.error("Error fetching sub-services:", error);
            });
        setSubServiceTable(true);
    };

    const closeSubServiceModalTable = () => {
        setSubServiceTable(false);
    };

    //////status active inactive service
    const [serviceStatus, setServiceStatus] = useState({});

    const handleToggleStatus = (srvId) => {
        setServiceStatus(prevStatus => ({
            ...prevStatus,
            [srvId]: prevStatus[srvId] === 1 ? 2 : 1 // Toggle status between 1 and 2
        }));
    };

    const handleStatusIconClick = async (srvId, status) => {
        const confirmMessage = status === 1 ? 'Are you sure you want to Inactivate the service?' : 'Are you sure you want to Activate the service?';

        if (window.confirm(confirmMessage)) {
            try {
                const newStatus = status === 1 ? 2 : 1; // Toggle status for API call
                const accessToken = localStorage.getItem('token');
                const response = await fetch(`${port}/hhc_hcm/service_inactive_hhc/${srvId}/${newStatus}/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ srvId, status: newStatus })
                });

                if (response.ok) {
                    // Update status in UI after successful API call
                    setServiceStatus(prevStatus => ({
                        ...prevStatus,
                        [srvId]: newStatus
                    }));
                    console.log('Status Has Been Changed');
                }
            } catch (error) {
                alert('Failed to change the status. Please try again later.');
                console.error('Error:', error);
            }
        }
    };

    ///// status active inactive sub service
    const [subServiceStatus, setSubServiceStatus] = useState({});

    const handleToggleSubService = (subsrvId) => {
        setSubServiceStatus(prevStatus => ({
            ...prevStatus,
            [subsrvId]: prevStatus[subsrvId] === 1 ? 2 : 1 // Toggle status between 1 and 2
        }));
    };

    const handleSubServiceIcon = async (subsrvId, status) => {
        const confirmMessage = status === 1 ? 'Are you sure you want to Inactivate the sub service?' : 'Are you sure you want to Activate the sub service?';

        if (window.confirm(confirmMessage)) {
            try {
                const newStatus = status === 1 ? 2 : 1; // Toggle status for API call
                const accessToken = localStorage.getItem('token');
                const response = await fetch(`${port}/hhc_hcm/sub_service_inactive_hhc/${subsrvId}/${newStatus}/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ subsrvId, status: newStatus })
                });

                if (response.ok) {
                    // Update status in UI after successful API call
                    // setServiceStatus(prevStatus => ({
                    //     ...prevStatus,
                    //     [subsrvId]: newStatus
                    // }));

                    setSubServices(prevSubServices =>
                        prevSubServices.map(service =>
                            service.sub_srv_id === subsrvId
                                ? { ...service, status: newStatus }
                                : service
                        )
                    );
                    console.log('Status Has Been Changed');
                }
            } catch (error) {
                alert('Failed to change the status. Please try again later.');
                console.error('Error:', error);
            }
        }
    };

    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Manage Services</Typography>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: '300px', height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Service |"
                            inputProps={{ 'aria-label': 'select service' }}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <IconButton type="button" sx={{ p: '10px' }}>
                            <SearchIcon style={{ color: "#7AB7EE" }} />
                        </IconButton>
                    </Box>
                    <Button variant="contained" color="primary" style={{ marginLeft: 'auto' }} onClick={ServiceModalOpen}>
                        <AddIcon />
                        Add Service
                    </Button>
                </Stack>

                <TableContainer sx={{ height: "68vh" }}>
                    <Table >
                        <TableHead>
                            <TableRow >
                                <ManageServiceCard style={{ height: '3rem', background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Service Title</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Added By</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Modify By</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Action</Typography>
                                    </CardContent>
                                </ManageServiceCard>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredService
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, index) => (
                                    <TableRow key={index}>
                                        <ManageServiceCard>
                                            <CardContent style={{ flex: 0.5 }}>
                                                <Typography variant="subtitle2"> {page * rowsPerPage + index + 1}</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1.6 }}>
                                                <Typography variant="subtitle2">{item.service_title}</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1 }}>
                                                <Typography variant="subtitle2">{item.added_by || '-'}</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1 }}>
                                                <Typography variant="subtitle2">{item.last_modified_by || '-'}</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1 }}>
                                                <Tooltip title="Add Sub Service" arrow>
                                                    <IconButton aria-label="add" onClick={() => handleSubServiceClick(item)}>
                                                        <AddCircleOutlineIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit Service" arrow>
                                                    <IconButton aria-label="edit" onClick={() => ServiceModalOpen(item)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Status" arrow>
                                                    <IconButton aria-label="edit" onClick={() => handleStatusIconClick(item.srv_id, serviceStatus[item.srv_id] || item.status)}>
                                                        {serviceStatus[item.srv_id] === 1 || item.status === 1 ? (
                                                            <CheckIcon style={{ color: 'green' }} />
                                                        ) : (
                                                            <ClearIcon style={{ color: 'red' }} />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Sub Service List" arrow>
                                                    <IconButton aria-label="sub service" onClick={() => openServiceModal(item)}>
                                                        <FormatListBulletedOutlinedIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </CardContent>
                                        </ManageServiceCard>
                                    </TableRow>
                                ))}
                        </TableBody>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            // component="div"
                            count={filteredService.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Table>

                </TableContainer>

                {/* ADD SERVICE MODAL */}
                <Modal
                    open={serviceModal}
                    onClose={closeServiceModal}
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
                            width: 400,
                            maxWidth: '90vw',
                            height: 'auto',
                            maxHeight: '90vh',
                            backgroundColor: 'White',
                            borderRadius: '10px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            padding: '10px',
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', px: '10px' }}>
                                <Typography variant="h6" component="h4" sx={{ flexGrow: 1 }}>
                                    Add Service
                                </Typography>
                                <IconButton onClick={closeServiceModal}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Service Name"
                                name="service_title"
                                value={formData.service_title}
                                onChange={handleInputChange}
                                size="small"
                                fullWidth
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                            {errorMessages.service_title && (
                                <Typography variant="caption" color="error" style={{ marginTop: '5px' }}>
                                    {errorMessages.service_title}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px', marginBottom: '15px' }}>
                            <TextField
                                id="upload-image"
                                type="file"
                                name="image_path"
                                // value={formData.image_path}
                                onChange={handleInputChange}
                                inputProps={{ accept: 'image/*' }}
                                size="small"
                                fullWidth
                            />
                            {errorMessages.image_path && (
                                <Typography variant="caption" color="error" style={{ marginTop: '5px' }}>
                                    {errorMessages.image_path}
                                </Typography>
                            )}
                        </Grid>

                        {/* <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                width: '100%',
                                px: '10px',
                                marginTop: '15px',
                            }}
                        >
                            <Typography>
                                This service accessible for HD ?
                            </Typography>
                            <Box sx={{ marginTop: '0px' }}>
                                <RadioGroup
                                    aria-label="hd-accessibility"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    sx={{ display: 'flex', flexDirection: 'row' }}
                                >
                                    <FormControlLabel value={1} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={2} control={<Radio />} label="No" />
                                </RadioGroup>
                            </Box>
                        </Box> */}

                        <Button onClick={handleFormSubmit} variant="contained" color="primary" style={{ marginBottom: "10px" }}>
                            Submit
                        </Button>
                    </Box>
                </Modal>

                {/* Sub Service */}
                <Modal
                    open={subServiceModal}
                    onClose={closeSubServiceModal}
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
                            width: 400,
                            maxWidth: '90vw',
                            height: 'auto',
                            maxHeight: '90vh',
                            backgroundColor: 'White',
                            borderRadius: '10px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            padding: '10px',
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', px: '10px' }}>
                                <Typography variant="h6" component="h4" sx={{ flexGrow: 1 }}>
                                    Add Sub Service
                                </Typography>
                                <IconButton onClick={closeSubServiceModal}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {selectedService && (
                            <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                                <TextField
                                    id="service-name"
                                    label="Service Name"
                                    size="small"
                                    fullWidth
                                    name='srv_id'
                                    value={selectedService ? (selectedService.srv_name || selectedService.service_title) : ''}
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                            </Grid>
                        )}

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Recommended Service"
                                size="small"
                                fullWidth
                                name="recommomded_service"
                                value={subService.recommomded_service}
                                onChange={handleInputChange}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                            {errorMessagesSub.recommomded_service && (
                                <Typography variant="caption" color="error" style={{ marginTop: '5px' }}>
                                    {errorMessagesSub.recommomded_service}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Cost"
                                size="small"
                                fullWidth
                                name="cost"
                                value={subService.cost}
                                onChange={handleInputChange}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                            {errorMessagesSub.cost && (
                                <Typography variant="caption" color="error" style={{ marginTop: '5px' }}>
                                    {errorMessagesSub.cost}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Tax"
                                size="small"
                                fullWidth
                                name="tax"
                                value={subService.tax}
                                onChange={handleInputChange}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                            {errorMessagesSub.tax && (
                                <Typography variant="caption" color="error" style={{ marginTop: '5px' }}>
                                    {errorMessagesSub.tax}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px', marginBottom: '15px' }}>
                            <Select
                                value={subService.UOM}
                                onChange={handleInputChange}
                                fullWidth
                                displayEmpty
                                name="UOM"
                                sx={{ height: '40px' }}
                            >
                                {/* <MenuItem value={1}>Service</MenuItem>
                                <MenuItem value={2}>Day</MenuItem>
                                <MenuItem value={3}>Other</MenuItem> */}
                                <MenuItem disabled>Select</MenuItem>
                                <MenuItem value="Service">Service</MenuItem>
                                <MenuItem value="Day">Day</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                            {errorMessagesSub.UOM && (
                                <Typography variant="caption" color="error" style={{ marginTop: '5px' }}>
                                    {errorMessagesSub.UOM}
                                </Typography>
                            )}
                        </Grid>

                        <Button onClick={handleSubServiceForm} variant="contained" color="primary" style={{ marginBottom: "10px" }}>
                            Submit
                        </Button>
                    </Box>
                </Modal>

                {/* table sub service opening */}
                <Modal
                    open={subServiceTable}
                    onClose={closeSubServiceModalTable}
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
                            width: 600,
                            maxWidth: '90vw',
                            height: 'auto',
                            maxHeight: '90vh',
                            backgroundColor: 'White',
                            borderRadius: '10px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            padding: '10px',
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', px: '10px' }}>
                                <Typography variant="h6" component="h4" sx={{ flexGrow: 1 }}>
                                    Sub Service List
                                </Typography>
                                <IconButton onClick={closeSubServiceModalTable}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        <TableContainer sx={{ height: "63vh" }}>
                            <Table >
                                <TableHead>
                                    <TableRow >
                                        <ManageServiceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                            <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant="subtitle2">Sr. No</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant="subtitle2">Sub Service Title</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant="subtitle2">Cost</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant="subtitle2">Action</Typography>
                                            </CardContent>
                                        </ManageServiceCard>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {subServices.map((item, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <ManageServiceCard>
                                                <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">{index + 1}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">{item.recommomded_service}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant="subtitle2">{item.cost}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                    <Tooltip title="Edit Service" arrow>
                                                        <IconButton aria-label="edit" onClick={() => handleSubServiceClick(item)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Status" arrow>
                                                        {/* <IconButton aria-label="edit">
                                                            {item.status === 1 ? (
                                                                <CheckIcon style={{ color: 'green' }} />
                                                            ) : (
                                                                <ClearIcon style={{ color: 'red' }} />
                                                            )}
                                                        </IconButton> */}
                                                        <IconButton aria-label="edit" onClick={() => handleSubServiceIcon(item.sub_srv_id, serviceStatus[item.sub_srv_id] || item.status)}>
                                                            {serviceStatus[item.sub_srv_id] === 1 || item.status === 1 ? (
                                                                <CheckIcon style={{ color: 'green' }} />
                                                            ) : (
                                                                <ClearIcon style={{ color: 'red' }} />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip>
                                                </CardContent>
                                            </ManageServiceCard>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Modal>
            </Box>
            <Footer />
        </div>

    )
}

export default ManageService
