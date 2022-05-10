import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Divider, Grid, Typography } from '@mui/material';

import UnstyledDropButton from 'assets/graphics/icons/DropButton';
import getUpcomingClassesDB from 'actions/studios/users/getUpcomingClassesDB';

// ==============================|| UPCOMING CLASSES ||============================== //

const UpcomingClasses = (props) => {
    const { userid, dibsStudioId, firstname } = props;
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [alreadyRan, setAlreadyRan] = useState(false);
    const [hasClasses, setHasClasses] = useState(false);
    const msgtoshow = `${firstname} does not have any classes scheduled.`;
    useEffect(() => {
        const getUpcomingClasses = async () => {
            // setIsLoading(true);
            await getUpcomingClassesDB(userid, dibsStudioId).then((classes) => {
                if (classes.length > 0) {
                    setUpcomingClasses(classes);
                    setHasClasses(true);
                }
                setAlreadyRan(true);
            });
            // setIsLoading(false);
        };
        if (upcomingClasses.length === 0 && !alreadyRan) getUpcomingClasses();
    }, [userid, dibsStudioId, upcomingClasses, alreadyRan]);
    return (
        <Grid container direction="column" spacing={2}>
            {!hasClasses ? (
                <Grid item xs={12}>
                    <Typography variant="h7">{msgtoshow}</Typography>
                </Grid>
            ) : (
                <Grid item xs={12}>
                    {upcomingClasses.map((row) => (
                        <div key={row.transactionid}>
                            <Grid container>
                                <Grid item xs={12} sx={{ mb: 3, mt: 2 }}>
                                    <Typography variant="sectionSubHeaders" sx={{ ml: 1 }}>
                                        {row.datetodisplay}
                                    </Typography>
                                </Grid>
                                <Grid container wrap="nowrap">
                                    <Grid item xs={1.4} sx={{ ml: 1, mb: 4.5 }}>
                                        <Grid container>
                                            <Grid item xs={12} sx={{ ml: 0.2, lineHeight: 1.25, alignItems: 'center', display: 'flex' }}>
                                                <Typography variant="sectionData">{row.timetodisplay}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{ ml: 0.2, lineHeight: 1.25 }}>
                                                <Typography variant="sectionDataSecondary">Woodbury</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={4.6} sx={{ mb: 4.5 }}>
                                        <Grid container>
                                            <Grid
                                                item
                                                xs={12}
                                                sx={{
                                                    ml: 0.2,
                                                    lineHeight: 1.25,
                                                    justifyContent: 'center',
                                                    display: 'flex'
                                                }}
                                            >
                                                <Typography variant="sectionClassTitle">{row.classtitle}</Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sx={{
                                                    ml: 0.2,
                                                    lineHeight: 1.25,
                                                    justifyContent: 'center',
                                                    display: 'flex'
                                                }}
                                            >
                                                <Typography variant="sectionDataSecondary">{row.instructor}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={1.7}>
                                        <Grid container justifyContent="center">
                                            <Grid
                                                item
                                                xs={12}
                                                sx={{
                                                    ml: 0.2,
                                                    lineHeight: 1.25,
                                                    justifyContent: 'center',
                                                    display: 'flex'
                                                }}
                                            >
                                                <Typography variant="sectionDataSecondary" sx={{ fontWeight: 420 }}>
                                                    Spots Booked
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sx={{
                                                    ml: 0.2,
                                                    lineHeight: 1.25,
                                                    justifyContent: 'center',
                                                    display: 'flex'
                                                }}
                                            >
                                                <Grid
                                                    item
                                                    xs={6}
                                                    sx={{
                                                        ml: 0.2,
                                                        lineHeight: 1.25,
                                                        justifyContent: 'center',
                                                        display: 'flex'
                                                    }}
                                                >
                                                    <Box
                                                        xs={12}
                                                        sx={{
                                                            borderBottom: 0.7,
                                                            borderColor: '#c96248',
                                                            minWidth: 40,
                                                            justifyContent: 'center',
                                                            display: 'flex'
                                                        }}
                                                    >
                                                        <Typography variant="sectionDataSecondary" sx={{ alignContent: 'center' }}>
                                                            {row.spots_booked}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={3.3}
                                        sx={{ mb: 4.5, justifyContent: 'center', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <Grid container>
                                            <Grid
                                                item
                                                xs={12}
                                                sx={{
                                                    lineHeight: 1.25,
                                                    fontSize: '0.55rem',
                                                    fontWeight: 200,
                                                    justifyContent: 'center',
                                                    display: 'flex',
                                                    mx: 2.9
                                                }}
                                            >
                                                <Typography
                                                    variant="sectionDataSecondary"
                                                    sx={{ fontSize: '0.65rem', fontWeight: 400, textAlign: 'center' }}
                                                >
                                                    Applied {row.packageUsed}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <UnstyledDropButton />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider sx={{ borderColor: '#f0f0f0', mb: 2 }} />
                        </div>
                    ))}
                </Grid>
            )}
        </Grid>
    );
};
UpcomingClasses.propTypes = {
    userid: PropTypes.string,
    dibsStudioId: PropTypes.number,
    firstname: PropTypes.string
};

export default UpcomingClasses;
