import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState,
} from 'react';

export type CalendarState = {
    openCalendarOverview: boolean;
    setOpenCalendarOverview: Dispatch<SetStateAction<boolean>>;
};

const CalendarContext = createContext<CalendarState>(
    {} as CalendarState,
);

CalendarContext.displayName = 'CalendarContext';

export const CalendarProvider = ({
     children,
}: PropsWithChildren<Record<string, unknown>>) => {
    const [openCalendarOverview, setOpenCalendarOverview] = useState(false);

    return (
        <CalendarContext.Provider
            value={{
                openCalendarOverview,
                setOpenCalendarOverview
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
