import { useState } from 'react';
import propTypes from 'prop-types';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ColorToggleButton(props) {
    const [choice, setChoice] = useState(null);
    const { choices, setDateRange } = props;

    const handleChange = (event, newValue) => {
        setChoice(newValue);
        console.log(`dateRange is being set to: ${newValue}`);
        setDateRange(newValue);
    };

    return (
        <ToggleButtonGroup size="small" color="primary" value={choice} exclusive onChange={handleChange}>
            {choices.map((ch) => (
                <ToggleButton key={ch.value} value={ch.value}>
                    {ch.label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
ColorToggleButton.propTypes = {
    choices: propTypes.array,
    setDateRange: propTypes.func
};
