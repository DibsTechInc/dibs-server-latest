import propTypes from 'prop-types';
import { Grid, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function NextButton(props) {
    const { id, valueString, handleClick, pos1, pos2 } = props;
    const theme = useTheme();
    return (
        <Grid item xs={12}>
            <Button
                id={id}
                onClick={handleClick(pos1, pos2)}
                sx={{
                    bgcolor: theme.palette.globalcolors.submit,
                    '&:hover': {
                        backgroundColor: theme.palette.globalcolors.hoverSubmit
                    },
                    height: '30px'
                }}
            >
                {valueString}
            </Button>
        </Grid>
    );
}
NextButton.propTypes = {
    id: propTypes.string,
    valueString: propTypes.string,
    handleClick: propTypes.func,
    pos1: propTypes.string,
    pos2: propTypes.string
};
