import React, { useState, useRef, useEffect } from 'react';
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
import { Role, useAppState } from './context/App.provider';
import { useCalendarState } from "./context/Calendar.provider";
import { RoleKey, setLocalStorageData } from "./utils/general";

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
            PaperProps={{ sx: { borderRadius: '8px' } }}
        >
            <DialogTitle id="alert-dialog-title">
                <Typography
                    variant="inherit"
                    style={{ fontSize: '22px', fontWeight: 400, color: '#3c4043', marginBottom: '12px' }}
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
                            style: { fontSize: 16 },
                            inputMode: 'tel',
                            pattern: "[0-9]*"
                        }}
                        InputLabelProps={{ style: { fontSize: 16 } }}
                        helperText={helperText}
                        size="small"
                    />
                </FormControl>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'flex-end', padding: '16px 24px' }}>
                <Button
                    onClick={() => {
                        setAdminPasscode('');
                        setDisplayAdminDialog(false);
                        setHelperText('');
                    }}
                    style={{
                        color: '#5f6368',
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={(e) => handleSubmit(e)}
                    style={{
                        background: '#1a73e8',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: 'none'
                    }}
                >
                    Enter
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AdminPasscodeModal;
