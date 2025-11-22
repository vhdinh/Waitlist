import React from 'react';
import brickLogo from './assets/BrickTransparent.png';
import eightLogo from './assets/1988Transparent.png';
// import kumaLogo from './assets/KUMABlackTransparent.png';
import kumaLogo from './assets/KumaCircle.jpg';
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { RestaurantKey, setLocalStorageData } from "./utils/general";
import { Button } from "@mui/material";

const EntryWrapper = styled.div`
    .restaurant-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin: 24px 0;
        gap: 24px;
        img {
            width: 100px;
            height: 100px;
            border: 10px solid #E5E5E5;
            //background-color: #E5E5E5;
            border-radius: 36px;
            cursor: pointer;
            padding: 10px;
        }
    }
    .misc-wrapper {
        display: flex;
        gap: 16px;
        justify-content: center;
        margin-bottom: 16px;
    }
`;

function Entry() {
    const navigate = useNavigate();

    const setStorageAndNavigate = (restaurant: string, path: string) => {
        setLocalStorageData(RestaurantKey, restaurant);
        navigate(path);
    }

    const navigateTo = (location: string) => {
        navigate(`/${location}`);
    }

    return (
        <EntryWrapper>
            <div className={'restaurant-wrapper'}>
                <img
                    src={brickLogo}
                    alt="brickKitchenLoungeLogo"
                    onClick={() => setStorageAndNavigate('Brick', '/brick/reservations')}
                />
                <img
                    src={kumaLogo}
                    alt="kumaLogo"
                    onClick={() => setStorageAndNavigate('Kuma', '/kuma/reservations')}
                />
                <img
                    src={eightLogo}
                    alt="1988LoungeLogo"
                    onClick={() => setStorageAndNavigate('Eight', '/eight/reservations')}
                />
            </div>
            <div className={'misc-wrapper'}>
                <Button variant="contained" onClick={() => navigateTo('till-counter')}>
                    Count Till
                </Button>
                <Button variant="contained" onClick={() => navigateTo('tip-counter')}>
                    Count Tips
                </Button>
            </div>
        </EntryWrapper>
    )
}

export default Entry;
