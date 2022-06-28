import * as React from 'react';
import propTypes from 'prop-types';
import { Grid } from '@mui/material';
import ApplicationTextField from 'shared/components/TextField/DropDown';

const applicationOptions = [
    {
        label: 'All Classes',
        value: 'class'
    },
    {
        label: 'All Packages & Memberships',
        value: 'package'
    },
    {
        label: 'All Retail',
        value: 'retail'
    },
    {
        label: 'Universal',
        value: 'universal'
    }
];

export default function SetCanBeAppliedTo(props) {
    const { setApplication, setApplicationValue } = props;
    const [appliesTo, setAppliesTo] = React.useState('universal');
    const widthNumber = 240;
    const handleOptionChange = (e) => {
        setAppliesTo(e.target.value);
        applicationOptions.forEach((option) => {
            if (option.value === e.target.value) {
                setApplication(option.label);
                setApplicationValue(e.target.value);
            }
        });
    };
    return (
        <Grid container>
            <Grid item xs={7} sx={{ mt: 2 }}>
                <ApplicationTextField
                    id="applies-to"
                    valueString={appliesTo}
                    select
                    variant="standard"
                    onChange={handleOptionChange}
                    widthNumber={widthNumber}
                    options={applicationOptions}
                />
            </Grid>
        </Grid>
    );
}
SetCanBeAppliedTo.propTypes = {
    setApplication: propTypes.func,
    setApplicationValue: propTypes.func
};
