import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Tooltip, IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Footer from '../../../Footer';
import HRNavbar from '../HRNavbar';

const AttendenceCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "52px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        cursor: 'pointer',
    },
});

const Attendence = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [enq, setEnq] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const [loading, setLoading] = useState(true);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        const getEnquires = async () => {
            try {
                const res = await fetch(`${port}/web/Follow_Up_combined_table`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                console.log("Manage Professional Profile Data.........", data);
                if (data.detail === "No matching records found") {
                    setEnq([]);
                } else {
                    setEnq(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching Manage Professional Profile Data:", error);
                setLoading(false);
            }
        };
        getEnquires();
    }, []);
    return (
        <>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, mt: 1, ml: 1, mr: 1, }}>
                <Stack direction={isSmallScreen ? 'column' : 'row'}
                    spacing={1}
                    alignItems={isSmallScreen ? 'center' : 'flex-start'}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>PROFESSIONAL ATTENDENCE</Typography>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 260, height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <IconButton type="button" sx={{ color: "#69A5EB", height: "36px", width: "36px" }}>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, }}
                            placeholder="Search Professional |"
                            inputProps={{ 'aria-label': 'select service' }}
                        // value={selectedService}
                        // onChange={handleServiceChange}
                        />
                    </Box>
                    {/* <Link to="/add-prof" style={{ textDecoration: 'none' }}>
                        <Button variant='contained' sx={{ background: "#69A5EB", textTransform: "capitalize", height: "40px", borderRadius: "8px" }}><PersonAddAltOutlinedIcon sx={{ mr: 1, fontSize: "18px" }} />Add New Professional</Button>
                    </Link> */}
                </Stack >

                <TableContainer sx={{ height: "63vh" }}>
                    <Table >
                        <TableHead>
                            <TableRow >
                                <AttendenceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.8, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Role</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Contact No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Employee Type</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Schedule Date & Time</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Mode of Interview</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Interviewer Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1 }}>
                                        <Typography variant="subtitle2">Status</Typography>
                                    </CardContent>
                                </AttendenceCard>
                            </TableRow>
                        </TableHead>
                        {loading ? (
                            <Box sx={{ display: 'flex', mt: 15, ml: 80, height: '100px', }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableBody>
                                {enq.length === 0 ? (
                                    <TableRow>
                                        <CardContent >
                                            <Typography variant="body2">
                                                No Data Available
                                            </Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    enq.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow
                                                key={row.eve_id}
                                                value={row.eve_id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                                            >
                                                <AttendenceCard>
                                                    <CardContent style={{ flex: 0.5 }}>
                                                        <Typography variant="body2">
                                                            {index + 1 + page * rowsPerPage}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5 }}>
                                                        <Typography variant="body2">
                                                            {/* {row.pt_id.name} */}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.8 }}>
                                                        <Typography variant="body2">
                                                            {row.srv_id[0].srv_id.service_title}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2">
                                                            {/* <PhoneOutlinedIcon sx={{ fontSize: "16px", color: "#69A5EB", }} /> +91 {row.pt_id.phone_no} */}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2">
                                                            {/* {row.pt_id.prof_zone_id.Name} */}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5 }}>
                                                        {/* <div style={{ display: "flex", }}>
                          <CalendarMonthOutlinedIcon sx={{ color: "#69A5EB", fontSize: "18px" }} />
                        </div> */}
                                                        {/* {row.pt_id.Suffered_from} */}
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2">
                                                            {/* {row.pt_id.name} */}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5 }}>
                                                        <Typography variant="body2">
                                                            {/* {row.pt_id.name} */}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2">
                                                            <RemoveRedEyeOutlinedIcon sx={{ fontSize: "20px", mt: 2 }} />
                                                        </Typography>
                                                    </CardContent>
                                                </AttendenceCard>
                                            </TableRow>
                                        )
                                        ))}
                            </TableBody>
                        )}

                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={enq.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box >
            <Footer />
        </>
    )
}

export default Attendence

