import { SEGMENT, State } from '../store/types.ts';
import { getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { getReplaceProcess, segmentDataActions } from '../store/segmentData.redux.ts';

export const executeGpxSegmentReplacementWithExisting = (dispatch: AppDispatch, getState: () => State) => {
    const replaceProcess = getReplaceProcess(getState());
    const trackCompositions = getTrackCompositions(getState());

    if (!replaceProcess || replaceProcess.replacementSegments.length === 0) {
        return;
    }

    const { replacementSegments, targetSegment } = replaceProcess;
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

    dispatch(segmentDataActions.setReplaceProcess(undefined));
};
