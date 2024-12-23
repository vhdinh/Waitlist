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

export type GCalendarState = {
    reloadCalendar: boolean;
    setReloadCalendar: Dispatch<SetStateAction<boolean>>;
    displayMonth: Date;
    currentMonth: Date;
    setCurrentMonth: Dispatch<SetStateAction<Date>>;
    selectedDate: number;
    setSelectedDate: Dispatch<SetStateAction<number>>;
    displayAddNewBooking: boolean;
    setDisplayAddNewBooking: Dispatch<SetStateAction<boolean>>;
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    gcBookingData: GoogleCalendarEventType;
    setGCBookingData: Dispatch<SetStateAction<GoogleCalendarEventType>>;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const GCalendarContext = createContext<GCalendarState>(
    {} as GCalendarState,
);

GCalendarContext.displayName = 'GCalendarContext';

export const gcStartOfToday = new Date().setHours(0,0,0,0);
const setSpecificDate = (date: number) => new Date(date).setHours(0,0,0,0);
export const gcToday = new Date();

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
    },
    firstName: '',
    phoneNumber: undefined,
    partySize: '',
    note: '',
}

export const GoogleCalendarProvider = ({
                                     children,
                                 }: PropsWithChildren<Record<string, unknown>>) => {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { date } = useParams();

    const [currentMonth, setCurrentMonth] = useState(date ? new Date(Number(date)) : gcToday);
    const [displayMonth ] = useState(gcToday);
    const [selectedDate, setSelectedDate] = useState(date ? setSpecificDate(Number(date)) : gcStartOfToday);
    const [reloadCalendar, setReloadCalendar] = useState(false);
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

    return (
        <GCalendarContext.Provider
            value={{
                displayMonth,
                currentMonth,
                setCurrentMonth,
                selectedDate,
                setSelectedDate,
                reloadCalendar,
                setReloadCalendar,
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
        </GCalendarContext.Provider>
    );
};

export const useGCalendarState = () => {
    const context = useContext(GCalendarContext);
    if (!context) {
        throw new Error(
            `useGCalendarState must be used within a GCalendarProvider`,
        );
    }
    return context;
};
