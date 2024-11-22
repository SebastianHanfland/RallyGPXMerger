import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { getBlockedStreetInfo } from '../logic/resolving/selectors/getBlockedStreetInfo.ts';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { createBlockedStreetsPdf } from '../download/pdf/blockedStreetsPdf.ts';
import { createTrackStreetPdf } from '../download/pdf/trackStreetsPdf.ts';
import { getPlanningLabel } from '../store/trackMerge.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../store/types.ts';
import { AppDispatch } from '../store/store.ts';
import { IntlShape, useIntl } from 'react-intl';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

export const downloadSinglePdfFiles = (intl: IntlShape, id: string) => (_: Dispatch, getState: () => State) => {
    const trackStreetInfos = getEnrichedTrackStreetInfos(getState());
    const planningLabel = getPlanningLabel(getState());
    trackStreetInfos
        .filter((info) => info.id === id)
        .forEach((track) => createTrackStreetPdf(intl, planningLabel)(track).download(`${track.name}.pdf`));
};

export const downloadPdfFiles = (intl: IntlShape) => (_: Dispatch, getState: () => State) => {
    const trackStreetInfos = getEnrichedTrackStreetInfos(getState());
    const blockedStreetInfos = getBlockedStreetInfo(getState());
    const planningLabel = getPlanningLabel(getState());

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
};

export const StreetFilesPdfMakeDownloader = () => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);
    return (
        <Button
            onClick={(event) => {
                event.stopPropagation();
                dispatch(downloadPdfFiles(intl));
            }}
            disabled={trackStreetInfos.length === 0}
            title={intl.formatMessage({ id: 'msg.downloadPdf' })}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            PDF
        </Button>
    );
};
