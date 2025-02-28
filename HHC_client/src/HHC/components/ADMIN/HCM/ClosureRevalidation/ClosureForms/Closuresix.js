import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Closuresix = ({
  getSessionDetils,
  formNo,
  evePlanID,
  profSD,
  profST,
  profED,
  profET,
  sessions,
  onClose,
  eveID,
  eventID,
}) => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  console.log(eveID, "eveID", eventID, "eventID");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [remark, setRemark] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [endTime, setEndTime] = useState("");


  const [closureRevalidateRemark, setClosureRevalidateRemark] = useState("");
  const [errors, setErrors] = useState({
    remark: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

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
    if (!remark) {
      newErrors.remark = "Required";
    }
    if (!closureRevalidateRemark) {
      newErrors.closureRevalidateRemark = "Required"; // Corrected here
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
  console.log("Closure Form 6", startDate, startTime, endDate, endTime);

  // apicall

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${port}/hr/event_wise_job_clouser_dtls/${eveID}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

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
        setRemark(sessionDetails[0]?.Remark || "");
        setClosureRevalidateRemark(
          sessionDetails[0]?.closure_revalidate_remark || ""
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [eveID]);

  async function handleClosureSixSubmit(event) {
    event.preventDefault();
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
      prof_st_dt: startDate,
      prof_st_time: startTime,
      prof_ed_dt: endDate,
      prof_ed_time: endTime,
      Remark: remark,
      closure_revalidate: 1,
      closure_revalidate_remark: closureRevalidateRemark,
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
      <Box sx={{ flexGrow: 1, bgcolor: "#ffffff" }}>
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

        <Grid item xs={12} container spacing={1} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              id="standard-basic"
              required
              label="Remark"
              variant="outlined"
              multiline
              rows={3}
              sx={{ width: "42ch" }}
              name="Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              error={!!errors.remark}
              helperText={errors.remark}
            />
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
              width: "20ch",
              borderRadius: "12px",
              ml: "6rem",
              textTransform: "capitalize",
            }}
            onClick={handleClosureSixSubmit}
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
            sx={{ width: "20rem", ml: 2, mb: 10 }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Closuresix;
