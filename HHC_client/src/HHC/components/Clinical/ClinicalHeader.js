import React from 'react';
import Header1 from '../ManagementDashboard/Header';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import ClosureDetails from './ClosureDetails';
import Navbar from '../../Navbar';
import TopHeader from './TopHeader';


const ClinicalHeader = () => {
    return (
        <div>
            {/* <Header1 /> */}
            <TopHeader/>
            <div style={{ marginTop: '7.5em' }}>
                <Box sx={{ typography: 'body1', }}>
                    <div style={{ position: 'fixed', top: '0', width: '100%', zIndex: 1000, marginTop: '3.5em' }}>
                        <TabContext>
                            <Box
                                sx={{
                                    typography: 'body1',
                                    backgroundColor: '#FFFFFF',
                                    boxShadow: '4px 4px 10px 7px rgba(0, 0, 0, 0.05)',
                                    borderRadius: '10px',
                                    width: "auto",
                                    height: "3rem",
                                    display: 'flex',
                                    // justifyContent: 'space-around',
                                    marginLeft: '8px',
                                    marginRight: '8px',
                                    marginBottom: '8px',
                                    paddingLeft: '15px',
                                    alignItems:'center'
                                }}>
                                <h3>
                                Clinical Governance
                                </h3>
                            </Box>
                        </TabContext>
                    </div>
                </Box>
            </div>
            <ClosureDetails/>
        </div>
    )
}

export default ClinicalHeader