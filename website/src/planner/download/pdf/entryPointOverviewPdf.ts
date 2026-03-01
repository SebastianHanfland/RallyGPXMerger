import { TrackStreetInfo, TrackWayPointType } from '../../logic/resolving/types.ts';
import { Content, ContentTable } from 'pdfmake/interfaces';
import { getLink } from '../../../utils/linkUtil.ts';
import { formatTimeOnly, roundPublishedStartTimes } from '../../../utils/dateUtil.ts';
import { IntlShape } from 'react-intl';

export function createEntryPointOverviewTable(
    trackStreets: TrackStreetInfo,
    intl: IntlShape
): (ContentTable | Content)[] {
    const entryPoints = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Entry);
    const startingPoint = trackStreets.wayPoints.filter((wayPoint) => wayPoint.type === TrackWayPointType.Track)[0];

    if (entryPoints.length === 0) {
        return [];
    }

    return [
        { text: intl.formatMessage({ id: 'msg.entryPoints' }), style: 'titleStyle' },
        ' ',
        {
            layout: 'lightHorizontalLines', // optional
            table: {
                widths: ['auto', 'auto', 'auto'],

                headerRows: 1,
                body: [
                    ['msg.location', 'msg.collectionTime', 'msg.startingTime'].map((key) =>
                        intl.formatMessage({ id: key })
                    ),
                    [
                        {
                            text:
                                trackStreets.startName ??
                                startingPoint.streetName ??
                                intl.formatMessage({ id: 'msg.unknown' }),
                            link: getLink(startingPoint),
                            style: 'linkStyle',
                        },
                        `${formatTimeOnly(trackStreets.publicStart ?? startingPoint.frontArrival)}`,
                        formatTimeOnly(startingPoint.frontArrival),
                    ],
                    ...entryPoints.map((entryPoint) => [
                        {
                            text: entryPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' }),
                            link: getLink(entryPoint),
                            style: 'linkStyle',
                        },
                        `${formatTimeOnly(
                            roundPublishedStartTimes(
                                entryPoint.frontArrival,
                                entryPoint.buffer ?? 0,
                                entryPoint.rounding ?? 0
                            )
                        )}`,
                        formatTimeOnly(entryPoint.frontArrival),
                    ]),
                ],
            },
        },
    ];
}
