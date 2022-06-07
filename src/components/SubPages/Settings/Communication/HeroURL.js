import React from 'react';
import { Grid, Typography, Stack, Button, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'store';

const HeroURL = () => {
    const theme = useTheme();
    const { studioConfig } = useSelector((state) => state.dibsstudio);
    const { imageUrls } = studioConfig;
    // eslint-disable-next-line camelcase
    const { hero_url } = imageUrls;
    const defaultString = 'Not yet provided';
    const [heroImage, setHeroImage] = React.useState(hero_url);
    const [doesHaveImage, setDoesHaveImage] = React.useState(false);
    const first = `'ve already`;
    const second = `haven't`;
    let guidance = `Your hero image is a key part of your branding. It will be displayed in almost all email communication from your studio. You ${
        doesHaveImage ? first : second
    } provided your hero image to ${doesHaveImage ? 'Dibs' : 'Dibs yet'}.`;
    const secondMsg = `To update your hero image, please send the desired image to studios@ondibs.com. You can also send us a direct link to your hero image (e.g. https://yourimagehere.com). The layout for the image should be horizontal. Note: It takes approximately 12 hours for Terms to be updated.`;
    if (!doesHaveImage) guidance += ` ${secondMsg}`;
    React.useEffect(() => {
        if (heroImage.length <= 2) {
            setDoesHaveImage(false);
            setHeroImage(defaultString);
        }
    }, [heroImage]);
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
                        <Typography variant="h6">Hero Image URL:</Typography>
                        <Typography variant="h7" sx={{ mt: 3 }}>
                            {heroImage}
                        </Typography>
                        <Grid item xs={12} sx={{ mt: 3 }}>
                            <Button disableElevation variant="contained" color="primary" href={heroImage} target="_blank" component={Link}>
                                Check Your Hero Image
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default HeroURL;
