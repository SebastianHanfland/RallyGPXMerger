import { DisplayTrack } from '../../common/types.ts';
import { BlockedStreetInfo, TrackStreetInfo } from '../../planner/logic/resolving/types.ts';

export interface DisplayTracksState {
    tracks: DisplayTrack[];
    blockedStreetInfos?: BlockedStreetInfo[];
    trackInfos?: TrackStreetInfo[];
    planningLabel?: string;
    title?: string;
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

export interface DisplayState {
    tracks: DisplayTracksState;
    map: MapState;
}
