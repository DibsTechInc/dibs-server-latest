// material-ui
import PropTypes from 'prop-types';
import { Grid, Typography, Divider, Stack } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useTheme, alpha, styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';

// project imports

// ==============================|| STUDIO ADMIN -> SETTINGS -> INTEGRATIONS ||============================== //
const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked.Mui-disabled': {
        color: theme.palette.success.dibsgreen,
        '&:hover': {
            backgroundColor: alpha(green[600], theme.palette.success.successDibsGreen)
        }
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: green[600]
    }
}));

const IntegrationsSettingsPage = (props) => {
    const theme = useTheme();
    const { classpass, gympass } = props;
    const cptext = `Contact studios@ondibs.com to turn Classpass integration ${classpass ? 'off' : 'on'}.`;
    const gptext = `Contact studios@ondibs.com to turn Gympass integration ${gympass ? 'off' : 'on'}.`;
    const classpasslabel = `Classpass is ${classpass ? 'on' : 'off'}`;
    const gympasslabel = `Gympass is ${gympass ? 'on' : 'off'}`;
    return (
        <Grid container direction="column" rowSpacing={0} sx={{ height: '100vh' }}>
            <Grid item xs={12}>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="h4">
                        Integrations Settings
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    {classpass ? (
                        <FormGroup>
                            <FormControlLabel
                                disabled
                                control={<GreenSwitch checked />}
                                label={classpasslabel}
                                sx={{ fontColor: '#ff0000' }}
                            />
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <FormControlLabel disabled control={<Switch />} label={classpasslabel} />
                        </FormGroup>
                    )}
                    <Typography gutterBottom variant="h6" sx={{ color: theme.palette.text.hint }}>
                        {cptext}
                    </Typography>
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 5 }}>
                    {gympass ? (
                        <FormGroup>
                            <FormControlLabel disabled control={<Switch checked />} label={gympasslabel} />
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <FormControlLabel disabled control={<Switch />} label={gympasslabel} />
                        </FormGroup>
                    )}
                    <Typography gutterBottom variant="h6" sx={{ color: theme.palette.text.hint }}>
                        {gptext}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

IntegrationsSettingsPage.propTypes = {
    classpass: PropTypes.bool.isRequired,
    gympass: PropTypes.bool
};
export default IntegrationsSettingsPage;
