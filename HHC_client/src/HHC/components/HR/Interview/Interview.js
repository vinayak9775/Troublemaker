import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { fontSize, styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Card, CardContent, Box, InputBase, Modal, Stack, Tooltip, IconButton, TextField, MenuItem, Button, CircularProgress } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import Navbar from '../../../Navbar';
import Footer from '../../../Footer';
import HRNavbar from '../HRNavbar';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const InterviewCard = styled(Card)({
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

const status = [
    {
        status_id: 1,
        label: 'Selected ',
    },
    {
        status_id: 2,
        label: 'Reject ',
    },
    {
        status_id: 3,
        label: 'OnHold',
    },
    {
        status_id: 4,
        label: 'Pending ',
    },
    {
        status_id: 5,
        label: 'Shortlisted ',
    },
];

const Interview = () => {

    const [clgId, setClgId] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem('clg_id');
        setClgId(id);
    }, []);

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [statusID, setStatusID] = useState(null);
    console.log(statusID, 'fetching the statusID');

    const handleOpenModal = (option) => {
        // const confirmationMessage = `Are you sure you want to ${option.label}?`;
        // setModalContent(confirmationMessage);
        const confirmationMessage = option.label === "Selected "
            ? "Are you sure you want to Select?"
            : `Are you sure you want to ${option.label}?`;

        setModalContent(confirmationMessage);
        console.log(confirmationMessage, 'confirmationMessage');

        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalContent(null);
    };

    // const handleConfirm = () => {
    //     if (modalContent.includes('Selected')) {
    //         navigate('/hr/onboarding');
    //     } else {
    //         console.log("Confirmed!");
    //     }
    //     handleCloseModal();
    // };

    const handleCancel = () => {
        // Handle the cancel action here
        console.log("Cancelled!");
        handleCloseModal();
    };

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [interview, setInterview] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const [loading, setLoading] = useState(true);

    const [selectedStatus, setSelectedStatus] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase()); // Store the search query as lowercase
        setPage(0);
    };

    const filteredInterview = interview.filter((row) => {
        const fullName = row?.srv_prof_id?.prof_fullname?.toLowerCase() || '';
        return fullName.includes(searchQuery);
    });

    // const filteredInterview = interview.filter((row) =>
    //     row.srv_prof_id.prof_fullname.toLowerCase().includes(searchQuery)
    // );

    const handleChangeStatus = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    const [statusMap, setStatusMap] = useState({});


    const getInterview = async () => {
        try {
            const res = await fetch(`${port}/hr/prof_int_dtls/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            console.log("Interview Schedule Data.........", data);
            if (Array.isArray(data) && data.length > 0) {
                setInterview(data);
                const initialStatusMap = {};
                data.forEach(row => {
                    initialStatusMap[row.eve_id] = row.status_id || '';
                });
                setStatusMap(initialStatusMap);
            } else {
                setInterview([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching Interview Schedule  Data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getInterview();
    }, []);

    const getStatusColor = (statusId) => {
        switch (statusId) {
            case 1:
                return '#702CDF';
            case 2:
                return '#AF0F2A';
            case 3:
                return '#69A5EB';
            case 4:
                return '#F7A825';
            default:
                return '#00E08F';
        }
    };

    ///fetch the ID
    const [srvProfIntId, setProfIntId] = useState('')
    const [srvProfId, setProfId] = useState('')
    const [remark, setRemark] = useState('');
    const [dateJoin, setDateJoin] = useState('')

    console.log("srv_prof_int_id:", srvProfIntId);
    console.log("srv_prof_id:", srvProfId);

    const handleConfirm = async () => {
        const payload = {
            srv_prof_int_id: srvProfIntId,
            srv_prof_id: srvProfId,
            int_status: statusID,
            last_modified_by: clgId,
            Remark: remark,
            Date_Join: dateJoin
        };

        console.log(payload, 'payload');

        try {
            const response = await fetch(`${port}/hr/interview_status/${srvProfId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            handleCloseModal();
            if (statusID === 1) {
                navigate('/hr/onboarding');
            }
            await getInterview();
        } catch (error) {
            console.error('Error while hitting the API:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, mt: 1, ml: 1, mr: 1, }}>
                <Stack direction={isSmallScreen ? 'column' : 'row'}
                    spacing={1}
                    alignItems={isSmallScreen ? 'center' : 'flex-start'}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>INTERVIEW SCHEDULE</Typography>

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
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Box>
                </Stack>

                <TableContainer sx={{ height: "63vh" }}>
                    <Table >
                        <TableHead>
                            <TableRow >
                                <InterviewCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Professional Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Role</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Contact No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 0.8, borderRight: "1px solid #FFFFFF" }}>
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
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Interview Round</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Interview Scheduled With</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.2 }}>
                                        <Typography variant="subtitle2">Status</Typography>
                                    </CardContent>
                                </InterviewCard>
                            </TableRow>
                        </TableHead>

                        {loading ? (
                            <Box sx={{ display: 'flex', mt: 15, ml: 80, height: '100px', }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableBody>
                                {filteredInterview.length === 0 ? (
                                    <TableRow>
                                        <CardContent >
                                            <Typography variant="body2">
                                                No Data Available
                                            </Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    filteredInterview.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow
                                                key={row.eve_id}
                                                value={row.eve_id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                                            >
                                                <InterviewCard>
                                                    <CardContent style={{ flex: 0.5 }}>
                                                        <Typography variant="body2">
                                                            {index + 1 + page * rowsPerPage}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5 }}>
                                                        <Typography variant="body2">{row.srv_prof_id.prof_fullname}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2">{row.srv_prof_id.role || "-"}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2">
                                                            <PhoneOutlinedIcon sx={{ fontSize: "16px", color: "#69A5EB" }} />
                                                            {row.srv_prof_id.phone_no}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 0.8 }}>
                                                        <Typography variant="body2">{row.srv_prof_id.Job_type}</Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5 }}>
                                                        <Typography variant="body2">
                                                            <CalendarMonthOutlinedIcon sx={{ fontSize: "15px", color: "#69A5EB" }} />
                                                            {row.int_schedule_date ? `${row.int_schedule_date ? row.int_schedule_date : ''} ${row.int_schedule_time ? row.int_schedule_time : ''}` : "NA"}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1 }}>
                                                        {/* {row.int_mode === 2 ? (
                                                            <Typography variant='body2'>Offline</Typography>
                                                        ) : (
                                                            <Typography variant='body2'>Online</Typography>
                                                        )} */}
                                                        {row.int_mode ? row.int_mode : '-'}
                                                    </CardContent>
                                                    <CardContent style={{ flex: 1.5 }}>
                                                        <Typography variant="body2">
                                                            {row.int_schedule_with}
                                                        </Typography>
                                                    </CardContent>

                                                    <CardContent style={{ flex: 1 }}>
                                                        <Typography variant="body2">
                                                            Interview Round
                                                        </Typography>
                                                    </CardContent>

                                                    <CardContent style={{ flex: 1.5 }}>
                                                        <Typography variant="body2">
                                                            Interview Scheduled With
                                                        </Typography>
                                                    </CardContent>

                                                    <CardContent style={{ flex: 1.2 }}>
                                                        <TextField
                                                            required
                                                            select
                                                            id="status_id"
                                                            name="status_id"
                                                            size="small"
                                                            fullWidth
                                                            // value={selectedStatus[row.srv_prof_id.srv_prof_id]}
                                                            value={selectedStatus[row.srv_prof_id.srv_prof_id] || row.int_status}
                                                            onChange={(e) => {
                                                                handleChangeStatus(e, row.eve_id);
                                                                handleOpenModal(status.find(option => option.status_id === e.target.value));

                                                                const srv_prof_int_id = row.srv_prof_int_id;
                                                                const srv_prof_id = row.srv_prof_id.srv_prof_id;

                                                                setProfIntId(srv_prof_int_id);
                                                                setProfId(srv_prof_id);
                                                                setStatusID(e.target.value);
                                                            }}
                                                            sx={{
                                                                textAlign: "left",
                                                                mt: "8px",
                                                                '& .MuiSelect-select': {
                                                                    fontSize: '14px',
                                                                    color: getStatusColor(selectedStatus),
                                                                },
                                                            }}
                                                        >
                                                            {status.map((option) => (
                                                                <MenuItem
                                                                    key={option.status_id}
                                                                    value={option.status_id}
                                                                    sx={{
                                                                        fontSize: "14px",
                                                                        color: getStatusColor(option.status_id),
                                                                    }}
                                                                >
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </CardContent>

                                                    <Modal
                                                        open={modalOpen}
                                                        onClose={handleCloseModal}
                                                        aria-labelledby="modal-title"
                                                        aria-describedby="modal-description"
                                                    >
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: '40%',
                                                                left: '50%',
                                                                transform: 'translate(-50%, -50%)',
                                                                width: 350,
                                                                bgcolor: 'background.paper',
                                                                boxShadow: 24,
                                                                p: 4,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'left',
                                                                borderRadius: '5px'
                                                            }}
                                                        >
                                                            <IconButton
                                                                edge="end"
                                                                color="inherit"
                                                                onClick={handleCloseModal}
                                                                aria-label="close"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 8,
                                                                    right: 8,
                                                                }}
                                                            >
                                                                <CloseIcon />
                                                            </IconButton>

                                                            {
                                                                statusID === 1 && (
                                                                    <>
                                                                        <Typography id="modal-title">
                                                                            Date of Joining
                                                                        </Typography>
                                                                        <TextField
                                                                            type='date'
                                                                            variant="outlined"
                                                                            style={{ width: '60%' }}
                                                                            size='small'
                                                                            name='Date_Join'
                                                                            value={dateJoin}
                                                                            onChange={(e) => setDateJoin(e.target.value)}
                                                                        />
                                                                    </>
                                                                )
                                                            }
                                                            {
                                                                statusID === 2 && (
                                                                    <>
                                                                        <Typography id="modal-title">
                                                                            Rejection Remark
                                                                        </Typography>
                                                                        <TextField
                                                                            variant="outlined"
                                                                            style={{ width: '100%' }}
                                                                            size="small"
                                                                            name="Remark"
                                                                            value={remark}
                                                                            onChange={(e) => setRemark(e.target.value)}
                                                                            multiline
                                                                            rows={4}
                                                                        />

                                                                    </>
                                                                )
                                                            }

                                                            {
                                                                statusID === 3 && (
                                                                    <>
                                                                        <Typography id="modal-title">
                                                                            OnHold Remark
                                                                        </Typography>
                                                                        <TextField
                                                                            variant="outlined"
                                                                            style={{ width: '100%' }}
                                                                            size="small"
                                                                            name="Remark"
                                                                            value={remark}
                                                                            onChange={(e) => setRemark(e.target.value)}
                                                                            multiline
                                                                            rows={4}
                                                                        />

                                                                    </>
                                                                )
                                                            }

                                                            {
                                                                statusID === 4 && (
                                                                    <>
                                                                        <Typography id="modal-title">
                                                                            Pending Remark
                                                                        </Typography>
                                                                        <TextField
                                                                            variant="outlined"
                                                                            style={{ width: '100%' }}
                                                                            size="small"
                                                                            name="Remark"
                                                                            value={remark}
                                                                            onChange={(e) => setRemark(e.target.value)}
                                                                            multiline
                                                                            rows={4}
                                                                        />

                                                                    </>
                                                                )
                                                            }

                                                            {
                                                                statusID === 5 && (
                                                                    <>
                                                                        <Typography id="modal-title">
                                                                            Shortlisted Remark
                                                                        </Typography>
                                                                        <TextField
                                                                            variant="outlined"
                                                                            style={{ width: '100%' }}
                                                                            size="small"
                                                                            name="Remark"
                                                                            value={remark}
                                                                            onChange={(e) => setRemark(e.target.value)}
                                                                            multiline
                                                                            rows={4}
                                                                        />

                                                                    </>
                                                                )
                                                            }
                                                            <Typography id="modal-description" sx={{ mt: 2, mb: 0.5 }}>
                                                                {modalContent}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                                <Button variant="contained" onClick={handleConfirm}>
                                                                    OK
                                                                </Button>
                                                                <Button variant="outlined" onClick={handleCancel}>
                                                                    Cancel
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </Modal>
                                                </InterviewCard>
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
                    count={filteredInterview.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <Footer />
        </>
    )
}

export default Interview
