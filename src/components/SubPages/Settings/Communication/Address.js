import React from 'react';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Stack, Button } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'store';

import { setCustomEmailToSendFrom } from 'store/slices/dibsstudio';
import UpdateStudioAddress from 'actions/studios/settings/updateStudioAddress';

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
    const guidance = `Enter the address for your studio. This information is included in confirmation emails. If you have a virtual studio (i.e. if you only offer online classes), you can leave this section blank.`;

    React.useEffect(() => {
        if (addressValue === null) {
            setAddressValue('Not entered');
        }
        if (address2Value === null) {
            setAddress2Value('N/A');
        }
        if (cityValue === null) {
            setCityValue('Not entered');
        }
        if (stateValue === null) {
            setStateValue('Not entered');
        }
        if (zipValue === null) {
            setZipValue('Not entered');
        }
    }, [addressValue, address2Value, cityValue, stateValue, zipValue]);
    console.log(`addressvalue is: ${addressValue}`);
    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleAddressFocus = () => {
        if (!madeAddressBlank) {
            setAddressValue('');
            setMadeAddressBlank(true);
        }
    };
    const handleAddress2Focus = () => {
        if (!madeAddress2Blank) {
            setAddress2Value('');
            setMade2AddressBlank(true);
        }
    };
    const handleCityFocus = () => {
        if (!madeCityBlank) {
            setCityValue('');
            setMadeCityBlank(true);
        }
    };
    const handleStateFocus = () => {
        if (!madeStateBlank) {
            setStateValue('');
            setMadeStateBlank(true);
        }
    };
    const handleZipFocus = () => {
        if (!madeZipBlank) {
            setZipValue('');
            setMadeZipBlank(true);
        }
    };
    const handleAddressChange = (e) => {
        console.log(`address value is: ${e.target.value}`);
        setAddressValue(e.target.value);
    };
    const handleAddress2Change = (e) => {
        setAddress2Value(e.target.value);
    };
    const handleCityChange = (e) => {
        setCityValue(e.target.value);
    };
    const handleStateChange = (e) => {
        setStateValue(e.target.value);
    };
    const handleZipChange = (e) => {
        setZipValue(e.target.value);
    };
    const handleCancel = () => {
        console.log(`address value is: ${address}`);
        setIsEditing(false);
        setHasError(false);
        setHasSuccessMsg(false);
        setError('');
        setAddressValue(address);
        setAddress2Value(address2);
        setCityValue(city);
        setStateValue(state);
        setZipValue(zipcode);
        // setCustomEmail(customEmailToSendFrom);
        // setMadeCustomDomainBlank(false);
    };
    const handleSubmit = async () => {
        setMade2AddressBlank(false);
        setMadeCityBlank(false);
        setMadeStateBlank(false);
        setMadeZipBlank(false);
        setMadeAddressBlank(false);
        const addressObject = {
            addressValue,
            address2Value,
            cityValue,
            stateValue,
            zipValue
        };
        await UpdateStudioAddress(dibsStudioId, addressObject).then((res) => {
            if (res.msg === 'success') {
                setHasSuccessMsg(true);
                setSuccessMsg(`Your studio's address has been updated.`);
                setTimeout(() => {
                    setHasSuccessMsg(false);
                    setSuccessMsg('');
                }, 7000);
                setIsEditing(false);
                setHasError(false);
                setError('');
                // dispatch(setCustomEmailToSendFrom(customEmail));
            } else {
                setHasError(true);
                setError(`There was an error updating your studio's address. Please try again.`);
                setTimeout(() => {
                    setHasError(false);
                    setError('');
                }, 7000);
            }
        });
        return null;
    };

    return (
        <Grid container>
            <Grid item xs={9}>
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
                                    onChange={(e) => handleAddressChange(e)}
                                    onFocus={() => handleAddressFocus()}
                                    sx={{ width: '230px', mt: 2 }}
                                    value={addressValue}
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
                                    onChange={(e) => handleAddress2Change(e)}
                                    onFocus={() => handleAddress2Focus()}
                                    sx={{ width: '230px', mt: 2 }}
                                    value={address2Value}
                                />
                            ) : (
                                <Typography variant="h6" sx={{ fontWeight: 300 }}>
                                    {address2Value}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="h6">City:</Typography>
                            {isEditing ? (
                                <CommunicationTextField
                                    variant="standard"
                                    onChange={(e) => handleCityChange(e)}
                                    onFocus={() => handleCityFocus()}
                                    sx={{ width: '230px', mt: 2 }}
                                    value={cityValue}
                                />
                            ) : (
                                <Typography variant="h6" sx={{ fontWeight: 300 }}>
                                    {cityValue}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="h6">State:</Typography>
                            {isEditing ? (
                                <CommunicationTextField
                                    variant="standard"
                                    onChange={(e) => handleStateChange(e)}
                                    onFocus={() => handleStateFocus()}
                                    sx={{ width: '100px', mt: 2 }}
                                    value={stateValue}
                                />
                            ) : (
                                <Typography variant="h6" sx={{ fontWeight: 300 }}>
                                    {stateValue}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                            <Typography variant="h6">Zip:</Typography>
                            {isEditing ? (
                                <CommunicationTextField
                                    variant="standard"
                                    onChange={(e) => handleZipChange(e)}
                                    onFocus={() => handleZipFocus()}
                                    sx={{ width: '100px', mt: 2 }}
                                    value={zipValue}
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
                            onClick={handleSubmit}
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
