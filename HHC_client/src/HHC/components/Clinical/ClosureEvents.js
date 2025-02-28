// import { Typography } from '@mui/material'
import { useMediaQuery, CircularProgress, Grid, TextField, Box, Stack, Button, AppBar, InputBase, Menu, MenuItem, Modal, Card, CardContent, Typography, Table, TableHead, TableRow, TableBody, TableContainer, TablePagination, Tooltip, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClosureFormOne from './closureform/ClosureFormOne';
import ClosureFormtwo from './closureform/ClosureFormTwo';
import ClosureFormThree from './closureform/ClosureFormThree';
import ClosureFormFour from './closureform/ClosureFormFour';
import ClosureFormFive from './closureform/ClosureFormFive';
import ClosureFormSix from './closureform/ClosureFormSix';
import ClosureFormSeven from './closureform/ClosureFormSeven';
import ClosureFormEight from './closureform/ClosureFormEight';
import ClosureFormNine from './closureform/ClosureFormNine';
import ClosureFormTen from './closureform/ClosureFormTen';
// import Button from '@mui/material/Button';

const ClosureEvents = ({ events, handleEvent, eid, handleSubmit }) => {
    const port = process.env.REACT_APP_API_KEY;
    const accessToken = localStorage.getItem('token');

    useEffect(() => {
        console.log(events);
    }, [events]);

    const jobClosureDtl = events[0]?.job_closure_dtl || [];
    const hca_jc = (events[0]?.job_closure_dtl && events[0].job_closure_dtl[0]?.hca_jc) || [];
    const formNo = events[0]?.job_cl_fm_no[0] || [];
    const allHcaJcData = jobClosureDtl.flatMap(detail => detail.hca_jc || []);

    console.log(hca_jc,allHcaJcData, 'hcaaaaaaaaaaaaa');
    // console.log(formNo, 'formNo');

    // console.log(events, 'eeeeeeeevvvvvvv');
    console.log(jobClosureDtl[0], 'jjjjjjjjjjj');
    const [dtlEvtId, setDtlEvtId] = useState(Array(jobClosureDtl.length).fill(''));
    //form1
    const [remarks, setRemarks] = useState(Array(jobClosureDtl.length).fill(''));
    //form one
    const [baselineState, setBaseline] = useState(Array(jobClosureDtl.length).fill(''));
    const [airwayState, setAirway] = useState(Array(jobClosureDtl.length).fill(''));
    const [breathingState, setBreathing] = useState(Array(jobClosureDtl.length).fill(''));
    const [circState, setCirc] = useState(Array(jobClosureDtl.length).fill(''));
    const [skinState, setSkin] = useState(Array(jobClosureDtl.length).fill(''));
    const [pulseState, setPulse] = useState(Array(jobClosureDtl.length).fill(''));
    const [tempState, setTemp] = useState(Array(jobClosureDtl.length).fill(''));
    const [rrState, setRR] = useState(Array(jobClosureDtl.length).fill(''));
    const [gcsState, setGCS] = useState(Array(jobClosureDtl.length).fill(''));
    const [spState, setSP] = useState(Array(jobClosureDtl.length).fill(''));
    const [tbState, setTB] = useState(Array(jobClosureDtl.length).fill(''));
    const [bpState, setBP] = useState(Array(jobClosureDtl.length).fill(''));
    const [remark1, setRemark1] = useState(Array(jobClosureDtl.length).fill(''));
    //form ten
    const [Strength_exer, setStrength_exer] = useState(Array(jobClosureDtl.length).fill(''));
    const [Stretch_exer, setStretch_exer] = useState(Array(jobClosureDtl.length).fill(''));
    const [Walk_indep, setWalk_indep] = useState(Array(jobClosureDtl.length).fill(''));
    const [Walker_stick, setWalker_stick] = useState(Array(jobClosureDtl.length).fill(''));
    const [remark2, setRemark2] = useState(Array(jobClosureDtl.length).fill(''));

    // form three
    const [wound, setWound] = useState(Array(jobClosureDtl.length).fill(''));
    const [oozing, setOozing] = useState(Array(jobClosureDtl.length).fill(''));
    const [discharge, setDischarge] = useState(Array(jobClosureDtl.length).fill(''));
    const [dressing, setDressing] = useState(Array(jobClosureDtl.length).fill(''));

    // form four
    const [Nameinjectionfld, setNameinjectionfld] = useState(Array(jobClosureDtl.length).fill(''));
    const [InjsiteIM, setInjsiteIM] = useState(Array(jobClosureDtl.length).fill(''));
    const [Dosefreq, setDosefreq] = useState(Array(jobClosureDtl.length).fill(''));
    const [Remark4, setRemark4] = useState(Array(jobClosureDtl.length).fill(''));

    // form Five
    const [Catheter_type, setCatheter_type] = useState(Array(jobClosureDtl.length).fill(''));
    const [Size_catheter, setSize_catheter] = useState(Array(jobClosureDtl.length).fill(''));
    const [Procedure, setProcedure] = useState(Array(jobClosureDtl.length).fill(''));
    const [remark5, setRemark5] = useState(Array(jobClosureDtl.length).fill(''));

    //form six
    const [remark6, setRemark6] = useState(Array(jobClosureDtl.length).fill(''));

    //form seven

    const [pulse1, setPulse1] = useState(Array(jobClosureDtl.length).fill(''));
    const [temp1, setTemp1] = useState(Array(jobClosureDtl.length).fill(''));
    const [rr1, setRR1] = useState(Array(jobClosureDtl.length).fill(''));
    const [gcs1, setGCS1] = useState(Array(jobClosureDtl.length).fill(''));
    const [sp1, setSP1] = useState(Array(jobClosureDtl.length).fill(''));
    const [tb1, setTB1] = useState(Array(jobClosureDtl.length).fill(''));
    const [bp1, setBP1] = useState(Array(jobClosureDtl.length).fill(''));

    //f8
    const [sutures, setSutures] = useState(Array(jobClosureDtl.length).fill(''));
    const [staples, setStaples] = useState(Array(jobClosureDtl.length).fill(''));
    const [dehiWound, setDehiWound] = useState(Array(jobClosureDtl.length).fill(''));
    const [wound8, setWound8] = useState(Array(jobClosureDtl.length).fill(''));
    const [remark8, setRemark8] = useState(Array(jobClosureDtl.length).fill(''));

    //f9
    const [rtSize, setRTSize] = useState(Array(jobClosureDtl.length).fill(''));
    const [procedure1, setProcedure1] = useState(Array(jobClosureDtl.length).fill(''));
    const [remark9, setRemark9] = useState(Array(jobClosureDtl.length).fill(''));

    // Fetch previous remarks (example: on component mount)
    useEffect(() => {
        // Replace this with your actual previous remarks fetching logic
        if (jobClosureDtl) {
            const previousRemarks = jobClosureDtl.map((detail) => detail.Remark || '');
            // console.log(previousRemarks);

            const dtlEvt = jobClosureDtl.map((detail) => detail.jcolse_id || '');
            // console.log(dtlEvt, 'dtlEvt');
            // f1
            const baseline = jobClosureDtl.map((detail) => detail.Baseline || '');
            const airway = jobClosureDtl.map((detail) => detail.Airway || '');
            const breathing = jobClosureDtl.map((detail) => detail.Breathing || '');
            const circState = jobClosureDtl.map((detail) => detail.Circulation || '');
            const skinState = jobClosureDtl.map((detail) => detail.Skin_Perfusion || '');
            const pulseState = jobClosureDtl.map((detail) => detail.Pulse || '');
            const tempState = jobClosureDtl.map((detail) => detail.Temp_core || '');
            const rrState = jobClosureDtl.map((detail) => detail.RR || '');
            const gcsState = jobClosureDtl.map((detail) => detail.GCS_Total || '');
            const spState = jobClosureDtl.map((detail) => detail.SpO2 || '');
            const tbState = jobClosureDtl.map((detail) => detail.TBSL || '');
            const bpState = jobClosureDtl.map((detail) => detail.BP || '');
            const remark = jobClosureDtl.map((detail) => detail.Remark || '');
            // f10
            const strengthexer = jobClosureDtl.map((detail) => detail.Strength_exer || '');
            const stretchexer = jobClosureDtl.map((detail) => detail.Stretch_exer || '');
            const walkindep = jobClosureDtl.map((detail) => detail.Walk_indep || '');
            const walkerstick = jobClosureDtl.map((detail) => detail.Walker_stick || '');
            const phyremark = jobClosureDtl.map((detail) => detail.Remark || '');

            // f3
            const wound1 = jobClosureDtl.map((detail) => detail.Wound || '');
            const oozing1 = jobClosureDtl.map((detail) => detail.Oozing || '');
            const discharge1 = jobClosureDtl.map((detail) => detail.Discharge || '');
            const dressing1 = jobClosureDtl.map((detail) => detail.Dressing_status || '');

            // f3
            const Nameinjectionfld1 = jobClosureDtl.map((detail) => detail.Name_injection_fld || '');
            const InjsiteIM1 = jobClosureDtl.map((detail) => detail.Inj_site_IM || '');
            const Dosefreq1 = jobClosureDtl.map((detail) => detail.Dose_freq || '');
            const remark1 = jobClosureDtl.map((detail) => detail.Remark || '');

            //f5
            const Cathetertype = jobClosureDtl.map((detail) => detail.Catheter_type || '');
            const Sizecatheter = jobClosureDtl.map((detail) => detail.Size_catheter || '');
            const Procedure5 = jobClosureDtl.map((detail) => detail.Procedure || '');
            const RemarkN = jobClosureDtl.map((detail) => detail.Remark || '');

            //f6
            const RemarkM = jobClosureDtl.map((detail) => detail.Remark || '');

            //f7
            const pulse = jobClosureDtl.map((detail) => detail.Pulse || '');
            const temp = jobClosureDtl.map((detail) => detail.Temp_core || '');
            const rr = jobClosureDtl.map((detail) => detail.RR || '');
            const gcs = jobClosureDtl.map((detail) => detail.GCS_Total || '');
            const sp = jobClosureDtl.map((detail) => detail.SpO2 || '');
            const tb = jobClosureDtl.map((detail) => detail.TBSL || '');
            const bp = jobClosureDtl.map((detail) => detail.BP || '');

            //f8
            const sutures1 = jobClosureDtl.map((detail) => detail.Sutures_type || '');
            const staples1 = jobClosureDtl.map((detail) => detail.Num_Sutures_staples || '');
            const dehiWound1 = jobClosureDtl.map((detail) => detail.Wound_dehiscence || '');
            const wound18 = jobClosureDtl.map((detail) => detail.Wound || '');
            const remark8 = jobClosureDtl.map((detail) => detail.Remark || '');

            // f9
            const rtSize9 = jobClosureDtl.map((detail) => detail.Size_RT || '');
            const procedure9 = jobClosureDtl.map((detail) => detail.Procedure || '');
            const remarkLab = jobClosureDtl.map((detail) => detail.Remark || '')

            // console.log(strengthexer, 'strengthexerstrengthexerstrengthexerstrengthexer');
            setDtlEvtId(dtlEvt);
            setRemarks(previousRemarks);
            // f1
            setBaseline(baseline);
            setAirway(airway);
            setBreathing(breathing);
            setCirc(circState)
            setSkin(skinState)
            setPulse(pulseState)
            setTemp(tempState)
            setRR(rrState)
            setGCS(gcsState)
            setSP(spState)
            setTB(tbState)
            setBP(bpState)
            setRemark1(remark)
            // f10
            setStrength_exer(strengthexer);
            setStretch_exer(stretchexer)
            setWalk_indep(walkindep)
            setWalker_stick(walkerstick)
            setRemark2(phyremark)

            // f3
            setWound(wound1);
            setOozing(oozing1);
            setDischarge(discharge1);
            setDressing(dressing1);

            // f4
            setNameinjectionfld(Nameinjectionfld1)
            setInjsiteIM(InjsiteIM1)
            setDosefreq(Dosefreq1)
            setRemark4(remark1)

            // f5
            setCatheter_type(Cathetertype)
            setSize_catheter(Sizecatheter);
            setProcedure(Procedure5);
            setRemark5(RemarkN);

            // f6
            setRemark6(RemarkM);

            //f7
            setPulse1(pulse);
            setTemp1(temp);
            setRR1(rr);
            setGCS1(gcs);
            setSP1(sp);
            setTB1(tb);
            setBP1(bp);

            // f8
            setSutures(sutures1);
            setStaples(staples1);
            setDehiWound(dehiWound1);
            setWound8(wound18);
            setRemark8(remark8);

            //f9
            setRTSize(rtSize9);
            setProcedure1(procedure9);
            setRemark9(remarkLab);
        }
    }, [jobClosureDtl]);

    const handleRemarkChange = (index, newRemark) => {
        const updatedRemarks = [...remarks];
        updatedRemarks[index] = newRemark;
        setRemarks(updatedRemarks);
    };

    return (
        <Box>
            <Grid container spacing={1}>

                <Grid item md={3} xs={12} style={{ position: 'fixed', width: '25%' }}>
                    <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
                        <div>
                            <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>CALLER DETAILS</Typography>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                <Typography inline variant="body2" color="text.secondary">Contact</Typography>
                                <Typography inline variant="body2" sx={{ ml: 0 }}>{events[0]?.cl_dtt?.phone ? `+91 ${events[0].cl_dtt.phone}` : " "}</Typography>
                            </Grid>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                <Typography inline variant="body2" color="text.secondary">Name</Typography>
                                <Typography inline variant="body2" sx={{ ml: 0 }}>{events[0]?.cl_dtt?.caller_fullname ? `${events[0].cl_dtt.caller_fullname}` : " "}</Typography>
                            </Grid>
                        </div>
                    </Card>

                    <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px', padding: '10px', marginTop: '15px' }}>
                        <div>
                            <Typography sx={{ fontSize: 16, fontWeight: 600, }} color="text.secondary" gutterBottom>PATIENT DETAILS</Typography>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                <Typography inline variant="body2" color="text.secondary">Contact</Typography>
                                <Typography inline variant="body2" sx={{ ml: 0 }}>{events[0]?.pt_dtt?.phone_no ? `+91 ${events[0].pt_dtt.phone_no}` : " "}</Typography>
                            </Grid>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                <Typography inline variant="body2" color="text.secondary">Name</Typography>
                                <Typography inline variant="body2" sx={{ ml: 0 }}>{events[0]?.pt_dtt?.name ? `${events[0].pt_dtt.name}` : " "}</Typography>
                            </Grid>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                <Typography inline variant="body2" color="text.secondary">Email</Typography>
                                <Typography inline variant="body2" sx={{ ml: 0 }}>{events[0]?.pt_dtt?.patient_email_id ? `${events[0].pt_dtt.patient_email_id}` : " "}</Typography>
                            </Grid>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                <Typography inline variant="body2" color="text.secondary">Age</Typography>
                                <Typography inline variant="body2" sx={{ ml: 0 }}>{events[0]?.pt_dtt?.Age ? `${events[0].pt_dtt.Age}` : " "}</Typography>
                            </Grid>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                <Typography inline variant="body2" color="text.secondary">Gender</Typography>
                                <Typography inline variant="body2" sx={{ ml: 0 }}>{events[0]?.pt_dtt?.gender_name ? `${events[0].pt_dtt.gender_name}` : " "}</Typography>
                            </Grid>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                <Typography inline variant="body2" color="text.secondary">Address</Typography>
                                <Typography inline variant="body2" sx={{ ml: 0 }}>{events[0]?.pt_dtt?.address ? `${events[0].pt_dtt.address}` : " "}</Typography>
                            </Grid>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                <Typography inline variant="body2" color="text.secondary">Consultant Name</Typography>
                                <Typography inline variant="body2" sx={{ ml: 0 }}>{events[0]?.pt_dtt?.doct_cons_id?.cons_fullname ? `${events[0].pt_dtt.doct_cons_id.cons_fullname}` : " "}</Typography>
                            </Grid>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                <Typography inline variant="body2" color="text.secondary">Consultant Contact</Typography>
                                <Typography inline variant="body2" sx={{ ml: 0 }}>{events[0]?.pt_dtt?.doct_cons_id?.mobile_no ? `${events[0].pt_dtt.doct_cons_id.mobile_no}` : " "}</Typography>
                            </Grid>
                            <Grid container style={{ justifyContent: "space-between", marginTop: "10px" }}>
                                <Typography inline variant="body2" color="text.secondary">Hospital Name</Typography>
                                <Typography inline variant="body2" sx={{ ml: 0 }}>{events[0]?.pt_dtt?.preferred_hosp_id?.hospital_name ? `${events[0].pt_dtt.preferred_hosp_id.hospital_name}` : " "}</Typography>
                            </Grid>
                        </div>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12} style={{ marginLeft: '25%', height: '480px', overflowY: 'scroll' }}>
                    <Card style={{ background: '#ffffff', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.05)', borderRadius: '10px', padding: '10px', marginTop: '10px' }}>
                        <div>
                            {console.log(jobClosureDtl)}
                            {jobClosureDtl.length === 0 ? (
                                 <Card style={{ background: '#f9f9f9', boxShadow: '4px 4px 10px 7px rgba(135, 135, 135, 0.1)', borderRadius: '10px', padding: '20px', textAlign: 'center', marginTop: '20px' }}>
                                 <Typography variant="h6" color="textSecondary">
                                     All closures are done
                                 </Typography>
                             </Card>
                            ):(
                            jobClosureDtl.map((detail, index) => (
                                <Accordion key={index} sx={{ mb: 1 }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`panel${index + 1}-content`}
                                        id={`panel${index + 1}-header`}
                                    >
                                        <Grid container spacing={12} alignItems="center">
                                            <Grid item>
                                                <Typography>Session {index + 1}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography textAlign={'right'}>Date: {detail?.session_date || ''}</Typography>
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container>
                                            <Grid item md={6} xs={12}>
                                                <Typography variant='p' sx={{ color: 'gray' }}>Professional Name: {detail?.prof_name?.prof_name || ''}</Typography><br />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <Typography variant='p' sx={{ color: 'gray' }}>Professional Phone: {detail?.prof_name?.prof_no || ''}</Typography><br />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <Typography variant='p' sx={{ color: 'gray' }}>Sub Service Name: {detail?.sub_srv_name || ''}</Typography><br />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <Typography variant='p' sx={{ color: 'gray' }}>Added By: {detail?.added_by || ''}</Typography><br />
                                            </Grid>
                                        </Grid>
                                        {/* <Typography variant='p' sx={{ color: 'gray' }}>Professional Name: {detail.prof_name.prof_name}</Typography><br />
                                        <Typography variant='p' sx={{ color: 'gray' }}>Professional Phone: {detail.prof_name.prof_nox}</Typography><br />
                                        <Typography variant='p' sx={{ color: 'gray' }}>Sub Service Name: {detail.sub_srv_name}</Typography><br />
                                        <Typography variant='p' sx={{ color: 'gray' }}>Added By: {detail.added_by}</Typography> */}
                                        <Typography>
                                            {events[0]?.job_cl_fm_no == 1 && <ClosureFormOne
                                                baseline={baselineState[index]}
                                                airway={airwayState[index]}
                                                skin={skinState[index]}
                                                breathing={breathingState[index]}
                                                circ={circState[index]}
                                                pulse={pulseState[index]}
                                                temp={tempState[index]}
                                                rr={rrState[index]}
                                                gcs={gcsState[index]}
                                                sp={spState[index]}
                                                tb={tbState[index]}
                                                bp={bpState[index]}
                                                Remark={remark1[index]}
                                                evtId={dtlEvtId[index]}
                                                formNo={events[0]?.job_cl_fm_no}
                                                closureStatus={events[0]?.job_closure_dtl[0].is_job_closure_done}
                                                dtlEventID={events[0]?.job_closure_dtl[0].dtl_eve_id}
                                                handleEvent={handleEvent}
                                                eid={eid}
                                            />}

                                            {events[0]?.job_cl_fm_no == 2 && <ClosureFormtwo
                                                events={detail.hca_jc}
                                                evtId={dtlEvtId[index]}
                                                formNo={events[0]?.job_cl_fm_no}
                                                closureStatus={events[0]?.job_closure_dtl[0].is_job_closure_done}
                                                dtlEventID={events[0]?.job_closure_dtl[0].dtl_eve_id}
                                                handleEvent={handleEvent}
                                                eid={eid}
                                            />}

                                            {events[0]?.job_cl_fm_no == 3 && <ClosureFormThree
                                                wound2={wound[index]}
                                                oozing2={oozing[index]}
                                                discharge2={discharge[index]}
                                                dressing2={dressing[index]}
                                                evtId={dtlEvtId[index]}
                                                formNo={events[0]?.job_cl_fm_no}
                                                closureStatus={events[0]?.job_closure_dtl[0].is_job_closure_done}
                                                dtlEventID={events[0]?.job_closure_dtl[0].dtl_eve_id}
                                                handleEvent={handleEvent}
                                                eid={eid}
                                            />}

                                            {events[0]?.job_cl_fm_no == 4 && <ClosureFormFour
                                                Nameinjectionfld1={Nameinjectionfld[index]}
                                                InjsiteIM1={InjsiteIM[index]}
                                                Dosefreq1={Dosefreq[index]}
                                                remark1={Remark4[index]}
                                                evtId={dtlEvtId[index]}
                                                formNo={events[0]?.job_cl_fm_no}
                                                closureStatus={events[0]?.job_closure_dtl[0].is_job_closure_done}
                                                dtlEventID={events[0]?.job_closure_dtl[0].dtl_eve_id}
                                                handleEvent={handleEvent}
                                                eid={eid}
                                            />}

                                            {events[0]?.job_cl_fm_no == 5 && <ClosureFormFive
                                                Cathetertype1={Catheter_type[index]}
                                                Sizecatheter1={Size_catheter[index]}
                                                Procedure1={Procedure[index]}
                                                RemarkN={remark5[index]}
                                                evtId={dtlEvtId[index]}
                                                formNo={events[0]?.job_cl_fm_no}
                                                closureStatus={events[0]?.job_closure_dtl[0].is_job_closure_done}
                                                dtlEventID={events[0]?.job_closure_dtl[0].dtl_eve_id}
                                                handleEvent={handleEvent}
                                                eid={eid}
                                            />}

                                            {events[0]?.job_cl_fm_no == 6 && <ClosureFormSix
                                                remark={remark6[index]}
                                                evtId={dtlEvtId[index]}
                                                formNo={events[0]?.job_cl_fm_no}
                                                closureStatus={events[0]?.job_closure_dtl[0].is_job_closure_done}
                                                dtlEventID={events[0]?.job_closure_dtl[0].dtl_eve_id}
                                                handleEvent={handleEvent}
                                                eid={eid}
                                            />}

                                            {events[0]?.job_cl_fm_no == 7 && <ClosureFormSeven
                                                pulse={pulse1[index]}
                                                temp={temp1[index]}
                                                rr={rr1[index]}
                                                gcs={gcs1[index]}
                                                sp={sp1[index]}
                                                tb={tb1[index]}
                                                bp={bp1[index]}
                                                evtId={dtlEvtId[index]}
                                                formNo={events[0]?.job_cl_fm_no}
                                                closureStatus={events[0]?.job_closure_dtl[0].is_job_closure_done}
                                                dtlEventID={events[0]?.job_closure_dtl[0].dtl_eve_id}
                                                handleEvent={handleEvent}
                                                eid={eid}
                                            />}

                                            {events[0]?.job_cl_fm_no == 8 && <ClosureFormEight
                                                sutures1={sutures[index]}
                                                staples1={staples[index]}
                                                dehiWound1={dehiWound[index]}
                                                wound18={wound8[index]}
                                                remark8={remark8[index]}
                                                evtId={dtlEvtId[index]}
                                                formNo={events[0]?.job_cl_fm_no}
                                                closureStatus={events[0]?.job_closure_dtl[0].is_job_closure_done}
                                                dtlEventID={events[0]?.job_closure_dtl[0].dtl_eve_id}
                                                handleEvent={handleEvent}
                                                eid={eid}
                                            />}

                                            {events[0]?.job_cl_fm_no == 9 && <ClosureFormNine
                                                rtSize9={rtSize[index]}
                                                procedure9={procedure1[index]}
                                                remarkLab={remark9[index]}
                                                evtId={dtlEvtId[index]}
                                                formNo={events[0]?.job_cl_fm_no}
                                                closureStatus={events[0]?.job_closure_dtl[0].is_job_closure_done}
                                                dtlEventID={events[0]?.job_closure_dtl[0].dtl_eve_id}
                                                handleEvent={handleEvent}
                                                eid={eid}
                                            />}

                                            {events[0]?.job_cl_fm_no == 10 && <ClosureFormTen
                                                Strength_exer={Strength_exer[index]}
                                                Stretch_exer={Stretch_exer[index]}
                                                Walk_indep={Walk_indep[index]}
                                                Walker_stick={Walker_stick[index]}
                                                remark2={remark2[index]}
                                                evtId={dtlEvtId[index]}
                                                formNo={events[0]?.job_cl_fm_no}
                                                closureStatus={events[0]?.job_closure_dtl[0].is_job_closure_done}
                                                dtlEventID={events[0]?.job_closure_dtl[0].dtl_eve_id}
                                                handleEvent={handleEvent}
                                                eid={eid}
                                            />}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                            )))}

                        </div>
                    </Card>
                </Grid>
            </Grid>
        </Box >
    )
}

export default ClosureEvents