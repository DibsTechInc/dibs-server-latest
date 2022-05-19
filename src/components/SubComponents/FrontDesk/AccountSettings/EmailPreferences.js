import { Grid, Typography, Stack, FormControlLabel, FormGroup, Switch } from '@mui/material';

const EmailPreferences = () => (
    <Grid container spacing={2}>
        <Grid item xs={7} md={6}>
            <Stack>
                <Grid item>
                    <Typography variant="h5">Email Preferences</Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1.5 }}>
                    <FormGroup>
                        <FormControlLabel control={<Switch defaultChecked />} label="Purchase receipts and class updates" />
                        <FormControlLabel control={<Switch defaultChecked />} label="Special offers & studio news" />
                    </FormGroup>
                </Grid>
            </Stack>
        </Grid>
    </Grid>
);

export default EmailPreferences;
