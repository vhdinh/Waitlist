import styled from '@emotion/styled';

export const WaitlistPageWrapper = styled.div`
    .title {
        width: 100%;
        text-align: center;
    }
    .body-content {
        padding: 48px 8px;
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