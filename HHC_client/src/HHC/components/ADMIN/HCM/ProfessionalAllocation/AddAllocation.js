import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Grid, TextField, MenuItem, Checkbox, ListItemText, Typography, Snackbar, IconButton } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MapComponent from './Map';
import AllocatedProfessional from './AllocatedProfessional';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SuccessImage from '../../../../assets/icon with a check mark.png';
import CloseIcon from '@mui/icons-material/Close';

const AddAllocation = ({ profId, isEditMode, selectedProfAvaibId, start, end, day }) => {

    console.log(isEditMode, 'fetcehd edit Status');
    console.log(profId, 'profId srv_prof_id.......');
    console.log(start, end, day, 'fetched Start Time,end Time and Day .......');

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // Array of days
    const [selectedDays, setSelectedDays] = useState([]); // State to store selected day indices
    console.log(selectedDays, 'selectedDays............');
    const isDaySelected = (dayIndex) => selectedDays.includes(dayIndex); // Function to check if day is selected

    const [fromTime, setFromTime] = useState(null);
    const [toTime, setToTime] = useState(null);

    const [zone, setZone] = useState([]); // State for fetched zones
    const [selectedCheckBox, setSelectedCheckBox] = useState([]); // State for selected checkboxes (zones)

    const [isSuccessfullyAdded, setIsSuccessfullyAdded] = useState(false); // State to manage "Successfully Added" message
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State for snackbar message
    const [responseData, setResponseData] = useState(null);  //to fetch the dataa if already exist edit

    console.log('Selected checkbox values:', selectedCheckBox);

    const handleFromTimeChange = (event) => {
        const newFromTime = event.target.value;
        setFromTime(newFromTime);

        // Automatically set 'To' time to 1 minute after 'From' time if needed
        if (newFromTime && newFromTime >= toTime) {
            const [hours, minutes] = newFromTime.split(':').map(Number);
            const newToTime = `${String(hours).padStart(2, '0')}:${String((minutes + 1) % 60).padStart(2, '0')}`;
            setToTime(newToTime);
        }
    };

    // Toggle selection of day by index
    const handleDayClick = (dayIndex) => {
        setSelectedDays((prevDays) =>
            prevDays.includes(dayIndex)
                ? prevDays.filter((selectedDay) => selectedDay !== dayIndex)
                : [...prevDays, dayIndex]
        );
    };

    // Handle zone selection change
    const handleDropdownChange = (event) => {
        setSelectedCheckBox(event.target.value);
    };

    // Open map view
    const [isMapOpen, setIsMapOpen] = useState(false);

    const handleAddLocationClick = () => {
        setIsMapOpen(true);
    };

    // Close map view
    const handleArrowClick = () => {
        setIsMapOpen(false);
    };

    // Fetch zones from API on component mount
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

    //////fetch the Data by passing Day Start and End Time

    useEffect(() => {
        const fetchData = async () => {
            const data = {
                prof: profId,
                day: day,
                start_time: start,
                end_time: end
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
                setResponseData(responseData);
                console.log(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [])

    ////////////////////////////////// Handle save action ////////////////////////////////////////////
    const handleSaveClick = async () => {
        // Prepare the data for the POST request

        // if (fromTime >= toTime) {
        //     setSnackbarMessage('to time should be greater than the from time.');
        //     setSnackbarOpen(true);
        //     return;
        // }
        if (fromTime >= toTime) {
            setSnackbarMessage('To time should be greater than the from time.');
            setSnackbarOpen(true);

            // Close the snackbar after 2 seconds
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 2000);

            return;
        }

        const requestBody = {
            pro_detl_id: selectedProfAvaibId,
            srv_prof_id: profId,
            day: selectedDays,
            prof_avaib_id: 0,
            // time: [
            //     [fromTime.format('HH:mm:ss'), toTime.format('HH:mm:ss')]
            // ],
            time: [
                [fromTime, toTime] // Directly use the time strings
            ],
            prof_zone_id: selectedCheckBox
        };

        try {
            const response = await fetch(`${port}/web/pro_aval/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(requestBody)
            });

            if (response.status === 201) {
                setIsSuccessfullyAdded(true);
                setTimeout(() => {
                    setIsSuccessfullyAdded(false);
                }, 2000);

                // Clear the form inputs and selections
                setSelectedDays([]);
                setFromTime(null);
                setToTime(null);
                setSelectedCheckBox([]);
            } else if (response.status === 200) {
                // Handle scenario where availability already exists
                setSnackbarMessage('Professional availability already exists for selected time slot');
                setSnackbarOpen(true);
            } else {
                throw new Error('Failed to add allocation');
            }

        } catch (error) {
            console.error('Error adding allocation:', error);
            // Handle error (e.g., show error message)
        }
    };

    // Close snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
                // anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
                ContentProps={{
                    sx: {
                        color: '#ffffff',
                        backgroundColor: '#f44336',
                        fontWeight: 'bold',
                        borderRadius: '0.5em',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '40px',
                        justifyContent: 'center',
                    }
                }}
                action={
                    <IconButton size="small" aria-label="close" color="yellow" onClick={handleCloseSnackbar}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />

            {isMapOpen ? (
                <Box sx={{ height: '300px', marginTop: '-2.4rem' }}>
                    <Grid container spacing={2} sx={{ flexGrow: 1, marginLeft: '1rem' }}>
                        <ArrowBackIosIcon
                            onClick={handleArrowClick}
                            style={{ marginLeft: '-1.8rem', color: '#69A5EB', cursor: 'pointer' }}
                        />
                        <MapComponent showMap={{ isMapOpen }} />
                        <AllocatedProfessional style={{ display: 'none' }} />
                    </Grid>
                </Box>
            ) : (
                <Box>
                    {isSuccessfullyAdded ? (
                        <Box sx={{ height: '500px', marginTop: '0.7rem' }}>
                            <Grid
                                container
                                sx={{
                                    height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    marginLeft: '12rem',
                                }}
                            >
                                <Grid item>
                                    <img
                                        src={SuccessImage}
                                        alt="Success"
                                        style={{ marginBottom: '17rem', height: '6rem', width: '6rem' }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5" align="center" color="#000000"
                                        style={{ marginBottom: '10rem', marginLeft: '-12em', marginTop: '2em' }}>
                                        Successfully Added
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                        <Box sx={{ height: '300px', marginTop: '0.7rem' }}>
                            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                                {days.map((day, index) => (
                                    <Grid key={index} item xs={12} sm={1.4} sx={{ paddingLeft: '4rem', marginTop: '0.5em' }}>
                                        <ToggleButton
                                            value={index}
                                            onClick={() => handleDayClick(index)}
                                            sx={{
                                                borderRadius: '0.5em',
                                                height: '55%',
                                                marginLeft: '4em',
                                                width: '3.7em',
                                                marginTop: '2.5em',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                border: '1px solid #69A5EB',
                                                backgroundColor: isDaySelected(index) ? '#69A5EB' : 'white',
                                                color: isDaySelected(index) ? 'black' : 'black',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '&:hover': {
                                                    backgroundColor: isDaySelected(index) ? '#69A5EB' : 'white',
                                                    color: isDaySelected(index) ? 'black' : 'black',
                                                },
                                            }}
                                        >
                                            {day}
                                        </ToggleButton>
                                    </Grid>
                                ))}
                            </Grid>

                            <Grid container spacing={2} sx={{ flexGrow: 1, marginLeft: '6rem', marginTop: '0rem' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                            <Grid item xs={6} sm={6}>
                                                {/* <TimePicker
                                                    label="From"
                                                    value={fromTime}
                                                    size="small"
                                                    fullWidth
                                                    onChange={(newValue) => {
                                                        if (newValue.isAfter(toTime)) {
                                                            setToTime(newValue.add(1, 'minute'));
                                                        }
                                                        setFromTime(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField {...params} size="small" sx={{ marginRight: 1 }} />}
                                                    ampm={false}
                                                /> */}
                                                <TextField
                                                    label="From"
                                                    type="time"
                                                    value={fromTime}
                                                    onChange={handleFromTimeChange}
                                                    size="small"
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    inputProps={{
                                                        step: 60, // 1 minute
                                                    }}
                                                    sx={{ marginRight: 1 }}
                                                />
                                            </Grid>

                                            <Grid item xs={6} sm={6}>
                                                {/* <TimePicker
                                                    label="To"
                                                    type="time"
                                                    value={toTime}
                                                    size="small"
                                                    fullWidth
                                                    sx={{ marginLeft: '1rem' }}
                                                    onChange={(newValue) => setToTime(newValue)}
                                                    renderInput={(params) => <TextField {...params} size="small" />}
                                                    ampm={false}
                                                    minTime={fromTime}
                                                /> */}
                                                <TextField
                                                    label="To"
                                                    type="time"
                                                    value={toTime}
                                                    size="small"
                                                    fullWidth
                                                    sx={{ marginLeft: '1rem' }}
                                                    onChange={(event) => setToTime(event.target.value)}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    inputProps={{
                                                        min: fromTime, // Setting the min time constraint
                                                        step: 60, // Optional: to allow only full minute selections
                                                    }}
                                                />
                                            </Grid>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
                                            <Grid item xs={6} sm={6}>
                                                <TextField
                                                    select
                                                    label="Select Zone"
                                                    value={selectedCheckBox}
                                                    onChange={handleDropdownChange}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    style={{ maxHeight: '50px' }}
                                                    SelectProps={{
                                                        multiple: true,
                                                        renderValue: (selected) => selected.map(value => {
                                                            const selectedZone = zone.find(z => z.prof_zone_id === value);
                                                            return selectedZone ? selectedZone.Name : "";
                                                        }).join(', '),
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
                                                        <MenuItem key={zoneItem.prof_zone_id} value={zoneItem.prof_zone_id}>
                                                            <Checkbox checked={selectedCheckBox.indexOf(zoneItem.prof_zone_id) > -1} />
                                                            <ListItemText primary={zoneItem.Name} />
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            <React.Fragment>
                                                <Grid item xs={7} sm={7}>
                                                    <Button
                                                        variant="outlined"
                                                        color="inherit"
                                                        sx={{ marginLeft: '1rem' }}
                                                        onClick={handleAddLocationClick}
                                                    >
                                                        <AddCircleOutlineIcon style={{ color: '#69A5EB' }} />
                                                        Add Location
                                                    </Button>
                                                </Grid>
                                            </React.Fragment>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
                                            <Grid item xs={12} sm={12}>
                                                <Button
                                                    variant="outlined"
                                                    color="inherit"
                                                    sx={{
                                                        marginLeft: '1rem',
                                                        backgroundColor: '#69A5EB',
                                                        border: 'none',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: '#69A5EB',
                                                        },
                                                    }}
                                                    onClick={handleSaveClick}
                                                >
                                                    Save
                                                </Button>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </LocalizationProvider>
                            </Grid>
                        </Box>
                    )}
                </Box>
            )}
        </div>
    );
};

export default AddAllocation;
