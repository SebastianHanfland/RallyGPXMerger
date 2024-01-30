import { BlockedStreetInfo, TrackStreetInfo } from '../logic/resolving/types.ts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { createBlockedStreetTable } from './streetsPdfCreator.ts';
import {
    createBreakOverviewTable,
    createInfoTable,
    createNodeOverviewTable,
    createStreetTable,
} from './trackPdfContentCreator.ts';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

try {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
} catch (error) {
    console.error('pdfmake error', error);
}

const styles = {
    linkStyle: {
        color: 'blue',
    },
    headerStyle: {
        bold: true,
    },
    titleStyle: {
        bold: true,
        fontSize: 15,
    },
};

export function createBlockedStreetsPdf(trackStreets: BlockedStreetInfo[]) {
    const docDefinition: TDocumentDefinitions = {
        pageOrientation: 'landscape',
        content: [
            '',
            { text: 'Blockierte Straßen', style: 'titleStyle' },
            '\n\n',
            ' ',
            ' ',
            ' ',
            createBlockedStreetTable(trackStreets),
        ],
        styles,
    };
    pdfMake.createPdf(docDefinition).download('Blockierte-Strassen.pdf');
}

export function createTrackStreetPdf(trackStreets: TrackStreetInfo) {
    const docDefinition: TDocumentDefinitions = {
        pageOrientation: 'landscape',
        content: [
            '',
            { text: trackStreets.name.replaceAll('.gpx', ''), style: 'titleStyle' },
            '\n\n',
            ' ',
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
}
