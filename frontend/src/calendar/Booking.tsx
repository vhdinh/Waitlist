import React from 'react';
import { Booking } from './Calendar.type';
import styled from '@emotion/styled';
import {Card, CardContent, Button, Typography} from "@mui/material";
import {phoneNumberAutoFormat} from "../waitlist/PhoneNumberColumn";
import {StartOfToday, useCalendarState} from "../context/Calendar.provider";
import useIsMobile from "../hook/useIsMobile";

const BookingComponentWrapper = styled.div`
    display: block;
  margin-bottom: 12px;
  .bc-content {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    padding: 0px !important;
    .bc-item {
      display: flex;
      
      .header {
        width: 75px;
      }
    }
    .bc-left {
      padding-left: 18px !important;
    }
    .bc-left, .bc-right {
      padding: 18px 0;
      flex: 1;
    }
  }
  .bc-actions {
    flex-basis: 100px;
    display: flex;
    flex-direction: column;
    border-left: 1px solid gray;
    .bc-edit {
      border-bottom: 1px solid gray;
    }
    .bc-delete, .bc-edit {
      flex-grow: 1;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  //.bc-actions {
  //  padding: 0 18px 18px 18px !important;
  //  .bc-item {
  //    display: flex;
  //    .header {
  //      width: 75px;
  //    }
  //  }
  //}
  button {
    color: black;
  }
`

function BookingComponent(props: Booking) {
    const { setReloadCalendar, selectedDate ,setBookingData, setDisplayAddNewBooking, setIsEditing } = useCalendarState();
    const isMobile = useIsMobile();

    const handleBookingEdit = () => {
        setBookingData(props);
        setIsEditing(true);
        setDisplayAddNewBooking(true);
        console.log('EDIT', props._id);
    }
    const handleBookingDelete = () => {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: props._id, delete: props.deleted ? false : true })
        };
        fetch(`${process.env.REACT_APP_BRICK_API}/${props.location}/booking/delete/${props._id}`, requestOptions)
            .then(res => res.json())
            .then((r) => {
                setReloadCalendar(true);
            });
    };

    const onDrag = (ev: any) => {
        const elem = document.createElement("div");
        elem.id = "drag-ghost";
        elem.style.position = "absolute";
        elem.style.background = 'teal';
        elem.style.color = 'white';
        elem.style.padding = '10px 30px';
        elem.style.borderRadius = '12px';
        elem.style.top = "-1000px";
        elem.textContent = `${props.name} (${props.partySize})`;
        document.body.appendChild(elem);
        ev.dataTransfer.setDragImage(elem, 0, 0);
        ev.dataTransfer.setData("text", `${ev.target.id}-${props.formatStart}-${props.formatEnd}`);
    }

    return (
        <BookingComponentWrapper
            draggable={true}
            onDragStart={onDrag}
            id={props._id}
        >
            <Card>
                <CardContent className={'bc-content'}>
                    <div className={'bc-left'}>
                        <Typography variant={isMobile ? 'body1' : 'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                Name:
                            </div>
                            <div>
                                {props.name}
                            </div>
                        </Typography>
                        <Typography variant={isMobile ? 'body1' : 'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                Phone:
                            </div>
                            <div>
                                {props.phoneNumber}
                            </div>
                        </Typography>
                        <Typography variant={isMobile ? 'body1' : 'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                Party:
                            </div>
                            <div>
                                {props.partySize}
                            </div>
                        </Typography>
                    </div>
                    <div className={'bc-right'}>
                        <Typography variant={isMobile ? 'body1' : 'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                Start:
                            </div>
                            <div>
                                {props.formatStart}
                            </div>
                        </Typography>
                        <Typography variant={isMobile ? 'body1' : 'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                End:
                            </div>
                            <div>
                                {props.formatEnd}
                            </div>
                        </Typography>
                        <Typography variant={isMobile ? 'body1' : 'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                Note:
                            </div>
                            <div>
                                {props.note}
                            </div>
                        </Typography>
                    </div>
                    <div className={'bc-actions'}>
                        <Button
                            className={'bc-edit'}
                            onClick={() => handleBookingEdit()}
                            disabled={props.deleted || StartOfToday > props.start}
                        >
                            EDIT
                        </Button>
                        <Button
                            className={`bc-delete ${props.deleted ? 'un-delete' : 'deleted'}`}
                            disabled={StartOfToday > props.start}
                            onClick={() => handleBookingDelete()}
                        >
                            {props.deleted ? 'UN-DELETE' : 'DELETE'}
                        </Button>
                    </div>
                </CardContent>
                {/*<CardActions className={'bc-actions'}>*/}
                {/*    <Typography variant={'h6'} className={'bc-item'}>*/}
                {/*        <div className={'header'}>*/}
                {/*            Note:*/}
                {/*        </div>*/}
                {/*        <div>*/}
                {/*            {props.note || 'NA'}*/}
                {/*        </div>*/}
                {/*    </Typography>*/}
                {/*</CardActions>*/}
            </Card>
        </BookingComponentWrapper>
    )
}

export default BookingComponent;