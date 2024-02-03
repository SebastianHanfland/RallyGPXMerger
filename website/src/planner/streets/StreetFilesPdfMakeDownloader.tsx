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

const downloadFiles = (_: Dispatch, getState: () => State) => {
    const trackStreetInfos = getEnrichedTrackStreetInfos(getState());
    const blockedStreetInfos = getBlockedStreetInfo(getState());
    const planningLabel = getPlanningLabel(getState());
    trackStreetInfos.forEach(createTrackStreetPdf(planningLabel));
    createBlockedStreetsPdf(blockedStreetInfos, planningLabel);
};

export const StreetFilesPdfMakeDownloader = () => {
    const dispatch: AppDispatch = useDispatch();
    const trackStreetInfos = useSelector(getEnrichedTrackStreetInfos);
    return (
        <Button
            onClick={(event) => {
                event.stopPropagation();
                dispatch(downloadFiles);
            }}
            disabled={trackStreetInfos.length === 0}
            title={'Download all information for the tracks as pdf'}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            PDF
        </Button>
    );
};
