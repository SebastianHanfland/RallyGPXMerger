import { DisplayTrack } from '../../common/types.ts';

export interface DisplayState {
    tracks: DisplayTrack[];
    isLoading: boolean;
}

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
}

export interface VersionsState {
    tracks: DisplayState;
    map: MapState;
}
