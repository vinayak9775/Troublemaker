import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const ScheduleCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    marginLeft: '15px',
    marginRight: '5px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "52px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        // cursor: 'pointer',
    },
});

const ServiceStatus = ({ value }) => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filteredData, setFilteredData] = useState([]);
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const hospID = localStorage.getItem('hospitalId');
    console.log('service Status', hospID);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${port}/web/hospital_dashboard_service_details/${hospID}/${value}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setFilteredData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
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
            <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '8px' }}>
                <Typography align="center" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px", marginBottom: '15px' }} color="text.secondary" gutterBottom>SERVICE STATUS</Typography>
                <Grid item xs={12} container spacing={1}>
                    <TableContainer>
                        <Table style={{ height: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <ScheduleCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Patient Name</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Service Name</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Sub Service</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>Start Date</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                            <Typography variant='subtitle2'>End Date</Typography>
                                        </CardContent>
                                    </ScheduleCard>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <CardContent>
                                            <Typography variant="body2">
                                                No Data Available
                                            </Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                        <TableRow
                                            key={row.eve_poc_id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <ScheduleCard style={{ height: '4rem' }}>
                                                <CardContent style={{ flex: 2 }}>
                                                    <Typography variant='body2'>{row.patient_name}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 2 }}>
                                                    <Typography variant='body2'>{row.service_name}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 3 }}>
                                                    <Typography variant='body2'>{row.sub_service_name}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1 }}>
                                                    <Typography variant='body2'>{row.s_start_date}</Typography>
                                                </CardContent>
                                                <CardContent style={{ flex: 1 }}>
                                                    <Typography variant='body2'>{row.s_end_date}</Typography>
                                                </CardContent>
                                            </ScheduleCard>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Grid>
            </Box>
        </div>
    );
}

export default ServiceStatus;
