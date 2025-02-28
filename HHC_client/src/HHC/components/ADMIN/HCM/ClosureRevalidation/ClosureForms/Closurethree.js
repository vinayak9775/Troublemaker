import React, { useState, useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Closurethree = ({
  getSessionDetils,
  formNo,
  evePlanID,
  profSD,
  profST,
  profED,
  profET,
  sessions,
  onClose,
  EventID,
  eveID,
}) => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  // console.log("Closure Form 3", formNo, evePlanID, profSD, profST, profED, profET, sessions, onClose ,eveID);
  // Now you can use all these props directly inside the component
  console.log("EventID received in Closurethree:", eveID);

  const [wound, setWound] = useState(null);
  const [oozing, setOozing] = useState(null);
  const [discharge, setDischarge] = useState(null);
  const [dressing, setDressing] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const [sessionDetails, setSessionDetails] = useState([]);
  const [patientDetails, setPatientDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const [closureRevalidateRemark, setClosureRevalidateRemark] = useState("");

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    console.log(startDate);
    validateEndDate(event.target.value, endDate);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    validateEndDate(startDate, event.target.value);
  };

  const validateEndDate = (start, end) => {
    if (start && end) {
      const startDateObj = new Date(start);
      const endDateObj = new Date(end);

      if (endDateObj < startDateObj) {
        setEndDateError("End date can't be earlier than the start date");
      } else {
        setEndDateError("");
      }
    } else {
      setEndDateError("");
    }
  };

  const getCurrentDateTimeString = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEmptyField = () => {
    const newErrors = {};
    if (!startDate) {
      newErrors.startDate = "Required";
    }
    if (!startTime) {
      newErrors.startTime = "Required";
    }
    if (!endDate) {
      newErrors.endDate = "Required";
    }
    if (!endTime) {
      newErrors.endTime = "Required";
    }
    if (!closureRevalidateRemark) {
      newErrors.closureRevalidateRemark = "Required";
    }
    setErrors(newErrors);
    return Object.values(newErrors).some((error) => error !== "");
  };

  useEffect(() => {
    setStartDate(profSD);
    setStartTime(profST);
    setEndDate(profED);
    setEndTime(profET);
  }, [profSD, profST, profED, profET]);
  console.log("Closure Form 3", startDate, startTime, endDate, endTime);

  //   Get api call/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${port}/hr/event_wise_job_clouser_dtls/${eveID}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const patientDetails = data[0]?.pt_dtt || {};
        const sessionDetails = data[0]?.job_closure_dtl || [];

        // Set default values based on API response
        // Populate other fields if applicable (e.g., wound, discharge)
        setStartDate(sessionDetails[0]?.sess_s_date || "");
        setEndDate(sessionDetails[0]?.sess_e_date || "");
        setStartTime(sessionDetails[0]?.sess_s_time || "");
        setEndTime(sessionDetails[0]?.sess_e_time || "");
        setClosureRevalidateRemark(sessionDetails[0]?.closure_revalidate_remark || "");
        setWound(sessionDetails[0]?.Wound || "");
        setOozing(sessionDetails[0]?.Oozing || "");
        setDischarge(sessionDetails[0]?.Discharge || "");
        setDressing(sessionDetails[0]?.Dressing_status || "");
        setPatientDetails(patientDetails);
        setSessionDetails(sessionDetails);
        setLoading(false);


      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [eveID]);




  async function handleClosureThreeSubmit(event) {
    event.preventDefault();
    // handleEmptyField();
    const hasErrors = handleEmptyField();
    if (hasErrors) {
      return;
    }
    if (sessions.length === 0) {
      console.error("No session data available.");
      return;
    }
    const requestData = {
      form_number: formNo,
      Wound: wound,
      Oozing: oozing,
      Discharge: discharge,
      Dressing_status: dressing,
      prof_st_dt: startDate,
      prof_st_time: startTime,
      prof_ed_dt: endDate,
      prof_ed_time: endTime,
      closure_revalidate_remark: closureRevalidateRemark,
      closure_revalidate: 1,
    };
    console.log("POST API Hitting......", requestData);
    try {
      const response = await fetch(
        `${port}/hr/agg_hhc_session_job_closure/?dtl_eve=${evePlanID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
      const result = await response.json();
      console.log("Closure data", result);
    
      setSnackbarMessage('Closure data submitted successfully!');
      setOpenSnackbar(true);
      setTimeout(async () => {
        onClose();
        await getSessionDetils();
      }, 2000);

  
      

    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#ffffff",
          overflow: "auto",
          maxHeight: "600px",
          Width: "100%",
        }}
      >
        <div style={{ display: "flex" }}>
          <Typography
            align="center"
            style={{ fontSize: "16px", fontWeight: 600, marginTop: "10px" }}
          >
            CLOSURE FORM
          </Typography>
          <Button
            onClick={onClose}
            sx={{ marginLeft: "176px", marginTop: "2px", color: "gray" }}
          >
            <CloseIcon />
          </Button>
        </div>

        <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={6} sm={6} lg={6}>
            <TextField
              required
              id="prof_st_dt"
              name="prof_st_dt"
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              size="small"
              fullWidth
              error={!!errors.startDate}
              helperText={errors.startDate}
              sx={{
                "& input": {
                  fontSize: "14px",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            // inputProps={{
            //     min: getCurrentDateTimeString(),
            // }}
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={6}>
            <TextField
              required
              id="prof_st_time"
              name="prof_st_time"
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              size="small"
              fullWidth
              error={!!errors.startTime}
              helperText={errors.startTime}
              sx={{
                "& input": {
                  fontSize: "14px",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={6} sm={6} lg={6}>
            <TextField
              required
              id="prof_ed_dt"
              name="prof_ed_dt"
              label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              size="small"
              fullWidth
              error={endDateError !== "" || !!errors.endDate}
              helperText={endDateError || errors.endDate}
              sx={{
                "& input": {
                  fontSize: "14px",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            // inputProps={{
            //     min: getCurrentDateTimeString(),
            // }}
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={6}>
            <TextField
              required
              id="prof_ed_time"
              name="prof_ed_time"
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              size="small"
              fullWidth
              error={!!errors.endTime}
              helperText={errors.endTime}
              sx={{
                "& input": {
                  fontSize: "14px",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box
              sx={{
                border: "1px solid #B2B3AE",
                borderRadius: "4px",
                padding: "8px",
              }}
            >
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Wound
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  // name="row-radio-buttons-group"
                  name="Wound"
                  value={wound}
                  checked={wound}
                  onChange={(e) => setWound(parseInt(e.target.value))}

                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Healthy"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Unhealthy"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box
              sx={{
                border: "1px solid #B2B3AE",
                borderRadius: "4px",
                padding: "8px",
              }}
            >
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Discharge
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  // name="row-radio-buttons-group"
                  name="Discharge"
                  value={discharge}
                  onChange={(e) => setDischarge(e.target.value)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Serious"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Serosanguinous"
                  />
                  <FormControlLabel
                    value="3"
                    control={<Radio />}
                    label="Sanguinous"
                  />
                  <FormControlLabel
                    value="4"
                    control={<Radio />}
                    label="Purulent"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box
              sx={{
                border: "1px solid #B2B3AE",
                borderRadius: "4px",
                padding: "8px",
              }}
            >
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Oozing
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  // name="row-radio-buttons-group"
                  name="Oozing"
                  value={oozing}
                  onChange={(e) => setOozing(e.target.value)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Present"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="Absent"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box
              sx={{
                border: "1px solid #B2B3AE",
                borderRadius: "4px",
                padding: "8px",
              }}
            >
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Healing
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  // name="row-radio-buttons-group"
                  name="Dressing_status"
                  value={dressing}
                  onChange={(e) => setDressing(e.target.value)}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Healing"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio />}
                    label="NotHealing"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={12}>
             <TextField
                          id="closure_revalidate_remark"
                          name="closure_revalidate_remark"
                          label="Closure Revalidate Remark"
                          variant="outlined"
                          multiline
                          RowsMax={4}
                          required
                          rows={2}
                          fullWidth
                          value={closureRevalidateRemark}
                          onChange={(e) => setClosureRevalidateRemark(e.target.value)}
                          error={!!errors.closureRevalidateRemark}
                          helperText={errors.closureRevalidateRemark}
                        />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} lg={12} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              width: "25ch",
              borderRadius: "12px",
              ml: "4.6rem",
              textTransform: "capitalize",
            }}
            onClick={handleClosureThreeSubmit}
          >
            Submit
          </Button>
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            variant="filled"
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "20rem", ml: 3, mb: 10 }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Closurethree;
