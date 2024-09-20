import React from 'react';
import brickLogo from './assets/BrickTransparent.png';
import eightLogo from './assets/1988Transparent.png';
import kumaLogo from './assets/KUMABlackTransparent.png';
import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";

const EntryWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: calc(100vh - 64px);
    img {
        max-width: 250px;
        border: 2px dotted;
        cursor: pointer;
        padding: 10px;
    }
`;

function Entry() {
    const navigate = useNavigate();

    return (
        <EntryWrapper>
            <>SELECT RESTAURANT</>
            <img src={brickLogo} alt="brickKitchenLoungeLogo" onClick={() => navigate('/brick/waitlist')}/>
            <img src={kumaLogo} alt="kumaLogo" onClick={() => navigate('/kuma/waitlist')}/>
            <img src={eightLogo} alt="1988LoungeLogo" onClick={() => navigate('/eight/waitlist')}/>
        </EntryWrapper>
    )
}

export default Entry;
