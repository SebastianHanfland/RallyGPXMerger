import { TrackMergeStateOld } from '../planner/store/typesOld.ts';
import { TrackMergeState } from '../planner/store/types.ts';

export function migrateTrackMerge(trackMerge: TrackMergeStateOld): TrackMergeState {
    return {
        trackCompositions: trackMerge.trackCompositions,
        filterTerm: trackMerge.filterTerm,
        arrivalDateTime: trackMerge.arrivalDateTime,
        hasDefaultArrivalDate: trackMerge.hasDefaultArrivalDate,
        planningLabel: trackMerge.planningLabel,
        planningTitle: trackMerge.planningTitle,
        participantDelay: trackMerge.participantDelay,
        averageSpeedInKmH: trackMerge.averageSpeedInKmH,
        gapToleranceInKm: trackMerge.gapToleranceInKm,
        segmentIdClipboard: trackMerge.segmentIdClipboard,
        trackIdForAddingABreak: trackMerge.trackIdForAddingABreak,
        isCalculationRunning: trackMerge.isCalculationRunning,
        isCalculationOnTheFly: trackMerge.isCalculationOnTheFly,
        changesSinceLastCalculation: trackMerge.changesSinceLastCalculation,
    };
}
