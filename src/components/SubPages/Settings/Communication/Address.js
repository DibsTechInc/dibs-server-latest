import React from 'react';
import validator from 'email-validator';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Stack, Button } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'store';

import { setCustomEmailToSendFrom } from 'store/slices/dibsstudio';
import UpdateSendingDomain from 'actions/studios/settings/updateSendingDomain';

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

const Address = () => {
    const theme = useTheme();
    const { config, customerService } = useSelector((state) => state.dibsstudio);
    const { address, address2, city, state, zipcode } = customerService;
    const dispatch = useDispatch();
    const { dibsStudioId } = config;
    const [isEditing, setIsEditing] = React.useState(false);
    const [error, setError] = React.useState('');
    const [hasError, setHasError] = React.useState(false);
    const [hasSuccessMsg, setHasSuccessMsg] = React.useState(false);
    const [successMsg, setSuccessMsg] = React.useState('');
    const [madeAddressBlank, setMadeAddressBlank] = React.useState(false);
    const [madeAddress2Blank, setMade2AddressBlank] = React.useState(false);
    const [madeCityBlank, setMadeCityBlank] = React.useState(false);
    const [madeStateBlank, setMadeStateBlank] = React.useState(false);
    const [madeZipBlank, setMadeZipBlank] = React.useState(false);
    const [addressValue, setAddressValue] = React.useState(address);
    const [address2Value, setAddress2Value] = React.useState(address2);
    const [cityValue, setCityValue] = React.useState(city);
    const [stateValue, setStateValue] = React.useState(state);
    const [zipValue, setZipValue] = React.useState(zipcode);
    const guidance = `Enter the address for your studio. If you have a virtual studio (i.e. if you only offer online classes), you can leave this section blank.`;

    console.log(`addressvalue is: ${addressValue}`);
    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    // const handleAddressFocus = () => {
    //     if (!madeCustomDomainBlank) {
    //         setCustomEmail('');
    //         setMadeCustomDomainBlank(true);
    //     }
    // };
    // const handleDomainChange = (e) => {
    //     setCustomEmail(e.target.value);
    // };
    const handleCancel = () => {
        setIsEditing(false);
        setHasError(false);
        setHasSuccessMsg(false);
        setError('');
        // setCustomEmail(customEmailToSendFrom);
        // setMadeCustomDomainBlank(false);
    };
    // const handleSubmit = async () => {
    //     setMadeCustomDomainBlank(false);
    //     const isValidEmail = validator.validate(customEmail);
    //     if (!isValidEmail) {
    //         setError(`The email address you entered doesn't seem to be valid. Can you try again?`);
    //         setHasError(true);
    //         setTimeout(() => {
    //             setHasError(false);
    //             setError('');
    //         }, 7000);
    //         return null;
    //     }
    //     await UpdateSendingDomain(dibsStudioId, customEmail).then((res) => {
    //         if (res.msg === 'success') {
    //             setHasSuccessMsg(true);
    //             setSuccessMsg(`Your email address has been updated.`);
    //             setTimeout(() => {
    //                 setHasSuccessMsg(false);
    //                 setSuccessMsg('');
    //             }, 7000);
    //             setIsEditing(false);
    //             setHasError(false);
    //             setError('');
    //             dispatch(setCustomEmailToSendFrom(customEmail));
    //         } else {
    //             setHasError(true);
    //             setError(`There was an error updating your email address. Please try again.`);
    //             setTimeout(() => {
    //                 setHasError(false);
    //                 setError('');
    //             }, 7000);
    //         }
    //     });
    //     return null;
    // };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    {guidance}
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
                <Stack direction="column" spacing={2}>
                    <Grid item xs={12}>
                        <Grid item xs={6}>
                            <Typography variant="h6">Address:</Typography>
                            {isEditing ? (
                                <CommunicationTextField
                                    variant="standard"
                                    // onChange={(e) => handleDomainChange(e)}
                                    // onFocus={() => handleDomainFocus()}
                                    sx={{ width: '230px', mt: 2 }}
                                    value="Address here"
                                    label="Address"
                                />
                            ) : (
                                <Typography variant="h6" sx={{ fontWeight: 300 }}>
                                    {addressValue}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="h6">Address 2:</Typography>
                            {isEditing ? (
                                <CommunicationTextField
                                    variant="standard"
                                    // onChange={(e) => handleDomainChange(e)}
                                    // onFocus={() => handleDomainFocus()}
                                    sx={{ width: '230px', mt: 2 }}
                                    value="Address2 here"
                                    label="Address"
                                />
                            ) : (
                                <Typography variant="h6" sx={{ fontWeight: 300 }}>
                                    {address2Value}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="h6">city:</Typography>
                            {isEditing ? (
                                <CommunicationTextField
                                    variant="standard"
                                    // onChange={(e) => handleDomainChange(e)}
                                    // onFocus={() => handleDomainFocus()}
                                    sx={{ width: '230px', mt: 2 }}
                                    value="city here"
                                    label="city"
                                />
                            ) : (
                                <Typography variant="h6" sx={{ fontWeight: 300 }}>
                                    {cityValue}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="h6">state:</Typography>
                            {isEditing ? (
                                <CommunicationTextField
                                    variant="standard"
                                    // onChange={(e) => handleDomainChange(e)}
                                    // onFocus={() => handleDomainFocus()}
                                    sx={{ width: '230px', mt: 2 }}
                                    value="state here"
                                    label="state"
                                />
                            ) : (
                                <Typography variant="h6" sx={{ fontWeight: 300 }}>
                                    {stateValue}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="h6">zip:</Typography>
                            {isEditing ? (
                                <CommunicationTextField
                                    variant="standard"
                                    // onChange={(e) => handleDomainChange(e)}
                                    // onFocus={() => handleDomainFocus()}
                                    sx={{ width: '230px', mt: 2 }}
                                    value="zip here"
                                    label="zip"
                                />
                            ) : (
                                <Typography variant="h6" sx={{ fontWeight: 300 }}>
                                    {zipValue}
                                </Typography>
                            )}
                        </Grid>
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
                            onClick={handleCancel}
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
                    <Button disableElevation variant="contained" color="primary" onClick={handleEdit}>
                        Edit
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};

export default Address;
