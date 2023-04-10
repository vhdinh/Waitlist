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

function WaitlistPage() {
    const timer = useAutoTimer(120); // 120 seconds
    const [list, setList] = useState([]);


    const { isAdmin } = useAppState();
    const { reloadList, setReloadList, openAddToListModal, setOpenAddToListModal } = useWaitlistState();

    useEffect(() => {
        if (timer === 0) {
            setOpenAddToListModal(false);
        }
    }, [timer])

    useEffect(() => {
        if (reloadList) {
            getWaitList();
        }
    }, [reloadList])

    const getWaitList = () => {
        // Simple GET request with a JSON body using fetch
        fetch(`${process.env.REACT_APP_BRICK_API}/customers/getCurrent`)
            .then(res => res.json())
            .then((r) => {
                setList(r);
                setReloadList(false);
            });
    }

    useEffect(() => {
        getWaitList();
    }, [])

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
                                    <Typography variant="h1" className={'title'}>Waitlist</Typography>
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
                                <List list={list} />
                            </Grid>
                        </Container>
                        <AddToListModal open={openAddToListModal} close={() => setOpenAddToListModal(false)} />
                    </>
                )
            }
        </WaitlistPageWrapper>
    );
}

export default WaitlistPage;
