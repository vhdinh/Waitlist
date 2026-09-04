import React from 'react';
import { addDays, format, startOfWeek } from 'date-fns';

interface WeekdayHeaderRowProps {
    currentMonth: Date;
    dateFormat: string;
}

// Shared by Calendar.tsx and GoogleCalendar.tsx - both rendered this same
// 7-day weekday header row independently, with only the date-format string
// differing (full weekday name vs. abbreviated).
function WeekdayHeaderRow({ currentMonth, dateFormat }: WeekdayHeaderRowProps) {
    const startDate = startOfWeek(currentMonth);
    const days = [];
    for (let i = 0; i < 7; i++) {
        days.push(
            <div className="col col-center" key={i}>
                {format(addDays(startDate, i), dateFormat)}
            </div>
        );
    }
    return <div className="days row">{days}</div>;
}

export default WeekdayHeaderRow;
