import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { BlockedStreetInfo, TrackStreetInfo } from '../../mapMatching/types.ts';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from '../../mapMatching/getEnrichedTrackStreetInfos.ts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { convertTrackInfoToCsv } from './trackCsvCreator.ts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { streetInfoHeaderLength } from './StreetFilesjsPdfDownloader.tsx';
import { convertStreetInfoToCsv } from './streetsCsvCreator.ts';

try {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
} catch (error) {
    console.error('pdfmake error', error);
}

function createBlockedStreetsPdf(trackStreets: BlockedStreetInfo[]) {
    const trackInfo = convertStreetInfoToCsv(trackStreets).replaceAll('Wahlkreis', '').split('\n');
    const body: string[][] = trackInfo.map((row) => row.split(';'));

    const docDefinition: TDocumentDefinitions = {
        pageOrientation: 'landscape',
        content: [
            '',
            { text: 'Blockierte Straßen', fontSize: 15 },
            '\n\n',
            '',
            '',
            ' ',
            ' ',
            {
                layout: 'lightHorizontalLines', // optional
                table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,
                    widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    body: body,
                },
            },
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

function createStreetTable(trackStreets: TrackStreetInfo) {
    const trackInfo = convertTrackInfoToCsv(trackStreets).replaceAll('Wahlkreis', '').split('\n');
    const body: string[][] = trackInfo.slice(streetInfoHeaderLength).map((row) => row.split(';'));
    return {
        layout: 'lightHorizontalLines', // optional
        table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: body,
        },
    };
}

function createInfoTable(trackStreets: TrackStreetInfo) {
    const trackInfo = convertTrackInfoToCsv(trackStreets).replaceAll('Wahlkreis', '').split('\n');
    const infoBody: string[][] = trackInfo.slice(0, streetInfoHeaderLength).map((row) => row.split(';'));
    return {
        layout: 'lightHorizontalLines', // optional
        table: {
            widths: ['auto', 'auto'],

            body: infoBody,
        },
    };
}

export function createTrackStreetPdf(trackStreets: TrackStreetInfo) {
    const docDefinition: TDocumentDefinitions = {
        pageOrientation: 'landscape',
        content: [
            '',
            { text: trackStreets.name.replaceAll('.gpx', ''), fontSize: 15 },
            '\n\n',
            '',
            '',
            createInfoTable(trackStreets),
            ' ',
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
        },
    };
    pdfMake.createPdf(docDefinition).download(trackStreets.name + '.pdf');
}

const downloadFiles = (trackStreetInfos: TrackStreetInfo[], blockedStreetInfos: BlockedStreetInfo[]) => {
    trackStreetInfos.forEach(createTrackStreetPdf);
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
