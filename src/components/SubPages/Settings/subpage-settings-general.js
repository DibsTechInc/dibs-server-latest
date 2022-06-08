// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports
import WidgetColorPicker from './General/WidgetColorPicker';
import DaysToShowCalendar from './General/DaysToShowCalendar';
import FriendReferralSetting from './General/FriendReferralSetting';
import CancelationSetting from './General/CancelationSetting';
import TaxSettings from './General/TaxSettings';
import { useSelector } from 'store';

// ==============================|| STUDIO ADMIN -> SETTINGS -> GENERAL ||============================== //

const GeneralSettingsPage = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    // eslint-disable-next-line camelcase
    return (
        <Grid container direction="column">
            <Grid item xs={5}>
                <Typography gutterBottom variant="h4">
                    General Studio Settings
                </Typography>
            </Grid>
            <Grid item xs={5}>
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography gutterBottom variant="h5">
                        Widget Accent Color
                    </Typography>
                    <WidgetColorPicker dibsstudioid={dibsStudioId} />
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography gutterBottom variant="h5">
                        # of Days to Show on Schedule
                    </Typography>
                    <DaysToShowCalendar dibsstudioid={dibsStudioId} />
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography gutterBottom variant="h5">
                        Friend Referrals
                    </Typography>
                    <FriendReferralSetting dibsstudioid={dibsStudioId} />
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography gutterBottom variant="h5">
                        Cancelation Window
                    </Typography>
                    <CancelationSetting dibsstudioid={dibsStudioId} />
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography gutterBottom variant="h5">
                        Tax Rates
                    </Typography>
                    <TaxSettings dibsstudioid={dibsStudioId} />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default GeneralSettingsPage;
