import { useState } from 'react';
import { gridSpacing } from 'store/constant';
import { useSelector } from 'store';
// material-ui
import { Button, Grid, TextField, Typography } from '@mui/material';
import CheckPromoCode from 'actions/studios/promocodes/checkPromoCodeExists';
import PromoCodeQuestions from './questionsForPromoCode';

// ==============================|| PROMO CODES ||============================== //

const PromoCodeSearch = () => {
    const [value, setValue] = useState('');
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const [codeAlreadyExists, setCodeAlreadyExists] = useState(false);
    const [checkedExistence, setCheckedExistence] = useState(false);
    const handleChange = (e) => {
        let nospace = e.target.value;
        nospace = nospace.replace(/\s/g, '');
        nospace = nospace.replace(/[^a-z0-9 -]/gi, '');
        nospace = nospace.toUpperCase();
        setValue(nospace);
    };
    const clearCodeName = () => {
        setValue('');
    };
    const handleFirstNext = async () => {
        setCheckedExistence(false);
        setCodeAlreadyExists(false);
        await CheckPromoCode(dibsStudioId, value).then((res) => {
            try {
                const { codeExists } = res;
                if (codeExists) setCodeAlreadyExists(true);
                setCheckedExistence(true);
            } catch (err) {
                console.log(`error checking promo code exists for studioid: ${dibsStudioId}\nerr is: ${err}`);
            }
        });
    };
    return (
        <Grid container spacing={gridSpacing}>
            {checkedExistence && codeAlreadyExists && (
                <Grid item xs={12}>
                    <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                        This code is already in use. Please choose another text string for the promo code.
                    </Typography>
                </Grid>
            )}
            <Grid item xs={12} sx={{ mb: 3 }}>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    value={value}
                    onChange={(e) => handleChange(e)}
                    placeholder="e.g. WINTERTRAVEL23"
                    size="small"
                    sx={{ width: '400px', height: '40px', mr: 2 }}
                />
                {(!checkedExistence || codeAlreadyExists) && (
                    <Button onClick={handleFirstNext} sx={{ width: '30px', height: '35px', mt: 0.3 }}>
                        Next
                    </Button>
                )}
            </Grid>
            {!codeAlreadyExists && checkedExistence && (
                <>
                    <Grid item xs={9.5} sx={{ mt: 1.5 }}>
                        <Typography variant="h5">Change the information below to set the specifications for this promo code.</Typography>
                    </Grid>
                    <Grid item xs={9.5} sx={{ mt: 1 }}>
                        <PromoCodeQuestions codename={value} clearCodeName={clearCodeName} />
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default PromoCodeSearch;
