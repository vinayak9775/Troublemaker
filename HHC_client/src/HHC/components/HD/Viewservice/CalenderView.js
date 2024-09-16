import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./CalenderView.css";

const localizer = momentLocalizer(moment);

const CalenderView = ({ events }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [timeFromat, setTimeFromat] = useState([]);
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
                views={views}
            />
        </div>
    )
}

export default CalenderView
