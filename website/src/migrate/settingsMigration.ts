import { TrackMergeStateOld } from '../planner/store/typesOld.ts';
import { SettingsState } from '../planner/store/types.ts';

export function migrateSettings(trackMerge: TrackMergeStateOld): SettingsState {
    return {
        arrivalDateTime: trackMerge.arrivalDateTime,
        hasDefaultArrivalDate: trackMerge.hasDefaultArrivalDate,
        planningLabel: trackMerge.planningLabel,
        planningTitle: trackMerge.planningTitle,
        participantDelay: trackMerge.participantDelay,
        averageSpeedInKmH: trackMerge.averageSpeedInKmH,
        gapToleranceInKm: trackMerge.gapToleranceInKm,
    };
}
