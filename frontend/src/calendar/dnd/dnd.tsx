import React, {Fragment, useCallback, useEffect, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
// import events from '../../resources/events'
import { Calendar, Views, DateLocalizer } from 'react-big-calendar'
// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop'
// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {endOfMonth, startOfMonth, getMonth} from "date-fns";
import {useCalendarState} from "../../context/Calendar.provider";

const DragAndDropCalendar = withDragAndDrop(Calendar)
// @ts-ignore
export default function DragAndDrop({ localizer }) {
    const [myEvents, setMyEvents] = useState();
    const {
        currentMonth,
        setCurrentMonth,
        reloadCalendar,
        setReloadCalendar,
        selectedDate,
        setSelectedDate,
    } = useCalendarState();

    useEffect(() => {
        getCurrentMonthBooking();
    }, [])

    useEffect(() => {
        if (reloadCalendar) {
            getCurrentMonthBooking();
            setReloadCalendar(false);
        }
    }, [reloadCalendar]);

    const getCurrentMonthBooking = (cm?: Date) => {
        // console.log('GET_CURRENT_MONTH_BOOKING', {
        //     startOfMonth: startOfMonth(currentMonth),
        //     startOfMonthTime: startOfMonth(currentMonth).getTime(),
        //     endOfMonth: endOfMonth(currentMonth),
        //     endOfMonthTime: endOfMonth(currentMonth).getTime(),
        // });
        // Simple GET request with a JSON body using fetch
        fetch(`${process.env.REACT_APP_BRICK_API}/booking/getMonth/${startOfMonth(cm ? cm: currentMonth).getTime()}/${endOfMonth(cm ? cm : currentMonth).getTime()}`)
            .then(res => res.json())
            .then((r) => {
                console.log('EVENTSSSSS', r);
                setMyEvents(r);
            });
    }

    const moveEvent = useCallback( //@ts-ignore
        ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
            const { allDay } = event
            if (!allDay && droppedOnAllDaySlot) {
                event.allDay = true
            }
            console.log('MOVE EVENT', event, start, end);
            //@ts-ignore
            setMyEvents((prev) => {
                //@ts-ignore
                const existing = prev.find((ev) => ev.id === event.id) ?? {}
                //@ts-ignore
                const filtered = prev.filter((ev) => ev.id !== event.id)
                return [...filtered, { ...existing, start, end, allDay }]
            })
        },
        [setMyEvents]
    )

    const resizeEvent = useCallback( //@ts-ignore
        ({ event, start, end }) => {
            //@ts-ignore
            setMyEvents((prev) => {
                //@ts-ignore
                const existing = prev.find((ev) => ev.id === event.id) ?? {}
                //@ts-ignore
                const filtered = prev.filter((ev) => ev.id !== event.id)
                return [...filtered, { ...existing, start, end }]
            })
        },
        [setMyEvents]
    )

    const { defaultDate, views } = useMemo(
        () => ({
            defaultDate: new Date(selectedDate),
            views: {
                month: true,
                agenda: true,
            },
        }),
        []
    )

    return (
        <Fragment>
            <div style={{
                marginTop: '32px',
                height: '600px'
            }}>
                <DragAndDropCalendar
                    defaultDate={defaultDate}
                    defaultView={Views.MONTH}
                    events={myEvents}
                    localizer={localizer}
                    onEventDrop={moveEvent}
                    onEventResize={resizeEvent}
                    views={views}
                    onNavigate={date => {
                        const m = getMonth(date);
                        const cm = getMonth(currentMonth);
                        const sm = startOfMonth(date);
                        if (cm != m ) { // not the same month, get months data
                            setCurrentMonth(date);
                            getCurrentMonthBooking(date);
                            console.log('ON NAVIGATE', date);
                        }

                        setSelectedDate(date.getTime());


                    }}
                    onSelectSlot={(e) => console.log('SELECT SLOT', e)}
                    popup
                    resizable
                />
            </div>
        </Fragment>
    )
}
DragAndDrop.propTypes = {
    localizer: PropTypes.instanceOf(DateLocalizer),
}