import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { border, styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Typography, Modal, Grid, Box, Card, CardContent, Table, TableBody, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material";

const DetailsCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '5px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "44px",
    borderRadius: '10px',
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    pt: 2,
    px: 4,
    pb: 3,
};

const EventDetails = ({ eveID, onClose }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [details, setDetails] = useState([]);
    const [sesDetails, setSesDetails] = useState([]);
    const [openSessions, setOpenSessions] = useState(false);

    useEffect(() => {
        const getEventDetails = async () => {
            if (eveID) {
                try {
                    const res = await fetch(`${port}/web/SingleRecord/${eveID}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Event Details....", data);
                    setDetails(data.Event_Invoice);
                } catch (error) {
                    console.error("Error fetching Event Details:", error);
                }
            }
        };
        getEventDetails();
    }, [eveID]);

    useEffect(() => {
        const getSesDetails = async () => {
            if (eveID) {
                try {
                    const res = await fetch(`${port}/web/all_session_details/${eveID}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Session Details....", data);
                    setSesDetails(data.all_session_details);
                } catch (error) {
                    console.error("Error fetching Session Details:", error);
                }
            }
        };
        getSesDetails();
    }, [eveID]);

    const handleOpenSessions = () => {
        setOpenSessions(true);
    };
    const handleCloseSessions = () => {
        setOpenSessions(false);
    };

    return (
        <>
            <Box
                sx={{
                    ...style,
                    width: "70%",
                    height: "100%",
                    overflowY: "scroll",
                    overflowX: "hidden",
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                        width: '0.2em',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: "#DCDCDE",
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#7AB8EE',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#7AB8FF'
                    }
                }}
            >
                <div style={{ display: "flex" }}>
                    <Typography align="center" style={{ fontSize: 18, fontWeight: 600, color: "gray", marginTop: "10px", }}>EVENT DETAILS</Typography>
                    <Button onClick={onClose} sx={{ ml: "46rem", color: "gray", marginTop: "2px", }}><CloseIcon /></Button>
                </div>
                <hr />

                <div>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>CALLER DETAILS</Typography>
                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Contact</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>+91 {details[0]?.caller.caller_number ?? ""}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Name</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details[0]?.caller.caller_name ?? ""}</Typography>
                    </Grid>
                </div>

                <div style={{ marginTop: "15px" }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>PATIENT DETAILS</Typography>
                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Name</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details[0]?.patient.patient_name ?? ""}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Mobile</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>+91 {details[0]?.patient.patient_contact ?? ""}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Age</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}> {details[0]?.patient.patient_age ?? ""}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Gender</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}> {details[0]?.patient.patient_gender ?? ""}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Email Id</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details[0]?.patient.patient_email ?? ""}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Residential Address</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details[0]?.patient_Google_address ?? ""}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Permanent Address</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details[0]?.patient_address ?? ""}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Location</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>Pune, Maharashtra, India</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Pincode</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>411051</Typography>
                    </Grid>

                    {/* <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Landline</Typography>
                        <Typography inline variant="body2" color="text.secondary">-</Typography>
                    </Grid> */}

                    {/* <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">DOB</Typography>
                        <Typography inline variant="body2" color="text.secondary">-</Typography>
                    </Grid> */}
                </div>

                <div style={{ marginTop: "15px" }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>SERVICE DETAILS</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Service:</b> {details[0]?.service_name}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Sub Service:</b> {details[0]?.sub_service_name}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Hospital Name:</b> {details[0]?.service.hospital_name}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Consultant Name:</b> {details[0]?.service.consultant_name}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Suffered From:</b> {details[0]?.service.suffer_from}</Typography>
                    <TableContainer sx={{ mt: 1 }}>
                        <Table>
                            <TableHead >
                                <TableRow >
                                    <DetailsCard style={{ background: "#FAAF30", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                        {/* <CardContent style={{ width: "15%" }}>
                                            <Typography variant='subtitle2'>Service Name</Typography>
                                        </CardContent > */}
                                        <CardContent style={{ width: "15%" }}>
                                            <Typography variant='subtitle2'>Professional Name</Typography>
                                        </CardContent>
                                        <CardContent style={{ width: "5%", }}>
                                            <Typography variant='subtitle2'>Sessions</Typography>
                                        </CardContent>
                                        <CardContent style={{ width: "15%" }}>
                                            <Typography variant='subtitle2'>Start Date</Typography>
                                        </CardContent>
                                        <CardContent style={{ width: "15%" }}>
                                            <Typography variant='subtitle2'>End Date</Typography>
                                        </CardContent>
                                        <CardContent style={{ width: "10%", }}>
                                            <Typography variant='subtitle2'>Session Amt</Typography>
                                        </CardContent>
                                        <CardContent style={{ width: "10%" }}>
                                            <Typography variant='subtitle2'>Convenience</Typography>
                                        </CardContent>
                                        <CardContent style={{ width: "10%" }}>
                                            <Typography variant='subtitle2'>Total Amt</Typography>
                                        </CardContent>
                                        {/* <CardContent style={{ width: "5%" }}>
                                            <Typography variant='subtitle2'>Action</Typography>
                                        </CardContent> */}
                                    </DetailsCard>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {details.length === 0 ? (
                                    <TableRow>
                                        <CardContent >
                                            <Typography variant="body2" sx={{ ml: 40 }}>
                                                No Data Available
                                            </Typography>
                                        </CardContent>
                                    </TableRow>
                                ) : (
                                    details
                                        .map((row, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                {row.professional_amount.map((professional, profIndex) => (
                                                    <DetailsCard key={profIndex}>
                                                        {/* <CardContent style={{ width: "15%" }}>
                                                            <Typography variant="subtitle2">
                                                                {row.service_name}
                                                            </Typography>
                                                        </CardContent> */}
                                                        <CardContent style={{ width: "15%" }}>
                                                            <Typography variant="body2">
                                                                {professional.professional_name}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ width: "5%" }}>
                                                            <Typography variant="body2">
                                                                {professional.sessions}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ width: "15%" }}>
                                                            <Typography variant="body2" >
                                                                {professional.start_date}
                                                                {/* {professional.start_date} | {professional.start_time} */}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ width: "15%" }}>
                                                            <Typography variant="body2">
                                                                {professional.end_date}
                                                                {/* {professional.end_date} | {professional.end_time} */}
                                                            </Typography>
                                                        </CardContent>
                                                        {/* <CardContent style={{ width: "10%" }}>
                                                            <Typography variant="body2">
                                                                ₹{professional.amount},
                                                            </Typography>
                                                        </CardContent> */}
                                                        {row.service_name === 'Medical transportation' ? (
                                                            <CardContent style={{ width: "10%" }}>
                                                                <Typography variant='body2'>
                                                                    ₹{row.sessions ? (row.Total_amount / row.sessions) : professional.amount}
                                                                </Typography>
                                                            </CardContent>
                                                        ) : (
                                                            <CardContent style={{ width: "10%" }}>
                                                                <Typography variant='body2'>₹{professional.amount}</Typography>
                                                            </CardContent>
                                                        )}
                                                        <CardContent style={{ width: "10%" }}>
                                                            <Typography variant="body2">
                                                                {/* ₹{professional.convinance ? professional.convinance : '0'} */}
                                                                ₹{professional.conv_charges ? professional.conv_charges : '0'}
                                                            </Typography>
                                                        </CardContent>
                                                        {/* <CardContent style={{ width: "10%" }}>
                                                            <Typography variant="body2">
                                                                ₹{professional.prof_tot_amt ? professional.prof_tot_amt : '0'}
                                                            </Typography>
                                                        </CardContent> */}

                                                        {row.service_name === 'Medical transportation' ? (
                                                            <CardContent style={{ width: "10%" }}>
                                                                <Typography variant='body2'>
                                                                    ₹{row.sessions ? (((row.Total_amount / row.sessions) + professional.conv_charges )*professional.sessions) : professional.amount}
                                                                </Typography>
                                                            </CardContent>
                                                        ) : (
                                                            <CardContent style={{ width: "10%" }}>
                                                                <Typography variant="body2">
                                                                    ₹{professional.prof_tot_amt ? professional.prof_tot_amt : '0'}
                                                                </Typography>
                                                            </CardContent>
                                                        )}
                                                        {/* <CardContent style={{ width: "5%" }}>
                                                            <RemoveRedEyeOutlinedIcon sx={{ fontSize: "20px", color: "#606467" }} onClick={handleOpenSessions} />
                                                        </CardContent> */}
                                                        <Modal
                                                            open={openSessions}
                                                            onClose={handleCloseSessions}
                                                            aria-labelledby="parent-modal-title"
                                                            aria-describedby="parent-modal-description"
                                                        >
                                                            <Box sx={{ ...style, width: 650, borderRadius: "10px", border: "none" }}>
                                                                <div style={{ display: "flex" }}>
                                                                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "gray", marginTop: "10px" }}>SESSION DETAILS</Typography>
                                                                    <Button onClick={handleCloseSessions} sx={{ marginLeft: "450px", color: "gray", marginTop: "2px", }}><CloseIcon /></Button>
                                                                </div>

                                                                <TableContainer sx={{ mt: 1, maxHeight: sesDetails.length >= 8 ? '450px' : 'auto', overflowY: sesDetails.length >= 8 ? 'scroll' : 'visible' }}>
                                                                    <Table>
                                                                        <TableHead >
                                                                            <TableRow >
                                                                                <DetailsCard style={{ background: "#FAAF30", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                                                                    <CardContent style={{ width: "30%" }}>
                                                                                        <Typography variant='subtitle2'>Professional Name</Typography>
                                                                                    </CardContent>
                                                                                    {details[0]?.service_name === 'Medical transportation' &&
                                                                                        (
                                                                                            <CardContent style={{ width: "20%" }}>
                                                                                                <Typography variant='subtitle2'>Ambulance No</Typography>
                                                                                            </CardContent>
                                                                                        )}
                                                                                    <CardContent style={{ width: "25%" }}>
                                                                                        <Typography variant='subtitle2'>Start Date Time</Typography>
                                                                                    </CardContent>
                                                                                    <CardContent style={{ width: "25%" }}>
                                                                                        <Typography variant='subtitle2'>End Date Time</Typography>
                                                                                    </CardContent>
                                                                                </DetailsCard>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {sesDetails.length === 0 ? (
                                                                                <TableRow>
                                                                                    <CardContent >
                                                                                        <Typography variant="body2" sx={{ ml: 40 }}>
                                                                                            No Data Available
                                                                                        </Typography>
                                                                                    </CardContent>
                                                                                </TableRow>
                                                                            ) : (
                                                                                sesDetails
                                                                                    .map((professional, index) => (
                                                                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                                            <DetailsCard key={index}>
                                                                                                <CardContent style={{ width: "30%" }}>
                                                                                                    <Typography variant="body2">
                                                                                                        {professional.professional_name}
                                                                                                    </Typography>
                                                                                                </CardContent>

                                                                                                {details[0]?.service_name === 'Medical transportation' &&
                                                                                                    (
                                                                                                        <CardContent style={{ width: "20%" }}>
                                                                                                            <Typography variant='body2'>{professional.ambs}</Typography>
                                                                                                        </CardContent>
                                                                                                    )}
                                                                                                <CardContent style={{ width: "25%" }}>
                                                                                                    <Typography variant="body2" >
                                                                                                        {professional.start_date} | {professional.start_time}
                                                                                                    </Typography>
                                                                                                </CardContent>
                                                                                                <CardContent style={{ width: "25%" }}>
                                                                                                    <Typography variant="body2">
                                                                                                        {professional.end_date} | {professional.end_time}
                                                                                                    </Typography>
                                                                                                </CardContent>
                                                                                            </DetailsCard>
                                                                                        </TableRow>
                                                                                    )
                                                                                    ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableContainer>
                                                            </Box>
                                                        </Modal>
                                                    </DetailsCard>
                                                ))}
                                                <div style={{ display: "flex", marginTop: "12px" }}>
                                                    <Typography sx={{ ml: 2 }} variant='subtitle2'>View all session details:</Typography> <RemoveRedEyeOutlinedIcon sx={{ fontSize: "22px", color: "#606467", cursor: "pointer", ml: 85 }} onClick={handleOpenSessions} />
                                                </div>
                                            </TableRow>
                                        )
                                        ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div style={{ marginTop: "15px" }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>PAYMENT DETAILS</Typography>
                    <DetailsCard style={{ background: "#FAAF30", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="subtitle2">Payment date</Typography>
                        </CardContent>
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="body2">Payment mode</Typography>
                        </CardContent>
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="body2">Discount type</Typography>
                        </CardContent>
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="body2">Discount Amt</Typography>
                        </CardContent>
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="body2">Convenience charges</Typography>
                        </CardContent>
                        <CardContent style={{ width: "20%" }}>
                            <Typography variant="body2">UTR</Typography>
                        </CardContent>
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="body2">Final Amt </Typography>
                        </CardContent>
                    </DetailsCard>

                    <DetailsCard >
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="body2">
                                {details[0]?.payment_date ? details[0].payment_date.slice(0, 10) : 'None'}
                            </Typography>
                        </CardContent>
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="body2">
                                {details[0]?.payment_mode === 1 ? 'Cash' :
                                    details[0]?.payment_mode === 2 ? 'Cheque' :
                                        details[0]?.payment_mode === 3 ? 'Online' :
                                            details[0]?.payment_mode === 4 ? 'Card' :
                                                details[0]?.payment_mode === 5 ? 'QR' :
                                                    details[0]?.payment_mode === 6 ? 'NEFT' : 'None'}
                            </Typography>
                        </CardContent>
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="body2">
                                {details[0]?.discount_type === 1 ? '%' :
                                    details[0]?.discount_type === 2 ? '₹' :
                                        details[0]?.discount_type === 3 ? 'Complementary' :
                                            details[0]?.discount_type === 4 ? 'VIP' : 'None'}
                            </Typography>
                        </CardContent>
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="body2">
                                {details[0]?.discount_value ? details[0]?.discount_value : "None"}
                            </Typography>
                        </CardContent>
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="body2">
                                ₹{details[0]?.conveniance_charges}
                            </Typography>
                        </CardContent>
                        <CardContent style={{ width: "20%" }}>
                            <Typography variant="body2">
                                {details[0]?.utr ? details[0]?.utr : "None"}
                            </Typography>
                        </CardContent>
                        <CardContent style={{ width: "10%" }}>
                            <Typography variant="body2">
                                ₹{details[0]?.Final_amount}
                            </Typography>
                        </CardContent>
                    </DetailsCard>
                </div>
            </Box>
        </>
    )
}

export default EventDetails
