import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { Content, ContentTable } from 'pdfmake/interfaces';
import { getLink } from '../../../utils/linkUtil.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';

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
