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

export function formatTimeOnly(dateString: string, noSecond = false): string {
    const TIME_FORMAT = noSecond ? 'HH:mm' : 'HH:mm:ss';
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

const A_ROUTE_MINUTES_TO_ROUND_TO = 5;
const A_ROUTE_MINUTES_TO_SUBTRACT = 10;

const M_ROUTE_MINUTES_TO_ROUND_TO = 15;
const M_ROUTE_MINUTES_TO_SUBTRACT = 15;

export function roundStartTimes(startFront: string, trackName: string) {
    const isMRoute = trackName.startsWith('M');
    const minutesToSubtract = isMRoute ? M_ROUTE_MINUTES_TO_SUBTRACT : A_ROUTE_MINUTES_TO_SUBTRACT;
    const minutesToRoundTo = isMRoute ? M_ROUTE_MINUTES_TO_ROUND_TO : A_ROUTE_MINUTES_TO_ROUND_TO;

    const timeMinus5Min = date.addSeconds(new Date(startFront), -minutesToSubtract * 60).toISOString();

    const coeff = 1000 * 60 * minutesToRoundTo;
    return new Date(Math.floor(new Date(timeMinus5Min).getTime() / coeff) * coeff).toISOString();
}
