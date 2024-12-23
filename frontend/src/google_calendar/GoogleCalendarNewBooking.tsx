import {
    Card,
    FormControl,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import styled from "@emotion/styled";
import {getTodayTimeMapping, NewBookingType, TimeSlot} from "../calendar/util";
import {useCalendarState} from "../context/Calendar.provider";
import moment from "moment";

const GCNewBookingWrapper = styled.div`
    .helper-text {
        color: gray !important;
        font-size: 16px !important;
        margin-left: 0 !important;
    }
`;

function GoogleCalendarNewBooking({ location} : { location: string }) {
    const { selectedDate, gcBookingData, setGCBookingData, isLoading } = useCalendarState();
    // const [tempNewBookingData, setTempNewBookingData] = useState({...gcBookingData, firstName: '', phoneNumber: '', partySize: '', note: ''})
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
        const summary = `${location === 'kuma' ? 'Kuma' : '1988'}: ${ e.target.name === 'firstName' ? e.target.value : gcBookingData.firstName } (${e.target.name === 'partySize' ? e.target.value : gcBookingData.partySize })`
        const description = `${e.target.name === 'phoneNumber' ? e.target.value :  gcBookingData.phoneNumber }\n${e.target.name === 'note' ? e.target.value : gcBookingData.note }`

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

    return (
        <>
            <GCNewBookingWrapper>
                <Card style={{border: '1px solid black', padding: '12px', margin: '12px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                    {
                        isLoading ? <LinearProgress /> : <div style={{ height: '4px' }} />
                    }
                    <div style={{ width: '100%' }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: '12px',
                            lineHeight: '12px'
                        }}>
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
                                        value={gcBookingData.firstName}
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
                                        value={gcBookingData.partySize}
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
                                            value={gcBookingData.startTime}
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
                                        value={gcBookingData.endTime}
                                        name={'endTime'}
                                        disabled={isLoading}
                                        onChange={handleSelectChange}
                                    >
                                        {memoizedGetTodayTimeMapping // filter out the values after 2 hrs of start time (7,200,000 ms)
                                            .filter((t) => {
                                                const twoHrsLater = (gcBookingData.startTime || 0) + 7200000;
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
                                        value={gcBookingData.phoneNumber}
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
                                        value={gcBookingData.note}
                                        name={'note'}
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
            </GCNewBookingWrapper>

        </>
    )
}

export default GoogleCalendarNewBooking;
