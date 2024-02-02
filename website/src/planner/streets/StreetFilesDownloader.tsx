import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { BlockedStreetInfo, TrackStreetInfo } from '../logic/resolving/types.ts';
import { getBlockedStreetInfo } from '../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { convertTrackInfoToCsv } from '../download/csv/trackStreetsCsv.ts';
import { convertStreetInfoToCsv } from '../download/csv/blockedStreetsCsv.ts';
import { getLanguage } from '../../language.ts';

function createCsv(csv: string) {
    return new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], { type: 'csv;charset=utf-8' });
}

const downloadFiles = (trackStreetInfos: TrackStreetInfo[], blockedStreetInfos: BlockedStreetInfo[]) => {
    const zip = new JSZip();
    trackStreetInfos.forEach((track) => {
        zip.file(`${track.name}-${track.distanceInKm.toFixed(2)}km.csv`, createCsv(convertTrackInfoToCsv(track)));
    });
    zip.file(
        getLanguage() === 'de' ? `Blockierte-Straßen.csv` : `Blocked-Streets.csv`,
        createCsv(convertStreetInfoToCsv(blockedStreetInfos))
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
            title={'Download all information for the tracks as a csv'}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            CSV
        </Button>
    );
};
