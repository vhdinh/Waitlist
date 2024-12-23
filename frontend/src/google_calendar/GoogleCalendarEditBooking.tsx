import styled from "@emotion/styled";
import {Button, Card, FormControl, LinearProgress, MenuItem, Select, TextField, Typography} from "@mui/material";
import React, {Dispatch, SetStateAction, useMemo, useState} from "react";
import {GoogleCalendarEventType} from "./GoogleCalendar.type";
import {getTodayTimeMapping, TimeSlot} from "../calendar/util";
import {useCalendarState} from "../context/Calendar.provider";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment/moment";

const GCEditBookingWrapper = styled.div`
    .helper-text {
        color: gray !important;
        font-size: 16px !important;
        margin-left: 0 !important;
    }
`

interface GoogleCalendarEditBookingProps {
    event: GoogleCalendarEventType;
    setHandleItemEditing: (isEditing: boolean) => void;
    location: string;
}

function GoogleCalendarEditBooking(props: GoogleCalendarEditBookingProps) {
    const { selectedDate, setIsEditing, isLoading, setIsLoading, setGCBookingData, setReloadCalendar, gcBookingData, setDisplayAddNewBooking } = useCalendarState();
    const phoneNumberHelperText = 'Ex: 206-123-4567'
    const descriptionHelperText = 'Ex: Highchair - VD';
    const [tempEditBookingData, setTempEditBookingData] = useState(
        {
            ...gcBookingData,
            firstName: props.event.summary?.split(' ').slice(1,-1).join(' '),
            phoneNumber: props.event.description?.split('\n').shift(),
            partySize: props.event.summary?.split(' ').pop()!.replace(/\D/g,''),
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
        const summary = `${props.location === 'kuma' ? 'Kuma' : '1988'}: ${ e.target.name === 'firstName' ? e.target.value : tempEditBookingData.firstName } (${e.target.name === 'partySize' ? e.target.value : tempEditBookingData.partySize })`
        const description = `${e.target.name === 'phoneNumber' ? e.target.value :  tempEditBookingData.phoneNumber }\n${e.target.name === 'note' ? e.target.value : tempEditBookingData.note }`

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
        setIsLoading(true);
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gcBookingData)
        };
        fetch(`${process.env.REACT_APP_BRICK_API}/google-calendar/update-event`, requestOptions)
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
        <>
            <GCEditBookingWrapper>
                <Card style={{border: '1px solid black', padding: '12px', paddingTop: '8px', margin: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'space-between'}}>
                    {
                        isLoading ? <LinearProgress /> : <div style={{height: '4px'}} />
                    }
                    <div style={{width: '100%'}}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: '12px',
                            lineHeight: '12px'
                        }}>
                            <div style={{display: 'flex', width: '100%', justifyContent: 'flex-end', gap: '18px'}}>
                                <Button
                                    sx={{height: '36px'}}
                                    variant="contained"
                                    color={'warning'}
                                    startIcon={<CloseIcon/>}
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
                                    sx={{height: '36px'}}
                                    variant="contained"
                                    startIcon={<SaveIcon/>}
                                    disabled={isLoading}
                                    onClick={() => updateGoogleCalendarEvent()}
                                >
                                    Update
                                </Button>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row', gap: '12px'}}>
                                <div style={{width: '100%'}}>
                                    <Typography
                                        variant="h6"
                                        className={'input-label'}
                                    >
                                        First Name
                                    </Typography>
                                    <TextField
                                        // size={'small'}
                                        variant={"outlined"}
                                        name={'firstName'}
                                        sx={{width: '100%'}}
                                        autoComplete={'off'}
                                        disabled={isLoading}
                                        value={tempEditBookingData.firstName}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </div>
                                <div style={{width: '100%'}}>
                                    <Typography
                                        variant="h6"
                                        className={'input-label'}
                                    >
                                        Party Size
                                    </Typography>
                                    <TextField
                                        variant={"outlined"}
                                        sx={{width: '100%'}}
                                        value={tempEditBookingData.partySize}
                                        name={'partySize'}
                                        type={'tel'}
                                        disabled={isLoading}
                                        onChange={(e) => handleChange(e)}
                                        autoComplete={'off'}
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row', gap: '12px'}}>
                                <FormControl fullWidth sx={{display: 'flex', flexDirection: 'row', gap: '24px'}}>
                                    <div style={{width: '100%'}}>
                                        <Typography
                                            variant="h6"
                                            className={'input-label'}
                                        >
                                            Start Time:
                                        </Typography>
                                        <Select
                                            id="start"
                                            value={tempEditBookingData.startTime}
                                            name={'startTime'}
                                            sx={{width: '100%'}}
                                            disabled={isLoading}
                                            onChange={(e) => handleSelectChange(e)}
                                        >
                                            {memoizedGetTodayTimeMapping.map((t: TimeSlot) => {
                                                return <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>
                                            })}
                                        </Select>
                                    </div>
                                </FormControl>
                                <FormControl fullWidth>
                                    <Typography
                                        variant="h6"
                                        className={'input-label'}
                                    >
                                        End Time:
                                    </Typography>
                                    <Select
                                        id="end"
                                        value={tempEditBookingData.endTime}
                                        name={'endTime'}
                                        disabled={isLoading}
                                        onChange={handleSelectChange}
                                    >
                                        {memoizedGetTodayTimeMapping // filter out the values after 1 hrs of start time (7,200,000 ms)
                                            .filter((t) => {
                                                const twoHrsLater = (tempEditBookingData.startTime || 0) + 3600000;
                                                if (t.value >= twoHrsLater) {
                                                    return t.value >= twoHrsLater;
                                                } else {
                                                    return t.label === '11:00 PM'
                                                }
                                            })
                                            .map((t) => {
                                                return <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>
                                            })}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row', gap: '12px'}}>
                                <div style={{width: '100%'}}>
                                    <Typography
                                        variant="h6"
                                        className={'input-label'}
                                    >
                                        Phone Number
                                    </Typography>
                                    <TextField
                                        variant={"outlined"}
                                        sx={{width: '100%'}}
                                        value={tempEditBookingData.phoneNumber}
                                        name={'phoneNumber'}
                                        autoComplete={'off'}
                                        disabled={isLoading}
                                        onChange={(e) => handleChange(e)}
                                        helperText={phoneNumberHelperText}
                                        FormHelperTextProps={{
                                            className: 'helper-text'
                                        }}
                                    />
                                </div>
                                <div style={{width: '100%'}}>
                                    <Typography
                                        variant="h6"
                                        className={'input-label'}
                                    >
                                        Description/Initials
                                    </Typography>
                                    <TextField
                                        variant={"outlined"}
                                        sx={{width: '100%'}}
                                        value={tempEditBookingData.note}
                                        name={'note'}
                                        multiline={true}
                                        disabled={isLoading}
                                        helperText={descriptionHelperText}
                                        FormHelperTextProps={{
                                            className: 'helper-text'
                                        }}
                                        onChange={(e) => handleChange(e)}
                                        autoComplete={'off'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </GCEditBookingWrapper>
        </>
    )
};

export default GoogleCalendarEditBooking;
