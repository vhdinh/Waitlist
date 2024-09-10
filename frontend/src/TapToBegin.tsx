import React, { useEffect } from 'react';
import brickLogo from './assets/BrickTransparent.png';
import eightLogo from './assets/1988Transparent.png';
import kumaLogo from './assets/KUMABlackTransparent.png';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';

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
            margin-bottom: 25px;
        }
    }
`;

function TapToBegin() {
    let location = useLocation();
    const basePath = location.pathname.split('/');

    const renderLogo = () => {
        if (basePath[1] === 'brick') {
            return brickLogo
        } else if (basePath[1] === 'kuma') {
            return kumaLogo
        } else if (basePath[1] === '1988') {
            return eightLogo
        }
        return '';
    };

    return (
        <TapToBeginWrapper>
            <div className={'ws-content'}>
                <img src={renderLogo()} />
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
