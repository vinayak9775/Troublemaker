import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Box, Typography, Button, Grid, Card, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

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

const ProfViewAtte = ({ events, handleCloseCaller }) => {
  const localizer = momentLocalizer(moment);
  const port = process.env.REACT_APP_API_KEY;
  console.log(events,'lllllllllll');
  

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [remark, setRemark] = useState('');

  const openModal = (date) => {
    setSelectedDate(date);
    setModalIsOpen(true);
  };

  const openCancelModal = (event) => {
    setSelectedEvent(event);
    setCancelModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDate(null);
  };

  const closeCancelModal = () => {
    setCancelModalIsOpen(false);
    setSelectedEvent(null);
  };

  // const handleCancelAttendance = () => {
  //   // Handle the cancellation logic here
  //   console.log('Cancelled event:', selectedEvent, 'with remark:', remark);
  //   closeCancelModal();
  // };

  const handleCancelAttendance = async () => {
    const apiUrl = `${port}/web/update_attendance/${selectedEvent.id}/`;
    const requestData = {
      status: 2,
      cancel_reason: remark
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Cancellation successful:', data);
        Swal.fire({
          title: 'Success!',
          text: 'Cancel Attendance Successfully!',
          icon: 'success'
        });
        // Optionally update the event state or refetch events to reflect the change
      } else {
        console.error('Cancellation failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error cancelling attendance:', error);
    } finally {
      closeCancelModal();
      handleCloseCaller();
    }
  };
  // Custom event rendering function
  const eventStyleGetter = (event, start, end, isSelected) => {
    let style = {
      backgroundColor: '',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      width: '100%',
    };

    switch (event.status) {
      case 'present':
        style.backgroundColor = '#4caf50'; // Green for present
        break;
      case 'absent':
        style.backgroundColor = '#f44336'; // Red for absent
        break;
      case 'leave':
        style.backgroundColor = '#2196f3'; // Blue for leave
        break;
      default:
        break;
    }

    return {
      className: '',
      style: style,
    };
  };

  // Custom event rendering function to handle approval status
  const eventComponent = ({ event }) => {
    return (
      <div>
        {event.title}
        {(event.title === 'Absent' || event.title === 'Comp Off' || event.title === 'First Half' || event.title === 'Second Half' || event.title === 'Privilege Leave (PL)' || event.title === 'Casual Leave (CL)') && (
        <p onClick={() => openCancelModal(event)} style={{ marginTop: '5px', backgroundColor: '#FFf', color: 'red', borderRadius:'5px' }}>
          Cancel Attendance
        </p>)}
        {event.approve_status === 2 && (
          <div style={{ color: 'black', backgroundColor: '#fff', marginTop: '-10px', borderRadius:'5px' }}>
            Approval pending
          </div>
        )}
        {/* <p onClick={() => openCancelModal(event)} style={{ marginTop: '5px', backgroundColor: 'yellow', color: '#000' }}>
          Cancel Attendance
        </p> */}
      </div>
    );
  };

  const handleSelectSlot = (slotInfo) => {
    const today = new Date();
    if (slotInfo.start <= today) {
      openModal(slotInfo.start);
    }
  };

  const today = new Date();
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter} // Apply custom event styles
        components={{ event: eventComponent }} // Custom event component
        style={{ height: 500 }}
        selectable
        // onSelectSlot={handleSelectSlot}
        max={today}
      />

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
            <Modal
              open={modalIsOpen}
              onClose={closeModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{ ...style, width: 565, borderRadius: '10px' }}>
                <AppBar position="static" style={{
                  background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                  width: '39.4rem',
                  height: '3rem',
                  marginTop: '-16px',
                  marginBottom: '1rem',
                  marginLeft: '-32px',
                  borderRadius: '8px 10px 0 0',
                  lineHeight: 'auto'
                }}>
                  <div style={{ display: 'flex' }}>
                    <Typography align="center" style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginTop: '10px', marginLeft: '18px', width: '300px' }}>Leave Request</Typography>
                    <Button onClick={closeModal} sx={{ marginLeft: '27.5rem', color: '#FFFFFF', marginTop: '2px' }}><CloseIcon /></Button>
                  </div>
                </AppBar>
                <Typography align="left" style={{ fontSize: '16px', color: '#000', marginTop: '10px' }}><b>Services/Session: </b></Typography>
                <Typography align="left" style={{ fontSize: '16px', color: '#000', marginTop: '10px' }}><b>{selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : ''}</b></Typography>
                <Typography align="left" style={{ fontSize: '16px', color: '#000', marginTop: '10px' }}>1. Service for 24 hr.</Typography>
                <Typography align="left" style={{ fontSize: '16px', color: '#000', marginTop: '10px', marginBottom: '10px' }}>2. Service for 24 hr.</Typography>

                <TextField
                  id="remark"
                  label="Write Remark Here"
                  multiline
                  maxRows={1}
                  placeholder='remark'
                  size="small"
                  sx={{
                    textAlign: 'center',
                    width: '100%',
                    '& input': {
                      fontSize: '14px',
                    },
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: '100px',
                          maxWidth: '150px',
                        },
                      },
                    },
                  }}
                />
                <div style={{ display: 'flex', marginTop: '20px', alignItems: 'end', marginLeft: '24rem' }}>
                  <Button variant="contained" style={{ textTransform: 'capitalize', borderRadius: '8px', marginLeft: '20px', height: '2.6rem', backgroundColor: '#69A5EB', color: '#FFFFFF' }} >Accept</Button>
                  <Button variant="contained" style={{ textTransform: 'capitalize', borderRadius: '8px', marginLeft: '20px', height: '2.6rem', backgroundColor: '#69A5EB', color: '#FFFFFF' }} >Reject</Button>
                </div>
              </Box>
            </Modal>

            <Modal
              open={cancelModalIsOpen}
              onClose={closeCancelModal}
              aria-labelledby="cancel-modal-title"
              aria-describedby="cancel-modal-description"
            >
              <Box sx={{ ...style, width: 565, borderRadius: '10px' }}>
                <AppBar position="static" style={{
                  background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                  width: '39.4rem',
                  height: '3rem',
                  marginTop: '-16px',
                  marginBottom: '1rem',
                  marginLeft: '-32px',
                  borderRadius: '8px 10px 0 0',
                  lineHeight: 'auto'
                }}>
                  <div style={{ display: 'flex' }}>
                    <Typography align="center" style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginTop: '10px', marginLeft: '18px', width: '200px' }}>Cancel Attendance</Typography>
                    <Button onClick={closeCancelModal} sx={{ marginLeft: '23.5rem', color: '#FFFFFF', marginTop: '2px' }}><CloseIcon /></Button>
                  </div>
                </AppBar>
                <Typography align="left" style={{ fontSize: '16px', color: '#000', marginTop: '10px' }}><b>Current Status: </b>{selectedEvent ? selectedEvent.title : ''}</Typography>
                <TextField
                  id="remark"
                  label="Write Remark Here"
                  multiline
                  maxRows={4}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder='remark'
                  size="small"
                  sx={{
                    textAlign: 'center',
                    width: '100%',
                    '& input': {
                      fontSize: '14px',
                    },
                    mt:2
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: '100px',
                          maxWidth: '150px',
                        },
                      },
                    },
                  }}
                />
                <div style={{ display: 'flex', marginTop: '20px', alignItems: 'end', marginLeft: '24rem' }}>
                  <Button variant="contained" style={{ textTransform: 'capitalize', borderRadius: '8px', marginLeft: '20px', height: '2.6rem', backgroundColor: '#6AA5EB', color: '#FFFFFF' }} onClick={handleCancelAttendance}>Cancel Attendance</Button>
                </div>
              </Box>
            </Modal>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfViewAtte;
