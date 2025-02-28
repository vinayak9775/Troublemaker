import React, { useState, useEffect } from 'react';
// import { Counter } from './features/counter/Counter';
import Navbar from "./HHC/Navbar";
import Footer from "./HHC/Footer";
import Header from "./HHC/Header";
import NotFound from './HHC/NotFound';
import './App.css';
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import Viewservice from './HHC/components/HD/Viewservice';
import UserDetails from './HHC/components/UserDeatilsForm/UserDetails';
import Login from './HHC/components/Login/Login';
import Dashboard from './HHC/components/HD/Dashboard/Dashboard';
import Addservice from './HHC/components/HD/Addservice';
import Ongoingservice from './HHC/components/HD/Ongoingservice/Ongoingservice';
import Professional from './HHC/components/HD/Dashboard/Professional';
import ServiceRequest from './HHC/components/HD/Servicerequest/ServiceRequest';
import Enquiries from './HHC/components/HD/Enquiries/Enquiries';
import Schedule from './HHC/components/HD/Professional/Schedule';
import Membership from './HHC/components/HD/Membership/Membership';
import ManageProfile from './HHC/components/HR/Profile/ManageProfile';
import AddProfessional from './HHC/components/HR/Profile/AddProfessional';
import Interview from './HHC/components/HR/Interview/Interview';
import Candidates from './HHC/components/HR/Onboarding/Candidates';
import Employee from './HHC/components/HR/Employee/Employee';
import ConsentDetails from './HHC/components/HD/Viewservice/ConsentForm/ConsentDetails';
import HRDashboard from './HHC/components/HR/Dashboard/HRDashboard';
import HrDashboard from './HHC/components/HrPartner/Dashboard/HrDashboard';
import Attendence from './HHC/components/HR/Attendence/Attendence';
import Permission from './HHC/components/ADMIN/Permission';
import AdminDashboard from './HHC/components/ADMIN/AdminDashboard';
import HRHeader from './HHC/components/HR/HRHeader';
import HRNavbar from './HHC/components/HR/HRNavbar';
import AdminReport from './HHC/components/ADMIN/Reports/AdminReport';
import EnquiryReport from './HHC/components/ADMIN/Reports/EnquiryReport';
import ConsultantReport from './HHC/components/ADMIN/Reports/ConsultantReport';
import HospitalReport from './HHC/components/ADMIN/Reports/HospitalReport';
import MonthlyReport from './HHC/components/ADMIN/Reports/MonthlyReport';
import PaymentCancellation from './HHC/components/ADMIN/Reports/PaymentCancellation';
import RefundAmount from './HHC/components/ADMIN/Reports/RefundAmount';
import JobClosure from './HHC/components/ADMIN/Reports/JonClosure';
import ConsentForm from './HHC/components/ADMIN/Reports/ConsentForm';
import ManageService from './HHC/components/ADMIN/HCM/ManageService';
import ManageHospital from './HHC/components/ADMIN/HCM/ManageHospital';
import ManageFeedBack from './HHC/components/ADMIN/HCM/ManageFeedBack';
import ManagePayment from './HHC/components/ADMIN/HCM/ManagePayment';
import NewExportReceipt from './HHC/components/ADMIN/ACCOUNT/NewExportReceipt';
import ExportInvoice from './HHC/components/ADMIN/ACCOUNT/ExportInvoice';
import PaymentWithProfessional from './HHC/components/ADMIN/ACCOUNT/PaymentWithProfessional';
import PaymentPatient from './HHC/components/ADMIN/ACCOUNT/PaymentPatient';
import Cashfree from './HHC/components/ADMIN/ACCOUNT/Cashfree';
import PendingPayment from './HHC/components/ADMIN/ACCOUNT/PendingPayment';
import DayPrintBHV from './HHC/components/ADMIN/ACCOUNT/DayPrintBHV';
import JobClosureAccount from './HHC/components/ADMIN/ACCOUNT/JobClosureAccount';
import ProfessionalUnit from './HHC/components/ADMIN/ACCOUNT/ProfessionalUnit';
import ProfRequest from './HHC/components/HD/ProfRequest/ProfRequest';
import AccountDashboard from './HHC/components/ADMIN/ACCOUNT/AccountDashboard';
import LoginEmployees from './HHC/components/ADMIN/HCM/LoginEmployees';
import DemoPurpose from './HHC/components/ADMIN/DemoPurpose';
import HospitalDashboard from './HHC/components/Hospitals/Dashboard/HospitalDashboard';
import PaymentUTR from './HHC/components/ADMIN/ACCOUNT/PaymentUTR';
import ManagementDashboard from './HHC/components/ManagementDashboard/MDashboard';
import AllocatedList from './HHC/components/ADMIN/HCM/ProfessionalAllocation/AllocatedList';
import ManageAttendance from './HHC/components/Attendance/ManageAttendance';
import ManageReports from './HHC/components/Attendance/ManageReports';
import AtteDashboard from './HHC/components/Attendance/AtteDashboard';
import Home from './HHC/components/HHC_Analytics/Home';
import SystemUser from './HHC/components/HR/SystemUser/SystemUser';
import ManageProfessionals from './HHC/components/HrPartner/Professionals/ManageProfessionals';
import AddProfPartner from './HHC/components/HrPartner/Professionals/AddProfPartner';
import ExternalProf from './HHC/components/HR/ExternalProfessional/ExternalProf';
import Servicedetails from './HHC/components/HrPartner/ServiceDetails/Servicedetails';
import ClinicalHeader from './HHC/components/Clinical/ClinicalHeader';
import OnlineTransaction from './HHC/components/ADMIN/ACCOUNT/OnlineTransaction';
// import AuthUser from './HHC/components/AuthUser';

// import ProtectedRoute from './HHC/ProtectedRoute';
import ProfessionalDetails from './HHC/components/ADMIN/HCM/ProfessionalDetails';

function App() {

  const [isLoggIn, setIsLoggIn] = useState(
    localStorage.getItem('user_group') ? localStorage.getItem('user_group') === 'true' : false
  );

  useEffect(() => {
    const userGroup = localStorage.getItem('user_group');
    setIsLoggIn(userGroup === 'hr');
  }, []);

  const isLoggedIn = localStorage.getItem('isLoggedIn');

  return (
    <div className="App">
      <BrowserRouter basename="">
        <div>
          {isLoggIn && <HRNavbar />}
          {isLoggIn && <HRHeader />}
          <Routes>
            <Route exact path="/" element={<Login />} />

            {/* HD Module */}
            <Route exact path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login />} />
            <Route exact path="/addservice" element={isLoggedIn ? <Addservice /> : <Login />} />
            <Route exact path="/viewservice" element={isLoggedIn ? <Viewservice /> : <Login />} />
            <Route exact path="/ongoing" element={isLoggedIn ? <Ongoingservice /> : <Login />} />
            <Route exact path="/professional" element={isLoggedIn ? <Schedule /> : <Login />} />
            <Route exact path="/service-request" element={isLoggedIn ? <ServiceRequest /> : <Login />} />
            <Route exact path="/enquiries" element={isLoggedIn ? <Enquiries /> : <Login />} />
            <Route path="/prof-req" element={isLoggedIn ? <ProfRequest /> : <Login />} />
            <Route exact path="/membership" element={isLoggedIn ? <Membership /> : <Login />} />
            <Route path="/hhc/user" element={<UserDetails />} />
            <Route path="/consent/:eve_id/" element={<ConsentDetails />} />

            {/* ADMIN Module/ */}
            <Route path='/hhc/dashboard' element={<AdminDashboard />} />
            <Route path='/hhc/permission' element={<Permission />} />

            {/* ADMIN REPORT Module/ */}
            <Route path='/hhc/reports' element={<AdminReport />} />
            <Route path='/hhc/reports/enquiry report' element={<EnquiryReport />} />
            <Route path='/hhc/reports/consultant report' element={<ConsultantReport />} />
            <Route path='/hhc/reports/hospital report' element={<HospitalReport />} />
            <Route path='/hhc/reports/monthly report' element={<MonthlyReport />} />
            <Route path='/hhc/reports/payment cancellation report' element={<PaymentCancellation />} />
            <Route path='/hhc/reports/refund amount report' element={<RefundAmount />} />
            <Route path='/hhc/reports/job closure report' element={<JobClosure />} />
            <Route path='/hhc/reports/consent form report' element={<ConsentForm />} />

            {/* ADMIN HCM Module/ */}
            <Route path='/hhc/HCM/manage service' element={<ManageService />} />
            <Route path='/hhc/HCM/manage hospital' element={<ManageHospital />} />
            <Route path='/hhc/HCM/manage feedback' element={<ManageFeedBack />} />
            <Route path='/hhc/HCM/manage payment cancellations' element={<ManagePayment />} />
            <Route path='/hhc/HCM/login employee' element={<LoginEmployees />} />
            <Route path='/hhc/HCM/professional allocation' element={<AllocatedList />} />
            <Route path='/hhc/HCM/professional details' element={<ProfessionalDetails />} />

            {/* ACCOUNT Routing */}
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

            <Route path='/account/dashboard' element={<AccountDashboard />} />
            <Route path='/account/new export receipt' element={<NewExportReceipt />} />
            <Route path='/account/export invoice' element={<ExportInvoice />} />
            <Route path='/account/payment with professional' element={<PaymentWithProfessional />} />
            <Route path='/account/payment with patient' element={<PaymentPatient />} />
            <Route path='/account/manage cashfree payment' element={<Cashfree />} />
            <Route path='/account/pending payment' element={<PendingPayment />} />
            <Route path='/account/day print' element={<DayPrintBHV />} />
            <Route path='/account/job closure report' element={<JobClosureAccount />} />
            <Route path='/account/professional unit calculation' element={<ProfessionalUnit />} />
            <Route path='/account/online transaction' element={<OnlineTransaction />} />
            <Route path='/account/payment utr' element={<PaymentUTR />} />

            {/* HR Module */}
            <Route path="/hr/dashboard" element={<HRDashboard />} />
            <Route path="/hr/manage profiles" element={<ManageProfile />} />
            <Route path="/hr/manage profiles/add-prof" element={<AddProfessional />} />
            <Route path="/hr/interview scheduled" element={<Interview />} />
            <Route path="/hr/onboarding" element={<Candidates />} />
            <Route path="/hr/our employees" element={<Employee />} />
            <Route path="/hr/attendance" element={<Attendence />} />
            <Route path="/hr/system user" element={<SystemUser />} />
            <Route path="/hr/external professionals" element={<ExternalProf />} />

            <Route path="hhc/hr/dashboard" element={<HRDashboard />} />
            <Route path="hhc/hr/manage profiles" element={<ManageProfile />} />
            <Route path="hhc/hr/manage profiles/add-prof" element={<ManageProfile />} />
            <Route path="hhc/hr/interview scheduled" element={<Interview />} />
            <Route path="hhc/hr/onboarding" element={<Candidates />} />
            <Route path="hhc/hr/our employees" element={<Employee />} />
            <Route path="hhc/hr/attendance" element={<Attendence />} />
            <Route path="hhc/hr/system user" element={<SystemUser />} />
            <Route path="hhc/hr/external professionals" element={<ExternalProf />} />

            {/* temporary basis */}
            <Route path="/hhc/attendance" element={<DemoPurpose />} />
            <Route path="/hhc/inventory" element={<DemoPurpose />} />
            <Route path="/hhc/hcm/manage professional" element={<DemoPurpose />} />
            <Route path="/hhc/hcm/manage system users" element={<DemoPurpose />} />
            <Route path="/hhc/hcm/manage availability" element={<DemoPurpose />} />
            <Route path="/hhc/hcm/manage payments(vip)" element={<DemoPurpose />} />
            <Route path="/hhc/dashboard/dashboard" element={<DemoPurpose />} />
            <Route path="/hhc/account/paytm payment" element={<DemoPurpose />} />
            <Route path='/hospital/dashboard' element={<HospitalDashboard />} />
            {/* temporary basis */}


            {/* ATTENDANCE module */}
            <Route path="/hhc/attendance/manage attendance" element={<ManageAttendance />} />
            <Route path="/hhc/attendance/attendance-dashboard" element={<AtteDashboard />} />
            <Route path="/hhc/attendance/manage report" element={<ManageReports />} />

            {/* Management Dashboard */}
            <Route path="/management/management-dashboard" element={<ManagementDashboard />} />
            <Route path="/hhc/dashboard/management dashboard" element={<ManagementDashboard />} />
            <Route path="*" element={<NotFound />} />

            {/* clinical governance */}
            <Route path="/hhc/clinical" element={<ClinicalHeader />} />

            {/* Analytics */}
            <Route path="/analytics/home" element={<Home />} />

            {/* HR PARTNER */}
            <Route path='/hr partner/dashboard' element={<HrDashboard />} />
            <Route path="/hr partner/manage professionals" element={<ManageProfessionals />} />
            <Route path="/hr partner/Add professionals" element={<AddProfPartner />} />
            <Route path="/hr partner/service details" element={<Servicedetails />} />

            <Route path='hhc/hr partner/dashboard' element={<HrDashboard />} />
            <Route path="hhc/hr partner/manage professionals" element={<ManageProfessionals />} />
            <Route path="hhc/hr partner/Add professionals" element={<AddProfPartner />} />
            <Route path="hhc/hr partner/service details" element={<Servicedetails />} />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
