import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Booking } from './Calendar.type';
import NewBooking from './NewBooking';
import { addHours, getMinutes, getHours, getSeconds, startOfDay, endOfDay, format } from 'date-fns';
import BookingComponent from './Booking';
import {InitialNewBooking, useCalendarState} from "../context/Calendar.provider";
import { Typography, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import {useAppState} from "../context/App.provider";
import useIsMobile from "../hook/useIsMobile";
interface CalendarOverviewProps {
}

const CalendarOverviewWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px 0;
  .co-header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 8px;
    button {
      background: black;
      &:disabled {
        background: unset;
      }
    }
    .actions {
      display: flex;
      gap: 16px;
    }
  }
`;

function CalendarOverview(props: CalendarOverviewProps) {
    const isMobile = useIsMobile();
    const { isAdmin } = useAppState();
    const {selectedDate, setReloadCalendar, reloadCalendar, bookingData, setBookingData, displayAddNewBooking, setDisplayAddNewBooking, isEditing } = useCalendarState();
    const [bookings, setBookings] = useState<Booking[]>([]);
    // const [displayAddNewBooking, setDisplayAddNewBooking] = useState(false);
    const [loadingOverview, setLoadingOverview] = useState(false);

    useEffect(() => {
        getBooking();
        setDisplayAddNewBooking(false);
        setBookingData(InitialNewBooking);
    }, [selectedDate]);

    useEffect(() => {
        if (reloadCalendar) {
            getBooking();
        }
    }, [reloadCalendar])

    const getBooking = () => {
        setLoadingOverview(true);
        // Simple GET request with a JSON body using fetch
        fetch(`${process.env.REACT_APP_BRICK_API}/booking/getDay/${startOfDay(selectedDate).getTime()}/${endOfDay(selectedDate).getTime()}/${isAdmin}`)
            .then(res => res.json())
            .then((r) => {
                const f = new Intl.DateTimeFormat('en-us', {
                    timeStyle: 'short'
                })
                const results = r.sort((a: Booking, b: Booking) => a.start - b.start).map((booking: Booking) => {
                    const s = new Date(booking.start);
                    const e = new Date(booking.end);
                    return {
                        ...booking,
                        formatStart: f.format(s),
                        formatEnd: f.format(e),
                    }
                })
                setBookings(results);
                setLoadingOverview(false);
            });
    };

    const addBooking = () => {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        };

        fetch(`${process.env.REACT_APP_BRICK_API}/booking/add`, requestOptions)
            .then(res => res.json())
            .then((r) => {
                console.log('RRR', r.includes('error-invalid-phone'));
                setReloadCalendar(true);
                setDisplayAddNewBooking(false);
                setBookingData(InitialNewBooking);
            }).catch((e) => {
            console.log('caughtttt RESERVATIN', e);
        });
    };
    const updateBooking = () => {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        };
        console.log('UPDATING', bookingData);
        fetch(`${process.env.REACT_APP_BRICK_API}/booking/update/${bookingData._id}`, requestOptions)
            .then(res => res.json())
            .then((r) => {
                setReloadCalendar(true);
                setDisplayAddNewBooking(false);
                setBookingData(InitialNewBooking);
            }).catch((e) => {
            console.log('Error updating reservation', e);
        });
    };

    const renderEachBooking = () => {
        return (
            bookings.length > 0 ? (
                <div className={'bookings'}>
                    {
                        bookings.map((b: Booking, index) => <BookingComponent {...b} key={index} />)
                    }
                </div>
            ) : (
                <div className={'bookings_empty'}>
                    No reservations for {format(selectedDate, 'MMMM dd')}
                </div>
            )
        )
        return (
            <div className={'bookings'}>
                {
                    bookings.map((b: Booking, index) => <BookingComponent {...b} key={index} />)
                }
            </div>
        )
    };

    const getActionButtonDisabledState = (): boolean => {
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
        const todayStartNow = todayStart.getTime();
        // disable the button for any day in the past
        if (selectedDate >= todayStartNow) {
            return false;
        }
        return true;
    }

    const validateBookingForm = () => {
        return !bookingData.name || !bookingData.phoneNumber || !bookingData.start  || !bookingData.end || !bookingData.partySize;
    }

    const displayActionButtons = () => {
        if (!displayAddNewBooking) {
            return (
                <Button
                    onClick={() => setDisplayAddNewBooking(true)}
                    variant="contained"
                    disabled={getActionButtonDisabledState()}
                    startIcon={<AddIcon />}
                >
                    Booking
                </Button>
            )
        } else {
            return (
                <div className={'actions'}>
                    <Button
                        onClick={() => {
                            setBookingData(InitialNewBooking);
                            setDisplayAddNewBooking(false)
                        }}
                        variant="contained"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => isEditing ? updateBooking() : addBooking()}
                        disabled={validateBookingForm()}
                        variant="contained"
                        startIcon={<SaveIcon />}
                    >
                        { isEditing ? 'Update' : 'Save' }
                    </Button>
                </div>
            )
        }
    }

    return (
        <CalendarOverviewWrapper>
            <div className={'co-header'}>
                <Typography variant={isMobile ? 'h6' : 'h5'}>
                    Selected Date: {format(selectedDate, 'MMMM dd')}
                </Typography>
                {displayActionButtons()}
            </div>
            <div>
                {
                    !loadingOverview ? (
                        displayAddNewBooking ? <NewBooking /> : renderEachBooking()
                    ): <>Loading...</>
                }
            </div>
        </CalendarOverviewWrapper>
    )
}

export default CalendarOverview;
