import { Grid, Typography, Stack, Button } from '@mui/material';

const DisableAccount = () => (
    <Grid container spacing={2}>
        <Grid item xs={7} md={6}>
            <Stack>
                <Grid item>
                    <Typography variant="h5">Disable Account</Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1.5 }}>
                    <Button
                        sx={{
                            px: 2
                        }}
                    >
                        Disable Account
                    </Button>
                </Grid>
            </Stack>
        </Grid>
    </Grid>
);

export default DisableAccount;
