import React, { useState, useEffect } from "react";
import service from '../../assets/service.png'
import LeafletMap from "./Map";
import { useAuth } from '../Context/ContextAPI';
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import './Home.css';
import "leaflet/dist/leaflet.css";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
  Menu,
  Button,
} from '@mui/material';
import { color } from "@mui/system";


const cancellationTypes = [
  { id: 1, name: "Enquiry Cancellation" },
  { id: 2, name: "Service Cancellation" },
  // { id: 3, name: "Both Cancellation" },
];

const monthTypes = [
  { id: 13, name: "Last 6 Month" },
  { id: 14, name: "All" },
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" }
];

// const serviceTypes = [
//   { id: 1, name: "Doctor at Home" },
//   { id: 2, name: "Healthcare attendants" },
//   { id: 3, name: "Medical Equipment" },
//   { id: 4, name: "Nurse at Home" },
//   { id: 5, name: "Physiotherapy" },
//   { id: 6, name: "X - Ray" }
// ]

const cancellationBy = [
  { id: 1, name: "Spero" },
  { id: 2, name: "Customer" },
];

const profAlloc = [
  { id: 1, name: "No" },
  { id: 2, name: "yes" },
]

function Home() {
  const [selectedCancellation, setSelectedCancellation] = useState(2);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [loadingEnquiry, setLoadingEnquiry] = useState(false);
  const [loadingService, setLoadingService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCancellationBy, setSelectedCancellationBy] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReason, setSelectedReason] = React.useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState("Cancellation By");
  const [selectedId, setSelectedId] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedCanResId, setSelectedCanResId] = useState("");
  const [profAllocValue, setProfAllocValue] = useState("");
  const [showProfAlloc, setShowProfAlloc] = useState(true);



  const { cancellationData, error, fetchCancellationData, fetchCancellationReasons, submenuData, fetchServicesData, serviceData } = useAuth();

  console.log();

  const handleChangeCancellation = (event) => {

    const cancelFlag = event.target.value;
    setSelectedCancellation(cancelFlag);

    //visibility of profAlloc
    setShowProfAlloc(cancelFlag !== "2");
    console.log("Show profAlloc: ", showProfAlloc);

    // Only set the loading state when both cancellation type and month are selected
    if (cancelFlag && selectedMonth) {
      setLoading(true);
      setLoadingEnquiry(cancelFlag === "1" || cancelFlag === "3");
      setLoadingService(cancelFlag === "2" || cancelFlag === "3");

      // Trigger the fetch when both fields are selected
      fetchCancellationData(cancelFlag, selectedMonth)
        .then(() => {
          setLoading(false);
          setLoadingEnquiry(false);
          setLoadingService(false);
        })
        .catch((err) => {
          setLoading(false);
          setLoadingEnquiry(false);
          setLoadingService(false);
          console.error("Error fetching data:", err);
        });
    }
  };





  const handleChangeMonth = (event) => {
    const monthFlag = event.target.value;
    setSelectedMonth(monthFlag);

    // Only set the loading state when both cancellation type and month are selected
    if (selectedCancellation && monthFlag) {
      setLoading(true);
      setLoadingEnquiry(selectedCancellation === "1" || selectedCancellation === "3");
      setLoadingService(selectedCancellation === "2" || selectedCancellation === "3");

      // Trigger the fetch when both fields are selected
      fetchCancellationData(selectedCancellation, monthFlag)
        .then(() => {
          setLoading(false);
          setLoadingEnquiry(false);
          setLoadingService(false);
        })
        .catch((err) => {
          setLoading(false);
          setLoadingEnquiry(false);
          setLoadingService(false);
          console.error("Error fetching data:", err);
        });
    }
  };

  const handleChangeService = (event) => {
    const srvFlag = event.target.value;
    setSelectedService(srvFlag);

    // Check if both selectedCancellation and selectedMonth are available before fetching data
    if (selectedCancellation && selectedMonth) {
      setLoading(true);

      // Call the fetchCancellationData function
      fetchCancellationData(selectedCancellation, selectedMonth, srvFlag)
        .finally(() => {
          // This will stop the loader when the API call is done (either success or failure)
          setLoading(false);
        });
    }
  };


  const handleChangeReason = (reason) => {

    setLoading(true);

    // Execute handleOptionClick logic
    setSelectedCanResId(reason.cancelation_reason_id);
    console.log("Selected Reason ID:", reason.cancelation_reason_id);

    // Execute fetchCancellationData
    if (selectedCancellation && selectedMonth) {
      fetchCancellationData(
        selectedCancellation,
        selectedMonth,
        selectedService || null, // Pass srv_flag only if it exists
        reason.cancelation_reason_id // Pass the selected cancellation reason ID
      )
        .then(() => {

          setLoading(false);
        })
        .catch((err) => {

          setLoading(false);
          console.error("API Error:", err);

        });
    } else {

      setLoading(false);
      console.error("Missing required parameters for fetchCancellationData.");
    }
  };


  const handleProfAllocChange = (event) => {
    const profAllocValue = event.target.value;
    setProfAllocValue(profAllocValue);

    // Check if both selectedCancellation and selectedMonth are available before fetching data
    if (selectedCancellation && selectedMonth) {
      setLoading(true);

      // Make the API call with the selected values
      fetchCancellationData(
        selectedCancellation,
        selectedMonth,
        selectedService || null,
        selectedCanResId || null,
        profAllocValue
      )
        .finally(() => {
          setLoading(false);
        });
    }
  };


  const handleCancellationByChange = (event) => {
    setSelectedCancellationBy(event.target.value);
    setSelectedReason(""); // Reset the reason when a new cancellation is selected
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    fetchCancellationReasons(id);
    // Fetch or set submenuData based on the selected id
    // Example: setSubmenuData(mockSubmenuData[id]);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSubmenuSelect = (reason) => {
    setSelectedReason(reason.cancelation_reason);
    handleMenuClose();
  };


  // Close dropdown if clicked outside
  const handleOutsideClick = (e) => {
    if (!e.target.closest(".custom-dropdown")) {
      setIsDropdownOpen(false);
      setOpenGroup(""); // Collapse all groups
    }
  };

  // Add event listener for outside click
  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);



  // Toggle group visibility (Spero or Customer)
  const toggleGroup = (group) => {
    // setOpenGroup((prevGroup) => (prevGroup === group ? "" : group));
    setOpenGroup(group);
    setSelectedId(group);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prevState) => !prevState);
  };


  // Handle selection of cancellation reason
  const handleOptionClick = (reason) => {
    setSelectedPlayer(reason.cancelation_reason);
    setIsDropdownOpen(false);
    console.log("Selected Reason:", reason);
    setIsDataFetched(false);

  };


  // Fetch cancellation reasons when selectedId changes
  useEffect(() => {
    if (selectedId !== '') {
      console.log('okkkkkkkkkkk');
      fetchCancellationReasons(selectedId);
      setIsDataFetched(true);
    }
  }, [selectedId]);


  const handleOptionAndReasonClick = (reason) => {
    handleOptionClick(reason);
    handleChangeReason(reason);
  };


  const handleReset = () => {
    setSelectedCancellation(""); // Reset cancellation type
    setSelectedMonth(""); // Reset month selection
    setSelectedService(""); // Reset service type
    setSelectedCancellationBy(""); // Reset cancellation by
    setSelectedReason(""); // Reset reason selection
    setSelectedPlayer("Cancellation By"); // Reset custom dropdown title
    setProfAllocValue(""); // Reset profAlloc selection
    setShowProfAlloc(true); // Reset profAlloc visibility
    setSelectedCanResId(""); // Reset reason ID
    setSelectedId(null); // Reset selected group ID
    setIsDropdownOpen(false); // Close custom dropdown
    setOpenGroup(""); // Reset group visibility
  };

  useEffect(() => {
    if (!serviceData && !loading) {  // Only call the API once if serviceData is not already fetched
      fetchServicesData();
    }
  }, [serviceData, loading]);



  return (
    <>
      <Navbar />
      {/* <Header /> */}
      {/* main content */}
      <Box sx={{ mt: 5, mb: 1, ml: 15 }}>
        {/* Full-page loader */}
        {loading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <CircularProgress size={50} />
          </Box>
        )}

        <Grid container spacing={1} sx={{ mt: 5 }} columnSpacing={{ md: 2 }}>
          <Grid item xs={12} sm={4} md={2} sx={{ ml: 1, mt: 1.5}}>
            <FormControl fullWidth>
              <Select
                id="cancellationDropdown"
                value={selectedCancellation}
                onChange={handleChangeCancellation}
                displayEmpty
                inputProps={{ 'aria-label': 'Select Cancellation Type' }}
                sx={{ height: 43, fontSize: 14, padding: 0, fontFamily: 'Roboto', color: 'grey' }}
              >
                <MenuItem value="">
                  Select Cancellation Type {/* Placeholder text */}
                </MenuItem>
                {cancellationTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3} md={1.7} sx={{ ml: 1, mt: 1.5 }}>
            <FormControl fullWidth>
              <Select
                id="monthDropdown"
                value={selectedMonth}
                onChange={handleChangeMonth}
                displayEmpty
                inputProps={{ 'aria-label': 'Select Month' }}
                sx={{ height: 43, fontSize: 14, padding: 0, fontFamily: 'Roboto', color: 'grey' }}
              >
                <MenuItem value="">
                  Select Month {/* Placeholder text */}
                </MenuItem>
                {monthTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={2} sx={{ ml: 1, mt: 1.5 }}>
            <FormControl fullWidth>
              <Select
                id="serviceDropdown"
                value={selectedService}
                onChange={handleChangeService}
                displayEmpty
                inputProps={{ 'aria-label': 'Select Service Type' }}
                sx={{ height: 43, fontSize: 14, padding: 0, fontFamily: 'Roboto', color: 'grey' }}
              >
                <MenuItem value="">
                  Select Service Type {/* Placeholder text */}
                </MenuItem>
                {serviceData && serviceData.map((data) => (
                  <MenuItem key={data.srv_id} value={data.srv_id}>
                    {data.service_title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4} md={2} sx={{ ml: 1, mt: 1.7}}>
            <div className="custom-dropdown">
              {/* Dropdown Header */}
              <div className="dropdown-header" onClick={toggleDropdown}>
                <span>{selectedPlayer}</span>
                <span className="arrow"> &#x1F783;</span>
              </div>

              {/* Dropdown Content */}
              {isDropdownOpen && (
                <div className="dropdown-content">
                  {/* Spero Group */}
                  <div className={`optgroup ${openGroup === "1" ? "open" : ""}`}>
                    <div className="group-header" onClick={() => toggleGroup("1")}>
                      Spero <span className="arrow">&#x1F783;</span>
                    </div>
                    {openGroup === "1" && submenuData && submenuData.length > 0 && (
                      <div className="options">
                        {submenuData.map((reason) => (
                          <div
                            key={reason.cancelation_reason_id}
                            className="option"
                            onClick={() => handleOptionAndReasonClick(reason)} // Set the selected reason

                          >
                            {reason.cancelation_reason}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Customer Group */}
                  <div className={`optgroup ${openGroup === "2" ? "open" : ""}`}>
                    <div className="group-header" onClick={() => toggleGroup("2")}>
                      Customer <span className="arrow">&#x1F783;</span>
                    </div>
                    {openGroup === "2" && submenuData && submenuData.length > 0 && (
                      <div className="options">
                        {submenuData.map((reason) => (
                          <div
                            key={reason.cancelation_reason_id}
                            className="option"
                            onClick={() => handleOptionAndReasonClick(reason)} // Set the selected reason

                          >
                            {reason.cancelation_reason}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Grid>

          {selectedCancellation === 2 && (
            <Grid item xs={12} sm={4} md={2} sx={{ ml: 4, mt: 1.5 }}>
              <FormControl fullWidth>
                <Select
                  id="profAlloc"
                  value={profAllocValue}
                  onChange={handleProfAllocChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Professional Allocate' }}
                  sx={{ height: 43, fontSize: 14, padding: 0, fontFamily: 'Roboto', color: 'grey' }}
                >
                  <MenuItem value="">
                    Professional Allocate
                  </MenuItem>

                  {profAlloc.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Button variant="outlined" sx={{ ml: 4, height: 40, mt: 2.8 }} onClick={handleReset}>Reset</Button>

        </Grid>
      </Box>
      {/* main content */}

      <LeafletMap handleChangeReason={handleChangeReason} />
      <Footer />
    </>
  );
}

export default Home;
