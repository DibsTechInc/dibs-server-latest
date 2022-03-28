// import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const EarningCard = (props) => {
    const { title, revenue, stateUp, percentage } = props;
    const theme = useTheme();

    return (
        <Card variant="outlined" sx={{ borderColor: theme.palette.grey[300], maxWidth: 180 }}>
            <CardContent>
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Grid item>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Typography variant="tileHeader" color="main">
                                    {title}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container justifyContent="space-between">
                            <Grid item height={40} sx={{ marginTop: 2 }}>
                                <Typography variant="tileRevenue">{revenue}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sx={{ marginTop: 0.5 }}>
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item>
                                {stateUp === 1 && <ArrowUpwardIcon sx={{ fontSize: 20, color: '#55c797' }} />}
                                {stateUp === 0 && <ArrowDownwardIcon sx={{ fontSize: 20, color: '#ffdd67' }} />}
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                    {percentage}%
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container>
                            <Grid item height={40} sx={{ marginTop: 2 }}>
                                <Typography variant="tileSubheader" sx={{ textAlign: 'center' }} align="center" paragraph>
                                    Compared with this time last week
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
EarningCard.propTypes = {
    title: PropTypes.string,
    revenue: PropTypes.string,
    stateUp: PropTypes.number,
    percentage: PropTypes.number
};

export default EarningCard;
