import React, {useEffect, useRef, useState} from 'react';
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
import {getDayFromTimestamp} from "../utils/date";
import WeekdayHeaderRow from "./WeekdayHeaderRow";

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
    const latestBookingRequestId = useRef(0);

    const navigate = useNavigate();
    const isMobile = useIsMobile();

    useEffect(() => {
        // Reload once at the next local midnight rather than every 86400000ms
        // from whenever this component happened to mount - the old fixed
        // interval meant this kiosk screen would reload at a different,
        // arbitrary time each day. The reload itself restarts the app, which
        // re-registers this effect and schedules the following midnight.
        const now = new Date();
        const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
        const msUntilMidnight = nextMidnight.getTime() - now.getTime();
        const timeout = setTimeout(() => {
            setReloadCalendar(true);
            setSelectedDate(StartOfToday);
            window.location.reload();
        }, msUntilMidnight);
        return () => clearTimeout(timeout);
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
        // Tag each request so a slower, older response (e.g. from rapidly
        // clicking prev/next month) can't land after a newer one and
        // overwrite it with stale data.
        const requestId = ++latestBookingRequestId.current;
        fetch(`${process.env.REACT_APP_BRICK_API}/${props.location}/booking/getMonth/${startOfMonth(currentMonth).getTime()}/${endOfMonth(currentMonth).getTime()}`)
            .then(res => res.json())
            .then((r) => {
                if (requestId === latestBookingRequestId.current) {
                    setCurrentMonthBookings(r);
                }
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
                            navigate(`/${props.location}/reservations`);
                        }}
                    >Go To Today</Button>
                    <ChevronRightIcon onClick={nextMonth} className="icon"/>
                </div>
            </div>
        );
    }

    const renderDays = () => (
        <WeekdayHeaderRow currentMonth={currentMonth} dateFormat={isMobile ? "EE" : "EEEE"} />
    );

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
                            const { id, startTime, endTime } = JSON.parse(e.dataTransfer.getData("text"));
                            // @ts-ignore
                            const d = new Date(e.target.getAttribute('data-key'));
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
                        {renderCloseStatus(day)}
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

    const renderCloseStatus = (day: Date) => {
        const dayInteger = day.getDay();
        // [0 = sunday, 1 = monday...]
        // 1988 closed for Sunday-Tuesday
        if (props.location === 'eight' && (dayInteger === 0 || dayInteger === 1 || dayInteger === 2)) {
            return <span className={'closed'}>Closed</span>;
        }
        return <></>;
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
        <CalendarWrapper>
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
