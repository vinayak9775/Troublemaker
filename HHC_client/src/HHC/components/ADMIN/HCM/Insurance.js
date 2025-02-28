import React, { useState, useEffect } from "react";
import HRNavbar from "../../HR/HRNavbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
  useMediaQuery,
  Grid,
  CircularProgress,
  AppBar,
  Menu,
  Modal,
  Checkbox,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Tooltip,
  IconButton,
  Snackbar,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  InputBase,
  TablePagination,
  TableCell,
  ListItemText,
  Autocomplete,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import html2PDF from "jspdf-html2canvas";
import Footer from "../../../Footer";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const InsuranceCard = styled(Card)({
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
  },
});
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
export const Insurance = () => {
  const navigate = useNavigate();
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem("token");

  const [service, setService] = useState([]);
  const [ptnName, setPtnName] = useState(""); // Initialize patient name state
  console.log(ptnName, "ptnName");
  const [onServices, setOnServices] = useState([]);
  const filteredData = onServices;
  const [modalOpen, setModalOpen] = useState(false);
  const [ptnNumber, setPtnNumber] = useState();
  const [showPatientDropdowns, setShowPatientDropdowns] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [consultantList, setConsultantList] = useState([]); // Renamed for clarity
  console.log("consultantList", consultantList);
  const [selectedConsultant, setSelectedConsultant] = useState("");
  console.log("selectedConsultant", selectedConsultant);
  const [patientData, setPatientData] = useState([]);
  console.log(patientData,'patientDatapatientData');
  
  const [hospitalData, setHospitalData] = useState([]);
  console.log("hospitalData-->", hospitalData);
  const [selectedHospital, setSelectedHospital] = useState("");
  console.log("selectedHospital-->", selectedHospital);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tableHeight, setTableHeight] = useState("auto");
  const [tableWidth, setTableWidth] = useState("auto");
  const [insuranceData, setInsuranceData] = useState(null); // Stores fetched data
  const [consultantSearchTerm, setConsultantSearchTerm] = useState();
  const [hospitalSearchTerm, setHospitalSearchTerm] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [subService, setSubService] = useState([]);
  console.log("selectedService", selectedService);
  const [selectedSubService, setSelectedSubService] = useState("");
  console.log("selectedSubService1111", selectedSubService);
  const [showAdditionalDropdowns, setShowAdditionalDropdowns] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [filteredZones, setFilteredZones] = React.useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState([]);
  console.log("Selected Event IDs:", selectedEventIds);

  const [policyNumber, setPolicyNumber] = useState("");
  const [policyNumberError, setPolicyNumberError] = useState(false);
  const [isDataFetched, setIsDataFetched] = React.useState(false); // State to track data availability
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [modalData, setModalData] = useState({
    Patient_name: "",
    consultant_name: "",
    hospital_name: "",
    Total_Service_Days_Count: 0,
    Date_arr_all_sessions: [],
    Sub_servive_cost: 0,
    Discount_Amount: 0,
    Conveyance_Amount: 0,
    Final_Amount: 0,
    suffered_from: "",
  });
  console.log("Modal Data:", modalData); // Check modalData state

  console.log("Payload Data:", {
    evelst: selectedEventIds,
    ptn_id: selectedPatient,
    hosp_id: selectedHospital,
    consult_id: selectedConsultant,
    insurance_dates: modalData.Date_arr_all_sessions.map((date) => date[0]),
    total_cost: modalData.Sub_servive_cost * modalData.Total_Service_Days_Count,
    discount: modalData.Discount_Amount,
    conveyance: modalData.Conveyance_Amount,
    final_cost: modalData.Final_Amount,
    policy_number: policyNumber,
  });
// This will run whenever modalData is updated

  const [existingEventModalOpen, setExistingEventModalOpen] = useState(false);

  useEffect(() => {
    const getService = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_services_api`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setService(data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    getService();
  }, []);

  useEffect(() => {
    fetchPatientData();
  }, [
    selectedService,
    startDate,
    endDate,
    subService,
    selectedPatient,
    selectedHospital,
    selectedConsultant,
  ]);

  const fetchPatientData = async () => {
    try {
      const res = await fetch(
        `${port}/hhc_hcm/date_srvwise_ptn_lst/?srv_id=${selectedService}&from_date=${startDate}&to_date=${endDate}&sub_srv_id=${selectedSubService}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data, "fetch API RES");
      setPatientData(data);
      setFilteredPatients(data);

      // handle sorting method for consultant and hospital
      if (data && data.length > 0) {
        // Using Maps to store unique hospital and consultant objects
        const hospitalMap = new Map();
        const consultantMap = new Map();

        // Using Sets to track unique hospital and consultant names
        const hospitalNamesSet = new Set();
        const consultantNamesSet = new Set();

        data.forEach((patient) => {
          if (patient.hosp_list) {
            patient.hosp_list.forEach((hospital) => {
              if (!hospitalNamesSet.has(hospital.hosp_name)) {
                hospitalNamesSet.add(hospital.hosp_name);
                hospitalMap.set(hospital.hosp_id, { ...hospital });
              }
            });
          }

          if (patient.const_list) {
            patient.const_list.forEach((consultant) => {
              if (!consultantNamesSet.has(consultant.doct_cons_name)) {
                consultantNamesSet.add(consultant.doct_cons_name);
                consultantMap.set(consultant.doct_cons_id, { ...consultant });
              }
            });
          }
        });

        // Convert Maps to Arrays
        let uniqueHospitals = Array.from(hospitalMap.values());
        let uniqueConsultants = Array.from(consultantMap.values());

        // Sort hospitals and consultants alphabetically by name
        uniqueHospitals.sort((a, b) => a.hosp_name.localeCompare(b.hosp_name));
        uniqueConsultants.sort((a, b) =>
          a.doct_cons_name.localeCompare(b.doct_cons_name)
        );

        console.log(uniqueHospitals, "Final Unique Hospitals List");
        console.log(uniqueConsultants, "Final Unique Consultants List");

        setHospitalData(uniqueHospitals);
        setConsultantList(uniqueConsultants);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const InsuranceDetails = async () => {
    setLoading(true);
    try {
      const url = `${port}/hhc_hcm/Insurance_Get_API/?srv_id=${selectedService}&start_date=${startDate}&end_date=${endDate}&hospital=${selectedHospital}&ptn_id=${selectedPatient?.ptn_id}&consultant=${selectedConsultant}&sub_srv_id=${selectedSubService}`;
      console.log("API URL:", url);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`API call failed with status ${res.status}`);
      }

      const result = await res.json();
      setData(result);
      console.log("Fetched Insurance Details:", result);
    } catch (error) {
      console.error("Error fetching insurance data:", error);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    const getSubService = async () => {
      if (selectedService) {
        try {
          const res = await fetch(
            `${port}/web/agg_hhc_sub_services_api/${selectedService}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          setSubService(data);
        } catch (error) {
          console.error("Error fetching sub service data:", error);
        }
      } else {
        setSubService([]);
      }
    };
    getSubService();
  }, [selectedService, port, accessToken]);

  useEffect(() => {
    if (startDate && endDate && selectedService) {
      setShowPatientDropdowns(true);
      fetchPatientData(); // Fetch patient data dynamically
    } else {
      setShowPatientDropdowns(false);
    }
  }, [startDate, endDate, selectedService]);

  const handleOpenModal = async () => {
    // Check for selected events
    if (selectedEventIds.length === 0) {
      alert("Please select at least one event to preview!");
      return;
    }
    console.log("Selected Event IDs:", selectedEventIds);

    try {
      const response = await fetch(`${port}/hhc_hcm/Insurance_Doc_API/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          eve_id: selectedEventIds,
        }),
      });

      console.log("API Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("API Response Data:", responseData);

      // Check for existing insurance
      if (
        typeof responseData?.data === "string" &&
        responseData.data.includes("This events already have insurance")
      ) {
        console.log("Insurance already exists for the selected events.");
        setExistingEventModalOpen(true); // Open the "Existing Insurance" modal
        setSnackbarMessage("Selected events already have insurance.");
        setSnackbarOpen(true);
        return;
      }
      // If no existing insurance, set modal data for creating or updating insurance
      if (responseData?.data) {
        setModalData({
          Patient_name: responseData.data.Patient_name || "",
          consultant_name: responseData.data.consultant_name || "",
          service_name: responseData.data.service_name || "",
          Sub_srv_name: responseData.data.Sub_srv_name || "",
          hospital_name: responseData.data.hospital_name || "",
          suffered_from: responseData.data.suffered_from || "",
          Total_Service_Days_Count:
            responseData.data.Total_Service_Days_Count || 0,
          Date_arr_all_sessions: responseData.data.Date_arr_all_sessions || [],
          Sub_servive_cost: responseData.data.Sub_servive_cost || 0,
          Discount_Amount: responseData.data.Discount_Amount || 0,
          Conveyance_Amount: responseData.data.Conveyance_Amount || 0,
          Final_Amount: responseData.data.Final_Amount || 0,
        });

        console.log("Modal data set successfully:", modalData);
        setModalOpen(true); // Open the modal for new or updated insurance
      } else if (responseData?.data === ``) {
        // Handle case where no valid data is received
        setSnackbarMessage("No data received for the selected events.");
        setSnackbarOpen(true);
        console.error("Invalid API response", responseData);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred while fetching data.");
      setSnackbarOpen(true);
      console.error("Error fetching modal data:", error);
    }
  };

  const handleSubmitAndDownload = async () => {
    if (isDisabled) return; // Prevent multiple submissions
    if (selectedEventIds.length === 0) {
      alert("Please select at least one event!");
      return;
    }
    if (!policyNumber || !policyNumber.trim()) {
      setPolicyNumberError(true); // Show error
      setSnackbarMessage("Please enter a policy number."); // Show snackbar error message
      setSnackbarOpen(true);
      return;


    }
    setPolicyNumberError(false);
    setLoading(true); // Start loading state

    try {
      const submitResponse = await fetch(
        `${port}/hhc_hcm/submit_insurance_events_dtl/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            evelst: selectedEventIds,
            ptn_id: selectedPatient.ptn_id,
            hosp_id: selectedHospital,
            consult_id: selectedConsultant,
            insurance_dates: modalData.Date_arr_all_sessions.map(
              (date) => date[0]
            ),
            total_cost:
              modalData.Sub_servive_cost * modalData.Total_Service_Days_Count,
            discount: modalData.Discount_Amount,
            conveyance: modalData.Conveyance_Amount,
            final_cost: modalData.Final_Amount,
            policy_number: policyNumber,
          }),
        }
      );

      if (!submitResponse.ok) {
        throw new Error(
          `Failed to submit insurance details: ${submitResponse.statusText}`
        );
      }

      setSnackbarMessage("Insurance details submitted successfully!");
      setSnackbarOpen(true);
      setPolicyNumber(""); // Clear policy number after submission

      // Generate PDF
      const boxElement = document.getElementById("pdfContent"); // Get the content

      if (!boxElement) {
        console.error("PDF content element not found!");
        return;
      }

      // Validate and sanitize policyNumber
      let safePolicyNumber = policyNumber ? policyNumber.trim() : "";
      safePolicyNumber = safePolicyNumber.replace(/[\/\\:*?"<>|]/g, ""); // Remove invalid filename characters

      const dynamicFilename = safePolicyNumber
        ? `${safePolicyNumber}.pdf`
        : `mediclaim_certificate_${new Date().getTime()}.pdf`; // Fallback filename

      console.log("Dynamic Filename:", dynamicFilename); // Debugging

      try {
        const canvas = await html2canvas(boxElement, { scale: 2 }); // Capture content as an image
        const imgData = canvas.toDataURL("image/png"); // Convert canvas to PNG

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "letter",
        });

        const contentWidth = canvas.width;
        const contentHeight = canvas.height;

        const pdfWidth = 450; // A4 width in points (approximately 8.27 inches)
        const pdfHeight = 900; // A4 height in points (approximately 11.69 inches)

        const scaleX = pdfWidth / contentWidth;
        const scaleY = pdfHeight / contentHeight;

        const scale = Math.min(scaleX, scaleY);

        const newWidth = contentWidth * scale;
        const newHeight = contentHeight * scale;

        pdf.addImage(imgData, "PNG", 0, 0, newWidth, newHeight);

        pdf.save(dynamicFilename); // Save with custom filename
        console.log("PDF downloaded successfully!");
        setIsDisabled(true); // Permanently disable button after PDF is generated
        // ✅ Refresh the list after submission

        await InsuranceDetails(); // Call API function to refresh data
        setSelectedEventIds([]);

        // ✅ Force UI Update by Setting State Again
        setTimeout(() => {
          setModalOpen(false); // ✅ Close modal after 2 seconds
        }, 2000);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarOpen(true);
      setLoading(false); // Re-enable button only if there's an error
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleSubmit = () => {
    if (
      startDate &&
      endDate &&
      selectedService &&
      selectedSubService &&
      selectedConsultant &&
      selectedPatient &&
      selectedHospital
    ) {
      console.log("Form submitted successfully");
      InsuranceDetails(); // Fetch insurance data
      // setShowPatientDropdowns(true); // Show additional dropdowns
      setIsDataFetched(true); // Set data availability to true
    } else {
      console.log("Please fill all required fields");
      // setShowPatientDropdowns(false); // Hide additional dropdowns if validation fails
      setIsDataFetched(false); // Ensure buttons remain hidden
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
 
  const handleRowSelect = (eveId) => {
    setSelectedEventIds((prev) =>
      prev.includes(eveId)
        ? prev.filter((id) => id !== eveId)
        : [...prev, eveId]
    );
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = patientData.filter((item) =>
      item.ptn_name.toLowerCase().includes(value)
    );
    setFilteredPatients(filtered);
  };

  const handleSearchChange = (event, value) => {
    setSearchTerm(value);
  };

  const handlePatientSelect = (event, newValue) => {
    setSelectedPatient(newValue);
    setHospitalData(newValue ? newValue.hosp_list : []);
    setHospitalData(newValue ? newValue.hosp_list : []);
  };


  const handleConsultantChange = (event) => {
    setSelectedConsultant(event.target.value);
  };

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
  };
  const handleSubServiceSelect = (event) => {
    setSelectedSubService(event.target.value);
  };


  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    setEndDate("");
    setShowAdditionalDropdowns(false);
  };
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleDropdownService = (event) => {
    setSelectedService(event.target.value);
    // Show dropdowns if all conditions are met
    setShowAdditionalDropdowns(startDate && endDate && event.target.value);
  };
  const handleDropdownSubService = (event) => {
    setSelectedSubService(event.target.value);
    // Show dropdowns if all conditions are met
    setShowAdditionalDropdowns(startDate && endDate && event.target.value);
  };

  const handleDropdownPtnName = (event) => {
    setPtnName(event.target.value);
  };



  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
    setSelectedSubService(""); // Reset sub-service selection on main service change
    if (event.target.value) {
      setShowPatientDropdowns(true); // Show dropdown immediately on service selection
    } else {
      setShowPatientDropdowns(false); // Hide if no service is selected
    }
  };
  const handleCheckboxChange = (event) => {
    setCheckBox(event.target.checked);
  };

  const handleDropdownConsultant = (event) => {
    setSelectedConsultant(event.target.value);
  };

 
  const handleCloseModal = () => {
    // Save or persist data before closing the modal
    console.log("Modal data saved:", {
      policyNumber,
      selectedEventIds,
      modalData,
    });
    setModalOpen(false);
  };

  const handleCloseDetails2 = () => {
    setIsModalOpen(false);
  };
  // set
  // set height and width
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

  useEffect(() => {
    const setDynamicWidth = () => {
      const screenWidth = window.innerWidth;

      var tableContainerWidth =
        screenWidth - setTableWidth(tableContainerWidth + "px");
      window.addEventListener("resize", setDynamicWidth);
      return () => {
        window.removeEventListener("resize", setDynamicWidth);
      };
    };
  });

  const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  const handleCancel = () => {
    setSelectedEventIds([]);
  };
  return (
    <div>
      <HRNavbar />
      <Box sx={{ flexGrow: 1, ml: 1, mr: 5, mt: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "left" }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1} // Increased spacing
            style={{ overflowX: "auto", padding: "5px" }}
          >
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  //  marginTop: "20px",
                  //  marginLeft: 10,
                  // p: 1,
                  // ml: 4,
                  display: "flex",
                  // alignItems: "center",
                  // top:3
                }}
                color="text.secondary"
              >
                Insurance
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box
                component="form"
                sx={{
                  p: "1px",
                  display: "flex",
                  alignItems: "center",
                  width: "160px", // Fixed width for uniformity
                  height: "2.5rem",
                  backgroundColor: "#ffffff",
                  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                  borderRadius: "10px",
                  border: "1px solid #C9C9C9",
                  overflow: "hidden",
                }}
              >
                <InputBase
                  required
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={today} // Ensure start date cannot be before today
                  placeholder="Start Date | MM/DD/YY"
                  sx={{ ml: 1, mr: 1, flex: 1 }}
                  size="small"
                  inputProps={{
                    "aria-label": "select date",
                    // max: today, // Maximum selectable date is today
                  }}
                />
              </Box>
            </Grid>

            {/* End Date */}
            <Grid item xs={12}>
              <Box
                component="form"
                sx={{
                  p: "1px",
                  display: "flex",
                  alignItems: "center",
                  width: "160px", // Fixed width for uniformity
                  height: "2.5rem",
                  backgroundColor: "#ffffff",
                  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                  borderRadius: "10px",
                  border: "1px solid #C9C9C9",
                  overflow: "hidden",
                }}
              >
                <InputBase
                  required
                  type="date"
                  placeholder="End Date | MM/DD/YY"
                  value={endDate}
                  onChange={handleEndDateChange}
                  sx={{ ml: 1, mr: 1, flex: 1 }}
                  size="small"
                  inputProps={{
                    "aria-label": "select date",
                    min: startDate || undefined, // Minimum date is the selected start date
                    // max: today, // Set the maximum selectable date to today
                  }}
                  min={startDate || today} // Ensure end date cannot be before the selected start date
                />
              </Box>
            </Grid>

            {/* Select Service */}
            <Grid item xs={10}>
              <TextField
                value={selectedService}
                onChange={handleDropdownService}
                select
                label="Select Service"
                variant="outlined"
                size="small"
                sx={{
                  width: "160px", // Fixed width for uniformity
                  backgroundColor: "white",
                  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                  borderRadius: "7px",
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: "200px",
                        maxWidth: "200px",
                      },
                    },
                  },
                }}
                inputProps={{ "aria-label": "Select Group" }}
              >
                {service.map((option) => (
                  <MenuItem
                    key={option.srv_id}
                    value={option.srv_id}
                    sx={{ fontSize: "14px" }}
                  >
                    {option.service_title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Select SubService */}
            <Grid item xs={12}>
              <TextField
                select
                label="Select SubService"
                variant="outlined"
                size="small"
                sx={{
                  width: "160px", // Fixed width for uniformity
                  backgroundColor: "white",
                  boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                  borderRadius: "7px",
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: "200px",
                        maxWidth: "400px",
                      },
                    },
                  },
                }}
                inputProps={{ "aria-label": "Select Group" }}
                value={selectedSubService}
                onChange={handleDropdownSubService}
              >
                {subService.length > 0 ? (
                  subService.map((option) => (
                    <MenuItem key={option.sub_srv_id} value={option.sub_srv_id}>
                      {option.recommomded_service}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No sub-services available</MenuItem>
                )}
              </TextField>
            </Grid>

            {showPatientDropdowns && (
              <>
                {/* Patient Name */}
                <Grid item xs={12}>
                  <Autocomplete
                   options={[...filteredPatients].sort((a, b) =>
                      a.ptn_name.localeCompare(b.ptn_name)
                    )}
                    getOptionLabel={(option) => option?.ptn_name || "Unknown"}
                    value={selectedPatient}
                    onChange={(event, newValue) => {
                      setSelectedPatient(newValue);
                    }}
                    inputValue={searchTerm}
                    onInputChange={(event, value) => setSearchTerm(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Patient Name"
                        variant="outlined"
                        size="small"
                        style={{ width: 190 }}
                        sx={{
                          // width: "160px", // Fixed width for uniformity
                          backgroundColor: "white",
                          "& input": { fontSize: 16 },
                          "& .MuiOutlinedInput-root": { minHeight: "36px" },
                        }}
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                {/* Select Hospital */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={hospitalData || []}
                    getOptionLabel={(option) =>
                      option?.hosp_name || "Unknown Hospital"
                    }
                    value={
                      hospitalData.find(
                        (hospital) => hospital?.hosp_id === selectedHospital // Ensure you are comparing with the correct field
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      // Use the correct ID for setting the selected hospital's ID
                      setSelectedHospital(newValue ? newValue.hosp_id : ""); // Assuming hosp_id is a number
                    }}
                    inputValue={hospitalSearchTerm}
                    onInputChange={(event, value) =>
                      setHospitalSearchTerm(value)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Hospital"
                        variant="outlined"
                        size="small"
                        style={{ width: 200 }}
                        sx={{
                          width: "160px", // Fixed width for uniformity
                          backgroundColor: "white",
                          "& input": { fontSize: 16 },
                          "& .MuiOutlinedInput-root": { minHeight: "36px" },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Select Consultant */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={consultantList || []}
                    getOptionLabel={(option) =>
                      option?.doct_cons_name || "Unknown"
                    }
                    value={
                      selectedConsultant
                        ? consultantList.find(
                            (c) => c.doct_cons_id === selectedConsultant
                          )
                        : null
                    }
                    onChange={(event, newValue) => {
                      setSelectedConsultant(
                        newValue ? newValue.doct_cons_id : ""
                      ); // Use doct_cons_id to set the state
                    }}
                    inputValue={consultantSearchTerm}
                    onInputChange={(event, value) =>
                      setConsultantSearchTerm(value)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Consultant"
                        variant="outlined"
                        size="small"
                        style={{ width: 190 }}
                        sx={{
                          width: "160px", // Fixed width for uniformity
                          backgroundColor: "white",
                          "& input": { fontSize: 16 },
                          "& .MuiOutlinedInput-root": { minHeight: "36px" },
                        }}
                      />
                    )}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#69A5EB",
                  textTransform: "capitalize",
                  height: "40px",
                  borderRadius: "8px",
                  width: "100%",
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
            {/* </Grid> */}
          </Stack>
        </Box>
      </Box>

      <TableContainer
        sx={{ ml: 1, mr: 1 }}
        style={{ width: tableWidth, height: tableHeight }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <InsuranceCard
                style={{
                  background: "#69A5EB",
                  color: "#FFFFFF",
                  borderRadius: "8px 10px 0 0",
                  height: "3rem",
                  // margin:2/
                }}
              >
                <CardContent
                  style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}
                >
                  <Typography variant="subtitle2">Sr. No</Typography>
                </CardContent>
                <CardContent
                  style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}
                >
                  <Typography variant="subtitle2">Select Checkbox</Typography>
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
              </InsuranceCard>
            </TableRow>
          </TableHead>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                mt: 15,
                justifyContent: "center",
                height: "45vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TableBody>
              {data && data.length > 0 ? (
                data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow
                      key={item.event_code || index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <InsuranceCard
                        style={{
                          height: "4rem",
                          background: "white",
                          color: "rgba(0, 0, 0, 0.87)",
                          fontWeight: "100",
                          borderRadius: "8px 10px 8px 8px",
                        }}
                      >
                        <CardContent style={{ flex: 0.5 }}>
                          <Typography variant="body2">
                            {index + 1 + page * rowsPerPage}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 1 }}>
                          <Checkbox
                            checked={selectedEventIds.includes(item.eve_id)}
                            onChange={() => handleRowSelect(item.eve_id)}
                          />
                        </CardContent>
                        <CardContent style={{ flex: 2 }}>
                          <Typography variant="body2">
                            {item.event_code}
                          </Typography>
                        </CardContent>
                        <CardContent
                          style={{
                            flex: 2,
                            borderRight: "1px solid #FFFFFF",
                            // alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" align="right">
                            {item.patient_name}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 2 }}>
                          <Typography variant="body2">
                            {item.caller_no}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 2 }}>
                          <Typography variant="body2" align="left">
                            {item.prof_fullname}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 2 }}>
                          <Typography variant="body2">
                            {item.srv_name}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 2 }}>
                          <Typography variant="body2">
                            {item.start_date}
                          </Typography>
                        </CardContent>
                        <CardContent style={{ flex: 1.5 }}>
                          <Typography variant="body2">
                            {item.end_date}
                          </Typography>
                        </CardContent>
                      </InsuranceCard>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <CardContent>
                    <Typography variant="body2">No Data Available</Typography>
                  </CardContent>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {/* // if the data is not more 5 record pagination is not display  */}
      {/* {Array.isArray(patientData) && patientData.length > 5 && ( */}
      {/* )} */}
      {isDataFetched && (
        <>
          <Button
            variant="contained"
            sx={{
              textTransform: "capitalize",
              height: "39px",
              borderRadius: "8px",
              width: "12ch",
              backgroundColor: "#ED6262",
              // mt: 1,
            }}
            onClick={handleCancel}
          >
            cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "capitalize",
              height: "40px",
              borderRadius: "8px",
              width: "12ch",
              backgroundColor: "#69A5EB",
              mt: 6,
              m: 6,
            }}
            onClick={handleOpenModal}
          >
            Preview
          </Button>
        </>
      )}

      <div style={{ padding: "2em", fontWeight: "300" }}>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              width: "60%",
              height: "75%",
              bgcolor: "background.paper",
              borderRadius: 4,
              boxShadow: 24,
              // p: 2,
              overflowY: "auto",
              textAlign: "left",
              position: "relative",
            }}
          >
            <AppBar
              position="static"
              sx={{
                background: "linear-gradient(45deg, #1FD0C4 30%, #0E8FE4 90%)",

                width: "100%",
                height: "3.5rem",
                borderRadius: "8px 8px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 0,
                position: "relative",
                overflow: "hidden",
                color: "white",
              }}
            >
              {/* Close Icon */}
              <CloseIcon
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: "16px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "white",
                }}
                onClick={() => setModalOpen(false)}
              />

              <Typography
                variant="h6"
                component="h2"
                sx={{
                  textAlign: "center",
                  lineHeight: "3.5rem",
                  fontWeight: "bold",
                  color: "#fff",
                  fontSize: "1.5rem",
                }}
              >
                Mediclaim Certificate
              </Typography>
            </AppBar>

            <div id="pdfContent">
              {modalData?.Date_arr_all_sessions ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      mt: 1,
                      p: 1,
                      m: 2,
                      overflowY: "auto",
                      flexGrow: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Date: <strong>{new Date().toLocaleDateString()}</strong>
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <strong>Policy Number:</strong>
                      <TextField
                        id="standard-basic"
                        label="Policy Number"
                        variant="standard"
                        value={policyNumber}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          setPolicyNumber(value);
                          setPolicyNumberError(!value); // Sets error only if value is empty
                        }}
                        sx={{
                          mb: 2,
                          flexGrow: 1,
                          ml: 2,
                          maxWidth: 250, // Number instead of string for consistency
                        }}
                        required
                        error={policyNumberError}
                        helperText={
                          policyNumberError ? "Policy Number is required" : ""
                        }
                      />
                      <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={() => setSnackbarOpen(false)}
                        message={snackbarMessage}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        ContentProps={{
                          style: {
                            backgroundColor: snackbarMessage.includes(
                              "successfully"
                            )
                              ? "green"
                              : "#ED6262",
                            color: "white",
                          },
                        }}
                      />
                    </Typography>
                  </Box>

                  {/* Certificate Body Section */}
                  <Box
                    sx={{
                      textAlign: "center",
                      margin: "0 auto",
                    }}
                  >
                    <Box sx={{ display: "flex", ml: 5 }}>
                      <Typography
                        variant="body1"
                        gutterBottom
                        fontWeight={"bold"}
                      >
                        To Whomsoever It May Concern
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "left", ml: 5, mr: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        <br />
                        This is to certify that Patient{" "}
                        <strong>{modalData.Patient_name}</strong>, a known case
                        of <strong>{modalData.suffered_from}</strong>, was
                        admitted at <strong>{modalData.hospital_name}</strong>{" "}
                        Hospital under the care of{" "}
                        <strong>{modalData.consultant_name}</strong>. After
                        treatment at <strong>{modalData.hospital_name}</strong>{" "}
                        Hospital, the patient was discharged with advice to take
                        further necessary treatment.
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "left", ml: 5, mr: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        Patient <strong>{modalData.Patient_name}</strong> {""}
                        <text>{modalData.service_name}</text> {""} at home for
                        the following time period by
                      </Typography>
                    </Box>
                    <div style={{ marginLeft: "2rem" }}>
                      <table
                        style={{
                          width: "85%",
                          borderCollapse: "collapse",
                          marginTop: "1rem",
                          textAlign: "center",
                          borderColor: "black",
                          position: "relative",
                          left: "4%",
                        }}
                      >
                        <thead>
                          <tr style={{ borderColor: "black" }}>
                            <th
                              style={{
                                border: "1px solid #000000",
                                padding: "8px",
                                color: "black",
                              }}
                            >
                              <strong>Sr. No</strong>
                            </th>
                            <th
                              style={{
                                border: "1px solid #000000",
                                padding: "8px",
                                color: "black",
                              }}
                            >
                              <strong>From Date</strong>
                            </th>
                            <th
                              style={{
                                border: "1px solid #000000",
                                padding: "8px",
                                color: "black",
                              }}
                            >
                              <strong>To Date</strong>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {modalData.Date_arr_all_sessions.map(
                            (session, index) => (
                              <tr key={index}>
                                <td
                                  style={{
                                    border: "1px solid #000000",
                                    padding: "8px",
                                  }}
                                >
                                  {index + 1}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000000",
                                    padding: "8px",
                                  }}
                                >
                                  {session[0]}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000000",
                                    padding: "8px",
                                  }}
                                >
                                  {session[1]}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    <Box sx={{ textAlign: "left", ml: 5, mr: 2, mt: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        Professional of{" "}
                        <strong>SPERO Healthcare Innovations Pvt. Ltd.</strong>.
                        Above mentioned healthcare services are provided by{" "}
                        <text>SPERO Healthcare Innovations Pvt. Ltd.</text> to
                        the patient at home, on behalf of{" "}
                        <strong>{modalData.hospital_name}</strong> as per the
                        medical advice given by the concerned consultant under
                        whom the patient was hospitalized at{" "}
                        <strong>{modalData.hospital_name}</strong>.
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "left", ml: 5 }}>
                      <br></br>
                      <Typography variant="body1" gutterBottom>
                        This certificate is issued on request of{" "}
                        <strong>{modalData.Patient_name}</strong>
                        <br></br>
                        <br></br>
                        <Box sx={{ textAlign: "left", ml: 5 }}>
                          Total Service Days:{" "}
                          <strong>{modalData.Total_Service_Days_Count}</strong>
                          <br></br>
                          <br />
                          Conveyance Charges:{" "}
                          <strong>{modalData.Conveyance_Amount || "0"}</strong>
                          <br></br>
                          <br />
                          Discount:{" "}
                          <strong>{modalData.Discount_Amount || "0"}</strong>
                          <br></br>
                          <br />
                          {modalData.service_name}:{" "}
                          <strong>
                            Rs. {modalData.Sub_servive_cost} x{" "}
                            {modalData.Total_Service_Days_Count}
                          </strong>
                          <br></br>
                          <br></br>
                          Total Amount :{" "}
                          <strong>Rs. {modalData.Final_Amount}</strong>
                          <br></br>
                          <br></br>
                          <strong
                            style={{
                              position: "absolute",
                              right: 15,
                              padding: 5,
                            }}
                          >
                            Healthcare Manager
                          </strong>
                          <br></br>
                          <br></br>
                        </Box>
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <Typography>No data available</Typography>
              )}
            </div>
            <Box
              sx={{
                display: "flex",
                // gap: 2,
                overflowX: "hidden",
                overflow: "hidden",
                paddingBottom: 8,
              }}
            >
              <Button
                variant="contained"
                sx={{ mt: 2, position: "absolute", right: "15%" }}
                onClick={handleSubmitAndDownload}
                disabled={loading || isDisabled} // Button remains disabled after success
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={20}
                      sx={{ color: "white", mr: 1 }}
                    />
                    Generating PDF...
                  </>
                ) : isDisabled ? (
                  "PDF Generated"
                ) : (
                  " Submit and Generate PDF"
                )}
              </Button>

              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "#ED6262",
                  position: "absolute",
                  right: 15,
                }}
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>

      <Modal
        open={existingEventModalOpen}
        onClose={() => setExistingEventModalOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "40%",
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            position: "relative", // For positioning the CloseIcon
          }}
        >
          <CloseIcon
            sx={{
              position: "absolute",
              top: 8,
              right: 15,
              cursor: "pointer",
            }}
            onClick={() => setExistingEventModalOpen(false)}
          />
          <Typography
            variant="h6"
            component="h2"
            textAlign="center"
            gutterBottom
          >
            Event Already Exists
          </Typography>
          <Typography variant="body2" textAlign="center">
            Data is already available for the selected events. Please review the
            existing insurance details.
          </Typography>
          {/* <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setExistingEventModalOpen(false)}
          >
            Close
          </Button> */}
        </Box>
      </Modal>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 30, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        // disabled={patientData.length <= rowsPerPage}
      />
      <Footer />
    </div>
  );
};
