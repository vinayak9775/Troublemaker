import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import { TextField, Button, Modal, IconButton, FormControl, InputLabel, Select } from '@mui/material';
import { Snackbar, SnackbarContent } from '@mui/material';
import HRNavbar from '../HR/HRNavbar';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const PermissionCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    marginRight: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "43px",
    borderRadius: '10px',
    transition: '0.5s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        cursor: 'pointer',
    },
});

const Permission = () => {

    const colleagueId = localStorage.getItem('clg_id');
    const accessToken = localStorage.getItem('token');
    const port = process.env.REACT_APP_API_KEY;
    ////////////////// Module Fetch API ////////////////////
    const [loginGroup, setLoginGroup] = useState([]);
    const [userGroup, setUserGroup] = useState([]);
    const [userGroupID, setUserGroupID] = useState([]);
    console.log(userGroupID, 'userGroupIDuserGroupID');
    const [selectedGroupId, setSelectedGroupId] = useState('');
    console.log(selectedGroupId, 'selectedGroupIdselectedGroupIdselectedGroupId');
    //// checked modules and submoduled stored 
    const [checkedModules, setCheckedModules] = useState([]);
    const [checkedSubModules, setCheckedSubModules] = useState([]);
    const [id, setId] = useState('');
    const [checkedGroups, setCheckedGroups] = useState([]);
    console.log(id, 'idididididididi');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleGroupChange = (event) => {
        const newSelectedGroupId = event.target.value;

        // Clear checkedModules and checkedSubModules states
        setCheckedModules([]);
        setCheckedSubModules([]);

        // Update selectedGroupId state
        setSelectedGroupId(newSelectedGroupId);
    };
    ///fetch the group List 

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await fetch(`${port}/web/groups/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                setLoginGroup(data)
            }
            catch (error) {
                console.log('Error Fetching Data');
            }
        }
        fetchGroup();
    }, [])

    ///////// GET API All Module And SubModule
    useEffect(() => {
        const fetchModuleName = async () => {
            try {
                const response = await fetch(`${port}/web/combined/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                // const groupNames = data.map(group => group.group_name);

                ///updated permission code
                const groupNames = data.map(group => ({
                    r_m_id: group.r_m_id,
                    r_m_name: group.r_m_name
                }));

                console.log(groupNames, 'Group Name');
                setUserGroup(data)
            }
            catch (error) {
                console.log('Error Fetching Data');
            }
        }
        fetchModuleName();
    }, [])

    /////// Checked Module and Submodule as per Selected ID
    useEffect(() => {
        const fetchModuleName = async () => {
            if (selectedGroupId) {
                try {
                    const response = await fetch(`${port}/web/combined/${selectedGroupId}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await response.json();
                    setUserGroupID(data);
                    setId(data && data.length > 0 ? data[0].id : null);

                    // Extracting modules, submodules, and r_m_id
                    const checkedModulesFromAPI = data.flatMap(group =>
                        group.modules_submodule.flatMap(module => module.modules.map(m => m.module_id))
                    );

                    const checkedSubmodulesFromAPI = data.flatMap(group =>
                        group.modules_submodule.flatMap(module =>
                            module.modules.flatMap(m => m.submodules.map(sub => sub.permission_id))
                        )
                    );

                    // Extracting r_m_id for checkedGroups
                    const checkedGroupsFromAPI = data.flatMap(group =>
                        group.modules_submodule.map(module => module.r_m_id)
                    );

                    // Update checkedModules, checkedSubModules, and checkedGroups
                    setCheckedModules(prevModules => [...new Set([...prevModules, ...checkedModulesFromAPI])]);
                    setCheckedSubModules(prevSubmodules => [...new Set([...prevSubmodules, ...checkedSubmodulesFromAPI])]);
                    setCheckedGroups(prevGroups => [...new Set([...prevGroups, ...checkedGroupsFromAPI])]);

                    console.log(data[0]?.id, 'Id Wise Response');
                    const checkRole = data[0].role;
                    console.log(checkRole, 'Extracted Role');
                } catch (error) {
                    console.log('Error Fetching Data', error);
                }
            } else {
                console.log('No selected group ID');
            }
        };
        fetchModuleName();
    }, [selectedGroupId, port, accessToken]);

    const handleMasterCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {

            const allGroups = userGroup.map(group => group.r_m_id);

            // Check all modules and submodules
            const allModules = userGroup.flatMap(group =>
                group.modules.map(module => module.module_id)
            );
            const allSubmodules = userGroup.flatMap(group =>
                group.modules.flatMap(module =>
                    module.submodules.map(submodule => submodule.Permission_id)
                )
            );
            setCheckedGroups(allGroups);
            setCheckedModules(allModules);
            setCheckedSubModules(allSubmodules);
            // setCheckedGroups(userGroup.map(group => group.r_m_name)); // Check all groups if needed
        } else {
            // Uncheck all modules and submodules
            setCheckedModules([]);
            setCheckedSubModules([]);
            setCheckedGroups([]); // Uncheck all groups if needed
        }
    };

    const handleGroupCheckboxChange = (groupId, modules) => {
        let updatedCheckedModules = [...checkedModules];
        let updatedCheckedSubModules = [...checkedSubModules];

        // If group is already checked, remove all related modules and submodules
        if (checkedGroups.includes(groupId)) {
            updatedCheckedModules = updatedCheckedModules.filter(
                moduleId => !modules.some(module => module.module_id === moduleId)
            );
            updatedCheckedSubModules = updatedCheckedSubModules.filter(
                submoduleId => !modules.some(module =>
                    module.submodules.some(submodule => submodule.Permission_id === submoduleId)
                )
            );
            setCheckedGroups(checkedGroups.filter(id => id !== groupId));
        } else {
            // If the group is being checked, check only the selected group's modules and submodules
            modules.forEach((module) => {
                if (!updatedCheckedModules.includes(module.module_id)) {
                    updatedCheckedModules.push(module.module_id);
                }
                module.submodules.forEach((submodule) => {
                    if (!updatedCheckedSubModules.includes(submodule.Permission_id)) {
                        updatedCheckedSubModules.push(submodule.Permission_id);
                    }
                });
            });
            setCheckedGroups([...checkedGroups, groupId]);
        }

        setCheckedModules(updatedCheckedModules);
        setCheckedSubModules(updatedCheckedSubModules);
    };

    const handleModuleCheckboxChange = (module_id) => {
        // Check if the module_id is already 
        if (checkedModules.includes(module_id)) {
            // if it is checked then uncheck it
            setCheckedModules(checkedModules.filter(id => id !== module_id));

            /// remove the sub module from  unchecked module
            setCheckedSubModules(checkedSubModules.filter(submodule_id => !userGroup.find(group => group.modules.find(module => module.module_id === module_id && module.submodules.find(submodule => submodule.Permission_id === submodule_id)))));
            console.log('Unchecked Module:', userGroup.find(group => group.modules.find(module => module.module_id === module_id)).modules.find(module => module.module_id === module_id).name);
        }
        else {
            // if it is uncheck then check it
            setCheckedModules([...checkedModules, module_id]);
            const moduleSubmodules = userGroup.find(group => group.modules.find(module => module.module_id === module_id)).modules.flatMap(module => module.submodules.map(submodule => submodule.Permission_id));
            const newCheckedSubmodules = moduleSubmodules.filter(submodule_id => userGroup.find(group => group.modules.find(module => module.module_id === module_id && module.submodules.find(submodule => submodule.Permission_id === submodule_id))));
            setCheckedSubModules([...checkedSubModules, ...newCheckedSubmodules]);
            console.log('Checked Module:', userGroup.find(group => group.modules.find(module => module.module_id === module_id)).modules.find(module => module.module_id === module_id).name);
        }
    };

    const handleSubmoduleCheckboxChange = (submodule_id) => {
        // Check for submodule is already checked
        const isSubmoduleChecked = checkedSubModules.includes(submodule_id);

        //// update the array
        const newCheckedSubModules = isSubmoduleChecked
            ? checkedSubModules.filter(id => id !== submodule_id) /// if checked then remove
            : [...checkedSubModules, submodule_id]; /// if not checked then check it

        //// update with checked
        setCheckedSubModules(newCheckedSubModules);
        const module_id = userGroup.find(group => group.modules.find(module => module.submodules.find(submodule => submodule.Permission_id === submodule_id))).modules.find(module => module.submodules.find(submodule => submodule.Permission_id === submodule_id)).module_id;
        const allModuleSubmodules = userGroup.find(group => group.modules.find(module => module.module_id === module_id)).modules.flatMap(module => module.submodules.map(submodule => submodule.Permission_id));
        const isAllSubmodulesUnchecked = allModuleSubmodules.every(submodule => !newCheckedSubModules.includes(submodule));
        if (isAllSubmodulesUnchecked) {
            setCheckedModules(checkedModules.filter(id => id !== module_id));
        } else if (!checkedModules.includes(module_id)) {
            setCheckedModules([...checkedModules, module_id]);
        }
    };

    const handleSubmit = async () => {
        // Filter userGroup to include only checked modules
        const selectedGroups = userGroup.filter(group => {
            return group.modules.some(module => checkedModules.includes(module.module_id));
        });

        console.log(selectedGroups, 'selectedGroups....');

        // Construct modules_submodule array from selectedGroups
        const modules_submodule = selectedGroups.map(group => {
            const groupModules = group.modules.flatMap(module => {
                if (checkedModules.includes(module.module_id)) {
                    const selectedSubmodules = module.submodules.filter(submodule => checkedSubModules.includes(submodule.Permission_id));
                    return {
                        module_id: module.module_id,
                        module_name: module.name,  // Use module_name instead of name
                        submodules: selectedSubmodules.map(submodule => ({
                            permission_id: submodule.Permission_id,  // Use permission_id instead of Permission_id
                            submodule_name: submodule.name  // Use submodule_name instead of name
                        }))
                    };
                }
                return [];
            });

            return {
                r_m_id: group.r_m_id,  // Assuming group has r_m_id
                r_m_name: group.r_m_name,  // Assuming group has r_m_name
                modules: groupModules
            };
        }).filter(group => group.modules.length > 0);  // Filter out groups with no selected modules

        const postData = {
            modules_submodule,
            role: selectedGroupId  // Assuming selectedGroupId is defined
        };

        console.log('Payload:', postData);

        try {
            let response;
            if (id) {
                // If permissions already exist, send a PUT request
                response = await fetch(`${port}/web/permissions/${id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(postData)
                });
                setSnackbarMessage("Data Updated Successfully");
            } else {
                // If permissions don't exist, send a POST request
                response = await fetch(`${port}/web/permissions/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(postData)
                });
                setSnackbarMessage("Data Submitted Successfully"); // Set snackbar message for submit
            }
            if (response.ok) {
                setSnackbarMessage('Data submitted successfully!');
                setSnackbarSeverity('success');
            } else if (response.status === 400) {
                setSnackbarMessage('Failed to submit data.');
                setSnackbarSeverity('error');
            } else if (response.status === 500) {
                setSnackbarMessage('Something went wrong.');
                setSnackbarSeverity('error');
            }
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const getSnackbarStyle = () => {
        return {
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
        };
    };

    //_______________ Permission Form 
    const [selectedValue, setSelectedValue] = useState('');
    const [openModule, setOpenModule] = useState(false)
    const [openSubModule, setOpenSubModule] = useState(false);
    const [openPermission, setOpenPermission] = useState(false);
    const [module, setModule] = useState([]);
    const [subModule, setSubModule] = useState([]);
    //_______________POST Permission_____________
    const [moduleName, setModuleName] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [subModuleName, setSubModuleName] = useState('');
    const [selectedSubModule, setSelectedSubModule] = useState('')
    const [access, setAccess] = useState('')
    // Module 
    useEffect(() => {
        const fetchModule = async () => {
            try {
                const response = await fetch(`${port}/web/Group_N/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data, 'fetching the Module List Data....');

                if (Array.isArray(data)) {
                    setModule(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                    setModule([]);
                }
            } catch (error) {
                console.log('Error fetching the Response:', error);
                setModule([]);
            }
        };

        fetchModule();
    }, [port]);

    // SubModule
    useEffect(() => {
        const fetchSubModule = async () => {
            try {
                const response = await fetch(`${port}/web/Get_sub_module/${selectedModule}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                console.log(data);
                setSubModule(data);
            }
            catch (error) {
                console.log('Error Fetching Data...');

            }
        }
        fetchSubModule();
    }, [selectedModule])

    const handleClose = (() => {
        setOpenModule(false);
        setOpenSubModule(false);
        setOpenPermission(false);
        setSelectedValue('');
    })

    const handleChange = ((e) => {
        setSelectedValue(e.target.value)
        setModuleName('');
        setSelectedModule('');
        setSubModuleName('');
        setSelectedSubModule('');
        setAccess('');

        if (e.target.value === 1) {
            setOpenModule(true)
        }
        else if (e.target.value === 2) {
            setOpenSubModule(true)
        }
        else if (e.target.value === 3) {
            setOpenPermission(true)
        }
    })

    const handleModuleSubmit = async () => {
        const payload = {
            grp_name: moduleName,
            grp_level: 1,
            grp_parent: 1,
            grp_status: 1,
            added_by: colleagueId,
            last_modified_by: colleagueId
        }

        try {
            const response = await fetch(`${port}/web/add_Group_module/`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            })
            const data = await response.json();
            console.log(data);
        }
        catch (error) {
            console.log('Error Submitting the Data');

        }
    }

    const handleSubModuleSubmit = async () => {
        const payload1 = {
            name: subModuleName,
            group: selectedModule,
            added_by: colleagueId,
            modify_by: colleagueId
        }

        try {
            const response = await fetch(`${port}/web/add_module_name/`, {
                'method': 'POST',
                'headers': {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                'body': JSON.stringify(payload1)
            })
            const data = await response.json();
            console.log(data, 'Succefully SUbmitted the Sub Module Form');
        }
        catch (error) {
            console.log('Error Submitting the SUb Module Form...');

        }
    }

    const handleAccessSubmit = async () => {
        const payload2 = {
            name: access,
            module: selectedSubModule,
            added_by: colleagueId,
            modify_by: colleagueId
        }

        try {
            const response = await fetch(`${port}/web/add_new_permission_name/`, {
                'method': 'POST',
                'headers': {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                'body': JSON.stringify(payload2)
            })
            const data = await response.json();
            console.log(data, 'Succefully SUbmitted the Sub Module Form');
        }
        catch (error) {
            console.log('error submitting the access form');

        }
    }

    return (
        <div>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, ml: 1, mr: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography sx={{ marginLeft: '1rem', fontSize: 16, fontWeight: 600, display: 'flex' }} color="text.secondary" gutterBottom>User Group</Typography>
                    <TextField
                        select
                        label="Select Group"
                        variant="outlined"
                        sx={{ alignItems: 'left', mb: 1, width: 250, marginLeft: '1rem', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px" }}
                        InputProps={{ style: { border: "0px solid white" } }}
                        inputProps={{ 'aria-label': 'Select Group' }}
                        onChange={handleGroupChange}
                        value={selectedGroupId}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                },
                            },
                        }}
                    >
                        <MenuItem value="" disabled>Select a group</MenuItem>
                        {loginGroup.map((group) => (
                            <MenuItem key={group.grp_id} value={group.grp_id}>
                                {/* {group.grp_name} */}
                                {group.grp_name.charAt(0).toUpperCase() + group.grp_name.slice(1).toLowerCase()}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Checkbox onChange={handleMasterCheckboxChange} />

                    {/* <TextField
                        select
                        size="small"
                        label="+ Add"
                        variant="outlined"
                        style=
                        {{
                            alignItems: 'left',
                            mb: 1,
                            width: 150,
                            marginLeft: 'auto',
                            boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                            borderRadius: "10px",
                            marginRight: '1em'
                        }}
                        InputProps={{ style: { border: "0px solid white" } }}
                        inputProps={{ 'aria-label': 'Select Group' }}
                        onChange={handleChange}
                        value={selectedValue}
                    >
                        <MenuItem value={1}>Module</MenuItem>
                        <MenuItem value={2}>Sub Module</MenuItem>
                        <MenuItem value={3}>Permission</MenuItem>
                    </TextField> */}
                </Stack>

                <TableContainer
                    sx={{ height: "63vh" }}
                >
                    <Table>
                        <TableHead >
                            <TableRow >
                                <PermissionCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0" }}>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Modules</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 3, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Sub Module</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 8, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Access</Typography>
                                    </CardContent>
                                </PermissionCard>
                            </TableRow>
                        </TableHead>

                        <TableBody style={{ height: 'auto' }}>
                            {userGroup.map((group) => (
                                <TableRow key={group.group}>
                                    <PermissionCard style={{ height: 'auto', background: "white", color: "#000000", borderRadius: "8px 10px 8px 8px" }}>
                                        <CardContent style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                            <div key={module.r_m_id} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Checkbox
                                                    checked={checkedGroups.includes(group.r_m_id)}
                                                    onChange={() => handleGroupCheckboxChange(group.r_m_id, group.modules)}
                                                />
                                                <Typography variant='subtitle2'>{group.r_m_name}</Typography>
                                            </div>
                                        </CardContent>

                                        <CardContent style={{ flex: 3 }}>
                                            {group.modules.length === 0 ? (
                                                <div style={{ marginLeft: '1em' }}>-</div>
                                            ) : (
                                                group.modules.map((module) => (
                                                    <div key={module.module_id} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Checkbox
                                                            checked={checkedModules.includes(module.module_id)}
                                                            onChange={() => handleModuleCheckboxChange(module.module_id)}
                                                        />
                                                        <Typography variant='subtitle2' style={{ marginLeft: '10px' }}>
                                                            {module.name}
                                                        </Typography>
                                                    </div>
                                                ))
                                            )}
                                        </CardContent>

                                        <CardContent style={{ flex: 8 }}>
                                            {group.modules.length === 0 ? (
                                                <div>-</div>
                                            ) : (
                                                group.modules.map((module) => (
                                                    <div key={module.module_id} style={{ marginBottom: '10px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            {module.submodules && module.submodules.length === 0 ? (
                                                                <div style={{ marginLeft: '2em' }}>
                                                                    <Typography>-</Typography>
                                                                </div>
                                                            ) : (
                                                                module.submodules.map((submodule, index) => (
                                                                    <div
                                                                        key={submodule.Permission_id}
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            marginLeft: index % 4 === 0 ? '0' : '10px', // Reset margin for the first item in each row
                                                                            width: 'calc(25% - 10px)', // Adjust width for 4 items per row
                                                                            boxSizing: 'border-box' // Ensure padding and border are included in width
                                                                        }}
                                                                    >
                                                                        <Checkbox
                                                                            checked={checkedSubModules.includes(submodule.Permission_id)}
                                                                            onChange={() => handleSubmoduleCheckboxChange(submodule.Permission_id)}
                                                                        />
                                                                        <Typography variant='subtitle2'>{submodule.name}</Typography>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </CardContent>
                                    </PermissionCard>
                                </TableRow>
                            ))}
                        </TableBody>

                        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
                    </Table>

                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                    >
                        <SnackbarContent
                            style={getSnackbarStyle()}
                            message={snackbarMessage}
                            action={
                                <IconButton
                                    size="small"
                                    aria-label="close"
                                    color="inherit"
                                    onClick={handleCloseSnackbar}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            }
                        />
                    </Snackbar>

                </TableContainer>
                {/* Module Form */}
                <Modal
                    open={openModule}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                        }}
                    >
                        <Box
                            sx={{
                                width: '400px',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                borderRadius: 2,
                                p: 2,
                                position: 'relative',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    Module
                                </Typography>
                                <IconButton onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <TextField
                                label="Add Module"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                size="small"
                                name='grp_name'
                                value={moduleName}
                                onChange={(e) => setModuleName(e.target.value)}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                <Button onClick={handleModuleSubmit} variant="contained" color="primary" sx={{ marginRight: 1 }}>
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>

                {/* Sub Module Form */}
                <Modal
                    open={openSubModule}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                        }}
                    >
                        <Box
                            sx={{
                                width: '400px',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                borderRadius: 2,
                                p: 2,
                                position: 'relative',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ flexGrow: 1, marginBottom: 2 }}>
                                    Add Sub Module
                                </Typography>
                                <IconButton sx={{ marginBottom: 2 }} onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <TextField
                                select
                                label="Select Module"
                                variant="outlined"
                                size="small"
                                sx={{
                                    height: 39,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                                    borderRadius: "7px"
                                }}
                                InputProps={{ style: { border: "none" } }}
                                inputProps={{ 'aria-label': 'Select Group' }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: '100px',
                                            overflowY: 'auto'
                                        }
                                    }
                                }}
                                SelectProps={{
                                    MenuProps: {
                                        PaperProps: {
                                            style: {
                                                maxHeight: '200px',
                                                maxWidth: '200px'
                                            },
                                        },
                                        MenuListProps: {
                                            style: {
                                                maxHeight: '200px',
                                            },
                                        },
                                    },
                                }}
                                value={selectedModule}
                                onChange={(e) => setSelectedModule(e.target.value)}
                            >
                                {
                                    module.map((item) => (
                                        <MenuItem key={item.grp_id} value={item.grp_id}>
                                            {item.grp_name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>

                            <TextField
                                label="Sub Module"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                size="small"
                                name='name'
                                value={subModuleName}
                                onChange={(e) => setSubModuleName(e.target.value)}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                <Button onClick={handleSubModuleSubmit} variant="contained" color="primary" sx={{ marginRight: 1 }}>
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>

                {/* Permission */}
                <Modal
                    open={openPermission}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                        }}
                    >
                        <Box
                            sx={{
                                width: '400px',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                borderRadius: 2,
                                p: 2,
                                position: 'relative',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ flexGrow: 1, marginBottom: 2 }}>
                                    Add Permission
                                </Typography>
                                <IconButton sx={{ marginBottom: 2 }} onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <TextField
                                select
                                label="Select Module"
                                variant="outlined"
                                size="small"
                                sx={{
                                    height: 39,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                                    borderRadius: "7px",
                                    marginBottom: '1em'
                                }}
                                InputProps={{ style: { border: "none" } }}
                                inputProps={{ 'aria-label': 'Select Group' }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: '100px',
                                            overflowY: 'auto'
                                        }
                                    }
                                }}
                                SelectProps={{
                                    MenuProps: {
                                        PaperProps: {
                                            style: {
                                                maxHeight: '200px',
                                                maxWidth: '200px'
                                            },
                                        },
                                        MenuListProps: {
                                            style: {
                                                maxHeight: '200px',
                                            },
                                        },
                                    },
                                }}
                                value={selectedModule}
                                onChange={(e) => setSelectedModule(e.target.value)}
                            >
                                {
                                    module.map((item, index) => (
                                        <MenuItem key={item.grp_id} value={item.grp_id}>
                                            {item.grp_name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>

                            <TextField
                                select
                                label="Select Sub Module"
                                variant="outlined"
                                size="small"
                                sx={{
                                    height: 39,
                                    width: '100%',
                                    backgroundColor: 'white',
                                    boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)",
                                    borderRadius: "7px"
                                }}
                                InputProps={{ style: { border: "none" } }}
                                inputProps={{ 'aria-label': 'Select Group' }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: '100px',
                                            overflowY: 'auto'
                                        }
                                    }
                                }}
                                SelectProps={{
                                    MenuProps: {
                                        PaperProps: {
                                            style: {
                                                maxHeight: '200px',
                                                maxWidth: '200px'
                                            },
                                        },
                                        MenuListProps: {
                                            style: {
                                                maxHeight: '200px',
                                            },
                                        },
                                    },
                                }}
                                value={selectedSubModule}
                                onChange={(e) => setSelectedSubModule(e.target.value)}
                            >
                                {
                                    subModule.map((item, index) => (
                                        <MenuItem key={item.module_id} value={item.module_id}>
                                            {item.name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>

                            <TextField
                                label="Permission"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                size="small"
                                name='name'
                                value={access}
                                onChange={(e) => setAccess(e.target.value)}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                <Button onClick={handleAccessSubmit} variant="contained" color="primary" sx={{ marginRight: 1 }}>
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </div>
    )
}

export default Permission;
