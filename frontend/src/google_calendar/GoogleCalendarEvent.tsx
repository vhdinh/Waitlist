import { GoogleCalendarEventType } from "./GoogleCalendar.type";
import {
    Button,
    Card,
    IconButton,
    LinearProgress,
} from "@mui/material";
import moment from "moment";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useMemo, useState } from "react";
import { getTodayTimeMapping, TimeSlot } from "../calendar/util";
import { useCalendarState } from "../context/Calendar.provider";
import GoogleCalendarEditBooking from "./GoogleCalendarEditBooking";
import styled from "@emotion/styled";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const GoogleCalendarEventWrapper = styled.div`
    margin-bottom: 12px;
    
    .event-card {
        border: 1px solid #dadce0;
        border-radius: 8px;
        padding: 12px 16px;
        box-shadow: none;
        transition: box-shadow 0.2s ease, background-color 0.2s ease;
        
        &:hover {
            box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
            background-color: #fff;
        }

        .event-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            
            .info {
                display: flex;
                flex-direction: column;
                gap: 4px;
                
                .summary {
                    font-size: 14px;
                    font-weight: 500;
                    color: #3c4043;
                }
                
                .time {
                    font-size: 12px;
                    color: #70757a;
                }

                .description {
                    font-size: 12px;
                    color: #70757a;
                    white-space: pre-line;
                    margin-top: 4px;
                }
            }

            .actions {
                display: flex;
                gap: 8px;
                
                .icon-btn {
                    padding: 8px;
                    color: #5f6368;
                    
                    &:hover {
                        background-color: #f1f3f4;
                        color: #202124;
                    }
                    
                    &.delete:hover {
                        color: #d93025;
                        background-color: #fce8e6;
                    }
                }
            }
        }
    }
`;

function GoogleCalendarEvent(props: GoogleCalendarEventType) {
    const [currentBooking] = useState<GoogleCalendarEventType>(props);
    const {
        selectedDate,
        setGCBookingData,
        isLoading,
        setIsLoading,
        isEditing,
        setIsEditing,
        setReloadCalendar,
    } = useCalendarState();
    const [isItemEditing, setIsItemEditing] = useState(false);
    const [isItemDeleting, setIsItemDeleting] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

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
        let path = '';
        if (props.location === 'brick') {
            path = `${process.env.REACT_APP_BRICK_API}/google-calendar-brick/delete-event/${props.id}`;
        } else {
            path = `${process.env.REACT_APP_BRICK_API}/google-calendar/delete-event/${props.id}`;
        }
        fetch(path, requestOptions)
            .then(res => res.json())
            .then((r) => {
                console.log('-----response from adding google event---', r);
                setReloadCalendar(true);
                setIsItemDeleting(false);
            }).finally(() => {
                setIsLoading(false);
                setIsEditing(false);
                setOpenDialog(false);
            });
    }

    const handleItemEditing = (editingState: boolean) => {
        setIsItemEditing(editingState);
        setIsEditing(editingState);
    }

    const getActionButtonDisabledState = (): boolean => {
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
        const todayStartNow = todayStart.getTime();
        // disable the button for any day in the past
        if (selectedDate >= todayStartNow) {
            return false;
        }
        return true;
    }


    return (
        <GoogleCalendarEventWrapper>
            {
                isItemEditing ? <GoogleCalendarEditBooking event={props} setHandleItemEditing={handleItemEditing} location={props.location || ''} /> : (
                    <Card className="event-card">
                        {
                            isLoading && isItemDeleting ? <LinearProgress /> : <div style={{ height: '4px' }} />
                        }
                        <div className="event-content">
                            <div className="info">
                                <div className="summary">
                                    {currentBooking.summary}
                                </div>
                                <div className="time">
                                    {currentBooking.start.dateTime ? moment(currentBooking.start.dateTime).format('h:mm A') : 'All Day'}
                                </div>
                                {
                                    currentBooking.description && (
                                        <div className="description">
                                            {currentBooking.description}
                                        </div>
                                    )
                                }
                            </div>
                            <div className="actions">
                                <IconButton
                                    className={'icon-btn delete'}
                                    onClick={() => setOpenDialog(true)}
                                    size="small"
                                    disabled={isEditing || isLoading || getActionButtonDisabledState()}
                                    style={{ display: getActionButtonDisabledState() ? 'none' : 'inline-flex' }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    className={'icon-btn'}
                                    size="small"
                                    disabled={isEditing || isLoading || getActionButtonDisabledState()}
                                    style={{ display: getActionButtonDisabledState() ? 'none' : 'inline-flex' }}
                                    onClick={() => {
                                        setGCBookingData(props);
                                        setIsItemEditing(true);
                                        setIsEditing(true);
                                    }}
                                >
                                    <ModeEditIcon fontSize="small" />
                                </IconButton>
                            </div>
                        </div>

                    </Card>
                )
            }
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={() => handleDeleteEvent()} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </GoogleCalendarEventWrapper>
    )
}

export default GoogleCalendarEvent;
