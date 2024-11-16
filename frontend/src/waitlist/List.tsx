import React from 'react';
import {Box} from '@mui/material';
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import ActionColumn from './ActionColumn';
import styled from '@emotion/styled';
import {Role, useAppState} from '../context/App.provider';
import PhoneNumberColumn from './PhoneNumberColumn';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import PhonelinkEraseIcon from '@mui/icons-material/PhonelinkErase';

const getColumns = (isAdmin: boolean, location: string): GridColDef[] => {
    const arr: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            editable: true,
            sortable: false,
            flex: 1,
        },
        {
            field: 'partySize',
            headerName: 'Party',
            headerAlign: 'left',
            type: 'number',
            editable: true,
            sortable: false,
            flex: 1,
            align: 'left',
        }
    ];

    if (isAdmin) {
        arr.push(
            {
                field: 'phoneNumber',
                headerName: 'Phone', // @ts-ignore
                renderCell: (params: GridRenderCellParams) => {
                    return <PhoneNumberColumn {...params.row} />
                },
                sortable: false,
                flex: 1,
                align: 'left',
            }
        )
        arr.push(
            {
                field: 'action',
                headerName: '', // @ts-ignore
                renderCell: (params: GridRenderCellParams) => {
                    return <ActionColumn { ...params.row} location={location} />
                },
                sortable: false,
                align: 'right',
                width: 150,
            }
        )
    }
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

interface ListProps {
    location: string;
    list: Customer[];
}

const ListWrapper = styled.div`
    width: 100%;
    .Mui-odd {
        background: #FCFCFC;
    }
    .accepts {
        // background: #1b5e20;
    }
    .accepts-icon {
        // color: #D8EEE1;
        color: #4caf50;
    }
    .decline {
        // background: #dd2c00;
    }
    .decline-icon {
        // color: #FBDBC1;
        color: #dd2c00;
    }
    input {
      font-size: 24px;
    }
`;

function List(props: ListProps) {
    const {isAdmin, role} = useAppState();

    return (
        <ListWrapper>
            {
                role === Role.EMPLOYEE || role === Role.ADMIN ? (
                    <div style={{fontSize: '20px', display: 'flex', gap: 24, paddingBottom: 8, position: 'absolute', marginTop: '-28px'}}>
                        <span style={{display: 'flex', justifyItems: 'center', gap: 12}}>
                            <MobileFriendlyIcon className={'accepts-icon'}/> Accepted
                        </span>
                        <span style={{display: 'flex', justifyItems: 'center', gap: 12}}>
                            <PhonelinkEraseIcon className={'decline-icon'}/> Declined
                        </span>
                    </div>
                ) : <></>
            }
            <Box sx={{ height: 'calc(100vh - 400px)', width: '100%' }}>
                <DataGrid
                    rows={props.list}
                    columns={getColumns(role === Role.EMPLOYEE || role === Role.ADMIN, props.location)}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    hideFooterPagination
                    hideFooterSelectedRowCount
                    hideFooter
                    rowSelection={false}
                    getRowId={(row) => row._id}
                    getRowClassName={(params) => {
                        let c = '';
                        // user accepts
                        if (params.row.msg === '1' && (role === Role.EMPLOYEE || role === Role.ADMIN)) {
                            c += 'accepts';
                        } else if (params.row.msg === '6' && (role === Role.EMPLOYEE || role === Role.ADMIN)) {
                            c += 'decline';
                        }
                        c += params.indexRelativeToCurrentPage % 2 === 0 ? ' Mui-even' : ' Mui-odd'
                        return c;
                    }}
                />
            </Box>
        </ListWrapper>
    )
}

export default List;