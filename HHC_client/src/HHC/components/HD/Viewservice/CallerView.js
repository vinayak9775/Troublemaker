import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import IconButton from "@mui/material/IconButton";
import {
  CardContent,
  Typography,
  Button,
  DialogActions,
  DialogTitle,
  Dialog,
  DialogContent,
  AppBar,
  Alert,
} from "@mui/material";

const CallerView = ({
  clrID,
  onClose,
  eveId,
  eveID,
  callerID,
  eventID,
  callerNumber,
  callerName,
  clrName,
  caller,
  reqCallerData,
  Datareqcaller,
}) => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  console.log(eveId, "callerID");
  const [errors, setErrors] = React.useState({ caller_fullname: null });

  const [relation, setRelation] = useState([]);
  const [selectedRelation, setSelectedRelation] = useState("");
  const [call, setCall] = useState([]);
  const [selectedCall, setSelectedCall] = useState("");
  const [callerIds, setCallerIddd] = useState(null);
  console.log(callerIds, "callerIddd");
  const [updateResponseData, setUpdateResponseData] = useState(null);
  //   const [selectedCall, setSelectedCall] = useState("");
  const [conflictData, setConflictData] = useState(null);
  console.log(conflictData, "conflictData");
  //   const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  // usestate for updated data
  // const [callerData, setCallerData] = useState({ ...caller });
  // const [relData, setRelData] = useState({ caller_rel_id: relationID.relation });
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const openRemarkModal = () => setIsRemarkModalOpen(true);
  const closeRemarkModal = () => setIsRemarkModalOpen(false);
  const [tempCallerData, setTempCallerData] = useState({});

  const handleDropdownRelation = (event) => {
    const selectedRelation = event.target.value;
    setSelectedRelation(selectedRelation);
  };
  // const [callerData, setCallerData] = useState({...caller || reqCallerData });
  const [callerData, setCallerData] = useState({
    ...(caller || reqCallerData || Datareqcaller),
  });

  console.log(callerData.caller_fullname, "callerData-->");

  useEffect(() => {
    setCallerData({
      ...(caller || reqCallerData || Datareqcaller),
    });
  }, [caller, reqCallerData, Datareqcaller]);

  useEffect(() => {
    console.log("Received Props:", {
      callerID,
      callerName,
      callerNumber,
      eveID,
    });
  }, [callerID, callerName, callerNumber, eveID]);

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  // sneha code end

  const handleDropdownCall = (event) => {
    const selectedCall = event.target.value;
    setSelectedCall(selectedCall);
  };

  // useEffect(() => {
  //   const getRelation = async () => {
  //     try {
  //       // const res = await fetch(`${port}/web/agg_hhc_caller_relation_api`);
  //       const res = await fetch(`${port}/web/agg_hhc_caller_relation_api`, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       const data = await res.json();
  //       console.log("Relation...", data);
  //       setRelation(data);
  //     } catch (error) {
  //       console.error("Error fetching Relation data:", error);
  //     }
  //   };
  //   getRelation();
  // }, []);

  useEffect(() => {
    const callPurpose = async () => {
      try {
        // const res = await fetch(`${port}/web/agg_hhc_purpose_call_api`);
        const res = await fetch(`${port}/web/agg_hhc_purpose_call_api`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("Call Purpose", data);
        setCall(data);
      } catch (error) {
        console.error("Error fetching Call purpose data:", error);
      }
    };
    callPurpose();
  }, []);

  // const handleFieldChange = (field, value) => {
  //   setCallerData({ ...callerData, [field]: value });
  //   if (fieldName === "caller_fullname") {
  //     const validationError = validateFullName(value);
  //     setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: validationError }));
  //   }
  // };

  const handleFieldChange = (field, value) => {
    // Update the state for callerData
    setCallerData((prev) => ({ ...prev, [field]: value }));
    if (field === "phone") {
      const validationError = validatePhoneNumber(value);
      setErrors((prevErrors) => ({ ...prevErrors, phone: validationError }));
    }
      if (field === "caller_fullname") {
      const validationError = validateFullName(value); // Call the validation function
      setErrors((prevErrors) => ({ ...prevErrors, [field]: validationError }));
    }
  };
  
 
  async function saveCallerUpdate(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
  
    const requestData = {
      phone: callerData.phone,
      caller_fullname: callerData.caller_fullname,
    };
  
    console.log("Caller Update API Hitting......", requestData);
    const callerIDs = clrID || callerID;
    if (callerIDs) {
      try {
        const response = await fetch(
          `${port}/web/Caller_details_api/${callerIDs}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );
  
        if (response.ok) {
          const result = await response.json();
          setSnackbarMessage("Details updated successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          console.log("Update successful:", result);
  
          // Update state to reflect changes in the UI
          setCallerData((prev) => ({
            ...prev,
            caller_fullname: result.caller_fullname,
            phone: result.phone,
          }));
          window.location.reload();
          setIsConflictModalOpen(false);
        } else if (response.status === 409) {
          const errorData = await response.json();
          console.error("Conflict detected:", errorData);
          setCallerIddd(errorData.Caller_id);
          setConflictData(errorData);
          setIsConflictModalOpen(true);
        } else {
          const errorText = await response.text();
          setSnackbarMessage(`Please fill * mark field.`);
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          console.error(
            `HTTP error! Status: ${response.status}, Error: ${errorText}`
          );
        }
      } catch (error) {
        setSnackbarMessage("An error occurred while updating details.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        console.error("An error occurred:", error);
      }
    }
  }
  
  const updateCallerViewData = (updatedData) => {
    // Example: Update caller view state directly
    setCallerData((prev) => ({
      ...prev,
      ...updatedData,
    }));

    // Or re-fetch the updated data if necessary
    saveCallerUpdate();
  };

  const handleConflictYes = async () => {
    if (!remark || remark === "") {
      alert("Please enter a remark before proceeding.");
      return;
    }
    setIsConflictModalOpen(false);
    console.log("Resolving conflict...");
    const callerIDs = clrID || callerID;
    const eventIDs = eveId || eveID;
    if (callerIDs || eventIDs) {
      try {
        console.log("eveId or callerId", eventIDs, callerIDs);
  
        const requestDataaaa = {
          remark: remark,
          caller_fullname: callerData.caller_fullname,
        };
  
        console.log(requestDataaaa, "requestDataaaarequestDataaaa");
  
        const response = await fetch(
          `${port}/web/update_caller_event/${eventIDs}/${callerIds}/`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestDataaaa),
          }
        );
  
        if (response.ok) {
          const result = await response.json();
          console.log("Conflict resolved successfully:", result);
          setSnackbarMessage("Details updated successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          window.location.reload();
          // Update the UI with the new data
          setCallerData((prev) => ({
            ...prev,
            caller_fullname: result.caller_fullname,
            phone: result.phone,
          }));

          setCallerData(result);
          closeRemarkModal();
        } else {
          const errorText = await response.text();
          setSnackbarMessage("Failed to update details. Please try again.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          // console.error(
          //   `Failed to resolve conflict. Status: ${response.status}, Error: ${errorText}`
          // );
        }
      } catch (error) {
        setSnackbarMessage("An error occurred. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        console.error("Error resolving conflict:", error);
      }
    }
  };
  const handleConflictNo = () => {
    setIsConflictModalOpen(false);
    window.location.reload();
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const validateFullName = (name) => {
    const nameRegex = /^[A-Za-z]+( [A-Za-z]+){0,2}$/;
    if (!name) {
      return "Name is required";
    } else if (!nameRegex.test(name)) {
      return "Name accept only characters, Up to 3 spaces";
    }
    return null;
  };
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Only numeric values, exactly 10 digits
    if (!phone) {
      return "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      return "Enter a valid 10-digit phone number";
    }
    return null;
  };
  
  return (
    <Box>
      <CardContent>
        <Grid item xs={12} container spacing={2} sx={{ marginTop: "1px" }}>
          <Grid item lg={12} sm={12} xs={12}>
            <TextField
              required
              id="phone"
              name="phone"
              label="Contact"
              placeholder="+91 |"
              size="small"
              fullWidth
              value={callerData.phone || ""}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              error={!!errors.phone} // Show error state if there's a validation error
              helperText={errors.phone || ""} // Display validation error message
              // onChange={handlePhoneNumberChange}
              // onInput={handleInput}
              // onKeyPress={handleSearch}
              // error={!!phoneNumberError}
              // helperText={phoneNumberError}
              inputProps={{
                minLength: 10,
                maxLength: 10,
              }}
              sx={{
                "& input": {
                  fontSize: "14px",
                },
              }}
            />
          </Grid>
          <Grid item lg={12} sm={12} xs={12}>
            <TextField
              required
              label="Full Name"
              id="outlined-size-small"
              placeholder="First Name | Last Name *"
              size="small"
              fullWidth
              name="caller_fullname"
              value={callerData.caller_fullname || ""}
              onChange={(e) => handleFieldChange("caller_fullname", e.target.value)}
              error={!!errors.caller_fullname} // Set error state
              helperText={errors.caller_fullname} // Display validation error
              sx={{
                "& input": {
                  fontSize: "14px",
                },
              }}
            />
          </Grid>
          {/* <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            id="caller_rel_id"
                            name="caller_rel_id"
                            select
                            label="Select Relation"
                            size="small"
                            fullWidth
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        >
                            {relation.map((option) => (
                                <MenuItem key={option.caller_rel_id} value={option.caller_rel_id}>
                                    {option.relation}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

          <Grid item lg={12} sm={12} xs={12}>
            <Button
              variant="contained"
              sx={{
                m: 2,
                width: "25ch",
                backgroundColor: "#7AB8EE",
                borderRadius: "12px",
                textTransform: "capitalize",
                mx: 5,
              }}
              onClick={saveCallerUpdate}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={isConflictModalOpen}
        onClose={handleConflictNo}
        style={{ width: "auto" }}
      >
        <DialogTitle style={{ fontSize: "18px" }}>
          Are You Sure You Want to Update ?
        </DialogTitle>
        <DialogContent>
          <Typography inline variant="body2" color="text.primary">
            {" "}
            {conflictData?.error}
          </Typography>
          <Typography inline variant="body2" color="text.primary">
            {" "}
            <strong>Message : </strong>{" "}
            {conflictData?.Message || "Conflict exists"}
          </Typography>
          {/* {
            <p>
              <strong>Caller ID:</strong> {conflictData?.Caller_id}
            </p>
          } */}
          <Typography inline variant="body2" color="text.primary">
            {" "}
            <strong>Name : </strong> {conflictData?.Caller_Name}
          </Typography>
          <Typography inline variant="body2" color="text.primary">
            {" "}
            <strong>Number : </strong> {conflictData?.Caller_Number}
          </Typography>
        </DialogContent>
        <DialogActions
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Button variant="contained" onClick={openRemarkModal} color="primary">
            Yes
          </Button>

          <Button
            variant="contained"
            onClick={handleConflictNo}
            color="secondary"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isRemarkModalOpen} onClose={closeRemarkModal}>
        <AppBar
          position="static"
          style={{
            background: "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
            width: "100%",
            height: "3.5rem",
            borderRadius: "8px 8px 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            Add a Remark
          </Typography>
        </AppBar>

        <DialogContent style={{ padding: "1.5rem 2rem" }}>
          <TextField
            label="Remark"
            placeholder="Add your remark here"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            name="remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </DialogContent>
        <DialogActions
          style={{ justifyContent: "center", paddingBottom: "1rem" }}
        >
          <Button
            variant="contained"
            onClick={() => {
              handleConflictYes();
              closeRemarkModal();
            }}
            color="primary"
            disabled={!remark || remark === ""}
            style={{
              padding: "0.6rem 2rem",
              fontSize: "14px",
              fontWeight: 600,
              backgroundColor:
                remark && remark.trim() !== "" ? "#7AB8EE" : "lightgrey",
              color: "#FFFFFF",
              cursor:
                remark && remark.trim() !== "" ? "pointer" : "not-allowed",
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CallerView;
