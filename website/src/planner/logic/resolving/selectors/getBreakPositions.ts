import { createSelector } from '@reduxjs/toolkit';
import { getFilteredTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { BREAK, ParsedGpxSegment, TrackElement } from '../../../store/types.ts';
import { getParsedGpxSegments } from '../../../store/segmentData.redux.ts';

export interface BreakPosition {
    point: { lat: number; lon: number };
    breakId: string;
    trackId: string;
    minutes: number;
    description: string;
    hasToilet: boolean;
}

const getBreakPosition = (
    segments: TrackElement[],
    parsedSegments: ParsedGpxSegment[],
    index: number
): { lat: number; lon: number } | undefined => {
    if (segments.length > index + 1) {
        // TODO: Check that it is a segment and not something else
        const segmentId = segments[index + 1].id;
        const foundSegment = parsedSegments.find((segment) => segment.id === segmentId);
        if (foundSegment && (foundSegment?.points.length ?? 0) > 0) {
            const firstPointOfSegmentAfterBreak = foundSegment.points[0];
            return { lat: firstPointOfSegmentAfterBreak.b, lon: firstPointOfSegmentAfterBreak.l };
        }
    }
    if (segments.length > index - 1 && index - 1 > 0) {
        // TODO: Check that it is a segment and not something else
        const segmentId = segments[index - 1].id;
        const foundSegment = parsedSegments.find((segment) => segment.id === segmentId);
        if (foundSegment && (foundSegment?.points.length ?? 0) > 0) {
            const firstPointOfSegmentAfterBreak = foundSegment.points[foundSegment.points.length - 1];
            return { lat: firstPointOfSegmentAfterBreak.b, lon: firstPointOfSegmentAfterBreak.l };
        }
    }
};

export const getBreakPositions = createSelector(
    getFilteredTrackCompositions,
    getParsedGpxSegments,
    (trackCompositions, parsedSegments): BreakPosition[] => {
        const breakPoints: BreakPosition[] = [];
        trackCompositions.forEach((track) => {
            track.segments.forEach((segment, index) => {
                if (segment.type === BREAK) {
                    const breakPosition = getBreakPosition(track.segments, parsedSegments, index);
                    if (breakPosition) {
                        breakPoints.push({
                            point: breakPosition,
                            breakId: segment.id,
                            trackId: track.id,
                            minutes: segment.minutes,
                            description: segment.description,
                            hasToilet: segment.hasToilet,
                        });
                    }
                }
            });
        });
        return breakPoints;
    }
);
