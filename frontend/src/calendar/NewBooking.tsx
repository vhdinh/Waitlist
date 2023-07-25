import React, {useState} from 'react';
import styled from "@emotion/styled";
import {
    FormControl,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {getTodayTimeMapping, NewBookingType} from "./util";
import {useCalendarState} from "../context/Calendar.provider";

const NewBookingWrapper = styled.div`
    .input-container {
      display: flex;
      .input-label {
        padding-right: 12px;
      }
    }
`;

function NewBooking() {
    const { selectedDate, setBookingData, bookingData } = useCalendarState();

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

    return (
        <NewBookingWrapper>
            <form>
                <Typography variant={'h6'}>
                    Adding a new reservation:
                </Typography>
                <Grid container spacing={6}>
                    <Grid item xs={4} md={4} lg={4}>
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
                    <Grid item xs={4} md={4} lg={4}>
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
                    <Grid item xs={4} md={4} lg={4}>
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
                    <Grid item xs={4} md={4} lg={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Typography
                                    variant="h6"
                                    className={'input-label'}
                                >
                                    Start Time:
                                </Typography>
                                <Select
                                    id="startTime"
                                    value={bookingData.startTime}
                                    name={'startTime'}
                                    onChange={(e) => handleSelectChange(e)}
                                >
                                    {getTodayTimeMapping(selectedDate).map((t) => {
                                        return <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={4} md={4} lg={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Typography
                                    variant="h6"
                                    className={'input-label'}
                                >
                                    End Time:
                                </Typography>
                                <Select
                                    id="endTime"
                                    value={bookingData.endTime}
                                    name={'endTime'}
                                    onChange={handleSelectChange}
                                >
                                    {getTodayTimeMapping(selectedDate).filter((t) => t.value > bookingData.startTime).map((t) => {
                                        return <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={4} md={4} lg={4}>
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