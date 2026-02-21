import { BlockedStreetInfo } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import geoDistance from 'geo-distance-helper';
import { ContentTable, TDocumentDefinitions } from 'pdfmake/interfaces';
import { getBlockedStreetsHeader } from '../csv/blockedStreetsCsv.ts';
import { getLink } from '../../../utils/linkUtil.ts';
import { createPdf } from 'pdfmake/build/pdfmake';
import { styles } from './pdfUtil.ts';
import { IntlShape } from 'react-intl';
import { toLatLng } from '../../../utils/pointUtil.ts';
import { formatNumber } from '../../../utils/numberUtil.ts';

export function createBlockedStreetTable(trackStreets: BlockedStreetInfo[], intl: IntlShape): ContentTable {
    const tableHeader = getBlockedStreetsHeader(intl)
        .split(';')
        .map((text) => ({
            text,
            style: 'headerStyle',
        }));

    const wayPointRows = trackStreets.map((streetPoint) => [
        `${streetPoint.postCode ?? ''}`,
        `${streetPoint.district?.replace('Wahlkreis', '') ?? ''}`,
        {
            text: `${streetPoint.streetName ?? intl.formatMessage({ id: 'msg.unknown' })}`,
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

export function createBlockedStreetsPdf(
    trackStreets: BlockedStreetInfo[],
    planningLabel: string | undefined,
    intl: IntlShape
) {
    const docDefinition: TDocumentDefinitions = {
        pageOrientation: 'landscape',
        content: [
            '',
            { text: intl.formatMessage({ id: 'msg.blockedStreets' }), style: 'titleStyle' },
            '\n\n',
            planningLabel ? `${planningLabel}` : ' ',
            ' ',
            ' ',
            createBlockedStreetTable(trackStreets, intl),
        ],
        styles,
    };
    return createPdf(docDefinition);
}
