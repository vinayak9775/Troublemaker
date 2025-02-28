
import React, { useState, useEffect } from 'react';

import { Box, Stack } from '@mui/system'
import {
  Button, CardContent, Grid, MenuItem, AppBar, IconButton, InputBase, Modal, Table,
  TableBody, TableContainer, TableHead, TableRow, TextField, Typography,
  Card, TablePagination, Popover, TableCell, CircularProgress, Alert, Snackbar,
} from '@mui/material'
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import HRNavbar from '../../HR/HRNavbar';
import Footer from '../../../Footer';


const UserCard = styled(Card)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '10px',
  backgroundColor: 'white',
  boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
  height: "52px",
  borderRadius: '10px',
  transition: '2s ease-in-out',
  '&:hover': {
    backgroundColor: '#F7F7F7',
  },
});

const ExternalProf = () => {

  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const addedby = localStorage.getItem('clg_id');

  const [openModal, setOpenModal] = useState(false);
  const [openRModal, setOpenRModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [profID, setProfID] = useState('');
  const [profData, setProfData] = useState([]);
  const [remark, setRemark] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [approveRejectStatus, setApproveRejectStatus] = useState();
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenRModal = () => {
    setOpenRModal(true);
  };

  const handleCloseRModal = () => {
    setOpenRModal(false);
    setRemark('');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredTableData = tableData
    .filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (item.prof_fullname || '').toLowerCase().includes(searchLower) ||
        (item.email_id || '').toLowerCase().includes(searchLower) ||
        (item.phone_no ? item.phone_no.toString().toLowerCase().includes(searchLower) : false)
      );
    });

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const profIDRequest = (eveId) => {
    const selectedRequest = tableData.find(item => item.srv_prof_id === eveId);
    console.log("Selected Event", selectedRequest);
    if (selectedRequest) {
      console.log("Selected Event ID:", selectedRequest.srv_prof_id);
      setProfID(selectedRequest.srv_prof_id);
    }
  };

  useEffect(() => {
    const fetchProfDetails = async () => {
      setLoading(true);
      if (profID) {
        try {
          const response = await fetch(`${port}/hr/Exter_Prof_Action_Get/${profID}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          });
          const data = await response.json();
          console.log('Fetching Data kkkkkkkkkkk', data);
          setProfData(data);
          setLoading(false);
        }
        catch (error) {
          console.log('Error fetching Data');
        }
      }
    }
    fetchProfDetails();
  }, [profID])

  async function handleRemarkSubmit(event, status) {
    event.preventDefault();
    const requestData = {
      extr_pro_ap_re: 1,
      srv_prof_id: profID,
      Remark: remark,
      approve_reject: status,
      last_modified_by: addedby,
      added_by: addedby,
    };
    console.log("POST API Hitting......", requestData)
    try {
      const response = await fetch(`${port}/hr/External_prof_accept_reject/${profID}/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
      const result = await response.json();
      console.log("Remark", result);
      setOpenSnackbar(true);
      setSnackbarMessage('Data submitted successfully!');
      // onClose();
      window.location.reload();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  const handleDocumentDownload = (docPath) => {
    const documentUrl = decodeURIComponent(docPath);
    const fileUrl = `${documentUrl}`;
    window.open(fileUrl, '_blank');
  };

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`${port}/hr/company_get/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCompanyList(data);
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCompany();
  }, [])

  const fetchUserDetails = async (companyId = '') => {
    setLoading(true);
    try {
      const url = companyId
        ? `${port}/hr/external_prof_list/?prof_compny=${companyId}`
        : `${port}/hr/external_prof_list/`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      console.log('Fetched Data:', data);
      setTableData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      fetchUserDetails(selectedCompany); // fetch data based on selected company
    } else {
      fetchUserDetails(); // fetch all data if no company is selected
    }
  }, [selectedCompany]);

  return (
    <div>
      <HRNavbar />
      <Box sx={{ flexGrow: 1, ml: 1, mr: 1, }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ fontSize: 16, fontWeight: 600 }} color="text.secondary">
            PROFESSIONAL LIST
          </Typography>

          <Box
            component="form"
            sx={{
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              width: 300,
              height: '2.5rem',
              backgroundColor: "#F2F2F2",
              boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
              borderRadius: "10px",
              border: "1px solid #C9C9C9"
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Professional |"
              inputProps={{ 'aria-label': 'search user' }}
              value={searchQuery}
              onChange={handleSearch}
            />
            <IconButton type="button" sx={{ p: '10px' }}>
              <SearchIcon sx={{ color: "#7AB7EE" }} />
            </IconButton>
          </Box>

          <Box
            component="form"
            sx={{
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              width: 300,
              height: '2.5rem',
              backgroundColor: "#F2F2F2",
              boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
              borderRadius: "10px",
              border: "1px solid #C9C9C9"
            }}
          >
            <TextField
              id="outlined-select-clg_gender"
              select
              label="Organisation Name"
              name="grp_id"
              size="small"
              fullWidth
              sx={{
                '& input': {
                  fontSize: '14px',
                },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: '170px',
                      maxWidth: '30px',
                    },
                  },
                },
              }}
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {companyList.map((item) => (
                <MenuItem key={item.company_pk_id} value={item.company_pk_id}>
                  {item.company_name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Stack>

        <TableContainer sx={{ height: "68vh" }}>
          <Table >
            <TableHead>
              <TableRow >
                <UserCard style={{ height: '3rem', background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                  <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Sr. No</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1.6, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Name</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Email ID</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Contact Number</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Service</Typography>
                  </CardContent>
                  <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF" }}>
                    <Typography variant="subtitle2">Action</Typography>
                  </CardContent>
                </UserCard>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredTableData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" style={{ height: '45vh' }}>
                      <Typography variant="subtitle1">No data found</Typography>
                    </TableCell>
                  </TableRow>
                ) :
                  (
                    filteredTableData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user, index) => (
                        <TableRow key={user.srv_prof_id}>
                          <UserCard>
                            <CardContent style={{ flex: 0.5 }}>
                              <Typography variant="subtitle2">{index + 1 + page * rowsPerPage}</Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1.6 }}>
                              <Typography variant="subtitle2">{user.prof_fullname || '-'}</Typography>
                            </CardContent>
                            <CardContent style={{ flex: 2 }}>
                              <Typography variant="subtitle2">{user.email_id || '-'}</Typography>
                            </CardContent>
                            <CardContent style={{ flex: 2 }}>
                              <Typography variant="subtitle2">{user.phone_no || '-'}</Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1 }}>
                              <Typography variant="subtitle2">{user.srv_id || '-'}</Typography>
                            </CardContent>
                            <CardContent style={{ flex: 0.5 }}>
                              <RemoveRedEyeIcon sx={{ cursor: "pointer" }} onClick={() => handleOpenModal(profIDRequest(user.srv_prof_id))} />
                            </CardContent>
                          </UserCard>
                        </TableRow>
                      ))
                  )
              }
            </TableBody>
          </Table>

          <Modal open={openModal} onClose={handleCloseModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: 800,
                height: 'auto',
                backgroundColor: '#F2F2F2',
                borderRadius: '5px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                padding: '10px',
                overflowY: 'scroll',
                maxHeight: '85%',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <AppBar
                  position="static"
                  sx={{
                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                    width: '50.7em',
                    height: '3rem',
                    mt: '-10px',
                    ml: '-10px',
                    borderRadius: '8px 0 0 0',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '10px' }}>
                    <Typography variant="h6" component="h4" sx={{ flexGrow: 1 }}>
                      View Professional
                    </Typography>
                    <IconButton sx={{ color: 'white', mr: 1 }} onClick={handleCloseModal} aria-label="close">
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </AppBar>
              </Box>

              <Grid container spacing={2} sx={{ justifyContent: 'center', marginBottom: '58px' }}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      typography: 'body1',
                      background: "#FFFFFF",
                      borderRadius: '10px',
                      width: "92%",
                      height: "100%",
                      justifyContent: 'center',
                      marginLeft: '8px',
                      marginRight: '8px',
                      padding: '10px',
                      marginTop: '20px',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, fontSize: "16px", marginBottom: '10px' }}
                    >
                      PROFESSIONAL DETAILS
                    </Typography>

                    {[
                      { label: "Name", value: profData.prof_fullname },
                      { label: "Phone", value: profData.phone_no },
                      { label: "Email", value: profData.email_id },
                      { label: "DOB", value: profData.dob },
                      { label: "Address", value: profData.address },
                      { label: "Home Zone", value: profData.prof_zone_id },
                    ].map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            width: "120px",
                            color: "#000000",
                          }}
                        >
                          {item.label}:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "15px",
                            color: "#555555",
                          }}
                        >
                          {item.value || "N/A"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      typography: 'body1',
                      background: "#FFFFFF",
                      borderRadius: '10px',
                      width: "92%",
                      height: "100%",
                      justifyContent: 'center',
                      marginLeft: '8px',
                      marginRight: '8px',
                      padding: '10px',
                      marginTop: '20px',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, fontSize: "16px", marginBottom: '10px' }}
                    >
                      EDUCATIONAL DETAILS
                    </Typography>
                    {[
                      { label: "Qualification", value: profData.exter_prof_Interview?.[0]?.qualification_name },
                      { label: "Certificate Registration No", value: profData.certificate_registration_no },
                      { label: "Specialization", value: profData.exter_prof_Interview?.[0]?.specialization_name },
                    ].map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            width: "200px",
                            color: "#000000",
                          }}
                        >
                          {item.label}:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: "15px",
                            color: "#555555",
                          }}
                        >
                          {item.value ? item.value : '-'}
                        </Typography>
                      </Box>
                    ))}

                    {profData?.exter_prof_Interview?.[0]?.prof_CV && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "14px",
                            width: "200px",
                            color: "#000000",
                          }}
                        >
                          CV:
                        </Typography>
                        {/* <Typography
                          variant="body1"
                          sx={{
                            fontSize: "15px",
                            color: "#555555",
                          }}
                        >
                          {profData?.exter_prof_Interview?.[0]?.prof_CV ?
                            decodeURIComponent(profData?.exter_prof_Interview?.[0]?.prof_CV).split('/').pop() : 'N/A'}
                        </Typography> */}
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            const fileUrl = profData?.exter_prof_Interview?.[0]?.prof_CV;
                            if (fileUrl) {
                              window.open(fileUrl, '_blank'); // Open the CV link in a new tab
                            } else {
                              alert('CV not available for download.');
                            }
                          }}
                          sx={{ marginLeft: '10px' }}
                        >
                          Download
                        </Button>
                      </Box>
                    )}

                    <Box>
                      <Typography variant="body1" sx={{ fontSize: "14px", marginBottom: '8px' }}>
                        <strong>Document:</strong>
                      </Typography>
                      {profData?.exter_prof_document?.length > 0 ? (
                        profData.exter_prof_document.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '10px',
                              justifyContent: 'space-between', // Aligning the button to the right
                            }}
                          >
                            <Typography variant="body1" sx={{ marginRight: '10px' }}>
                              {`${item.doc_li_id}`}
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleDocumentDownload(item.professional_document)}
                            >
                              Download
                            </Button>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No documents available.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box
                sx={{
                  typography: 'body1',
                  background: "#FFFFFF",
                  borderRadius: '10px',
                  width: "96%",
                  height: "auto",
                  justifyContent: 'center',
                  marginLeft: '8px',
                  marginRight: '8px',
                  marginTop: '10px',
                  padding: '10px',
                  marginBottom: '10px'
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, fontSize: "16px", marginBottom: '10px' }}
                >
                  SERVICE DETAILS
                </Typography>

                <Box sx={{ display: 'flex', marginBottom: '8px' }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", fontSize: "14px", width: "120px" }}
                  >
                    Service:
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "14px" }}>
                    {profData.srv_id || "-"}
                  </Typography>
                </Box>

                <Box sx={{ marginBottom: '8px' }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", fontSize: "14px", marginBottom: '4px' }}
                  >
                    Sub-Service:
                  </Typography>
                  {profData?.prof_service_details?.length > 0 ? (
                    <Box component="ul" sx={{ paddingLeft: '135px', margin: 0 }}>
                      {profData.prof_service_details.map((item, index) => (
                        <Box component="li" key={index} sx={{ marginBottom: '4px' }}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ fontSize: "14px" }}
                          >
                            {item.sub_srv_name} [{item.prof_cost || '-'} rs]
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ fontSize: "14px", fontStyle: "italic" }}
                    >
                      No Sub-Service available.
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', marginBottom: '8px' }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", fontSize: "14px", width: "120px" }}
                  >
                    Job Type:
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "14px" }}>
                    {profData.Job_type || "-"}
                  </Typography>
                </Box>
              </Box>

              <div style={{ display: "flex" }}>
                {profData.status !== 1 && (
                  <Button variant="contained" sx={{ m: 1, width: '20ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize" }} onClick={(e) => { setApproveRejectStatus(1); handleOpenRModal(profIDRequest) }}>Approve</Button>
                )}

                <Button variant="contained" sx={{ m: 1, width: '20ch', backgroundColor: '#FD7568', borderRadius: "12px", textTransform: "capitalize" }} onClick={(e) => { setApproveRejectStatus(2); handleOpenRModal(profIDRequest) }}>Reject</Button>
              </div>
            </Box>
          </Modal>

          <Modal
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={openRModal}
            onClose={handleCloseRModal}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: 300,
                height: 220,
                backgroundColor: '#F2F2F2',
                borderRadius: '8px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                padding: '15px',
                overflowY: 'auto'
              }}
            >
              <IconButton sx={{ ml: 25, color: "black" }} onClick={handleCloseRModal}>
                <CloseIcon />
              </IconButton>
              <Grid container spacing={2} sx={{ marginTop: '5px', marginBottom: '10px', width: '100%' }}>
                <Grid item xs={12} sm={12} lg={12}>
                  <TextField
                    id="remark"
                    label="Remark *"
                    name="remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    sx={{
                      '& input': {
                        fontSize: '14px',
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: '#007bff',
                  '&:hover': {
                    backgroundColor: '#0056b3',
                  },
                  textTransform: "capitalize",
                  borderRadius: "10px",
                  width: "20ch",
                  mt: 2
                }}
                onClick={(e) => handleRemarkSubmit(e, approveRejectStatus)}
              >
                Submit
              </Button>

              <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
              >
                <Alert variant="filled"
                  onClose={handleSnackbarClose}
                  severity={snackbarSeverity}
                  sx={{ width: '100%', mb: 10 }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Box>
          </Modal>

          <TablePagination
            component="div"
            count={filteredTableData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 100]}
          />
        </TableContainer>
        <Footer />
      </Box>
    </div>
  )
}

export default ExternalProf
