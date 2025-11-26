import React, { useEffect, useState } from 'react';
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import { Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { RestaurantKey, setLocalStorageData } from "../utils/general";

const TillCounterWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    background-color: #f8f9fa;

    .till-card {
        background: white;
        border-radius: 8px;
        padding: 32px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        width: 100%;
        max-width: 600px;
    }

    .total-display {
        margin-top: 16px;
        text-align: center;
        
        .amount {
            font-size: 48px;
            font-weight: 300;
            color: #1a73e8;
            line-height: 1;
            margin: 16px 0;
        }
        
        .label {
            font-size: 16px;
            color: #5f6368;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 500;
        }
    }

    .input-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        
        .currency-label {
            width: 80px;
            font-size: 18px;
            font-weight: 500;
            color: #3c4043;
        }
        
        .MuiTextField-root {
            flex-grow: 1;
        }
    }
`;

const initialTillState = {
    hundreds: '',
    fifties: '',
    twenties: '',
    tens: '',
    fives: '',
    ones: '',
    quarters: '',
    dimes: '',
    nickles: '',
    pennies: '',
};

function TillCounter() {
    const [till, setTill] = useState(initialTillState);
    const inputRefs: any[] = [];

    const getTotal = () => {
        return (Number(till.hundreds) * 100) +
            (Number(till.fifties) * 50) +
            (Number(till.twenties) * 20) +
            (Number(till.tens) * 10) +
            (Number(till.fives) * 5) +
            Number(till.ones) +
            (Number(till.quarters) * .25) +
            (Number(till.dimes) * .10) +
            (Number(till.nickles) * .05) +
            (Number(till.pennies) * .01)
    }

    useEffect(() => {
        setLocalStorageData(RestaurantKey, '');
    }, []);

    const handleKeyPress = (e: any, index: number) => {
        if (e.key === 'Enter') {
            if (index < inputRefs.length - 1) {
                inputRefs[index + 1].focus();
            }
        }
    }

    const renderInput = (label: string, key: keyof typeof initialTillState, index: number) => (
        <div className="input-row">
            <div className="currency-label">{label}</div>
            <TextField
                inputRef={ref => inputRefs[index] = ref}
                autoComplete={'off'}
                variant="outlined"
                value={till[key]}
                type="number"
                size="small"
                placeholder="0"
                onChange={(e) => setTill({ ...till, [key]: e.target.value })}
                onKeyDown={(e) => handleKeyPress(e, index)}
                fullWidth
                InputProps={{
                    style: { fontSize: 18 }
                }}
            />
        </div>
    );

    return (
        <TillCounterWrapper>
            <div className="till-card">
                <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '16px', color: '#3c4043', fontWeight: 200 }}>
                    Till Counter
                </Typography>

                <Grid container spacing={{ xs: 0, sm: 4 }}>
                    <Grid item xs={12} sm={6}>
                        {renderInput('$100', 'hundreds', 0)}
                        {renderInput('$50', 'fifties', 1)}
                        {renderInput('$20', 'twenties', 2)}
                        {renderInput('$10', 'tens', 3)}
                        {renderInput('$5', 'fives', 4)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {renderInput('$1', 'ones', 5)}
                        {renderInput('25¢', 'quarters', 6)}
                        {renderInput('10¢', 'dimes', 7)}
                        {renderInput('5¢', 'nickles', 8)}
                        {renderInput('1¢', 'pennies', 9)}
                    </Grid>
                </Grid>

                <div className="total-display">
                    <div className="label">Total Amount</div>
                    <div className="amount">${getTotal().toFixed(2)}</div>
                </div>

                <Box display="flex" justifyContent="center" marginTop="16px">
                    <Button
                        variant="contained"
                        onClick={() => setTill(initialTillState)}
                        style={{
                            background: '#1a73e8',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 500,
                            boxShadow: 'none',
                            padding: '8px 32px',
                            fontSize: '16px'
                        }}
                    >
                        Clear Till
                    </Button>
                </Box>
            </div>
        </TillCounterWrapper>
    );
}

export default TillCounter;
