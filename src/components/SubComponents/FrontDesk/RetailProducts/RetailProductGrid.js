import { useEffect, useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Divider,
    Drawer,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import SortOptions from './SortOptions';
import ProductEmpty from './ProductEmpty';
import ProductFilter from './ProductFilter';
import ProductFilterView from './ProductFilterView';
import RetailProductCard from 'ui-component/cards/RetailProductCard';
import FloatingCart from 'ui-component/cards/FloatingCart';
import SkeletonProductPlaceholder from 'ui-component/cards/Skeleton/ProductPlaceholder';
import useConfig from 'hooks/useConfig';
import { resetCart } from 'store/slices/cart';
import { openDrawer } from 'store/slices/menu';
import { useDispatch, useSelector } from 'store';
import { appDrawerWidth, gridSpacing } from 'store/constant';
import { getProducts, filterProducts } from 'store/slices/product';

// assets
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';

// product list container
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter
    }),
    marginRight: -appDrawerWidth,
    [theme.breakpoints.down('xl')]: {
        paddingRight: 0,
        marginRight: 0
    },
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shorter
        }),
        marginRight: 0
    })
}));

// ==============================|| E-COMMERCE - PRODUCT GRID ||============================== //

const ProductsList = () => {
    const theme = useTheme();

    const { borderRadius } = useConfig();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
    const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));

    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    // drawer
    const [open, setOpen] = useState(isLoading);

    const handleDrawerOpen = () => {
        setOpen((prevState) => !prevState);
    };

    // product data
    const [products, setProducts] = useState([]);
    const retailState = useSelector((state) => state.retail);

    useEffect(() => {
        setProducts(retailState.products);
    }, [retailState]);

    useEffect(() => {
        dispatch(getProducts());

        // hide left drawer when email app opens
        dispatch(openDrawer(true));

        // clear cart if complete order
        if (cart.checkout.step > 2) {
            dispatch(resetCart());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // filter
    const initialState = {
        search: '',
        sort: 'low',
        gender: [],
        categories: ['all'],
        colors: [],
        price: '',
        rating: 0
    };
    const [filter, setFilter] = useState(initialState);

    // search filter
    const handleSearch = async (event) => {
        const newString = event?.target.value;
        setFilter({ ...filter, search: newString });
    };

    // sort options
    const [anchorEl, setAnchorEl] = useState(null);
    const openSort = Boolean(anchorEl);
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const filterIsEqual = (a1, a2) =>
        a1 === a2 ||
        (a1.length === a2.length &&
            a1.search === a2.search &&
            a1.sort === a2.sort &&
            a1.price === a2.price &&
            a1.rating === a2.rating &&
            JSON.stringify(a1.gender) === JSON.stringify(a2.gender) &&
            JSON.stringify(a1.categories) === JSON.stringify(a2.categories) &&
            JSON.stringify(a1.colors) === JSON.stringify(a2.colors));

    const handelFilter = (type, params, rating) => {
        setLoading(true);
        switch (type) {
            case 'gender':
                if (filter.gender.some((item) => item === params)) {
                    setFilter({ ...filter, gender: filter.gender.filter((item) => item !== params) });
                } else {
                    setFilter({ ...filter, gender: [...filter.gender, params] });
                }
                break;
            case 'categories':
                if (filter.categories.some((item) => item === params)) {
                    setFilter({ ...filter, categories: filter.categories.filter((item) => item !== params) });
                } else if (filter.categories.some((item) => item === 'all') || params === 'all') {
                    setFilter({ ...filter, categories: [params] });
                } else {
                    setFilter({ ...filter, categories: [...filter.categories, params] });
                }

                break;
            case 'colors':
                if (filter.colors.some((item) => item === params)) {
                    setFilter({ ...filter, colors: filter.colors.filter((item) => item !== params) });
                } else {
                    setFilter({ ...filter, colors: [...filter.colors, params] });
                }
                break;
            case 'price':
                setFilter({ ...filter, price: params });
                break;
            case 'search':
                setFilter({ ...filter, search: params });
                break;
            case 'sort':
                setFilter({ ...filter, sort: params });
                break;
            case 'rating':
                setFilter({ ...filter, rating });
                break;
            case 'reset':
                setFilter(initialState);
                break;
            default:
            // no options
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    useEffect(() => {
        setOpen(!matchDownLG);
    }, [matchDownLG]);

    // sort filter
    const handleMenuItemClick = (event, index) => {
        setFilter({ ...filter, sort: index });
        setAnchorEl(null);
    };

    const sortLabel = SortOptions.filter((items) => items.value === filter.sort);

    let productResult = <></>;
    if (products && products.length > 0) {
        productResult = products.map((product, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex' }}>
                <RetailProductCard
                    id={product.id}
                    image={product.image}
                    name={product.name}
                    description={product.description}
                    salePrice={product.price}
                    offerPrice={product.price}
                    quickbuy={product.display_on_roster}
                />
            </Grid>
        ));
    } else {
        productResult = (
            <Grid item xs={12} sx={{ mt: 3 }}>
                <ProductEmpty />
            </Grid>
        );
    }

    const spacingMD = matchDownMD ? 1 : 1.5;

    return (
        <Grid container spacing={2}>
            {products.length > 0 && (
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between" spacing={matchDownMD ? 0.5 : 2}>
                        <Grid item xs={4} align="left" sx={{ mt: 3, pr: 3, ml: 2, fontStyle: 'italic' }}>
                            <Typography variant="h7" component="h2">
                                (Items in green are available for quick buy)
                            </Typography>
                        </Grid>
                        <Grid item xs={7} align="right" sx={{ mt: 3, pr: 3 }}>
                            <TextField
                                sx={{ width: { xs: 140, md: 'auto' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    )
                                }}
                                value={filter.search}
                                placeholder="Search Products"
                                size="small"
                                onChange={handleSearch}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            )}
            <Grid item xs={12}>
                <Box sx={{ display: 'flex' }}>
                    <Main open={open}>
                        <ProductFilterView
                            filter={filter}
                            filterIsEqual={filterIsEqual}
                            handelFilter={handelFilter}
                            initialState={initialState}
                        />
                        <Grid container spacing={3} maxWidth="90%" sx={{ ml: 2, mr: 2, mt: 2, mb: 6 }}>
                            {isLoading
                                ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                      <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                                          <SkeletonProductPlaceholder />
                                      </Grid>
                                  ))
                                : productResult}
                        </Grid>
                    </Main>
                    <Drawer
                        sx={{
                            ml: open ? 3 : 0,
                            height: matchDownLG ? '100vh' : 'auto',
                            flexShrink: 0,
                            zIndex: { xs: 1200, lg: open ? 0 : -1 },
                            overflowX: 'hidden',
                            width: appDrawerWidth,
                            '& .MuiDrawer-paper': {
                                height: 'auto',
                                width: appDrawerWidth,
                                position: matchDownLG ? 'fixed' : 'relative',
                                border: 'none',
                                borderRadius: matchDownLG ? 0 : `${borderRadius}px`
                            }
                        }}
                        variant={matchDownLG ? 'temporary' : 'persistent'}
                        anchor="right"
                        open={open}
                        ModalProps={{ keepMounted: true }}
                        onClose={handleDrawerOpen}
                    >
                        {open && (
                            <PerfectScrollbar component="div">
                                <ProductFilter filter={filter} handelFilter={handelFilter} />
                            </PerfectScrollbar>
                        )}
                    </Drawer>
                </Box>
            </Grid>
            <FloatingCart />
        </Grid>
    );
};

export default ProductsList;
