import { CalculatedTrack } from '../../types';
import { shiftDateBySeconds } from '../../../utils/dateUtil';
import { updateExtraDelayOnTracks } from './delayCalculation';
import { assembleTrackFromSegments } from './assembleTrackFromSegments';
import { NodeSpecifications, ParsedGpxSegment, TrackComposition } from '../../../planner/store/types';

export const calculateTracks = (
    arrivalDate: string | undefined,
    trackCompositions: TrackComposition[],
    segments: ParsedGpxSegment[],
    participantsDelayInSeconds: number,
    nodeSpecifications: NodeSpecifications | undefined
): CalculatedTrack[] => {
    const trackWithEndDelay = updateExtraDelayOnTracks(
        trackCompositions,
        participantsDelayInSeconds,
        nodeSpecifications
    );
    const calculatedTracks = trackWithEndDelay.map((track) => assembleTrackFromSegments(track, segments));

    const arrivalDateTime = arrivalDate ?? '2025-06-01T10:11:55';
    return calculatedTracks.map((track) => ({
        ...track,
        points: track.points.map((point) => ({ ...point, t: shiftDateBySeconds(arrivalDateTime, point.t) })),
    }));
};
