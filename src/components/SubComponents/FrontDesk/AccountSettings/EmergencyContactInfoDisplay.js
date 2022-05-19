import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Card, Stack, CardActions, TextField, Button, Grid, Typography, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import getAvailablePasses from 'actions/studios/users/getAvailablePasses';

// ==============================|| EMERGENCY CONTACT ||============================== //

const EmergencyContactInfoDisplay = (props) => {
    const { ecName, ecEmail, ecPhone } = props;
    console.log(`ecName is: ${ecName}`);
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={12} sx={{ mt: 4, mb: 3 }}>
                <Stack>
                    <Grid item>
                        <TextField name="ecName" variant="standard" label="Name" value={ecName} sx={{ width: '200px' }} />
                    </Grid>
                    <Grid item>
                        <TextField name="ecEmail" variant="standard" label="Email" value={ecEmail || ''} sx={{ width: '200px' }} />
                    </Grid>
                    <Grid item>
                        <TextField name="ecPhone" variant="standard" label="Phone" value={ecPhone || ''} sx={{ width: '200px' }} />
                    </Grid>
                </Stack>
            </Grid>
        </Grid>
    );
};
EmergencyContactInfoDisplay.propTypes = {
    ecName: PropTypes.string,
    ecEmail: PropTypes.string,
    ecPhone: PropTypes.string
};

export default EmergencyContactInfoDisplay;
