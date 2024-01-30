import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import { getLanguage } from '../../../language.ts';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../../logic/merge/speedSimulator.ts';
import { getHeader } from '../getHeader.ts';

export function formatNumber(numberToFormat: number, maximumFractionDigits = 2) {
    const language = getLanguage();
    return Intl.NumberFormat(language, { maximumFractionDigits: maximumFractionDigits }).format(numberToFormat);
}

export const germanTableHeaders = `Straße;PLZ;Bezirk;Länge in km;Dauer in min;Blockiert in min;Ankunft des Zugs auf der Straße;Ankunft des Zugs am Ende;Straße blockiert bis\n`;
export const englishTableHeaders = `Street;Post code;District;Length in km;Duration in min;Blockage in min;Arrival of front;Passage of front;Arrival of back\n`;

function getAdditionalInfo(
    type: TrackWayPointType | undefined,
    nodeTracks: string[] | undefined,
    breakLength: number | undefined
) {
    if (type === TrackWayPointType.Break) {
        return `: Pause${breakLength ? ` (${breakLength}) min` : ''}`;
    }
    if (type === TrackWayPointType.Node) {
        return `: Knoten${nodeTracks ? ` (${nodeTracks.join(', ')})` : ''}`;
    }
    return '';
}

export function convertTrackInfoToCsv(track: TrackStreetInfo): string {
    return (
        getHeader(track) +
        track.wayPoints
            .map(
                ({
                    streetName,
                    postCode,
                    district,
                    frontArrival,
                    frontPassage,
                    backArrival,
                    pointFrom,
                    pointTo,
                    type,
                    nodeTracks,
                    breakLength,
                }) =>
                    `${streetName}${getAdditionalInfo(type, nodeTracks, breakLength)};` +
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
