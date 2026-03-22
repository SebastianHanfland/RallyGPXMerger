import Button from 'react-bootstrap/Button';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getTrackStreetInfos } from '../../calculation/getTrackStreetInfos.ts';
import { getPlanningLabel, getPlanningTitle } from '../../store/settings.reducer.ts';
import { getBlockedStreetInfo } from '../../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { generatePdfsInZip } from './pdfDownload.tsx';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { DownloadIcon } from '../../../utils/icons/DownloadIcon.tsx';

export const PdfDocumentInZipButton = () => {
    const trackStreetInfos = useSelector(getTrackStreetInfos);
    const planningLabel = useSelector(getPlanningLabel);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const planningTitle = useSelector(getPlanningTitle);
    const intl = useIntl();
    const [isBusy, setIsBusy] = useState(false);

    return (
        <Button
            onClick={() => {
                setIsBusy(true);
                setTimeout(() => {
                    generatePdfsInZip(trackStreetInfos, blockedStreetInfos, intl, planningTitle, planningLabel).then(
                        () => setIsBusy(false)
                    );
                }, 10);
            }}
            variant={'info'}
            disabled={trackStreetInfos.length === 0 || isBusy}
            title={intl.formatMessage({ id: 'msg.downloadPdf' })}
        >
            {isBusy && <Spinner size={'sm'} />}
            <DownloadIcon size={20} black={true} />
            PDFs
        </Button>
    );
};
