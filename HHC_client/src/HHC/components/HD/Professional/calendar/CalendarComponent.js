import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventModal from "./EventModal";
import EventDetailsModal from "./EventDetailsModal";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./Calender.css";
import Tooltip from "@mui/material/Tooltip";

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ events }) => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');

  const [newEvents, setNewEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [timeFromat, setTimeFromat] = useState([]);
  const [profID, setProfID] = useState(null);
  const [selectedPOCID, setSelectedPOCID] = useState(null);

  console.log("Individual Professional all Events: ", events)

  useEffect(() => {
    if (events.length > 0 && !events.some(event => event['not found'] === "Record not found")) {
      const extractedEvents = events.map(event => {
        const startDateTime = moment(event.actual_StartDate_Time);
        const endDateTime = moment(event.actual_EndDate_Time);

        const start12HourFormat = startDateTime.format('hh:mm A');
        const end12HourFormat = endDateTime.format('hh:mm A');

        const startTimeFormat = moment(event.start_time, 'HH:mm:ss').format('hh:mm A');
        const endTimeFormat = moment(event.end_time, 'HH:mm:ss').format('hh:mm A');

        // const { agg_sp_dt_eve_poc_id } = event;

        return {
          ...event,
          title: `${startTimeFormat} - ${endTimeFormat}`,
          start_date: startDateTime.toDate(),
          end_date: endDateTime.toDate(),
        };
      });
      setTimeFromat(extractedEvents);
    } else {
      setTimeFromat([]);
    }
  }, [events]);

  useEffect(() => {
    const getProfessionalSingleEvent = async () => {
      if (selectedPOCID) {
        try {
          // const res = await fetch(`${port}/web/agg_hhc_detailed_event_plan_of_care_each_event/?poc=${selectedPOCID}`);
          const res = await fetch(`${port}/web/agg_hhc_detailed_event_plan_of_care_each_event/?poc=${selectedPOCID}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await res.json();
          console.log("Professional Against single Event", data);
          setSelectedEvent(data)
        } catch (error) {
          console.error("Error fetching Professional Against single Event:", error);
        }
      }
      else {
        setSelectedEvent([]);
      }
    };
    getProfessionalSingleEvent();
  }, [selectedPOCID]);


  // useEffect(() => {
  //   fetchEvents();
  // }, []);

  // const fetchEvents = async () => {
  //   try {
  //     const response = await fetch("/api/events");
  //     setNewEvents(response.data);
  //   } catch (error) {
  //     console.error("Error fetching events:", error);
  //   }
  // };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsModalOpen(true);
  };

  const handleEventModalOpen = (slotInfo) => {
    setSelectedEvent(null);
    setProfID(slotInfo.profID);
    setIsEventModalOpen(true);
  };

  const handleEventModalClose = () => {
    setIsEventModalOpen(false);
    setIsEditingEvent(false);
    // fetchEvents(); // Refresh the events after any CRUD operation
  };

  const handleEventDetailsModalClose = () => {
    setIsEventDetailsModalOpen(false);
  };

  const handleEventEdit = (event) => {
    // setSelectedEvent(event);
    // setIsEditingEvent(true);
    // setIsEventModalOpen(true);
    console.log('Extracted POC ID', event);
    if (event && event.agg_sp_dt_eve_poc_id) {
      const { agg_sp_dt_eve_poc_id } = event;
      setSelectedPOCID(agg_sp_dt_eve_poc_id);
      console.log('Clicked POC ID:', agg_sp_dt_eve_poc_id);
      setSelectedEvent(event);
      setIsEditingEvent(true);
      setIsEventModalOpen(true);
    }
  };

  const views = {
    month: true,
    week: true,
    day: true,
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        // events={events.map((event, index) => ({
        //   ...event,
        //   title: `${startTime[index]} - ${endTime[index]}`,
        // }))}
        events={timeFromat}
        startAccessor="start_date"
        endAccessor="end_date"
        selectable
        onSelectEvent={handleEventEdit} // Open modal for editing
        onSelectSlot={handleEventModalOpen} // Open modal for creating
        views={views}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleEventModalClose}
        // fetchEvents={fetchEvents}
        // profEvent={profID}
        // onClose={() => setIsEventModalOpen(false)} // Function to close the modal
        profEvent={selectedEvent}
      />
      {/* <EventDetailsModal
        event={selectedEvent}
        isOpen={isEventDetailsModalOpen}
        onClose={handleEventDetailsModalClose}
        fetchEvents={fetchEvents}
      /> */}
    </div>
  )
}

export default CalendarComponent
