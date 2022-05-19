import { useDispatch } from 'store';

// material-ui
import { Button, Grid, Stack, TextField } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import NumberFormat from 'react-number-format';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import { openSnackbar } from 'store/slices/snackbar';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

/**
 * 'Enter your email'
 * yup.string Expected 0 arguments, but got 1 */
const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is reuqired')
});

// ==============================|| FORM VALIDATION - NEW CLIENT ACCOUNT  ||============================== //

const NewClientAccountForm = () => {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: () => {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Submit Success',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} md={9}>
                <Grid container spacing={3}>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            id="first-name"
                            size="small"
                            name="firstname"
                            label="First Name"
                            value={formik.values.firstname}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            id="last-name"
                            size="small"
                            name="lastname"
                            label="Last Name"
                            value={formik.values.lastname}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={7} sx={{ marginTop: '15px' }}>
                        <TextField
                            fullWidth
                            id="email"
                            size="small"
                            name="email"
                            label="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={4} sx={{ marginTop: '15px' }}>
                        <Grid item sx={{ marginTop: '3px' }}>
                            <NumberFormat
                                id="phone2"
                                size="small"
                                label="Phone #"
                                format="+1 (###) ###-####"
                                mask="_"
                                fullWidth
                                customInput={TextField}
                                onChange={formik.handleChange}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Send a Welcome Email" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="flex-start">
                            <AnimateButton>
                                <Button variant="contained" type="submit">
                                    Verify & Submit
                                </Button>
                            </AnimateButton>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

export default NewClientAccountForm;
