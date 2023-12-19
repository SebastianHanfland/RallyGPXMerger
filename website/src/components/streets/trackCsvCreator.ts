import { TrackStreetInfo } from '../../mapMatching/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';

const header = (trackInfo: TrackStreetInfo): string => {
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

export function convertTrackInfoToCsv(track: TrackStreetInfo): string {
    return (
        header(track) +
        track.wayPoints
            .map(
                ({ streetName, postCode, district, frontArrival, frontPassage, backArrival }) =>
                    `${streetName};` +
                    `${postCode};` +
                    `${district};` +
                    `${formatTimeOnly(frontArrival)};` +
                    `${formatTimeOnly(frontPassage)};` +
                    `${formatTimeOnly(backArrival)}`
            )
            .join('\n')
    );
}
