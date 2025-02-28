import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import { Accordion, FormControl, AccordionDetails, AccordionSummary, Avatar, Button, CardContent, FormControlLabel, Grid, IconButton, Input, InputBase, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box';
// import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { display, styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
// import { Tooltip, IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Footer from '../../Footer';
import Navbar from '../ManagementDashboard/Header';
import AppBar from '@mui/material/AppBar';
import CloseIcon from '@mui/icons-material/Close';
import ProfViewAtte from './ProfViewAtte';
import DatePicker from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import Tooltip from '@mui/material/Tooltip';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Swal from 'sweetalert2';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DataGrid } from '@mui/x-data-grid';
// import { Box } from '@mui/system';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import HRNavbar from '../HR/HRNavbar';
// import Stack from '@mui/material/Stack';
// import HRNavbar from '../../HRNavbar';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CheckIcon from '@mui/icons-material/Check';

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

const SmallTimePicker = styled(TimePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    height: '30px', // Adjust the height as needed
    minHeight: '30px', // Ensures the minimum height
    padding: '0 8px', // Adjust padding as needed
    fontSize: '0.875rem', // Adjust font size as needed
  },
  '& .MuiInputBase-input': {
    padding: '0', // Remove padding from input
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem', // Adjust the size of the clock icon
  },
}));

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

const ManageAttendance = () => {

  const [time, setTime] = React.useState(null);
  const columns = [
    { field: 'id', headerName: 'ID', width: 70, alignItems: 'center' },
    { field: 'eventcode', headerName: 'Event code', width: 180, alignItems: 'center' },
    { field: 'profname', headerName: 'Professional name', width: 180, alignItems: 'center' },
    { field: 'patientname', headerName: 'Patient name', width: 130, alignItems: 'center' },
    { field: 'service', headerName: 'Service name', width: 180, alignItems: 'center' },
    { field: 'subservice', headerName: 'Sub Service', width: 270, alignItems: 'center' },
    {
      field: 'startdate',
      headerName: 'Start Date',
      type: 'number',
      width: 100,
    },
  ];
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (selection) => {
    const selectedRowData = selection.map((id) => {
      const row = rows.find((row) => row.id === id);
      return {
        ...row,
        Professional_iid: formData.Professional_iid,
        mobile_no: formData.mobile_no,
        service: formData.service,
        attnd_date: formData.attnd_date,
        job_type: formData.job_type,
        attnd_status: formData.attnd_status,
        attnd_type: formData.attnd_type,
        attnd_Note: formData.attnd_Note,
        approve_status: 2,
        added_by:fname+" "+lname
      };
    });

    console.log(selectedRowData, 'selectedRowData');
    setSelectedRows(selectedRowData);
  }

  const handleRejectSession = async () =>{
    handleCloseSession();
    Swal.fire({
      title: 'warning!',
      text: 'Leave Request Rejected..!',
      icon: 'warning'
    });
  }

  const handleAcceptDeallocate = async () => {
    console.log(selectedRows, 'kkkkkkkkkk');
    try {
      const response = await fetch(`${port}/web/Deallocater-attendance/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedRows),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Response:', data.error);
      if (data.error) {
        // alert(data.error);
        handleCloseSession();
        Swal.fire({
          title: 'Success!',
          text: data.error,
          icon: 'success'
        });
      }
      else {
        handleCloseSession();
        Swal.fire({
          title: 'Success!',
          text: 'Submitted Successfully But Approval Pending..!',
          icon: 'success'
        });
      }
      // window.location.reload()
      // setSelectedDates('');
    } catch (error) {
      console.error('Error:', error);
    }
    // setFo
    // console.log(row, 'post details');
    // window.location.reload()

  }

  // const handleSelectionChange = (selection) => {
  //   const selectedRowData = selection.map((id) =>
  //     rows.find((row) => row.id === id)
  //   );
  //   console.log(selectedRowData,"selectedRowData");
  //   setSelectedRows(selectedRowData);
  // };

  const [rows, setRows] = useState([]);
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const clg_id = localStorage.getItem('clg_id');
  const fname = localStorage.getItem('user-name');
  const lname = localStorage.getItem('user-lname');


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [enq, setEnq] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [dates, setDates] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [profCount, setProfCount] = useState("0")
  const [alignment, setAlignment] = React.useState('today');
  const [todayCount, setTodayCount] = useState({
    absent: '',
    present: '',
    woff: ''
  });
  const [thisMonthCount, setThisMonthCount] = useState({
    absent: '',
    present: '',
    woff: ''
  });

  const handleChangeToggle = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    // Fetch data from API
    fetch(`${port}/web/count-professionals-attendance/`)
      .then(response => response.json())
      .then(data => {
        console.log(data, 'apw');
        setTodayCount({
          absent: data.professional_A_count_today,
          present: data.professional_P_count_today,
          woff: data.professional_WO_count_today
        });
        setThisMonthCount({
          absent: data.professional_A_count_month,
          present: data.professional_P_count_month,
          woff: data.professional_WO_count_month
        });
      })
      .catch(error => console.error('Error fetching employee data:', error));
  }, []);

  useEffect(() => {
    // Fetch data from API
    fetch(`${port}/web/count-professionals/`)
      .then(response => response.json())
      .then(data => {
        setProfCount(data.count);
      })
      .catch(error => console.error('Error fetching employee data:', error));
  }, []);

  const leaveOptions = [
    'Present',
    'Absent',
    'Comp Off',
    'First Half',
    'Second Half',
    'Privilege Leave (PL)',
    'Casual Leave (CL)',
    'Sick Leave (SL)',
    'Paid Holiday (PH)',
    'Week Off'
  ];

  const serviceOptions = [
    'Service for 1 hr',
    'Service for 2 hr',
    'Service for 3 hr',
    'Service for 4 hr',
    'Service for 5 hr',
    'Service for 6 hr',
    'Service for 7 hr',
    'Service for 8 hr',
    'Service for 9 hr',
    'Service for 10 hr',
    'Service for 11 hr',
    'Service for 12 hr',
    'Service for 13 hr',
    'Service for 14 hr',
    'Service for 15 hr',
    'Service for 16 hr',
    'Service for 17 hr',
    'Service for 18 hr',
    'Service for 19 hr',
    'Service for 20 hr',
    'Service for 21 hr',
    'Service for 22 hr',
    'Service for 24 hr'
  ];


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [services, setServices] = useState([]);
  useEffect(() => {
    const getServices = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_services_api`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Services Data:", data);
        setServices(data);
      } catch (error) {
        console.error("Error fetching services data:", error);
        // setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, [port, accessToken]);


  useEffect(() => {
    const getEnquires = async () => {
      try {
        const res = await fetch(`${port}/web/agg_hhc_attendance/`, {
          headers: {
            // 'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        console.log("Professional Data.........", data);
        if (data.detail === "No matching records found") {
          setEnq([]);
        } else {
          setEnq(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching Manage Professional Profile Data:", error);
        setLoading(false);
      }
    };
    getEnquires();
    // filteredProfessionals();
  }, []);

  const filteredProfessionals = enq.filter((professional) => {
    // Check if professional.prof_fullname is not null before accessing its properties
    const matchesName = professional.prof_fullname && professional.prof_fullname.toLowerCase().includes(searchQuery.toLowerCase());

    // Check if professional.srv_name is not null before accessing its properties
    const matchesService = selectedService === '' || (professional.srv_name && professional.srv_name === selectedService);
    // setPage(0);
    return matchesName && matchesService;
  });

  console.log(filteredProfessionals, 'gggggggggggggggggg');
  const [formData, setFormData] = useState({
    Professional_iid: '',
    mobile_no: '',
    service: '',
    attnd_date: '',
    job_type: '',
    attnd_status: '',
    attnd_type: '',
    attnd_Note: '',
    from_avail: '',
    to_avail: '',
    added_by: fname+" "+lname,
  });

  // const handleChange = (e) => {
  //   // const { name, value } = e.target;
  //   console.log(value);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  //   if (value == 'First Half' || value == 'Second Half') {
  //     handleOpenHalfSecond();
  //   }
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (value === 'First Half' || value === 'Second Half') {
      handleOpenHalfSecond();
    }
  };

  const handleChangeTime = (fieldName, value) => {
    const formattedValue = dayjs(value).format('HH:mm:ss');
    console.log(formattedValue);
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: formattedValue,
    }));
  };

  // const handleDateChange = (newValue) => {
  //   console.log(newValue);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     attnd_date: newValue, // assuming date is a single value, adjust if it's an array or range
  //   }));
  // };

  const [selectedDates, setSelectedDates] = useState([]);

  // const handleDateChange = (dates, eve_id, row) => {
  //   const formattedDates = dates.map(dateArray => dateArray.map(date => {
  //     const d = new Date(date);
  //     const year = d.getFullYear();
  //     const month = String(d.getMonth() + 1).padStart(2, '0');
  //     const day = String(d.getDate()).padStart(2, '0');
  //     return `${year}-${month}-${day}`;
  //   }));
  //   console.log(formattedDates[0]);
  //   const flatDates = formattedDates.flatMap(dateArray => dateArray);
  //   const dateString = flatDates.join(", "); // You can choose any separator you prefer
  //   console.log(dateString);
  //   setSelectedDates(prevDates => ({
  //     ...prevDates,
  //     [eve_id]: formattedDates
  //   }));

  //   setFormData({
  //     ...formData,
  //     Professional_iid: row.srv_prof_id,
  //     mobile_no: row.phone_no,
  //     service: row.srv_name,
  //     job_type: row.Job_type,
  //     attnd_date: dateString,
  //   });
  //   console.log("Selected dates for row ", eve_id, ": ", dates);
  // };


  const handleDateChange = (date, eve_id, row) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDates(prevDates => ({
      ...prevDates,
      [eve_id]: formattedDate
    }));

    setFormData(prevFormData => ({
      ...prevFormData,
      Professional_iid: row.srv_prof_id,
      mobile_no: row.phone_no,
      service: row.srv_name,
      job_type: row.Job_type,
      attnd_date: formattedDate,
      added_by: fname+" "+lname
    }));

    console.log("Selected date for row ", eve_id, ": ", date);
  };


  const [session, setSession] = useState([])

  const saveChanges = async (row) => {
    console.log(row, 'kkkkkkkkkk');
    try {
      const response = await fetch(`${port}/web/agg-hhc-attendance/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response:', data.error);
      if (Array.isArray(data) && data.length >= 0) {
        console.log(data, 'modal response');
        handleOpenSession();
        setSession(data)
        const formattedRows = data.map((item, index) => ({
          id: index + 1, // Assuming each row has an id, or use item.id if available
          eventcode: item.eve_code || '',
          profname: item.professional_name || '',
          patientname: item.patient || '',
          service: item.service || '',
          subservice: item.sub_service || '',
          startdate: item.actual_StartDate_Time || null,
          eve_id: item.eve_id || '',
          eve_poc_id: item.eve_poc_id || '',
          dt_eve_poc_id: item.dt_eve_poc_id || '',
          // added_by: clg_id || '',
        }));
        setRows(formattedRows);
      }
      else if (data.error) {
        // alert(data.error);
        Swal.fire({
          title: 'Success!',
          text: data.error,
          icon: 'success'
        });
      }
      else if (data.message) {
        // alert(data.error);
        Swal.fire({
          title: 'Warning!',
          text: data.message,
          icon: 'warning'
        });
      }
      else {
        Swal.fire({
          title: 'Success!',
          text: 'Submitted Successfully!',
          icon: 'success'
        });
      }
      // window.location.reload()
      // setSelectedDates('');
    } catch (error) {
      console.error('Error:', error);
    }
    // setFo
    console.log(row, 'post details');
    // window.location.reload()

  }

  const [openCaller, setOpenCaller] = useState(false);
  const [events, setEvents] = useState([]);

  const handleOpenCaller = async (id) => {
    setOpenCaller(true);
    try {
      const res = await fetch(`${port}/web/GET_attendance/${id}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log("Professional Data.........", data);

      const transformedEvents = data.map((item) => ({
        id: item.att_id,
        title: item.attnd_status,
        start: new Date(item.attnd_date),
        end: new Date(item.attnd_date),
        status: item.attnd_status.toLowerCase(), // Assuming 'status' field in your events represents attendance status
        approve_status: item.approve_status
      }));
      // Set events state
      console.log(transformedEvents, 'ttttttttt');
      setEvents(transformedEvents);
    } catch (error) {
      console.error("Error fetching Manage Professional Profile Data:", error);
      setLoading(false);
      setEvents('');
    }

  }
  const handleCloseCaller = () => setOpenCaller(false);

  const [openLeave, setOpenLeave] = useState(false);
  const handleOpenLeave = () => setOpenLeave(true);
  const handleCloseLeave = () => setOpenLeave(false);

  const [openSession, setOpenSession] = useState(false);
  const handleOpenSession = () => setOpenSession(true);
  const handleCloseSession = () => setOpenSession(false);

  const [openHalfSecond, setOpenHalfSecond] = useState(false);
  const handleOpenHalfSecond = () => setOpenHalfSecond(true);
  const handleCloseHalfSecond = () => setOpenHalfSecond(false);

  console.log(dates, 'lll');
  const [tabIndex, setTabIndex] = useState(1);

  const resetForm = () => {
    setSearchQuery('');
    setSelectedService('');
  }
  const [value, setValue] = useState('today');
  const handleChange1 = (event, newValue) => {
    setValue(newValue);
    console.log(newValue, 'newwwwwwwwwww');
  };

  return (
    <>
      {/* <Navbar /> */}
      <HRNavbar />
      <Grid container spacing={4} style={{ paddingLeft: '35px', paddingRight: '35px', marginTop: '-40px'}}>

        <Grid item md={4}>
          <Box sx={{ typography: 'body1', mt: 2 }} >
            <TabContext value={value}>
              <Box sx={{
                typography: 'body1',
                backgroundColor: '#6AA5EB',
                boxShadow: '4px 4px 10px 7px rgba(0, 0, 0, 0.05)',
                borderRadius: '10px',
                width: "17rem",
                height: "3.6rem",
                display: 'flex',
                // justifyContent: 'space-around',
                marginLeft: '-15px',
                marginRight: '8px',
                marginBottom: '8px',
              }}>
                <Stack direction="row" gap={0}>
                  <Box sx={{
                    typography: 'body1',
                    background: "#FFFFFF",
                    borderRadius: '10px',
                    width: "15rem",
                    height: "2.8rem",
                    display: 'flex',
                    justifyContent: 'center',
                    marginLeft: '1rem',
                    marginRight: '8px',
                    alignItems: 'center',
                    mt: 1,
                    // border: '2px solid black'
                  }}>
                    <TabList
                      className="tab-root"
                      onChange={handleChange1}
                      textColor="#51DDD4"
                      sx={{
                        position: 'relative',
                        // border: '1px solid #D8D8D8',
                        borderRadius: '5px'
                      }}
                      TabIndicatorProps={{ style: { background: '#69A5EB', height: '36px', marginBottom: '8px', borderRadius: "10px" } }}
                    >
                      <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "today" ? '#ffffff' : 'black' }}>Today</span>} value="today" sx={{ position: 'relative', zIndex: 1, }} />
                      <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "month" ? '#ffffff' : 'black' }}>This Month</span>} value="month" sx={{ position: 'relative', zIndex: 1, }} />
                      {/* <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "3" ? '#ffffff' : 'black' }}>Last Month</span>} value="3" sx={{ position: 'relative', zIndex: 1, }} /> */}
                    </TabList>
                  </Box>
                </Stack>
              </Box>
            </TabContext>
          </Box>
          {/* <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChangeToggle}
            aria-label="Platform"
          >
            <ToggleButton value="today">Today</ToggleButton>
            <ToggleButton value="month">This Month</ToggleButton>
          </ToggleButtonGroup> */}
        </Grid>
        <Grid md={9}></Grid>
      </Grid>
      <Grid container spacing={4} style={{ paddingLeft: '35px', paddingRight: '35px', marginTop: '-20px' }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            border: '1px solid #8A8A8A',
            borderRadius: '10px',
            marginLeft: '15px',
            padding: '20px 0px',
            mt: 3,
            backgroundColor: '#FEF7F7',
          }}
        >
          <Grid item md={3} xs={6}>
            <Card style={{ backgroundColor: '#551F9C', color: '#fff', borderRadius: '10px', margin: ' 0 15px' }}>
              <CardContent>
                <Typography variant="h6" component="div" style={{ fontSize: '1rem' }}>
                  Total Employee
                </Typography>
                <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                  {profCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3} xs={6}>
            <Card style={{ backgroundColor: '#ED6262', color: '#fff', borderRadius: '10px', margin: ' 0 15px' }}>
              <CardContent>
                <Typography variant="h6" component="div" style={{ fontSize: '1rem' }}>
                  Present Employee
                </Typography>
                <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                  {value == 'today' ? todayCount.present : thisMonthCount.present}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3} xs={6}>
            <Card style={{ backgroundColor: '#45BEC6', color: '#fff', borderRadius: '10px', margin: ' 0 15px' }}>
              <CardContent>
                <Typography variant="h6" component="div" style={{ fontSize: '1rem' }}>
                  Absent Employee
                </Typography>
                <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                  {value == 'month' ? todayCount.absent : thisMonthCount.absent}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3} xs={6}>
            <Card style={{ backgroundColor: '#EDC50D', color: '#fff', borderRadius: '10px', margin: ' 0 15px', cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h6" component="div" style={{ fontSize: '1rem' }}>
                  Week Off
                </Typography>
                <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                  {value == 'today' ? todayCount.woff : thisMonthCount.woff}
                </Typography>
                {/* <Typography variant="p" component="div" style={{ fontSize: '.5rem' }}>
                                    Click Here
                                </Typography> */}
              </CardContent>
            </Card>
          </Grid>
        </Box>

      </Grid>
      <Box sx={{ flexGrow: 1, mt: 3, ml: 1, mr: 1, }} >

        <Box sx={{ typography: 'body1', marginTop: '-.7rem' }} >
          <TabContext value={value}>
            <Box sx={{
              typography: 'body1',
              backgroundColor: '#6AA5EB',
              boxShadow: '4px 4px 10px 7px rgba(0, 0, 0, 0.05)',
              borderRadius: '10px',
              width: "auto",
              height: "3.6rem",
              display: 'flex',
              // justifyContent: 'space-around',
              marginLeft: '8px',
              marginRight: '8px',
              marginBottom: '8px',
            }}>
              <Box
                component="form"
                sx={{ marginLeft: '1rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.2rem', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", mt: 1 }}
              >
                <Stack direction={isSmallScreen ? 'column' : 'row'}
                  spacing={1}
                  alignItems={isSmallScreen ? 'center' : 'flex-start'}>
                  {/* <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: ".6rem!important", marginLeft: "10px" }} color="text.secondary" gutterBottom>PROFESSIONAL ATTENDENCE</Typography> */}
                  <Box
                    component="form"
                    sx={{ border: 'none', marginLeft: '0rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 130, height: '2.2rem', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)" }}
                  >
                    <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "0px", height: "2.6rem", backgroundColor: tabIndex === 1 ? '#45BEC6' : '#fff', color: tabIndex === 1 ? '#FFFFFF' : 'inherit', }} onClick={() => setTabIndex(1)}>Attendance</Button>

                    {/* <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "0px", height: "2.6rem", backgroundColor: '#fff', color: '#000' }} onClick={resetForm}>Attendance</Button> */}
                  </Box>
                  <Box
                    component="form"
                    sx={{ border: 'none', marginLeft: '0rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 150, height: '2.2rem', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)" }}
                  >
                    <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "0px", height: "2.6rem", backgroundColor: tabIndex === 2 ? '#45BEC6' : '#fff', color: tabIndex === 2 ? '#FFFFFF' : 'inherit', }} onClick={() => setTabIndex(2)}>Leave Request</Button>

                    {/* <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "0px", height: "2.6rem", backgroundColor: '#ffffff', color: '#000000' }} onClick={resetForm}>Leave Request</Button> */}
                  </Box>
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Box>

                  <Box
                    component="form"
                    sx={{ border: 'none', marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 260, height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                  >

                    <TextField
                      required
                      id="srv_id"
                      name="srv_id"
                      select
                      label="Select Service"
                      value={selectedService}
                      onChange={(e) => {
                        setSelectedService(e.target.value)
                        console.log(e.target.value, 'setSelectedService');
                      }}
                      size="small"
                      fullWidth
                      // error={!!errors.selectedService}
                      // helperText={errors.selectedService}
                      sx={{
                        textAlign: "center", '& input': {
                          fontSize: '14px',
                        }, '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            border: 'none',
                          },
                        },
                      }}
                      // sx={{
                      //   textAlign: "left", '& input': {
                      //     fontSize: '14px',border:'none',
                      //   },
                      // }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            style: {
                              maxHeight: '200px', // Adjust the height as needed
                              maxWidth: '200px',
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem sx={{ fontSize: "14px", }}>
                        select service
                      </MenuItem>
                      {services.map((option) => (
                        <MenuItem key={option.srv_id} value={option.service_title}
                          sx={{ fontSize: "14px", }}>
                          {option.service_title}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Box
                    component="form"
                    sx={{ border: 'none', marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 260, height: '2.2rem', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)" }}
                  >
                    <Button variant="outlined" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: '#69A5EB', color: '#FFFFFF' }} onClick={resetForm}>Reset Form</Button>
                  </Box>

                </Stack >
              </Box>
            </Box>
          </TabContext>
        </Box>



        {/* 
        <div>
        <h3>Selected Dates:</h3>
        <ul>
          {selectedDates.map((date, index) => (
            <li key={index}>{date.toString()}</li>
          ))}
        </ul>
      </div> */}

        {tabIndex === 1 && <>
          <TableContainer sx={{ height: "63vh", marginTop: '-.5rem', width: '99%', marginLeft: '8px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <AttendenceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Sr. No</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Name</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Mobile No</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Services</Typography>
                    </CardContent>
                    {/* <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Job Type</Typography>
                    </CardContent> */}
                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Status</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Type</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Remark</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Date</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="subtitle2">Action</Typography>
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
                  {filteredProfessionals.length === 0 ? (
                    <TableRow>
                      <CardContent colSpan={10} >
                        <Typography variant="body2">
                          No Data Available
                        </Typography>
                      </CardContent>
                    </TableRow>
                  ) : (
                    filteredProfessionals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <TableRow
                          key={row.eve_id}
                          value={row.eve_id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <AttendenceCard sx={{py:1}}>
                            <CardContent style={{ flex: 0.5, textAlign: 'center' }}>
                              <Typography variant="body2">
                                {index + 1 + page * rowsPerPage}
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 2, width: '70px' }}>
                              <Typography variant="body2">
                                {row.prof_fullname}
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1, textAlign: 'center' }}>
                              <Typography variant="body2">
                                {row.phone_no}
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1, textAlign: 'center', width: '30px' }}>
                              <Typography variant="body2">
                                {row.srv_name}
                              </Typography>
                            </CardContent>
                            {/* <CardContent style={{ flex: 1, textAlign: 'center' }}>
                              <Typography variant="body2">
                                {row.job_type === 2 ? 'fulltime' : (row.job_type === 1 ? 'oncall' : '-')}
                              </Typography>
                            </CardContent> */}
                            <CardContent style={{ flex: 1.5, textAlign: 'center' }}>
                              <Typography>
                                <TextField
                                  required
                                  id="srv_id"
                                  name="attnd_status"
                                  select
                                  label="Select Status"
                                  // value={formData[row.eve_id]?.attnd_status || ''}
                                  // value={selectedService}
                                  onChange={handleChange}
                                  size="small"
                                  // fullWidth
                                  // error={!!errors.selectedService}
                                  // helperText={errors.selectedService}
                                  sx={{
                                    textAlign: "center",
                                    width: "130px",
                                    fontSize: '8px',
                                    // whiteSpace: 'nowrap',
                                    // overflow-X: 'scroll',
                                    textOverflow: 'ellipsis',
                                    margin: 0
                                  }}
                                  SelectProps={{
                                    MenuProps: {
                                      PaperProps: {
                                        style: {
                                          maxHeight: '250px', // Adjust the height as needed
                                          maxWidth: '300px',
                                        },
                                      },
                                    },
                                  }}
                                >
                                  {leaveOptions.map((option, index) => (
                                    <MenuItem key={index} value={option}
                                      sx={{ fontSize: "14px", }}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1.5, textAlign: 'center' }}>
                              <Typography variant="body2">
                                <TextField
                                  required
                                  id="srv_id"
                                  name="attnd_type"
                                  select
                                  label="Select Service"
                                  // value={selectedService}
                                  onChange={handleChange}
                                  size="small"
                                  // fullWidth
                                  // error={!!errors.selectedService}
                                  // helperText={errors.selectedService}
                                  sx={{
                                    textAlign: "center",
                                    width: "130px",
                                    fontSize: '8px',
                                    // whiteSpace: 'nowrap',
                                    // overflow-X: 'scroll',
                                    textOverflow: 'ellipsis',
                                    margin: 0
                                  }}
                                  SelectProps={{
                                    MenuProps: {
                                      PaperProps: {
                                        style: {
                                          maxHeight: '250px', // Adjust the height as needed
                                          maxWidth: '300px',
                                        },
                                      },
                                    },
                                  }}
                                >
                                  {(formData.attnd_status === 'Present' ||
                                    formData.attnd_status === 'First Half' ||
                                    formData.attnd_status === 'Second Half') && serviceOptions.map((option, index) => (
                                      <MenuItem key={index} value={option}
                                        sx={{ fontSize: "14px", }}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                </TextField>
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1.5, textAlign: 'center' }}>
                              <Typography variant="body2">
                                <TextField
                                  id="remark"
                                  name="attnd_Note"
                                  label="Remark"
                                  multiline
                                  maxRows={1}
                                  placeholder='remark'
                                  size="small"
                                  // fullWidth
                                  // value={remark}
                                  onChange={handleChange}
                                  sx={{
                                    textAlign: "center",
                                    width: '100%'
                                    , '& input': {
                                      fontSize: '14px',
                                    },
                                    // margin: 4
                                  }}
                                  SelectProps={{
                                    MenuProps: {
                                      PaperProps: {
                                        style: {
                                          maxHeight: '100px', // Adjust the height as needed
                                          maxWidth: '150px',
                                        },
                                      },
                                    },
                                  }}
                                />
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1.5, textAlign: 'center' }}>
                              <Typography variant="body2">
                                <DatePicker
                                  style={{ width: '95%', height: '2rem' }}
                                  id={row.eve_id}
                                  value={selectedDates[index]}
                                  onChange={(dates) => handleDateChange(dates, row.eve_id, row)}
                                  placeholder='select Date'
                                />
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1, textAlign: 'center' }}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <RemoveRedEyeOutlinedIcon sx={{ fontSize: "20px", mt: 2 }} onClick={() => handleOpenCaller(row.srv_prof_id)} />
                                <CheckIcon sx={{ fontSize: "20px", mt: 2, border:'1px solid #6AA5EB',color:'#6AA5EB',px:1, py:.2,ml:1 }} onClick={() => saveChanges(row)} />

                                {/* <Button type='button' variant="outlined" sx={{ fontSize: "10px", mt: 1, ml: 1 }} onClick={() => saveChanges(row)}><CheckIcon/></Button> */}
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
              sx={{ marginBottom: '30px' }}
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={filteredProfessionals.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>

          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={filteredProfessionals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </>}

        {tabIndex === 2 && <>
          <TableContainer sx={{ height: "63vh" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <AttendenceCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                    <CardContent style={{ flex: 0.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Sr. No</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Emp Name</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Mobile No</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Leave Type</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Job Type</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Session</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF", textAlign: 'center' }}>
                      <Typography variant="subtitle2">Date</Typography>
                    </CardContent>
                    <CardContent style={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="subtitle2">Action</Typography>
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
                  {filteredProfessionals.length === 0 ? (
                    <TableRow>
                      <CardContent colSpan={10} >
                        <Typography variant="body2">
                          No Data Available
                        </Typography>
                      </CardContent>
                    </TableRow>
                  ) : (
                    filteredProfessionals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <TableRow
                          key={row.eve_id}
                          value={row.eve_id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <AttendenceCard>
                            <CardContent style={{ flex: 0.5, textAlign: 'center' }}>
                              <Typography variant="body2">
                                {index + 1 + page * rowsPerPage}
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1 }}>
                              <Typography variant="body2">
                                {row.prof_fullname}
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1, textAlign: 'center' }}>
                              <Typography variant="body2">
                                {row.phone_no}
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1, textAlign: 'center' }}>
                              <Typography variant="body2">
                                Sick Leave
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1, textAlign: 'center' }}>
                              <Typography variant="body2">
                                Full Time
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1.5, textAlign: 'center' }}>
                              <Typography>
                                Physiotherapy
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1.5, textAlign: 'center' }}>
                              <Typography variant="body2">
                                23-05-2024
                              </Typography>
                            </CardContent>
                            <CardContent style={{ flex: 1, textAlign: 'center' }}>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginLeft: '30px' }}>
                                <Tooltip title="Request Approve"><ThumbUpOffAltIcon sx={{ fontSize: "30px", mt: 1 }} onClick={handleOpenLeave} /></Tooltip>
                                {/* <Tooltip title="Request Reject"> <ThumbDownOffAltIcon sx={{ fontSize: "30px", mt: 1, ml: 1 }} onClick={handleOpenCaller} /></Tooltip> */}
                                {/* <Button type='button' variant="outlined" sx={{ fontSize: "12px", mt: 1, ml: 1 }} onClick={() => saveChanges(row)}>Save</Button> */}
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
              sx={{ marginBottom: '30px' }}
              rowsPerPageOptions={[5, 10, 25, 100]}
              component="div"
              count={filteredProfessionals.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>



          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={filteredProfessionals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </>}

        <Grid container spacing={1}>

          <Grid item xs={12}>
            <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>

              <Modal
                open={openCaller}
                onClose={handleCloseCaller}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={{ ...style, width: 1000, borderRadius: "10px" }}>

                  <AppBar position="static" style={{
                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                    width: '66.5rem',
                    height: '3rem',
                    marginTop: '-16px',
                    marginBottom: '1rem',
                    marginLeft: "-32px",
                    borderRadius: "8px 10px 0 0",
                  }}>
                    <div style={{ display: "flex" }}>
                      <Typography align="left" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px" }}>Professional Attendance</Typography>
                      <Button onClick={handleCloseCaller} sx={{ marginLeft: "50rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                    </div>
                  </AppBar>
                  <ProfViewAtte events={events} handleCloseCaller={handleCloseCaller}/>
                  {/* <CallerView caller={caller} clrID={callerID} onClose={handleCloseCaller} /> */}
                </Box>
              </Modal>
            </Card>
          </Grid>
        </Grid>

        {/* //Leave modal */}
        <Grid container spacing={1}>

          <Grid item xs={12}>
            <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>

              <Modal
                open={openLeave}
                onClose={handleCloseLeave}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={{ ...style, width: 565, borderRadius: "10px" }}>

                  <AppBar position="static" style={{
                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                    width: '39.4rem',
                    height: '3rem',
                    marginTop: '-16px',
                    marginBottom: '1rem',
                    marginLeft: "-32px",
                    borderRadius: "8px 10px 0 0",
                    lineHeight: 'auto'
                  }}>
                    <div style={{ display: "flex" }}>
                      <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px", width: '300px' }}>Attendance Update</Typography>
                      <Button onClick={handleCloseLeave} sx={{ marginLeft: "27.5rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                    </div>
                  </AppBar>
                  <Typography align="left" style={{ fontSize: "16px", color: "#000", marginTop: "10px" }}><b>Services/Session: </b></Typography>
                  <Typography align="left" style={{ fontSize: "16px", color: "#000", marginTop: "10px" }}>1. Service for 24 hr. </Typography>
                  <Typography align="left" style={{ fontSize: "16px", color: "#000", marginTop: "10px", marginBottom: '10px' }}>2. Service for 24 hr. </Typography>

                  <TextField
                    id="remark"
                    name="sdfg"
                    label="Write Remark Here"
                    multiline
                    maxRows={1}
                    placeholder='remark'
                    size="small"
                    // fullWidth
                    // value={remark}
                    onChange={handleChange}
                    sx={{
                      textAlign: "center",
                      width: '100%'
                      , '& input': {
                        fontSize: '14px',
                      },
                      // margin: 4
                    }}
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          style: {
                            maxHeight: '100px', // Adjust the height as needed
                            maxWidth: '150px',
                          },
                        },
                      },
                    }}
                  />
                  <div style={{ display: "flex", marginTop: "20px", alignItems: "end", marginLeft: '24rem' }}>
                    <Button variant="contained" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: '#69A5EB', color: '#FFFFFF', }} onClick={() => setTabIndex(1)}>Accept</Button>
                    <Button variant="contained" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: '#69A5EB', color: '#FFFFFF' }} onClick={() => setTabIndex(1)}>Reject</Button>
                  </div>
                </Box>
              </Modal>
            </Card>
          </Grid>
        </Grid>

        {/* on save based session modal */}

        <Grid container spacing={1}>

          <Grid item xs={12}>
            <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>

              <Modal
                open={openSession}
                onClose={handleCloseSession}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={{ ...style, width: 1165, borderRadius: "10px" }}>

                  <AppBar position="static" style={{
                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                    width: '76.9rem',
                    height: '3rem',
                    marginTop: '-16px',
                    marginBottom: '1rem',
                    marginLeft: "-32px",
                    borderRadius: "8px 10px 0 0",
                    lineHeight: 'auto'
                  }}>
                    <div style={{ display: "flex" }}>
                      <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px", width: '300px' }}>Leave Request</Typography>
                      <Button onClick={handleCloseSession} sx={{ marginLeft: "56.5rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                    </div>
                  </AppBar>
                  {/* <Typography align="left" style={{ fontSize: "16px", color: "#000", marginTop: "10px" }}><b>Services/Session: </b></Typography>
                  {session.map((session, index) => (
                    <Typography
                      key={index}
                      align="left"
                      style={{ fontSize: "16px", color: "#000", marginTop: "10px" }}
                    >
                      {index + 1 + ".  "}{session.service}
                    </Typography>
                  ))} */}

                  <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                        },
                      }}
                      pageSizeOptions={[5, 10]}
                      checkboxSelection
                      onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
                    // onSelectionModelChange={handleSelectionChange}
                    />
                  </div>
                  <div style={{ display: "flex", marginTop: "20px", alignItems: "end", marginLeft: '48rem' }}>
                    <Button
                      variant="contained"
                      style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: '#69A5EB', color: '#FFFFFF', width: '200px' }}
                      onClick={handleAcceptDeallocate}>
                      Accept & Deallocate
                    </Button>
                    <Button
                      variant="contained"
                      style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: '#69A5EB', color: '#FFFFFF' }}
                      onClick={handleRejectSession}
                    >
                      Reject
                    </Button>
                  </div>
                </Box>
              </Modal>
            </Card>
          </Grid>
        </Grid>


        {/* on first half second half modal */}

        <Grid container spacing={1}>

          <Grid item xs={12}>
            <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>

              <Modal
                open={openHalfSecond}
                onClose={handleCloseHalfSecond}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={{ ...style, width: 465, borderRadius: "10px" }}>

                  <AppBar position="static" style={{
                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                    width: '33.1rem',
                    height: '3rem',
                    marginTop: '-16px',
                    marginBottom: '1rem',
                    marginLeft: "-32px",
                    borderRadius: "8px 10px 0 0",
                    lineHeight: 'auto'
                  }}>
                    <div style={{ display: "flex" }}>
                      <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "0px", width: '300px' }}>Select Timeslot</Typography>
                      <Button onClick={handleCloseHalfSecond} sx={{ marginLeft: "17.5rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                    </div>
                  </AppBar>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={2} >
                          <label style={{ marginBottom: '-10px' }}>Start Time</label>
                          <SmallTimePicker
                            value={dayjs(time, 'HH:mm:ss')}
                            onChange={(newValue) => handleChangeTime('from_avail', newValue)}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={2} >
                          <label style={{ marginBottom: '-10px' }}>End Time</label>
                          <SmallTimePicker
                            value={dayjs(time, 'HH:mm:ss')}
                            onChange={(newValue) => handleChangeTime('to_avail', newValue)}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                  <div style={{ display: "flex", marginTop: "20px", alignItems: "end", marginLeft: '11rem' }}>
                    <Button
                      variant="contained"
                      style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: '#69A5EB', color: '#FFFFFF', width: '70px' }}
                      onClick={handleCloseHalfSecond}>
                      ok
                    </Button>
                  </div>
                </Box>
              </Modal>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  )
}

export default ManageAttendance;