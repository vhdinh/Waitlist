import styled from "@emotion/styled";
import { Button, FormControl, LinearProgress, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { GoogleCalendarEventType } from "./GoogleCalendar.type";
import { getTodayTimeMapping, TimeSlot } from "../calendar/util";
import { useCalendarState } from "../context/Calendar.provider";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment/moment";
import { gcColors } from "./GoogleCalendar.theme";

const GCEditCateringWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid ${gcColors.border};
    border-radius: 8px;
    background-color: ${gcColors.panelBg};
    box-shadow: none;
    margin: 12px 0;

    .input-label {
        font-size: 14px;
        font-weight: 500;
        color: ${gcColors.textPrimary};
        margin-bottom: 4px;
    }

    .row {
        display: flex;
        gap: 16px;
        width: 100%;
    }

    .field-container {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 8px;
    }

    .MuiOutlinedInput-root {
        border-radius: 4px;
        font-size: 14px;
        color: ${gcColors.textPrimary};
        background-color: ${gcColors.panelBgHover};

        .MuiOutlinedInput-notchedOutline {
            border-color: ${gcColors.border};
        }

        &:hover .MuiOutlinedInput-notchedOutline {
            border-color: ${gcColors.accent};
        }

        &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: ${gcColors.accent};
            border-width: 2px;
        }
    }

    .MuiSelect-icon {
        color: ${gcColors.textSecondary};
    }

    .MuiButton-root {
        text-transform: none;
        font-weight: 500;
        border-radius: 8px;
        box-shadow: none;

        &:hover {
            box-shadow: none;
        }
    }
`;

interface GoogleCalendarEditCateringProps {
    event: GoogleCalendarEventType;
    setHandleItemEditing: (isEditing: boolean) => void;
}

function GoogleCalendarEditCatering(props: GoogleCalendarEditCateringProps) {
    const { selectedDate, setIsEditing, isLoading, setIsLoading, setReloadCalendar, setDisplayAddNewBooking } = useCalendarState();

    const selectMenuProps = {
        PaperProps: {
            sx: {
                backgroundColor: gcColors.panelBgHover,
                color: gcColors.textPrimary,
                border: `1px solid ${gcColors.border}`,
                '& .MuiMenuItem-root.Mui-selected': { backgroundColor: gcColors.eventBg },
                '& .MuiMenuItem-root:hover': { backgroundColor: gcColors.eventBg },
            },
        },
    };

    const [title, setTitle] = useState(props.event.summary?.replace(/^Catering:\s*/, '') || '');
    const [note, setNote] = useState(props.event.description || '');
    const [startTime, setStartTime] = useState(props.event.startTime || 0);
    const [endTime, setEndTime] = useState(props.event.endTime || 0);

    const memoizedGetTodayTimeMapping = useMemo((): TimeSlot[] =>
        getTodayTimeMapping(selectedDate),
        [selectedDate]
    );

    const validateCateringForm = () => {
        return !title || !startTime || !endTime;
    }

    const updateGoogleCalendarCateringEvent = () => {
        setIsLoading(true);
        const updatedEvent = {
            id: props.event.id,
            summary: `Catering: ${title}`,
            description: note,
            start: {
                dateTime: moment(startTime).format(),
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: moment(endTime).format(),
                timeZone: 'America/Los_Angeles',
            },
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEvent)
        };
        fetch(`${process.env.REACT_APP_BRICK_API}/google-calendar-ocha/update-catering-event`, requestOptions)
            .then(res => res.json())
            .then(() => {
                setReloadCalendar(true);
                props.setHandleItemEditing(false);
            }).finally(() => {
                setIsLoading(false);
                setIsEditing(false);
            });
    }

    return (
        <GCEditCateringWrapper>
            {isLoading && <LinearProgress sx={{ backgroundColor: gcColors.eventBg, '& .MuiLinearProgress-bar': { backgroundColor: gcColors.accent } }} />}

            <div className="row">
                <div className="field-container">
                    <Typography className="input-label">Title</Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        disabled={isLoading}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        size="small"
                    />
                </div>
            </div>

            <div className="row">
                <div className="field-container">
                    <Typography className="input-label">Start Time</Typography>
                    <FormControl fullWidth size="small">
                        <Select
                            value={startTime}
                            disabled={isLoading}
                            onChange={(e) => setStartTime(Number(e.target.value))}
                            MenuProps={selectMenuProps}
                        >
                            {memoizedGetTodayTimeMapping.map((t: TimeSlot) => (
                                <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="field-container">
                    <Typography className="input-label">End Time</Typography>
                    <FormControl fullWidth size="small">
                        <Select
                            value={endTime}
                            disabled={isLoading}
                            onChange={(e) => setEndTime(Number(e.target.value))}
                            MenuProps={selectMenuProps}
                        >
                            {memoizedGetTodayTimeMapping
                                .filter((t) => t.value >= startTime)
                                .map((t) => (
                                    <MenuItem value={t.value} key={t.value}>{t.label}</MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className="row">
                <div className="field-container">
                    <Typography className="input-label">Notes</Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={note}
                        multiline
                        disabled={isLoading}
                        onChange={(e) => setNote(e.target.value)}
                        autoComplete="off"
                        size="small"
                    />
                </div>
            </div>

            <div className="actions">
                <Button
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    disabled={isLoading}
                    onClick={() => {
                        setIsEditing(false);
                        setDisplayAddNewBooking(false);
                        props.setHandleItemEditing(false);
                    }}
                    style={{ color: gcColors.textPrimary, borderColor: gcColors.border }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={validateCateringForm() || isLoading}
                    onClick={updateGoogleCalendarCateringEvent}
                    style={{ backgroundColor: gcColors.accent, color: gcColors.accentText }}
                >
                    Update
                </Button>
            </div>
        </GCEditCateringWrapper>
    )
};

export default GoogleCalendarEditCatering;
