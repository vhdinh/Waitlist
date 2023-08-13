export interface Booking {
    _id?: string;
    name: string;
    phoneNumber: number;
    partySize: number;
    notified: boolean;
    msg: string;
    deleted: boolean;
    startTime: number;
    formatStart?: string;
    endTime: number;
    formatEnd?: string;
    note: string;
    createdAt: string;
    updatedAt: string;
    key?: number;
}
