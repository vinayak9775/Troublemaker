import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, TableContainer, Table, TableHead, TableRow, TableBody, TablePagination } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import Modal from '@mui/material/Modal';
import AppBar from '@mui/material/AppBar';
import CloseIcon from '@mui/icons-material/Close';
import { display, styled } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';
import filter from '../../assets/ManagementDash/Filter.png';


const AttendenceCard = styled(Card)({
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
    cursor: 'pointer',
  },
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  pt: 2,
  px: 4,
  pb: 3,
};

const Payment = ({ inprocesscount, inpaymentcount, inpendingcount, value, assign, inprocessEnq, pendingEnq, unassignProf }) => {

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //prof series
  const getProfDisplay = () => {
    if (value === '1') return [assign?.assignToday || 0, assign?.unassignToday || 0];
    if (value === '2') return [assign?.assignMonth || 0, assign?.unassignMonth || 0];
    if (value === '3') return [assign?.assignTill || 0, assign?.unassignTill || 0];
    return [0, 0]; // Default case if value does not match any condition
  };

  const [options, setOptions] = useState({
    chart: {
      width: 380,
      type: 'donut',
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              color: '#263238',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '16px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              color: '#000',
              offsetY: 16,
              formatter: function (val) {
                return val;
              },
            },
            total: {
              show: true,
              label: `Total Professionals`,
              color: '#000',
              fontSize: '14px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              style: {
                whiteSpace: 'pre-wrap',
              },
              formatter: function () {
                return `${getUnassignTotalCount()}`;
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false, // Disable default tooltip
    },
    title: {
      text: 'PROFESSIONALS AVAILABILITY',
      align: 'center',
      style: {
        fontFamily: 'Roboto, sans-serif',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#263238',
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    labels: ['Assign', 'Un assign'],
    colors: ['#6AA5EB', '#FD7568'],
  });

  const handleMouseEnter = (event, chartContext, config) => {
    const totalLabel = document.querySelector('.apexcharts-donut-label-total');
    if (totalLabel) {
      totalLabel.textContent = `${config.series[config.seriesIndex]} ${config.seriesNames[config.seriesIndex]} (${config.series[config.seriesIndex]})`;
    }
  };

  const handleMouseLeave = () => {
    const totalLabel = document.querySelector('.apexcharts-donut-label-total');
    if (totalLabel) {
      totalLabel.textContent = `${getUnassignTotalCount()}`;
    }
  };
  //inprocess count
  const getCountDisplay = () => {
    if (value === '1') return inprocesscount.today;
    if (value === '2') return inprocesscount.month;
    if (value === '3') return inprocesscount.tilldate;
    return null; // Default case if value does not match any condition
  };

  //inpayment count
  const getCountDisplay1 = () => {
    if (value === '1') return inpaymentcount.today;
    if (value === '2') return inpaymentcount.month;
    if (value === '3') return inpaymentcount.tilldate;
    return null; // Default case if value does not match any condition
  };

  //inpending count
  const getCountDisplay2 = () => {
    if (value === '1') return inpendingcount.today;
    if (value === '2') return inpendingcount.month;
    if (value === '3') return inpendingcount.tilldate;
    return null; // Default case if value does not match any condition
  };

  //assign count
  const getAssignCount = () => {
    if (value === '1') return assign.assignToday;
    if (value === '2') return assign.assignMonth;
    if (value === '3') return assign.assignTill;
    return null; // Default case if value does not match any condition
  };
  //assign count
  const getUnassignCount = () => {
    if (value === '1') return assign.unassignToday;
    if (value === '2') return assign.unassignMonth;
    if (value === '3') return assign.unassignTill;
    return null; // Default case if value does not match any condition
  };

  //assign unassign total count
  const getUnassignTotalCount = () => {
    if (value === '1') return assign.total_professionals;
    if (value === '2') return assign.total_professionals;
    if (value === '3') return assign.total_professionals;
    return null; // Default case if value does not match any condition
  };

  //Inprocess modal
  const [filteredInprocessEnq, setFilteredInprocessEnq] = useState([]);

  const [openInprocess, setOpenInprocess] = useState(false);
  const handleOpenInprocess = () => setOpenInprocess(true);
  const handleCloseInprocess = () => setOpenInprocess(false);

  useEffect(() => {
    const filterInprocessEnquiries = () => {
      let filtered = [];
      if (value === '1') filtered = inprocessEnq.today;
      if (value === '2') filtered = inprocessEnq.month;
      if (value === '3') filtered = inprocessEnq.tilldate;
      setFilteredInprocessEnq(filtered || []);
      setPage(0);
    };
    filterInprocessEnquiries();
  }, [value, inprocessEnq]);

  //Pending amount modal
  const [filteredPendingEnq, setFilteredPendingEnq] = useState([]);

  const [openPending, setOpenPending] = useState(false);
  const handleOpenPending = () => setOpenPending(true);
  const handleClosePending = () => setOpenPending(false);

  useEffect(() => {
    const filterPendingEnquiries = () => {
      let filtered = [];
      if (value === '1') filtered = pendingEnq.today;
      if (value === '2') filtered = pendingEnq.month;
      if (value === '3') filtered = pendingEnq.tilldate;
      setFilteredPendingEnq(filtered || []);
      setPage(0);
    };
    filterPendingEnquiries();
  }, [value, pendingEnq]);

  //unassign prof modal
  const [filteredUnassignProf, setFilteredUnassignProf] = useState([]);

  const [openUnassignProf, setOpenUnassignProf] = useState(false);
  const handleOpenUnassignProf = () => setOpenUnassignProf(true);
  const handleCloseUnassignProf = () => setOpenUnassignProf(false);

  useEffect(() => {
    const filterUnassignProfEnquiries = () => {
      let filtered = [];
      if (value === '1') filtered = unassignProf.today;
      if (value === '2') filtered = unassignProf.month;
      if (value === '3') filtered = unassignProf.tilldate;
      setFilteredUnassignProf(filtered || []);
      setPage(0);
    };
    filterUnassignProfEnquiries();
  }, [value, unassignProf]);
  return (
    <div>
      <Grid container spacing={2} style={{ paddingLeft: '0px', paddingRight: '7px', marginTop: '-10px' }}>
        <Grid item md={12} xs={12} lg={12}>
          <Card style={{ backgroundColor: '#6AA5EB', color: '#fff', borderRadius: '10px', margin: '0' }}>
            <CardContent >
              <Typography variant="h6" component="div" style={{ fontSize: '1rem', textAlign: 'left', marginTop: '-10px' }}>
                PAYMENT COLLECTED
              </Typography>
              <Typography variant="h5" component="div" sx={{}}>
                {getCountDisplay1()}
              </Typography>
              <img src={filter} width='73%' />
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6} xs={12} lg={6}>
          <Card style={{
            borderRadius: '10px', margin: '0', border: '1px solid #8A8A8A',
            borderRadius: '10px',cursor:'pointer'
          }} onClick={handleOpenInprocess}>
            <CardContent>
              <Typography variant="h6" component="div" style={{ fontSize: '1.2rem', color: '#000', }}>
                {getCountDisplay()}
              </Typography>
              <Typography variant="h6" component="div" sx={{ mt: 1, color: '#06AF87' }}>
                In process
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6} xs={12} lg={6}>
          <Card style={{
            borderRadius: '10px', margin: '0', border: '1px solid #8A8A8A',
            borderRadius: '10px', cursor:'pointer'
          }} onClick={handleOpenPending}>
            <CardContent>
              <Typography variant="h6" component="div" style={{ fontSize: '1.2rem', color: '#000' }}>
                {getCountDisplay2()}
              </Typography>
              <Typography variant="h6" component="div" sx={{ mt: 1, color: '#BA0808' }}>
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          <Card sx={{
            border: '1px solid #8A8A8A',
            borderRadius: '10px', backgroundColor: '#FFFDF5', alignItems: 'center', display: 'flex', justifyContent: 'center', height: '98%'
          }}>
            <CardContent>
              <div id="chart" style={{ marginTop: '-10px', marginLeft: '2rem' }}>
                <ReactApexChart
                  options={options}
                  series={getProfDisplay()}
                  type="donut"
                  width={340}
                  events={{
                    dataPointMouseEnter: handleMouseEnter,
                    dataPointMouseLeave: handleMouseLeave,
                  }}
                />
              </div>
              <Button variant="contained" sx={{
                backgroundColor: '#fff', color: '#000', position: 'relative', width: '9rem',
                '&:hover': {
                  backgroundColor: '#fff',
                },
              }}>

                <span style={{
                  position: 'absolute',
                  top: '50%',
                  right: '120px',
                  transform: 'translateY(-50%)',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#6AA5EB',
                  borderRadius: '50%',
                  display: 'block',
                }} />
                Assign {getAssignCount()}
              </Button>
              <Button variant="contained" sx={{
                backgroundColor: '#fff', color: '#000', position: 'relative', width: '9.5rem', marginLeft: '10px',
                '&:hover': {
                  backgroundColor: '#fff',
                },
              }}
              onClick={handleOpenUnassignProf}
              >
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  right: '135px',
                  transform: 'translateY(-50%)',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#FD7568',
                  borderRadius: '50%',
                  display: 'block',
                }} />
                Un Assign {getUnassignCount()}
              </Button>

            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* inprocess enq modal */}
      <Grid container spacing={1}>

        <Grid item xs={12}>
          <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>

            <Modal
              open={openInprocess}
              onClose={handleCloseInprocess}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{ ...style, width: 800, borderRadius: "10px" }}>

                <AppBar position="static" style={{
                  background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                  width: '54rem',
                  height: '3rem',
                  marginTop: '-16px',
                  marginBottom: '1rem',
                  marginLeft: "-32px",
                  borderRadius: "8px 10px 0 0",
                  lineHeight: 'auto'
                }}>
                  <div style={{ display: "flex" }}>
                    <Typography align="center" style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "0px", width: '20rem' }}>In Process Payment</Typography>
                    <Button onClick={handleCloseInprocess} sx={{ marginLeft: "36.5rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                  </div>
                </AppBar>

                <TableContainer sx={{ height: "73vh" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <AttendenceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                          <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Sr. No</Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Event ID</Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Professional Name</Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Mode Of Payment</Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Service Amount</Typography>
                          </CardContent>
                        </AttendenceCard>
                      </TableRow>
                    </TableHead>
                    {loading ? (
                      <Box sx={{ display: 'flex', mt: 15, ml: 80, height: '100px' }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <TableBody>
                        {filteredInprocessEnq.length === 0 ? (
                          <TableRow>
                            <CardContent colSpan={10} >
                              <Typography variant="body2" textAlign={'center'}>
                                No Data Available
                              </Typography>
                            </CardContent>
                          </TableRow>
                        ) : (
                          filteredInprocessEnq.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                              <TableRow
                                // key={row.eve_id}
                                // value={row.eve_id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <AttendenceCard>
                                  <CardContent style={{ flex: 0.5, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {index + 1 + page * rowsPerPage}
                                    </Typography>
                                  </CardContent>
                                  <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {row.eve_id}
                                    </Typography>
                                  </CardContent>
                                  <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {row.pay_recived_by__clg_first_name}
                                    </Typography>
                                  </CardContent>
                                  <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {row.mode}
                                    </Typography>
                                  </CardContent>
                                  <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {row.amount_paid}
                                    </Typography>
                                  </CardContent>
                                </AttendenceCard>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    )}
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredInprocessEnq.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                  />
                </TableContainer>
              </Box>
            </Modal>
          </Card>
        </Grid>
      </Grid>


      {/* pending  enq modal */}
      <Grid container spacing={1}>

        <Grid item xs={12}>
          <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>

            <Modal
              open={openPending}
              onClose={handleClosePending}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{ ...style, width: 800, borderRadius: "10px" }}>

                <AppBar position="static" style={{
                  background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                  width: '54rem',
                  height: '3rem',
                  marginTop: '-16px',
                  marginBottom: '1rem',
                  marginLeft: "-32px",
                  borderRadius: "8px 10px 0 0",
                  lineHeight: 'auto'
                }}>
                  <div style={{ display: "flex" }}>
                    <Typography align="center" style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "0px", width: '20rem' }}>Pending Payment</Typography>
                    <Button onClick={handleClosePending} sx={{ marginLeft: "36.5rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                  </div>
                </AppBar>

                <TableContainer sx={{ height: "73vh" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <AttendenceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                          <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Sr. No</Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Event ID</Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Patient Name</Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Service Amount</Typography>
                          </CardContent>
                        </AttendenceCard>
                      </TableRow>
                    </TableHead>
                    {loading ? (
                      <Box sx={{ display: 'flex', mt: 15, ml: 80, height: '100px' }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <TableBody>
                        {filteredPendingEnq.length === 0 ? (
                          <TableRow>
                            <CardContent colSpan={10} >
                              <Typography variant="body2" textAlign={'center'}>
                                No Data Available
                              </Typography>
                            </CardContent>
                          </TableRow>
                        ) : (
                          filteredPendingEnq.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                              <TableRow
                                // key={row.eve_id}
                                // value={row.eve_id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <AttendenceCard>
                                  <CardContent style={{ flex: 0.5, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {index + 1 + page * rowsPerPage}
                                    </Typography>
                                  </CardContent>
                                  <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {row.eve_id}
                                    </Typography>
                                  </CardContent>
                                  <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {row.agg_sp_pt_id__name}
                                    </Typography>
                                  </CardContent>
                                  <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {row.final_amount}
                                    </Typography>
                                  </CardContent>
                                </AttendenceCard>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    )}
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredPendingEnq.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                  />
                </TableContainer>
              </Box>
            </Modal>
          </Card>
        </Grid>
      </Grid>

      {/* unassign prof modal */}
      <Grid container spacing={1}>

        <Grid item xs={12}>
          <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>

            <Modal
              open={openUnassignProf}
              onClose={handleCloseUnassignProf}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{ ...style, width: 800, borderRadius: "10px" }}>

                <AppBar position="static" style={{
                  background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                  width: '54rem',
                  height: '3rem',
                  marginTop: '-16px',
                  marginBottom: '1rem',
                  marginLeft: "-32px",
                  borderRadius: "8px 10px 0 0",
                  lineHeight: 'auto'
                }}>
                  <div style={{ display: "flex" }}>
                    <Typography textAlign="center" style={{ fontSize: "19px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "10px", width: '20rem' }}>Unassign Professionals</Typography>
                    <Button onClick={handleCloseUnassignProf} sx={{ marginLeft: "36.5rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                  </div>
                </AppBar>

                <TableContainer sx={{ height: "73vh" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <AttendenceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                          <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Sr. No</Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Professional Name</Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Service</Typography>
                          </CardContent>
                          <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                            <Typography variant="subtitle2">Location</Typography>
                          </CardContent>
                        </AttendenceCard>
                      </TableRow>
                    </TableHead>
                    {loading ? (
                      <Box sx={{ display: 'flex', mt: 15, ml: 80, height: '100px' }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <TableBody>
                        {filteredUnassignProf.length === 0 ? (
                          <TableRow>
                            <CardContent colSpan={10} >
                              <Typography variant="body2" textAlign={'center'}>
                                No Data Available
                              </Typography>
                            </CardContent>
                          </TableRow>
                        ) : (
                          filteredUnassignProf.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                              <TableRow
                                // key={row.eve_id}
                                // value={row.eve_id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <AttendenceCard>
                                  <CardContent style={{ flex: 0.5, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {index + 1 + page * rowsPerPage}
                                    </Typography>
                                  </CardContent>
                                  <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {row.prof_fullname}
                                    </Typography>
                                  </CardContent>
                                  <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {row.service_title}
                                    </Typography>
                                  </CardContent>
                                  <CardContent style={{ flex: 1, textAlign: 'center' }}>
                                    <Typography variant="body2">
                                      {row.google_home_location}
                                    </Typography>
                                  </CardContent>
                                </AttendenceCard>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    )}
                  </Table>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUnassignProf.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                  />
                </TableContainer>
              </Box>
            </Modal>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default Payment;
