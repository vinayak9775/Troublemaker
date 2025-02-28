import React, { useState } from 'react'
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
import HRNavbar from '../HR/HRNavbar';
import Menu from '@mui/material/Menu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import AppBar from '@mui/material/AppBar';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    pt: 2,
    px: 4,
    pb: 3,
};
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

// const options = [
//     'None',
//     'Atria',
//     'Callisto',
//     'Dione',
//     'Ganymede',
//     'Hangouts Call',
//     'Luna',
//     'Oberon',
//     'Phobos',
//     'Pyxis',
//     'Sedna',
//     'Titania',
//     'Triton',
//     'Umbriel',
//   ];

const ITEM_HEIGHT = 48;

const ManageInventory = () => {

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
    const [reportType, setReportType] = useState('');


    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };



    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontSize: 20, fontWeight: 600, marginTop: "20px", marginLeft: "50px", color: '#000' }} gutterBottom>Consumables Listing</Typography>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: '270px', height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
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
                    <Box sx={{ mb: 1, width: 270, marginLeft: '1rem', borderRadius: "10px", border: "1px solid #C9C9C9" }}>
                        <TextField
                            select
                            label="Select Manufacturer  |"
                            variant="outlined"
                            size="small"
                            sx={{ height: 39, width: '270px', backgroundColor: 'white', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "7px", '& .MuiMenu-paper': { maxHeight: '200px', overflowY: 'auto' } }}
                            InputProps={{ style: { border: "none" } }}
                            inputProps={{ 'aria-label': 'Select Group' }}
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <MenuItem value={1}>Cancel Enquiry</MenuItem>
                            <MenuItem value={2}>Source of Enquiry Report</MenuItem>
                            <MenuItem value={3}>Enquiry Within 2 hrs</MenuItem>
                            <MenuItem value={4}>Total Converted To Service</MenuItem>
                        </TextField>
                    </Box>
                    <Button variant="contained" style={{ marginLeft: 'auto', backgroundColor: '#69A5EB' }}
                        onClick={openFeedbackModal}
                    >
                        {/* <AddIcon /> */}
                        Manage Consumable Stock
                    </Button>
                    <Button variant="contained" style={{ marginLeft: 'auto', backgroundColor: '#69A5EB' }}
                        onClick={openFeedbackModal}
                    >
                        <AddIcon />
                        Add Consumable Item
                    </Button>
                </Stack>

                <TableContainer sx={{ height: "63vh", mt: 1 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <ManageFeedbackCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Item Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Min Qty.</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Balance</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Unit Type</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Manufacture</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Manufacture Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Expiry Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Status</Typography>
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
                                        <CardContent style={{ flex: 0.5, textAlign: 'center' }}>
                                            <Typography variant="subtitle2">{feedbk["Sr No"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1.6, textAlign: 'center' }}>
                                            <Typography variant="subtitle2">{feedbk["Short Name"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                            <Typography variant="subtitle2">{feedbk["Phone No"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                            <Typography variant="subtitle2">{feedbk["Location"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                            <Typography variant="subtitle2">{feedbk["Location"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                            <Typography variant="subtitle2">{feedbk["Location"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1.5, textAlign: 'center' }}>
                                            <Typography variant="subtitle2">{feedbk["Location"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                            <Typography variant="subtitle2">{feedbk["Location"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                            <Typography variant="subtitle2">{feedbk["Location"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                            <IconButton
                                                aria-label="more"
                                                id="long-button"
                                                aria-controls={open ? 'long-menu' : undefined}
                                                aria-expanded={open ? 'true' : undefined}
                                                aria-haspopup="true"
                                                onClick={handleClick}
                                            >
                                                <MoreHorizIcon />
                                            </IconButton>
                                            <Menu
                                                id="long-menu"
                                                MenuListProps={{
                                                    'aria-labelledby': 'long-button',
                                                }}
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                PaperProps={{
                                                    style: {
                                                        maxHeight: ITEM_HEIGHT * 4.5,
                                                        width: '20ch',
                                                    },
                                                }}
                                            >
                                                <MenuItem onClick={handleClose}><RemoveRedEyeIcon sx={{ ml: 3, mr: 1 }} />View</MenuItem>
                                                <MenuItem onClick={handleClose} sx={{ color: '#69A5EB' }}><EditIcon sx={{ ml: 3, mr: 1 }} />Edit</MenuItem>
                                                <MenuItem onClick={handleClose} sx={{ color: '#E80054' }}><HighlightOffIcon sx={{ ml: 3, mr: 1 }} />Delete</MenuItem>
                                                <MenuItem onClick={handleClose} sx={{ color: '#2CDFAA', ml: 2 }}>
                                                    {/* <ToggleOnIcon/> */}
                                                    Active/Inactive
                                                </MenuItem>

                                            </Menu>
                                            {/* <Tooltip title="Add Content" arrow>
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
                                            </Tooltip> */}
                                        </CardContent>
                                    </ManageFeedbackCard>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>

                {/* ADD Modal Open */}
                {/* <Modal
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
                </Modal> */}

                <Grid item xs={12}>
                    <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>

                        <Modal
                            open={feedbackAddModal}
                            onClose={closeFeedbackModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={{ ...style, width: 400, borderRadius: "10px",backgroundColor:'#fff' }}>

                                <AppBar position="static" style={{
                                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                    width: '29rem',
                                    height: '3rem',
                                    marginTop: '-16px',
                                    marginBottom: '1rem',
                                    marginLeft: "-32px",
                                    borderRadius: "8px 10px 0 0",
                                    lineHeight: 'auto'
                                }}>
                                    <div style={{ display: "flex" }}>
                                        <Typography align="center" style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "-40px", width: '300px' }}>Add Stock</Typography>
                                        <Button onClick={closeFeedbackModal} sx={{ marginLeft: "8.5rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                    </div>
                                </AppBar>

                                <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                                    <TextField
                                        select
                                        label="Select Item"
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

                                <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                                    <TextField
                                        select
                                        label="Select Quantity"
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
                    </Card>
                </Grid>
            </Box>

        </div>
    )
}

export default ManageInventory
