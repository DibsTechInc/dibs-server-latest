import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, InputAdornment, FormControlLabel, TextField, FormGroup, Button, Grid, Switch, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ==============================|| GIFT CARD ||============================== //

const GiftCard = (props) => {
    const theme = useTheme();
    const { userid, dibsStudioId, email, firstname } = props;
    const [emailtouse, setEmailToUse] = useState('');
    const labelSwitchClient = `Send gift card to ${firstname} (via email)`;
    const noworrytext = `(Don't worry, ${firstname} will receive a receipt of this transaction either way.)`;
    useEffect(() => {
        setEmailToUse(email);
    }, [userid, dibsStudioId, email]);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} direction="column">
                <Grid item xs={12} sx={{ ml: 1, mr: 1 }}>
                    <Grid item xs={11}>
                        <TextField
                            id="standard-basic"
                            label="From"
                            variant="standard"
                            disabled
                            value={emailtouse}
                            sx={{ mr: 2, width: '60%' }}
                        />
                    </Grid>
                    <Grid item xs={11} sx={{ display: 'flex', mt: 4 }}>
                        <Grid item xs={2}>
                            <TextField
                                id="standard-basic"
                                label="Amount*"
                                variant="standard"
                                // color="secondary"
                                // focused
                                sx={{ mr: 2, pr: 3, width: '95%' }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField id="standard-basic" label="To*" variant="standard" sx={{ mr: 2, pr: 3, width: '95%' }} />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField id="standard-basic" label="Email Address*" variant="standard" sx={{ mr: 2, pr: 3, width: '95%' }} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 4, mb: 3 }}>
                        <TextField
                            id="standard-multiline-static"
                            label="Add gift card message"
                            multiline
                            rows={4}
                            variant="standard"
                            sx={{ width: '60%' }}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1.5 }}>
                        <FormGroup>
                            <FormControlLabel control={<Switch defaultChecked />} label="Send gift card directly to recipient" />
                            <FormControlLabel control={<Switch />} label={labelSwitchClient} />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2, mb: 4 }}>
                        <Typography variant="h7" sx={{ fontStyle: 'italic' }}>
                            {noworrytext}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                        <Button
                            onClick={(event) => console.log(event)}
                            sx={{
                                px: 2,
                                height: '25px',
                                fontSize: '12px',
                                fontWeight: 200,
                                color: '#fff',
                                bgcolor: theme.palette.packages.medium,
                                '&:hover': {
                                    backgroundColor: '#b9a9a9'
                                }
                            }}
                        >
                            Purchase
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};
GiftCard.propTypes = {
    userid: PropTypes.string,
    dibsStudioId: PropTypes.number,
    email: PropTypes.string,
    firstname: PropTypes.string
};

export default GiftCard;
