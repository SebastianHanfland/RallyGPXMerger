import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { BlockedStreetInfo, TrackStreetInfo } from '../../mapMatching/types.ts';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from '../../mapMatching/getEnrichedTrackStreetInfos.ts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { convertTrackInfoToCsv } from './trackCsvCreator.ts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

function createTrackStreetPdf(trackStreets: TrackStreetInfo) {
    const body: string[][] = convertTrackInfoToCsv(trackStreets)
        .split('\n')
        .slice(7)
        .map((row) => row.split(';'));

    console.table(body);

    const docDefinition = {
        header: 'simple text',
        content: [
            '',
            { text: trackStreets.name.replaceAll('.gpx', ''), fontSize: 15 },
            '\n\n',
            '',
            '',
            {
                layout: 'lightHorizontalLines', // optional
                table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,
                    widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],

                    body: body,
                },
            },
        ],
    };
    pdfMake.createPdf(docDefinition).download();
}

const downloadFiles = (trackStreetInfos: TrackStreetInfo[], blockedStreetInfos: BlockedStreetInfo[]) => {
    createTrackStreetPdf(trackStreetInfos[0]);

    console.log(trackStreetInfos, blockedStreetInfos);
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
