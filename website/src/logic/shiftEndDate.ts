import * as date from 'date-and-time';

export function shiftEndDate(endDate: Date, breakInMinutes: number): Date {
    return date.addSeconds(endDate, -breakInMinutes * 60);
}
