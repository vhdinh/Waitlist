import styled from '@emotion/styled';

export const AppWrapper = styled.div`
    .app-bar {
        background: #F7F7F8;
        img {
            width: 100px;
        }
        #menu-appbar {
            color: black;
        }
        .MuiToolbar-root {
            button {
                margin: 0 !important;
            }
        }
    }
    @media (max-width: 660px) {
        .app-bar {
            .MuiToolbar-root {
                height: 50px;
            }
        }
    }
    .snackbar {
        margin-top: 55px;
        .MuiPaper-root {
            color: white;
            font-weight: 600;
            font-size: 18px;
            svg {
                color: white;
            }
            display: flex;
            align-items: center;
        }
    }
    .MuiAlert-standardSuccess {
        background: #2E7D31;
    }
    .MuiAlert-standardError {
        background: red;
    }
    #body-content {
        height: 100%;
    }

    .waiting-screen {
        background: #F7F7F8;
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
                    //align-content: left;
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