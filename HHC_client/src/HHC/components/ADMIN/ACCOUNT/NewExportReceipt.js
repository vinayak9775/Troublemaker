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
import TableCell from '@mui/material/TableCell'; // Add this import statement
import Footer from '../../../Footer';

const ExportReceipt = styled(Card)({
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

const NewExportReceipt = () => {

    const [hospitalType, setHospitalType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hospDataTable, setHospDataTable] = useState([]);
    const accessToken = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [hospitalData, setHospitalData] = useState([])

    const port = process.env.REACT_APP_API_KEY;

    const handleViewReport = async () => {
        setLoading(true); // Start loading
        try {
            let url = `${port}/hhc_account/Manage_Receipt/?`;

            if (startDate) {
                url += `start_date=${startDate}&`;
            }
            if (endDate) {
                url += `end_date=${endDate}&`;
            }
            if (hospitalType) {
                url += `hosp_id=${hospitalType}&`;
            }

            const res = await fetch(url.slice(0, -1), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log(res);
            const data = await res.json();
            setHospDataTable(data);
            setLoading(false);
            console.log("Consultant Data", data);
        } catch (error) {
            console.error("Error fetching Consultant Report Data:", error);
            setLoading(false);
        }
    };

    const handleDownloadExcel = async () => {
        try {
            let url = `${port}/hhc_account/Manage_Receipt/?`;

            if (startDate) {
                url += `start_date=${startDate}&`;
            }
            if (endDate) {
                url += `end_date=${endDate}&`;
            }
            if (hospitalType) {
                url += `hosp_id=${hospitalType}&`;
            }


            const res = await fetch(url.slice(0, -1), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            const renamedData = data.map(item => ({
                'Branch': item.Branch,
                'Payment Receipt No/Voucher No': item.Payment_Receipt_No,
                'Payment Receipt Date/ Vch date': item.Payment_Receipt_Date,
                'Bill No/Ref no.': item.Bill_No,
                'Customer Name': item.Customer_Name,
                'Amount': item.Amount,
                'Professional': item.Professional,
                'Bank/Cash': item.Bank_or_cash,
                'Cheque/DD/NEFT No.': item.Check_No,
                'Cheque/DD/NEFT Date': item.Cheque_Date,
                'Party Bank Name': item.Payment_Bank_Name,
                'Narration': item.Narration,
            }));

            const worksheet = XLSX.utils.json_to_sheet(renamedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Export Receipt Report");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), "export_reciept_report.xlsx");
        } catch (error) {
            console.error("Error fetching Enquiries Data:", error);
            setLoading(false);
        }
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
        <div style={{ marginBottom: '2em' }}>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ overflowX: 'auto' }}>

                        <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Export Receipt</Typography>

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
                            View Payments
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
                                <ExportReceipt style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Sr No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Branch</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Bill No/Ref no.</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Payment Receipt Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Customer Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Professional Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Amount</Typography>
                                    </CardContent>
                                    {/* <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Bank/Cash</Typography>
                                    </CardContent> */}
                                    {/* <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Cheque No.</Typography>
                                    </CardContent> */}
                                    {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Bank Name</Typography>
                                    </CardContent> */}
                                    {/* <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Narration</Typography>
                                    </CardContent> */}
                                </ExportReceipt>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {
                                loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : hospDataTable.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                            <Typography variant="subtitle1">No data found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    hospDataTable
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((hosp, index) => (
                                            <TableRow key={index}>
                                                <ExportReceipt style={{ height: '3rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{page * rowsPerPage + index + 1}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{hosp.Branch || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{hosp.Bill_No || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>
                                                            {hosp.Payment_Receipt_Date ? hosp.Payment_Receipt_Date.split(' ')[0] : '-'}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{hosp.Customer_Name || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{hosp.Professional || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{hosp.Amount || '-'}</Typography>
                                                    </CardContent>
                                                    {/* <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{hosp.Bank_or_cash || '-'}</Typography>
                                                    </CardContent> */}
                                                    {/* <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{hosp.Check_No || '-'}</Typography>
                                                    </CardContent> */}
                                                    {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{hosp.Payment_Bank_Name || '-'}</Typography>
                                                    </CardContent> */}
                                                    {/* <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>{hosp.Narration || '-'}</Typography>
                                            </CardContent> */}
                                                </ExportReceipt>
                                            </TableRow>
                                        )))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 30, 50]}
                    component="div"
                    count={hospDataTable.length}
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

export default NewExportReceipt;
