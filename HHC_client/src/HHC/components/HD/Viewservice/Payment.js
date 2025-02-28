import React, { useState, useEffect } from 'react';
import { Box, Grid, MenuItem, Typography, TextField, Button, Alert, Snackbar, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material"
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';

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

const Payment = ({ eveID, pay, ptnData, onClose, walletData }) => {

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [value, setValue] = useState('1');

    const [selectedPayMode, setSelectedPayMode] = useState(1);
    const [chequeNo, setChequeNo] = useState('');
    const [chequeDate, setChequeDate] = useState('');
    const [bankName, setBankName] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [transNo, setTransNo] = useState('');
    const [utr, setUTR] = useState('');
    // const [walletamout, setWalletamout] = useState(null);

    const [remark, setRemark] = useState('')
    const [paymentData, setPaymentData] = useState({ ...pay });
    const [patientData, setPatientData] = useState({ ...ptnData });
    const [amountError, setAmountError] = useState('');
    const [sessionError, setSessionError] = useState('');
    const [amount, setAmount] = useState(0);
    // const [convCharge, setConvCharge] = useState('');

    ///Anjali's Code Start
    const [walletamout, setWalletamout] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [convCharge, setConvCharge] = useState({
        total_sessions: 0,
        no_of_serssion: 0,
        total_cahrge: 0,
        amount_return: 0,
    });

    console.log(convCharge.wallet, 'wwwwww');

    useEffect(() => {
        if (!isChecked) {
            setWalletamout(0);
            setAmount(0);
            setConvCharge({
                total_sessions: 0,
                no_of_serssion: 0,
                total_cahrge: 0,
                amount_return: 0,
            });
        }
    }, [isChecked]);


    ///Anjali's Code End

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [phnErrors, setPhnErrors] = useState({ phone: '' });
    const [loading, setLoading] = useState(false);

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //__________________________________Wallet Start________________________

    useEffect(() => {
        console.log("Received walletData:", walletData);
    }, [walletData]);

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    useEffect(() => {
        if (isChecked && walletData && walletData["Amount in wallet is "] !== null) {
            const maxAmount = walletData["Amount in wallet is "];
            const totalAmount = paymentData.Total_Amount;
            setWalletamout(Math.min(maxAmount, totalAmount)); // Set wallet amount when checkbox is checked
        } else {
            setWalletamout(0); // Reset wallet amount when checkbox is unchecked
        }
    }, [isChecked, walletData, paymentData.Total_Amount]);

    // ___________________________________Wallet End________________________
    const [amountValidate, setAmountValidate] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOptionOnline, setSelectedOptionOnline] = useState('');

    const handleWalletClick = () => {
        setAmountValidate(true);
    };

    const [dynamicAmountPaid, setDynamicAmountPaid] = useState(paymentData.amount_paid || "");
    const [dynamicAmountPaidOnline, setDynamicAmountPaidOnline] = useState(paymentData.amount_paid || 0);

    const handleRadioChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);

        if (selectedValue === 'yes') {
            setDynamicAmountPaid(paymentData.amount_paid || 0);
        } else if (selectedValue === 'no') {
            setDynamicAmountPaid(paymentData.Total_Amount || 0);
        }

    };

    const handleRadioChangeOnline = (event) => {
        const selectedValue = event.target.value;
        setSelectedOptionOnline(selectedValue);

        if (selectedValue === 'yes') {
            setDynamicAmountPaidOnline(paymentData.amount_paid || 0);
        } else if (selectedValue === 'no') {
            setDynamicAmountPaidOnline(paymentData.Total_Amount || 0);
        }
    };

    const handleAmountValidation = (amountPaid) => {
        if (Number(amountPaid) || Number(convCharge.wallet) > Number(paymentData.Total_Amount)) {
            setAmountValidate(true);
        } else {
            setAmountValidate(false);
        }
    };

    const handleFieldChange = (field, value) => {
        setPaymentData({ ...pay, [field]: value });
        setPatientData({ ...patientData, [field]: value });
        if (field === 'phone') {
            validatePhoneNumber(value);
        }
        if (field === 'amount_paid') {
            setPaymentData(paymentData => {
                const pendingAmount = paymentData.Pending_Amount - parseFloat(value);
                const demo = paymentData.Pending_Amount
                console.log("Paid Amount.....", paymentData)
                console.log("Paid Amount.....", paymentData.amount_paid)
                console.log("Pending Amount.....", demo)
                setAmount(paymentData.amount_paid)
                return {
                    ...paymentData,
                    Pending_Amount: isNaN(pendingAmount) ? 0 : pendingAmount,
                };
            });
        }
        handleAmountValidation(value);
    };

    const validatePhoneNumber = (value) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value)) {
            setPhnErrors(prevState => ({ ...prevState, phone: 'Invalid phone number. It should start with 6-9 and be 10 digits long.' }));
        } else {
            setPhnErrors(prevState => ({ ...prevState, phone: '' }));
        }
    };

    useEffect(() => {
        const totalAmount = Number(walletamout) + Number(amount);

        console.log(totalAmount, 'totalAmounttotalAmount');

        if (eveID && totalAmount > 0) {
            const getCalculateConvinance = async () => {
                try {
                    const res = await fetch(`${port}/web/CalculateConvinanceCharge/${eveID}/${totalAmount}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    setConvCharge(data);
                } catch (error) {
                    console.error("Error fetching Calculate Convinance:", error);
                }
            };
            getCalculateConvinance();
        }
    }, [eveID, walletamout, amount]);

    async function handleCashPaymentSubmit(event) {
        event.preventDefault();
        if (!walletamout && !paymentData.amount_paid) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please Enter Amount');
            setSnackbarSeverity('error');
            return;
        }

        if (!!amountError || !!sessionError) {
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
            Total_cost: pay.Total_Amount,
            paid_by: ptnData.name,
            amount_paid: dynamicAmountPaid || 0,
            no_of_session: convCharge.no_of_serssion,
            amount_remaining: 0,
            utr: utr,
            Remark: remark,
            mode: selectedPayMode,
            wallet_Amount: walletamout
        };
        if (selectedPayMode === 2) {
            requestData.cheque_number = chequeNo;
            requestData.cheque_date = chequeDate;
            requestData.bank_name = bankName;
        } else if (selectedPayMode === 4) {
            requestData.card_no = cardNo;
            requestData.transaction_id = transNo;
        } else if (selectedPayMode === 5 || selectedPayMode === 6) {
            requestData.transaction_id = transNo;
        }

        console.log("POST API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/payment-detail/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.status === 409) {
                setOpenSnackbar(true);
                setSnackbarMessage('Payment has already done !!!');
                setSnackbarSeverity('error');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }

            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                return;
            }
            const result = await response.json();
            console.log("Cash Payment data", result);
            setOpenSnackbar(true);
            setSnackbarMessage('Payment saved successfully.');
            setSnackbarSeverity('success');
            // onClose();
            window.location.reload();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    // async function handleOnlinePaymentSubmit(event) {
    //     event.preventDefault();
    //     // console.log("Updated phone no & amount...", patientData.phone, paymentData.amount_paid)
    //     if (!amount || !!amountError || !!sessionError) {
    //         setOpenSnackbar(true);
    //         setSnackbarMessage(!amount ? 'Please fill required details.' : 'Please fill valid details.');
    //         setSnackbarSeverity('error');
    //         return;
    //     }
    //     setLoading(true);
    //     // var contact = patientData.phone_no
    //     var contact = patientData.phone
    //     const requestData = {
    //         eve_id: eveID,
    //         total_amount: pay.Total_Amount,
    //         customerName: ptnData.name,
    //         customeremail: ptnData.patient_email_id,
    //         // customerPhone: str(patientData.phone_no),
    //         customerPhone: contact.toString(),
    //         // orderAmount: paymentData.amount_paid,
    //         orderAmount: convCharge.total_cahrge,
    //         // Remaining_amount: paymentData.Pending_Amount,
    //         Remaining_amount: 0,
    //         // amount_remaining: 0,
    //         // Mode: value,
    //     };
    //     console.log("POST API Hitting......", requestData)
    //     try {
    //         const response = await fetch(`${port}/web/create_payment/`, {
    //             method: "POST",
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`,
    //                 "Content-Type": "application/json",
    //                 Accept: "application/json",
    //             },
    //             body: JSON.stringify(requestData),
    //         });
    //         if (!response.ok) {
    //             console.error(`HTTP error! Status: ${response.status}`);
    //             setLoading(false);
    //             return;
    //         }
    //         const result = await response.json();
    //         console.log("Online Payment data", result);
    //         setOpenSnackbar(true);
    //         setSnackbarMessage('Payment saved successfully.');
    //         setSnackbarSeverity('success');
    //         // onClose();
    //         window.location.reload();
    //     } catch (error) {
    //         console.error("An error occurred:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    async function handleOnlinePaymentSubmit(event) {
        event.preventDefault();
        const walletAmountUsed = isChecked ? walletamout : 0;
        // const finalOrderAmount = Math.max(dynamicAmountPaidOnline - walletAmountUsed, 0); 
        const finalOrderAmount = isChecked
            ? Math.max((paymentData.amount_paid || 0) - walletAmountUsed, 0) // Default paymentData.amount_paid to 0 if null
            : paymentData.amount_paid || 0;
        setLoading(true);

        var contact = patientData.phone;
        const requestData = {
            eve_id: eveID,
            total_amount: pay.Total_Amount,
            customerName: ptnData.name,
            customeremail: ptnData.patient_email_id,
            customerPhone: contact.toString(),
            // orderAmount: orderAmount,
            orderAmount: finalOrderAmount,
            Remaining_amount: 0,
            amount_from_wallet: walletAmountUsed
        };

        try {
            const cancelResponse = await fetch(`${port}/web/cancel-payment-link/${eveID}/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (!cancelResponse.ok) {
                console.error(`HTTP error! Status: ${cancelResponse.status}`);
                setLoading(false);
                return;
            }

            console.log("Cancel Payment response:", await cancelResponse.json());

            await new Promise(resolve => setTimeout(resolve, 3000));
            const response = await fetch(`${port}/web/create_payment/`, {
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
                setLoading(false);
                return;
            }

            const result = await response.json();
            console.log("Online Payment data", result);

            setOpenSnackbar(true);
            setSnackbarMessage('Payment saved successfully.');
            setSnackbarSeverity('success');
            window.location.reload();

        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{ marginTop: "20px" }}>
            <TabContext value={value}>
                <Box sx={{
                    typography: 'body1',
                    background: "#F2F2F2",
                    borderRadius: '10px',
                    width: "60%",
                    height: "2.8rem",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: '50px',
                }}
                >
                    <TabList
                        className="tab-root"
                        onChange={handleChange}
                        sx={{ position: 'relative', }}
                        TabIndicatorProps={{ style: { background: '#69A5EB', height: '44px', marginBottom: '2px', borderRadius: "5px" } }}
                    >
                        <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "1" ? '#ffffff' : 'black' }}>Offline</span>} value="1" sx={{ position: 'relative', zIndex: 1, }} />
                        {/* <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "2" ? '#ffffff' : 'black' }}>Cheque</span>} value="2" sx={{ position: 'relative', zIndex: 1, }} /> */}
                        <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "3" ? '#ffffff' : 'black' }}>Online</span>} value="3" sx={{ position: 'relative', zIndex: 1, }} />
                    </TabList>
                </Box>
                {/* <Box sx={{ width: '100%', typography: 'body1', marginTop: '-10px', }}> */}
                <Box sx={{ width: '100%', typography: 'body1', mt: 2, overflowY: 'scroll', height: '400px' }}>
                    <TabPanel value="1"
                        sx={{
                            // height: "26rem",
                            // overflowY: "scroll",
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
                            <Grid item lg={12} sm={12} xs={12}>
                                <Box component="form">
                                    <Typography variant='body2' sx={{ fontSize: '15px' }}>
                                        <strong>Amount in Wallet :</strong>
                                        <strong
                                            style={{
                                                marginLeft: '5px',
                                                color: walletData && walletData["Amount in wallet is "] === null ? 'black' : 'green'
                                            }}
                                        >
                                            {walletData && walletData["Amount in wallet is "] !== null
                                                ? walletData["Amount in wallet is "]
                                                : "00"
                                            }
                                        </strong>
                                    </Typography>
                                </Box>
                            </Grid>

                            {walletData && walletData["Amount in wallet is "] > 0 && (
                                <Grid item lg={12} sm={12} xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isChecked}
                                                onChange={handleCheckboxChange}
                                                color="primary"
                                            />
                                        }
                                        label="Use Wallet Amount"
                                    />
                                </Grid>
                            )}

                            <Grid item lg={12} sm={12} xs={12}>
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
                                    <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                        <TextField
                                            required
                                            label="Cheque no"
                                            id="cheque_number"
                                            name="cheque_number"
                                            placeholder='Enter cheque no'
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
                                    <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                        <TextField
                                            required
                                            label="Cheque date"
                                            type="date"
                                            id="cheque_date"
                                            name="cheque_date"
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
                                    {/* <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                        <TextField
                                            required
                                            label="Upload cheque"
                                            id="cheque_image"
                                            // name="cheque_image"
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
                                    <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
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
                                    <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                        <TextField
                                            required
                                            label="Card Number"
                                            id="card_no"
                                            name="card_no"
                                            value={cardNo}
                                            onChange={(e) => setCardNo(e.target.value)}
                                            placeholder='Enter last 4 digits'
                                            size="small"
                                            fullWidth
                                            inputProps={{
                                                maxLength: 4,
                                            }}
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
                                    <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                        <TextField
                                            required
                                            label="Transaction Number"
                                            id="transaction_id"
                                            name="transaction_id"
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
                                <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
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

                            <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                <TextField
                                    id="Total_Amount"
                                    label="Total Payable"
                                    name="Total_Amount"
                                    value={paymentData.Total_Amount}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        textAlign: "left", '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                            </Grid>

                            {isChecked && walletData && walletData["Amount in wallet is "] !== null && (
                                <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                    <TextField
                                        label="Enter Wallet Amount"
                                        name="wallet_Amount"
                                        disabled
                                        value={walletamout}
                                        onChange={(e) => {
                                            const enteredValue = e.target.value;
                                            const maxAmount = walletData["Amount in wallet is "];
                                            const totalAmount = paymentData.Total_Amount;

                                            const walletAmountToSet = Math.min(Number(enteredValue), maxAmount, totalAmount);
                                            if (!isNaN(walletAmountToSet) && walletAmountToSet >= 0) {
                                                setWalletamout(walletAmountToSet);
                                            }
                                        }}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            textAlign: "left", '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                </Grid>
                            )}

                            <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
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

                            {/* {
                                Number(paymentData.Total_Amount) !== Number(walletamout) && (
                                    <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                        <TextField
                                            // required
                                            id="amount_paid"
                                            name="amount_paid"
                                            label="Amount Paid"
                                            placeholder="Enter amount"
                                            size="small"
                                            type="number"
                                            value={paymentData.amount_paid || ""}
                                            onChange={(e) => {
                                                const enteredValue = e.target.value;
                                                const walletAmount = Number(walletamout);
                                                const totalAmount = Number(paymentData.Total_Amount);
                                                const maxPayable = totalAmount - walletAmount;

                                                if (enteredValue === "") {
                                                    handleFieldChange("amount_paid", "");
                                                } else if (!isNaN(enteredValue) && Number(enteredValue) <= maxPayable) {
                                                    handleFieldChange("amount_paid", Number(enteredValue));
                                                }
                                            }}
                                            fullWidth
                                            sx={{
                                                textAlign: "left",
                                                "& input": {
                                                    fontSize: "14px",
                                                },
                                            }}
                                            // error={!!amountError || !!sessionError}
                                            helperText={
                                                amountError ||
                                                sessionError ||
                                                (paymentData.amount_paid + walletamout > paymentData.Total_Amount
                                                    ? "Amount exceeds the total payable."
                                                    : ""
                                                )
                                            }
                                        />
                                    </Grid>
                                )
                            } */}

                            {
                                Number(paymentData.Total_Amount) !== Number(walletamout) && (
                                    <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                        <TextField
                                            id="amount_paid"
                                            name="amount_paid"
                                            label="Amount Paid"
                                            placeholder='Enter amount'
                                            size="small"
                                            type="number"
                                            // value={paymentData.amount_paid}
                                            // onChange={(e) => handleFieldChange("amount_paid", e.target.value)}
                                            // onChange={(e) => {
                                            //     const value = e.target.value;
                                            //     handleFieldChange('amount_paid', value); // Call the field change handler
                                            // }}
                                            value={dynamicAmountPaid}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setDynamicAmountPaid(value);
                                                handleFieldChange("amount_paid", value);
                                            }}
                                            fullWidth
                                            sx={{
                                                textAlign: "left", '& input': {
                                                    fontSize: '14px',
                                                },
                                            }}
                                            error={!!amountError || !!sessionError}
                                            helperText={amountError || sessionError || ''}
                                        />
                                    </Grid>
                                )
                            }

                            {/* {amountValidate && (
                                <Grid item lg={12} sm={12} xs={12}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">
                                            Are you sure you want to add extra Rs.{convCharge.wallet?.toFixed(2)} to the Wallet?
                                        </FormLabel>
                                        <RadioGroup row value={selectedOption} onChange={handleRadioChange}>
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            )} */}

                            {amountValidate && convCharge.wallet !== 0 && (
                                <Grid item lg={12} sm={12} xs={12}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">
                                            Are you sure you want to add extra Rs.{convCharge.wallet?.toFixed(2)} to the Wallet?
                                        </FormLabel>
                                        <RadioGroup row value={selectedOption} onChange={handleRadioChange}>
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            )}

                            <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                <Box component="form" sx={{ p: "4px 6px", alignItems: 'center', height: 'auto', backgroundColor: "#CBE3FF", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "5px", }}>
                                    <Typography variant='body2'>Total No of Sessions: {convCharge.total_sessions}</Typography>
                                    <Typography variant='body2'>Billing Sessions: {convCharge.no_of_serssion}</Typography>
                                    <Typography variant='body2'>Final Amount: {convCharge.total_cahrge?.toFixed(2)}</Typography>
                                    {/* <Typography variant='body2'>Return Amount: {convCharge.amount_return?.toFixed(2)}</Typography> */}
                                    {/* <Typography variant='body2'>Wallet Amount: {convCharge.wallet?.toFixed(2)}</Typography> */}
                                    {selectedOption === 'yes' && (
                                        <Typography variant='body2'>
                                            Wallet Amount: {convCharge.wallet?.toFixed(2)}
                                        </Typography>
                                    )}
                                    {selectedOption === 'no' && (
                                        <Typography variant='body2'>
                                            Return Amount: {convCharge.amount_return?.toFixed(2)}
                                        </Typography>
                                    )}
                                    {isChecked && (
                                        <Typography variant='body2'>
                                            Return Amount: {convCharge.amount_return?.toFixed(2)}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
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

                            <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                <TextField
                                    required
                                    id="remark"
                                    name="remark"
                                    label="Remark"
                                    placeholder='write here'
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
                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 2,
                                        ml: 7,
                                        bgcolor: "#69A5EB",
                                        borderRadius: "10px",
                                        textTransform: "capitalize",
                                        width: "8rem",
                                    }}
                                    onClick={handleCashPaymentSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Done'}
                                </Button>
                                <Snackbar
                                    open={openSnackbar}
                                    autoHideDuration={10000}
                                    onClose={handleSnackbarClose}
                                >
                                    <Alert
                                        variant="filled"
                                        onClose={handleSnackbarClose}
                                        // severity="success"
                                        severity={snackbarSeverity}
                                        sx={{ width: '100%', ml: 2 }}
                                    >
                                        {snackbarMessage}
                                    </Alert>
                                </Snackbar>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value="3">
                        <Grid container spacing={2}>
                            <Grid item lg={12} sm={12} xs={12}>
                                <Box component="form">
                                    <Typography variant='body2' sx={{ fontSize: '15px' }}>
                                        <strong>Amount in Wallet :</strong>
                                        <strong
                                            style={{
                                                marginLeft: '5px',
                                                color: walletData && walletData["Amount in wallet is "] === null ? 'black' : 'green'
                                            }}
                                        >
                                            {walletData && walletData["Amount in wallet is "] !== null
                                                ? walletData["Amount in wallet is "]
                                                : "00"
                                            }
                                        </strong>
                                    </Typography>
                                </Box>
                            </Grid>

                            {walletData && walletData["Amount in wallet is "] > 0 && (
                                <Grid item lg={12} sm={12} xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isChecked}
                                                onChange={handleCheckboxChange}
                                                color="primary"
                                            />
                                        }
                                        label="Use Wallet Amount"
                                    />
                                </Grid>
                            )}

                            <Grid item lg={12} sm={12} xs={12}>
                                <TextField
                                    id="total_amount"
                                    name="total_amount"
                                    label="Total Payable"
                                    size="small"
                                    // value={pay.Total_Amount}
                                    value={paymentData.Total_Amount}
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                            </Grid>

                            {isChecked && walletData && walletData["Amount in wallet is "] !== null && (
                                <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "10px" }}>
                                    <TextField
                                        label="Enter Wallet Amount"
                                        name="wallet_Amount"
                                        disabled
                                        value={walletamout}
                                        onChange={(e) => {
                                            const enteredValue = e.target.value;
                                            const maxAmount = walletData["Amount in wallet is "] || 0;
                                            const totalAmount = paymentData.Total_Amount || 0;

                                            const walletAmountToSet = Math.min(Number(enteredValue) || 0, maxAmount, totalAmount);
                                            if (!isNaN(walletAmountToSet) && walletAmountToSet >= 0) {
                                                setWalletamout(walletAmountToSet);
                                            }
                                        }}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            textAlign: "left", '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                    />
                                </Grid>
                            )}

                            <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "2px" }}>
                                <TextField
                                    id="customerName"
                                    name="customerName"
                                    label="Customer Name"
                                    placeholder='First name | Middle name | Last name'
                                    size="small"
                                    value={ptnData.name}
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "2px" }}>
                                <TextField
                                    id="customeremail"
                                    name="customeremail"
                                    label="Customer Email"
                                    placeholder='email@gmail.com'
                                    size="small"
                                    value={ptnData.patient_email_id}
                                    // onChange={(e) => handleFieldChange("patient_email_id", e.target.value)}
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "2px" }}>
                                <TextField
                                    id="customerPhone"
                                    name="customerPhone"
                                    label="Contact"
                                    placeholder='+91 |'
                                    size="small"
                                    // value={patientData.phone_no}
                                    value={patientData.phone}
                                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                    inputProps={{
                                        minLength: 10,
                                        maxLength: 10,
                                    }}
                                    error={!!phnErrors.phone}
                                    helperText={phnErrors.phone || ''}
                                />
                            </Grid>

                            {
                                Number(paymentData.Total_Amount) !== Number(walletamout) && (
                                    <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "2px" }}>
                                        <TextField
                                            // required
                                            id="orderAmount"
                                            name="orderAmount"
                                            label="Amount Paid"
                                            size="small"
                                            type="number"
                                            value={paymentData.amount_paid}
                                            // onChange={(e) => handleFieldChange("amount_paid", e.target.value)}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                handleFieldChange('amount_paid', value); // Call the field change handler
                                            }}
                                            fullWidth
                                            sx={{
                                                textAlign: "left", '& input': {
                                                    fontSize: '14px',
                                                },
                                            }}
                                            error={!!amountError || !!sessionError}
                                            helperText={amountError || sessionError || ''}
                                        />
                                    </Grid>
                                )
                            }

                            {amountValidate && convCharge.wallet !== 0 && (
                                <Grid item lg={12} sm={12} xs={12}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">
                                            Are you sure you want to add extra Rs.{convCharge.wallet?.toFixed(2)} to the Wallet?
                                        </FormLabel>
                                        <RadioGroup row value={selectedOptionOnline} onChange={handleRadioChangeOnline}>
                                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="no" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            )}

                            <Grid item lg={12} sm={12} xs={12} style={{ marginTop: "2px" }}>
                                <Box component="form" sx={{ p: "4px 6px", alignItems: 'center', height: 'auto', backgroundColor: "#CBE3FF", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "5px", }}>
                                    <Typography variant='body2'>Total No of Sessions: {convCharge.total_sessions}</Typography>
                                    <Typography variant='body2'>Billing Sessions: {convCharge.no_of_serssion}</Typography>
                                    <Typography variant='body2'>Final Amount: {convCharge.total_cahrge?.toFixed(2)}</Typography>

                                    {/* <Typography variant='body2'>Final Amount: {convCharge.total_cahrge}</Typography>
                                    <Typography variant='body2'>Return Amount: {convCharge.amount_return}</Typography> */}

                                    {selectedOptionOnline === 'yes' && (
                                        <Typography variant='body2'>
                                            Wallet Amount: {convCharge.wallet?.toFixed(2)}
                                        </Typography>
                                    )}
                                    {selectedOptionOnline === 'no' && (
                                        <Typography variant='body2'>
                                            Return Amount: {convCharge.amount_return?.toFixed(2)}
                                        </Typography>
                                    )}
                                    {isChecked && (
                                        <Typography variant='body2'>
                                            Return Amount: {convCharge.amount_return?.toFixed(2)}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item lg={12} sm={12} xs={12}>
                                <Button variant="contained" sx={{ mt: 1, ml: 7, bgcolor: "#69A5EB", borderRadius: "10px", textTransform: "capitalize", width: "9rem" }} onClick={handleOnlinePaymentSubmit}
                                    disabled={loading}
                                    startIcon={loading && <CircularProgress size={20} />}>{loading ? 'Processing...' : 'Send Link'}</Button>
                                <Snackbar
                                    open={openSnackbar}
                                    autoHideDuration={10000}
                                    onClose={handleSnackbarClose}
                                >
                                    <Alert
                                        variant="filled"
                                        onClose={handleSnackbarClose}
                                        // severity="success"
                                        severity={snackbarSeverity}
                                        sx={{ width: '100%', ml: 2 }}
                                    >
                                        {snackbarMessage}
                                    </Alert>
                                </Snackbar>
                            </Grid>
                        </Grid>
                    </TabPanel>
                </Box>
            </TabContext>
        </Box>
    )
}

export default Payment
