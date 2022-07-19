import propTypes from 'prop-types';
import { Grid, TextField, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
    '& .MuiInput-underline:before': {
        borderBottomColor: '#ccc'
    },
    '& .MuiInput-underline:before:hover': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#c96248'
    }
});

export default function DropDownTextField({ valueString, widthNumber, onChange, options }) {
    return (
        <Grid item xs={12}>
            <StyledTextField
                id="select-values"
                select
                value={valueString}
                onChange={onChange}
                variant="outlined"
                sx={{ width: widthNumber, transition: 'all .2s ease-in-out' }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontWeight: 300 }}>
                        {option.label}
                    </MenuItem>
                ))}
            </StyledTextField>
        </Grid>
    );
}
DropDownTextField.propTypes = {
    valueString: propTypes.oneOfType([propTypes.string, propTypes.number]),
    widthNumber: propTypes.number,
    onChange: propTypes.func,
    options: propTypes.array
};
