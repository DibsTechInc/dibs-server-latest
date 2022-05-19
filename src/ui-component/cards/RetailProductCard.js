import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { Button, CardContent, CardMedia, Grid, CardActions, Stack, Typography } from '@mui/material';

// project import
import MainCard from './MainCard';
import SkeletonProductPlaceholder from 'ui-component/cards/Skeleton/ProductPlaceholder';
import { useDispatch, useSelector } from 'store';
import { addProduct } from 'store/slices/cart';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';

const prodImage = require.context('assets/images/e-commerce', true);

// ==============================|| RETAIL PRODUCT CARD ||============================== //

const RetailProductCard = ({ id, color, name, image, description, offerPrice, salePrice, rating }) => {
    const dispatch = useDispatch();

    const prodProfile = image && prodImage(`./${image}`).default;
    const cart = useSelector((state) => state.cart);

    const addCart = () => {
        dispatch(addProduct({ id, name, image, salePrice, offerPrice, color, size: 8, quantity: 1 }, cart.checkout.products));
        dispatch(
            openSnackbar({
                open: true,
                message: 'Add To Cart Success',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
    };

    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <>
            {isLoading ? (
                <SkeletonProductPlaceholder />
            ) : (
                <MainCard
                    content={false}
                    boxShadow
                    sx={{
                        '&:hover': {
                            transform: 'scale3d(1.02, 1.02, 1)',
                            transition: 'all .4s ease-in-out'
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        width: '220px',
                        borderColor: '#cdc8c8e5'
                    }}
                >
                    <CardMedia
                        sx={{ height: 80 }}
                        image={prodProfile}
                        title="Contemplative Reptile"
                        component={Link}
                        to={`/e-commerce/product-details/${id}`}
                    />
                    <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} align="center">
                                <Typography
                                    component={Link}
                                    to={`/e-commerce/product-details/${id}`}
                                    variant="subtitle1"
                                    sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                                >
                                    {name}
                                </Typography>
                            </Grid>
                            {description && (
                                <Grid item xs={12} align="center">
                                    <Typography variant="body2">{description}</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ marginTop: 'auto', pl: 2.5, pb: 3 }}>
                        <Grid item xs={12}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Grid container spacing={1} maxWidth="lg">
                                    <Grid item sx={{ ml: 2.5 }}>
                                        <Typography variant="h4">${offerPrice}</Typography>
                                    </Grid>
                                </Grid>
                                <Button variant="contained" sx={{ minWidth: 0 }} onClick={addCart}>
                                    <ShoppingCartTwoToneIcon fontSize="small" />
                                </Button>
                            </Stack>
                        </Grid>
                    </CardActions>
                </MainCard>
            )}
        </>
    );
};

RetailProductCard.propTypes = {
    id: PropTypes.number,
    color: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    offerPrice: PropTypes.number,
    salePrice: PropTypes.number,
    rating: PropTypes.number
};

export default RetailProductCard;
