import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { Content, ContentTable } from 'pdfmake/interfaces';
import { getLink } from '../../../utils/linkUtil.ts';
import { formatTimeOnly } from '../../../utils/dateUtil.ts';
import { IntlShape } from 'react-intl';

export function createBreakOverviewTable(trackStreets: TrackStreetInfo, intl: IntlShape): (ContentTable | Content)[] {
    const breaks = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Break);

    if (breaks.length === 0) {
        return [
            { text: intl.formatMessage({ id: 'msg.breakPoints' }), style: 'titleStyle' },
            ' ',
            { text: intl.formatMessage({ id: 'msg.noBreakPoints' }) },
        ];
    }

    return [
        { text: intl.formatMessage({ id: 'msg.breakPoints' }), style: 'titleStyle' },
        ' ',
        {
            layout: 'lightHorizontalLines', // optional
            table: {
                widths: ['auto', 'auto', 'auto'],

                headerRows: 1,
                body: [
                    ['msg.location', 'msg.breakStart', 'msg.breakLength'].map((key) => intl.formatMessage({ id: key })),
                    ...breaks.map((breakWayPoint) => [
                        {
                            text: breakWayPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' }),
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
