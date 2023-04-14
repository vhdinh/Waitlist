import React from 'react';
import Calendar from './Calendar';
import CalendarOverview from './CalendarOverview';
import { useCalendarState } from '../context/Calendar.provider';

function CalendarPage() {
    return (
        <>
            <Calendar />
            <CalendarOverview />
        </>
    )
}

export default CalendarPage;