import React from 'react';
import { Grid, Typography, Stack, Button, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'store';

const TermsAndConditions = () => {
    const theme = useTheme();
    const { studioConfig } = useSelector((state) => state.dibsstudio);
    const { terms } = studioConfig;
    const defaultString = 'Not yet provided';
    const [tandc, setTandC] = React.useState(terms);
    const [doesHaveTerms, setDoesHaveTerms] = React.useState(false);
    const first = `'ve already`;
    const second = `haven't`;
    let guidance = `You ${doesHaveTerms ? first : second} provided your Terms & Conditions to ${doesHaveTerms ? 'Dibs' : 'Dibs yet'}.`;
    const secondMsg = `To add or update your Terms & Conditions, please send a formatted PDF of your Terms & Conditions to studios@ondibs.com. You can also send us a direct link to your Terms & Conditions (e.g. https://yourtermsarehere.com). Note: It takes approximately 12 hours for Terms to be updated.`;
    if (!doesHaveTerms) guidance += ` ${secondMsg}`;
    React.useEffect(() => {
        if (tandc.length <= 2) {
            setDoesHaveTerms(false);
            setTandC(defaultString);
        }
    }, [tandc]);
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    {guidance}
                    <br />
                </Typography>
            </Grid>
            <Grid item xs={7} sx={{ mt: 4 }}>
                <Stack direction="row" spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Terms & Conditions URL:</Typography>
                        <Typography variant="h7" sx={{ mt: 3 }}>
                            {tandc}
                        </Typography>
                        <Grid item xs={12} sx={{ mt: 3 }}>
                            <Button disableElevation variant="contained" color="primary" href={tandc} target="_blank" component={Link}>
                                Check Your Terms & Conditions
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default TermsAndConditions;
