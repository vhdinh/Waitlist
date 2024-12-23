import styled from '@emotion/styled';

export const GoogleCalendarWrapper = styled.div`
    // /* GRID */

    .row {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
    }

    .row-middle {
        align-items: center;
    }

    .col {
        flex-grow: 1;
        flex-basis: 0;
        max-width: 100%;
    }

    .col-start {
        justify-content: flex-start;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 24px;
    }

    .col-center {
        justify-content: center;
        text-align: center;
        display: flex;
        align-items: center;
    }

    .col-end {
        justify-content: flex-end;
        text-align: right;
        display: flex;
        gap: 22px;
        align-items: center;
    }

    .google-calendar {
        display: block;
        position: relative;
        width: 100%;
        margin-top: 12px;
        background: var(--neutral-color);
        border: 1px solid #eee;
        border-radius: 8px;
        .header {
            display: flex;
            margin: 12px 24px;
            .month-nav {
                display: flex;
                gap: 36px;
            }
            .month-year {
                text-transform: uppercase;
                font-size: 1.5em;
                font-weight: 600;
            }
            .icon {
                transform: scale(1.5);
                cursor: pointer;
                transition: .15s ease-out;
            }
        }
        // Days of the week
        .days {
            text-transform: uppercase;
            font-weight: 400;
            //color: #ccc;
            font-size: 80%;
            padding: .75em 0;
            border-bottom: 1px solid #eee;
        }
        .body {
            .selected {
                color: blue;
                //border-left: 10px solid transparent;
                //border-image: linear-gradient(45deg, #1a8fff 0%,#53cbf1 40%);
                //border-image-slice: 1;
            }
            // each day in the month
            .cell {
                position: relative;
                text-align: center;
                height: 7em;
                border-right: 1px solid #eee;
                overflow: hidden;
                cursor: pointer;
                background: var(--neutral-color);
                transition: 0.25s ease-out;
                .closed {
                    display: flex;
                    justify-content: center;
                    margin-top: 5px;
                    color: gray;
                }
                .number {
                    display: flex;
                    justify-content: center;
                    margin-top: 8px;
                    .today {
                        background: lightblue;
                        padding: 4px;
                        border-radius: 50%;
                        position: relative;
                        top: -6px;
                    }
                }
                .confirm-events {
                    padding-top: 8px;
                    &.today {
                        padding-top: 0;
                    }
                    .event {
                        font-size: 10px;
                        padding: 2px;
                        text-align: left;
                        text-overflow: ellipsis;
                        white-space: pre;
                        overflow: hidden;
                    }
                }
                &:last-child {
                    border-right: none;
                }
            }
            .row {
                border-bottom: 1px solid #eee;
            }
            .disabled {
                color: #ccc;
                //background: slategrey;
                pointer-events: none;
            }
        }
    }
    @media (max-width: 660px) {
        .calendar .body .cell .closed {
            display: flex;
            justify-content: center;
            height: 100%;
            align-items: center;
            font-size: 10px;
            color: gray;
        }
    }
`;