import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Stack, Button } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'store';

import updateGlobalPriceSettings from 'actions/studios/settings/updateGlobalPriceSettings';
import { setGlobalPrices } from 'store/slices/dibsstudio';

const PriceTextField = styled(TextField)({
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

const GlobalPriceSettings = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { config, settings } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const { minPrice, maxPrice } = settings;
    // const { minp, maxp, dibsstudioid } = props;
    const min = `$${minPrice}`;
    const max = `$${maxPrice}`;
    const [minPriceFile, setMinPriceFile] = React.useState(min);
    const [isEditing, setIsEditing] = React.useState(false);
    const [maxPriceFile, setMaxPriceFile] = React.useState(max);
    const [madeMinBlank, setMadeMinBlank] = React.useState(false);
    const [madeMaxBlank, setMadeMaxBlank] = React.useState(false);
    const [error, setError] = React.useState('');
    const [hasError, setHasError] = React.useState(false);
    const [hasSuccessMsg, setHasSuccessMsg] = React.useState(false);
    const [successMsg, setSuccessMsg] = React.useState('');

    // const resetState = () => {
    //     setIsEditing(false);
    //     setMinPrice('');
    //     setMaxPrice('');
    // };
    // const toggleEdit = () => {
    //     setIsEditing({ isEditing: !isEditing }, () => {
    //         if (!isEditing) resetState();
    //     });
    // };
    const handleMinFocus = () => {
        if (!madeMinBlank) {
            setMinPriceFile('$');
            setMadeMinBlank(true);
        }
    };
    const handleMaxFocus = () => {
        if (!madeMaxBlank) {
            setMaxPriceFile('$');
            setMadeMaxBlank(true);
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
        setHasError(false);
    };
    const handleMinChange = (event) => {
        setMinPriceFile(event.target.value);
    };
    const handleMaxChange = (event) => {
        setMaxPriceFile(event.target.value);
    };
    const handleEdit = () => {
        setIsEditing(!isEditing);
    };
    const handleSubmit = async () => {
        setMadeMinBlank(false);
        setMadeMaxBlank(false);
        const minPriceToSend = +(minPriceFile.slice(1) || minPriceFile);
        const maxPriceToSend = +(maxPriceFile.slice(1) || maxPriceFile);
        if (!maxPriceFile && !minPriceFile) return null;
        if (minPriceToSend > maxPriceToSend) {
            setHasError(true);
            setError('Oops! The minimum price must be less than or equal to the maximum price');
            setMadeMinBlank(false);
            setTimeout(() => {
                setHasError(false);
                setError('');
            }, 7000);
            return 0;
        }
        const res = await updateGlobalPriceSettings(dibsStudioId, minPriceToSend, maxPriceToSend);
        if (res.msg === 'success') {
            setIsEditing(false);
            setMinPriceFile(`$${minPriceToSend}`);
            setMaxPriceFile(`$${maxPriceToSend}`);
            const prices = { minPrice: minPriceToSend, maxPrice: maxPriceToSend };
            dispatch(setGlobalPrices(prices));
            setHasSuccessMsg(true);
            setSuccessMsg('Successfully updated your global price settings.');
            setTimeout(() => {
                setHasSuccessMsg(false);
            }, 7000);
        } else {
            setHasError(true);
            setError(res.error);
            setMadeMinBlank(false);
            setTimeout(() => {
                setHasError(false);
            }, 7000);
        }
        return 6;
    };
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    The Dibs Pricing Algorithms operate within your min/max range. There is no need to set individual class mins and maxes
                    as we’ll take into account all sorts of data to set the price for each class. Classes will always start at their least
                    expensive. If you lower your min, classes already on the schedule will not be lowered, only new classes. Be sure these
                    amounts are whole numbers - any decimals will be rounded to the nearest whole dollar amount.
                    <br />
                    <br />
                    Note: If dynamic pricing is not enabled, your minimum price will be used as the default price for your classes.
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
                        <Typography variant="h6">Global Minimum Price</Typography>
                        {isEditing ? (
                            <PriceTextField
                                variant="standard"
                                onChange={(e) => handleMinChange(e)}
                                onFocus={() => handleMinFocus()}
                                sx={{ width: '50px' }}
                                value={minPriceFile}
                            />
                        ) : (
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                {minPriceFile}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h6">Global Maximum Price</Typography>
                        {isEditing ? (
                            <PriceTextField
                                variant="standard"
                                onFocus={() => handleMaxFocus()}
                                onChange={(e) => handleMaxChange(e)}
                                sx={{ width: '50px' }}
                                value={maxPriceFile}
                            />
                        ) : (
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                {maxPriceFile}
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
                            variant="contained "
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

// GlobalPriceSettings.propTypes = {
//     minp: PropTypes.number,
//     maxp: PropTypes.number,
//     dibsstudioid: PropTypes.number
// };

export default GlobalPriceSettings;
