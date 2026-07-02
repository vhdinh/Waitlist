import React from 'react';
import styled from '@emotion/styled';
import { Role, useAppState } from '../context/App.provider';
import ActionColumn from './ActionColumn';
import { phoneNumberAutoFormat } from './PhoneNumberColumn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface Customer {
    _id: string;
    createdAt: string;
    name: string;
    partySize: number;
    phoneNumber: string;
    updatedAt: string;
    msg?: string;
    notified?: boolean;
    notifiedAt?: string;
}

interface ListProps {
    location: string;
    list: Customer[];
}

const CustomerCard = styled.div`
    background: #252525;
    border-radius: 12px;
    border-left: 3px solid #5c6bc0;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;

    .party-size-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 56px;
        background: #1e1e2e;
        border-radius: 8px;
        padding: 8px 12px;
        .party-number {
            font-size: 1.6rem;
            font-weight: 600;
            color: #e8eaed;
            line-height: 1;
        }
        .party-label {
            font-size: 0.6rem;
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
        gap: 6px;
    }

    .name-row {
        display: flex;
        align-items: center;
        gap: 10px;
        .customer-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: #e8eaed;
        }
        .status-badge {
            display: flex;
            align-items: center;
            gap: 5px;
            background: rgba(66, 133, 244, 0.15);
            border-radius: 20px;
            padding: 2px 10px;
            .status-dot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #4285f4;
                flex-shrink: 0;
            }
            .status-text {
                font-size: 0.75rem;
                color: #4285f4;
                font-weight: 500;
            }
        }
        .notified-badge {
            background: rgba(76, 175, 80, 0.15);
            .status-dot { background: #4caf50; }
            .status-text { color: #4caf50; }
        }
        .declined-badge {
            background: rgba(221, 44, 0, 0.15);
            .status-dot { background: #dd2c00; }
            .status-text { color: #dd2c00; }
        }
    }

    .meta-row {
        display: flex;
        align-items: center;
        gap: 20px;
        .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #9aa0a6;
            font-size: 0.85rem;
            svg {
                font-size: 0.95rem;
                color: #6b7280;
            }
        }
    }

    .actions-col {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }
`;

function formatAddedTime(createdAt: string): string {
    const date = new Date(createdAt);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getStatusBadgeClass(notified: boolean | undefined, msg: string | undefined): string {
    if (notified && msg === '1') return 'status-badge notified-badge';
    if (notified && msg === '6') return 'status-badge declined-badge';
    return 'status-badge';
}

function getStatusText(notified: boolean | undefined, msg: string | undefined): string {
    if (notified && msg === '1') return 'Accepted';
    if (notified && msg === '6') return 'Declined';
    if (notified) return 'Notified';
    return 'Waiting';
}

function List(props: ListProps) {
    const { role } = useAppState();
    const showAdminActions = role === Role.EMPLOYEE || role === Role.ADMIN;

    return (
        <>
            {props.list.map((customer) => (
                <CustomerCard key={customer._id}>
                    <div className="party-size-box">
                        <span className="party-number">{customer.partySize}</span>
                        <span className="party-label">Guests</span>
                    </div>
                    <div className="customer-info">
                        <div className="name-row">
                            <span className="customer-name">{customer.name}</span>
                            <span className={getStatusBadgeClass(customer.notified, customer.msg)}>
                                <span className="status-dot" />
                                <span className="status-text">{getStatusText(customer.notified, customer.msg)}</span>
                            </span>
                        </div>
                        <div className="meta-row">
                            {showAdminActions && (
                                <span className="meta-item">
                                    <PhoneIcon />
                                    {phoneNumberAutoFormat(customer.phoneNumber?.toString() ?? '')}
                                </span>
                            )}
                            <span className="meta-item">
                                <AccessTimeIcon />
                                Added {formatAddedTime(customer.createdAt)}
                            </span>
                        </div>
                    </div>
                    {showAdminActions && (
                        <div className="actions-col">
                            <ActionColumn
                                _id={customer._id as any}
                                name={customer.name}
                                party={customer.partySize}
                                notified={customer.notified ?? false}
                                notifiedAt={customer.notifiedAt}
                                phoneNumber={customer.phoneNumber}
                                msg={customer.msg ?? ''}
                                location={props.location}
                            />
                        </div>
                    )}
                </CustomerCard>
            ))}
        </>
    );
}

export default List;
