import * as React from 'react';
import propTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Grid, Typography } from '@mui/material';
import DiscountTextField from 'shared/components/TextField';

export default function ChooseDiscountAmount(props) {
    const { setAmountToDiscount, setIsPercDiscount } = props;
    const widthString = 120;
    const [amountToShow, setAmountToShow] = React.useState('10%');
    const [amountOff, setAmountOff] = React.useState(10);
    const [percentIsChecked, setPercentIsChecked] = React.useState(true);
    const [amountIsChecked, setAmountIsChecked] = React.useState(false);
    const [sectionTitle, setSectionTitle] = React.useState(`Discount Amount (in ${percentIsChecked ? '%' : '$'})`);
    const handleChange = (event) => {
        setPercentIsChecked(event.target.value === 'percentage');
        setIsPercDiscount(event.target.value === 'percentage');
        setAmountToShow(event.target.value === 'percentage' ? `${amountOff}%` : `$${amountOff}`);
        setAmountIsChecked(event.target.value === 'amount');
        setSectionTitle(`Discount Amount (in ${event.target.value === 'percentage' ? '%' : '$'})`);
    };
    React.useEffect(() => {
        setAmountToDiscount(amountOff);
    }, [amountOff, setAmountToDiscount]);
    const handleDiscountChange = (e) => {
        const newValue = e.target.value;
        const perc = '%';
        const dollar = '$';
        const discStr = String(newValue);
        const discStrNoPerc = discStr.replace(perc, '');
        const discStrNoDollar = discStrNoPerc.replace(dollar, '');
        const newNumber = Number(discStrNoDollar);
        setAmountOff(newNumber);
        setAmountToShow(discStrNoDollar);
        setAmountToDiscount(discStrNoDollar);
    };
    return (
        <Grid container>
            <Grid item xs={12}>
                <FormControl>
                    <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                        <FormControlLabel
                            value="percentage"
                            control={<Radio checked={percentIsChecked} onChange={handleChange} />}
                            label="Percentage"
                        />
                        <FormControlLabel
                            value="amount"
                            control={<Radio checked={amountIsChecked} onChange={handleChange} />}
                            label="Dollar Amount"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6">{sectionTitle}</Typography>
            </Grid>
            <Grid item xs={12} sx={{ mt: 1, ml: 0.2, mb: 1 }}>
                <DiscountTextField onChange={handleDiscountChange} valueString={amountToShow} widthString={widthString} />
            </Grid>
        </Grid>
    );
}
ChooseDiscountAmount.propTypes = {
    setAmountToDiscount: propTypes.func,
    setIsPercDiscount: propTypes.func
};
