// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import CreateInstructor from './createInstructorComp';

// ==============================|| STUDIO ADMIN -> INSTRUCTORS -> ADD NEW ||============================== //

const CreateInstructorPage = () => (
    // eslint-disable-next-line camelcase
    <Grid container direction="column">
        <Grid item xs={7}>
            <Typography gutterBottom variant="h4">
                Add New Instructors
            </Typography>
        </Grid>
        <Grid item xs={7} sx={{ mt: 2 }}>
            <CreateInstructor />
        </Grid>
    </Grid>
);
export default CreateInstructorPage;
