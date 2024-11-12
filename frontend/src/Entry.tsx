import React from 'react';
import brickLogo from './assets/BrickTransparent.png';
import eightLogo from './assets/1988Transparent.png';
// import kumaLogo from './assets/KUMABlackTransparent.png';
import kumaLogo from './assets/KumaCircle.jpg';
import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import {RestaurantKey, setLocalStorageData} from "./utils/general";

const EntryWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    margin: 24px 0;
    gap: 24px;
    img {
        width: 175px;
        height: 175px;
        border: 15px solid #E5E5E5;
        //background-color: #E5E5E5;
        border-radius: 36px;
        cursor: pointer;
        padding: 10px;
    }
`;

function Entry() {
    const navigate = useNavigate();

    const setStorageAndNavigate = (restaurant: string, path: string)=> {
        setLocalStorageData(RestaurantKey, restaurant);
        navigate(path);
    }

    return (
        <EntryWrapper>
            <img
                src={brickLogo}
                alt="brickKitchenLoungeLogo"
                onClick={() => setStorageAndNavigate('Brick', '/brick/waitlist')}
            />
            <img
                src={kumaLogo}
                alt="kumaLogo"
                onClick={() => setStorageAndNavigate('Kuma', '/kuma/waitlist')}
            />
            <img
                src={eightLogo}
                alt="1988LoungeLogo"
                onClick={() => setStorageAndNavigate('Eight', '/eight/waitlist')}
           />
        </EntryWrapper>
    )
}

export default Entry;
