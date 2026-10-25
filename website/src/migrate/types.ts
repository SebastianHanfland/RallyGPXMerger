import { State } from '../planner/store/types';
import { StateOld } from '../planner/store/typesOld';

export type StateVersion1 = StateOld;
export type StateVersion2 = State;
export const isOldState = (state: State | StateOld): state is StateOld => {
    return (state as StateOld).gpxSegments !== undefined;
};
