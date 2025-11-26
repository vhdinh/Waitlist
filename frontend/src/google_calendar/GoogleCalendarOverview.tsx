import { GoogleCalendarEventType } from "./GoogleCalendar.type";
import { Button, IconButton, Typography } from "@mui/material";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useCalendarState } from "../context/Calendar.provider";
import styled from "@emotion/styled";
import AddIcon from '@mui/icons-material/Add';
import GoogleCalendarNewBooking from "./GoogleCalendarNewBooking";
import GoogleCalendarEvent from "./GoogleCalendarEvent";
import { getDayFromTimestamp } from "../utils/date";
import { InitialGCNewBooking } from "../context/GoogleCalendar.provider";
import { useAppState } from "../context/App.provider";

const GoogleCalendarOverviewWrapper = styled.div`
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    // margin removed to rely on grid gap
    border: 1px solid #dadce0;
    border-radius: 8px;
    background-color: #fff;
    font-family: 'Roboto', sans-serif;
    display: flex;
    flex-direction: column;

    .co-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        
        .date-info {
            h5 {
                font-size: 18px;
                font-weight: 400;
                color: #3c4043;
                margin-bottom: 4px;
            }
            .subtitle {
                font-size: 12px;
                color: #70757a;
                font-weight: 500;
            }
        }

        .create-btn {
            text-transform: none;
            border-radius: 24px;
            padding: 6px 16px;
            font-weight: 500;
            box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
            background-color: #fff;
            color: #3c4043;
            
            &:hover {
                background-color: #f1f3f4;
                box-shadow: 0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15);
            }
        }
    }

    .event-container {
        overflow-y: auto;
        flex-grow: 1;
        padding-right: 4px; // Space for scrollbar
        
        /* Custom Scrollbar */
        &::-webkit-scrollbar {
            width: 8px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #dadce0;
            border-radius: 4px;
        }
    }

    @media (max-width: 1024px) {
        height: auto;
        min-height: 400px;
    }
`;

function GoogleCalendarOverview({ location, currentDayBookings }: { location: string, currentDayBookings: GoogleCalendarEventType[] }) {
    const { selectedDate, setGCBookingData, gcBookingData, setIsLoading, isLoading, setReloadCalendar, displayAddNewBooking, setDisplayAddNewBooking, isEditing } = useCalendarState();
    const { setSnackMsg, setDisplaySnack } = useAppState();

    const [day, setDay] = useState(getDayFromTimestamp(selectedDate));

    useEffect(() => {
        setDay(getDayFromTimestamp(selectedDate));
    }, [selectedDate]);

    const getActionButtonDisabledState = (): boolean => {
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
        const todayStartNow = todayStart.getTime();
        // disable the button for any day in the past
        if (selectedDate >= todayStartNow) {
            return false;
        }
        return true;
    }

    const disableButtonStateWhenClosed = (): boolean => {
        // Disable reservation for Kuma and 1988 on Sunday, not Open
        // kuma closed for Sunday
        // if (location === 'kuma' && day === 'Sunday') {
        //     return true;
        // }
        // 1988 closed for Sunday-Tuesday
        if (location === 'eight' && (day === 'Sunday' || day === 'Monday' || day === 'Tuesday')) {
            return true;
        }
        return false
    }

    const displayActionButtons = () => {
        if (!displayAddNewBooking && (!getActionButtonDisabledState() && !disableButtonStateWhenClosed())) {
            return (
                <Button
                    className="create-btn"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setGCBookingData(InitialGCNewBooking);
                        setDisplayAddNewBooking(true);
                    }}
                    disabled={getActionButtonDisabledState() || disableButtonStateWhenClosed() || isEditing}
                >
                    Create
                </Button>
            )
        }
        return null;
    }

    const getLabelText = () => {
        if (isEditing) return 'Editing reservation';
        if (displayAddNewBooking) return 'Adding new reservation';
        return `${currentDayBookings.length} Reservation${currentDayBookings.length !== 1 ? 's' : ''}`;
    }

    return (
        <GoogleCalendarOverviewWrapper >
            <div className={'co-header'}>
                <div className="date-info">
                    <Typography variant={'h5'}>
                        {format(selectedDate, 'MMMM dd')}
                    </Typography>
                    <Typography className="subtitle">
                        {getLabelText()}
                    </Typography>
                </div>

                {displayActionButtons()}
            </div>
            <div className={'event-container'}>
                {
                    displayAddNewBooking ? <GoogleCalendarNewBooking location={location} /> :
                        currentDayBookings.map((b, index) => (
                            <GoogleCalendarEvent {...b} key={`${index}-${b.id}-${b.summary}-${b.description}-${b.start.dateTime}-${b.end.dateTime}`} location={location} />
                        ))
                }
            </div>
        </GoogleCalendarOverviewWrapper>
    )
}

export default GoogleCalendarOverview;
