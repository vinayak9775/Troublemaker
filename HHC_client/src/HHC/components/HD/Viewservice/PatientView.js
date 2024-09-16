import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { CardContent } from '@mui/material';
import Button from '@mui/material/Button';

const PatientView = ({ ptnID, ptnData, hospData, onClose }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [gender, setGender] = useState([]);
    const [hospital, setHospital] = useState([]);
    const [consultant, setConsultant] = useState([]);
    const [state, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [zone, setZone] = useState([]);
    const [patientData, setPatientData] = useState({ ...ptnData });
    const [selectedGender, setSelectedGender] = useState(patientData.gender_id);
    const [selectedConsultant, setSelectedConsultant] = useState(patientData.doct_cons_id.doct_cons_id);
    const [consultantMobile, setConsultantMobile] = useState(patientData.doct_cons_id.mobile_no);
    const [selectedState, setSelectedState] = useState(patientData.state_id.state_id);
    const [selectedCity, setSelectedCity] = useState(patientData.city_id.city_id);
    const [selectedZone, setSelectedZone] = useState(patientData.prof_zone_id.prof_zone_id);
    // const [hospitalData, setHospitalData] = useState({ ...hospData });
    const [selectedHospital, setSelectedHospital] = useState(patientData.preferred_hosp_id.hosp_id);
    const [pincode, setPincode] = useState('');
    const [address, setAddress] = useState('');

    const handleDropdownGender = (event) => {
        const selectedGender = event.target.value;
        setSelectedGender(selectedGender);
    };

    const handleDropdownHospital = (event) => {
        const selectedHospital = event.target.value;
        setSelectedHospital(selectedHospital);
    };

    const handleDropdownState = (event) => {
        const selectedState = event.target.value;
        setSelectedState(selectedState);
    };

    const handleDropdownCity = (event) => {
        const selectedCity = event.target.value;
        setSelectedCity(selectedCity);
    };

    const handleDropdownZone = (event) => {
        const selectedZone = event.target.value;
        setSelectedZone(selectedZone);
    };

    const handleFieldChange = (field, value) => {
        setPatientData({ ...patientData, [field]: value });
        // setHospitalData({ ...hospData, [field]: value });
    };

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

    useEffect(() => {
        const getHospital = async () => {
            try {
                // const res = await fetch(`${port}/web/agg_hhc_hospitals_api`);
                const res = await fetch(`${port}/web/agg_hhc_hospitals_api`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Refer Hospital data", data);
                setHospital(data);
            } catch (error) {
                console.error("Error fetching Refer Hospital data:", error);
            }
        };
        getHospital();
    }, []);

    useEffect(() => {
        const getConsultant = async () => {
            try {
                // const res = await fetch(`${port}/web/agg_hhc_consultant_api`);
                const res = await fetch(`${port}/web/agg_hhc_consultant_HD_api/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Consultant data", data);
                const filteredConsultant = data.filter(option => option.doct_cons_id !== 0);
                setConsultant(filteredConsultant);
            } catch (error) {
                console.error("Error fetching Consultant data:", error);
            }
        };
        getConsultant();
    }, []);

    useEffect(() => {
        const getState = async () => {
            try {
                // const res = await fetch(`${port}/web/agg_hhc_state_api`);
                const res = await fetch(`${port}/web/agg_hhc_state_api`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("State List....", data);
                setState(data);
            } catch (error) {
                console.error("Error fetching Zone data:", error);
            }
        };
        getState();
    }, []);

    useEffect(() => {
        const getCity = async () => {
            if (selectedState) {
                try {
                    // const res = await fetch(`${port}/web/agg_hhc_city_api/${selectedState}`);
                    const res = await fetch(`${port}/web/agg_hhc_city_api/${selectedState}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("City List a/c to State Data", data);
                    setCity(data);
                } catch (error) {
                    console.error("Error fetching city data:", error);
                }
            }
        };
        getCity();
    }, [selectedState]);

    useEffect(() => {
        const getZone = async () => {
            if (selectedCity) {
                try {
                    // const res = await fetch(`${port}/web/agg_hhc_zone_api/${selectedCity}`);
                    const res = await fetch(`${port}/web/agg_hhc_zone_api/${selectedCity}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Zone List a/c to City Data", data);
                    setZone(data);
                } catch (error) {
                    console.error("Error fetching Zone data:", error);
                }
            }
        };
        getZone();
    }, [selectedCity]);


    const handleDropdownConsultant = (event) => {
        const selectedValue = event.target.value;
        setSelectedConsultant(selectedValue);

        const selectedConsultantData = consultant.find(consult => consult.doct_cons_id === selectedValue);
        if (selectedConsultantData) {
            setConsultantMobile(selectedConsultantData.mobile_no);
        } else {
            setConsultantMobile('');
        }
    };

    async function savePatientUpdate(event) {
        event.preventDefault();
        const requestData = {
            agg_sp_pt_id: ptnID,
            name: patientData.name,
            phone_no: patientData.phone_no,
            gender_id: selectedGender,
            Suffered_from: patientData.Suffered_from,
            patient_email_id: patientData.patient_email_id,
            doct_cons_id: selectedConsultant,
            prof_zone_id: selectedZone,
            Age: patientData.Age,
            state_id: selectedState,
            city_id: selectedCity,
            prof_zone_id: selectedZone,
            hospital: selectedHospital,
            address: patientData.address, 
        };
        console.log("Patient Update API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/patient_detail_info_api/${ptnID}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            // console.log("response....", response)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Results.....", result);
            onClose();
            window.location.reload()
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <Box>
            <CardContent>
                <Grid container spacing={2} sx={{ marginTop: "1px" }} >
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            id="name"
                            name="name"
                            label="Patient Name"
                            placeholder="First Name | Last Name *"
                            size="small"
                            fullWidth
                            value={patientData.name}
                            onChange={(e) => handleFieldChange("name", e.target.value)}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={8}>
                                <TextField
                                    required
                                    id="gender_id"
                                    name="gender_id"
                                    select
                                    label="Gender"
                                    defaultValue={selectedGender}
                                    onChange={handleDropdownGender}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        textAlign: "left",
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                >
                                    {gender.map((option) => (
                                        <MenuItem key={option.gender_id} value={option.gender_id} sx={{ fontSize: "14px" }}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Age"
                                    id="Age"
                                    name="Age"
                                    value={patientData.Age}
                                    onChange={(e) => handleFieldChange("Age", e.target.value)}
                                    // onChange={handleAgeValidation}
                                    size="small"
                                    fullWidth
                                    // error={!!validationMessage}
                                    // helperText={validationMessage}
                                    sx={{
                                        '& input': {
                                            fontSize: '14px',
                                        },
                                    }}
                                />

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            required
                            label="Hospital Name"
                            id="hosp_id"
                            name="hosp_id"
                            select
                            placeholder='Hospital Name'
                            size="small"
                            fullWidth
                            defaultValue={selectedHospital}
                            onChange={handleDropdownHospital}
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                },
                            }}
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            maxHeight: '200px', // Adjust the height as needed
                                            maxWidth: '220px',
                                        },
                                    },
                                },
                            }}
                        >
                            {hospital.map((option) => (
                                <MenuItem key={option.hosp_id} value={option.hosp_id} sx={{ fontSize: "14px" }}>
                                    {option.hospital_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            required
                            label="Suffered From"
                            id="Suffered_from"
                            name="Suffered_from"
                            value={patientData.Suffered_from}
                            onChange={(e) => handleFieldChange("Suffered_from", e.target.value)}
                            placeholder='Remark'
                            type="textarea"
                            size="small"
                            fullWidth
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            required
                            label="Contact"
                            id="phone_no"
                            name="phone_no"
                            placeholder='+91 |'
                            size="small"
                            fullWidth
                            value={patientData.phone_no}
                            onChange={(e) => handleFieldChange("phone_no", e.target.value)}
                            // value={ptnNumber}
                            // onChange={handlePtnNumberChange}
                            // onInput={handlePtnInput}
                            // error={!!ptnNumberError}
                            // helperText={ptnNumberError}
                            // inputProps={{
                            //     minLength: 10,
                            //     maxLength: 10,
                            // }}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            required
                            label="Email"
                            id="patient_email_id"
                            placeholder='example@gmail.com'
                            name="patient_email_id"
                            value={patientData.patient_email_id}
                            onChange={(e) => handleFieldChange("patient_email_id", e.target.value)}
                            // error={!!emailError}
                            // helperText={emailError}
                            size="small"
                            fullWidth
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            required
                            label="Consultant Name"
                            id="doct_cons_id"
                            name="doct_cons_id"
                            select
                            size="small"
                            defaultValue={selectedConsultant}
                            onChange={handleDropdownConsultant}
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
                                            maxHeight: '200px', // Adjust the height as needed
                                            maxWidth: '220px',
                                        },
                                    },
                                },
                            }}
                        >
                            {consultant.map((option) => (
                                <MenuItem key={option.doct_cons_id} value={option.doct_cons_id} sx={{ fontSize: "14px" }}>
                                    {option.cons_fullname}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            label="Contact"
                            id="doct_cons_phone"
                            name="doct_cons_phone"
                            placeholder='+91 |'
                            size="small"
                            fullWidth
                            value={consultantMobile}
                            inputProps={{
                                minLength: 10,
                                maxLength: 10,
                            }}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            required
                            label="State"
                            id="state_id"
                            name="state_id"
                            select
                            defaultValue={selectedState}
                            onChange={handleDropdownState}
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
                                            maxHeight: '200px', // Adjust the height as needed
                                            maxWidth: '220px',
                                        },
                                    },
                                },
                            }}
                        >
                            {state.map((option) => (
                                <MenuItem key={option.state_id} value={option.state_id} sx={{ fontSize: "14px" }}>
                                    {option.state_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            required
                            label="City Name"
                            id="city_id"
                            name="city_id"
                            select
                            value={selectedCity}
                            onChange={handleDropdownCity}
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
                                            maxHeight: '200px', // Adjust the height as needed
                                            maxWidth: '220px',
                                        },
                                    },
                                },
                            }}
                        >
                            {city.map((option) => (
                                <MenuItem key={option.city_id} value={option.city_id} sx={{ fontSize: "14px" }}>
                                    {option.city_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            required
                            label="Select Zone"
                            id="prof_zone_id"
                            name="prof_zone_id"
                            select
                            value={selectedZone}
                            onChange={handleDropdownZone}
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
                                            maxHeight: '200px',
                                            maxWidth: '220px',
                                        },
                                    },
                                },
                            }}
                        >
                            {zone.map((option) => (
                                <MenuItem key={option.prof_zone_id} value={option.prof_zone_id} sx={{ fontSize: "14px" }}>
                                    {option.Name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                        <TextField
                            id="pincode"
                            label="Pincode"
                            placeholder='Pincode'
                            name="pincode"
                            size="small"
                            fullWidth
                            value={patientData.pincode}
                            onChange={(e) => handleFieldChange("pincode", e.target.value)}
                            sx={{
                                textAlign: "left",
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            label="Address"
                            id="address"
                            name="address"
                            placeholder='Lane,Area,Street'
                            value={patientData.address}
                            onChange={(e) => handleFieldChange("address", e.target.value)}
                            size="small"
                            fullWidth
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>
                    <Grid item lg={12} sm={12} xs={12}>
                        <Button variant="contained" sx={{ m: 1, mx: 8, width: '30ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", }} onClick={savePatientUpdate}>Update</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Box>
    )
}

export default PatientView
