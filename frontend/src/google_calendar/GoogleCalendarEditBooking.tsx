import styled from "@emotion/styled";
import { Button, FormControl, LinearProgress, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { GoogleCalendarEventType } from "./GoogleCalendar.type";
import { getTodayTimeMapping, TimeSlot } from "../calendar/util";
import { useCalendarState } from "../context/Calendar.provider";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment/moment";
import { useAppState } from "../context/App.provider";

const GCEditBookingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid #dadce0;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
    margin: 12px 0;

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
        const summary = `${props.location === 'brick' ? 'Brick' : props.location === 'kuma' ? 'Kuma' : '1988'}: ${e.target.name === 'firstName' ? e.target.value : tempEditBookingData.firstName} (${e.target.name === 'partySize' ? e.target.value : tempEditBookingData.partySize})`
        const description = `${e.target.name === 'phoneNumber' ? e.target.value : tempEditBookingData.phoneNumber}\n${e.target.name === 'note' ? e.target.value : tempEditBookingData.note}`

        setGCBookingData((oldState) => ({
            ...oldState,
            [e.target.name]: e.target.name === 'partySize' ? Number(e.target.value) || '' : e.target.value,
            summary,
            description,
            start: {
                dateTime: moment(tempEditBookingData.startTime).format(),
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: moment(tempEditBookingData.endTime).format(),
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
                    dateTime: moment(e.target.value).format(),
                    timeZone: 'America/Los_Angeles',
                },
            }))
        } else if (e.target.name === 'endTime') {
            setGCBookingData((oldState) => ({
                ...oldState,
                endTime: e.target.value,
                end: {
                    dateTime: moment(e.target.value).format(),
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
        if (Number(gcBookingData.partySize) > 10) {
            setSnackMsg({ msg: `Party larger than 10 people needs to email ${props.location === 'brick' ? 'info@thebrickrenton.com' : 'info@kumageorgetown.com'} for reservation`, severity: 'error' });
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
        <GCEditBookingWrapper>
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
                        >
                            {memoizedGetTodayTimeMapping
                                .filter((t) => {
                                    const twoHrsLater = (tempEditBookingData.startTime || 0) + 3600000;
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
                    color="inherit"
                    startIcon={<CloseIcon />}
                    disabled={isLoading}
                    onClick={() => {
                        setIsEditing(false);
                        setDisplayAddNewBooking(false);
                        props.setHandleItemEditing(false);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={isLoading}
                    onClick={updateGoogleCalendarEvent}
                    style={{ backgroundColor: '#1a73e8' }}
                >
                    Update
                </Button>
            </div>
        </GCEditBookingWrapper>
    )
};

export default GoogleCalendarEditBooking;
