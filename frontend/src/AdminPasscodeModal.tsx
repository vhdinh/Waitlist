import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, TextField, Typography
} from '@mui/material';
import { useAppState } from './context/App.provider';

function AdminPasscodeModal() {
    const { displayAdminDialog, setDisplayAdminDialog, setIsAdmin } = useAppState();
    const [adminPasscode, setAdminPasscode] = useState('');

    const handleChange = (e: any) => {
        setAdminPasscode(e.target.value);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (adminPasscode === process.env.REACT_APP_ADMIN_PASSCODE) {
            setIsAdmin(true);
        }
        setAdminPasscode('');
        setDisplayAdminDialog(false);
    }

    return (
        <Dialog
            open={displayAdminDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <Typography
                    variant="inherit"
                    style={{marginBottom: '24px', marginTop: '24px', fontSize: '24px'}}
                >
                    Enter admin code
                </Typography>
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <TextField
                        required
                        autoFocus
                        id="outlined-required"
                        type="password"
                        value={adminPasscode}
                        onChange={handleChange}
                        autoComplete={'off'}
                        inputProps={{
                            style: {fontSize: 24},
                            inputMode: 'tel',
                            pattern: "[0-9]*"
                        }} // font size of input text
                        InputLabelProps={{style: {fontSize: 24}}} // font size of input label
                    />
                </FormControl>
            </DialogContent>
            <DialogActions style={{justifyContent: 'space-between'}}>
                <Button
                    size='large'
                    variant="contained"
                    onClick={() => setDisplayAdminDialog(false)}
                    style={{
                        background: 'black',
                        color: 'white',
                        fontSize: '24px',
                        minWidth: '150px'
                    }}
                >
                    Cancel
                </Button>
                <Button
                    size='large'
                    variant="contained"
                    onClick={(e) => handleSubmit(e)}
                    style={{
                        background: 'black',
                        color: 'white',
                        fontSize: '24px',
                        minWidth: '150px'
                    }}
                >
                    Enter
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AdminPasscodeModal;
