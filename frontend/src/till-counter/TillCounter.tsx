import React, { useEffect, useState } from 'react';
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { RestaurantKey, setLocalStorageData } from "../utils/general";
import { gcColors, gcFonts } from "../google_calendar/GoogleCalendar.theme";

const TillCounterWrapper = styled.div`
    height: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    box-sizing: border-box;
    background-color: ${gcColors.pageBg};
    font-family: ${gcFonts.sans};

    .till-card {
        background: ${gcColors.panelBg};
        border: 1px solid ${gcColors.border};
        border-radius: 8px;
        padding: 32px;
        box-shadow: none;
        width: 100%;
        max-width: 600px;
    }

    .section-label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${gcColors.accent};
        margin-bottom: 12px;
    }

    .total-display {
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid ${gcColors.borderSubtle};
        text-align: center;

        .amount {
            font-family: ${gcFonts.serif};
            font-size: 48px;
            font-weight: 500;
            color: ${gcColors.accent};
            line-height: 1;
            margin: 12px 0;
        }

        .label {
            font-size: 12px;
            color: ${gcColors.textSecondary};
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-weight: 600;
        }
    }

    .input-row {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .currency-label {
            width: 64px;
            font-size: 16px;
            font-weight: 500;
            color: ${gcColors.textPrimary};
        }

        .MuiTextField-root {
            flex-grow: 1;
        }

        .MuiOutlinedInput-root {
            color: ${gcColors.textPrimary};
            background-color: ${gcColors.panelBgHover};

            fieldset {
                border-color: ${gcColors.border};
            }

            &:hover fieldset {
                border-color: ${gcColors.accent};
            }

            &.Mui-focused fieldset {
                border-color: ${gcColors.accent};
            }
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
                onFocus={(e) => e.target.select()}
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
                <Typography
                    variant="h5"
                    style={{ textAlign: 'center', marginBottom: '24px', color: gcColors.textPrimary, fontFamily: gcFonts.serif, fontWeight: 500, fontSize: '32px' }}
                >
                    Till Counter
                </Typography>

                <Grid container spacing={{ xs: 0, sm: 4 }}>
                    <Grid item xs={12} sm={6}>
                        <div className="section-label">Bills</div>
                        {renderInput('$100', 'hundreds', 0)}
                        {renderInput('$50', 'fifties', 1)}
                        {renderInput('$20', 'twenties', 2)}
                        {renderInput('$10', 'tens', 3)}
                        {renderInput('$5', 'fives', 4)}
                        {renderInput('$1', 'ones', 5)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div className="section-label">Coins</div>
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
                            background: gcColors.accent,
                            color: gcColors.accentText,
                            textTransform: 'none',
                            fontWeight: 500,
                            boxShadow: 'none',
                            borderRadius: '8px',
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
