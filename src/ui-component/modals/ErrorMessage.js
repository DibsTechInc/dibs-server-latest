import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    border: '3px solid #c96248',
    boxShadow: 24,
    p: 3,
    borderRadius: '6px'
};

export default function ErrorMessage(props) {
    const [open, setOpen] = React.useState(false);
    // const handleOpen = () => setOpen(true);
    const { isOpen, errormsg, errorOptions, setHasError } = props;
    const handleClose = () => setHasError(false);
    React.useEffect(() => {
        if (isOpen) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [isOpen]);
    let msgToShow;
    let secondarymsg;
    const nameofuser = errorOptions.name;
    const email = errorOptions.email;
    if (errormsg === 'email already in use') {
        msgToShow = `This email address is already in use by another client account.`;
        secondarymsg =
            'You can navigate to this account by searching for this email address using the search bar. If this account does not yet exist in your system, you can port this to your studio by creating a new account using this email address.';
    } else if (errorOptions.errorType === 'phone') {
        // phone is the message type
        msgToShow = errorOptions.errorMsg;
        secondarymsg =
            'You can remove the phone number from that account (if the client is in your system) or use a different phone number for this account.';
    }
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={isOpen}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>
                            Error Message: Duplicate Account?
                        </Typography>
                        <Typography sx={{ mt: 2, fontSize: '12px', fontWeight: 300 }}>{msgToShow}</Typography>
                        <Typography sx={{ mt: 3, fontWeight: 200, fontSize: '12px' }}>Name: {nameofuser}</Typography>
                        <Typography sx={{ fontSize: '12px', fontWeight: 200 }}>Email: {email}</Typography>
                        <Typography sx={{ mt: 3, fontWeight: 200, fontSize: '12px', fontStyle: 'italic' }}>{secondarymsg}</Typography>
                        <Button onClick={handleClose} sx={{ mt: 3, width: '50%', height: '30px' }}>
                            Close
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
ErrorMessage.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    errormsg: PropTypes.string,
    errorOptions: PropTypes.object,
    setHasError: PropTypes.func
};
