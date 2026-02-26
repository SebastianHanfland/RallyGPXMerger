import { getTrackStreetInfos } from '../../planner/calculation/getTrackStreetInfos.ts';
import { getParticipantsDelay, getPlanningLabel, getPlanningTitle } from '../../planner/store/settings.reducer.ts';
import { getCalculateTracks } from '../../planner/calculation/getCalculatedTracks.ts';
import { getBlockedStreetInfo } from '../../planner/logic/resolving/selectors/getBlockedStreetInfo.ts';
import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { DisplayState, PlanningState } from './types.ts';
import { State } from '../../planner/store/types.ts';
import { DELAY_PER_PERSON_IN_SECONDS } from '../../planner/store/constants.ts';
import { getBreakPositions } from '../../planner/logic/resolving/selectors/getBreakPositions.ts';

const initialState: PlanningState = {
    state: undefined,
};

const planningSlice = createSlice({
    name: 'planning',
    initialState: initialState,
    reducers: {
        setPlanning: (state: PlanningState, action: PayloadAction<State>) => {
            state.state = action.payload;
        },
    },
});

export const planningActions = planningSlice.actions;
export const planningReducer: Reducer<PlanningState> = planningSlice.reducer;
const getBase = (state: DisplayState) => state.planning;
export const getPlanningState = (state: DisplayState) => getBase(state).state;

export const getDisplayBreaks = (state: DisplayState) => {
    const planningState = getPlanningState(state);
    return planningState ? getBreakPositions(planningState) : [];
};
export const getDisplayTracks = (state: DisplayState) => {
    const planningState = getPlanningState(state);
    return planningState ? getCalculateTracks(planningState) : [];
};
export const getDisplayTitle = (state: DisplayState) => {
    const planningState = getPlanningState(state);
    return planningState ? getPlanningTitle(planningState) : '';
};
export const getDisplayPlanningLabel = (state: DisplayState) => {
    const planningState = getPlanningState(state);
    return planningState ? getPlanningLabel(planningState) : '';
};
export const getDisplayBlockedStreets = (state: DisplayState) => {
    const planningState = getPlanningState(state);
    return planningState ? getBlockedStreetInfo(planningState) : [];
};
export const getDisplayTrackStreetInfos = (state: DisplayState) => {
    const planningState = getPlanningState(state);
    return planningState ? getTrackStreetInfos(planningState) : [];
};
export const getDisplayParticipantsDelay = (state: DisplayState) => {
    const planningState = getPlanningState(state);
    return planningState ? getParticipantsDelay(planningState) : DELAY_PER_PERSON_IN_SECONDS;
};
