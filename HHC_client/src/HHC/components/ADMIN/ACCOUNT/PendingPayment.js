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

const PendingPayment = () => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentPatient, setPaymentPatient] = useState([]);
    const accessToken = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [hospitalType, setHospitalType] = useState('');
    const [hospitalData, setHospitalData] = useState([]);

    const port = process.env.REACT_APP_API_KEY;

    const handleViewReport = async () => {
        try {
            let url = `${port}/hhc_account/Service_Wise_Pending_Payment/`;

            if (startDate) {
                url += `${startDate}/`;
            }
            if (endDate) {
                url += `${endDate}/`;
            }
            if (hospitalType) {
                url += `${hospitalType}`;
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

    const handleDownloadExcel = async () => {
        try {
            let url = `${port}/hhc_account/Service_Wise_Pending_Payment/`;

            if (startDate) {
                url += `${startDate}/`;
            }
            if (endDate) {
                url += `${endDate}/`;
            }
            if (hospitalType) {
                url += `${hospitalType}`;
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
                'Event Code': item.event_code,
                'Discount Type': item.discount_type,
                'Discount In': item.discount_in,
                'Service': item.service,
                'Sub Service': item.sub_service,
                'Patient Name': item.agg_sp_pt_id,
                'Total Amount': item.Total_cost,
                'Discount Amount': item.final_amount,
                'Paid Amount': item.paid_amount,
            }));

            const worksheet = XLSX.utils.json_to_sheet(renamedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Export Day Print Details");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), "day_print_details.xlsx");
        } catch (error) {
            console.error("Error fetching Patient Data:", error);
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

    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ overflowX: 'auto' }}>
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
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Event Code</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Patient Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Service</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Sub Service</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Final Amount</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Total Cost</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Paid Amount</Typography>
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
                                    .map((pendingPayment, index) => (
                                        <TableRow key={index}>
                                            <PaymentPatientCard style={{ height: '3rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{pendingPayment.event_code || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{pendingPayment.agg_sp_pt_id || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{pendingPayment.service || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{pendingPayment.sub_service || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{pendingPayment.final_amount || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{pendingPayment.Total_cost || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{pendingPayment.paid_amount || '-'}</Typography>
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
            </Box>
        </div>
    );
}

export default PendingPayment;
