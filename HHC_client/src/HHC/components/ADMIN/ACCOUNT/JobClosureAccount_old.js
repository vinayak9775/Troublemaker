import React, { useEffect, useState } from 'react';
import HRNavbar from '../../HR/HRNavbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Button, TablePagination, TableCell, Modal, IconButton } from '@mui/material';
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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import Footer from '../../../Footer';

const PaymentPatientCard = styled(Card)({
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
        cursor: 'pointer',
    },
    fontWeight: "200"
});

const JobClosureAccount = () => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentPatient, setPaymentPatient] = useState([]);
    const accessToken = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [viewTableResponse, setViewTableResponse] = useState([])
    const port = process.env.REACT_APP_API_KEY;

    const [selectedID, setSelectedID] = useState('')
    console.log(selectedID, 'Selected Closure ID');

    const handleViewReport = async () => {
        setLoading(true); // Start loading
        try {
            let url = `${port}/hhc_account/job_closure_report/`;

            if (startDate) {
                url += `${startDate}/`;
            }
            if (endDate) {
                url += `${endDate}`;
            }

            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            setPaymentPatient(data);

            // Set events_id from the first item in the response array
            if (data.length > 0) {
                setSelectedID(data[0].events_id);
            }

            setLoading(false);
            console.log("Closure Data", data);
        } catch (error) {
            console.error("Error fetching jobClosure Data:", error);
            setLoading(false);
        }
    };

    //// Id Wise get the Response from the View
    useEffect(() => {
        const handleViewResponse = async () => {
            try {
                setLoading(true);
                let url = `${port}/hhc_account/job_closure_report_event_wise/`;
                if (selectedID) {
                    url += `${selectedID}`;
                }
                const res = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();
                setViewTableResponse(data.job_cl_eve_data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Closure Data for View Data:", error);
                setLoading(false);
            }
        };

        handleViewResponse();
    }, [selectedID]);

    const handleDownloadExcel = async () => {
        try {
            let url = `${port}/hhc_account/job_closure_report/`;

            if (startDate) {
                url += `${startDate}/`;
            }
            if (endDate) {
                url += `${endDate}`;
            }

            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();

            const renamedData = data.map(item => ({
                'Patient Name': item.ptn_name,
                'Mobile Number': item.mobile_no,
                'Event Code': item.events_code,
                'Total JobClosure': item.total_session,
                'Job Closure Done': item.closed_session,
                'JC Total Remaining': item.pending_session,
            }));

            const worksheet = XLSX.utils.json_to_sheet(renamedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Job Closure Details");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), "export_closureDetails.xlsx");
        } catch (error) {
            console.error("Error fetching Patient Data:", error);
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    ////// modal open
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedJobClosure, setSelectedJobClosure] = useState(null);

    const handleModalOpen = (jobClosure) => {
        setSelectedJobClosure(jobClosure);
        setSelectedID(jobClosure.events_id); // Set selectedID here
        console.log("Selected ID:", selectedID); // Log selectedID to the console
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    /////// date changes validation
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setEndDate(''); // Reset end date whenever start date changes
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };
    
    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ overflowX: 'auto' }}>

                        <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Job Closure</Typography>

                        <Box
                            component="form"
                            sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
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
                            sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
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

                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#69A5EB', color: 'white', textTransform: 'capitalize' }}
                            onClick={handleViewReport}
                        >
                            View
                        </Button>

                        <FileDownloadOutlinedIcon
                            onClick={() => {
                                handleDownloadExcel();
                            }}
                        />
                    </Stack>
                </Box>

                <TableContainer sx={{ ml: 1, mr: 1 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <PaymentPatientCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Sr No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Patient Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Mobile Number</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Event Code</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Total Session</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Closed Session</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Pending Session</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Action</Typography>
                                    </CardContent>
                                </PaymentPatientCard>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ?
                                (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                )
                                :
                                paymentPatient.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                            <Typography variant="subtitle1">No data found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) :
                                    (
                                        paymentPatient
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((jobClosure, index) => (
                                                <TableRow key={index}>
                                                    <PaymentPatientCard style={{ height: '3rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{index + 1}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{jobClosure.ptn_name || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{jobClosure.mobile_no || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{jobClosure.events_code || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{jobClosure.total_session || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{jobClosure.closed_session || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{jobClosure.pending_session || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }} onClick={() => handleModalOpen(jobClosure)}> {/* Pass the entire jobClosure object */}
                                                            <RemoveRedEyeIcon />
                                                        </CardContent>
                                                    </PaymentPatientCard>
                                                </TableRow>
                                            ))
                                    )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
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
                            width: 700,
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
                                    View
                                </Typography>
                                <IconButton onClick={handleModalClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <TableContainer sx={{ ml: 1, mr: 1 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <PaymentPatientCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>Professional Name</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>Start Date</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>End Date</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>Service</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>Total Session</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>Closed Session</Typography>
                                                </CardContent>
                                            </PaymentPatientCard>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {viewTableResponse.map((jobClosure, index) => (
                                            <TableRow key={index}>
                                                <PaymentPatientCard style={{ height: 'auto', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{jobClosure.professional_name || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{jobClosure.start_date || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{jobClosure.end_date || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{jobClosure.service || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{jobClosure.total_sessions || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{jobClosure.closed_sessions || '-'}</Typography>
                                                    </CardContent>
                                                </PaymentPatientCard>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Modal>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 30, 50]}
                    component="div"
                    count={paymentPatient.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <Footer/>
        </div>
    );
}

export default JobClosureAccount;
