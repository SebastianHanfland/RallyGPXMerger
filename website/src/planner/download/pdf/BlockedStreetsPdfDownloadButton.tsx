import { useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { DownloadIcon } from '../../../utils/icons/DownloadIcon.tsx';
import { useSelector } from 'react-redux';
import { getBlockedStreetInfo } from '../../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { getPlanningLabel } from '../../store/settings.reducer.ts';
import { downloadBlockedStreetPdf } from './pdfDownload.tsx';

export const BlockedStreetsPdfDownloadButton = () => {
    const intl = useIntl();
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const planningLabel = useSelector(getPlanningLabel);

    const blockedStreets = intl.formatMessage({ id: 'msg.blockedStreets' });

    const downloadPdf = () => downloadBlockedStreetPdf(blockedStreetInfos, intl, planningLabel);

    return (
        <Button className={'p-0'} style={{ height: '35px' }} variant={'info'} onClick={downloadPdf}>
            <DownloadIcon black={true} />
            {blockedStreets}
        </Button>
    );
};
