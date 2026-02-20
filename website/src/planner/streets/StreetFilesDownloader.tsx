import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { BlockedStreetInfo, TrackStreetInfo } from '../logic/resolving/types.ts';
import { getBlockedStreetInfo } from '../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { convertTrackInfoToCsv } from '../download/csv/trackStreetsCsv.ts';
import { convertStreetInfoToCsv } from '../download/csv/blockedStreetsCsv.ts';
import { IntlShape, useIntl } from 'react-intl';
import { getTrackStreetInfos } from '../logic/resolving/aggregate/calculateTrackStreetInfosWithBreaksAndNodes.ts';
import { DownloadIcon } from '../../utils/icons/DownloadIcon.tsx';

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
    const trackStreetInfos = useSelector(getTrackStreetInfos);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    return (
        <Button
            onClick={() => downloadFiles(trackStreetInfos, blockedStreetInfos, intl)}
            disabled={trackStreetInfos.length === 0}
            variant={'info'}
            title={intl.formatMessage({ id: 'msg.downloadCsv' })}
        >
            <DownloadIcon size={20} black={true} />
            CSV
        </Button>
    );
};
