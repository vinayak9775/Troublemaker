import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Tooltip, IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import { Link } from 'react-router-dom';
import Footer from '../../../Footer';
import HRNavbar from '../HRNavbar';
import TablePagination from '@mui/material/TablePagination';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

const empList = [
    {
        id: 1,
        name: 'Ashmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Active'
    },
    {
        id: 2,
        name: 'Mhmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Inactive',
        DOJ: '2024/03/04',
        DOE: '2024/03/04',
    },
    {
        id: 3,
        name: 'Ashmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Active',
    },
    {
        id: 4,
        name: 'Ashmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Inactive',
        DOJ: '2024/03/04',
        DOE: '2024/03/04',
    },
    {
        id: 5,
        name: 'Ashmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Active',
    },
    {
        id: 6,
        name: 'Ashmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Inactive',
        DOJ: '2024/03/04',
        DOE: '2024/03/04',
    },
    {
        id: 7,
        name: 'Ashmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Inactive',
        DOJ: '2024/03/04',
        DOE: '2024/03/04',
    },
    {
        id: 8,
        name: 'Ashmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Active',
    },
    {
        id: 9,
        name: 'Ashmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Active',
    },
    {
        id: 10,
        name: 'Ashmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Active',
    },
    {
        id: 11,
        name: 'Mshmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Active',
    },
    {
        id: 12,
        name: 'Ashmita Shinde',
        avatarSrc: '/static/images/avatar/3.jpg',
        code: 'IHPF000781',
        role: 'Physiotherapist',
        phone: '+91 | 9999999999',
        location: 'Katraj, Pune Maharashtra',
        activeStatus: 'Active',
    },
];

const Employee = () => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [activeEmployeeId, setActiveEmployeeId] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedEmployees = empList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleMoreClick = (id) => {
        setActiveEmployeeId(activeEmployeeId === id ? null : id);
    };

    const handleEditClick = (startTime, endTime, dayIndex, professional) => {
        // Implement the edit click handler logic here
    };

    return (
        <>
            <HRNavbar style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }} />
            <Box sx={{ flexGrow: 1, mt: 1, ml: 1, mr: 1, mb: '2em' }}>
                <Stack direction={isSmallScreen ? 'column' : 'row'}
                    spacing={1}
                    alignItems={isSmallScreen ? 'center' : 'flex-start'}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>EMPLOYEE LIST</Typography>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 260, height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <IconButton type="button" sx={{ color: "#69A5EB", height: "36px", width: "36px" }}>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, }}
                            placeholder="Search Employee |"
                        />
                    </Box>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 260, height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <IconButton type="button" sx={{ color: "#69A5EB", height: "36px", width: "36px" }}>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, }}
                            placeholder="Search Service |"
                        />
                    </Box>
                    <Button variant='contained' sx={{ background: "#69A5EB", textTransform: "capitalize", borderRadius: "8px", width: "12ch" }}>View</Button>
                </Stack>

                <Grid item xs={12} container spacing={1} sx={{ mt: 1, mb: 1 }}>
                    {paginatedEmployees.map((card) => (
                        <Grid item xs={12} sm={6} lg={3} key={card.id} style={{ position: 'relative' }}>
                            <Box sx={{ background: "#FFFFFF", borderRadius: "6px", padding: '6px' }}>
                                <div style={{ display: "flex" }}>
                                    <div>
                                        <Avatar
                                            alt={card.name}
                                            src={card.avatarSrc}
                                            sx={{
                                                // border: '1px solid blue',
                                                border: `1px solid ${card.activeStatus === 'Active' ? '#00E08F' : card.activeStatus === 'Inactive' ? '#D62E4B' : '#C9C9C9'}`,
                                                borderRadius: '50%',
                                            }}
                                        />
                                        <Typography variant='body2' sx={{ mt: 1, fontWeight: 'bold' }}>{card.code}</Typography>
                                    </div>
                                    <Box sx={{ borderLeft: '1px solid #767676', height: '122px', mx: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} />
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                                            <Typography
                                                variant='subtitle2'
                                                sx={{
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                    flex: 1,
                                                }}
                                            >
                                                {card.name}
                                            </Typography>
                                            <div style={{ marginLeft: '8px', fontSize: '1.5rem', lineHeight: 1, cursor: 'pointer' }} onClick={() => handleMoreClick(card.id)}>
                                                <MoreHorizIcon />
                                            </div>
                                        </div>
                                        <Typography variant='body2'>{card.role}</Typography>
                                        <Typography variant='body2'>{card.phone}</Typography>
                                        <Box sx={{ borderBottom: '1px solid #767676', width: '150px', mr: 2, mt: 1, mb: 1 }} />
                                        <div style={{ display: "flex" }}>
                                            {
                                                card.activeStatus === 'Active' ?
                                                    (
                                                        <>
                                                            <FmdGoodOutlinedIcon sx={{ fontSize: "18px", color: "#69A5EB" }} />
                                                            <Typography variant='body2' sx={{ ml: 0.3 }}>
                                                                {card.location}
                                                            </Typography>
                                                        </>
                                                    )
                                                    :
                                                    (
                                                        <Box sx={{ ml: 0.3 }}>
                                                            <Typography variant='body2'>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <CalendarTodayOutlinedIcon sx={{ mr: 0.7, fontSize: '16px', fontWeight: 'bold' }} />
                                                                    <Typography variant='body2' component='span' sx={{ fontWeight: 'bold', mr: 1.2 }}>
                                                                        DOJ
                                                                    </Typography>
                                                                    : {card.DOJ}
                                                                </Box>
                                                            </Typography>
                                                            <Typography variant='body2'>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <CalendarTodayOutlinedIcon sx={{ mr: 0.7, fontSize: '16px', fontWeight: 'bold' }} />
                                                                    <Typography variant='body2' component='span' sx={{ fontWeight: 'bold', mr: 1.2 }}>
                                                                        DOE
                                                                    </Typography>
                                                                    : {card.DOE}
                                                                </Box>
                                                            </Typography>
                                                        </Box>
                                                    )
                                            }
                                        </div>
                                    </div>
                                </div>

                                {activeEmployeeId === card.id && (
                                    <div style={{ position: 'absolute', top: '43px', right: '5px', zIndex: '2', border: '1px solid grey', borderRadius: '5px' }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                backgroundColor: '#F5F5F5',
                                                padding: '5px',
                                                borderRadius: '5px',
                                                width: '9em',
                                            }}
                                        >
                                            <Typography
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    color: '#00E08F',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    marginBottom: '3px',
                                                }}
                                            >
                                                <CheckIcon style={{ marginRight: '5px' }} />
                                                Mark active
                                            </Typography>

                                            <Typography
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    color: '#D62E4B',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    marginBottom: '3px'
                                                }}
                                            >
                                                <ClearIcon style={{ marginRight: '5px' }} />
                                                Mark In Active
                                            </Typography>

                                            <Typography
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    color: '#69A5EB',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    marginBottom: '3px'
                                                }}
                                            >
                                                <NoteAddOutlinedIcon style={{ marginRight: '5px' }} />
                                                Add Documents
                                            </Typography>

                                            <Typography
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    color: '#9342C5',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    marginBottom: '3px'
                                                }}
                                            >
                                                <RemoveRedEyeOutlinedIcon style={{ marginRight: '5px' }} />
                                                View Professional
                                            </Typography>
                                        </div>
                                    </div>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <TablePagination
                    component="div"
                    count={empList.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
            <Footer />
        </>
    );
};

export default Employee;
