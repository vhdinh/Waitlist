import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Booking } from './Calendar';
import { addHours, getMinutes, getHours, getSeconds, format } from 'date-fns';
import BookingComponent from './Booking';

interface CalendarOverviewProps {
}

const CalendarOverviewWrapper = styled.div`
    width: 100%;
`;

function CalendarOverview(props: CalendarOverviewProps) {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        getBooking();
    }, [])

    const getBooking = () => {
        // Simple GET request with a JSON body using fetch
        fetch(`${process.env.REACT_APP_BRICK_API}/booking/getToday`)
            .then(res => res.json())
            .then((r) => {

                const f = new Intl.DateTimeFormat('en-us', {
                    timeStyle: 'short'
                })
                const results = r.map((booking: Booking) => {
                    const s = new Date(booking.startTime);
                    const e = new Date(booking.endTime);
                    return {
                        ...booking,
                        formatStart: f.format(s),
                        formatEnd: f.format(e),
                    }
                })
                console.log(results);
                setBookings(results);

            });
    }


    const addBooking = () => {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        };

        fetch(`${process.env.REACT_APP_BRICK_API}/booking/add`, requestOptions)
            .then(res => res.json())
            .then((r) => {
                console.log('RRR', r.includes('error-invalid-phone'));

            }).catch((e) => {
            console.log('caughtttt RESERVATIN', e);
        });

    };

    const renderEachBooking = () => {
        return (
            <>
                {
                    bookings.map((b: Booking, index) => <BookingComponent {...b} key={index} />)
                }
            </>
        )
    }

    return (
        <CalendarOverviewWrapper>
            <>HELLO</>
            <button onClick={() => addBooking()}>Add BOOking</button>
            {renderEachBooking()}
        </CalendarOverviewWrapper>
    )
}

export default CalendarOverview;
