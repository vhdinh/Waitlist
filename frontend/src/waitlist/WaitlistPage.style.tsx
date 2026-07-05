import styled from '@emotion/styled';

export const WaitlistPageWrapper = styled.div`
    background: #1a1a1a;
    min-height: 100%;
    color: #e8eaed;

    .page-content {
        padding: 32px 40px;
        max-width: 900px;
        margin: 0 auto;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 32px;
    }

    .header-left {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .title {
        font-size: 2.5rem;
        font-weight: 600;
        color: #e8eaed;
        line-height: 1.1;
        text-align: left;
    }

    .subtitle {
        font-size: 0.95rem;
        color: #9aa0a6;
        margin-top: 4px;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .history-btn {
        color: #9aa0a6;
        border: 1px solid #444;
        border-radius: 10px;
        padding: 9px;
        &:hover {
            background: rgba(255,255,255,0.07);
            color: #e8eaed;
        }
    }

    .add-party-btn {
        background: #F5A623;
        color: #1a1a1a;
        font-weight: 600;
        font-size: 15px;
        text-transform: none;
        border-radius: 10px;
        padding: 10px 20px;
        white-space: nowrap;
        &:hover {
            background: #e09520;
        }
        .plus-icon {
            font-size: 18px;
            font-weight: 400;
            margin-right: 2px;
        }
    }

    .customer-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
`;
