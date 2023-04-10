import React from 'react';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import ActionColumn from './ActionColumn';
import styled from '@emotion/styled';
import { useAppState } from '../context/App.provider';
import CircleIcon from '@mui/icons-material/Circle';

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
            width: 150,
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
        background: #FCFCFC;
    }
    .accepts {
        background: #D8EEE1;
    }
    .accepts-icon {
        color: #D8EEE1;
    }
    .decline {
        background: #FBDBC1;
    }
    .decline-icon {
        color: #FBDBC1;
    }
`;

function List(props: ListProps) {
    const {isAdmin} = useAppState();

    return (
        <ListWrapper>
            {
                isAdmin ? (
                    <div style={{fontSize: '20px', display: 'flex', gap: 24, paddingBottom: 8, position: 'absolute', marginTop: '-28px'}}>
                        <span style={{display: 'flex', justifyItems: 'center', gap: 12}}>
                            <CircleIcon className={'accepts-icon'}/> Accepted
                        </span>
                        <span style={{display: 'flex', justifyItems: 'center', gap: 12}}>
                            <CircleIcon className={'decline-icon'}/> Declined
                        </span>
                    </div>
                ) : <></>
            }
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
                    getRowClassName={(params) => {
                        let c = '';
                        // user accepts
                        if (params.row.accepted === '1' && isAdmin) {
                            c += 'accepts';
                        } else if (params.row.accepted === '6' && isAdmin) {
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