import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Tooltip,
  Grid,
  Box,
  Modal,
  Stack,
  Card,
  CardContent,
  InputBase,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  useMediaQuery,
  CircularProgress,
  AppBar,
} from "@mui/material";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import LanguageIcon from "@mui/icons-material/Language";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { styled } from "@mui/system";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Navbar";
import Footer from "../../../Footer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import Followup from "../Enquiries/ActionComponent/Followup";
import PatientView from "../Viewservice/PatientView";
import CallerView from "../Viewservice/CallerView";

// import Followup from '..//ActionComponent/Followup';

const ServiceCard = styled(Card)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "10px",
  backgroundColor: "white",
  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
  height: "54px",
  borderRadius: "10px",
  transition: "0.5s ease-in-out",
  "&:hover": {
    backgroundColor: "#F7F7F7",
    // cursor: 'pointer',
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  pt: 2,
  px: 4,
  pb: 3,
};

const ITEM_HEIGHT = 48;
const ServiceRequest = () => {
  const navigate = useNavigate();
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const accessHospitalID = localStorage.getItem("hospitalID") || 0;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [serviceRequest, setServiceRequest] = useState([]);
  // const [selectedCallerStatus, setSelectedCallerStatus] = useState(null);
  const [tableHeight, setTableHeight] = useState("auto");
  const [clrName, setclrName] = useState("");
  const [callerNumber, setcallerNumber] = useState('')
  const [callerId, setcallerID] = useState("");
  const [caller, setCaller] = useState('');
  // snehas changes 
  const [eventID, setEventID] = useState("");
  const [paydone, setPaydone] = useState();
  console.log("paydone.......", paydone);

  const [requestAllocation, setRequestAllocation] = useState({});

  // Usestate for Filter values in input field
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedCallerStatus, setSelectedCallerStatus] = useState("");

  const [loading, setLoading] = useState(true);

  //   useState for service requestupdate patient details
  const [patientID, setPatientID] = useState(null);
  console.log("patientID.......", patientID);
  const [openPatientDetails, setOpenPatientDetails] = useState(false);

  const [patient, setPatient] = useState("");
  const [hospital, setHospital] = useState("");
  const [callerData, setCallerData] = useState({
    name: "",
    number: "",
    eventID: "",
    callerID: "",
  });
  const [openDetails, setopenDetails] = useState()
  //  snehas changes
  const handleOpenPatientDetails = () => setOpenPatientDetails(true);
  const handleClosePatientDetails = () => setOpenPatientDetails(false);

  const patientIDRequest = (id) => {
    console.log(id, "id");
    setPatientID(id);
    handleOpenPatientDetails();
  };

  useEffect(() => {
    if (patientID !== null) {
      getPatientDetails();
    }
  }, [patientID]);

  const getPatientDetails = useCallback(async () => {
    if (!patientID) {
      console.error("No patient ID available");
      return;
    }
    try {
      const res = await fetch(
        `${port}/web/patient_detail_info_api/${patientID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data, "Patient Data");

      setPatient(data.patient);
      setHospital(data.hospital);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  }, [patientID, port, accessToken]);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setPage(0);
  };

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleOpenDetails2 = (row) => {
    console.log("Row Data:", row); // Check the row data

    const data = {
      // name: row?.agg_sp_pt_id?.caller_name || "Unknown", // Use safe navigation to avoid undefined errors
      phone: row?.agg_sp_pt_id?.caller_phone_number || "Unknown",
      eventID: row?.eve_id || "",
      callerID: row?.agg_sp_pt_id?.caller_id || "Unknown", // Handle missing caller_id
    };

    console.log("Setting Caller Data:", data); // Log the data before setting the state

    setCallerData(data); // Set the caller data state
    setopenDetails(true)
  };
  const handleCloseDetails2 = () => {
    setopenDetails(false)
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const getServiceRequest = async () => {
      // if (accessHospitalID) {
      try {
        const res = await fetch(
          `${port}/web/service_request/${accessHospitalID}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        console.log("Service Request Data.........", data);
        setServiceRequest(data.event_code);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Service Request Data:", error);
        setLoading(false);
      }
      // }
    };
    getServiceRequest();
  }, [accessHospitalID]);

  useEffect(() => {
    const updateTableHeight = () => {
      const screenHeight = window.innerHeight;
      setTableHeight(`${screenHeight}px`);
    };
    updateTableHeight();
    window.addEventListener("resize", updateTableHeight);
    return () => {
      window.removeEventListener("resize", updateTableHeight);
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Get day with leading zero
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month with leading zero
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getCallerStatusTooltip = (callerStatus) => {
    const icon =
      callerStatus === 1 ? (
        <SmartphoneIcon style={{ color: "#EB8793" }} />
      ) : callerStatus === 2 ? (
        <LanguageIcon style={{ color: "#7AB7EE" }} />
      ) : callerStatus === 3 ? (
        <DirectionsWalkOutlinedIcon style={{ color: "#84CDB1" }} />
      ) : callerStatus === 4 ? (
        <CallOutlinedIcon style={{ color: "#8D9BED" }} />
      ) : callerStatus === 5 ? (
        <DoneAllOutlinedIcon style={{ color: "#8D9BED" }} />
      ) : (
        <ErrorOutlineIcon style={{ color: "#EB8793" }} />
      );

    return <IconButton>{icon}</IconButton>;
  };

  // const filteredData = serviceRequest.filter((item) => {
  //     if (
  //         (selectedDate === '' || item.event_start_date.includes(selectedDate)) &&
  //         (selectedService === '' || item.service_name.toLowerCase().includes(selectedService.toLowerCase())) &&
  //         (selectedCallerStatus === '' || selectedCallerStatus === 5 || item.caller_status === selectedCallerStatus)
  //     ) {
  //         return true;
  //     }
  //     return false;
  // });

  const filteredData = serviceRequest.filter((item) => {
    const isDateMatch =
      !selectedDate ||
      (item.event_start_date && item.event_start_date.includes(selectedDate));
    const isServiceMatch =
      !selectedService ||
      (item.service_name &&
        item.service_name
          .toLowerCase()
          .includes(selectedService.toLowerCase()));
    const isCallerStatusMatch =
      !selectedCallerStatus ||
      selectedCallerStatus === 5 ||
      item.caller_status === selectedCallerStatus;

    return isDateMatch && isServiceMatch && isCallerStatusMatch;
  });

  const getEventIDRequest = (eveId, paydone) => {
    const selectedRequest = serviceRequest.find(
      (item) => item.event_id === eveId
    );
    // console.log("Selected Event:", selectedRequest);
    if (selectedRequest) {
      // console.log("Selected Event ID:", selectedRequest.event_id);
      console.log("Selected payment_is_done:", selectedRequest.payment_is_done);
      setEventID(selectedRequest.event_id);
      setPatientID(selectedRequest.agg_sp_pt_id?.agg_sp_pt_id);
      console.log("hhhfjhdfh", selectedRequest.agg_sp_pt_id?.agg_sp_pt_id);
      setPaydone("ac");
      getRequestAllocation(selectedRequest.payment_is_done);
    }
    // getRequestAllocation();
  };

  const EventIDRequest = (eveId) => {
    const selectedRequest = serviceRequest.find(
      (item) => item.event_id === eveId
    );
    console.log("Selected Event:", selectedRequest);
    setEnqID(selectedRequest.event_id);
    if (selectedRequest) {
      console.log("Selected Event ID:", selectedRequest.event_id);
      setEventID(selectedRequest.event_id);
      setcallerID(selectedRequest.caller_id);
      console.log(selectedRequest.caller_id, "callerddddddd");
      setclrName(selectedRequest.caller_name, "callername");
      setEventID(selectedRequest.event_id)
      setcallerNumber(selectedRequest.caller_phone_number)
    }
    // getRequestAllocation();
  };

  // useEffect(() => {
  const getRequestAllocation = async (a) => {
    if (eventID) {
      try {
        // const res = await fetch(`${port}/web/agg_hhc_srv_req_prof_allocate/${eventID}`);
        const res = await fetch(
          `${port}/web/agg_hhc_srv_req_prof_allocate/${eventID}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        console.log("Request Allocation Data.........", data);
        setRequestAllocation(data);
        const eventValue = data.Event_ID;
        const patientValue = data.patient_details.agg_sp_pt_id;
        const callerValue = data.caller_details.caller_id;
        const eventPlanValue = data.POC[0].eve_poc_id;

        console.log("eventID", eventValue);
        console.log("patientID", patientValue);
        console.log("callerID", callerValue);
        console.log("eventPlanID", eventPlanValue);
        console.log("payyyyyyyyyyyyy", a);

        navigate("/viewservice", {
          state: {
            patientID: patientValue,
            callerID: callerValue,
            eventPlanID: eventPlanValue,
            eventID: eventValue,
            flag: 1,
            paymentStatus: a,
          },
        });
      } catch (error) {
        console.error("Error fetching Request Allocation:", error);
      }
    }
  };
  //     getRequestAllocation();
  // }, [eventID]);

  //Code for Model
  const [preFollowup, setPreFollowup] = useState([]);
  const [enqID, setEnqID] = useState([]);
  const [enq, setEnq] = useState([]);

  const [open1, setOpen1] = useState(false);

  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  function findPreFollowupRecords(eveId) {
    console.log(eveId, "..............");
    setEnqID(eveId);

    // const matchingRecords = enq.find((record) => record.eve_id === eveId);
    // if (matchingRecords) {
    //     // console.log("Previos Followup ID", matchingRecords.eve_id);
    //     setEnqID(matchingRecords.eve_id);
    // }
  }

  useEffect(() => {
    const getPreFollowup = async () => {
      if (enqID) {
        console.log("Event ID.....", enqID);
        try {
          const res = await fetch(`${port}/web/previous_follow_up/2/${enqID}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          console.log("Previous Followup Data.........", data);
          setPreFollowup(data);
        } catch (error) {
          console.error("Error fetching Previous Followup Data:", error);
        }
      }
    };
    getPreFollowup();
  }, [enqID]);

  useEffect(() => {
    const getEnquires = async () => {
      // if (accessHospitalID) {
      try {
        const res = await fetch(
          `${port}/web/Follow_Up_combined_table/${accessHospitalID}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        console.log("Enquiries Data.........", data);
        if (data.detail === "No matching records found") {
          setEnq([]);
          // setLoading(false);
        } else {
          setEnq(data);
          // setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching Enquiries Data:", error);
        // setLoading(false);
      }
      // }
    };
    getEnquires();
  }, [accessHospitalID]);

  useEffect(() => {
    const getCallerDetails = async () => {
      if (callerId) {
        try {
          // const res = await fetch(`${port}/web/Caller_details_api/${callerID}`);
          const res = await fetch(`${port}/web/Caller_details_api/${callerId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await res.json();
          console.log("Caller Details ID wise", data);
          setCaller(data.caller);
          // setRelation(data.caller.caller_rel_id);
        } catch (error) {
          console.error("Error fetching Caller Details ID wise:", error);
        }
      }
    };
    getCallerDetails();
  }, [callerId, callerData]);
  return (
    <>
      <Navbar />
      <Box
        sx={{ flexGrow: 1, mt: 14.6, ml: 1, mr: 1, mb: 2, overflow: "hidden" }}
      >
        <Stack
          direction={isSmallScreen ? "column" : "row"}
          spacing={1}
          alignItems={isSmallScreen ? "center" : "flex-start"}
          sx={{ pt: 1 }}
        >
          <Typography
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginTop: "10px",
              marginLeft: "10px",
            }}
            color="text.secondary"
            gutterBottom
          >
            SERVICE REQUESTS
          </Typography>
          <Box
            component="form"
            sx={{
              marginLeft: "2rem",
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 300,
              height: "2.5rem",
              backgroundColor: "#ffffff",
              boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
              borderRadius: "10px",
              border: "1px solid #C9C9C9",
            }}
          >
            <InputBase
              sx={{ ml: 1, mr: 1, flex: 1 }}
              inputProps={{ "aria-label": "select date" }}
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </Box>

          <Box
            component="form"
            sx={{
              marginLeft: "2rem",
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 300,
              height: "2.5rem",
              backgroundColor: "#ffffff",
              boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
              borderRadius: "10px",
              border: "1px solid #C9C9C9",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Service |"
              inputProps={{ "aria-label": "select service" }}
              value={selectedService}
              onChange={handleServiceChange}
            />
            <IconButton type="button" sx={{ p: "10px" }}>
              <SearchIcon style={{ color: "#7AB7EE" }} />
            </IconButton>
          </Box>

          <Box
            component="form"
            sx={{
              marginLeft: "2rem",
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 310,
              height: "2.5rem",
              backgroundColor: "#ffffff",
              boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
              borderRadius: "10px",
              border: "1px solid #C9C9C9",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="View Request by |"
              inputProps={{ "aria-label": "view request by" }}
            />
            <IconButton
              type="button"
              sx={{ p: "6px" }}
              aria-label="search"
              onClick={() => setSelectedCallerStatus(1)}
            >
              <SmartphoneIcon style={{ color: "#EB8793" }} />
            </IconButton>
            <IconButton
              type="button"
              sx={{ p: "6px" }}
              aria-label="search"
              onClick={() => setSelectedCallerStatus(2)}
            >
              <LanguageIcon style={{ color: "#7AB7EE" }} />
            </IconButton>
            <IconButton
              type="button"
              sx={{ p: "6px" }}
              aria-label="search"
              onClick={() => setSelectedCallerStatus(3)}
            >
              <DirectionsWalkOutlinedIcon style={{ color: "#84CDB1" }} />
            </IconButton>
            <IconButton
              type="button"
              sx={{ p: "6px" }}
              aria-label="search"
              onClick={() => setSelectedCallerStatus(4)}
            >
              <CallOutlinedIcon style={{ color: "#8D9BED" }} />
            </IconButton>
            <IconButton type="button" sx={{ p: "6px" }} aria-label="search">
              <DoneAllOutlinedIcon
                style={{ color: "#F6900D" }}
                onClick={() => setSelectedCallerStatus(5)}
              />
            </IconButton>
          </Box>
        </Stack>

        <TableContainer
          // sx={{ height: tableHeight }}
          sx={{
            height:
              filteredData.length === 0 || filteredData.length < 5
                ? "60vh"
                : "default",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <ServiceCard
                  style={{
                    background: "#69A5EB",
                    color: "#FFFFFF",
                    borderRadius: "8px 10px 0 0",
                  }}
                >
                  <CardContent
                    style={{ width: "5%", borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Sr. No</Typography>
                  </CardContent>
                  <CardContent
                    style={{ width: "5%", borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Source</Typography>
                  </CardContent>
                  <CardContent
                    style={{ width: "8%", borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Event Code</Typography>
                  </CardContent>
                  <CardContent
                    style={{ width: "10%", borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Patient Name</Typography>
                  </CardContent>
                  <CardContent
                    style={{ width: "10%", borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Patient Mobile</Typography>
                  </CardContent>
                  <CardContent
                    style={{ width: "8%", borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Caller Mobile</Typography>
                  </CardContent>
                  {/* <CardContent style={{ width: "15%", borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Preferred Professional</Typography>
                                    </CardContent> */}
                  <CardContent
                    style={{ width: "15%", borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Service Name</Typography>
                  </CardContent>
                  {/* <CardContent style={{ width: "12%", borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Sub Service</Typography>
                                    </CardContent> */}
                  <CardContent
                    style={{ width: "8%", borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Start Date</Typography>
                  </CardContent>
                  <CardContent
                    style={{ width: "6%", borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Zone</Typography>
                  </CardContent>
                  {/* <CardContent style={{ width: "10%", borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant="subtitle2">Address</Typography>
                                    </CardContent> */}
                  <CardContent style={{ width: "8%" }}>
                    <Typography variant="subtitle2">Action </Typography>
                  </CardContent>
                </ServiceCard>
              </TableRow>
            </TableHead>
            {loading ? (
              <Box sx={{ display: "flex", mt: 20, ml: 80, height: "130px" }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <CardContent>
                      <Typography variant="body2">No Data Available</Typography>
                    </CardContent>
                  </TableRow>
                ) : (
                  filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        key={row.event_id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <ServiceCard>
                          <CardContent style={{ width: "5%" }}>
                            <Typography variant="body2">
                              {index + 1 + page * rowsPerPage}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ width: "5%" }}>
                            <Typography variant="body2">
                              {getCallerStatusTooltip(row.caller_status)}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ width: "8%" }}>
                            <Typography variant="body2">
                              {row.event_code}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ width: "10%" }}>
                            <button
                              onClick={() => {
                                patientIDRequest(
                                  row?.patient_id,

                                );
                                handleOpenPatientDetails();
                              }}
                              // onClick={() => {
                              //   patientIDRequest(row?.patient_id);
                              //   handleOpenPatientDetails();
                              // }}
                              style={{
                                border: "none",
                                background: "none",
                                outline: "none",
                                cursor: "pointer",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="body2" textAlign="left">
                                {row.patient_name}
                              </Typography>
                            </button>
                            {/* code change////////////////////////////////////////// */}
                            <Modal
                              open={openPatientDetails}
                              onClose={handleClosePatientDetails}
                              aria-labelledby="patient-modal-title"
                              aria-describedby="patient-modal-description"
                            >
                              <Box
                                sx={{
                                  ...style,
                                  width: 400,
                                  borderRadius: "10px",
                                }}
                              >
                                <AppBar
                                  position="static"
                                  style={{
                                    background:
                                      "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
                                    width: "29rem",
                                    height: "3rem",
                                    marginTop: "-16px",
                                    marginLeft: "-32px",
                                    borderRadius: "8px 10px 0 0",
                                  }}
                                >
                                  <div style={{ display: "flex" }}>
                                    <Typography
                                      align="left"
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        color: "#FFFFFF",
                                        marginTop: "10px",
                                        marginLeft: "18px",
                                      }}
                                    >
                                      PATIENT DETAILS
                                    </Typography>
                                    <Button
                                      onClick={handleClosePatientDetails}
                                      sx={{
                                        marginLeft: "15rem",
                                        color: "#FFFFFF",
                                        marginTop: "2px",
                                      }}
                                    >
                                      <CloseIcon />
                                    </Button>
                                  </div>
                                </AppBar>
                                <PatientView
                                  patientID={patientID}
                                  ptnID={patientID}
                                  ptnData={patient}
                                  hospData={hospital}
                                  open={openPatientDetails}
                                  // savePatientUpdate={savePatientUpdate}
                                  onClose={handleClosePatientDetails}
                                />
                              </Box>
                            </Modal>

                            {/* <Typography variant="body2" textAlign="left">
                              {row.patient_name}
                            </Typography> */}
                          </CardContent>
                          <CardContent style={{ width: "10%" }}>
                            <div style={{ display: "flex" }}>
                              <CallOutlinedIcon
                                sx={{ color: "#3A974C", fontSize: "18px" }}
                              />
                              <Typography variant="body2">
                                {row.patient_number}
                              </Typography>
                            </div>
                          </CardContent>
                          <CardContent style={{ width: "10%" }}>
                            {/* <CardContent style={{ flex: 2 }} key={row.eve_id}>
                            <Typography variant="body2" textAlign="left">
                              {row.agg_sp_pt_id ? row.agg_sp_pt_id.name : ""}
                            </Typography>
                          </CardContent> */}
                            <CardContent
                              style={{
                                width: "8%",
                                // flex:2,/
                              }}
                            >
                              <button
                                onClick={() => {
                                  EventIDRequest(
                                    row.event_id,
                                    row.caller_id,
                                    row?.caller_phone
                                  );
                                  handleOpenDetails2();
                                }}
                                style={{
                                  border: "none",
                                  background: "none",
                                  outline: "none",
                                  cursor: "pointer",
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <div style={{ display: "flex" }}>
                                  <Typography variant="body2" sx={{ mt: 2 }}>
                                    {row.caller_phone_number}
                                  </Typography>
                                </div>

                              </button>
                              <Modal
                                open={openDetails}
                                onClose={handleCloseDetails2}
                                aria-labelledby="parent-modal-title"
                                aria-describedby="parent-modal-description"
                              >
                                <Box
                                  sx={{
                                    ...style,
                                    width: 300,
                                    borderRadius: "10px",
                                  }}
                                >
                                  <AppBar
                                    position="static"
                                    style={{
                                      background:
                                        "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
                                      width: "22.8rem",
                                      height: "3rem",
                                      marginTop: "-16px",
                                      marginLeft: "-32px",
                                      borderRadius: "8px 10px 0 0",
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <Typography
                                        align="left"
                                        style={{
                                          fontSize: "16px",
                                          fontWeight: 600,
                                          color: "#FFFFFF",
                                          marginTop: "10px",
                                          marginLeft: "18px",
                                        }}
                                      >
                                        CALLER DETAILS
                                      </Typography>
                                      <Button
                                        onClick={handleCloseDetails2}
                                        sx={{
                                          marginLeft: "9rem",
                                          color: "#FFFFFF",
                                          marginTop: "2px",
                                        }}
                                      >
                                        <CloseIcon />
                                      </Button>
                                    </div>
                                  </AppBar>
                                  <CallerView
                                    callerID={callerId}
                                    callerNumber={callerNumber}
                                    eveID={eventID}
                                    callerName={clrName}
                                    // callerData={callerData}
                                    reqCallerData={caller}
                                    onClose={handleCloseDetails2}
                                    flag={2}
                                  />
                                </Box>
                              </Modal>
                            </CardContent>

                            <div style={{ display: "flex" }}>
                              <CallOutlinedIcon
                                sx={{ color: "#3A974C", fontSize: "18px" }}
                              />
                              <Typography variant="body2">
                                {row.caller_phone_number}
                              </Typography>
                            </div>
                          </CardContent>
                          {/* <CardContent style={{ width: "15%" }}>
                                                        <Typography variant="body2">{row.professional_preferred === 1 ? "Male" : row.professional_preferred === 2 ? "Female" : "None"}</Typography>
                                                    </CardContent> */}
                          <CardContent style={{ width: "15%" }}>
                            <Typography variant="body2" textAlign="left">
                              {row.service_name}
                            </Typography>
                          </CardContent>
                          {/* <CardContent style={{ width: "12%" }}>
                                                        <Typography variant="body2" textAlign="left">{row.sub_service}</Typography>
                                                    </CardContent> */}
                          <CardContent style={{ width: "8%" }}>
                            <div style={{ display: "flex" }}>
                              <CalendarMonthOutlinedIcon
                                sx={{ color: "#69A5EB", fontSize: "18px" }}
                              />
                              <Typography variant="body2">
                                {formatDate(row.event_start_date)}
                              </Typography>
                            </div>
                          </CardContent>
                          <CardContent style={{ width: "6%" }}>
                            <Typography variant="body2">
                              {row.patient_zone}
                            </Typography>
                          </CardContent>
                          {/* <CardContent style={{ width: "10%" }}>
                                                        <Tooltip title={row.patient_address || ""} arrow>
                                                            <Typography variant="body2" textAlign="left">
                                                                {row.patient_address?.length > 25
                                                                    ? `${row.patient_address.slice(0, 10)}...`
                                                                    : row.patient_address}
                                                            </Typography>
                                                        </Tooltip>
                                                    </CardContent> */}
                          <CardContent style={{ width: "8%" }}>
                            <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-controls={open ? "long-menu" : undefined}
                              aria-expanded={open ? "true" : undefined}
                              aria-haspopup="true"
                              onClick={(event) => {
                                EventIDRequest(row.event_id);
                                handleClick(event);
                              }}

                            // onClick={handleClick}
                            >
                              <MoreHorizIcon />
                            </IconButton>
                            <Menu
                              id="long-menu"
                              MenuListProps={{
                                "aria-labelledby": "long-button",
                              }}
                              anchorEl={anchorEl}
                              open={open}
                              // onClick={()=>getEventIDRequest(row.event_id)}
                              onClose={handleClose}
                              slotProps={{
                                paper: {
                                  style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: "15ch",
                                  },
                                },
                              }}
                            >
                              <MenuItem
                                onClick={() =>
                                  getEventIDRequest(row.event_id, paydone)
                                }
                              >
                                Allocate
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleOpen1(
                                    findPreFollowupRecords(row.event_id)
                                  )
                                }
                              >
                                Followup
                              </MenuItem>
                            </Menu>

                            {/* <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", width: "5rem", height: "2.4rem", marginTop: "8px" }} onClick={() => getEventIDRequest(row.event_id)}>Allocate</Button> */}
                          </CardContent>
                          {/* <CardContent style={{ flex: 1 }}>
                                                        <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", width: "6rem", marginTop: "10px" }} onClick={() => handleOpen(findPreFollowupRecords(row.eve_id))}>Followup</Button>
                                                        <Modal
                                                            open={open1}
                                                            onClose={handleClose1}
                                                            aria-labelledby="modal-modal-title"
                                                            aria-describedby="modal-modal-description"
                                                        >
                                                            <Box sx={{ ...style, width: 320, borderRadius: "10px" }}>
                                                                <div style={{ display: "flex" }}>
                                                                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, marginLeft: "14px", marginTop: "10px" }}>FOLLOW UP</Typography>
                                                                    <Button onClick={handleClose1} sx={{ marginLeft: "9rem", color: "gray", }}><CloseIcon /></Button>
                                                                </div>
                                                                <Followup sendData={preFollowup} enqData={enqID} onClose={handleClose1} />
                                                            </Box>
                                                        </Modal>
                                                    </CardContent> */}
                        </ServiceCard>
                      </TableRow>
                    ))
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Box>
          <Modal
            open={open1}
            onClose={handleClose1}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ ...style, width: 320, borderRadius: "10px" }}>
              <div style={{ display: "flex" }}>
                <Typography
                  align="center"
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginLeft: "14px",
                    marginTop: "10px",
                  }}
                >
                  FOLLOW UP
                </Typography>
                <Button
                  onClick={handleClose1}
                  sx={{ marginLeft: "9rem", color: "gray" }}
                >
                  <CloseIcon />
                </Button>
              </div>
              <Followup
                sendData={preFollowup}
                enqData={enqID}
                onClose={handleClose1}
                flag={2}
              />
            </Box>
          </Modal>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default ServiceRequest;
