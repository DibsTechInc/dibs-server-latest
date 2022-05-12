import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Card, CardHeader, CardActions, Button, Grid, Typography, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import getAvailablePasses from 'actions/studios/users/getAvailablePasses';

// ==============================|| AVAILABLE PASSES ||============================== //

const sampledata = [
    {
        passid: '1',
        passName: 'Unlimited Membership',
        renewalDate: 'Auto-renews on 6/2/22',
        classesUsed: 5,
        totalClasses: 'Unlimited Classes',
        classStatement: '5 classes used'
    },
    {
        passid: '2',
        passName: '10 Pack',
        renewalDate: 'Exp: 7/2/22',
        classesUsed: 5,
        totalClasses: '10 Classes',
        classStatement: '5 classes remain'
    },
    {
        passid: '3',
        passName: 'Free Class',
        renewalDate: 'Exp 12/21/22',
        classesUsed: 0,
        totalClasses: '1 Class',
        classStatement: '1 class remains'
    }
];
const GiftCard = (props) => {
    const theme = useTheme();
    const { userid, dibsStudioId, firstname } = props;
    const [availablePasses, setAvailablePasses] = useState([]);
    const [alreadyRan, setAlreadyRan] = useState(false);
    const [hasPasses, setHasPasses] = useState(false);
    const msgtoshow = `${firstname} does not have any available passes.`;
    useEffect(() => {
        const getAvailablePassesForClient = async () => {
            // setIsLoading(true);
            await getAvailablePasses(userid, dibsStudioId).then((passes) => {
                if (passes.length > 0) {
                    console.log(`passes are: ${JSON.stringify(passes)}`);
                    setAvailablePasses(passes);
                    setHasPasses(true);
                }
                setAlreadyRan(true);
            });
            // setIsLoading(false);
        };
        if (availablePasses.length === 0 && !alreadyRan) getAvailablePassesForClient();
    }, [userid, dibsStudioId, availablePasses, alreadyRan]);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={3} sx={{ fontSize: '1rem' }}>
                    Amount
                </Grid>
                <Grid item xs={3} sx={{ fontSize: '1rem' }}>
                    To
                </Grid>
                <Grid item xs={3} sx={{ fontSize: '1rem' }}>
                    From
                </Grid>
                <Grid item xs={12} sx={{ fontSize: '1rem' }}>
                    Message
                </Grid>
                <Grid item xs={12} sx={{ fontSize: '1rem' }}>
                    Checkbox - send receipt to recipient
                </Grid>
                <Grid item xs={12} sx={{ fontSize: '1rem' }}>
                    Allison will get a receipt either way
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
        </Box>
    );
};
GiftCard.propTypes = {
    userid: PropTypes.string,
    dibsStudioId: PropTypes.number,
    firstname: PropTypes.string
};

export default GiftCard;
