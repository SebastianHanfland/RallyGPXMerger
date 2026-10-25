import { Dropdown } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DownloadIcon } from '../../utils/icons/DownloadIcon';
import { downloadFile } from '../download/FileDownloader';
import { getGpxContentStringFromParsedSegment } from '../../utils/SimpleGPXFromPoints';
import { makeGetParsedGpxSegment } from '../store/segmentData.redux';
import { State } from '../store/types';

export function SegmentDownloadDropdownItem({ id, name }: { id: string; name: string }) {
    const intl = useIntl();
    const selectSegment = useMemo(makeGetParsedGpxSegment, []);
    const segment = useSelector((state: State) => selectSegment(state, id));

    return (
        <Dropdown.Item
            onClick={() => {
                if (segment) {
                    downloadFile(name, getGpxContentStringFromParsedSegment(segment));
                }
            }}
            title={intl.formatMessage({ id: 'msg.downloadFile.hint' }, { name })}
        >
            <DownloadIcon black={true} />
            <span>
                <FormattedMessage id="msg.downloadFile" />
            </span>
        </Dropdown.Item>
    );
}
