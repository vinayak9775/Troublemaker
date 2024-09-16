import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from '../../Footer';
import { Box } from '@mui/system';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import { Grid, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Services from './Services';
import Payment from './Payment';

const MDashboard = () => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
        console.log(newValue, 'newwwwwwwwwww');
    };

    const [selectedRequestID, setSelectedRequestID] = useState('default');

    const handleRequestChange = (event) => {
        setSelectedRequestID(event.target.value);
        console.log(event.target.value, 'hos idddddddd');
        inProcessCount(event.target.value);
        inPaymentCount(event.target.value);
        inPendingCount(event.target.value);
        inEnquiryCount(event.target.value);
        inConvertedCount(event.target.value);
        inFollowupCount(event.target.value);
        inCancelledCount(event.target.value);
        servicesCount(event.target.value);
        assignUnassignCount(event.target.value);
        inCancelledEnq(event.target.value);
        inInprocessedEnq(event.target.value);
        inPendingEnq(event.target.value);
        InUnassignProf(event.target.value);
        AllServicesCount(event.target.value);
        enqPendingCount(event.target.value);
    };

    //Get hospital list
    const [hospital, setHospital] = useState([]);
    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/agg_hhc_hospitals_api_web_form`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'hospital data');

                setHospital(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);

    const request = [
        { value: 'default', label: 'Select Hospital' },
        { value: 'all', label: 'all' },

        ...hospital.map(opt => ({
            value: opt.hosp_id,
            label: opt.hospital_name,
        })),
    ];

    //inprocess count
    const [inProcess, setInProcess] = useState({
        today: '',
        month: '',
        tilldate: ''
    });
    // hospital wise
    const inProcessCount = (id) => {

        const url = id === 'all'
            ? `${port}/web/pending_amount_received/`
            : `${port}/web/pending_amount_received/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'in process data hosp wise');
                setInProcess({
                    ...inProcess,
                    today: data.total_amount_received_today,
                    month: data.total_amount_received_month,
                    tilldate: data.total_amount_received_tll_date
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }
    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/pending_amount_received/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'in process data');
                setInProcess({
                    ...inProcess,
                    today: data.total_amount_received_today,
                    month: data.total_amount_received_month,
                    tilldate: data.total_amount_received_tll_date
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);

    //total inprocess modal data
    const [inprocessEnq, setInprocessEnq] = useState({
        today: [],
        month: [],
        tilldate: []
    });

    const inInprocessedEnq = (id) => {

        const url = id === 'all'
            ? `${port}/web/pending_amount_details/`
            : `${port}/web/pending_amount_details/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'cancelled_inq_detail data hosp wise');
                setInprocessEnq({
                    ...inprocessEnq,
                    today: data.total_amount_received_today,
                    month: data.total_amount_received_month,
                    tilldate: data.total_amount_received_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/pending_amount_details/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'cancelled_inq_detail data');
                setInprocessEnq({
                    ...inprocessEnq,
                    today: data.total_amount_received_today,
                    month: data.total_amount_received_month,
                    tilldate: data.total_amount_received_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);

    //payment collected count
    const [payment, setPayment] = useState({
        today: '',
        month: '',
        tilldate: ''
    });

    const inPaymentCount = (id) => {

        const url = id === 'all'
            ? `${port}/web/total_amount_received/`
            : `${port}/web/total_amount_received/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'payment data hosp wise');
                setPayment({
                    ...payment,
                    today: data.total_amount_received_today,
                    month: data.total_amount_received_month,
                    tilldate: data.total_amount_received_tll_date,

                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/total_amount_received/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'payment data');
                setPayment({
                    ...payment,
                    today: data.total_amount_received_today,
                    month: data.total_amount_received_month,
                    tilldate: data.total_amount_received_tll_date,
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);


    //total inprocess modal data
    const [pendingEnq, setpendingEnq] = useState({
        today: [],
        month: [],
        tilldate: []
    });

    const inPendingEnq = (id) => {

        const url = id === 'all'
            ? `${port}/web/unpaid_amount_details/`
            : `${port}/web/unpaid_amount_details/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'unpaid_amount_details data hosp wise');
                setpendingEnq({
                    ...pendingEnq,
                    today: data.total_Unpaid_amount_today,
                    month: data.total_Unpaid_amount_month,
                    tilldate: data.total_Unpaid_amount_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/unpaid_amount_details/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'unpaid_amount_details data');
                setpendingEnq({
                    ...pendingEnq,
                    today: data.total_Unpaid_amount_today,
                    month: data.total_Unpaid_amount_month,
                    tilldate: data.total_Unpaid_amount_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);
    //pending count
    const [pending, setPending] = useState({
        today: '',
        month: '',
        tilldate: ''
    });

    const inPendingCount = (id) => {

        const url = id === 'all'
            ? `${port}/web/unpaid_amount/`
            : `${port}/web/unpaid_amount/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'unpaid_amount data hosp wise');
                setPending({
                    ...hospital,
                    today: data.total_Unpaid_amount_today,
                    month: data.total_Unpaid_amount_month,
                    tilldate: data.total_Unpaid_amount_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/unpaid_amount/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'unpaid_amount data');
                setPending({
                    ...pending,
                    today: data.total_Unpaid_amount_today,
                    month: data.total_Unpaid_amount_month,
                    tilldate: data.total_Unpaid_amount_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);

    //total enquiry count
    const [enquiry, setEnquiry] = useState({
        today: '',
        month: '',
        tilldate: ''
    });

    const inEnquiryCount = (id) => {

        const url = id === 'all'
            ? `${port}/web/Calculate_Total_enquiry/`
            : `${port}/web/Calculate_Total_enquiry/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'enquiry data hosp wise');
                setEnquiry({
                    ...enquiry,
                    today: data.total_enq_today,
                    month: data.total_enq_month,
                    tilldate: data.total_enq_till_date
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/Calculate_Total_enquiry/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'enquiry data');
                setEnquiry({
                    ...enquiry,
                    today: data.total_enq_today,
                    month: data.total_enq_month,
                    tilldate: data.total_enq_till_date
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);

    //total converted count
    const [converted, setConverted] = useState({
        today: '',
        month: '',
        tilldate: ''
    });

    const inConvertedCount = (id) => {

        const url = id === 'all'
            ? `${port}/web/Calculate_converted_service/`
            : `${port}/web/Calculate_converted_service/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'converted data hosp wise');
                setConverted({
                    ...converted,
                    today: data.total_converted_today,
                    month: data.total_converted_month,
                    tilldate: data.total_converted_till_date
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/Calculate_converted_service/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'converted data');
                setConverted({
                    ...converted,
                    today: data.total_converted_today,
                    month: data.total_converted_month,
                    tilldate: data.total_converted_till_date
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);


    //total infollow up count
    const [followup, setFollowup] = useState({
        today: '',
        month: '',
        tilldate: ''
    });

    const inFollowupCount = (id) => {

        const url = id === 'all'
            ? `${port}/web/Calculate_infollow_up_service/`
            : `${port}/web/Calculate_infollow_up_service/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'Calculate_infollow_up_service data hosp wise');
                setFollowup({
                    ...followup,
                    today: data.total_follow_today,
                    month: data.total_follow_month,
                    tilldate: data.total_follow_tll_date
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/Calculate_infollow_up_service/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'Calculate_infollow_up_service data');
                setFollowup({
                    ...followup,
                    today: data.total_follow_today,
                    month: data.total_follow_month,
                    tilldate: data.total_follow_tll_date
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);

    //total cancelled count
    const [cancelled, setCancelled] = useState({
        today: '',
        month: '',
        tilldate: ''
    });

    const inCancelledCount = (id) => {

        const url = id === 'all'
            ? `${port}/web/Calculate_cancelled_service/`
            : `${port}/web/Calculate_cancelled_service/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'Calculate_infollow_up_service data hosp wise');
                setCancelled({
                    ...cancelled,
                    today: data.total_cancelled_today,
                    month: data.total_cancelled_month,
                    tilldate: data.total_cancelled_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/Calculate_cancelled_service/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'Calculate_infollow_up_service data');
                setCancelled({
                    ...cancelled,
                    today: data.total_cancelled_today,
                    month: data.total_cancelled_month,
                    tilldate: data.total_cancelled_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);

    //total Pending count
    const [pendinginq, setInqPending] = useState({
        today: '',
        month: '',
        tilldate: ''
    });

    const enqPendingCount = (id) => {

        const url = id === 'all'
            ? `${port}/web/Calculate_pending_service/`
            : `${port}/web/Calculate_pending_service/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'Calculate_pending_service data hosp wise');
                setInqPending({
                    ...pendinginq,
                    today: data.total_pending_today,
                    month: data.total_pending_month,
                    tilldate: data.total_pending_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/Calculate_pending_service/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'Calculate_pending_service data');
                setInqPending({
                    ...pendinginq,
                    today: data.total_pending_today,
                    month: data.total_pending_month,
                    tilldate: data.total_pending_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);

    //total cancelled modal data
    const [cancelledEnq, setCancelledEnq] = useState({
        today: [],
        month: [],
        tilldate: []
    });

    const inCancelledEnq = (id) => {

        const url = id === 'all'
            ? `${port}/web/cancelled_inq_detail/`
            : `${port}/web/cancelled_inq_detail/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'cancelled_inq_detail data hosp wise');
                setCancelledEnq({
                    ...cancelledEnq,
                    today: data.total_cancelled_today,
                    month: data.total_cancelled_month,
                    tilldate: data.total_cancelled_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/cancelled_inq_detail/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'cancelled_inq_detail data');
                setCancelledEnq({
                    ...cancelledEnq,
                    today: data.total_cancelled_today,
                    month: data.total_cancelled_month,
                    tilldate: data.total_cancelled_last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);


    //total services count
    const [services, setServices] = useState({
        total_service_today: '',
        total_service_this_month:'',
        total_servces_till_date: '',
        total_completed_servces_till_date: '',
        total_completed_servces_today: '',
        total_completed_servces_this_month: '',
        total_pending_service_till_date: '',
        total_pending_service_today: '',
        total_pending_service_this_month: '',
        total_ongoing_till_date: '',
        total_ongoing_today: '',
        total_ongoing_this_month: ''
    });

    const servicesCount = (id) => {

        const url = id === 'all'
            ? `${port}/web/TotalServicesOngoingPendingCompleted/`
            : `${port}/web/TotalServicesOngoingPendingCompleted/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'TotalServicesOngoingPendingCompleted data hosp wise');
                setServices({
                    ...services,
                    total_service_today: data.total_service_today,
                    total_service_this_month:data.total_service_this_month,
                    total_servces_till_date: data.total_servces_till_date,
                    total_completed_servces_till_date: data.total_completed_servces_till_date,
                    total_completed_servces_today: data.total_completed_servces_today,
                    total_completed_servces_this_month: data.total_completed_servces_this_month,
                    total_pending_service_till_date: data.total_pending_service_till_date,
                    total_pending_service_today: data.total_pending_service_today,
                    total_pending_service_this_month: data.total_pending_service_this_month,
                    total_ongoing_till_date: data.total_ongoing_till_date,
                    total_ongoing_today: data.total_ongoing_today,
                    total_ongoing_this_month: data.total_ongoing_this_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching TotalServicesOngoingPendingCompleted data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/TotalServicesOngoingPendingCompleted/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'TotalServicesOngoingPendingCompleted data');
                setServices({
                    ...services,
                    total_service_today: data.total_service_today,
                    total_service_this_month:data.total_service_this_month,
                    total_servces_till_date: data.total_servces_till_date,
                    total_completed_servces_till_date: data.total_completed_servces_till_date,
                    total_completed_servces_today: data.total_completed_servces_today,
                    total_completed_servces_this_month: data.total_completed_servces_this_month,
                    total_pending_service_till_date: data.total_pending_service_till_date,
                    total_pending_service_today: data.total_pending_service_today,
                    total_pending_service_this_month: data.total_pending_service_this_month,
                    total_ongoing_till_date: data.total_ongoing_till_date,
                    total_ongoing_today: data.total_ongoing_today,
                    total_ongoing_this_month: data.total_ongoing_this_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching TotalServicesOngoingPendingCompleted data:', error));
    }, []);

     //total unassign modal data
     const [unassignProf, setUassignProf] = useState({
        today: [],
        month: [],
        tilldate: []
    });

    const InUnassignProf = (id) => {

        const url = id === 'all'
            ? `${port}/web/unassign_professional/`
            : `${port}/web/unassign_professional/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'unassign_professional data hosp wise');
                setUassignProf({
                    ...unassignProf,
                    today: data.today,
                    month: data.this_month,
                    tilldate: data.last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/unassign_professional/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'unassign_professional data');
                setUassignProf({
                    ...unassignProf,
                    today: data.today,
                    month: data.this_month,
                    tilldate: data.last_month
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);

    //assign unassign professional
    const [assign, setAssign] = useState({
        total_professionals: '',
        assignToday: '',
        assignMonth: '',
        assignTill: '',
        unassignToday: '',
        unassignMonth: '',
        unassignTill: '',
    });

    const assignUnassignCount = (id) => {

        const url = id === 'all'
            ? `${port}/web/professional-count/`
            : `${port}/web/professional-count/?hosp_id=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'professional-count data hosp wise');
                setAssign({
                    ...assign,
                    total_professionals: data.total_professionals,
                    assignToday: data.assigned_professionals.today,
                    assignMonth: data.assigned_professionals.this_month,
                    assignTill: data.assigned_professionals.total,
                    unassignToday: data.unassigned_professionals.today,
                    unassignMonth: data.unassigned_professionals.this_month,
                    unassignTill: data.unassigned_professionals.total,
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching TotalServicesOngoingPendingCompleted data:', error));
    }

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/professional-count/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'professional-count data');
                setAssign({
                    ...assign,
                    total_professionals: data.total_professionals,
                    assignToday: data.assigned_professionals.today,
                    assignMonth: data.assigned_professionals.this_month,
                    assignTill: data.assigned_professionals.total,
                    unassignToday: data.unassigned_professionals.today,
                    unassignMonth: data.unassigned_professionals.this_month,
                    unassignTill: data.unassigned_professionals.total,
                })
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching professional data:', error));
    }, []);

//total service count till date

const [totalServiceCount, setTotalServiceCount] = useState(0);
    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/latest-service-count/`)
            .then(response => response.json())
            .then(data => {
                console.log(data, 'latest-service-count data');
                setTotalServiceCount(data.today_session_count)
                //   setPending(data);
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);




    //
      //total services data
      const [allServices, setAllServices] = useState({
        services:[],
        complete_service: {
            today:[],
            this_month:[],
            till_date:[]
        },
        ongoing_service: { 
            today:[],
            this_month:[],
            till_date:[]
        },
        pending_service: {
            today:[],
            this_month:[],
            till_date:[]
        },
    });

    useEffect(() => {
        // Fetch data from API
        fetch(`${port}/web/Details_of_ServicesOngoingPendingCompleted/`)
        .then(response => response.json())
            .then(data => {
                console.log(data, 'unassign_professional data');

                // Process and extract service names and counts
                const services = data.map(service => service.srv_name);

                const completeServiceToday = data.map(service => service.data.total_completed_today);
                const completeServiceThisMonth = data.map(service => service.data.total_completed_this_month);
                const completeServiceTillDate = data.map(service => service.data.total_completed_till_date);

                const ongoingServiceToday = data.map(service => service.data.total_ongoing_today);
                const ongoingServiceThisMonth = data.map(service => service.data.total_ongoing_this_month);
                const ongoingServiceTillDate = data.map(service => service.data.total_ongoing_till_date);

                const pendingServiceToday = data.map(service => service.data.total_pending_today);
                const pendingServiceThisMonth = data.map(service => service.data.total_pending_this_month);
                const pendingServiceTillDate = data.map(service => service.data.total_pending_till_date);

                // Set state with service names and counts
                setAllServices({
                    services,
                    complete_service: {
                        today: completeServiceToday,
                        this_month: completeServiceThisMonth,
                        till_date: completeServiceTillDate
                    },
                    ongoing_service: {
                        today: ongoingServiceToday,
                        this_month: ongoingServiceThisMonth,
                        till_date: ongoingServiceTillDate
                    },
                    pending_service: {
                        today: pendingServiceToday,
                        this_month: pendingServiceThisMonth,
                        till_date: pendingServiceTillDate
                    },
                });
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);

    const AllServicesCount = (id) => {

        const url = id === 'all'
            ? `${port}/web/Details_of_ServicesOngoingPendingCompleted/`
            : `${port}/web/Details_of_ServicesOngoingPendingCompleted/?hosp_id=${id}`;

        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data, 'unassign_professional data');

            // Process and extract service names and counts
            const services = data.map(service => service.srv_name);

            const completeServiceToday = data.map(service => service.data.total_completed_today);
            const completeServiceThisMonth = data.map(service => service.data.total_completed_this_month);
            const completeServiceTillDate = data.map(service => service.data.total_completed_till_date);

            const ongoingServiceToday = data.map(service => service.data.total_ongoing_today);
            const ongoingServiceThisMonth = data.map(service => service.data.total_ongoing_this_month);
            const ongoingServiceTillDate = data.map(service => service.data.total_ongoing_till_date);

            const pendingServiceToday = data.map(service => service.data.total_pending_today);
            const pendingServiceThisMonth = data.map(service => service.data.total_pending_this_month);
            const pendingServiceTillDate = data.map(service => service.data.total_pending_till_date);

            // Set state with service names and counts
            setAllServices({
                services,
                complete_service: {
                    today: completeServiceToday,
                    this_month: completeServiceThisMonth,
                    till_date: completeServiceTillDate
                },
                ongoing_service: {
                    today: ongoingServiceToday,
                    this_month: ongoingServiceThisMonth,
                    till_date: ongoingServiceTillDate
                },
                pending_service: {
                    today: pendingServiceToday,
                    this_month: pendingServiceThisMonth,
                    till_date: pendingServiceTillDate
                },
            });
        })
        .catch(error => console.error('Error fetching hospital data:', error));
    }
    return (
        <div>
            <Header />
            <div>
                <Box sx={{ typography: 'body1', mt: 2 }} >
                    <TabContext value={value}>
                        <Box sx={{
                            typography: 'body1',
                            backgroundColor: '#6AA5EB',
                            boxShadow: '4px 4px 10px 7px rgba(0, 0, 0, 0.05)',
                            borderRadius: '10px',
                            width: "auto",
                            height: "3.6rem",
                            display: 'flex',
                            // justifyContent: 'space-around',
                            marginLeft: '8px',
                            marginRight: '8px',
                            marginBottom: '8px',
                        }}>
                            <Stack direction="row" gap={0}>
                                <Box sx={{
                                    typography: 'body1',
                                    background: "#FFFFFF",
                                    borderRadius: '10px',
                                    width: "20rem",
                                    height: "2.8rem",
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginLeft: '2rem',
                                    marginRight: '8px',
                                    alignItems: 'center',
                                    mt: 1,
                                    // border: '2px solid black'
                                }}>
                                    <TabList
                                        className="tab-root"
                                        onChange={handleChange}
                                        textColor="#51DDD4"
                                        sx={{
                                            position: 'relative',
                                            // border: '1px solid #D8D8D8',
                                            borderRadius: '5px'
                                        }}
                                        TabIndicatorProps={{ style: { background: '#69A5EB', height: '36px', marginBottom: '8px', borderRadius: "10px" } }}
                                    >
                                        <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "1" ? '#ffffff' : 'black' }}>Today</span>} value="1" sx={{ position: 'relative', zIndex: 1, }} />
                                        <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "2" ? '#ffffff' : 'black' }}>This Month</span>} value="2" sx={{ position: 'relative', zIndex: 1, }} />
                                        <Tab label={<span style={{ fontSize: '15px', textTransform: "capitalize", color: value === "3" ? '#ffffff' : 'black' }}>Last Month</span>} value="3" sx={{ position: 'relative', zIndex: 1, }} />
                                    </TabList>
                                </Box>
                                {/* <Button variant="contained" style={{ backgroundColor: "#69A5EB", textTransform: "capitalize", borderRadius: "8px", }}><FileDownloadOutlinedIcon /></Button> */}
                            </Stack>
                            <Box
                                component="form"
                                sx={{ marginLeft: '8rem', p: "2px 4px", display: 'flex', alignItems: 'center', width: 300, height: '2.2rem', backgroundColor: "#ffffff", boxShadow: "4px 4px 10px 7px rgba(135, 135, 135, 0.05)", borderRadius: "10px", border: "1px solid #C9C9C9", mt: 1 }}
                            >
                                {/* <InputLabel id="demo-multiple-name-label">Name</InputLabel> */}

                                <TextField
                                    id="cancel_by"
                                    name="cancel_by"
                                    select
                                    size="small"
                                    fullWidth
                                    value={selectedRequestID}
                                    onChange={handleRequestChange}
                                    sx={{
                                        textAlign: "left", '& input': {
                                            fontSize: '14px',
                                        }, '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none',
                                            },
                                        },
                                    }}
                                >
                                    {request.map((option) => (
                                        <MenuItem key={option.value} value={option.value} disabled={option.value === 'default'}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>
                    </TabContext>
                </Box>

                <Grid item xs={12} container spacing={1}>
                    <Grid item lg={8} md={8} xs={12}>
                        <Services enquiry={enquiry} converted={converted} followup={followup} cancelled={cancelled} services={services} cancelledEnq={cancelledEnq} value={value} totalServiceCount={totalServiceCount} allServices={allServices} servicesname={allServices.services} pendinginq={pendinginq} />
                    </Grid>
                    <Grid item lg={4} md={4} xs={12}>
                        <Payment inprocesscount={inProcess} inpaymentcount={payment} inpendingcount={pending} value={value} assign={assign} inprocessEnq={inprocessEnq} pendingEnq={pendingEnq} unassignProf={unassignProf} />
                    </Grid>
                </Grid>
            </div>
            <Footer />
        </div>
    )
}

export default MDashboard;
