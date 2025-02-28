import React, { useEffect, useState } from 'react';
import HRNavbar from '../HR/HRNavbar';
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
import { TableCell } from '@mui/material';
// import Footer from '../../../Footer';
import moment from 'moment';
import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';

const Refundamt = styled(Card)({
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

const ManageReports = () => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [RerfundData, setRerfundData] = useState([]);
    const accessToken = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const port = process.env.REACT_APP_API_KEY;
    const [dateHeaders, setDateHeaders] = useState([]);

    useEffect(() => {

        const getDateRange = (startDate, endDate) => {
            const dates = [];
            let currentDate = new Date(startDate);
    
            while (currentDate <= new Date(endDate)) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            console.log(dates,'datesdates');
            
            setDateHeaders(dates)
            return dates;
        };
        if(startDate && endDate)
        {
        getDateRange(startDate, endDate)
        }
    }, [startDate,endDate])
    
    // const getDateRange = (startDate, endDate) => {
    //     const dates = [];
    //     let currentDate = new Date(startDate);

    //     while (currentDate <= new Date(endDate)) {
    //         dates.push(new Date(currentDate));
    //         currentDate.setDate(currentDate.getDate() + 1);
    //     }
    //     console.log(dates,'datesdates');
        
    //     setDateHeaders(dates)
    //     return dates;
    // };


    const handleViewReport = async () => {
        setLoading(true);
        try {
            // getDateRange(startDate,endDate)
            let url = `${port}/web/attendance-report/?`;

            if (startDate) {
                url += `from_date=${startDate}&`;
            }
            if (endDate) {
                url += `to_date=${endDate}&`;
            }

            const res = await fetch(url.slice(0, -1), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            console.log(data,'llllllllllll');

            const jobTypeMapping = {
                1: 'ONCALL',
                2: 'FULLTIME',
                3: 'PARTTIME'
            };

            const structuredData = data.map(professional => ({
                id: professional.Professional_iid,
                name: professional.professional_name,
                // jobType: professional.job_type,
                jobType: jobTypeMapping[professional.job_type] || '',
                total_hours: professional.total_hours,
                attendance: professional.attendance.map(entry => ({
                    date: entry.attnd_date,
                    status: entry.attnd_status,
                    service: entry.service || null,
                    note: entry.attnd_Note || null,
                    approveStatus: entry.approve_status || null,
                    attnd_type: entry.attnd_type || null,
                    added_by: entry.added_by || null,
                    // total_hours: entry.total_hours || null
                }))
            }));


            setRerfundData(structuredData);
            setLoading(false);
            console.log("Data attendance-report", data);
            // getDateRange(startDate, endDate)


        } catch (error) {
            console.error("Error fetching attendance-report Data:", error);
            setLoading(false);
        }
    };

    // const handleDownloadExcel = async () => {
    //     setLoading(true);
    //     try {
    //         let url = `${port}/web/attendance-report/?`;

    //         if (startDate) {
    //             url += `from_date=${startDate}&`;
    //         }
    //         if (endDate) {
    //             url += `to_date=${endDate}&`;
    //         }

    //         const res = await fetch(url.slice(0, -1),
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${accessToken}`,
    //                     'Content-Type': 'application/json',
    //                 }
    //             });
    //         const data = await res.json();

    //         // Get all unique dates from the data
    //         const allDates = [...new Set(data.flatMap(professional => professional.attendance.map(entry => moment(entry.attnd_date).format('YYYY-MM-DD'))))];
    //         console.log(allDates,'allDates');
            

    //         // Define headers
    //         const headers = [
    //             "Sr. No.",
    //             "Professional Name",
    //             "Job Type",
    //             "Total Hours",
    //             ...dateHeaders.map(date => moment(date).format('MM/DD/YYYY'))
    //         ];

    //         // Create structured data
    //         const structuredData = data.map((professional, index) => {
    //             const row = {
    //                 "Sr. No.": index + 1,
    //                 "Professional Name": professional.professional_name || '',
    //                 "Job Type": professional.job_type || '',
    //                 "Total Hours":professional.total_hours || ''
    //             };

    //             // Initialize date columns with default value
    //             dateHeaders.forEach(date => {
    //                 row[moment(date).format('MM/DD/YYYY')] = '';
    //             });

    //             // Fill date columns with attendance data
    //             professional.attendance.forEach(entry => {
    //                 const formattedDate = moment(entry.attnd_date).format('MM/DD/YYYY');
    //                 // row[formattedDate] = `${entry.attnd_status || ''} ${entry.attnd_type || ''} ${entry.attnd_Note || ''} ${entry.added_by ? 'added by: ' + entry.added_by : ''}`;
    //                 row[formattedDate] = `${entry.attnd_status || ''}\u000A${entry.attnd_type || ''}\u000A${entry.attnd_Note || ''}\u000A${entry.added_by ? 'added by: ' + entry.added_by : ''}`;
    //                 // row[formattedDate] = `${entry.attnd_status || ''}${String.fromCharCode(10)}${entry.attnd_type || ''}${String.fromCharCode(10)}${entry.attnd_Note || ''}${String.fromCharCode(10)}${entry.added_by || ''}`;
    //       });

    //             return row;
    //         });

    //         // Convert JSON to worksheet
    //         const worksheet = XLSX.utils.json_to_sheet(structuredData);
    //         // Add headers
    //         XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    //         // Create workbook and append worksheet
    //         const workbook = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");


    //         // Write and save the Excel file
    //         const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //         const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    //         saveAs(blob, "attendance_report.xlsx");

    //         setLoading(false);

    //     } catch (error) {
    //         console.error("Error fetching Enquiries Data:", error);
    //         setLoading(false);
    //     }
    // };



// const handleDownloadExcel = async () => {
//     setLoading(true);
//     try {
//         let url = `${port}/web/attendance-report/?`;

//         if (startDate) {
//             url += `from_date=${startDate}&`;
//         }
//         if (endDate) {
//             url += `to_date=${endDate}&`;
//         }

//         const res = await fetch(url.slice(0, -1), {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 'Content-Type': 'application/json',
//             }
//         });
//         const data = await res.json();

//         // Get all unique dates from the data
//         // getDateRange(startDate, endDate)
//         // const allDates = [...new Set(data.flatMap(professional => professional.attendance.map(entry => moment(entry.attnd_date).format('YYYY-MM-DD'))))];
//         // console.log(allDates, 'allDates');

//         // Create a workbook and add a worksheet
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Attendance Report');

//         // Define headers
//         const headers = [
//             "Sr. No.",
//             "Professional Name",
//             "Job Type",
//             "Total Hours",
//             ...dateHeaders.map(date => moment(date).format('MM/DD/YYYY'))
//         ];

//         // Add headers to the worksheet
//         worksheet.addRow(headers);

//         // Create structured data
//         data.forEach((professional, index) => {
//             const row = {
//                 "Sr. No.": index + 1,
//                 "Professional Name": professional.professional_name || '',
//                 "Job Type": professional.job_type || '',
//                 "Total Hours": professional.total_hours || ''
//             };

//             // Initialize date columns with default value
//             dateHeaders.forEach(date => {
//                 row[moment(date).format('MM/DD/YYYY')] = '';
//             });

//             // Fill date columns with attendance data
//             professional.attendance.forEach(entry => {
//                 const formattedDate = moment(entry.attnd_date).format('MM/DD/YYYY');
//                 row[formattedDate] = `${entry.attnd_status || ''}\n${entry.attnd_type || ''}\n${entry.attnd_Note || ''}\n${entry.added_by ? 'added by: ' + entry.added_by : ''}`;
//             });

//             // Add the row to the worksheet
//             const worksheetRow = worksheet.addRow(Object.values(row));

//             worksheet.columns = [
//                 { width: 10 },
//                 { width: 20 },
//                 { width: 15 },
//                 { width: 12 },
//                 ...dateHeaders.map(() => ({ width: 25 })) // Adjust the width of date columns as needed
//             ];

            
//             // Set wrap text for each cell in the row
//             worksheetRow.eachCell({ includeEmpty: true }, cell => {
//                 cell.alignment = { wrapText: true };
//             });
//         });

//         // Write the workbook to a buffer
//         const buffer = await workbook.xlsx.writeBuffer();

//         // Save the buffer to a file
//         const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//         saveAs(blob, "attendance_report.xlsx");

//         setLoading(false);

//     } catch (error) {
//         console.error("Error fetching Enquiries Data:", error);
//         setLoading(false);
//     }
// };


const handleDownloadExcel = async () => {
    setLoading(true);
    try {
        let url = `${port}/web/attendance-report/?`;

        if (startDate) {
            url += `from_date=${startDate}&`;
        }
        if (endDate) {
            url += `to_date=${endDate}&`;
        }

        const res = await fetch(url.slice(0, -1), {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });
        const data = await res.json();

        // Get all unique dates from the data and set dateHeaders if not already set
        const allDates = [...new Set(data.flatMap(professional => professional.attendance.map(entry => moment(entry.attnd_date).format('YYYY-MM-DD'))))];
        if (dateHeaders.length === 0) {
            setDateHeaders(allDates);
        }
        console.log(dateHeaders, 'dateHeaders');

        // Create a workbook and add a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance Report');

        // Add the main title
        const titleRow = worksheet.addRow(['Spero Healthcare Innovations Pvt. Ltd - 2024-2025']);
        titleRow.font = { bold: true, size: 14 };
        titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.mergeCells(titleRow.number, 1, titleRow.number, 4 + dateHeaders.length);

        // Add a subtitle
        const subtitleRow = worksheet.addRow(['Professional Attendance Report']);
        subtitleRow.font = { bold: true, size: 12 };
        subtitleRow.alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.mergeCells(subtitleRow.number, 1, subtitleRow.number, 4 + dateHeaders.length);

        // Define headers
        const headers = [
            "Sr. No.",
            "Professional Name",
            "Job Type",
            "Total Hours",
            ...dateHeaders.map(date => moment(date).format('MM/DD/YYYY'))
        ];

        // Add headers to the worksheet
        const headerRow = worksheet.addRow(headers);

        // Set column widths
        worksheet.columns = [
            { width: 10 },
            { width: 20 },
            { width: 15 },
            { width: 12 },
            ...dateHeaders.map(() => ({ width: 25 }))
        ];

        // Apply bold formatting to the header row
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center',vertical: 'middle', wrapText: true, vertical: 'top' };
        });

        // Freeze the first three rows
        worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 3 }];

        // Create structured data
        data.forEach((professional, index) => {
            const jobTypeMapping = {
                1: 'ONCALL',
                2: 'FULLTIME',
                3: 'PARTTIME'
            };

            const row = {
                "Sr. No.": index + 1,
                "Professional Name": professional.professional_name || '',
                // Map the job type
                "Job Type": jobTypeMapping[professional.job_type] || '', // Default to 'Unknown' if not matched
                // "Job Type": professional.job_type || '', // Default to 'Unknown' if not matched
                "Total Hours": professional.total_hours || ''
            };

            // Initialize date columns with default value
            dateHeaders.forEach(date => {
                row[moment(date).format('MM/DD/YYYY')] = '';
            });

            // Fill date columns with attendance data
            professional.attendance.forEach(entry => {
                const formattedDate = moment(entry.attnd_date).format('MM/DD/YYYY');
                row[formattedDate] = `${entry.attnd_status || ''}\n${entry.attnd_type || ''}\n${entry.attnd_Note || ''}\n${entry.added_by ? 'added by: ' + entry.added_by : ''}`;
            });

            // Add the row to the worksheet
            const worksheetRow = worksheet.addRow(Object.values(row));

            // Set wrap text, vertical alignment, and bold font for each cell in the row
            worksheetRow.eachCell({ includeEmpty: true }, cell => {
                cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
                cell.font = { bold: true };
            });
        });

        // Write the workbook to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Save the buffer to a file
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, "Professiona_attendance_report.xlsx");

        setLoading(false);

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
        setEndDate(''); // Reset end date whenever start date changes
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setRerfundData([]);
    }
    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'left', marginLeft: '15px', mt: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ overflowX: 'auto' }}>

                        <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Attendance Report</Typography>

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
                            View Report
                        </Button>

                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#69A5EB', color: 'white', textTransform: 'capitalize' }}
                            onClick={handleDownloadExcel}
                        >
                            <FileDownloadOutlinedIcon /> Download Report
                        </Button>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#69A5EB', color: 'white', textTransform: 'capitalize' }}
                            onClick={handleReset}
                        >
                            Reset Filter
                        </Button>

                    </Stack>
                </Box>

                <TableContainer sx={{ ml: 1, mr: 1, mt: 2 }}>
                    <Table>
                        {RerfundData != '' && (<TableHead>
                            <TableRow>
                                <TableCell style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 0px 0 0", height: '1rem', padding: 0, textAlign: 'center' }}>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Sr. No.</Typography>
                                    </CardContent>
                                </TableCell>
                                <TableCell style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 0px 0 0", height: '1rem', padding: 0, textAlign: 'center' }}>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Professional Name</Typography>
                                    </CardContent>
                                </TableCell>
                                <TableCell style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "0px 0px 0 0", height: '1rem', padding: 0, textAlign: 'center' }}>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Job Type</Typography>
                                    </CardContent>
                                </TableCell>
                                <TableCell style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "0px 0px 0 0", height: '1rem', padding: 0, textAlign: 'center' }}>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Total Hours</Typography>
                                    </CardContent>
                                </TableCell>
                                {dateHeaders.map((date, index) => (
                                    <TableCell key={index} style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "0px 0px 0 0", height: '1rem', padding: 0, textAlign: 'center', width: '100px' }}>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>{moment(date).format('MM/DD/YYYY')}</Typography>
                                        </CardContent>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>)}

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" style={{ height: '52vh' }}>
                                        <CircularProgress align="center" style={{ marginTop: '30px' }} />
                                    </TableCell>
                                </TableRow>
                            ) : RerfundData.length === 0 ? (
                                <TableRow style={{ marginTop: '12px', height: '52vh' }}>
                                    <TableCell colSpan={dateHeaders.length + 3} align="center">No data found</TableCell>
                                </TableRow>
                            ) : (
                                RerfundData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((refund, index) => (
                                        <TableRow key={index} >
                                            <TableCell style={{ textAlign: 'center' }}>
                                                <Typography variant='subtitle2'>{index + 1}</Typography>
                                            </TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>
                                                <Typography variant='subtitle2'>{refund.name}</Typography>
                                            </TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>
                                                <Typography variant='subtitle2'>{refund.jobType || ''}</Typography>
                                            </TableCell>
                                            <TableCell style={{ textAlign: 'center' }}>
                                                <Typography variant='subtitle2'>{refund.total_hours || ''}</Typography>
                                            </TableCell>
                                            {dateHeaders.map((date, index) => (
                                                <TableCell key={index} style={{ textAlign: 'center' }}>
                                                    <Typography variant='subtitle2'>
                                                        {refund.attendance.find(entry => moment(entry.date).isSame(date, 'day'))?.status || ''}
                                                    </Typography>
                                                    {/* <Typography variant='subtitle2'>
                                                        {refund.attendance.find(entry => moment(entry.date).isSame(date, 'day'))?.service || '-'}
                                                    </Typography> */}
                                                    <Typography variant='subtitle2'>
                                                        {refund.attendance.find(entry => moment(entry.date).isSame(date, 'day'))?.attnd_type || ''}
                                                    </Typography>
                                                    <Typography variant='subtitle2'>
                                                        {refund.attendance.find(entry => moment(entry.date).isSame(date, 'day'))?.note || ''}
                                                    </Typography>
                                                    <Typography variant='subtitle2'>
                                                        {refund.attendance.find(entry => moment(entry.date).isSame(date, 'day'))?.added_by ? `added by: ${refund.attendance.find(entry => moment(entry.date).isSame(date, 'day')).added_by}` : ''}
                                                    </Typography>
                                                    {/* <Typography variant='subtitle2'>
                                                        {refund.attendance.find(entry => moment(entry.date).isSame(date, 'day'))?.total_hours || '-'}
                                                    </Typography> */}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    )
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {RerfundData != '' && <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 30, 50]}
                    component="div"
                    count={RerfundData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />}
            </Box>
            {/* <Footer /> */}
        </div>
    );
}

export default ManageReports;