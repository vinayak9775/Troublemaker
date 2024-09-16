import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Card, CardContent, Typography, Table, TableHead, TableRow, TableBody, TableContainer, TablePagination } from '@mui/material';
import { border, styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Closureone from '../ClosureForms/Closureone';
import Closuretwo from '../ClosureForms/Closuretwo';
import Closurethree from '../ClosureForms/Closurethree';
import Closurefour from '../ClosureForms/Closurefour';
import Closurefive from '../ClosureForms/Closurefive';
import Closuresix from '../ClosureForms/Closuresix';
import Closureseven from '../ClosureForms/Closureseven';
import Closureeight from '../ClosureForms/Closureeight';
import Closurenine from '../ClosureForms/Closurenine';
import Closureten from '../ClosureForms/Closureten';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    pt: 2,
    px: 4,
    pb: 3,
};

const SessionCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "50px",
    borderRadius: '10px',
    transition: '0.5s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        // cursor: 'pointer',
    },
});

const Sessions = ({ eveID, subSrvID }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openClosure, setOpenClosure] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [formNo, setFormNo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [eventPlanID, setEventPlanID] = useState('');
    const [srvProfID, setSrvProfID] = useState('');
    const [sesStartDate, setSesStartDate] = useState(null);
    const [sesStartTime, setSesStartTime] = useState(null);
    const [sesEndDate, setSesEndDate] = useState(null);
    const [sesEndTime, setSesEndTime] = useState(null);

    console.log("Fom No,,,", formNo)
    console.log("Session Data from Sessions Component,,,", sessions)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpenClosure = () => {
        setOpenClosure(true);
    };
    const handleCloseClosure = () => {
        setOpenClosure(false);
    };

    // useEffect(() => {
    const getSessionDetils = async () => {
        if (eveID) {
            console.log("eventID...", eveID)
            try {
                const res = await fetch(`${port}/web/all_dtl_evnts/?eve=${eveID}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Sessions Data....", data);
                if (data['not found'] === "Record not found") {
                    setSessions([]);
                    setLoading(false);
                } else {
                    setSessions(data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching Sessions data:", error);
                setLoading(false);
            }
        }
    };
    getSessionDetils();
    // }, [eveID]);

    useEffect(() => {
        getSessionDetils();
    }, [eveID]);

    const eventDetailPlanIDRequest = (evePlanId) => {
        const selectedID = sessions.find(item => item.agg_sp_dt_eve_poc_id === evePlanId);
        if (selectedID) {
            console.log("Selected Event Plan ID:", selectedID.agg_sp_dt_eve_poc_id);
            setEventPlanID(selectedID.agg_sp_dt_eve_poc_id);
            setSrvProfID(selectedID.srv_prof_id_id);
            setSesStartDate(selectedID.prof_session_start_date);
            setSesStartTime(selectedID.prof_session_start_time);
            setSesEndDate(selectedID.prof_session_end_date);
            setSesEndTime(selectedID.prof_session_end_time);
        }
    };

    useEffect(() => {
        const getJobClosure = async () => {
            if (subSrvID) {
                console.log("subSrvID...", subSrvID)
                try {
                    const res = await fetch(`${port}/web/agg_hhc_sub_srv_jc_form_num/?sub_srv=${subSrvID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Form Number....", data.record.form_number);
                    if (data.msg === "No Data Found") {
                        setFormNo([]);
                    } else {
                        setFormNo(data.record.form_number);
                        // setLoading(false);
                    }
                } catch (error) {
                    console.error("Error fetching Closure data:", error);
                }
            }
        };
        getJobClosure();
    }, [subSrvID]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Get day with leading zero
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month with leading zero
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    return (
        <Box sx={{ width: 800, borderRadius: "10px", border: "none" }}>
            <TableContainer>
                <Table>
                    <TableHead >
                        <TableRow >
                            <SessionCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                <CardContent style={{ width: "5%", borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant='subtitle2'>Sr No.</Typography>
                                </CardContent >
                                <CardContent style={{ width: "8%", borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant='subtitle2'>Session Index</Typography>
                                </CardContent >
                                <CardContent style={{ width: "15%", borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant='subtitle2'>Session Start Date</Typography>
                                </CardContent>
                                <CardContent style={{ width: "15%", borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant='subtitle2'>Session Start Time</Typography>
                                </CardContent>
                                <CardContent style={{ width: "15%", borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant='subtitle2'>Session End Date</Typography>
                                </CardContent>
                                <CardContent style={{ width: "15%", borderRight: "1px solid #FFFFFF" }}>
                                    <Typography variant='subtitle2'>Session End Time</Typography>
                                </CardContent>
                                <CardContent style={{ width: "10%" }}>
                                    <Typography variant='subtitle2'>Action</Typography>
                                </CardContent>
                            </SessionCard>
                        </TableRow>
                    </TableHead>
                    {loading ? (
                        <Box sx={{ display: 'flex', mt: 15, ml: 50, height: '100px', }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableBody>
                            {sessions.length === 0 ? (
                                <TableRow>
                                    <CardContent >
                                        <Typography variant="body2" sx={{ ml: 40 }}>
                                            No Data Available
                                        </Typography>
                                    </CardContent>
                                </TableRow>
                            ) : (
                                sessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <SessionCard>
                                                <CardContent style={{ width: "5%" }}>
                                                    <Typography variant="body2">
                                                        {index + 1 + page * rowsPerPage}
                                                    </Typography>
                                                </CardContent>
                                                <CardContent style={{ width: "8%" }}>
                                                    <Typography variant="body2">
                                                        {row.index_of_Session}
                                                    </Typography>
                                                </CardContent>
                                                <CardContent style={{ width: "15%" }}>
                                                    <div style={{ display: "flex" }}>
                                                        <CalendarMonthOutlinedIcon sx={{ color: "#69A5EB", fontSize: "18px" }} />
                                                        <Typography variant="body2">
                                                            {formatDate(row.actual_StartDate_Time)}
                                                        </Typography>
                                                    </div>
                                                </CardContent>
                                                <CardContent style={{ width: "15%" }}>
                                                    <div style={{ display: "flex" }}>
                                                        <AccessTimeIcon sx={{ color: "#69A5EB", fontSize: "18px" }} />
                                                        <Typography variant="body2">
                                                            {row.start_time}
                                                        </Typography>
                                                    </div>
                                                </CardContent>
                                                <CardContent style={{ width: "15%" }}>
                                                    <div style={{ display: "flex" }}>
                                                        <CalendarMonthOutlinedIcon sx={{ color: "#69A5EB", fontSize: "18px" }} />
                                                        <Typography variant="body2">
                                                            {formatDate(row.actual_EndDate_Time)}
                                                        </Typography>
                                                    </div>
                                                </CardContent>
                                                <CardContent style={{ width: "15%" }}>
                                                    <div style={{ display: "flex" }}>
                                                        <AccessTimeIcon sx={{ color: "#69A5EB", fontSize: "18px" }} />
                                                        <Typography variant="body2">
                                                            {row.end_time}
                                                        </Typography>
                                                    </div>
                                                </CardContent>
                                                <CardContent style={{ width: "10%" }}>
                                                    <Button variant="outlined" sx={{ textTransform: "capitalize" }} disabled={formNo === null}
                                                        onClick={() => {
                                                            eventDetailPlanIDRequest(row.agg_sp_dt_eve_poc_id);
                                                            handleOpenClosure()
                                                        }}
                                                    >Closure</Button>
                                                    <Modal
                                                        open={openClosure}
                                                        onClose={handleCloseClosure}
                                                        aria-labelledby="parent-modal-title"
                                                        aria-describedby="parent-modal-description"
                                                    >
                                                        <Box sx={{ ...style, width: formNo === 1 || formNo === 2 || formNo === 7 ? 1200 : 360, borderRadius: "10px", border: "none" }}>
                                                            {formNo === 1 && <Closureone evePlanID={eventPlanID} profSD={sesStartDate} profST={sesStartTime} profED={sesEndDate} profET={sesEndTime} formNo={formNo} sessions={sessions} onClose={handleCloseClosure} />}
                                                            {formNo === 2 && <Closuretwo eveID={eveID} evePlanID={eventPlanID} srvProfID={srvProfID} profSD={sesStartDate} profST={sesStartTime} profED={sesEndDate} sessions={sessions} profET={sesEndTime} formNo={formNo} onClose={handleCloseClosure} />}
                                                            {formNo === 3 && <Closurethree evePlanID={eventPlanID} profSD={sesStartDate} profST={sesStartTime} profED={sesEndDate} profET={sesEndTime} formNo={formNo} sessions={sessions} onClose={handleCloseClosure} />}
                                                            {formNo === 4 && <Closurefour evePlanID={eventPlanID} profSD={sesStartDate} profST={sesStartTime} profED={sesEndDate} profET={sesEndTime} formNo={formNo} sessions={sessions} onClose={handleCloseClosure} />}
                                                            {formNo === 5 && <Closurefive evePlanID={eventPlanID} profSD={sesStartDate} profST={sesStartTime} profED={sesEndDate} profET={sesEndTime} formNo={formNo} sessions={sessions} onClose={handleCloseClosure} />}
                                                            {formNo === 6 && <Closuresix evePlanID={eventPlanID} profSD={sesStartDate} profST={sesStartTime} profED={sesEndDate} profET={sesEndTime} formNo={formNo} sessions={sessions} onClose={handleCloseClosure} />}
                                                            {formNo === 7 && <Closureseven evePlanID={eventPlanID} profSD={sesStartDate} profST={sesStartTime} profED={sesEndDate} profET={sesEndTime} formNo={formNo} sessions={sessions} onClose={handleCloseClosure} />}
                                                            {formNo === 8 && <Closureeight evePlanID={eventPlanID} profSD={sesStartDate} profST={sesStartTime} profED={sesEndDate} profET={sesEndTime} formNo={formNo} sessions={sessions} onClose={handleCloseClosure} />}
                                                            {formNo === 9 && <Closurenine evePlanID={eventPlanID} profSD={sesStartDate} profST={sesStartTime} profED={sesEndDate} profET={sesEndTime} formNo={formNo} sessions={sessions} onClose={handleCloseClosure} />}
                                                            {formNo === 10 && <Closureten evePlanID={eventPlanID} profSD={sesStartDate} profST={sesStartTime} profED={sesEndDate} profET={sesEndTime} formNo={formNo} sessions={sessions} onClose={handleCloseClosure} />}
                                                        </Box>
                                                    </Modal>

                                                </CardContent>
                                            </SessionCard>
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
                count={sessions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    )
}

export default Sessions
