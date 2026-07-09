import {
    Button,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Typography,
    LinearProgress
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { getTodayTimeMapping, TimeSlot } from "../calendar/util";
import { useCalendarState } from "../context/Calendar.provider";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { gcColors } from "./GoogleCalendar.theme";

const GCNewCateringWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid ${gcColors.border};
    border-radius: 8px;
    background-color: ${gcColors.panelBg};
    box-shadow: none;
    margin-bottom: 16px;

    .input-label {
        font-size: 14px;
        font-weight: 500;
        color: ${gcColors.textPrimary};
        margin-bottom: 4px;
    }

    .helper-text {
        color: ${gcColors.textMuted} !important;
        font-size: 12px !important;
        margin-left: 0 !important;
        margin-top: 4px !important;
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

function GoogleCalendarNewCatering() {
    const {
        selectedDate,
        isLoading,
        setDisplayAddNewBooking,
        setIsLoading,
        setReloadCalendar,
    } = useCalendarState();

    const memoizedGetTodayTimeMapping = useMemo((): TimeSlot[] =>
        getTodayTimeMapping(selectedDate),
        [selectedDate]
    );

    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

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

    useEffect(() => {
        if (startTime) {
            const twoHrsLater = startTime + 7200000;
            const endT = memoizedGetTodayTimeMapping.find((t) => t.value === twoHrsLater);
            if (endT) {
                setEndTime(endT.value);
            } else {
                setEndTime(memoizedGetTodayTimeMapping[memoizedGetTodayTimeMapping.length - 1].value);
            }
        }
    }, [startTime])

    const resetForm = () => {
        setTitle('');
        setNote('');
        setStartTime(0);
        setEndTime(0);
    }

    const validateCateringForm = () => {
        return !title || !startTime || !endTime;
    }

    const saveGoogleCalendarCateringEvent = () => {
        setIsLoading(true);
        const newEvent = {
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
        const requestOption = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        }
        fetch(`${process.env.REACT_APP_BRICK_API}/google-calendar-ocha/add-catering-event`, requestOption)
            .then(res => res.json())
            .then(() => {
                resetForm();
                setDisplayAddNewBooking(false);
                setReloadCalendar(true);
            }).finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <GCNewCateringWrapper>
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
                        resetForm();
                        setDisplayAddNewBooking(false)
                    }}
                    style={{ color: gcColors.textPrimary, borderColor: gcColors.border }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={validateCateringForm() || isLoading}
                    onClick={saveGoogleCalendarCateringEvent}
                    style={{ backgroundColor: gcColors.accent, color: gcColors.accentText }}
                >
                    Save
                </Button>
            </div>
        </GCNewCateringWrapper>
    )
}

export default GoogleCalendarNewCatering;
