import * as React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

import useConfig from 'hooks/useConfig';
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import { useDispatch, useSelector } from 'store';

// assets

// ==============================|| CLIENT BUY RETAIL ||============================== //

const BuyRetail = () => {
    const [alreadyChecked, setAlreadyChecked] = React.useState(false);
    const [checkingNow, setCheckingNow] = React.useState(false);
    const { userid } = useParams();
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    React.useEffect(() => {
        const getClientInfo = async () => {
            setCheckingNow(true);
        };
        if (!alreadyChecked && !checkingNow) {
            getClientInfo();
        }
    }, [userid, dibsStudioId, alreadyChecked, checkingNow]);
    const retailtitle = 'Buy Retail';
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <SubCard title={retailtitle} content={false}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            Retail goes here
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default BuyRetail;
