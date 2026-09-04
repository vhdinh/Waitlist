import styled from "@emotion/styled";
import { gcColors } from "./GoogleCalendar.theme";

// Shared by GoogleCalendarNewBooking / GoogleCalendarEditBooking /
// GoogleCalendarNewCatering / GoogleCalendarEditCatering - all four forms
// previously copy-pasted this same ~90-line styled block, differing only
// in outer margin (new forms sit above the event list, edit forms are
// inserted in place of the event being edited).
export const GCFormWrapper = styled.div<{ variant?: 'new' | 'edit' }>`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    border: 1px solid ${gcColors.border};
    border-radius: 8px;
    background-color: ${gcColors.panelBg};
    box-shadow: none;
    margin: ${(props) => (props.variant === 'edit' ? '12px 0' : '0 0 16px 0')};

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
