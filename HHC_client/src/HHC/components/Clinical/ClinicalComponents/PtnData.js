import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import hrt from "../../../assets/heart.png";
import blood from "../../../assets/blood.png";
import CallEndOutlinedIcon from '@mui/icons-material/CallEndOutlined';
import { Alert, Snackbar, Button, TextField, Grid, Box, Typography } from '@mui/material';
import VideoCall from "./VideoCall";

const PtnData = ({ eveId, clrID, ptnID, evePlanID, profID }) => {
  const navigate = useNavigate();
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const [ptnData, setPtnData] = useState([]);
  const [clrData, setClrData] = useState([]);
  const [vitalData, setVitalData] = useState([]);
  const [pre, setPre] = useState('');
  const [note, setNote] = useState('');

  const [spo2, setSpo2] = useState('');
  const [pulse, setPulse] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [abdomen, setAbdomen] = useState('');
  const [skinHair, setSkinHair] = useState('');
  const [resSystem, setResSystem] = useState('');
  const [cardSystem, setCardSystem] = useState('');
  const [sysPressure, setSysPressure] = useState('');
  const [diaPressure, setDiaPressure] = useState('');
  const [nervouSystem, setNervouSystem] = useState('');
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const getClrData = async () => {
      if (clrID) {
        try {
          const res = await fetch(`${port}/medical/get_caller_details/${clrID}/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await res.json();
          console.log("Caller Data Details.........", data);
          setClrData(data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setClrData([]);
        }
      }
    };
    getClrData();
  }, [clrID, port, accessToken]);

  useEffect(() => {
    const getPtnData = async () => {
      if (ptnID) {
        console.log("Patient Details Data.........", ptnID);
        try {
          const res = await fetch(`${port}/medical/get_patients_details/${ptnID}/`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await res.json();
          console.log("Patient Details Data.........", data);
          setPtnData(data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setPtnData([]);
        }
      }
    };
    getPtnData();
  }, [ptnID, port, accessToken]);

  useEffect(() => {
    const getVitalData = async () => {
      // if (eveId) {
      try {
        const res = await fetch(`${port}/medical/all_vital_data/${1798}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        console.log("VitalData Details Data.........", data);
        setVitalData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setVitalData([]);
      }
    }
    // };
    getVitalData();
  }, [port, accessToken]);

  const handleFieldUpdate = (field, value) => {
    setVitalData({ ...vitalData, [field]: value });
  };

  async function handleUpdate(event) {
    event.preventDefault();
    const requestData = {
      pulse: pulse,
      systolic_pressure: sysPressure,
      diastolic_pressure: diaPressure,
      spo2: spo2,
      respiratory_system_rs: resSystem,
      cardiovascular_system_svs: cardSystem,
      central_nervous_system_cns: nervouSystem,
      skin_and_hair: skinHair,
      abdomen: abdomen,
      height: height,
      weight: weight,
    };
    console.log("Vital Details Update Hitting......", requestData)
    try {
      const response = await fetch(`${port}/medical/vital_details_update/1/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        // throw new Error(`HTTP error! Status: ${response.status}`);
        setOpenSnackbar(true);
        setSnackbarMessage('something went wrong.');
        setSnackbarSeverity('warning');
      } else {
        const result = await response.json();
        console.log("Results.....", result);
        setOpenSnackbar(true);
        setSnackbarMessage('Vital details update successfully.');
        setSnackbarSeverity('success');
        window.location.reload();
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const requestData = {
      prescription: pre,
      note: note,
      event_id: eveId,
      detailed_plan_of_care: evePlanID,
      patient_id: ptnID,
      prof_id: profID,
      vital_id: ptnID,
    };
    console.log("Vital Details API Hitting......", requestData)
    try {
      const response = await fetch(`${port}/medical/Post_Vital_remark_data/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        // throw new Error(`HTTP error! Status: ${response.status}`);
        setOpenSnackbar(true);
        setSnackbarMessage('something went wrong.');
        setSnackbarSeverity('warning');
      } else {
        const result = await response.json();
        console.log("Results.....", result);
        setOpenSnackbar(true);
        setSnackbarMessage('Vital details submitted successfully.');
        setSnackbarSeverity('success');
        window.location.reload();
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <div>
      <Grid item xs={12} container spacing={1} sx={{ pt: 3 }}>
        <Grid lg={6} md={6} sm={12} xs={12}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "20px" }}>PATIENT DETAILS</Typography>
          <Box sx={{ border: '1px solid #B2B3AE', borderRadius: "4px", padding: '22px', mt: "10px", height: "68vh" }}>
            {/* <img src={vdocall} alt="" style={{ width: "100%", height: "60vh" }} /> */}
            {/* <VideoCall /> */}
            {/* <Button variant="contained" sx={{ textTransform: "capitalize", borderRadius: "8px", ml: "10rem", mt: "30px", mb: "22px", width: "15ch", background: "#F7392E", ":hover": { background: "#F7392E" } }} onClick={handleSubmit}><CallEndOutlinedIcon sx={{ mr: 1 }} />End Call</Button> */}
            <Box sx={{ background: ' #E2F0F4', borderRadius: "4px", padding: '14px' }}>
              <Typography variant='subtitle2' sx={{ fontSize: "16px", fontWeight: 900 }}>CALLER DETAILS</Typography>
              {/* <hr /> */}
              <Typography variant='body2'><b>Name:</b> {clrData[0]?.caller_fullname}</Typography>
              <Typography variant='body2'><b>Contact:</b> {clrData[0]?.phone}</Typography>
            </Box>
            {/* <hr /> */}
            <Box sx={{ background: ' #E2F0F4', borderRadius: "4px", padding: '14px', mt: "10px" }}>
              <Typography variant='subtitle2' sx={{ fontSize: "16px", fontWeight: 900 }}>PATIENT DETAILS</Typography>
              {/* <hr /> */}
              <Typography variant='body2'><b>Name:</b> {ptnData[0]?.name}</Typography>
              <Typography variant='body2'><b>Contact:</b> {ptnData[0]?.phone_no}</Typography>
              <Typography variant='body2'><b>Gender:</b> {ptnData[0]?.gender_id === 1 ? "Male" : "Female"}</Typography>
              <Typography variant='body2'><b>Age:</b> {ptnData[0]?.Age}</Typography>
              <Typography variant='body2'><b>Consultant:</b> {ptnData[0]?.cons_name}</Typography>
              <Typography variant='body2'><b>Hospital:</b> {ptnData[0]?.hospital_name}</Typography>
            </Box>
            <Grid item xs={12} container spacing={1} mt={2}>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <TextField id="standard-basic" variant="standard" label="Prescription" name="prescription"
                  value={pre} onChange={(e) => setPre(e.target.value)}
                // error={!!errors.sp}
                // helperText={errors.sp} 
                />
              </Grid>

              <Grid lg={6} md={6} sm={6} sx={6}>
                <TextField id="standard-basic" variant="standard" label="Note" name="note"
                  value={note} onChange={(e) => setNote(e.target.value)}
                // error={!!errors.sp}
                // helperText={errors.sp} 
                />
              </Grid>
            </Grid>
            <Button variant="contained" sx={{ textTransform: "capitalize", borderRadius: "8px", ml: "10rem", mt: "30px", mb: "22px", width: "20ch" }} onClick={handleSubmit}>Submit</Button>
          </Box>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert variant="filled"
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: '100%', ml: 16, mb: 10 }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Grid>
        <Grid lg={6} md={6} sm={12} xs={12}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "20px" }}>VITAL DETAILS</Typography>
          <Box sx={{
            border: '1px solid #B2B3AE', borderRadius: "4px", padding: '18px', mt: "10px", ml: "10px",
            height: "69.4vh",
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

            {/* <Box sx={{ background: ' #E2F0F4', borderRadius: "4px", padding: '14px' }}>
              <Typography variant='subtitle2' sx={{ fontSize: "14px" }}>CALLER DETAILS</Typography>
              <Typography variant='body2'><b>Name:</b> {clrData[0]?.caller_fullname}</Typography>
              <Typography variant='body2'><b>Contact:</b> {clrData[0]?.phone}</Typography>
              <hr />
              <Typography variant='subtitle2' sx={{ fontSize: "14px" }}>PATIENT DETAILS</Typography>
              <Typography variant='body2'><b>Name:</b> {ptnData[0]?.name}</Typography>
              <Typography variant='body2'><b>Contact:</b> {ptnData[0]?.phone_no}</Typography>
              <Typography variant='body2'><b>Gender:</b> {ptnData[0]?.gender_id === 1 ? "Male" : "Female"}</Typography>
              <Typography variant='body2'><b>Age:</b> {ptnData[0]?.Age}</Typography>
              <Typography variant='body2'><b>Consultant:</b> {ptnData[0]?.cons_name}</Typography>
              <Typography variant='body2'><b>Hospital:</b> {ptnData[0]?.hospital_name}</Typography>
            </Box> */}
            <Grid item xs={12} container spacing={1} mt={1}>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <div style={{ display: "flex" }}>
                  <Box sx={{ bgcolor: "#E6E2EF", height: "30px", width: "40px", borderRadius: "4px" }}>
                    <img src={blood} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    SpO2
                  </Typography>
                </div>

                <TextField id="standard-basic" variant="standard" name="spO2" value={vitalData[0]?.spo2 || ''}
                  // onChange={(e) => setSpo2(e.target.value)}
                  onChange={(e) => handleFieldUpdate("spO2", e.target.value)}
                // error={!!errors.sp}
                // helperText={errors.sp} 
                />%
              </Grid>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <div style={{ display: "flex" }}>
                  <Box sx={{ bgcolor: "#F2E3E8", height: "30px", width: "40px", borderRadius: "4px" }}>
                    <img src={hrt} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                  </Box>

                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Pulse-beats/min
                  </Typography>
                </div>

                <TextField id="standard-basic" variant="standard" name="pulse" value={vitalData[0]?.pulse}
                  onChange={(e) => setPulse(e.target.value)}
                // error={!!errors.pulse}
                // helperText={errors.pulse} 
                />bpm
              </Grid>
            </Grid>
            <Grid item xs={12} container spacing={1} mt={2}>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <div style={{ display: "flex", }}>
                  <Box sx={{ bgcolor: "#E6E2EF", height: "30px", width: "40px", borderRadius: "4px" }}>
                    <img src={blood} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Systolic Pressure
                  </Typography>
                </div>

                <TextField id="standard-basic" variant="standard" name="systolic_pressure" value={vitalData[0]?.systolic_pressure}
                  onChange={(e) => setSysPressure(e.target.value)}
                // error={!!errors.sp}
                // helperText={errors.sp} 
                />mm
              </Grid>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <div style={{ display: "flex" }}>
                  <Box sx={{ bgcolor: "#F2E3E8", height: "30px", width: "40px", borderRadius: "4px" }}>
                    <img src={hrt} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                  </Box>

                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Diastolic Pressure
                  </Typography>
                </div>

                <TextField id="standard-basic" variant="standard" name="diastolic_pressure" value={vitalData[0]?.diastolic_pressure}
                  onChange={(e) => setDiaPressure(e.target.value)}
                // error={!!errors.pulse}
                // helperText={errors.pulse} 
                />mm
              </Grid>
            </Grid>
            <Grid item xs={12} container spacing={1} mt={2}>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <div style={{ display: "flex" }}>
                  <Box sx={{ bgcolor: "#E6E2EF", height: "30px", width: "40px", borderRadius: "4px" }}>
                    <img src={blood} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Height
                  </Typography>
                </div>

                <TextField id="standard-basic" variant="standard" name="height" value={vitalData[0]?.height}
                  onChange={(e) => setHeight(e.target.value)}
                // error={!!errors.sp}
                // helperText={errors.sp} 
                />cm
              </Grid>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <div style={{ display: "flex" }}>
                  <Box sx={{ bgcolor: "#F2E3E8", height: "30px", width: "40px", borderRadius: "4px" }}>
                    <img src={hrt} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                  </Box>

                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Weight
                  </Typography>
                </div>

                <TextField id="standard-basic" variant="standard" name="weight" value={vitalData[0]?.weight}
                  onChange={(e) => setWeight(e.target.value)}
                // error={!!errors.pulse}
                // helperText={errors.pulse} 
                />kg
              </Grid>
            </Grid>
            <Grid item xs={12} container spacing={1} mt={2}>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <div style={{ display: "flex" }}>
                  <Box sx={{ bgcolor: "#E6E2EF", height: "30px", width: "40px", borderRadius: "4px" }}>
                    <img src={blood} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Central Nervous
                  </Typography>
                </div>

                <TextField id="standard-basic" variant="standard" align="center" name="central_nervous_system_cns" value={vitalData[0]?.central_nervous_system_cns}
                  onChange={(e) => setNervouSystem(e.target.value)}
                // error={!!errors.sp}
                // helperText={errors.sp} 
                />
              </Grid>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <div style={{ display: "flex" }}>
                  <Box sx={{ bgcolor: "#F2E3E8", height: "30px", width: "40px", borderRadius: "4px" }}>
                    <img src={hrt} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                  </Box>

                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Skin and Hair
                  </Typography>
                </div>

                <TextField id="standard-basic" variant="standard" name="skin_and_hair" value={vitalData[0]?.skin_and_hair}
                  onChange={(e) => setSkinHair(e.target.value)}
                // error={!!errors.pulse}
                // helperText={errors.pulse} 
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container spacing={1} mt={2}>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <div style={{ display: "flex" }}>
                  <Box sx={{ bgcolor: "#E6E2EF", height: "30px", width: "40px", borderRadius: "4px" }}>
                    <img src={blood} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Respiratory System
                  </Typography>
                </div>

                <TextField id="standard-basic" variant="standard" name="respiratory_system_rs" value={vitalData[0]?.respiratory_system_rs}
                  onChange={(e) => setResSystem(e.target.value)}
                // error={!!errors.sp}
                // helperText={errors.sp} 
                />
              </Grid>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <div style={{ display: "flex" }}>
                  <Box sx={{ bgcolor: "#F2E3E8", height: "30px", width: "40px", borderRadius: "4px" }}>
                    <img src={hrt} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                  </Box>

                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Cardiovascular System
                  </Typography>
                </div>

                <TextField id="standard-basic" variant="standard" name="cardiovascular_system_svs" value={vitalData[0]?.cardiovascular_system_svs}
                  onChange={(e) => setCardSystem(e.target.value)}
                // error={!!errors.pulse}
                // helperText={errors.pulse} 
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container spacing={1} mt={2}>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <div style={{ display: "flex" }}>
                  <Box sx={{ bgcolor: "#E6E2EF", height: "30px", width: "40px", borderRadius: "4px" }}>
                    <img src={blood} alt="" style={{ marginTop: "4px", marginLeft: "8px", height: "20px" }} />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Abdomen
                  </Typography>
                </div>

                <TextField id="standard-basic" variant="standard" name="abdomen" value={vitalData[0]?.abdomen}
                  onChange={(e) => setAbdomen(e.target.value)}
                // error={!!errors.sp}
                // helperText={errors.sp} 
                />
              </Grid>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <Button variant="contained" sx={{ textTransform: "capitalize", borderRadius: "8px", ml: "2rem", mt: "10px", width: "15ch" }} onClick={handleUpdate}>Update</Button>
              </Grid>
            </Grid>

            {/* <Grid item xs={12} container spacing={1} mt={2}>
              <Grid lg={6} md={6} sm={6} sx={6}>
                <TextField id="standard-basic" variant="standard" label="Prescription" name="prescription"
                  value={pre} onChange={(e) => setPre(e.target.value)}
                // error={!!errors.sp}
                // helperText={errors.sp} 
                />
              </Grid>

              <Grid lg={6} md={6} sm={6} sx={6}>
                <TextField id="standard-basic" variant="standard" label="Note" name="note"
                  value={note} onChange={(e) => setNote(e.target.value)}
                // error={!!errors.sp}
                // helperText={errors.sp} 
                />
              </Grid>
            </Grid> */}
            {/* <Button variant="contained" sx={{ textTransform: "capitalize", borderRadius: "8px", ml: "10rem", mt: "30px", mb: "22px", width: "20ch" }}>Submit</Button> */}
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default PtnData
