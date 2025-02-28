import React, { useState, useEffect } from 'react';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import { Modal } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { Link } from 'react-router-dom';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Footer from '../../../Footer';
import HRNavbar from '../HRNavbar';
import { useNavigate } from 'react-router-dom';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Typography, Box, Card, CardContent, Grid, Button, MenuItem } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

const intMode = [
  {
    intMode_id: 1,
    label: 'Online',
  },
  {
    intMode_id: 2,
    label: 'Offline',
  }
];

const intRound = [
  {
    intRound_id: 1,
    label: 'Screening Round',
  },
  {
    intRound_id: 2,
    label: 'HR Round',
  },
  {
    intRound_id: 3,
    label: 'Technical Round',
  },
  {
    intRound_id: 4,
    label: 'Observership/Buddy Training Round',
  },
];


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
  const [clgId, setClgId] = useState(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('token');
  const [searchQuery, setSearchQuery] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const id = localStorage.getItem('clg_id');
    setClgId(id);
  }, []);

  // UPDATED CHANGES
  const [profileId, setProfileId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [interviewScheduleWith, setInterviewScheduleWith] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [remark, setRemark] = useState('');
  const [interviewStatus, setInterviewStatus] = useState(false);

  const handleClose = () => {
    setInterviewStatus(false);
    setSelectedType('');
    setSelectedRound('');
    setSelectedMode('');
    setInterviewScheduleWith('');
    setInterviewDate('');
    setSelectedInterview('');
    setRemark('');
  };

  const handleStatusChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleInterviewStatusOpen = async (profId) => {
    setProfileId(profId);
    setInterviewStatus(true);

    try {
      const response = await fetch(`${port}/hr/prof_interview_round/${profId}/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch profile data");

      const data = await response.json();
      console.log(data, 'fetching Interview Data...');
      setSelectedType(data.Schedule_Selected); // Interview Type
      setSelectedRound(data.int_round);      // Round
      setSelectedMode(data.int_mode);        // Mode
      setInterviewScheduleWith(data.int_schedule_with); // Schedule With
      setInterviewDate(data.int_schedule_date); // Date
      setSelectedInterview(data.int_status); // Interview Status
      setRemark(data.int_round_Remark);      // Remarks
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    if (profileId) {
      handleInterviewStatusOpen(profileId);
    } else {
      setSelectedType('');
      setSelectedRound('');
      setSelectedMode('');
      setInterviewScheduleWith('');
      setInterviewDate('');
      setSelectedInterview('');
      setRemark('');
    }
  }, [profileId]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const handleInterviewSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      srv_prof_id: profileId || null,
      Schedule_Selected: selectedType || null,
      int_round: selectedRound || null,
      int_mode: selectedMode || null,
      int_schedule_with: interviewScheduleWith || "",
      int_schedule_date: interviewDate || null,
      int_status: selectedInterview || null,
      int_round_Remark: remark || "",
      added_by: clgId,
      last_modified_by: clgId
    };

    try {
      const response = await fetch(`${port}/hr/prof_interview_round/${profileId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.status === 201) {
        setSnackbarMessage('Data Submitted Successfully...');
        setOpenSnackbar(true);

        setTimeout(async () => {
          // Reset form fields
          setSelectedType('');
          setProfileId('');
          setSelectedRound('');
          setSelectedMode('');
          setInterviewScheduleWith('');
          setInterviewDate('');
          setSelectedInterview('');
          setRemark('');

          // Navigate or close modal based on condition
          if (selectedType === 1) {
            handleClose();
          } else if (selectedType === 2) {
            navigate('/hr/onboarding');
          }

          handleClose();
          await getProfile();

          // Close the snackbar after the timeout
          setOpenSnackbar(false);
        }, 2000);
      }

    } catch (error) {
      setSnackbarMessage('Submission failed, please try again.');
      setOpenSnackbar(true);
      console.error('Error:', error);

      // Close snackbar after showing error
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 2000);
    }
  };

  // const handleInterviewSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = {
  //     srv_prof_id: profileId || null,
  //     Schedule_Selected: selectedType || null,
  //     int_round: selectedRound || null,
  //     int_mode: selectedMode || null,
  //     int_schedule_with: interviewScheduleWith || "",
  //     int_schedule_date: interviewDate || null,
  //     int_status: selectedInterview || null,
  //     int_round_Remark: remark || "",
  //     added_by: clgId,
  //     last_modified_by: clgId
  //   };

  //   try {
  //     const response = await fetch(`${port}/hr/prof_interview_round/${profileId}/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     if (!response.ok) throw new Error('Network response was not ok');

  //     const responseData = await response.json();
  //     console.log('Response:', responseData);

  //     if (response.status === 201) {
  //       setSnackbarMessage('Data Submitted Successfully...');
  //       setOpenSnackbar(true);
  //     }

  //     setSelectedType('');
  //     setProfileId('');
  //     setSelectedRound('');
  //     setSelectedMode('');
  //     setInterviewScheduleWith('');
  //     setInterviewDate('');
  //     setSelectedInterview('');
  //     setRemark('');

  //     if (selectedType === 1) {
  //       handleClose();
  //     } else if (selectedType === 2) {
  //       navigate('/hr/onboarding');
  //     }
  //     handleClose();
  //     await getProfile()
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleIconClick = (id) => {
    console.log("professional ID Fetching...", id);
    navigate('/hr/manage profiles/add-prof', { state: { professionalId: id } });
  };

  //////// permission start
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  console.log(permissions, 'fetching permission');

  const isAddServiceAllowed = permissions.some(permission =>
    permission.modules_submodule.some(module =>
      module.modules.some(submodule =>
        submodule.submodules && submodule.submodules.some(sub =>
          sub.submodule_name === 'Add New Professional'
        )
      )
    )
  );

  const isViewServiceAllowed = permissions.some(permission =>
    permission.modules_submodule.some(module =>
      module.modules.some(submodule =>
        submodule.submodules && submodule.submodules.some(sub =>
          sub.submodule_name === 'View Professional'
        )
      )
    )
  );

  //////// permisssion end

  const [profile, setProfile] = useState([]);
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

  useEffect(() => {
    getProfile();
  }, []);

  const filteredProfiles = profile.filter((row) =>
    row.prof_fullname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <Button
                variant='contained'
                sx={{ background: "#69A5EB", textTransform: "capitalize", height: "40px", borderRadius: "8px" }}
              >
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
                  {/* <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Source</Typography>
                  </CardContent> */}
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
                            <Typography variant="body2">
                              {row.Job_type || '-'}
                            </Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1 }}>
                            <Typography variant="body2">
                              {row.manage_Profiles_status === 1 ? 'Select' :
                                row.manage_Profiles_status === 2 ? 'Reject' :
                                  row.manage_Profiles_status === 3 ? 'On Hold' :
                                    row.manage_Profiles_status === 4 ? 'Shortlisted' : '-'
                              }
                            </Typography>
                          </CardContent>
                          {/* <CardContent style={{ flex: 1 }}>
                            <Typography variant="body2">Source</Typography>
                          </CardContent> */}
                          {/* <CardContent style={{ flex: 1 }}>
                            <Box display="flex" alignItems="center">
                              {isViewServiceAllowed ? (
                                <Typography variant="body2">
                                  <RemoveRedEyeOutlinedIcon
                                    sx={{ fontSize: '26px', mt: 2 }}
                                    onClick={() => handleIconClick(row.srv_prof_id)}
                                  />
                                </Typography>
                              ) : (
                                <div style={{ marginRight: 8 }}>-</div>
                              )}
                              <Typography variant="body2">
                                <NoteAddOutlinedIcon
                                  sx={{ fontSize: '26px', mt: 2, ml: 2 }}
                                  onClick={() => handleInterviewStatusOpen(row.srv_prof_id)}
                                />
                              </Typography>
                            </Box>
                          </CardContent> */}
                          <CardContent style={{ flex: 1 }}>
                            <Box display="flex" alignItems="center">
                              {isViewServiceAllowed ? (
                                <Tooltip title="View Service">
                                  <Typography variant="body2">
                                    <RemoveRedEyeOutlinedIcon
                                      sx={{ fontSize: '26px', mt: 2 }}
                                      onClick={() => handleIconClick(row.srv_prof_id)}
                                    />
                                  </Typography>
                                </Tooltip>
                              ) : (
                                <div style={{ marginRight: 8 }}>-</div>
                              )}
                              <Tooltip title="Interview Status">
                                <Typography variant="body2">
                                  <NoteAddOutlinedIcon
                                    sx={{ fontSize: '26px', mt: 2, ml: 2 }}
                                    onClick={() => handleInterviewStatusOpen(row.srv_prof_id)}
                                  />
                                </Typography>
                              </Tooltip>
                            </Box>
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

        <Modal open={interviewStatus} onClose={handleClose}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 1, width: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" component="h2">INTERVIEW PROCESS</Typography>
              <IconButton onClick={handleClose} aria-label="close"><CloseIcon /></IconButton>
            </Box>

            <Grid container spacing={2} sx={{ marginTop: '1px' }}>
              <Grid item xs={12}>
                <TextField
                  select
                  id="int_round"
                  name="Schedule_Selected"
                  label="Select Type"
                  size="small"
                  fullWidth
                  value={selectedType}
                  onChange={handleStatusChange}
                  sx={{
                    textAlign: 'left',
                    '& input': {
                      fontSize: '14px',
                    },
                  }}
                >
                  <MenuItem sx={{ fontSize: '14px' }} value={1}>Schedule Interview</MenuItem>
                  <MenuItem sx={{ fontSize: '14px' }} value={2}>Candidate Selected</MenuItem>
                </TextField>
              </Grid>

              {selectedType === 1 && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      select
                      id="int_round"
                      name="int_round"
                      label="Select Round"
                      size="small"
                      fullWidth
                      value={selectedRound}
                      onChange={(e) => setSelectedRound(e.target.value)}
                      sx={{
                        textAlign: 'left',
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                    >
                      {intRound.map((option) => (
                        <MenuItem key={option.intRound_id} value={option.intRound_id} sx={{ fontSize: '14px' }}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      id="int_mode"
                      name="int_mode"
                      label="Mode of Interview"
                      size="small"
                      fullWidth
                      value={selectedMode}
                      onChange={(e) => setSelectedMode(e.target.value)}
                      sx={{
                        textAlign: 'left',
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                    >


                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      id="int_schedule_with"
                      name="int_schedule_with"
                      label="Interview Schedule with"
                      size="small"
                      fullWidth
                      value={interviewScheduleWith}
                      onChange={(e) => setInterviewScheduleWith(e.target.value)}
                      sx={{
                        textAlign: 'left',
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item lg={12} sm={12} xs={12}>
                    <TextField
                      id="int_schedule_date"
                      name="int_schedule_date"
                      type="date"
                      label="Date"
                      size="small"
                      fullWidth
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      sx={{
                        textAlign: 'left',
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      name="int_round"
                      label="Interview Status"
                      size="small"
                      fullWidth
                      value={selectedInterview}
                      onChange={(e) => setSelectedInterview(e.target.value)}
                      sx={{
                        textAlign: 'left',
                        '& input': {
                          fontSize: '14px',
                        },
                      }}
                    >
                      <MenuItem sx={{ fontSize: '14px' }} value={1}>Select</MenuItem>
                      <MenuItem sx={{ fontSize: '14px' }} value={2}>Reject</MenuItem>
                      <MenuItem sx={{ fontSize: '14px' }} value={3}>On Hold</MenuItem>
                      <MenuItem sx={{ fontSize: '14px' }} value={4}>Shortlisted</MenuItem>
                    </TextField>
                  </Grid>
                </>
              )}

              <>
                <Grid item xs={12}>
                  <TextField
                    id="Remark"
                    name="int_round_Remark"
                    label="Interview Remark"
                    size="small"
                    fullWidth
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    sx={{
                      textAlign: 'left',
                      '& input': {
                        fontSize: '14px',
                      },
                    }}
                  />
                </Grid>
              </>

              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 1,
                  ml: '10em',
                  width: '18ch',
                  backgroundColor: '#7AB8EE',
                  borderRadius: '12px',
                  textTransform: 'capitalize',
                }}
                type="submit"
                onClick={handleInterviewSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Box>
        </Modal>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleSnackbarClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>

      </Box>
      <Footer />
    </>

  )
}

export default ManageProfile
