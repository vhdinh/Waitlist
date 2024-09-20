import React, {useRef, useState} from 'react';
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import {Button, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, FormControl, TextField} from "@mui/material";

const TillCounterWrapper = styled.div`
    tfoot > td {
        border-bottom: 1px solid black;
    }
    // tbody > tr > td {
    //     padding: 4px;
    //     fieldset {
    //         top: 0 !important;
    //     }
    // }
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

    return (
        <TillCounterWrapper>
            <Box
                display="flex"
                sx={{marginTop: '15px'}}
                alignItems="center"
            >
                <TableContainer sx={{display: 'flex', justifyContent: 'center'}}>
                    <Table sx={{ border: 1, borderRadius: 20, maxWidth: '300px'}}>
                        <TableHead>
                            <TableCell>Type</TableCell>
                            <TableCell>Count</TableCell>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>$100</TableCell>
                                <TableCell sx={{
                                    padding: '0',
                                    '& fieldset' : {
                                        top: '0'
                                    }
                                }}>
                                    <FormControl>
                                        <TextField
                                            inputRef={ref => inputRefs.push(ref)}
                                            autoComplete={'off'}
                                            id="hundred"
                                            label="Hundreds"
                                            variant="outlined"
                                            value={till.hundreds}
                                            inputProps={{ type: 'number'}}
                                            size={'small'}
                                            hiddenLabel
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                            }}
                                            onChange={(d) => setTill({...till, hundreds: d.target.value})}
                                            onKeyPress= {(e) => {
                                                if (e.key === 'Enter') {
                                                    console.log('Enter key pressed');
                                                    // write your functionality here
                                                    inputRefs[1].focus()
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>$50</TableCell>
                                <TableCell sx={{
                                    padding: '0',
                                    '& fieldset' : {
                                        top: '0'
                                    }
                                }}>
                                    <FormControl>
                                        <TextField
                                            inputRef={ref => inputRefs.push(ref)}
                                            autoComplete={'off'}
                                            id="fifty"
                                            label="Fifties"
                                            variant="outlined"
                                            value={till.fifties}
                                            inputProps={{ type: 'number'}}
                                            size={'small'}
                                            hiddenLabel
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                            }}
                                            onChange={(d) => setTill({...till, fifties: d.target.value})}
                                            onKeyPress= {(e) => {
                                                if (e.key === 'Enter') {
                                                    console.log('Enter key pressed');
                                                    // write your functionality here
                                                    inputRefs[2].focus()
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>$20</TableCell>
                                <TableCell sx={{
                                    padding: '0',
                                    '& fieldset' : {
                                        top: '0'
                                    }
                                }}>
                                    <FormControl>
                                        <TextField
                                            inputRef={ref => inputRefs.push(ref)}
                                            autoComplete={'off'}
                                            id="twenty"
                                            label="Twenties"
                                            variant="outlined"
                                            value={till.twenties}
                                            inputProps={{ type: 'number'}}
                                            size={'small'}
                                            hiddenLabel
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                            }}
                                            onChange={(d) => setTill({...till, twenties: d.target.value})}
                                            onKeyPress= {(e) => {
                                                if (e.key === 'Enter') {
                                                    console.log('Enter key pressed');
                                                    // write your functionality here
                                                    inputRefs[3].focus()
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>$10</TableCell>
                                <TableCell sx={{
                                    padding: '0',
                                    '& fieldset' : {
                                        top: '0'
                                    }
                                }}>
                                    <FormControl>
                                        <TextField
                                            inputRef={ref => inputRefs.push(ref)}
                                            autoComplete={'off'}
                                            id="ten"
                                            label="Tens"
                                            variant="outlined"
                                            value={till.tens}
                                            inputProps={{ type: 'number'}}
                                            size={'small'}
                                            hiddenLabel
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                            }}
                                            onChange={(d) => setTill({...till, tens: d.target.value})}
                                            onKeyPress= {(e) => {
                                                if (e.key === 'Enter') {
                                                    console.log('Enter key pressed');
                                                    // write your functionality here
                                                    inputRefs[4].focus()
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>$5</TableCell>
                                <TableCell sx={{
                                    padding: '0',
                                    '& fieldset' : {
                                        top: '0'
                                    }
                                }}>
                                    <FormControl>
                                        <TextField
                                            inputRef={ref => inputRefs.push(ref)}
                                            autoComplete={'off'}
                                            id="five"
                                            label="Fives"
                                            variant="outlined"
                                            value={till.fives}
                                            inputProps={{ type: 'number'}}
                                            size={'small'}
                                            hiddenLabel
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                            }}
                                            onChange={(d) => setTill({...till, fives: d.target.value})}
                                            onKeyPress= {(e) => {
                                                if (e.key === 'Enter') {
                                                    console.log('Enter key pressed');
                                                    // write your functionality here
                                                    inputRefs[5].focus()
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>$1</TableCell>
                                <TableCell sx={{
                                    padding: '0',
                                    '& fieldset' : {
                                        top: '0'
                                    }
                                }}>
                                    <FormControl>
                                        <TextField
                                            inputRef={ref => inputRefs.push(ref)}
                                            autoComplete={'off'}
                                            id="one"
                                            label="Ones"
                                            variant="outlined"
                                            value={till.ones}
                                            inputProps={{ type: 'number'}}
                                            size={'small'}
                                            hiddenLabel
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                            }}
                                            onChange={(d) => setTill({...till, ones: d.target.value})}
                                            onKeyPress= {(e) => {
                                                if (e.key === 'Enter') {
                                                    console.log('Enter key pressed');
                                                    // write your functionality here
                                                    inputRefs[6].focus()
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quarters</TableCell>
                                <TableCell sx={{
                                    padding: '0',
                                    '& fieldset' : {
                                        top: '0'
                                    }
                                }}>
                                    <FormControl>
                                        <TextField
                                            inputRef={ref => inputRefs.push(ref)}
                                            autoComplete={'off'}
                                            id="quarters"
                                            label="Quarters"
                                            variant="outlined"
                                            value={till.quarters}
                                            inputProps={{ type: 'number'}}
                                            size={'small'}
                                            hiddenLabel
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                            }}
                                            onChange={(d) => setTill({...till, quarters: d.target.value})}
                                            onKeyPress= {(e) => {
                                                if (e.key === 'Enter') {
                                                    console.log('Enter key pressed');
                                                    // write your functionality here
                                                    inputRefs[7].focus()
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Dimes</TableCell>
                                <TableCell sx={{
                                    padding: '0',
                                    '& fieldset' : {
                                        top: '0'
                                    }
                                }}>
                                    <FormControl>
                                        <TextField
                                            inputRef={ref => inputRefs.push(ref)}
                                            autoComplete={'off'}
                                            id="dime"
                                            label="Dimes"
                                            variant="outlined"
                                            value={till.dimes}
                                            inputProps={{ type: 'number'}}
                                            size={'small'}
                                            hiddenLabel
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                            }}
                                            onChange={(d) => setTill({...till, dimes: d.target.value})}
                                            onKeyPress= {(e) => {
                                                if (e.key === 'Enter') {
                                                    console.log('Enter key pressed');
                                                    // write your functionality here
                                                    inputRefs[8].focus()
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Nickles</TableCell>
                                <TableCell sx={{
                                    padding: '0',
                                    '& fieldset' : {
                                        top: '0'
                                    }
                                }}>
                                    <FormControl>
                                        <TextField
                                            inputRef={ref => inputRefs.push(ref)}
                                            autoComplete={'off'}
                                            id="nickle"
                                            label="Nickles"
                                            variant="outlined"
                                            value={till.nickles}
                                            inputProps={{ type: 'number'}}
                                            size={'small'}
                                            hiddenLabel
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                            }}
                                            onChange={(d) => setTill({...till, nickles: d.target.value})}
                                            onKeyPress= {(e) => {
                                                if (e.key === 'Enter') {
                                                    console.log('Enter key pressed');
                                                    // write your functionality here
                                                    inputRefs[9].focus()
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Pennies</TableCell>
                                <TableCell sx={{
                                    padding: '0',
                                    '& fieldset' : {
                                        top: '0'
                                    }
                                }}>
                                    <FormControl>
                                        <TextField
                                            inputRef={ref => inputRefs.push(ref)}
                                            autoComplete={'off'}
                                            id="penny"
                                            label="Pennies"
                                            variant="outlined"
                                            value={till.pennies}
                                            inputProps={{ type: 'number'}}
                                            size={'small'}
                                            hiddenLabel
                                            sx={{
                                                '& legend': { display: 'none' },
                                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                            }}
                                            onChange={(d) => setTill({...till, pennies: d.target.value})}/>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableCell sx={{fontWeight: 'bold', fontSize: '24px'}}>Total</TableCell>
                            <TableCell sx={{fontWeight: 'bold', fontSize: '24px'}}>${getTotal().toFixed(2)}</TableCell>
                        </TableFooter>
                    </Table>
                    <div>
                        <Button variant="outlined" sx={{marginLeft: '10px'}} onClick={() => setTill(initialTillState)}>Clear Till</Button>
                    </div>
                </TableContainer>
            </Box>
        </TillCounterWrapper>
    );
}
export default TillCounter;