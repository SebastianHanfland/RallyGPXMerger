import { updateExtraDelayOnTracks } from './solver.ts';
import { assembleTrackFromSegments } from './helper/assembleTrackFromSegments.ts';
import { NodeSpecifications, ParsedGpxSegment, TrackComposition } from '../../store/types.ts';
import { CalculatedTrack2 } from '../../../common/types.ts';

export const calculateTracks = (
    trackCompositions: TrackComposition[],
    segments: ParsedGpxSegment[],
    participantsDelayInSeconds: number,
    nodeSpecifications: NodeSpecifications | undefined
): CalculatedTrack2[] => {
    const trackWithEndDelay = updateExtraDelayOnTracks(
        trackCompositions,
        participantsDelayInSeconds,
        nodeSpecifications
    );
    return trackWithEndDelay.map((track) => assembleTrackFromSegments(track, segments));
};
