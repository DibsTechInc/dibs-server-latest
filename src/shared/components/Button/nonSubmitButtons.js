import propTypes from 'prop-types';
import { Grid, Button } from '@mui/material';

export default function nonSubmitButtons(props) {
    const { id, valueString, onClick } = props;
    return (
        <Grid item xs={12}>
            <Button
                id={id}
                onClick={onClick}
                sx={{
                    fontWeight: 400,
                    height: '30px'
                }}
            >
                {valueString}
            </Button>
        </Grid>
    );
}
nonSubmitButtons.propTypes = {
    id: propTypes.string,
    valueString: propTypes.string,
    onClick: propTypes.func
};
