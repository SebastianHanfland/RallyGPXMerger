import { PDFDownloadLink } from '@react-pdf/renderer';
import { useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { DownloadIcon } from '../../../utils/icons/DownloadIcon.tsx';
import { BlockedStreetsPdf } from './BlockedStreetsPdf.tsx';
import { useSelector } from 'react-redux';
import { getBlockedStreetInfo } from '../../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { getPlanningLabel } from '../../store/settings.reducer.ts';

export const BlockedStreetsPdfDownloadButton = () => {
    const intl = useIntl();
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const planningLabel = useSelector(getPlanningLabel);

    const blockedStreets = intl.formatMessage({ id: 'msg.blockedStreets' });
    return (
        <Button className={'p-0'} style={{ height: '35px' }} variant={'info'}>
            <PDFDownloadLink
                style={{ color: 'black', textDecoration: 'none', fontWeight: 400 }}
                className={'m-0 p-1'}
                document={
                    <BlockedStreetsPdf blockedStreets={blockedStreetInfos} intl={intl} planningLabel={planningLabel} />
                }
                fileName={`${blockedStreets}.pdf`}
            >
                <DownloadIcon black={true} />
                {blockedStreets}
            </PDFDownloadLink>
        </Button>
    );
};
