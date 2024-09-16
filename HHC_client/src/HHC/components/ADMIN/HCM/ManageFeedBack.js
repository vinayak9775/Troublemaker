import React, { useState } from 'react'
import HRNavbar from '../../HR/HRNavbar'
import { Box, Stack } from '@mui/system'
import { Button, CardContent, Grid, IconButton, InputBase, MenuItem, Modal, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const ManageFeedbackCard = styled(Card)({
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

const ManageFeedBack = () => {

    // ADD Modal Open Start
    const [feedbackAddModal, setFeedbackAddModal] = useState(false);

    const openFeedbackModal = () => {
        setFeedbackAddModal(true);
    }

    const closeFeedbackModal = () => {
        setFeedbackAddModal(false);
    }

    // Table All Data
    const [feedbackData, setFeedbackData] = useState([
        {
            "Sr No": 1,
            "Phone No": "9876543210",
            "Website": "www.lotushoeespital.co.in",
            "Location": "Pimpri",
            "Address": "Pune",
            "Short Name": "Tulip",
        },
        {
            "Sr No": 2,
            "Phone No": "8877665544",
            "Website": "www.lotushoeeeespital.co.in",
            "Location": "Sinhgad Road",
            "Address": "Solapur",
            "Short Name": "Lotus",
        },
        {
            "Sr No": 3,
            "Phone No": "00999886665",
            "Website": "www.lotusfeedbk.co.in",
            "Location": "Mumbais",
            "Address": "Pune",
            "Short Name": "Rose",
        },
    ]);



    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Manage Feedback</Typography>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: '300px', height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Feedback |"
                            inputProps={{ 'aria-label': 'select feedback' }}
                        />
                        <IconButton type="button" sx={{ p: '10px' }}>
                            <SearchIcon style={{ color: "#7AB7EE" }} />
                        </IconButton>
                    </Box>
                    <Button variant="contained" color="primary" style={{ marginLeft: 'auto' }}
                        onClick={openFeedbackModal}
                    >
                        <AddIcon />
                        Add Feedback
                    </Button>
                </Stack>

                <TableContainer sx={{ height: "63vh" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <ManageFeedbackCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
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
                                </ManageFeedbackCard>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {feedbackData.map((feedbk, index) => (
                                <TableRow key={index}>
                                    <ManageFeedbackCard>
                                        <CardContent style={{ flex: 0.5 }}>
                                            <Typography variant="subtitle2">{feedbk["Sr No"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1.6 }}>
                                            <Typography variant="subtitle2">{feedbk["Short Name"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography variant="subtitle2">{feedbk["Phone No"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography variant="subtitle2">{feedbk["Location"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Tooltip title="Add Content" arrow>
                                                <IconButton aria-label="add" onClick={openFeedbackModal}>
                                                    <AddCircleOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit" arrow>
                                                <IconButton aria-label="edit" onClick={openFeedbackModal}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View" arrow>
                                                <IconButton aria-label="view" onClick={openFeedbackModal}>
                                                    <RemoveRedEyeIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </CardContent>
                                    </ManageFeedbackCard>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>

                {/* ADD Modal Open */}
                <Modal
                    open={feedbackAddModal}
                    onClose={closeFeedbackModal}
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
                                    Add Feedback
                                </Typography>
                                <IconButton onClick={closeFeedbackModal}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                            <TextField
                                label="Question"
                                size="small"
                                fullWidth
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                            <TextField
                                select
                                label="Select Option"
                                size="small"
                                fullWidth
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            >
                                <MenuItem value="Textual">Textual</MenuItem>
                                <MenuItem value="Radio">Radio</MenuItem>
                                <MenuItem value="Checkbox">Checkbox</MenuItem>
                                <MenuItem value="Rating">Rating</MenuItem>
                            </TextField>
                        </Grid>

                        <Button variant="contained" color="primary" style={{ marginBottom: "10px", marginTop: "15px" }}>
                            Submit
                        </Button>
                    </Box>
                </Modal>
            </Box>

        </div>
    )
}

export default ManageFeedBack
