import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Card, CardHeader, CardActions, Button, Grid, Typography, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import getAvailablePasses from 'actions/studios/users/getAvailablePasses';

// ==============================|| AVAILABLE PASSES ||============================== //

const AvailablePasses = (props) => {
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
                {!hasPasses ? (
                    <Grid item xs={12}>
                        <Typography variant="h7">{msgtoshow}</Typography>
                    </Grid>
                ) : (
                    <Grid item xs={12} sx={{ display: 'flex' }}>
                        {availablePasses.map((row) => (
                            <Grid item xs={4} md={3.25} key={row.passid} sx={{ mr: 3, mt: 2.5, mb: 2.5, display: 'flex' }}>
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
                                        },
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <CardHeader
                                        title={<Typography variant="packageHeaders">{row.passName}</Typography>}
                                        sx={{
                                            padding: '10px',
                                            ml: 1,
                                            mt: 0.5,
                                            mb: 0.25,
                                            alignItems: 'top'
                                        }}
                                    />
                                    <Divider sx={{ borderColor: '#f0f0f0' }} />
                                    <CardContent variant="packages" sx={{ pt: 2.5, pl: 2.25, pr: 1 }}>
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
                                                {row.doesRenew ? (
                                                    <Typography
                                                        variant="passesData"
                                                        color="#55c797"
                                                        sx={{ fontWeight: 500, fontSize: '0.8rem' }}
                                                    >
                                                        {row.renewalDate}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="passesData" color="inherit">
                                                        {row.renewalDate}
                                                    </Typography>
                                                )}
                                            </Grid>
                                            {row.specialnotes.length > 1 && (
                                                <Grid item xs={12} sx={{ mt: 1 }}>
                                                    <Typography variant="passesData" color="inherit" sx={{ fontStyle: 'italic' }}>
                                                        {row.specialnotes}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </CardContent>
                                    <CardActions sx={{ marginTop: 'auto', pl: 2.5, pb: 3 }}>
                                        <Grid item xs={12} sx={{ mt: 1, display: 'flex' }}>
                                            <Grid
                                                item
                                                xs={4}
                                                sx={{
                                                    mr: 3,
                                                    ml: 0
                                                }}
                                            >
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
                                    </CardActions>
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
