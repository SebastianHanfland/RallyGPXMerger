import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import download from '../../assets/file-down.svg';
import { downloadFilesInZip } from '../../planner/tracks/CalculatedFilesDownloader.tsx';
import { getDisplayTitle, getDisplayTracks } from '../store/displayTracksReducer.ts';

export const ZipFilesDownloader = () => {
    const intl = useIntl();
    const displayTracks = useSelector(getDisplayTracks);
    const planningTitle = useSelector(getDisplayTitle);

    if (!displayTracks) {
        return null;
    }
    return (
        <Button
            onClick={() => downloadFilesInZip(displayTracks, planningTitle ?? 'Demonstration')}
            disabled={displayTracks.length === 0}
            title={intl.formatMessage({ id: 'msg.downloadTracks.hint' })}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            <FormattedMessage id={'msg.downloadTracks'} />
        </Button>
    );
};
