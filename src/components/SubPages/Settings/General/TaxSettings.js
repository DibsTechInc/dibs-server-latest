import { useState } from 'react';
import { useSelector, useDispatch } from 'store';
import { setTaxesRedux } from 'store/slices/dibsstudio';
import { Grid, Typography, Button, TextField } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

// import actions
import updateTaxRates from 'actions/studios/settings/updateTaxRateSettings';

const WidgetChangeTextField = styled(TextField)({
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

// ==============================|| STUDIO ADMIN -> SETTINGS -> GENERAL -> CANCELATION ||============================== //

const CancelationSetting = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [hasError, setHasError] = useState(false);
    const [hasSuccess, setHasSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { studioConfig, config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    // eslint-disable-next-line camelcase
    const { salesTax, retailTax } = studioConfig;
    const [salesTaxInput, setSalesTaxInput] = useState(salesTax);
    const [retailTaxInput, setRetailTaxInput] = useState(retailTax);
    const [madeSalesTaxBlank, setMadeSalesTaxBlank] = useState(false);
    const [madeRetailTaxBlank, setMadeRetailTaxBlank] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const studioMessage = `Set your tax rates for sales and retail. Dibs will collect taxes on your behalf and transfer the collected amount to your bank account at the end of each quarter.`;
    const editAmount = () => {
        setIsEditing(!isEditing);
    };
    const removePerc = (tax) => {
        const perc = '%';
        const taxString = String(tax);
        const taxStringNoPerc = taxString.replace(perc, '');
        const taxNumber = Number(taxStringNoPerc);
        return taxNumber;
    };
    const handleSalesTaxFocus = () => {
        if (!madeSalesTaxBlank) {
            // setIsEditing(!isEditing);
            setSalesTaxInput('');
            setMadeSalesTaxBlank(true);
        }
    };
    const handleRetailTaxFocus = () => {
        if (!madeRetailTaxBlank) {
            // setIsEditing(!isEditing);
            setRetailTaxInput('');
            setMadeRetailTaxBlank(true);
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
        setSalesTaxInput(salesTax);
        setRetailTaxInput(salesTax);
        setHasError(false);
        setErrorMessage('');
        setMadeRetailTaxBlank(false);
        setMadeSalesTaxBlank(false);
    };
    const handleSalesTaxChange = (e) => {
        setSalesTaxInput(e.target.value);
    };
    const handleRetailTaxChange = (e) => {
        setRetailTaxInput(e.target.value);
    };
    const clickedInput = () => {
        if (isEditing) {
            return;
        }
        setIsEditing(true);
    };
    const handleSubmit = async () => {
        try {
            const retailTaxInputNumber = removePerc(retailTaxInput);
            const salesTaxInputNumber = removePerc(salesTaxInput);
            if (!retailTaxInputNumber || !salesTaxInputNumber) {
                setHasError(true);
                setErrorMessage('Please enter a valid number.');
                setSalesTaxInput(salesTax);
                setRetailTaxInput(retailTax);
                setMadeRetailTaxBlank(false);
                setMadeSalesTaxBlank(false);
                return null;
            }
            // make sure it is a number (not less than 0)
            if (retailTaxInputNumber < 1 || salesTaxInputNumber < 1) {
                setHasError(true);
                setErrorMessage(
                    'Please enter a decimal number greater than 0. Dibs will automatically convert the number to a percentage.'
                );
                setMadeRetailTaxBlank(false);
                setMadeSalesTaxBlank(false);
                setTimeout(() => {
                    setHasError(false);
                    setErrorMessage('');
                }, 7000);
                return null;
            }
            if (retailTaxInputNumber > 0 || salesTaxInputNumber > 0) {
                const res = await updateTaxRates(dibsStudioId, retailTaxInputNumber, salesTaxInputNumber);
                if (res.msg === 'success') {
                    setHasSuccess(true);
                    setSuccessMessage(`Successfully updated your tax rates.`);
                    setHasError(false);
                    setErrorMessage('');
                    setSalesTaxInput(salesTaxInputNumber);
                    setRetailTaxInput(retailTaxInputNumber);
                    setIsEditing(false);
                    dispatch(setTaxesRedux({ retailTax: retailTaxInputNumber, salesTax: salesTaxInputNumber }));
                    setTimeout(() => {
                        setHasSuccess(false);
                        setSuccessMessage('');
                    }, 7000);
                    setMadeRetailTaxBlank(false);
                    setMadeSalesTaxBlank(false);
                } else {
                    setHasError(true);
                    setErrorMessage(res.error);
                    setMadeRetailTaxBlank(false);
                    setMadeSalesTaxBlank(false);
                    setHasSuccess(false);
                    setSuccessMessage('');
                    setTimeout(() => {
                        setHasError(false);
                    }, 7000);
                }
                setMadeRetailTaxBlank(false);
                setMadeSalesTaxBlank(false);
            } else {
                setHasError(true);
                setHasSuccess(false);
                setErrorMessage('You must enter a number greater than or equal to zero for the tax rates. Please try again.');
                setMadeRetailTaxBlank(false);
                setMadeSalesTaxBlank(false);
                setTimeout(() => {
                    setHasError(false);
                    setErrorMessage('');
                }, 7000);
                return null;
            }
        } catch (error) {
            setHasError(true);
            setHasSuccess(false);
            setErrorMessage('You must enter a number for the tax rates. Please try again.');
            setTimeout(() => {
                setHasError(false);
                setErrorMessage('');
            }, 7000);
            setMadeRetailTaxBlank(false);
            setMadeSalesTaxBlank(false);
            return null;
        }
        return null;
    };
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography gutterBottom variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    {studioMessage}
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2.2 }}>
                <Grid container>
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
                    <Grid container>
                        <Grid item xs={4} onClick={clickedInput}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Sales Tax:</strong>
                            </Typography>
                            {isEditing ? (
                                <WidgetChangeTextField
                                    variant="standard"
                                    onChange={(e) => handleSalesTaxChange(e)}
                                    onFocus={() => handleSalesTaxFocus()}
                                    sx={{ width: '50px' }}
                                    value={salesTaxInput}
                                />
                            ) : (
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {salesTaxInput}%
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={4} onClick={clickedInput}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Retail Tax:</strong>
                            </Typography>
                            {isEditing ? (
                                <WidgetChangeTextField
                                    variant="standard"
                                    onChange={(e) => handleRetailTaxChange(e)}
                                    onFocus={() => handleRetailTaxFocus()}
                                    sx={{ width: '50px' }}
                                    value={retailTaxInput}
                                />
                            ) : (
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {retailTaxInput}%
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {!isEditing && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <Button onClick={editAmount}>Edit</Button>
                    </Grid>
                </Grid>
            )}
            {isEditing && (
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
    );
};
export default CancelationSetting;
