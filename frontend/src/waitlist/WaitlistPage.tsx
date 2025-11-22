import React, { useEffect, useState } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
    Button,
    Container,
    Grid,
    Typography,
} from '@mui/material';
import { WaitlistPageWrapper } from './WaitlistPage.style';
import useAutoTimer from '../useAutoTimer';
import List from './List';
import { useAppState } from '../context/App.provider';
import TapToBegin from '../TapToBegin';
import AddToListModal from './AddToListModal';
import { useWaitlistState } from '../context/Waitlist.provider';
import { RestaurantKey, setLocalStorageData } from "../utils/general";
import io from "socket.io-client";

interface WaitlistPageProps {
    location: string;
}

// @ts-ignore
const socket = io.connect(`${process.env.REACT_APP_BRICK_API}`);


function WaitlistPage(props: WaitlistPageProps) {
    const timer = useAutoTimer(120); // 120 seconds
    const [list, setList] = useState([]);
    const [timedOut, setTimedOut] = useState(false);

    const { isAdmin, role } = useAppState();
    const { reloadList, setReloadList, openAddToListModal, setOpenAddToListModal } = useWaitlistState();

    useEffect(() => {
        socket.on(`${props.location}_user_replied`, (data: any) => {
            console.log('USER REPLIED', data);
            if (data.message === 'reload') setReloadList(true)
        })
    }, [socket])


    useEffect(() => {
        if (timer === 0) {
            setOpenAddToListModal(false);
            setTimedOut(true);
        }
        // check if we are timed out and if timer has reset
        if (timedOut && timer > 119) {
            getWaitList();
        }
    }, [timer])

    useEffect(() => {
        if (reloadList) {
            getWaitList();
        }
    }, [reloadList])

    const getWaitList = () => {
        // Simple GET request with a JSON body using fetch
        fetch(`${process.env.REACT_APP_BRICK_API}/${props.location}/customers/getCurrent`)
            .then(res => res.json())
            .then((r) => {
                setList(r);
                setTimedOut(false);
                setReloadList(false);
            });
    }

    useEffect(() => {
        // set restaurant
        setLocalStorageData(RestaurantKey, props.location);
        getWaitList();
    }, []);


    return (
        <WaitlistPageWrapper>
            {
                timer == 0 && !isAdmin ? (
                    <TapToBegin />
                ) : (
                    <>
                        <Container className={'body-content'}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h2"
                                        className={'title'}
                                        onClick={() => window.location.reload()}
                                    >
                                        Waitlist
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className={'join-waitlist'}>
                                    <Button
                                        size='large'
                                        variant="contained"
                                        onClick={() => setOpenAddToListModal(true)}
                                    >
                                        Join the Waitlist
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className={'customer-list'}>
                                <List list={list} location={props.location} />
                            </Grid>
                        </Container>
                        <AddToListModal location={props.location} open={openAddToListModal} close={() => setOpenAddToListModal(false)} />
                    </>
                )
            }
        </WaitlistPageWrapper>
    );
}

export default WaitlistPage;
