import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Card, Stack, CardActions, Button, Grid, Typography, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import EmergencyContactInfoDisplay from './EmergencyContactInfoDisplay';

// ==============================|| EMERGENCY CONTACT ||============================== //

const EmergencyContact = (props) => {
    const { ecName, ecEmail, ecPhone, firstname } = props;
    console.log(`ecName is: ${ecName}`);
    const [hasEmergencyContactInfo, setHasEmergencyContactInfo] = useState(false);
    const msgtoshow = `${firstname} has not shared emergency contact information yet.`;
    const buttontext = hasEmergencyContactInfo ? 'Edit Emergency Contact' : 'Add Emergency Contact';
    useEffect(() => {
        if (ecName) {
            setHasEmergencyContactInfo(true);
        }
    }, [ecName, ecEmail, ecPhone]);
    return (
        <Grid container spacing={2}>
            <Grid item xs={7} md={6}>
                <Stack>
                    <Grid item>
                        <Typography variant="h5">Emergency Contact Info</Typography>
                    </Grid>
                    {!hasEmergencyContactInfo && (
                        <Grid item sx={{ mt: 3, mb: 2 }}>
                            <Typography>{msgtoshow}</Typography>
                        </Grid>
                    )}
                    {hasEmergencyContactInfo && (
                        <Grid item>
                            <EmergencyContactInfoDisplay ecName={ecName} ecEmail={ecEmail} ecPhone={ecPhone} />
                        </Grid>
                    )}
                    <Grid item xs={12} sx={{ mt: 1.5 }}>
                        <Button
                            sx={{
                                px: 2
                            }}
                        >
                            {buttontext}
                        </Button>
                    </Grid>
                </Stack>
            </Grid>
        </Grid>
    );
};
EmergencyContact.propTypes = {
    firstname: PropTypes.string
};

export default EmergencyContact;
