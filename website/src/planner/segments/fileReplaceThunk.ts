import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../store/types.ts';
import { getReplaceProcess, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { clearGpxCache } from '../../common/map/gpxCache.ts';

export const executeGpxSegmentReplacement = (dispatch: Dispatch, getState: () => State) => {
    const replaceProcess = getReplaceProcess(getState());
    const trackCompositions = getTrackCompositions(getState());

    if (!replaceProcess || replaceProcess.replacementSegments.length === 0) {
        return;
    }

    const { replacementSegments, targetSegment } = replaceProcess;
    if (replacementSegments.length === 1) {
        const payload = { id: targetSegment, newContent: replacementSegments[0].content };
        dispatch(gpxSegmentsActions.changeGpxSegmentContent(payload));
        dispatch(gpxSegmentsActions.setSegmentStreetsResolved({ id: targetSegment, streetsResolved: false }));
        dispatch(gpxSegmentsActions.setFilename({ id: targetSegment, filename: replacementSegments[0].filename }));
        clearGpxCache();
    } else {
        const replacementIds = replacementSegments.map((segment) => segment.id);
        trackCompositions.forEach((track) => {
            if (track.segmentIds.includes(targetSegment)) {
                const newSegments = track.segmentIds.flatMap((segmentId) =>
                    segmentId === targetSegment ? [...replacementIds] : segmentId
                );
                dispatch(trackMergeActions.setSegments({ id: track.id, segments: newSegments }));
            }
        });
        dispatch(gpxSegmentsActions.addGpxSegments(replacementSegments));
        dispatch(gpxSegmentsActions.removeGpxSegment(targetSegment));
    }

    dispatch(gpxSegmentsActions.setReplaceProcess(undefined));
};
