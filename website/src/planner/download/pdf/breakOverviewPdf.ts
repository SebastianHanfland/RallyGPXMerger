import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { Content, ContentTable } from 'pdfmake/interfaces';
import { getLink } from '../../../utils/linkUtil.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';

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
