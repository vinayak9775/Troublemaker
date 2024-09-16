import React, { useEffect, useState } from 'react';
import HRNavbar from '../../HR/HRNavbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { TextField, Button, TablePagination, IconButton, Modal } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from 'xlsx';
import TableCell from '@mui/material/TableCell';
import Footer from '../../../Footer';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';

const UTRCards = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    marginRight: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "43px",
    borderRadius: '10px',
    transition: '0.5s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        // cursor: 'pointer',
    },
    fontWeight: "200",
});

const PaymentUTR = () => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [patientName, setPatientName] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);

    const [utrTable, setUtrTable] = useState([]);
    const accessToken = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [utrType, setUtrType] = useState('');
    const [modalOpen, setModalOpen] = useState(false); //// modal opening
    const [utr, setUtr] = useState(''); /////update the  utr
    const [eveId, setEveId] = useState(null);
    const [pkutrId, setPkutrId] = useState(null);

    const port = process.env.REACT_APP_API_KEY;

    const handleUtrTypeChange = (e) => {
        setUtrType(e.target.value);
        setUtrTable([]);
    };

    const handleViewReport = async () => {
        setLoading(true);
        try {
            let url = `${port}/hhc_account/Pending_UTR_Number_in_Payment_Details_Views/?`;

            if (startDate) {
                url += `from_date=${startDate}&`;
            }
            if (endDate) {
                url += `to_date=${endDate}&`;
            }
            if (utrType) {
                url += `UTRid=${utrType}&`;
            }
            if (patientName) {
                url += `patient_name=${encodeURIComponent(patientName)}&`;
            }

            const res = await fetch(url.slice(0, -1), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            if (Array.isArray(data)) {
                setUtrTable(data);
            } else {
                setUtrTable([]);
            }
            setLoading(false);
            console.log("Consultant Data", data);
        } catch (error) {
            console.error("Error fetching Consultant Report Data:", error);
            setLoading(false);
        }
    };

    /////// date changes validation
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setEndDate('');
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const today = new Date().toISOString().split('T')[0];

    /// fetch the field
    useEffect(() => {
        if (selectedRow) {
            // Fetch the UTR value for the selected row and set it
            const selectedData = utrTable.find(row => row.eventCode === selectedRow);
            if (selectedData) {
                setUtr(selectedData.utr || '');
            }
        }
    }, [selectedRow, utrTable]);

    /////// modal Opening
    const handleOpenModal = (eventCode, eveId, pkUtrId) => {
        console.log('Selected Event Code:', eventCode);
        console.log('Selected eve_id:', eveId);
        console.log('Selected pkUtrId:', pkUtrId);
        setSelectedRow(eventCode); // Set the selected row data to state
        setModalOpen(true); // Open the modal

        setPkutrId(pkUtrId)
        setEveId(eveId); // Set the selected eveId
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setUtr(''); // Clear utr state after closing the modal
    };

    /////table pagination
    const getPaginatedData = () => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return utrTable.slice(startIndex, endIndex);
    };

    ////// Update API
    const handleSubmit = async () => {
        const lastModifiedBy = localStorage.getItem('clg_id');
        const lastModifiedDate = new Date().toISOString();

        try {
            const response = await fetch(`${port}/hhc_account/Pending_UTR_Number_detail/${pkutrId}/${eveId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    utr: utr,
                    last_modified_by: lastModifiedBy,
                    last_modified_date: lastModifiedDate,
                })
            });

            if (response.ok) {
                console.log('UTR number updated successfully!');
                handleViewReport(); // Fetch updated data after update
                handleCloseModal(); // Close the modal after update
            } else {
                console.error('Failed to update UTR number');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div style={{ marginBottom: '2em' }}>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ overflowX: 'auto' }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Payment UTR</Typography>
                        <Box
                            component="form"
                            sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 220, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                        >
                            <InputBase
                                sx={{ ml: 1, mr: 1, flex: 1 }}
                                type='date'
                                placeholder="Start Date | DD/MM/YYYY"
                                inputProps={{ 'aria-label': 'select date' }}
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                        </Box>

                        <Box
                            component="form"
                            sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 220, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                        >
                            <InputBase
                                sx={{ ml: 1, mr: 1, flex: 1 }}
                                type='date'
                                placeholder="End Date | DD/MM/YYYY"
                                inputProps={{
                                    'aria-label': 'select date',
                                    min: startDate, // Set the minimum selectable date to the start date
                                    max: today // Set the maximum selectable date to today
                                }}
                                value={endDate}
                                onChange={handleEndDateChange}
                                max={today}
                            />
                        </Box>

                        <Box sx={{ mb: 1, width: 220, marginLeft: '1rem' }}>
                            <TextField
                                select
                                variant="outlined"
                                label='Select UTR Type'
                                size="small"
                                sx={{
                                    height: 39,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                                    borderRadius: "7px"
                                }}
                                InputProps={{ style: { border: "none" } }}
                                inputProps={{ 'aria-label': 'Select Group' }}
                                value={utrType}
                                onChange={handleUtrTypeChange}
                            >
                                <MenuItem value={1}>With UTR</MenuItem>
                                <MenuItem value={2}>Without UTR</MenuItem>
                            </TextField>
                        </Box>

                        <Box sx={{ mb: 1, width: 220, marginLeft: '1rem' }}>
                            <TextField
                                type='text'
                                variant="outlined"
                                placeholder='Search Patient Name..'
                                size="small"
                                sx={{
                                    height: 39,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                                    borderRadius: "7px"
                                }}
                                InputProps={{ style: { border: "none" } }}
                                inputProps={{ 'aria-label': 'Select Group' }}
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                            >
                            </TextField>
                        </Box>

                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#69A5EB', color: 'white', textTransform: 'capitalize' }}
                            onClick={handleViewReport}
                        >
                            Show Result
                        </Button>
                    </Stack>
                </Box>
            </Box>

            {
                utrType === 1 && (
                    <TableContainer sx={{ ml: 1, mr: 1, height: "63vh" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <UTRCards style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Event No</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Caller No</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Patient Name</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Patient No</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Service</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Sub Service</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Start Date</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>End Date</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Payment Mode</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>UTR</Typography>
                                        </CardContent>
                                    </UTRCards>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" style={{ height: '45vh' }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : utrTable.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" style={{ height: '45vh' }}>
                                            <Typography variant="subtitle1">No data found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    getPaginatedData().map((data, index) => (
                                        <TableRow key={index}>
                                            <UTRCards style={{ height: '3.7rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.eve_id.event_code}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.eve_id.caller_id.phone}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.eve_id.agg_sp_pt_id.name}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.eve_id.agg_sp_pt_id.phone_no}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.ser_subSer_sd_ed[0].srv_id.service_title}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.ser_subSer_sd_ed[0].sub_srv_id.recommomded_service}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.ser_subSer_sd_ed[0].start_date}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.ser_subSer_sd_ed[0].end_date}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.Payment_mode}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.utr}</Typography>
                                                </CardContent>
                                            </UTRCards>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            }

            {
                utrType === 2 && (
                    <TableContainer sx={{ ml: 1, mr: 1 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <UTRCards style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                                        <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Event No</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Caller No</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Patient Name</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Patient No</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Service</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Sub Service</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Start Date</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>End Date</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Payment Mode</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Action</Typography>
                                        </CardContent>
                                    </UTRCards>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" style={{ height: '49vh' }} >
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : utrTable.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" style={{ height: '49vh' }}>
                                            <Typography variant="subtitle1">No data found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    getPaginatedData().map((data, index) => (
                                        <TableRow key={index}>
                                            <UTRCards style={{ height: '3.8rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.eve_id.event_code}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.eve_id.caller_id.phone}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.eve_id.agg_sp_pt_id.name}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.eve_id.agg_sp_pt_id.phone_no}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.ser_subSer_sd_ed[0].srv_id.service_title}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.ser_subSer_sd_ed[0].sub_srv_id.recommomded_service}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.ser_subSer_sd_ed[0].start_date}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.ser_subSer_sd_ed[0].end_date}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{data.Payment_mode}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", marginTop: '10px' }}>
                                                    <Typography variant='subtitle2'>
                                                        <IconButton onClick={() => handleOpenModal(data.eve_id.event_code, data.eve_id.eve_id, data.pay_dt_id)}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                    </Typography>
                                                </CardContent>
                                            </UTRCards>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            }

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={utrTable.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
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
                    }}                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', px: '10px' }}>
                        <Typography variant="h6" component="h4" sx={{ flexGrow: 1 }}>
                            UTR Form
                        </Typography>
                        <IconButton onClick={handleCloseModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Event Number"
                            size="small"
                            fullWidth
                            name="Event No"
                            defaultValue={selectedRow ? selectedRow : ''}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                            InputProps={{
                                readOnly: true,
                                sx: {
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                },
                            }}
                        />
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12} style={{ width: '100%', marginTop: '15px' }}>
                        <TextField
                            id="outlined-multiline-static"
                            label="UTR"
                            size="small"
                            fullWidth
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleSubmit}
                    >
                        Update
                    </Button>
                </Box>
            </Modal>

            <Footer />
        </div>
    );
}

export default PaymentUTR;
