import { CalculatedTrack, GpxSegment } from '../../planner/store/types.ts';
import { GpxFile } from '../../common/types.ts';

export interface ZipTracksState {
    tracks: Record<string, ZipTrack[] | undefined>;
    selectedTracks: Record<string, string[] | undefined>;
    selectedVersions: string[];
    isLoading: boolean;
}

export function isZipTrack(track: GpxSegment | CalculatedTrack | ZipTrack): track is ZipTrack {
    return (track as ZipTrack).color !== undefined;
}

export interface ZipTrack extends GpxFile {
    version: string;
    color?: string;
    peopleCount?: number;
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
