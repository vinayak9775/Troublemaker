import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
import AllocatedProfessional from '../AllocatedProfessional';
import AddAllocation from '../AddAllocation';

const DemoCalendar = ({ deleteClicked, profIdd }) => {

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [editMode, setEditMode] = useState(false);

    const handleEditClick = () => {
        setEditMode(!editMode); // Toggle edit mode
    };

    // Array of weekday names for the calendar
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const [data, setData] = useState([]);

    const [openAddProfessional, setOpenAddProfessional] = useState(false);

    // Fetch data corresponding to each weekday based on profIdd
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${port}/web/pro_aval/?pro=${profIdd}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();
                setData(result);
                console.log(result, 'resultresult............');
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [profIdd, accessToken, port]);

    // List of colors for events
    const colors = ['#F29D38', '#9370DB', '#FF69B4', '#5DC6E7', '#FF4500', '#6A5ACD', '#20B2AA'];

    // State to manage checked state for each day
    const [checkedDays, setCheckedDays] = useState(Array(7).fill(true)); // Default all days to checked

    // State to track which day and event is clicked
    const [clickedDay, setClickedDay] = useState(null);
    const [clickedEvent, setClickedEvent] = useState(null);

    ////// clicked checbox for delet 
    const [selectedIds, setSelectedIds] = useState([]);

    console.log(selectedIds, 'selectedIdsselectedIds..........')

    // Function to toggle checked state for a specific day
    const handleCheckboxChange = (dayIndex, eventIndex) => {
        const id = data[dayIndex].Res_Data[eventIndex].prof_avaib_dt_id;
        setSelectedIds(prevSelectedIds =>
            prevSelectedIds.includes(id)
                ? prevSelectedIds.filter(item => item !== id)
                : [...prevSelectedIds, id]
        );
    };

    // Function to handle clicking on a day
    const handleDayClick = (index) => {
        if (clickedDay === index) {
            setClickedDay(null); // Toggle off if already clicked
        } else {
            setClickedDay(index); // Set clicked day index
            setClickedEvent(null); // Reset clicked event when a new day is clicked
        }
    };

    // Function to handle clicking on event details checkbox
    const handleEventClick = (dayIndex, eventIndex) => {
        if (clickedEvent === eventIndex) {
            setClickedEvent(null); // Toggle off if already clicked
        } else {
            setClickedEvent(eventIndex); // Set clicked event index
            setClickedDay(dayIndex); // Set clicked day index when an event is clicked
        }
    };

    return (

        <div>
            {
                editMode ?
                    (
                        <AddAllocation editMode={editMode} />
                    )
                    :
                    (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', marginRight: '15px' }}>
                            {
                                weekdays.map((day, dayIndex) => (
                                    <div key={day} style={{ textAlign: 'left', position: 'relative' }}>
                                        <div
                                            style={{
                                                width: deleteClicked ? '96px' : '96px',
                                                textAlign: 'center',
                                                padding: '10px',
                                                border: '1px solid #ccc',
                                                boxSizing: 'border-box',
                                                backgroundColor: clickedDay === dayIndex ? '#69A5EB' : '#69A5EB',
                                                color: 'white',
                                                fontFamily: 'Roboto',
                                                position: 'relative',
                                                zIndex: '1',
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                marginTop: '10px',
                                            }}
                                            onClick={() => handleDayClick(dayIndex)}
                                        >
                                            <div>{day}</div>
                                        </div>

                                        {/* Render event details */}
                                        <div>
                                            {(Array.isArray(data[dayIndex]?.Res_Data) ? data[dayIndex].Res_Data : []).map((eventDetails, eventIndex) => (
                                                <div
                                                    key={eventIndex}
                                                    style={{
                                                        marginTop: '5px',
                                                        width: '96px',
                                                        height: '95px',
                                                        padding: '10px',
                                                        border: '1px solid #ccc',
                                                        boxSizing: 'border-box',
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        justifyContent: 'center',
                                                        position: 'relative',
                                                        cursor: 'pointer',
                                                        backgroundColor: clickedEvent === eventIndex && clickedDay === dayIndex ? '#EFEFEF' : 'transparent',
                                                    }}
                                                // onClick={() => handleEventClick(dayIndex, eventIndex)}
                                                >

                                                    {deleteClicked && (
                                                        <input
                                                            type="checkbox"
                                                            style={{
                                                                marginLeft: '5em',
                                                                marginTop: '0px',
                                                                zIndex: '2',
                                                            }}
                                                            name='pro_detl_id_arr'
                                                            onChange={() => handleCheckboxChange(dayIndex, eventIndex)}
                                                            checked={selectedIds.includes(eventDetails.prof_avaib_dt_id)}
                                                        />
                                                    )}

                                                    {/* Individual event block */}
                                                    <div
                                                        style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            backgroundColor: colors[(dayIndex + eventIndex) % colors.length],
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-start',
                                                            justifyContent: 'center',
                                                            padding: '5px',
                                                            boxSizing: 'border-box',
                                                            textAlign: 'left',
                                                            fontSize: '12px',
                                                            color: 'white'
                                                        }}
                                                        onClick={() => handleEventClick(dayIndex, eventIndex)}
                                                    >
                                                        {/* Render event details */}
                                                        <div>
                                                            {eventDetails.start_time} - {eventDetails.end_time}
                                                            {eventDetails.prof_loc_zone_name && eventDetails.prof_loc_zone_name.length > 0 &&
                                                                eventDetails.prof_loc_zone_name.map((location, idx) => (
                                                                    <div key={idx}>{location}</div>
                                                                ))}
                                                        </div>

                                                        {/* Render edit and delete icons */}
                                                        {clickedEvent === eventIndex && clickedDay === dayIndex && (
                                                            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: '2' }}>
                                                                <div
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        marginBottom: '3px',
                                                                        backgroundColor: '#EBEBEB',
                                                                        padding: '5px',
                                                                        borderRadius: '5px',
                                                                        width: '50px',
                                                                        height: '17px'
                                                                    }}
                                                                >
                                                                    <EditIcon
                                                                        onClick={() => handleEditClick()}
                                                                        style={{ color: '#69A5EB', cursor: 'pointer', marginRight: '5px', fontSize: '14px' }}
                                                                    />
                                                                    <Typography style={{ color: 'black', cursor: 'pointer', fontSize: '12px' }}>Edit</Typography>
                                                                </div>

                                                                {/* <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    backgroundColor: '#EBEBEB',
                                                    padding: '5px',
                                                    borderRadius: '5px',
                                                    width: '52px',
                                                    height: '17px'
                                                }}
                                            >
                                                <DeleteIcon style={{ color: '#BC0000', cursor: 'pointer', marginRight: '5px', fontSize: '14px' }} />
                                                <Typography style={{ color: 'black', cursor: 'pointer', fontSize: '12px' }}>Delete</Typography>
                                            </div> */}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                ))}
                            {selectedIds.length > 0 && <AllocatedProfessional editMode={editMode} selectedIds={selectedIds} />}
                        </div>
                    )
            }
        </div>

    );
};

export default DemoCalendar;
