import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Box, Card, CardHeader, CardActions, Button, Grid, Typography, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import getNotesFromDB from 'actions/studios/users/getNotes';

// ==============================|| CLIENT NOTES ||============================== //

const ClientNotes = (props) => {
    const theme = useTheme();
    console.log(`props are: ${JSON.stringify(props)}`);
    const { userid, dibsStudioId, firstname } = props;
    console.log(`firstname is: ${firstname}`);
    const [firstnameState, setFirstnameState] = useState(firstname);
    const [clientNotes, setClientNotes] = useState('No notes yet');
    const [alreadyRan, setAlreadyRan] = useState(false);
    useEffect(() => {
        const getClientNotes = async () => {
            // setIsLoading(true);
            console.log(`getting client notes: userid: ${userid}, dibsStudioId: ${dibsStudioId} firstname: ${firstname}`);
            await getNotesFromDB(userid, dibsStudioId).then((notes) => {
                if (notes.length > 0) {
                    console.log(`notes are: ${JSON.stringify(notes)}`);
                    setClientNotes(notes);
                }
                setAlreadyRan(true);
            });
            // setIsLoading(false);
        };
        console.log(`clientNotes is: ${clientNotes}`);
        console.log(`clientNotes.includes: ${clientNotes.includes('No notes yet')}`);
        console.log(`alreadyRan: ${alreadyRan}`);
        if (clientNotes.includes('No notes') && !alreadyRan) getClientNotes();
    }, [userid, dibsStudioId, alreadyRan, clientNotes, firstname, firstnameState]);
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
    dibsStudioId: PropTypes.number,
    firstname: PropTypes.string
};

export default ClientNotes;
