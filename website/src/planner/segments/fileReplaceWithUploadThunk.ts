import { SEGMENT, State } from '../store/types';
import { getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer';
import { AppDispatch } from '../store/planningStore';
import {
    getFixedSegmentSpeeds,
    getReplaceProcess,
    getSegmentSpeeds,
    segmentDataActions,
} from '../store/segmentData.redux';
import { getAverageSpeedInKmH } from '../store/settings.reducer';

export const executeGpxSegmentReplacementWithUpload = (dispatch: AppDispatch, getState: () => State) => {
    const replaceProcess = getReplaceProcess(getState());
    const trackCompositions = getTrackCompositions(getState());
    const averageSpeed = getAverageSpeedInKmH(getState());

    if (!replaceProcess || replaceProcess.replacementSegments.length === 0) {
        return;
    }

    const { replacementSegments, targetSegment } = replaceProcess;

    const previousSegmentSpeed = getSegmentSpeeds(getState())[targetSegment];
    const previousFixedVelocity = getFixedSegmentSpeeds(getState())[targetSegment] ?? false;
    const replacementIds = replacementSegments.map((segment) => segment.id);
    trackCompositions.forEach((track) => {
        if (track.segments.map((segment) => segment.id).includes(targetSegment)) {
            const newSegments = track.segments.flatMap((segmentId) =>
                segmentId.id === targetSegment
                    ? [...replacementIds.map((id) => ({ id: id, segmentId: id, type: SEGMENT }))]
                    : segmentId
            );
            dispatch(trackMergeActions.setSegments({ id: track.id, segments: newSegments }));
        }
    });
    replacementIds.forEach((replacementId) => {
        dispatch(
            segmentDataActions.setSegmentSpeeds({
                id: replacementId,
                speed: previousSegmentSpeed,
                averageSpeed,
                fixedVelocity: previousFixedVelocity,
            })
        );
    });
    dispatch(segmentDataActions.removeGpxSegment(targetSegment));

    dispatch(segmentDataActions.setReplaceProcess(undefined));
    dispatch(segmentDataActions.setClickOnSegment(undefined));
};
