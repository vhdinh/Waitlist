import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import {NewBooking} from "../calendar/util";

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
    bookingData: NewBooking;
    setBookingData: Dispatch<SetStateAction<NewBooking>>;
};

const CalendarContext = createContext<CalendarState>(
    {} as CalendarState,
);

CalendarContext.displayName = 'CalendarContext';

export const StartOfToday = new Date().setHours(0,0,0,0);
export const Today = new Date();

export const InitialNewBooking = {
    name: '',
    phoneNumber: undefined,
    startTime: 0,
    endTime: 0,
    partySize: 0,
    note: ''
};

export const CalendarProvider = ({
     children,
}: PropsWithChildren<Record<string, unknown>>) => {
    const [openCalendarOverview, setOpenCalendarOverview] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(Today);
    const [displayMonth ] = useState(Today);
    const [selectedDate, setSelectedDate] = useState(StartOfToday);
    const [reloadCalendar, setReloadCalendar] = useState(false);
    const [bookingData, setBookingData] = useState<NewBooking>(InitialNewBooking);

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
