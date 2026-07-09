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
import ScheduleIcon from '@mui/icons-material/Schedule';
import React, { useMemo, useState } from "react";
import { getTodayTimeMapping, TimeSlot } from "../calendar/util";
import { useCalendarState } from "../context/Calendar.provider";
import GoogleCalendarEditBooking from "./GoogleCalendarEditBooking";
import GoogleCalendarEditCatering from "./GoogleCalendarEditCatering";
import styled from "@emotion/styled";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { gcColors, gcFonts } from "./GoogleCalendar.theme";

const GoogleCalendarEventWrapper = styled.div`
    margin-bottom: 12px;

    .event-card {
        border: 1px solid ${gcColors.border};
        border-left: 3px solid ${gcColors.accent};
        border-radius: 8px;
        padding: 14px 16px;
        box-shadow: none;
        background-color: ${gcColors.panelBg};
        transition: background-color 0.2s ease;

        &:hover {
            background-color: ${gcColors.panelBgHover};
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
                    font-family: ${gcFonts.serif};
                    font-size: 20px;
                    font-weight: 500;
                    color: ${gcColors.textPrimary};
                    margin-bottom: 2px;
                }

                .time {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    color: ${gcColors.textSecondary};

                    svg {
                        font-size: 16px;
                        color: ${gcColors.accent};
                    }
                }

                .description {
                    font-size: 12px;
                    color: ${gcColors.textSecondary};
                    white-space: pre-line;
                    margin-top: 4px;
                }
            }

            .actions {
                display: flex;
                gap: 8px;

                .icon-btn {
                    padding: 8px;
                    border-radius: 8px;
                    color: ${gcColors.textSecondary};
                    background-color: ${gcColors.eventBg};

                    &:hover {
                        background-color: ${gcColors.eventBgHover};
                        color: ${gcColors.textPrimary};
                    }

                    &.delete:hover {
                        color: ${gcColors.danger};
                        background-color: ${gcColors.dangerBg};
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
    const isCatering = currentBooking.sourceCalendar === 'banquet';

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
        } else if (props.location === 'ocha') {
            path = isCatering
                ? `${process.env.REACT_APP_BRICK_API}/google-calendar-ocha/delete-catering-event/${props.id}`
                : `${process.env.REACT_APP_BRICK_API}/google-calendar-ocha/delete-event/${props.id}`;
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
                isItemEditing ? (
                    isCatering
                        ? <GoogleCalendarEditCatering event={props} setHandleItemEditing={handleItemEditing} />
                        : <GoogleCalendarEditBooking event={props} setHandleItemEditing={handleItemEditing} location={props.location || ''} />
                ) : (
                    <Card className="event-card">
                        {
                            isLoading && isItemDeleting ? <LinearProgress sx={{ backgroundColor: gcColors.eventBg, '& .MuiLinearProgress-bar': { backgroundColor: gcColors.accent } }} /> : <div style={{ height: '4px' }} />
                        }
                        <div className="event-content">
                            <div className="info">
                                <div className="summary">
                                    {currentBooking.summary}
                                </div>
                                <div className="time">
                                    <ScheduleIcon />
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
                PaperProps={{
                    style: {
                        backgroundColor: gcColors.panelBg,
                        color: gcColors.textPrimary,
                        border: `1px solid ${gcColors.border}`,
                    },
                }}
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{ color: gcColors.textSecondary }}>
                        Are you sure you want to delete event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} style={{ color: gcColors.textSecondary }}>Cancel</Button>
                    <Button onClick={() => handleDeleteEvent()} autoFocus style={{ color: gcColors.danger }}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </GoogleCalendarEventWrapper>
    )
}

export default GoogleCalendarEvent;
