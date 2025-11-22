import {
    addDays, addMonths,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday, parse,
    startOfMonth,
    startOfWeek, subMonths
} from "date-fns";
import React, { useEffect, useState } from "react";
import useIsMobile from "../hook/useIsMobile";
import { StartOfToday, Today, useCalendarState } from "../context/Calendar.provider";
import { GoogleCalendarWrapper } from "./GoogleCalendar.style";
import { GoogleCalendarEventType } from "./GoogleCalendar.type";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Button, IconButton, Skeleton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useSwipeable } from 'react-swipeable';

function GoogleCalendar({ location, currentMonthBookings }: { location: string, currentMonthBookings: GoogleCalendarEventType[] }) {
    const {
        currentMonth,
        setCurrentMonth,
        selectedDate,
        setSelectedDate,
        gcBookingData,
        isLoading,
        setIsLoading,
        setReloadCalendar,
        isEditing,
        setIsEditing,
    } = useCalendarState();
    const isMobile = useIsMobile();
    const [currentDayBookings, setCurrentDayBookings] = useState<GoogleCalendarEventType[]>([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentMonthBookings.length > 0 && openDrawer) {
            const todaysBooking = currentMonthBookings.filter((b) => {
                if (b.start && b.start.dateTime) {
                    return b.start.dateTime.substring(0, 10) === new Date(selectedDate).toISOString().substring(0, 10)
                } else if (b.start && b.start.date) {
                    return b.start.date.substring(0, 10) === new Date(selectedDate).toISOString().substring(0, 10)
                }
            });
            if (todaysBooking.length > 0) {
                setCurrentDayBookings(todaysBooking);
            } else {
                setCurrentDayBookings([]);
            }
        }
        if (!openDrawer) {
            setCurrentDayBookings([]);
        }
    }, [selectedDate, openDrawer, currentMonthBookings]);


    const renderHeader = () => {
        const dateFormat = "MMMM yyyy";
        return (
            <div className="header">
                <div className="month-nav">
                    <Button
                        className="today-btn"
                        variant="outlined"
                        onClick={() => {
                            setCurrentMonth(Today);
                            const t = new Date().setHours(0, 0, 0, 0);
                            setSelectedDate(t);
                            navigate(`/${location}/reservations`);
                        }}
                    >
                        Today
                    </Button>
                    <div style={{ display: 'flex' }}>
                        <IconButton onClick={() => prevMonth()} className="icon" size="small">
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton onClick={() => nextMonth()} className="icon" size="small">
                            <ChevronRightIcon />
                        </IconButton>
                    </div>
                    <span className="month-year">
                        {format(currentMonth, dateFormat)}
                    </span>
                </div>
            </div>
        );
    }

    const renderDays = () => {
        const dateFormat = "EEE"; // Short day name (Mon, Tue, etc.)
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

    const renderCloseStatus = (day: Date) => {
        const dayInteger = day.getDay();
        // kuma closed for Sunday
        // [0 = sunday, 1 = monday...]
        // if (location === 'kuma' && dayInteger === 0) {
        //     return <span className={'closed'}>Closed</span>;
        // }
        // // 1988 closed for Sunday-Tuesday
        if (location === 'eight' && (dayInteger === 0 || dayInteger === 1 || dayInteger === 2)) {
            return <span className={'closed'}>Closed</span>;
        }
        return <></>;
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

                days.push(
                    <div
                        className={`col cell
                         ${!isSameMonth(day, monthStart)
                                ? "disabled"
                                : isSameDay(day, selectedDate) ? "selected" : ""
                            }`}
                        key={day.toDateString()}
                        data-key={day.toISOString()}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <div className="number">
                            <span className={`${isToday(day) ? "today" : ""}`}>{formattedDate}</span>
                        </div>
                        {renderCloseStatus(day)}
                        <div className="confirm-events">
                            {displayCurrentDayEvents(day)}
                        </div>

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

    const displayCurrentDayEvents = (day: Date) => {
        const todaysEvent = currentMonthBookings.length > 0 && currentMonthBookings.filter((b) => {
            if (b.start && b.start.dateTime) {
                return b.start.dateTime.substring(0, 10) === day.toISOString().substring(0, 10)
            } else if (b.start && b.start.date) {
                return b.start.date.substring(0, 10) === new Date(day).toISOString().substring(0, 10)
            }
        })

        if (todaysEvent && todaysEvent.length > 3) {
            return (
                <>
                    {todaysEvent.slice(0, 2).map((x, index) => (
                        <div className={'event'} key={index}>
                            {x.start.dateTime ? moment(x.start.dateTime).format('h:mmA') : ''} {location === 'brick' ? x.summary?.substring(7) : x.summary?.substring(6)}
                        </div>
                    ))}
                    <div className={'more-events'}>+{todaysEvent.length - 2} more</div>
                </>
            );
        } else {
            return todaysEvent && todaysEvent.map((x, index) => (
                <div className={'event'} key={index}>
                    {x.start.dateTime ? moment(x.start.dateTime).format('h:mmA') : ''} {location === 'brick' ? x.summary?.substring(7) : x.summary?.substring(6)}
                </div>
            ))
        }
    }

    const onDateClick = (day: any) => {
        setSelectedDate(day.getTime());
        setOpenDrawer(true);
    }

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    }

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    }

    const saveGoogleCalendarEvent = () => {
        setIsLoading(true);
        const requestOption = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gcBookingData)
        }
        fetch(`${process.env.REACT_APP_BRICK_API}/google-calendar/add-event`, requestOption)
            .then(res => res.json())
            .then((r) => {
                setReloadCalendar(true);
                setOpenDrawer(false);
            }).finally(() => {
                setIsLoading(false);
            });
    }

    const getSaveBtnState = () => {
        return isLoading;
    }

    const handlers = useSwipeable({
        onSwipedLeft: () => nextMonth(),
        onSwipedRight: () => prevMonth(),
    });

    return (
        <GoogleCalendarWrapper>
            <div className={'google-calendar'}>
                <>
                    {renderHeader()}
                    {renderDays()}
                    {
                        !isLoading ? (
                            <div {...handlers} className="swipe-wrapper">
                                {renderCells()}
                            </div>
                        ) : <Skeleton variant="rounded" width={'100%'} height={560} />
                    }

                </>
            </div>
        </GoogleCalendarWrapper>
    );
}

export default GoogleCalendar;
