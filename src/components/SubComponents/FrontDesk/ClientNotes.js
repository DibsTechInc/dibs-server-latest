import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Button, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import getNotesFromDB from 'actions/studios/users/getNotes';

// ==============================|| CLIENT NOTES ||============================== //

const ClientNotes = (props) => {
    const theme = useTheme();
    const { userid, dibsStudioId } = props;
    const [clientNotes, setClientNotes] = useState('No notes yet');
    const [alreadyRan, setAlreadyRan] = useState(false);
    useEffect(() => {
        const getClientNotes = async () => {
            // setIsLoading(true);
            await getNotesFromDB(userid, dibsStudioId).then((notes) => {
                if (notes.length > 0) {
                    console.log(`notes are: ${JSON.stringify(notes)}`);
                    setClientNotes(notes);
                }
                setAlreadyRan(true);
            });
            // setIsLoading(false);
        };
        if (clientNotes.includes('No notes') && !alreadyRan) getClientNotes();
    }, [userid, dibsStudioId, alreadyRan, clientNotes]);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ fontSize: '1rem' }}>
                    <Typography variant="clientNotes">{clientNotes}</Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                    <Button
                        onClick={(event) => console.log(event)}
                        sx={{
                            px: 2,
                            height: '25px',
                            fontSize: '12px',
                            fontWeight: 200,
                            color: '#fff',
                            bgcolor: theme.palette.packages.medium,
                            '&:hover': {
                                backgroundColor: '#b9a9a9'
                            }
                        }}
                    >
                        Add to Client Notes
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};
ClientNotes.propTypes = {
    userid: PropTypes.string,
    dibsStudioId: PropTypes.number
};

export default ClientNotes;
