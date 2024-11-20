import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { CSSProperties } from 'react';
import download from '../../assets/file-downB.svg';
import { useIntl } from 'react-intl';
import { downloadFile } from '../segments/FileDownloader.tsx';

const removeDataStyle: CSSProperties = {
    position: 'fixed',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    left: 70,
    bottom: 110,
    zIndex: 10,
    overflow: 'hidden',
    cursor: 'pointer',
};

export function DownloadDataButton() {
    const intl = useIntl();
    const state = useSelector((a) => a);

    return (
        <>
            <Button
                style={removeDataStyle}
                className={'m-0 p-0'}
                variant="info"
                title={intl.formatMessage({ id: 'msg.downloadPlanning' })}
                onClick={() =>
                    downloadFile(`RallyGPXMergeState-${new Date().toISOString()}.json`, JSON.stringify(state))
                }
            >
                <img src={download} className="m-1" alt="trash" style={{ height: '30px', width: '30px' }} />
            </Button>
        </>
    );
}
