import { State } from '../store/types.ts';

export function isStateTheSame(serverState: State, storedState: State): boolean {
    const stateAreas = [
        (state: State) => state.segmentData,
        (state: State) => state.trackMerge,
        (state: State) => state.nodes,
        (state: State) => state.settings,
    ];

    for (const stateAccess of stateAreas) {
        if (JSON.stringify(stateAccess(serverState)) !== JSON.stringify(stateAccess(storedState))) {
            return false;
        }
    }
    return true;
}
