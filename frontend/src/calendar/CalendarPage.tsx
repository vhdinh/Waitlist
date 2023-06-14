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


function CalendarPage() {
    return (
        <CalendarPageWrapper className={'calendar-page'}>
            <Calendar />
            <CalendarOverview />
        </CalendarPageWrapper>
    )
}

export default CalendarPage;