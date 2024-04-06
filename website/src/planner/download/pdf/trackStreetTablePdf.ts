import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import { ContentTable } from 'pdfmake/interfaces';
import { getLink } from '../../../utils/linkUtil.ts';
import { IntlShape } from 'react-intl';
import { getTrackTableHeaders } from '../getHeader.ts';
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

export function createStreetTable(trackStreets: TrackStreetInfo, intl: IntlShape): ContentTable {
    const tableHeader = getTrackTableHeaders(intl).map((text) => ({
        text,
        style: 'headerStyle',
    }));

    const wayPointRows = trackStreets.wayPoints.map((waypoint) => [
        {
            text: `${waypoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}${getAdditionalInfo(
                waypoint.type,
                waypoint.nodeTracks,
                waypoint.breakLength
            )}`,
            style: 'linkStyle',
            link: getLink(waypoint),
        },
        `${waypoint.postCode ?? ''}`,
        `${waypoint.district?.replace('Wahlkreis', '') ?? ''}`,
        `${formatNumber(waypoint.distanceInKm ?? 0, 2)}`,
        `${formatNumber(waypoint.speed ?? 0, 1)}`,
        `${formatNumber(getTimeDifferenceInSeconds(waypoint.frontPassage, waypoint.frontArrival) / 60, 1)}`,
        `${formatNumber(getTimeDifferenceInSeconds(waypoint.backArrival, waypoint.frontArrival) / 60, 1)}`,
        `${formatTimeOnly(waypoint.frontArrival)}`,
        `${formatTimeOnly(waypoint.frontPassage)}`,
        `${formatTimeOnly(waypoint.backArrival)}`,
    ]);
    return {
        layout: 'lightHorizontalLines', // optional
        table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: tableHeader.map(() => 'auto'),
            body: [tableHeader, ...wayPointRows],
        },
    };
}
