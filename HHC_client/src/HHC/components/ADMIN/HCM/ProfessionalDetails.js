import React, { useState, useEffect } from 'react';
import HRNavbar from '../../HR/HRNavbar';
import { Box, Stack } from '@mui/system';
import { TablePagination, CardContent, IconButton, InputBase, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import Footer from '../../../Footer';
import TableCell from '@mui/material/TableCell';
import CircularProgress from '@mui/material/CircularProgress';

const ProfessionalDetailsCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "54px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
    },
});

const ProfessionalDetails = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [professionalData, setProfessionalData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchZone = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`${port}/hhc_hcm/Get_professional_otp_data/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setProfessionalData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching zones:', error);
        }
    };

    useEffect(() => {
        fetchZone();
    }, [port, accessToken]);

    const filteredProfessionalData = professionalData.filter((professional) =>
        // professional.prof_name.toLowerCase().includes(searchInput.toLowerCase())
        professional.prof_name && professional.prof_name.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Professional Details</Typography>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: '300px', height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Professional |"
                            inputProps={{ 'aria-label': 'search professional' }}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <IconButton type="button" sx={{ p: '10px' }}>
                            <SearchIcon style={{ color: "#7AB7EE" }} />
                        </IconButton>
                    </Box>
                </Stack>

                <TableContainer sx={{ height: "68vh" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <ProfessionalDetailsCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Professional Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Phone No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Service Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">OTP</Typography>
                                    </CardContent>
                                </ProfessionalDetailsCard>
                            </TableRow>
                        </TableHead>

                        {loading ? (
                            <Box sx={{ display: 'flex', mt: 15, justifyContent: 'center', height: '45vh' }}>
                                <CircularProgress />
                            </Box>
                        ) : filteredProfessionalData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                                    <Typography variant="subtitle1">No data found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableBody>
                                {filteredProfessionalData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((professional, index) => (
                                    <TableRow key={index}>
                                        <ProfessionalDetailsCard>
                                            <CardContent style={{ flex: 0.5 }}>
                                                <Typography variant="subtitle2">{page * rowsPerPage + index + 1}</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1.6 }}>
                                                <Typography variant="subtitle2">
                                                    {professional.prof_name ? professional.prof_name : "-"}
                                                </Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1.5 }}>
                                                <Typography variant="subtitle2">
                                                    {professional.phone_no ? professional.phone_no : "-"}
                                                </Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 2 }}>
                                                <Typography variant="subtitle2">
                                                    {professional.professional_service ? professional.professional_service : "-"}
                                                </Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1 }}>
                                                <Typography variant="subtitle2">
                                                    {professional.OTP ? professional.OTP : "-"}
                                                </Typography>
                                            </CardContent>
                                        </ProfessionalDetailsCard>
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={filteredProfessionalData.length}
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
    )
}

export default ProfessionalDetails;
