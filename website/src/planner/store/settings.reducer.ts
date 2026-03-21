import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { isTrackBreak, isTrackSegment, SettingsState, State } from './types.ts';
import { storage } from './storage.ts';
import { DEFAULT_AVERAGE_SPEED_IN_KM_H, DEFAULT_GAP_TOLERANCE, DELAY_PER_PERSON_IN_SECONDS } from './constants.ts';
import { shiftDateBySeconds } from '../../utils/dateUtil.ts';
import { getParsedGpxSegments } from './segmentData.redux.ts';
import { getTrackCompositions } from './trackMerge.reducer.ts';

const initialState: SettingsState = {
    participantDelay: DELAY_PER_PERSON_IN_SECONDS,
    gapToleranceInKm: DEFAULT_GAP_TOLERANCE,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState: storage.load()?.settings ?? initialState,
    reducers: {
        setArrivalDateTime: (state: SettingsState, action: PayloadAction<string | undefined>) => {
            state.startDate = undefined;
            state.hasDefaultArrivalDate = false;
            state.arrivalDateTime = action.payload;
        },
        setStartDate: (state: SettingsState, action: PayloadAction<string | undefined>) => {
            state.startDate = action.payload;
        },
        setPlanningLabel: (state: SettingsState, action: PayloadAction<string | undefined>) => {
            state.planningLabel = action.payload;
        },
        setPlanningTitle: (state: SettingsState, action: PayloadAction<string | undefined>) => {
            state.planningTitle = action.payload;
        },
        setParticipantsDelays: (state: SettingsState, action: PayloadAction<number>) => {
            state.participantDelay = action.payload;
        },
        setAverageSpeed: (state: SettingsState, action: PayloadAction<number>) => {
            state.averageSpeedInKmH = action.payload;
        },
        setGapToleranceInKm: (state: SettingsState, action: PayloadAction<number | undefined>) => {
            state.gapToleranceInKm = action.payload;
        },
        setDefaultArrivalDateTime: (state: SettingsState) => {
            state.hasDefaultArrivalDate = true;
            state.arrivalDateTime = new Date().toISOString();
        },
        clear: () => initialState,
    },
});

export const settingsActions = settingsSlice.actions;
export const settingsReducer: Reducer<SettingsState> = settingsSlice.reducer;
const getBase = (state: State) => state.settings;
export const getArrivalDateTime = (state: State) => {
    const startDate = getBase(state).startDate;
    if (startDate) {
        const tracks = getTrackCompositions(state);
        if (tracks.length === 1) {
            const segments = getParsedGpxSegments(state);
            let duration = 0;
            tracks.forEach((track) => {
                track.segments.forEach((segment) => {
                    if (isTrackSegment(segment)) {
                        const foundSegment = segments.find((seg) => seg.id === segment.id);
                        const t = foundSegment?.points[foundSegment?.points.length - 1].t ?? 0;
                        duration += t;
                    } else if (isTrackBreak(segment)) {
                        duration += segment.minutes * 60;
                    }
                });
            });

            return shiftDateBySeconds(startDate, duration);
        }
    }
    return getBase(state).arrivalDateTime;
};
export const getStartDate = (state: State) => getBase(state).startDate;
export const getHasDefaultArrivalDateTime = (state: State) => getBase(state).hasDefaultArrivalDate;
export const getPlanningLabel = (state: State) => getBase(state).planningLabel;
export const getPlanningTitle = (state: State) => getBase(state).planningTitle;
export const getParticipantsDelay = (state: State) => getBase(state).participantDelay;
export const getAverageSpeedInKmH = (state: State) => getBase(state).averageSpeedInKmH ?? DEFAULT_AVERAGE_SPEED_IN_KM_H;
export const getGapToleranceInKm = (state: State) => getBase(state).gapToleranceInKm ?? DEFAULT_GAP_TOLERANCE;
