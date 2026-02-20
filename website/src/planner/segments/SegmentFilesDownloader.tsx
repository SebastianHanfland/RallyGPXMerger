import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { downloadFilesInZip } from '../tracks/CalculatedFilesDownloader.tsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { getParsedGpxSegments } from '../store/segmentData.redux.ts';
import { getGpxContentStringFromParsedSegment } from '../../utils/SimpleGPXFromPoints.ts';
import { DownloadIcon } from '../../utils/icons/DownloadIcon.tsx';

export const SegmentFilesDownloader = () => {
    const intl = useIntl();
    const segments = useSelector(getParsedGpxSegments);
    return (
        <Button
            onClick={() =>
                downloadFilesInZip(
                    segments.map((segment) => ({
                        content: getGpxContentStringFromParsedSegment(segment),
                        filename: segment.filename,
                    })),
                    'Segments'
                )
            }
            disabled={segments.length === 0}
            variant={'info'}
            title={intl.formatMessage({ id: 'msg.downloadSegments.hint' })}
        >
            <DownloadIcon size={20} />
            <FormattedMessage id={'msg.downloadSegments'} />
        </Button>
    );
};
