import date from 'date-and-time';
import { FormatDateOptions } from 'react-intl';
import { getLanguage } from '../language.ts';

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

export function formatTimeOnly(dateString: string, noSecond = false): string {
    const germanFormat = noSecond ? 'HH:mm' : 'HH:mm:ss';
    const englishFormat = noSecond ? 'hh:mm A' : 'hh:mm:ss A';
    const TIME_FORMAT = getLanguage() === 'de' ? germanFormat : englishFormat;
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

export function roundPublishedStartTimes(
    startFront: string,
    minutesToSubtract: number,
    minutesToRoundTo: number
): string {
    const timeMinusBuffer = date.addSeconds(new Date(startFront), -minutesToSubtract * 60).toISOString();

    if (minutesToRoundTo === 0) {
        return timeMinusBuffer;
    }
    const coeff = 1000 * 60 * minutesToRoundTo;
    return new Date(Math.floor(new Date(timeMinusBuffer).getTime() / coeff) * coeff).toISOString();
}
