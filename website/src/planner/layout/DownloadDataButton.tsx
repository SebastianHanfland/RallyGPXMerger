import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { downloadFile } from '../segments/FileDownloader.tsx';
import { DownloadIcon } from '../../utils/icons/DownloadIcon.tsx';

export function DownloadDataButton() {
    const intl = useIntl();
    const state = useSelector((a) => a);

    return (
        <>
            <Button
                variant="info"
                title={intl.formatMessage({ id: 'msg.downloadPlanning' })}
                onClick={() =>
                    downloadFile(`RallyGPXMergeState-${new Date().toISOString()}.json`, JSON.stringify(state))
                }
            >
                <DownloadIcon size={20} black={true} />
                {intl.formatMessage({ id: 'msg.downloadPlanning' })}
            </Button>
        </>
    );
}
