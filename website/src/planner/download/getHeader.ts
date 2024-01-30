import { TrackStreetInfo } from '../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { getLanguage } from '../../language.ts';
import { englishTableHeaders, formatNumber, germanTableHeaders } from './csv/trackStreetsCsv.ts';

const germanHeader = (trackInfo: TrackStreetInfo): string => {
    const duration = getTimeDifferenceInSeconds(trackInfo.arrivalBack, trackInfo.startFront) / 60;
    const durationString = `Dauer in min;${formatNumber(duration)}\n`;
    const distance = `Strecke in km;${formatNumber(trackInfo.distanceInKm)}\n`;
    const averageSpeed = `Durchschnittsgeschwindigkeit in km/h;${formatNumber(
        (trackInfo.distanceInKm / duration) * 60
    )}\n`;

    const times = `Start;${formatTimeOnly(trackInfo.startFront)}\nAnkunft der Ersten;${formatTimeOnly(
        trackInfo.arrivalFront
    )}\nAnkunft der Letzten;${formatTimeOnly(trackInfo.arrivalBack)}\n`;
    const peopleCount = `Geschätzte TeilnehmerInnen:;${trackInfo.peopleCount ?? ''}\n`;

    return `${times}${durationString}${distance}${averageSpeed}${peopleCount}${germanTableHeaders}`;
};
const englishHeader = (trackInfo: TrackStreetInfo): string => {
    const duration = getTimeDifferenceInSeconds(trackInfo.arrivalBack, trackInfo.startFront) / 60;
    const durationString = `Duration in min;${duration.toFixed(2)}\n`;
    const distance = `Distance in km;${trackInfo.distanceInKm.toFixed(2)}\n`;
    const averageSpeed = `Average speed in km/h;${((trackInfo.distanceInKm / duration) * 60).toFixed(2)}\n`;

    const times = `Start;${formatTimeOnly(trackInfo.startFront)}\nArrival of front;${formatTimeOnly(
        trackInfo.arrivalFront
    )}\nArrival of back;${formatTimeOnly(trackInfo.arrivalBack)}\n`;
    const peopleCount = `People on track:;${trackInfo.peopleCount ?? ''}\n`;

    return `${times}${durationString}${distance}${averageSpeed}${peopleCount}${englishTableHeaders}`;
};
export const getHeader = (trackInfo: TrackStreetInfo): string => {
    const language = getLanguage();
    switch (language) {
        case 'de':
            return germanHeader(trackInfo);
        case 'en':
            return englishHeader(trackInfo);
    }
};
