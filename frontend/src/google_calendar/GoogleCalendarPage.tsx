import GoogleCalendar from "./GoogleCalendar";
import GoogleCalendarOverview from "./GoogleCalendarOverview";
import {endOfMonth, startOfMonth} from "date-fns";
import {GoogleCalendarEventType} from "./GoogleCalendar.type";
import {useCalendarState} from "../context/Calendar.provider";
import {useEffect, useState} from "react";
import {useAppState} from "../context/App.provider";
import moment from "moment";

function GoogleCalendarPage({ location } : { location : string }) {
    const {
        currentMonth,
        selectedDate,
        setIsLoading,
        reloadCalendar,
        setReloadCalendar,
        setIsEditing,
    } = useCalendarState();
    const { setSnackMsg, setDisplaySnack } = useAppState();
    const [ currentMonthBookings, setCurrentMonthBookings ] = useState<GoogleCalendarEventType[]>([]);
    const [ currentDayBookings, setCurrentDayBookings] = useState<GoogleCalendarEventType[]>([]);
    useEffect(() => {
        getGoogleCurrentMonthBooking();
    }, [currentMonth])

    useEffect(() => {
        if (reloadCalendar) {
            getGoogleCurrentMonthBooking();
            setReloadCalendar(false);
            setIsEditing(false);
        }
    }, [reloadCalendar])


    const getGoogleCurrentMonthBooking = () => {
        setIsLoading(true);
        fetch(`${process.env.REACT_APP_BRICK_API}/google-calendar/${location === 'kuma' ? 'kuma' : '1988'}/${startOfMonth(currentMonth).toISOString()}/${endOfMonth(currentMonth).toISOString()}`)
            .then(res => res.json())
            .then((r) => {
                if (r.message) {
                    setCurrentMonthBookings([]);
                } else {
                    if (r.mappedEvents) {
                        setCurrentMonthBookings(r.mappedEvents as GoogleCalendarEventType[]);
                    }
                }
                setIsLoading(false);
            }).catch((e) => {
            setSnackMsg({ msg: `Failed to get events`, severity: 'error' });
            setDisplaySnack(true);
        });
    }

    useEffect(() => {
        if (currentMonthBookings.length > 0) {
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
                // only clear booking in current day if on same month
                if (moment(currentMonth).format('MMM-YY') === moment(selectedDate).format('MMM-YY')) {
                    setCurrentDayBookings([]);
                }
            }
        }
    }, [selectedDate, currentMonthBookings]);

    return (
        <div style={{display: 'grid', gridTemplateColumns: 'auto 500px'}}>
            <GoogleCalendar location={location} currentMonthBookings={currentMonthBookings} />
            <GoogleCalendarOverview location={location} currentDayBookings={currentDayBookings} />
        </div>
    );
}

export default GoogleCalendarPage;
