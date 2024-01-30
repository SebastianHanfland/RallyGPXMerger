import { ZipTrack } from '../../common/types.ts';

export interface ZipTracksState {
    tracks: Record<string, ZipTrack[] | undefined>;
    selectedTracks: Record<string, string[] | undefined>;
    selectedVersions: string[];
    isLoading: boolean;
}

export interface MapState {
    currentTime: number;
    start?: string;
    end?: string;
    showMapMarker?: boolean;
}

export interface VersionsState {
    zipTracks: ZipTracksState;
    map: MapState;
}
