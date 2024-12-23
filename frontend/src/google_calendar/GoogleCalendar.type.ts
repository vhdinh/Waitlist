

export interface GoogleCalendarEventType {
    summary?: string;
    description?: string;
    firstName?: string;
    phoneNumber?: number;
    partySize?: string;
    note?: string;
    // convert googles start time to unix timestamp
    startTime?: number;
    endTime?: number;
    start: {
        dateTime: string;
        date?: string;
        timeZone: string;
    },
    end: {
        dateTime: string;
        timeZone: string;
    },
    kind?: string;
    etag?: string;
    id?: string;
    status?: string;
    htmlLink?: string;
    created?: string;
    updated?: string;
    creator?: {
        email?: string;
    },
    organizer?: {
        email?: string;
        displayName?: string;
        self?: boolean;
    },
    iCalUID?: string;
    sequence?: number,
    reminders?: {
    useDefault?: boolean;
    },
    eventType?: string;
    location?: string;
}
