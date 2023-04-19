import React from 'react';
import { Booking } from './Calendar.type';
import styled from '@emotion/styled';
import {Card, CardContent, Button, CardActions, Typography} from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from "@mui/icons-material/Add";
import ScheduleIcon from '@mui/icons-material/Schedule';
import {phoneNumberAutoFormat} from "../waitlist/PhoneNumberColumn";

const BookingComponentWrapper = styled.div`
    display: block;
  margin-bottom: 12px;
  .bc-content {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    padding: 16px !important;
    .bc-item {
      display: flex;
      
      .header {
        width: 75px;
      }
    }
    .bc-left, .bc-right {
      flex: 1;
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
    return (
        <BookingComponentWrapper>
            <Card>
                <CardContent className={'bc-content'}>
                    <div className={'bc-left'}>
                        <Typography variant={'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                Name:
                            </div>
                            <div>
                                {props.name}
                            </div>
                        </Typography>
                        <Typography variant={'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                Phone:
                            </div>
                            <div>
                                {phoneNumberAutoFormat(props.phoneNumber.toString())}
                            </div>
                        </Typography>
                        <Typography variant={'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                Party:
                            </div>
                            <div>
                                {props.partySize}
                            </div>
                        </Typography>
                    </div>
                    <div className={'bc-right'}>
                        <Typography variant={'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                Start:
                            </div>
                            <div>
                                {props.formatStart}
                            </div>
                        </Typography>
                        <Typography variant={'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                End:
                            </div>
                            <div>
                                {props.formatEnd}
                            </div>
                        </Typography>
                        <Typography variant={'h6'} className={'bc-item'}>
                            <div className={'header'}>
                                Note:
                            </div>
                            <div>
                                {props.note}
                            </div>
                        </Typography>
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