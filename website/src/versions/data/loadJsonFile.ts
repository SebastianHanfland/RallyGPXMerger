import { State } from '../../planner/store/types.ts';

export let storedState: State | undefined;
export const setStoredState = (state: State | undefined) => {
    storedState = state;
};
