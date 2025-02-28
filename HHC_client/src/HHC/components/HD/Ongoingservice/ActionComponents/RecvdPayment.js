import React, { useState, useEffect } from 'react';
import { Box, Grid, MenuItem, Typography, TextField, Button, Alert, Snackbar } from "@mui/material"

const payMode = [
    {
        mode_id: 1,
        label: 'Cash',
    },
    {
        mode_id: 2,
        label: 'Cheque',
    },
    {
        mode_id: 4,
        label: 'Card',
    },
    {
        mode_id: 5,
        label: 'QR Code',
    },
    {
        mode_id: 6,
        label: 'NEFT',
    },
];

const RecvdPayment = ({ eveID, ptnData, payAmt, sesCount }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [selectedPayMode, setSelectedPayMode] = useState(1);
    const [chequeNo, setChequeNo] = useState('');
    const [chequeDate, setChequeDate] = useState('');
    const [chequeImg, setChequeImg] = useState('');
    const [bankName, setBankName] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [transNo, setTransNo] = useState('');
    const [utr, setUTR] = useState('');

    const [remark, setRemark] = useState('')
    const [prof, setProf] = useState(null);
    const [selectedProf, setSelectedProf] = useState();

    const [amountError, setAmountError] = useState('');
    const [amount, setAmount] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [errors, setErrors] = useState({
        chequeNo: '',
        chequeDate: '',
        chequeImg: '',
        bankName: '',
        cardNo: '',
        transNo: '',
        remark: '',
    });

    const handleEmptyField = () => {
        const newErrors = {};
        // if (!selectedProf) {
        //     newErrors.selectedProf = 'This field is required';
        // }
        if (!amount) {
            newErrors.amount = 'This field is required';
        }
        if (!remark) {
            newErrors.remark = 'This field is required';
        }
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    useEffect(() => {
        const getProfessional = async () => {
            if (eveID) {
                console.log("eveID...", eveID)
                try {
                    let apiUrl = `${port}/web/get_payment_with_prof_eve_detail/${eveID}/`;
                    const res = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    // console.log("Professional Name.........", data);
                    if (data.msg === "Professional Not Available") {
                        setProf(null);
                    } else {
                        setProf(data);
                    }
                } catch (error) {
                    console.error("Error fetching Professional List:", error);
                    // setLoading(false);
                }
            };
        }
        getProfessional();
    }, [eveID]);

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        validateAmount(value);
    };

    const validateAmount = (value) => {
        if (parseFloat(value) !== parseFloat(payAmt.final_amount)) {
            // setAmountError(`Amount must be equal to ${payAmt.final_amount}`);
            setAmountError(`Amount must be equal to Total Payable`);
        } else {
            setAmountError('');
        }
    };

    async function handleCashPaymentSubmit(event) {
        event.preventDefault();
        if (!!amountError) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill valid details.');
            setSnackbarSeverity('error');
            return;
        }
        handleEmptyField();

        let hasEmptyFields = false;

        if (!selectedPayMode) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please select a payment mode.');
            setSnackbarSeverity('error');
            return;
        }

        if (!remark) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill required details.');
            setSnackbarSeverity('error');
            return;
        }

        if (selectedPayMode === 2 && (!chequeNo || !chequeDate || !bankName)) {
            setErrors({
                chequeNo: !chequeNo ? 'This field is required' : '',
                chequeDate: !chequeDate ? 'This field is required' : '',
                // chequeImg: !chequeImg ? 'This field is required' : '',
                bankName: !bankName ? 'This field is required' : '',
            });
            hasEmptyFields = true;
        } else if (selectedPayMode === 4 && (!cardNo || !transNo)) {
            setErrors({
                cardNo: !cardNo ? 'This field is required' : '',
                transNo: !transNo ? 'This field is required' : '',
            });
            hasEmptyFields = true;
        } else if ((selectedPayMode === 5 || selectedPayMode === 6) && !transNo) {
            setErrors({
                transNo: 'This field is required',
            });
            hasEmptyFields = true;
        }

        if (hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill all * mark fields.');
            setSnackbarSeverity('error');
            return;
        }

        const requestData = {
            eve_id: eveID,
            Total_cost: payAmt.final_amount,
            paid_by: ptnData.name,
            amount_paid: amount,
            no_of_session: sesCount,
            amount_remaining: 0,
            // srv_prof_id: selectedProf,
            srv_prof_id: prof.prof_id,
            mode: selectedPayMode,
            utr: utr,
            Remark: remark,
        };
        if (selectedPayMode === 2) {
            requestData.cheque_number = chequeNo;
            requestData.cheque_date = chequeDate;
            // requestData.cheque_image = chequeImg;
            requestData.bank_name = bankName;
        } else if (selectedPayMode === 4) {
            requestData.card_no = cardNo;
            requestData.transaction_id = transNo;
        } else if (selectedPayMode === 5 || selectedPayMode === 6) {
            requestData.transaction_id = transNo;
        }
        console.log("POST API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/collect_amt_frm_prof/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                return;
            }
            const result = await response.json();
            console.log("Cash Payment data", result);
            setOpenSnackbar(true);
            setSnackbarMessage('Payment saved successfully.');
            setSnackbarSeverity('success');
            window.location.reload();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <Box
            sx={{
                width: '100%', typography: 'body1', mt: 2,
                height: "30rem",
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
                },
            }}>
            <Grid container spacing={2}>

                <Grid item lg={12} sm={12} xs={12} sx={{ mt: 2 }}>
                    <TextField
                        required
                        label="Received by professional"
                        id="srv_prof_id"
                        name="srv_prof_id"
                        // value={selectedProf}
                        // onChange={(e) => setSelectedProf(e.target.value)}
                        value={prof ? prof.pay_recived_by : 'None'}
                        size="small"
                        fullWidth
                        sx={{
                            '& input': {
                                fontSize: '16px',
                            },
                        }}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: {
                                    style: {
                                        maxHeight: '120px',
                                        maxWidth: '200px',
                                    },
                                },
                            },
                        }}
                    // error={!!errors.selectedProf}
                    // helperText={errors.selectedProf}
                    />
                    {/* {prof.map((option) => (
                            <MenuItem key={option.srv_prof_id} value={option.srv_prof_id} sx={{ fontSize: "14px" }}>
                                {option.prof_fullname}
                            </MenuItem>
                        ))}
                    </TextField> */}
                </Grid>

                <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                    <TextField
                        id="mode_id"
                        name="mode_id"
                        label="Mode of payment"
                        select
                        value={selectedPayMode}
                        onChange={(e) => setSelectedPayMode(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{
                            textAlign: "left", '& input': {
                                fontSize: '14px',
                            },
                        }}
                    >
                        {payMode.map((option) => (
                            <MenuItem key={option.mode_id} value={option.mode_id}
                                sx={{ fontSize: "14px" }}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {selectedPayMode === 2 && (
                    <>
                        <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                            <TextField
                                required
                                label="Cheque no"
                                value={chequeNo}
                                onChange={(e) => setChequeNo(e.target.value)}
                                size="small"
                                fullWidth
                                sx={{
                                    textAlign: "left",
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                error={!!errors.chequeNo}
                                helperText={errors.chequeNo}
                            />
                        </Grid>
                        <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                            <TextField
                                required
                                label="Cheque date"
                                type="date"
                                value={chequeDate}
                                onChange={(e) => setChequeDate(e.target.value)}
                                size="small"
                                fullWidth
                                sx={{
                                    textAlign: "left",
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!errors.chequeDate}
                                helperText={errors.chequeDate}
                            />
                        </Grid>
                        {/* <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                            <TextField
                                required
                                label="Upload cheque"
                                type="file"
                                value={chequeImg}
                                onChange={(e) => setChequeImg(e.target.value)}
                                size="small"
                                fullWidth
                                sx={{
                                    textAlign: "left",
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={!!errors.chequeImg}
                                helperText={errors.chequeImg}
                            />
                        </Grid> */}
                        <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                            <TextField
                                required
                                label="Bank Name"
                                id="bank_name"
                                name="bank_name"
                                placeholder='Enter bank name'
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                size="small"
                                fullWidth
                                sx={{
                                    textAlign: "left",
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                error={!!errors.bankName}
                                helperText={errors.bankName}
                            />
                        </Grid>
                    </>
                )}

                {selectedPayMode === 4 && (
                    <>
                        <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                            <TextField
                                required
                                label="Card Number"
                                value={cardNo}
                                onChange={(e) => setCardNo(e.target.value)}
                                size="small"
                                fullWidth
                                sx={{
                                    textAlign: "left",
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                error={!!errors.cardNo}
                                helperText={errors.cardNo}
                            />
                        </Grid>
                        <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                            <TextField
                                required
                                label="Transaction Number"
                                value={transNo}
                                onChange={(e) => setTransNo(e.target.value)}
                                size="small"
                                fullWidth
                                sx={{
                                    textAlign: "left",
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                error={!!errors.transNo}
                                helperText={errors.transNo}
                            />
                        </Grid>
                    </>
                )}

                {(selectedPayMode === 5 || selectedPayMode === 6) && (
                    <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                        <TextField
                            required
                            label="Transaction ID"
                            value={transNo}
                            onChange={(e) => setTransNo(e.target.value)}
                            size="small"
                            fullWidth
                            sx={{
                                textAlign: "left",
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                            error={!!errors.transNo}
                            helperText={errors.transNo}
                        />
                    </Grid>
                )}

                <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                    <TextField
                        id="Total_Amount"
                        label="Total Payable"
                        name="Total_Amount"
                        // value={paymentData.Total_Amount}
                        value={payAmt.final_amount}
                        size="small"
                        fullWidth
                        sx={{
                            textAlign: "left", '& input': {
                                fontSize: '14px',
                            },
                        }}
                    />
                </Grid>

                <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                    <TextField
                        id="name"
                        name="name"
                        label="Paid by"
                        size="small"
                        fullWidth
                        type="text"
                        value={ptnData.name}
                        sx={{
                            textAlign: "left", '& input': {
                                fontSize: '14px',
                            },
                        }}
                    />
                </Grid>

                <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                    <TextField
                        required
                        id="amount_paid"
                        name="amount_paid"
                        label="Amount Paid"
                        size="small"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        fullWidth
                        sx={{
                            textAlign: "left", '& input': {
                                fontSize: '14px',
                            },
                        }}
                        error={!!amountError || !!errors.amount}
                        helperText={amountError || errors.amount || ''}
                    />
                </Grid>

                <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                    <TextField
                        id="utr"
                        name="utr"
                        label="UTR"
                        size="small"
                        value={utr}
                        onChange={(e) => setUTR(e.target.value)}
                        fullWidth
                        sx={{
                            textAlign: "left", '& input': {
                                fontSize: '14px',
                            },
                        }}
                    />
                </Grid>

                <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "5px" }}>
                    <TextField
                        required
                        id="remark"
                        name="remark"
                        label="Remark"
                        size="small"
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        fullWidth
                        sx={{
                            textAlign: "left", '& input': {
                                fontSize: '14px',
                            },
                        }}
                        multiline
                        rows={2}
                        error={!!errors.remark}
                        helperText={errors.remark}
                    />
                </Grid>

                <Grid item lg={12} sm={12} xs={12}>
                    <Button variant="contained" sx={{ mt: 2, ml: 8, bgcolor: "#69A5EB", borderRadius: "10px", textTransform: "capitalize", width: "20ch" }} onClick={handleCashPaymentSubmit}>Done</Button>
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={10000}
                        onClose={handleSnackbarClose}
                    >
                        <Alert
                            variant="filled"
                            onClose={handleSnackbarClose}
                            severity={snackbarSeverity}
                            sx={{ width: '100%', ml: 2 }}
                        >
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Grid>
            </Grid>
        </Box>
    )
}

export default RecvdPayment;
