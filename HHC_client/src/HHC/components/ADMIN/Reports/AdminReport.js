import React, { useState, useEffect } from 'react'
import HRNavbar from '../../HR/HRNavbar'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { TextField, Button } from '@mui/material';
import InputBase from '@mui/material/InputBase';

const AdminReport = () => {

    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1, mb: '3em' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Stack direction="row" alignItems="center" spacing={1} style={{ overflowX: 'auto' }}>
                        <Box sx={{ mb: 1, width: 300, marginLeft: '1rem' }}>
                            <TextField
                                select
                                label="Select Report Type"
                                variant="outlined"
                                size="small"
                                sx={{ height: 39, width: '100%', backgroundColor: 'white', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "7px", '& .MuiMenu-paper': { maxHeight: '200px', overflowY: 'auto' } }}
                                InputProps={{ style: { border: "none" } }}
                                inputProps={{ 'aria-label': 'Select Group' }}
                            >
                            </TextField>
                        </Box>

                        <Box
                            component="form"
                            sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                        >
                            <InputBase
                                sx={{ ml: 1, mr: 1, flex: 1 }}
                                type='date'
                                placeholder="Start Date | DD/MM/YYYY"
                                inputProps={{ 'aria-label': 'select date' }}
                            />
                        </Box>

                        <Box
                            component="form"
                            sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.5rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                        >
                            <InputBase
                                sx={{ ml: 1, mr: 1, flex: 1 }}
                                type='date'
                                placeholder="Start Dateeeeeeee | DD/MM/YYYY"
                                inputProps={{ 'aria-label': 'select date' }}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#69A5EB', color: 'white', textTransform: 'capitalize' }}
                        >
                            View Report
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </div>
    )
}

export default AdminReport
