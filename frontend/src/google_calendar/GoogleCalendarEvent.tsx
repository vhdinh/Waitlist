import {GoogleCalendarEventType} from "./GoogleCalendar.type";
import {
    Button,
    Card,
    FormControl,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import moment from "moment";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, {memo, useMemo, useState} from "react";
import {getTodayTimeMapping, NewBookingType, TimeSlot} from "../calendar/util";
import {useCalendarState} from "../context/Calendar.provider";
import GoogleCalendarEditBooking from "./GoogleCalendarEditBooking";
import styled from "@emotion/styled";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

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
            setIsEditing(false)
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
                                        onClick={() => setOpenDialog(true)}
                                        sx={{width: '60px', height: '60px', display: getActionButtonDisabledState()?'none':null}}
                                        disabled={isEditing || isLoading}
                                    >
                                        <DeleteIcon fontSize={'large'} style={{color: 'black'}}/>
                                    </IconButton>
                                    <IconButton
                                        className={'icon'}
                                        sx={{width: '60px', height: '60px', display: getActionButtonDisabledState()?'none':null}}
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
