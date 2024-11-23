export function addNumDays(date: Date, numDays: number): Date {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;

}