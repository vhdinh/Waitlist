import React from 'react';
import styled from '@emotion/styled';
import Dialog from '@mui/material/Dialog';
import { DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Customer } from './List';
import { phoneNumberAutoFormat } from './PhoneNumberColumn';

interface WaitlistHistoryModalProps {
    open: boolean;
    close: () => void;
    list: Customer[];
}

const HistoryDialogPaper = {
    sx: {
        backgroundColor: '#1a1a1a',
        backgroundImage: 'none',
        border: '1px solid #333',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '600px',
    },
};

const HistoryWrapper = styled.div`
    .history-subtitle {
        color: #9aa0a6;
        font-size: 0.9rem;
        margin-bottom: 20px;
    }

    .history-empty {
        color: #9aa0a6;
        text-align: center;
        padding: 32px 0;
    }

    .history-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .history-card {
        background: #252525;
        border-radius: 10px;
        border-left: 3px solid #444;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 14px;

        &.is-deleted {
            border-left-color: #dd2c00;
        }

        &.is-seated {
            border-left-color: #4caf50;
        }

        .party-size-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 48px;
            background: #1e1e2e;
            border-radius: 8px;
            padding: 6px 10px;
            .party-number {
                font-size: 1.2rem;
                font-weight: 600;
                color: #e8eaed;
                line-height: 1;
            }
            .party-label {
                font-size: 0.55rem;
                color: #9aa0a6;
                letter-spacing: 0.08em;
                margin-top: 2px;
                text-transform: uppercase;
            }
        }

        .customer-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .name-row {
            display: flex;
            align-items: center;
            gap: 10px;
            .customer-name {
                font-size: 1rem;
                font-weight: 600;
                color: #e8eaed;
            }
        }

        .status-badge {
            display: flex;
            align-items: center;
            gap: 5px;
            border-radius: 20px;
            padding: 2px 10px;
            font-size: 0.7rem;
            font-weight: 500;

            &.deleted {
                background: rgba(221, 44, 0, 0.15);
                color: #dd2c00;
            }

            &.seated {
                background: rgba(76, 175, 80, 0.15);
                color: #4caf50;
            }
        }

        .meta-row {
            display: flex;
            align-items: center;
            gap: 16px;
            .meta-item {
                display: flex;
                align-items: center;
                gap: 5px;
                color: #9aa0a6;
                font-size: 0.8rem;
                svg {
                    font-size: 0.9rem;
                    color: #6b7280;
                }
            }
        }
    }
`;

function formatTime(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function WaitlistHistoryModal(props: WaitlistHistoryModalProps) {
    const historyEntries = props.list.filter((customer) => customer.deleted || customer.seated);

    const getStatus = (customer: Customer) => customer.seated ? 'seated' : 'deleted';

    return (
        <Dialog open={props.open} onClose={props.close} PaperProps={HistoryDialogPaper}>
            <DialogTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" style={{ color: '#e8eaed', fontWeight: 600 }}>
                    Today's History
                </Typography>
                <IconButton onClick={props.close} size="small" style={{ color: '#9aa0a6' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <HistoryWrapper>
                    <div className="history-subtitle">
                        {historyEntries.length} seated or removed {historyEntries.length === 1 ? 'party' : 'parties'} tonight
                    </div>
                    {
                        historyEntries.length === 0 ? (
                            <div className="history-empty">No seated or removed parties yet tonight.</div>
                        ) : (
                            <div className="history-list">
                                {historyEntries.map((customer) => {
                                    const status = getStatus(customer);
                                    return (
                                        <div className={`history-card is-${status}`} key={customer._id}>
                                            <div className="party-size-box">
                                                <span className="party-number">{customer.partySize}</span>
                                                <span className="party-label">Guests</span>
                                            </div>
                                            <div className="customer-info">
                                                <div className="name-row">
                                                    <span className="customer-name">{customer.name}</span>
                                                    <span className={`status-badge ${status}`}>
                                                        {status === 'seated' ? 'Seated' : 'Removed'}
                                                    </span>
                                                </div>
                                                <div className="meta-row">
                                                    <span className="meta-item">
                                                        <PhoneIcon />
                                                        {phoneNumberAutoFormat(customer.phoneNumber?.toString() ?? '')}
                                                    </span>
                                                    <span className="meta-item">
                                                        <AccessTimeIcon />
                                                        Added {formatTime(customer.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    }
                </HistoryWrapper>
            </DialogContent>
        </Dialog>
    );
}

export default WaitlistHistoryModal;
