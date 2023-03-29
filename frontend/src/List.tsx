import React from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import ActionColumn from './ActionColumn';
import styled from '@emotion/styled';

const rows = [
    {
        id: 1,
        name: 'Vu',
        phoneNumber: '2063838985',
        party: 6
    },
    {
        id: 2,
        name: 'Monica',
        phoneNumber: '2063549543',
        party: 6
    },
    {
        id: 3,
        name: 'Maria',
        phoneNumber: '2063838935',
        party: 12
    }
];

const getColumns = (isAdmin: boolean): GridColDef[] => {
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
            headerName: 'Party Size',
            headerAlign: 'left',
            type: 'number',
            editable: true,
            sortable: false,
            flex: 1,
            align: 'left',
        },
    ];
    if (isAdmin) {
        arr.push({
            field: 'action',
            headerName: '', // @ts-ignore
            renderCell: (params: GridRenderCellParams) => {
                return <ActionColumn {...params.row} />
            },
            sortable: false,
            align: 'right',
            flex: 1,
        })
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
}

interface ListProps {
    isAdmin: boolean;
    list: Customer[];
}

const ListWrapper = styled.div`
    width: 100%;
`;

function List(props: ListProps) {

    return (
        <ListWrapper>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={props.list}
                    columns={getColumns(props.isAdmin)}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 20,
                            },
                        },
                    }}
                    pageSizeOptions={[20]}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    getRowId={(row) => row._id}
                />
            </Box>
        </ListWrapper>
    )
}

export default List;