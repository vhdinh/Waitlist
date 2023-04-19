import React, {useEffect, useState} from 'react';
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
import {StartOfToday, Today, useCalendarState} from "../context/Calendar.provider";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import {Booking} from "./Calendar.type";

function Calendar() {
    const {
        displayMonth,
        currentMonth,
        setCurrentMonth,
        selectedDate,
        setSelectedDate,
        reloadCalendar,
        setReloadCalendar
    } = useCalendarState();
    const [ currentMonthBookings, setCurrentMonthBookings ] = useState<Booking[]>([]);
    console.log('current Month', currentMonth);

    useEffect(() => {
        getCurrentMonthBooking()
    }, [currentMonth])

    useEffect(() => {
        if (reloadCalendar) {
            getCurrentMonthBooking();
            setReloadCalendar(false);
        }
    }, [reloadCalendar])

    const getCurrentMonthBooking = () => {
        // Simple GET request with a JSON body using fetch
        fetch(`${process.env.REACT_APP_BRICK_API}/booking/getMonth/${currentMonth.getTime()}`)
            .then(res => res.json())
            .then((r) => {
                console.log('GOT MONTH BOOKING', r);
                setCurrentMonthBookings(r);
            });
    }

    const renderHeader = () => {
        const dateFormat = "MMMM yyyy";
        return (
            <div className="header row flex-middle">
                <div className="col col-start" onClick={prevMonth}>
                    <ChevronLeftIcon className="icon"/>
                </div>
                {/*<button onClick={() => setCurrentMonth(new Date())}>Today</button>*/}
                <div className="col col-center">
                    <span
                        onClick={() => {
                            setCurrentMonth(Today);
                            setSelectedDate(StartOfToday);
                        }}
                    >
                      {format(currentMonth, dateFormat)}
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
        let startDate = startOfWeek(currentMonth);
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
        const monthStart = startOfMonth(currentMonth);
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
                let tomorrow =  new Date(cloneDay)
                tomorrow.setDate(day.getDate() + 1);

                const numOfBookingForDay = currentMonthBookings?.filter((b) => {
                    return b.startTime > cloneDay.getTime() && b.endTime < tomorrow.getTime();
                })
                days.push(
                    <div
                        className={`col cell ${
                            !isSameMonth(day, monthStart)
                                ? "disabled"
                                : isSameDay(day, selectedDate) ? "selected" : ""
                        }`}
                        key={day.toDateString()}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <span className="number">{formattedDate}</span>
                        {/*<span className="bg">{formattedDate}</span>*/}
                        {
                            numOfBookingForDay.length > 0 && (
                                <span className='res'>
                                    {numOfBookingForDay.length} <DinnerDiningIcon />
                                </span>
                            )
                        }
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div
                    className="row"
                    key={day.toDateString()}
                >
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>;
    }

    const onDateClick = (day: any) => {
        const d = parse(day.getDate().toString(), 'd', new Date());
        setSelectedDate(day.getTime());
    }

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    }

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
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
