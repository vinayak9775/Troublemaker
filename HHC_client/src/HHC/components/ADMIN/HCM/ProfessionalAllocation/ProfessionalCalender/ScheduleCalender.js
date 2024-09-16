import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../ProfessionalCalender/ScheduleCalender.css";

const localizer = momentLocalizer(moment);

const events = [
    {
        id: 1,
        title: "Meeting",
        start: new Date(2024, 5, 19, 10, 0),
        end: new Date(2024, 5, 19, 12, 0),
    },
    {
        id: 2,
        title: "Lunch",
        start: new Date(2024, 5, 20, 12, 0),
        end: new Date(2024, 5, 20, 13, 0),
    },
    {
        id: 3,
        title: "Conference Call",
        start: new Date(2024, 5, 21, 12.17, 0),
        end: new Date(2024, 5, 21, 15, 30),
    },
];

const ScheduleCalendar = () => {
    const [showCheckbox, setShowCheckbox] = useState(false);

    const sortedEvents = [...events].sort((a, b) => a.start - b.start);

    const earliestEventTime = moment(sortedEvents[0].start).startOf("min");
    const latestEventTime = moment(sortedEvents[sortedEvents.length - 1].end).endOf("min");

    // Custom event renderer
    const eventRenderer = ({ event }) => {
        return (
            <div>
                <strong>{event.title}</strong>
            </div>
        );
    };

    return (
        <div>
            {/* Checkbox component */}
            <div style={{ marginBottom: "10px", textAlign: "left" }}>
                <div className="row">
                    <div className="col-md-12">
                        <input
                            type="checkbox"
                            checked={showCheckbox}
                            onChange={() => setShowCheckbox(!showCheckbox)}
                            style={{ marginBottom: "10px", textAlign: "left" }}
                        />
                        select
                    </div>
                </div>
            </div>

            {/* Calendar component */}
            <div
                style={{
                    height: 500,
                    width: 580,
                    marginTop: "20px",
                    borderRadius: "1em",
                }}
            >
                <Calendar
                    localizer={localizer}
                    events={sortedEvents}
                    views={{ week: true }}
                    defaultView={Views.WEEK}
                    startAccessor="start"
                    endAccessor="end"
                    toolbar={false}
                    style={{ minHeight: 500 }}
                    timeslots={1} // Display each hour in one slot
                    step={60} // Each slot represents 1 hour
                    min={earliestEventTime.toDate()}
                    max={latestEventTime.toDate()}
                    components={{
                        event: eventRenderer,
                    }}
                />
            </div>
        </div>
    );
};

export default ScheduleCalendar;
