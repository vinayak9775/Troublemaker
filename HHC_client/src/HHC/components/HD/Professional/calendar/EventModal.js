import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const localizer = momentLocalizer(moment);

const EventModal = ({ isOpen, onClose, isEditingEvent, profEvent, selectedEvent, }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");

    const [startDTFormat, setStartDTFormat] = useState("");
    const [endDTFormat, setEndDTFormat] = useState("");

    console.log("ProfEvent...", profEvent)

    useEffect(() => {
        if (profEvent && profEvent.length > 0) {

            const startDateTime = moment(profEvent.actual_StartDate_Time);
            const endDateTime = moment(profEvent.actual_EndDate_Time);

            const start12HourFormat = startDateTime.format('DD-MM-YYYY HH:mm');
            const end12HourFormat = endDateTime.format('DD-MM-YYYY HH:mm');

            setStartDTFormat(start12HourFormat);
            setEndDTFormat(end12HourFormat)

        } else {
            setStartDTFormat('');
            setEndDTFormat('');
            // onClose();
        }
    }, [profEvent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newEvent = {
            actual_StartDate_Time: startDateTime,
            actual_EndDate_Time: endDateTime,
        };
        try {
            const response = await fetch(`${port}/web/agg_hhc_detailed_event_plan_of_care_per_day/?pro=${profEvent}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEvent),
            });
            if (!response.ok) {
                throw new Error("Failed to create event");
            }
            // fetchEvents();
            // onClose();
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const handleSave = () => {
        if (isEditingEvent) {
            onClose();
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 350,
                background: 'white',
                borderRadius: '10px',
                pt: 2,
                // px: 4,
                pb: 3,
                pl: 4,
                pr: 4
            }}>
                <AppBar position="static" style={{
                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                    width: '21.9rem',
                    height: '3rem',
                    marginTop: '-16px',
                    borderRadius: "8px 10px 0 0",
                }}>
                    <div style={{ display: "flex" }}>
                        <Typography align="center" style={{ fontSize: "16px", fontWeight: 600, color: "#FFFFFF", marginTop: "10px", marginLeft: "10px" }}>PROFESSIONAL SCHEDULE</Typography>
                        <Button onClick={onClose} sx={{ marginLeft: "4rem", color: "#FFFFFF", marginTop: "2px", }}><CloseIcon /></Button>
                    </div>
                </AppBar>

                <CardContent>
                    <Grid container spacing={3} sx={{ marginTop: "1px", pl:2, pr:2 }}>

                        <Grid item lg={12} sm={12} xs={12}>
                            <TextField
                                id="outlined-name"
                                label="Professional Name"
                                size="small"
                                fullWidth
                                value={profEvent ? profEvent.prof_name : ""}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12}>
                            <TextField
                                id="outlined-name"
                                label="Patient Name"
                                size="small"
                                fullWidth
                                value={profEvent ? profEvent.patient_name : ""}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12}>
                            <TextField
                                id="outlined-name"
                                label="Service Name"
                                size="small"
                                fullWidth
                                value={profEvent ? profEvent.srv_name : ""}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12}>
                            <TextField
                                id="outlined-name"
                                label="Sub Service Name"
                                size="small"
                                fullWidth
                                value={profEvent ? profEvent.sub_srv_id : ""}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item lg={12} sm={12} xs={12}>
                            <TextField
                                id="outlined-name"
                                label="Service Amount"
                                size="small"
                                fullWidth
                                value={profEvent ? profEvent.Service_final_amount : ""}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid container spacing={2} sx={{ marginTop: "1px", ml: 1 }}>
                            <Grid item lg={6} sm={6} xs={6}>
                                <TextField
                                    id="actual_StartDate_Time"
                                    label="Start Date"
                                    // type="datetime-local"
                                    name="actual_StartDate_Time"
                                    size="small"
                                    // value={isEditingEvent ? 'Edit Event' : startDateTime}
                                    value={profEvent ? profEvent.actual_StartDate_Time : ""}
                                    // value={startDTFormat}
                                    // onChange={(e) => setStartDateTime(e.target.value)}
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item lg={6} sm={6} xs={6}>
                                <TextField
                                    id="start_time"
                                    label="Start Time"
                                    // type="datetime-local"
                                    name="start_time"
                                    size="small"
                                    // value={isEditingEvent ? 'Edit Event' : startDateTime}
                                    value={profEvent ? profEvent.start_time : ""}
                                    // value={startDTFormat}
                                    // onChange={(e) => setStartDateTime(e.target.value)}
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginTop: "1px", ml: 1 }}>
                            <Grid item lg={6} sm={6} xs={6}>
                                <TextField
                                    id="actual_EndDate_Time"
                                    label="End Date"
                                    name="actual_EndDate_Time"
                                    // type="datetime-local"
                                    size="small"
                                    // value={isEditingEvent ? 'Edit Event' : endDateTime}
                                    value={profEvent ? profEvent.actual_EndDate_Time : ""}
                                    // value={endDTFormat}
                                    // onChange={(e) => setEndDateTime(e.target.value)}
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item lg={6} sm={6} xs={6}>
                                <TextField
                                    id="end_time"
                                    label="End Time"
                                    // type="datetime-local"
                                    name="end_time"
                                    size="small"
                                    // value={isEditingEvent ? 'Edit Event' : startDateTime}
                                    value={profEvent ? profEvent.end_time : ""}
                                    // value={startDTFormat}
                                    // onChange={(e) => setStartDateTime(e.target.value)}
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item lg={12} sm={12} xs={12}>
                            <TextField
                                id="patient_add"
                                label="Patient Location"
                                name="patient_add"
                                size="small"
                                value={profEvent ? profEvent.patient_add : ""}
                                fullWidth
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        {/* <Grid item lg={12} sm={12} xs={12}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Remark"
                                placeholder='write remark here'
                                size="small"
                                fullWidth
                                multiline
                                rows={2}
                                sx={{
                                    '& input': {
                                        fontSize: '14px',
                                    },
                                }}
                            />
                        </Grid> */}

                        <Grid item lg={12} sm={12} xs={12} sx={{ marginLeft: "20px" }}>
                            {isEditingEvent && (
                                <Button variant="contained" onClick={handleSave}>Save</Button>
                            )}
                            {/* <Button variant="contained" sx={{ m: 1, backgroundColor: '#26C0E2', borderRadius: "12px", textTransform: "capitalize", width: "16rem" }} startIcon={<CheckIcon />} onClick={handleSubmit}>
                                Schedule
                            </Button> */}
                            {/* <Button variant="contained" sx={{ m: 1, backgroundColor: '#E5492F', borderRadius: "12px", textTransform: "capitalize", }} startIcon={<CloseIcon />} onClick={onClose}>
                                    Cancel
                                </Button> */}
                        </Grid>
                    </Grid>
                </CardContent>
            </Box>
        </Modal>
    );
};

export default EventModal;
