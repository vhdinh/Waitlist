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
import { gcColors, gcFonts } from "./google_calendar/GoogleCalendar.theme";

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
            PaperProps={{
                sx: {
                    borderRadius: '8px',
                    backgroundColor: gcColors.panelBg,
                    border: `1px solid ${gcColors.border}`,
                    backgroundImage: 'none',
                },
            }}
        >
            <DialogTitle id="alert-dialog-title">
                <Typography
                    variant="inherit"
                    style={{ fontFamily: gcFonts.serif, fontSize: '28px', fontWeight: 500, color: gcColors.textPrimary, marginBottom: '12px' }}
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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: gcColors.textPrimary,
                                backgroundColor: gcColors.panelBgHover,
                                '& fieldset': { borderColor: gcColors.border },
                                '&:hover fieldset': { borderColor: gcColors.accent },
                                '&.Mui-focused fieldset': { borderColor: gcColors.accent },
                            },
                            '& .MuiFormHelperText-root': { color: gcColors.danger },
                        }}
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
                        color: gcColors.textSecondary,
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
                        background: gcColors.accent,
                        color: gcColors.accentText,
                        textTransform: 'none',
                        fontWeight: 500,
                        boxShadow: 'none',
                        borderRadius: '8px',
                    }}
                >
                    Enter
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AdminPasscodeModal;
