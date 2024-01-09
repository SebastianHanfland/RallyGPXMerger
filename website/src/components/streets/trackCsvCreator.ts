import { TrackStreetInfo } from '../../mapMatching/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { getLanguage } from '../../language.ts';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../../logic/speedSimulator.ts';

export function formatNumber(numberToFormat: number, maximumFractionDigits = 2) {
    const language = getLanguage();
    return Intl.NumberFormat(language, { maximumFractionDigits: maximumFractionDigits }).format(numberToFormat);
}

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
    const tableHeaders = `Straße;PLZ;Bezirk;Länge in km;Dauer in min;Blockiert in min;Ankunft des Zugs auf der Straße;Ankunft des Zugs am Ende;Straße blockiert bis\n`;

    return `${times}${durationString}${distance}${averageSpeed}${tableHeaders}`;
};
const englishHeader = (trackInfo: TrackStreetInfo): string => {
    const duration = getTimeDifferenceInSeconds(trackInfo.arrivalBack, trackInfo.startFront) / 60;
    const durationString = `Duration in min;${duration.toFixed(2)}\n`;
    const distance = `Distance in km;${trackInfo.distanceInKm.toFixed(2)}\n`;
    const averageSpeed = `Average speed in km/h;${((trackInfo.distanceInKm / duration) * 60).toFixed(2)}\n`;

    const times = `Start;${formatTimeOnly(trackInfo.startFront)}\nArrival of front;${formatTimeOnly(
        trackInfo.arrivalFront
    )}\nArrival of back;${formatTimeOnly(trackInfo.arrivalBack)}\n`;
    const tableHeaders = `Street;Post code;District;Length in km;Duration in min;Blockage in min;Arrival of front;Passage of front;Arrival of back\n`;

    return `${times}${durationString}${distance}${averageSpeed}${tableHeaders}`;
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

export function convertTrackInfoToCsv(track: TrackStreetInfo): string {
    return (
        getHeader(track) +
        track.wayPoints
            .map(
                ({ streetName, postCode, district, frontArrival, frontPassage, backArrival, pointFrom, pointTo }) =>
                    `${streetName};` +
                    `${postCode ?? ''};` +
                    `${district ?? ''};` +
                    `${formatNumber(geoDistance(toLatLng(pointFrom), toLatLng(pointTo)) as number, 2)};` +
                    `${formatNumber(getTimeDifferenceInSeconds(frontPassage, frontArrival) / 60, 1)};` +
                    `${formatNumber(getTimeDifferenceInSeconds(backArrival, frontArrival) / 60, 1)};` +
                    `${formatTimeOnly(frontArrival)};` +
                    `${formatTimeOnly(frontPassage)};` +
                    `${formatTimeOnly(backArrival)}`
            )
            .join('\n')
    );
}
