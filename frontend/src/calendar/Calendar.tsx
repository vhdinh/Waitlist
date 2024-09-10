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
    isToday,
} from "date-fns";
import { CalendarWrapper } from './Calendar.style';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {InitialNewBooking, StartOfToday, Today, useCalendarState} from "../context/Calendar.provider";
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import {Booking} from "./Calendar.type";
import { Button } from "@mui/material";
import {useNavigate} from "react-router-dom";
import useIsMobile from "../hook/useIsMobile";

interface CalendarProps {
    location: string;
}

function Calendar(props: CalendarProps) {
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
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('This will run every 24 hours!');
            setReloadCalendar(true);
            setSelectedDate(StartOfToday);
            window.location.reload();
        }, 86400000);
        return () => clearInterval(interval);
    }, []);

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
        // console.log('GET_CURRENT_MONTH_BOOKING', {
        //     startOfMonth: startOfMonth(currentMonth),
        //     startOfMonthTime: startOfMonth(currentMonth).getTime(),
        //     endOfMonth: endOfMonth(currentMonth),
        //     endOfMonthTime: endOfMonth(currentMonth).getTime(),
        // });
        // Simple GET request with a JSON body using fetch
        fetch(`${process.env.REACT_APP_BRICK_API}/${props.location}/booking/getMonth/${startOfMonth(currentMonth).getTime()}/${endOfMonth(currentMonth).getTime()}`)
            .then(res => res.json())
            .then((r) => {
                setCurrentMonthBookings(r);
            });
    }

    const renderHeader = () => {
        const dateFormat = "MMMM yyyy";
        return (
            <div className="header row flex-middle">
                <div className="col col-start" >
                    <ChevronLeftIcon onClick={prevMonth} className="icon"/>
                </div>
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
                <div className="col col-end" >
                    <Button
                        style={{color: 'black', borderColor: 'black'}}
                        variant="outlined"
                        onClick={() => {
                            setCurrentMonth(Today);
                            setSelectedDate(StartOfToday);
                            navigate('/reservations');
                        }}
                    >Go To Today</Button>
                    <ChevronRightIcon onClick={nextMonth} className="icon"/>
                </div>
            </div>
        );
    }

    const renderDays = () => {
        const dateFormat = isMobile ? "EE" : "EEEE";
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

    const updateBooking = (id: string, startTime: number, endTime: number) => {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                start: startTime,
                end: endTime
            })
        };
        console.log('Drag_and_drop_update_booking', requestOptions.body);
        fetch(`${process.env.REACT_APP_BRICK_API}/${props.location}/booking/update/${id}`, requestOptions)
            .then(res => res.json())
            .then((r) => {
                setReloadCalendar(true);
            }).catch((e) => {
            console.log('Error updating reservation', e);
        });
    };


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
                    return b.start > cloneDay.getTime() && b.end < tomorrow.getTime();
                });
                days.push(
                    <div
                        className={`col cell
                        ${isToday(day) ? "today" : ""}
                         ${
                            !isSameMonth(day, monthStart)
                                ? "disabled"
                                : isSameDay(day, selectedDate) ? "selected" : ""
                        }`}
                        key={day.toDateString()}
                        data-key={day.toDateString()}
                        onClick={() => onDateClick(cloneDay)}
                        onDragOver={(e) => {
                            e.preventDefault();
                        }}
                        onDrop={(e) => {
                            const data = e.dataTransfer.getData("text");
                            // @ts-ignore
                            const d = new Date(e.target.getAttribute('data-key'));
                            const id =data.split('-')[0];
                            const startTime = data.split('-')[1];
                            const endTime = data.split('-')[2];
                            const startTimeAsDate = new Date(`${format(d, 'MM/dd/yyyy')} ${startTime}`).getTime();
                            const endTimeAsDate = new Date(`${format(d, 'MM/dd/yyyy')} ${endTime}`).getTime();
                            setTimeout(() => {
                                updateBooking(id, startTimeAsDate, endTimeAsDate);
                            }, 750)
                        }}
                    >
                        <div
                            className="number"
                            data-key={day.toDateString()}
                        >
                            {formattedDate}
                        </div>
                        {/*<span className="bg">{formattedDate}</span>*/}
                        {
                            numOfBookingForDay.length > 0 && (
                                <span className='res' data-key={day.toDateString()}>
                                    {numOfBookingForDay.length} <DinnerDiningIcon data-key={day.toDateString()}/>
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
