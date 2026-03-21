import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import Button from 'react-bootstrap/Button';
import { DownloadIcon } from '../../../utils/icons/DownloadIcon.tsx';
import { downloadSinglePdf } from './pdfDownload.tsx';
import { useIntl } from 'react-intl';

interface Props {
    trackStreets: TrackStreetInfo;
    planningLabel?: string;
}

export const TrackInfoPdfDownloadButton = ({ trackStreets, planningLabel }: Props) => {
    const intl = useIntl();
    const downloadPdf = () => {
        downloadSinglePdf(trackStreets, intl, planningLabel);
    };

    return (
        <Button size={'sm'} className={'m-1'} onClick={downloadPdf}>
            <DownloadIcon />
            PDF
        </Button>
    );
};
