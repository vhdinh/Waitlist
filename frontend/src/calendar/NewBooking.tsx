import React, {useState} from 'react';
import styled from "@emotion/styled";
import {
    FormControl,
    FormGroup,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography
} from "@mui/material";
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';
import {TimeMappingNew, getTodayTimeMapping, getFormattedTime} from "./util";
import {useCalendarState} from "../context/Calendar.provider";
import moment from "moment";

interface NewBooking {
    name: string;
    phoneNumber?: number;
    startTime: number;
    endTime: number;
    partySize: number;
    note?: string;
    msg?: string;
    notified?: boolean;
}

const NewBookingWrapper = styled.div`
    .input-container {
      display: flex;
      .input-label {
        padding-right: 12px;
      }
    }
`;

function NewBooking() {
    const { selectedDate } = useCalendarState();
    const [bookingData, setBookingData] = useState<NewBooking>({
        name: '',
        phoneNumber: undefined,
        startTime: 0,
        endTime: 0,
        partySize: 0,
        note: ''
    });

    const handleChange = (e: any) => {
        console.log('handleChange', e);
        setBookingData(oldState => ({
            ...oldState,
            [e.target.name]: e.target.name === 'partySize' ? Number(e.target.value) : e.target.value,
        }))
    };

    const handleSelectChange = (e: any) => {
        console.log('setting', e.target, bookingData);
        setBookingData(oldState => ({
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
                                    {/*{TimeMappingNew.map((t) => {*/}
                                    {/*    return <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>*/}
                                    {/*})}*/}
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
                                    {/*{TimeMappingNew.filter((t) => t.value > bookingData.startTime).map((t) => {*/}
                                    {/*    return <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>*/}
                                    {/*})}*/}
                                    {/*{TimeMappingNew.map((t) => {*/}
                                    {/*    return <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>*/}
                                    {/*})}*/}
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