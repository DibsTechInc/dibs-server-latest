import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { Grid, Typography, Divider, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { useTheme, alpha, styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';

// project imports
import GlobalPriceSettings from './RevenueManagement/GlobalPriceSettings';

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
    const { dynamicpricing } = props;
    const theme = useTheme();
    const dptext = `When dynamic pricing is turned on, Dibs will price all of your classes according to demand.`;
    const dplabel = `Dynamic Pricing is ${dynamicpricing ? 'on' : 'off'}`;
    const [checked, setChecked] = useState(dynamicpricing);

    const handleChange = (event) => {
        console.log(`event is: ${event}`);
        setChecked(event.target.checked);
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
                        Dynamic Pricing: Settings
                    </Typography>
                    <GlobalPriceSettings />
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 5 }}>
                    <Typography gutterBottom variant="h6">
                        Flash credits
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

RevenueManagementSettingsPage.propTypes = {
    dynamicpricing: PropTypes.bool
};

export default RevenueManagementSettingsPage;
