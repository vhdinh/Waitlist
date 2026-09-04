export interface NewBookingType {
    _id?: string;
    name: string;
    phoneNumber?: string;
    startDay?: string;
    start: number;
    end: number;
    partySize: number | undefined;
    note?: string;
    msg?: string;
    notified?: boolean;
}

export interface TimeSlot {
    label: string;
    value: number
}

// Generates 15-minute slots from startHour to endHour (24-hour clock,
// inclusive). `value` is a placeholder HHMM number (e.g. 1330 for 1:30 PM) -
// getTodayTimeMapping below replaces it with a real epoch timestamp for a
// specific day.
function generateTimeMapping(startHour: number, endHour: number): TimeSlot[] {
    const slots: TimeSlot[] = [];
    for (let totalMinutes = startHour * 60; totalMinutes <= endHour * 60; totalMinutes += 15) {
        const hour24 = Math.floor(totalMinutes / 60);
        const minute = totalMinutes % 60;
        const period = hour24 >= 12 ? 'PM' : 'AM';
        const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
        slots.push({
            label: `${hour12}:${minute.toString().padStart(2, '0')} ${period}`,
            value: hour24 * 100 + minute,
        });
    }
    return slots;
}

export const TimeMapping: TimeSlot[] = generateTimeMapping(11, 23);

export function getFormattedDate(date: Date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return month + '/' + day + '/' + year;
}

export const getTodayTimeMapping = (today: any): TimeSlot[] => {
    const t = getFormattedDate(new Date(today));
    return TimeMapping.map((time) => ({
        ...time,
        value: new Date(`${t} ${time.label}`).getTime(),
    }));
}

// Minimum reservation length used to compute/validate the "end time" options
// relative to a chosen start time. Kept as a single constant so the new-booking
// and edit-booking forms can't drift out of sync with each other.
export const MIN_BOOKING_DURATION_MS = 7200000; // 2 hours

export const getValidEndTimeSlots = (startTime: number | undefined, timeSlots: TimeSlot[]): TimeSlot[] => {
    const minEndTime = (startTime || 0) + MIN_BOOKING_DURATION_MS;
    return timeSlots.filter((t) => t.value >= minEndTime || t.label === '11:00 PM');
}

export const getDefaultEndTimeSlot = (startTime: number, timeSlots: TimeSlot[]): TimeSlot => {
    const minEndTime = startTime + MIN_BOOKING_DURATION_MS;
    return timeSlots.find((t) => t.value === minEndTime) || timeSlots[timeSlots.length - 1];
}