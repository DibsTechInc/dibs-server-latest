import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { format as formatCurrency } from 'currency-formatter';
import TextField from '@mui/material/TextField';
import { Grid, Typography, Stack, Button, Input } from '@mui/material';
import { useTheme, alpha, styled } from '@mui/material/styles';

const PriceTextField = styled(TextField)({
    '& .MuiInput-underline:before': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:before:hover': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderBottomColor: '#c96248'
    }
});

const CssTextField = styled(Input)({
    '& .MuiInput-root:before': {
        borderBottomColor: '#c96248',
        borderBottom: '1px solid'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#c96248',
        borderBottom: 2
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'orange'
        },
        '&:hover fieldset': {
            borderColor: 'yellow'
        },
        '&.Mui-focused fieldset': {
            borderColor: 'orange'
        }
    }
});

const GlobalPriceSettings = (props) => {
    const theme = useTheme();
    const [minPrice, setMinPrice] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);
    const [maxPrice, setMaxPrice] = React.useState('');

    const resetState = () => {
        setIsEditing(false);
        setMinPrice('');
        setMaxPrice('');
    };
    const toggleEdit = () => {
        setIsEditing({ isEditing: !isEditing }, () => {
            if (!isEditing) resetState();
        });
    };
    const handleChange = ({ target: { name, value: _value } }) => {
        // let value = isNaN(_value[0]) ? +_value.slice(1) : +_value;
        // if (!value) value = '';
        // else value = formatCurrency(value, { code: this.props.currency, precision: 0 });
        // this.setState({ [name]: value });
    };
    const handleSubmit = () => {
        // const minPrice = +(minPrice.slice(1) || this.props.minPrice);
        // const maxPrice = +(this.state.maxPrice.slice(1) || this.props.maxPrice);
        // if (!maxPrice && !minPrice) return null;
        // if (minPrice === this.props.minPrice && maxPrice === this.props.maxPrice) return null;
        // if (minPrice > maxPrice) return this.props.addError('The minimum price must be less than or equal to the maximum price');
        // this.props.clearError();
        // this.props.clearNotice();
        // return this.props.updateGlobalPriceSettings({ minPrice, maxPrice }, (err) => {
        //     if (!err) this.resetState();
        // });
    };
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    Reward your clients when they come more often.
                    <br />
                    <br />
                </Typography>
            </Grid>
        </Grid>
    );
};

// GlobalPriceSettings.propTypes = {
//     currency: PropTypes.string,
//     minPrice: PropTypes.number,
//     maxPrice: PropTypes.number,
//     formattedMinPrice: PropTypes.string,
//     formattedMaxPrice: PropTypes.string,
//     isFetching: PropTypes.bool,
//     isUpdating: PropTypes.bool,
//     addError: PropTypes.func,
//     clearError: PropTypes.func,
//     clearNotice: PropTypes.func,
//     updateGlobalPriceSettings: PropTypes.func
// };

// const mapStateToProps = (state) => ({
//     currency: getUserStudioCurrency(state),
//     minPrice: getGlobalMinimumPrice(state),
//     maxPrice: getGlobalMaximumPrice(state),
//     formattedMinPrice: getFormattedGlobalMinimumPrice(state),
//     formattedMaxPrice: getFormattedGlobalMaximumPrice(state),
//     isFetching: getIfGettingPriceSettings(state),
//     isUpdating: getIfUpdatingPriceSettings(state)
// });
// const mapDispatchToProps = {
//     addError,
//     clearError,
//     clearNotice,
//     updateGlobalPriceSettings
// };

// const SmartGlobalPriceSettings = connect(mapStateToProps, mapDispatchToProps)(GlobalPriceSettings);

export default GlobalPriceSettings;
