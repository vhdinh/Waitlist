import {GoogleCalendarEventType} from "./GoogleCalendar.type";
import {Card, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Select, TextField} from "@mui/material";
import moment from "moment";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, {memo, useMemo, useState} from "react";
import {getTodayTimeMapping, NewBookingType, TimeSlot} from "../calendar/util";
import {useCalendarState} from "../context/Calendar.provider";
import GoogleCalendarEditBooking from "./GoogleCalendarEditBooking";
import styled from "@emotion/styled";

const GoogleCalendarEventWrapper = styled.div`
    button, .icon {
        &.Mui-disabled {
            svg {
                color: gray !important;
            }
        }

    }
`;

function GoogleCalendarEvent(props: GoogleCalendarEventType) {
    const [currentBooking ] = useState<GoogleCalendarEventType>(props);
    const {
        selectedDate,
        setGCBookingData,
        isLoading, setIsLoading,
        isEditing, setIsEditing,
        setReloadCalendar,
    } = useCalendarState();
    const [isItemEditing, setIsItemEditing] = useState(false);
    const [isItemDeleting, setIsItemDeleting] = useState(false);

    const memoizedGetTodayTimeMapping = useMemo((): TimeSlot[] =>
            getTodayTimeMapping(selectedDate),
        [selectedDate]
    );

    const handleDeleteEvent = () => {
        setIsLoading(true);
        setIsItemDeleting(true);
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(props)
        };
        fetch(`${process.env.REACT_APP_BRICK_API}/google-calendar/delete-event/${props.id}`, requestOptions)
            .then(res => res.json())
            .then((r) => {
                console.log('-----response from adding google event---', r);
                setReloadCalendar(true);
                setIsItemDeleting(false);
            }).finally(() => {
            setIsLoading(false);
            setIsEditing(false)
        });
    }

    const handleItemEditing = (editingState: boolean) => {
        setIsItemEditing(editingState);
        setIsEditing(editingState);
    }

    return (
        <GoogleCalendarEventWrapper>
            {
                isItemEditing ? <GoogleCalendarEditBooking event={props} setHandleItemEditing={handleItemEditing} location={props.location || ''} /> : (
                    <Card style={{border: '1px solid black', padding: '12px', paddingTop: '8px', margin: '12px 0'}}>
                        {
                            isLoading && isItemDeleting ? <LinearProgress /> : <div style={{ height: '4px' }} />
                        }
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: '12px',
                                lineHeight: '12px'
                            }}>
                                <>
                                    <div>
                                        {currentBooking.summary}
                                    </div>
                                    {
                                        currentBooking.description ? (
                                            <div style={{whiteSpace: 'pre-line', lineHeight: '1.25rem'}}>
                                                {currentBooking.description}
                                            </div>
                                        ) : <></>
                                    }

                                    <div>
                                        {moment(currentBooking.start.dateTime).format('h:mm A')}
                                    </div>
                                </>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row', gap: '24px', marginRight: '12px'}}>
                                <>
                                    <IconButton
                                        className={'icon'}
                                        onClick={() => handleDeleteEvent()}
                                        style={{width: '60px', height: '60px'}}
                                        disabled={isEditing || isLoading}
                                    >
                                        <DeleteIcon fontSize={'large'} style={{color: 'black'}}/>
                                    </IconButton>
                                    <IconButton
                                        className={'icon'}
                                        style={{width: '60px', height: '60px'}}
                                        disabled={isEditing || isLoading}
                                        onClick={() => {
                                            setGCBookingData(props);
                                            setIsItemEditing(true);
                                            setIsEditing(true);
                                        }}
                                    >
                                        <ModeEditIcon fontSize={'large'} style={{color: 'black'}}/>
                                    </IconButton>
                                </>
                            </div>
                        </div>

                    </Card>
                )
            }
        </GoogleCalendarEventWrapper>
    )
}

export default GoogleCalendarEvent;
