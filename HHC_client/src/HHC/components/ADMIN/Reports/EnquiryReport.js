import React, { useState } from 'react';
import HRNavbar from '../../HR/HRNavbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { TextField, Button, TablePagination } from '@mui/material';
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
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import TableCell from '@mui/material/TableCell';
import Footer from '../../../Footer';

const EnquiryCard = styled(Card)({
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
    fontWeight: "200"
});

const EnquiryReport = () => {
    const [reportType, setReportType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const accessToken = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0); // State for current page
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const port = process.env.REACT_APP_API_KEY;

    const handleViewReport = async () => {
        setLoading(true);
        try {
            let url = `${port}/hhc_repo/Manage_enquiry_Report/?`;

            if (startDate) {
                url += `fromdate=${startDate}&`;
            }
            if (endDate) {
                url += `todate=${endDate}&`;
            }
            if (reportType) {
                url += `select_report_type=${reportType}&`;
            }

            const res = await fetch(url.slice(0, -1), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(res);
            const data = await res.json();
            setReportData(data);
            setLoading(false);
            console.log("Data from Enquiry", data);
        } catch (error) {
            console.error("Error fetching Enquiries Data:", error);
            setLoading(false);
        }
    };

    const handleDownloadExcel = async () => {
        try {
            let url = `${port}/hhc_repo/Manage_enquiry_Report/?`;

            if (startDate) {
                url += `fromdate=${startDate}&`;
            }
            if (endDate) {
                url += `todate=${endDate}&`;
            }
            if (reportType) {
                url += `select_report_type=${reportType}&`;
            }

            const res = await fetch(url.slice(0, -1), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();

            // Rename column names
            let renamedData = [];
            if (reportType === 1) {
                renamedData = data.map(item => ({
                    'Enquiry Follow Up ID': item.enq_follow_up_id,
                    'Event Code': item.event_code,
                    'Caller Number': item.caller_no,
                    'Patient Name': item.patient_name,
                    'Service': item.service,
                    'Sub-Service': item.recomanded_service,
                    'Event Start Date': item.event_stert_date,
                    'Previous Follow Up Remark': item.previous_follow_up_remark,
                    'Cancel By': item.cancel_by,
                    'Cancellation Reasons': item.canclation_reason,
                    'Address': item.address,
                    'Enquiry Added Date': item.enquiry_added_date,
                    'Enquiry Added By': item.enquiry_added_by,
                    'Enquiry Last Modified By': item.enquiry_last_modified_by
                }));
            } else if (reportType === 2) {
                renamedData = data.map(item => ({
                    'Event Code': item.event_code,
                    'Caller Number': item.caller_no,
                    'Patient Name': item.patient_name,
                    'Service': item.srv_id,
                    'Sub-Service': item.sub_srv_id,
                    'Source of Enquiry': item.source_of_enquity,
                }));
            } else if (reportType === 3) {
                renamedData = data.map(item => ({
                    'Event Code': item.event_code,
                    'Caller Number': item.caller_no,
                    'Service': item.service,
                    'Sub-Service': item.sub_service,
                    'Service Start Date': item.start_date,
                    'Service End Date': item.end_date,
                }));
            } else {
                renamedData = data.map(item => ({
                    'Event Code': item.event_code,
                    'Caller Number': item.caller_no,
                    'Patient Name': item.patient_name,
                    'Service': item.srv_id,
                    'Sub-Service': item.sub_srv_id,
                    'Service Start Date': item.start_date,
                    'Service End Date': item.end_date,
                }));
            }

            const worksheet = XLSX.utils.json_to_sheet(renamedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiry Report");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), "enquiry_report.xlsx");
        } catch (error) {
            console.error("Error fetching Enquiries Data:", error);
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

    /////// date changes validation
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setEndDate('');
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div style={{ marginBottom: '2em' }}>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ overflowX: 'auto' }}>

                        <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Enquiry Report</Typography>

                        <Box sx={{ mb: 1, width: 300, marginLeft: '1rem' }}>
                            <TextField
                                select
                                label="Select Report Type"
                                variant="outlined"
                                size="small"
                                sx={{ height: 39, width: '100%', backgroundColor: 'white', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "7px", '& .MuiMenu-paper': { maxHeight: '200px', overflowY: 'auto' } }}
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
                                    min: startDate,
                                    max: today
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
                            View Report
                        </Button>

                        <FileDownloadOutlinedIcon
                            onClick={() => {
                                handleDownloadExcel();
                            }}
                        />
                    </Stack>
                </Box>

                {
                    reportType === 1 && reportData.length > 0 && (
                        <TableContainer sx={{ ml: 1, mr: 1 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <EnquiryCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '4rem' }}>
                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Sr No</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Event Code</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Caller Number</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Patient Name</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Service</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Sub-Service</Typography>
                                            </CardContent>
                                            {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Enquiry Added Date</Typography>
                                            </CardContent> */}
                                            {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Added By</Typography>
                                            </CardContent> */}
                                            {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Last Modify By</Typography>
                                            </CardContent> */}
                                            {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Event Date</Typography>
                                            </CardContent> */}
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Cancel From</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Cancellation Reason</Typography>
                                            </CardContent>
                                            {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Enquiry Cancelation reason</Typography>
                                            </CardContent> */}
                                        </EnquiryCard>
                                    </TableRow>
                                </TableHead>

                                {loading ? (
                                    <Box sx={{ display: 'flex', mt: 15, justifyContent: 'center', height: '45vh' }}>
                                        <CircularProgress />
                                    </Box>
                                ) : reportData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                            <Typography variant="subtitle1">No data found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableBody>
                                        {reportData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Slicing the data for the current page
                                            .map((enquiryData, index) => (
                                                <TableRow key={index}>
                                                    <EnquiryCard style={{ height: '4rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant='subtitle2'>{page * rowsPerPage + index + 1}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.event_code || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 2 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.caller_no || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.patient_name || '-'}</Typography>
                                                        </CardContent>
                                                        {/* <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.enquiry_added_date ? new Date(enquiryData.enquiry_added_date).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: '2-digit'
                                                                }) : '-'}
                                                            </Typography>
                                                        </CardContent> */}
                                                        {/* <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.enquiry_added_by || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.enquiry_last_modified_by || '-'}</Typography>
                                                        </CardContent> */}
                                                        {/* <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.event_stert_date ? new Date(enquiryData.event_stert_date).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: '2-digit'
                                                                }) : '-'}
                                                            </Typography>
                                                        </CardContent> */}
                                                        {/* <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.previous_follow_up_remark || '-'}</Typography>
                                                        </CardContent> */}
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.service || '-'}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.recomanded_service || '-'}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.cancel_by || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.canclation_reason || '-'}</Typography>
                                                        </CardContent>
                                                    </EnquiryCard>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                )}

                            </Table>
                        </TableContainer>
                    )
                }

                {
                    reportType === 2 && reportData.length > 0 && (
                        <TableContainer
                            sx={{ ml: 1, mr: 1 }}
                        >
                            <Table>
                                <TableHead >
                                    <TableRow >
                                        <EnquiryCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Sr No</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Event Code</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Caller Number</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Patient Name</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Service</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Sub-Service</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Source Of Enquiry</Typography>
                                            </CardContent>
                                            {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Enquiry Status</Typography>
                                            </CardContent> */}
                                        </EnquiryCard>
                                    </TableRow>
                                </TableHead>

                                {loading ? (
                                    <Box sx={{ display: 'flex', mt: 15, justifyContent: 'center', height: '45vh' }}>
                                        <CircularProgress />
                                    </Box>
                                ) : reportData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                            <Typography variant="subtitle1">No data found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableBody >
                                        {reportData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Slicing the data for the current page
                                            .map((enquiryData, index) => (
                                                <TableRow key={index}>
                                                    <EnquiryCard style={{ background: "white", height: "auto", color: "#000000", borderRadius: "8px 10px 8px 8px" }}>
                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant='subtitle2'>{page * rowsPerPage + index + 1}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.event_code}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.caller_no}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.patient_name}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.srv_id || '-'}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.sub_srv_id || '-'}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 2 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.source_of_enquity || '-'}
                                                            </Typography>
                                                        </CardContent>
                                                        {/* <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.enquiry_status || '-'}
                                                            </Typography>
                                                        </CardContent> */}
                                                    </EnquiryCard>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    )
                }

                {
                    reportType === 3 && reportData.length > 0 && (
                        <TableContainer
                            sx={{ ml: 1, mr: 1 }}
                        >
                            <Table>
                                <TableHead >
                                    <TableRow >
                                        <EnquiryCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Sr No</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Event Code</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Caller Number</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Service</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Sub-service</Typography>
                                            </CardContent>
                                            {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Enquiry Added Date</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Added Date</Typography>
                                            </CardContent> */}

                                        </EnquiryCard>
                                    </TableRow>
                                </TableHead>

                                {loading ? (
                                    <Box sx={{ display: 'flex', mt: 15, justifyContent: 'center', height: '45vh' }}>
                                        <CircularProgress />
                                    </Box>
                                ) : reportData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                            <Typography variant="subtitle1">No data found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableBody >
                                        {reportData
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((enquiryData, index) => (
                                                <TableRow key={index}>
                                                    <EnquiryCard style={{ background: "white", height: 'auto', color: "#000000", borderRadius: "8px 10px 8px 8px" }}>
                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant='subtitle2'>{page * rowsPerPage + index + 1}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 2 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.event_code || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>{enquiryData.caller_no || '-'}</Typography>
                                                        </CardContent>

                                                        {/* <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.added_date ? new Date(enquiryData.added_date).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: '2-digit'
                                                                }) : '-'}
                                                            </Typography>
                                                        </CardContent> */}
                                                        {/* <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.added_date ? new Date(enquiryData.added_date).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: '2-digit'
                                                                }) : '-'}
                                                            </Typography>
                                                        </CardContent> */}
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.service || '-'}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3 }}>
                                                            <Typography variant='subtitle2'>
                                                                {enquiryData.sub_service || '-'}
                                                            </Typography>
                                                        </CardContent>
                                                    </EnquiryCard>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                )
                                }
                            </Table>
                        </TableContainer>
                    )
                }

                {
                    reportType === 4 && reportData.length > 0 ? (
                        <TableContainer sx={{ ml: 1, mr: 1 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <EnquiryCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Sr No</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Event Code</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Caller Number</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Service Title</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Sub-Service</Typography>
                                            </CardContent>
                                        </EnquiryCard>
                                    </TableRow>
                                </TableHead>

                                {loading ?
                                    (
                                        <Box sx={{ display: 'flex', mt: 15, justifyContent: 'center', height: '45vh' }}>
                                            <CircularProgress />
                                        </Box>
                                    ) :
                                    reportData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                                <Typography variant="subtitle1">No data found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                        :
                                        (
                                            <TableBody>
                                                {reportData
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((enquiryData, index) => (
                                                        <TableRow key={index}>
                                                            <EnquiryCard style={{ background: "white", height: "auto", color: "#000000", borderRadius: "8px 10px 8px 8px" }}>
                                                                <CardContent style={{ flex: 1 }}>
                                                                    <Typography variant='subtitle2'>{page * rowsPerPage + index + 1}</Typography>
                                                                </CardContent>
                                                                <CardContent style={{ flex: 2 }}>
                                                                    <Typography variant='subtitle2'>{enquiryData.event_code}</Typography>
                                                                </CardContent>
                                                                <CardContent style={{ flex: 3 }}>
                                                                    <Typography variant='subtitle2'>{enquiryData.caller_no}</Typography>
                                                                </CardContent>
                                                                <CardContent style={{ flex: 3 }}>
                                                                    <Typography variant='subtitle2'>
                                                                        {enquiryData.srv_id}
                                                                    </Typography>
                                                                </CardContent>
                                                                <CardContent style={{ flex: 3 }}>
                                                                    <Typography variant='subtitle2'>{enquiryData.sub_srv_id}</Typography>
                                                                </CardContent>
                                                            </EnquiryCard>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        )
                                }
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography style={{ marginTop: '10px' }} variant="body1"></Typography>
                    )
                }

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 30, 50]}
                    component="div"
                    count={reportData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <Footer />
        </div>
    );
}

export default EnquiryReport;
