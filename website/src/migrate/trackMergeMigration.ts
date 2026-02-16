import { TrackCompositionOld, TrackMergeStateOld } from '../planner/store/typesOld.ts';
import { BREAK, SEGMENT, TrackComposition, TrackMergeState } from '../planner/store/types.ts';

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
                const [minutes, id] = segmentId.split(BREAK_IDENTIFIER);
                return { type: BREAK, id: id, minutes: Number(minutes) };
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
        isCalculationRunning: trackMerge.isCalculationRunning,
    };
}
