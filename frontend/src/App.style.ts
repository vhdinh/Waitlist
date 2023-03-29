import styled from '@emotion/styled';


export const AppWrapper = styled.div`
    .waiting-screen {
        background: yellow;
        width: 100%;
        height: 100vh;
        .ws-content {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            // text-align: center;
            img {
                max-width: 250px;
            }
        }
    }
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
        }
        .customer-list {
            margin-top: 48px;
            padding: 0 0 0 16px;
            .customer {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-content: 
                font-size: 24px;
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
                    gap: 24px;
                }
            }
        }
    }
    
`;