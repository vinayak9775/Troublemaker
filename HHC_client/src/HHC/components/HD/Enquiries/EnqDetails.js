import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { border, styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { Typography, Grid, Box, Card, CardContent, Table, TableBody, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material";

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

const EnqDetails = ({ eveID, onClose }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [details, setDetails] = useState([]);
    console.log(eveID,'eveIDeveIDeveID');
    

    useEffect(() => {
        const getEventDetails = async () => {
          if (eveID) {
            try {
              const res = await fetch(`${port}/web/enquirie_SingleRecord/${eveID}/`);
              const data = await res.json();
              
              // Log the full data response
              console.log("Full API Response:", data);
    
              if (data && data.Detials) {
                console.log("enqqqqqqqq Details....", data.Detials.caller_name);
                setDetails(data.Detials);
              } else {
                console.warn("API response does not contain the expected structure:", data);
              }
            } catch (error) {
              console.error("Error fetching Event Details:", error);
            }
          }
        };
    
        getEventDetails();
      }, [port, eveID]);
      
    if (!details) {
        return <div>Loading...</div>;
    }

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

                    <Typography align="center" style={{ fontSize: 18, fontWeight: 600, color: "gray", marginTop: "10px", }}>ENQUIRY DETAILS</Typography>
                    <Button onClick={onClose} sx={{ ml: "41rem", color: "gray", marginTop: "2px", }}><CloseIcon /></Button>
                </div>
                <hr />
                <div>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>CALLER DETAILS</Typography>
                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Contact</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>+91 {details.caller_phone}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Name</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.caller_name}</Typography>
                    </Grid>
                </div>

                <div style={{ marginTop: "15px" }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>PATIENT DETAILS</Typography>
                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Name</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.patient_name}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Mobile</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>+91 {details.patient_phone}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Email Id</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.patient_gmail}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Gender</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.patient_gender}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Residential Address</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.patient_Google_address}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Permanent Address</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.patient_address}</Typography>
                    </Grid>

                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Zone</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.zone}</Typography>
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
                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Service</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.service_name}</Typography>
                    </Grid>
                    <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Sub Service Name</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.sub_srv_name}</Typography>
                    </Grid><Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Hospital Name</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.hospital_name}</Typography>
                    </Grid><Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Consultant Name</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.consultant_name}</Typography>
                    </Grid><Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Consultant Number</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.consultant_number}</Typography>
                    </Grid><Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Suffered From</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.suffered_from}</Typography>
                    </Grid><Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Start Date</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.start_date}</Typography>
                    </Grid><Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">End Date</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.end_date}</Typography>
                    </Grid><Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                        <Typography inline variant="body2" color="text.secondary">Enquiry From</Typography>
                        <Typography inline variant="body2" sx={{ ml: 2 }}>{details.Enquirie_from}</Typography>
                    </Grid>

                    {/* <Typography variant='body2' sx={{ mt: 1 }}><b>Service:</b> {details.service_name}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Sub Service:</b> {details.sub_srv_name}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Hospital Name:</b> {details.hospital_name}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Consultant Name:</b> {details.consultant_name}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Consultant Number:</b> {details.consultant_number}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Suffered From:</b> {details.suffered_from}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Start Date:</b> {details.start_date}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>End Date:</b> {details.end_date}</Typography>
                    <Typography variant='body2' sx={{ mt: 1 }}><b>Enquiry From:</b> {details.Enquirie_from}</Typography> */}
                    {/* <Typography variant='body2' sx={{ mt: 1 }}><b>End Date:</b> {details.end_date}</Typography> */}


                    {/* <TableContainer sx={{ mt: 1 }}>
                        <Table>
                            <TableHead >
                                <TableRow >
                                    <DetailsCard style={{ background: "#FAAF30", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                       
                                        <CardContent style={{ width: "15%" }}>
                                            <Typography variant='subtitle2'>Professional Name</Typography>
                                        </CardContent>
                                        <CardContent style={{ width: "5%", }}>
                                            <Typography variant='subtitle2'>Sessions</Typography>
                                        </CardContent>
                                        <CardContent style={{ width: "15%" }}>
                                            <Typography variant='subtitle2'>Start Date Time</Typography>
                                        </CardContent>
                                        <CardContent style={{ width: "15%" }}>
                                            <Typography variant='subtitle2'>End Date Time</Typography>
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
                                    
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                    <DetailsCard key={index}>
                                                
                                                        <CardContent style={{ width: "15%" }}>
                                                            <Typography variant="body2">
                                                                {row.caller_name}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ width: "5%" }}>
                                                            <Typography variant="body2">
                                                                {row.caller_phone}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ width: "15%" }}>
                                                            <Typography variant="body2" >
                                                                {row.start_date} | {row.start_time}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ width: "15%" }}>
                                                            <Typography variant="body2">
                                                                {row.end_date} | {row.end_time}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ width: "10%" }}>
                                                            <Typography variant="body2">
                                                                ₹{row.amount}
                                                            </Typography>
                                                        </CardContent>
                                                     
                                                    </DetailsCard>
                                            </TableRow>
                                        )}
                                        
                            </TableBody>
                        </Table>
                    </TableContainer> */}
                </div>
            </Box>
        </>
    )
}

export default EnqDetails
