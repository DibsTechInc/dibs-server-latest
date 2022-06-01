import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Stack, Button } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

import updateGlobalPriceSettings from 'actions/studios/settings/updateGlobalPriceSettings';

const CommunicationTextField = styled(TextField)({
    '& .MuiInput-underline:before': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:before:hover': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderBottomColor: '#c96248'
    }
});

const CustomSendingDomain = (props) => {
    const theme = useTheme();
    const { dibsstudioid } = props;
    const [isEditing, setIsEditing] = React.useState(false);
    const [error, setError] = React.useState('');
    const [email, setEmail] = React.useState('studio@studio.com');
    const [phone, setPhone] = React.useState('(625) 822-8271');
    const [hasError, setHasError] = React.useState(false);
    const [hasSuccessMsg, setHasSuccessMsg] = React.useState(false);
    const [successMsg, setSuccessMsg] = React.useState('');

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    Enter the email address and phone number that your clients should use if they have customer service inquiries.
                    <br />
                </Typography>
            </Grid>
            <Grid item xs={7} sx={{ mt: 4 }}>
                {hasError && (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    </Grid>
                )}
                {hasSuccessMsg && (
                    <Grid item xs={12}>
                        <Typography variant="body1" sx={{ mb: 2, color: theme.palette.success.dark }}>
                            {successMsg}
                        </Typography>
                    </Grid>
                )}
                <Stack direction="row" spacing={2}>
                    <Grid item xs={3}>
                        <Typography variant="h6">Email</Typography>
                        {isEditing ? (
                            <CommunicationTextField
                                variant="standard"
                                // onChange={(e) => handleMinChange(e)}
                                // onFocus={() => handleMinFocus()}
                                sx={{ width: '50px' }}
                                value={email}
                            />
                        ) : (
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                {email}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h6">Phone #</Typography>
                        {isEditing ? (
                            <CommunicationTextField
                                variant="standard"
                                // onFocus={() => handleMaxFocus()}
                                // onChange={(e) => handleMaxChange(e)}
                                sx={{ width: '50px' }}
                                value={phone}
                            />
                        ) : (
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                {phone}
                            </Typography>
                        )}
                    </Grid>
                </Stack>
            </Grid>
            <Grid item xs={12} sx={{ mt: 4 }}>
                {isEditing ? (
                    <Stack direction="row" spacing={3}>
                        <Button
                            disableElevation
                            variant="contained"
                            color="primary"
                            // onClick={handleSubmit}
                            sx={{
                                bgcolor: theme.palette.globalcolors.submit,
                                '&:hover': {
                                    backgroundColor: theme.palette.globalcolors.hoverSubmit
                                }
                            }}
                        >
                            Submit
                        </Button>
                        <Button
                            disableElevation
                            variant="contained"
                            color="secondary"
                            // onClick={handleCancel}
                            sx={{
                                // color: '#fff',
                                bgcolor: theme.palette.globalcolors.cancel,
                                '&:hover': {
                                    backgroundColor: theme.palette.globalcolors.hover
                                }
                            }}
                        >
                            Cancel
                        </Button>
                    </Stack>
                ) : (
                    <Button disableElevation variant="contained" color="primary">
                        Edit
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};

// CustomerServiceSettings.propTypes = {
//     minp: PropTypes.number,
//     maxp: PropTypes.number
// };

export default CustomSendingDomain;
