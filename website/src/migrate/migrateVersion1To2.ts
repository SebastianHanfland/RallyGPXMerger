import { migrateToSegmentData } from './segmentDataMigration';
import { migrateGeoCoding } from './geoCodingMigration';
import { migrateTrackMerge } from './trackMergeMigration';
import { StateVersion1, StateVersion2 } from './types';
import { DEFAULT_AVERAGE_SPEED_IN_KM_H } from '../planner/store/constants';
import { getInitialLanguage } from '../language';
import { migrateSettings } from './settingsMigration';

export function migrateVersion1To2(stateVersion1: StateVersion1): StateVersion2 {
    return {
        segmentData: migrateToSegmentData(
            stateVersion1.gpxSegments,
            stateVersion1.geoCoding,
            stateVersion1.trackMerge.averageSpeedInKmH ?? DEFAULT_AVERAGE_SPEED_IN_KM_H
        ),
        layout: {
            ...stateVersion1.layout,
            language: stateVersion1.layout.language ?? getInitialLanguage(),
        },
        map: stateVersion1.map,
        trackMerge: migrateTrackMerge(stateVersion1.trackMerge),
        settings: migrateSettings(stateVersion1.trackMerge),
        nodes: {},
        backend: stateVersion1.backend,
        points: stateVersion1.points,
        geoCoding: migrateGeoCoding(stateVersion1.geoCoding),
        toasts: stateVersion1.toasts,
    };
}
