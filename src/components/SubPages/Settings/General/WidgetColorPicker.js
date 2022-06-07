import { useState } from 'react';
import { useSelector, useDispatch } from 'store';
import { setStudioColorRedux } from 'store/slices/dibsstudio';
import { Grid, Typography, Box, Button, TextField } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

// import files
import ColorPickerWidget from './HexColorPicker';
import UpdateWidgetColor from 'actions/studios/settings/updateWidgetColorSettings';

const WidgetChangeTextField = styled(TextField)({
    '& .MuiInput-underline:before': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:before:hover': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderBottomColor: '#c96248'
    }
});

// ==============================|| STUDIO ADMIN -> SETTINGS -> GENERAL -> WIDGET COLOR PICKER ||============================== //

const WidgetColorPicker = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { studioConfig, config } = useSelector((state) => state.dibsstudio);
    const { color } = studioConfig;
    const { dibsStudioId } = config;
    const [studioColor, setStudioColor] = useState(color);
    const [hasError, setHasError] = useState(false);
    const [hasSuccess, setHasSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    console.log(`studioColor is: ${studioColor}`);
    const [studioColorHex, setStudioColorHex] = useState(`#${studioColor}`);
    const [isEditingWidgetPicker, setIsEditingWidgetPicker] = useState(false);
    const [abilityTypeColor, setAbilityTypeColor] = useState(false);
    const studioMessage = `You can customize your widget by choosing an accent color.`;
    const isValidHex = (color) => {
        let acceptableChars = [];
        for (let i = 0; i < 10; i += 1) acceptableChars.push(String(i));
        acceptableChars = [...acceptableChars, 'a', 'b', 'c', 'd', 'e', 'f'];
        return (
            (color.length === 3 || color.length === 6) &&
            color
                .toLowerCase()
                .split('')
                .reduce((result, char) => result && acceptableChars.includes(char), true)
        );
    };
    const editColor = () => {
        setIsEditingWidgetPicker(!isEditingWidgetPicker);
    };
    const handleCancelColorChange = () => {
        setIsEditingWidgetPicker(false);
        setStudioColorHex(`#${studioColor}`);
        setAbilityTypeColor(false);
        setHasError(false);
        setErrorMessage('');
    };
    const handleHexColorChange = (e) => {
        setStudioColorHex(e.target.value);
    };
    const clickedTypeInColorOrBox = () => {
        setAbilityTypeColor(!abilityTypeColor);
        setIsEditingWidgetPicker(!isEditingWidgetPicker);
        console.log(`typeInColor is: ${abilityTypeColor}`);
    };
    const handleSubmit = async () => {
        console.log(`am submitting color now`);
        console.log(`color being submitted is: ${studioColorHex}`);
        console.log(`need to remove first # from color`);
        const newHex = studioColorHex.replace('#', '');
        const isValid = isValidHex(newHex);
        console.log(`isValid is: ${isValid}`);
        if (!isValid) {
            setHasError(true);
            setErrorMessage(`Your hex color is not valid. Please check the color and try again.`);
            setTimeout(() => {
                setHasError(false);
                setErrorMessage('');
            }, 7000);
            return null;
        }
        const res = await UpdateWidgetColor(dibsStudioId, newHex);
        if (res.msg === 'success') {
            setIsEditingWidgetPicker(false);
            setStudioColorHex(`#${newHex}`);
            setStudioColor(newHex);
            setAbilityTypeColor(false);
            setHasError(false);
            setErrorMessage('');
            dispatch(setStudioColorRedux(newHex));
            setTimeout(() => {
                setHasSuccess(true);
                setSuccessMessage('');
            }, 7000);
        } else {
            setErrorMessage(res.error);
            setHasError(true);
            setTimeout(() => {
                setHasError(false);
                setErrorMessage('');
            }, 7000);
        }
        return null;
    };
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography gutterBottom variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    {studioMessage}
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2.2 }}>
                <Grid container>
                    {hasError && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                                {errorMessage}
                            </Typography>
                        </Grid>
                    )}
                    {hasSuccess && (
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.success.dark }}>
                                {successMessage}
                            </Typography>
                        </Grid>
                    )}
                    <Grid item sx={{ mr: 1.5 }}>
                        <Box
                            onClick={clickedTypeInColorOrBox}
                            sx={{
                                width: 55,
                                height: 20,
                                backgroundColor: studioColorHex,
                                borderRadius: 1
                            }}
                        />
                    </Grid>
                    {abilityTypeColor ? (
                        <WidgetChangeTextField
                            variant="standard"
                            onChange={(e) => handleHexColorChange(e)}
                            // onFocus={() => handleEmailFocus()}
                            sx={{ width: '80px' }}
                            value={studioColorHex}
                        />
                    ) : (
                        <Grid item onClick={clickedTypeInColorOrBox}>
                            {studioColorHex}
                        </Grid>
                    )}
                </Grid>
            </Grid>
            {!isEditingWidgetPicker && (
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <Button onClick={editColor}>Edit</Button>
                    </Grid>
                </Grid>
            )}
            {isEditingWidgetPicker && (
                <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12} sx={{ mb: 2.5 }}>
                        <ColorPickerWidget currentcolor={studioColorHex} colorfunction={setStudioColorHex} />
                    </Grid>
                    <Grid item>
                        <Button
                            onClick={handleCancelColorChange}
                            sx={{
                                // color: '#fff',
                                bgcolor: theme.palette.globalcolors.cancel,
                                '&:hover': {
                                    backgroundColor: theme.palette.globalcolors.hover
                                }
                            }}
                        >
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            disableElevation
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{
                                bgcolor: theme.palette.globalcolors.submit,
                                '&:hover': {
                                    backgroundColor: theme.palette.globalcolors.hoverSubmit
                                }
                            }}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};
export default WidgetColorPicker;
