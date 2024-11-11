import React from 'react';
import brickLogo from './assets/BrickTransparent.png';
import eightLogo from './assets/1988Transparent.png';
// import kumaLogo from './assets/KUMABlackTransparent.png';
import kumaLogo from './assets/KumaCircle.jpg';
import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";

const EntryWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    .restaurant-selector {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: flex-start;
        gap: 48px;
        img {
            width: 300px;
            height: 300px;
            border: 15px solid #E5E5E5;
            //background-color: #E5E5E5;
            border-radius: 36px;
            cursor: pointer;
            padding: 10px;
        }
    }
`;

function Entry() {
    const navigate = useNavigate();

    return (
        <EntryWrapper>
            <h1>SELECT RESTAURANT</h1>
            <div className={'restaurant-selector'}>
                <img src={brickLogo} alt="brickKitchenLoungeLogo" onClick={() => navigate('/brick/waitlist')}/>
                <img src={kumaLogo} alt="kumaLogo" onClick={() => navigate('/kuma/waitlist')}/>
                <img src={eightLogo} alt="1988LoungeLogo" onClick={() => navigate('/eight/waitlist')}/>
            </div>
        </EntryWrapper>
    )
}

export default Entry;
