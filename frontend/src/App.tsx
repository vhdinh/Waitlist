import React, {useEffect, useState} from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Alert, AppBar, Box, Button, Container, IconButton, Snackbar, Toolbar, Typography} from '@mui/material';
import {AppWrapper} from './App.style';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import Tooltip from '@mui/material/Tooltip';

import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Role, useAppState} from './context/App.provider';
import AdminPasscodeModal from './AdminPasscodeModal';
import {useWaitlistState} from './context/Waitlist.provider';
import {useCalendarState} from "./context/Calendar.provider";
import brickLogo from './assets/BrickTransparent.png';
import eightLogo from './assets/1988Transparent.png';
import kumaLogo from './assets/KUMABlackTransparent.png';
import {RestaurantKey, RoleKey, setLocalStorageData} from "./utils/general";

const pages = [
    {
        label: 'Waitlist',
        url: '/brick/waitlist',
        role: [Role.USER, Role.EMPLOYEE, Role.ADMIN],
        restaurant: ['brick'],
    },
    {
        label: 'Reservations',
        url: '/brick/reservations',
        role: [Role.USER, Role.EMPLOYEE, Role.ADMIN],
        restaurant: ['brick'],
    },
    {
        label: 'Logs (W)',
        url: '/brick/logs-waitlist',
        role: [Role.ADMIN],
        restaurant: ['brick'],
    },
    {
        label: 'Logs (R)',
        url: '/brick/logs-reservations',
        role: [Role.ADMIN],
        restaurant: ['brick'],
    },
    // KUMA
    {
        label: 'Waitlist',
        url: '/kuma/waitlist',
        role: [Role.USER, Role.EMPLOYEE, Role.ADMIN],
        restaurant: ['kuma'],
    },
    // {
    //     label: 'Reservations',
    //     url: '/kuma/reservations',
    //     role: [Role.USER, Role.EMPLOYEE, Role.ADMIN],
    //     restaurant: ['kuma'],
    // },
    {
        label: 'Reservations',
        url: '/kuma/reservations',
        role: [Role.USER, Role.EMPLOYEE, Role.ADMIN],
        restaurant: ['kuma'],
    },
    // 1988
    {
        label: 'Waitlist',
        url: '/eight/waitlist',
        role: [Role.USER, Role.EMPLOYEE, Role.ADMIN],
        restaurant: ['eight'],
    },
    // {
    //     label: 'Reservations',
    //     url: '/eight/reservations',
    //     role: [Role.USER, Role.EMPLOYEE, Role.ADMIN],
    //     restaurant: ['eight'],
    // },
    {
        label: 'Reservations',
        url: '/eight/reservations',
        role: [Role.USER, Role.EMPLOYEE, Role.ADMIN],
        restaurant: ['eight'],
    },
    // Tip Calculator
    {
        label: 'Count Till',
        url: '/till-counter',
        role: [Role.ADMIN],
        restaurant: [],
        // restaurant: ['kuma', 'eight', 'brick', 'till-counter', 'tip-counter'],
    },
    {
        label: 'Count Tips',
        url: '/tip-counter',
        role: [Role.ADMIN],
        restaurant: ['kuma', 'eight', 'brick', 'till-counter', 'tip-counter'],
    }
];

function App() {
    const {
        displaySnack,
        setDisplaySnack,
        snackMsg,
        isAdmin,
        setIsAdmin,
        setDisplayAdminDialog,
        role,
        setRole
    } = useAppState();
    const { setReloadList } = useWaitlistState();
    const { setReloadCalendar } = useCalendarState();
    let location = useLocation();
    const basePath = location.pathname.split('/');
    const [url, setUrl] = useState(basePath[1]);
    const navigate = useNavigate();


    useEffect(() => {
        setUrl(basePath[1]);
    }, [basePath])

    const handleCloseNavMenu = (url: string) => {
        navigate(url);
    };

    const handleCloseUserMenu = () => {
        if (role === Role.USER) {
            return setDisplayAdminDialog(true);
        } else {
            setIsAdmin(false);
            setReloadList(true);
            setReloadCalendar(true);
            setLocalStorageData(RoleKey, Role.USER);
            setRole(Role.USER);
        }
    };

    const renderLogo = () => {
        if (basePath[1] === 'brick') {
            return brickLogo
        } else if (basePath[1] === 'kuma') {
            return kumaLogo
        } else if (basePath[1] === 'eight') {
            return eightLogo
        }
        return '';
    };

  return (
    <AppWrapper isAdmin={isAdmin} role={role}>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" className={'app-bar'}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {
                            url === '' ? <></> : url.includes('till-counter') || url.includes('tip-counter') ? (
                                <IconButton>
                                    <HomeIcon
                                        onClick={() => {
                                            setLocalStorageData(RoleKey, Role.USER);
                                            setRole(Role.USER);
                                            setLocalStorageData(RestaurantKey, '');
                                            navigate('/')
                                        }}
                                    />
                                </IconButton>
                                ) : (
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
                                    onClick={() => {
                                        setRole(Role.USER);
                                        setLocalStorageData(RoleKey, '');
                                        setLocalStorageData(RestaurantKey, '');
                                    }}
                                >
                                    <img src={renderLogo()} className={url === 'eight' ? 'eight-eight' : url === 'kuma' ? 'kuma' : ''} />
                                </Typography>
                            )
                        }
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, gap: '18px' }} style={{justifyContent: 'center'}}>
                            {pages.map((page, index) => {
                                if (page.role.includes(role) && page.restaurant.includes(location.pathname.split('/')[1])) {
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
                        {
                            url.includes('brick') || url.includes('kuma') || url.includes('eight') ? (
                                <Box sx={{flexGrow: 0}} style={{display: 'flex', gap: '32px'}}>
                                    <Tooltip title="Refresh Page">
                                        <IconButton onClick={() => window.location.reload()} sx={{p: 0}}>
                                            <RefreshIcon fontSize={'large'} style={{color: 'black'}}/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleCloseUserMenu} sx={{p: 0}}>
                                            <SettingsIcon fontSize={'large'} style={{color: 'black'}}/>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ) : url.includes('till-counter') || url.includes('tip-counter') ? <></> : <h1 className={'select-restaurant'}>SELECT RESTAURANT</h1>
                        }
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
