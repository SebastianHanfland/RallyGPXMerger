import { TrackStreetInfo } from '../../logic/resolving/types.ts';
import Button from 'react-bootstrap/Button';
import { DownloadIcon } from '../../../utils/icons/DownloadIcon.tsx';
import { downloadSingleTrackStreetInfoPdf } from './pdfDownload.tsx';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';

interface Props {
    trackStreets: TrackStreetInfo;
    planningLabel?: string;
}

export const TrackInfoPdfDownloadButton = ({ trackStreets, planningLabel }: Props) => {
    const intl = useIntl();
    const [isBusy, setIsBusy] = useState(false);
    console.log({ isBusy });
    const downloadPdf = () => {
        setIsBusy(true);
        setTimeout(() => {
            downloadSingleTrackStreetInfoPdf(trackStreets, intl, planningLabel).then(() => setIsBusy(false));
        }, 10);
    };

    return (
        <Button size={'sm'} className={'m-1'} onClick={downloadPdf} disabled={isBusy}>
            {isBusy && <Spinner size={'sm'} />}
            <DownloadIcon />
            PDF
        </Button>
    );
};
