import { Button, FormControl, LinearProgress, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { GoogleCalendarEventType } from "./GoogleCalendar.type";
import { getTodayTimeMapping, TimeSlot } from "../calendar/util";
import { useCalendarState } from "../context/Calendar.provider";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { formatISO } from "date-fns";
import { gcColors } from "./GoogleCalendar.theme";
import { GCFormWrapper } from "./GCFormWrapper";

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
                dateTime: formatISO(new Date(startTime)),
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: formatISO(new Date(endTime)),
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
        <GCFormWrapper variant="edit">
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
        </GCFormWrapper>
    )
};

export default GoogleCalendarEditCatering;
