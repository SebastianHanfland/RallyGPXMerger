import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { BlockedStreetInfo, TrackStreetInfo } from '../../mapMatching/types.ts';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from '../../mapMatching/getEnrichedTrackStreetInfos.ts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import {
    createBreakOverviewTable,
    createInfoTable,
    createNodeOverviewTable,
    createStreetTable,
} from './trackPdfContentCreator.ts';
import { createBlockedStreetTable } from './streetsPdfCreator.ts';

try {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
} catch (error) {
    console.error('pdfmake error', error);
}

function createBlockedStreetsPdf(trackStreets: BlockedStreetInfo[]) {
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
        styles: {
            linkStyle: {
                color: 'blue',
            },
            headerStyle: {
                bold: true,
            },
        },
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
        styles: {
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
        },
    };
    pdfMake.createPdf(docDefinition).download(trackStreets.name + '.pdf');
}

const downloadFiles = (trackStreetInfos: TrackStreetInfo[], blockedStreetInfos: BlockedStreetInfo[]) => {
    // trackStreetInfos.forEach(createTrackStreetPdf);
    createTrackStreetPdf(trackStreetInfos[0]);
    createBlockedStreetsPdf(blockedStreetInfos);
};

export const StreetFilesPdfMakeDownloader = () => {
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    return (
        <Button
            onClick={() => downloadFiles(trackStreetInfos, blockedStreetInfos)}
            disabled={trackStreetInfos.length === 0}
            title={'Download all GPX files for the tracks'}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            Download Street files as pdf
        </Button>
    );
};
