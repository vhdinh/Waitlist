import styled from '@emotion/styled';

export const GoogleCalendarWrapper = styled.div`
    font-family: 'Roboto', sans-serif;
    color: #3c4043;
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
        background: #fff;
        border: 1px solid #dadce0;
        border-radius: 8px;
        overflow: hidden;
        box-sizing: border-box;
        
        /* HEADER */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 24px;
            border-bottom: 1px solid #dadce0;
            flex-shrink: 0; // Prevent header from shrinking
            
            .month-nav {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .month-year {
                font-size: 22px;
                font-weight: 400;
                color: #3c4043;
                margin-left: 12px;
                min-width: 200px;
            }

            .icon {
                color: #5f6368;
                padding: 8px;
                &:hover {
                    background-color: #f1f3f4;
                }
            }
            
            .today-btn {
                text-transform: none;
                color: #3c4043;
                border: 1px solid #dadce0;
                border-radius: 4px;
                padding: 6px 12px;
                font-weight: 500;
                font-size: 14px;
                &:hover {
                    background-color: #f1f3f4;
                    border-color: #dadce0;
                }
            }
        }

        /* DAYS HEADER */
        .days {
            border-bottom: 1px solid #dadce0;
            padding: 8px 0;
            flex-shrink: 0; // Prevent days header from shrinking
            
            .col {
                font-size: 11px;
                font-weight: 500;
                color: #70757a;
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
                border-bottom: 1px solid #dadce0;
                min-height: 100px; 
            }

            .cell {
                position: relative;
                border-right: 1px solid #dadce0;
                background: #fff;
                transition: background-color 0.1s ease;
                
                &:last-child {
                    border-right: none;
                }
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 4px;

                &:hover {
                    background-color: #f8f9fa; // Subtle hover effect
                }

                &.disabled {
                    background-color: #f8f9fa;
                    .number span {
                        color: #70757a;
                        opacity: 0.5;
                    }
                }

                &.selected {
                    background-color: #e8f0fe;
                }

                .number {
                    display: flex;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 500;
                    color: #3c4043;
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
                        background-color: #1a73e8;
                        color: #fff;
                    }
                }

                .closed {
                    font-size: 10px;
                    color: #d93025;
                    background: #fce8e6;
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
                        padding: 2px 6px;
                        border-radius: 4px;
                        background-color: #039be5; // Google Calendar Blue
                        color: #fff;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        line-height: 1.4;
                        
                        &:hover {
                            filter: brightness(0.95);
                        }
                    }
                    
                    .more-events {
                        font-size: 10px;
                        color: #3c4043;
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