import { useState } from 'react';
import { Grid, Typography, Button, TextField } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import validator from 'email-validator';
import { useSelector, useDispatch } from 'store';
import { setPaymentInfo } from 'store/slices/dibsstudio';
import GetStudioConfigData from 'actions/studios/settings/getStudioConfigData';
import UpdateBillingContact from 'actions/studios/billing/updateBillingContact';

const BillingTextField = styled(TextField)({
    '& .MuiInput-underline:before': {
        borderBottomColor: '#ccc'
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

const BillingContactInfo = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { studioConfig, config } = useSelector((state) => state.dibsstudio);
    const { billing } = studioConfig;
    const { dibsStudioId } = config;
    // eslint-disable-next-line camelcase
    const { billing_contact, billing_email } = billing;
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasSuccess, setHasSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [billingContact, setBillingContact] = useState(billing_contact);
    const [billingEmail, setBillingEmail] = useState(billing_email);
    const [isEditingBillingContact, setIsEditingBillingContact] = useState(false);

    const editBillingContact = () => {
        setIsEditingBillingContact(true);
    };
    const handleCancel = () => {
        setIsEditingBillingContact(false);
        setBillingContact(billing_contact);
        setBillingEmail(billing_email);
        setHasError(false);
    };
    const handleChangeName = (e) => {
        setBillingContact(e.target.value);
    };
    const handleChangeEmail = (e) => {
        setBillingEmail(e.target.value);
    };
    const handleSubmit = async () => {
        const isEmail = validator.validate(billingEmail);
        if (!isEmail) {
            setHasError(true);
            setHasSuccess(false);
            setErrorMessage('The email you entered is not valid. Please try again.');
            setTimeout(() => {
                setHasError(false);
                setErrorMessage('');
            }, 7000);
            return null;
        }
        if (billingContact.length < 3) {
            setHasError(true);
            setErrorMessage('Please enter a full name as your billing contact');
            setTimeout(() => {
                setHasError(false);
                setErrorMessage('');
            }, 7000);
            return null;
        }
        await UpdateBillingContact(dibsStudioId, billingContact, billingEmail).then((response) => {
            if (response.msg === 'success') {
                setHasSuccess(true);
                setSuccessMessage('Your billing contact information has been updated.');
                setTimeout(() => {
                    setHasSuccess(false);
                    setSuccessMessage('');
                }, 7000);
                setIsEditingBillingContact(false);
                GetStudioConfigData(dibsStudioId).then((sc) => {
                    dispatch(setPaymentInfo(sc.paymentInfo));
                });
            } else {
                setHasError(true);
                setErrorMessage(response.error);
                setTimeout(() => {
                    setHasError(false);
                    setErrorMessage('');
                }, 7000);
            }
        });
        return null;
    };
    return (
        <Grid container sx={{ mt: 4 }}>
            <Grid item xs={7}>
                <Grid container sx={{ mb: 5, mt: 1 }}>
                    {hasError && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                                {errorMessage}
                            </Typography>
                        </Grid>
                    )}
                    {hasSuccess && (
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.success.dark }}>
                                {successMessage}
                            </Typography>
                        </Grid>
                    )}
                    <Grid item xs={5}>
                        <Typography sx={{ fontSize: '12px', fontWeight: '100', color: '#999' }}>Billing Contact Name</Typography>
                        {isEditingBillingContact ? (
                            <BillingTextField
                                required
                                id="billingContact"
                                value={billingContact}
                                variant="standard"
                                sx={{ mt: 1, mr: 3, width: 200 }}
                                onChange={(e) => handleChangeName(e)}
                            />
                        ) : (
                            <Typography sx={{ mt: 1 }}>{billingContact}</Typography>
                        )}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={{ fontSize: '12px', fontWeight: '100', color: '#999' }}>Billing Contact Email</Typography>
                        {isEditingBillingContact ? (
                            <BillingTextField
                                required
                                id="billingEmail"
                                value={billingEmail}
                                variant="standard"
                                sx={{ mt: 1, mr: 3, width: 250 }}
                                onChange={(e) => handleChangeEmail(e)}
                            />
                        ) : (
                            <Typography sx={{ mt: 1 }}>{billingEmail}</Typography>
                        )}
                    </Grid>
                    {!isEditingBillingContact && (
                        <Button onClick={editBillingContact} sx={{ mt: 3 }}>
                            Edit Contact Info
                        </Button>
                    )}
                    {isEditingBillingContact && (
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item>
                                <Button
                                    onClick={handleCancel}
                                    sx={{
                                        bgcolor: theme.palette.globalcolors.cancel,
                                        '&:hover': {
                                            backgroundColor: theme.palette.globalcolors.hover
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
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
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default BillingContactInfo;
