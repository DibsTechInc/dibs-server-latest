// material-ui
import { Grid, Typography, Divider } from '@mui/material';
// import { useTheme } from '@mui/material/styles';

// project imports
import CustomerServiceSettings from './Communication/CustomerServiceSettings';
import CustomSendingDomain from './Communication/CustomSendingDomain';
import { useSelector } from 'store';

// ==============================|| STUDIO ADMIN -> SETTINGS -> COMMUNICATION ||============================== //

const CommunicationSettingsPage = () => {
    // const theme = useTheme();
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    return (
        <Grid container direction="column">
            <Grid item xs={5}>
                <Typography gutterBottom variant="h4">
                    Communication Settings
                </Typography>
            </Grid>
            <Grid item xs={5}>
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography gutterBottom variant="h5">
                        Customer Service
                    </Typography>
                    <CustomerServiceSettings dibsstudioid={dibsStudioId} />
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography gutterBottom variant="h5">
                        Custom Sending Domain
                    </Typography>
                    <CustomSendingDomain dibsstudioid={dibsStudioId} />
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography gutterBottom variant="h5">
                        Address
                    </Typography>
                    <CustomSendingDomain dibsstudioid={dibsStudioId} />
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography gutterBottom variant="h5">
                        Terms & Conditions
                    </Typography>
                    <CustomSendingDomain dibsstudioid={dibsStudioId} />
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography gutterBottom variant="h5">
                        Hero URL
                    </Typography>
                    <CustomSendingDomain dibsstudioid={dibsStudioId} />
                </Grid>
                <Divider />
                <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                    <Typography gutterBottom variant="h5">
                        Color Logo
                    </Typography>
                    <CustomSendingDomain dibsstudioid={dibsStudioId} />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CommunicationSettingsPage;
