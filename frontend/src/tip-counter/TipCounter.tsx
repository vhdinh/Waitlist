import React, {useEffect, useState} from "react";
import styled from "@emotion/styled";
import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import {hoursWorked} from "./util";

const TipCounterWrapper = styled.div`
    margin: 12px;
    .total-tip-clear-btn {
        width: 100%;
    }
`;

const numberOfEmployees = 15;

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

    const getEvenSplit = (percent: number, staff: number)=>  {
        return total && staff ? ((Number(total) * (percent / 100) ) / staff).toFixed(2) : Number(0).toFixed(2);
    }

    const getFrontAmount = (hours: number):number =>  {
        return hours ? ((Number(total) * (frontPercent / 100) / totalHoursForFrontEmployees) * hours) : Number(0);
    }

    const getBackAmount = (hours: number):number =>  {
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
        console.log('-----update-hours', type, id, value);

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
            <Box sx={{marginTop: '15px', width: '100%', display: 'flex', flexDirection: 'column'}}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', justifyContent: 'center'}}>
                    {/* TOTAL */}
                    <Grid container spacing={{ xs: 2 }}>
                        <Grid item xs={6}>
                            <FormControl sx={{ width: '100%' }}>
                                <TextField
                                    inputRef={ref => inputRefs.push(ref)}
                                    autoComplete={'off'}
                                    id="total"
                                    label="Total Tips"
                                    variant="outlined"
                                    value={total}
                                    inputProps={{type: 'number'}}
                                    size={'small'}
                                    // hiddenLabel
                                    sx={{
                                        // maxWidth: '150px',
                                        // '& legend': {display: 'none'},
                                        // '& .MuiInputLabel-shrink': {opacity: 0, transition: "all 0.2s ease-in"},
                                        // '& fieldset': { top: '0' }
                                    }}
                                    onChange={(d) => setTotal(d.target.value.toString())}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            console.log('Enter key pressed');
                                            // write your functionality here
                                            // inputRefs[1].focus()
                                        }
                                    }}
                                />
                            </FormControl>

                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                className={'total-tip-clear-btn'}
                                variant={'outlined'}
                                onClick={() => {
                                    setTotal('');
                                    setNumberBackStaff('');
                                    setNumberFrontStaff('');
                                    setNumberOfFrontEmployees([]);
                                    setNumberOfBackEmployees([]);
                                }}
                            >Clear Tip</Button>

                        </Grid>
                    </Grid>
                    {/* SET NUMBER OF EMPLOYEES */}
                    <Grid container spacing={{ xs: 2 }}>
                        {/* FRONT */}
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="front-employees">Front Employees</InputLabel>
                                <Select
                                    labelId="front-employees"
                                    id="front-employee-select"
                                    value={numberFrontStaff}
                                    label="Front Employees"
                                    size={'small'}
                                    variant={'outlined'}
                                    sx={{
                                        // '& legend': { display: 'none' },
                                        // '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                    }}
                                    onChange={(e) => {setNumberFrontStaff(e.target.value)}}
                                >
                                    {
                                        employeesCount.map((e) => (
                                            <MenuItem key={e} value={e}>{e}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <Grid container spacing={{ xs: 2}} sx={{ height: '48px', marginTop: '0 !important' }}>
                                <Grid item xs={6}>
                                    Front Tip:
                                </Grid>
                                <Grid item xs={6}>
                                    ${(Number(total) * (frontPercent / 100)).toFixed(2)}
                                </Grid>

                            </Grid>
                            <Grid container spacing={{ xs: 2}}>
                                <Grid item xs={6}>
                                    Split Evenly:
                                </Grid>
                                <Grid item xs={6}>
                                    ${getEvenSplit(frontPercent, Number(numberFrontStaff))}
                                </Grid>

                            </Grid>
                        </Grid>
                        {/* BACK */}
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="back-employees">Back Employees</InputLabel>
                                <Select
                                    labelId="back-employees"
                                    id="back-employee-select"
                                    value={numberBackStaff}
                                    label="Back Employees"
                                    size={'small'}
                                    variant={'outlined'}
                                    sx={{
                                        // '& legend': { display: 'none' },
                                        // '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                    }}
                                    onChange={(e) => {setNumberBackStaff(e.target.value)}}
                                >
                                    {
                                        employeesCount.map((e) => (
                                            <MenuItem key={e} value={e}>{e}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <Grid container spacing={{ xs: 2}} sx={{ height: '48px', marginTop: '0 !important' }}>
                                <Grid item xs={6}>
                                    Back Tip:
                                </Grid>
                                <Grid item xs={6}>
                                    ${(Number(total) * (backPercent / 100)).toFixed(2)}
                                </Grid>

                            </Grid>
                            <Grid container spacing={{ xs: 2}}>
                                <Grid item xs={6}>
                                    Split Evenly:
                                </Grid>
                                <Grid item xs={6}>
                                    ${getEvenSplit(backPercent, Number(numberBackStaff))}
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Map number of front employees */}
                    <Grid container spacing={{ xs: 2}}>
                        {/* FRONT   */}
                        <Grid item xs={6}>
                            {
                                numberOfFrontEmployees.map((e, i) => (
                                    <Grid container spacing={{xs: 2}} key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Grid item xs={6} sx={{ marginTop: '12px' }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="front-employees-hours">Front Hours</InputLabel>
                                                <Select
                                                    labelId="front-employees-hours"
                                                    id="front-employee-select-hours"
                                                    value={numberOfFrontEmployees[i].value}
                                                    label="Front Hours"
                                                    size={'small'}
                                                    variant={'outlined'}
                                                    sx={{
                                                        // '& legend': { display: 'none' },
                                                        // '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                                    }}
                                                    onChange={(event) => updateHoursWorkedForIndividualEmployee('front', e.id, Number(event.target.value))}
                                                >
                                                    {
                                                        hoursWorked.map((e) => (
                                                            <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} sx={{ marginTop: '12px' }} >
                                            ${getFrontAmount(e.value).toFixed(2)}
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>
                        {/* BACK   */}
                        <Grid item xs={6}>
                            {
                                numberOfBackEmployees.map((e, i) => (
                                    <Grid container spacing={{xs: 2}} key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Grid item xs={6} sx={{ marginTop: '12px' }}>
                                            <FormControl fullWidth>
                                                <InputLabel id={`back-employees-hours`}>Back Hours</InputLabel>
                                                <Select
                                                    labelId={`back-employees-hours`}
                                                    id={`back-employee-select-hours`}
                                                    value={numberOfBackEmployees[i].value}
                                                    label="Back Hours"
                                                    size={'small'}
                                                    variant={'outlined'}
                                                    sx={{
                                                        // '& legend': { display: 'none' },
                                                        // '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                                    }}
                                                    onChange={(event) => updateHoursWorkedForIndividualEmployee('back', e.id, Number(event.target.value))}
                                                >
                                                    {
                                                        hoursWorked.map((e) => (
                                                            <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} sx={{ marginTop: '12px' }} >
                                            ${getBackAmount(e.value).toFixed(2)}
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </TipCounterWrapper>
    )
}

export default TipCounter;
