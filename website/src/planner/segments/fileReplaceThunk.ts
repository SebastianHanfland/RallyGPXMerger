import { State } from '../store/types.ts';
import { getAverageSpeedInKmH, getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { getReplaceProcess, getSegmentSpeeds, segmentDataActions } from '../store/segmentData.redux.ts';

export const executeGpxSegmentReplacement = (dispatch: AppDispatch, getState: () => State) => {
    const replaceProcess = getReplaceProcess(getState());
    const trackCompositions = getTrackCompositions(getState());
    const averageSpeed = getAverageSpeedInKmH(getState());

    if (!replaceProcess || replaceProcess.replacementSegments.length === 0) {
        return;
    }

    const { replacementSegments, targetSegment } = replaceProcess;
    if (replacementSegments.length === 1) {
        const newSegment = replacementSegments[0];
        const payload = { id: targetSegment, newPoints: newSegment.points };
        // TODO: 223 street resolving
        dispatch(segmentDataActions.changeGpxSegmentPoints(payload));
        dispatch(segmentDataActions.setFilename({ id: targetSegment, filename: newSegment.filename }));
    } else {
        const previousSegmentSpeed = getSegmentSpeeds(getState())[targetSegment];
        const replacementIds = replacementSegments.map((segment) => segment.id);
        trackCompositions.forEach((track) => {
            if (track.segmentIds.includes(targetSegment)) {
                const newSegments = track.segmentIds.flatMap((segmentId) =>
                    segmentId === targetSegment ? [...replacementIds] : segmentId
                );
                dispatch(trackMergeActions.setSegments({ id: track.id, segments: newSegments }));
            }
        });
        replacementIds.forEach((replacementId) => {
            dispatch(
                segmentDataActions.setSegmentSpeeds({ id: replacementId, speed: previousSegmentSpeed, averageSpeed })
            );
        });
        dispatch(segmentDataActions.addGpxSegments(replacementSegments));
        dispatch(segmentDataActions.removeGpxSegment(targetSegment));
    }

    dispatch(segmentDataActions.setReplaceProcess(undefined));
};
