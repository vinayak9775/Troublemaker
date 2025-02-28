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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TableCell from '@mui/material/TableCell'; // Add this import statement
import CircularProgress from '@mui/material/CircularProgress';
import Footer from '../../../Footer'

const InvoiceCard = styled(Card)({
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
    },
    fontWeight: "200"
});

const ExportInvoice = () => {

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

    const handleViewReport = async () => {
        setLoading(true); // Start loading
        try {
            let url = `${port}/hhc_account/Accout_invoice_api/2/`;

            if (startDate) {
                url += `${startDate}/`;
            }
            if (endDate) {
                url += `${endDate}/`;
            }
            if (hospitalType) {
                url += `${hospitalType}/`;
            }
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log(res);
            const responseData = await res.json();

            if (Array.isArray(responseData.data)) {
                console.log("Fetched data:", responseData.data);

                // Update state with fetched data
                setHospDataTable(responseData.data);
                setLoading(false);
            } else {
                // Log error if data is not an array
                console.error("Data fetched is not an array:", responseData.data);
                setLoading(false);
            }
        } catch (error) {
            // Log and handle fetch error
            console.error("Error fetching Consultant Report Data:", error);
            setLoading(false);
        }
    };

    const handleDownloadExcel = async () => {
        try {
            let url = `${port}/hhc_account/Accout_invoice_api/2/`;

            if (startDate) {
                url += `${startDate}/`;
            }
            if (endDate) {
                url += `${endDate}/`;
            }
            if (hospitalType) {
                url += `${hospitalType}/`;
            }
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log(res); // Log the response

            const responseData = await res.json();
            console.log(responseData); // Log the responseData

            // Check if responseData.data is an array
            if (Array.isArray(responseData.data)) {
                const worksheetData = responseData.data.map(item => ({
                    'Branch': item.Branch,
                    'Voucher Number/Bill No': item.voucher_number,
                    'Voucher Type': item.Voucher_Type,
                    'Voucher Date': item.Voucher_Date,
                    'Voucher Ref': item.Voucher_Ref,
                    'Party Name': item.Party_Name,
                    'Address 1': item.Address_1,
                    'Address 2': item.Address_2,
                    'Address 3 / Phone No.': item['Address3/Phone_No.'],
                    'Stock Item': item.Stock_Item,
                    'Qty': item.Qty,
                    'Rate': item.Rate,
                    'Amount': item.Amount,
                    'From Date': item.From_Date,
                    'To Date': item.To_Date,
                    'Name OF Professional': item.Name_OF_Professional,
                    'Narration': item.Narration,
                    'UOM': item.UOM,
                    'Category': item.Category,
                }));

                console.log(worksheetData); // Log the worksheetData

                const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                console.log(worksheet); // Log the worksheet

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice Report");
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), "Invoice_report.xlsx");
            } else {
                // Handle the case when responseData.data is not an array
                console.error("Error: responseData.data is not an array");
            }
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

    return (
        <div style={{ marginBottom: '2em' }}>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ overflowX: 'auto' }}>

                        <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Export Invoice</Typography>

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
                                <InvoiceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Sr No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Branch</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Voucher No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Voucher Type</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Voucher Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>UOM</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 4, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Sub Service</Typography>
                                    </CardContent>
                                </InvoiceCard>
                            </TableRow>
                        </TableHead>

                        {/* <TableBody>
                            {hospDataTable.length === 0 ?
                                (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    hospDataTable
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((invoice, index) => (
                                            <TableRow key={index}>
                                                <InvoiceCard style={{ height: '3rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{index + 1}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{invoice.Branch || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{invoice.voucher_number || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{invoice.Voucher_Type || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{invoice.Voucher_Date || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{invoice.UOM || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{invoice.Stock_Item || '-'}</Typography>
                                                    </CardContent>
                                                </InvoiceCard>
                                            </TableRow>
                                        ))
                                )}
                        </TableBody> */}

                        <TableBody>
                            {loading ? ( // If loading is true, display the loader
                                <TableRow>
                                    <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : hospDataTable.length === 0 ? ( // If data is empty, display "No data found"
                                <TableRow>
                                    <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                        <Typography variant="subtitle1">No data found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                hospDataTable
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((invoice, index) => (
                                        <TableRow key={index}>
                                            <InvoiceCard style={{ height: '3rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2' >{page * rowsPerPage + index + 1}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{invoice.Branch || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{invoice.voucher_number || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{invoice.Voucher_Type || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{invoice.Voucher_Date || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{invoice.UOM || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 4, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2' style={{ textAlign: 'left' }}>{invoice.Stock_Item || '-'}</Typography>
                                                </CardContent>
                                            </InvoiceCard>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 30, 50]}
                            component="div"
                            count={hospDataTable.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Table>
                </TableContainer>

                <Footer />
            </Box>
        </div>
    );
}

export default ExportInvoice;
