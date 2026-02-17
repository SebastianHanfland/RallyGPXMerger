import { TrackCompositionOld, TrackMergeStateOld } from '../planner/store/typesOld.ts';
import { BREAK, SEGMENT, TrackComposition, TrackMergeState } from '../planner/store/types.ts';
import { v4 as uuidv4 } from 'uuid';

export const BREAK_IDENTIFIER = '%%min-%%';

function convertTrackCompositions(trackCompositionsOld: TrackCompositionOld[]): TrackComposition[] {
    return trackCompositionsOld.map((track) => ({
        id: track.id,
        name: track.name,
        peopleCount: track.peopleCount,
        buffer: track.buffer,
        priority: track.priority,
        delayAtEndInSeconds: undefined,
        rounding: track.rounding,
        segments: track.segmentIds.map((segmentId) => {
            if (segmentId.includes(BREAK_IDENTIFIER)) {
                const minutes = segmentId.split(BREAK_IDENTIFIER)[0];
                return { type: BREAK, id: uuidv4(), minutes: Number(minutes) };
            }
            return { type: SEGMENT, id: segmentId, segmentId: segmentId };
        }),
    }));
}

export function migrateTrackMerge(trackMerge: TrackMergeStateOld): TrackMergeState {
    return {
        trackCompositions: convertTrackCompositions(trackMerge.trackCompositions),
        filterTerm: trackMerge.filterTerm,
        arrivalDateTime: trackMerge.arrivalDateTime,
        hasDefaultArrivalDate: trackMerge.hasDefaultArrivalDate,
        planningLabel: trackMerge.planningLabel,
        planningTitle: trackMerge.planningTitle,
        participantDelay: trackMerge.participantDelay,
        averageSpeedInKmH: trackMerge.averageSpeedInKmH,
        gapToleranceInKm: trackMerge.gapToleranceInKm,
        segmentIdClipboard: undefined,
        trackIdForAddingABreak: trackMerge.trackIdForAddingABreak,
    };
}
