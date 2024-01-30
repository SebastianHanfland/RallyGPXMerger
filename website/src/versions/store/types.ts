import { CalculatedTrack, GpxSegment } from '../../planner/store/types.ts';

export interface ZipTracksState {
    tracks: Record<string, ZipTrack[] | undefined>;
    selectedTracks: Record<string, string[] | undefined>;
    selectedVersions: string[];
    isLoading: boolean;
}

export function isZipTrack(track: GpxSegment | CalculatedTrack | ZipTrack): track is ZipTrack {
    return (track as ZipTrack).color !== undefined;
}

export interface ZipTrack extends CalculatedTrack {
    version: string;
    color?: string;
}

export interface MapState {
    currentTime: number;
    start?: string;
    end?: string;
    showMapMarker?: boolean;
}

export interface IFrameState {
    zipTracks: ZipTracksState;
    map: MapState;
}
