import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useWaitlistState } from '../context/Waitlist.provider';
import { Role, useAppState } from '../context/App.provider';

interface ActionColumnProps {
    _id: number;
    name: string;
    party: number;
    notified: boolean;
    notifiedAt?: any;
    phoneNumber: string;
    msg: string;
    location: string;
}

const ActionWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    .action-btn {
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 500;
        padding: 7px 16px;
        cursor: pointer;
        border: none;
        transition: background 0.15s, opacity 0.15s;
        white-space: nowrap;
        &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
    }

    .notify-btn {
        background: transparent;
        color: #e8eaed;
        border: 1px solid #444;
        &:hover:not(:disabled) {
            background: rgba(255,255,255,0.07);
        }
    }

    .seat-btn {
        background: #4caf50;
        color: #fff;
        &:hover:not(:disabled) {
            background: #43a047;
        }
    }

    .remove-btn {
        background: transparent;
        color: #9aa0a6;
        border: 1px solid #444;
        width: 34px;
        height: 34px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        border-radius: 8px;
        &:hover {
            background: rgba(255,255,255,0.07);
            color: #e8eaed;
        }
    }
`;

function ActionColumn(props: ActionColumnProps) {
    const { setReloadList } = useWaitlistState();
    const { setDisplaySnack, setSnackMsg } = useAppState();

    const getInitialNotifiedTimeframe = (): number => {
        const n = Date.now();
        const notified = new Date(props.notifiedAt);
        const lapsed = ((n - notified.getTime()) / 1000) / 60;
        return Math.floor(lapsed);
    };

    const [timeSinceNotified, setTimeSinceNotified] = useState(getInitialNotifiedTimeframe);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (props.notified) {
            interval = setInterval(() => {
                const n = Date.now();
                const notified = new Date(props.notifiedAt);
                const lapsed = ((n - notified.getTime()) / 1000) / 60;
                setTimeSinceNotified(Math.floor(lapsed));
            }, 60000);
        }
        return () => clearInterval(interval);
    }, []);

    const notifyCustomer = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props._id, phoneNumber: props.phoneNumber, name: props.name })
        };
        fetch(`${process.env.REACT_APP_BRICK_API}/${props.location}/customers/${props._id}/notify`, requestOptions)
            .then(res => res.json())
            .then(() => {
                setSnackMsg({ msg: `${props.name} has been notified`, severity: 'success' });
                setDisplaySnack(true);
                setReloadList(true);
            });
    };

    const removeCustomer = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props._id })
        };
        fetch(`${process.env.REACT_APP_BRICK_API}/${props.location}/customers/${props._id}/delete`, requestOptions)
            .then(res => res.json())
            .then(() => {
                setReloadList(true);
            });
    };

    const seatCustomer = () => {
        // handler to be implemented by user
    };

    return (
        <ActionWrapper>
            <button
                className="action-btn notify-btn"
                onClick={notifyCustomer}
                disabled={props.notified}
                title={props.notified ? `Notified ${timeSinceNotified} min ago` : 'Send SMS notification'}
            >
                Notify
            </button>
            <button
                className="action-btn seat-btn"
                onClick={seatCustomer}
            >
                Seat
            </button>
            <button
                className="action-btn remove-btn"
                onClick={removeCustomer}
                title="Remove from waitlist"
            >
                ×
            </button>
        </ActionWrapper>
    );
}

export default ActionColumn;
