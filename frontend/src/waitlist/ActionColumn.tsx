import React from 'react';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import DeleteIcon from '@mui/icons-material/Delete';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import { useWaitlistState } from '../context/Waitlist.provider';
import { useAppState } from '../context/App.provider';

interface ActionColumnProps {
    _id: number;
    name: string;
    party: number;
    notified: boolean;
    phoneNumber: string;
    accepted: boolean;
    seated: boolean;
}

const ActionColumnWrapper = styled.div`
    display: flex;
    gap: 8px;
    .sms {
        color: #1976d2;
        cursor: pointer;
        &:disabled {
            cursor: not-allowed;
        }
    }
    .seated {
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

    const seatCustomer = () => {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props._id, seated: true })
        };
        fetch(`${process.env.REACT_APP_BRICK_API}/customers/${props._id}/seated`, requestOptions)
            .then(res => res.json())
            .then((r) => {
                setSnackMsg({ msg: `${props.name} has been seated and removed from the list`, severity: 'success' });
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

    return (
        <ActionColumnWrapper>
            { isAdmin ? (
                <>
                    {
                        !props.notified && (
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
                        )
                    }
                    {
                        props.notified && (
                            <IconButton
                                onClick={(e: any) => seatCustomer()}
                                size={'large'}
                                disabled={props.accepted}
                            >
                                <AirlineSeatReclineNormalIcon
                                    style={{color: `${props.seated ? 'gray' : '#1875D1'}`}}
                                    className={'seated'}
                                    fontSize={'large'}
                                />
                            </IconButton>
                        )
                    }
                    <IconButton
                        onClick={(e: any) => removeCustomer()}
                        size={'large'}
                    >
                        <DeleteIcon
                            className={'delete'}
                            fontSize={'large'}
                        />
                    </IconButton>

                </>
            ) : <></>
            }
        </ActionColumnWrapper>
    )
}

export default React.memo(ActionColumn);