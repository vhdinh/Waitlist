import styled from '@emotion/styled';

export const WaitlistPageWrapper = styled.div`
    .title {
        width: 100%;
        text-align: center;
    }
    @media (max-width: 660px) {
        .title {
            font-size: 4rem;
        }
    }
    .body-content {
        padding: 36px 8px;
        @media (max-width: 660px) {
            padding: 24px 8px;
        }
        .join-waitlist {
            width: 100%;
            display: flex;
            justify-content: center;
            button {
                background: black;
                color: white;
                font-size: 24px;
                min-width: 300px;
            }
            @media (max-width: 660px) {
                button {
                    font-size: 18px;
                    min-width: 250px;
                }
            }
        }
        .customer-list {
            margin-top: 48px;
            padding: 0 0 0 16px;
            .MuiDataGrid-columnHeaders {
                max-height: 75px !important;
            }
            .MuiDataGrid-columnHeaderTitle, .MuiDataGrid-cellContent {
                font-size: 24px;
                padding: 36px;
            }
            .MuiDataGrid-columnHeader, .MuiDataGrid-row, .MuiDataGrid-cell {
                height: 75px !important;
                max-height: 75px !important;
            }
            @media (max-width: 820px) {
                .MuiDataGrid-columnHeaderTitle, .MuiDataGrid-cellContent {
                    font-size: 18px;
                    padding: 8px;
                }
                .MuiDataGrid-columnHeader, .MuiDataGrid-row, .MuiDataGrid-cell {
                    height: 50px !important;
                    max-height: 50px !important;
                }
            }
            @media (max-width: 660px) {
                .MuiDataGrid-columnHeaderTitle, .MuiDataGrid-cellContent {
                    font-size: 12px;
                    padding: 8px;
                }
                .MuiDataGrid-columnHeader, .MuiDataGrid-row, .MuiDataGrid-cell {
                    height: 50px !important;
                    max-height: 50px !important;
                }
            }
            .MuiDataGrid-cell:focus {
                outline: none !important;
            }
            .MuiDataGrid-columnSeparator {
                display: none;
            }
            .customer {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-content: 
                font-size: 24px !important;
                align-items: center;
                border-bottom: 1px solid gray;
                padding: 24px 0;
                .name {
                    width: 40%;
                }
                .party {
                    display: flex;
                    align-items: center;
                    align-content: left;
                    gap: 12px;
                    width: 20%;
                }
                .customer-action {
                    display: flex;
                    gap: 12px;
                }
            }
        }
    }
`;