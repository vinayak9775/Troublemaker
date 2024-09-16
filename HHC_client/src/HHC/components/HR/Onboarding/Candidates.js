import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import dayjs from 'dayjs';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
// import Navbar from '../../../Navbar';
import Footer from '../../../Footer';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgressWithLabel from "./LinearProgressWithLabel"
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import induction from "./../../../assets/Training.png";
import identity from "./../../../assets/id_doc.png";
import training from "./../../../assets/phy.png";
import docfile from "./../../../assets/doc.png";
import image from "./../../../assets/Image.png";
import HRNavbar from '../HRNavbar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    overflow: 'hidden',
    position: 'absolute',
    left: 1,
    whiteSpace: 'nowrap',
    width: 1,
});

const CandidateCard = styled(Card)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)',
    height: "50px",
    borderRadius: '10px',
    transition: '2s ease-in-out',
    '&:hover': {
        backgroundColor: '#F7F7F7',
        cursor: 'pointer',
    },
});

const initialDocumentItems = [
    { id: 1, title: 'Adhar Card', docFile: 'path/to/docfile', image: 'path/to/image' },
    { id: 2, title: 'Pan Card', docFile: 'path/to/docfile', image: 'path/to/image', approved: false },
    { id: 3, title: 'Address Proof', docFile: 'path/to/docfile', image: 'path/to/image', approved: false },
    { id: 4, title: 'Driving Licence', docFile: 'path/to/docfile', image: 'path/to/image', approved: false },
    { id: 5, title: 'Bank Details', docFile: 'path/to/docfile', image: 'path/to/image', approved: false },
    { id: 6, title: 'Police Verif', docFile: 'path/to/docfile', image: 'path/to/image', approved: false },
    { id: 7, title: 'Educational', docFile: 'path/to/docfile', image: 'path/to/image', approved: false },
    { id: 8, title: 'Medical Ins', docFile: 'path/to/docfile', image: 'path/to/image', approved: false },
    { id: 9, title: 'Experience', docFile: 'path/to/docfile', image: 'path/to/image', approved: false },
];

const Candidates = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    //////// permisssion start
    const [permissions, setPermissions] = useState([]);

    console.log(permissions, 'Manage Permission');

    /////////////// Data Response
    permissions.forEach(permission => {
        permission.modules_submodule.forEach(module => {
            console.log("Module:", module.name);
            module.selectedSubmodules.forEach(submodule => {
                console.log("  Submodule:", submodule.submoduleName);
            });
        });
    });

    useEffect(() => {
        const permissionsData = JSON.parse(localStorage.getItem('permissions'));
        if (permissionsData) {
            setPermissions(permissionsData);
        }
    }, []);

    // Check if "Add Service" permission is granted for "Manage Profiles" module
    const isAddDocumentsAllowed = permissions.some(permission =>
        permission.modules_submodule.some(module =>
            module.selectedSubmodules.some(submodule =>
                submodule.submoduleName === 'Add Documents'
            )
        )
    );

    const isApproveAllowed = permissions.some(permission =>
        permission.modules_submodule.some(module =>
            module.selectedSubmodules.some(submodule =>
                submodule.submoduleName === 'Approve'
            )
        )
    );

    const isRejectAllowed = permissions.some(permission =>
        permission.modules_submodule.some(module =>
            module.selectedSubmodules.some(submodule =>
                submodule.submoduleName === 'Reject'
            )
        )
    );
    //////// permisssion end
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [candidatesList, setCandidatesList] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState('');

    const [loading, setLoading] = useState(true);

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const [progress, setProgress] = useState(10);

    const [indStatus, setIndStatus] = useState([]);
    const [checkedInd, setCheckedInd] = useState(true);
    const [checkedTrain, setCheckedTrain] = useState(true);
    const [checkedIDCard, setCheckedIDCard] = useState(true);

    //////// Documents
    const [documents, setDocuments] = useState(initialDocumentItems);

    const handleApprove = (index) => {
        const updatedDocuments = documents.map((doc, i) =>
            i === index ? { ...doc, approved: true, rejected: false } : doc
        );
        setDocuments(updatedDocuments);

        // Log the approved document details
        const approvedDoc = updatedDocuments[index];
        console.log(`Approved Document - ID: ${approvedDoc.id}, Name: ${approvedDoc.title}`);
    };

    const handleApproveAll = () => {
        const updatedDocuments = documents.map((doc) => ({ ...doc, approved: true, rejected: false }));
        setDocuments(updatedDocuments);

        // Log all approved documents details
        const approvedDocs = updatedDocuments.filter((doc) => doc.approved);
        console.log('Approved Documents:', approvedDocs.map(doc => ({ id: doc.id, name: doc.title })));
    };

    const handleReject = (index) => {
        const updatedDocuments = documents.map((doc, i) =>
            i === index ? { ...doc, approved: false, rejected: true } : doc
        );
        setDocuments(updatedDocuments);
    };

    ///// documnets end
    const handleChangeInduction = (event) => {
        setCheckedInd(event.target.checked);
    };

    const handleChangeTraining = (event) => {
        setCheckedTrain(event.target.checked);
    };

    const handleChangeTraininIDCard = (event) => {
        setCheckedIDCard(event.target.checked);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        const getCandidatesList = async () => {
            try {
                const res = await fetch(`${port}/hr/manage_emp/?ob=1`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Candidates Data.........", data);
                if (data['not found'] = 'Record not found') {
                    setCandidatesList([]);
                    setLoading(false);
                } else {
                    setCandidatesList(data);
                    setLoading(false);
                }

            } catch (error) {
                console.error("Error fetching Candidates Data:", error);
                setLoading(false);
            }
        };
        getCandidatesList();
    }, []);

    useEffect(() => {
        const getInductionStatus = async () => {
            if (selectedCandidates) {
                try {
                    const res = await fetch(`${port}/hr/professional_begining_status/${selectedCandidates}/`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await res.json();
                    console.log("Induction Status.........", data);
                    setIndStatus(data);
                } catch (error) {
                    console.error("Error fetching Induction Status:", error);
                }
            }
        };
        getInductionStatus();
    }, [selectedCandidates]);

    useEffect(() => {
        if (indStatus) {
            setCheckedInd(indStatus.induction === 1);
            setCheckedTrain(indStatus.training === 1);
            setCheckedIDCard(indStatus.id_card === 1);
        }
    }, [indStatus]);

    const handleEventSelect = (candidateID) => {
        if (candidatesList.length > 0) {
            const selectedCandidate = candidatesList.find((item) => item.srv_prof_id === candidateID);
            if (selectedCandidate) {
                setSelectedCandidates(selectedCandidate.srv_prof_id);
                console.log("Selected Candidate.....>>>", selectedCandidate.srv_prof_id);
            } else {
                console.log("Candidate not found.");
            }
        } else {
            console.log("Candidate list is empty.");
        }
    };

    async function handleInductionSubmit(event) {
        event.preventDefault();
        const inductionValue = checkedInd ? 1 : 2;
        const trainingValue = checkedTrain ? 1 : 2;
        const idCardValue = checkedIDCard ? 1 : 2;
        const requestData = {
            induction: inductionValue,
            training: trainingValue,
            id_card: idCardValue,
        };
        console.log("POST API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/hr/professional_begining_status/${selectedCandidates}/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                return;
            }
            const result = await response.json();
            console.log("Induction data", result);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    return (
        <>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, mb: 2, ml: 1, mr: 1, }}>
                <Stack direction={isSmallScreen ? 'column' : 'row'}
                    spacing={1}
                    alignItems={isSmallScreen ? 'center' : 'flex-start'}>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>SELECTED CANDIDATES</Typography>

                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 260, height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <IconButton type="button" sx={{ color: "#69A5EB", height: "36px", width: "36px" }}>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, }}
                            placeholder="Search Candidate |"
                        />
                    </Box>
                    <Box
                        component="form"
                        sx={{ marginLeft: '2rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 260, height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9" }}
                    >
                        <IconButton type="button" sx={{ color: "#69A5EB", height: "36px", width: "36px" }}>
                            <SearchIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, }}
                            placeholder="Search Service |"
                        />
                    </Box>
                    <Button variant='contained' sx={{ background: "#69A5EB", textTransform: "capitalize", borderRadius: "8px", width: "14ch" }}>View</Button>
                </Stack>

                <Grid item xs={12} container spacing={1}>
                    <Grid item lg={8} md={6} xs={12}>
                        <TableContainer sx={{ height: "auto" }}>
                            <Table>
                                <TableHead >
                                    <TableRow>
                                        <CandidateCard style={{ background: "#69A5EB", color: "#FFFFFF", }}>
                                            <CardContent style={{ flex: 2, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Candidate Name</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1.5, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Service Name</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1.2, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Contact</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Employee Type</Typography>
                                            </CardContent>
                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF" }}>
                                                <Typography variant='subtitle2'>Joining Date</Typography>
                                            </CardContent>
                                        </CandidateCard>
                                    </TableRow>
                                </TableHead>
                                {loading ? (
                                    <Box sx={{ display: 'flex', mt: 15, ml: 50, height: '100px', }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <TableBody>
                                        {candidatesList.length === 0 ? (
                                            <TableRow>
                                                <CardContent >
                                                    <Typography variant="body2">
                                                        No Data Available
                                                    </Typography>
                                                </CardContent>
                                            </TableRow>
                                        ) : (
                                            candidatesList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                <TableRow
                                                    key={row.srv_prof_id}
                                                    value={row.srv_prof_id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                                                >
                                                    <CandidateCard>
                                                        <CardContent onClick={() => handleEventSelect(row.srv_prof_id)}
                                                            style={{
                                                                flex: 2,
                                                                border: 'none',
                                                                background: 'none',
                                                                outline: 'none',
                                                                cursor: 'pointer',
                                                                borderLeft: selectedCandidates === row.srv_prof_id ? '3px solid #26C0E2' : 'none',
                                                                height: '40px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}>
                                                            <Typography variant='body2' textAlign="left">{row.prof_fullname}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1.5 }}>
                                                            <Typography variant='body2' textAlign="left">{row.srv_id}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1.2 }}>
                                                            <Typography variant='body2'><PhoneOutlinedIcon sx={{ fontSize: "16px", color: "#69A5EB", }} /> {row.phone_no}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            {row.Job_type === 1 ? (
                                                                <Typography variant='body2'>On Call</Typography>
                                                            ) : row.Job_type === 2 ? (
                                                                <Typography variant='body2'>Full Time</Typography>
                                                            ) : (
                                                                <Typography variant='body2'>Part Time</Typography>
                                                            )}
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant='body2'><CalendarMonthOutlinedIcon sx={{ fontSize: "16px", color: "#69A5EB", mt: 1 }} /> {row.doj}</Typography>
                                                        </CardContent>
                                                    </CandidateCard>
                                                </TableRow>
                                            )
                                            ))}
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[6, 10, 25, 100]}
                            component="div"
                            count={candidatesList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>

                    <Grid item lg={4} md={6} xs={12}>
                        <CandidateCard style={{ background: "#69A5EB", color: "#FFFFFF", marginBottom: '0.7em' }}>
                            <CardContent style={{ flex: 0.5 }}>
                                <Typography variant='subtitle2'>Status</Typography>
                            </CardContent>
                            <CardContent style={{ flex: 5 }}>
                                <LinearProgressWithLabel value={progress} />
                            </CardContent>
                        </CandidateCard>

                        <Card sx={{
                            backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "6px", mb: 3.5

                        }}>
                            <Box sx={{
                                flexGrow: 1, mt: 2, mb: 2, ml: 1, mr: 1,
                                height: "40vh",
                                overflowY: "scroll",
                                overflowX: "hidden",
                            }}>
                                <Grid item xs={12} container spacing={1}>
                                    <Grid item xs={4} sm={4} lg={4}>
                                        <Box sx={{ bgcolor: "#FFFAE5", borderRadius: "4px", padding: '6px' }}>
                                            <img src={induction} alt="" style={{ marginTop: "4px", height: "30px" }} />
                                            <FormControlLabel
                                                label="Induction"
                                                control={
                                                    <Checkbox
                                                        checked={checkedInd}
                                                        onChange={handleChangeInduction}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                                    />
                                                }
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={4} sm={4} lg={4}>
                                        <Box sx={{ bgcolor: "#E9FBF9", borderRadius: "4px", padding: '6px' }}>
                                            <img src={training} alt="" style={{ marginTop: "4px", height: "30px" }} />
                                            <FormControlLabel
                                                label="Training"
                                                control={
                                                    <Checkbox
                                                        checked={checkedTrain}
                                                        onChange={handleChangeTraining}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                                    />
                                                }
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={4} sm={4} lg={4}>
                                        <Box sx={{ bgcolor: "#F7EAFB", borderRadius: "4px", padding: '6px', marginRight: '1em' }}>
                                            <img src={identity} alt="" style={{ marginTop: "4px", height: "30px" }} />
                                            <FormControlLabel
                                                label="Id Card"
                                                control={
                                                    <Checkbox
                                                        checked={checkedIDCard}
                                                        onChange={handleChangeTraininIDCard}
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                                    />
                                                }
                                            />
                                        </Box>
                                    </Grid>
                                    <Button onClick={handleInductionSubmit} style={{ backgroundColor: "#69A5EB", color: 'white', marginLeft: '13em', marginTop: '0.7em' }}>Save</Button>
                                </Grid>

                                <Stack direction='row'
                                    spacing={1}
                                    alignItems='flex-start' justifyContent="space-between" sx={{ mt: 2 }}>
                                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: "10px", marginLeft: "10px" }} color="text.secondary" gutterBottom>DOCUMENT VERIFICATION</Typography>

                                    {/* {
                                        isAddDocumentsAllowed && (
                                            <Button variant='contained' sx={{ mt: 2, background: "#69A5EB", textTransform: "capitalize", borderRadius: "8px", }}>
                                                <AddRoundedIcon sx={{ fontSize: "20px" }} />
                                                Add Documents
                                            </Button>
                                        )
                                    } */}
                                </Stack>

                                <Grid container spacing={1} sx={{ mt: 1 }}>
                                    {documents.map((item, index) => (
                                        <Grid item xs={4} sm={4} lg={4} key={index}>
                                            <Box sx={{
                                                border: `1px solid ${item.approved ? '#00E08F' : item.rejected ? '#AF0F2A' : '#C9C9C9'}`,
                                                borderRadius: '4px', padding: '6px'
                                            }}>
                                                <div style={{ display: 'flex', height: '2em' }}>
                                                    <img src={item.docFile} alt="" style={{ marginTop: '4px', height: '1.5em' }} />
                                                    <Typography variant='body2' sx={{ ml: 1 }}>{item.title}</Typography>
                                                </div>

                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    tabIndex={-1}
                                                    startIcon={<CloudUploadIcon />}
                                                    sx={{
                                                        height: '4em',
                                                        margin: '6px 2px 10px 0px',
                                                        width: '8em',
                                                        boxShadow: 'none',
                                                        backgroundColor: '#E0E0E0',
                                                        '&:hover': {
                                                            backgroundColor: '#E0E0E0',
                                                        },
                                                        '&:active': {
                                                            backgroundColor: '#E0E0E0',
                                                        },
                                                    }}>
                                                    <VisuallyHiddenInput type="file" />
                                                </Button>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    {!item.approved && !item.rejected && (
                                                        <>
                                                            <div
                                                                style={{
                                                                    backgroundColor: '#00E08F',
                                                                    color: 'white',
                                                                    borderRadius: '4px',
                                                                    padding: '4px 4px',
                                                                    fontSize: '14px',
                                                                    fontFamily: 'Roboto',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => handleApprove(index)}
                                                            >
                                                                Approve
                                                            </div>

                                                            <div
                                                                style={{
                                                                    backgroundColor: '#AF0F2A',
                                                                    color: 'white',
                                                                    borderRadius: '4px',
                                                                    padding: '5px 5px',
                                                                    fontSize: '14px',
                                                                    fontFamily: 'Roboto',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => handleReject(index)}
                                                            >
                                                                Reject
                                                            </div>
                                                        </>
                                                    )}

                                                    {item.approved && !item.rejected && (
                                                        <div
                                                            style={{
                                                                backgroundColor: '#00E08F',
                                                                color: 'white',
                                                                borderRadius: '4px',
                                                                padding: '4px 4px',
                                                                fontSize: '14px',
                                                                fontFamily: 'Roboto',
                                                                marginLeft: '0.8em'
                                                            }}
                                                        >
                                                            <Typography
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'flex-start',
                                                                    color: 'white',
                                                                    cursor: 'pointer',
                                                                    fontSize: '13px',
                                                                    marginBottom: '3px',
                                                                    marginRight: '10px'
                                                                }}
                                                            >
                                                                <TaskAltOutlinedIcon style={{ fontSize: '14px', marginRight: '5px' }} />
                                                                Approved
                                                            </Typography>
                                                        </div>
                                                    )}

                                                    {item.rejected && (
                                                        <div
                                                            style={{
                                                                backgroundColor: '#AF0F2A',
                                                                color: 'white',
                                                                borderRadius: '4px',
                                                                padding: '4px 4px',
                                                                fontSize: '14px',
                                                                fontFamily: 'Roboto',
                                                                marginLeft: '0.8em'
                                                            }}
                                                        >
                                                            <Typography
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'flex-start',
                                                                    color: 'white',
                                                                    cursor: 'pointer',
                                                                    fontSize: '13px',
                                                                    marginBottom: '3px',
                                                                    marginRight: '10px'
                                                                }}
                                                            >
                                                                <CancelOutlinedIcon style={{ fontSize: '14px', marginRight: '5px' }} />
                                                                Rejected
                                                            </Typography>
                                                        </div>
                                                    )}
                                                </div>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                            <Button variant='contained' sx={{ mb: 2, width: "25ch", textTransform: "capitalize", borderRadius: "10px", textAlign: 'center' }}
                                onClick={handleApproveAll}
                            >Approve Documents</Button>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </>
    )
}

export default Candidates
