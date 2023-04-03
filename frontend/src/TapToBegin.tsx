import React, { useEffect } from 'react';
import img from './assets/BrickTransparent.png';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';

const TapToBeginWrapper = styled.div`
    background: #F7F7F8;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    .ws-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        img {
            max-width: 250px;
        }
    }
`;

function TapToBegin() {
    return (
        <TapToBeginWrapper>
            <div className={'ws-content'}>
                <img src={img} />
                <Typography variant={'h1'}>
                    Waitlist
                </Typography>
                <Typography variant="h5">
                    - Tap anywhere to start -
                </Typography>
            </div>
        </TapToBeginWrapper>
    );
}

export default TapToBegin;
