import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Card, CardContent, Divider } from "@mui/material";
import { hoursWorked } from "./util";
import { gcColors, gcFonts } from "../google_calendar/GoogleCalendar.theme";

const TipCounterWrapper = styled.div`
    min-height: 100vh;
    padding: 24px;
    box-sizing: border-box;
    background-color: ${gcColors.pageBg};
    font-family: ${gcFonts.sans};
    display: flex;
    justify-content: center;
    align-items: flex-start;

    .tip-card {
        width: 100%;
        max-width: 900px;
        border-radius: 12px;
        background-color: ${gcColors.panelBg};
        border: 1px solid ${gcColors.border};
        box-shadow: none;
    }

    .section-title {
        font-family: ${gcFonts.serif};
        color: ${gcColors.textPrimary};
        font-weight: 500;
        margin-bottom: 16px;
    }

    .result-box {
        background-color: ${gcColors.panelBgHover};
        border: 1px solid ${gcColors.borderSubtle};
        padding: 12px 16px;
        border-radius: 8px;
        margin-top: 8px;
    }

    .result-label {
        color: ${gcColors.textSecondary};
        font-size: 14px;
        font-weight: 500;
    }

    .result-value {
        color: ${gcColors.accent};
        font-size: 18px;
        font-weight: 500;
    }

    .MuiDivider-root {
        border-color: ${gcColors.borderSubtle};
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

    .MuiInputLabel-root {
        color: ${gcColors.textSecondary};

        &.Mui-focused {
            color: ${gcColors.accent};
        }
    }

    .MuiSelect-icon {
        color: ${gcColors.textSecondary};
    }
`;

const numberOfEmployees = 15;

const selectMenuProps = {
    PaperProps: {
        sx: {
            backgroundColor: gcColors.panelBgHover,
            color: gcColors.textPrimary,
            border: `1px solid ${gcColors.border}`,
            '& .MuiMenuItem-root.Mui-selected': { backgroundColor: gcColors.eventBg },
            '& .MuiMenuItem-root:hover': { backgroundColor: gcColors.eventBg },
        },
    },
};

interface IndividualEmployeeHours {
    id: number;
    value: number;
}

function TipCounter() {
    const [total, setTotal] = useState('');
    const [frontPercent, setFrontPercent] = useState(80);
    const [backPercent, setBackPercent] = useState(20);
    const [numberFrontStaff, setNumberFrontStaff] = useState('');
    const [numberBackStaff, setNumberBackStaff] = useState('');
    const inputRefs: any[] = [];
    const employeesCount = Array.from({ length: numberOfEmployees }, (_, i) => i + 1);
    const [numberOfFrontEmployees, setNumberOfFrontEmployees] = useState<IndividualEmployeeHours[]>([]);
    const [numberOfBackEmployees, setNumberOfBackEmployees] = useState<IndividualEmployeeHours[]>([]);
    const [totalHoursForFrontEmployees, setTotalHoursForFrontEmployees] = useState(0);
    const [totalHoursForBackEmployees, setTotalHoursForBackEmployees] = useState(0);

    const getEvenSplit = (percent: number, staff: number) => {
        return total && staff ? ((Number(total) * (percent / 100)) / staff).toFixed(2) : Number(0).toFixed(2);
    }

    const getFrontAmount = (hours: number): number => {
        return hours ? ((Number(total) * (frontPercent / 100) / totalHoursForFrontEmployees) * hours) : Number(0);
    }

    const getBackAmount = (hours: number): number => {
        return hours ? ((Number(total) * (backPercent / 100) / totalHoursForBackEmployees) * hours) : Number(0);
    }

    useEffect(() => {
        if (numberFrontStaff) {
            setNumberOfFrontEmployees(Array.from({ length: Number(numberFrontStaff) }, (_, i) => ({ id: i, value: 0, pay: 0 })) as unknown as IndividualEmployeeHours[]);
        }
    }, [numberFrontStaff]);

    useEffect(() => {
        if (numberBackStaff) {
            setNumberOfBackEmployees(Array.from({ length: Number(numberBackStaff) }, (_, i) => ({ id: i, value: 0, pay: 0 })) as unknown as IndividualEmployeeHours[]);
        }
    }, [numberBackStaff]);

    const updateHoursWorkedForIndividualEmployee = (type: string, id: number, value: number) => {
        if (type === 'front') {
            setNumberOfFrontEmployees(prevEmpHours => prevEmpHours.map(empHours =>
                empHours.id === id ? { ...empHours, value: value } : empHours
            ));
        }
        if (type === 'back') {
            setNumberOfBackEmployees(prevEmpHours => prevEmpHours.map(empHours =>
                empHours.id === id ? { ...empHours, value: value } : empHours
            ));
        }
    }

    useEffect(() => {
        setTotalHoursForFrontEmployees(numberOfFrontEmployees.reduce((sum, empHours) => sum + empHours.value, 0));
    }, [numberOfFrontEmployees]);

    useEffect(() => {
        setTotalHoursForBackEmployees(numberOfBackEmployees.reduce((sum, empHours) => sum + empHours.value, 0));
    }, [numberOfBackEmployees]);

    return (
        <TipCounterWrapper>
            <Card className="tip-card">
                <CardContent>
                    <Typography
                        variant="h5"
                        style={{ textAlign: 'center', marginBottom: '24px', color: gcColors.textPrimary, fontFamily: gcFonts.serif, fontWeight: 500, fontSize: '32px' }}
                    >
                        Tip Counter
                    </Typography>

                    {/* TOTAL & CLEAR */}
                    <Grid container spacing={2} alignItems="center" style={{ marginBottom: '32px' }}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                autoComplete={'off'}
                                id="total"
                                label="Total Tips"
                                variant="outlined"
                                value={total}
                                type="number"
                                size="small"
                                onChange={(d) => setTotal(d.target.value.toString())}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => {
                                    setTotal('');
                                    setNumberBackStaff('');
                                    setNumberFrontStaff('');
                                    setNumberOfFrontEmployees([]);
                                    setNumberOfBackEmployees([]);
                                }}
                                style={{
                                    background: gcColors.accent,
                                    color: gcColors.accentText,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    boxShadow: 'none',
                                    borderRadius: '8px',
                                    height: '40px'
                                }}
                            >
                                Clear Tip
                            </Button>
                        </Grid>
                    </Grid>

                    <Divider style={{ marginBottom: '24px' }} />

                    {/* EMPLOYEES SELECTION */}
                    <Grid container spacing={4}>
                        {/* FRONT OF HOUSE */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" className="section-title">Front of House ({frontPercent}%)</Typography>
                            <FormControl fullWidth size="small" style={{ marginBottom: '16px' }}>
                                <InputLabel id="front-employees">Number of Employees</InputLabel>
                                <Select
                                    labelId="front-employees"
                                    id="front-employee-select"
                                    value={numberFrontStaff}
                                    label="Number of Employees"
                                    onChange={(e) => { setNumberFrontStaff(e.target.value) }}
                                    MenuProps={selectMenuProps}
                                >
                                    {employeesCount.map((e) => (
                                        <MenuItem key={e} value={e}>{e}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <div className="result-box">
                                <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: '8px' }}>
                                    <span className="result-label">Total Front Tip:</span>
                                    <span className="result-value">${(Number(total) * (frontPercent / 100)).toFixed(2)}</span>
                                </Grid>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <span className="result-label">Split Evenly:</span>
                                    <span className="result-value">${getEvenSplit(frontPercent, Number(numberFrontStaff))}</span>
                                </Grid>
                            </div>

                            {/* FRONT HOURS INPUTS */}
                            <Box mt={2}>
                                {numberOfFrontEmployees.map((e, i) => (
                                    <Grid container spacing={2} key={i} alignItems="center" style={{ marginBottom: '12px' }}>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Hours</InputLabel>
                                                <Select
                                                    value={numberOfFrontEmployees[i].value}
                                                    label="Hours"
                                                    onChange={(event) => updateHoursWorkedForIndividualEmployee('front', e.id, Number(event.target.value))}
                                                    MenuProps={selectMenuProps}
                                                >
                                                    {hoursWorked.map((h) => (
                                                        <MenuItem key={h.value} value={h.value}>{h.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" style={{ fontWeight: 500, color: gcColors.textPrimary }}>
                                                ${getFrontAmount(e.value).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Box>
                        </Grid>

                        {/* BACK OF HOUSE */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" className="section-title">Back of House ({backPercent}%)</Typography>
                            <FormControl fullWidth size="small" style={{ marginBottom: '16px' }}>
                                <InputLabel id="back-employees">Number of Employees</InputLabel>
                                <Select
                                    labelId="back-employees"
                                    id="back-employee-select"
                                    value={numberBackStaff}
                                    label="Number of Employees"
                                    onChange={(e) => { setNumberBackStaff(e.target.value) }}
                                    MenuProps={selectMenuProps}
                                >
                                    {employeesCount.map((e) => (
                                        <MenuItem key={e} value={e}>{e}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <div className="result-box">
                                <Grid container justifyContent="space-between" alignItems="center" style={{ marginBottom: '8px' }}>
                                    <span className="result-label">Total Back Tip:</span>
                                    <span className="result-value">${(Number(total) * (backPercent / 100)).toFixed(2)}</span>
                                </Grid>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <span className="result-label">Split Evenly:</span>
                                    <span className="result-value">${getEvenSplit(backPercent, Number(numberBackStaff))}</span>
                                </Grid>
                            </div>

                            {/* BACK HOURS INPUTS */}
                            <Box mt={2}>
                                {numberOfBackEmployees.map((e, i) => (
                                    <Grid container spacing={2} key={i} alignItems="center" style={{ marginBottom: '12px' }}>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Hours</InputLabel>
                                                <Select
                                                    value={numberOfBackEmployees[i].value}
                                                    label="Hours"
                                                    onChange={(event) => updateHoursWorkedForIndividualEmployee('back', e.id, Number(event.target.value))}
                                                    MenuProps={selectMenuProps}
                                                >
                                                    {hoursWorked.map((h) => (
                                                        <MenuItem key={h.value} value={h.value}>{h.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" style={{ fontWeight: 500, color: gcColors.textPrimary }}>
                                                ${getBackAmount(e.value).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </TipCounterWrapper>
    )
}

export default TipCounter;
