import styled from '@emotion/styled';
// @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,700);
// @import url(https://fonts.googleapis.com/icon?family=Material+Icons);

export const CalendarWrapper = styled.div`
    .icon {
        font-family: 'Material Icons', serif;
        font-style: normal;
        display: inline-block;
        vertical-align: middle;
        line-height: 1;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;

        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
    }


    /* VARIABLES */

    :root {
        --main-color: #1a8fff;
        --text-color: #777;
        --text-color-light: #ccc;
        --border-color: #eee;
        --bg-color: #f9f9f9;
        --neutral-color: #fff;
    }


    /* GENERAL */

    * {
        box-sizing: border-box;
    }

    body {
        font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
        font-size: 1em;
        font-weight: 300;
        line-height: 1.5;
        color: var(--text-color);
        background: var(--bg-color);
        position: relative;
    }

    .header {
        display: block;
        width: 100%;
        padding: 1.75em 0;
        border-bottom: 1px solid #eee;
        background: var(--neutral-color);
    }

    .header #logo {
        font-size: 175%;
        text-align: center;
        color: var(--main-color);
        line-height: 1;
    }

    .header #logo .icon {
        padding-right: .25em;
    }

    main {
        display: block;
        margin: 0 auto;
        margin-top: 5em;
        max-width: 50em;
    }


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


    /* Calendar */
    
    .calendar {
        display: block;
        position: relative;
        width: 100%;
        background: var(--neutral-color);
        border: 1px solid #eee;
    }
    
    .header {
        text-transform: uppercase;
        font-weight: 700;
        font-size: 140%;
        padding: 1.5em 0;
        border-bottom: 1px solid #eee;
    }
    
    .calendar .header .icon {
        transform: scale(2.5);
        cursor: pointer;
        transition: .15s ease-out;
    }

    .calendar .header .icon:hover {
        transform: scale(2.5);
        transition: .25s ease-out;
        color: var(--main-color);
    }

    .calendar .header .icon:first-of-type {
        margin-left: 1em;
    }
    
    .calendar .header .icon:last-of-type {
        margin-right: 1em;
    }
    
    .calendar .days {
        text-transform: uppercase;
        font-weight: 400;
        //color: #ccc;
        font-size: 80%;
        padding: .75em 0;
        border-bottom: 1px solid #eee;
    }
    
    .calendar .body .cell {
        position: relative;
        height: 5em;
        border-right: 1px solid #eee;
        overflow: hidden;
        cursor: pointer;
        background: var(--neutral-color);
        transition: 0.25s ease-out;
    }
    
    .calendar .body .cell:hover {
        background: var(--bg-color);
        transition: 0.5s ease-out;
    }
    
    .calendar .body .selected {
        border-left: 10px solid transparent;
        border-image: linear-gradient(45deg, #1a8fff 0%,#53cbf1 40%);
        border-image-slice: 1;
    }
    
    .calendar .body .row {
        border-bottom: 1px solid #eee;
    }
    
    .calendar .body .row:last-child {
        border-bottom: none;
    }
    
    .calendar .body .cell:last-child {
        border-right: none;
    }
    
    .calendar .body .cell .number {
        position: absolute;
        font-size: 82.5%;
        line-height: 1;
        top: .75em;
        right: .75em;
        font-weight: 700;
    }
    
    .calendar .body .cell .closed {
        display: flex;
        justify-content: center;
        width: calc(100% - 25px);
        margin-top: 5px;
        color: gray;
    }
  
    .calendar .body .cell.today {
      background: #90caf9;
    }
  
    .calendar .body .cell .res {
      color: gray;
      display: flex;
      align-items: center;
        height: 100%;
        justify-content: center;
    }
    
    .calendar .body .disabled {
        color: #ccc;
        pointer-events: none;
    }
    
    .calendar .body .cell .bg {
        font-weight: 700;
        line-height: 1;
        color: var(--main-color);
        opacity: 0;
        font-size: 8em;
        position: absolute;
        top: -.2em;
        right: -.05em;
        transition: .25s ease-out;
        letter-spacing: -.07em;
    }
    
    .calendar .body .cell:hover .bg, .calendar .body .selected .bg  {
        opacity: 0.05;
        transition: .5s ease-in;
    }
    
    .calendar .body .col {
        flex-grow: 0;
        flex-basis: calc(100%/7);
        width: calc(100%/7);
    }
    @media (max-width: 660px) {
        .calendar .body .cell .closed {
            display: flex;
            justify-content: center;
            width: calc(100% - 25px);
            height: 100%;
            align-items: center;
            font-size: 10px;
            color: gray;
        }
    }
`;