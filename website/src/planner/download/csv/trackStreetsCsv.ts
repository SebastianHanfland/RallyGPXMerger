import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil';
import geoDistance from 'geo-distance-helper';
import { getHeader } from '../getHeader';
import { IntlShape } from 'react-intl';
import { toLatLng } from '../../../utils/pointUtil';
import { formatNumber } from '../../../utils/numberUtil';

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
                    backPassage,
                    pointFrom,
                    speed,
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
                    `${speed ? formatNumber(speed) : ''};` +
                    `${formatNumber(getTimeDifferenceInSeconds(frontPassage, frontArrival) / 60, 1)};` +
                    `${formatNumber(getTimeDifferenceInSeconds(backPassage, frontArrival) / 60, 1)};` +
                    `${formatTimeOnly(frontArrival)};` +
                    `${formatTimeOnly(frontPassage)};` +
                    `${formatTimeOnly(backPassage)}`
            )
            .join('\n')
    );
}
