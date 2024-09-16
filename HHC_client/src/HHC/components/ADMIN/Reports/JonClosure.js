import React, { useEffect, useState } from 'react';
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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const JobClosure = styled(Card)({
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

const JonClosure = () => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [jobClosureData, setJobClosureData] = useState([]);
    const accessToken = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const port = process.env.REACT_APP_API_KEY;

    const handleViewReport = async () => {
        try {
            setLoading(true);
            let url = `${port}/hhc_repo/Job_closure_report/?`;

            if (startDate) {
                url += `fromdate=${startDate}&`;
            }
            if (endDate) {
                url += `todate=${endDate}&`;
            }

            const res = await fetch(url.slice(0, -1), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(res);
            const data = await res.json();
            setJobClosureData(data);
            setLoading(false); // Stop loading
            console.log("Data from Closure", data);
        } catch (error) {
            console.error("Error fetching Closure Data:", error);
            setLoading(false); // Stop loading in case of error
        }
    };

    const handleDownloadExcel = async () => {
        try {
            setLoading(true);
            let url = `${port}/hhc_repo/Job_closure_report/?`;

            if (startDate) {
                url += `fromdate=${startDate}&`;
            }
            if (endDate) {
                url += `todate=${endDate}&`;
            }

            const res = await fetch(url.slice(0, -1), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Closure Report");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blob, "closure_report.xlsx");
            setLoading(false); // Stop loading
        } catch (error) {
            console.error("Error fetching Closure Data:", error);
            setLoading(false); // Stop loading in case of error
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ overflowX: 'auto' }}>
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
                                onChange={(e) => setStartDate(e.target.value)}
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
                                inputProps={{ 'aria-label': 'select date' }}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
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
                            onClick={handleDownloadExcel}
                        />
                    </Stack>
                </Box>

                <TableContainer sx={{ ml: 1, mr: 1 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <JobClosure style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Event Code</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Patient Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Professional Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Completed</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Pending</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Service From</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Service To</Typography>
                                    </CardContent>
                                </JobClosure>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <CardContent colSpan={9} align="center">
                                        <CircularProgress />
                                    </CardContent>
                                </TableRow>
                            ) : jobClosureData.length === 0 ? (
                                <TableRow>
                                    <CardContent colSpan={9} align="center">No data Found</CardContent>
                                </TableRow>
                            ) : (
                                jobClosureData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((jobclosure, index) => (
                                        <TableRow key={index}>
                                            <JobClosure style={{ height: '4rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{jobclosure.event_code || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{jobclosure.patient_name || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{jobclosure.prof_name_session.name || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{jobclosure.prof_name_session.closure_completed || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{jobclosure.prof_name_session.closure_pending || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{jobclosure.service_from || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{jobclosure.service_to || '-'}</Typography>
                                                </CardContent>
                                            </JobClosure>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 30, 50]}
                    component="div"
                    count={jobClosureData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </div>
    );
}

export default JonClosure;
