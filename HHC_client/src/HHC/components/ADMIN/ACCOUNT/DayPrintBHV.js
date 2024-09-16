import React, { useEffect, useState } from 'react';
import HRNavbar from '../../HR/HRNavbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Button, TablePagination, TableCell, MenuItem, TextField } from '@mui/material';
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
import CircularProgress from '@mui/material/CircularProgress';

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

const DayPrintBHV = () => {

    const [startDate, setStartDate] = useState('');
    const [hospitalType, setHospitalType] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentPatient, setPaymentPatient] = useState([]);
    const accessToken = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [hospitalData, setHospitalData] = useState([])
    console.log(hospitalType);

    const port = process.env.REACT_APP_API_KEY;

    const handleViewReport = async () => {
        try {
            let url = `${port}/hr/DayPrint_api/?`;

            if (hospitalType) {
                url += `hosp_id=${hospitalType}&`;
            }
            if (startDate) {
                url += `start_date=${startDate}&`;
            }
            if (endDate) {
                url += `end_date=${endDate}`;
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
            setLoading(false);
            console.log("Day Print Data", data);
        } catch (error) {
            console.error("Error fetching dayprint Data:", error);
            setLoading(false);
        }
    };

    // const handleDownloadExcel = async () => {
    //     try {
    //         let url = `${port}/hr/DayPrint_api/?`;

    //         if (startDate) {
    //             url += `start_date=${startDate}&`;
    //         }
    //         if (endDate) {
    //             url += `end_date=${endDate}&`;
    //         }
    //         if (hospitalType) {
    //             url += `hosp_id=${hospitalType}`;
    //         }

    //         const res = await fetch(url, {
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (!res.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await res.json();

    //         const tableData = [
    //             ["Print on 20-04-2024 11:57:48 AM"],
    //             ["Spero Healthcare Innovations Pvt. Ltd - 2024-2025"],
    //             ["Spero Healthcare Innovations Pvt. Ltd - 2024-2025"],
    //             ['Date', 'Particulars', 'Vch Type', 'Vch No./Excise Inv.No.', 'Type', 'Debit']
    //         ];

    //         // Concatenate all the data into a single array
    //         const flattenedData = tableData.concat(data.map(item => [
    //             item.added_date,
    //             item.event_code,
    //             item.hhcid,
    //             item.amount_paid,
    //             item.mode,
    //             item.pay_recived_by,
    //         ]));

    //         const worksheet = XLSX.utils.aoa_to_sheet(flattenedData);
    //         const workbook = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(workbook, worksheet, "Export Day Print Details");
    //         const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //         saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), "day_print_details.xlsx");
    //     } catch (error) {
    //         console.error("Error fetching Patient Data:", error);
    //         setLoading(false);
    //     }
    // };

    const handleDownloadExcel = () => {
        // Get the current date and time
        const currentDate = new Date();
        const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

        // Insert the current date and time into the table
        const printOnElement = document.querySelector('#payment th[colspan="6"]');
        printOnElement.textContent = `Print on: ${formattedDate}`;

        // Convert the table to Excel
        const worksheet = XLSX.utils.table_to_sheet(document.getElementById('payment'));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Payment Data');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Construct the filename with "DayPrintList" and the current date
        const filename = `DayPrintList${formattedDate}.xlsx`;

        // Save the Excel file with the constructed filename
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), filename);

        // Restore the original content after downloading
        printOnElement.textContent = 'Print on:';
    };

    useEffect(() => {
        const ConsultantReport = async () => {
            try {
                const res = await fetch(`${port}/web/agg_hhc_hospitals_api`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(res);
                const data = await res.json();
                setHospitalData(data);
                console.log("Data from hospitalData", data);
            } catch (error) {
                console.error("Error fetching hospitalData Data:", error);
            }
        }
        ConsultantReport();
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div style={{ marginBottom: '2em' }}>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ overflowX: 'auto' }}>

                        <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Day Print</Typography>

                        <Box sx={{ mb: 1, width: 300, marginLeft: '1rem' }}>
                            <TextField
                                select
                                label="Select Hospital Name"
                                variant="outlined"
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
                                value={hospitalType}
                                onChange={(e) => setHospitalType(e.target.value)}
                                SelectProps={{
                                    MenuProps: {
                                        PaperProps: {
                                            style: {
                                                maxHeight: '200px', // Set the maximum height to 200px
                                                maxWidth: '200px'
                                            },
                                        },
                                        MenuListProps: {
                                            style: {
                                                maxHeight: '200px', // Set the maximum height to 200px
                                            },
                                        },
                                    },
                                }}
                            >
                                {hospitalData.map((item, index) => (
                                    <MenuItem key={item.hosp_id} value={item.hosp_id}>
                                        {item.hospital_name}
                                    </MenuItem>
                                ))}
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
                                        <Typography variant='subtitle2'>Event Code</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Hospital Code</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Amount Paid</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Payment Mode</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Payment Recieved By</Typography>
                                    </CardContent>
                                </PaymentPatientCard>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {paymentPatient.length === 0 && !loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body1">No data found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paymentPatient
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((dayprint, index) => (
                                        <TableRow key={index}>
                                            <PaymentPatientCard style={{ height: '3rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{page * rowsPerPage + index + 1}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{dayprint.patient_name || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{dayprint.event_code || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{dayprint.hhcid || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{dayprint.amount_paid || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{dayprint.mode || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{dayprint.pay_recived_by || '-'}</Typography>
                                                </CardContent>
                                            </PaymentPatientCard>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 30, 50]}
                    component="div"
                    count={paymentPatient.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <div className="table-responsive" id="payment" style={{ display: 'none' }}>
                    <table border="1" className="table table-hover table-bordered" style={{ marginBottom: '30px' }}>
                        <thead>
                            <tr style={{ textAlign: 'right' }}>
                                <th colspan="6" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>Print on: <span id="printTime"></span></th>
                            </tr>
                            <tr style={{ textAlign: 'center' }}>
                                <th colSpan="6" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>Spero Healthcare Innovations Pvt. Ltd - 2024-2025</th>
                            </tr>
                            <tr style={{ textAlign: 'center' }}>
                                <th colSpan="6" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>Cash - Service {paymentPatient.length > 0 ? paymentPatient[0].hhcid : ''}</th>
                            </tr>
                            <tr style={{ textAlign: 'center' }}>
                                <th colSpan="6" style={{ whiteSpace: 'pre-wrap' }}>Cash - In - hand</th>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <th>Particulars</th>
                                <th>Vch Type</th>
                                <th>Vch No./Excise Inv.No.</th>
                                <th>Type</th>
                                <th>Debit</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" align="center">
                                        <CircularProgress />
                                    </td>
                                </tr>
                            ) : paymentPatient.length === 0 ? (
                                <tr>
                                    <td colSpan="6" align="center">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                paymentPatient.map(item => (
                                    <tr key={item.pay_dt_id}>
                                        <td>{item.added_date}</td>
                                        <td>
                                            {item.patient_name && item.patient_name.split("\n").map((name, index) => (
                                                <div key={index}>{name}</div>
                                            ))}
                                        </td>
                                        <td>{item.mode}</td>
                                        <td>{item.invoice}</td>
                                        <td>{item.mode}</td>
                                        <td>{item.amount_paid}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}

export default DayPrintBHV;
