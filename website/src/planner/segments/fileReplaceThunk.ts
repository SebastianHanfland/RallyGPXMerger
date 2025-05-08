import { State } from '../store/types.ts';
import { getReplaceProcess, getSegmentSpeeds, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { clearGpxCache } from '../../common/cache/gpxCache.ts';
import { addGpxSegments } from './addGpxSegmentsThunk.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { parsedTracksActions } from '../store/parsedTracks.reducer.ts';
import { ParsedTrack } from '../../common/types.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { optionallyDecompress } from '../store/compressHelper.ts';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';

export const executeGpxSegmentReplacement = (dispatch: AppDispatch, getState: () => State) => {
    const replaceProcess = getReplaceProcess(getState());
    const trackCompositions = getTrackCompositions(getState());

    if (!replaceProcess || replaceProcess.replacementSegments.length === 0) {
        return;
    }

    const { replacementSegments, targetSegment } = replaceProcess;
    if (replacementSegments.length === 1) {
        const newSegment = replacementSegments[0];
        const payload = { id: targetSegment, newContent: newSegment.content };
        dispatch(gpxSegmentsActions.changeGpxSegmentContent(payload));
        const updatedParsedSegment: ParsedTrack = {
            id: targetSegment,
            filename: newSegment.filename,
            version: 'not-set',
            color: getColorFromUuid(targetSegment),
            points: SimpleGPX.fromString(optionallyDecompress(newSegment.content)).getPoints(),
        };

        dispatch(parsedTracksActions.updateParsedSegment(updatedParsedSegment));
        dispatch(gpxSegmentsActions.setSegmentStreetsResolved({ id: targetSegment, streetsResolved: false }));
        dispatch(gpxSegmentsActions.setFilename({ id: targetSegment, filename: newSegment.filename }));
        clearGpxCache();
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
            dispatch(gpxSegmentsActions.setSegmentSpeeds({ id: replacementId, speed: previousSegmentSpeed }));
        });
        dispatch(addGpxSegments(replacementSegments));
        dispatch(gpxSegmentsActions.removeGpxSegment(targetSegment));
    }

    dispatch(gpxSegmentsActions.setReplaceProcess(undefined));
    dispatch(triggerAutomaticCalculation);
};
