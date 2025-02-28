import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Stack, TextField, Button, Modal, Fab, Alert, AlertTitle, Snackbar, AppBar, Box, Toolbar, Typography, useMediaQuery, Checkbox, FormControlLabel, FormControl, FormLabel, Radio, RadioGroup } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SignatureCanvas from 'react-signature-canvas'
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    pt: 2,
    px: 4,
    pb: 3,
};

const ConsentDetails = () => {
    const port = process.env.REACT_APP_API_KEY;
    const addedby = localStorage.getItem('clg_id');
    const signatureRef = useRef();
    const { eve_id } = useParams();
    const eveId = eve_id.substring(1);
    console.log("consent event id", eveId)

    const [consentDetails, setConsentDetails] = useState([]);
    const [openConsent, setOpenConsent] = useState(false);
    const [viewConsent, setViewConsent] = useState(false);
    const [selectedSign, setSelectedSign] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [selectedOption, setSelectedOption] = useState('upload');

    const isSmallScreen = useMediaQuery('(max-width:350px)');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [alreadySubmitConsent, setAlreadySubmitConsent] = useState(false);

    const [errors, setErrors] = useState({
        // selectedOption: '',
        selectedSign: null,
        selectedFiles: [],
    });

    const handleEmptyField = () => {
        const newErrors = {};

        // if (!selectedOption) {
        //     newErrors.selectedOption = 'This is required';
        // }

        if (selectedOption === 'upload' && !selectedSign) {
            newErrors.selectedSign = 'This field is required';
        }
        // if (!selectedSign) {
        //     newErrors.selectedSign = 'This field is required';
        // }

        if (!selectedFiles) {
            newErrors.selectedFiles = 'This field is required';
        }
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error !== '');
    };

    const handleOpenConsent = () => setOpenConsent(true);
    const handleCloseConsent = () => setOpenConsent(false);

    const handleRadioChange = (event) => {
        setViewConsent(event.target.checked);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        window.location.reload();
    };

    // const handleFileChange = (event) => {
    //     const files = event.target.files;
    //     const fileNames = Array.from(files).map(file => file.name);
    //     setSelectedFiles(fileNames);
    // };

    const handleFileChange = (event) => {
        const files = event.target.files;
        const fileObjects = Array.from(files);
        setSelectedFiles(fileObjects);
    };

    const handleSignFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const fileName = files[0];
            setSelectedSign(fileName);
        }
    };

    const getSignature = () => {
        if (signatureRef.current) {
            return signatureRef.current.toDataURL();
        }
        return null;
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        const getConsent = async () => {
            try {
                const res = await fetch(`${port}/web/concent_upload_discharge_summery_document_and_signature/${eveId}`,
                );
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                const data = await res.json();
                // console.log("Consent Deatils.........", data);
                if (data.message === "form already sumitted") {
                    console.log("Form already submitted");
                    setAlreadySubmitConsent(true)
                } else {
                    setConsentDetails(data);
                }

            } catch (error) {
                console.error("Error fetching Consent Details:", error);
            }
        };
        getConsent();
    }, [eveId]);

    // async function handleSubmitConsent(e) {
    //     e.preventDefault()
    //     const hasEmptyFields = handleEmptyField();
    //     if (selectedOption === 'upload' && hasEmptyFields) {
    //         setOpenSnackbar(true);
    //         setSnackbarMessage('Please fill * mark fields.');
    //         setSnackbarSeverity('error');
    //         return;
    //     }

    //     // const canvasData = signatureRef.current.toDataURL();
    //     let canvasData;
    //     if (signatureRef && signatureRef.current) {
    //         canvasData = signatureRef.current.toDataURL();
    //     } else {
    //         console.warn('Digital Signature is null.');
    //         canvasData = null;
    //     }

    //     const blob = await fetch(canvasData).then((res) => res.blob());
    //     const fileName = null;
    //     const signatureFile = new File([blob], fileName, { type: blob.type });
    //     const fileType = signatureFile.type;

    //     // const requestData = {
    //     //     eve_id: parseInt(eveId, 10),
    //     //     is_aggree: viewConsent,
    //     //     sign: selectedOption === "upload" ? selectedSign : fileType,
    //     //     Discharge_summ_docs: selectedFiles,
    //     //     clg_id: parseInt(addedby, 10),
    //     // };

    //     const formData = new FormData();
    //     formData.append('eve_id', parseInt(eveId, 10));
    //     formData.append('is_aggree', viewConsent === true ? 'True' : 'False');
    //     formData.append('sign', selectedOption === "upload" ? selectedSign : fileType);
    //     formData.append('Discharge_summ_docs', selectedFiles);
    //     formData.append('clg_id', parseInt(addedby, 10));

    //     for (let [key, value] of formData.entries()) {
    //         console.log(`${key}:`, value);
    //     }
    //     console.log("Consent API Hitting......", formData.entries())

    //     try {
    //         const response = await fetch(`${port}/web/concent_upload_discharge_summery_document_and_signature/`, {
    //             method: "POST",
    //             // headers: {
    //             // "Content-Type": "application/json",
    //             // Accept: "application/json",
    //             // 'Content-Type': 'multipart/form-data'
    //             // },
    //             // body: JSON.stringify(requestData),
    //             body: formData,
    //         });
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }
    //         const result = await response.json();
    //         // setOpenSnackbar(true);
    //         // setSnackbarMessage('Consent details submitted successfully!!.');
    //         // setSnackbarSeverity('success');
    //         // window.location.reload();
    //         console.log("Results.....", result);
    //     } catch (error) {
    //         console.error("An error occurred:", error);
    //     }
    // }

    async function handleSubmitConsent(e) {
        e.preventDefault();

        const hasEmptyFields = handleEmptyField();
        if (selectedOption === 'upload' && hasEmptyFields) {
            setOpenSnackbar(true);
            setSnackbarMessage('Please fill * mark fields.');
            setSnackbarSeverity('error');
            return;
        }

        let canvasData;
        if (signatureRef && signatureRef.current) {
            canvasData = signatureRef.current.toDataURL();
        } else {
            console.warn('Digital Signature is null.');
            canvasData = '';
        }

        const blob = await fetch(canvasData).then((res) => res.blob());
        const fileName = `${consentDetails[0]?.eve_id?.agg_sp_pt_id?.name}.png`; // Assuming the signature is always a PNG file
        const signatureFile = new File([blob], fileName, { type: blob.type });
        const fileType = signatureFile;

        const formData = new FormData();
        formData.append('eve_id', parseInt(eveId, 10));
        formData.append('is_aggree', viewConsent === true ? 'True' : 'False');
        formData.append('sign', selectedOption === "upload" ? selectedSign : fileType);
        // formData.append('Discharge_summ_docs', selectedFiles);

        if (Array.isArray(selectedFiles)) {
            selectedFiles.forEach((file) => {
                formData.append('Discharge_summ_docs', file);
            });
        } else {
            console.error('selectedFiles is not an array of File objects.');
            return;
        }

        formData.append('clg_id', parseInt(addedby, 10));

        // Debugging: Log FormData content
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        console.log("Consent API Hitting......");
        try {
            const response = await fetch(`${port}/web/concent_upload_discharge_summery_document_and_signature/`, {
                method: "POST",
                body: formData,
            });
            const responseData = await response.json();
            console.log("Results.....", responseData)
            window.location.reload();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <>
            {alreadySubmitConsent ? (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                    }}>
                    <Alert severity="success" variant="filled">
                        <AlertTitle>Success 🥳</AlertTitle>
                        Your data has been successfully submitted!!.
                    </Alert>

                </div>
            ) : (
                <>
                    <AppBar position="static" style={{ background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)', height: '3rem' }}>
                        <Toolbar variant='dense' sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            {/* <img style={{ height: '36px', width: '76px', marginTop: "2px", marginLeft: "-12px", color: "#ffffff" }} src={Logo} alt="Spero" /> */}

                            {!isSmallScreen && (
                                <Typography variant="h6" component="div" align="center"
                                    sx={{
                                        flexGrow: 1,
                                        fontFamily: 'sans-serif',
                                        fontWeight: 600,
                                        fontStyle: 'normal',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}>
                                    CONSENT FORM
                                </Typography>
                            )}
                        </Toolbar>
                    </AppBar>
                    <Box sx={{ flexGrow: 1, mb: 2, ml: 1, mr: 1, }}>
                        <div>
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <div style={{ display: "flex", marginTop: "15px" }}>
                                    <Typography variant='body2'>Patient Name</Typography>
                                    <Typography variant='subtitle2' sx={{ ml: 1 }}>{consentDetails[0]?.eve_id?.agg_sp_pt_id?.name}</Typography>
                                </div>
                                <div style={{ display: "flex", marginTop: "15px" }}>
                                    <Typography variant='body2'>Event ID</Typography>
                                    <Typography variant='subtitle2' sx={{ ml: 1 }}>{consentDetails[0]?.eve_id?.eve_id}</Typography>
                                </div>
                                <div style={{ marginTop: "4px", }}>
                                    <Fab size="small" color="primary" aria-label="view">
                                        <VisibilityOutlinedIcon onClick={handleOpenConsent} />
                                    </Fab>
                                </div>
                            </Stack>

                            <Modal
                                open={openConsent}
                                onClose={handleCloseConsent}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{ ...style, width: 300, borderRadius: "5px" }}>
                                    <div style={{ display: "flex" }}>
                                        <Button onClick={handleCloseConsent} sx={{ marginLeft: "16rem", color: "gray", }}><CloseIcon /></Button>
                                    </div>
                                    <div>
                                        <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>CALLER DETAILS</Typography>
                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Contact</Typography>
                                            <Typography inline variant="body2" style={{ marginLeft: "15px" }}>{consentDetails[0]?.eve_id?.caller_id?.phone}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Name</Typography>
                                            <Typography inline variant="body2" >{consentDetails[0]?.eve_id?.caller_id?.caller_fullname}</Typography>
                                        </Grid>
                                    </div>
                                    <hr />

                                    <div>
                                        <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>PATIENT DETAILS</Typography>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Name</Typography>
                                            <Typography inline variant="body2">{consentDetails[0]?.eve_id?.agg_sp_pt_id?.name}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Mobile</Typography>
                                            <Typography inline variant="body2" >{consentDetails[0]?.eve_id?.agg_sp_pt_id?.phone_no}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Email Id</Typography>
                                            <Typography inline variant="body2">{consentDetails[0]?.eve_id?.agg_sp_pt_id?.patient_email_id}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Location</Typography>
                                            <Typography inline variant="body2">Maharashtra, India</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Pincode</Typography>
                                            <Typography inline variant="body2">411051</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Residential Address</Typography>
                                            <Typography inline variant="body2">{consentDetails[0]?.eve_id?.agg_sp_pt_id?.google_address}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Permanent Address</Typography>
                                            <Typography inline variant="body2">{consentDetails[0]?.eve_id?.agg_sp_pt_id?.address}</Typography>
                                        </Grid>

                                        {/* <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Landline</Typography>
                                            <Typography inline variant="body2">-</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">DOB</Typography>
                                            <Typography inline variant="body2">-</Typography>
                                        </Grid> */}
                                    </div>
                                    <hr style={{ borderTop: "1px dashed #000" }} />

                                    <div>
                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Consultant</Typography>
                                            <Typography inline variant="body2">{consentDetails[0]?.doct_cons_id?.cons_fullname}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Contact No</Typography>
                                            <Typography inline variant="body2">{consentDetails[0]?.doct_cons_id?.mobile_no}</Typography>
                                        </Grid>

                                        <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                            <Typography inline variant="body2" color="text.secondary">Email Id</Typography>
                                            <Typography inline variant="body2">{consentDetails[0]?.doct_cons_id?.email_id}</Typography>
                                        </Grid>
                                    </div>
                                </Box>
                            </Modal>
                        </div>
                        <hr />

                        <Typography textAlign="left" color="primary" style={{ marginLeft: "10px" }}>Consent</Typography>
                        <Typography textAlign="left" variant='body2' style={{ marginLeft: "10px" }}>
                            I, {consentDetails[0]?.eve_id?.agg_sp_pt_id?.name}, aged {consentDetails[0]?.eve_id?.agg_sp_pt_id?.Age} residing at {consentDetails[0]?.eve_id?.agg_sp_pt_id?.address} am suffering from ({consentDetails[0]?.eve_id?.agg_sp_pt_id?.Suffered_from}). I, ({consentDetails[0]?.eve_id?.caller_id?.caller_fullname}), aged
                            residing at {consentDetails[0]?.eve_id?.agg_sp_pt_id?.address} am made aware that {consentDetails[0]?.eve_id?.agg_sp_pt_id?.name} is suffering from ({consentDetails[0]?.eve_id?.agg_sp_pt_id?.Suffered_from})
                        </Typography>
                        <ul style={{ textAlign: "left", listStyleType: "decimal" }}>
                            <li><Typography variant='body2'>That, above named patient has been receiving treatment from a consultant for the mentioned disease.</Typography></li>
                            <li><Typography variant='body2'>That, above named consultant has explained that the patient can now receive treatment/care at home.</Typography></li>
                            <li><Typography variant='body2'>That, Spero Home Health Care professional has explained to us all the details, including limitations, advantages, disadvantages, effects, side-effects, pros, cons, etc., of Home Health Care.</Typography></li>
                            <li><Typography variant='body2'>That, after understanding the limitations of Home Health Care in detail, I freely consent to the provision of Home Health Care, including healthcare attendants, for (Name of procedure/service) to {consentDetails[0]?.eve_id?.agg_sp_pt_id?.name} (Name of Patient).</Typography></li>
                            <li><Typography variant='body2'>That, we have been informed by a Spero professional that Spero Home Health Care is solely involved in executing medical instructions, advice, and orders from the respective consultant. Furthermore, we have been informed that we shall contact or consult the concerned consultant/hospital for any further medical management of the disease condition.</Typography></li>
                            <li><Typography variant='body2'>That, we have been informed by a Spero professional that we shall adhere to all instructions, advice, and orders provided by the hospital through the concerned consultant. Additionally, we will consult or visit the relevant consultant/hospital for any necessary follow-up.</Typography></li>
                            <li><Typography variant='body2'>That, we assure that we will not directly hire or avail Home Health Care services from any representative, professional, or employee of Spero Innovations Pvt. Ltd. in any form.</Typography></li>
                            <li><Typography variant='body2'>We assure that the safety and security of the Spero Professional while rendering services at our home/premises will be our responsibility and liability.</Typography></li>
                        </ul>
                        <Typography textAlign="left" color="primary" style={{ marginLeft: "10px" }}>Note:</Typography>
                        <ul style={{ textAlign: "left", listStyleType: "decimal" }}>
                            <li><Typography variant='body2'>Furthermore, we have been made to understand that Spero is a distinct and independent legal entity from the hospital. Spero will be solely responsible, liable, and answerable for Home Health Care services provided to the patient. The hospital will not be responsible, liable, or answerable for the policies, practices, and Home Health Care services provided by Spero, and any untoward event arising thereof. Therefore, in case of queries or feedback regarding Home Health Care services, etc., we would contact Spero.</Typography></li>
                            <li><Typography variant='body2'>We have been explained above information in our vernacular i.e Marathi/Hindi and after satisfaction, we are putting our signatures at place and date mentioned here in below.</Typography></li>
                        </ul>

                        <Grid item xs={12} container spacing={1}>
                            <Grid item lg={2} md={6} xs={12}>
                                <FormControl component="fieldset">
                                    <div style={{ display: "flex" }}>
                                        <Checkbox
                                            id="is_aggree"
                                            name="is_aggree"
                                            checked={viewConsent}
                                            onChange={handleRadioChange}
                                        />
                                        <div style={{ marginTop: "8px" }}>
                                            <FormLabel component="legend">Agree with the consent</FormLabel>
                                        </div>
                                    </div>
                                </FormControl>
                            </Grid>

                            <Grid item lg={2} md={6} xs={12}>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Upload/Add Signature</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        value={selectedOption}
                                        onChange={handleOptionChange}
                                    // error={!!errors.selectedOption}
                                    // helperText={errors.selectedOption}
                                    >
                                        <FormControlLabel value="upload" control={<Radio size="small" />} label="Upload" />
                                        <FormControlLabel value="add" control={<Radio size="small" />} label="Add" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            {selectedOption === 'upload' && (
                                <Grid item lg={4} md={6} xs={12}>
                                    <TextField
                                        required
                                        id="sign"
                                        name="sign"
                                        label="Upload signature"
                                        type="file"
                                        onChange={handleSignFileChange}
                                        // onChange={(e) => handleFileChange(e, 'sign')}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={!!errors.selectedSign}
                                        helperText={errors.selectedSign}
                                    />
                                </Grid>
                            )}

                            {selectedOption === 'add' && (
                                <Grid item lg={4} md={6} xs={12}>
                                    <SignatureCanvas
                                        penColor='black'
                                        // value={selectedSign}
                                        ref={signatureRef}
                                        // onChange={getSignature()}
                                        // error={!!errors.selectedSign}
                                        // helperText={errors.selectedSign}
                                        canvasProps={{ width: 320, height: 54, background: "white", className: 'sigCanvas', style: { border: '1px solid gray', borderRadius: "5px", } }} />
                                </Grid>

                            )}

                            <Grid item lg={4} md={6} xs={12}>
                                <TextField
                                    required
                                    id="Discharge_summ_docs"
                                    name="Discharge_summ_docs"
                                    label="Upload discharge summary"
                                    onChange={handleFileChange}
                                    type="file"
                                    inputProps={{ multiple: true }}
                                    // accept='application/pdf, image/png'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={!!errors.selectedFiles}
                                    helperText={errors.selectedFiles}
                                />

                            </Grid>
                        </Grid>

                        {viewConsent && (
                            <Grid item lg={12} md={12} xs={12} sx={{ mt: 1, mb: 2 }}>
                                <Button variant='contained' sx={{ textTransform: "capitalize", width: "20ch", borderRadius: "10px" }} onClick={handleSubmitConsent}>Submit</Button>
                            </Grid>
                        )}

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Snackbar
                                open={openSnackbar}
                                autoHideDuration={6000}
                                onClose={handleSnackbarClose}
                            >
                                <Alert variant="filled"
                                    onClose={handleSnackbarClose}
                                    severity={snackbarSeverity}
                                    sx={{ width: '100%', mb: 15 }}
                                >
                                    {snackbarMessage}
                                </Alert>
                            </Snackbar>
                        </Grid>
                    </Box>
                </>
            )}
        </>
    )
}

export default ConsentDetails
