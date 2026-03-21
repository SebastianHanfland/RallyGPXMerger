import Button from 'react-bootstrap/Button';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getTrackStreetInfos } from '../../calculation/getTrackStreetInfos.ts';
import { getPlanningLabel, getPlanningTitle } from '../../store/settings.reducer.ts';
import { getBlockedStreetInfo } from '../../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { generatePdfsInZip } from './pdfDownload.tsx';

export const PdfDocumentInZipButton = () => {
    const trackStreetInfos = useSelector(getTrackStreetInfos);
    const planningLabel = useSelector(getPlanningLabel);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const planningTitle = useSelector(getPlanningTitle);
    const intl = useIntl();

    return (
        <Button
            onClick={() => generatePdfsInZip(trackStreetInfos, blockedStreetInfos, intl, planningTitle, planningLabel)}
            variant={'info'}
            disabled={trackStreetInfos.length === 0}
            title={intl.formatMessage({ id: 'msg.downloadPdf' })}
        >
            PDFs
        </Button>
    );
};
