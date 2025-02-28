// Shubham code
import React, { useEffect, useState } from "react";
import HRNavbar from "../../../HR/HRNavbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  useMediaQuery,
  CircularProgress,
  TextField,
  Button,
  AppBar,
  InputBase,
  Menu,
  MenuItem,
  Modal,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";

import Footer from "../../../../Footer";
import { GridCheckCircleIcon, GridCloseIcon } from "@mui/x-data-grid";
import axios from "axios";
import ServiceCancellation from "./ServiceCancellation";
import ClosureSessions from "./ClosureSessions";

const customStyles = {
  "& .Mui-focused": {
    outline: "none",
  },
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  pt: 2,
  px: 4,
  pb: 3,
};
const OngoingServiceCard = styled(Card)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "10px",
  backgroundColor: "white",
  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
  height: "55px",
  borderRadius: "10px",
  transition: "0.5s ease-in-out",
  "&:hover": {
    backgroundColor: "#F7F7F7",
    // cursor: 'pointer',
  },
});

const ClosureRevalidation = () => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("searchby");
  const [tempSearchValue, setTempSearchValue] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Mock for screen size
  const [loading, setLoading] = useState(false);
  const [onServices, setOnServices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableHeight, setTableHeight] = useState("auto");
  const [jobClosureData, setJobClosureData] = useState([]);
  const [Error, setError] = useState("");
  const [eventID, setEventID] = useState("");
  console.log("eventID", eventID);


  const [searchValue, setSearchValue] = useState("");
  const [startDateTime, setStartDateTime] = useState("");

  const [tempStartDateTime, setTempStartDateTime] = useState("");

  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const filteredData = onServices;

  const [serviceopenCancel, setserviceOpenCancel] = useState(false);
  const [openSession, setOpenSession] = useState(false);

  const [subSrvID, setSubSrvID] = useState(null);
  const [jobClosureStatus, setJobClosureStatus] = useState(null);
  const [EndDateTime, setEndDateTime] = useState(null);






  // ************** API Integration **********************************************
  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${port}/hr/Ongoing_Event_Closure_Revalidate/`
        );
        console.log("Fetched Data:", response.data); // Log the fetched data
        setOnServices(response.data); // Assuming API returns an array
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [port]);




  // const getOngoingServices = async () => {
  //     setLoading(true);
  //     try {
  //       let apiUrl = `${port}/hr/Ongoing_Event_Closure_Revalidate/`;
  //       if (filterType === "eventCode" && searchValue) {
  //         apiUrl = `${port}/hr/Ongoing_Event_Closure_Revalidate/?eve_code=${searchValue}`;
  //       } else if (filterType === "ptnPhn" && searchValue) {
  //         apiUrl = `${port}/hr/Ongoing_Event_Closure_Revalidate/?patient_no=${searchValue}&date=${startDateTime}`;
  //       } else if (filterType === "ptnName" && searchValue) {
  //         apiUrl = `${port}/hr/Ongoing_Event_Closure_Revalidate/?patient_name=${searchValue}&date=${startDateTime}`;
  //       } else if (filterType === "clrPhn" && searchValue) {
  //         apiUrl = `${port}/hr/Ongoing_Event_Closure_Revalidate/?caller_no=${searchValue}&date=${startDateTime}`;
  //       } else if (filterType === "profName" && searchValue) {
  //         apiUrl = `${port}/hr/Ongoing_Event_Closure_Revalidate/?prof_name=${searchValue}&date=${startDateTime}`;
  //       } else if (startDateTime) {
  //         apiUrl = `${port}/hr/Ongoing_Event_Closure_Revalidate/?date=${startDateTime}`;
  //       }
  //       const res = await fetch(apiUrl, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       const data = await res.json();
  //       console.log("Ongoing Services Data.........", data);
  //       if (data.msg === "data not foundf") {
  //         setOnServices([]);
  //       } else {
  //         setOnServices(data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching Ongoing Services Data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // const getOngoingServices = async () => {
  //   setLoading(true);
  //   try {
  //     const params = new URLSearchParams();
  //     if (searchValue) {
  //       if (filterType === "eventCode") params.append("eve_code", searchValue);
  //       else if (filterType === "ptnPhn") {
  //         params.append("patient_no", searchValue);
  //         if (startDateTime) params.append("date", startDateTime);
  //       } else if (filterType === "ptnName") {
  //         params.append("patient_name", searchValue);
  //         if (startDateTime) params.append("date", startDateTime);
  //       } else if (filterType === "clrPhn") {
  //         params.append("caller_no", searchValue);
  //         if (startDateTime) params.append("date", startDateTime);
  //       } else if (filterType === "profName") {
  //         params.append("prof_name", searchValue);
  //         if (startDateTime) params.append("date", startDateTime);
  //       }
  //     }
  //     if (!params.has("date") && startDateTime) {
  //       params.append("date", startDateTime);
  //     }

  //     const apiUrl = `${port}/hr/Ongoing_Event_Closure_Revalidate/?${params.toString()}`;
  //     const res = await fetch(apiUrl, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  //     const data = await res.json();
  //     console.log("Ongoing Services Data:", data);

  //     if (data.msg === "data not found") {
  //       setOnServices([]);
  //     } else {
  //       setOnServices(data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching Ongoing Services Data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getOngoingServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const trimmedSearchValue = searchValue?.trim(); // Trim whitespace

      if (trimmedSearchValue) {
        if (filterType === "eventCode") params.append("eve_code", trimmedSearchValue);
        else if (filterType === "ptnPhn") {
          params.append("patient_no", trimmedSearchValue);
          if (startDateTime) params.append("date", startDateTime);
        } else if (filterType === "ptnName") {
          params.append("patient_name", trimmedSearchValue);
          if (startDateTime) params.append("date", startDateTime);
        } else if (filterType === "clrPhn") {
          params.append("caller_no", trimmedSearchValue);
          if (startDateTime) params.append("date", startDateTime);
        } else if (filterType === "profName") {
          params.append("prof_name", trimmedSearchValue);
          if (startDateTime) params.append("date", startDateTime);
        }
      }
      if (!params.has("date") && startDateTime) {
        params.append("date", startDateTime);
      }

      const apiUrl = `${port}/hr/Ongoing_Event_Closure_Revalidate/?${params.toString()}`;
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      console.log("Ongoing Services Data:", data);

      if (data.msg === "data not found") {
        setOnServices([]);
      } else {
        setOnServices(data);
      }
    } catch (error) {
      console.error("Error fetching Ongoing Services Data:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getOngoingServices();
  }, [searchValue, startDateTime, filterType]);





  const eventIDRequest = (eveId) => {
    const selectedReschedule = onServices.find((item) => item.eve_id === eveId);
    if (selectedReschedule) {
      console.log("Selected Event ID:", selectedReschedule.eve_id);
      setEventID(selectedReschedule.eve_id);
      setSubSrvID(selectedReschedule.service.sub_service_id);
      setJobClosureStatus(selectedReschedule.job_closure.job_closure_count);
      setEndDateTime(selectedReschedule.service.end_date);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0"); // Get day with leading zero
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month with leading zero
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };





  useEffect(() => {
    // Set screen size state dynamically
    const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener("resize", handleResize);
  }, []);





  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setShowSearchBox(event.target.value !== "searchby");
  };

  const handleTempSearchChange = (event) => {
    setTempSearchValue(event.target.value);
  };




  const handleSubmit = () => {
    // setLoading(true);
    // Mock submit logic
    setSearchValue(tempSearchValue);
    setStartDateTime(tempStartDateTime);


    setLoading(true);
    // setLoading(true);
    setSearchValue(tempSearchValue);
    setStartDateTime(tempStartDateTime);
    setPage(0);
    // getOngoingServices();
  };

  const handleReset = () => {
    setStartDateTime("");
    setTempStartDateTime("");
    setFilterType("searchby");
    setShowSearchBox(false);
    setSearchValue("");
    setTempSearchValue("");
    setShowSearchBox(false);
    setLoading(false);
    setSearchValue("");
    setStartDateTime("");
    console.log("Form reset");
    getOngoingServices();
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getPlaceholderText = () => {
    switch (filterType) {
      case "clrPhn":
        return "Enter Caller Number";
      case "eventCode":
        return "Enter Event Code";
      case "ptnName":
        return "Enter Patient Name";
      case "ptnPhn":
        return "Enter Patient Number";
      case "profName":
        return "Enter Professional Name";
      default:
        return "";
    }
  };
  useEffect(() => {
    const setDynamicHeight = () => {
      const screenHeight = window.innerHeight;
      var tableContainerHeight =
        screenHeight - setTableHeight(tableContainerHeight + "px");
    };
    setDynamicHeight();
    window.addEventListener("resize", setDynamicHeight);
    return () => {
      window.removeEventListener("resize", setDynamicHeight);
    };
  }, []);

  const handleOpenCancel = () => {
    setserviceOpenCancel(true);
  };
  const handleCloseCancel = () => {
    setserviceOpenCancel(false);
  };

  const handleOpenSession = () => {
    setOpenSession(true);
  };
  const handleCloseSession = () => {
    setOpenSession(false);
  };

  return (
    <>
      <HRNavbar />
      <Box sx={{ flexGrow: 1, mt: 14.6, ml: 1, mr: 1, mb: 2 }}>
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
            CLOSURE REVALIDATION
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
              sx={{ ml: 1, flex: 1 }}
              placeholder="Select Start Date"
              type="date"
              value={tempStartDateTime}
              onChange={(e) => setTempStartDateTime(e.target.value)}
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
            <TextField
              select
              size="small"
              fullWidth
              value={filterType}
              onChange={handleFilterTypeChange}
              sx={{
                textAlign: "left",
                "& input": {
                  fontSize: "14px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                },
              }}
            >
              <MenuItem value="searchby" disabled>
                Search by
              </MenuItem>
              <MenuItem value="clrPhn" style={{ fontSize: "15px" }}>
                Caller Number
              </MenuItem>
              <MenuItem value="eventCode" style={{ fontSize: "15px" }}>
                Event Code
              </MenuItem>
              <MenuItem value="ptnName" style={{ fontSize: "15px" }}>
                Patient Name
              </MenuItem>
              <MenuItem value="ptnPhn" style={{ fontSize: "15px" }}>
                Patient Number
              </MenuItem>
              <MenuItem value="profName" style={{ fontSize: "15px" }}>
                Professional Name
              </MenuItem>
            </TextField>
          </Box>

          {showSearchBox && (
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
                placeholder={getPlaceholderText()}
                value={tempSearchValue}
                onChange={handleTempSearchChange}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon style={{ color: "#7AB7EE" }} />
              </IconButton>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              textTransform: "capitalize",
              height: "40px",
              borderRadius: "8px",
              width: "12ch",
            }}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              textTransform: "capitalize",
              height: "40px",
              borderRadius: "8px",
              width: "12ch",
            }}
          >
            Reset
          </Button>
        </Stack>
        <TableContainer
          // style={{ height: tableHeight }}
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
                <OngoingServiceCard
                  style={{
                    background: "#69A5EB",
                    color: "#FFFFFF",
                    borderRadius: "8px 10px 0 0",
                  }}
                >
                  <CardContent
                    style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Sr. No</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Event Code</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Patient Name</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Caller No</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Professional</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Service Name</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Start Date</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">End Date</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Payment Status</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Job Closure</Typography>
                  </CardContent>
                  <CardContent
                    style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}
                  >
                    <Typography variant="subtitle2">Added by</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 0.5 }}>
                    <Typography variant="subtitle2">Action</Typography>
                  </CardContent>
                </OngoingServiceCard>
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
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          height: "auto"
                        }}
                      >
                        <OngoingServiceCard style={{ height: "auto" }}>
                          <CardContent style={{ flex: 0.5 }}>
                            <Typography variant="body2">
                              {index + 1 + page * rowsPerPage}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 2 }}>
                            <Typography variant="body2" textAlign="center">
                              {row.event_code}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 2 }}>
                            <Typography variant="body2" textAlign="center" >
                              {row.agg_sp_pt_id ? row?.agg_sp_pt_id?.name : ""}
                            </Typography>
                          </CardContent>

                          <CardContent style={{ flex: 2 }}>
                            <Typography variant="body2" textAlign="center">
                              {row.agg_sp_pt_id?.caller_phone || "N/A"}
                            </Typography>
                          </CardContent>

                          <CardContent style={{ flex: 2 }}>
                            <Typography variant="body2" textAlign=" ">
                              {row.job_closure
                                ? row.job_closure.service_professional
                                : ""}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 2 }}>
                            <Typography variant="body2" textAlign="center">
                              {row.service ? row.service.service : ""}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 2 }}>
                            <Typography variant="body2" >
                              {formatDate(
                                row.service ? row.service.start_date : ""
                              )}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 2 }}>
                            <Typography variant="body2" textAlign="left">
                              {formatDate(
                                row.service ? row.service.end_date : ""
                              )}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 2 }}>
                            {row.payment.pending_amount === 0 ? (
                              <div style={{ display: "flex" }}>
                                <GridCheckCircleIcon
                                  style={{ fontSize: "16px", color: "#3D8A00" }}
                                />
                                <Typography
                                  variant="body2"
                                  textAlign="center"
                                  sx={{
                                    cursor:
                                      row.payment.payment_status === 1
                                        ? "pointer"
                                        : "default",
                                  }}
                                >
                                  {row.payment.payment_status === 1
                                    ? "Received by professional"
                                    : row.payment.payment_status === 100
                                      ? "Complementary"
                                      : "Received by desk"}
                                </Typography>
                              </div>
                            ) : (
                              <Typography variant="body2" textAlign="center">
                                {row.payment.payment_status === 100 ? (
                                  "Complementary"
                                ) : (
                                  <>
                                    ₹{" "}
                                    <span style={{ color: "#DA0000" }}>
                                      {parseInt(row.payment.pending_amount)}
                                    </span>
                                    /{parseInt(row.payment.final_amount)}
                                  </>
                                )}
                              </Typography>
                            )}
                          </CardContent>

                          <CardContent style={{ flex: 1.2 }}>
                            <Typography variant="body2">
                              {row.job_closure
                                ? row.job_closure.job_closure_count
                                : ""}
                              /
                              {row.job_closure
                                ? row.job_closure.total_session
                                : ""}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1.5 }}>
                            <Tooltip title={row?.added_by?.length > 7 ? row.added_by : ""} arrow>
                              <Typography variant="body2" textAlign="center" noWrap>
                                {row?.added_by?.length > 7 ? `${row.added_by.substring(0, 7)}...` : row?.added_by || "-"}
                              </Typography>
                            </Tooltip>
                          </CardContent>
                          <CardContent style={{ flex: 0.5 }}>
                            {auth && (
                              <div>
                                <IconButton
                                  size="large"
                                  aria-label="account of current user"
                                  aria-controls="menu-appbar"
                                  aria-haspopup="true"
                                  align="right"
                                  onClick={(event) => {
                                    // Pass the event ID to the API function
                                    eventIDRequest(row.eve_id);
                                    handleMenu(event);
                                  }}
                                  color="inherit"
                                >
                                  <MoreHorizIcon
                                    style={{
                                      fontSize: "18px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </IconButton>
                                <Menu
                                  id="menu-appbar"
                                  anchorEl={anchorEl}
                                  anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                  keepMounted
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                  }}
                                  open={Boolean(anchorEl)}
                                  onClose={handleClose}
                                >
                                  <MenuItem
                                    onClick={() => {
                                      handleOpenCancel(() =>
                                        eventIDRequest(row.eve_id)
                                      );
                                    }}
                                  >
                                    Service Cancellation
                                  </MenuItem>

                                  <MenuItem
                                    onClick={() =>
                                      handleOpenSession(() =>
                                        eventIDRequest(row.eve_id)
                                      )
                                    }
                                  >
                                    Closure Validation
                                  </MenuItem>
                                </Menu>
                                <Modal
                                  open={serviceopenCancel}
                                  onClose={handleCloseCancel}
                                  aria-labelledby="parent-modal-title"
                                  aria-describedby="parent-modal-description"
                                >
                                  <Box
                                    sx={{
                                      ...style,
                                      width: 300,
                                      borderRadius: "10px",
                                      border: "none",
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
                                          align="center"
                                          style={{
                                            fontSize: "16px",
                                            fontWeight: 600,
                                            color: "#FFFFFF",
                                            marginTop: "10px",
                                            marginLeft: "15px",
                                          }}
                                        >
                                          SERVICE CANCELLATION
                                        </Typography>
                                        <Button
                                          onClick={handleCloseCancel}
                                          sx={{
                                            marginLeft: "6rem",
                                            color: "#FFFFFF",
                                            marginTop: "2px",
                                          }}
                                        >
                                          <GridCloseIcon />
                                        </Button>
                                      </div>
                                    </AppBar>
                                    <ServiceCancellation
                                      eventID={eventID}
                                      subSrvID={subSrvID}
                                      jobClosureStatus={jobClosureStatus}
                                      endDateTime={EndDateTime}
                                      onClose={handleCloseCancel}
                                    />
                                  </Box>
                                </Modal>
                                <Modal
                                  open={openSession}
                                  onClose={handleCloseSession}
                                  aria-labelledby="parent-modal-title"
                                  aria-describedby="parent-modal-description"
                                >
                                  <Box
                                    sx={{
                                      ...style,
                                      width: 800,
                                      borderRadius: "10px",
                                      border: "none",
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <Typography
                                        align="center"
                                        style={{
                                          fontSize: "16px",
                                          fontWeight: 600,
                                          marginTop: "10px",
                                          marginLeft: "2px",
                                          color: "gray",
                                        }}
                                      >
                                        All SESSIONS
                                      </Typography>
                                      <Button
                                        onClick={handleCloseSession}
                                        sx={{
                                          marginLeft: "39.5rem",
                                          color: "gray",
                                          marginTop: "2px",
                                        }}
                                      >
                                        <GridCloseIcon />
                                      </Button>
                                    </div>
                                    <ClosureSessions
                                      eveID={eventID}
                                      subSrvID={subSrvID}
                                    />
                                  </Box>
                                </Modal>
                              </div>
                            )}
                          </CardContent>
                        </OngoingServiceCard>
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
      </Box>
      <Footer />
    </>
  );
};

export default ClosureRevalidation;
