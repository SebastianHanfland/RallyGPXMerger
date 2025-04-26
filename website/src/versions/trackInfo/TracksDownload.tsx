import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import download from '../../assets/file-down.svg';
import { downloadFilesInZip } from '../../planner/tracks/CalculatedFilesDownloader.tsx';
import { getZipTracks } from '../store/zipTracks.reducer.ts';

export const ZipFilesDownloader = () => {
    const intl = useIntl();
    const zipTracks = useSelector(getZipTracks);
    if (!zipTracks) {
        return null;
    }
    return (
        <Button
            onClick={() => downloadFilesInZip(zipTracks, 'Sternfahrt-Muenchen-2024')}
            disabled={zipTracks.length === 0}
            title={intl.formatMessage({ id: 'msg.downloadTracks.hint' })}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            <FormattedMessage id={'msg.downloadTracks'} />
        </Button>
    );
};
