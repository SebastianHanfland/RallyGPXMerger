import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { downloadFilesInZip } from './CalculatedFilesDownloader.tsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import { getGpxContentStringFromParsedSegment } from '../../../utils/SimpleGPXFromPoints.ts';
import { DownloadIcon } from '../../../utils/icons/DownloadIcon.tsx';
import { getPlanningTitle } from '../../store/settings.reducer.ts';

export const SegmentFilesDownloader = () => {
    const intl = useIntl();
    const segments = useSelector(getParsedGpxSegments);
    const planningTitle = useSelector(getPlanningTitle) ?? 'RallyGPXMergeState';

    return (
        <Button
            onClick={() =>
                downloadFilesInZip(
                    segments.map((segment) => ({
                        content: getGpxContentStringFromParsedSegment(segment),
                        filename: segment.filename,
                    })),
                    `${planningTitle}-Segments`
                )
            }
            disabled={segments.length === 0}
            variant={'info'}
            title={intl.formatMessage({ id: 'msg.downloadSegments.hint' })}
        >
            <DownloadIcon size={20} black={true} />
            <FormattedMessage id={'msg.downloadSegments'} />
        </Button>
    );
};
