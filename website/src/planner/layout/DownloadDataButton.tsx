import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-downB.svg';
import { useIntl } from 'react-intl';
import { downloadFile } from '../segments/FileDownloader.tsx';

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
                <img src={download} className="m-1" alt="trash" style={{ height: '20px', width: '20px' }} />
                {intl.formatMessage({ id: 'msg.downloadPlanning' })}
            </Button>
        </>
    );
}
