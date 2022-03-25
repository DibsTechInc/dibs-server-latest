import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import Header from './index';

function HideOnScroll(props) {
    const { children } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired
};

export default function HideAppBar(props) {
    const theme = useTheme();
    const { drawerOpenStatus } = props;
    const header = useMemo(
        () => (
            <Toolbar>
                <Header />
            </Toolbar>
        ),
        []
    );
    return (
        <>
            {/* <CssBaseline /> */}
            <HideOnScroll {...props}>
                <AppBar
                    enableColorOnDark
                    position="fixed"
                    color="inherit"
                    elevation={0}
                    sx={{
                        bgcolor: theme.palette.background.default,
                        transition: drawerOpenStatus ? theme.transitions.create('width') : 'none'
                    }}
                >
                    {header}
                    {/* <Toolbar>
                        <Typography variant="h6" component="div">
                            Scroll to Hide App Bar
                        </Typography>
                    </Toolbar> */}
                </AppBar>
            </HideOnScroll>
            {/* <Toolbar />
            <Container>
                <Box sx={{ my: 2 }}>
                    {[...new Array(12)]
                        .map(
                            () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
                        )
                        .join('\n')}
                </Box>
            </Container> */}
        </>
    );
}
