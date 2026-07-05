import styled from '@emotion/styled';
import { Role } from "./context/App.provider";

interface AppWrapperProps {
    isAdmin: boolean;
    role: Role;
}

export const AppWrapper = styled.div<AppWrapperProps>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #1a1a1a;

    .app-bar {
        background: #1a1a1a;
        flex-shrink: 0;
        box-shadow: none;
        border-bottom: 1px solid #2a2a2a;

        img {
            height: 30px;
            width: auto;
            filter: brightness(0) invert(1);
            &.eight-eight {
                height: 25px;
            }
            &.kuma {
                height: 30px;
            }
        }

        .nav-pill-container {
            display: flex;
            background: #2a2a2a;
            border-radius: 12px;
            padding: 4px;
            gap: 2px;
        }

        .nav-btn {
            text-transform: none;
            font-weight: 500;
            font-size: 15px;
            color: #9aa0a6;
            border-radius: 8px;
            min-width: 110px;
            padding: 6px 20px;
            &:hover {
                background-color: rgba(255, 255, 255, 0.06);
                color: #e8eaed;
            }
            &.active {
                background: #F5A623;
                color: #1a1a1a;
                font-weight: 600;
                &:hover {
                    background: #e09520;
                }
            }
        }
        #menu-appbar {
            color: white;
        }
        .MuiToolbar-root {
            button {
                margin: 0 !important;
            }
        }
        .admin {
            color: lightgray;
        }
        .admin-badge {
            display: flex;
            align-items: center;
            gap: 7px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.03em;
            padding: 6px 12px;
            border-radius: 20px;
            white-space: nowrap;

            .admin-badge-dot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                flex-shrink: 0;
            }

            &.is-admin {
                background: rgba(245, 166, 35, 0.15);
                color: #F5A623;
                .admin-badge-dot {
                    background: #F5A623;
                    box-shadow: 0 0 6px rgba(245, 166, 35, 0.8);
                }
            }

            &.is-employee {
                background: rgba(76, 175, 80, 0.15);
                color: #4caf50;
                .admin-badge-dot {
                    background: #4caf50;
                    box-shadow: 0 0 6px rgba(76, 175, 80, 0.8);
                }
            }
        }
        .select-restaurant {
            width: 100%;
            color: white;
            text-align: center;
        }
        svg {
            color: #9aa0a6 !important;
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
    
    // Target the Box component which is the direct child
    & > .MuiBox-root {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        height: 100%;
    }

    #body-content {
        flex: 1;
        height: 100%;
        max-width: 100% !important;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding-bottom: 12px; // Add spacing at the bottom
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