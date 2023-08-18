import React, {useEffect, useMemo, useState} from 'react';
import styled from "@emotion/styled";
import {
    FormControl,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {getTodayTimeMapping, NearClosingTime, NewBookingType, TimeMapping, TimeSlot} from "./util";
import {useCalendarState} from "../context/Calendar.provider";

const NewBookingWrapper = styled.div`
    .input-container {
      display: flex;
      .input-label {
        padding-right: 12px;
      }
    }
    .MuiGrid-item {
      padding-top: 8px !important;
    }
`;

function NewBooking() {
    const { selectedDate, setBookingData, bookingData, isEditing } = useCalendarState();

    const handleChange = (e: any) => {
        setBookingData((oldState: NewBookingType) => ({
            ...oldState,
            [e.target.name]: e.target.name === 'partySize' || e.target.name === 'phoneNumber' ? Number(e.target.value) || '' : e.target.value,
        }))
    };

    const handleSelectChange = (e: any) => {
        setBookingData((oldState: NewBookingType) => ({
            ...oldState,
            [`${e.target.name}`]: e.target.value,
        }))
    }

    useEffect(() => {
        if (bookingData.start) {
            const endT = memoizedGetTodayTimeMapping // filter out the values after 2 hrs of start time (7,200,000 ms)
                .find((t) => t.value === (bookingData.start + 7200000));
            if (endT) {
                setBookingData((oldState: NewBookingType) => ({
                    ...oldState,
                    end: endT.value,
                }))
            } else {
                const newEndT = memoizedGetTodayTimeMapping // filter out the values after 2 hrs of start time (7,200,000 ms)
                    .find((t) => t.value === memoizedGetTodayTimeMapping[memoizedGetTodayTimeMapping.length - 1].value);
                setBookingData((oldState: NewBookingType) => ({
                    ...oldState, //@ts-ignore
                    end: newEndT.value,
                }))
            }
        };
    }, [bookingData.start])

    const memoizedGetTodayTimeMapping = useMemo((): TimeSlot[] =>
        getTodayTimeMapping(selectedDate),
        [selectedDate]
    );

    return (
        <NewBookingWrapper>
            <form>
                <Typography variant={'h6'} style={{paddingBottom: '40px'}}>
                    {
                        isEditing ? 'Editing ' : 'Adding new '
                    }
                    reservation:
                </Typography>
                <Grid container spacing={6}>
                    <Grid item xs={6} md={4} lg={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Typography
                                    variant="h6"
                                    className={'input-label'}
                                >
                                    Name:
                                </Typography>
                                <TextField
                                    required
                                    id="name-input"
                                    type="text"
                                    name={'name'}
                                    value={bookingData.name}
                                    onChange={(e) => handleChange(e)}
                                    autoComplete={'off'}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Typography
                                    variant="h6"
                                    className={'input-label'}
                                >
                                    Phone Number:
                                </Typography>
                                <TextField
                                    required
                                    id="phoneNumber-input"
                                    type="tel"
                                    name={'phoneNumber'}
                                    value={bookingData.phoneNumber}
                                    onChange={(e) => handleChange(e)}
                                    autoComplete={'off'}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Typography
                                    variant="h6"
                                    className={'input-label'}
                                >
                                    Start Time:
                                </Typography>
                                <Select
                                    id="start"
                                    value={bookingData.start}
                                    name={'start'}
                                    onChange={(e) => handleSelectChange(e)}
                                >
                                    {memoizedGetTodayTimeMapping.map((t: TimeSlot) => {
                                        return <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Typography
                                    variant="h6"
                                    className={'input-label'}
                                >
                                    End Time:
                                </Typography>
                                <Select
                                    id="end"
                                    value={bookingData.end}
                                    name={'end'}
                                    onChange={handleSelectChange}
                                >
                                    {memoizedGetTodayTimeMapping // filter out the values after 2 hrs of start time (7,200,000 ms)
                                        .filter((t) => {
                                            const twoHrsLater = bookingData.start + 7200000;
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
                        </Grid>
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Typography
                                    variant="h6"
                                    className={'input-label'}
                                >
                                    Party Size:
                                </Typography>
                                <TextField
                                    required
                                    id="size-input"
                                    type="tel"
                                    name={'partySize'}
                                    value={bookingData.partySize}
                                    onChange={(e) => handleChange(e)}
                                    autoComplete={'off'}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Typography
                                    variant="h6"
                                    className={'input-label'}
                                >
                                    Note:
                                </Typography>
                                <TextField
                                    required
                                    id="note-input"
                                    type="text"
                                    value={bookingData.note}
                                    name={'note'}
                                    onChange={(e) => handleChange(e)}
                                    autoComplete={'off'}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </NewBookingWrapper>
    )
}

export default NewBooking;