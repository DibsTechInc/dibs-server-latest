import propTypes from 'prop-types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.secondary.light,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11
    }
}));

export default function InfoIcon({ msg }) {
    return (
        <Grid item>
            <LightTooltip title={msg} placement="right-start">
                <InfoOutlinedIcon color="secondary" />
            </LightTooltip>
        </Grid>
    );
}
InfoIcon.propTypes = {
    msg: propTypes.string.isRequired
};
