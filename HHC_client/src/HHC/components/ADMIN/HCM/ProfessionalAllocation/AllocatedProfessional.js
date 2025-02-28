import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AddCardIcon from '@mui/icons-material/AddCard';
import AddAllocation from './AddAllocation';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import MapComponent from './Map';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ChecklistIcon from '@mui/icons-material/Checklist';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Grid, TextField, MenuItem, Checkbox, ListItemText, Typography, Tooltip } from '@mui/material';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const styles = {
    success: {
        backgroundColor: '#4caf50', // Green
        color: '#ffffff',
    },
    error: {
        backgroundColor: '#f44336', // Red
        color: '#ffffff',
    }
};


const AllocatedProfessional = ({ profId, profFullname }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    useEffect(() => {
        console.log("Professional Full Name:", profFullname);
        // Additional logic for fetching or processing data based on profId
    }, [profId, profFullname]);

    // const [professionalData, setProfessionalData] = useState(selectedIds);
    const [openCardIndex, setOpenCardIndex] = useState(null);
    const [openAddProfessional, setOpenAddProfessional] = useState(false);
    const [currentProfessional, setCurrentProfessional] = useState(null);
    const [isMapView, setIsMapView] = useState(false);

    /////// edit start
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success'); // Default to 'success'

    const snackbarStyle = snackbarType === 'success' ? styles.success : styles.error;

    
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarColor, setSnackbarColor] = useState(''); // New state for snackbar color

    console.log(responseData, 'fetched responseData.....');
    const [zone, setZone] = useState([]); // State for fetched zones

    const handleZoneChange = (event) => {
        const selectedZoneNames = event.target.value;
        const selectedZoneIds = zone
            .filter(zoneItem => selectedZoneNames.includes(zoneItem.Name))
            .map(zoneItem => zoneItem.prof_zone_id);

        setModalData({
            ...modalData,
            prof_loc_zone_name: selectedZoneNames,
            prof_zone_id: selectedZoneIds
        });
    };

    useEffect(() => {
        const fetchZone = async () => {
            try {
                const response = await fetch(`${port}/web/agg_hhc_zone_api/1`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                setZone(data);
            } catch (error) {
                console.error('Error fetching zones:', error);
            }
        };
        fetchZone();
    }, [port, accessToken]);

    ////// clicked checbox for delet 
    const [selectedIds, setSelectedIds] = useState([]);

    console.log('fetched Professional Id Wise Card Data......', profId);

    const handleAddClick = (value) => {
        console.log(`Clicked with value: ${value}`);
        setCurrentProfessional(null);
        setOpenAddProfessional(true);
    };

    const [modalData, setModalData] = useState({
        start_time: '',
        end_time: '',
        prof_loc_zone_name: [],
        prof_zone_id: []
    });

    const handleEditClick = async (startTime, endTime, dayIndex, professional) => {
        const data = {
            prof: profId,
            day: dayIndex,
            start_time: startTime,
            end_time: endTime
        };

        try {
            const response = await fetch(`${port}/web/pro_dtl_aval/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const responseData = await response.json();
            console.log('Fetched Data:', responseData);

            // Assuming responseData is an array with one object as shown in your example
            if (responseData.length > 0 && responseData[0].Res_Data.length > 0) {
                const fetchedData = responseData[0].Res_Data[0];
                setModalData({
                    prof_avaib_dt_id: fetchedData.prof_avaib_dt_id,
                    start_time: fetchedData.start_time,
                    end_time: fetchedData.end_time,
                    prof_loc_zone_name: fetchedData.prof_loc_zone_name,
                    prof_zone_id: fetchedData.prof_zone_id,
                    dayIndex: dayIndex // Pass dayIndex to modalData
                });
                setIsModalOpen(true); // Open the modal after successful API response
            } else {
                console.error('No data found in response.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    /////// edit end

    // UPDATE FORM
    const [message, setMessage] = useState('');

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleUpdate = async () => {
        // Check if end_time is greater than start_time
        if (modalData.start_time >= modalData.end_time) {
            setSnackbarMessage("To Time should be greater than the from time.");
            setOpenSnackbar(true);
            setSnackbarType('error'); // Set the type to 'error'

            // Close the snackbar after 2 seconds
            setTimeout(() => {
                setOpenSnackbar(false);
            }, 2000);
            return;
        }

        try {
            const requestBody = {
                pro_detl_id: modalData.prof_avaib_dt_id,
                srv_prof_id: profId,
                day: modalData.dayIndex,
                time: [
                    [modalData.start_time, modalData.end_time]
                ],
                zones: modalData.prof_loc_zone_name,
                prof_zone_id: modalData.prof_zone_id
            };

            console.log('Submitting update with data:', requestBody);

            const response = await fetch(`${port}/web/pro_aval/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();

            if (response.ok) {
                if (responseData.Res_Data && responseData.Res_Data.msg) {
                    setSnackbarMessage('Updated Successfully');
                    setSnackbarType('success'); // Set the type to 'success'
                    setOpenSnackbar(true);

                    setTimeout(() => {
                        setOpenSnackbar(false);
                    }, 2000);
                }

                fetchData();
                handleCloseModal();
            } else {
                throw new Error(responseData.Res_Data?.msg || 'Failed to update');
            }
        } catch (error) {
            console.error('Error updating data:', error);
            setSnackbarMessage('An error occurred while updating data.');
            setOpenSnackbar(true);

            setTimeout(() => {
                setOpenSnackbar(false);
            }, 2000);
        }
    };

    // Handle close of modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleBackClick = () => {
        setOpenAddProfessional(false);
        setOpenCardIndex(null); // Reset the selected tab row
        fetchData();
    };

    ////delete value
    const [deleteClicked, setDeleteClicked] = useState(false);
    const [professionalData, setProfessionalData] = useState([]);

    console.log(selectedIds, 'fetched selectedIDs and stored in variable......');

    // Update professionalData when selectedIds prop changes
    useEffect(() => {
        if (selectedIds && selectedIds.length > 0) {
            setProfessionalData(selectedIds);
        }
    }, [selectedIds]);

    const handleDeleteClick1 = async (e) => {
        e.preventDefault();
        console.log('Professional Data:', professionalData);

        if (professionalData.length === 0) {
            console.log('No selected IDs to delete.');
            return;
        }

        try {
            const response = await fetch(`${port}/web/pro_del_aval/?pro=${profId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    pro_detl_id_arr: professionalData
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const deletedIds = professionalData;

            // Update the state to remove deleted itemssssssss
            setData(prevData => {
                // Create a new array with updated data
                const newData = prevData.map(day => ({
                    ...day,
                    Res_Data: Array.isArray(day.Res_Data) ? day.Res_Data.filter(event => !deletedIds.includes(event.prof_avaib_dt_id)) : []
                }));
                return newData;
            });

            // Clear selected and professionalData arrays
            setSelectedIds([]);
            setProfessionalData([]);
            setDeleteClicked(false);
            // Show snackbar with success message
            // setMessage('Deleted successfully!!!!');
            // setOpenSnackbar(true);
            console.log('Professional deleted successfully');
        } catch (error) {
            console.error('Error deleting professional:', error);
        }
    };

    // const handleDeleteClick1 = async (e) => {
    //     e.preventDefault();
    //     console.log('Professional Data:', professionalData);

    //     if (professionalData.length === 0) {
    //         console.log('No selected IDs to delete.');
    //         return;
    //     }

    //     try {
    //         const response = await fetch(`${port}/web/pro_del_aval/?pro=${profId}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //             body: JSON.stringify({
    //                 pro_detl_id_arr: professionalData
    //             }),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();
    //         console.log('Response Data:', data);

    //         // Remove deleted items from the state
    //         const newData = data.map(day => ({
    //             ...day,
    //             Res_Data: day.Res_Data.filter(event => !professionalData.includes(event.prof_avaib_dt_id))
    //         }));

    //         // Update the state to trigger a re-render
    //         setData(newData);
    //         setSelectedIds([]);
    //         setProfessionalData([]);

    //         console.log('Professional deleted successfully');
    //     } catch (error) {
    //         console.error('Error deleting professional:', error);
    //     }
    // };

    const handleDeleteClick = () => {
        setDeleteClicked(true);
    };
    /////////////////////////////////////////////// Demo Calender Open ////////////////////////////////////////////////////////

    // Array of weekday names for the calendar
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const [data, setData] = useState([]);

    // Fetch data corresponding to each weekday based on profIdd

    const fetchData = async () => {
        try {
            const response = await fetch(`${port}/web/pro_aval/?pro=${profId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setData(result);
            console.log(result, 'resultresult............');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [profId, accessToken, port]);

    // List of colors for events
    const colors = ['#F29D38', '#9370DB', '#FF69B4', '#5DC6E7', '#FF4500', '#6A5ACD', '#20B2AA'];

    // State to track which day and event is clicked
    const [clickedDay, setClickedDay] = useState(null);
    const [clickedEvent, setClickedEvent] = useState(null);

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
        <div style={{ marginBottom: '2em' }}>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => setOpenSnackbar(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                }
                ContentProps={{
                    sx: { ...snackbarStyle, width: '100%' } // Apply inline styles here
                }}
            />

            {
                openAddProfessional ?
                    (
                        <Box sx={{ mx: 2 }}>
                            <Box sx={{ mx: 2 }} onClick={handleBackClick}>
                                <Box sx={{ display: 'flex', justifyContent: 'left', width: '100%' }}>
                                    <Stack direction="row" alignItems="center" spacing={0} sx={{ width: '100%', cursor: 'pointer' }}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 35,
                                            height: 35,
                                            borderRadius: '70%',
                                            backgroundColor: '#69A5EB',
                                            marginRight: '8px',
                                            marginBottom: '1em'
                                        }}
                                            onClick={handleBackClick}
                                        >
                                            <ArrowBackIosIcon sx={{ fontSize: 35, color: 'white', marginLeft: '15px' }} />
                                        </Box>
                                        <Typography
                                            sx={{ fontSize: 16, fontWeight: 500, marginLeft: '1em', marginTop: '-0.4em' }} color="text.secondary" gutterBottom>
                                            {profFullname}
                                        </Typography>
                                        <Box sx={{ flexGrow: 1 }} />
                                    </Stack>
                                </Box>
                            </Box>

                            <Box sx={{ height: '20em' }}>
                                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                                    <AddAllocation
                                        isOpen={openAddProfessional}
                                        setOpen={setOpenAddProfessional}
                                        professional={currentProfessional}
                                        profId={profId}
                                    />
                                </Grid>
                            </Box>
                        </Box>
                    ) :
                    (
                        <Box>
                            {isMapView ?
                                (
                                    <div sx={{ marginTop: '-3.5em' }}>
                                        <MapComponent />
                                    </div>
                                )
                                :
                                (
                                    <Box sx={{ mx: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 40,
                                                    height: 35,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#69A5EB',
                                                    marginRight: '8px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <ArrowBackIosIcon sx={{ fontSize: 25, color: 'white', marginLeft: '10px' }} />
                                            </Box>

                                            <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: '5px', flex: 1, textAlign: 'left' }} color="text.secondary" gutterBottom>
                                                {profFullname}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 45,
                                                    height: 45,
                                                    borderRadius: '50%',
                                                    marginLeft: 'auto', // Pushes the following icons to the rightmost edge
                                                    marginRight: '5px',
                                                    marginTop: '7px'
                                                }}
                                            >
                                                <DeleteOutlineIcon
                                                    sx={{ fontSize: 25, color: 'black', cursor: 'pointer', marginRight: '0px' }}
                                                    onClick={handleDeleteClick1}
                                                />
                                                <ChecklistIcon
                                                    sx={{ fontSize: 25, color: 'black', cursor: 'pointer' }}
                                                    onClick={handleDeleteClick}
                                                />
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 45,
                                                    height: 45,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#69A5EB',
                                                    marginTop: '8px'
                                                }}
                                                onClick={handleAddClick}
                                            >
                                                <AddCardIcon sx={{ fontSize: 25, color: 'white', cursor: 'pointer' }} />
                                            </Box>
                                        </Box>

                                        <Box sx={{ height: 300, overflowY: 'auto' }}>
                                            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                                                <Grid item xs={12}>
                                                    <Grid container spacing={0}>
                                                        {
                                                            weekdays.map((day, dayIndex, professional) => (
                                                                <div key={day} style={{ textAlign: 'left', position: 'relative' }}>
                                                                    <div
                                                                        style={{
                                                                            width: deleteClicked ? '90px' : '90px',
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
                                                                        {(Array.isArray(data[dayIndex]?.Res_Data) ? data[dayIndex].Res_Data : []).map((eventDetails, eventIndex, professional) => (
                                                                            <div
                                                                                key={eventIndex}
                                                                                style={{
                                                                                    marginTop: '5px',
                                                                                    width: '90px',
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
                                                                                    {/* <div>
                                                                                        {eventDetails.start_time} - {eventDetails.end_time}
                                                                                        {eventDetails.prof_loc_zone_name && eventDetails.prof_loc_zone_name.length > 0 &&
                                                                                            eventDetails.prof_loc_zone_name.map((location, idx) => (
                                                                                                <div key={idx}>{location}</div>
                                                                                            ))}
                                                                                    </div> */}

                                                                                    <Tooltip
                                                                                        title={`${eventDetails.start_time} - ${eventDetails.end_time} ${eventDetails.prof_loc_zone_name?.join(', ')}`}
                                                                                        arrow
                                                                                    >
                                                                                        <div>
                                                                                            {truncateText(`${eventDetails.start_time} - ${eventDetails.end_time} ${eventDetails.prof_loc_zone_name?.join(', ')}`, 30)}
                                                                                        </div>
                                                                                    </Tooltip>

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
                                                                                                    height: '17px',
                                                                                                    // marginLeft: '10px'
                                                                                                }}
                                                                                                onClick={() => handleEditClick(eventDetails.start_time, eventDetails.end_time, dayIndex, professional)}
                                                                                            >
                                                                                                <EditIcon
                                                                                                    style={{ color: '#69A5EB', cursor: 'pointer', marginRight: '5px', fontSize: '14px' }}
                                                                                                />
                                                                                                <Typography style={{ color: 'black', cursor: 'pointer', fontSize: '12px' }}>Edit</Typography>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Box>

                                        <Modal open={isModalOpen} onClose={handleCloseModal}>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    backgroundColor: 'white',
                                                    boxShadow: 24,
                                                    p: 4,
                                                    minWidth: 500,
                                                    maxWidth: '90%',
                                                    maxHeight: '90vh',
                                                    overflowY: 'auto',
                                                    borderRadius: '0.5em',
                                                    textAlign: 'center',  // Center align all content
                                                }}
                                            >
                                                <IconButton
                                                    aria-label="close"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        color: 'black'
                                                    }}
                                                    onClick={handleCloseModal}
                                                >
                                                    <CloseIcon />
                                                </IconButton>

                                                <Typography variant="h6" component="h2" sx={{ marginBottom: '1em' }}>
                                                    Edit Professional
                                                </Typography>

                                                <Grid container spacing={2} justifyContent="center">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <Grid item xs={12} sm={12}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                                                <Grid item xs={6} sm={6}>
                                                                    <TextField
                                                                        label="From"
                                                                        type="time"
                                                                        value={modalData.start_time}
                                                                        onChange={(e) => setModalData({ ...modalData, start_time: e.target.value })}
                                                                        fullWidth
                                                                        size="small"
                                                                        sx={{ width: '100%', marginBottom: '0.5rem' }}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        inputProps={{
                                                                            step: 300,
                                                                        }}
                                                                    />

                                                                </Grid>

                                                                <Grid item xs={6} sm={6}>
                                                                    <TextField
                                                                        label="To"
                                                                        type="time"
                                                                        value={modalData.end_time}
                                                                        onChange={(e) => setModalData({ ...modalData, end_time: e.target.value })}
                                                                        fullWidth
                                                                        size="small"
                                                                        sx={{ marginLeft: '1rem', width: '100%', marginBottom: '0.5rem' }}
                                                                        InputLabelProps={{
                                                                            shrink: true,
                                                                        }}
                                                                        inputProps={{
                                                                            step: 300,
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
                                                                <Grid item xs={6} sm={6}>
                                                                    <TextField
                                                                        select
                                                                        label="Select Zone"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        fullWidth
                                                                        value={modalData.prof_loc_zone_name}
                                                                        sx={{ marginBottom: '1rem' }}
                                                                        onChange={handleZoneChange}
                                                                        SelectProps={{
                                                                            multiple: true,
                                                                            renderValue: (selected) => selected.join(', '),
                                                                            MenuProps: {
                                                                                PaperProps: {
                                                                                    style: {
                                                                                        maxHeight: 200,
                                                                                        overflow: 'auto',
                                                                                    },
                                                                                },
                                                                            },
                                                                        }}
                                                                    >
                                                                        {zone.map((zoneItem) => (
                                                                            <MenuItem key={zoneItem.prof_zone_id} value={zoneItem.Name}>
                                                                                <Checkbox checked={modalData.prof_loc_zone_name.includes(zoneItem.Name)} />
                                                                                <ListItemText primary={zoneItem.Name} />
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>
                                                                </Grid>

                                                                <Grid item xs={6} sm={6}>
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="inherit"
                                                                        sx={{ width: '90%', height: '100%', marginBottom: '1rem' }}
                                                                    >
                                                                        <AddCircleOutlineIcon style={{ color: '#69A5EB', marginRight: '0.5rem' }} />
                                                                        Add Location
                                                                    </Button>
                                                                </Grid>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
                                                                <Grid item xs={3} sm={3}>
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="inherit"
                                                                        sx={{
                                                                            width: '100%',
                                                                            backgroundColor: '#69A5EB',
                                                                            border: 'none',
                                                                            color: 'white',
                                                                            '&:hover': {
                                                                                backgroundColor: '#69A5EB',
                                                                            },
                                                                        }}
                                                                        onClick={handleUpdate}
                                                                    >
                                                                        Update
                                                                    </Button>
                                                                </Grid>
                                                            </Box>
                                                        </Grid>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Box>
                                        </Modal>
                                    </Box>
                                )
                            }
                        </Box>
                    )
            }
        </div>
    )
}

export default AllocatedProfessional;
