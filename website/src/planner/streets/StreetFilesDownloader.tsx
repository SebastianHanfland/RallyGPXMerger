import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-downB.svg';
import { BlockedStreetInfo, TrackStreetInfo } from '../logic/resolving/types.ts';
import { getBlockedStreetInfo } from '../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { convertTrackInfoToCsv } from '../download/csv/trackStreetsCsv.ts';
import { convertStreetInfoToCsv } from '../download/csv/blockedStreetsCsv.ts';
import { IntlShape, useIntl } from 'react-intl';

function createCsv(csv: string) {
    return new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], { type: 'csv;charset=utf-8' });
}

const downloadFiles = (
    trackStreetInfos: TrackStreetInfo[],
    blockedStreetInfos: BlockedStreetInfo[],
    intl: IntlShape
) => {
    const zip = new JSZip();
    trackStreetInfos.forEach((track) => {
        zip.file(`${track.name}-${track.distanceInKm.toFixed(2)}km.csv`, createCsv(convertTrackInfoToCsv(track, intl)));
    });
    zip.file(
        `${intl.formatMessage({ id: 'msg.blockedStreetsFileName' })}.csv`,
        createCsv(convertStreetInfoToCsv(blockedStreetInfos, intl))
    );
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        FileSaver.saveAs(content, `${intl.formatMessage({ id: 'msg.streetListZip' })}-${new Date().toISOString()}.zip`);
    });
};

export const StreetFilesDownloader = () => {
    const intl = useIntl();
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    return (
        <Button
            onClick={() => downloadFiles(trackStreetInfos, blockedStreetInfos, intl)}
            disabled={trackStreetInfos.length === 0}
            variant={'info'}
            title={intl.formatMessage({ id: 'msg.downloadCsv' })}
        >
            <img
                src={download}
                className="m-1"
                alt="download file"
                color={'#ffffff'}
                style={{ height: '20px', width: '20px' }}
            />
            CSV
        </Button>
    );
};
