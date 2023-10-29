import React, {useState, useRef, useEffect} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    TextField,
    Typography
} from '@mui/material';
import {Role, useAppState} from './context/App.provider';
import {useCalendarState} from "./context/Calendar.provider";

function AdminPasscodeModal() {
    const { displayAdminDialog, setDisplayAdminDialog, setIsAdmin, setRole, } = useAppState();
    const { setReloadCalendar } = useCalendarState();
    const [adminPasscode, setAdminPasscode] = useState('');
    const inputElement = useRef<HTMLInputElement>(null);


    const handleChange = (e: any) => {
        setAdminPasscode(e.target.value);
    }
    useEffect(() => {
        inputElement.current?.focus();
    }, []);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (adminPasscode === process.env.REACT_APP_EMPLOYEE_PASSCODE) {
            setRole(Role.EMPLOYEE);
            setIsAdmin(true);
        } else if (adminPasscode === process.env.REACT_APP_ADMIN_PASSCODE) {
            setRole(Role.ADMIN);
            setIsAdmin(true);
            setReloadCalendar(true);
        }
        setAdminPasscode('');
        setDisplayAdminDialog(false);
    }

    const handleKeyPress = (e: any) => {
        if (e.charCode === 13) {
            handleSubmit(e);
        }
    }

    return (
        <Dialog
            open={displayAdminDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableRestoreFocus
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
                        ref={inputElement}
                        required
                        autoFocus
                        id="outlined-required"
                        type="password"
                        value={adminPasscode}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
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
                    onClick={() => {
                        setAdminPasscode('');
                        setDisplayAdminDialog(false);
                    }}
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
