import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { Grid, Typography, Divider, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { useTheme, alpha, styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';

// project imports
import { useSelector, useDispatch } from 'store';
import GlobalPriceSettings from './RevenueManagement/GlobalPriceSettings';
import FlashCreditsSettings from './RevenueManagement/FlashCreditsSettings';
import updateDymanicPricingStatus from 'actions/studios/settings/updateDynamicPricingStatus';
import UpdateFlashCreditStatus from 'actions/studios/settings/updateFlashCreditStatus';

// actions
import { setDynamicPricing, setFlashCreditsStore } from 'store/slices/dibsstudio';

// ==============================|| STUDIO ADMIN -> SETTINGS -> REVENUE MANAGEMENT ||============================== //
const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: theme.palette.success.dibsgreen,
        '&:hover': {
            backgroundColor: alpha(green[600], theme.palette.success.dibsgreen)
        }
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        color: theme.palette.success.dibsgreen,
        backgroundColor: theme.palette.success.dibsgreen,
        '&:hover': {
            backgroundColor: alpha(green[600], theme.palette.success.dibsgreen)
        }
    }
}));

const RevenueManagementSettingsPage = (props) => {
    const { minp, maxp } = props;
    const { config, settings } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const { dynamicPricing, flashCredits } = settings;
    const theme = useTheme();
    const dispatch = useDispatch();
    const dptext = `When dynamic pricing is turned on, Dibs will price all of your classes according to demand.`;
    const [checked, setChecked] = useState(dynamicPricing);
    // need to dispatch dynamic pricing status to redux store so that it does not lose status
    const [fcChecked, setFcChecked] = useState(flashCredits);
    const dplabel = `Dynamic Pricing is ${checked ? 'on' : 'off'}`;
    const flashcreditlabel = `Flash Credits are ${fcChecked ? 'on' : 'off'}`;

    const handleChange = (event) => {
        setChecked(event.target.checked);
        updateDymanicPricingStatus(dibsStudioId, event.target.checked);
        dispatch(setDynamicPricing(event.target.checked));
    };
    const handleFCChange = (event) => {
        setFcChecked(event.target.checked);
        UpdateFlashCreditStatus(dibsStudioId, event.target.checked);
        dispatch(setFlashCreditsStore(event.target.checked));
    };
    return (
        <Grid container direction="column">
            <Grid item xs={5}>
                <Typography gutterBottom variant="h4">
                    Revenue Management Settings
                </Typography>
            </Grid>
            <Grid item xs={5}>
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <FormGroup>
                        <FormControlLabel
                            control={<GreenSwitch checked={checked} onChange={handleChange} />}
                            label={dplabel}
                            sx={{ fontColor: '#ff0000' }}
                        />
                    </FormGroup>
                    <Typography gutterBottom variant="h6" sx={{ color: theme.palette.text.hint, mt: 1 }}>
                        {dptext}
                    </Typography>
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 5 }}>
                    <Typography gutterBottom variant="h5">
                        Dynamic Price Settings
                    </Typography>
                    <GlobalPriceSettings minp={minp} maxp={maxp} dibsstudioid={dibsStudioId} />
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 5 }}>
                    <Typography gutterBottom variant="h5">
                        Flash credits
                    </Typography>
                    <FormGroup>
                        <FormControlLabel
                            control={<GreenSwitch checked={fcChecked} onChange={handleFCChange} />}
                            label={flashcreditlabel}
                            sx={{ fontColor: '#ff0000' }}
                        />
                    </FormGroup>
                    <FlashCreditsSettings />
                </Grid>
            </Grid>
        </Grid>
    );
};

RevenueManagementSettingsPage.propTypes = {
    minp: PropTypes.number,
    maxp: PropTypes.number
};

export default RevenueManagementSettingsPage;
