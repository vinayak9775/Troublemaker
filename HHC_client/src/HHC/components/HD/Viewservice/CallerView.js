import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { CardContent } from '@mui/material';
import Button from '@mui/material/Button';

const CallerView = ({ caller, clrID, onClose }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    const [relation, setRelation] = useState([]);
    const [selectedRelation, setSelectedRelation] = useState('');
    const [call, setCall] = useState([]);
    const [selectedCall, setSelectedCall] = useState('');

    // usestate for updated data
    const [callerData, setCallerData] = useState({ ...caller });
    // const [relData, setRelData] = useState({ caller_rel_id: relationID.relation });

    const handleDropdownRelation = (event) => {
        const selectedRelation = event.target.value;
        setSelectedRelation(selectedRelation);
    };

    const handleDropdownCall = (event) => {
        const selectedCall = event.target.value;
        setSelectedCall(selectedCall);
    };

    useEffect(() => {
        const getRelation = async () => {
            try {
                // const res = await fetch(`${port}/web/agg_hhc_caller_relation_api`);
                const res = await fetch(`${port}/web/agg_hhc_caller_relation_api`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Relation...", data)
                setRelation(data);
            } catch (error) {
                console.error("Error fetching Relation data:", error);
            }
        };
        getRelation();
    }, []);

    useEffect(() => {
        const callPurpose = async () => {
            try {
                // const res = await fetch(`${port}/web/agg_hhc_purpose_call_api`);
                const res = await fetch(`${port}/web/agg_hhc_purpose_call_api`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Call Purpose", data);
                setCall(data);
            } catch (error) {
                console.error("Error fetching Call purpose data:", error);
            }
        };
        callPurpose();
    }, []);

    const handleFieldChange = (field, value) => {
        setCallerData({ ...callerData, [field]: value });
    };

    // const handleRelationChange = (event) => {
    //     const selectedRelationId = event.target.value;
    //     setSelectedRelation(selectedRelationId);
    //     setRelData({ ...relData, caller_rel_id: selectedRelationId });
    // };

    async function saveCallerUpdate(event) {
        event.preventDefault();
        const requestData = {
            phone: callerData.phone,
            caller_fullname: callerData.caller_fullname,
            // caller_rel_id: selectedRelation,
        };
        console.log("Caller Update API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/web/Caller_details_api/${clrID}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            console.log("response....", response)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log("Results.....", result);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <Box>
            <CardContent>
                <Grid item xs={12} container spacing={2} sx={{ marginTop: "1px" }}>
                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            id="phone"
                            name="phone"
                            label="Contact"
                            placeholder="+91 |"
                            size="small"
                            fullWidth
                            value={callerData.phone}
                            onChange={(e) => handleFieldChange("phone", e.target.value)}
                            // value={phoneNumber}
                            // onChange={handlePhoneNumberChange}
                            // onInput={handleInput}
                            // onKeyPress={handleSearch}
                            // error={!!phoneNumberError}
                            // helperText={phoneNumberError}
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
                    <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            label="Full Name"
                            id="outlined-size-small"
                            placeholder="First Name | Last Name *"
                            size="small"
                            fullWidth
                            value={callerData.caller_fullname}
                            onChange={(e) => handleFieldChange("caller_fullname", e.target.value)}
                            sx={{
                                '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        />
                    </Grid>
                    {/* <Grid item lg={12} sm={12} xs={12}>
                        <TextField
                            required
                            id="caller_rel_id"
                            name="caller_rel_id"
                            select
                            label="Select Relation"
                            size="small"
                            fullWidth
                            sx={{
                                textAlign: "left", '& input': {
                                    fontSize: '14px',
                                },
                            }}
                        >
                            {relation.map((option) => (
                                <MenuItem key={option.caller_rel_id} value={option.caller_rel_id}>
                                    {option.relation}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid> */}

                    <Grid item lg={12} sm={12} xs={12}>
                        <Button variant="contained" sx={{ m: 2, width: '25ch', backgroundColor: '#7AB8EE', borderRadius: "12px", textTransform: "capitalize", mx: 5 }} onClick={saveCallerUpdate}>Update</Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Box>
    )
}

export default CallerView
