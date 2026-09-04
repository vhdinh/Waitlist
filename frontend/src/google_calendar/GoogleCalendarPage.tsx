import '@fontsource/playfair-display';
import GoogleCalendar from "./GoogleCalendar";
import GoogleCalendarOverview from "./GoogleCalendarOverview";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { GoogleCalendarEventType } from "./GoogleCalendar.type";
import { useCalendarState } from "../context/Calendar.provider";
import { useEffect, useRef, useState } from "react";
import { useAppState } from "../context/App.provider";
import styled from "@emotion/styled";
import { gcColors } from "./GoogleCalendar.theme";

const GoogleCalendarPageWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: hidden;
    gap: 12px;
    padding: 12px;
    box-sizing: border-box;
    background-color: ${gcColors.pageBg};

    // Ensure children take full height
    & > div {
        height: 100%;
    }

    // Calendar takes remaining space
    & > :first-of-type {
        flex: 1;
        min-width: 0; // Allow shrinking
    }

    // Overview panel fixed width
    & > :last-child {
        width: 400px;
        flex-shrink: 0;
    }

    @media (max-width: 1024px) {
        flex-direction: column;
        overflow-y: auto; // Allow vertical scrolling for the whole page on mobile if needed, or keep hidden if internal scrolling is preferred
        
        // Reset height for stacking
        & > div {
            height: auto;
        }

        & > :first-of-type {
            flex: none; // Calendar takes natural height or fixed height
            height: 600px; // Give it a fixed height on mobile so it scrolls internally
        }

        & > :last-child {
            width: 100%;
            flex: none;
        }
    }
`;


function GoogleCalendarPage({ location }: { location: string }) {
    const {
        currentMonth,
        selectedDate,
        setIsLoading,
        reloadCalendar,
        setReloadCalendar,
        setIsEditing,
    } = useCalendarState();
    const { setSnackMsg, setDisplaySnack } = useAppState();
    const [currentMonthBookings, setCurrentMonthBookings] = useState<GoogleCalendarEventType[]>([]);
    const [currentDayBookings, setCurrentDayBookings] = useState<GoogleCalendarEventType[]>([]);
    const latestBookingRequestId = useRef(0);
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
        // Tag each request so a slower, older response (e.g. from rapidly
        // clicking prev/next month) can't land after a newer one and
        // overwrite it with stale data.
        const requestId = ++latestBookingRequestId.current;
        let path = '';
        if (location === 'brick') {
            path = `${process.env.REACT_APP_BRICK_API}/google-calendar-brick/brick/${startOfMonth(currentMonth).toISOString()}/${endOfMonth(currentMonth).toISOString()}`;
        } else if (location === 'ocha') {
            path = `${process.env.REACT_APP_BRICK_API}/google-calendar-ocha/ocha/${startOfMonth(currentMonth).toISOString()}/${endOfMonth(currentMonth).toISOString()}`;
        } else {
            path = `${process.env.REACT_APP_BRICK_API}/google-calendar/${location === 'kuma' ? 'kuma' : '1988'}/${startOfMonth(currentMonth).toISOString()}/${endOfMonth(currentMonth).toISOString()}`;
        }
        fetch(path)
            .then(res => res.json())
            .then((r) => {
                if (requestId !== latestBookingRequestId.current) {
                    return;
                }
                if (r.message) {
                    setCurrentMonthBookings([]);
                } else {
                    if (r.mappedEvents) {
                        setCurrentMonthBookings(r.mappedEvents as GoogleCalendarEventType[]);
                    }
                }
                setIsLoading(false);
            }).catch((e) => {
                if (requestId !== latestBookingRequestId.current) {
                    return;
                }
                setSnackMsg({ msg: `Failed to get events`, severity: 'error' });
                setDisplaySnack(true);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        if (currentMonthBookings.length > 0) {
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
                // only clear booking in current day if on same month
                if (format(currentMonth, 'MMM-yy') === format(new Date(selectedDate), 'MMM-yy')) {
                    setCurrentDayBookings([]);
                }
            }
        }
    }, [selectedDate, currentMonthBookings]);

    return (
        <GoogleCalendarPageWrapper>
            <GoogleCalendar location={location} currentMonthBookings={currentMonthBookings} />
            <GoogleCalendarOverview location={location} currentDayBookings={currentDayBookings} />
        </GoogleCalendarPageWrapper>
    );
}

export default GoogleCalendarPage;
