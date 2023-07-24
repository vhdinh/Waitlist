import moment from "moment";

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
        label: '11:15 AM',
        value: 1115,
    },
    {
        label: '11:30 AM',
        value: 1130,
    },
    {
        label: '11:45 AM',
        value: 1145,
    },
    {
        label: '12:00 PM',
        value: 1200,
    },
    {
        label: '12:15 PM',
        value: 1215,
    },
    {
        label: '12:30 PM',
        value: 1230,
    },
    {
        label: '12:45 PM',
        value: 1245,
    },
    {
        label: '1:00 PM',
        value: 1300,
    },
    {
        label: '1:15 PM',
        value: 1315,
    },
    {
        label: '1:30 PM',
        value: 1330,
    },
    {
        label: '1:45 PM',
        value: 1345,
    },
    {
        label: '2:00 PM',
        value: 1400,
    },
    {
        label: '2:15 PM',
        value: 1415,
    },
    {
        label: '2:30 PM',
        value: 1430,
    },
    {
        label: '2:45 PM',
        value: 1445,
    },
    {
        label: '3:00 PM',
        value: 1500,
    },
    {
        label: '3:15 PM',
        value: 1515,
    },
    {
        label: '3:30 PM',
        value: 1530,
    },
    {
        label: '3:45 PM',
        value: 1545,
    },
    {
        label: '4:00 PM',
        value: 1600,
    },
    {
        label: '4:15 PM',
        value: 1615,
    },
    {
        label: '4:30 PM',
        value: 1630,
    },
    {
        label: '4:45 PM',
        value: 1645,
    },
    {
        label: '5:00 PM',
        value: 1700,
    },
    {
        label: '5:15 PM',
        value: 1715,
    },
    {
        label: '5:30 PM',
        value: 1730,
    },
    {
        label: '5:45 PM',
        value: 1745,
    },
    {
        label: '6:00 PM',
        value: 1800,
    },
    {
        label: '6:15 PM',
        value: 1815,
    },
    {
        label: '6:30 PM',
        value: 1830,
    },
    {
        label: '6:45 PM',
        value: 1845,
    },
    {
        label: '7:00 PM',
        value: 1900,
    },
    {
        label: '7:15 PM',
        value: 1915,
    },
    {
        label: '7:30 PM',
        value: 1930,
    },
    {
        label: '7:45 PM',
        value: 1945,
    },
    {
        label: '8:00 PM',
        value: 2000,
    },
    {
        label: '8:15 PM',
        value: 2015,
    },
    {
        label: '8:30 PM',
        value: 2030,
    },
    {
        label: '8:45 PM',
        value: 2045,
    },
    {
        label: '9:00 PM',
        value: 2100,
    },
    {
        label: '9:15 PM',
        value: 2115,
    },
    {
        label: '9:30 PM',
        value: 2130,
    },
    {
        label: '9:45 PM',
        value: 2145,
    },
    {
        label: '10:00 PM',
        value: 2200,
    },
    {
        label: '10:15 PM',
        value: 2215,
    },
    {
        label: '10:30 PM',
        value: 2230,
    },
    {
        label: '10:45 PM',
        value: 2245,
    },
    {
        label: '11:00 PM',
        value: 2300,
    },
]
export const TimeMappingNew: TimeSlotNew[] = [
    {
        label: '11:00 AM',
        value: '11:00',
    },
    {
        label: '11:30 AM',
        value: '11:30',
    },
    {
        label: '12:00 PM',
        value: '12:00',
    },
    {
        label: '12:30 PM',
        value: '12:30',
    },
    {
        label: '1:00 PM',
        value: '13:00',
    },
    {
        label: '1:30 PM',
        value: '13:30',
    },
    {
        label: '2:00 PM',
        value: '14:00',
    },
    {
        label: '2:30 PM',
        value: '14:30',
    },
    {
        label: '3:00 PM',
        value: '15:00',
    },
    {
        label: '3:30 PM',
        value: '15:30',
    },
    {
        label: '4:00 PM',
        value: '16:00',
    },
    {
        label: '4:30 PM',
        value: '16:30',
    },
    {
        label: '5:00 PM',
        value: '17:00',
    },
    {
        label: '5:30 PM',
        value: '17:30',
    },
    {
        label: '6:00 PM',
        value: '18:00',
    },
    {
        label: '6:30 PM',
        value: '18:30',
    },
    {
        label: '7:00 PM',
        value: '19:00',
    },
    {
        label: '7:30 PM',
        value: '19:30',
    },
    {
        label: '8:00 PM',
        value: '20:00',
    },
    {
        label: '8:30 PM',
        value: '20:30',
    },
    {
        label: '9:00 PM',
        value: '21:00',
    },
    {
        label: '9:30 PM',
        value: '21:30',
    },
    {
        label: '10:00 PM',
        value: '22:00',
    },
    {
        label: '10:30 PM',
        value: '22:30',
    },
    {
        label: '11:00 PM',
        value: '23:00',
    },
]

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