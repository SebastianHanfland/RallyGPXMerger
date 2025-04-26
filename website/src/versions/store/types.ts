import { DisplayTrack, ParsedTrack } from '../../common/types.ts';

export interface DisplayTracksState {
    tracks: DisplayTrack[];
    parsedTracks: ParsedTrack[];
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
