import React, { useState, useEffect } from 'react'
import HRNavbar from '../../HR/HRNavbar'
import { Box, Stack } from '@mui/system'
import { Button, TablePagination, CardContent, Grid, IconButton, InputBase, Modal, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import Footer from '../../../Footer'

const ManageHospitalCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "54px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        // cursor: 'pointer',
    },
});

const ManageHospital = () => {

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    // ADD Modal Open Start
    const [hospitalAddModal, setHospitalAddModal] = useState(false);
    const [hospitalData, setHospitalData] = useState([]); ////// table state

    ////post API START

    const [errorMessages, setErrorMessages] = useState({
        hospital_name: '',
        hospital_short_code: '',
        phone_no: '',
        website_url: '',
    });

    const [postHospitalData, setPostHospitalData] = useState({
        hospital_name: '',
        hospital_short_code: '',
        phone_no: null,
        website_url: '',
        address: '',
        langitude: null,
        lattitude: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setPostHospitalData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {

        const newErrorMessages = {};

        // Hspital Name
        if (!postHospitalData.hospital_name) {
            newErrorMessages.hospital_name = 'Hospital Name is required.';
        }

        if (!postHospitalData.hospital_short_code) {
            newErrorMessages.hospital_short_code = 'hospital Short Code is required.';
        }

        if (!postHospitalData.phone_no) {
            newErrorMessages.phone_no = 'Phone No is required.';
        }

        if (!postHospitalData.website_url) {
            newErrorMessages.website_url = 'Website Url is required.';
        }


        if (Object.keys(newErrorMessages).length > 0) {
            setErrorMessages(newErrorMessages);
            return;
        }

        try {
            const apiUrl = `${port}/hhc_hcm/manage_hos/`;
            let requestOptions;

            if (postHospitalData.hosp_id) {
                // If hosp_id exists, perform PUT request
                requestOptions = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(postHospitalData)
                };
            } else {
                // If hosp_id doesn't exist, perform POST request
                requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(postHospitalData)
                };
            }

            const response = await fetch(apiUrl, requestOptions);

            if (response.ok) {
                const responseData = await response.json();
                if (postHospitalData.hosp_id) {
                    // If it's a PUT operation, update the existing item in the table
                    setHospitalData(prevData => {
                        const updatedData = prevData.map(item => {
                            if (item.hosp_id === responseData.hosp_id) {
                                return responseData;
                            }
                            return item;
                        });
                        return updatedData;
                    });
                } else {
                    // If it's a POST operation, add the new item to the table
                    setHospitalData(prevData => [...prevData, responseData]);
                }
                closeHospitalModal();
                console.log('Data posted successfully');
            } else {
                console.error('Failed to post data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    ////post API END

    ////// pagination and search
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    /// pagination end

    ///// hospital modal open
    const openHospitalModal = (hospital) => {
        console.log("Open hospital modal clicked");
        if (hospital) {
            setPostHospitalData(prevState => ({
                ...prevState,
                hosp_id: hospital.hosp_id,
                branch: hospital.branch,
                hospital_name: hospital.hospital_name,
                hospital_short_code: hospital.hospital_short_code,
                phone_no: hospital.phone_no,
                website_url: hospital.website_url,
                address: hospital.address,
                langitude: hospital.langitude,
                lattitude: hospital.lattitude
            }));
            console.log("Hospital data fetched:", hospital);
        } else {
            console.log("No hospital data provided");
        }
        setHospitalAddModal(true);
        console.log("Hospital modal opened", hospital);
    };

    const closeHospitalModal = () => {
        setHospitalAddModal(false);
        setErrorMessages({}); // Reset error messages when the modal is closed
    }
    ///// hospital modal close

    // Table All Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('token');
                const response = await fetch(`${port}/hhc_hcm/manage_hos/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setHospitalData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    ////search functionality start
    const [searchText, setSearchText] = useState('');

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };

    const filteredHospitalData = hospitalData.filter(hospital => hospital.hospital_name.toLowerCase().includes(searchText.toLowerCase()));
    ////search functionality end 

    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Manage Hospitals</Typography>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: '300px', height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Hospital |"
                            inputProps={{ 'aria-label': 'select service' }}
                            value={searchText}
                            onChange={handleSearchInputChange}
                        />
                        <IconButton type="button" sx={{ p: '10px' }}>
                            <SearchIcon style={{ color: "#7AB7EE" }} />
                        </IconButton>
                    </Box>
                    <Button variant="contained" color="primary" style={{ marginLeft: 'auto' }}
                        onClick={openHospitalModal}
                    >
                        <AddIcon />
                        Add Hospital
                    </Button>
                </Stack>

                <TableContainer sx={{ height: "68vh" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <ManageHospitalCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Hospital Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Website</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Branch</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Short Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Status</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Action</Typography>
                                    </CardContent>
                                </ManageHospitalCard>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredHospitalData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((hospital, index) => (
                                <TableRow key={index}>
                                    <ManageHospitalCard>
                                        <CardContent style={{ flex: 0.5 }}>
                                            <Typography variant="subtitle2">{index + 1 + page * rowsPerPage}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1.6 }}>
                                            <Typography variant="subtitle2">{hospital.hospital_name}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2 }}>
                                            <Typography variant="subtitle2">{hospital.website_url}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography variant="subtitle2">{hospital.branch}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography variant="subtitle2">{hospital.hospital_short_code}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography variant="subtitle2">{hospital.status}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Tooltip title="Add Content" arrow>
                                                <IconButton aria-label="add"
                                                // onClick={openHospitalModal}
                                                >
                                                    <AddCircleOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit" arrow>
                                                <IconButton aria-label="edit" onClick={() => openHospitalModal(hospital)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </CardContent>
                                    </ManageHospitalCard>
                                </TableRow>
                            ))}
                        </TableBody>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={hospitalData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Table>

                </TableContainer>

                {/* ADD Modal Open */}
                <Modal
                    open={hospitalAddModal}
                    onClose={closeHospitalModal}
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
                                    Add Hospital
                                </Typography>
                                <IconButton onClick={closeHospitalModal}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                            <TextField
                                label="Hospital Name"
                                size="small"
                                fullWidth
                                name='hospital_name'
                                value={postHospitalData.hospital_name}
                                onChange={handleChange}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                            {errorMessages.hospital_name && (
                                <Typography variant="caption" color="error" style={{ marginTop: '5px' }}>
                                    {errorMessages.hospital_name}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Hospital Short Code"
                                name='hospital_short_code'
                                value={postHospitalData.hospital_short_code}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                            {errorMessages.hospital_short_code && (
                                <Typography variant="caption" color="error" style={{ marginTop: '5px' }}>
                                    {errorMessages.hospital_short_code}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Phone Number"
                                name='phone_no'
                                type='number'
                                min='0'
                                value={postHospitalData.phone_no}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }} // Limit input to 10 digits
                            />
                            {errorMessages.phone_no && (
                                <Typography variant="caption" color="error" style={{ marginTop: '5px' }}>
                                    {errorMessages.phone_no}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Website"
                                size="small"
                                name='website_url'
                                value={postHospitalData.website_url}
                                onChange={handleChange}
                                fullWidth
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                            {errorMessages.website_url && (
                                <Typography variant="caption" color="error" style={{ marginTop: '5px' }}>
                                    {errorMessages.website_url}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Address"
                                size="small"
                                name='address'
                                value={postHospitalData.address}
                                onChange={handleChange}
                                fullWidth
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid container item xs={12} spacing={1} sx={{ mt: 1 }}>
                            <Grid item lg={6} sm={6} xs={12}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Latitude"
                                    type='textarea'
                                    name='langitude'
                                    value={postHospitalData.langitude}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item lg={6} sm={6} xs={12}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Longitude"
                                    size="small"
                                    name='lattitude'
                                    value={postHospitalData.lattitude}
                                    onChange={handleChange}
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Button variant="contained" color="primary" style={{ marginBottom: "10px", marginTop: "15px" }} onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                </Modal>
                <Footer />
            </Box>

        </div>
    )
}

export default ManageHospital
