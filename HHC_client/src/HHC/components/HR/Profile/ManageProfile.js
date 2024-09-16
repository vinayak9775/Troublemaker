import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LanguageIcon from '@mui/icons-material/Language';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Tooltip, IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from 'react-router-dom';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
// import Navbar from '../../../Navbar';
import Footer from '../../../Footer';
import HRNavbar from '../HRNavbar';
import { useNavigate } from 'react-router-dom';

const ProfileCard = styled(Card)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '10px',
  backgroundColor: 'white',
  boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
  height: "50px",
  borderRadius: '10px',
  transition: '2s ease-in-out',
  '&:hover': {
    backgroundColor: '#F7F7F7',
    cursor: 'pointer',
  },
});

const ManageProfile = () => {

  const port = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('token');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleIconClick = () => {
    navigate('/hr/manage profiles/add-prof');
  };

  //////// permisssion start
  const [permissions, setPermissions] = useState([]);

  console.log(permissions, 'Manage Permission');

  /////////////// Data Response
  permissions.forEach(permission => {
    permission.modules_submodule.forEach(module => {
      console.log("Module:", module.name);
      module.selectedSubmodules.forEach(submodule => {
        console.log("  Submodule:", submodule.submoduleName);
      });
    });
  });

  useEffect(() => {
    const permissionsData = JSON.parse(localStorage.getItem('permissions'));
    if (permissionsData) {
      setPermissions(permissionsData);
    }
  }, []);

  // Check if "Add Service" permission is granted for "Manage Profiles" module
  const isAddServiceAllowed = permissions.some(permission =>
    permission.modules_submodule.some(module =>
      module.selectedSubmodules.some(submodule =>
        submodule.submoduleName === 'Add Service'
      )
    )
  );

  const isViewServiceAllowed = permissions.some(permission =>
    permission.modules_submodule.some(module =>
      module.selectedSubmodules.some(submodule =>
        submodule.submoduleName === 'View Service'
      )
    )
  );

  //////// permisssion end
  const [profile, setProfile] = useState([]); ////// roshni's code
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [loading, setLoading] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch(`${port}/hr/manage_emp/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        console.log("Manage Professional Profile Data.........", data);
        if (data['not found'] === "Record not found") {
          setProfile([]);
          setLoading(false);
        } else {
          setProfile(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching Manage Professional Profile Data:", error);
        setLoading(false);
      }
    };
    getProfile();
  }, []);

  const filteredProfiles = profile.filter((row) =>
    row.prof_fullname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // async function handleProfSubmit(event) {
  //   event.preventDefault();
  //   // handleEmptyField()
  //   const requestData = {

  //     // Patient Data //
  //     // name: ptnName,
  //     // gender_id: selectedGender,
  //     // Age: age,
  //     // preferred_hosp_id: selectedHospital,
  //     // Suffered_from: suffered,
  //     // phone_no: ptnNumber,
  //     // patient_email_id: email,
  //     // doct_cons_id: selectedConsultant,
  //     // doct_cons_phone: consultantMobile,
  //     // state_id: selectedState,
  //     // city_id: selectedCity,
  //     // prof_zone_id: selectedZone,
  //     // pincode: pincode,
  //     // address: address,


  //   };
  //   console.log("POST API Hitting......", requestData)
  //   try {
  //     const response = await fetch(`${port}/web/agg_hhc_add_service_details_api`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       body: JSON.stringify(requestData),

  //     });
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     const result = await response.json();
  //     console.log("Results.....", result);

  //     const eventValue = result["Service Created Event Code"][0]["event_id"];
  //     const patientValue = result["Service Created Event Code"][1]["agg_sp_pt_id"];
  //     const callerValue = result["Service Created Event Code"][1]["caller_id"];
  //     const eventPlanValue = result["Service Created Event Code"][2]["event_plan_of_care_id"][0];

  //     console.log("event ID", eventValue);
  //     console.log("patientID", patientValue);
  //     console.log("callerID", callerValue);
  //     console.log("eventPlanID", eventPlanValue);

  //     navigate('/add-prof', {
  //       state: {
  //         patientID: patientValue,
  //         callerID: callerValue,
  //         eventPlanID: eventPlanValue,
  //         eventID: eventValue,
  //       },
  //     });

  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }

  // }

  return (
    <>
      <HRNavbar />
      <Box sx={{ flexGrow: 1, mt: 1, ml: 1, mr: 1, mb: 4 }}>
        <Stack direction={isSmallScreen ? 'column' : 'row'}
          spacing={1}
          alignItems={isSmallScreen ? 'center' : 'flex-start'}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>MANAGE PROFILES</Typography>

          <Box
            component="form"
            sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 260, height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
          >
            <IconButton type="button" sx={{ color: "#69A5EB", height: "36px", width: "36px" }}>
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, }}
              placeholder="Search Professional |"
              inputProps={{ 'aria-label': 'select service' }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Box>

          {isAddServiceAllowed && (
            <Link to="/hr/manage profiles/add-prof" style={{ textDecoration: 'none' }}>
              <Button variant='contained' sx={{ background: "#69A5EB", textTransform: "capitalize", height: "40px", borderRadius: "8px" }}>
                <PersonAddAltOutlinedIcon sx={{ mr: 1, fontSize: "18px" }} />
                Add New Professional
              </Button>
            </Link>
          )}

        </Stack>

        <TableContainer sx={{ height: "68vh" }}>
          <Table >
            <TableHead>
              <TableRow >
                <ProfileCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                  <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Sr. No</Typography>
                  </CardContent>
                  {/* <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Source</Typography>
                  </CardContent> */}
                  <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Professional Name</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1.8, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Service Name</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Contact No</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Employee Type</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Status</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Action</Typography>
                  </CardContent>
                </ProfileCard>
              </TableRow>
            </TableHead>

            {loading ? (
              <Box sx={{ display: 'flex', mt: 15, ml: 80, height: '100px', }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableBody>
                {filteredProfiles.length === 0 ? (
                  <TableRow>
                    <CardContent >
                      <Typography variant="body2">
                        No Data Available
                      </Typography>
                    </CardContent>
                  </TableRow>
                ) : (
                  filteredProfiles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        key={row.srv_prof_id}
                        value={row.srv_prof_id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                      >
                        <ProfileCard>
                          <CardContent style={{ flex: 0.5 }}>
                            <Typography variant="body2">
                              {index + 1 + page * rowsPerPage}
                            </Typography>
                          </CardContent>
                          {/* <CardContent style={{ flex: 0.5 }}>
                            <Typography variant="body2">
                              {getCallerStatusTooltip(row.professinal_status)}
                            </Typography>
                          </CardContent> */}
                          <CardContent style={{ flex: 1.5 }}>
                            <Typography variant="body2">
                              {row.prof_fullname || '-'}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1.8 }}>
                            <Typography variant="body2">
                              {row.srv_id || '-'}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1 }}>
                            <Typography variant="body2">
                              <PhoneOutlinedIcon sx={{ fontSize: "16px", color: "#69A5EB", alignItems: 'left', textAlign: 'left' }} /> {row.phone_no || ''}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1 }}>
                            {row.Job_type === 1 ? (
                              <Typography variant='body2'>On Call</Typography>
                            ) : row.Job_type === 2 ? (
                              <Typography variant='body2'>Full Time</Typography>
                            ) : (
                              <Typography variant='body2'>Part Time</Typography>
                            )}
                          </CardContent>
                          <CardContent style={{ flex: 1 }}>
                            {row.professinal_status === 1 ? (
                              <Typography variant='body2'>Interview pending</Typography>
                            ) : row.professinal_status === 2 ? (
                              <Typography variant='body2'>Document review/downloads</Typography>
                            ) : row.professinal_status === 3 ? (
                              <Typography variant='body2'>Document review/downloads</Typography>
                            ) : row.professinal_status === 4 ? (
                              <Typography variant='body2'>Document review/downloads</Typography>
                            ) : (
                              <Typography variant='body2'>Document Verified</Typography>
                            )}
                          </CardContent>
                          <CardContent style={{ flex: 1 }}>
                            {isViewServiceAllowed ? (
                              <Typography variant="body2">
                                <RemoveRedEyeOutlinedIcon
                                  sx={{ fontSize: '20px', mt: 2 }}
                                  // onClick={handleIconClick}
                                  onClick={() => handleIconClick(row.srv_prof_id)}
                                />
                              </Typography>
                            ) : (
                              <div>-</div>
                            )}
                          </CardContent>
                        </ProfileCard>
                      </TableRow>
                    )
                    ))}
              </TableBody>
            )}
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={filteredProfiles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
      <Footer />
    </>

  )
}

export default ManageProfile
