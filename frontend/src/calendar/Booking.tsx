import React from 'react';
import { Booking } from './Calendar';
import styled from '@emotion/styled';

const BookingComponentWrapper = styled.div`
    display: block;
`

function BookingComponent(props: Booking) {
    return (
        <BookingComponentWrapper>
            <div>
                Name: {props.name}
            </div>
            <div>
                Size: {(props.partySize)}
            </div>
            <div>
                Start: {props.formatStart}
            </div>
            <div>
                End: {props.formatEnd}
            </div>
        </BookingComponentWrapper>
    )
}

export default BookingComponent;