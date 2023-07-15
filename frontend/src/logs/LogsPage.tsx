import React, {useEffect, useState} from 'react';
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import styled from "@emotion/styled";
import {
    Button,
    Container,
    Grid,
    Typography,
} from '@mui/material';
import Logs from "./Logs";

const LogsPageWrapper = styled.div`
  .MuiContainer-root {
    max-width: 100%;
  }
  padding: 36px 8px;
  @media (max-width: 660px) {
    padding: 24px 8px;
  }
  .MuiGrid-item {
    padding-left: 0 !important;
  }
  .search-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    .search-btn {
      background: black;
      color: white;
      font-size: 24px;
      width: 100%;
      &.Mui-disabled {
        background: #e0e0e0;
        color: #424242;
      }
    }
  }
  .logs-container {
    margin-top: 32px;
  }
`;

function LogsPage() {
    const [start, setStart] = React.useState<Dayjs | null>(null);
    const [end, setEnd] = React.useState<Dayjs | null>(null);
    const [endMinDate, setEndMinDate] = React.useState<Dayjs | null>(null);
    const [logs, setLogs] = useState([]);

    // useEffect(() => {
    //     if (start?.millisecond() > end?.millisecond()) {
    //         setEnd(null)
    //     } else {
    //         setEndMinDate(start);
    //     }
    // }, [start]);

    const handleLogsSearch = () => {
        // Simple GET request with a JSON body using fetch
        fetch(`${process.env.REACT_APP_BRICK_API}/customers/logs/${start?.valueOf()}/${end?.valueOf()}`)
            .then(res => res.json())
            .then((r) => {
                console.log('GOT LOGS', r);
                setLogs(r);
            });
    }

    return (
        <LogsPageWrapper>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Container>
                    <Grid container spacing={2}>
                        <Grid
                            className={'search-container'}
                            item
                            xs={5}
                            lg={5}
                        >
                            <Typography variant="h6">Start Date:</Typography>
                            <DatePicker value={start} onChange={(newValue) => setStart(newValue)} />
                        </Grid>
                        <Grid
                            className={'search-container'}
                            item
                            xs={5}
                            lg={5}
                        >
                            <Typography variant="h6">End Date:</Typography>
                            <DatePicker value={end} onChange={(newValue) => setEnd(newValue)} />
                        </Grid>
                        <Grid
                            className={'search-container'}
                            item
                            xs={2}
                            lg={2}
                        >
                            <Button
                                variant="contained"
                                size='large'
                                className={'search-btn'}
                                disabled={!start || !end}
                                onClick={() => handleLogsSearch()}
                            >
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className={'logs-container'}>
                        <Logs list={logs} />
                    </Grid>
                </Container>
            </LocalizationProvider>
        </LogsPageWrapper>
    )
}

export default LogsPage;