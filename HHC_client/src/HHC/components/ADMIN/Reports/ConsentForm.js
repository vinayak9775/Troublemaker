import React, { useEffect, useState } from 'react';
import HRNavbar from '../../HR/HRNavbar';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import { TextField, Button, TablePagination, Modal } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CardContent from '@mui/material/CardContent';
import { Container, styled } from '@mui/system';
import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { TableCell } from '@mui/material';
import Footer from '../../../Footer';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GetAppIcon from '@mui/icons-material/GetApp';


const ConsentCards = styled(Card)({
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


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    pt: 2,
    px: 4,
    pb: 3,
};

const ConsentForm = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [RerfundData, setRerfundData] = useState([]);
    const accessToken = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const port = process.env.REACT_APP_API_KEY;

    const handleViewReport = async () => {
        setLoading(true); // Start loading
        try {
            let url = `${port}/hhc_repo/consent_report/?`;

            if (startDate) {
                url += `st_date=${startDate}&`;
            }
            if (endDate) {
                url += `ed_date=${endDate}&`;
            }

            const res = await fetch(url.slice(0, -1), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(res);
            const data = await res.json();
            setRerfundData(data.Record);
            setLoading(false);
            console.log("Data from Consent....", data.Record);
        } catch (error) {
            console.error("Error fetching Enquiries Data:", error);
            setLoading(false);
        }
    };

    const handleDownloadExcel = async () => {
        try {
            let url = `${port}/hhc_repo/consent_report/?`;

            if (startDate) {
                url += `st_date=${startDate}&`;
            }
            if (endDate) {
                url += `ed_date=${endDate}&`;
            }

            const res = await fetch(url.slice(0, -1), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();

            const renamedData = data.Record.map(item => ({
                'Event ID': item.eve,
                'Caller No.': item.caller_number,
                'Patient Name': item.patient_name,
                'Patient Number': item.patient_number,
                'Service': item.srv_id,
                'Sub Servie': item.sub_srv_id,
                'Added Date': item.added_date
            }));

            const worksheet = XLSX.utils.json_to_sheet(renamedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Consent Report");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            saveAs(blob, "consent_report.xlsx");
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


    const [openCaller, setOpenCaller] = useState(false);

    const handleOpenCaller = () => setOpenCaller(true);

    const handleCloseCaller = () => setOpenCaller(false);

    const [data, setData] = useState([]);

    //   useEffect(() => {
    const fetchDocumentData = async (id) => {
        try {
            const response = await fetch(`${port}/hhc_repo/consent_doc_sign_View/${id}/`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
            handleOpenCaller()
        } catch (error) {
            console.error('There was an error fetching the data!', error);
        }
    };

    //     fetchDocumentData();
    //   }, [id]);

    const handleFileClick = (fileUrl) => {
        // Open the document in a new tab
        window.open(fileUrl, '_blank');
    };

    // #####################################################
    // Function to get file extension
    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    // Function to render file preview based on extension
    const renderFilePreview = (doc) => {
        const extension = getFileExtension(doc.file);

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return (
                    <img
                        key={doc.ds_id}
                        src={doc.file}
                        alt={`Document ${doc.ds_id}`}
                        onClick={() => handleFileClick(doc.file)}
                        style={{ cursor: 'pointer', maxWidth: '100%', marginTop: '10px' }}
                    />
                );
            case 'pdf':
                return (
                    <Box key={doc.ds_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                    <Button
                        onClick={() => handleFileClick(doc.file)}
                        startIcon={<PictureAsPdfIcon />}
                        style={{ display: 'block', marginBottom: '5px' }}
                    >
                        View PDF
                    </Button>
                    {/* <Button
                        href={doc.file}
                        target="_blank"
                        download
                        startIcon={<GetAppIcon />}
                        style={{ display: 'block' }}
                    >
                        Download PDF
                    </Button> */}
                </Box>
                );
            case 'xlsx':
            case 'csv':
                return (
                    <Button
                        key={doc.ds_id}
                        onClick={() => handleFileClick(doc.file)}
                        startIcon={<DescriptionIcon />}
                        style={{ display: 'block', marginTop: '10px' }}
                    >
                        Download {extension.toUpperCase()}
                    </Button>
                );
            default:
                return (
                    <Button
                        key={doc.ds_id}
                        onClick={() => handleFileClick(doc.file)}
                        startIcon={<InsertDriveFileIcon />}
                        style={{ display: 'block', marginTop: '10px' }}
                    >
                        Download File
                    </Button>
                );
        }
    };

    return (
        <div style={{ marginBottom: '2em' }}>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ overflowX: 'auto' }}>
                        {/* <Box sx={{ mb: 1, width: 300, marginLeft: '1rem' }}>
                            <TextField
                                select
                                label="Select refundital Name"
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
                                value={refunditalType}
                                onChange={(e) => setrefunditalType(e.target.value)}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: '100px',
                                            overflowY: 'auto'
                                        }
                                    }
                                }}
                            >
                                {refunditalData.map((item, index) => (
                                    <MenuItem key={item.refund_id} value={item.refund_id}>
                                        {item.refundital_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box> */}

                        <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Consent Report</Typography>

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

                        <FileDownloadOutlinedIcon
                            onClick={handleDownloadExcel}
                        />
                    </Stack>
                </Box>

                <TableContainer sx={{ ml: 1, mr: 1 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <ConsentCards style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Sr No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Event ID</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Patient Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Patient No.</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Service</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Sub Servie</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Added Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>view</Typography>
                                    </CardContent>
                                </ConsentCards>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ?
                                (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" style={{ height: '50vh' }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : RerfundData.length === 0 ? (
                                    <TableRow style={{ height: '50vh' }}>
                                        <CardContent colSpan={5} align="center">No data found</CardContent>
                                    </TableRow>
                                ) : (
                                    RerfundData
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((refund, index) => (
                                            <TableRow key={index} >
                                                <ConsentCards style={{ height: '3.3rem', background: "white", color: "rgba(0, 0, 0, 0.87)", fontWeight: "100", borderRadius: "8px 10px 8px 8px" }}>
                                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{page * rowsPerPage + index + 1}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{refund.eve || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{refund.patient_name || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{refund.patient_number || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{refund.srv_id || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{refund.sub_srv_id || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2'>{refund.added_date.split(' ')[0] || '-'}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                        <Typography variant='subtitle2' onClick={() => fetchDocumentData(refund.eve)}><RemoveRedEyeIcon /></Typography>
                                                    </CardContent>
                                                </ConsentCards>
                                            </TableRow>
                                        ))
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 30, 50]}
                    component="div"
                    count={RerfundData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Grid container spacing={1}>

                    <Grid item xs={12}>
                        <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>

                            <Modal
                                open={openCaller}
                                onClose={handleCloseCaller}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{ ...style, width: 1000, borderRadius: "10px" }}>

                                    <AppBar position="static" style={{
                                        background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                        width: '66.5rem',
                                        height: '3rem',
                                        marginTop: '-16px',
                                        marginBottom: '1rem',
                                        marginLeft: "-32px",
                                        borderRadius: "8px 10px 0 0",
                                    }}>
                                        <div style={{ display: "flex" }}>
                                            <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px" }}>Discharge Summary Documents</Typography>
                                            <Button onClick={handleCloseCaller} sx={{ marginLeft: "46rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                        </div>
                                    </AppBar>
                                    <Grid container spacing={2} sx={{mb:'20px'}}>
                                    {data.map((item) => (
                                        <Grid item xs={12} sm={6} md={4} key={item.con_id}>
                                            <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <CardContent style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              
                                                    <Typography variant="h6" gutterBottom>
                                                        Event ID: {item.eve_id}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                                        Signature:
                                                    </Typography>
                                                    <img
                                                        src={item.sign}
                                                        alt={`Signature for Event ${item.eve_id}`}
                                                        onClick={() => handleFileClick(item.sign)}
                                                        style={{ cursor: 'pointer', maxWidth: '100px', marginBottom: '10px' ,maxHeight:'50px'}}
                                                    />

                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                    </Grid>

                                    {/* <Box>
                                    <Typography variant='h6'>Discharge Summary Documents</Typography>
                                    </Box> */}
                                    
                                    <Grid container spacing={2}>
        {data.map((item) => (
            <React.Fragment key={item.con_id}>
                {item.Discharge_summ_docs.map((doc) => (
                    <Grid item xs={12} sm={6} md={4} key={doc.ds_id}>
                        <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <CardContent style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Event ID: {item.eve_id}
                                </Typography>
                                {renderFilePreview(doc)}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </React.Fragment>
        ))}
    </Grid>
                                </Box>
                            </Modal>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </div>
    );
}

export default ConsentForm;
