import { addSeconds, format, subtract } from 'date-and-time';
import { FormatDateOptions } from 'react-intl';
import { getLanguage } from '../language.ts';

export function shiftDateBySeconds(datetime: string, shiftInSeconds: number): string {
    return addSeconds(new Date(datetime), shiftInSeconds).toISOString();
}

export function getTimeDifferenceInSeconds(firstDateString: string, secondDateString: string): number {
    const firstDate = new Date(secondDateString);
    const secondDate = new Date(firstDateString);

    const dayLightSavingDifference = firstDate.getTimezoneOffset() - secondDate.getTimezoneOffset();
    return subtract(firstDate, secondDate).toSeconds().value + dayLightSavingDifference * 60;
}

export function formatTimeOnly(dateString: string, noSecond = false): string {
    const germanFormat = noSecond ? 'HH:mm' : 'HH:mm:ss';
    const englishFormat = noSecond ? 'hh:mm A' : 'hh:mm:ss A';
    const TIME_FORMAT = getLanguage() === 'de' ? germanFormat : englishFormat;
    return format(new Date(dateString), TIME_FORMAT);
}

export function shiftEndTimeByParticipants(
    endDateTime: string,
    participants: number,
    participantsDelayInSeconds: number
): string {
    return addSeconds(new Date(endDateTime), participants * participantsDelayInSeconds).toISOString();
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
    const timeMinusBuffer = addSeconds(new Date(startFront), -minutesToSubtract * 60).toISOString();

    if (minutesToRoundTo === 0) {
        return timeMinusBuffer;
    }
    const coeff = 1000 * 60 * minutesToRoundTo;
    return new Date(Math.floor(new Date(timeMinusBuffer).getTime() / coeff) * coeff).toISOString();
}
