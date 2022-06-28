import * as React from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'store';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid } from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { styled, useTheme } from '@mui/material/styles';
import ChooseExpiration from './chooseExpirationDate';
import ChooseDiscountAmount from './chooseDiscountAmount';
import NextButton from 'shared/components/Button/nextButton';
import SubmitButton from 'shared/components/Button/submitButton';
import SetLimitsOnUsage from './setLimitsOnUsage';
import SetCanBeAppliedTo from './setCanBeAppliedTo';
import CreateNewPromoCode from 'actions/studios/promocodes/createNewPromoCode';

const ExpirationDateInfo = (props) => {
    const { setDate } = props;
    const [hasError, setHasError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    return (
        <Grid container>
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6">Choose an expiration date for this promo code.</Typography>
                {hasError && (
                    <Typography variant="body1" color="error">
                        {errorMessage}
                    </Typography>
                )}
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <ChooseExpiration setDate={setDate} setHasError={setHasError} setErrorMessage={setErrorMessage} />
                </Grid>
            </Grid>
        </Grid>
    );
};
ExpirationDateInfo.propTypes = {
    setDate: propTypes.func
};

const DiscountAmount = (props) => {
    const { setAmountToDiscount, setIsPercDiscount } = props;
    const [hasError, setHasError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    return (
        <Grid container>
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6">Choose an amount or percentage discount.</Typography>
                {hasError && (
                    <Typography variant="body1" color="error">
                        {errorMessage}
                    </Typography>
                )}
                <Grid item xs={12} sx={{ mt: 2, ml: 1 }}>
                    <ChooseDiscountAmount
                        setAmountToDiscount={setAmountToDiscount}
                        setHasError={setHasError}
                        setErrorMessage={setErrorMessage}
                        setIsPercDiscount={setIsPercDiscount}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};
DiscountAmount.propTypes = {
    setAmountToDiscount: propTypes.func,
    setIsPercDiscount: propTypes.func
};
const LimitedUse = (props) => {
    const { setLimitedUse, setPersonUsageLimit, setCodeUsageLimit, setNewClientsOnly } = props;
    const [hasError, setHasError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    return (
        <Grid container>
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6">Set limits on how many times this promo code can be used.</Typography>
                {hasError && (
                    <Typography variant="body1" color="error">
                        {errorMessage}
                    </Typography>
                )}
                <Grid item xs={12} sx={{ ml: 1 }}>
                    <SetLimitsOnUsage
                        setHasError={setHasError}
                        setErrorMessage={setErrorMessage}
                        setLimitedUse={setLimitedUse}
                        setPersonUsageLimit={setPersonUsageLimit}
                        setCodeUsageLimit={setCodeUsageLimit}
                        setNewClientsOnly={setNewClientsOnly}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};
LimitedUse.propTypes = {
    setLimitedUse: propTypes.func,
    setPersonUsageLimit: propTypes.func,
    setCodeUsageLimit: propTypes.func,
    setNewClientsOnly: propTypes.func
};
const CanBeAppliedTo = (props) => {
    const { setApplication, setApplicationValue } = props;
    const [hasError, setHasError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    return (
        <Grid container>
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6">Set the type of transactions that this promo code can be applied to.</Typography>
                {hasError && (
                    <Typography variant="body1" color="error">
                        {errorMessage}
                    </Typography>
                )}
                <Grid item xs={12} sx={{ ml: 1, mb: 2 }}>
                    <SetCanBeAppliedTo
                        setHasError={setHasError}
                        setErrorMessage={setErrorMessage}
                        setApplication={setApplication}
                        setApplicationValue={setApplicationValue}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};
CanBeAppliedTo.propTypes = {
    setApplication: propTypes.func,
    setApplicationValue: propTypes.func
};
const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} {...props} />)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    // borderRadius: '5px',
    '&:not(:last-child)': {
        borderBottom: 0
    },
    '&:before': {
        display: 'none'
    }
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .08)' : 'rgba(0, 0, 0, .025)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)'
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1)
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

export default function PromoCodeAccordian(props) {
    const { codename, clearCodeName } = props;
    const theme = useTheme();
    const { config } = useSelector((state) => state.dibsstudio);
    const { id, studioid, dibsStudioId } = config;
    const [expanded, setExpanded] = React.useState('panel1');
    const [expirationDate, setExpirationDate] = React.useState(null);
    const [isPercDiscount, setIsPercDiscount] = React.useState(true);
    const [amountToDiscount, setAmountToDiscount] = React.useState(null);
    const [limitedUsage, setLimitedUsage] = React.useState(false);
    const [application, setApplication] = React.useState('Universal');
    const [applicationValue, setApplicationValue] = React.useState('universal');
    const [newClientsOnly, setNewClientsOnly] = React.useState(false);
    const [codeUsageLimit, setCodeUsageLimit] = React.useState(null);
    const [personUsageLimit, setPersonUsageLimit] = React.useState(null);
    const [allRequirementsFullfilled, setAllRequirementsFullfilled] = React.useState(false);
    const [hasSuccess, setHasSuccess] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [timeoutArray, setTimeoutArray] = React.useState([]);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handleNextQuestion = (closePanel, openPanel) => () => {
        setExpanded(false);
        setExpanded(openPanel);
    };
    const handleErrorProcess = (errorMsg) => {
        setHasSuccess(false);
        setErrorMessage(errorMsg);
        setHasError(true);
        const timeoutiderror = setTimeout(() => {
            setHasError(false);
            setErrorMessage('');
        }, 10000);
        setTimeoutArray([...timeoutArray, timeoutiderror]);
    };
    const handleSuccessProcess = (successMsg) => {
        setHasError(false);
        setSuccessMessage(successMsg);
        setHasSuccess(true);
        clearCodeName();
        setExpanded(false);
        const timeoutid = setTimeout(() => {
            setHasSuccess(false);
            setSuccessMessage('');
        }, 7000);
        setTimeoutArray([...timeoutArray, timeoutid]);
    };
    const handleSubmit = async () => {
        if (allRequirementsFullfilled) {
            const promoCodeInfo = {
                employeeId: id,
                studioid,
                codename,
                expirationDate,
                isPercDiscount,
                applicationValue,
                amountToDiscount,
                newClientsOnly,
                codeUsageLimit,
                personUsageLimit
            };
            await CreateNewPromoCode(dibsStudioId, promoCodeInfo).then((res) => {
                if (res.msg === 'failure') {
                    handleErrorProcess(res.error);
                }
                if (res.msg === 'success') {
                    handleSuccessProcess(
                        'Successfully created a new promo code. You can create another promo code by submitting new information.'
                    );
                }
            });
        }
    };
    const formatDiscountAmount = () => (isPercDiscount ? `${amountToDiscount}%` : `$${amountToDiscount}`);
    React.useEffect(() => {
        if (expirationDate && amountToDiscount && application) {
            setAllRequirementsFullfilled(true);
        } else {
            setAllRequirementsFullfilled(false);
        }
        return () => {
            timeoutArray.forEach((timeout) => {
                clearTimeout(timeout);
            });
        };
    }, [expirationDate, amountToDiscount, application, timeoutArray]);
    return (
        <>
            <div>
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                        <Typography variant="h5" sx={{ flexShrink: 0 }}>
                            Expiration Date
                        </Typography>
                        <Typography variant="h5">{expirationDate ? `: ${expirationDate}` : ''}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ExpirationDateInfo setDate={setExpirationDate} />
                        <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                            <NextButton
                                id="expiration-date"
                                valueString="Next"
                                handleClick={handleNextQuestion}
                                pos1="panel1"
                                pos2="panel2"
                            />
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
                        <Typography variant="h5" sx={{ flexShrink: 0 }}>
                            Discount Amount
                        </Typography>
                        <Typography variant="h5">{amountToDiscount ? `: ${formatDiscountAmount(amountToDiscount)}` : ''}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <DiscountAmount setAmountToDiscount={setAmountToDiscount} setIsPercDiscount={setIsPercDiscount} />
                        <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                            <NextButton
                                id="discount-amount"
                                valueString="Next"
                                handleClick={handleNextQuestion}
                                pos1="panel2"
                                pos2="panel3"
                            />
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
                        <Typography variant="h5" sx={{ flexShrink: 0 }}>
                            Limited Usage
                        </Typography>
                        <Typography variant="h5">{limitedUsage ? ': Yes' : ': None'}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <LimitedUse
                            setLimitedUse={setLimitedUsage}
                            setPersonUsageLimit={setPersonUsageLimit}
                            setCodeUsageLimit={setCodeUsageLimit}
                            setNewClientsOnly={setNewClientsOnly}
                        />
                        <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                            <NextButton id="limited-use" valueString="Next" handleClick={handleNextQuestion} pos1="panel3" pos2="panel4" />
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
                        <Typography variant="h5" sx={{ flexShrink: 0 }}>
                            Promo Code Application
                        </Typography>
                        <Typography variant="h5">{`: ${application}`}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <CanBeAppliedTo setApplication={setApplication} setApplicationValue={setApplicationValue} />
                        <Grid item xs={12} sx={{ mt: 2, mb: 3, ml: 1 }}>
                            <NextButton
                                id="can-be-applied-to"
                                valueString="Next"
                                handleClick={handleNextQuestion}
                                pos1="panel4"
                                pos2="panel5"
                            />
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </div>
            <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
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
            </Grid>
            {allRequirementsFullfilled && (
                <Grid item xs={12} sx={{ mt: 2, mb: 2, ml: 1 }}>
                    <SubmitButton id="submit-button-promo" valueString="Save Promo Code" onClick={handleSubmit} />
                </Grid>
            )}
        </>
    );
}
PromoCodeAccordian.propTypes = {
    codename: propTypes.string,
    clearCodeName: propTypes.func
};
