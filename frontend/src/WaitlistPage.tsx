import React, { useEffect, useState } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
    FormControl,
    TextField,
    Box,
    AppBar,
    Toolbar,
    Button,
    Container,
    Grid,
    Typography,
    Snackbar, Alert
} from '@mui/material';
import { WaitlistPageWrapper } from './WaitlistPage.style';
import SettingsIcon from '@mui/icons-material/Settings';
import img from './assets/BrickTransparent.png';
import useAutoTimer from './useAutoTimer';
import List from './List';
import { useAppState } from './context/App.provider';

const initialState = {
    name: '',
    phoneNumber: '',
    party: 1,
}

function WaitlistPage() {
    const timer = useAutoTimer(60);
    // const [isAdmin, setIsAdmin] = useState(false);
    const [state, setState] = useState(initialState);
    const [list, setList] = useState([]);
    const [displayFirstScreen, setDisplayFirstScreen] = useState(true);
    const [openAddToListModal, setOpenAddToListModal] = useState(false);

    const { isAdmin, setDisplaySnack, setSnackMsg } = useAppState();

    console.log('----IS ADMIN', isAdmin);

    // useEffect(() => {
    //     if (timer === 0) {
    //         setState(initialState);
    //     }
    // }, [timer])

    const getWaitList = () => {
        // Simple GET request with a JSON body using fetch
        fetch('http://localhost:5000/customers')
            .then(res => res.json())
            .then((r) => {
                setList(r);
            });
    }

    useEffect(() => {
        getWaitList();
    }, [])

    const handleNameChange = (e: any) => {
        setState(oldState => ({
            ...oldState,
            name: e.target.value,
        }))
    };
    const handlePhoneChange = (e: any) => {
        setState(oldState => ({
            ...oldState,
            phoneNumber: e.target.value,
        }))
    };
    const handlePartyChange = (e: any) => {
        setState(oldState => ({
            ...oldState,
            party: e.target.value,
        }))
    };
    const addToWaitlist = () => {

        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: state.phoneNumber, name: state.name, partySize: state.party})
        };
        fetch('http://localhost:5000/customers/add', requestOptions)
            .then(res => res.json())
            .then((r) => {
                console.log('added Customer', r);
                setSnackMsg(`${state.name} has been added to the waitlist`);
                setDisplaySnack(true);
                getWaitList();
            });

        // setList(oldList => [...oldList, state]);
        setState(initialState);
    }

    const handleOnTouch = () => {
        setDisplayFirstScreen(false);
    }

    return (
        <WaitlistPageWrapper>
            {
                timer == 0 ? (
                    <div
                        className={'waiting-screen'}
                        onClick={(e) => handleOnTouch()}
                    >
                        <div className={'ws-content'}>
                            <img src={img} />
                            <Typography variant={'h1'}>
                                Waitlist
                            </Typography>
                            <Typography variant="h5">
                                - Tap anywhere to start -
                            </Typography>
                        </div>
                    </div>
                ) : (
                    <>
                        <Container className={'body-content'}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h1" className={'title'}>Waitlist</Typography>
                                </Grid>
                                {/*<Grid item xs={12} className={'join-waitlist'}>*/}
                                {/*    <Button*/}
                                {/*        size='large'*/}
                                {/*        variant="contained"*/}
                                {/*        onClick={() => setOpenAddToListModal(true)}*/}
                                {/*    >*/}
                                {/*        Join the Waitlist*/}
                                {/*    </Button>*/}
                                {/*</Grid>*/}
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            required
                                            id="outlined-required"
                                            label="Name"
                                            name={'name'}
                                            defaultValue="Name"
                                            value={state.name}
                                            onChange={handleNameChange}
                                            autoComplete={'off'}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            required
                                            id="outlined-required"
                                            label="Phone Number"
                                            type={'tel'}
                                            value={state.phoneNumber}
                                            onChange={handlePhoneChange}
                                            autoComplete={'off'}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            required
                                            id="outlined-required"
                                            label="Party Size"
                                            type="tel"
                                            value={state.party}
                                            onChange={handlePartyChange}
                                            autoComplete={'off'}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <Button
                                            variant="contained"
                                            onClick={addToWaitlist}
                                            disabled={!state.name || !state.phoneNumber && !state.party}
                                        >
                                            Add to waitlist
                                        </Button>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className={'customer-list'}>
                                <List isAdmin={isAdmin} list={list} />
                            </Grid>
                        </Container>
                        <React.Fragment>
                            {/*<AddToListModal open={openAddToListModal} close={() => setOpenAddToListModal(false)} />*/}
                        </React.Fragment>
                    </>
                )
            }
        </WaitlistPageWrapper>
    );
}

export default WaitlistPage;
