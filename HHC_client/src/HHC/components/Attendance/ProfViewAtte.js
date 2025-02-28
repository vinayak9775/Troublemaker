import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Box, Typography, Button, Grid, Card, TextField } from '@mui/material';

import AppBar from '@mui/material/AppBar';
import CloseIcon from '@mui/icons-material/Close';

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

const ProfViewAtte = ({ events }) => {
  const localizer = momentLocalizer(moment);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const openModal = (date) => {
    setSelectedDate(date);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDate(null);
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
        {event.approve_status === 2 && (
          <div style={{ color: 'red',backgroundColor:'yellow', marginTop: '5px' }}>
            Approval pending
          </div>
        )}
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
                    <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "18px", width: '300px' }}>Leave Request</Typography>
                    <Button onClick={closeModal} sx={{ marginLeft: "27.5rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                  </div>
                </AppBar>
                <Typography align="left" style={{ fontSize: "16px", color: "#000", marginTop: "10px" }}><b>Services/Session: </b></Typography>
                <Typography align="left" style={{ fontSize: "16px", color: "#000", marginTop: "10px" }}><b>  {selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : ''} </b></Typography>
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
                  // onChange={handleChange}
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
                  <Button variant="contained" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: '#69A5EB', color: '#FFFFFF', }} >Accept</Button>
                  <Button variant="contained" style={{ textTransform: "capitalize", borderRadius: "8px", marginLeft: "20px", height: "2.6rem", backgroundColor: '#69A5EB', color: '#FFFFFF' }} >Reject</Button>
                </div>
              </Box>
            </Modal>
            {/* <Modal
                            open={modalIsOpen}
                            onClose={closeModal}
                            aria-labelledby="modal-title"
                            aria-describedby="modal-description"
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    p: 4,
                                }}
                            >
                                <Typography id="modal-title" variant="h6" component="h2">
                                    Selected Date
                                </Typography>
                                <Typography id="modal-description" sx={{ mt: 2 }}>
                                    {selectedDate ? selectedDate.toString() : ''}
                                </Typography>
                                <Button onClick={closeModal} sx={{ mt: 2 }} variant="contained">
                                    Close
                                </Button>
                            </Box>
                        </Modal> */}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfViewAtte;
