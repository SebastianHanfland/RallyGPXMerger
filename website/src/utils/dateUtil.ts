import date from 'date-and-time';
import { FormatDateOptions } from 'react-intl';

export function shiftEndDate(endDateString: string, breakInMinutes: number): string {
    return date.addSeconds(new Date(endDateString), -breakInMinutes * 60).toISOString();
}

export function getTimeDifferenceInSeconds(firstDateString: string, secondDateString: string): number {
    const firstDate = new Date(secondDateString);
    const secondDate = new Date(firstDateString);

    const dayLightSavingDifference = firstDate.getTimezoneOffset() - secondDate.getTimezoneOffset();
    return date.subtract(secondDate, firstDate).toSeconds() + dayLightSavingDifference * 60;
}

export function formatDate(dateString: string): string {
    const DATE_FORMAT = 'DD.MM.YYYY HH:mm:ss';
    return date.format(new Date(dateString), DATE_FORMAT);
}

export function formatTimeOnly(dateString: string): string {
    const TIME_FORMAT = 'HH:mm:ss';
    return date.format(new Date(dateString), TIME_FORMAT);
}

export const DateTimeFormat: FormatDateOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
};
