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
import React, {useEffect, useState} from "react";
import useIsMobile from "../hook/useIsMobile";
import {StartOfToday, Today, useCalendarState} from "../context/Calendar.provider";
import {GoogleCalendarWrapper} from "./GoogleCalendar.style";
import {GoogleCalendarEventType} from "./GoogleCalendar.type";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {Button, Card, Drawer, IconButton, Skeleton, Typography} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import GoogleCalendarEvent from "./GoogleCalendarEvent";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import GoogleCalendarNewBooking from "./GoogleCalendarNewBooking";
import {useAppState} from "../context/App.provider";

function GoogleCalendar({ location, currentMonthBookings } : { location : string, currentMonthBookings: GoogleCalendarEventType[] }) {
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
    // const [ currentMonthBookings, setCurrentMonthBookings ] = useState<GoogleCalendarEventType[]>([]);
    const [ currentDayBookings, setCurrentDayBookings] = useState<GoogleCalendarEventType[]>([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();
    // const [isCreatingNewEvent, setIsCreatingNewEvent] = useState(false);


    // useEffect(() => {
    //     if (reloadCalendar) {
    //         setIsCreatingNewEvent(false);
    //     }
    // }, [reloadCalendar])


    useEffect(() => {
        if (currentMonthBookings.length > 0 && openDrawer) {
            const todaysBooking = currentMonthBookings.filter((b) => {
                if (b.start && b.start.dateTime) {
                    return b.start.dateTime.substring(0,10) === new Date(selectedDate).toISOString().substring(0,10)
                } else if (b.start && b.start.date) {
                    return b.start.date.substring(0,10) === new Date(selectedDate).toISOString().substring(0,10)
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
                <div className="col col-start month-nav">
                    <IconButton onClick={() => prevMonth()} className="icon">
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={() => nextMonth()} className="icon">
                        <ChevronRightIcon />
                    </IconButton>

                </div>
                <div className="col col-center">
                    <span
                        className={'month-year'}
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
                        style={{color: 'black', borderColor: 'black', borderRadius: '24px'}}
                        variant="outlined"
                        onClick={() => {
                            setCurrentMonth(Today);
                            setSelectedDate(StartOfToday);
                            navigate(`/${location}/reservations`);
                        }}
                    >Today</Button>
                </div>
            </div>
        );
    }

    const renderDays = () => {
        const dateFormat = "EE";
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
        if (location === 'kuma' && dayInteger === 0) {
            return <span className={'closed'}>Closed</span>;
        }
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
                let tomorrow =  new Date(cloneDay)
                tomorrow.setDate(day.getDate() + 1);

                days.push(
                    <div
                        className={`col cell
                         ${
                            !isSameMonth(day, monthStart)
                                ? "disabled"
                                : isSameDay(day, selectedDate) ? "selected" : ""
                        }`}
                        key={day.toDateString()}
                        data-key={day.toISOString()}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <div
                            className={`number`}
                            data-key={day.toISOString()}
                        >
                            <span className={`${isToday(day) ? "today" : ""}`}>{formattedDate}</span>
                        </div>
                        <div className={`confirm-events ${isToday(day) ? "today" : ""}`}>
                            {renderCloseStatus(day)}
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
                return b.start.dateTime.substring(0,10) === day.toISOString().substring(0,10)
            } else if (b.start && b.start.date) {
                return b.start.date.substring(0,10) === new Date(day).toISOString().substring(0,10)
            }
        })

        if (todaysEvent && todaysEvent.length > 3) {
            return todaysEvent.map((x, index) => {
                if (index < 3) {
                    return <div className={'event'}>{x.start.dateTime ? moment(x.start.dateTime).format('h:mmA') : ''} {x.summary}</div>
                }
                if (index === 3) {
                    const remainingEvents = todaysEvent.length - 3;
                    return <div className={'event'}>+{remainingEvents} more events</div>
                }
            });
        } else {
            return todaysEvent && todaysEvent.map((x) => (
                <div className={'event'}>{x.start.dateTime ?  moment(x.start.dateTime).format('h:mmA') : ''} {x.summary}</div>
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
    const toggleDrawer =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setOpenDrawer(false);
                // setIsCreatingNewEvent(false);
            };

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

    const displayActionButtons = () => {
        return (
            <>
                {
                    !isEditing ? (
                        <Button
                            sx={{height: '36px'}}
                            variant="contained"
                            startIcon={<AddIcon />}
                            disabled={isLoading || isEditing}
                            onClick={() => setIsEditing(true)}
                        >
                            Booking
                        </Button>
                    ) : (
                        <div style={{display: 'flex', gap: '18px'}}>

                            <Button
                                sx={{height: '36px'}}
                                variant="contained"
                                color={'warning'}
                                startIcon={<CloseIcon />}
                                disabled={isLoading}
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                sx={{height: '36px'}}
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={getSaveBtnState()}
                                onClick={() => saveGoogleCalendarEvent()}
                            >
                                Save
                            </Button>
                        </div>
                    )
                }

            </>

        )
    }

    return (
        <GoogleCalendarWrapper>
            <div className={'google-calendar'}>
                <>
                    {renderHeader()}
                    {renderDays()}
                    {
                        !isLoading ? (
                            <>
                                {renderCells()}
                            </>
                        ) : <Skeleton variant="rounded" width={'100%'} height={560} />
                    }

                </>
            </div>
            {/*<Drawer*/}
            {/*    anchor={'right'}*/}
            {/*    open={openDrawer}*/}
            {/*    onClose={() => {*/}
            {/*        setIsEditing(false);*/}
            {/*        toggleDrawer(false);*/}
            {/*    }}*/}
            {/*    PaperProps={{*/}
            {/*    sx: { width: "500px" },*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <div style={{margin: '24px'}}>*/}
            {/*        <div style={{display: 'flex', justifyContent: 'space-between', gap: '50px'}}>*/}
            {/*            <div>*/}
            {/*                <Typography variant={isMobile ? 'h6' : 'h5'}>*/}
            {/*                    Date: {format(selectedDate, 'MMMM dd')}*/}
            {/*                </Typography>*/}
            {/*                <Typography variant={'subtitle1'}>*/}
            {/*                    {*/}
            {/*                        isEditing ? (*/}
            {/*                            <>Add new reservation</>*/}
            {/*                        ) : (*/}
            {/*                            <>{currentDayBookings.length} Reservation{currentDayBookings.length > 1 ? 's' : ''}</>*/}
            {/*                        )*/}
            {/*                    }*/}
            {/*                </Typography>*/}
            {/*                {displayActionButtons()}*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <CloseIcon fontSize={'large'} style={{cursor: 'pointer'}}*/}
            {/*                           onClick={() => setOpenDrawer(false)}/>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div*/}
            {/*            className={'events-container'}*/}
            {/*            style={{*/}
            {/*                maxHeight: 'calc(100vh - 115px)',*/}
            {/*                overflowY: 'scroll',*/}
            {/*                marginTop: '12px'*/}
            {/*            }}>*/}
            {/*            {*/}
            {/*                !isEditing ? (*/}
            {/*                    <>*/}
            {/*                        {*/}
            {/*                            currentDayBookings.map((b, index) => (*/}
            {/*                                <GoogleCalendarEvent {...b} key={index} location={location} />*/}
            {/*                            ))*/}
            {/*                        }*/}
            {/*                    </>*/}
            {/*                ) : <GoogleCalendarNewBooking location={location} />*/}
            {/*            }*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</Drawer>*/}
        </GoogleCalendarWrapper>
);
}

export default GoogleCalendar;
