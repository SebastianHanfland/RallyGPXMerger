import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getBlockedStreetInfo } from '../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { createBlockedStreetsPdf } from '../download/pdf/blockedStreetsPdf.ts';
import { createTrackStreetPdf } from '../download/pdf/trackStreetsPdf.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../store/types.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { IntlShape, useIntl } from 'react-intl';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { BlockedStreetInfo, TrackStreetInfo } from '../logic/resolving/types.ts';
import { getTrackStreetInfos } from '../logic/resolving/aggregate/calculateTrackStreetInfosWithBreaksAndNodes.ts';
import { DownloadIcon } from '../../utils/icons/DownloadIcon.tsx';
import { getPlanningLabel } from '../store/settings.reducer.ts';

export const downloadSinglePdfFiles = (intl: IntlShape, id: string) => (_: Dispatch, getState: () => State) => {
    const trackStreetInfos = getTrackStreetInfos(getState());
    const planningLabel = getPlanningLabel(getState());
    trackStreetInfos
        .filter((info) => id.includes(info.id))
        .forEach((track) => createTrackStreetPdf(intl, planningLabel)(track).download(`${track.name}.pdf`));
};

export function downloadPdfFilesPure(
    intl: IntlShape,
    planningLabel: string,
    trackStreetInfos: TrackStreetInfo[],
    blockedStreetInfos: BlockedStreetInfo[]
) {
    const zip = new JSZip();
    trackStreetInfos.forEach((track) => {
        createTrackStreetPdf(
            intl,
            planningLabel
        )(track).getBlob((blob) => zip.file(`${track.name}-${track.distanceInKm.toFixed(2)}km.pdf`, blob));
    });
    createBlockedStreetsPdf(blockedStreetInfos, planningLabel, intl).getBlob((blob) =>
        zip.file(`${intl.formatMessage({ id: 'msg.blockedStreets' }).replace('ß', 'ss')}.pdf`, blob)
    );
    setTimeout(() => {
        zip.generateAsync({ type: 'blob' }).then(function (content) {
            FileSaver.saveAs(
                content,
                `${intl.formatMessage({ id: 'msg.streetListZip' })}-pdf-${new Date().toISOString()}.zip`
            );
        });
    }, 500);
}

export const downloadPdfFiles = (intl: IntlShape) => (_: Dispatch, getState: () => State) => {
    const trackStreetInfos = getTrackStreetInfos(getState());
    const blockedStreetInfos = getBlockedStreetInfo(getState());
    const planningLabel = getPlanningLabel(getState()) ?? '';
    downloadPdfFilesPure(intl, planningLabel, trackStreetInfos, blockedStreetInfos);
};

export const StreetFilesPdfMakeDownloader = () => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const trackStreetInfos = useSelector(getTrackStreetInfos);
    return (
        <Button
            onClick={(event) => {
                event.stopPropagation();
                dispatch(downloadPdfFiles(intl));
            }}
            variant={'info'}
            disabled={trackStreetInfos.length === 0}
            title={intl.formatMessage({ id: 'msg.downloadPdf' })}
        >
            <DownloadIcon size={20} black={true} />
            PDF
        </Button>
    );
};
