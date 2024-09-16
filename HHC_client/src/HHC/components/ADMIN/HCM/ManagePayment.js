import React, { useState } from 'react'
import HRNavbar from '../../HR/HRNavbar'
import { Box, Stack } from '@mui/system'
import { Button, CardContent, Grid, IconButton, InputBase, MenuItem, Modal, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';

const ManagePaymentCard = styled(Card)({
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

const ManagePayment = () => {

    // ADD Modal Open Start
    const [paymentAddModal, setPaymentAddModal] = useState(false);

    const openPaymentCancelModal = () => {
        setPaymentAddModal(true);
    }

    const closePaymentCancelModal = () => {
        setPaymentAddModal(false);
    }

    // Table All Data
    const [paymentList, setPaymentList] = useState([
        {
            "Sr No": 1,
            "Event Code": "123456",
            "Added Date": "11-11-1123",
            "Patient Name": "Trial",
            "Total Cost": "12000",
            "Amount Paid": "11000",
            "Payment Mode" : "Online"
        }
    ]);

    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "20px", marginLeft: "10px" }} color="text.secondary" gutterBottom>Payment Cancellations</Typography>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: '300px', height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search Payment Details |"
                            inputProps={{ 'aria-label': 'select feedback' }}
                        />
                        <IconButton type="button" sx={{ p: '10px' }}>
                            <SearchIcon style={{ color: "#7AB7EE" }} />
                        </IconButton>
                    </Box>
                </Stack>

                <TableContainer sx={{ height: "63vh" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <ManagePaymentCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sr. No</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Event Code</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Added Date</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Patient Name</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Total Cost</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Amount Paid</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Payment Mode</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Action</Typography>
                                    </CardContent>
                                </ManagePaymentCard>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {paymentList.map((payment, index) => (
                                <TableRow key={index}>
                                    <ManagePaymentCard>
                                        <CardContent style={{ flex: 0.5 }}>
                                            <Typography variant="subtitle2">{payment["Sr No"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1.6 }}>
                                            <Typography variant="subtitle2">{payment["Event Code"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography variant="subtitle2">{payment["Added Date"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography variant="subtitle2">{payment["Patient Name"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography variant="subtitle2">{payment["Total Cost"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography variant="subtitle2">{payment["Amount Paid"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography variant="subtitle2">{payment["Payment Mode"]}</Typography>
                                        </CardContent>
                                        <CardContent style={{ flex: 1 }}>
                                            <Tooltip title="Cancel Payment" arrow>
                                                <IconButton aria-label="cancel Payment" onClick={openPaymentCancelModal}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </CardContent>
                                    </ManagePaymentCard>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>

                {/* ADD Modal Open */}
                <Modal
                    open={paymentAddModal}
                    onClose={closePaymentCancelModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: 400,
                            maxWidth: '90vw',
                            height: 'auto',
                            maxHeight: '90vh',
                            backgroundColor: 'White',
                            borderRadius: '10px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            padding: '10px',
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', px: '10px' }}>
                                <Typography variant="h6" component="h4" sx={{ flexGrow: 1 }}>
                                    Cancel Payment
                                </Typography>
                                <IconButton onClick={closePaymentCancelModal}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        <Button variant="contained" color="primary" style={{ marginBottom: "10px", marginTop: "15px" }}>
                            Cancel
                        </Button>
                    </Box>
                </Modal>
            </Box>

        </div>
    )
}

export default ManagePayment
