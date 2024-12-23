import {GoogleCalendarEventType} from "./GoogleCalendar.type";
import {IconButton, Typography} from "@mui/material";
import {format} from "date-fns";
import React, {useEffect, useState} from "react";
import {useCalendarState} from "../context/Calendar.provider";
import SaveIcon from "@mui/icons-material/Save";
import styled from "@emotion/styled";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import GoogleCalendarNewBooking from "./GoogleCalendarNewBooking";
import GoogleCalendarEvent from "./GoogleCalendarEvent";
import {getDayFromTimestamp} from "../utils/date";
import {InitialGCNewBooking} from "../context/GoogleCalendar.provider";

const GoogleCalendarOverviewWrapper = styled.div`
  height: calc(100vh - 130px);
  padding: 16px;
    margin: 12px; 
    margin-right: 0; 
    border: 1px solid #eee;
    border-radius: 8px;
  .co-header {
    display: flex;
      gap: 12px;
    justify-content: space-between;
    margin-bottom: 8px;
    button, .icon {
      &.Mui-disabled {
          svg {
              color: gray !important;
          }
      }
        
    }
    .actions {
      display: flex;
      gap: 16px;
    }
  }
    .event-container {
        overflow-y: scroll;
        max-height: calc(100vh - 195px);
    }
    @media (max-width: 660px) {
        margin: 16px;
        width: unset;
    }
`;

function GoogleCalendarOverview({location, currentDayBookings} : {location: string, currentDayBookings: GoogleCalendarEventType[]}) {
    const {selectedDate,setGCBookingData,  gcBookingData, setIsLoading, isLoading, setReloadCalendar, displayAddNewBooking, setDisplayAddNewBooking, isEditing } = useCalendarState();
    const [day, setDay] = useState(getDayFromTimestamp(selectedDate));

    const validateBookingForm = () => {
        return !gcBookingData.firstName || !gcBookingData.phoneNumber || !gcBookingData.start  || !gcBookingData.end || !gcBookingData.partySize || !gcBookingData.note;
    }

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
        console.log('------disabling stuff---', location, selectedDate, day);

        // kuma closed for Sunday
        if (location === 'kuma' && day === 'Sunday') {
            return true;
        }
        // 1988 closed for Sunday-Tuesday
        if (location === 'eight' && (day === 'Sunday' || day === 'Monday' || day === 'Tuesday')) {
            return true;
        }
        return false
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
                setDisplayAddNewBooking(false);
                setReloadCalendar(true);
            }).finally(() => {
            setIsLoading(false);
        });
    }

    const displayActionButtons = () => {
        return (
            <div style={{ marginTop: '-8px' }}>
                {
                    !displayAddNewBooking ? (
                        <IconButton
                            className={'icon'}
                            onClick={() => {
                                setGCBookingData(InitialGCNewBooking);
                                setDisplayAddNewBooking(true);
                            }}
                            disabled={getActionButtonDisabledState() || disableButtonStateWhenClosed() || isEditing}
                        >
                            <AddCircleIcon fontSize={'large'} style={{ color: 'black'}} />
                        </IconButton>
                    ) : (
                        <div style={{display: 'flex', gap: '32px'}}>
                            <IconButton
                                className={'icon'}
                                onClick={() => setDisplayAddNewBooking(false)}
                                disabled={isLoading}
                            >
                                <CancelIcon fontSize={'large'} style={{ color: 'black'}} />
                            </IconButton>
                            <IconButton
                                className={'icon'}
                                onClick={() => saveGoogleCalendarEvent()}
                                disabled={validateBookingForm() || isLoading}
                            >
                                <SaveIcon fontSize={'large'} style={{ color: 'black'}} />
                            </IconButton>
                        </div>
                    )
                }
            </div>
        )
    }

    const  getLabelText = () => {
        if (isEditing) return 'Editing reservation';
        if (displayAddNewBooking) return 'Adding new reservation';
        return `${currentDayBookings.length} Reservation${currentDayBookings.length > 1 ? 's' : ''}`;
    }

    return (
        <GoogleCalendarOverviewWrapper >
            <div className={'co-header'}>
                <div>
                    <Typography variant={'h5'}>
                        Selected Date: {format(selectedDate, 'MMM dd')}
                    </Typography>
                    <Typography variant={'subtitle1'}>
                        <>{getLabelText()}</>
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
