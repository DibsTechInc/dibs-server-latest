import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import { Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ==============================|| MODAL EDITOR ||============================== //

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    border: '2px solid #d3e2d5',
    boxShadow: 24,
    p: 3,
    borderRadius: '6px'
};

export default function ConfirmatonModal({ openStatus, confirmationQuestion, setDidConfirm }) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    React.useEffect(() => {
        if (openStatus) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [openStatus]);
    const handleClose = () => {
        setOpen(false);
    };
    const handleYes = () => {
        handleClose();
        setDidConfirm(true);
    };
    const handleCancel = () => {
        handleClose();
        setDidConfirm(false);
    };
    return (
        <div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Fade in={open}>
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid item xs={12}>
                                <Typography variant="h4" sx={{ color: theme.palette.error.main }}>
                                    {confirmationQuestion}
                                </Typography>
                            </Grid>
                            <Grid container spacing={2} sx={{ mt: 2, ml: 0.1 }}>
                                <Grid item>
                                    <Button
                                        onClick={handleCancel}
                                        sx={{
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
                                        onClick={handleYes}
                                        sx={{
                                            bgcolor: theme.palette.globalcolors.submit,
                                            '&:hover': {
                                                backgroundColor: theme.palette.globalcolors.hoverSubmit
                                            }
                                        }}
                                    >
                                        Yes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Fade>
                </Box>
            </Modal>
        </div>
    );
}
ConfirmatonModal.propTypes = {
    openStatus: PropTypes.bool,
    confirmationQuestion: PropTypes.string,
    setDidConfirm: PropTypes.func
};
