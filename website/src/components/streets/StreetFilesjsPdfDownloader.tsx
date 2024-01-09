import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { BlockedStreetInfo, TrackStreetInfo } from '../../mapMatching/types.ts';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from '../../mapMatching/getEnrichedTrackStreetInfos.ts';

import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { convertTrackInfoToCsv } from './trackCsvCreator.ts';

function createPdf(trackStreets: TrackStreetInfo) {
    const doc = new JsPDF();

    // It can parse html:
    // <table id="my-table"><!-- ... --></table>
    //     autoTable(doc, { html: '#my-table' })

    // Or use javascript directly:

    const csvBody = convertTrackInfoToCsv(trackStreets);

    const infoBody: string[][] = csvBody
        .split('\n')
        .slice(0, 6)
        .map((row) => row.split(';'));

    const streetBody: string[][] = csvBody
        .split('\n')
        .slice(6)
        .map((row) => row.split(';'));

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
    // const zip = new JSZip();
    // trackStreetInfos.forEach((track) => {
    //     zip.file(`${track.name}-${track.distanceInKm.toFixed(2)}km.csv`, createCsv(convertTrackInfoToCsv(track)));
    // });
    createPdf(trackStreetInfos[0]);
    // zip.file(
    //     getLanguage() === 'de' ? `Blockierte-Straßen.csv` : `Blocked-Streets.csv`,
    //
    //     // createCsv(convertStreetInfoToCsv(blockedStreetInfos))
    // );
    // zip.generateAsync({ type: 'blob' }).then(function (content) {
    //     FileSaver.saveAs(content, `StreetList-${new Date().toISOString()}.zip`);
    // });

    console.log(trackStreetInfos, blockedStreetInfos);

    // const printer = new pdfMake({});

    // printer.createPdfKitDocument(docDefinition, {}).file().;
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
