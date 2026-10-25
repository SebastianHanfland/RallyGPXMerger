import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { downloadFilesInZip } from '../../planner/download/gpx/CalculatedFilesDownloader';
import { getDisplayTitle, getDisplayTracks } from '../store/displayTracksReducer';
import { getGpxContentFromTimedPoints } from '../../utils/SimpleGPXFromPoints';
import { DownloadIcon } from '../../utils/icons/DownloadIcon';

export const ZipFilesDownloader = () => {
    const intl = useIntl();
    const displayTracks = useSelector(getDisplayTracks);
    const planningTitle = useSelector(getDisplayTitle);

    if (!displayTracks) {
        return null;
    }
    return (
        <Button
            onClick={() => {
                const tracksWithContent = displayTracks.map((track) => ({
                    filename: track.filename,
                    content: getGpxContentFromTimedPoints(track.points, track.filename),
                }));
                downloadFilesInZip(tracksWithContent, planningTitle ?? 'Demonstration');
            }}
            disabled={displayTracks.length === 0}
            title={intl.formatMessage({ id: 'msg.downloadTracks.hint' })}
        >
            <DownloadIcon />
            <FormattedMessage id={'msg.downloadTracks'} />
        </Button>
    );
};
