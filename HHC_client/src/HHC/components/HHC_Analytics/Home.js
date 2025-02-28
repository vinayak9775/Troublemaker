import React, { useState } from "react";
// import service from "../../assets/";
import service from '../../assets/service.png'
// import Header from "./Header";
import Map from "./Map";
import { useAuth } from '../Context/ContextAPI';
import Navbar from "../../Navbar";
import Footer from "../../Footer";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
} from '@mui/material';
import HRHeader from "../HR/HRHeader";
import HRNavbar from "../HR/HRNavbar";


const cancellationTypes = [
  { id: 1, name: "Enquiry Cancellation" },
  { id: 2, name: "Service Cancellation" },
  { id: 3, name: "Both Cancellation" },
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

const serviceTypes = [
  { id: 1, name: "Doctor at Home" },
  { id: 2, name: "Healthcare attendants" },
  { id: 3, name: "Medical Equipment" },
  { id: 4, name: "Nurse at Home" },
  { id: 5, name: "Physiotherapy" },
  { id: 6, name: "X - Ray" }
]

function Home() {
  const [selectedCancellation, setSelectedCancellation] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [loadingEnquiry, setLoadingEnquiry] = useState(false);
  const [loadingService, setLoadingService] = useState(false);
  const [loading, setLoading] = useState(false); // Full page loader state
  const { cancellationData, error, fetchCancellationData } = useAuth();

  const handleChangeCancellation = (event) => {
    const cancelFlag = event.target.value;
    setSelectedCancellation(cancelFlag);

    // Only set the loading state when both cancellation type and month are selected
    if (cancelFlag && selectedMonth) {
      setLoading(true); // Show the full-page loader
      setLoadingEnquiry(cancelFlag === "1" || cancelFlag === "3");
      setLoadingService(cancelFlag === "2" || cancelFlag === "3");

      // Trigger the fetch when both fields are selected
      fetchCancellationData(cancelFlag, selectedMonth)
        .then(() => {
          setLoading(false); // Hide the full-page loader
          setLoadingEnquiry(false);
          setLoadingService(false);
        })
        .catch((err) => {
          setLoading(false); // Hide the full-page loader
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
      setLoading(true); // Show the full-page loader
      setLoadingEnquiry(selectedCancellation === "1" || selectedCancellation === "3");
      setLoadingService(selectedCancellation === "2" || selectedCancellation === "3");

      // Trigger the fetch when both fields are selected
      fetchCancellationData(selectedCancellation, monthFlag)
        .then(() => {
          setLoading(false); // Hide the full-page loader
          setLoadingEnquiry(false);
          setLoadingService(false);
        })
        .catch((err) => {
          setLoading(false); // Hide the full-page loader
          setLoadingEnquiry(false);
          setLoadingService(false);
          console.error("Error fetching data:", err);
        });
    }
  };

  const handleChangeService = (event) => {
    const srvFlag = event.target.value;
    setSelectedService(srvFlag);
    if (selectedCancellation && selectedMonth) {
      fetchCancellationData(selectedCancellation, selectedMonth, srvFlag); // Pass srvFlag here
    }
  };

  const userGroup = localStorage.getItem('user_group');
  console.log('user_groupuser_groupuser_group', userGroup);

  return (
    <>

      {userGroup === "HR" && <HRNavbar />}
      {userGroup === "HR" && <HRHeader />}
      {userGroup !== "HR" && <Navbar />}

      {/* <Navbar /> */}
      {/* <Header /> */}
      {/* main content */}
      <Box sx={{ mt: 5, mb: 1 }}>
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

        <Grid container spacing={1} sx={{ mt: 5 }}>
          <Grid item xs={12} sm={4} md={2.3} sx={{ ml: 1, mt: 1.5, mb: 1 }}>
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

          <Grid item xs={12} sm={3} md={1.5} sx={{ ml: 1, mt: 1.5, mb: 1 }}>
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

          <Grid item xs={12} sm={4} md={2} sx={{ ml: 1, mt: 1.5, mb: 1 }}>
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
                {serviceTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <img
                    src={service}
                    alt="Enquiry Cancellation"
                    style={{
                      marginTop: "12px",
                      background: "#5E1675",
                      padding: "10px",
                      borderRadius: "50%",
                      width: "27px",
                      height: "25px",
                      marginRight: "8px",
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ marginTop: '12px' }}>
                    Enquiry Cancellation:{" "}
                    <strong>
                      {loadingEnquiry ? (
                        <CircularProgress size={20} />
                      ) : (
                        cancellationData?.Total_Enquiry_Cancelled || "0"
                      )}
                    </strong>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <img
                    src={service}
                    alt="Service Cancellation"
                    style={{
                      marginTop: "12px",
                      background: "#F0FF42",
                      padding: "10px",
                      borderRadius: "50%",
                      width: "27px",
                      height: "25px",
                      marginRight: "8px",
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ marginTop: '12px' }}>
                    Service Cancellation:{" "}
                    <strong>
                      {loadingService ? (
                        <CircularProgress size={20} />
                      ) : (
                        cancellationData?.Total_Service_Cancelled || "0"
                      )}
                    </strong>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {/* main content */}

      <Map />

      <Footer />
    </>
  );
}

export default Home;
