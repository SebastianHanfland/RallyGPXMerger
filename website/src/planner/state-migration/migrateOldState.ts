import { OldState, State } from '../store/types.ts';

export const isOldState = (state: State | OldState): state is OldState => {
    return (state as OldState).gpxSegments !== undefined;
};

export function migrateState(state: OldState): State {
    state.gpxSegments;
    const migratedState: State = {
        segmentData: state.gpxSegments,
        layout: state.layout,
        map: state.map,
        trackMerge: state.trackMerge,
        calculatedTracks: state.calculatedTracks,
        backend: state.backend,
        points: state.points,
        geoCoding: state.geoCoding,
    };
    return migratedState;
}
