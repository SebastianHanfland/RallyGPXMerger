import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { TrackStreetsPdf } from './TrackStreetsPdf.tsx';
import { useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { DownloadIcon } from '../../../utils/icons/DownloadIcon.tsx';

interface Props {
    trackStreets: TrackStreetInfo;
    planningLabel?: string;
}

export const TrackInfoPdfDownloadButton = ({ trackStreets, planningLabel }: Props) => {
    const intl = useIntl();

    return (
        <Button className={'m-1 p-0'} style={{ height: '35px' }}>
            <PDFDownloadLink
                style={{ color: 'white', textDecoration: 'none' }}
                className={'m-0 p-1'}
                document={<TrackStreetsPdf trackStreets={trackStreets} intl={intl} planningLabel={planningLabel} />}
                fileName={`${trackStreets.name}.pdf`}
            >
                <DownloadIcon />
                PDF
            </PDFDownloadLink>
        </Button>
    );
};
