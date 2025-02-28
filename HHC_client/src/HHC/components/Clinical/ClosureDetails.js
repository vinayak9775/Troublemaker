import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
// import { Accordion, FormControl, AccordionDetails, AccordionSummary, Avatar, Button, CardContent, FormControlLabel, Grid, IconButton, Input, InputBase, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { useMediaQuery, CircularProgress,Grid, TextField, Box, Stack, Button, AppBar, InputBase, Menu, MenuItem, Modal, Card, CardContent, Typography, Table, TableHead, TableRow, TableBody, TableContainer, TablePagination, Tooltip, IconButton } from '@mui/material';
import { border, styled } from '@mui/system';
import Footer from '../../Footer';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import ClosureEvents from './ClosureEvents';

const customStyles = {
    "& .Mui-focused": {
        outline: 'none',
    },
};
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    pt: 2,
    px: 4,
    pb: 3,
};
const OngoingServiceCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "55px",
    borderRadius: '10px',
    transition: '0.5s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        // cursor: 'pointer',
    },
});

const ClosureDetails = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const accessHospitalID = localStorage.getItem('hospitalID') || 0;
    const [serviceRequest, setServiceRequest] = useState([]);
    const [requestAllocation, setRequestAllocation] = useState({});
    const [eventID, setEventID] = useState('');
    // const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [closureServices, setClosureServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tempStartDateTime, setTempStartDateTime] = useState('');
    const [tempEndDateTime, setTempEndDateTime] = useState('');


    // const filteredData = closureServices;

    const [tableHeight, setTableHeight] = useState('auto');

    useEffect(() => {
        const setDynamicHeight = () => {
            const screenHeight = window.innerHeight;
            var tableContainerHeight = screenHeight -
                setTableHeight(tableContainerHeight + 'px');
        };
        setDynamicHeight();
        window.addEventListener('resize', setDynamicHeight);
        return () => {
            window.removeEventListener('resize', setDynamicHeight);
        };
    }, []);


    useEffect(() => {
        getOngoingServices();
    }, [])

    const getOngoingServices = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${port}/medical/datewise_job_closure/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            console.log("Ongoing Services Data.........", data);
            if (data.msg === 'data not foundf') {
                setClosureServices([]);
            } else {
                setClosureServices(data);
            }
        setPage(0);
        } catch (error) {
            console.error("Error fetching Ongoing Services Data:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = () => {
        if (tempStartDateTime && tempEndDateTime) {
            getOngoingServicesDateWise(tempStartDateTime, tempEndDateTime);
        }
        else{
            getOngoingServices()
        }
    }


    const getOngoingServicesDateWise = async (fromdate, todate) => {
        setLoading(true);
        try {
            const res = await fetch(`${port}/medical/datewise_job_closure/${fromdate}/${todate}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            console.log("datewise Services Data.........", data);
            if (data.msg === 'data not foundf') {
                setClosureServices([]);
            } else {
                setClosureServices(data);
            }
        setPage(0);

        } catch (error) {
            console.error("Error fetching Ongoing Services Data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = Array.isArray(closureServices) ? closureServices : [];


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    //closure event Modal functionality
    const [openEvent, setOpenEvent] = useState(false);
    // const handleOpenEvent = () => setOpenEvent(true);
    const handleCloseEvent = () => {
        handleSubmit();
        setOpenEvent(false);
    }

    const [events, setEvents] = useState([]);
    const [eid, seteid] = useState('')
    const handleEvent = async (id) => {
        setOpenEvent(true);
        seteid(id);
      try {
        const res = await fetch(`${port}/medical/event_wise_job_clouser_dtls/${id}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        console.log("closure Data.........", data);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching Manage Professional Profile Data:", error);
        setLoading(false);
        setEvents('');
      }
  
    }
    const handleReset = () =>{
        setTempStartDateTime('');
        setTempEndDateTime('');
        getOngoingServices();
    }

    return (
        <>
            <Box sx={{ flexGrow: 1, mt:-1.8, ml: 1, mr: 1, mb: 2 }} >
                <Stack spacing={1} direction={'row'} sx={{ pt: 1 }}>
                    <Typography style={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>CLOSURE DETAILS</Typography>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, mr: 1, flex: 1 }}
                            type='date'
                            value={tempStartDateTime}
                            onChange={event => setTempStartDateTime(event.target.value)}
                        />
                    </Box>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, mr: 1, flex: 1 }}
                            type='date'
                            value={tempEndDateTime}
                            onChange={event => setTempEndDateTime(event.target.value)}
                        />
                    </Box>

                    <Button
                        variant='contained'
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ textTransform: "capitalize", height: "40px", borderRadius: "8px", width: "12ch" }}>Submit</Button>
                    <Button
                        variant='outlined'
                        onClick={handleReset} 
                        sx={{ textTransform: "capitalize", height: "40px", borderRadius: "8px", width: "12ch" }}>Reset</Button>
                </Stack>

                <TableContainer
                    style={{ height: tableHeight }}
                    sx={{ height: filteredData.length === 0 || filteredData.length < 5 ? "60vh" : "default" }}
                >
                    <Table>
                        <TableHead >
                            <TableRow >
                                <OngoingServiceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }} >
                                        <Typography variant='subtitle2' textAlign="center">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2' textAlign="center">Event Code</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2' textAlign="center">Patient Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Caller No</Typography>
                                    </CardContent>
                                    {/* <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Professional</Typography>
                                    </CardContent> */}
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Service Name</Typography>
                                    </CardContent >
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Start Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>End Date</Typography>
                                    </CardContent>
                                    {/* <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Payment Status</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Job Closure</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Added by</Typography>
                                    </CardContent> */}
                                    {/* <CardContent style={{ width: "5%", borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Status</Typography>
                                    </CardContent> */}
                                    <CardContent style={{ flex: 1 }}>
                                        <Typography variant='subtitle2'>Action</Typography>
                                    </CardContent>
                                </OngoingServiceCard>
                            </TableRow>
                        </TableHead>
                        {loading ? (
                            <Box sx={{ display: 'flex', mt: 20, ml: 80, height: '130px', }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <CardContent >
                                            <Typography variant="body2">
                                                No Data Available
                                            </Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <OngoingServiceCard style={{ height: "60px", }}>
                                                    <CardContent style={{ flex: 0.5, }}>
                                                        <Typography variant="body2">
                                                            {index + 1 + page * rowsPerPage}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 2 }}>
                                                        <Typography variant="body2" textAlign="center">
                                                            {row.event_code}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 2 }}>
                                                        <Typography variant="body2" textAlign="center">
                                                            {row.pt_name}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5 }}>
                                                        <Typography variant="body2" textAlign="center">
                                                            {row.cl_no}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 2 }}>
                                                        <Typography variant="body2" textAlign="center">
                                                            {row.srv_name}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2" textAlign="center">
                                                            {row.srv_start_date}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2" textAlign="center">
                                                            {row.srv_end_date}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2" textAlign="center">
                                                            <RemoveRedEyeIcon onClick={() => handleEvent(row.eve_id)}/>
                                                        </Typography>
                                                    </CardContent>

                                                </OngoingServiceCard>
                                            </TableRow>
                                        )))}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Grid container spacing={1}>

                    <Grid item xs={12}>
                        <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>

                            <Modal
                                open={openEvent}
                                onClose={handleCloseEvent}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{ ...style, width: 1150, borderRadius: "10px" }}>

                                    <AppBar position="static" style={{
                                        background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                        width: '75.88rem',
                                        height: '3rem',
                                        marginTop: '-16px',
                                        marginBottom: '1rem',
                                        marginLeft: "-32px",
                                        borderRadius: "8px 10px 0 0",
                                    }}>
                                        <div style={{ display: "flex" }}>
                                            <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px" }}>EVENT DETAILS</Typography>
                                            <Button onClick={handleCloseEvent} sx={{ marginLeft: "62rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                                        </div>
                                    </AppBar>
                                    <ClosureEvents events={events} handleEvent={handleEvent} eid={eid} handleSubmit={handleSubmit}/>
                                </Box>
                            </Modal>
                        </Card>
                    </Grid>
                </Grid>
            </Box >
            <Footer />
        </>
    )
}
export default ClosureDetails
