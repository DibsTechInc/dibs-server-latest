// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports
import WidgetColorPicker from './General/WidgetColorPicker';
import DaysToShowCalendar from './General/DaysToShowCalendar';
import FriendReferralSetting from './General/FriendReferralSetting';
import CancelationSetting from './General/CancelationSetting';
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
                {/* 
                <Typography gutterBottom variant="h6">
                    I collect taxes
                    Tax Rates (sales & retail)
                </Typography>
                <Typography gutterBottom variant="h6">
                    friend referral amount
                </Typography>
                <Typography gutterBottom variant="h6">
                    cancellation window
                </Typography>
                <Typography gutterBottom variant="h6">
                    display gift cards
                </Typography>
                <Typography gutterBottom variant="h6">
                    Require waiver - show the link to waiver
                </Typography>
                <Typography gutterBottom variant="h6">
                    default price per class (min and max if dynamic pricing is set) -> move this to revenue management section
                </Typography>
                 */}
            </Grid>
        </Grid>
    );
};

export default GeneralSettingsPage;
