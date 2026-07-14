import React, { useEffect, useState } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
    Button,
    Container,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { WaitlistPageWrapper } from './WaitlistPage.style';
import useAutoTimer from '../useAutoTimer';
import List, { Customer } from './List';
import { Role, useAppState } from '../context/App.provider';
import TapToBegin from '../TapToBegin';
import AddToListModal from './AddToListModal';
import WaitlistHistoryModal from './WaitlistHistoryModal';
import { useWaitlistState } from '../context/Waitlist.provider';
import { RestaurantKey, setLocalStorageData } from "../utils/general";
import io from "socket.io-client";

interface WaitlistPageProps {
    location: string;
}

// @ts-ignore
const socket = io.connect(`${process.env.REACT_APP_BRICK_API}`, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
});


function WaitlistPage(props: WaitlistPageProps) {
    const timer = useAutoTimer(120); // 120 seconds
    const [list, setList] = useState([]);
    const [historyList, setHistoryList] = useState<Customer[]>([]);
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    const { isAdmin, role } = useAppState();
    const { reloadList, setReloadList, openAddToListModal, setOpenAddToListModal } = useWaitlistState();

    useEffect(() => {
        const handleUserReplied = (data: any) => {
            console.log('USER REPLIED', data);
            if (data.message === 'reload') setReloadList(true)
        };

        // The server broadcasts are fire-and-forget: if the socket was
        // disconnected (network blip, tab backgrounded, proxy idle timeout)
        // when a broadcast went out, it's lost for good. Resync on every
        // (re)connect so a missed broadcast can't leave the list stale.
        const handleConnect = () => {
            console.log('socket connected:', socket.id);
            getWaitList();
        };
        const handleDisconnect = (reason: string) => {
            console.log('socket disconnected:', reason);
        };

        socket.on(`${props.location}_user_replied`, handleUserReplied);
        socket.on('connect', handleConnect);
        socket.on('reconnect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        return () => {
            socket.off(`${props.location}_user_replied`, handleUserReplied);
            socket.off('connect', handleConnect);
            socket.off('reconnect', handleConnect);
            socket.off('disconnect', handleDisconnect);
        };
    }, [props.location])


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
                const nonDeleted = r.filter((wait: Customer) => !wait.deleted && !wait.seated)
                const history = r.filter((wait: Customer) => wait.deleted || wait.seated)
                setList(nonDeleted);
                setHistoryList(history);
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
                        <div className={'page-content'}>
                            <div className={'page-header'}>
                                <div className={'header-left'}>
                                    <Typography variant="h3" className={'title'}>
                                        Waitlist
                                    </Typography>
                                    <Typography className={'subtitle'}>
                                        {list.length} {list.length === 1 ? 'party' : 'parties'} waiting · Tonight
                                    </Typography>
                                </div>
                                <div className={'header-actions'}>
                                    {role === Role.ADMIN && (
                                        <Tooltip title="View today's seated & removed parties">
                                            <IconButton
                                                className={'history-btn'}
                                                onClick={() => setOpenHistoryModal(true)}
                                            >
                                                <HistoryIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Button
                                        className={'add-party-btn'}
                                        onClick={() => setOpenAddToListModal(true)}
                                        startIcon={<span className={'plus-icon'}>+</span>}
                                    >
                                        Add party
                                    </Button>
                                </div>
                            </div>
                            <div className={'customer-list'}>
                                <List list={list} location={props.location} />
                            </div>
                        </div>
                        <AddToListModal location={props.location} open={openAddToListModal} close={() => setOpenAddToListModal(false)} />
                        <WaitlistHistoryModal list={historyList} open={openHistoryModal} close={() => setOpenHistoryModal(false)} />
                    </>
                )
            }
        </WaitlistPageWrapper>
    );
}

export default WaitlistPage;
