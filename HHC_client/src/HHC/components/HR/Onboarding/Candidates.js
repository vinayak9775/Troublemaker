import React, { useRef, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import { Button, LinearProgress } from '@mui/material';
import { Table, AppBar } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import Footer from '../../../Footer';
import CircularProgress from '@mui/material/CircularProgress';
// import LinearProgressWithLabel from "./LinearProgressWithLabel"
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import induction from "./../../../assets/Training.png";
import identity from "./../../../assets/id_doc.png";
import training from "./../../../assets/phy.png";
import HRNavbar from '../HRNavbar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import { useLocation } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

const LinearProgressWithLabel = ({ value }) => {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={value} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    );
};

const Candidates = () => {

    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [clgId, setClgId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { EmployeeProfessionalId } = location.state || {};

    useEffect(() => {
        const id = localStorage.getItem('clg_id');
        setClgId(id);
    }, []);
    //////// permission start
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    console.log(permissions, 'fetching permission');

    const viewCandidates = permissions.some(permission =>
        permission.modules_submodule.some(module => {
            // Check if module has submodules
            if (module.submodules && module.submodules.length > 0) {
                // Check for the 'View' submodule directly in submodules
                return module.submodules.some(sub => sub.submodule_name === 'View');
            }

            // Check if module has a 'modules' array
            if (module.modules && module.modules.length > 0) {
                // Check each submodule in the 'modules' array
                return module.modules.some(submodule =>
                    submodule.submodules && submodule.submodules.some(sub =>
                        sub.submodule_name === 'View'
                    )
                );
            }

            // Return false if neither condition is satisfied
            return false;
        })
    );
    //////// permission end

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [candidatesList, setCandidatesList] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState('');
    const [loading, setLoading] = useState(true);
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [progress, setProgress] = useState(null);
    const candidateId = selectedCandidates || EmployeeProfessionalId;
    console.log(candidateId, 'candidateId');

    useEffect(() => {
        const fetchProgress = async () => {
            if (candidateId) {
                try {
                    const response = await fetch(`${port}/hr/Onboarding_status_bar_API/${candidateId}/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await response.json();

                    if (data && data.completion_percentage !== undefined) {
                        setProgress(data.completion_percentage);
                    }
                } catch (error) {
                    console.error("Error fetching progress data:", error);
                }
            }
            else {
                console.log('error fetching value');
            }
        };

        fetchProgress();
    }, [candidateId, port, accessToken]);

    const [indStatus, setIndStatus] = useState([]);
    const [checkedInd, setCheckedInd] = useState(true);
    const [checkedTrain, setCheckedTrain] = useState(true);
    const [checkedIDCard, setCheckedIDCard] = useState(true);
    // Documents
    const [documents, setDocuments] = useState([]);
    const [foundDocumentIds, setFoundDocumentIds] = useState([]);
    const [foundDocumentImages, setFoundDocumentImages] = useState([]);
    console.log(foundDocumentImages, 'Fetching Images URL...');

    console.log(foundDocumentIds, 'fetch the id and image');

    // form submit
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [approvedItems, setApprovedItems] = useState(new Array(documents.length).fill(false));
    const [rejectedItems, setRejectedItems] = useState(new Array(documents.length).fill(false));
    const [openModal, setOpenModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    // Image Open
    const [openImageModal, setOpenImageModal] = useState(false);
    const [selectedImageID, setSelectedImageID] = useState(null);
    const [imageDoc, setImageDoc] = useState('');
    const [remarks, setRemarks] = useState({});
    const [remarkText, setRemarkText] = useState('');
    const [snackMessage, setSnackMessage] = useState('');
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [selectedDocID, setSelectedDocID] = useState(null);
    const [snackBarSeverity, setSnackBarSeverity] = useState('error');
    const [open, setOpen] = useState(false);
    const [srvProfId, setSrvProfId] = useState(null);
    const [subSrvCost, setSubSrvCost] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackBarSaveOpen, setSnackBarSaveOpen] = useState(false);
    const [snackMessageDocuments, setSnackMessageDocuments] = useState('')
    const [profCode, setProfCode] = useState('');
    const [profName, setProfName] = useState('');
    const [searchCandidate, setSearchCandidate] = useState('');
    const [searchService, setSearchService] = useState('');

    const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
    const [doj, setDoj] = useState('');
    const [adharPan, setAdharPan] = useState(null);

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
                const candidateId = selectedCandidates || EmployeeProfessionalId;

                const obValue = EmployeeProfessionalId ? 2 : 1;

                let url = `${port}/hr/manage_emp/?ob=${obValue}`;

                if (candidateId) {
                    url += `&srv_prof=${candidateId}`;
                }

                const res = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                console.log("Candidates Data.........", data);

                if (data['not found'] === 'Record not found') {
                    setCandidatesList([]);
                } else if (Array.isArray(data)) {
                    setCandidatesList(data);
                } else {
                    console.error("Unexpected data structure:", data);
                    setCandidatesList([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching Candidates Data:", error);
                setLoading(false);
            }
        };

        getCandidatesList();
    }, [selectedCandidates, EmployeeProfessionalId]);

    // useEffect(() => {
    //     const getCandidatesList = async () => {
    //         try {
    //             const candidateId = EmployeeProfessionalId;

    //             let url = `${port}/hr/manage_emp/?ob=1`;

    //             if (candidateId) {
    //                 url += `&srv_prof=${candidateId}`;
    //             }

    //             const res = await fetch(url, {
    //                 headers: {
    //                     'Authorization': `Bearer ${accessToken}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             });

    //             const data = await res.json();
    //             console.log("Candidates Data.........", data);

    //             if (data['not found'] === 'Record not found') {
    //                 setCandidatesList([]);
    //             } else if (Array.isArray(data)) {
    //                 setCandidatesList(data);
    //             } else {
    //                 console.error("Unexpected data structure:", data);
    //                 setCandidatesList([]);
    //             }
    //             setLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching Candidates Data:", error);
    //             setLoading(false);
    //         }
    //     };
    //     getCandidatesList();
    // }, [selectedCandidates, EmployeeProfessionalId]);

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

    const handleSnackbarDocumentsClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarSaveOpen(false);
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
            srv_prof_id: candidateId,
            last_modified_by: clgId
        };
        console.log("POST API Hitting......", requestData)
        try {
            const response = await fetch(`${port}/hr/Selected_cand_ind_Trai_id/${candidateId}/`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });
            if (response.ok) {
                setSnackbarMessage("Induction Data submitted successfully");
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                }, 2000);

                return;
            } else if (response.status === 403) {
                setSnackbarMessage("Select the Candidate Name...");
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                }, 2000);
                return;
            }

            const result = await response.json();
            console.log("Induction data", result);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    ///// documents
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await fetch(`${port}/hr/Get_Document_list_names/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Documents Data.........", data);
                setDocuments(data)
            } catch (error) {
                console.error("Error fetching Candidates Data:", error);
            }
        };
        fetchDocuments();
    }, []);

    const fetchDocumentsIDWise = async () => {
        if (candidateId) {
            try {
                const res = await fetch(`${port}/hr/check_file_API_VIew/${candidateId}/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                console.log("Documents Submitted ID Wise.........", data);

                if (data.Res_Data?.msg === "No data found") {
                    console.log("No documents found for the selected candidate.");
                    setDocuments(documents);
                    setFoundDocumentIds([]);
                    setApprovedItems([]);
                    setAdharPan(2);
                    setRemarkText(null);
                } else {
                    const normalizedDocuments = data.Res_Data.map(item => ({
                        Documents_name: item.doc_li_id_name,
                        doc_id: item.doc_li_id,
                        professional_document: item.professional_document,
                        isVerified: item.isVerified,
                        rejection_reason: item.rejection_reason,
                    }));

                    normalizedDocuments.forEach(doc => {
                        console.log(`Document ID: ${doc.doc_id},
                                 Document Name: ${doc.Documents_name},
                                 Document Image: ${doc.professional_document},
                                 `
                        );
                    });

                    const foundIds = normalizedDocuments.map(doc => doc.doc_id);
                    const imageFound = normalizedDocuments.map(doc => doc.professional_document);
                    console.log(foundIds, 'uploaded docs list...');
                    console.log(imageFound, 'uploaded docs list...');

                    setFoundDocumentIds(foundIds);
                    setFoundDocumentImages(imageFound);
                    console.log(foundIds, imageFound, 'fouimageFound');

                    setDocuments(prevDocuments => {
                        const mergedDocuments = prevDocuments.map(doc => {
                            const newDoc = normalizedDocuments.find(nd => nd.doc_id === doc.doc_id);
                            return newDoc ? { ...doc, ...newDoc } : doc;
                        });

                        console.log("Previous Documents:", prevDocuments);
                        console.log("Normalized Documents:", normalizedDocuments);
                        console.log("Merged Documents:", mergedDocuments);

                        return mergedDocuments;
                    });
                    setAdharPan(data.adhar_pan);

                    // Optionally set the remark text for specific cases
                    if (data.Res_Data.some(doc => doc.rejection_reason)) {
                        const remarkReasons = data.Res_Data
                            .filter(doc => doc.rejection_reason)
                            .map(doc => doc.rejection_reason)
                            .join(", ");
                        setRemarkText(remarkReasons);
                    } else {
                        setRemarkText(null);
                    }
                }
            } catch (error) {
                console.error("Error fetching Induction Status:", error);
            }
        }
    };

    useEffect(() => {
        fetchDocumentsIDWise();
    }, [candidateId, port, accessToken]);

    const handleOpenImageModal = (docId, imageDoc) => {
        setSelectedImageID(docId);
        setImageDoc(imageDoc);
        setOpenImageModal(true);
        console.log('Professional Document:', imageDoc);
    };

    const handleCloseImageModal = () => {
        setOpenImageModal(false);
    };

    //____________________SUBMIT FORM START_____________________

    const [errorMessages, setErrorMessages] = useState({
        1: 'Upload Aadhar Card',
        2: 'Upload Pan Card',
    });

    const handleFileChange = (event, doc_id, index) => {
        const file = event.target.files[0];
        console.log("File selected:", file);

        if (file) {
            const existingFileIndex = selectedFiles.findIndex(item => item.doc_id === doc_id);
            if (existingFileIndex !== -1) {
                const updatedFiles = [...selectedFiles];
                updatedFiles[existingFileIndex] = { doc_id, file };
                setSelectedFiles(updatedFiles);
            } else {
                setSelectedFiles(prevState => [...prevState, { doc_id, file }]);
            }

            setErrorMessages(prevState => ({
                ...prevState,
                [doc_id]: undefined,
            }));

            setFileUploaded(true);

            if (!approvedItems[index]) {
                setApprovedItems(prevState => {
                    const updatedItems = [...prevState];
                    updatedItems[index] = true;
                    return updatedItems;
                });
            }

            if (!foundDocumentIds.includes(doc_id)) {
                setFoundDocumentIds(prevState => [...prevState, doc_id]);
            }
        }
    };

    const handleApprove = (index) => {
        const updatedApprovedItems = [...approvedItems];
        updatedApprovedItems[index] = true;
        setApprovedItems(updatedApprovedItems);
    };

    const handleReject = (index, docID) => {
        console.log(docID, 'fetching Document ID');
        const updatedRejectedItems = [...rejectedItems];
        updatedRejectedItems[index] = true;
        setRejectedItems(updatedRejectedItems);
        setSelectedIndex(index);
        setSelectedDocID(docID);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedIndex(null);
    };

    const handleRemarkSubmit = async () => {
        if (selectedIndex === null)
            return;

        try {
            setRemarks(prev => ({
                ...prev,
                [selectedDocID]: remarkText,
            }));

            console.log(`Remark for Document ID ${selectedDocID}:`, remarkText);

            const formData = new FormData();

            formData.append(`rejection_reason[${selectedIndex}]`, remarkText);
            formData.append(`doc_li_id[${selectedIndex}]`, selectedDocID);
            formData.append(`srv_prof_id[${selectedIndex}]`, candidateId);
            formData.append('last_modified_by', clgId)
            formData.append('added_by', clgId);
            const isVerified = rejectedItems[selectedIndex] ? 2 : (approvedItems[selectedIndex] ? 1 : 1);
            formData.append(`isVerified[${selectedIndex}]`, isVerified);

            const response = await fetch(`${port}/hr/check_file_API_VIew/${candidateId}/`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Response from API:', data);

            // Close the modal and reset the remark text
            handleCloseModal();
            setRemarkText('');
            setSelectedDocID(null);
            setSelectedIndex(null);
        } catch (error) {
            console.error('Failed to submit remark:', error);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarOpen(false);
    };

    const handleDocumentSubmit = async () => {
        const formData = new FormData();
        let aadharUploaded = false;
        let panUploaded = false;

        await fetchDocumentsIDWise();

        // if (foundDocumentIds.includes(1)) {
        //     aadharUploaded = true;
        // }
        // if (foundDocumentIds.includes(2)) {
        //     panUploaded = true;
        // }

        const aadharDocument = foundDocumentIds.includes(1)
            ? foundDocumentImages[foundDocumentIds.indexOf(1)]
            : null;
        const panDocument = foundDocumentIds.includes(2)
            ? foundDocumentImages[foundDocumentIds.indexOf(2)]
            : null;

        if (aadharDocument && aadharDocument !== null) {
            aadharUploaded = true;
        }
        if (panDocument && panDocument !== null) {
            panUploaded = true;
        }
        
        selectedFiles.forEach(({ doc_id, file }, index) => {
            if (doc_id) {
                if (doc_id === 1) {
                    aadharUploaded = true;
                }
                if (doc_id === 2) {
                    panUploaded = true;
                }

                formData.append(`professional_document[${index}]`, file);
                formData.append(`doc_li_id[${index}]`, doc_id);
                formData.append(`srv_prof_id[${index}]`, candidateId);
                formData.append(`prof_id[${index}]`, candidateId);
                const isVerified = rejectedItems[index] ? 2 : (approvedItems[index] ? 1 : 1);
                formData.append(`isVerified[${index}]`, isVerified);
                formData.append('last_modified_by', clgId);
            } else {
                console.warn(`No document ID for index ${index}`);
            }
        });

        if (!aadharUploaded && !panUploaded) {
            setSnackMessage('Both Aadhar ID and PAN card are required.');
            setSnackBarSeverity('error');
            setSnackBarOpen(true);
            return;
        } else if (!aadharUploaded) {
            setSnackMessage('Aadhar ID is required.');
            setSnackBarSeverity('error');
            setSnackBarOpen(true);
            return;
        } else if (!panUploaded) {
            setSnackMessage('PAN card is required.');
            setSnackBarSeverity('error');
            setSnackBarOpen(true);
            return;
        }

        // if (!doj) {
        //     setDocumentsModalOpen(true); 
        //     return;
        // }

        try {
            const response = await fetch(`${port}/hr/check_file_API_VIew/${candidateId}/`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                setSnackMessage("Documents Approved Successfully");
                setSnackBarSeverity('success');
                setSnackBarOpen(true);
                await fetchDocumentsIDWise();
                // setDocumentsModalOpen(true);
                if (!EmployeeProfessionalId && adharPan === 2) {
                    setDocumentsModalOpen(true);
                } else {
                    setDocumentsModalOpen(true);
                    navigate(`/hr/our employees`);
                }
            } else if (response.status === 400) {
                const data = await response.json();
                setSnackMessage(`Error: ${data.message}`);
                setSnackBarSeverity('error');
                setSnackBarOpen(true);
            } else if (response.status === 403) {
                setSnackMessage('Select the Candidate Name...');
                setSnackBarSeverity('error');
                setSnackBarOpen(true);
            }
        } catch (error) {
            console.error('Error submitting documents:', error);
            setSnackMessage('An error occurred while submitting documents.');
            setSnackBarSeverity('error');
            setSnackBarOpen(true);
        }
    };

    const handleOk = async () => {
        console.log('Selected DOJ:', doj);

        const payload = {
            doj: doj,
            last_modified_by: clgId,
            Join_Date: doj,
            added_by: clgId,
        };

        try {
            const response = await fetch(`${port}/hr/hr_Onbording_doj_add/${selectedCandidates}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log("Updated successfully");
                setDocumentsModalOpen(false);
                navigate('/hr/our employees');
            } else {
                const errorData = await response.json();
                console.error("Failed to update:", errorData.message);
            }
        } catch (error) {
            console.error("Error occurred:", error.message);
        }
    };

    //____________________SUBMIT FORM END____________________
    const filteredCandidates = candidatesList.filter((candidate) => {
        const candidateMatch = candidate?.prof_fullname?.toLowerCase().includes(searchCandidate?.toLowerCase());
        const serviceMatch = candidate?.srv_id?.toLowerCase().includes(searchService?.toLowerCase());
        return candidateMatch && serviceMatch;
    });

    useEffect(() => {
        setPage(0);
    }, [searchCandidate, searchService]);

    /// Sub Service MOdal Open
    const handleOpen = (srvProfId) => {
        console.log(srvProfId, 'fetched Srv Prof ID...');
        setSrvProfId(srvProfId)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    // POST API
    const handleInputChange = (event, index) => {
        const updatedValue = event.target.value;
        setSubSrvCost((prevState) =>
            prevState.map((service, i) =>
                i === index ? { ...service, cost_prof_given: updatedValue } : service
            )
        );
    };

    const handleSubmit = async () => {
        const dataToPost = subSrvCost.map((service) => ({
            prof_sub_srv_id: service.prof_sub_srv_id,
            srv_prof_id: service.srv_prof_id,
            Sub_srv_id: service.Sub_srv_id,
            sub_srv_name: service.sub_srv_name,
            prof_cost: service.prof_cost,
            cost_prof_given: service.cost_prof_given,
        }));

        console.log(dataToPost, 'post api hitting..');

        try {
            const response = await fetch(`${port}/hr/get_serv_subsrv_prof_paymt/${srvProfId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(dataToPost),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Data successfully posted:', data);
            // await fetchSubSrvCost();
            handleClose();
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    /// inducton
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${port}/hr/Selected_cand_ind_Trai_id/${candidateId}/`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const indData = data[0]; // Assuming the response is an array
                    setIndStatus(indData);
                    setCheckedInd(indData.induction === 1);
                    setCheckedTrain(indData.training === 1);
                    setCheckedIDCard(indData.id_card === 1);
                } else {
                    console.error("Failed to fetch induction data");
                }
            } catch (error) {
                console.error("An error occurred while fetching data:", error);
            }
        }
        fetchData();
    }, [candidateId, accessToken, port]);

    return (
        <>
            <HRNavbar />
            <Box sx={{ flexGrow: 1, mb: 4, ml: 1, mr: 1, }}>
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
                            value={searchCandidate}
                            onChange={(e) => setSearchCandidate(e.target.value)}
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
                            value={searchService}
                            onChange={(e) => setSearchService(e.target.value)}
                        />
                    </Box>

                    {viewCandidates && (
                        <Button
                            variant='contained'
                            sx={{
                                background: "#69A5EB",
                                textTransform: "capitalize",
                                borderRadius: "8px",
                                width: "14ch"
                            }}
                        >
                            View
                        </Button>
                    )}
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
                                            <CardContent style={{ flex: 1, borderRight: "1px solid #FFFFFF", marginTop: '8px' }}>
                                                <Typography variant='subtitle2'>Joining Date</Typography>
                                            </CardContent>
                                        </CandidateCard>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {loading ? (
                                        <Box sx={{ display: 'flex', mt: 15, ml: 50, height: '100px', }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        filteredCandidates.length === 0 ? (
                                            <TableRow>
                                                <CardContent>
                                                    <Typography variant="body2">
                                                        No Data Available
                                                    </Typography>
                                                </CardContent>
                                            </TableRow>
                                        ) : (
                                            filteredCandidates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => (
                                                <TableRow key={row.srv_prof_id} value={row.srv_prof_id} onClick={() => handleEventSelect(row.srv_prof_id)}>
                                                    <CandidateCard>
                                                        <CardContent style={{ flex: 2, display: 'flex', alignItems: 'center', borderLeft: selectedCandidates === row.srv_prof_id ? '3px solid #26C0E2' : 'none' }}>
                                                            <Typography variant='body2' textAlign="left">{row.prof_fullname}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1.5 }}>
                                                            <Typography variant='body2' textAlign="left">{row.srv_id}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1.2 }}>
                                                            <Typography variant='body2'><PhoneOutlinedIcon sx={{ fontSize: "16px", color: "#69A5EB" }} /> {row.phone_no}</Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant='body2'>
                                                                {row.Job_type ? row.Job_type : '-'}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardContent style={{ flex: 1 }}>
                                                            <Typography variant='body2'><CalendarMonthOutlinedIcon sx={{ fontSize: "16px", color: "#69A5EB" }} /> {row.doj}</Typography>
                                                        </CardContent>
                                                    </CandidateCard>
                                                </TableRow>
                                            ))
                                        )
                                    )}
                                </TableBody>

                                <Modal open={open} onClose={handleClose}>
                                    <Box sx={{
                                        position: 'absolute', top: '50%', left: '50%',
                                        transform: 'translate(-50%, -50%)', width: 600,
                                        bgcolor: 'background.paper', boxShadow: 24, p: 3,
                                        borderRadius: 2,
                                        overflowY: 'scroll', maxHeight: '400px'
                                    }}>
                                        <Box sx={{ width: '90%', maxWidth: 500, borderRadius: 2, border: 'none' }}>
                                            <AppBar
                                                position="static"
                                                sx={{
                                                    background: 'linear-gradient(45deg, #1FD0C4 38.02%, #0E8FE4 100%)',
                                                    width: '40em',
                                                    height: '3rem',
                                                    mt: '-24px',
                                                    ml: '-24.7px',
                                                    borderRadius: '8px 0px 0 0',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mt: 1 }}>
                                                    <Typography variant="h6" component="h2">Professional Payment Details</Typography>
                                                    <IconButton onClick={handleClose} size="small">
                                                        <CloseIcon />
                                                    </IconButton>
                                                </Box>
                                            </AppBar>
                                        </Box>

                                        {/* Grid layout for displaying professionals */}
                                        <Grid container spacing={2} sx={{ mt: 0.1, mb: 1 }}>
                                            <Grid item xs={6}>
                                                <Typography component="h2">Professional Code</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography component="h2">{profCode}</Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={2} sx={{ mb: 1 }}>
                                            <Grid item xs={6}>
                                                <Typography component="h2">Name</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography component="h2">{profName}</Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={2} sx={{ mb: 1 }}>
                                            <Grid item xs={6}>
                                                <Typography component="h2">Email Address</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography component="h2">Professional 2</Typography>
                                            </Grid>
                                        </Grid>

                                        <Typography sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Allocated Sub Service</Typography>

                                        <Grid container spacing={2} sx={{ mb: 1 }}>
                                            {subSrvCost.map((service, index) => (
                                                <React.Fragment key={service.prof_sub_srv_id}>
                                                    <Grid item xs={6}>
                                                        <Typography component="h2" style={{ marginTop: '5px' }}>
                                                            {service.sub_srv_name} <strong>[Rs.{service.prof_cost}]</strong>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <TextField
                                                            label="Enter Updated Cost"
                                                            variant="outlined"
                                                            fullWidth
                                                            size="small"
                                                            value={service.cost_prof_given || ''}
                                                            onChange={(event) => handleInputChange(event, index)}
                                                        />
                                                    </Grid>
                                                </React.Fragment>
                                            ))}
                                        </Grid>
                                        <Button style={{ backgroundColor: "#69A5EB", color: 'white', marginLeft: '19em', marginTop: '0.7em' }}
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                </Modal>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component="div"
                            count={filteredCandidates.length}
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
                            <CardContent
                                style={{
                                    flex: 5,
                                    width: `${progress}%`,
                                    borderRadius: '5px',
                                    transition: 'width 0.2s ease-out',
                                }}
                            >
                                {progress !== null && (
                                    <LinearProgressWithLabel value={progress} />
                                )}
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
                                </Stack>

                                <Grid container spacing={1} sx={{ mt: 1 }}>
                                    {documents.map((item, index) => (
                                        <Grid item xs={4} sm={4} lg={4} key={index}>
                                            <Box sx={{
                                                border: `1px solid ${item.approved ? '#00E08F' : item.rejected ? '#AF0F2A' : '#C9C9C9'}`,
                                                borderRadius: '4px', padding: '6px'
                                            }}>
                                                <div style={{ display: 'flex', height: '2em' }}>
                                                    <img src={item.professional_document} alt="" style={{ marginTop: '4px', height: '1.5em' }} />
                                                    <Typography variant='body2' sx={{ ml: 1 }}>{item.Documents_name}</Typography>
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
                                                    }}
                                                >
                                                    <VisuallyHiddenInput
                                                        type="file"
                                                        onChange={(e) => handleFileChange(e, item.doc_li_id, index)}
                                                    />
                                                </Button>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    <>
                                                        {/* {!item.approved && !approvedItems[index] && (
                                                            <>
                                                                {
                                                                    !foundDocumentIds.includes(item.doc_li_id) && (
                                                                        <div
                                                                            style={{
                                                                                backgroundColor: '#00E08F',
                                                                                color: 'white',
                                                                                borderRadius: '4px',
                                                                                padding: '4px 4px',
                                                                                fontSize: '14px',
                                                                                fontFamily: 'Roboto',
                                                                                cursor: 'pointer',
                                                                            }}
                                                                            onClick={() => handleApprove(index)}
                                                                        >
                                                                            <CheckIcon />
                                                                        </div>
                                                                    )
                                                                }
                                                            </>
                                                        )} */}

                                                        {!item.approved && !approvedItems[index] && (
                                                            <>
                                                                {/* Check if the item does not exist in foundDocumentIds */}
                                                                {!foundDocumentIds.includes(item.doc_li_id) && (
                                                                    <div
                                                                        style={{
                                                                            backgroundColor: '#00E08F',
                                                                            color: 'white',
                                                                            borderRadius: '4px',
                                                                            padding: '4px 4px',
                                                                            fontSize: '14px',
                                                                            fontFamily: 'Roboto',
                                                                            cursor: 'pointer',
                                                                        }}
                                                                        onClick={() => handleApprove(index)}
                                                                    >
                                                                        <CheckIcon />
                                                                    </div>
                                                                )}

                                                                {/* Check if the professional_document is null for the given doc_li_id */}
                                                                {foundDocumentIds.includes(item.doc_li_id) &&
                                                                    foundDocumentImages[foundDocumentIds.indexOf(item.doc_li_id)] === null && (
                                                                        <div
                                                                            style={{
                                                                                backgroundColor: '#00E08F',
                                                                                color: 'white',
                                                                                borderRadius: '4px',
                                                                                padding: '4px 4px',
                                                                                fontSize: '14px',
                                                                                fontFamily: 'Roboto',
                                                                                cursor: 'pointer',
                                                                            }}
                                                                            onClick={() => handleApprove(index)}
                                                                        >
                                                                            <CheckIcon />
                                                                        </div>
                                                                    )}
                                                            </>
                                                        )}

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
                                                            onClick={() => handleReject(index, item.doc_li_id)}
                                                        >
                                                            <CloseIcon />
                                                        </div>

                                                        {foundDocumentIds.includes(item.doc_li_id) && (
                                                            foundDocumentImages[foundDocumentIds.indexOf(item.doc_li_id)] !== null && (
                                                                <div
                                                                    style={{
                                                                        backgroundColor: 'skyblue',
                                                                        color: 'white',
                                                                        borderRadius: '4px',
                                                                        padding: '5px 5px',
                                                                        fontSize: '14px',
                                                                        fontFamily: 'Roboto',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                    onClick={() => {
                                                                        const index = foundDocumentIds.indexOf(item.doc_li_id);
                                                                        const documentImage = foundDocumentImages[index];
                                                                        console.log('Document ID:', item.doc_li_id);
                                                                        console.log('Professional Document Image:', documentImage);
                                                                        handleOpenImageModal(item.doc_li_id, documentImage);
                                                                    }}
                                                                >
                                                                    <VisibilityIcon />
                                                                </div>
                                                            )
                                                        )}

                                                        {/* {foundDocumentIds.includes(item.doc_li_id) && (
                                                            <div
                                                                style={{
                                                                    backgroundColor: 'skyblue',
                                                                    color: 'white',
                                                                    borderRadius: '4px',
                                                                    padding: '5px 5px',
                                                                    fontSize: '14px',
                                                                    fontFamily: 'Roboto',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={() => {
                                                                    const index = foundDocumentIds.indexOf(item.doc_li_id);
                                                                    const documentImage = foundDocumentImages[index];
                                                                    console.log('Document ID:', item.doc_li_id);
                                                                    console.log('Professional Document Image:', documentImage);
                                                                    handleOpenImageModal(item.doc_li_id, documentImage);
                                                                }}
                                                            >
                                                                <VisibilityIcon />
                                                            </div>
                                                        )} */}

                                                        <Modal
                                                            open={openImageModal}
                                                            onClose={handleCloseImageModal}
                                                        >
                                                            <div style={{
                                                                padding: '10px',
                                                                backgroundColor: 'white',
                                                                borderRadius: '8px',
                                                                outline: 'none',
                                                                margin: 'auto',
                                                                maxWidth: '600px', // Set a maximum width
                                                                maxHeight: '80vh', // Set a maximum height
                                                                overflowY: 'auto', // Allow scrolling if content overflows
                                                                marginTop: '7%',
                                                                position: 'relative'
                                                            }}>
                                                                <IconButton
                                                                    onClick={handleCloseImageModal}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        right: 0,
                                                                        top: 0,
                                                                        padding: '10px'
                                                                    }}
                                                                >
                                                                    <CloseIcon />
                                                                </IconButton>

                                                                {imageDoc && (
                                                                    <div>
                                                                        {
                                                                            imageDoc.endsWith('.jpg') ||
                                                                                imageDoc.endsWith('.jpeg') ||
                                                                                imageDoc.endsWith('.png') ||
                                                                                imageDoc.endsWith('.gif') ||
                                                                                imageDoc.endsWith('.bmp') ||
                                                                                imageDoc.endsWith('.webp') ||
                                                                                imageDoc.endsWith('.svg') ||
                                                                                imageDoc.endsWith('.tiff') ||
                                                                                imageDoc.endsWith('.jfif') ||
                                                                                imageDoc.endsWith('.ico') ?
                                                                                (
                                                                                    <img
                                                                                        src={imageDoc}
                                                                                        alt={`Document ID: ${selectedImageID}`}
                                                                                        style={{
                                                                                            width: '100%',
                                                                                            height: 'auto',
                                                                                            marginTop: '10px',
                                                                                            borderRadius: '4px',
                                                                                        }}
                                                                                    />
                                                                                ) : (
                                                                                    <a
                                                                                        href={imageDoc}
                                                                                        download
                                                                                        style={{
                                                                                            display: 'block',
                                                                                            marginTop: '10px',
                                                                                            textDecoration: 'none',
                                                                                            color: '#007BFF',
                                                                                            marginBottom: '20px'
                                                                                        }}
                                                                                    >
                                                                                        <DownloadIcon style={{ marginBottom: '-9px' }} /> Download File
                                                                                    </a>
                                                                                )}
                                                                    </div>
                                                                )}
                                                                {/* {imageDoc && (
                                                                    <img
                                                                        src={imageDoc}
                                                                        alt={`Document ID: ${selectedImageID}`}
                                                                        style={{ width: '100%', height: 'auto', marginTop: '10px', borderRadius: '4px' }} // Adjust styles as needed
                                                                    />
                                                                )} */}
                                                            </div>
                                                        </Modal>

                                                        <Modal open={openModal} onClose={handleCloseModal}>
                                                            <div
                                                                style={{
                                                                    padding: '20px',
                                                                    backgroundColor: 'white',
                                                                    borderRadius: '8px',
                                                                    outline: 'none',
                                                                    margin: 'auto',
                                                                    width: '300px',
                                                                    marginTop: '15%',
                                                                    position: 'relative',
                                                                }}
                                                            >

                                                                <Typography id="confirmation-modal-title" variant="h6"
                                                                    style={{ marginBottom: '12px', }}>
                                                                    Rejection
                                                                </Typography>

                                                                <IconButton
                                                                    onClick={handleCloseModal}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        right: 0,
                                                                        top: 1,
                                                                        padding: '10px',
                                                                    }}
                                                                >
                                                                    <ClearIcon />
                                                                </IconButton>

                                                                <TextField
                                                                    required
                                                                    label="Remark"
                                                                    id="Remark"
                                                                    name="remark"
                                                                    fullWidth
                                                                    sx={{
                                                                        '& input': {
                                                                            fontSize: '14px',
                                                                        },
                                                                    }}
                                                                    // value={remarkText}
                                                                    value={remarkText || ""}
                                                                    onChange={(e) => setRemarkText(e.target.value)}
                                                                />

                                                                <Button
                                                                    variant='contained'
                                                                    sx={{
                                                                        background: "#69A5EB",
                                                                        textTransform: "capitalize",
                                                                        borderRadius: "8px",
                                                                        width: "14ch",
                                                                        marginTop: '20px',
                                                                        ml: 10
                                                                    }}
                                                                    onClick={handleRemarkSubmit}
                                                                >
                                                                    Submit
                                                                </Button>
                                                            </div>
                                                        </Modal>
                                                    </>
                                                </div>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                            <Button variant='contained' sx={{ mb: 2, width: "25ch", textTransform: "capitalize", borderRadius: "10px", textAlign: 'center' }}
                                onClick={handleDocumentSubmit}
                            >
                                Save Documents
                            </Button>
                        </Card>

                        {/* DOCUMENTS OPEN */}
                        <Modal open={documentsModalOpen}>
                            <Box
                                sx={{
                                    padding: 4,
                                    backgroundColor: 'white',
                                    margin: 'auto',
                                    width: 400,
                                    borderRadius: 4,
                                    textAlign: 'center',
                                    marginTop: '10%',
                                }}
                            >
                                <TextField
                                    id="doj"
                                    label="Date of Joining*"
                                    size='small'
                                    type="date"
                                    value={doj}
                                    onChange={(e) => setDoj(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    error={!doj}
                                    helperText={!doj ? "This field is required" : ""}
                                />
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOk()}
                                        sx={{ minWidth: 100 }}
                                        disabled={!doj}
                                    >
                                        OK
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        // onClick={() => setDocumentsModalOpen(false)}
                                        sx={{ minWidth: 100, ml: 1 }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>
                    </Grid>
                </Grid>

                {/* Induction Submit Form */}
                <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                <Snackbar open={snackBarSaveOpen} autoHideDuration={3000} onClose={handleSnackbarDocumentsClose}>
                    <Alert onClose={handleSnackbarDocumentsClose} severity="success" sx={{ width: '100%' }}>
                        {snackMessageDocuments}
                    </Alert>
                </Snackbar>

                <Snackbar open={snackBarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackBarSeverity} sx={{ width: '100%' }}>
                        {snackMessage}
                    </Alert>
                </Snackbar>
            </Box>
            <Footer />
        </>
    )
}

export default Candidates
