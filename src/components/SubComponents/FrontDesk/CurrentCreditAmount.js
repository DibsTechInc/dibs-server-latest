import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Button, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import getCredit from 'actions/studios/users/getCredit';

// ==============================|| CURRENT CREDIT AMOUNT ||============================== //

const CurrentCreditAmount = (props) => {
    const theme = useTheme();
    const { userid, dibsStudioId, firstname } = props;
    const [credit, setCredit] = useState(0);
    const [alreadyRan, setAlreadyRan] = useState(false);
    const [hasCredit, setHasCredit] = useState(false);
    const msgtoshow = `${firstname} does not have any credit.`;
    useEffect(() => {
        const getCreditForClient = async () => {
            // setIsLoading(true);
            await getCredit(userid, dibsStudioId).then((credit) => {
                if (credit > 0) {
                    console.log(`credit is: ${JSON.stringify(credit)}`);
                    setCredit(credit);
                    setHasCredit(true);
                }
                setAlreadyRan(true);
            });
            // setIsLoading(false);
        };
        getCreditForClient();
    }, [userid, dibsStudioId, credit, alreadyRan]);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {hasCredit ? (
                    <Grid item xs={12} sx={{ fontSize: '.875rem' }}>
                        {firstname} has{' '}
                        <span
                            style={{
                                textDecorationLine: 'underline',
                                textDecorationColor: '#c96248',
                                textDecorationThickness: '1.5px',
                                textUnderlineOffset: '2px'
                            }}
                        >
                            ${credit}
                        </span>{' '}
                        in credit.
                    </Grid>
                ) : (
                    <Grid item xs={12} sx={{ fontSize: '.875rem' }}>
                        <Typography variant="h7">{msgtoshow}</Typography>
                    </Grid>
                )}
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
                        Add or remove credit
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
CurrentCreditAmount.propTypes = {
    userid: PropTypes.string,
    dibsStudioId: PropTypes.number,
    firstname: PropTypes.string
};

export default CurrentCreditAmount;
