import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, CardContent, MenuItem, Button, TextField, Grid, Box, Switch, FormControlLabel, Typography } from '@mui/material';
import DatePicker from "react-multi-date-picker";
import Viewservice from "../Viewservice";

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const discount = [
    {
        discount_id: 1,
        label: '%',
    },
    {
        discount_id: 2,
        label: '₹',
    },
    {
        discount_id: 3,
        label: 'Complementary',
    },
    {
        discount_id: 4,
        label: 'VIP',
    },
    {
        discount_id: 6,
        label: 'Coupon',
    },
];

const calculateDateCount = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
};

const ServiceInfo = ({ eveID, srvData, srvID, payData }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    console.log("hi srvData......", srvData);
    console.log("hi payData......", payData);

    const [showComponent, setShowComponent] = useState(false);
    const [service, setService] = useState([]);
    const [subService, setSubService] = useState([]);
    const [gender, setGender] = useState([]);
    const [endDateError, setEndDateError] = useState('');

    // useState for get service data 
    const [serviceData, setServiceData] = useState({ ...srvData });
    const [paymentData, setPaymentData] = useState({ ...payData });
    console.log('Payment Data,,,,,,,,,,:', paymentData);
    const [selectedService, setSelectedService] = useState(serviceData.srv_id.srv_id);
    const [selectedSubService, setSelectedSubService] = useState(serviceData.sub_srv_id.sub_srv_id);
    const [startDate, setStartDate] = useState(serviceData.start_date);
    const [endDate, setEndDate] = useState(serviceData.end_date);
    const [srvHrs, setSrvHrs] = useState(
        serviceData.sub_srv_id
            ? serviceData.sub_srv_id.Service_Time
            : null
    );
    const [values, setValues] = useState(serviceData ? serviceData.service_dates : '');
    const [selectedDates, setSelectedDates] = useState([]);
    const [dateCount, setDateCount] = useState(0);
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];

    // const [medTransAmt, setMedTransAmt] = useState('');
    const [medTransAmt, setMedTransAmt] = useState(() => paymentData?.total_cost || '');
    // const [medTransAmt, setMedTransAmt] = useState(getCost);
    // const [getCost, setGetCost] = useState(0);
    const [getCost, setGetCost] = useState(
        serviceData.sub_srv_id
            ? serviceData.sub_srv_id.cost
            : medTransAmt
    );
    console.log("getCosttttttttt", getCost)

    const [errorMsg, setErrorMsg] = useState("");
    const currentDatesString = new Date().toISOString().slice(0, 10);
    const [startTime, setStartTime] = useState(serviceData ? serviceData.start_time : '');
    const [endTime, setEndTime] = useState(serviceData ? serviceData.end_time : '');

    const [selectedGender, setSelectedGender] = useState(serviceData.prof_prefered);
    // const [selectedDiscountId, setSelectedDiscountId] = useState(5);
    // const [discountValue, setDiscountValue] = useState(selectedDiscountId === 3 || selectedDiscountId === 4 ? 0 : 0);
    // const [selectedDiscountId, setSelectedDiscountId] = useState(paymentData ? paymentData.discount_type : 5);
    // const [discountValue, setDiscountValue] = useState(paymentData ? paymentData.discount_value : selectedDiscountId === 3 || selectedDiscountId === 4 ? 0 : 0);

    const [selectedDiscountId, setSelectedDiscountId] = useState(paymentData?.discount_type || 5);
    const [discountValue, setDiscountValue] = useState(() =>
        paymentData?.discount_value ?? (selectedDiscountId === 3 || selectedDiscountId === 4 ? 0 : null));

    const disValue = discountValue === null ? 0 : discountValue
    console.log("selectedDiscountId...--", selectedDiscountId, "discountValue...--", disValue);
    const [calculatedAmount, setCalculatedAmount] = useState('');
    const [totalDiscount, setTotalDiscount] = useState(selectedDiscountId === 3 || selectedDiscountId === 4 ? 0 : '');
    const [coupon, setCoupon] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState('');
    const [selectedCouponType, setSelectedCouponType] = useState('');
    const [couponValue, setCouponValue] = useState('');
    const [convenience, setConvenience] = useState(0);
    const [dayConvinance, setDayConvenience] = useState(0);
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [storedValue, setStoredValue] = useState(2);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        if (selectedDiscountId === 3 || selectedDiscountId === 4) {
            setDiscountValue(0);
        }
    }, [selectedDiscountId]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const [errors, setErrors] = useState({
        startTime: '',
        endTime: '',
    });

    const calculateEndTime = (start, hours) => {
        const startDateTime = new Date(`2000-01-01 ${start}`);
        const endDateTime = new Date(startDateTime.getTime() + hours * 60 * 60 * 1000);
        return endDateTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    };

    const validateTimes = (start, end) => {
        const startParts = start.split(':');
        const endParts = end.split(':');

        const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

        let errors = { startTime: '', endTime: '' };
        setErrors(errors);
    };

    useEffect(() => {
        if (startTime && srvHrs) {
            const calculatedEndTime = calculateEndTime(startTime, srvHrs);
            setEndTime(calculatedEndTime);
        } else if (serviceData) {
            setEndTime(serviceData.end_time);
        } else {
            setEndTime('');
        }
    }, [startTime, srvHrs, serviceData]);

    useEffect(() => {
        if (startTime && endTime) {
            validateTimes(startTime, endTime);
        }
    }, [startTime, endTime]);

    const handleSwitchChange = (event) => {
        const isChecked = event.target.checked;
        setIsSwitchOn(isChecked);
        setStoredValue(isChecked ? 1 : 2);
    };

    // const convertDatesToRanges = (dates) => {
    //     if (!dates.length) return [];

    //     const ranges = [];
    //     let start = dates[0];
    //     let end = start;

    //     for (let i = 1; i < dates.length; i++) {
    //         const currentDate = new Date(dates[i]);
    //         const previousDate = new Date(dates[i - 1]);
    //         const diffTime = Math.abs(currentDate - previousDate);
    //         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    //         if (diffDays > 1) {
    //             ranges.push([start, end]);
    //             start = dates[i];
    //         }
    //         end = dates[i];
    //     }
    //     ranges.push([start, end]);
    //     return ranges;
    // };

    const convertDatesToRanges = (dates) => {
        if (!dates.length) return [];

        const ranges = [];
        let start = new Date(dates[0]);
        let end = start;

        for (let i = 1; i < dates.length; i++) {
            const currentDate = new Date(dates[i]);
            const previousDate = new Date(dates[i - 1]);
            const diffDays = Math.ceil(
                Math.abs(currentDate - previousDate) / (1000 * 60 * 60 * 24)
            );
            if (diffDays > 1) {
                ranges.push([start.toISOString().split("T")[0], end.toISOString().split("T")[0]]);
                start = currentDate;
            }
            end = currentDate;
        }
        ranges.push([start.toISOString().split("T")[0], end.toISOString().split("T")[0]]);
        return ranges;
    };

    const handleSelectedDateChange = (values) => {
        console.log('New Values:', values);
        // setValues(values);

        const formattedValues = values.map(range => {
            if (range && range.length === 2) {
                const startDate = range[0]?.format('YYYY-MM-DD');
                const endDate = range[1]?.format('YYYY-MM-DD');
                return [startDate, endDate];
            } else if (range && range.length === 1) {
                const singleDate = range[0]?.format('YYYY-MM-DD');
                return [singleDate, singleDate];
            }
            return ['', ''];
        });

        console.log('Formatted Values:', formattedValues);

        const totalDates = formattedValues.reduce((count, [start, end]) => {
            if (start && end) {
                const startDate = new Date(start);
                const endDate = new Date(end);
                const diffTime = Math.abs(endDate - startDate);
                return count + Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            }
            return count;
        }, 0);

        console.log('Total Dates:', totalDates);
        setSelectedDates(formattedValues);
        setValues(formattedValues);
        // setValues(values || []);
        setDateCount(totalDates);
    };

    useEffect(() => {
        if (selectedDiscountId === 3 || selectedDiscountId === 4) {
            setDiscountValue(0);
        }
    }, [selectedDiscountId]);

    useEffect(() => {
        if (Array.isArray(values) && values.length >= 0) {
            let dateRanges;
            if (serviceData) {
                dateRanges = convertDatesToRanges(values.flat().map((date) => new Date(date).getTime()));
                console.log("Date Ranges", dateRanges)
            } else {
                dateRanges = values.map(range => {
                    if (range && range.length === 2) {
                        const startDate = range[0]?.format('YYYY-MM-DD');
                        const endDate = range[1]?.format('YYYY-MM-DD');
                        return [startDate, endDate];
                    } else if (range && range.length === 1) {
                        const singleDate = range[0]?.format('YYYY-MM-DD');
                        return [singleDate, singleDate];
                    }
                    return ['', ''];
                });
            }
            const totalDates = dateRanges.reduce((count, [start, end]) => {
                if (start && end) {
                    return count + calculateDateCount(start, end);
                }
                return count;
            }, 0);
            setSelectedDates(dateRanges);
            setDateCount(totalDates);
        } else {
            setSelectedDates([]);
            setDateCount(0);
        }
    }, [values, dateCount, serviceData]);

    console.log('Selected Date vlaues:', values);
    console.log("Rendering DatePicker with values:", selectedDates);
    console.log('Selected Dates count:', dateCount);

    useEffect(() => {
        if (serviceData && serviceData.srv_id) {
            setSelectedService(serviceData.srv_id.srv_id);
        }
    }, [serviceData]);

    const handleClick = () => {
        setShowComponent(true);
    };

    const handleDropdownService = (event) => {
        const selectedService = event.target.value;
        setSelectedService(selectedService);
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
        setPaymentData({ ...payData, [field]: value });
    };

    const handleDropdownCoupon = (event) => {
        const selectedValue = event.target.value;
        setSelectedCoupon(selectedValue);
        const selectedCouponCode = coupon.find(coupon => coupon.coupon_id === selectedValue);
        if (selectedCouponCode) {
            setCouponValue(selectedCouponCode.discount_value);
            console.log("selectedCouponCode......", selectedCouponCode.discount_value)
            setSelectedCouponType(selectedCouponCode.discount_type)
        } else {
            setCouponValue('');
        }
    };

    // const handleDiscountChange = (e) => {
    //     const value = e.target.value;
    //     const integerPattern = /^\d*$/;
    //     if (value === '' || integerPattern.test(value)) {
    //         setDiscountValue(value);
    //     }
    // };

    const handleDiscountChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setDiscountValue(value || 0);
        }
    };

    const isDiscountValueValid = () => {
        // return (
        //     (selectedDiscountId === 1 || selectedDiscountId === 2) &&
        //     (typeof discountValue === 'string' && discountValue.trim() !== '')
        // );
        return (
            (selectedDiscountId === 1 || selectedDiscountId === 2) &&
            discountValue !== null &&
            discountValue !== undefined &&
            discountValue !== '' &&
            !isNaN(Number(discountValue)) &&
            Number(discountValue) > 0
        );
    };

    useEffect(() => {
        const getGender = async () => {
            try {
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

    useEffect(() => {
        const getService = async () => {
            try {
                const res = await fetch(`${port}/web/agg_hhc_services_api`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                // console.log("Service Data", data);
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
                    const res = await fetch(`${port}/web/agg_hhc_sub_services_api/${selectedService}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    // console.log("Sub Service Data", data);
                    setSubService(data);
                } catch (error) {
                    console.error("Error fetching sub service data:", error);
                }
            }
        };
        getSubService();
    }, [selectedService]);

    // const handleSubServiceSelect = (event) => {
    //     const subServiceId = event.target.value;
    //     const selectedSubService = subService.find(item => item.sub_srv_id === subServiceId);
    //     if (selectedSubService) {
    //         setSelectedSubService(subServiceId);
    //         setGetCost(selectedSubService.cost);
    //     }
    // };

    const handleSubServiceSelect = (event) => {
        const subServiceId = event.target.value;
        const selectedSubService = subService.find(item => item.sub_srv_id === subServiceId);
        if (selectedSubService) {
            setSelectedSubService(subServiceId);
            if (srvID === 10) {
                setGetCost(medTransAmt);
            } else {
                setGetCost(selectedSubService.cost);
            }
            setSrvHrs(selectedSubService.Service_Time);
        }
    };

    useEffect(() => {
        setSelectedService(
            serviceData
                ? serviceData.srv_id
                : ''
        );
        setSelectedSubService(serviceData.sub_srv_id
            ? serviceData.sub_srv_id.sub_srv_id
            : '');
        setSrvHrs(
            serviceData.sub_srv_id
                ? serviceData.sub_srv_id.Service_Time
                : null
        );
        setValues(serviceData ? serviceData.service_dates : '');
        setSelectedDates(serviceData ? serviceData.service_dates : '');

        setStartTime(serviceData ? serviceData.start_time : '');
        setEndTime(serviceData ? serviceData.end_time : '');

        setGetCost(serviceData.sub_srv_id
            ? serviceData.sub_srv_id.cost
            : medTransAmt
        )
    }, [serviceData]);

    useEffect(() => {
        if (paymentData?.total_cost && medTransAmt === "") {
            setMedTransAmt(paymentData.total_cost);
        }
    }, [paymentData]);

    useEffect(() => {
        if (srvID === 10) {
            setGetCost(medTransAmt);
        }
    }, [medTransAmt, srvID]);

    useEffect(() => {
        if (srvID === 10 && medTransAmt && dateCount > 0) {
            setCalculatedAmount(parseInt(medTransAmt, 10) * dateCount);
        } else {
            setCalculatedAmount("");
        }
    }, [medTransAmt, srvID, dateCount]);

    useEffect(() => {
        if (paymentData) {
            setSelectedDiscountId(paymentData.discount_type || 5);
            setDiscountValue(paymentData
                ? paymentData.discount_value
                : (selectedDiscountId === 3 || selectedDiscountId === 4)
                    ? 0
                    : 0);
        }
    }, [paymentData]);

    useEffect(() => {
        const calculateTotalAmount = async () => {
            console.log("Cost, Dates.....", getCost, dateCount);
            const effectiveDateCount = srvID === 11 ? 1 : dateCount;
            if (getCost && effectiveDateCount) {
                console.log("Cost, Dates.....", getCost, effectiveDateCount);
                try {
                    const url = `${port}/web/calculate_total_amount/${getCost}/${effectiveDateCount}/`;
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Calculated Service Cost datewise.....", data.days_difference);
                    const total = data.days_difference + data.total_convinance;
                    setCalculatedAmount(data.days_difference);
                    setConvenience(data.total_convinance);
                    setDayConvenience(data.day_convinance);

                    setPaymentData(prevState => ({
                        ...prevState,
                        // final_amount: data.days_difference,
                        Total_Amount: data.days_difference,
                    }));
                } catch (error) {
                    console.error("Error fetching Calculated Amount:", error);
                }
            }
        };
        calculateTotalAmount();
    }, [getCost, dateCount, calculatedAmount]);

    useEffect(() => {
        const calculateDiscount = async () => {
            if (calculatedAmount && selectedDiscountId !== null) {
                console.log("Discount Amount.....", selectedDiscountId, discountValue, selectedCoupon, couponValue, calculatedAmount);
                try {
                    let url;
                    if (selectedDiscountId === 3) {
                        url = `${port}/web/calculate_discount_api/${selectedDiscountId}/0/${calculatedAmount}`;
                    } else if (selectedDiscountId === 4) {
                        url = `${port}/web/calculate_discount_api/${selectedDiscountId}/0/${calculatedAmount}`;
                    } else if (selectedDiscountId === 1 || selectedDiscountId === 2) {
                        url = `${port}/web/calculate_discount_api/${selectedDiscountId}/${discountValue}/${calculatedAmount}`;
                    } else if (selectedDiscountId === 6) {
                        url = `${port}/web/calculate_discount_api/${selectedCouponType}/${couponValue}/${calculatedAmount}`;
                        console.log("Calculated Amount with Discount.....", url);
                    }
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    setTotalDiscount(data.final_amount);
                    setPaymentData(prevState => ({
                        ...prevState,
                        // final_amount: data.final_amount,
                        Total_Amount: data.final_amount,
                    }));
                    console.log("Calculated Amount with Discount.....", data.final_amount);
                } catch (error) {
                    console.error("Error fetching Calculated Amount with Discount:", error);
                }
            } else {
                setTotalDiscount(calculatedAmount);
            }
        };
        calculateDiscount();
    }, [calculatedAmount, selectedDiscountId, discountValue, selectedCouponType, couponValue, totalDiscount]);

    useEffect(() => {
        if (totalDiscount !== null || totalDiscount !== undefined) {
            console.log("Warning: totalDiscount is not set as expected");
            setTotalDiscount(totalDiscount);
        }
    }, [totalDiscount]);

    useEffect(() => {
        if (srvID === 10 && medTransAmt && dateCount > 0) {
            setCalculatedAmount(parseInt(medTransAmt, 10) * dateCount);
        } else {
            setCalculatedAmount("");
        }
    }, [medTransAmt, srvID, dateCount]);

    useEffect(() => {
        const getCoupon = async () => {
            try {
                const url = `${port}/web/Get_Coupons/`;
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Find coupon code.....", data);
                setCoupon(data);
            } catch (error) {
                console.error("Error fetching coupon code:", error);
            }
        }
        getCoupon();
    }, []);

    // useEffect(() => {
    //     if (paymentData?.total_cost/dateCount && medTransAmt === '') {
    //         setMedTransAmt(paymentData.total_cost/dateCount);
    //     }
    // }, [paymentData]);

    // const addSecondsToTime = (time) => {
    //     if (time.split(":").length === 2) {
    //         return `${time}:00`;
    //     }
    //     return time;
    // };

    useEffect(() => {
        if (paymentData?.Total_Amount && medTransAmt === '') {
            setMedTransAmt(paymentData.Total_Amount);
        }
    }, [paymentData]);

    useEffect(() => {
        if (srvID === 10) {
            setGetCost(medTransAmt);
        }
    }, [medTransAmt, srvID]);

    const addSecondsToTime = (time) => {
        if (time.split(":").length === 2) {
            return `${time}:00`;
        }
        return time;
    };

    async function saveServiceUpdate(event) {
        event.preventDefault();
        const dateRanges = selectedDates.length
            ? selectedDates
            : convertDatesToRanges(values);

        const requestData = {
            sub_srv_id: selectedSubService,
            Total_cost: srvID === 10 ? medTransAmt*dateCount : calculatedAmount,
            discount_type: selectedDiscountId,
            discount: disValue || 0,
            // discount: paymentData?.discount_value || 0,
            final_amount: paymentData.Total_Amount,
            is_srv_date_chng: storedValue,
            // start_time: serviceData.start_time,
            // end_time: serviceData.end_time,
            start_time: addSecondsToTime(startTime),
            end_time: addSecondsToTime(endTime),
            // date_ranges: dateRanges,
            date_ranges: selectedDates,
        };
        console.log("Service Update API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/update_sub_srv_eventwise/${eveID}/1/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) {
                // throw new Error(`HTTP error! Status: ${response.status}`);
                setOpenSnackbar(true);
                setSnackbarMessage('The payment has already been made, so the service details cannot be changed.');
                setSnackbarSeverity('warning');
            } else {
                const result = await response.json();
                console.log("Results.....", result);
                setOpenSnackbar(true);
                setSnackbarMessage('Service details updated successfully.');
                setSnackbarSeverity('success');
                // onClose();
                window.location.reload();
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <Box>
            <CardContent>
                <Grid container spacing={2} sx={{ marginTop: "1px" }}>
                    {serviceData && (
                        <>
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
                                    disabled
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
                                    // onChange={handleDropdownSubService}
                                    onChange={handleSubServiceSelect}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        textAlign: "left", '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                    SelectProps={{
                                        MenuProps: {
                                            PaperProps: {
                                                style: {
                                                    maxHeight: '250px',
                                                    maxWidth: '200px',
                                                },
                                            },
                                        },
                                    }}
                                >
                                    {subService.map((option) => (
                                        <MenuItem key={option.sub_srv_id} value={option.sub_srv_id} sx={{ fontSize: "14px" }}>
                                            {selectedService && option.recommomded_service}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item lg={12} sm={12} xs={12}>
                                <div style={{ display: "flex" }}>
                                    <FormControlLabel control={<Switch checked={isSwitchOn} onChange={handleSwitchChange} />} />
                                    <Typography variant='subtitle2' sx={{ fontSize: "14px", color: "#1976D2", }}>Are you sure want to change the date?</Typography>
                                </div>
                            </Grid>

                            {isSwitchOn && (
                                <Grid item lg={12} sm={12} xs={12}>
                                    <DatePicker
                                        multiple
                                        range
                                        value={values}
                                        onChange={handleSelectedDateChange}
                                        containerStyle={{
                                            width: "100%"
                                        }}
                                        minDate={currentDatesString}
                                        render={(value, openCalendar) => (
                                            <TextField
                                                onClick={openCalendar}
                                                label='Select New Date *'
                                                placeholder='YYYY/MM/DD'
                                                size="small"
                                                fullWidth
                                                // value={selectedDates.join(', ')}
                                                value={selectedDates}
                                                sx={{
                                                    textAlign: "left",
                                                    '& input': {
                                                        fontSize: '14px',
                                                    },
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            )}

                            <Grid container spacing={1} sx={{ mt: 2, ml: 1 }}>
                                <Grid item lg={6} sm={6} xs={6}>
                                    <TextField
                                        required
                                        id="start_time"
                                        name="start_time"
                                        label="Start Time"
                                        type="time"
                                        // value={enqToServiceSrv ? enqToServiceSrv.start_time : startTime}
                                        // onChange={(e) => enqToServiceSrv ? handleFieldChange("start_time", e.target.value) : setStartTime(e.target.value)}
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={serviceData ? false : !!errors.startTime}
                                        helperText={serviceData ? '' : errors.startTime}
                                    />
                                </Grid>

                                <Grid item lg={6} sm={6} xs={6}>
                                    <TextField
                                        required
                                        id="end_time"
                                        name="end_time"
                                        label="End Time"
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        // value={enqToServiceSrv.end_time ? enqToServiceSrv.end_time : endTime}
                                        // onChange={(e) => enqToServiceSrv.end_time ? handleFieldChange("end_time", e.target.value) : setEndTime(e.target.value)}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        error={serviceData.end_time === null && !endTime || !!errors.endTime}
                                        helperText={serviceData.end_time === null && !endTime ? 'This field is required' : errors.endTime || ''}
                                    />
                                </Grid>
                            </Grid>

                            <Grid item lg={12} sm={12} xs={12}>
                                {srvID === 10 && (
                                    <TextField
                                        required
                                        id="med_Trans_amount"
                                        name="med_Trans_amount"
                                        label="Enter Amount"
                                        size="small"
                                        fullWidth
                                        value={medTransAmt}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                setMedTransAmt(value);
                                            }
                                        }}
                                        // onChange={handleMedTransAmtChange}
                                        // onBlur={handleBlur}
                                        sx={{
                                            textAlign: "left", '& input': {
                                                fontSize: '14px',
                                            },
                                        }}
                                        inputProps={{
                                            maxLength: 5,
                                        }}
                                        error={!/^\d*$/.test(medTransAmt)}
                                        helperText={!/^\d*$/.test(medTransAmt) ? "Please enter a valid integer." : ""}
                                    />
                                )}
                                {errorMsg && <Typography variant='body2' style={{ color: "red", marginTop: "8px", fontSize: "14px" }}>{errorMsg}</Typography>}
                            </Grid>

                        </>
                    )}

                    {paymentData && (
                        <>
                            <Grid item lg={12} sm={12} xs={12} sx={{ ml: 1 }}>
                                <Grid container spacing={1}>
                                    <Grid xs={(selectedDiscountId === 3 || selectedDiscountId === 4 || selectedDiscountId === 5) ? 12 : 6} sx={{ marginTop: 1 }}>
                                        <TextField
                                            id="outlined-select-percentage"
                                            name="discount_type"
                                            select
                                            label="Discount Type"
                                            // value={enqToServicePay.discount_type ? enqToServicePay.discount_type : selectedDiscountId}
                                            // onChange={handleDiscountTypeChange}
                                            value={selectedDiscountId}
                                            onChange={(e) => {
                                                // setSelectedDiscountId(e.target.value);
                                                // setPaymentData((prev) => ({ ...prev, discount_type: e.target.value }));
                                                if (srvID === 10 && !medTransAmt) {
                                                    setErrorMsg("Please enter Amount then only discount type will be changed")
                                                } else {
                                                    setErrorMsg(" ");
                                                    const newDiscountId = e.target.value;
                                                    setSelectedDiscountId(newDiscountId);
                                                    setPaymentData((prev) => ({ ...prev, discount_type: newDiscountId }));
                                                }
                                            }}
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
                                        {selectedDiscountId === 1 && (
                                            <TextField
                                                id="discount-percentage"
                                                name="discount_value"
                                                label="Discount in %"
                                                size="small"
                                                fullWidth
                                                type="number"
                                                // value={enqToServicePay.discount_value ? enqToServicePay.discount_value : discountValue}
                                                value={discountValue}
                                                // onChange={handleDiscountChange}
                                                onChange={(e) => {
                                                    handleDiscountChange(e);
                                                    setPaymentData((prev) => ({ ...prev, discount_value: e.target.value }));
                                                }}
                                                error={!isDiscountValueValid()}
                                                helperText={!isDiscountValueValid() && 'This is required'}
                                                sx={{
                                                    textAlign: "left",
                                                    '& input': {
                                                        fontSize: '16px',
                                                    },
                                                }}
                                            />
                                        )}

                                        {selectedDiscountId === 2 && (
                                            <TextField
                                                id="discount-currency"
                                                name="discount_value"
                                                label="Discount in ₹"
                                                size="small"
                                                fullWidth
                                                type="number"
                                                // value={enqToServicePay.discount_value ? enqToServicePay.discount_value : discountValue}
                                                value={discountValue}
                                                // onChange={handleDiscountChange}
                                                onChange={(e) => {
                                                    handleDiscountChange(e);
                                                    setPaymentData((prev) => ({ ...prev, discount_value: e.target.value }));
                                                }}
                                                error={!isDiscountValueValid()}
                                                helperText={!isDiscountValueValid() && 'This is required'}
                                                sx={{
                                                    textAlign: "left",
                                                    '& input': {
                                                        fontSize: '16px',
                                                    },
                                                }}
                                            />
                                        )}

                                        {selectedDiscountId === 6 && (
                                            <TextField
                                                select
                                                id="discount-currency"
                                                name="discount_value"
                                                label="Discount in code"
                                                size="small"
                                                fullWidth
                                                // value={enqToServicePay.Code ? enqToServicePay.Code : selectedCoupon}
                                                value={selectedCoupon}
                                                // onChange={handleDropdownCoupon}
                                                onChange={(e) => {
                                                    handleDropdownCoupon(e);
                                                    setPaymentData((prev) => ({ ...prev, discount_value: e.target.value }));
                                                }}
                                                sx={{
                                                    textAlign: "left",
                                                    '& input': {
                                                        fontSize: '16px',
                                                    },
                                                }}
                                            >
                                                {coupon.map((option) => (
                                                    <MenuItem key={option.coupon_id} value={option.coupon_id}>
                                                        {option.Code}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item lg={12} sm={12} xs={12}>
                                <TextField
                                    id="outlined-select-amount"
                                    placeholder='Amount'
                                    size="small"
                                    fullWidth
                                    // name={totalDiscount ? "final_amount" : "Total_cost"}
                                    // value={totalDiscount ? `₹${totalDiscount}` : `₹${calculatedAmount}`}
                                    name={totalDiscount !== null && totalDiscount !== undefined ? "Total_Amount" : "Total_cost"}
                                    // value={paymentData.Total_Amount ? paymentData.Total_Amount : (
                                    //     selectedDiscountId === 3 ? 0 :
                                    //         `₹${(selectedDiscountId === 4 ? parseFloat(calculatedAmount).toFixed(2) :
                                    //             (discountValue === '' || discountValue === null) ? calculatedAmount :
                                    //                 totalDiscount !== null && totalDiscount !== undefined ? totalDiscount :
                                    //                     calculatedAmount)}`
                                    // )}
                                    // value={
                                    //     selectedDiscountId === 3
                                    //         ? "₹0"
                                    //         : selectedDiscountId === 4
                                    //             ? `₹${parseFloat(calculatedAmount).toFixed(2)}`
                                    //             : discountValue === "" || discountValue === null
                                    //                 ? `₹${calculatedAmount}`
                                    //                 : totalDiscount !== null && totalDiscount !== undefined
                                    //                     ? `₹${totalDiscount}`
                                    //                     : `₹${paymentData.Total_Amount || calculatedAmount}`
                                    // }
                                    value={paymentData?.Total_Amount !== undefined && paymentData?.Total_Amount !== null
                                        ? `₹${paymentData.Total_Amount}`
                                        : `₹${calculatedAmount}`
                                    }
                                    disabled
                                    sx={{
                                        '& input': {
                                            bgcolor: "#CBE3FF",

                                        },
                                    }}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </CardContent>

            <Grid item lg={12} sm={12} xs={12}>
                <Button variant='contained' sx={{ marginTop: "5px", width: '25ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", mx: 6 }} onClick={saveServiceUpdate}>Update</Button>
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert variant="filled"
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%', mr: 3, mb: 20 }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default ServiceInfo
