import React, {useEffect, useState} from 'react';
import Calendar from './Calendar';
import CalendarOverview from './CalendarOverview';
import styled from "@emotion/styled";
import {RestaurantKey, setLocalStorageData} from "../utils/general";
import {endOfMonth, startOfMonth} from "date-fns";
import {useCalendarState} from "../context/Calendar.provider";

const CalendarPageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`
interface CalendarPageProps {
    location: string;
}

function CalendarPage(props: CalendarPageProps) {

    useEffect(() => {
        setLocalStorageData(RestaurantKey, props.location);
    }, []);

    return (
        <CalendarPageWrapper className={'calendar-page'}>
            <Calendar location={props.location} />
            <CalendarOverview location={props.location} />
        </CalendarPageWrapper>
    )
}

export default CalendarPage;