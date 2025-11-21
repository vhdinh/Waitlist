import {
    Button,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Typography,
    LinearProgress
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { getTodayTimeMapping, TimeSlot } from "../calendar/util";
import { useCalendarState } from "../context/Calendar.provider";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { InitialGCNewBooking } from "../context/GoogleCalendar.provider";
import { useAppState } from "../context/App.provider";

const GCNewBookingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid #dadce0;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
    margin-bottom: 16px;

    .input-label {
        font-size: 14px;
        font-weight: 500;
        color: #3c4043;
        margin-bottom: 4px;
    }

    .helper-text {
        color: #70757a !important;
        font-size: 12px !important;
        margin-left: 0 !important;
        margin-top: 4px !important;
    }

    .row {
        display: flex;
        gap: 16px;
        width: 100%;
    }

    .field-container {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 8px;
    }

    .MuiOutlinedInput-root {
        border-radius: 4px;
        font-size: 14px;
        
        &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #1a73e8;
            border-width: 2px;
        }
    }

    .MuiButton-root {
        text-transform: none;
        font-weight: 500;
        border-radius: 4px;
        box-shadow: none;
        
        &:hover {
            box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
        }
    }
`;

function GoogleCalendarNewBooking({ location }: { location: string }) {
    const {
        selectedDate,
        gcBookingData,
        setGCBookingData,
        isLoading,
        setDisplayAddNewBooking,
        setIsLoading,
        setReloadCalendar,
    } = useCalendarState();
    const { setSnackMsg, setDisplaySnack } = useAppState();

    const descriptionHelperText = 'Ex: Highchair - VD';
    const phoneNumberHelperText = 'Ex: 206-123-4567'
    const memoizedGetTodayTimeMapping = useMemo((): TimeSlot[] =>
        getTodayTimeMapping(selectedDate),
        [selectedDate]
    );

    const handleChange = (e: any) => {
        if (e.target.name === 'phoneNumber') {
            const regex = /^[0-9\.\-\/\(\)\+\\\ ]+$/;
            const validPhoneNumber = e.target.value.match(regex) || !e.target.value;
            if (!validPhoneNumber) return;
        }
        setGCBookingData((oldState) => ({
            ...oldState,
            [e.target.name]: e.target.name === 'partySize' ? Number(e.target.value) || '' : e.target.value,
        }))

        // MAP back to google calendar
        const summary = `${location === 'brick' ? 'Brick' : location === 'kuma' ? 'Kuma' : '1988'}: ${e.target.name === 'firstName' ? e.target.value : gcBookingData.firstName} (${e.target.name === 'partySize' ? e.target.value : gcBookingData.partySize})`
        const description = `${e.target.name === 'phoneNumber' ? e.target.value : gcBookingData.phoneNumber}\n${e.target.name === 'note' ? e.target.value : gcBookingData.note}`

        setGCBookingData((oldState) => ({
            ...oldState,
            summary,
            description,
            start: {
                dateTime: moment(gcBookingData.startTime).format(),
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: moment(gcBookingData.endTime).format(),
                timeZone: 'America/Los_Angeles',
            },
        }))
    };

    const handleSelectChange = (e: any) => {
        setGCBookingData((oldState) => ({
            ...oldState,
            [`${e.target.name}`]: e.target.value,
        }))
    }

    useEffect(() => {
        if (gcBookingData.startTime) {
            const endT = memoizedGetTodayTimeMapping // filter out the values after 2 hrs of start time (7,200,000 ms)
                .find((t) => t.value === ((gcBookingData.startTime || 0) + 7200000));
            if (endT) {
                setGCBookingData((oldState) => ({
                    ...oldState,
                    endTime: endT.value,
                }))
            } else {
                const newEndT = memoizedGetTodayTimeMapping // filter out the values after 2 hrs of start time (7,200,000 ms)
                    .find((t) => t.value === memoizedGetTodayTimeMapping[memoizedGetTodayTimeMapping.length - 1].value);
                setGCBookingData((oldState) => ({
                    ...oldState, //@ts-ignore
                    endTime: newEndT.value,
                }))
            }
        };
    }, [gcBookingData.startTime])

    const validateBookingForm = () => {
        return !gcBookingData.firstName || !gcBookingData.phoneNumber || !gcBookingData.start || !gcBookingData.end || !gcBookingData.partySize || !gcBookingData.note;
    }

    const saveGoogleCalendarEvent = () => {
        if (Number(gcBookingData.partySize) > 10) {
            setSnackMsg({ msg: `Party larger than 10 people needs to email ${location ? 'info@thebrickrenton.com' : 'info@kumageorgetown.com'} for reservation`, severity: 'error' });
            setDisplaySnack(true);
            return;
        }

        setIsLoading(true);
        const requestOption = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gcBookingData)
        }
        let path = '';
        if (location === 'brick') {
            path = `${process.env.REACT_APP_BRICK_API}/google-calendar-brick/add-event`;
        } else {
            path = `${process.env.REACT_APP_BRICK_API}/google-calendar/add-event`;
        }
        fetch(path, requestOption)
            .then(res => res.json())
            .then((r) => {
                setDisplayAddNewBooking(false);
                setReloadCalendar(true);
            }).finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <GCNewBookingWrapper>
            {isLoading && <LinearProgress />}

            <div className="row">
                <div className="field-container">
                    <Typography className="input-label">First Name</Typography>
                    <TextField
                        variant="outlined"
                        name="firstName"
                        fullWidth
                        autoComplete="off"
                        disabled={isLoading}
                        value={gcBookingData.firstName}
                        onChange={handleChange}
                        size="small"
                    />
                </div>
                <div className="field-container">
                    <Typography className="input-label">Party Size</Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={gcBookingData.partySize}
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
                            value={gcBookingData.startTime}
                            name="startTime"
                            disabled={isLoading}
                            onChange={handleSelectChange}
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
                            value={gcBookingData.endTime}
                            name="endTime"
                            disabled={isLoading}
                            onChange={handleSelectChange}
                        >
                            {memoizedGetTodayTimeMapping
                                .filter((t) => {
                                    const twoHrsLater = (gcBookingData.startTime || 0) + 7200000;
                                    if (t.value >= twoHrsLater) {
                                        return t.value >= twoHrsLater;
                                    } else {
                                        return t.label === '11:00 PM'
                                    }
                                })
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
                        value={gcBookingData.phoneNumber}
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
                        value={gcBookingData.note}
                        name="note"
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
                    color="inherit"
                    startIcon={<CloseIcon />}
                    disabled={isLoading}
                    onClick={() => {
                        setGCBookingData(InitialGCNewBooking);
                        setDisplayAddNewBooking(false)
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={validateBookingForm() || isLoading}
                    onClick={saveGoogleCalendarEvent}
                    style={{ backgroundColor: '#1a73e8' }}
                >
                    Save
                </Button>
            </div>
        </GCNewBookingWrapper>
    )
}

export default GoogleCalendarNewBooking;
