import React from 'react';
import Card from "@mui/material/Card"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { CardContent } from '@mui/material';
import { Box, Stack } from '@mui/system';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const Payment = () => {
    return (
        <Box>
            <CardContent>
                <Grid container spacing={2} sx={{ marginTop: "1px" }}>
                    <Grid item lg={12} sm={12} xs={12}>
                        <Box sx={{ borderRadius: "6px", backgroundColor: "#51DDD4", color: "#ffffff", height: "2.5rem" }}>
                            <Stack direction="row" justifyContent="space-around">
                                <Typography variant='body2' sx={{ marginTop: "10px" }}>Total Payable</Typography>
                                <div style={{ display: "flex", marginTop: "6px" }}>
                                    <CurrencyRupeeIcon sx={{ fontSize: "18px", marginTop: "4px" }} />
                                    <Typography variant='subtitle1'>2800</Typography>
                                </div>

                            </Stack>
                        </Box>
                    </Grid>
                    <Grid item lg={12} sm={12} xs={12}>
                        <Typography variant='subtitle2'>Service Summary</Typography>
                        <Card sx={{ background: '#F5F9FA', p:2 }}>
                            <div style={{ display: "flex", }}>
                                <Typography variant='body2' sx={{width:"50%"}}>Patient Name</Typography>
                                <Typography variant='subtitle2'>Prakash Chavan</Typography>
                            </div>
                            <div style={{ display: "flex", }}>
                                <Typography variant='body2' sx={{width:"50%"}}>Event ID</Typography>
                                <Typography variant='subtitle2'>1234567890</Typography>
                            </div>
                            <div style={{ display: "flex", }}>
                                <Typography variant='body2' sx={{width:"50%"}}>Service</Typography>
                                <Typography variant='subtitle2'>Nurse</Typography>
                            </div>
                            <div style={{ display: "flex", }}>
                                <Typography variant='body2' sx={{width:"50%"}}>Sub Service</Typography>
                                <Typography variant='subtitle2'>Nurse</Typography>
                            </div>
                            <div style={{ display: "flex", }}>
                                <Typography variant='body2' sx={{width:"50%"}}>Coupon Discount</Typography>
                                <Typography variant='subtitle2'>₹ 300</Typography>
                            </div>
                            <div style={{ display: "flex", }}>
                                <Typography variant='body2' sx={{width:"50%"}}>Final Cost</Typography>
                                <Typography variant='subtitle2'>₹ 2800</Typography>
                            </div>
                        </Card>
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        <Grid container spacing={0}>
                            <Grid item xs={6}>
                                <FormControlLabel control={<Checkbox defaultChecked />} label={<span style={{ fontSize: '14px', }}>Add Discount</span>} />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    id="outlined-select-percentage"
                                    select
                                    label="Select %"
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& input': {
                                            fontSize: '12px',
                                        },
                                    }}
                                />
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item lg={12} sm={12} xs={12}>
                        <Button variant="contained" sx={{ m: 1, width: '30ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", }}>
                            {/* <Link
                to="/service"
              >
                service
              </Link> */}
                            Save Payment Details
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Box>
    )
}

export default Payment
