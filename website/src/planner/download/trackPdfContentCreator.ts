import { TrackStreetInfo, TrackWayPointType } from '../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../logic/merge/speedSimulator.ts';
import { Content, ContentTable } from 'pdfmake/interfaces';
import { formatNumber, germanTableHeaders, getHeader } from './trackCsvCreator.ts';
import { getLink } from '../../utils/linkUtil.ts';

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

export function createStreetTable(trackStreets: TrackStreetInfo): ContentTable {
    const tableHeader = germanTableHeaders.split(';').map((text) => ({
        text,
        style: 'headerStyle',
    }));

    const wayPointRows = trackStreets.wayPoints.map((waypoint) => [
        {
            text: `${waypoint.streetName}${getAdditionalInfo(
                waypoint.type,
                waypoint.nodeTracks,
                waypoint.breakLength
            )}`,
            style: 'linkStyle',
            link: getLink(waypoint),
        },
        `${waypoint.postCode ?? ''}`,
        `${waypoint.district?.replace('Wahlkreis', '') ?? ''}`,
        `${formatNumber(geoDistance(toLatLng(waypoint.pointFrom), toLatLng(waypoint.pointTo)) as number, 2)}`,
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
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [tableHeader, ...wayPointRows],
        },
    };
}

export function createInfoTable(trackStreets: TrackStreetInfo): ContentTable {
    const trackInfo = getHeader(trackStreets)
        .split('\n')
        .slice(0, 7)
        .map((row) => row.split(';'));
    return {
        layout: 'lightHorizontalLines', // optional
        table: {
            widths: ['auto', 'auto'],

            body: trackInfo,
        },
    };
}

export function createBreakOverviewTable(trackStreets: TrackStreetInfo): (ContentTable | Content)[] {
    const breaks = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Break);

    if (breaks.length === 0) {
        return [
            { text: 'Pausenplätze', style: 'titleStyle' },
            ' ',
            { text: 'Auf dieser Route gibt es keine Pausenplätze' },
        ];
    }

    return [
        { text: 'Pausenplätze', style: 'titleStyle' },
        ' ',
        {
            layout: 'lightHorizontalLines', // optional
            table: {
                widths: ['auto', 'auto', 'auto'],

                headerRows: 1,
                body: [
                    ['Ort', 'Pausenstart', 'Pausenlänge'],
                    ...breaks.map((breakWayPoint) => [
                        {
                            text: breakWayPoint.streetName ?? 'Unbekannt',
                            link: getLink(breakWayPoint),
                            style: 'linkStyle',
                        },
                        `${formatTimeOnly(breakWayPoint.frontArrival)}`,
                        breakWayPoint.breakLength ? `${breakWayPoint.breakLength.toFixed(0)} min` : '',
                    ]),
                ],
            },
        },
    ];
}

export function createNodeOverviewTable(trackStreets: TrackStreetInfo): (ContentTable | Content)[] {
    const nodes = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Node);
    if (nodes.length === 0) {
        return [
            { text: 'Knotenpunkte', style: 'titleStyle' },
            ' ',
            { text: 'Auf dieser Route gibt es keine Knotenpunkte' },
        ];
    }

    return [
        { text: 'Knotenpunkte', style: 'titleStyle' },
        ' ',
        {
            layout: 'lightHorizontalLines', // optional
            table: {
                widths: ['auto', 'auto', 'auto'],

                headerRows: 1,
                body: [
                    ['Ort', 'Zeitpunkt', 'Andere Strecken'],
                    ...nodes.map((breakWayPoint) => [
                        {
                            text: breakWayPoint.streetName ?? 'Unbekannt',
                            link: getLink(breakWayPoint),
                            style: 'linkStyle',
                        },
                        `${formatTimeOnly(breakWayPoint.frontArrival)}`,
                        breakWayPoint.nodeTracks ? `${breakWayPoint.nodeTracks.join(', ')}` : '',
                    ]),
                ],
            },
        },
    ];
}
