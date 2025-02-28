import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import EventModal from "./EventModal";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./Calender.css";

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ events }) => {
  const port = process.env.REACT_APP_API_KEY;
  const accessToken = localStorage.getItem('token');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [timeFromat, setTimeFromat] = useState([]);
  const [profID, setProfID] = useState(null);
  const [selectedPOCID, setSelectedPOCID] = useState(null);

  console.log("Individual Professional all Events: ", events)

  useEffect(() => {
    if (events.length > 0 && !events.some(event => event['not found'] === "Record not found")) {
      const extractedEvents = events.map(event => {
        const startTimeFormat = moment(event.start_time, 'HH:mm:ss').format('hh:mm A');
        const endTimeFormat = moment(event.end_time, 'HH:mm:ss').format('hh:mm A');

        return {
          ...event,
          title: `(${startTimeFormat} - ${endTimeFormat})`,
          start_date: moment(event.actual_StartDate_Time).set({
            hour: moment(event.start_time, "HH:mm:ss").hour(),
            minute: moment(event.start_time, "HH:mm:ss").minute(),
          }).toDate(),
          end_date: moment(event.actual_EndDate_Time).set({
            hour: moment(event.end_time, "HH:mm:ss").hour(),
            minute: moment(event.end_time, "HH:mm:ss").minute(),
          }).toDate(),
        };
      });
      setTimeFromat(extractedEvents);
    } else {
      setTimeFromat([]);
    }
  }, [events]);

  // const getProfessionalSingleEvent = async () => {
  //   if (selectedPOCID) {
  //     try {
  //       // const res = await fetch(`${port}/web/agg_hhc_detailed_event_plan_of_care_each_event/?poc=${selectedPOCID}`);
  //       const res = await fetch(`${port}/web/agg_hhc_detailed_event_plan_of_care_each_event/?poc=${selectedPOCID}`, {
  //         headers: {
  //           'Authorization': `Bearer ${accessToken}`,
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       const data = await res.json();
  //       console.log("Professional Against single Event", data);
  //       setSelectedEvent(data)
  //     } catch (error) {
  //       console.error("Error fetching Professional Against single Event:", error);
  //     }
  //   }
  //   else {
  //     setSelectedEvent([]);
  //   }
  // };

  const getProfessionalSingleEvent = async (pocId) => {
    try {
      const res = await fetch(`${port}/web/agg_hhc_detailed_event_plan_of_care_each_event/?poc=${pocId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log("Professional Against Single Event", data);
      setSelectedEvent(data);
    } catch (error) {
      console.error("Error fetching Professional Against Single Event:", error);
    }
  };

  useEffect(() => {
    getProfessionalSingleEvent();
  }, [selectedPOCID]);

  const handleEventModalOpen = (slotInfo) => {
    setSelectedEvent(null);
    setProfID(slotInfo.profID);
    setIsEventModalOpen(true);
  };

  const handleEventModalClose = () => {
    setIsEventModalOpen(false);
    setIsEditingEvent(false);
  };

  // const handleEventEdit = (event) => {
  //   // setSelectedEvent(event);
  //   // setIsEditingEvent(true);
  //   // setIsEventModalOpen(true);
  //   console.log('Extracted POC ID', event);
  //   if (event && event.agg_sp_dt_eve_poc_id) {
  //     const { agg_sp_dt_eve_poc_id } = event;
  //     setSelectedPOCID(agg_sp_dt_eve_poc_id);
  //     console.log('Clicked POC ID:', agg_sp_dt_eve_poc_id);
  //     setSelectedEvent(event);
  //     setIsEditingEvent(true);
  //     setIsEventModalOpen(true);
  //   }
  // };

  const handleEventEdit = (event) => {
    if (event && event.agg_sp_dt_eve_poc_id) {
      const { agg_sp_dt_eve_poc_id } = event;
      console.log('Clicked POC ID:', agg_sp_dt_eve_poc_id);
      getProfessionalSingleEvent(agg_sp_dt_eve_poc_id);
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
        events={timeFromat}
        startAccessor="start_date"
        endAccessor="end_date"
        selectable
        onSelectEvent={handleEventEdit} 
        onSelectSlot={handleEventModalOpen}
        views={views}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleEventModalClose}
        profEvent={selectedEvent}
      />
    </div>
  )
}

export default CalendarComponent
