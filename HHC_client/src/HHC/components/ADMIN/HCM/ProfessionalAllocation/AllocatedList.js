import React, { useEffect, useState } from 'react';
import HRNavbar from '../../../HR/HRNavbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { TextField, Button, TablePagination, Select } from '@mui/material';
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
import Grid from '@mui/material/Grid';
import Footer from '../../../../Footer';
import AllocatedProfessional from './AllocatedProfessional';
import MapComponent from '../../../ADMIN/HCM/ProfessionalAllocation/Map';
import { TableCell } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const AllocatedCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '10px',
    marginRight: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "90%",
    borderRadius: '10px',
    fontWeight: "200",
});

const AllocatedList = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [loading, setLoading] = useState(true); // State to manage loading state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedProfId, setSelectedProfId] = useState(null); // State to store the selected profId
    const [services, setServices] = useState([]);
    const [allocatedProfessionals, setAllocatedProfessionals] = useState([]);

    ///search filter
    const [selectedService, setSelectedService] = useState('');
    const [searchInput, setSearchInput] = useState('');

    // useEffect to fetch data on component mount and when filters change
    const fetchAllocatedProfessionals = async () => {
        setLoading(true);
        try {
            const apiUrl = `${port}/web/agg_hhc_event_professional_api/?prof_name=${searchInput}&srv=${selectedService}`;
            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            console.log("API Response Data:", data);
            setAllocatedProfessionals(data);
        } catch (error) {
            console.error('Error fetching allocated professionals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllocatedProfessionals();
    }, [searchInput, selectedService]);

    const handleSearch = () => {
        setLoading(true); // Set loading to true when search starts
        fetchAllocatedProfessionals(); // Trigger data fetch on button click
    };

    const handleRowClick = (index, profId) => {
        setSelectedRow(index);
        setSelectedProfId(profId);
        console.log("Selected profId:", profId);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Ensure allocatedProfessionals is always an array
    const displayProfessionals = Array.isArray(allocatedProfessionals) ? allocatedProfessionals : [];

    // Pagination logic
    const paginatedData = displayProfessionals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // SERVICE GET API
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${port}/web/agg_hhc_services_api`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, []);

    return (
        <div style={{ marginBottom: '2em' }}>
            <HRNavbar />
            <Box sx={{ mx: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'left', marginTop: '10px' }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ flexWrap: 'nowrap' }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>
                            Professionals
                        </Typography>

                        <Select
                            labelId="select-service-label"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            displayEmpty
                            sx={{
                                height: 39,
                                minWidth: 300,
                                backgroundColor: 'white',
                                boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                                borderRadius: "7px"
                            }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: '200px',
                                        maxWidth: '150px'
                                    },
                                },
                                MenuListProps: {
                                    style: {
                                        maxHeight: '200px',
                                    },
                                },
                            }}
                            inputProps={{ 'aria-label': 'Select Group' }}
                        >
                            <MenuItem value="" disabled>
                                Select Service
                            </MenuItem>
                            {services.map((service) => (
                                <MenuItem key={service.srv_id} value={service.srv_id}>
                                    {service.service_title}
                                </MenuItem>
                            ))}
                        </Select>

                        <Box
                            component="form"
                            sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                        >
                            <InputBase
                                sx={{ ml: 1, mr: 1, flex: 1 }}
                                type='text'
                                placeholder="Search Professional..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#69A5EB', color: 'white', textTransform: 'capitalize', marginLeft: '1rem' }}
                            onClick={handleSearch}
                        >
                            Show Professional
                        </Button>
                    </Stack>
                </Box>

                <Grid item xs={12} container spacing={0} sx={{ flexGrow: 1 }}>
                    {selectedRow === null ? (
                        <Grid item xs={12} lg={7} sm={12} md={12}>
                            <AllocatedCard style={{ height: '93%' }}>
                                <CardContent>
                                    <MapComponent />
                                </CardContent>
                            </AllocatedCard>
                        </Grid>
                    ) : (
                        <Grid item xs={12} lg={7} sm={12} md={12}>
                            <AllocatedCard>
                                <CardContent>
                                    {selectedRow !== null && paginatedData[selectedRow] && paginatedData[selectedRow].prof_fullname ?
                                        (
                                            <AllocatedProfessional
                                                profId={selectedProfId}
                                                profFullname={paginatedData[selectedRow].prof_fullname}
                                            />
                                        )
                                        :
                                        (
                                            <AllocatedProfessional
                                                profId={selectedProfId}
                                            />
                                        )
                                    }
                                </CardContent>
                            </AllocatedCard>
                        </Grid>
                    )}

                    <Grid item xs={12} lg={5} sm={12} md={12}>
                        <TableContainer sx={{ ml: 1, mr: 1 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <AllocatedCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", height: '3rem' }}>
                                            <CardContent style={{ flex: 5, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Professional Name</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 4, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Service</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Contact</Typography>
                                            </CardContent>
                                        </AllocatedCard>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" style={{ height: '49vh' }}>
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    )
                                        :
                                        paginatedData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" style={{ height: '49vh' }}>
                                                    No Data Found
                                                </TableCell>
                                            </TableRow>
                                        ) :
                                            (
                                                paginatedData.map((row, index) => (
                                                    <TableRow
                                                        key={index}
                                                        onClick={() => handleRowClick(index + page * rowsPerPage, row.srv_prof_id)}
                                                    >
                                                        <AllocatedCard
                                                            style={{
                                                                height: '3.5rem',
                                                                // marginTop: '0px',
                                                                background: 'white',
                                                                borderRadius: '8px 10px 8px 8px',
                                                                color: "rgba(0, 0, 0, 0.87)",
                                                                fontWeight: "100",
                                                                borderLeft: selectedRow === index + page * rowsPerPage ? '2px solid #69A5EB' : 'none',
                                                            }}
                                                        >
                                                            <CardContent style={{ flex: 5 }}>
                                                                <Typography variant='subtitle2'>{row.prof_fullname}</Typography>
                                                            </CardContent>
                                                            <CardContent style={{ flex: 4 }}>
                                                                <Typography variant='subtitle2'>{row.srv_id}</Typography>
                                                            </CardContent>
                                                            <CardContent style={{ flex: 2 }}>
                                                                <Typography variant='subtitle2'>{row.phone_no}</Typography>
                                                            </CardContent>
                                                        </AllocatedCard>
                                                    </TableRow>
                                                ))
                                            )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 30, 50]}
                            component="div"
                            count={displayProfessionals.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </div>
    );
}

export default AllocatedList;
