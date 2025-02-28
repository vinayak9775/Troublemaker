import * as React from 'react';
import { useState } from 'react';
import logo from "../../assets/spero_logo_3.png";
import "./Login.css";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import user from "../../assets/user.png"
import key from "../../assets/key.png"
import { useAuth } from '../Context/ContextAPI';

export default function Login() {

    const { handleAuth } = useAuth();
    const port = process.env.REACT_APP_API_KEY;
    const [login, setLogin] = useState({ clg_ref_id: "", password: "" })
    const [userIdError, setUserIdError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showExistErrorAlert, setShowExistErrorAlert] = useState(false);
    const [showExistErrorAlert1, setShowExistErrorAlert1] = useState(false);
    const [loading, setLoading] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const navigate = useNavigate()

    const handleChange = async (e) => {
        e.preventDefault();

        setUserIdError(login.clg_ref_id === "");
        setPasswordError(login.password === "");

        if (login.clg_ref_id === "" || login.password === "") {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${port}/web/login/`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ clg_ref_id: login.clg_ref_id, password: login.password })
            });
            if (response.status === 401) {
                console.log("Resource not found.");
                setShowExistErrorAlert1(true);
                setTimeout(() => setShowExistErrorAlert1(false), 3000);
            }
            if (response.status === 404) {
                console.log("Resource not found.");
                setShowErrorAlert(true);
                setTimeout(() => setShowErrorAlert(false), 3000);
            }
            else {
                setShowErrorAlert(false);
                const data = await response.json();
                if (data.msg === "User Already Logged In. Please check.") {
                    setShowExistErrorAlert(true);
                    setTimeout(() => setShowExistErrorAlert(false), 3000);
                } else {
                    console.log("Login Credentials.....", data);
                    localStorage.setItem('token', data.token.access);
                    localStorage.setItem('refresh', data.token.refresh);
                    localStorage.setItem('user-image', data.token.colleague.profile_photo_path);
                    localStorage.setItem('user-name', data.token.colleague.first_name);
                    localStorage.setItem('user-lname', data.token.colleague.last_name);
                    localStorage.setItem('user-email', data.token.colleague.email);
                    localStorage.setItem('user-phone', data.token.colleague.phone_no);
                    localStorage.setItem('user-loc', data.token.colleague.address);
                    localStorage.setItem('user-designation', data.token.colleague.designation);
                    localStorage.setItem('clg_id', data.token.colleague.id);
                    localStorage.setItem('hospitalId', data.token.colleague.clg_hosp_id);
                    localStorage.setItem('clgrefId', data.token.colleague.clg_ref_id);
                    localStorage.setItem('user_group', data.token.user_group);
                    localStorage.setItem('permissions', JSON.stringify(data.token.permissions));
                    localStorage.setItem('companyID', data.token.colleague.prof_compny);

                    if (data.token.user_group === "hd") {
                        navigate("/dashboard");
                        handleAuth();
                        window.location.reload();
                    }
                    else if (data.token.user_group === "HR") {
                        navigate('/hr/manage profiles');
                    }
                    else if (data.token.user_group === "HR Partner") {
                        navigate('/hr partner/manage professionals');
                    }
                    else if (data.token.user_group === "ADMIN") {
                        navigate("/hhc/dashboard");
                    }
                    else if (data.token.user_group === "ACCOUNT") {
                        navigate("/hhc/account/dashboard");
                    }
                    else if (data.token.user_group === "REPORTS") {
                        navigate("/reports/dashboard");
                    }
                    else if (data.token.user_group === "HOSPITAL") {
                        navigate("/hospital/dashboard");
                    }
                    else if (data.token.user_group === "ATTENDANCE") {
                        navigate("/attendance/attendance-view");
                    }
                    else if (data.token.user_group === "MANAGEMENT") {
                        navigate("/management/management-dashboard");
                    }
                    // else if (data.token.user_group === "clincal_gov") {
                    //     navigate("/hhc/clinical");
                    // }
                    else if (data.token.user_group === "clincal_gov") {
                        // navigate("/hhc/clinical");
                        navigate("/hhc/clinical/closure");
                    }

                    else if (data.token.user_group === "HHC_Analytics") {
                        navigate("/analytics/home");
                    }
                }
            }
        } catch (error) {
            console.error("Error during API call:", error);
        } finally {
            setLoading(false);
        }
    };

    const onchange = (e) => {
        const { name, value } = e.target;
        setLogin((prevLogin) => ({
            ...prevLogin,
            [name]: value,
        }));
        if (name === 'clg_ref_id') {
            setUserIdError(false);
        } else if (name === 'password') {
            setPasswordError(false);
        }
    }

    return (
        <>
            <div className="container">
                <div className="input_fields">
                    {isSmallScreen ? null : (
                        <img src={logo} alt="" style={{ height: "110px", width: "160px" }} />
                    )}
                    {/* <Typography variant='h6' sx={{ m: 2 }}>HD LOGIN</Typography> */}
                    {showErrorAlert && (
                        <Alert severity="error" variant="filled">Invalid User ID or Password!</Alert>
                    )}
                    {showExistErrorAlert && (
                        <Alert severity="error" variant="filled">User is already logged in!</Alert>
                    )}
                    {showExistErrorAlert1 && (
                        <Alert severity="error" variant="filled">Login Access Denied!</Alert>
                    )}
                    <Box component="form" sx={{ mt: 3, p: "2px 4px", display: 'flex', alignItems: 'center', height: '2.5rem', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "6px", border: "1px solid gray" }}>
                        <img src={user} alt="" style={{ height: "18px", marginLeft: "8px" }} />
                        <InputBase
                            sx={{ ml: 2, flex: 1, }}
                            placeholder="Enter User ID"
                            name="clg_ref_id"
                            onChange={onchange}
                            required
                            error={userIdError}
                            helperText={userIdError && "User ID is required"}
                        />
                    </Box>

                    {userIdError && (
                        <Typography variant="body2" color="error" textAlign="left">
                            User ID is required*
                        </Typography>
                    )}

                    <Box component="form" sx={{ mt: 3, p: "2px 4px", display: 'flex', alignItems: 'center', height: '2.5rem', boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "6px", border: "1px solid gray" }}>
                        <img src={key} alt="" style={{ height: "20px", marginLeft: "8px" }} />
                        <InputBase
                            sx={{ ml: 1.2, flex: 1, }}
                            placeholder="Enter Password"
                            type="password"
                            name="password"
                            onChange={onchange}
                            required
                            error={passwordError}
                            helperText={passwordError && "Password is required"}
                        />
                    </Box>
                    {passwordError && (
                        <Typography variant="body2" color="error" textAlign="left">
                            Password is required*
                        </Typography>
                    )}

                    <Button variant='contained' sx={{ mt: 5, width: '28ch', height: '7vh', backgroundColor: '#69A5EB', borderRadius: "6px", textTransform: "capitalize", }} onClick={handleChange} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                    </Button>
                    {isSmallScreen ? <img src={logo} alt="" style={{ height: "70px", width: "120px" }} /> : (null)}
                </div>
            </div>
        </>
    );
}

