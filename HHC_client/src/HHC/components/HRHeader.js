import React, { useState, useEffect } from 'react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import ManageProfile from './Profile/ManageProfile';
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
import ManageAttendance from '../Attendance/ManageAttendance';
import AtteDashboard from '../Attendance/AtteDashboard';
import ManageReports from '../Attendance/ManageReports';
import ManagementDashboard from '../ManagementDashboard/MDashboard';
import HrDashboard from '../HrPartner/Dashboard/HrDashboard';
import ManageProfessionals from '../HrPartner/Professionals/ManageProfessionals';
import AddProfPartner from '../HrPartner/Professionals/AddProfPartner';
import ExternalProf from './ExternalProfessional/ExternalProf';
import Servicedetails from '../HrPartner/ServiceDetails/Servicedetails';
import { useNavigate } from 'react-router-dom';

const HRHeader = () => {
    const accessToken = localStorage.getItem('token');
    const port = process.env.REACT_APP_API_KEY;
    const location = useLocation();
    const permissionsString = localStorage.getItem('permissions');
    const permissions = permissionsString ? JSON.parse(permissionsString) : [];
    console.log(permissions, 'permissionspermissions');

    const userGroupLogin = localStorage.getItem('user_group');
    console.log(userGroupLogin);

    const moduleNames = permissions && Array.isArray(permissions)
        ? permissions.flatMap(permission =>
            permission.modules_submodule.flatMap(submodule =>
                submodule.modules.map(module => module.module_name)
            )
        )
        : [];
    console.log(moduleNames, 'module_names');

    const userGroup = localStorage.getItem('user_group');
    console.log(userGroup, 'userGroupuserGroupuserGroup');

    const Accesstoken = localStorage.getItem('token');
    console.log(Accesstoken, 'AccesstokenAccesstoken');

    //////////////////////// Admin Module Fetch permission
    const [moduleName, setModuleName] = useState([]);
    console.log(moduleName, 'Feteching Module Name');

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
                const response = await fetch(`${port}/web/combined/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
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
    console.log(selectedGroupName, 'group Name');

    const handleChange = (event, newValue) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
        setSelectedGroupName(newValue);
        if (userGroup === 'ADMIN') {
            setSelectedTab(newValue);
        }
        else {
            const selectedGroup = moduleName.find(module => module.r_m_name === newValue);

            // if (selectedGroup) {
            //     if (selectedGroup.modules && selectedGroup.modules.length > 0) {
            //         selectedGroup.modules.forEach(module => {
            //             console.log(module.name);
            //         });
            //     }
            //     if (selectedGroup.modules.length > 0) {
            //         setSelectedTab(selectedGroup.modules[0].module_id);
            //     }
            // }
            if (selectedGroup) {
                if (selectedGroup.modules && selectedGroup.modules.length > 0) {
                    selectedGroup.modules.forEach(module => {
                        console.log(module.name);
                    });
                }
                if (selectedGroup.modules.length > 0) {
                    setSelectedTab(selectedGroup.modules[0].module_id);
                }
            }
        }
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setSelectedGroupName('');
    };

    const [selectedTab, setSelectedTab] = useState(null);
    const navigate = useNavigate(); // hook for navigation

    console.log(selectedTab, 'Header Section selected ID');

    const handleTabClick = (groupName) => {
        if (selectedTab === groupName) {
            setSelectedTab(null);
        } else {
            setSelectedTab(groupName);

            if (typeof groupName === 'string') {
                setSelectedTab(groupName);
                const formattedGroupName = groupName.toLowerCase().replace(' ', ' ');
                // navigate(`/hrpartner/${formattedGroupName}`);
                if (userGroupLogin) {
                    navigate(`/${userGroupLogin.toLowerCase()}/${formattedGroupName}`);
                } else {
                    console.error('User group not found in localStorage.');
                }
            } else {
                console.error('Invalid groupName:', groupName);
            }
        }
    };

    const handlePopoverOpen = (event, groupName) => {
        setAnchorEl(event.currentTarget);
        setSelectedGroupName(groupName);
    };

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
                            {
                                userGroup === 'ADMIN' ?
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
                                                        backgroundColor: selectedTab === group.r_m_name ? 'rgba(31, 208, 196, 0.40)' : 'transparent',
                                                        marginTop: '4px',
                                                        borderRadius: '9px',
                                                        height: '15px',
                                                        textTransform: 'capitalize'
                                                    }}
                                                    key={group.r_m_id}
                                                    label={
                                                        group.modules && group.modules[0].name === "NULL" ? (
                                                            <Link to={`/hhc/${group.r_m_name.toLowerCase().replace(/\s/g, ' ')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                <Grid container spacing={1.5} alignItems="center">
                                                                    <Grid item>
                                                                        {moduleIcons[group.r_m_name]}
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <span style={{ fontSize: '1rem', textTransform: "capitalize" }}>{group.r_m_name.toLowerCase().replace(/\s/g, ' ')}</span>
                                                                    </Grid>
                                                                </Grid>
                                                            </Link>
                                                        ) : (
                                                            <Grid container spacing={1.5} alignItems="center">
                                                                <Grid item>
                                                                    {moduleIcons[group.r_m_name.toLowerCase().replace(/\s/g, ' ')]}
                                                                </Grid>
                                                                <Grid item>
                                                                    <span style={{ fontSize: '1rem', textTransform: "capitalize" }}>{group.r_m_name.toLowerCase().replace(/\s/g, ' ')}</span>
                                                                </Grid>
                                                                {group.modules && group.modules[0].name !== "NULL" && (
                                                                    <Grid item>
                                                                        <ArrowDropDownIcon />
                                                                    </Grid>
                                                                )}
                                                            </Grid>
                                                        )
                                                    }
                                                    value={group.r_m_name}
                                                />
                                            ))}
                                        </TabList>
                                    )
                                    :
                                    userGroup === userGroupLogin && (
                                        <TabContext value={selectedTab}>
                                            <TabList
                                                onChange={handleTabClick}
                                                textColor="#51DDD4"
                                                TabIndicatorProps={{
                                                    style: {
                                                        background: 'linear-gradient(90deg, rgba(31, 208, 196, 0.35) 0%, rgba(50, 142, 222, 0.35) 100%)',
                                                        height: '40px',
                                                        marginBottom: '10px',
                                                        borderRadius: '5px',
                                                    },
                                                }}
                                                variant="scrollable"
                                                scrollButtons="auto"
                                            >
                                                {
                                                    permissions.length > 0 ? (
                                                        permissions[0].modules_submodule.length > 1 ?
                                                            (
                                                                permissions[0].modules_submodule.map((group) => (
                                                                    <Tab
                                                                        style={{
                                                                            backgroundColor: selectedTab === group.r_m_name ? 'rgba(31, 208, 196, 0.40)' : 'transparent',
                                                                            marginTop: '4px',
                                                                            borderRadius: '9px',
                                                                            height: '15px',
                                                                            textTransform: 'capitalize',
                                                                        }}
                                                                        key={group.r_m_id}
                                                                        label={
                                                                            group.modules?.[0]?.module_name === 'NULL' ? (
                                                                                <Link
                                                                                    to={`/hhc/${group.r_m_name.toLowerCase().replace(/\s/g, ' ')}`}
                                                                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                                                                >
                                                                                    <Grid container spacing={1.5} alignItems="center">
                                                                                        <Grid item>{moduleIcons[group.r_m_name]}</Grid>
                                                                                        <Grid item>
                                                                                            <span style={{ fontSize: '1rem', textTransform: 'capitalize' }}>
                                                                                                {group.r_m_name.toLowerCase().replace(/\s/g, ' ')}
                                                                                            </span>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Link>
                                                                            ) : (
                                                                                <div
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        handlePopoverOpen(e, group.r_m_name);
                                                                                    }}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                >
                                                                                    <Grid container spacing={1.5} alignItems="center">
                                                                                        <Grid item>{moduleIcons[group.r_m_name]}</Grid>
                                                                                        <Grid item>
                                                                                            <span style={{ fontSize: '1rem', textTransform: 'capitalize' }}>
                                                                                                {group.r_m_name.toLowerCase().replace(/\s/g, ' ')}
                                                                                            </span>
                                                                                        </Grid>
                                                                                        {group.modules?.length > 0 && (
                                                                                            <Grid item>
                                                                                                <ArrowDropDownIcon />
                                                                                            </Grid>
                                                                                        )}
                                                                                    </Grid>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        value={group.r_m_name}
                                                                    />
                                                                ))
                                                            )
                                                            :
                                                            (
                                                                permissions[0].modules_submodule.map((submodule, index) => (
                                                                    submodule.modules.map((module, index) => (
                                                                        <Tab
                                                                            key={index}
                                                                            label={module.module_name}
                                                                            value={module.module_id.toString()}
                                                                            onClick={() => handleTabClick(module.module_name)}
                                                                        />
                                                                    ))
                                                                ))
                                                            )
                                                    ) : (
                                                        <div>No permissions found</div>
                                                    )
                                                }

                                                {
                                                    selectedGroupName && permissions[0]?.modules_submodule?.some(
                                                        (group) => group.r_m_name === selectedGroupName && group.modules?.length > 0
                                                    ) && (
                                                        <Popover
                                                            open={Boolean(anchorEl)}
                                                            anchorEl={anchorEl}
                                                            onClose={handlePopoverClose}
                                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                                            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                                                        >
                                                            <div style={{ padding: '10px' }}>
                                                                {permissions[0].modules_submodule
                                                                    .filter(
                                                                        (group) => group.r_m_name === selectedGroupName && group.modules?.length > 0
                                                                    )
                                                                    .flatMap((group) =>
                                                                        group.modules.map((module) => (
                                                                            <Link
                                                                                key={module.module_id}
                                                                                to={`/hhc/${group.r_m_name
                                                                                    .toLowerCase()
                                                                                    .replace(/\s/g, ' ')}/${module.module_name
                                                                                        .toLowerCase()
                                                                                        .replace(/\s/g, ' ')}`}
                                                                                style={{ textDecoration: 'none', color: 'black' }}
                                                                            >
                                                                                <Typography style={{ padding: '4px', color: 'black' }}>
                                                                                    {module.module_name}
                                                                                </Typography>
                                                                            </Link>
                                                                        ))
                                                                    )}
                                                            </div>
                                                        </Popover>
                                                    )
                                                }
                                            </TabList>
                                        </TabContext>
                                    )
                            }
                        </Box>

                        {userGroup === 'ADMIN' &&
                            moduleName && moduleName.length > 0 && moduleName.some(group => group.r_m_name === selectedGroupName && group.modules && group.modules.length > 0 && group.modules[0].name !== "NULL") && (
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
                                            if (group.r_m_name === selectedGroupName && group.modules && group.modules.length > 0 && group.modules[0].name !== "NULL") {
                                                return (
                                                    <div key={group.r_m_id}>
                                                        <Typography style={{ padding: '10px', color: 'black' }}>
                                                            {group.modules.map(module => (
                                                                <Link key={module.module_id}
                                                                    to={`/hhc/${group.r_m_name.toLowerCase().replace(/\s/g, ' ')}/${module.name.toLowerCase().replace(/\s/g, ' ')}`}
                                                                    style={{ textDecoration: 'none', color: 'black' }}>
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
                            )
                        }
                    </TabContext>
                </div>

                <Box sx={{ width: '100%', typography: 'body1', m: 1, zIndex: 1 }}>
                    <Routes>
                        <Route path="/hr/dashboard" element={<HRDashboard />} />
                        <Route path="/hr/manage profiles/add-prof" element={<ManageProfile />} />
                        <Route path="/hr/interview scheduled" element={<Interview />} />
                        <Route path="/hr/onboarding" element={<Candidates />} />
                        <Route path="/hr/our employees" element={<Employee />} />
                        <Route path="/hr/attendance" element={<Attendence />} />
                        <Route path="/hr/system user" element={<SystemUser />} />
                        <Route path="/hr/external professionals" element={<ExternalProf />} />

                        <Route path="hhc/hr/dashboard" element={<HRDashboard />} />
                        <Route path="hhc/hr/manage profiles/add-prof" element={<ManageProfile />} />
                        <Route path="hhc/hr/interview scheduled" element={<Interview />} />
                        <Route path="hhc/hr/onboarding" element={<Candidates />} />
                        <Route path="hhc/hr/our employees" element={<Employee />} />
                        <Route path="hhc/hr/attendance" element={<Attendence />} />
                        <Route path="hhc/hr/system user" element={<SystemUser />} />

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
                        <Route path='/hhc/accounts/dashboard' element={<AccountDashboard />} />
                        <Route path='/hhc/accounts/new export receipt' element={<NewExportReceipt />} />
                        <Route path='/hhc/accounts/export invoice' element={<ExportInvoice />} />
                        <Route path='/hhc/accounts/payment with professional' element={<PaymentWithProfessional />} />
                        <Route path='/hhc/accounts/payment with patient' element={<PaymentPatient />} />
                        <Route path='/hhc/accounts/manage cashfree payment' element={<Cashfree />} />
                        <Route path='/hhc/accounts/pending payment' element={<PendingPayment />} />
                        <Route path='/hhc/accounts/day print' element={<DayPrintBHV />} />
                        <Route path='/hhc/accounts/job closure report' element={<JobClosureAccount />} />
                        <Route path='/hhc/accounts/professional unit calculation' element={<ProfessionalUnit />} />
                        <Route path='/hhc/accounts/online transaction' element={<OnlineTransaction />} />
                        <Route path='/hhc/accounts/payment utr' element={<PaymentUTR />} />

                        {/* ATTENDANCE module */}
                        <Route path="/hhc/attendance/manageattendance" element={<ManageAttendance />} />
                        <Route path="/hhc/attendance/attendance-dashboard" element={<AtteDashboard />} />
                        <Route path="/hhc/attendance/manage report" element={<ManageReports />} />
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

                        {/* ATTENDANCE module */}
                        <Route path="/hhc/attendance/manage attendance" element={<ManageAttendance />} />
                        <Route path="/hhc/attendance/attendance-dashboard" element={<AtteDashboard />} />
                        <Route path="/hhc/attendance/manage report" element={<ManageReports />} />

                        {/* management dashboard */}
                        <Route path="/hhc/dashboard/management dashboard" element={<ManagementDashboard />} />

                        {/* /////hospital routing */}
                        <Route path='/hospital/dashboard' element={<HospitalDashboard />} />

                        {/* HR PARTNER */}
                        <Route path='/hr partner/dashboard' element={<HrDashboard />} />
                        <Route path="/hr partner/manage professionals" element={<ManageProfessionals />} />
                        <Route path="/hr partner/Add professionals" element={<AddProfPartner />} />
                        <Route path="/hr partner/service details" element={<Servicedetails />} />

                        <Route path='hhc/hr partner/dashboard' element={<HrDashboard />} />
                        <Route path="hhc/hr partner/manage professionals" element={<ManageProfessionals />} />
                        <Route path="hhc/hr partner/Add professionals" element={<AddProfPartner />} />
                        <Route path="hhc/hr partner/service details" element={<Servicedetails />} />
                        <Route path="hhc/hr/external professionals" element={<ExternalProf />} />

                    </Routes>
                </Box>
            </Box>
        </div>
    )
}

export default HRHeader



