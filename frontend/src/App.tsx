import React, {useEffect} from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Alert, AppBar, Box, Button, Container, IconButton, Snackbar, Toolbar, Typography} from '@mui/material';
import {AppWrapper} from './App.style';
import SettingsIcon from '@mui/icons-material/Settings';
import Tooltip from '@mui/material/Tooltip';
import img from './assets/BrickTransparent.png';
import {Outlet, useNavigate} from "react-router-dom";
import {Role, useAppState} from './context/App.provider';
import AdminPasscodeModal from './AdminPasscodeModal';
import io from 'socket.io-client';
import {useWaitlistState} from './context/Waitlist.provider';
import {useCalendarState} from "./context/Calendar.provider";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// @ts-ignore
const socket = io.connect(`${process.env.REACT_APP_BRICK_API}`);

const pages = [
    {
        label: 'Waitlist',
        url: '/',
        role: [Role.USER, Role.EMPLOYEE, Role.ADMIN]
    },
    {
        label: 'Reservations',
        url: '/reservations',
        role: [Role.USER, Role.EMPLOYEE, Role.ADMIN],
    },
    {
        label: 'Logs (W)',
        url: '/logs-waitlist',
        role: [Role.ADMIN],
    },
    {
        label: 'Logs (R)',
        url: '/logs-reservations',
        role: [Role.ADMIN],
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
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('user_replied', (data: any) => {
            console.log('USER REPLIED', data);
            if (data.message === 'reload') setReloadList(true)
        })
    }, [socket])

    const handleCloseNavMenu = (url: string) => {
        navigate(url);
    };

    const handleCloseUserMenu = () => {
        if (!isAdmin) {
            return setDisplayAdminDialog(true);
        } else {
            setIsAdmin(false);
            setReloadList(true);
            setReloadCalendar(true);
            setRole(Role.USER);
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
                                if (page.role.includes(role)) {
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
                        <Box sx={{ flexGrow: 0 }} style={{display: 'flex', gap: '12px'}}>
                            {
                                role === Role.EMPLOYEE || role === Role.ADMIN ? (
                                    <ManageAccountsIcon className='admin' fontSize={'large'}/>
                                ): <></>
                            }
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleCloseUserMenu} sx={{ p: 0 }}>
                                    <SettingsIcon fontSize={'large'} style={{color: 'black'}}/>
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
