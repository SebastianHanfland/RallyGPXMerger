import { CalculatedTrack } from '../../types.ts';
import { shiftDateBySeconds } from '../../../utils/dateUtil.ts';
import { updateExtraDelayOnTracks } from '../../../planner/logic/calculate/solver.ts';
import { assembleTrackFromSegments } from '../../../planner/logic/calculate/helper/assembleTrackFromSegments.ts';
import { NodeSpecifications, ParsedGpxSegment, TrackComposition } from '../../../planner/store/types.ts';

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
