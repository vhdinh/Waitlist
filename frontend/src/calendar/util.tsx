import moment from "moment";

export interface NewBookingType {
    name: string;
    phoneNumber?: number;
    startTime: number;
    endTime: number;
    partySize: number;
    note?: string;
    msg?: string;
    notified?: boolean;
}

interface TimeSlot {
    label: string;
    value: number
}
interface TimeSlotNew {
    label: string;
    value: string
}

export const TimeMapping: TimeSlot[] = [
    {
        label: '11:00 AM',
        value: 1100,
    },
    {
        label: '11:30 AM',
        value: 1130,
    },
    {
        label: '12:00 PM',
        value: 1200,
    },
    {
        label: '12:30 PM',
        value: 1230,
    },
    {
        label: '1:00 PM',
        value: 1300,
    },
    {
        label: '1:30 PM',
        value: 1330,
    },
    {
        label: '2:00 PM',
        value: 1400,
    },
    {
        label: '2:30 PM',
        value: 1430,
    },
    {
        label: '3:00 PM',
        value: 1500,
    },
    {
        label: '3:30 PM',
        value: 1530,
    },
    {
        label: '4:00 PM',
        value: 1600,
    },
    {
        label: '4:30 PM',
        value: 1630,
    },
    {
        label: '5:00 PM',
        value: 1700,
    },
    {
        label: '5:30 PM',
        value: 1730,
    },
    {
        label: '6:00 PM',
        value: 1800,
    },
    {
        label: '6:30 PM',
        value: 1830,
    },
    {
        label: '7:00 PM',
        value: 1900,
    },
    {
        label: '7:30 PM',
        value: 1930,
    },
    {
        label: '8:00 PM',
        value: 2000,
    },
    {
        label: '8:30 PM',
        value: 2030,
    },
    {
        label: '9:00 PM',
        value: 2100,
    },
    {
        label: '9:30 PM',
        value: 2130,
    },
    {
        label: '10:00 PM',
        value: 2200,
    },
    {
        label: '10:30 PM',
        value: 2230,
    },
    {
        label: '11:00 PM',
        value: 2300,
    },
];

export const getFormattedTime = (time: number) => {
    const d = new Date(time);
    return moment(d).format('h:mm A');
}
function getFormattedDate(date: Date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return month + '/' + day + '/' + year;
}

export const getTodayTimeMapping = (today: any): TimeSlot[] => {
    const t = getFormattedDate(new Date(today));
    TimeMapping.map((time) => time.value = new Date(`${t} ${time.label}`).getTime())
    return TimeMapping
}