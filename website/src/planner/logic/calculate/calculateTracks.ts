import { updateExtraDelayOnTracks } from './solver.ts';
import { assembleTrackFromSegments } from './helper/assembleTrackFromSegments.ts';
import { ParsedGpxSegment, TrackComposition } from '../../store/types.ts';
import { CalculatedTrack2 } from '../../../common/types.ts';

export const calculateTracks = (
    trackCompositions: TrackComposition[],
    segments: ParsedGpxSegment[],
    participantsDelayInSeconds: number
): CalculatedTrack2[] => {
    const trackWithEndDelay = updateExtraDelayOnTracks(trackCompositions, participantsDelayInSeconds);
    return trackWithEndDelay.map((track) => assembleTrackFromSegments(track, segments));
};
