import React from 'react';
import Calendar from './Calendar';
import CalendarOverview from './CalendarOverview';
import styled from "@emotion/styled";
import DragAndDrop from "./dnd/dnd";
import moment from 'moment'
import { momentLocalizer } from 'react-big-calendar'

const localizer = momentLocalizer(moment)

const CalendarPageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  .rbc-toolbar {
    .rbc-btn-group button,
    .rbc-toolbar-label {
      font-size: 18px;
    }
  }
`


function CalendarPage() {
    return (
        <CalendarPageWrapper className={'calendar-page'}>
            {/*<Calendar />*/}
            <DragAndDrop localizer={localizer} />
            <CalendarOverview />
        </CalendarPageWrapper>
    )
}

export default CalendarPage;