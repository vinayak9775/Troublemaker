import React, { useState } from 'react';
import { Box, Typography, Autocomplete, Stack, TextField, MenuItem } from '@mui/material';

const Map = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [zone, setZone] = useState([]);
    const [zoneID, setZoneID] = useState("");
    return (
        <>
            <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }} style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px' }}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography align="left" sx={{ fontSize: 16, fontWeight: 600, pl: "10px", pt: "8px" }} color="text.secondary" gutterBottom>MAP</Typography>
                    {/* <Autocomplete
                        id="zone-select"
                        options={zone}
                        getOptionLabel={(option) => option.Name}
                        sx={{ width: '22ch', textAlign: 'left', }}
                        renderInput={(params) => <TextField {...params} label="Select Zone" size="small" />}
                        onChange={(e, selectedOption) => {
                            if (selectedOption) {
                                console.log("selectedOption", selectedOption.prof_zone_id)
                                setZoneID(selectedOption.prof_zone_id);
                            } else {
                                setZoneID("");
                            }
                        }}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                },
                            },
                        }}
                        renderOption={(props, option) => (
                            <MenuItem
                                {...props}
                                sx={{ fontSize: '14px' }}
                            >
                                {option.Name}
                            </MenuItem>
                        )}
                    /> */}
                </Stack>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30275.38834977167!2d73.81502425862001!3d18.464464586918634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eab786f132dd%3A0x7e73bc336a4a20f3!2sDhankawadi%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1685955690124!5m2!1sen!2sin"
                    // width="330"
                    height="350"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    className='iframe-map'
                >
                </iframe>
            </Box>
        </>
    )
}

export default Map
