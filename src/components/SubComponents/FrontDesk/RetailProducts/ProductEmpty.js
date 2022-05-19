// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| NO/EMPTY Product ||============================== //

const ProductEmpty = () => {
    const noItemsString = `There aren't any available retail items yet.`;
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Box sx={{ maxWidth: 720, m: '0 auto', textAlign: 'center' }}>
                    <Grid container justifyContent="center" spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12} sx={{ mt: 10 }}>
                                    <Typography variant="h4" color="inherit" component="div" sx={{ fontWeight: 300 }}>
                                        {noItemsString}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ pb: 20 }}>
                                    <Button sx={{ width: '150px', height: '30px' }}>Add Retail Item</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ProductEmpty;
