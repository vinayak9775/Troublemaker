import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Table, TableBody, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material";
import logo from "../../../../assets/spero_logo_3.png";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import html2PDF from 'jspdf-html2canvas';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    // boxShadow: 24,
    boxShadow: '0px 3px 5px 2px rgba(0, 0, 0, 0.2)',
    pt: 2,
    // px: 4,
    pb: 3,
};

const InvoiceCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '2px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "50px",
    borderRadius: '10px',
});

const AmountCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: "40px",
    // backgroundColor: 'white',
    marginTop: '1px',
});

const Invoice = ({ eveID, onClose }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [invoice, setInvoice] = useState([]);
    const handleDownloadPDF = () => {
        const boxElement = document.getElementById('pdfContent');

        html2PDF(boxElement, {
            jsPDF: { unit: 'px', format: 'letter', orientation: 'portrait' },
            imageType: 'image/jpeg',
            output: 'download.pdf',
        });
    };

    useEffect(() => {
        const getInvoice = async () => {
            if (eveID) {
                console.log("Invoice Event ID", eveID)
                try {
                    const res = await fetch(`${port}/web/hd_invoce_eventwise/${eveID}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Invoice ID wise.....", data.Event_Invoice);
                    setInvoice(data.Event_Invoice);
                } catch (error) {
                    console.error("Error fetching Invoice ID wise:", error);
                }
            }
        };
        getInvoice();
    }, [eveID]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;

        return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
    };

    return (
        <>
            <Box sx={{
                ...style, width: 'auto', borderRadius: "5px", border: "none",
                // maxHeight: "100%",
                // overflowY: 'auto',
                // overflowX: 'hidden',
                // marginTop: '28px',
                maxHeight: '100vh',
                overflowY: 'auto',
            }}>
                <div id="pdfContent" style={{ padding: "2em", fontWeight: "300" }}>
                    <div style={{ display: "flex" }}>
                        <Typography align="center" style={{ fontSize: "25px", fontWeight: 900, marginTop: "10px", marginLeft: "2px", }}>{invoice && invoice.length > 0 && invoice[0]?.amount_paid === 0 ? 'PROFORMA INVOICE' : 'INVOICE'}</Typography>
                        {/* <img src={logo} alt="" style={{ height: "80px", width: "125px", marginLeft: "15rem", }} /> */}
                        {invoice && invoice.length > 0 && invoice[0]?.amount_paid === 0 ? (
                            <img src={logo} alt="" style={{ height: "80px", width: "125px", marginLeft: "15rem" }} />
                        ) : (
                            <img src={logo} alt="" style={{ height: "80px", width: "125px", marginLeft: "25rem" }} />
                        )}

                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ display: "flex" }}>
                                <Typography align="center" variant='subtitle2'>Event ID</Typography>
                                <Typography align="center" variant='body2' sx={{ ml: 1 }}>{invoice[0] ? invoice[0].eve_id : ""}</Typography>
                            </div>
                            <div style={{ display: "flex" }}>
                                <Typography align="center" variant='subtitle2'>Event Date</Typography>
                                <Typography align="center" variant='body2' sx={{ ml: 1 }}>{invoice[0] ? invoice[0].event_date : ""}</Typography>
                            </div>
                            <div style={{ display: "flex" }}>
                                <Typography align="center" variant='subtitle2'>Last Updated</Typography>
                                <Typography align="center" variant='body2' sx={{ ml: 1 }}>{invoice[0] ? formatDate(invoice[0].last_modified_date) : ""}</Typography>
                            </div>
                        </div>
                        <div>
                            <Typography align="center" variant='subtitle2' sx={{ ml: 18 }} style={{ fontSize: "15px", fontWeight: 600 }}>BILL DETAILS</Typography>
                            <div style={{ display: "flex" }}>
                                <Typography align="center" variant='subtitle2' sx={{ ml: 2 }}>Invoice ID</Typography>
                                <Typography align="center" variant='body2' sx={{ ml: 1 }}>{invoice[0] ? invoice[0].hospital_code : 'None'} / {invoice[0] ? invoice[0].years_range : 'None'} / {(invoice && invoice.length > 0 && invoice[0].invoice_id) ? invoice[0].invoice_id : '0000'}</Typography>
                            </div>
                            <div style={{ display: "flex" }}>
                                <Typography align="center" variant='subtitle2' sx={{ ml: 16 }}>Date:</Typography>
                                <Typography align="center" variant='body2' sx={{ ml: 1 }}>{invoice[0] ? invoice[0].event_date : ""}</Typography>
                            </div>
                        </div>
                    </div>
                    <hr />

                    <div>
                        <Typography sx={{ fontSize: 15, fontWeight: 600, }} gutterBottom>PATIENT DETAILS</Typography>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ display: "flex", marginTop: "10px" }}>
                                    <Typography inline variant="subtitle2">Name:</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 1 }}>{invoice[0] ? invoice[0].patient_name : ""}</Typography>
                                </div>

                                <div style={{ display: "flex", marginTop: "10px" }}>
                                    <Typography inline variant="subtitle2">Mobile:</Typography>
                                    <Typography inline variant="body2" sx={{ ml: 1 }}>{invoice[0] ? invoice[0].patient_number : ""}</Typography>
                                </div>

                                <div>
                                    <Typography inline variant="body2" sx={{ mt: 1.2 }}><b>Residential Address:</b> {invoice[0] ? invoice[0].patient_google_address : ""}</Typography>
                                    <Typography inline variant="body2" sx={{ mt: 1.5 }}><b>Permanent Address:</b> {invoice[0] ? invoice[0].patient_address : ""}</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />

                    <div>
                        <Typography sx={{ fontSize: 15, fontWeight: 600, }} gutterBottom>SERVICE DETAILS</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <b>Service:</b> {invoice[0]?.service_name}
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <b>Sub Service:</b> {invoice[0]?.sub_service_name}
                        </Typography>

                        <TableContainer sx={{ mt: 1 }}>
                            <Table>
                                <TableHead >
                                    <TableRow >
                                        <InvoiceCard style={{ height: "40px", background: "#FAAF30", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                            <CardContent style={{ width: "25%" }}>
                                                <Typography variant='subtitle2'>Professional Name</Typography>
                                            </CardContent>
                                            <CardContent style={{ width: "5%", }}>
                                                <Typography variant='subtitle2'>Sessions</Typography>
                                            </CardContent>
                                            <CardContent style={{ width: "12%" }}>
                                                <Typography variant='subtitle2'>Start Date</Typography>
                                            </CardContent>
                                            <CardContent style={{ width: "12%" }}>
                                                <Typography variant='subtitle2'>End Date</Typography>
                                            </CardContent>
                                            <CardContent style={{ width: "10%" }}>
                                                <Typography variant='subtitle2'>Amount</Typography>
                                            </CardContent>
                                        </InvoiceCard>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.length === 0 ? (
                                        <TableRow>
                                            <CardContent >
                                                <Typography variant="body2" sx={{ ml: 40 }}>
                                                    No Data Available
                                                </Typography>
                                            </CardContent>
                                        </TableRow>
                                    ) : (invoice.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {row.professional_amount.map((professional, profIndex) => (
                                                <InvoiceCard key={profIndex}>
                                                    <CardContent style={{ width: "25%" }}>
                                                        <Typography variant="body2">
                                                            {professional.professional_name}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ width: "2%" }}>
                                                        <Typography variant="body2">
                                                            {professional.sessions}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ width: "12%" }}>
                                                        <Typography variant="body2">
                                                            {professional.start_date}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ width: "12%" }}>
                                                        <Typography variant="body2">
                                                            {professional.end_date}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent style={{ width: "10%" }}>
                                                        <Typography variant="body2">
                                                            ₹{professional.amount}
                                                        </Typography>
                                                    </CardContent>
                                                </InvoiceCard>
                                            ))}
                                        </TableRow>
                                    )
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {invoice && invoice[0] && invoice[0].conveniance_charges !== null && invoice[0].conveniance_charges !== 0 ? (
                            <>
                                <hr />
                                <div style={{ display: "flex", marginLeft: "16px", marginTop: "10px" }}>
                                    <Typography variant='subtitle2'>Convenience charges </Typography>
                                    <Typography variant='subtitle2' sx={{ ml: 48 }}>₹{invoice[0] ? invoice[0].conveniance_charges : ''}</Typography>
                                </div>
                            </>
                        ) : null}
                        {invoice && invoice[0] && typeof invoice[0].discount_type !== 'undefined' && (invoice[0].discount_type === 1 || invoice[0].discount_type === 2) ? (
                            <>
                                <hr />
                                <div style={{ display: "flex", marginLeft: "16px", marginTop: "10px" }}>
                                    <Typography variant='subtitle2'>Discount Value ({invoice[0].discount_type === 1 ? "%" : "₹"})</Typography>
                                    <Typography variant='subtitle2' sx={{ ml: 50 }}>{invoice[0].discount_value}</Typography>
                                </div>
                            </>
                        ) : null}
                        <hr />
                        {/* <div style={{ display: "flex", marginLeft: "16px", marginTop: "10px" }}>
                            <Typography variant='subtitle2' style={{ fontWeight: 600 }}>Total (INR)</Typography>
                            <Typography variant='subtitle2' sx={{ ml: 56.6 }}>{invoice[0] ? `₹${invoice[0].Total_amount}` : ''}</Typography>
                        </div> */}

                        <div style={{ display: "flex", marginLeft: "16px", marginTop: "10px" }}>
                            <Typography variant='subtitle2' style={{ fontWeight: 600 }}>Final Amt (INR)</Typography>
                            <Typography variant='subtitle2' sx={{ ml: 52.8 }}>{invoice[0] ? `₹${invoice[0].Final_amount}` : ''}</Typography>
                        </div>

                        {invoice && invoice.length > 0 && invoice[0]?.amount_paid === 0 ? (
                            <div style={{ display: "flex", marginLeft: "16px", marginTop: "10px" }}>
                                <Typography variant='subtitle2' style={{ fontWeight: 600 }}>Paid Amt (INR)</Typography>
                                <Typography variant='subtitle2' sx={{ ml: 53 }}>{invoice[0] ? `₹${invoice[0].amount_paid}` : ''}</Typography>
                            </div>
                        ) : null}

                    </div>

                    <div style={{ marginTop: "40px", marginLeft: "10px", }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 600, }} gutterBottom>Declaration:</Typography>
                        <Typography variant="body2">We declare that this Bill shows the actual price of the services described and that all particulars are true and correct.</Typography>
                    </div>

                    <Box style={{ width: "110%", background: '#15CEC9', marginLeft: "-32px", marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                        <CardContent>
                            <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "24px", }}>
                                <div>
                                    <Typography align="center" variant='subtitle2' sx={{ mr: 2 }}>Company's Bank Detail:</Typography>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography align="center" variant='subtitle2'>Bank details</Typography>
                                        <Typography align="center" variant='body2' sx={{ ml: 1 }}>HDFC BANK</Typography>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography align="center" variant='subtitle2'>IFSC code</Typography>
                                        <Typography align="center" variant='body2' sx={{ ml: 1 }}>ABCD0000XX</Typography>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography align="center" variant='subtitle2'>Swift code</Typography>
                                        <Typography align="center" variant='body2' sx={{ ml: 1 }}>ABCD0000XX</Typography>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography align="center" variant='subtitle2'>Account</Typography>
                                        <Typography align="center" variant='body2' sx={{ ml: 1 }}>000000000000</Typography>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardContent>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ display: "flex", marginTop: "10px" }}>
                                        <PhoneOutlinedIcon sx={{ color: "#4A4A4A" }} />
                                        <Typography align="center" variant='body2' sx={{ ml: 1 }}>9007986666</Typography>
                                    </div>
                                    <div style={{ display: "flex", marginTop: "10px" }}>
                                        <EmailOutlinedIcon sx={{ color: "#4A4A4A" }} />
                                        <Typography align="center" variant='body2' sx={{ ml: 1 }}>info@sperohealthcare.in</Typography>
                                    </div>
                                    <div style={{ display: "flex", marginTop: "10px" }}>
                                        <LanguageOutlinedIcon sx={{ color: "#4A4A4A", }} />
                                        <Typography align="center" variant='body2' sx={{ ml: 1 }}>sperohealthcare.in</Typography>
                                    </div>

                                </div>
                            </div>
                        </CardContent>
                    </Box>
                    <hr style={{
                        width: "109.8%", height: "5px", background: '#FAAF30', marginLeft: "-32px",
                        // marginBottom: "-25px", 
                        marginTop: "-5px",
                    }} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-20px", }}>
                    <Button variant="contained" onClick={handleDownloadPDF} sx={{ background: "#B50001", '&:hover': { backgroundColor: '#B50001', cursor: 'pointer', }, }}><PictureAsPdfOutlinedIcon /></Button>
                    <Button variant="contained" onClick={onClose} sx={{ color: "#FFFFFF", ml: 1 }}><CloseIcon /></Button>
                </div>
            </Box>

        </>
    )
}

export default Invoice
