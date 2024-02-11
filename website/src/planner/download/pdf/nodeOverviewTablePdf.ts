import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { Content, ContentTable } from 'pdfmake/interfaces';
import { getLink } from '../../../utils/linkUtil.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';
import { IntlShape } from 'react-intl';

export function createNodeOverviewTable(trackStreets: TrackStreetInfo, intl: IntlShape): (ContentTable | Content)[] {
    const nodes = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Node);
    if (nodes.length === 0) {
        return [
            { text: intl.formatMessage({ id: 'msg.nodePoints' }), style: 'titleStyle' },
            ' ',
            { text: intl.formatMessage({ id: 'msg.noNodePoints' }) },
        ];
    }

    return [
        { text: intl.formatMessage({ id: 'msg.nodePoints' }), style: 'titleStyle' },
        ' ',
        {
            layout: 'lightHorizontalLines', // optional
            table: {
                widths: ['auto', 'auto', 'auto'],

                headerRows: 1,
                body: [
                    ['msg.location', 'msg.pointInTime', 'msg.otherTracks'].map((key) =>
                        intl.formatMessage({ id: key })
                    ),
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
