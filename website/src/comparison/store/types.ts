import { CalculatedTrack } from '../../common/types.ts';
import { ParsedGpxSegment } from '../../planner/store/types.ts';

export interface ComparisonState {
    parsedTracks: Record<string, CalculatedTrack[] | undefined>;
    trackInfo: Record<string, string | undefined>;
    participantsDelay: Record<string, number | undefined>;
    planningIds: string[];
    selectedTracks: Record<string, string[] | undefined>;
    constructions: ParsedGpxSegment[];
    selectedVersions: string[];
    isLoading: boolean;
}

export interface MapState {
    currentTime: number;
    currentRealTime?: string;
    startAndEndTimes: Record<string, { start: string; end: string } | undefined>;
    showMapMarker?: boolean;
    showTrackInfo?: boolean;
    showConstructions?: boolean;
    showSingleTrackInfo?: string;
    highlightedTrack?: string;
}

export interface ComparisonTrackState {
    tracks: ComparisonState;
    map: MapState;
}
