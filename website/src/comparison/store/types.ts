import { DisplayTrack, ParsedTrack } from '../../common/types.ts';

export interface ComparisonState {
    tracks: Record<string, DisplayTrack[] | undefined>;
    parsedTracks: Record<string, ParsedTrack[] | undefined>;
    trackInfo: Record<string, string | undefined>;
    planningIds: string[];
    selectedTracks: Record<string, string[] | undefined>;
    selectedVersions: string[];
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

export interface ComparisonTrackState {
    tracks: ComparisonState;
    map: MapState;
}
