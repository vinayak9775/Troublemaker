
import React, { useState, useEffect } from 'react';
// import './Dashboard.css'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ExistManpower from './ExistManpower';
import NewManpower from './NewManpower';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import HRNavbar from '../HRNavbar';
import Footer from '../../../Footer';
import Interview from './Interview';
import Employee from './Employee';
import InactiveEmp from './InactiveEmp';
import Map from './Map';
import Onboarding from './Onboarding';
import ProfAvailable from './ProfAvailable';

const HRDashboard = () => {
  ///// permission start
  const accessToken = localStorage.getItem('token');

  const [permissions, setPermissions] = useState([]);

  console.log(permissions, 'Dashboard Permission');

  /////////////// Data Response
  permissions.forEach(permission => {
    permission.modules_submodule.forEach(module => {
      console.log("Module:", module.name);
      module.selectedSubmodules.forEach(submodule => {
        console.log("Submodule:", submodule.submoduleName);
      });
    });
  });

  useEffect(() => {
    const permissionsData = JSON.parse(localStorage.getItem('permissions'));
    if (permissionsData) {
      setPermissions(permissionsData);
    }
  }, []);

  // Check if "Download Report permission is granted for "Dashboard" module
  const isDownloadAllowed = permissions.some(permission =>
    permission.modules_submodule.some(module =>
      module.selectedSubmodules.some(submodule =>
        submodule.submoduleName === 'Download Report'
      )
    )
  );

  ///// permission end
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <HRNavbar />
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <TabContext value={value}>
          <Stack direction="row" gap={0}>
            <Box sx={{
              typography: 'body1',
              background: "#FFFFFF",
              borderRadius: '10px',
              width: "20rem",
              height: "2.8rem",
              display: 'flex',
              justifyContent: 'center',
              marginLeft: '8px',
              marginRight: '8px',
            }}>
              <TabList
                className="tab-root"
                onChange={handleChange}
                textColor="#51DDD4"
                sx={{ position: 'relative' }}
                TabIndicatorProps={{ style: { background: '#69A5EB', height: '36px', marginBottom: '8px', borderRadius: "10px" } }}
              >
                <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "1" ? '#ffffff' : 'black' }}>Today</span>} value="1" sx={{ position: 'relative', zIndex: 1, }} />
                <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "2" ? '#ffffff' : 'black' }}>This Week</span>} value="2" sx={{ position: 'relative', zIndex: 1, }} />
                <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "3" ? '#ffffff' : 'black' }}>This Month</span>} value="3" sx={{ position: 'relative', zIndex: 1, }} />
              </TabList>
            </Box>

            {
              isDownloadAllowed && (
                <Button variant="contained" style={{ backgroundColor: "#69A5EB", textTransform: "capitalize", borderRadius: "8px", height: "42px" }}>
                  <FileDownloadOutlinedIcon />
                  Download Report
                </Button>
              )
            }
          </Stack>

          <Box sx={{ width: '100%', typography: 'body1', marginTop: '-15px' }}>
            <TabPanel value="1">
              <Grid item xs={12} container spacing={1}>
                <Grid item lg={3} md={12} xs={12}>
                  <ExistManpower value={1} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <ProfAvailable value={1} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <NewManpower value={1} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <Interview value={1} />
                </Grid>
              </Grid>
              <Grid item xs={12} container spacing={1} sx={{ mt: 0.2 }}>
                <Grid item lg={3} md={12} xs={12}>
                  <Employee value={1} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <InactiveEmp value={1} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <Map value={1} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <Onboarding value={1} />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value="2">
              <Grid item xs={12} container spacing={1}>
                <Grid item lg={3} md={12} xs={12}>
                  <ExistManpower value={2} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <ProfAvailable value={2} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <NewManpower value={2} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <Interview value={2} />
                </Grid>
              </Grid>
              <Grid item xs={12} container spacing={1} sx={{ mt: 0.2 }}>
                <Grid item lg={3} md={12} xs={12}>
                  <Employee value={2} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <InactiveEmp value={2} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <Map value={2} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <Onboarding value={2} />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value="3">
              <Grid item xs={12} container spacing={1}>
                <Grid item lg={3} md={12} xs={12}>
                  <ExistManpower value={3} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <ProfAvailable value={3} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <NewManpower value={3} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <Interview value={3} />
                </Grid>
              </Grid>
              <Grid item xs={12} container spacing={1} sx={{ mt: 0.2 }}>
                <Grid item lg={3} md={12} xs={12}>
                  <Employee value={3} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <InactiveEmp value={3} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <Map value={3} />
                </Grid>
                <Grid item lg={3} md={12} xs={12}>
                  <Onboarding value={3} />
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </TabContext>
      </Box>
      <Footer />
    </>
  )
}

export default HRDashboard



