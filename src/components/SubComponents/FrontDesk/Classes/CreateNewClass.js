import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
// import { Avatar, Box, Card, Grid, InputAdornment, OutlinedInput, TextField, Popper } from '@mui/material';
import { Avatar, Box, Card, Grid, Typography, TextField, Popper } from '@mui/material';

// ==============================|| CREATE NEW CLASS ||============================== //

const CreateNewClass = () => {
    const theme = useTheme();
    return (
        <Grid container>
            <Grid item xs={12} md={12}>
                <Typography variant="h5">Type of Class</Typography>
            </Grid>
        </Grid>
    );
};

export default CreateNewClass;
