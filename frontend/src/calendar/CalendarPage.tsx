import React from 'react';
import Calendar from './Calendar';
import CalendarOverview from './CalendarOverview';

function CalendarPage() {
    return (
        <div className={'calendar-page'}>
            <Calendar />
            <CalendarOverview />
        </div>
    )
}

export default CalendarPage;