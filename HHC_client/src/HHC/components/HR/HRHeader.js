import React, { useState, useEffect } from 'react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import ManageProfile from './Profile/ManageProfile';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Routes, Route, useLocation } from "react-router-dom";
import HRDashboard from './Dashboard/HRDashboard';
import Interview from './Interview/Interview';
import Candidates from './Onboarding/Candidates';
import Employee from './Employee/Employee';
import Attendence from './Attendence/Attendence';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { Grid, Popover, Typography } from '@mui/material';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import MenuIcon from '@mui/icons-material/Menu';
import CheckIcon from '@mui/icons-material/Check';
import SummarizeIcon from '@mui/icons-material/Summarize';
import Permission from '../ADMIN/Permission';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link } from 'react-router-dom';
import AdminDashboard from '../ADMIN/AdminDashboard';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AdminReport from '../ADMIN/Reports/AdminReport';
import EnquiryReport from '../ADMIN/Reports/EnquiryReport';
import ConsultantReport from '../ADMIN/Reports/ConsultantReport';
import HospitalReport from '../ADMIN/Reports/HospitalReport';
import MonthlyReport from '../ADMIN/Reports/MonthlyReport';
import PaymentCancellation from '../ADMIN/Reports/PaymentCancellation';
import RefundAmount from '../ADMIN/Reports/RefundAmount';
import JobClosure from '../ADMIN/Reports/JonClosure';
import ConsentForm from '../ADMIN/Reports/ConsentForm';
import ManageService from '../ADMIN/HCM/ManageService';
import ManageHospital from '../ADMIN/HCM/ManageHospital';
import ManageFeedBack from '../ADMIN/HCM/ManageFeedBack';
import ManagePayment from '../ADMIN/HCM/ManagePayment';
import NewExportReceipt from '../ADMIN/ACCOUNT/NewExportReceipt';
import ExportInvoice from '../ADMIN/ACCOUNT/ExportInvoice';
import PaymentWithProfessional from '../ADMIN/ACCOUNT/PaymentWithProfessional';
import PaymentPatient from '../ADMIN/ACCOUNT/PaymentPatient';
import Cashfree from '../ADMIN/ACCOUNT/Cashfree';
import PendingPayment from '../ADMIN/ACCOUNT/PendingPayment';
import DayPrintBHV from '../ADMIN/ACCOUNT/DayPrintBHV';
import JobClosureAccount from '../ADMIN/ACCOUNT/JobClosureAccount';
import ProfessionalUnit from '../ADMIN/ACCOUNT/ProfessionalUnit';
import AccountDashboard from '../ADMIN/ACCOUNT/AccountDashboard';
import LoginEmployees from '../ADMIN/HCM/LoginEmployees';
import OnlineTransaction from '../ADMIN/ACCOUNT/OnlineTransaction';
import HospitalDashboard from '../Hospitals/Dashboard/HospitalDashboard';
import AllocatedList from '../ADMIN/HCM/ProfessionalAllocation/AllocatedList';
import PaymentUTR from '../ADMIN/ACCOUNT/PaymentUTR';
import ProfessionalDetails from '../ADMIN/HCM/ProfessionalDetails';
import SystemUser from './SystemUser/SystemUser';

const HRHeader = () => {

    const port = process.env.REACT_APP_API_KEY;
    const location = useLocation();
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    console.log(permissions, 'permissionspermissions');

    const userGroup = localStorage.getItem('user_group');
    console.log(userGroup, 'userGroupuserGroupuserGroup');

    const Accesstoken = localStorage.getItem('token');
    console.log(Accesstoken, 'AccesstokenAccesstoken');

    //////////////////////// Admin Module Fetch permission
    const [moduleName, setModuleName] = useState([]);

    const moduleIcons = {
        Dashboard: <SpaceDashboardIcon style={{ fontSize: "18px" }} />,
        HCM: <PeopleAltOutlinedIcon style={{ fontSize: "22px" }} />,
        ACCOUNT: <CurrencyRupeeIcon style={{ fontSize: "22px" }} />,
        HR: <PersonOutlineIcon style={{ fontSize: "24px" }} />,
        REPORTS: <SummarizeIcon style={{ fontSize: "22px" }} />,
        ATTENDANCE: <CalendarTodayIcon style={{ fontSize: "16px" }} />,
        PERMISSION: <CheckIcon style={{ fontSize: "22px" }} />,
        INVENTORY: <MenuIcon style={{ fontSize: "22px" }} />,
        'Interview scheduled': <NotificationsNoneIcon style={{ fontSize: "22px" }} />,
        Onboarding: <PersonOutlineIcon style={{ fontSize: "24px" }} />,
        'Our Employees': <PeopleAltOutlinedIcon style={{ fontSize: "22px" }} />,
        Attendance: <CalendarMonthIcon style={{ fontSize: "22px" }} />,
        'Manage Profiles': <PeopleAltOutlinedIcon style={{ fontSize: "22px" }} />,
    };

    useEffect(() => {
        const fetchModuleName = async () => {
            try {
                const response = await fetch(`${port}/web/combined/`);
                const data = await response.json();
                console.log(data, 'module List');
                setModuleName(data)
            }
            catch (error) {
                console.log('Error Fetching Data');
            }
        }
        fetchModuleName();
    }, [])

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedGroupName, setSelectedGroupName] = useState('');

    const handleChange = (event, newValue) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
        setSelectedGroupName(newValue);

        if (userGroup === 'ADMIN') {
            setSelectedTab(newValue);
        } else {
            const selectedModule = moduleName.find(module => module.name === newValue);
            if (selectedModule && selectedModule.module_id) {
                setSelectedTab(selectedModule.module_id);
            }
        }
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setSelectedGroupName('');
    };

    const [selectedTab, setSelectedTab] = useState(null);

    console.log(selectedTab, 'Header Section selected ID');

    const handleTabClick = (groupName) => {
        if (selectedTab === groupName) {
            setSelectedTab(null);
        } else {
            setSelectedTab(groupName);
        }
    };

    // ////// by default set the background colour 
    // useEffect(() => {
    //     // Check if Dashboard is available in permissions and set it as selectedTab
    //     const dashboardModule = permissions.find(group => group.modules_submodule.some(module => module.name === 'Dashboard'));
    //     if (dashboardModule) {
    //         setSelectedTab('Dashboard');
    //     }
    // }, [permissions]);

    //     useEffect(() => {
    //     // Check if Dashboard is available in permissions and set it as selectedTab only for Admin group
    //     const adminGroup = permissions.find(group => group.name === 'Admin' && group.modules_submodule.some(module => module.name === 'Dashboard'));
    //     if (adminGroup) {
    //         setSelectedTab('Dashboard');
    //     }
    // }, [permissions]);


    return (
        <div style={{ marginTop: '7.5em' }}>
            <Box sx={{ typography: 'body1', }}>
                <div style={{ position: 'fixed', top: '0', width: '100%', zIndex: 1000, marginTop: '3.5em' }}>
                    <TabContext value={location.pathname}>
                        <Box
                            sx={{
                                typography: 'body1',
                                backgroundColor: '#FFFFFF',
                                boxShadow: '4px 4px 10px 7px rgba(0, 0, 0, 0.05)',
                                borderRadius: '10px',
                                width: "auto",
                                height: "3.6rem",
                                display: 'flex',
                                justifyContent: 'space-around',
                                marginLeft: '8px',
                                marginRight: '8px',
                                marginBottom: '8px',
                            }}>
                            {userGroup === 'ADMIN' ?
                                (
                                    <TabList
                                        className="tab-root"
                                        onChange={handleChange}
                                        textColor="#51DDD4"
                                        TabIndicatorProps={{
                                            style: {
                                                background: 'linear-gradient(90deg, rgba(31, 208, 196, 0.35) 0%, rgba(50, 142, 222, 0.35) 100%)',
                                                height: '40px',
                                                marginBottom: '10px',
                                                borderRadius: "5px"
                                            }
                                        }}
                                        variant="scrollable"
                                        scrollButtons="auto"
                                        aria-label="scrollable auto tabs example"
                                    >
                                        {moduleName.map((group) => (
                                            <Tab
                                                style={{
                                                    backgroundColor: selectedTab === group.group_name ? 'rgba(31, 208, 196, 0.40)' : 'transparent',
                                                    marginTop: '4px',
                                                    borderRadius: '9px',
                                                    height: '15px',
                                                    textTransform: 'capitalize'
                                                }}
                                                key={group.group}
                                                label={
                                                    group.modules && group.modules[0].name === "NULL" ? (
                                                        <Link to={`/hhc/${group.group_name.toLowerCase().replace(/\s/g, ' ')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                            <Grid container spacing={1.5} alignItems="center">
                                                                <Grid item>
                                                                    {moduleIcons[group.group_name]}
                                                                </Grid>
                                                                <Grid item>
                                                                    <span style={{ fontSize: '1rem', textTransform: "capitalize" }}>{group.group_name.toLowerCase().replace(/\s/g, ' ')}</span>
                                                                </Grid>
                                                            </Grid>
                                                        </Link>
                                                    ) : (
                                                        <Grid container spacing={1.5} alignItems="center">
                                                            <Grid item>
                                                                {moduleIcons[group.group_name.toLowerCase().replace(/\s/g, ' ')]}
                                                            </Grid>
                                                            <Grid item>
                                                                <span style={{ fontSize: '1rem', textTransform: "capitalize" }}>{group.group_name.toLowerCase().replace(/\s/g, ' ')}</span>
                                                            </Grid>
                                                            {group.modules && group.modules[0].name !== "NULL" && (
                                                                <Grid item>
                                                                    <ArrowDropDownIcon />
                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                    )
                                                }
                                                value={group.group_name}
                                            />
                                        ))}
                                    </TabList>
                                ) :
                                userGroup === 'HR' ? (
                                    <div style={{ overflowX: 'auto' }}>
                                        {permissions && permissions.length > 0 ? (
                                            <TabList
                                                className="tab-root"
                                                textColor="#51DDD4"
                                                TabIndicatorProps={{
                                                    style: {
                                                        backgroundColor: selectedTab === module.name ? 'rgba(31, 208, 196, 0.40)' : 'transparent',
                                                        height: '40px',
                                                        marginBottom: '10px',
                                                        borderRadius: "5px"
                                                    }
                                                }}
                                                variant="scrollable"
                                                scrollButtons="auto"
                                                aria-label="scrollable auto tabs example"
                                                style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', overflowX: 'auto' }}
                                            >
                                                {permissions.map((group) => (
                                                    group.modules_submodule && group.modules_submodule.map((module) => (
                                                        <Link
                                                            key={module.module_id}
                                                            to={`/hr/${module.name.toLowerCase().replace(/\s/g, ' ')}`}
                                                            style={{ textDecoration: 'none' }}
                                                        >
                                                            <Tab
                                                                style={{
                                                                    backgroundColor: selectedTab === module.name ? 'rgba(31, 208, 196, 0.40)' : 'transparent',
                                                                    marginTop: '4px',
                                                                    borderRadius: '9px',
                                                                    height: '15px',
                                                                    textTransform: 'capitalize',
                                                                    fontSize: '1rem',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '5px',
                                                                    color: '#000000',
                                                                }}
                                                                label={
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <span style={{ marginTop: '4px', marginRight: '3px' }}>{moduleIcons[module.name.toLowerCase().replace(/\s/g, ' ')]}</span>
                                                                        <span style={{ textTransform: "capitalize" }}>{module.name.toLowerCase().replace(/\s/g, ' ')}</span>
                                                                    </div>
                                                                }
                                                                value={module.module_id}
                                                                onClick={() => setSelectedTab(module.name)}
                                                            />
                                                        </Link>
                                                    ))
                                                ))}
                                            </TabList>
                                        ) : (
                                            <div>No tabs found</div>
                                        )}
                                    </div>
                                )
                                    :
                                    userGroup === 'HOSPITAL' && (
                                        <div style={{ overflowX: 'auto' }}>
                                            {permissions && permissions.length > 0 ? (
                                                <TabList
                                                    className="tab-root"
                                                    textColor="#51DDD4"
                                                    TabIndicatorProps={{
                                                        style: {
                                                            backgroundColor: selectedTab === module.name ? 'rgba(31, 208, 196, 0.40)' : 'transparent',
                                                            height: '40px',
                                                            marginBottom: '10px',
                                                            borderRadius: "5px",
                                                            alignItems: 'left',
                                                            justifyContent: 'flex-start',
                                                        }
                                                    }}
                                                    variant="scrollable"
                                                    scrollButtons="auto"
                                                    aria-label="scrollable auto tabs example"
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        gap: '10px',
                                                        alignItems: 'left',
                                                        justifyContent: 'flex-start',
                                                        overflowX: 'auto'
                                                    }}
                                                >
                                                    {permissions.map((group) => (
                                                        group.modules_submodule && group.modules_submodule.map((module) => (
                                                            <Link
                                                                key={module.module_id}
                                                                to={`/hospital/${module.name.toLowerCase().replace(/\s/g, ' ')}`}
                                                                style={{ textDecoration: 'none' }}
                                                            >
                                                                <Tab
                                                                    style={{
                                                                        backgroundColor: selectedTab === module.name ? 'rgba(31, 208, 196, 0.40)' : 'transparent',
                                                                        marginTop: '4px',
                                                                        borderRadius: '9px',
                                                                        height: '15px',
                                                                        textTransform: 'capitalize',
                                                                        fontSize: '1rem',
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        display: 'flex',
                                                                        alignItems: 'left',
                                                                        justifyContent: 'flex-start',
                                                                        textAlign: 'left',
                                                                        color: '#000000'
                                                                    }}
                                                                    label={
                                                                        <div style={{ display: 'flex', alignItems: 'left' }}>
                                                                            <span
                                                                                style={{
                                                                                    marginTop: '4px', marginRight: '3px', textAlign: 'left',
                                                                                }}
                                                                            >{moduleIcons[module.name.toLowerCase().replace(/\s/g, ' ')]}</span>
                                                                            <span style={{ textTransform: "capitalize", justifyContent: 'flex-start' }}>{module.name.toLowerCase().replace(/\s/g, ' ')}</span>
                                                                        </div>
                                                                    }
                                                                    value={module.module_id}
                                                                    onClick={() => setSelectedTab(module.name)}
                                                                />
                                                            </Link>
                                                        ))
                                                    ))}
                                                </TabList>
                                            ) : (
                                                <div>No tabs found</div>
                                            )}
                                        </div>
                                    )
                            }
                        </Box>

                        {moduleName && moduleName.length > 0 && moduleName.some(group => group.group_name === selectedGroupName && group.modules && group.modules.length > 0 && group.modules[0].name !== "NULL") && (
                            <Popover
                                open={Boolean(anchorEl) && selectedGroupName !== ''}
                                anchorEl={anchorEl}
                                onClose={handlePopoverClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                                onMouseEnter={() => setAnchorEl(anchorEl)}
                                onMouseLeave={handlePopoverClose}
                            >
                                <Typography style={{ padding: '10px' }}>
                                    {moduleName.map(group => {
                                        if (group.group_name === selectedGroupName && group.modules && group.modules[0].name !== "NULL") {
                                            return (
                                                <div key={group.group_name}>
                                                    <Typography style={{ padding: '10px', color: 'black' }}>
                                                        {group.modules.map(module => (
                                                            <Link key={module.module_id} to={`/hhc/${group.group_name.toLowerCase().replace(/\s/g, ' ')}/${module.name.toLowerCase().replace(/\s/g, ' ')}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                                <option value={module.module_id}>{module.name}</option>
                                                            </Link>
                                                        ))}
                                                    </Typography>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </Typography>

                            </Popover>
                        )}
                    </TabContext>
                </div>

                <Box sx={{ width: '100%', typography: 'body1', m: 1, zIndex: 1 }}>
                    <Routes>
                        <Route path="/hr/dashboard" element={<HRDashboard />} />
                        <Route path="/hr/manage profiles" element={<ManageProfile />} />
                        <Route path="/hr/interview scheduled" element={<Interview />} />
                        <Route path="/hr/onboarding" element={<Candidates />} />
                        <Route path="/hr/our employees" element={<Employee />} />
                        <Route path="/hr/attendance" element={<Attendence />} />
                        <Route path="/hr/system user" element={<SystemUser />} />

                        {/* ADMIN Routing */}
                        <Route path='/hhc/permission' element={<Permission />} />
                        <Route path='/hhc/dashboard' element={<AdminDashboard />} />

                        {/* ADMIN Report Routing */}
                        <Route path='/hhc/reports' element={<AdminReport />} />
                        <Route path='/hhc/reports/enquiry report' element={<EnquiryReport />} />
                        <Route path='/hhc/reports/consultant report' element={<ConsultantReport />} />
                        <Route path='/hhc/reports/hospital report' element={<HospitalReport />} />
                        <Route path='/hhc/reports/monthly report' element={<MonthlyReport />} />
                        <Route path='/hhc/reports/payment cancellation report' element={<PaymentCancellation />} />
                        <Route path='/hhc/reports/refund amount report' element={<RefundAmount />} />
                        <Route path='/hhc/reports/job closure report' element={<JobClosure />} />
                        <Route path='/hhc/reports/consent form report' element={<ConsentForm />} />

                        {/* ADMIN HCM Routing */}
                        <Route path='/hhc/HCM/manage service' element={<ManageService />} />
                        <Route path='/hhc/HCM/manage hospital' element={<ManageHospital />} />
                        <Route path='/hhc/HCM/manage feedback' element={<ManageFeedBack />} />
                        <Route path='/hhc/HCM/manage payment cancellations' element={<ManagePayment />} />
                        <Route path='/hhc/HCM/login employee' element={<LoginEmployees />} />
                        <Route path='/hhc/HCM/professional allocation' element={<AllocatedList />} />
                        <Route path='/hhc/HCM/professional details' element={<ProfessionalDetails />} />

                        {/*ADMIN ACCOUNT Routing */}
                        <Route path='/hhc/account/dashboard' element={<AccountDashboard />} />
                        <Route path='/hhc/account/new export receipt' element={<NewExportReceipt />} />
                        <Route path='/hhc/account/export invoice' element={<ExportInvoice />} />
                        <Route path='/hhc/account/payment with professional' element={<PaymentWithProfessional />} />
                        <Route path='/hhc/account/payment with patient' element={<PaymentPatient />} />
                        <Route path='/hhc/account/manage cashfree payment' element={<Cashfree />} />
                        <Route path='/hhc/account/pending payment' element={<PendingPayment />} />
                        <Route path='/hhc/account/day print' element={<DayPrintBHV />} />
                        <Route path='/hhc/account/job closure report' element={<JobClosureAccount />} />
                        <Route path='/hhc/account/professional unit calculation' element={<ProfessionalUnit />} />
                        <Route path='/hhc/account/online transaction' element={<OnlineTransaction />} />
                        <Route path='/hhc/account/payment utr' element={<PaymentUTR />} />

                        {/* /////hospital routing */}
                        <Route path='/hospital/dashboard' element={<HospitalDashboard />} />
                    </Routes>
                </Box>
            </Box>
        </div>
    )
}

export default HRHeader



