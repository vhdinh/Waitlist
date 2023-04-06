import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
    Box,
    AppBar,
    Toolbar,
    Button,
    Container,
    Typography,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import { AppWrapper } from './App.style';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import img from './assets/BrickTransparent.png';
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useAppState } from './context/App.provider';
import AdminPasscodeModal from './AdminPasscodeModal';
import socketClient from 'socket.io-client';

const pages = [
    {
        label: 'Waitlist',
        url: '/waitlist',
        role: []
    },
    {
        label: 'Reservations',
        url: '/reservations',
        role: ['admin'],
    }
];

function App() {
    const {
        displaySnack,
        setDisplaySnack,
        snackMsg,
        isAdmin,
        setIsAdmin,
        setDisplayAdminDialog
    } = useAppState();
    const navigate = useNavigate();

    const socket = socketClient(`${process.env.REACT_APP_BRICK_API}`);

    // socket.on('connection', () => {
    //     console.log(`I'm connected with the back-end`);
    // })

    const handleCloseNavMenu = (url: string) => {
        navigate(url);
    };

    const handleCloseUserMenu = () => {
        if (!isAdmin) {
            return setDisplayAdminDialog(true);
        } else {
            setIsAdmin(false);
        }
    };

  return (
    <AppWrapper>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" className={'app-bar'}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            <img src={img} />
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }} style={{justifyContent: 'center'}}>
                            {pages.map((page, index) => {
                                if (isAdmin) {
                                    return (
                                        <Button
                                            key={index}
                                            onClick={() => handleCloseNavMenu(page.url)}
                                            sx={{ my: 2, color: 'black', display: 'block' }}
                                            size={'large'}
                                        >
                                            {page.label}
                                        </Button>
                                    )
                                }
                            })}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleCloseUserMenu} sx={{ p: 0 }}>
                                    <SettingsIcon fontSize={'large'} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth="xl" id={'body-content'}>
                <Outlet />
            </Container>
            <Snackbar
                className={'snackbar'}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={displaySnack}
                autoHideDuration={5000}
                onClose={() => setDisplaySnack(false)}
            >
                <Alert severity={snackMsg.severity} sx={{ width: '100%' }}>
                    {snackMsg.msg}
                </Alert>
            </Snackbar>
            <AdminPasscodeModal />
        </Box>
    </AppWrapper>
  );
}

export default App;
