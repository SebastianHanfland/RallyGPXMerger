import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import geoDistance from 'geo-distance-helper';
import { getHeader } from '../getHeader.ts';
import { IntlShape } from 'react-intl';
import { toLatLng } from '../../../utils/pointUtil.ts';
import { formatNumber } from '../../../utils/numberUtil.ts';

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
                    `${formatNumber(getTimeDifferenceInSeconds(backPassage, frontArrival) / 60, 1)};` +
                    `${formatTimeOnly(frontArrival)};` +
                    `${formatTimeOnly(frontPassage)};` +
                    `${formatTimeOnly(backPassage)}`
            )
            .join('\n')
    );
}
