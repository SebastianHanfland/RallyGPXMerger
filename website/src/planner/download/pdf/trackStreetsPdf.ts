import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { createInfoTable } from './infoTablePdf.ts';
import { createBreakOverviewTable } from './breakOverviewPdf.ts';
import { createNodeOverviewTable } from './nodeOverviewTablePdf.ts';
import { createStreetTable } from './trackStreetTablePdf.ts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { styles } from './pdfUtil.ts';

export const createTrackStreetPdf = (planningLabel?: string) => (trackStreets: TrackStreetInfo) => {
    const docDefinition: TDocumentDefinitions = {
        pageOrientation: 'landscape',
        content: [
            '',
            { text: trackStreets.name.replaceAll('.gpx', ''), style: 'titleStyle' },
            '\n\n',
            planningLabel ? `${planningLabel}` : ' ',
            ' ',
            { text: 'Routeninformationen', style: 'titleStyle' },
            ' ',
            createInfoTable(trackStreets),
            ' ',
            ' ',
            ...createBreakOverviewTable(trackStreets),
            ' ',
            ' ',
            ...createNodeOverviewTable(trackStreets),
            ' ',
            ' ',
            { text: 'Straßenübersicht', style: 'titleStyle' },
            ' ',
            createStreetTable(trackStreets),
        ],
        styles,
    };
    pdfMake.createPdf(docDefinition).download(trackStreets.name + '.pdf');
};
