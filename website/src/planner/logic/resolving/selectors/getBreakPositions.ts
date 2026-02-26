import { createSelector } from '@reduxjs/toolkit';
import { getFilteredTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { BREAK, ParsedGpxSegment, SEGMENT, TrackElement } from '../../../store/types.ts';
import { getParsedGpxSegments } from '../../../store/segmentData.redux.ts';

export interface BreakPosition {
    point: { lat: number; lon: number };
    breakId: string;
    trackId: string;
    minutes: number;
    description: string;
    hasToilet: boolean;
}

function getSegment(
    possibleTrackElement: TrackElement,
    parsedSegments: ParsedGpxSegment[]
): ParsedGpxSegment | undefined {
    if (possibleTrackElement.type !== SEGMENT) {
        return undefined;
    }
    const foundSegment = parsedSegments.find((segment) => segment.id === possibleTrackElement.id);
    if (foundSegment && foundSegment.points.length > 0) {
        return foundSegment;
    }
    return undefined;
}

const getBreakPosition = (
    segments: TrackElement[],
    parsedSegments: ParsedGpxSegment[],
    index: number
): { lat: number; lon: number } | undefined => {
    for (let searchDistance = 1; searchDistance <= 4; searchDistance++) {
        if (segments.length > index + searchDistance) {
            const foundSegment = getSegment(segments[index + searchDistance], parsedSegments);
            if (foundSegment) {
                const firstPointOfSegmentAfterBreak = foundSegment.points[0];
                return { lat: firstPointOfSegmentAfterBreak.b, lon: firstPointOfSegmentAfterBreak.l };
            }
        }
        if (segments.length > index - searchDistance && index - searchDistance > 0) {
            const foundSegment = getSegment(segments[index + searchDistance], parsedSegments);
            if (foundSegment) {
                const firstPointOfSegmentAfterBreak = foundSegment.points[foundSegment.points.length - 1];
                return { lat: firstPointOfSegmentAfterBreak.b, lon: firstPointOfSegmentAfterBreak.l };
            }
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
