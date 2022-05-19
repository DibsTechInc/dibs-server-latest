import * as React from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Grid } from '@mui/material';

import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import { useSelector } from 'store';
import RetailProductGrid from 'components/SubComponents/FrontDesk/RetailProducts/RetailProductGrid';
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
                            <RetailProductGrid />
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default BuyRetail;
