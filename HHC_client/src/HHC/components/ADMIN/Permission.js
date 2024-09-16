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
import { TextField, Button } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import HRNavbar from '../HR/HRNavbar';

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

    const port = process.env.REACT_APP_API_KEY;
    const [snackbarMessage, setSnackbarMessage] = useState(null);
    // Module Fetch API
    const [userGroup, setUserGroup] = useState([]);
    const [userGroupID, setUserGroupID] = useState([]);
    console.log(userGroupID, 'userGroupIDuserGroupID');
    const [selectedGroupId, setSelectedGroupId] = useState('');
    console.log(selectedGroupId, 'selectedGroupIdselectedGroupIdselectedGroupId');

    const handleGroupChange = (event) => {
        const newSelectedGroupId = event.target.value;

        // Clear checkedModules and checkedSubModules states
        setCheckedModules([]);
        setCheckedSubModules([]);

        // Update selectedGroupId state
        setSelectedGroupId(newSelectedGroupId);
    };

    ///////// GET API All Module And SubModule
    useEffect(() => {
        const fetchModuleName = async () => {
            try {
                const response = await fetch(`${port}/web/combined/`);
                const data = await response.json();
                const groupNames = data.map(group => group.group_name);
                console.log(groupNames, 'Group Name');
                setUserGroup(data)
            }
            catch (error) {
                console.log('Error Fetching Data');
            }
        }
        fetchModuleName();
    }, [])

    /////// Checked Module and Submodule as per Seelcted ID
    useEffect(() => {
        const fetchModuleName = async () => {
            if (selectedGroupId) {
                try {
                    const response = await fetch(`${port}/web/combined/${selectedGroupId}/`);
                    const data = await response.json();
                    setUserGroupID(data);
                    setId(data && data.length > 0 ? data[0].id : null);

                    ////// extracting id of modules and Sub Modules
                    const checkedModulesFromAPI = data.flatMap(group => group.modules_submodule.map(module => module.module_id));
                    const checkedSubmodulesFromAPI = data.flatMap(group => group.modules_submodule.flatMap(module => module.submodules.map(submodule => submodule.Permission_id)));

                    // Update checkedModules and checkedSubModules
                    setCheckedModules(prevModules => [...new Set([...prevModules, ...checkedModulesFromAPI])]);
                    setCheckedSubModules(prevSubmodules => [...new Set([...prevSubmodules, ...checkedSubmodulesFromAPI])]);
                    console.log(data[0]?.id, 'Id Wise Response ');
                }
                catch (error) {
                    console.log('Error Fetching Data');
                }
            }
            else {
                console.log('error');
            }
        }
        fetchModuleName();
    }, [selectedGroupId])

    //// checked modules and submoduled stored 
    const [checkedModules, setCheckedModules] = useState([]);
    const [checkedSubModules, setCheckedSubModules] = useState([]);

    const handleModuleCheckboxChange = (module_id) => {
        // Check if the module_id is already 
        if (checkedModules.includes(module_id)) {
            // if it is cecked then uncheck it
            setCheckedModules(checkedModules.filter(id => id !== module_id));

            /// remove the sub mdoule from  unchecked module
            setCheckedSubModules(checkedSubModules.filter(submodule_id => !userGroup.find(group => group.modules.find(module => module.module_id === module_id && module.submodules.find(submodule => submodule.Permission_id === submodule_id)))));
            console.log('Unchecked Module:', userGroup.find(group => group.modules.find(module => module.module_id === module_id)).modules.find(module => module.module_id === module_id).name);
        } else {
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

        /// update with checked
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

    const handleMasterCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            // Check all modules and submodules
            const allModules = userGroup.flatMap(group => group.modules.map(module => module.module_id));
            const allSubmodules = userGroup.flatMap(group => group.modules.flatMap(module => module.submodules.map(submodule => submodule.Permission_id)));
            setCheckedModules(allModules);
            setCheckedSubModules(allSubmodules);
        } else {
            // Uncheck all modules and submodules
            setCheckedModules([]);
            setCheckedSubModules([]);
        }
    };

    // POST API
    // const handleSubmit = async () => {
    //     const modules_submodule = userGroup.flatMap(group => {
    //         return group.modules.flatMap(module => {
    //             if (checkedModules.includes(module.module_id)) {
    //                 const selectedSubmodules = module.submodules.filter(submodule => checkedSubModules.includes(submodule.Permission_id));
    //                 if (selectedSubmodules.length > 0) {
    //                     return {
    //                         module_id: module.module_id,
    //                         name: module.name,
    //                         submodules: selectedSubmodules.map(submodule => ({
    //                             Permission_id: submodule.Permission_id,
    //                             name: submodule.name
    //                         }))
    //                     };
    //                 }
    //             }
    //             return [];
    //         });
    //     });

    //     const postData = {
    //         modules_submodule: modules_submodule,
    //         role: selectedGroupId
    //     };

    //     console.log('Payloadddddddddddddd:', postData);

    //     try {
    //         const response = await fetch('http://103.186.133.168:8008/web/permissions/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(postData)
    //         });
    //         if (response.ok) {
    //             const responseData = await response.json();
    //             const { id } = responseData;
    //             console.log('Data successfully submitted with idddddddddd:', id);
    //             setId(id);
    //             updateCheckboxes(id);
    //         } else {
    //             console.log('Failed to submit data');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    // const handleSubmit = async () => {
    //     // Filter userGroup to include only checked modules
    //     const selectedModules = userGroup.filter(group => {
    //         return group.modules.some(module => checkedModules.includes(module.module_id));
    //     });

    //     // Construct modules_submodule array from selectedModules and checkedSubModules
    //     const modules_submodule = selectedModules.flatMap(group => {
    //         return group.modules.flatMap(module => {
    //             if (checkedModules.includes(module.module_id)) {
    //                 const selectedSubmodules = module.submodules.filter(submodule => checkedSubModules.includes(submodule.Permission_id));
    //                 return {
    //                     module_id: module.module_id,
    //                     name: module.name,
    //                     submodules: selectedSubmodules.map(submodule => ({
    //                         Permission_id: submodule.Permission_id,
    //                         name: submodule.name
    //                     }))
    //                 };
    //             }
    //             return [];
    //         });
    //     });

    //     const postData = {
    //         modules_submodule: modules_submodule,
    //         role: selectedGroupId
    //     };

    //     console.log('Payload:', postData);

    //     try {
    //         const response = await fetch('http://103.186.133.168:8008/web/permissions/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(postData)
    //         });
    //         if (response.ok) {
    //             const responseData = await response.json();
    //             const { id } = responseData;
    //             console.log('Data successfully submitted with id:', id);
    //             setId(id);
    //             updateCheckboxes(id);
    //         } else {
    //             console.log('Failed to submit data');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    // const updateCheckboxes = async (id) => {
    //     try {
    //         const response = await fetch(`http://103.186.133.168:8008/web/permissions/${id}/`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 modules_submodule: userGroupID, // Update with the appropriate data structure
    //                 role: selectedGroupId // Update with the appropriate value
    //             })
    //         });
    //         if (response.ok) {
    //             const data = await response.json();
    //             // Extract checked modules and submodules from the response
    //             const checkedModulesFromAPI = data.flatMap(group => group.modules_submodule.map(module => module.module_id));
    //             const checkedSubmodulesFromAPI = data.flatMap(group => group.modules_submodule.flatMap(module => module.submodules.map(submodule => submodule.Permission_id)));

    //             // Update state with the checked modules and submodules 
    //             setCheckedModules(checkedModulesFromAPI);
    //             setCheckedSubModules(checkedSubmodulesFromAPI);
    //             console.log('Checkboxes updated successfully');
    //         } else {
    //             console.log('Failed to update checkboxes');
    //         }
    //     } catch (error) {
    //         console.error('Error updating checkboxes:', error);
    //     }
    // };

    const [id, setId] = useState('');
    console.log(id, 'idididididididi');

    const handleSubmit = async () => {
        // Filter userGroup to include only checked modules
        const selectedModules = userGroup.filter(group => {
            return group.modules.some(module => checkedModules.includes(module.module_id));
        });

        // Construct modules_submodule array from selectedModules and checkedSubModules
        const modules_submodule = selectedModules.flatMap(group => {
            return group.modules.flatMap(module => {
                if (checkedModules.includes(module.module_id)) {
                    const selectedSubmodules = module.submodules.filter(submodule => checkedSubModules.includes(submodule.Permission_id));
                    return {
                        module_id: module.module_id,
                        name: module.name,
                        submodules: selectedSubmodules.map(submodule => ({
                            Permission_id: submodule.Permission_id,
                            name: submodule.name
                        }))
                    };
                }
                return [];
            });
        });

        const postData = {
            modules_submodule: modules_submodule,
            role: selectedGroupId
        };

        console.log('Payload:', postData);

        try {
            let response;
            if (id) {
                // If permissions already exist, send a PUT request
                response = await fetch(`http://103.186.133.168:8008/web/permissions/${id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                });
                setSnackbarMessage("Data Updated Successfully");
            } else {
                // If permissions don't exist, send a POST request
                response = await fetch('http://103.186.133.168:8008/web/permissions/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                });
                setSnackbarMessage("Data Submitted Successfully"); // Set snackbar message for submit
            }

            if (response.ok) {
                const responseData = await response.json();
                console.log('Data successfully submitted with id:', responseData.id);
                setId(responseData.id);

                console.log(responseData.id, 'Checking id after form submission');
            } else {
                console.log('Failed to submit data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
                    >
                        <MenuItem value="" disabled>Select a group</MenuItem>
                        {userGroup.map((group) => (
                            <MenuItem key={group.group} value={group.group}>{group.group_name}</MenuItem>
                        ))}
                    </TextField>
                    <Checkbox onChange={handleMasterCheckboxChange} />
                </Stack>

                <TableContainer
                    sx={{ height: "63vh" }}
                >
                    <Table>
                        <TableHead >
                            <TableRow >
                                <PermissionCard style={{ background: "#69A5EB", color: "#FFFFFF", borderRadius: "8px 10px 0 0", }}>
                                    <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Modules</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 4, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Sub Module</Typography>
                                    </CardContent>
                                    <CardContent style={{ flex: 5, borderRight: "1px solid #FFFFFF" }}>
                                        <Typography variant='subtitle2'>Permissions</Typography>
                                    </CardContent>
                                </PermissionCard>
                            </TableRow>
                        </TableHead>

                        <TableBody style={{ height: 'auto' }}>
                            {userGroup.map((group) => (
                                <TableRow key={group.group}>
                                    <PermissionCard style={{ height: 'auto', background: "white", color: "#000000", borderRadius: "8px 10px 8px 8px" }}>
                                        <CardContent style={{ flex: 1 }}>
                                            <Typography variant='subtitle2'>{group.group_name}</Typography>
                                        </CardContent>

                                        <CardContent style={{ flex: 4 }}>
                                            {group.modules.length === 0 ? (
                                                <div>-</div>
                                            ) : (
                                                group.modules.map((module) => (
                                                    <div key={module.module_id} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Checkbox checked={checkedModules.includes(module.module_id)} onChange={() => handleModuleCheckboxChange(module.module_id)} />
                                                        <Typography variant='subtitle2' style={{ marginLeft: '10px' }}>{module.name}</Typography>
                                                    </div>
                                                ))
                                            )}
                                        </CardContent>

                                        <CardContent style={{ flex: 5 }}>
                                            {group.modules.length === 0 ? (
                                                <div>-</div>
                                            ) : (
                                                group.modules.map((module) => (
                                                    <div key={module.module_id}>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            {module.submodules && module.submodules.length === 0 ? (
                                                                <div>-</div>
                                                            ) : (
                                                                module.submodules.map((submodule) => (
                                                                    <div key={submodule.Permission_id} style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                                                        <Checkbox checked={checkedSubModules.includes(submodule.Permission_id)} onChange={() => handleSubmoduleCheckboxChange(submodule.Permission_id)} />
                                                                        <Typography variant='subtitle2'>{submodule.name}</Typography>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </CardContent>

                                        {/* <CardContent style={{ flex: 4 }}>
                                            {group.modules.map((module) => (
                                                <div key={module.module_id} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Checkbox checked={checkedModules.includes(module.module_id)} onChange={() => handleModuleCheckboxChange(module.module_id)} />
                                                    <Typography variant='subtitle2'>{module.name}</Typography>
                                                </div>
                                            ))}
                                        </CardContent>

                                        <CardContent style={{ flex: 5 }}>
                                            {group.modules.map((module) => (
                                                <div key={module.module_id}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        {module.submodules && module.submodules.map((submodule) => (
                                                            <div key={submodule.Permission_id} style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                                <Checkbox checked={checkedSubModules.includes(submodule.Permission_id)} onChange={() => handleSubmoduleCheckboxChange(submodule.Permission_id)} />
                                                                <Typography variant='subtitle2'>{submodule.name}</Typography>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent> */}
                                    </PermissionCard>
                                </TableRow>
                            ))}
                        </TableBody>

                        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
                    </Table>
                </TableContainer>

                {snackbarMessage && (
                    <Snackbar
                        message={snackbarMessage}
                        onClose={() => setSnackbarMessage(null)}
                        sx={{ backgroundColor: '#4caf50' }} // Green background color
                    />
                )}
            </Box>
        </div>
    )
}

export default Permission;
