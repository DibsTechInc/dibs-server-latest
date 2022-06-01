// import React from 'react';
import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const FlashCreditSettings = () => {
    const theme = useTheme();
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    Reward your clients when they come more often.
                    <br />
                    <br />
                </Typography>
            </Grid>
        </Grid>
    );
};

export default FlashCreditSettings;
