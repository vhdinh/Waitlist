export interface Booking {
    _id?: string;
    name: string;
    phoneNumber: number;
    partySize: number;
    notified: boolean;
    msg: string;
    deleted: boolean;
    start: number;
    formatStart?: string;
    end: number;
    formatEnd?: string;
    note: string;
    createdAt: string;
    updatedAt: string;
    key?: number;
    location: string;
}
