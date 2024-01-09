import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { BlockedStreetInfo, TrackStreetInfo } from '../../mapMatching/types.ts';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from '../../mapMatching/getEnrichedTrackStreetInfos.ts';

import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { convertTrackInfoToCsv } from './trackCsvCreator.ts';

const infoHeaderLength = 6;

function createStreetInfoPdf(trackStreets: TrackStreetInfo) {
    const doc = new JsPDF();

    const csvRows = convertTrackInfoToCsv(trackStreets).split('\n');
    const infoBody: string[][] = csvRows.slice(0, infoHeaderLength).map((row) => row.split(';'));
    const streetBody: string[][] = csvRows.slice(infoHeaderLength).map((row) => row.split(';'));

    doc.text(trackStreets.name, 10, 10);
    autoTable(doc, {
        head: infoBody.slice(0, 1),
        body: infoBody.slice(1),
    });
    autoTable(doc, {
        head: streetBody.slice(0, 1),
        body: streetBody.slice(1),
    });

    doc.save('table.pdf');
}

const downloadFiles = (trackStreetInfos: TrackStreetInfo[], blockedStreetInfos: BlockedStreetInfo[]) => {
    trackStreetInfos.forEach((info) => createStreetInfoPdf(info));

    console.log(trackStreetInfos, blockedStreetInfos);
};

export const StreetFilesJsPdfDownloader = () => {
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
