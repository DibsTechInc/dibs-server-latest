import propTypes from 'prop-types';
import { Grid, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function SubmitButton(props) {
    const { id, valueString, onClick } = props;
    const theme = useTheme();
    return (
        <Grid item xs={12}>
            <Button
                id={id}
                onClick={onClick}
                sx={{
                    bgcolor: theme.palette.globalcolors.submit,
                    '&:hover': {
                        backgroundColor: theme.palette.globalcolors.hoverSubmit
                    },
                    height: '35px'
                }}
            >
                {valueString}
            </Button>
        </Grid>
    );
}
SubmitButton.propTypes = {
    id: propTypes.string,
    valueString: propTypes.string,
    onClick: propTypes.func
};
