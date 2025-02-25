import styled from '@emotion/styled';
import {Role} from "./context/App.provider";

interface AppWrapperProps {
    isAdmin: boolean;
    role: Role;
}

export const AppWrapper = styled.div<AppWrapperProps>`
    .app-bar {
        background: ${(props) => props.role === Role.USER ? '#F7F7F8' : props.role === Role.EMPLOYEE ? '#ff7961' : '#DFFFB9'};
        img {
            width: 100px;
            &.eight-eight {
                width: 50px;
            }
            &.kuma {
                width: 75px;
            }
        }
        #menu-appbar {
            color: black;
        }
        .MuiToolbar-root {
            button {
                margin: 0 !important;
            }
        }
        .admin {
            color: lightgray;
        }
        .select-restaurant {
            width: 100%;
            color: black;
            text-align: center;
        }
    }
    @media (max-width: 660px) {
        .app-bar {
            .MuiToolbar-root {
                height: 50px;
            }
        }
        #body-content {
            padding-left: 0;
            padding-right: 0;
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
        max-width: 100% !important;
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