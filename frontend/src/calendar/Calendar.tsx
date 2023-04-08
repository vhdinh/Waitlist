import React, { useState } from 'react';
import {
    format,
    parse,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    addDays,
    startOfMonth,
    endOfMonth,
    isSameMonth,
    isSameDay,
} from "date-fns";
import { CalendarWrapper } from './Calendar.style';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const initialState = {
    currentMonth: new Date(),
    selectedDate: new Date()
};

function Calendar() {

    const [state, setState] = useState(initialState)

    const renderHeader = () => {
        const dateFormat = "MMMM yyyy";
        return (
            <div className="header row flex-middle">
                <div className="col col-start" onClick={prevMonth}>
                    <ChevronLeftIcon className="icon"/>
                </div>
                <div className="col col-center">
                    <span>
                      {format(state.currentMonth, dateFormat)}
                    </span>
                </div>
                <div className="col col-end" onClick={nextMonth}>
                    <ChevronRightIcon className="icon"/>
                </div>
            </div>
        );
    }

    const renderDays = () => {
        const dateFormat = "EEEE";
        const days = [];
        let startDate = startOfWeek(state.currentMonth);
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col col-center" key={i}>
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }
        return <div className="days row">{days}</div>;

    }

    const renderCells = () => {
        const monthStart = startOfMonth(state.currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const dateFormat = "d";
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;
                days.push(
                    <div
                        className={`col cell ${
                            !isSameMonth(day, monthStart)
                                ? "disabled"
                                : isSameDay(day, state.selectedDate) ? "selected" : ""
                        }`}
                        // key={day}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <span className="number">{formattedDate}</span>
                        <span className="bg">{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div
                    className="row"
                    // key={day}
                >
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>;
    }

    const onDateClick = (day: any) => {
        const d = parse(day.getDate().toString(), 'd', new Date())
    }

    const nextMonth = () => {
        setState({
            ...state,
            currentMonth: addMonths(state.currentMonth, 1)
        });
    }

    const prevMonth = () => {
        setState({
            ...state,
            currentMonth: subMonths(state.currentMonth, 1)
        });
    }


    return (
        <CalendarWrapper >
            <div className={'calendar'}
            >
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>

        </CalendarWrapper>
    );
}

export default Calendar;
