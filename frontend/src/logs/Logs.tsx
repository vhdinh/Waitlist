import React from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import styled from '@emotion/styled';
import PhoneNumberColumn from "../waitlist/PhoneNumberColumn";
import moment from "moment";

const getColumns = (): GridColDef[] => {
    const arr: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            editable: false,
            sortable: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'partySize',
            headerName: 'Party',
            headerAlign: 'left',
            type: 'number',
            editable: false,
            sortable: false,
            flex: 1,
            align: 'left',
            minWidth: 150,
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone', // @ts-ignore
            renderCell: (params: GridRenderCellParams) => {
                return <PhoneNumberColumn {...params.row} />
            },
            sortable: false,
            flex: 1,
            align: 'left',
            minWidth: 150,
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            headerAlign: 'left',
            type: 'string',
            editable: false,
            sortable: true,
            flex: 1,
            align: 'left',
            valueFormatter: (params) => {
                if (params.value) {
                    return moment(params?.value).format('MM-DD-YY h:mm a');
                }
            },
            minWidth: 150,
        },
        {
            field: 'notified',
            headerName: 'Notified',
            headerAlign: 'left',
            type: 'boolean',
            editable: false,
            sortable: false,
            flex: 1,
            align: 'left',
            minWidth: 150,
        },
        {
            field: 'notifiedAt',
            headerName: 'Notified At',
            headerAlign: 'left',
            type: 'string',
            editable: false,
            sortable: true,
            flex: 1,
            align: 'left',
            valueFormatter: (params) => {
                if (params.value) {
                    return moment(params?.value).format('MM-DD-YY h:mm a');
                }
            },
            minWidth: 150,
        },
        {
            field: 'msg',
            headerName: 'Response',
            headerAlign: 'left',
            type: 'string',
            editable: false,
            sortable: false,
            flex: 1,
            align: 'left',
            valueFormatter: (params) => {
                if (params.value) {
                    if (params.value === '1') {
                        return 'Accepted';
                    }
                    return 'Declined';
                }
            },
            minWidth: 150,
        },
        {
            field: 'msgAt',
            headerName: 'Response At',
            headerAlign: 'left',
            type: 'string',
            editable: false,
            sortable: false,
            flex: 1,
            align: 'left',
            valueFormatter: (params) => {
                if (params.value) {
                    return moment(params?.value).format('MM-DD-YY h:mm a');
                }
            },
            minWidth: 150,
        },
        {
            field: 'deleted',
            headerName: 'Deleted',
            headerAlign: 'left',
            type: 'string',
            editable: false,
            sortable: false,
            flex: 1,
            align: 'left',
            minWidth: 150,
        },
    ];

    return arr;
}

interface Customer {
    id: number;
    createdAt: string;
    name: string;
    partySize: number;
    phoneNumber: number;
    updatedAt: string;
    msg?: string;
}

interface LogsProps {
    list: Customer[];
}

const LogsWrapper = styled.div`
    width: 100%;
    height: calc(100vh - 226px);
    .Mui-odd {
        background: #FCFCFC;
    }
`;

function Logs(props: LogsProps) {

    return (
        <LogsWrapper>
            <Box sx={{ height: 'inherit', width: '100%' }}>
                <DataGrid
                    rows={props.list}
                    columns={getColumns()}
                    // initialState={{
                    //     pagination: {
                    //         paginationModel: {
                    //             pageSize: 20,
                    //         },
                    //     },
                    // }}
                    // pageSizeOptions={[20]}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    hideFooter
                    rowSelection={false}
                    getRowId={(row) => row._id}
                    getRowClassName={(params) => {
                        let c = params.indexRelativeToCurrentPage % 2 === 0 ? 'Mui-even' : 'Mui-odd'
                        return c;
                    }}
                />
            </Box>
        </LogsWrapper>
    )
}

export default Logs;