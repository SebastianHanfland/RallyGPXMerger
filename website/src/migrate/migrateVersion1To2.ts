import { State } from '../planner/store/types.ts';
import { StateOld } from '../planner/store/typesOld.ts';

type StateVersion1 = StateOld;
type StateVersion2 = State;

export function migrateVersion1To2(stateVersion1: StateVersion1): StateVersion2 {
    return {};
}
