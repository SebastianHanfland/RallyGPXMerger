import { State } from '../../planner/store/types.ts';

export interface MapState {
    currentTime: number;
    currentRealTime?: string;
    start?: string;
    end?: string;
    showMapMarker?: boolean;
    showTrackInfo?: boolean;
    showSingleTrackInfo?: string;
    highlightedTrack?: string;
    isLive: boolean;
    isLoading: boolean;
}

export interface PlanningState {
    state: State | undefined;
}

export interface DisplayState {
    displayMap: MapState;
    planning: PlanningState;
}
