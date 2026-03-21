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
import { getPlanningLabel, getPlanningTitle } from '../../store/settings.reducer.ts';
import { getBlockedStreetInfo } from '../../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { createRoot } from 'react-dom/client';

const generatePdfsInZip = async (
    trackStreetInfos: TrackStreetInfo[],
    blockedStreetInfos: BlockedStreetInfo[],
    intl: IntlShape,
    planningTitle?: string,
    planningLabel?: string
) => {
    const zip = new JSZip();
    await Promise.all(
        trackStreetInfos.map((info) => {
            generateTrackStreetPdfUrl(info, intl, planningLabel).then((blob) => zip.file(`${info.name}.pdf`, blob));
        })
    );
    await generateBlockedStreetsPdfUrl(blockedStreetInfos, intl, planningLabel).then((blob) =>
        zip.file(`${intl.formatMessage({ id: 'msg.blockedStreets' })}.pdf`, blob)
    );

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(
        zipBlob,
        `${planningTitle ?? 'Sternfahrtplaner'}-${intl.formatMessage({
            id: 'msg.streetListZip',
        })}-pdf-${new Date().toISOString()}.zip`
    );
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

export const DButton = () => {
    const trackStreetInfos = useSelector(getTrackStreetInfos);
    const planningLabel = useSelector(getPlanningLabel);
    const blockedStreetInfos = useSelector(getBlockedStreetInfo);
    const planningTitle = useSelector(getPlanningTitle);
    const intl = useIntl();
    return (
        <Button
            onClick={() => generatePdfsInZip(trackStreetInfos, blockedStreetInfos, intl, planningTitle, planningLabel)}
        >
            DZ
        </Button>
    );
};
