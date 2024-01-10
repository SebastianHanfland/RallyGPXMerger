import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { BlockedStreetInfo, TrackStreetInfo } from '../../mapMatching/types.ts';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from '../../mapMatching/getEnrichedTrackStreetInfos.ts';

import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { convertTrackInfoToCsv } from './trackCsvCreator.ts';
import { convertStreetInfoToCsv } from './streetsCsvCreator.ts';

const streetInfoHeaderLength = 7;

function createBlockedStreetPdf(blockedStreet: BlockedStreetInfo[]) {
    const doc = new JsPDF();

    const csvRows = convertStreetInfoToCsv(blockedStreet)
        .split('\n')
        .map((row) => row.split(';'));
    doc.text('Blockierte Straßen', 10, 10);
    autoTable(doc, {
        head: csvRows.slice(0, 1),
        body: csvRows.slice(1),
    });

    doc.save('Blockierte Straßen.pdf');
}

function createStreetInfoPdf(trackStreets: TrackStreetInfo) {
    const doc = new JsPDF();

    const csvRows = convertTrackInfoToCsv(trackStreets).split('\n');
    const infoBody: string[][] = csvRows.slice(0, streetInfoHeaderLength).map((row) => row.split(';'));
    const streetBody: string[][] = csvRows.slice(streetInfoHeaderLength).map((row) => row.split(';'));

    doc.text(trackStreets.name, 10, 10);

    autoTable(doc, {
        head: infoBody.slice(0, 1),
        body: infoBody.slice(1),
    });
    autoTable(doc, {
        head: streetBody.slice(0, 1),
        body: streetBody.slice(1),
    });

    doc.save(`${trackStreets.name}.pdf`);
}

const downloadFiles = (trackStreetInfos: TrackStreetInfo[], blockedStreetInfos: BlockedStreetInfo[]) => {
    // trackStreetInfos.forEach((info) => createStreetInfoPdf(info, trackCompositions));
    createStreetInfoPdf(trackStreetInfos[0]);
    createBlockedStreetPdf(blockedStreetInfos);
    console.log(trackStreetInfos, blockedStreetInfos);
};

export const StreetFilesJsPdfDownloader = () => {
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    return (
        <Button
            onClick={() => downloadFiles(trackStreetInfos, blockedStreetInfos)}
            disabled={trackStreetInfos.length === 0}
            title={'Download all GPX files for the tracks as pdfs'}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            Download Street files as pdf
        </Button>
    );
};
