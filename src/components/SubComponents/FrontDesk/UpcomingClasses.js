import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Divider, Grid, Typography } from '@mui/material';

import UnstyledDropButton from 'assets/graphics/icons/DropButton';
import getUpcomingClassesDB from 'actions/studios/users/getUpcomingClassesDB';

// personal details table
/** names Don&apos;t look right */
function createData(id, date, name, time, instructor, packageApplied, carbs, protein) {
    const id2 = `${id}2`;
    return { id, id2, date, name, time, instructor, packageApplied, carbs, protein };
}

// ==============================|| SAMPLE PAGE ||============================== //
const rows = [
    createData(15, 'Friday, May 2nd, 2022', 'MANIC MONDAY (121 LUDLOW L.E.S)', '8:00AM', 'Coss Marte', 'Unlimited Membership'),
    createData(16, 'Thursday, May 18th, 2022', 'TOUGH LOVE TUESDAY (121 LUDLOW LES)', '9:00AM', 'Jeanette Heck', '10 Pack'),
    createData(18, 'Friday, May 19th, 2022', 'FULL BODY FRIDAY (121 LUDLOW L.E.S)', '10:00AM', 'Erik Ulin', 'Single Class'),
    createData(19, 'Monday, May 22nd, 2022', 'class title 4', '10:20AM', 'Jane Raily', '5 Pack'),
    createData(20, 'Tuesday, May 23rd, 2022', 'class title 5', '11:00AM', 'Alvin Martin', '8 Pack')
];

// ==============================|| UPCOMING CLASSES ||============================== //

const UpcomingClasses = (props) => {
    const { userid, dibsStudioId } = props;
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasClasses, setHasClasses] = useState(false);
    const [alreadyRan, setAlreadyRan] = useState(false);
    useEffect(() => {
        console.log('UpcomingClasses mounted');
        console.log(`userid: ${userid}`);
        console.log(`dibsStudioId: ${dibsStudioId}`);
        const getUpcomingClasses = async () => {
            console.log(`ran getUpcomingClasses`);
            // setIsLoading(true);
            await getUpcomingClassesDB(userid, dibsStudioId).then((classes) => {
                console.log(`classes from function call is: ${JSON.stringify(classes)}`);
                setUpcomingClasses(classes);
                setAlreadyRan(true);
            });
            // setIsLoading(false);
        };
        console.log(`upcomingClasses: ${JSON.stringify(upcomingClasses)}`);
        if (upcomingClasses.length === 0 && !alreadyRan) getUpcomingClasses();
    }, [userid, dibsStudioId, upcomingClasses, alreadyRan]);
    return (
        <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
                {rows.map((row) => (
                    <div key={row.id}>
                        <Grid container>
                            <Grid item xs={12} sx={{ mb: 3, mt: 2 }}>
                                <Typography variant="sectionSubHeaders" sx={{ ml: 1 }}>
                                    {row.date}
                                </Typography>
                            </Grid>
                            <Grid container wrap="nowrap">
                                <Grid item xs={1.4} sx={{ ml: 1, mb: 4.5 }}>
                                    <Grid container>
                                        <Grid item xs={12} sx={{ ml: 0.2, lineHeight: 1.25, alignItems: 'center', display: 'flex' }}>
                                            <Typography variant="sectionData">{row.time}</Typography>
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
                                            <Typography variant="sectionClassTitle">{row.name}</Typography>
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
                                            <Typography variant="sectionDataSecondary" sx={{ fontWeight: 600 }}>
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
                                                        1
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3.3} sx={{ mb: 4.5, justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
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
                                                Applied {row.packageApplied}
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
        </Grid>
    );
};
UpcomingClasses.propTypes = {
    userid: PropTypes.string,
    dibsStudioId: PropTypes.number
};

export default UpcomingClasses;
