import React, {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import DeleteIcon from '@mui/icons-material/Delete';
import { useWaitlistState } from '../context/Waitlist.provider';
import { useAppState } from '../context/App.provider';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import PhonelinkEraseIcon from '@mui/icons-material/PhonelinkErase';

interface ActionColumnProps {
    _id: number;
    name: string;
    party: number;
    notified: boolean;
    notifiedAt?: any;
    phoneNumber: string;
    msg: string;
}

const ActionColumnWrapper = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    .actions {
        display: flex;
        flex-direction: column;
    }
    .sms {
        color: #1976d2;
        cursor: pointer;
        &:disabled {
            cursor: not-allowed;
        }
    }
    .delete {
        color: black;
        cursor: pointer;
        &:disabled {
            cursor: not-allowed;
        }
    }
    .Mui-disabled svg {
        color: #D5D7D8 !important;
    }
`;

function ActionColumn(props: ActionColumnProps) {
    const { setReloadList } = useWaitlistState();
    const { isAdmin, setDisplaySnack, setSnackMsg } = useAppState();
    const getInitialNotifiedTimeframe = (): number => {
        const n = Date.now();
        const notified = new Date(props.notifiedAt);
        const lapsed = ((n - notified.getTime()) / 1000) / 60;
        return Math.floor(lapsed);
    }

    const [timeSinceNotified, setTimeSinceNotified] = useState(getInitialNotifiedTimeframe);

    const MINUTE_MS =  60000;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (props.notified) {
            interval = setInterval(() => {
                const n = Date.now();
                const notified = new Date(props.notifiedAt);
                const lapsed = ((n - notified.getTime()) / 1000) / 60;
                setTimeSinceNotified(Math.floor(lapsed));
                }, MINUTE_MS);
        }
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, []);

    const notifyCustomer = () => {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props._id, phoneNumber: props.phoneNumber, name: props.name })
        };
        fetch(`${process.env.REACT_APP_BRICK_API}/customers/${props._id}/notify`, requestOptions)
            .then(res => res.json())
            .then((r) => {
                setSnackMsg({ msg: `${props.name} has been notified`, severity: 'success' });
                setDisplaySnack(true);
                setReloadList(true);
            });
    };

    const removeCustomer = () => {
        // setList(list.filter((l) => l.phoneNumber !== phoneNumber));
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props._id })
        };
        fetch(`${process.env.REACT_APP_BRICK_API}/customers/${props._id}/delete`, requestOptions)
            .then(res => res.json())
            .then((r) => {
                console.log('Deleted', r);
                // setSnackMsg(`${name} has been notified`);
                // setDisplaySnack(true);
                // setList(list.filter((l) => l.phoneNumber !== phoneNumber));
                setReloadList(true);
            });
    }

    const renderPhoneIcons = () => {
        if (props.notified && props.msg === '1') return <MobileFriendlyIcon fontSize={'large'} style={{color: '#4caf50', width: '59px'}} />
        if (props.notified && props.msg === '6') return <PhonelinkEraseIcon fontSize={'large'} style={{color: "#dd2c00", width: '59px'}}/>
        return (
            <>
                <IconButton
                    onClick={(e: any) => notifyCustomer()}
                    size={'large'}
                    disabled={props.notified}
                >
                    <SmsIcon
                        style={{color: `${props.notified ? 'gray' : '#1875D1'}`}}
                        className={'sms'}
                        fontSize={'large'}
                    />
                </IconButton>
            </>
        )
    }

    return (
        <ActionColumnWrapper>
            { isAdmin ? (
                <div className={'actions'}>
                    <div>
                        {renderPhoneIcons()}
                        <IconButton
                            onClick={(e: any) => removeCustomer()}
                            size={'large'}
                        >
                            <DeleteIcon
                                className={'delete'}
                                fontSize={'large'}
                            />
                        </IconButton>
                    </div>
                    { props.notified ? (
                        <div>
                            Notified {timeSinceNotified} min ago
                        </div>
                    ) : <></>
                    }
                </div>
            ) : <></>
            }
        </ActionColumnWrapper>
    )
}

export default React.memo(ActionColumn);