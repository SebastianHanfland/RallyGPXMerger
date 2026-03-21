import { BlobProvider } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Button from 'react-bootstrap/Button';
import { TrackStreetsPdf } from './TrackStreetsPdf.tsx';
import { IntlShape, useIntl } from 'react-intl';
import { BlockedStreetInfo, TrackStreetInfo } from '../../logic/resolving/types.ts';
import { BlockedStreetsPdf } from './BlockedStreetsPdf.tsx';
import { useSelector } from 'react-redux';
import { getTrackStreetInfos } from '../../calculation/getTrackStreetInfos.ts';
import { getPlanningLabel } from '../../store/settings.reducer.ts';
import { getBlockedStreetInfo } from '../../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { createRoot } from 'react-dom/client';

const generatePdf = async (
    trackStreetInfos: TrackStreetInfo[],
    blockedStreetInfos: BlockedStreetInfo[],
    intl: IntlShape,
    planningLabel?: string
) => {
    const pdfBlobs = await Promise.all(
        trackStreetInfos.map((info) => generateTrackStreetPdfUrl(info, intl, planningLabel))
    );
    const blockedStreets = await generateBlockedStreetsPdfUrl(blockedStreetInfos, intl, planningLabel);
    await createAndDownloadZip([...pdfBlobs, blockedStreets]);
};

const generateTrackStreetPdfUrl = (trackStreetInfo: TrackStreetInfo, intl: IntlShape, planningLabel?: string) => {
    return new Promise<Blob>((resolve, reject) => {
        createRoot(document.createElement('div')).render(
            <BlobProvider
                document={<TrackStreetsPdf trackStreets={trackStreetInfo} intl={intl} planningLabel={planningLabel} />}
            >
                {({ blob, loading, error }) => {
                    if (!loading && blob) {
                        resolve(blob);
                    } else if (error) {
                        reject(error);
                    }
                    return null;
                }}
            </BlobProvider>
        );
    });
};

const generateBlockedStreetsPdfUrl = (
    blockedStreetInfos: BlockedStreetInfo[],
    intl: IntlShape,
    planningLabel?: string
) => {
    return new Promise<Blob>((resolve, reject) => {
        createRoot(document.createElement('div')).render(
            <BlobProvider
                document={
                    <BlockedStreetsPdf blockedStreets={blockedStreetInfos} intl={intl} planningLabel={planningLabel} />
                }
            >
                {({ blob, loading, error }) => {
                    if (!loading && blob) {
                        resolve(blob);
                    } else if (error) {
                        reject(error);
                    }
                    return null;
                }}
            </BlobProvider>
        );
    });
};

async function createAndDownloadZip(pdfBlobs: Blob[]) {
    const zip = new JSZip();
    pdfBlobs.forEach((blob, index) => {
        zip.file(`document-${index + 1}.pdf`, blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'documents.zip');
}

export const DButton = () => {
    const trackStreetInfos = useSelector(getTrackStreetInfos);
    const planningLabel = useSelector(getPlanningLabel);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const intl = useIntl();
    return <Button onClick={() => generatePdf(trackStreetInfos, blockedStreetInfos, intl, planningLabel)}>DZ</Button>;
};
