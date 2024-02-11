import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import { ContentTable } from 'pdfmake/interfaces';

import { getHeader } from '../getHeader.ts';
import { IntlShape } from 'react-intl';

export function createInfoTable(trackStreets: TrackStreetInfo, intl: IntlShape): ContentTable {
    const trackInfo = getHeader(trackStreets, intl)
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
