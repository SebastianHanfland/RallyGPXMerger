import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import { getLanguage } from '../../../language.ts';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../../logic/merge/speedSimulator.ts';
import { getHeader } from '../getHeader.ts';
import { IntlShape } from 'react-intl';

export function formatNumber(numberToFormat: number, maximumFractionDigits = 2) {
    const language = getLanguage();
    return Intl.NumberFormat(language, { maximumFractionDigits: maximumFractionDigits }).format(numberToFormat);
}

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

export function convertTrackInfoToCsv(track: TrackStreetInfo, intl: IntlShape): string {
    return (
        getHeader(track, intl) +
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
                    `${streetName ?? intl.formatMessage({ id: 'msg.unknown' })}${getAdditionalInfo(
                        type,
                        nodeTracks,
                        breakLength
                    )};` +
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
