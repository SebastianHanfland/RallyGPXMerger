import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { BlockedStreetInfo, TrackStreetInfo } from '../../mapMatching/types.ts';
import { getBlockedStreetInfo } from '../../mapMatching/getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from '../../mapMatching/getEnrichedTrackStreetInfos.ts';
import { convertTrackInfoToCsv } from './trackCsvCreator.ts';
import { convertStreetInfoToCsv } from './streetsCsvCreator.ts';
import { getLanguage } from '../../language.ts';

const downloadFiles = (trackStreetInfos: TrackStreetInfo[], blockedStreetInfos: BlockedStreetInfo[]) => {
    const zip = new JSZip();
    trackStreetInfos.forEach((track) => {
        zip.file(
            `${track.name}-${track.distanceInKm.toFixed(2)}km.csv`,
            new Blob([convertTrackInfoToCsv(track)], { type: 'csv' })
        );
    });
    zip.file(
        getLanguage() === 'de' ? `Blockierte-Straßen.csv` : `Blocked-Streets.csv`,
        new Blob([convertStreetInfoToCsv(blockedStreetInfos)], { type: 'csv' })
    );
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        FileSaver.saveAs(content, `StreetList-${new Date().toISOString()}.zip`);
    });
};

export const StreetFilesDownloader = () => {
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    return (
        <Button
            onClick={() => downloadFiles(trackStreetInfos, blockedStreetInfos)}
            disabled={trackStreetInfos.length === 0}
            title={'Download all GPX files for the tracks'}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            Download Street files
        </Button>
    );
};
