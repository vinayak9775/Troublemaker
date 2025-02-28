import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { CardContent } from '@mui/material';
import Viewservice from "../Viewservice";

const discount = [
    {
        discount_id: '1',
        label: '%',
    },
    {
        discount_id: '2',
        label: '₹',
    },
];

const ServiceInfo = ({ eveID, srvData }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [showComponent, setShowComponent] = useState(false);
    const [service, setService] = useState([]);
    const [subService, setSubService] = useState([]);
    const [gender, setGender] = useState([]);
    const [endDateError, setEndDateError] = useState('');

    // useState for get service data 
    const [serviceData, setServiceData] = useState({ ...srvData });
    const [selectedService, setSelectedService] = useState(serviceData.srv_id.srv_id);
    const [selectedSubService, setSelectedSubService] = useState(serviceData.sub_srv_id);
    const [getCost, setGetCost] = useState(0);
    const [startDate, setStartDate] = useState(serviceData.start_date);
    const [endDate, setEndDate] = useState(serviceData.end_date);
    const [selectedGender, setSelectedGender] = useState(serviceData.prof_prefered);
    const [selectedDiscountId, setSelectedDiscountId] = useState('');
    const [calculatedAmount, setCalculatedAmount] = useState('');
    const [discountValue, setDiscountValue] = useState('');
    const [totalDiscount, setTotalDiscount] = useState('');

    const handleClick = () => {
        setShowComponent(true);
    };

    const handleDropdownService = (event) => {
        const selectedService = event.target.value;
        setSelectedService(selectedService);
    };

    const handleDropdownSubService = (event) => {
        const selectedSubService = event.target.value;
        setSelectedSubService(selectedSubService);
    };

    const handleDropdownGender = (event) => {
        const selectedGender = event.target.value;
        setSelectedGender(selectedGender);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        validateEndDate(event.target.value, endDate);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        validateEndDate(startDate, event.target.value);
    };

    const validateEndDate = (start, end) => {
        if (start && end && new Date(end) < new Date(start)) {
            setEndDateError("End date can't be earlier than the start date");
        } else {
            setEndDateError('');
        }
    };

    const handleFieldChange = (field, value) => {
        setServiceData({ ...srvData, [field]: value });
    };

    useEffect(() => {
        const getService = async () => {
            try {
                // const res = await fetch(`${port}/web/agg_hhc_services_api`);
                const res = await fetch(`${port}/web/agg_hhc_services_api`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Service Data", data);
                setService(data);
            } catch (error) {
                console.error("Error fetching service data:", error);
            }
        };
        getService();
    }, []);

    useEffect(() => {
        const getSubService = async () => {
            if (selectedService) {
                try {
                    // const res = await fetch(`${port}/web/agg_hhc_sub_services_api/${selectedService}`);
                    const res = await fetch(`${port}/web/agg_hhc_sub_services_api/${selectedService}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Sub Service Data", data);
                    setSubService(data);
                } catch (error) {
                    console.error("Error fetching sub service data:", error);
                }
            }
        };
        getSubService();
    }, [selectedService]);

    useEffect(() => {
        const getGender = async () => {
            try {
                // const res = await fetch(`${port}/web/agg_hhc_gender_api`);
                const res = await fetch(`${port}/web/agg_hhc_gender_api`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log(data);
                setGender(data);
            } catch (error) {
                console.error("Error fetching gender data:", error);
            }
        };
        getGender();
    }, []);

    const handleSubServiceSelect = (event) => {
        const subServiceId = event.target.value;
        const selectedSubService = subService.find(item => item.sub_srv_id === subServiceId);
        if (selectedSubService) {
            setSelectedSubService(subServiceId);
            setGetCost(selectedSubService.cost);
        }
    };

    useEffect(() => {
        const calculateTotalAmount = async () => {
            if (getCost && startDate && endDate) {
                try {
                    const url = `${port}/web/calculate_total_amount/${getCost}/${startDate}/${endDate}/`;
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Calculated Amount.....", data.days_difference);
                    setCalculatedAmount(data.days_difference);
                } catch (error) {
                    console.error("Error fetching Calculated Amount:", error);
                }
            }
        };
        calculateTotalAmount();
    }, [getCost, startDate, endDate]);

    useEffect(() => {
        const calculateDiscount = async () => {
            if (calculatedAmount && selectedDiscountId && discountValue) {
                console.log("Discount Amount", calculatedAmount, selectedDiscountId, discountValue)
                try {
                    const url = `${port}/web/calculate_discount_api/${selectedDiscountId}/${discountValue}/${calculatedAmount}`;
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Calculated Amount with Discount.....", data);
                    setTotalDiscount(data.final_amount);
                } catch (error) {
                    console.error("Error fetching Calculated Amount with Discount:", error);
                }
            }
        };
        calculateDiscount();
    }, [calculatedAmount, selectedDiscountId, discountValue]);

    return (
        <Box>
            <CardContent>
                <Grid container spacing={2} sx={{ marginTop: "1px" }}>
                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            id="service_title"
                            select
                            label="Select Service"
                            defaultValue={selectedService}
                            onChange={handleDropdownService}
                            size="small"
                            fullWidth
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        >
                            {service.map((option) => (
                                <MenuItem key={option.srv_id} value={option.srv_id}>
                                    {option.service_title}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            id="sub_srv_id"
                            name="sub_srv_id"
                            select
                            label="Select Sub Service"
                            defaultValue={selectedSubService}
                            onChange={handleDropdownSubService}
                            // onChange={handleSubServiceSelect}
                            size="small"
                            fullWidth
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        >
                            {subService.map((option) => (
                                <MenuItem key={option.sub_srv_id} value={option.sub_srv_id}>
                                    {selectedService && (
                                        <>
                                            {option.recommomded_service}
                                        </>
                                    )}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            id="outlined-satrt-date-time"
                            label="Start Date and Time"
                            // type="datetime-local"
                            // value={startDate}
                            // onChange={handleStartDateChange}
                            // value={serviceData.start_date}
                            value={new Date(serviceData.start_date).toLocaleDateString()}
                            onChange={(e) => handleFieldChange("start_date", e.target.value)}
                            size="small"
                            fullWidth
                            disabled
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
                            id="outlined-end-date-time"
                            label="End Date and Time"
                            // type="datetime-local"
                            // onChange={handleEndDateChange}
                            value={new Date(serviceData.end_date).toLocaleDateString()}
                            onChange={(e) => handleFieldChange("end_date", e.target.value)}
                            size="small"
                            fullWidth
                            disabled
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}

                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={endDateError !== ''}
                            helperText={endDateError}
                        />
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            id="name"
                            select
                            label="Preferred Professional"
                            defaultValue={selectedGender}
                            onChange={handleDropdownGender}
                            size="small"
                            fullWidth
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        >
                            {gender.map((option) => (
                                <MenuItem key={option.gender_id} value={option.gender_id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            id="remark"
                            name="remark"
                            label="Remark"
                            placeholder='write remark here'
                            size="small"
                            fullWidth
                            value={serviceData.remark}
                            onChange={(e) => handleFieldChange("remark", e.target.value)}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        <Grid container spacing={1}>
                            <Grid xs={selectedDiscountId ? 6 : 12} sx={{ marginTop: 1, }}>
                                <TextField
                                    id="outlined-select-percentage"
                                    name="discount_type"
                                    select
                                    label="Discount Type"
                                    value={selectedDiscountId}
                                    onChange={(e) => setSelectedDiscountId(e.target.value)}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        textAlign: "left",
                                        '& input': {
                                            fontSize: '12px',
                                        },
                                    }}
                                >
                                    {discount.map((option) => (
                                        <MenuItem key={option.discount_id} value={option.discount_id}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={6}>
                                {selectedDiscountId === '1' && (
                                    <TextField
                                        id="discount-percentage"
                                        name="discount_value"
                                        label="%"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                        sx={{
                                            textAlign: "left",
                                            '& input': {
                                                fontSize: '16px',
                                            },
                                        }}
                                    />
                                )}

                                {selectedDiscountId === '2' && (
                                    <TextField
                                        id="discount-currency"
                                        name="discount_value"
                                        label="₹"
                                        size="small"
                                        type="number"
                                        fullWidth
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                        sx={{
                                            textAlign: "left",
                                            '& input': {
                                                fontSize: '16px',
                                            },
                                        }}
                                    />
                                )}
                            </Grid>
                        </Grid>
                        {/* <TextField
                                            id="outlined-select-coupon"
                                            select
                                            label="Select Coupon"
                                            value={selectedCoupon}
                                            onChange={handleCouponSelect}
                                            size="small"
                                            fullWidth
                                            sx={{
                                                textAlign: "left",
                                                '& input': {
                                                    fontSize: '12px',
                                                },
                                            }}
                                        >
                                            {coupon.map((option) => (
                                                <MenuItem key={option.coupon_id} value={option.coupon_id}>
                                                    {option.coupon_code}
                                                </MenuItem>
                                            ))}
                                        </TextField> */}
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            id="outlined-select-amount"
                            // label="Amount"
                            placeholder='Amount'
                            size="small"
                            fullWidth
                            name={totalDiscount ? "final_amount" : "Total_cost"}
                            value={totalDiscount ? `₹${totalDiscount}` : `₹${calculatedAmount}`}
                            disabled
                            sx={{
                                '& input': {
                                    // fontSize: '12px', 
                                    bgcolor: "#CBE3FF",

                                },
                            }}
                        />
                    </Grid>
                </Grid>

            </CardContent>
            <Grid item lg={12} sm={12} xs={12}>
                <Button variant='contained' sx={{ marginTop: "5px", width: '25ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", mx: 6 }}>Update</Button>
            </Grid>
        </Box>
    )
}

export default ServiceInfo
