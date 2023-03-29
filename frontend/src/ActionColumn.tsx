import React from 'react';
import styled from '@emotion/styled';
import SmsIcon from '@mui/icons-material/Sms';
import DeleteIcon from '@mui/icons-material/Delete';

interface ActionColumnProps {
    id: number;
    name: string;
    party: number;
    phoneNumber: string;
}

const ActionColumnWrapper = styled.div`
    display: flex;
    gap: 24px;
    .sms {
        color: #1976d2;
    }
    .delete {
        color: red;
    }
`;

function ActionColumn(props: ActionColumnProps) {

    console.log('ACTION COLUMN', props);

    const notifyCustomer = (phoneNumber: string, name: string) => {

        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: phoneNumber, name: name })
        };
        fetch('http://localhost:5000/notify', requestOptions)
            .then(res => res.json())
            .then((r) => {
                console.log('OHHHVu', r);
                // setSnackMsg(`${name} has been notified`);
                // setDisplaySnack(true);
                // setList(list.filter((l) => l.phoneNumber !== phoneNumber));
            });
    };

    const removeCustomer = (phoneNumber: string) => {
        // setList(list.filter((l) => l.phoneNumber !== phoneNumber));
    }


    return (
        <ActionColumnWrapper>
            <SmsIcon
                className={'sms'}
                fontSize={'large'}
                onClick={(e: any) => notifyCustomer(props.phoneNumber, props.name)}
            />
            <DeleteIcon
                className={'delete'}
                fontSize={'large'}
                onClick={(e: any) => removeCustomer(props.phoneNumber)}
            />
        </ActionColumnWrapper>
    )
}

export default React.memo(ActionColumn);