import React from 'react';
import styled from '@emotion/styled';
import SmsIcon from '@mui/icons-material/Sms';
import DeleteIcon from '@mui/icons-material/Delete';
import { useWaitlistState } from './context/Waitlist.provider';
import { useAppState } from './context/App.provider';

interface ActionColumnProps {
    _id: number;
    name: string;
    party: number;
    phoneNumber: string;
}

const ActionColumnWrapper = styled.div`
    display: flex;
    gap: 24px;
    .sms {
        color: #1976d2;
        cursor: pointer;
    }
    .delete {
        color: red;
        cursor: pointer;
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
        fetch(`http://localhost:5000/customers/${props._id}/notify`, requestOptions)
            .then(res => res.json())
            .then((r) => {
                setSnackMsg(`${props.name} has been notified`);
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
        fetch(`http://localhost:5000/customers/${props._id}/delete`, requestOptions)
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
                    <SmsIcon
                        className={'sms'}
                        fontSize={'large'}
                        onClick={(e: any) => notifyCustomer()}
                    />
                    <DeleteIcon
                        className={'delete'}
                        fontSize={'large'}
                        onClick={(e: any) => removeCustomer()}
                    />
                </>
            ) : <></>
            }
        </ActionColumnWrapper>
    )
}

export default React.memo(ActionColumn);