import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { createInfoTable } from './infoTablePdf.ts';
import { createBreakOverviewTable } from './breakOverviewPdf.ts';
import { createNodeOverviewTable } from './nodeOverviewTablePdf.ts';
import { createStreetTable } from './trackStreetTablePdf.ts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { styles } from './pdfUtil.ts';
import { IntlShape } from 'react-intl';

export const createTrackStreetPdf = (intl: IntlShape, planningLabel?: string) => (trackStreets: TrackStreetInfo) => {
    const docDefinition: TDocumentDefinitions = {
        pageOrientation: 'landscape',
        content: [
            '',
            { text: trackStreets.name.replaceAll('.gpx', ''), style: 'titleStyle' },
            '\n\n',
            planningLabel ? `${planningLabel}` : ' ',
            ' ',
            { text: intl.formatMessage({ id: 'msg.trackInfo' }), style: 'titleStyle' },
            ' ',
            createInfoTable(trackStreets, intl),
            ' ',
            ' ',
            ...createBreakOverviewTable(trackStreets, intl),
            ' ',
            ' ',
            ...createNodeOverviewTable(trackStreets, intl),
            ' ',
            ' ',
            { text: intl.formatMessage({ id: 'msg.streetOverview' }), style: 'titleStyle' },
            ' ',
            createStreetTable(trackStreets, intl),
        ],
        styles,
    };
    pdfMake.createPdf(docDefinition).download(trackStreets.name + '.pdf');
};
