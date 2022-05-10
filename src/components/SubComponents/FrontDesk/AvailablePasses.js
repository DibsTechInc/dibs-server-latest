import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Card, CardHeader, Grid, Typography, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import UnstyledDropButton from 'assets/graphics/icons/DropButton';
import getUpcomingClassesDB from 'actions/studios/users/getUpcomingClassesDB';

// ==============================|| UPCOMING CLASSES ||============================== //

const sampledata = [
    {
        transactionid: '1',
        passName: 'Unlimited Membership',
        renewalDate: 'Auto-renews on 6/2/22',
        classesUsed: 5,
        totalClasses: 'Unlimited'
    },
    { transactionid: '2', passName: '10 Pack', renewalDate: 'Exp: 7/2/22', classesUsed: 5, totalClasses: 10 },
    { transactionid: '3', passName: 'Free Class', renewalDate: 'Exp 12/21/22', classesUsed: 0, totalClasses: 1 }
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
        <Grid container direction="column" spacing={2}>
            {!hasPasses ? (
                <Grid item xs={12}>
                    <Typography variant="h7">{msgtoshow}</Typography>
                </Grid>
            ) : (
                <Grid item xs={12}>
                    {sampledata.map((row) => (
                        <div key={row.transactionid}>
                            <Grid container>
                                <Grid item sm={6} md={4}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            bgcolor: theme.palette.packages.light,
                                            color: theme.palette.text.main,
                                            borderColor: '#eeeeee'
                                        }}
                                    >
                                        <CardHeader
                                            title={<Typography variant="packageHeaders">{row.passName}</Typography>}
                                            sx={{
                                                padding: '10px'
                                            }}
                                        />
                                        <Divider sx={{ borderColor: '#f0f0f0' }} />
                                        <CardContent variant="packages">
                                            <Grid container spacing={1}>
                                                <Grid item>
                                                    <Typography variant="subtitle1" color="inherit">
                                                        Success Card Title
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle2" color="inherit">
                                                        Some quick example text to build on the card title and make up the bulk of the
                                                        card&apos;s content.
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    ))}
                </Grid>
            )}
        </Grid>
    );
};
AvailablePasses.propTypes = {
    userid: PropTypes.string,
    dibsStudioId: PropTypes.number,
    firstname: PropTypes.string
};

export default AvailablePasses;
