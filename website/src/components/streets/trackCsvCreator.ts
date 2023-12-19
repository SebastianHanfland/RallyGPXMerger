import { TrackStreetInfo } from '../../mapMatching/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { getLanguage } from '../../language.ts';

function formatGerman(numberToFormat: number) {
    return Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(numberToFormat);
}

const germanHeader = (trackInfo: TrackStreetInfo): string => {
    const duration = getTimeDifferenceInSeconds(trackInfo.arrivalBack, trackInfo.startFront) / 60;
    const durationString = `Dauer in min;${formatGerman(duration)}\n`;
    const distance = `Strecke in km;${formatGerman(trackInfo.distanceInKm)}\n`;
    const averageSpeed = `Durchschnittsgeschwindigkeit in km/h;${formatGerman(
        (trackInfo.distanceInKm / duration) * 60
    )}\n`;

    const times = `Start;${formatTimeOnly(trackInfo.startFront)}\nAnkunft der Ersten;${formatTimeOnly(
        trackInfo.arrivalFront
    )}\nAnkunft der Letzten;${formatTimeOnly(trackInfo.arrivalBack)}\n`;
    const tableHeaders = `Straße;PLZ;Bezirk;Ankunft des Zugs auf der Straße;Ankunft des Zug am Ende;Straße blockiert bis\n`;

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
    const tableHeaders = `Street;Post code;District;Arrival of front;Passage of front;Arrival of back\n`;

    return `${times}${durationString}${distance}${averageSpeed}${tableHeaders}`;
};

const getHeader = (trackInfo: TrackStreetInfo): string => {
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
                ({ streetName, postCode, district, frontArrival, frontPassage, backArrival }) =>
                    `${streetName};` +
                    `${postCode ?? ''};` +
                    `${district ?? ''};` +
                    `${formatTimeOnly(frontArrival)};` +
                    `${formatTimeOnly(frontPassage)};` +
                    `${formatTimeOnly(backArrival)}`
            )
            .join('\n')
    );
}
