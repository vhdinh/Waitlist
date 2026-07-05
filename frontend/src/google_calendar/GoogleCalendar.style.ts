import styled from '@emotion/styled';
import { gcColors, gcFonts } from './GoogleCalendar.theme';

export const GoogleCalendarWrapper = styled.div`
    font-family: ${gcFonts.sans};
    color: ${gcColors.textPrimary};
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    /* GRID SYSTEM */
    .row {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .col {
        flex-grow: 1;
        flex-basis: 0;
        max-width: 100%;
        min-width: 0;
    }

    .col-center {
        justify-content: center;
        text-align: center;
        display: flex;
        align-items: center;
    }

    .google-calendar {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: ${gcColors.panelBg};
        border: 1px solid ${gcColors.border};
        border-radius: 8px;
        overflow: hidden;
        box-sizing: border-box;

        /* HEADER */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 24px;
            border-bottom: 1px solid ${gcColors.borderSubtle};
            flex-shrink: 0; // Prevent header from shrinking

            .month-nav {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .month-year {
                font-family: ${gcFonts.serif};
                font-size: 32px;
                font-weight: 500;
                color: ${gcColors.textPrimary};
                margin-left: 4px;
                min-width: 200px;
            }

            .icon {
                color: ${gcColors.textSecondary};
                padding: 8px;
                &:hover {
                    background-color: ${gcColors.panelBgHover};
                    color: ${gcColors.textPrimary};
                }
            }

            .today-btn {
                text-transform: none;
                color: ${gcColors.textPrimary};
                border: 1px solid ${gcColors.border};
                border-radius: 8px;
                padding: 6px 16px;
                font-weight: 500;
                font-size: 14px;
                &:hover {
                    background-color: ${gcColors.panelBgHover};
                    border-color: ${gcColors.border};
                }
            }
        }

        /* DAYS HEADER */
        .days {
            border-bottom: 1px solid ${gcColors.borderSubtle};
            padding: 10px 0;
            flex-shrink: 0; // Prevent days header from shrinking

            .col {
                font-size: 11px;
                font-weight: 500;
                color: ${gcColors.textSecondary};
                letter-spacing: 0.05em;
                text-transform: uppercase;

                &:last-child {
                    border-right: none;
                }
            }
        }

        .swipe-wrapper {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            min-height: 0;
        }

        /* CALENDAR BODY */
        .body {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto; // Allow scrolling within the calendar grid if needed
            min-height: 0; // Crucial for flexbox scrolling

            .row {
                flex-grow: 1;
                border-bottom: 1px solid ${gcColors.borderSubtle};
                min-height: 100px;
            }

            .cell {
                position: relative;
                border-right: 1px solid ${gcColors.borderSubtle};
                background: ${gcColors.panelBg};
                transition: background-color 0.1s ease;

                &:last-child {
                    border-right: none;
                }
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 4px;
                box-sizing: border-box;

                &:hover {
                    background-color: ${gcColors.panelBgHover}; // Subtle hover effect
                }

                &.disabled {
                    .number span {
                        color: ${gcColors.textMuted};
                    }
                }

                &.selected {
                    background-color: ${gcColors.selectedBg};
                    box-shadow: inset 0 0 0 1px ${gcColors.accent};
                    border-radius: 4px;
                }

                .number {
                    display: flex;
                    justify-content: flex-start;
                    font-size: 13px;
                    font-weight: 500;
                    color: ${gcColors.textPrimary};
                    margin-bottom: 4px;

                    span {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                    }

                    .today {
                        background-color: ${gcColors.accent};
                        color: ${gcColors.accentText};
                        font-weight: 700;
                    }
                }

                .closed {
                    font-size: 10px;
                    color: ${gcColors.danger};
                    background: ${gcColors.dangerBg};
                    padding: 2px 4px;
                    border-radius: 4px;
                    align-self: center;
                    margin-bottom: 2px;
                }

                .confirm-events {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    width: 100%;
                    overflow: hidden;

                    .event {
                        font-size: 10px; // Small text for events
                        font-weight: 500;
                        padding: 3px 6px;
                        border-radius: 4px;
                        background-color: ${gcColors.eventBg};
                        color: ${gcColors.textPrimary};
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        line-height: 1.4;

                        &:hover {
                            background-color: ${gcColors.eventBgHover};
                        }
                    }

                    .more-events {
                        font-size: 10px;
                        color: ${gcColors.accent};
                        padding: 0 4px;
                        font-weight: 500;
                        cursor: pointer;
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        .google-calendar .header {
            flex-direction: column;
            gap: 10px;
            .month-nav {
                width: 100%;
                justify-content: space-between;
            }
        }

        .cell {
            height: auto !important;
            min-height: 60px;
        }
    }
`;