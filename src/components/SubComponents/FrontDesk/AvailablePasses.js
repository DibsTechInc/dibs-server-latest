import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Card, CardHeader, Button, Grid, Typography, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import getUpcomingClassesDB from 'actions/studios/users/getUpcomingClassesDB';

// ==============================|| AVAILABLE PASSES ||============================== //

const sampledata = [
    {
        transactionid: '1',
        passName: 'Unlimited Membership',
        renewalDate: 'Auto-renews on 6/2/22',
        classesUsed: 5,
        totalClasses: 'Unlimited Classes',
        classStatement: '5 classes used'
    },
    {
        transactionid: '2',
        passName: '10 Pack',
        renewalDate: 'Exp: 7/2/22',
        classesUsed: 5,
        totalClasses: '10 Classes',
        classStatement: '5 classes remain'
    },
    {
        transactionid: '3',
        passName: 'Free Class',
        renewalDate: 'Exp 12/21/22',
        classesUsed: 0,
        totalClasses: '1 Class',
        classStatement: '1 class remains'
    }
];
const AvailablePasses = (props) => {
    const theme = useTheme();
    const { userid, dibsStudioId, firstname } = props;
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [alreadyRan, setAlreadyRan] = useState(false);
    const [hasPasses, setHasPasses] = useState(false);
    const msgtoshow = `${firstname} does not have any available passes.`;
    useEffect(() => {
        const getUpcomingClasses = async () => {
            // setIsLoading(true);
            await getUpcomingClassesDB(userid, dibsStudioId).then((classes) => {
                if (classes.length > 0) {
                    setUpcomingClasses(classes);
                    setHasPasses(true);
                }
                setAlreadyRan(true);
            });
            // setIsLoading(false);
        };
        if (upcomingClasses.length === 0 && !alreadyRan) getUpcomingClasses();
    }, [userid, dibsStudioId, upcomingClasses, alreadyRan]);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {!hasPasses ? (
                    <Grid item xs={12}>
                        <Typography variant="h7">{msgtoshow}</Typography>
                    </Grid>
                ) : (
                    <Grid item xs={12} sx={{ display: 'flex' }}>
                        {sampledata.map((row) => (
                            <Grid item xs={3} key={row.transactionid} sx={{ mr: 3, mt: 2, mb: 2 }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        // bgcolor: theme.palette.packages.light,
                                        color: theme.palette.text.main,
                                        borderColor: theme.palette.packages.medium,
                                        borderWidth: 0.75,
                                        boxShadow: 'none',
                                        '&:hover': {
                                            boxShadow: theme.customShadows.secondary
                                        }
                                    }}
                                >
                                    <CardHeader
                                        title={<Typography variant="packageHeaders">{row.passName}</Typography>}
                                        sx={{
                                            padding: '10px'
                                        }}
                                    />
                                    <Divider sx={{ borderColor: '#f0f0f0' }} />
                                    <CardContent variant="packages" sx={{ p: 2 }}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} sx={{ p: 0, mb: 0, lineHeight: 1 }}>
                                                <Typography variant="passesData" color="inherit">
                                                    {row.totalClasses}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{ p: 0, mt: 0, lineHeight: 1 }}>
                                                <Typography variant="passesData" color="inherit">
                                                    ({row.classStatement})
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{ mt: 2.7 }}>
                                                <Typography variant="passesData" color="inherit">
                                                    {row.renewalDate}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{ mt: 2.7, display: 'flex' }}>
                                                <Grid item xs={4} sx={{ mr: 3, ml: 0 }}>
                                                    <Button
                                                        onClick={(event) => console.log(event)}
                                                        sx={{
                                                            height: '25px',
                                                            fontSize: '12px',
                                                            fontWeight: 200,
                                                            color: '#fff',
                                                            px: 2,
                                                            bgcolor: theme.palette.packages.button,
                                                            '&:hover': {
                                                                backgroundColor: '#c39589'
                                                            }
                                                        }}
                                                    >
                                                        Book
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={5} sx={{ ml: 1 }}>
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
                                                        Edit
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};
AvailablePasses.propTypes = {
    userid: PropTypes.string,
    dibsStudioId: PropTypes.number,
    firstname: PropTypes.string
};

export default AvailablePasses;
