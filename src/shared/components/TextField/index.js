import propTypes from 'prop-types';
import { Grid, TextField } from '@mui/material';
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

export default function NormalTextField(props) {
    const { valueString, widthNumber, onChange } = props;
    return (
        <Grid item xs={12}>
            <StyledTextField variant="standard" value={valueString} onChange={(e) => onChange(e)} sx={{ width: widthNumber }} />
        </Grid>
    );
}
NormalTextField.propTypes = {
    valueString: propTypes.string,
    widthNumber: propTypes.number,
    onChange: propTypes.func
};
