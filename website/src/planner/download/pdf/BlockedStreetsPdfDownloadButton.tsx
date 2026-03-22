import { useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { DownloadIcon } from '../../../utils/icons/DownloadIcon.tsx';
import { useSelector } from 'react-redux';
import { getBlockedStreetInfo } from '../../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { getPlanningLabel } from '../../store/settings.reducer.ts';
import { downloadBlockedStreetPdf } from './pdfDownload.tsx';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';

export const BlockedStreetsPdfDownloadButton = () => {
    const intl = useIntl();
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const planningLabel = useSelector(getPlanningLabel);
    const [isBusy, setIsBusy] = useState(false);

    const blockedStreets = intl.formatMessage({ id: 'msg.blockedStreets' });

    const downloadPdf = () => {
        setIsBusy(true);
        setTimeout(() => {
            downloadBlockedStreetPdf(blockedStreetInfos, intl, planningLabel).then(() => setIsBusy(false));
        }, 10);
    };

    return (
        <Button className={'p-0'} style={{ height: '35px' }} variant={'info'} onClick={downloadPdf} disabled={isBusy}>
            {isBusy && <Spinner size={'sm'} />}
            <DownloadIcon size={20} black={true} />
            {blockedStreets}
        </Button>
    );
};
