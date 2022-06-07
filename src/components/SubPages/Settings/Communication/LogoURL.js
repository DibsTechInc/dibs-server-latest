import React from 'react';
import { Grid, Typography, Stack, Button, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'store';

const LogoURL = () => {
    const theme = useTheme();
    const { studioConfig } = useSelector((state) => state.dibsstudio);
    const { imageUrls } = studioConfig;
    // eslint-disable-next-line camelcase
    const { color_logo } = imageUrls;
    const defaultString = 'Not yet provided';
    const [logoImage, setLogoImage] = React.useState(color_logo);
    const [doesHaveImage, setDoesHaveImage] = React.useState(false);
    const first = `'ve already`;
    const second = `haven't`;
    let guidance = `Your logo image will be displayed above your hero image in almost all email communication from your studio. You ${
        doesHaveImage ? first : second
    } provided your logo image to ${doesHaveImage ? 'Dibs' : 'Dibs yet'}.`;
    const secondMsg = `To update your logo image, please send the desired logo to studios@ondibs.com. You can also send us a direct link to your logo image (e.g. https://yourimagehere.com). Note: It takes approximately 12 hours for Terms to be updated.`;
    if (!doesHaveImage) guidance += ` ${secondMsg}`;
    React.useEffect(() => {
        if (logoImage.length <= 2) {
            setDoesHaveImage(false);
            setLogoImage(defaultString);
        }
    }, [logoImage]);
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    {guidance}
                    <br />
                </Typography>
            </Grid>
            <Grid item xs={7} sx={{ mt: 4 }}>
                <Stack direction="row" spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Logo Image URL:</Typography>
                        <Typography variant="h7" sx={{ mt: 3 }}>
                            {logoImage}
                        </Typography>
                        <Grid item xs={12} sx={{ mt: 3 }}>
                            <Button disableElevation variant="contained" color="primary" href={logoImage} target="_blank" component={Link}>
                                Check Your Logo Image
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default LogoURL;
