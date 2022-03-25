import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import PropTypes from 'prop-types';

const EarningCard = (props) => {
    const { title } = props;

    return (
        <Card>
            <CardContent>
                <Grid container direction="column">
                    <Grid item>
                        <Grid container justifyContent="space-between">
                            <Grid item>{title}</Grid>
                            <Grid item>
                                <Skeleton variant="rectangular" width={34} height={34} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rectangular" sx={{ my: 2 }} height={40} />
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rectangular" height={30} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
EarningCard.propTypes = {
    title: PropTypes.string
};

export default EarningCard;
