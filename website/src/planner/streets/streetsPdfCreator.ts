import { BlockedStreetInfo } from '../../mapMatching/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../logic/merge/speedSimulator.ts';
import { formatNumber } from './trackCsvCreator.ts';
import { ContentTable } from 'pdfmake/interfaces';
import { getLink } from './trackPdfContentCreator.ts';
import { getBlockedStreetsHeader } from './streetsCsvCreator.ts';

export function createBlockedStreetTable(trackStreets: BlockedStreetInfo[]): ContentTable {
    const tableHeader = getBlockedStreetsHeader()
        .split(';')
        .map((text) => ({
            text,
            style: 'headerStyle',
        }));

    const wayPointRows = trackStreets.map((streetPoint) => [
        `${streetPoint.postCode ?? ''}`,
        `${streetPoint.district?.replace('Wahlkreis', '') ?? ''}`,
        {
            text: `${streetPoint.streetName}`,
            style: 'linkStyle',
            link: getLink(streetPoint),
        },
        `${formatNumber(geoDistance(toLatLng(streetPoint.pointFrom), toLatLng(streetPoint.pointTo)) as number, 2)}`,
        `${formatNumber(getTimeDifferenceInSeconds(streetPoint.backPassage, streetPoint.frontArrival) / 60, 1)}`,
        `${formatTimeOnly(streetPoint.frontArrival)}`,
        `${formatTimeOnly(streetPoint.backPassage)}`,
    ]);
    return {
        layout: 'lightHorizontalLines', // optional
        table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [tableHeader, ...wayPointRows],
        },
    };
}
