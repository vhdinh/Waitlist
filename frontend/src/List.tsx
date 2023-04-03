import React from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import ActionColumn from './ActionColumn';
import styled from '@emotion/styled';

const getColumns = (): GridColDef[] => {
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
        {
            field: 'action',
            headerName: '', // @ts-ignore
            renderCell: (params: GridRenderCellParams) => {
                return <ActionColumn {...params.row} />
            },
            sortable: false,
            align: 'right',
            width: 135,
        }
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
}

interface ListProps {
    list: Customer[];
}

const ListWrapper = styled.div`
    width: 100%;
    .Mui-odd {
        background: #F9F6FA;
    }
`;

function List(props: ListProps) {

    return (
        <ListWrapper>
            <Box sx={{ height: 'calc(100vh - 400px)', width: '100%' }}>
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
                    getRowId={(row) => row._id}
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'Mui-even' : 'Mui-odd'
                    }
                />
            </Box>
        </ListWrapper>
    )
}

export default List;