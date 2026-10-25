import { getTrackStreetInfos } from '../../planner/calculation/getTrackStreetInfos';
import { getParticipantsDelay, getPlanningLabel, getPlanningTitle } from '../../planner/store/settings.reducer';
import { getCalculateTracks } from '../../planner/calculation/getCalculatedTracks';
import { getBlockedStreetInfo } from '../../planner/logic/resolving/selectors/getBlockedStreetInfo';
import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { DisplayState, PlanningState } from './types';
import { State } from '../../planner/store/types';
import { DELAY_PER_PERSON_IN_SECONDS } from '../../planner/store/constants';
import { getBreakPositions } from '../../planner/logic/resolving/selectors/getBreakPositions';
import { getEntryPointPositions } from '../../planner/logic/resolving/selectors/getEntryPointPositions';

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
export const getDisplayEntryPoints = (state: DisplayState) => {
    const planningState = getPlanningState(state);
    return planningState ? getEntryPointPositions(planningState) : [];
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
