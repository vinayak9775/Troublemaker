import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import Footer from '../../../Footer';
import HRNavbar from '../../HR/HRNavbar';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { IconButton, Badge, Popover, Box, Tab, Tabs, Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

const ProfileCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "50px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        cursor: 'pointer',
    },
});

const ManageProfessionals = () => {

    /// Notification Icon Open
    const [anchorEl, setAnchorEl] = useState(null);
    const handleToggleNotify = (event) => {
        if (anchorEl) {
            setAnchorEl(null);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleCloseNotify = () => setAnchorEl(null);
    const open = Boolean(anchorEl);
    const id = open ? 'notifications-popover' : undefined;
    /// Notification Icon Close

    //________________________Status Remark POP UP Start______________________
    const [statusOpen, setStatusOpen] = useState(false);
    const [remarkSpero, setRemarkSpero] = useState('');

    const handleStatusClick = (remark) => {
        setRemark(remark);
        setStatusOpen(true);
    };

    const handleCloseModalStatus = () => setStatusOpen(false);

    //________________________Status Remark POP UP END________________________

    //////// permission start
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    console.log(permissions, 'fetching permission');
    const [clgId, setClgId] = useState(null);
    const [refId, setRefId] = useState(null);

    console.log(refId, 'refId');

    const isAddServiceAllowed = permissions.some(permission =>
        permission.modules_submodule.some(module =>
            module.modules.some(submodule =>
                submodule.submodules && submodule.submodules.some(sub =>
                    sub.submodule_name === 'Add Professional'
                )
            )
        )
    );

    useEffect(() => {
        const id = localStorage.getItem('clg_id');
        const ref_id = localStorage.getItem('companyID');
        setClgId(id);
        setRefId(ref_id);
    }, []);

    //////// permisssion end

    const port = process.env.REACT_APP_API_KEY;
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('token');
    const [searchQuery, setSearchQuery] = useState('');

    const [profile, setProfile] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [professionalStatus, setProfessionalStatus] = useState(null);
    const [professionalId, setProfessionalId] = useState(null);
    const [showSubmit, setShowSubmit] = useState(true);
    const [remark, setRemark] = useState('');

    const openModal = () => {
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false)
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleIconClick = (id) => {
        console.log("professional ID Fetching...", id);
        setShowSubmit(false);
        navigate('/hr partner/Add professionals', {
            state: { professionalId: id, showSubmit: false }
        });
    };

    const handleEditClick = (id) => {
        console.log("professional ID Fetching...", id);
        setShowSubmit(true);
        navigate('/hr partner/Add professionals',
            { state: { professionalId: id, showSubmit: true } }
        );
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filteredProfiles = Array.isArray(profile) ?
        profile.filter((row) =>
            row.prof_fullname?.toLowerCase().includes(searchQuery.toLowerCase())
        ) : []

    const [allCount, setAllCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [statusId, setStatusId] = useState(null);

    const handleClick = (id) => {
        setStatusId(id);
    };

    useEffect(() => {
        const getProfile = async () => {
            try {
                if (!refId) return;

                const url = statusId
                    ? `${port}/hr/Manage_Prof_List_Get/${refId}/?HR_status=${statusId}`
                    : `${port}/hr/Manage_Prof_List_Get/${refId}/`;

                const res = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                console.log("Manage Professional Profile Data.........", data);

                if (data['not found'] === "Record not found") {
                    setProfile([]);
                } else if (data.data && Array.isArray(data.data)) {
                    setProfile(data.data);
                } else {
                    setProfile([]);
                }

                if (data?.notification) {
                    setAllCount(data.notification.All_Count || 0);
                    setApprovedCount(data.notification.Approved_Count || 0);
                    setRejectedCount(data.notification.Rejected_Count || 0);
                    setPendingCount(data.notification.Pending_Count || 0);
                }
            } catch (error) {
                console.error("Error fetching Manage Professional Profile Data:", error);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [refId, statusId]);

    const handleActivateStatus = (srv_prof_id, currentStatus) => {
        openModal();
        setProfessionalId(srv_prof_id);
        const newStatus = currentStatus === 1 ? 2 : 1;
        setProfessionalStatus(newStatus);
    };

    const handleOk = async () => {
        try {
            const status = professionalStatus;
            const lastModifiedBy = clgId;
            const addedBy = clgId;

            const response = await fetch(`${port}/hr/Exter_Prof_Action_Delete/${professionalId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    last_modified_by: lastModifiedBy,
                    Remark: remark,
                    added_by: addedBy
                }),
            });

            if (response.ok) {
                setProfile(prevState =>
                    prevState.map(prof =>
                        prof.srv_prof_id === professionalId ? { ...prof, status: status } : prof
                    )
                );
                handleClose();
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, mt: 1, ml: 1, mr: 1, mb: 4 }}>
                <Stack direction={isSmallScreen ? 'column' : 'row'}
                    spacing={1}
                    alignItems={isSmallScreen ? 'center' : 'flex-start'}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>MANAGE PROFESSIONAL</Typography>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 260, height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <IconButton type="button" sx={{ color: "#69A5EB", height: "36px", width: "36px" }}>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, }}
                            placeholder="Search..."
                            inputProps={{ 'aria-label': 'select service' }}
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Box>

                    {isAddServiceAllowed && (
                        <Link to="/hr partner/Add professionals" style={{ textDecoration: 'none' }}>
                            <Button
                                variant='contained'
                                sx={{ background: "#69A5EB", textTransform: "capitalize", height: "40px", borderRadius: "8px" }}
                            >
                                <PersonAddAltOutlinedIcon sx={{ mr: 1, fontSize: "18px" }} />
                                Add Professionals
                            </Button>
                        </Link>
                    )}

                    <IconButton aria-describedby={id} onClick={handleToggleNotify} style={{ position: 'relative' }}>
                        <Badge badgeContent={allCount} color="secondary">
                            <NotificationsActiveIcon style={{ fontSize: '27px' }} />
                        </Badge>
                    </IconButton>

                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleCloseNotify}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        sx={{
                            marginLeft: '100px',
                            marginTop: '-10px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                        }}
                    >
                        <Box sx={{ width: 'auto', padding: 1.3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, color: 'blue' }}>
                                <Typography variant="body1" component="p" onClick={() => handleClick(4)}>
                                    All
                                </Typography>
                                <Typography variant="body1" component="p" style={{ marginLeft: '14px' }}>
                                    {allCount}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, color: 'green' }}>
                                <Typography variant="body1" component="p" onClick={() => handleClick(1)}>
                                    Approved
                                </Typography>
                                <Typography variant="body1" component="p" style={{ marginLeft: '14px' }}>
                                    {approvedCount}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, color: 'red' }}>
                                <Typography variant="body1" component="p" onClick={() => handleClick(2)}>
                                    Rejected
                                </Typography>
                                <Typography variant="body1" component="p" style={{ marginLeft: '14px' }}>
                                    {rejectedCount}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, color: 'orange' }}>
                                <Typography variant="body1" component="p" onClick={() => handleClick(3)}>
                                    Pending
                                </Typography>
                                <Typography variant="body1" component="p" style={{ marginLeft: '14px' }}>
                                    {pendingCount}
                                </Typography>
                            </Box>
                        </Box>
                    </Popover>
                </Stack>

                <TableContainer sx={{ height: "68vh" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <ProfileCard
                                    style={{
                                        background: "#69A5EB",
                                        color: "#FFFFFF",
                                        borderRadius: "8px 10px 0 0",
                                    }}
                                >
                                    <CardContent style={{ flex: 0.2, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Professional Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Email ID</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Phone Number</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.8, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Service Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Status</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Spero Remark</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Action</Typography>
                                    </CardContent>
                                </ProfileCard>
                            </TableRow>
                        </TableHead>

                        {loading ? (
                            <Box sx={{ display: 'flex', mt: 15, ml: 80, height: '100px' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableBody>
                                {filteredProfiles.length === 0 ? (
                                    <TableRow>
                                        <CardContent>
                                            <Typography variant="body2">No Data Available</Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    filteredProfiles
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <TableRow
                                                key={row.srv_prof_id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <ProfileCard>
                                                    <CardContent style={{ flex: 0.2 }}>
                                                        <Typography variant="body2">
                                                            {index + 1 + page * rowsPerPage}
                                                        </Typography>
                                                    </CardContent>

                                                    <CardContent
                                                        style={{
                                                            flex: 1.5,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        <Tooltip title={row.prof_fullname || '-'} arrow>
                                                            <Typography
                                                                variant="body2"
                                                                style={{
                                                                    maxWidth: "100%",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                            >
                                                                {row.prof_fullname && row.prof_fullname.length > 25
                                                                    ? `${row.prof_fullname.slice(0, 25)}...`
                                                                    : row.prof_fullname || '-'}
                                                            </Typography>
                                                        </Tooltip>
                                                    </CardContent>

                                                    <CardContent
                                                        style={{
                                                            flex: 1.5,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        <Tooltip title={row.email_id || '-'} arrow>
                                                            <Typography
                                                                variant="body2"
                                                                style={{
                                                                    maxWidth: "100%",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                            >
                                                                {row.email_id && row.email_id.length > 25
                                                                    ? `${row.email_id.slice(0, 25)}...`
                                                                    : row.email_id || '-'}
                                                            </Typography>
                                                        </Tooltip>
                                                    </CardContent>

                                                    <CardContent
                                                        style={{
                                                            flex: 1,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        <Typography variant="body2">
                                                            {row.phone_no || '-'}
                                                        </Typography>
                                                    </CardContent>

                                                    <CardContent
                                                        style={{
                                                            flex: 1.8,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        <Tooltip title={row.srv_id || '-'} arrow>
                                                            <Typography variant="body2">
                                                                {row.srv_id || '-'}
                                                            </Typography>
                                                        </Tooltip>
                                                    </CardContent>

                                                    <CardContent style={{ flex: 0.5 }}>
                                                        <Typography variant="body2">
                                                            {row.status === 1
                                                                ? 'Active'
                                                                : row.status === 2
                                                                    ? 'Inactive'
                                                                    : '-'}
                                                        </Typography>
                                                    </CardContent>

                                                    <CardContent
                                                        style={{
                                                            flex: 1,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                        onClick={() => handleStatusClick(row.HR_status_remark?.int_round_Remark)}
                                                    >
                                                        <Typography variant="body2">
                                                            {row.HR_status_remark?.hr_status === 1
                                                                ? 'Approved'
                                                                : row.HR_status_remark?.hr_status === 2
                                                                    ? 'Rejected'
                                                                    : 'Pending'}
                                                        </Typography>
                                                    </CardContent>

                                                    <CardContent style={{ flex: 0.5 }}>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            sx={{ ml: '4px' }}
                                                            gap={0}
                                                        >
                                                            <IconButton style={{ padding: 1 }}>
                                                                <EditIcon
                                                                    onClick={() =>
                                                                        handleEditClick(row.srv_prof_id)
                                                                    }
                                                                />
                                                            </IconButton>
                                                            <IconButton
                                                                style={{ padding: 1 }}
                                                                onClick={() =>
                                                                    handleActivateStatus(row.srv_prof_id, row.status)
                                                                }
                                                            >
                                                                {row.status === 1 ? (
                                                                    <CloseIcon />
                                                                ) : (
                                                                    <TaskAltIcon />
                                                                )}
                                                            </IconButton>
                                                        </Box>
                                                    </CardContent>
                                                </ProfileCard>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        )}
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component="div"
                        count={filteredProfiles.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>

                <Modal
                    open={statusOpen}
                    onClose={handleCloseModalStatus}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '30%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 1,
                            width: 400,
                        }}
                    >
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: 'gray',
                            }}
                            onClick={handleCloseModalStatus}
                        >
                            <CloseIcon />
                        </IconButton>

                        <Box id="modal-description" sx={{ mt: 2, mb: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                                Spero Status:
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '16px', marginTop: '5px', marginLeft: '15px' }}>
                                {remark || 'No Remark'}
                            </Typography>
                        </Box>
                    </Box>
                </Modal>

                <Modal
                    open={isModalOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '30%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 1,
                            width: 400,
                        }}
                    >
                        <Box id="modal-description" sx={{ mt: 2, mb: 2, display: 'flex' }}>
                            <Typography variant="body2" sx={{ fontSize: '16px' }}>
                                Are you sure you want to {professionalStatus === 1 ? 'Activate' : 'InActivate'} this professional?
                            </Typography>
                        </Box>

                        <Grid item lg={5} sm={6} xs={12}>
                            <TextField
                                required
                                id="Remark"
                                name="Remark"
                                label="Remark"
                                size="small"
                                fullWidth
                                sx={{
                                    textAlign: "left",
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ mr: 2 }} onClick={handleOk}

                            >
                                OK
                            </Button>
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                color="secondary"
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
            <Footer />
        </>

    )
}

export default ManageProfessionals
