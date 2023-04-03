import React, { useEffect, useState } from 'react';
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
    IconButton, Snackbar, Alert,
} from '@mui/material';
import { AppWrapper } from './App.style';
import SettingsIcon from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import img from './assets/BrickTransparent.png';
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useAppState } from './context/App.provider';

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
const settings = ['Admin'];

function App() {
    const { displaySnack, setDisplaySnack, snackMsg, isAdmin, setIsAdmin } = useAppState();
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (url: string) => {
        navigate(url);
    };

    const handleCloseUserMenu = () => {
        setIsAdmin(!isAdmin);
        setAnchorElUser(null);
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
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <SettingsIcon fontSize={'large'} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
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
                autoHideDuration={10000}
                onClose={() => setDisplaySnack(false)}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    {snackMsg}
                </Alert>
            </Snackbar>
        </Box>
    </AppWrapper>
  );
}

export default App;
