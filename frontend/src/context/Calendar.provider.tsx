import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext, useEffect,
    useState,
} from 'react';
import {NewBookingType} from "../calendar/util";
import {
    useParams
} from "react-router-dom";
import {format} from 'date-fns';
import {GoogleCalendarEventType} from "../google_calendar/GoogleCalendar.type";

export type CalendarState = {
    reloadCalendar: boolean;
    setReloadCalendar: Dispatch<SetStateAction<boolean>>;
    openCalendarOverview: boolean;
    setOpenCalendarOverview: Dispatch<SetStateAction<boolean>>;
    displayMonth: Date;
    currentMonth: Date;
    setCurrentMonth: Dispatch<SetStateAction<Date>>;
    selectedDate: number;
    setSelectedDate: Dispatch<SetStateAction<number>>;
    bookingData: NewBookingType;
    setBookingData: Dispatch<SetStateAction<NewBookingType>>;
    displayAddNewBooking: boolean;
    setDisplayAddNewBooking: Dispatch<SetStateAction<boolean>>;
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    gcBookingData: GoogleCalendarEventType;
    setGCBookingData: Dispatch<SetStateAction<GoogleCalendarEventType>>;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const CalendarContext = createContext<CalendarState>(
    {} as CalendarState,
);

CalendarContext.displayName = 'CalendarContext';

export const StartOfToday = new Date().setHours(0,0,0,0);
const setSpecificDate = (date: number) => new Date(date).setHours(0,0,0,0);
export const Today = new Date();

export const InitialNewBooking = {
    name: '',
    phoneNumber: '',
    startDay: '',
    start: 0,
    end: 0,
    partySize: undefined,
    note: ''
};

export const InitialGCNewBooking: GoogleCalendarEventType = {
    start: {
        dateTime: new Date().toISOString(),
        timeZone: 'America/Los_Angeles'
    },
    startTime: 0,
    endTime: 0,
    end: {
        dateTime: new Date().toISOString(),
        timeZone: 'America/Los_Angeles'
    }
}

export const CalendarProvider = ({
     children,
}: PropsWithChildren<Record<string, unknown>>) => {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { date } = useParams();

    const [openCalendarOverview, setOpenCalendarOverview] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(date ? new Date(Number(date)) : Today);
    const [displayMonth ] = useState(Today);
    const [selectedDate, setSelectedDate] = useState(date ? setSpecificDate(Number(date)) : StartOfToday);
    const [reloadCalendar, setReloadCalendar] = useState(false);
    const [bookingData, setBookingData] = useState<NewBookingType>(InitialNewBooking);
    const [displayAddNewBooking, setDisplayAddNewBooking] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [gcBookingData, setGCBookingData] = useState<GoogleCalendarEventType>(InitialGCNewBooking);
    
    useEffect(() => {
        if (date) {
            setCurrentMonth(new Date(Number(date)));
            setSelectedDate(setSpecificDate(Number(date)));
        }
    }, []);

    useEffect(() => {
        setBookingData((oldState: NewBookingType) => ({
            ...oldState,
            startDay: format(new Date(selectedDate), 'EEEE'),
        }))
    }, [selectedDate])
    
    return (
        <CalendarContext.Provider
            value={{
                openCalendarOverview,
                setOpenCalendarOverview,
                displayMonth,
                currentMonth,
                setCurrentMonth,
                selectedDate,
                setSelectedDate,
                reloadCalendar,
                setReloadCalendar,
                bookingData,
                setBookingData,
                displayAddNewBooking,
                setDisplayAddNewBooking,
                isEditing,
                setIsEditing,
                gcBookingData,
                setGCBookingData,
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendarState = () => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error(
            `useCalendarState must be used within a CalendarProvider`,
        );
    }
    return context;
};
