import { Button, FormControl, LinearProgress, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { GoogleCalendarEventType } from "./GoogleCalendar.type";
import { getTodayTimeMapping, getValidEndTimeSlots, TimeSlot } from "../calendar/util";
import { useCalendarState } from "../context/Calendar.provider";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { formatISO } from "date-fns";
import { useAppState } from "../context/App.provider";
import { gcColors } from "./GoogleCalendar.theme";
import { GCFormWrapper } from "./GCFormWrapper";

interface GoogleCalendarEditBookingProps {
    event: GoogleCalendarEventType;
    setHandleItemEditing: (isEditing: boolean) => void;
    location: string;
}

function GoogleCalendarEditBooking(props: GoogleCalendarEditBookingProps) {
    const { selectedDate, setIsEditing, isLoading, setIsLoading, setGCBookingData, setReloadCalendar, gcBookingData, setDisplayAddNewBooking } = useCalendarState();
    const { setSnackMsg, setDisplaySnack } = useAppState();

    const phoneNumberHelperText = 'Ex: 206-123-4567'
    const descriptionHelperText = 'Ex: Highchair - VD';
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
    const [tempEditBookingData, setTempEditBookingData] = useState(
        {
            ...gcBookingData,
            firstName: props.event.summary?.split(' ').slice(1, -1).join(' '),
            phoneNumber: props.event.description?.split('\n').shift(),
            partySize: props.event.summary?.split(' ').pop()!.replace(/\D/g, ''),
            note: props.event.description?.split('\n').slice(1).join('\n') || '',
        });
    const memoizedGetTodayTimeMapping = useMemo((): TimeSlot[] =>
        getTodayTimeMapping(selectedDate),
        [selectedDate]
    );

    const getLocationName = (location: string) => {
        if (location === 'brick') {
            return 'Brick'
        } else if (location === 'ocha') {
            return 'Ocha'
        } else if (location === 'kuma') {
            return 'Kuma'
        } else {
            return '1988'
        }
    }

    const handleChange = (e: any) => {
        if (e.target.name === 'phoneNumber') {
            const regex = /^[0-9\.\-\/\(\)\+\\\ ]+$/;
            const validPhoneNumber = e.target.value.match(regex) || !e.target.value;
            if (!validPhoneNumber) return;
        }

        setTempEditBookingData((oldState) => ({
            ...oldState,
            [e.target.name]: e.target.name === 'partySize' ? Number(e.target.value) || '' : e.target.value,
        }))
        // MAP back to google calendar
        const locationString = getLocationName(props.location);
        const summary = `${locationString}: ${e.target.name === 'firstName' ? e.target.value : tempEditBookingData.firstName} (${e.target.name === 'partySize' ? e.target.value : tempEditBookingData.partySize})`
        const description = `${e.target.name === 'phoneNumber' ? e.target.value : tempEditBookingData.phoneNumber}\n${e.target.name === 'note' ? e.target.value : tempEditBookingData.note}`

        setGCBookingData((oldState) => ({
            ...oldState,
            [e.target.name]: e.target.name === 'partySize' ? Number(e.target.value) || '' : e.target.value,
            summary,
            description,
            start: {
                dateTime: formatISO(new Date(tempEditBookingData.startTime || 0)),
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: formatISO(new Date(tempEditBookingData.endTime || 0)),
                timeZone: 'America/Los_Angeles',
            },
        }))
    };

    const handleSelectChange = (e: any) => {
        if (e.target.name === 'startTime') {
            setGCBookingData((oldState) => ({
                ...oldState,
                startTime: e.target.value,
                start: {
                    dateTime: formatISO(new Date(e.target.value)),
                    timeZone: 'America/Los_Angeles',
                },
            }))
        } else if (e.target.name === 'endTime') {
            setGCBookingData((oldState) => ({
                ...oldState,
                endTime: e.target.value,
                end: {
                    dateTime: formatISO(new Date(e.target.value)),
                    timeZone: 'America/Los_Angeles',
                },
            }))
        }
        setTempEditBookingData((oldState) => ({
            ...oldState,
            [`${e.target.name}`]: e.target.value,
        }))
    }

    const updateGoogleCalendarEvent = () => {
        let restaurantText;
        if (props.location === 'brick') restaurantText = 'info@thebrickrenton.com';
        if (props.location === 'kuma' || props.location === '1988') restaurantText = 'info@kumageorgetown.com';
        if (props.location === 'ocha') restaurantText = 'info@ochakitchenbar.com';
        if (Number(gcBookingData.partySize) > 10 && props.location !== 'ocha') {
            setSnackMsg({ msg: `Party larger than 10 people needs to email ${restaurantText} for reservation`, severity: 'error' });
            setDisplaySnack(true);
            return;
        } else if (Number(gcBookingData.partySize) > 19 && props.location === 'ocha') {
            setSnackMsg({ msg: `Party larger than 20 people needs to email ${restaurantText} for reservation`, severity: 'error' });
            setDisplaySnack(true);
            return;
        }

        setIsLoading(true);
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gcBookingData)
        };
        let path = '';
        if (props.location === 'brick') {
            path = `${process.env.REACT_APP_BRICK_API}/google-calendar-brick/update-event`;
        } else if (props.location === 'ocha') {
            path = `${process.env.REACT_APP_BRICK_API}/google-calendar-ocha/update-event`;
        } else {
            path = `${process.env.REACT_APP_BRICK_API}/google-calendar/update-event`;
        }
        fetch(path, requestOptions)
            .then(res => res.json())
            .then((r) => {
                setReloadCalendar(true);
                props.setHandleItemEditing(false);
            }).finally(() => {
                setIsLoading(false);
                setIsEditing(false);
            });
    }

    return (
        <GCFormWrapper variant="edit">
            {isLoading && <LinearProgress sx={{ backgroundColor: gcColors.eventBg, '& .MuiLinearProgress-bar': { backgroundColor: gcColors.accent } }} />}

            <div className="row">
                <div className="field-container">
                    <Typography className="input-label">First Name</Typography>
                    <TextField
                        variant="outlined"
                        name="firstName"
                        fullWidth
                        autoComplete="off"
                        disabled={isLoading}
                        value={tempEditBookingData.firstName}
                        onChange={handleChange}
                        size="small"
                    />
                </div>
                <div className="field-container">
                    <Typography className="input-label">Party Size</Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={tempEditBookingData.partySize}
                        name="partySize"
                        type="tel"
                        disabled={isLoading}
                        onChange={handleChange}
                        autoComplete="off"
                        size="small"
                    />
                </div>
            </div>

            <div className="row">
                <div className="field-container">
                    <Typography className="input-label">Start Time</Typography>
                    <FormControl fullWidth size="small">
                        <Select
                            id="start"
                            value={tempEditBookingData.startTime}
                            name="startTime"
                            disabled={isLoading}
                            onChange={handleSelectChange}
                            MenuProps={selectMenuProps}
                        >
                            {memoizedGetTodayTimeMapping.map((t: TimeSlot) => (
                                <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="field-container">
                    <Typography className="input-label">End Time</Typography>
                    <FormControl fullWidth size="small">
                        <Select
                            id="end"
                            value={tempEditBookingData.endTime}
                            name="endTime"
                            disabled={isLoading}
                            onChange={handleSelectChange}
                            MenuProps={selectMenuProps}
                        >
                            {getValidEndTimeSlots(tempEditBookingData.startTime, memoizedGetTodayTimeMapping)
                                .map((t) => (
                                    <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className="row">
                <div className="field-container">
                    <Typography className="input-label">Phone Number</Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={tempEditBookingData.phoneNumber}
                        name="phoneNumber"
                        autoComplete="off"
                        disabled={isLoading}
                        onChange={handleChange}
                        helperText={phoneNumberHelperText}
                        FormHelperTextProps={{ className: 'helper-text' }}
                        size="small"
                    />
                </div>
                <div className="field-container">
                    <Typography className="input-label">Description/Initials</Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={tempEditBookingData.note}
                        name="note"
                        multiline
                        disabled={isLoading}
                        helperText={descriptionHelperText}
                        FormHelperTextProps={{ className: 'helper-text' }}
                        onChange={handleChange}
                        autoComplete="off"
                        size="small"
                    />
                </div>
            </div>

            <div className="actions">
                <Button
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    disabled={isLoading}
                    onClick={() => {
                        setIsEditing(false);
                        setDisplayAddNewBooking(false);
                        props.setHandleItemEditing(false);
                    }}
                    style={{ color: gcColors.textPrimary, borderColor: gcColors.border }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={isLoading}
                    onClick={updateGoogleCalendarEvent}
                    style={{ backgroundColor: gcColors.accent, color: gcColors.accentText }}
                >
                    Update
                </Button>
            </div>
        </GCFormWrapper>
    )
};

export default GoogleCalendarEditBooking;
