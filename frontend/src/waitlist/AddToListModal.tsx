import React, { useEffect, useState } from 'react';
import {
    DialogTitle,
    DialogContent,
    Button,
    Stepper,
    StepLabel,
    Grid,
    FormControl,
    TextField,
    Step, Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import Dialog  from '@mui/material/Dialog';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import { useAppState } from '../context/App.provider';
import { useWaitlistState } from '../context/Waitlist.provider';

interface AddToListModalProps {
    open: boolean;
    close: () => void;
}

const steps = [
    'Party size',
    'Name',
    'Phone Number',
];

const AddToListModalWrapper = styled.div`
    width: 100%;
`;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const initialState = {
    name: '',
    phoneNumber: '',
    party: '',
}

const buttonStyles = {
    container: {
        background: 'black',
        color: 'white',
        fontSize: '24px',
        minWidth: '150px'
    },
    containerDisabled: {
        background: '#EAEBEB',
        color: 'white',
        fontSize: '24px',
        minWidth: '150px'

    },
};

function AddToListModal(props: AddToListModalProps) {
    const [open, setOpen] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [state, setState] = useState(initialState);
    const { setSnackMsg, setDisplaySnack, loading, setLoading } = useAppState();
    const { setReloadList } = useWaitlistState();

    useEffect(() => {
        setOpen(props.open);
    }, [props.open])

    const handleClose = () => {
        setOpen(false);
        setActiveStep(0);
        setState(initialState);
        props.close();
    }

    const handleNameChange = (e: any) => {
        setState(oldState => ({
            ...oldState,
            name: e.target.value,
        }))
    };
    const handlePartyChange = (e: any) => {
        setState(oldState => ({
            ...oldState,
            party: e.target.value,
        }))
    };

    const handlePhoneChange = (e: any) => {
        setState(oldState => ({
            ...oldState,
            phoneNumber: e.target.value,
        }))
    };

    const handleNext = () => {

        if (activeStep < 2) {
           return setActiveStep(activeStep + 1);
        }
        else {
            setLoading(true);
            // handle submit
            // Simple POST request with a JSON body using fetch
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: state.phoneNumber, name: state.name, partySize: state.party})
            };
            fetch(`${process.env.REACT_APP_BRICK_API}/customers/add`, requestOptions)
                .then(res => res.json())
                .then((r) => {
                    console.log('RRR', r.includes('error-invalid-phone'));
                    if (r.includes('error-invalid-phone')) {
                        setSnackMsg({msg: `Invalid phone number`, severity: 'error' });
                        setDisplaySnack(true);
                    } else if (r.includes('error-saving-user')) {
                        setSnackMsg({msg: `Unable to add to waitlist, please try again`, severity: 'error' });
                        setDisplaySnack(true);
                    } else {
                        console.log('added Customer', r);
                        setSnackMsg({msg: `${state.name} has been added to the waitlist`, severity: 'success'});
                        setDisplaySnack(true);
                        setReloadList(true);
                        handleClose();
                    }
                }).catch((e) => {
                    console.log('caughtttt', e);
            }).finally(() => setLoading(false));
        }

    }

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    }

    const getDisabledState = () => {
        if (loading) return true;
        if (activeStep === 0 && state.party) {
            return false;
        }
        if (activeStep === 1 && state.name) {
            return false;
        }
        if (activeStep === 2 && state.phoneNumber) {
            return false;
        }
        return true
    }

    const getButtonText = () => {
        if (activeStep === 2) {
            return 'Submit';
        }
        return 'Next';
    }

    return (
        <AddToListModalWrapper>
            <Dialog
                fullScreen
                open={open}
                onClose={() => handleClose()}
                TransitionComponent={Transition}
            >
                <DialogTitle>
                    <div
                        className={'modal-action'}
                        style={{ display: 'flex', justifyContent: 'space-between'}}
                    >
                        <div>
                            <Button
                                size='large'
                                variant="contained"
                                onClick={handleClose}
                                style={{
                                    background: 'black',
                                    color: 'white',
                                    fontSize: '24px',
                                    minWidth: '150px'
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                gap: '12px'
                            }}
                        >
                            {activeStep > 0 && (
                                <Button
                                    size='large'
                                    variant="contained"
                                    onClick={handleBack}
                                    style={buttonStyles.container}
                                >
                                    Back
                                </Button>
                            )}

                            <Button
                                size='large'
                                variant="contained"
                                onClick={handleNext}
                                style={getDisabledState() ? buttonStyles.containerDisabled : buttonStyles.container}
                                disabled={getDisabledState()}
                            >
                                {getButtonText()}
                            </Button>
                        </div>
                    </div>
                    <Stepper
                        style={{marginTop: '48px'}}
                        activeStep={activeStep}
                        alternativeLabel
                    >
                        {steps.map((label) => (
                            <Step
                                key={label}
                                sx={{
                                    '& .MuiStepLabel-root .Mui-completed': {
                                        color: 'black', // circle color (COMPLETED)
                                    },
                                    '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel':
                                        {
                                            fontSize: '24px',
                                            color: 'black', // Just text label (COMPLETED)
                                        },
                                    '& .MuiStepLabel-root .Mui-active': {
                                        fontSize: '24px',
                                        color: 'black', // circle color (ACTIVE)
                                    },
                                    '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel':
                                        {
                                            fontSize: '24px',
                                            color: 'grey.600', // Just text label (ACTIVE)
                                        },
                                    '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                                        fill: 'white', // circle's number (ACTIVE)
                                    },
                                    '& .MuiStepLabel-label.Mui-disabled.MuiStepLabel-alternativeLabel':
                                        {
                                            fontSize: '24px',
                                            color: 'grey.300', // Just text label (FUTURE)
                                        },
                                }}
                            >
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} className={'modal-content'}>
                        {activeStep === 0 && (
                            <Grid item xs={12} sm={12} md={8} lg={4}>
                                <Typography
                                    variant="h4"
                                    className={'title'}
                                    style={{marginBottom: '24px', marginTop: '24px'}}
                                >
                                    How many people in your party
                                </Typography>
                                <FormControl fullWidth>
                                    <TextField
                                        required
                                        autoFocus
                                        id="outlined-required"
                                        type="tel"
                                        value={state.party}
                                        onChange={handlePartyChange}
                                        autoComplete={'off'}
                                        inputProps={{style: {fontSize: 24}}} // font size of input text
                                        InputLabelProps={{style: {fontSize: 24}}} // font size of input label
                                    />
                                </FormControl>
                            </Grid>
                        )}
                        {
                            activeStep === 1 && (
                                <Grid item xs={12} sm={12} md={8} lg={4}>
                                    <Typography
                                        variant="h4"
                                        className={'title'}
                                        style={{marginBottom: '24px', marginTop: '24px'}}
                                    >
                                        What's your name?
                                    </Typography>
                                    <FormControl fullWidth>
                                        <TextField
                                            required
                                            autoFocus
                                            id="outlined-required"
                                            name={'name'}
                                            value={state.name}
                                            onChange={handleNameChange}
                                            autoComplete={'off'}
                                            inputProps={{style: {fontSize: 24}}} // font size of input text
                                            InputLabelProps={{style: {fontSize: 24}}} // font size of input label
                                        />
                                    </FormControl>
                                </Grid>
                            )
                        }
                        {
                            activeStep === 2 && (
                                <Grid item xs={12} sm={12} md={8} lg={4}>
                                    <Typography
                                        variant="h4"
                                        className={'title'}
                                        style={{marginBottom: '24px', marginTop: '24px'}}
                                    >
                                        What is your mobile number?
                                    </Typography>
                                    <FormControl fullWidth>
                                        <TextField
                                            required
                                            autoFocus
                                            id="outlined-required"
                                            type={'tel'}
                                            value={state.phoneNumber}
                                            onChange={handlePhoneChange}
                                            autoComplete={'off'}
                                            inputProps={{style: {fontSize: 24}}} // font size of input text
                                            InputLabelProps={{style: {fontSize: 24}}} // font size of input label
                                        />
                                    </FormControl>
                                </Grid>
                            )
                        }
                    </Grid>
                </DialogContent>
            </Dialog>
        </AddToListModalWrapper>

    )
}

export default AddToListModal;
