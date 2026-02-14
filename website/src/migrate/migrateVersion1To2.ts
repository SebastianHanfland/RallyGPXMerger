import { State } from '../planner/store/types.ts';
import { StateOld } from '../planner/store/typesOld.ts';
import { migrateToSegmentData } from './segmentDataMigration.ts';
import { migrateGeoCoding } from './geoCodingMigration.ts';

type StateVersion1 = StateOld;
type StateVersion2 = State;

export const isOldState = (state: State | StateOld): state is StateOld => {
    return (state as StateOld).gpxSegments !== undefined;
};

export function migrateVersion1To2(stateVersion1: StateVersion1): StateVersion2 {
    return {
        segmentData: migrateToSegmentData(stateVersion1.gpxSegments),
        layout: stateVersion1.layout,
        map: stateVersion1.map,
        trackMerge: stateVersion1.trackMerge,
        backend: stateVersion1.backend,
        points: stateVersion1.points,
        geoCoding: migrateGeoCoding(stateVersion1.geoCoding),
        toasts: stateVersion1.toasts,
    };
}
