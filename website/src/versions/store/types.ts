import { ZipTrack } from '../../common/types.ts';

export interface ZipTracksState {
    tracks: Record<string, ZipTrack[] | undefined>;
    trackInfo: Record<string, string | undefined>;
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

export interface VersionsState {
    zipTracks: ZipTracksState;
    map: MapState;
}
