// material-ui
import React from 'react';
import { Grid, Paper, Box } from '@mui/material';
import ReportingTabs from '../../../components/EntryPages/reporting';

// project imports

// ==============================|| FrontDesk Page ||============================== //

function Reporting() {
    console.log('reporting page');
    return (
        <Paper
            sx={{
                bgcolor: '#ffffff',
                borderRadius: 2,
                elevation: 0
            }}
        >
            <Grid container>
                <Box
                    xs={12}
                    sx={{
                        marginTop: '20px',
                        marginLeft: '20px',
                        marginRight: '20px',
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                    }}
                >
                    <Grid item xs={12}>
                        <ReportingTabs />
                    </Grid>
                </Box>
            </Grid>
        </Paper>
    );
}

export default Reporting;
