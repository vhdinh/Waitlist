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
import {RoleKey, setLocalStorageData} from "./utils/general";

function AdminPasscodeModal() {
    const { displayAdminDialog, setDisplayAdminDialog, setIsAdmin, setRole, } = useAppState();
    const { setReloadCalendar } = useCalendarState();
    const [adminPasscode, setAdminPasscode] = useState('');
    const inputElement = useRef<HTMLInputElement>(null);
    const [helperText, setHelperText] = useState<string>('');

    const handleChange = (e: any) => {
        setAdminPasscode(e.target.value);
        setHelperText('');
    }
    useEffect(() => {
        inputElement.current?.focus();
        setHelperText('');
    }, []);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (adminPasscode === process.env.REACT_APP_EMPLOYEE_PASSCODE) {
            setRole(Role.EMPLOYEE);
            setLocalStorageData(RoleKey, Role.EMPLOYEE);
            setIsAdmin(true);

            setAdminPasscode('');
            setDisplayAdminDialog(false);
        } else if (adminPasscode === process.env.REACT_APP_ADMIN_PASSCODE) {
            setRole(Role.ADMIN);
            setLocalStorageData(RoleKey, Role.ADMIN);
            setIsAdmin(true);
            setReloadCalendar(true);

            setAdminPasscode('');
            setDisplayAdminDialog(false);
        } else {
            setRole(Role.USER);
            setLocalStorageData(RoleKey, Role.USER);
            setAdminPasscode('');
            setHelperText('Invalid Code');
        }
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
                        helperText={helperText}
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
                        setHelperText('');
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
