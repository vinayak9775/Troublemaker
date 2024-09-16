import * as React from 'react';
import { Accordion, FormControl, AccordionDetails, AccordionSummary, Avatar, Button, CardContent, FormControlLabel, Grid, IconButton, Input, InputBase, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Navbar from '../ManagementDashboard/Header'

const AtteDashboard = () => {
    return (
        <div>
            <Navbar/>
            <Grid container spacing={5} style={{paddingLeft: '15px', paddingRight:'15px'}}>
            <Grid item xs={3} sx={{}}>
                    <Card sx={{ minWidth: 205 }}>
                        <CardContent style={{borderLeft:'5px solid skyblue',marginTop:'15px',marginBottom:'15px'}}>
                            <Typography variant="h6" component="div">
                                Total Employeeeeeeeeeeeeeee
                            </Typography>
                            <Typography variant="h6" component="div">
                               350
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Card sx={{ minWidth: 205 }} style={{borderLeft:'5px solid green'}}>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Present Employee
                            </Typography>
                            <Typography variant="h6" component="div">
                               300
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Card sx={{ minWidth: 205 }} style={{borderLeft:'5px solid red'}}>
                        <CardContent>
                            <Typography variant="h6" component="div">
                               Absent Employee
                            </Typography>
                            <Typography variant="h6" component="div">
                               07
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={3}>
                    <Card sx={{ minWidth: 205 }} style={{borderLeft:'5px solid yellow'}}>
                        <CardContent>
                            <Typography variant="h6" component="div">
                              Week Off
                            </Typography>
                            <Typography variant="h6" component="div">
                               10
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}

export default AtteDashboard
