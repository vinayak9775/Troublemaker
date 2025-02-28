import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useMediaQuery,
  CircularProgress,
  TextField,
  Box,
  Stack,
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
  Snackbar,
} from "@mui/material";
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CloseIcon from "@mui/icons-material/Close";
import TopHeader from '../TopHeader'
import Header from '../Header'
import Footer from '../../../Footer';
import { border, styled } from "@mui/system";
import PtnData from "./PtnData";

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
  pt: 2,
  px: 4,
  pb: 3,
};
const TelemedCard = styled(Card)({
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


const Telemedicine = () => {
  const navigate = useNavigate();
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");
  const [telemed, setTelemed] = useState([]);
  const filteredData = telemed;
  const [eventID, setEventID] = useState("");
  const [callerID, setCallerID] = useState("");
  const [patientID, setPatientID] = useState("");
  const [evePlanID, setEvePlanID] = useState("");
  const [profID, setProfID] = useState("");
  const [tempStartDateTime, setTempStartDateTime] = useState('');
  const [tempEndDateTime, setTempEndDateTime] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableHeight, setTableHeight] = useState("auto");
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openPatient, setOpenPatient] = useState(false);

  const [enabledIcons, setEnabledIcons] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const today = new Date().toISOString().split("T")[0];

  const handleOpenPatient = () => setOpenPatient(true);
  const handleClosePatient = () => setOpenPatient(false);

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

  const getTelemed = async () => {
    try {
      const res = await fetch(`${port}/medical/ongoing_event_telemedicine/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log("Telemed Data.........", data);
      setTelemed(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTelemed()
  }, [port, accessToken]);

  useEffect(() => {
    const updateIconsState = () => {
      const currentDateTime = new Date();
      const today = currentDateTime.toISOString().split("T")[0];

      const updatedIcons = telemed.map((item) => {
        const service = item.session_data;
        const serviceStartTime = new Date(
          `${service.sess_end_date}T${service.sess_start_time}`
        );
        const timeDifference = serviceStartTime - currentDateTime;
        const isToday = service.sess_end_date === today;
        const isWithin15Minutes =
          timeDifference > 0 && timeDifference <= 15 * 60 * 1000;

        return isToday && isWithin15Minutes;
      });

      setEnabledIcons(updatedIcons);
    };
    updateIconsState();
    const interval = setInterval(updateIconsState, 60000);
    return () => clearInterval(interval);
  }, [telemed]);

  const eventIDRequest = (eveId) => {
    const selectedRequest = telemed.find((item) => item.eve_id === eveId);
    if (selectedRequest) {
      setEventID(selectedRequest.eve_id);
      setCallerID(selectedRequest.agg_sp_pt_id.caller_id);
      setPatientID(selectedRequest.agg_sp_pt_id.patient_id);
      setEvePlanID(selectedRequest.service.eve_poc_id);
      setProfID(selectedRequest.job_closure.srv_prof_id);
    }
  };

  const handleReset = () => {
    setTempStartDateTime('');
    setTempEndDateTime('');
    getTelemed();
  }

  const handleSubmit = () => {
    if (tempStartDateTime && tempEndDateTime) {
      getTelemedDateWise(tempStartDateTime, tempEndDateTime);
    }
    else {
      getTelemed()
    }
  }

  const getTelemedDateWise = async (fromdate, todate) => {
    setLoading(true);
    try {
      const res = await fetch(`${port}/medical/ongoing_event_telemedicine/?start_date=${fromdate}&end_date=${todate}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log("datewise Telemedicine Data.........", data);
      if (data.msg === 'data not foundf') {
        setTelemed([]);
      } else {
        setTelemed(data);
      }
      setPage(0);

    } catch (error) {
      console.error("Error fetching Telemedicine Data:", error);
    } finally {
      setLoading(false);
    }
  };

  // const userID = "9999";
  //     const userName = "9999";
  //     const appID = 1158068054;
  //     const serverSecret = "da324915bfc2bcf083d59e546d3bddcf";
  
  //     useEffect(() => {
  //         const loadZegoSDK = async () => {
  //             const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
  //             const { ZIM } = await import("zego-zim-web");
              
  //             const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
  //                 appID,
  //                 serverSecret,
  //                 null,
  //                 userID,
  //                 userName
  //             );
              
  //             const zp = ZegoUIKitPrebuilt.create(TOKEN);
  //             zp.addPlugins({ ZIM });
              
  //             zp.setCallInvitationConfig({
  //                 ringtoneConfig: {
  //                     incomingCallUrl: "https://www.speroems.com/zegovideo/medicalring.mp3",
  //                     outgoingCallUrl: "https://www.speroems.com/zegovideo/medicalring.mp3",
  //                 },
  //             });
  //         };
          
  //         loadZegoSDK();
  //     }, []);
  
  //     const invite = async () => {
  //         const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
  //         const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
  //             appID,
  //             serverSecret,
  //             null,
  //             userID,
  //             userName
  //         );
  
  //         const zp = ZegoUIKitPrebuilt.create(TOKEN);
          
  //         const targetUser = {
  //             userID: "108",
  //             userName: "108",
  //         };
          
  //         zp.sendCallInvitation({
  //             callees: [targetUser],
  //             callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
  //             timeout: 60,
  //         }).then((res) => {
  //             console.warn(res);
  //         }).catch((err) => {
  //             console.warn(err);
  //         });
  //     }

  const userID = "5378";
  const userName = "5378";
  const appID = 1158068054;
  const serverSecret = "da324915bfc2bcf083d59e546d3bddcf";

  useEffect(() => {
      const loadZegoSDK = async () => {
          const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
          const { ZIM } = await import("zego-zim-web");
          
          const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
              appID,
              serverSecret,
              null,
              userID,
              userName
          );
          
          const zp = ZegoUIKitPrebuilt.create(TOKEN);
          zp.addPlugins({ ZIM });
          
          zp.setCallInvitationConfig({
              ringtoneConfig: {
                  incomingCallUrl: "https://www.speroems.com/zegovideo/medicalring.mp3",
                  outgoingCallUrl: "https://www.speroems.com/zegovideo/medicalring.mp3",
              },
          });
      };
      
      loadZegoSDK();
  }, []);

  const invite = async () => {
      const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
      const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          null,
          userID,
          userName
      );

      const zp = ZegoUIKitPrebuilt.create(TOKEN);
      
      const targetUser = {
          userID: "9876543210",
          userName: "9876543210",
      };
      
      zp.sendCallInvitation({
          callees: [targetUser],
          callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
          timeout: 60,
      }).then((res) => {
          console.warn(res);
      }).catch((err) => {
          console.warn(err);
      });
  }


  return (
    <div>
      <TopHeader />
      {/* <Header /> */}
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
            TELEMEDICINE SERVICES
          </Typography>

          <Box
            component="form"
            sx={{ marginLeft: "2rem", p: "2px 4px", display: "flex", alignItems: "center", width: 300, height: "2.5rem", backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9", }}>
            <InputBase
              sx={{ ml: 1, mr: 1, flex: 1 }}
              type="date"
              min={today}
              value={tempStartDateTime}
              onChange={(event) => setTempStartDateTime(event.target.value)}
            />
          </Box>

          <Box
            component="form"
            sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
          >
            <InputBase
              sx={{ ml: 1, mr: 1, flex: 1 }}
              type='date'
              min={today}
              value={tempEndDateTime}
              onChange={event => setTempEndDateTime(event.target.value)}
            />
          </Box>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={loading}
            sx={{ textTransform: "capitalize", height: "40px", borderRadius: "8px", width: "12ch" }}>Submit</Button>
          <Button
            variant='outlined'
            onClick={handleReset}
            sx={{ textTransform: "capitalize", height: "40px", borderRadius: "8px", width: "12ch" }}>Reset</Button>
        </Stack>

        <TableContainer
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
                <TelemedCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }} >
                  <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Sr. No</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Event Code</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Caller Name</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Caller No</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Professional</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Start Date</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">End Date</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1 }}>
                    <Typography variant="subtitle2">Action</Typography>
                  </CardContent>
                </TelemedCard>
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
                        }}>
                        <TelemedCard style={{ height: "60px" }}>
                          <CardContent style={{ flex: 0.5 }}>
                            <Typography variant="body2">
                              {index + 1 + page * rowsPerPage}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1.5 }}>
                            <Typography variant="body2">
                              {row.event_code}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 2 }}>
                            <Typography variant="body2">
                              {row?.agg_sp_pt_id?.caller_name}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1.5 }}>
                            <Typography variant="body2">
                              {row.agg_sp_pt_id?.caller_phone || "-"}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 2 }}>
                            <Typography variant="body2">
                              {row.job_closure
                                ? row.job_closure.service_professional
                                : ""}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1.5 }}>
                            <Typography variant="body2">
                              {formatDate(
                                row.service ? row.service.start_date : ""
                              )}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1.5 }}>
                            <Typography variant="body2">
                              {formatDate(
                                row.service ? row.service.end_date : ""
                              )}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                              <VideocamOutlinedIcon sx={{ color: enabledIcons[index] ? "#F2003D" : "gray", cursor: enabledIcons[index] ? "pointer" : "default", fontSize: "30px" }}
                                // onClick={() => {
                                //   eventIDRequest(row.eve_id);
                                //   handleOpenPatient();
                                // }} 
                                onClick={invite}
                                />
                               <RemoveRedEyeOutlinedIcon sx={{ color: "#067BC9", fontSize: "25px" }} onClick={() => {
                                  eventIDRequest(row.eve_id);
                                  handleOpenPatient();
                                }}/> 
                            </div>
                            <Modal
                              open={openPatient}
                              onClose={handleClosePatient}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                            >
                              <Box sx={{ ...style, width: 1000, borderRadius: "10px" }}>
                                <AppBar
                                  position="static"
                                  style={{
                                    background:
                                      "linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)",
                                    width: "66.5rem",
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
                                    <Button onClick={handleClosePatient} sx={{ marginLeft: "52rem", color: "#FFFFFF", marginTop: "2px", }}>
                                      <CloseIcon />
                                    </Button>
                                  </div>
                                </AppBar>
                                <PtnData
                                  ptnID={patientID}
                                  clrID={callerID}
                                  eveId={eventID}
                                  evePlanID={evePlanID}
                                  profID={profID}
                                  onClose={handleClosePatient}
                                />
                              </Box>
                            </Modal>
                          </CardContent>
                        </TelemedCard>
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
    </div>
  )
}

export default Telemedicine
