import Button from 'react-bootstrap/Button';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import {
    getDisplayBlockedStreets,
    getDisplayPlanningLabel,
    getDisplayTitle,
    getDisplayTrackStreetInfos,
} from '../store/displayTracksReducer.ts';
import { generatePdfsInZip } from '../../planner/download/pdf/pdfDownload.tsx';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';

export function TrackInformationPdfZipDownloadButton() {
    const intl = useIntl();
    const planningLabel = useSelector(getDisplayPlanningLabel) ?? '';
    const planningTitle = useSelector(getDisplayTitle) ?? '';
    const blockedStreetInfos = useSelector(getDisplayBlockedStreets);
    const trackStreetInfos = useSelector(getDisplayTrackStreetInfos);
    const [isBusy, setIsBusy] = useState(false);

    if (!blockedStreetInfos || !trackStreetInfos) {
        return null;
    }

    return (
        <Button
            variant="success"
            onClick={() => {
                setIsBusy(true);
                setTimeout(() => {
                    generatePdfsInZip(trackStreetInfos, blockedStreetInfos, intl, planningTitle, planningLabel).then(
                        () => setIsBusy(false)
                    );
                }, 10);
            }}
            disabled={isBusy}
        >
            {isBusy && <Spinner size={'sm'} />}
            Alle PDF herunterladen
        </Button>
    );
}
