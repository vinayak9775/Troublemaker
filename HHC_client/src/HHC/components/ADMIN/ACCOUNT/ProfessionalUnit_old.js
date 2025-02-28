import React, { useEffect, useState } from 'react';
import HRNavbar from '../../HR/HRNavbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Button, TablePagination } from '@mui/material';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton'; // If you are using MUI v5
import { Modal } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { TableCell } from '@mui/material';
import Footer from '../../../Footer';

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
        cursor: 'pointer',
    },
    fontWeight: "200"
});

const ProfessionalUnit = () => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hospDataTable, setHospDataTable] = useState([]);
    const accessToken = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    console.log(accessToken);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const port = process.env.REACT_APP_API_KEY;

    ///// view Modal Open
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedProfId, setSelectedProfId] = useState(null); ///// prof ID

    const handleViewModalOpen = (profId) => {
        setSelectedProfId(profId); ///// prof ID
        setIsViewModalOpen(true);
    };

    const handleModalClose = () => {
        setIsViewModalOpen(false);
    };

    ///// view Modal Close
    const handleViewReport = async () => {
        setLoading(true); // Start loading
        try {
            let url = `${port}/hhc_account/Manage_professional_unit_report/?`;

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

            const responseData = await res.json();

            if (Array.isArray(responseData)) {
                console.log("Fetched data:", responseData);

                // Update state with fetched data
                setHospDataTable(responseData);
                setLoading(false);
            } else {
                // Log error if data is not an array
                console.error("Data fetched is not an array:", responseData);
                setLoading(false);
            }
        } catch (error) {
            // Log and handle fetch error
            console.error("Error fetching Consultant Report Data:", error);
            setLoading(false);
        }
    };

    const [profData, setProfData] = useState([]);
    console.log(profData, 'jjdwdjdwddwjdij');

    /// id wise data fetch
    useEffect(() => {
        const fetchProfId = async () => {
            try {
                const url = `${port}/hhc_account/View_professional_unit_report/${selectedProfId}/${startDate}/${endDate}/`;
                const res = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                const responseData = await res.json();
                console.log('Additional data:', responseData);

                // Store the fetched additional data in the state
                setProfData(responseData);
            } catch (error) {
                console.error('Error fetching additional data:', error);
            }
        };
        fetchProfId();
    }, [selectedProfId])

    const downloadExcelSheetprofID = (prof_id) => {
        // Get the professional corresponding to the prof_id
        const professional = hospDataTable.find(professional => professional.prof_id === prof_id);
    
        if (!professional) {
            console.error('Professional not found');
            return;
        }
    
        // Get the current date and time
        const currentDate = new Date();
        const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
    
        const profName = professional.Prof_name || 'Unknown';
    
        // Update the professional name in the table header
        const professionalNameElement = document.getElementById('professionalName');
        professionalNameElement.textContent = `Details Of Professional: ${profName}`;
    
        // Insert the current date and time into the table
        const printOnElement = document.querySelector('#hospitalData th[colspan="9"] span#printTime');
        printOnElement.textContent = formattedDate;
    
        // Show the hospital data div to make it visible for export
        const hospitalDataElement = document.getElementById('hospitalData');
        hospitalDataElement.style.display = 'block';
    
        // Extract the first table
        const table1 = hospitalDataElement.querySelector('table:nth-of-type(1)');
        const worksheet1 = XLSX.utils.table_to_sheet(table1);
    
        // Extract the second table
        const table2 = hospitalDataElement.querySelector('table:nth-of-type(2)');
        const worksheet2 = XLSX.utils.table_to_sheet(table2);
    
        // Create a new workbook and append the first worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet1, 'hospital Data');
    
        // Append an empty row to create a gap
        XLSX.utils.sheet_add_aoa(worksheet1, [[]], { origin: -1 });
    
        // Append the second worksheet to the first one
        XLSX.utils.sheet_add_json(worksheet1, XLSX.utils.sheet_to_json(worksheet2, { header: 1 }), { skipHeader: true, origin: -1 });
    
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
        // Construct the filename with "Doctor" and the professional name
        const filename = `Doctor.${profName}.${formattedDate}.xlsx`;
    
        // Save the Excel file with the constructed filename
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), filename);
    
        // Restore the original content after downloading
        professionalNameElement.textContent = 'Details Of Professional:';
        printOnElement.textContent = '';
    
        // Hide the hospital data div again after export
        hospitalDataElement.style.display = 'none';
    };
    

    // const downloadExcelSheetprofID = async () => {
    //     try {
    //         // Fetch additional data based on the selected professional ID
    //         const fetchUrl = `${port}/hhc_account/View_professional_unit_report/${selectedProfId}/`;
    //         const res = await fetch(fetchUrl, {
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //         const responseData = await res.json();
    //         console.log('Response Data:', responseData); // Log responseData

    //         // Check if responseData contains the necessary arrays
    //         if (Array.isArray(responseData.details_prof) && responseData.prof_cost_dtl) {
    //             // Extract the arrays from responseData
    //             const detailsProfArray = responseData.details_prof;
    //             const profCostDtlArray = [responseData.prof_cost_dtl]; // Convert object to array

    //             // Define header mappings for renaming
    //             const detailsProfHeaderMapping = {
    //                 'Voucher_Date': 'Voucher Date',
    //                 'Party_Name': 'Party Name',
    //                 'Stock_Item': 'Stock Item',
    //                 'QTY': 'QTY',
    //                 'Prof_Cost': 'Prof Cost',
    //                 'Prof_Total_Cost': 'Prof Total Cost',
    //                 'Start_Date': 'Start Date',
    //                 'End Date': 'End Date',
    //                 'UOM': 'UOM',
    //             };

    //             // Convert the arrays to Excel format with renamed headers
    //             const wsDetailsProf = XLSX.utils.json_to_sheet(detailsProfArray.map(obj => {
    //                 const newObj = {};
    //                 for (const key in obj) {
    //                     if (detailsProfHeaderMapping[key]) {
    //                         newObj[detailsProfHeaderMapping[key]] = obj[key];
    //                     }
    //                 }
    //                 return newObj;
    //             }));

    //             const wsProfCostDtl = XLSX.utils.json_to_sheet(profCostDtlArray);

    //             // Create a new workbook
    //             const wb = XLSX.utils.book_new();

    //             // Append sheets to the workbook
    //             XLSX.utils.book_append_sheet(wb, wsDetailsProf, 'Details Professional');
    //             XLSX.utils.book_append_sheet(wb, wsProfCostDtl, 'Professional Cost Detail');

    //             // Generate a file buffer from the workbook
    //             const excelBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });

    //             // Convert the file buffer to a Blob
    //             const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    //             // Generate a download link for the Blob and trigger download
    //             const downloadUrl = window.URL.createObjectURL(excelBlob);
    //             const link = document.createElement('a');
    //             link.href = downloadUrl;
    //             link.setAttribute('download', 'Professional_Unit_Report.xlsx');
    //             document.body.appendChild(link);
    //             link.click();
    //         } else {
    //             console.error('Invalid response data format:', responseData);
    //         }
    //     } catch (error) {
    //         console.error('Error downloading Excel sheet:', error);
    //     }
    // };

    // id wise modal

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // modal table pagination
    const [pageModal, setPageModal] = useState(0);
    const [rowsPerPageModal, setRowsPerPageModal] = useState(3);

    const handleChangePageModal = (event, newPage) => {
        setPageModal(newPage);
    };

    const handleChangeRowsPerPageModal = (event) => {
        setRowsPerPageModal(parseInt(event.target.value, 10));
        setPageModal(0);
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

                        <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Professional Unit</Typography>

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

                        {/* <FileDownloadOutlinedIcon
                            onClick={() => {
                                handleDownloadExcel();
                            }}
                        /> */}
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
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Prof. Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Email</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Service</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Mobile No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Unit</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>prof ID</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Action</Typography>
                                    </CardContent>
                                </InvoiceCard>
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
                                hospDataTable.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                            <Typography variant="subtitle1">No data found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) :
                                    (
                                        hospDataTable
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((UnitProfessional, index) => (
                                                <TableRow key={index}>
                                                    <InvoiceCard style={{ height: '3rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{index + 1}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{UnitProfessional.Prof_name || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{UnitProfessional.email || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{UnitProfessional.Service || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{UnitProfessional.mobile || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{UnitProfessional.unit || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                            <Typography variant='subtitle2'>{UnitProfessional.prof_id || '-'}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                            <IconButton onClick={() => handleViewModalOpen(UnitProfessional.prof_id)}>
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                            <IconButton onClick={() => downloadExcelSheetprofID(UnitProfessional.prof_id)}>
                                                                <FileDownloadOutlinedIcon />
                                                            </IconButton>
                                                        </CardContent>
                                                    </InvoiceCard>
                                                </TableRow>
                                            ))
                                    )}
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

            <Modal
                open={isViewModalOpen}
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
                        width: '100%',
                        maxWidth: '90vw',
                        height: 'auto',
                        maxHeight: '90vh',
                        backgroundColor: 'White',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        padding: '10px',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', px: '10px' }}>
                        <Typography variant="h6" component="h4" sx={{ flexGrow: 1 }}>
                            Details Of Professional Unit
                        </Typography>
                        <IconButton onClick={handleModalClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <TableContainer sx={{ ml: 1, mr: 1 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <InvoiceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Sr No</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Voucher Date</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Party Name</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>QTY</Typography>
                                        </CardContent>
                                        {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Rate</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Amount</Typography>
                                        </CardContent> */}
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Prof Cost</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Prof Total Cost</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Start Date</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>End Date</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>UOM</Typography>
                                        </CardContent>
                                    </InvoiceCard>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {profData && profData.details_prof && profData.details_prof
                                    .slice(pageModal * rowsPerPageModal, pageModal * rowsPerPageModal + rowsPerPageModal)
                                    .map((item, index) => (
                                        <TableRow key={index}>
                                            <InvoiceCard style={{ height: '4rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{index + 1}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{item.Voucher_Date || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{item.Party_Name || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{item.QTY || '-'}</Typography>
                                                </CardContent>
                                                {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{item.Rate || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{item.Amount || '-'}</Typography>
                                                </CardContent> */}
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{item.Prof_Cost || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{item.Prof_Total_Cost || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{item.Start_Date || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{item['End Date'] || '-'}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                    <Typography variant='subtitle2'>{item.UOM || '-'}</Typography>
                                                </CardContent>
                                            </InvoiceCard>
                                        </TableRow>
                                    ))}
                            </TableBody>

                            <TablePagination
                                rowsPerPageOptions={[3, 5, 10, 25]}
                                component="div"
                                count={profData && profData.details_prof ? profData.details_prof.length : 0}
                                rowsPerPage={rowsPerPageModal}
                                page={pageModal}
                                onPageChange={handleChangePageModal}
                                onRowsPerPageChange={handleChangeRowsPerPageModal}
                            />
                        </Table>

                        {/* //// second table data */}
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <InvoiceCard style={{ background: "rgba(105, 165, 235, 0.87)", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Sr No</Typography>
                                        </CardContent>
                                        {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Total (Spero Cost)</Typography>
                                        </CardContent> */}
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Total (Prof. Cost)</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>TDS 10 %</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Gross Total</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Conveyance</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Approne</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Police Varification</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Net Amount</Typography>
                                        </CardContent>
                                    </InvoiceCard>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {profData && profData.prof_cost_dtl &&
                                    <TableRow>
                                        <InvoiceCard style={{ height: '4rem', background: "white", color: "rgba(0, 0, 0, 0.97)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>1</Typography>
                                            </CardContent>
                                            {/* <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>{profData.prof_cost_dtl.Total_Spero_Cost || '-'}</Typography>
                                            </CardContent> */}
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>{profData.prof_cost_dtl.Total_Prof_Cost || '-'}</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>
                                                    {profData.prof_cost_dtl && profData.prof_cost_dtl['TDS_10_%'] ? profData.prof_cost_dtl['TDS_10_%'] : '-'}
                                                </Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>{profData.prof_cost_dtl.Gross_Total || '-'}</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>{profData.prof_cost_dtl.Conveyance || '-'}</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>{profData.prof_cost_dtl.Approne || '-'}</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>{profData.prof_cost_dtl.Police_Varification || '-'}</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>{profData.prof_cost_dtl.Net_Amount || '-'}</Typography>
                                            </CardContent>
                                        </InvoiceCard>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>

            <div className="table-responsive" id="hospitalData" style={{ display: "none" }}>
                <table border="1" className="table table-hover table-bordered" style={{ marginBottom: '30px' }}>
                    <thead>
                        <tr style={{ textAlign: 'right' }}>
                            <th colspan="9" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>Print on: <span id="printTime"></span></th>
                        </tr>
                        <tr style={{ textAlign: 'center' }}>
                            <th colSpan="9" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>Spero Healthcare Innovations Pvt. Ltd - 2024-2025</th>
                        </tr>
                        <tr style={{ textAlign: 'center' }}>
                            <th colSpan="9" style={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>Details Of Professional: {hospDataTable.length > 0 ? hospDataTable[0].Prof_name : ''}</th>
                        </tr>
                        <tr>
                            <th>Voucher Date</th>
                            <th>Party Name</th>
                            <th>Stock Item</th>
                            <th>QTY</th>
                            <th>Prof Cost</th>
                            <th>Prof Total Cost</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>UOM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profData.details_prof && profData.details_prof.map((item, index) => (
                            <tr key={index}>
                                <td>{item.Voucher_Date}</td>
                                <td>{item.Party_Name}</td>
                                <td>{item.Stock_Item}</td>
                                <td>{item.QTY}</td>
                                <td>{item.Prof_Cost}</td>
                                <td>{item.Prof_Total_Cost}</td>
                                <td>{item.Start_Date}</td>
                                <td>{item['End Date']}</td>
                                <td>{item.UOM}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <br />
                <br />
                <br />

                <table border="1" className="table table-hover table-bordered" style={{ marginBottom: '30px' }}>
                    <thead>
                        <tr>
                            <th>Total (Prof. Cost)</th>
                            <th>TDS 10 %</th>
                            <th>Gross Total</th>
                            <th>Conveyance</th>
                            <th>Approne</th>
                            <th>Police Varification</th>
                            <th>Net Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profData.prof_cost_dtl && (
                            <tr>
                                <td>{profData.prof_cost_dtl.Total_Prof_Cost}</td>
                                <td>{profData.prof_cost_dtl['TDS_10_%']}</td>
                                <td>{profData.prof_cost_dtl.Gross_Total}</td>
                                <td>{profData.prof_cost_dtl.Conveyance}</td>
                                <td>{profData.prof_cost_dtl.Approne}</td>
                                <td>{profData.prof_cost_dtl.Police_Varification}</td>
                                <td>{profData.prof_cost_dtl.Net_Amount}</td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            <Footer />
        </div>
    );
}

export default ProfessionalUnit;
