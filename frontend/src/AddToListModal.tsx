import React, { useState } from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stepper,
    StepLabel,
    Step, Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import Dialog, { DialogProps } from '@mui/material/Dialog';

interface AddToListModalProps {
    open: boolean;
    close: () => void;
}

const steps = [
    'Party size',
    'Accommodations',
    'Name',
    'Phone Number',
];

const AddToListModalWrapper = styled.div`
    width: 100%;
`


function AddToListModal(props: AddToListModalProps) {
    const [open, setOpen] = React.useState(true);
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

    const handleClose = () => {
        setOpen(false);
        props.close();
    }
    console.log('add to list modal', open);

    return (
        <AddToListModalWrapper>
            <Dialog
                fullWidth={true}
                fullScreen={true}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </DialogTitle>
                <DialogContent>
                    {}
                    COOL BRAH
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </AddToListModalWrapper>

    )
}

export default AddToListModal;
