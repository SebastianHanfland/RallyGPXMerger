import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-downB.svg';
import { downloadFilesInZip } from '../tracks/CalculatedFilesDownloader.tsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { getParsedGpxSegments } from '../new-store/segmentData.redux.ts';
import { getGpxContentStringFromParsedSegment } from '../../utils/SimpleGPXFromPoints.ts';

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
            <img
                src={download}
                className="m-1"
                alt="download file"
                color={'#ffffff'}
                style={{ height: '20px', width: '20px' }}
            />
            <FormattedMessage id={'msg.downloadSegments'} />
        </Button>
    );
};
