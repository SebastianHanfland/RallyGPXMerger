import { BlobProvider } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { TrackStreetsPdf } from './TrackStreetsPdf.tsx';
import { IntlShape } from 'react-intl';
import { BlockedStreetInfo, TrackStreetInfo } from '../../logic/resolving/types.ts';
import { BlockedStreetsPdf } from './BlockedStreetsPdf.tsx';
import { createRoot } from 'react-dom/client';

export const downloadSingleTrackStreetInfoPdf = async (
    trackStreetInfo: TrackStreetInfo,
    intl: IntlShape,
    planningLabel?: string
) => {
    generateTrackStreetPdfUrl(trackStreetInfo, intl, planningLabel).then((blob) => {
        saveAs(blob, `${trackStreetInfo.name}-${trackStreetInfo.distanceInKm.toFixed(2)}km.pdf`);
    });
};

export const downloadBlockedStreetPdf = async (
    blockedStreetsInfo: BlockedStreetInfo[],
    intl: IntlShape,
    planningLabel?: string
) => {
    generateBlockedStreetsPdfUrl(blockedStreetsInfo, intl, planningLabel).then((blob) => {
        saveAs(blob, `${intl.formatMessage({ id: 'msg.blockedStreets' })}.pdf`);
    });
};

export const generatePdfsInZip = async (
    trackStreetInfos: TrackStreetInfo[],
    blockedStreetInfos: BlockedStreetInfo[],
    intl: IntlShape,
    planningTitle?: string,
    planningLabel?: string
) => {
    const zip = new JSZip();
    await Promise.all(
        trackStreetInfos.map((info) =>
            generateTrackStreetPdfUrl(info, intl, planningLabel).then((blob) =>
                zip.file(`${info.name}-${info.distanceInKm.toFixed(2)}km.pdf`, blob)
            )
        )
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
