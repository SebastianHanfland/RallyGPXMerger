import { useGetUrlParam } from '../utils/linkUtil.ts';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useEffect } from 'react';
import { getData } from '../api/api.ts';
import { backendActions, getPlanningPassword } from './store/backend.reducer.ts';
import { errorNotification, successNotification, toastsActions } from './store/toast.reducer.ts';
import { AppDispatch } from './store/planningStore.ts';
import { parsedTracksActions } from './store/parsedTracks.reducer.ts';
import { getCalculatedTracks } from './store/calculatedTracks.reducer.ts';
import { ParsedTrack } from '../common/types.ts';
import { getColorFromUuid } from '../utils/colorUtil.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { optionallyDecompress } from './store/compressHelper.ts';
import { getConstructionSegments, getGpxSegments } from './store/gpxSegments.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { State } from './store/types.ts';

function createAndStoreReadablePoints(state: State, planningId: string, dispatch: Dispatch) {
    const calculatedTracks = getCalculatedTracks(state);
    const gpxSegments = getGpxSegments(state);
    const constructionSegments = getConstructionSegments(state);
    const parsedTracks = calculatedTracks.map(
        (track): ParsedTrack => ({
            id: track.id,
            filename: track.filename,
            peopleCount: track.peopleCount,
            version: planningId,
            color: getColorFromUuid(track.id),
            points: SimpleGPX.fromString(optionallyDecompress(track.content)).getPoints(),
        })
    );
    const parsedSegments = gpxSegments.map(
        (segment): ParsedTrack => ({
            id: segment.id,
            filename: segment.filename,
            version: planningId,
            color: getColorFromUuid(segment.id),
            points: SimpleGPX.fromString(optionallyDecompress(segment.content)).getPoints(),
        })
    );
    const parsedConstructionSegments = constructionSegments?.map(
        (segment): ParsedTrack => ({
            id: segment.id,
            filename: segment.filename,
            version: planningId,
            color: 'red',
            points: SimpleGPX.fromString(optionallyDecompress(segment.content)).getPoints(),
        })
    );
    dispatch(parsedTracksActions.setParsedTracks(parsedTracks));
    dispatch(parsedTracksActions.setParsedSegments(parsedSegments));
    dispatch(parsedTracksActions.addParsedConstructionSegments(parsedConstructionSegments ?? []));
}

export function useLoadPlanningFromServer() {
    const planningId = useGetUrlParam('planning=');
    const adminToken = useGetUrlParam('admin=');
    const planningPassword = useSelector(getPlanningPassword);
    const dispatch: AppDispatch = useDispatch();
    const intl = useIntl();

    useEffect(() => {
        if (planningId) {
            getData(planningId)
                .then((data) => {
                    const state = data.data;
                    dispatch({ payload: state, type: 'wholeState' });

                    dispatch(backendActions.setPlanningId(planningId));
                    dispatch(toastsActions.clearToasts());
                    const passwordToSet = adminToken ?? planningPassword;
                    if (passwordToSet) {
                        dispatch(backendActions.setPlanningPassword(passwordToSet));
                    }
                    dispatch(backendActions.setIsPlanningSaved(true));
                    successNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.dataLoad.success.title' }),
                        intl.formatMessage({ id: 'msg.dataLoad.success.message' })
                    );
                    createAndStoreReadablePoints(state, planningId, dispatch);
                })
                .catch(() => {
                    errorNotification(
                        dispatch,
                        intl.formatMessage({ id: 'msg.dataLoad.error.title' }),
                        intl.formatMessage({ id: 'msg.dataLoad.error.message' })
                    );
                });
        }
    }, [planningId]);
}
