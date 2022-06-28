import * as React from 'react';
import propTypes from 'prop-types';
import { Grid, Switch, FormGroup, FormControlLabel } from '@mui/material';
import UsesTextField from 'shared/components/TextField';
import { styled, alpha } from '@mui/material/styles';
import { green } from '@mui/material/colors';

const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked.Mui-disabled': {
        color: theme.palette.success.dibsgreen,
        '&:hover': {
            backgroundColor: alpha(green[600], theme.palette.success.successDibsGreen)
        }
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: green[600]
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: green[600]
    }
}));

export default function SetLimitsOnUsage(props) {
    const { setLimitedUse, setNewClientsOnly, setPersonUsageLimit, setCodeUsageLimit } = props;
    const [isLimitedByPerson, setIsLimitedByPerson] = React.useState(false);
    const [isLimitedOverall, setIsLimitedOverall] = React.useState(false);
    const [isLimitedToNewOnly, setIsLimitedToNewOnly] = React.useState(false);
    const [numUsesPerson, setNumUsesPerson] = React.useState('1');
    const [numUsesOverall, setNumUsesOverall] = React.useState('150');
    const handlePersonLimitChange = () => {
        setIsLimitedByPerson(!isLimitedByPerson);
    };
    const handleOverallLimitChange = () => {
        setIsLimitedOverall(!isLimitedOverall);
    };
    const handleNewLimitChange = () => {
        setIsLimitedToNewOnly(!isLimitedToNewOnly);
    };
    const handleTextChange = (event) => {
        setNumUsesPerson(event.target.value);
        setPersonUsageLimit(event.target.value);
    };
    const handleTextOverallChange = (event) => {
        setNumUsesOverall(event.target.value);
        setCodeUsageLimit(event.target.value);
    };
    React.useEffect(() => {
        if (isLimitedByPerson) setLimitedUse(true);
        if (isLimitedOverall) setLimitedUse(true);
        if (isLimitedToNewOnly) setLimitedUse(true);
        if (isLimitedToNewOnly) setNewClientsOnly(true);
        if (!isLimitedToNewOnly) setNewClientsOnly(false);
        if (!isLimitedByPerson) setPersonUsageLimit(null);
        if (!isLimitedOverall) setCodeUsageLimit(null);
        if (!isLimitedByPerson && !isLimitedOverall && !isLimitedToNewOnly) setLimitedUse(false);
    }, [isLimitedByPerson, isLimitedOverall, isLimitedToNewOnly, setCodeUsageLimit, setLimitedUse, setNewClientsOnly, setPersonUsageLimit]);
    const widthNumber = 60;
    return (
        <Grid container>
            <Grid item xs={7} sx={{ mt: 2 }}>
                <FormGroup>
                    <FormControlLabel
                        control={<GreenSwitch checked={isLimitedByPerson} onChange={handlePersonLimitChange} />}
                        label="Limit # of uses per person"
                        sx={{ mb: 1 }}
                    />
                    {isLimitedByPerson && (
                        <Grid item xs={12} sx={{ mt: 2, mb: 5, ml: 1 }}>
                            Total # of Uses per Person:
                            <UsesTextField widthNumber={widthNumber} onChange={handleTextChange} valueString={numUsesPerson} />
                        </Grid>
                    )}
                    <FormControlLabel
                        control={<GreenSwitch checked={isLimitedOverall} onChange={handleOverallLimitChange} />}
                        label="Limit # of uses overall"
                        sx={{ mb: 1 }}
                    />
                    {isLimitedOverall && (
                        <Grid item xs={12} sx={{ mt: 2, mb: 5, ml: 1 }}>
                            Total # of times this promo code can be used:
                            <UsesTextField widthNumber={widthNumber} onChange={handleTextOverallChange} valueString={numUsesOverall} />
                        </Grid>
                    )}
                    <FormControlLabel
                        control={<GreenSwitch checked={isLimitedToNewOnly} onChange={handleNewLimitChange} />}
                        label="Limit to new clients only"
                        sx={{ mb: 1 }}
                    />
                </FormGroup>
            </Grid>
        </Grid>
    );
}
SetLimitsOnUsage.propTypes = {
    setLimitedUse: propTypes.func,
    setNewClientsOnly: propTypes.func,
    setPersonUsageLimit: propTypes.func,
    setCodeUsageLimit: propTypes.func
};
