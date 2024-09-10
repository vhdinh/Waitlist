import React from 'react';
import Calendar from './Calendar';
import CalendarOverview from './CalendarOverview';
import styled from "@emotion/styled";

const CalendarPageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`
interface CalendarPageProps {
    location: string;
}

function CalendarPage(props: CalendarPageProps) {
    return (
        <CalendarPageWrapper className={'calendar-page'}>
            <Calendar location={props.location} />
            <CalendarOverview location={props.location} />
        </CalendarPageWrapper>
    )
}

export default CalendarPage;