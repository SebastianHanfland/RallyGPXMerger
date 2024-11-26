import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { downloadFilesInZip } from '../tracks/CalculatedFilesDownloader.tsx';
import { FormattedMessage, useIntl } from 'react-intl';

export const SegmentFilesDownloader = () => {
    const intl = useIntl();
    const segments = useSelector(getGpxSegments);
    return (
        <Button
            onClick={() => downloadFilesInZip(segments, 'Segments')}
            disabled={segments.length === 0}
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
