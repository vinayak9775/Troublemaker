import React from 'react';
import Box from '@mui/material/Box';
import PageNotFound from "./assets/not_found.png";
import { Typography } from '@mui/material';

const NotFound = () => {
    return (
        <Box>
            <img src={PageNotFound} alt="" style={{ height: "100%", width: "100%" }} />
            {/* <Typography inline variant="body2" color="text.secondary">
                Looks like this page is on a wellness retreat! We couldn't find what you were looking for. You can get back on track by visiting our homepage
            </Typography> */}
        </Box>
    )
}

export default NotFound;
