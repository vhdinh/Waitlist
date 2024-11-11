export function getDayFromTimestamp(timestamp: number) {
    const date = new Date(timestamp); // Convert to milliseconds
    const day = date.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"];

    return daysOfWeek[day];
}